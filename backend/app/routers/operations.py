from typing import List, Optional, Dict, Any, Tuple
from datetime import datetime, timedelta
import re
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.models import (
    Task, ScheduleItem, Incident, Notification, Wedding, User
)
from backend.app.schemas.schemas import (
    TaskResponse, TaskCreate, ScheduleItemResponse,
    IncidentResponse, NotificationResponse, VendorDelaySimulate
)
from backend.app.routers.auth import get_current_user
from backend.app.dependencies import verify_wedding_access, verify_wedding_planner_or_admin
from backend.app.services.audit import AuditService

router = APIRouter(prefix="/operations", tags=["Operations & Command Centre"])

def parse_time_to_minutes(time_str: str) -> int:
    """Parses '10:00 AM' or '06:30 PM' or '14:30' into total minutes from midnight."""
    cleaned = time_str.strip().upper()
    match = re.match(r"(\d{1,2}):(\d{2})\s*(AM|PM)?", cleaned)
    if not match:
        return 0
    hours, minutes, period = match.groups()
    h = int(hours)
    m = int(minutes)
    if period:
        if period == "PM" and h != 12:
            h += 12
        elif period == "AM" and h == 12:
            h = 0
    return h * 60 + m

def format_minutes_to_time(minutes_val: int) -> str:
    """Converts total minutes from midnight back to 'HH:MM AM/PM'."""
    m_normalized = minutes_val % (24 * 60)
    hours = m_normalized // 60
    minutes = m_normalized % 60
    period = "AM"
    if hours >= 12:
        period = "PM"
        if hours > 12:
            hours -= 12
    elif hours == 0:
        hours = 12
    return f"{hours:02d}:{minutes:02d} {period}"

@router.get("/wedding/{wedding_id}/tasks", response_model=List[TaskResponse])
def get_tasks(
    wedding_id: str,
    wedding: Wedding = Depends(verify_wedding_access),
    db: Session = Depends(get_db)
):
    return db.query(Task).filter(Task.wedding_id == wedding.id).all()

