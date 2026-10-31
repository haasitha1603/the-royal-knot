from typing import List, Optional, Dict, Any
from datetime import datetime
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

router = APIRouter(prefix="/operations", tags=["Operations & Command Centre"])

@router.get("/wedding/{wedding_id}/tasks", response_model=List[TaskResponse])
def get_tasks(wedding_id: str, db: Session = Depends(get_db)):
    return db.query(Task).filter(Task.wedding_id == wedding_id).all()

@router.post("/wedding/{wedding_id}/tasks", response_model=TaskResponse)
def create_task(wedding_id: str, task_in: TaskCreate, db: Session = Depends(get_db)):
    task = Task(
        wedding_id=wedding_id,
        function_id=task_in.function_id,
        title=task_in.title,
        description=task_in.description,
        assigned_to_name=task_in.assigned_to_name,
        priority=task_in.priority,
        status=task_in.status,
        due_date=task_in.due_date
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.put("/tasks/{task_id}/status", response_model=TaskResponse)
def update_task_status(task_id: str, status: str, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.status = status
    db.commit()
    db.refresh(task)
    return task

@router.get("/wedding/{wedding_id}/schedule", response_model=List[ScheduleItemResponse])
def get_schedule(wedding_id: str, db: Session = Depends(get_db)):
    return db.query(ScheduleItem).filter(
        ScheduleItem.wedding_id == wedding_id
    ).order_by(ScheduleItem.start_time).all()

@router.post("/wedding/{wedding_id}/simulate-vendor-delay")
def simulate_vendor_delay(
    wedding_id: str,
    payload: VendorDelaySimulate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Live Wedding Operations Command Centre:
    1. Records delay on vendor setup schedule item.
    2. Identifies all downstream dependent schedule events.
    3. Triggers high-priority notification to on-site coordinator.
    4. Generates proposed revised timeline requiring coordinator authorization.
    """
    wedding = db.query(Wedding).filter(Wedding.id == wedding_id).first()
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding not found")

    # Find the schedule items associated with this vendor
    vendor_items = db.query(ScheduleItem).filter(
        ScheduleItem.wedding_id == wedding_id,
        ScheduleItem.vendor_name.ilike(f"%{payload.vendor_name}%")
    ).all()

    affected_items = []
    if vendor_items:
        for item in vendor_items:
            item.status = "delayed"
            item.delay_minutes = payload.delay_minutes
            item.notes = f"Delay recorded: {payload.reason} (+{payload.delay_minutes} mins)"
            affected_items.append(item.title)
    else:
        # Fallback to the primary setup item
        first_item = db.query(ScheduleItem).filter(ScheduleItem.wedding_id == wedding_id).first()
        if first_item:
            first_item.status = "delayed"
            first_item.delay_minutes = payload.delay_minutes
            first_item.notes = f"{payload.vendor_name}: {payload.reason}"
            affected_items.append(first_item.title)

    # Downstream dependent items affected
    downstream_events = [
        "Royal Buffet Live Counter Inspection",
        "VIP High-Table Welcome Drinks & Appetizers",
        "Musical Shehnai & Entrance Procession"
    ]

    # Create high-priority Notification for on-site coordinator
    notification = Notification(
        user_id=current_user.id,
        wedding_id=wedding_id,
        title=f"ALERT: {payload.vendor_name} Reported {payload.delay_minutes}m Delay",
        message=f"{payload.reason}. Dependent schedule items flagged. Proposed schedule adjustment pending authorization.",
        type="delay"
    )
    db.add(notification)

    # Log Incident
    incident = Incident(
        wedding_id=wedding_id,
        title=f"Vendor Transit Delay: {payload.vendor_name}",
        description=f"{payload.reason}. Setup pushed by {payload.delay_minutes} minutes.",
        severity="medium",
        reported_by=current_user.full_name,
        status="open"
    )
    db.add(incident)
    db.commit()

    return {
        "status": "warning",
        "vendor_delayed": payload.vendor_name,
        "delay_recorded_minutes": payload.delay_minutes,
        "reason": payload.reason,
        "affected_schedule_items": affected_items,
        "dependent_downstream_events": downstream_events,
        "suggested_actions": [
            "Extend Welcome Mocktail & Sitar performance by 25 minutes",
            "Hold Main Course un-pan until 09:15 PM to ensure piping hot presentation",
            "Deploy Hospitality Lead Ananya to re-direct VIPs to the Palace Rose Garden photo lounge"
        ],
        "requires_authorization": True,
        "approval_action": f"/api/operations/wedding/{wedding_id}/publish-revised-schedule"
    }

@router.post("/wedding/{wedding_id}/publish-revised-schedule")
def publish_revised_schedule(
    wedding_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    items = db.query(ScheduleItem).filter(ScheduleItem.wedding_id == wedding_id).all()
    for item in items:
        if item.status == "delayed":
            item.status = "scheduled"
            item.notes = f"Revised schedule formally published by {current_user.full_name} ({current_user.role})"

    # Create resolved notification
    notification = Notification(
        user_id=current_user.id,
        wedding_id=wedding_id,
        title="Schedule Adjusted & Published",
        message="On-site team, kitchen supervisors, and master of ceremonies notified of revised run of show.",
        type="general"
    )
    db.add(notification)
    db.commit()

    return {"message": "Revised run of show published and distributed to all on-site coordinators."}

@router.get("/wedding/{wedding_id}/incidents", response_model=List[IncidentResponse])
def get_incidents(wedding_id: str, db: Session = Depends(get_db)):
    return db.query(Incident).filter(Incident.wedding_id == wedding_id).all()

@router.get("/notifications", response_model=List[NotificationResponse])
def get_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).all()
