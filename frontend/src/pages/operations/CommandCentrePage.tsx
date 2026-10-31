import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ScheduleItem, Incident, Notification, Task } from '../../types';
import { RoyalLoader } from '../../components/ui/RoyalLoader';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  UserCheck,
  Send,
  Bot,
  RefreshCw,
  Bell,
  ArrowRight,
  ShieldAlert,
  Flame,
  Radio
} from 'lucide-react';

export const CommandCentrePage: React.FC = () => {
  const { user, activeWeddingId } = useAuth();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Late Vendor Simulation State (Section 5.13 & 18)
  const [delayMinutes, setDelayMinutes] = useState(30);
  const [delayResult, setDelayResult] = useState<any | null>(null);
  const [isSimulatingDelay, setIsSimulatingDelay] = useState(false);
  const [isPublishingRevised, setIsPublishingRevised] = useState(false);

  // AI Copilot State (Section 5.19)
  const [aiQuery, setAiQuery] = useState('');
  const [aiChat, setAiChat] = useState<Array<{ sender: 'user' | 'copilot'; text: string; dataPoints?: any }>>([
    {
      sender: 'copilot',
      text: "Namaste. I am your grounded Royal Knot Wedding Copilot. I have real-time visibility into the Jaipur 400-guest schedule, active vendor arrival logs, budget variance, and staged payments. How may I assist your coordination team?"
    }
  ]);
  const [isAskingAI, setIsAskingAI] = useState(false);

  const loadData = async () => {
    try {
      const [sData, iData, tData, nData] = await Promise.all([
        api.getSchedule(activeWeddingId),
        api.getIncidents(activeWeddingId),
        api.getTasks(activeWeddingId),
        api.getNotifications()
      ]);
      setSchedule(sData);
      setIncidents(iData);
      setTasks(tData);
      setNotifications(nData);
    } catch (err) {
      console.error('Error fetching command centre data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeWeddingId]);

  // Execute Late Vendor Delay Simulation (+30 mins on Royal Mewar Caterers)
  const handleSimulateVendorDelay = async () => {
    setIsSimulatingDelay(true);
    try {
      const res = await api.simulateVendorDelay(activeWeddingId, {
        delay_minutes: delayMinutes,
        vendor_name: 'Royal Mewar Caterers',
        reason: 'Transit delay: Highway traffic congestion near Manoharpur toll plaza'
      });
      setDelayResult(res);
      await loadData();
    } catch (err) {
      console.error('Error simulating vendor delay:', err);
    } finally {
      setIsSimulatingDelay(false);
    }
  };

  // Publish Revised Schedule (Requires authorized coordinator approval per Section 5.13)
  const handlePublishRevised = async () => {
    setIsPublishingRevised(true);
    try {
      await api.publishRevisedSchedule(activeWeddingId);
      setDelayResult(null);
      await loadData();
      alert("Revised Run of Show formally published and synchronized to all on-site tablets and kitchen supervisors.");
    } catch (err) {
      console.error('Error publishing revised schedule:', err);
    } finally {
      setIsPublishingRevised(false);
    }
  };

  // Ask AI Copilot
  const handleSendAIQuery = async (queryText?: string) => {
    const prompt = queryText || aiQuery;
    if (!prompt.trim()) return;

    setAiChat(prev => [...prev, { sender: 'user', text: prompt }]);
    setAiQuery('');
    setIsAskingAI(true);

    try {
      const response = await api.queryAI(activeWeddingId, prompt);
      setAiChat(prev => [
        ...prev,
        {
          sender: 'copilot',
          text: response.answer,
          dataPoints: response.data_points
        }
      ]);
    } catch (err) {
      setAiChat(prev => [
        ...prev,
        {
          sender: 'copilot',
          text: "I encountered an issue querying the active operational records. Please ensure backend services are connected."
        }
      ]);
    } finally {
      setIsAskingAI(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <RoyalLoader message="Connecting to Live Wedding Operations Command Centre..." size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Bar */}
        <div className="rounded-3xl bg-white border border-gold-300 p-6 sm:p-8 shadow-royal flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-burgundy-700 bg-burgundy-50 px-3 py-0.5 rounded-full border border-burgundy-200">
                <Radio className="w-3.5 h-3.5 text-burgundy-700 animate-pulse" />
                Live Wedding-Day Operations Command
              </span>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Run of Show Synced
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
              Rambagh Palace Operational Console
            </h1>
            <p className="text-xs text-charcoal-500 mt-1">
              Aarav & Meera Wedding • Sunset Pavilion & Grand Banqueting Lawn • 400 Guests
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gold-300 bg-ivory-100 hover:bg-gold-50 text-xs font-semibold text-charcoal-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gold-600" />
              <span>Refresh Feed</span>
            </button>
            <div className="bg-ivory-100 px-4 py-2 rounded-xl border border-gold-200 text-xs text-right">
              <span className="text-[10px] uppercase tracking-wider text-charcoal-400 block">On-Site Coordinator</span>
              <span className="font-bold text-charcoal-800">Ananya Sharma (Lead)</span>
            </div>
          </div>
        </div>

        {/* LATE VENDOR DELAY SIMULATION BANNER (SECTION 5.13 & 18) */}
        <div className="rounded-3xl bg-gradient-to-r from-cream-50 via-white to-ivory-50 border-2 border-gold-400 p-6 sm:p-8 shadow-royal">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-4 border-b border-gold-200 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-burgundy-700" />
                <h3 className="font-serif text-2xl font-bold text-charcoal-800">
                  Late Vendor Simulation & Cascade Resolution
                </h3>
              </div>
              <p className="text-xs text-charcoal-500 mt-1">
                Demonstrates Section 5.13: simulate a 30-minute delay for Royal Mewar Caterers, cascade downstream dependencies, and publish an authorized revised timeline.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                disabled={isSimulatingDelay}
                onClick={handleSimulateVendorDelay}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm disabled:opacity-50"
              >
                <AlertTriangle className="w-4 h-4 text-gold-300" />
                <span>Simulate 30m Catering Delay</span>
              </button>
            </div>
          </div>

          {/* If delay is active, display the cascade and required authorization */}
          {delayResult && (
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-300 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-amber-900">
                      INCIDENT ALERT: {delayResult.vendor_delayed} (+{delayResult.delay_recorded_minutes} Mins)
                    </h4>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Reason: {delayResult.reason}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-3 py-1 rounded-full">
                  Buffer Cascaded
                </span>
              </div>

              {/* Downstream affected events */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white rounded-xl p-3.5 border border-amber-200">
                  <span className="font-bold text-charcoal-800 block mb-1">Impacted Schedule Events:</span>
                  <ul className="space-y-1 text-charcoal-600">
                    {delayResult.dependent_downstream_events?.map((ev: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5 text-amber-950 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                        <span>{ev} (Pushed by 30 mins)</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-3.5 border border-amber-200">
                  <span className="font-bold text-charcoal-800 block mb-1">Coordinator Mitigation Plan:</span>
                  <ul className="space-y-1 text-charcoal-600">
                    {delayResult.suggested_actions?.map((act: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5 text-charcoal-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Publish Revised Schedule Approval */}
              <div className="pt-3 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-[11px] text-amber-900">
                  <strong>Section 5.13 Rule:</strong> Automated changes cannot modify the approved schedule without authorized sign-off.
                </p>
                <button
                  type="button"
                  disabled={isPublishingRevised}
                  onClick={handlePublishRevised}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs uppercase tracking-wider shadow-sm transition-all"
                >
                  {isPublishingRevised ? 'Distributing Run of Show...' : 'Authorize & Publish Revised Run of Show'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SECTION B: MINUTE-BY-MINUTE SCHEDULE & AI WEDDING COPILOT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Minute-by-Minute Run of Show Timeline */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gold-300 p-6 sm:p-8 shadow-royal">
            <div className="flex items-center justify-between pb-4 border-b border-gold-200 mb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-charcoal-800">
                  Minute-by-Minute Run of Show
                </h2>
                <p className="text-xs text-charcoal-500">
                  Wedding Day Schedule • Sunset Pheras & Imperial Feast
                </p>
              </div>
              <span className="text-xs font-semibold text-charcoal-600 bg-ivory-100 px-3 py-1 rounded-full border border-gold-200">
                {schedule.length} Timed Milestones
              </span>
            </div>

            <div className="space-y-4">
              {schedule.map((item) => {
                const isDelayed = item.status === 'delayed';
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isDelayed
                        ? 'border-2 border-amber-400 bg-amber-50/70 shadow-sm'
                        : 'border-gold-200 bg-ivory-50/50 hover:bg-ivory-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                          isDelayed
                            ? 'bg-amber-200 text-amber-900 border border-amber-400'
                            : 'bg-white text-charcoal-800 border border-gold-300'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-serif text-base font-bold text-charcoal-900">
                            {item.title}
                          </span>
                          {isDelayed ? (
                            <span className="text-[10px] font-bold uppercase text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                              Delayed +{item.delay_minutes}m
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                              Scheduled
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-charcoal-500">
                          {item.start_time} – {item.end_time} • Area: <span className="font-medium text-charcoal-700">{item.venue_area}</span>
                        </p>

                        {item.vendor_name && (
                          <p className="text-[11px] text-burgundy-800 font-medium mt-1">
                            Vendor: {item.vendor_name} • Coordinator: {item.responsible_coordinator}
                          </p>
                        )}

                        {item.notes && (
                          <p className="text-[11px] text-charcoal-500 italic mt-0.5">
                            Note: {item.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <span className="text-[10px] uppercase tracking-wider text-charcoal-400 block">Lead Coordinator</span>
                      <span className="text-xs font-semibold text-charcoal-700">{item.responsible_coordinator}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Wedding Copilot (Section 5.19 Grounded Assistant) */}
          <div className="bg-white rounded-3xl border border-gold-300 p-6 shadow-royal flex flex-col justify-between h-[650px]">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-gold-200 mb-4">
                <div className="w-8 h-8 rounded-full bg-gold-100 border border-gold-300 flex items-center justify-center text-gold-700">
                  <Bot className="w-4 h-4 text-gold-700" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-charcoal-800">
                    AI Wedding Copilot
                  </h3>
                  <p className="text-[11px] text-charcoal-500">Grounded in active wedding records</p>
                </div>
              </div>

              {/* Sample Prompt Shortcuts */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block">
                  Quick Query Prompts
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSendAIQuery("Which vendors are delayed or have not arrived?")}
                    className="text-[10px] px-2.5 py-1 rounded-md bg-ivory-100 hover:bg-gold-50 border border-gold-200 text-charcoal-700"
                  >
                    Which vendors are delayed?
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendAIQuery("Which payments are overdue or pending?")}
                    className="text-[10px] px-2.5 py-1 rounded-md bg-ivory-100 hover:bg-gold-50 border border-gold-200 text-charcoal-700"
                  >
                    Pending milestone payments?
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendAIQuery("Which catering quotation offers the best value?")}
                    className="text-[10px] px-2.5 py-1 rounded-md bg-ivory-100 hover:bg-gold-50 border border-gold-200 text-charcoal-700"
                  >
                    Best value catering quote?
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendAIQuery("What happens if 60 more guests attend?")}
                    className="text-[10px] px-2.5 py-1 rounded-md bg-ivory-100 hover:bg-gold-50 border border-gold-200 text-charcoal-700"
                  >
                    Cost of 60 extra guests?
                  </button>
                </div>
              </div>

              {/* Chat Log Window */}
              <div className="h-72 overflow-y-auto space-y-3 p-3 bg-ivory-50/70 rounded-2xl border border-gold-200 text-xs">
                {aiChat.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] p-3 rounded-2xl ${
                        msg.sender === 'user'
                          ? 'bg-burgundy-700 text-white rounded-tr-none'
                          : 'bg-white text-charcoal-800 border border-gold-200 rounded-tl-none shadow-sm'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isAskingAI && (
                  <div className="text-[11px] text-charcoal-400 italic">
                    Copilot inspecting wedding database...
                  </div>
                )}
              </div>
            </div>

            {/* Prompt Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendAIQuery();
              }}
              className="mt-4 pt-3 border-t border-gold-100"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask about schedule, budget impact, or vendors..."
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-gold-300 bg-white text-charcoal-800 text-xs focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
                <button
                  type="submit"
                  disabled={isAskingAI || !aiQuery.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-burgundy-700 text-white hover:bg-burgundy-800 transition-colors disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[10px] text-charcoal-400 block mt-1">
                Grounded rule: AI cannot autonomously approve budget changes or contracts.
              </span>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