@router.post("/wedding/{wedding_id}/tasks", response_model=TaskResponse)
def create_task(
    wedding_id: str,
    task_in: TaskCreate,
    wedding: Wedding = Depends(verify_wedding_access),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = Task(
        wedding_id=wedding.id,
        function_id=task_in.function_id,
        title=task_in.title,
        description=task_in.description,
        assigned_to_name=task_in.assigned_to_name or "Lead Coordinator",
        priority=task_in.priority or "medium",
        status=task_in.status or "in_progress",
        due_date=task_in.due_date
    )
    db.add(task)
    db.flush()

    AuditService.log_event(
        db=db,
        action="TASK_CREATED",
        entity_name="Task",
        entity_id=task.id,
        user_id=current_user.id,
        details={"title": task.title, "priority": task.priority, "wedding_id": wedding.id}
    )

    db.commit()
    db.refresh(task)
    return task

@router.put("/tasks/{task_id}/status", response_model=TaskResponse)
def update_task_status(
    task_id: str,
    status: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    old_status = task.status
    task.status = status

    AuditService.log_event(
        db=db,
        action="TASK_STATUS_UPDATED",
        entity_name="Task",
        entity_id=task.id,
        user_id=current_user.id,
        details={"from": old_status, "to": status, "task_title": task.title}
    )

    db.commit()
    db.refresh(task)
    return task

@router.get("/wedding/{wedding_id}/schedule", response_model=List[ScheduleItemResponse])
def get_schedule(
    wedding_id: str,
    wedding: Wedding = Depends(verify_wedding_access),
    db: Session = Depends(get_db)
):
    items = db.query(ScheduleItem).filter(
        ScheduleItem.wedding_id == wedding.id
    ).all()
    # Sort chronologically by parsed time
    return sorted(items, key=lambda x: parse_time_to_minutes(x.start_time))

@router.post("/wedding/{wedding_id}/simulate-vendor-delay")
def simulate_vendor_delay(
    wedding_id: str,
    payload: VendorDelaySimulate,
    wedding: Wedding = Depends(verify_wedding_access),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Dynamic Schedule Delay Impact Engine:
    1. Identifies the primary schedule item(s) tied to this vendor.
    2. Dynamically calculates cascading delay across dependent items:
       - Items in same venue area with insufficient buffer.
       - Items explicitly linked in dependent_items_json.
       - Subsequent sequential items.
    3. Computes revised proposed start/end times.
    4. Detects timeline and venue conflicts.
    5. Flags notification for coordinator authorization without auto-mutating official published schedule.
    """
    all_items = db.query(ScheduleItem).filter(
        ScheduleItem.wedding_id == wedding.id
    ).all()

    if not all_items:
        raise HTTPException(status_code=404, detail="No schedule items found for this wedding.")

    # Find the vendor's items or closest matching item
    vendor_items = [
        item for item in all_items
        if item.vendor_name and payload.vendor_name.lower() in item.vendor_name.lower()
    ]

    primary_item = vendor_items[0] if vendor_items else all_items[0]
    delay = payload.delay_minutes

    # Mark the primary item with delay
    primary_item.status = "delayed"
    primary_item.delay_minutes = delay
    primary_item.notes = f"Reported delay: {payload.reason} (+{delay}m)"

    orig_start = parse_time_to_minutes(primary_item.start_time)
    orig_end = parse_time_to_minutes(primary_item.end_time)
    revised_primary_end = orig_end + delay

    # Dynamic cascading calculation
    downstream_impacts = []
    proposed_revisions = []

    # Sort remaining items chronologically
    sorted_items = sorted(all_items, key=lambda x: parse_time_to_minutes(x.start_time))

    for item in sorted_items:
        if item.id == primary_item.id:
            proposed_revisions.append({
                "item_id": item.id,
                "title": item.title,
                "venue_area": item.venue_area,
                "current_time": f"{item.start_time} - {item.end_time}",
                "proposed_time": f"{item.start_time} - {format_minutes_to_time(revised_primary_end)}",
                "shift_minutes": delay,
                "is_primary_delay": True
            })
            continue

        item_start = parse_time_to_minutes(item.start_time)
        item_end = parse_time_to_minutes(item.end_time)
        duration = item_end - item_start if item_end >= item_start else 60

        is_dependent = (
            (primary_item.id in (item.dependent_items_json or [])) or
            (primary_item.title in (item.dependent_items_json or [])) or
            (item.venue_area == primary_item.venue_area and item_start < revised_primary_end) or
            (item_start >= orig_start and item_start < revised_primary_end + 15)
        )

        if is_dependent:
            buffer_available = max(0, item_start - orig_end)
            cascade_shift = max(0, delay - buffer_available)

            if cascade_shift > 0:
                new_start = item_start + cascade_shift
                new_end = new_start + duration
                downstream_impacts.append({
                    "title": item.title,
                    "venue_area": item.venue_area,
                    "delay_minutes": cascade_shift,
                    "reason": f"Insufficient venue buffer ({buffer_available}m buffer vs {delay}m transit delay)"
                })
                proposed_revisions.append({
                    "item_id": item.id,
                    "title": item.title,
                    "venue_area": item.venue_area,
                    "current_time": f"{item.start_time} - {item.end_time}",
                    "proposed_time": f"{format_minutes_to_time(new_start)} - {format_minutes_to_time(new_end)}",
                    "shift_minutes": cascade_shift,
                    "is_primary_delay": False
                })

    # High-priority notification
    notification = Notification(
        user_id=current_user.id,
        wedding_id=wedding.id,
        title=f"LIVE OPERATIONS ALERT: {payload.vendor_name} (+{delay}m)",
        message=f"{payload.reason}. {len(downstream_impacts)} downstream event(s) affected. Proposed revised schedule awaiting coordinator sign-off.",
        type="delay"
    )
    db.add(notification)

    # Log Incident
    incident = Incident(
        wedding_id=wedding.id,
        title=f"Transit Delay: {payload.vendor_name} (+{delay} mins)",
        description=f"{payload.reason}. Dynamic engine calculated ripple impact on {len(downstream_impacts)} dependent ceremony events.",
        severity="high" if delay >= 30 else "medium",
        reported_by=current_user.full_name,
        status="open"
    )
    db.add(incident)

    AuditService.log_event(
        db=db,
        action="SCHEDULE_DELAY_SIMULATED",
        entity_name="ScheduleItem",
        entity_id=primary_item.id,
        user_id=current_user.id,
        details={
            "vendor_name": payload.vendor_name,
            "delay_minutes": delay,
            "impacted_count": len(downstream_impacts)
        }
    )

    db.commit()

    return {
        "status": "warning",
        "vendor_delayed": payload.vendor_name,
        "delay_recorded_minutes": delay,
        "reason": payload.reason,
        "primary_item_affected": primary_item.title,
        "dependent_downstream_events": [d["title"] for d in downstream_impacts],
        "detailed_impacts": downstream_impacts,
        "proposed_revisions": proposed_revisions,
        "mitigation_actions": [
            f"Extend cocktail hour or cultural performance in {primary_item.venue_area} by {delay} minutes",
            "Hold banquet plating until 15 minutes before revised guest seating",
            "Dispatch hospitality lead to guide guests through palace gardens during buffer extension"
        ],
        "requires_authorization": True,
        "approval_action": f"/api/operations/wedding/{wedding.id}/publish-revised-schedule"
    }

@router.post("/wedding/{wedding_id}/publish-revised-schedule")
def publish_revised_schedule(
    wedding_id: str,
    wedding: Wedding = Depends(verify_wedding_planner_or_admin),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Formally authorizes and publishes the revised schedule:
    Shifts the delayed items into official time slots, clears delay flags, and updates run-of-show version.
    """
    delayed_items = db.query(ScheduleItem).filter(
        ScheduleItem.wedding_id == wedding.id,
        ScheduleItem.status == "delayed"
    ).all()

    revisions_count = 0
    for item in delayed_items:
        if item.delay_minutes > 0:
            start_mins = parse_time_to_minutes(item.start_time)
            end_mins = parse_time_to_minutes(item.end_time)
            duration = end_mins - start_mins if end_mins >= start_mins else 60
            new_start = start_mins + item.delay_minutes
            new_end = new_start + duration
            item.start_time = format_minutes_to_time(new_start)
            item.end_time = format_minutes_to_time(new_end)
            item.status = "scheduled"
            item.notes = f"Revised schedule formally authorized by {current_user.full_name} ({current_user.role})"
            item.delay_minutes = 0
            revisions_count += 1

    notification = Notification(
        user_id=current_user.id,
        wedding_id=wedding.id,
        title="Official Schedule Revised & Published",
        message=f"{revisions_count} ceremony item(s) formally rescheduled. On-site coordinators and vendors updated.",
        type="general"
    )
    db.add(notification)

    # Resolve open delay incidents
    open_incidents = db.query(Incident).filter(
        Incident.wedding_id == wedding.id,
        Incident.status == "open"
    ).all()
    for inc in open_incidents:
        if "delay" in inc.title.lower():
            inc.status = "resolved"
            inc.resolution_notes = f"Resolved via authorized schedule publication by {current_user.full_name}."

    AuditService.log_event(
        db=db,
        action="SCHEDULE_REVISION_PUBLISHED",
        entity_name="Wedding",
        entity_id=wedding.id,
        user_id=current_user.id,
        details={"revisions_count": revisions_count}
    )

    db.commit()
    return {
        "message": f"Successfully authorized and published revised run of show ({revisions_count} items updated).",
        "published_by": current_user.full_name,
        "items_updated": revisions_count
    }

@router.get("/wedding/{wedding_id}/incidents", response_model=List[IncidentResponse])
def get_incidents(
    wedding_id: str,
    wedding: Wedding = Depends(verify_wedding_access),
    db: Session = Depends(get_db)
):
    return db.query(Incident).filter(Incident.wedding_id == wedding.id).all()

@router.get("/notifications", response_model=List[NotificationResponse])
def get_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).all()
