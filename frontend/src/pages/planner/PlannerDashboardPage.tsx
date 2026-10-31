import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Wedding, Task, BudgetChangeRequest, Incident } from '../../types';
import { RoyalLoader } from '../../components/ui/RoyalLoader';
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  ShieldCheck,
  Check,
  X,
  Plus,
  ArrowRight,
  TrendingUp,
  FolderKanban
} from 'lucide-react';

export const PlannerDashboardPage: React.FC = () => {
  const { user, activeWeddingId } = useAuth();
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [changeRequests, setChangeRequests] = useState<BudgetChangeRequest[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Ananya Sharma');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');

  const loadPlannerData = async () => {
    try {
      const [wData, tData, crData, iData] = await Promise.all([
        api.getWedding(activeWeddingId),
        api.getTasks(activeWeddingId),
        api.getBudgetChangeRequests(activeWeddingId),
        api.getIncidents(activeWeddingId)
      ]);
      setWedding(wData);
      setTasks(tData);
      setChangeRequests(crData);
      setIncidents(iData);
    } catch (err) {
      console.error('Error fetching planner data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlannerData();
  }, [activeWeddingId]);

  const handleApproveRequest = async (requestId: string) => {
    try {
      await api.approveBudgetChangeRequest(requestId);
      await loadPlannerData();
      alert("Budget Change Request formally approved by Senior Planner. Wedding budget and guest allocations updated.");
    } catch (err) {
      console.error('Error approving request:', err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      await api.createTask(activeWeddingId, {
        title: newTaskTitle,
        assigned_to_name: newTaskAssignee,
        priority: newTaskPriority,
        status: 'in_progress',
        due_date: '2026-11-15'
      });
      setNewTaskTitle('');
      await loadPlannerData();
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <RoyalLoader message="Accessing planner command console and client portfolios..." />
      </div>
    );
  }

  const pendingRequests = changeRequests.filter(r => r.status === 'pending');

  return (
    <div className="bg-ivory min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="rounded-3xl bg-white border border-gold-300 p-6 sm:p-8 shadow-royal flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-0.5 rounded-full border border-indigo-200">
                Senior Planner Console
              </span>
              <span className="text-xs text-charcoal-400">Jaipur & Destination Circuit</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
              Ananya Sharma (Bespoke Royal Weddings)
            </h1>
            <p className="text-xs text-charcoal-500 mt-1">
              Active Assignment: {wedding?.couple_names} • Rambagh Palace Jaipur • 400 Guests
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-ivory-50 px-4 py-2 rounded-xl border border-gold-200 text-center">
              <span className="font-serif text-2xl font-bold text-charcoal-800 block">{tasks.length}</span>
              <span className="text-[10px] uppercase tracking-wider text-charcoal-500">Active Tasks</span>
            </div>
            <div className="bg-ivory-50 px-4 py-2 rounded-xl border border-gold-200 text-center">
              <span className="font-serif text-2xl font-bold text-amber-800 block">{pendingRequests.length}</span>
              <span className="text-[10px] uppercase tracking-wider text-charcoal-500">Approvals Due</span>
            </div>
          </div>
        </div>

        {/* PENDING APPROVALS QUEUE (BUDGET CHANGE REQUESTS PER SECTION 5.9 & 5.17) */}
        <div className="bg-white rounded-3xl border border-gold-300 p-6 sm:p-8 shadow-royal">
          <div className="flex items-center justify-between pb-4 border-b border-gold-200 mb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-charcoal-800">
                Pending Governance & Change Approvals
              </h2>
              <p className="text-xs text-charcoal-500">
                Authorized approvals for scope expansions, guest count variations, and budget modifications.
              </p>
            </div>
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {pendingRequests.length} Pending Actions
            </span>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center bg-ivory-50 rounded-2xl border border-gold-200 text-xs text-charcoal-500">
              No change requests currently awaiting planner approval. All wedding boundaries are synchronized.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl bg-amber-50/70 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-amber-950 font-serif text-base">
                        Budget Escalation: +₹{req.estimated_cost_impact.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                        +{req.additional_guests} Guests Addition
                      </span>
                    </div>
                    <p className="text-charcoal-700 leading-relaxed max-w-xl">
                      Reason: {req.reason}
                    </p>
                    <p className="text-[11px] text-charcoal-400 mt-1">
                      Previous Budget: ₹{req.previous_budget.toLocaleString('en-IN')} ➔ Proposed New Budget: ₹{req.new_budget.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleApproveRequest(req.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold uppercase tracking-wider text-xs shadow-sm transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve & Apply</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TASK MANAGEMENT KANBAN / LIST (Section 5.12) */}
        <div className="bg-white rounded-3xl border border-gold-300 p-6 sm:p-8 shadow-royal">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gold-200 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-burgundy-700" />
                <h2 className="font-serif text-2xl font-bold text-charcoal-800">
                  Operations Task Matrix
                </h2>
              </div>
              <p className="text-xs text-charcoal-500">
                Track deliverables across Haldi, Sangeet, Nuptials, and Reception.
              </p>
            </div>

            {/* Quick Add Task */}
            <form onSubmit={handleCreateTask} className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="New operational task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 w-full sm:w-64"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-semibold text-xs uppercase"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column: High & Critical */}
            <div className="bg-ivory-50 rounded-2xl p-4 border border-gold-200">
              <span className="text-xs font-bold uppercase tracking-wider text-burgundy-900 block mb-3 pb-1 border-b border-gold-200">
                Critical & High Priority
              </span>
              <div className="space-y-3">
                {tasks.filter(t => t.priority === 'critical' || t.priority === 'high').map((t) => (
                  <div key={t.id} className="p-3 bg-white rounded-xl border border-gold-200 shadow-sm text-xs space-y-1">
                    <span className="font-semibold text-charcoal-800 block">{t.title}</span>
                    <div className="flex justify-between text-[11px] text-charcoal-400">
                      <span>Assigned: {t.assigned_to_name}</span>
                      <span className="font-bold uppercase text-burgundy-700">{t.priority}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column: Medium */}
            <div className="bg-ivory-50 rounded-2xl p-4 border border-gold-200">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-900 block mb-3 pb-1 border-b border-gold-200">
                Medium Priority
              </span>
              <div className="space-y-3">
                {tasks.filter(t => t.priority === 'medium').map((t) => (
                  <div key={t.id} className="p-3 bg-white rounded-xl border border-gold-200 shadow-sm text-xs space-y-1">
                    <span className="font-semibold text-charcoal-800 block">{t.title}</span>
                    <div className="flex justify-between text-[11px] text-charcoal-400">
                      <span>Assigned: {t.assigned_to_name}</span>
                      <span className="capitalize">{t.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column: Completed */}
            <div className="bg-ivory-50 rounded-2xl p-4 border border-gold-200">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block mb-3 pb-1 border-b border-gold-200">
                Completed Deliverables
              </span>
              <div className="space-y-3">
                {tasks.filter(t => t.status === 'completed').map((t) => (
                  <div key={t.id} className="p-3 bg-white rounded-xl border border-emerald-200 shadow-sm text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{t.title}</span>
                    </div>
                    <span className="text-[11px] text-charcoal-400 block">Verified by {t.assigned_to_name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
