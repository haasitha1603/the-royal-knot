import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Wedding,
  BudgetOverview,
  Quotation,
  PaymentRecord,
  Task,
  Notification
} from '../../types';
import { RoyalLoader } from '../../components/ui/RoyalLoader';
import { SimulatedPaymentModal } from '../../components/ui/SimulatedPaymentModal';
import { SignaturePad } from '../../components/ui/SignaturePad';
import {
  Heart,
  Calendar,
  Users,
  Coins,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  AlertTriangle,
  Receipt,
  RotateCcw,
  ChefHat,
  Info
} from 'lucide-react';

export const CoupleDashboardPage: React.FC = () => {
  const { user, activeWeddingId } = useAuth();
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [budgetOverview, setBudgetOverview] = useState<BudgetOverview | null>(null);
  const [cateringComparison, setCateringComparison] = useState<any | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Guest Impact Simulator State
  const BASE_GUESTS = 400;
  const [extraGuestCount, setExtraGuestCount] = useState(60);
  const [applyToReception, setApplyToReception] = useState(true);
  const [applyToPheras, setApplyToPheras] = useState(true);
  const [applyToSangeet, setApplyToSangeet] = useState(false);
  const [applyToHaldi, setApplyToHaldi] = useState(false);
  const [simulatedImpact, setSimulatedImpact] = useState<any | null>(null);
  const [changeRequestStatus, setChangeRequestStatus] = useState<string | null>(null);
  const [showApplyConfirmModal, setShowApplyConfirmModal] = useState(false);

  // Active Modals
  const [activePaymentForModal, setActivePaymentForModal] = useState<PaymentRecord | null>(null);
  const [showContractSigning, setShowContractSigning] = useState(false);
  const [contractSignedTime, setContractSignedTime] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      try {
        const [wData, bData, cData, pData, tData, nData] = await Promise.all([
          api.getWedding(activeWeddingId),
          api.getBudgetOverview(activeWeddingId),
          api.compareCateringQuotations(activeWeddingId),
          api.getPayments(activeWeddingId),
          api.getTasks(activeWeddingId),
          api.getNotifications()
        ]);
        setWedding(wData);
        setBudgetOverview(bData);
        setCateringComparison(cData);
        setPayments(pData);
        setTasks(tData);
        setNotifications(nData);
      } catch (err) {
        console.error('Error loading couple dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, [activeWeddingId]);

  // Real-time calculation effect whenever extraGuestCount or functions change
  useEffect(() => {
    // Number of selected functions for catering impact
    const funcCount = [applyToReception, applyToPheras, applyToSangeet, applyToHaldi].filter(Boolean).length || 1;
    const pricePerPlate = 2800;
    const cateringSubtotal = extraGuestCount * pricePerPlate * (funcCount >= 2 ? 1.5 : 1.0);
    const cateringGst = cateringSubtotal * 0.18;
    const seatingTableware = extraGuestCount * 650;
    const favorsAmenities = extraGuestCount * 500;
    const totalImpact = cateringSubtotal + cateringGst + seatingTableware + favorsAmenities;

    setSimulatedImpact({
      additional_guests: extraGuestCount,
      new_total_guests: (wedding?.estimated_guests || BASE_GUESTS) + extraGuestCount,
      cost_breakdown: {
        catering_subtotal: cateringSubtotal,
        catering_gst_18pct: cateringGst,
        seating_and_tableware: seatingTableware,
        guest_favors_and_amenities: favorsAmenities,
        total_estimated_impact: totalImpact
      },
      capacity_warning: ((wedding?.estimated_guests || BASE_GUESTS) + extraGuestCount) > 420
    });
  }, [extraGuestCount, applyToReception, applyToPheras, applyToSangeet, applyToHaldi, wedding?.estimated_guests]);

  // Reset Simulator
  const handleResetSimulator = () => {
    setExtraGuestCount(60);
    setApplyToReception(true);
    setApplyToPheras(true);
    setApplyToSangeet(false);
    setApplyToHaldi(false);
  };

  // Submit formal budget change request for extra guests
  const handleExecuteChangeRequest = async () => {
    setShowApplyConfirmModal(false);
    try {
      const res = await api.createBudgetChangeRequest(activeWeddingId, {
        additional_guests: extraGuestCount,
        reason: `Family addition of ${extraGuestCount} guests for Jaipur Reception & Pheras.`
      });
      setChangeRequestStatus('pending');
      alert(`Formal Budget Change Request #${res.id.slice(0, 8)} submitted. Awaiting authorized Planner/Owner sign-off.`);
    } catch (err) {
      console.error('Error submitting change request:', err);
    }
  };

  // Authorize / Approve budget change directly
  const handleApproveBudgetChange = async () => {
    try {
      const requests = await api.getBudgetChangeRequests(activeWeddingId);
      const pending = requests.find(r => r.status === 'pending');
      if (pending) {
        await api.approveBudgetChangeRequest(pending.id);
        setChangeRequestStatus('approved');
        const refreshedBudget = await api.getBudgetOverview(activeWeddingId);
        const refreshedWedding = await api.getWedding(activeWeddingId);
        setBudgetOverview(refreshedBudget);
        setWedding(refreshedWedding);
        alert(`Budget Change Request approved! Wedding guest count updated to ${refreshedWedding.estimated_guests} and budget updated to ₹${refreshedWedding.total_budget.toLocaleString('en-IN')}.`);
      }
    } catch (err) {
      console.error('Error approving change request:', err);
    }
  };

  // Accept a catering quote
  const handleAcceptQuote = async (quoteId: string) => {
    try {
      await api.acceptQuotation(quoteId);
      const refreshedComp = await api.compareCateringQuotations(activeWeddingId);
      setCateringComparison(refreshedComp);
      alert("Quotation accepted! Contract and budget category synchronized.");
    } catch (err) {
      console.error("Error accepting quote:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <RoyalLoader message="Synthesizing your royal wedding portal and financial ledger..." size="lg" />
      </div>
    );
  }

  // Calculate Days Remaining
  const targetDate = new Date(wedding?.wedding_date || '2026-11-21');
  const today = new Date();
  const diffDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

  return (
    <div className="bg-ivory min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Banner: Wedding Overview & Countdown */}
        <div className="rounded-3xl bg-white border border-gold-300 p-6 sm:p-8 shadow-royal flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-burgundy-700 bg-burgundy-50 px-3 py-0.5 rounded-full border border-burgundy-200">
                Active Celebration Portal
              </span>
              <span className="text-xs text-charcoal-400">Jaipur, Rajasthan</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
              {wedding?.couple_names || 'Aarav Singhania & Meera Kapoor'}
            </h1>
            <p className="text-xs text-charcoal-500 mt-1">
              Rambagh Palace Jaipur • {wedding?.ceremony_tradition} • {wedding?.style}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-ivory-50 p-4 rounded-2xl border border-gold-200 shrink-0">
            <div className="text-center px-3 border-r border-gold-200">
              <span className="font-serif text-3xl font-bold text-burgundy-800 block">
                {diffDays > 0 ? diffDays : 21}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-charcoal-500">Days to Nuptials</span>
            </div>
            <div className="text-center px-3 border-r border-gold-200">
              <span className="font-serif text-3xl font-bold text-charcoal-800 block">
                {wedding?.estimated_guests || 400}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-charcoal-500">Guests Basis</span>
            </div>
            <div className="text-center px-3">
              <span className="font-serif text-2xl font-bold text-gold-700 block">
                ₹{((wedding?.total_budget || 5000000) / 100000).toFixed(0)}L
              </span>
              <span className="text-[10px] uppercase tracking-wider text-charcoal-500">Approved Budget</span>
            </div>
          </div>
        </div>

        {/* SECTION A: INTELLIGENT CATERING QUOTATION COMPARISON */}
        <div className="bg-white rounded-3xl border border-gold-300 p-6 sm:p-8 shadow-royal">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-gold-200 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-burgundy-700" />
                <h2 className="font-serif text-2xl font-bold text-charcoal-800">
                  Intelligent Catering Quotation Comparison
                </h2>
              </div>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Objective analysis for {cateringComparison?.guest_basis || 400} guests. Evaluates live counters, staff ratios, and tableware.
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Value Engine Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            {cateringComparison?.comparison?.map((quote: any, idx: number) => {
              const isAccepted = quote.status === 'accepted';
              return (
                <div
                  key={idx}
                  className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                    quote.is_recommended
                      ? 'border-2 border-gold-400 bg-gold-50/40 shadow-md ring-2 ring-gold-200'
                      : 'border-gold-200 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold-800 bg-white px-2 py-0.5 rounded border border-gold-200">
                        {quote.rating} ★ Verified
                      </span>
                      {quote.is_recommended && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy-800 bg-burgundy-50 px-2 py-0.5 rounded border border-burgundy-200">
                          Recommended
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-lg font-bold text-charcoal-900 mb-1">
                      {quote.vendor_name}
                    </h3>
                    <p className="text-xs text-burgundy-800 font-bold mb-3">
                      ₹{quote.price_per_plate.toLocaleString('en-IN')} <span className="text-charcoal-500 font-normal">/ Plate</span>
                    </p>

                    <div className="bg-white rounded-xl p-3 border border-gold-100 mb-3 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-charcoal-400">Total Inclusions:</span>
                        <span className="font-semibold text-charcoal-800">{quote.inclusions?.length || 0} Line Items</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal-400">Taxes & Surcharges:</span>
                        <span className="font-semibold text-charcoal-800">₹{quote.taxes_and_charges.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-gold-100">
                        <span className="font-medium text-charcoal-600">Total Commitment:</span>
                        <span className="font-bold text-burgundy-900">₹{quote.total_estimated_amount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <ul className="space-y-1.5 text-[11px] text-charcoal-600 mb-4">
                      {quote.inclusions?.slice(0, 3).map((inc: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-gold-100">
                    <p className="text-[11px] italic text-charcoal-500 mb-3">
                      {quote.ai_highlight}
                    </p>
                    {isAccepted ? (
                      <span className="block text-center py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs uppercase tracking-wider">
                        ✓ Accepted & Bound
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAcceptQuote(quote.quotation_id)}
                        className="w-full py-2 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-sm"
                      >
                        Accept Quotation
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-ivory-100 border border-gold-200 text-xs text-charcoal-600 flex items-center justify-between">
            <span className="italic">
              <strong>Evaluation Result:</strong> Royal Mewar Caterers offers the optimal balance between variety (18 live counters) and per-plate value with authentic Rajputana banquet execution.
            </span>
            <span className="text-[11px] font-semibold text-gold-800">400 Guests Basis</span>
          </div>
        </div>

        {/* SECTION B: BUDGET GUARDIAN & REPAIRED GUEST IMPACT SIMULATOR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Budget Guardian Breakdown */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gold-300 p-6 sm:p-8 shadow-royal">
            <div className="flex items-center justify-between pb-4 border-b border-gold-200 mb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-charcoal-800">Budget Guardian Overview</h2>
                <p className="text-xs text-charcoal-500">Live expenditure tracking against approved ₹{((wedding?.total_budget || 5000000)/100000).toFixed(0)} Lakhs</p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {budgetOverview?.spending_percentage || 28}% Utilized
              </span>
            </div>

            <div className="space-y-4 mb-6">
              {budgetOverview?.categories?.map((cat) => {
                const percent = Math.min(100, Math.round((cat.committed / cat.allocated) * 100));
                return (
                  <div key={cat.id} className="text-xs space-y-1.5">
                    <div className="flex justify-between font-medium">
                      <span className="text-charcoal-800 font-semibold">{cat.name}</span>
                      <span className="text-charcoal-600">
                        Committed: ₹{cat.committed.toLocaleString('en-IN')} / Allocated: ₹{cat.allocated.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-ivory-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold-400 to-burgundy-700 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gold-100 text-center">
              <div className="p-3 bg-ivory-50 rounded-xl border border-gold-200">
                <span className="text-[10px] uppercase tracking-wider text-charcoal-400 block">Total Approved</span>
                <span className="font-serif text-lg font-bold text-charcoal-900">
                  ₹{budgetOverview?.total_approved_budget.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-3 bg-ivory-50 rounded-xl border border-gold-200">
                <span className="text-[10px] uppercase tracking-wider text-charcoal-400 block">Committed</span>
                <span className="font-serif text-lg font-bold text-burgundy-800">
                  ₹{budgetOverview?.total_committed.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-3 bg-ivory-50 rounded-xl border border-gold-200">
                <span className="text-[10px] uppercase tracking-wider text-charcoal-400 block">Remaining Escrow</span>
                <span className="font-serif text-lg font-bold text-emerald-800">
                  ₹{budgetOverview?.remaining_balance.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* REPAIRED GUEST IMPACT SIMULATOR */}
          <div className="bg-white rounded-3xl border border-gold-300 p-6 shadow-royal flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-burgundy-700" />
                  <h3 className="font-serif text-xl font-bold text-charcoal-800">
                    Guest Impact Simulator
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleResetSimulator}
                  className="inline-flex items-center gap-1 text-[11px] text-charcoal-500 hover:text-burgundy-700 underline font-medium"
                  title="Reset to default baseline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              <p className="text-xs text-charcoal-500 mb-4">
                Calculate real-time cost & capacity escalations across catering, 18% GST, banquet seating, and gifts.
              </p>

              {/* Slider and Number Input */}
              <div className="bg-ivory-50 rounded-2xl p-4 border border-gold-200 mb-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-charcoal-700">Additional Guests</span>
                  <div className="flex items-center gap-1">
                    <span className="text-burgundy-800 font-bold text-base">+{extraGuestCount}</span>
                    <span className="text-charcoal-400">({(wedding?.estimated_guests || BASE_GUESTS) + extraGuestCount} Total)</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="150"
                  step="5"
                  value={extraGuestCount}
                  onChange={(e) => setExtraGuestCount(parseInt(e.target.value) || 0)}
                  className="w-full accent-burgundy-700 cursor-pointer"
                />

                {/* Target Functions Selection */}
                <div className="pt-2 border-t border-gold-200/60">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-500 mb-1.5">
                    Impacted Ceremonies
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={applyToReception}
                        onChange={(e) => setApplyToReception(e.target.checked)}
                        className="rounded text-burgundy-700 focus:ring-gold-400"
                      />
                      <span>Reception (Banquet)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={applyToPheras}
                        onChange={(e) => setApplyToPheras(e.target.checked)}
                        className="rounded text-burgundy-700 focus:ring-gold-400"
                      />
                      <span>Sacred Pheras</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={applyToSangeet}
                        onChange={(e) => setApplyToSangeet(e.target.checked)}
                        className="rounded text-burgundy-700 focus:ring-gold-400"
                      />
                      <span>Sangeet Gala</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={applyToHaldi}
                        onChange={(e) => setApplyToHaldi(e.target.checked)}
                        className="rounded text-burgundy-700 focus:ring-gold-400"
                      />
                      <span>Haldi / Mehndi</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Real-time Breakdown */}
              {simulatedImpact && (
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs space-y-2 mb-4">
                  <div className="flex justify-between font-bold text-amber-950 border-b border-amber-200/80 pb-1.5">
                    <span>Projected Extra Commitment:</span>
                    <span className="font-serif text-base text-burgundy-900">
                      ₹{simulatedImpact.cost_breakdown.total_estimated_impact.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] text-amber-900">
                    <div className="flex justify-between">
                      <span>Catering Subtotal (₹2,800/plate):</span>
                      <span>₹{simulatedImpact.cost_breakdown.catering_subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mandatory 18% GST:</span>
                      <span>₹{simulatedImpact.cost_breakdown.catering_gst_18pct.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Seating Rentals & China Tableware:</span>
                      <span>₹{simulatedImpact.cost_breakdown.seating_and_tableware.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Welcome Favors & Amenities:</span>
                      <span>₹{simulatedImpact.cost_breakdown.guest_favors_and_amenities.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Capacity Warning */}
                  {simulatedImpact.capacity_warning && (
                    <div className="mt-3 p-2.5 rounded-xl bg-red-100 border border-red-300 text-[11px] text-red-900 leading-snug">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-700 inline mr-1" />
                      <strong>Capacity Limit Exceeded:</strong> {simulatedImpact.new_total_guests} guests exceeds the Rambagh Ballroom standard capacity of 420. Supplemental garden marquee required.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              {changeRequestStatus === 'pending' ? (
                <div className="space-y-2">
                  <span className="block text-center py-2 rounded-xl bg-amber-100 text-amber-900 font-semibold text-xs border border-amber-200">
                    Request #{Date.now().toString().slice(-4)} Pending Approval
                  </span>
                  <button
                    type="button"
                    onClick={handleApproveBudgetChange}
                    className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Authorize & Apply Budget Escalation
                  </button>
                </div>
              ) : changeRequestStatus === 'approved' ? (
                <span className="block text-center py-2.5 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-300">
                  ✓ Budget Formally Increased & Synchronized
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowApplyConfirmModal(true)}
                  className="w-full py-2.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  Apply Changes (+{extraGuestCount} Guests)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* SECTION C: STAGED PAYMENTS TRACKING */}
        <div className="bg-white rounded-3xl border border-gold-300 p-6 sm:p-8 shadow-royal">
          <div className="flex items-center justify-between pb-4 border-b border-gold-200 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-gold-600" />
                <h2 className="font-serif text-2xl font-bold text-charcoal-800">
                  Staged Payment Milestones
                </h2>
              </div>
              <p className="text-xs text-charcoal-500">
                Staged escrow releases: booking, advance, pre-event, and post-reception balance.
              </p>
            </div>
            <span className="text-xs font-semibold text-charcoal-500 bg-ivory-100 px-3 py-1 rounded-full border border-gold-200">
              Clear Audit Trail
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal-700">
              <thead className="bg-ivory-100 text-charcoal-500 uppercase tracking-wider border-b border-gold-200">
                <tr>
                  <th className="py-3 px-4">Milestone</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-ivory-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-charcoal-900">{p.title}</td>
                    <td className="py-3.5 px-4 uppercase font-mono text-[11px] text-charcoal-500">{p.stage}</td>
                    <td className="py-3.5 px-4 font-bold text-burgundy-900">₹{p.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-charcoal-600">{p.due_date}</td>
                    <td className="py-3.5 px-4">
                      {p.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Settled ({p.transaction_reference?.slice(0, 14)})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Pending Clearance</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {p.status === 'pending' ? (
                        <button
                          type="button"
                          onClick={() => setActivePaymentForModal(p)}
                          className="px-3 py-1.5 rounded-lg bg-burgundy-700 hover:bg-burgundy-800 text-white font-semibold text-[11px] uppercase tracking-wider transition-colors shadow-sm"
                        >
                          Settle Escrow
                        </button>
                      ) : (
                        <span className="text-[11px] text-charcoal-400">Invoice Cleared</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION D: DIGITAL SERVICE CONTRACT & SIGNATURE PAD */}
        <div className="bg-white rounded-3xl border border-gold-300 p-6 sm:p-8 shadow-royal">
          <div className="flex items-center justify-between pb-4 border-b border-gold-200 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-burgundy-700" />
                <h2 className="font-serif text-2xl font-bold text-charcoal-800">
                  Digital Service Agreement & Countersignatures
                </h2>
              </div>
              <p className="text-xs text-charcoal-500">
                Execute binding service agreements with verified master vendors.
              </p>
            </div>
            <button
              onClick={() => setShowContractSigning(!showContractSigning)}
              className="px-4 py-2 rounded-xl bg-ivory-200 hover:bg-gold-100 text-charcoal-800 text-xs font-semibold uppercase tracking-wider border border-gold-300 transition-colors"
            >
              {showContractSigning ? 'Hide Signature Pad' : 'Sign Agreement'}
            </button>
          </div>

          {showContractSigning && (
            <div className="mb-6">
              <SignaturePad
                documentTitle="Master Catering & Banquet Service Agreement — Royal Mewar"
                signeeName="Aarav Singhania & Meera Kapoor"
                onSave={(sigData) => {
                  setContractSignedTime(new Date().toLocaleString('en-IN'));
                }}
              />
            </div>
          )}

          <div className="p-4 rounded-xl bg-ivory-50 border border-gold-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-charcoal-800 block">Rambagh Palace Banquet & Catering Agreement</span>
              <span className="text-charcoal-500">Countersigned by Vikramaditya Rathore (Vendor) on 15 Oct 2026</span>
            </div>
            <span className="font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {contractSignedTime ? 'Countersigned by Couple' : 'Pending Couple Signature'}
            </span>
          </div>
        </div>

        {/* Confirmation Modal for Guest Change Request */}
        {showApplyConfirmModal && simulatedImpact && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-3xl bg-white border border-gold-300 shadow-royal-lg p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-gold-200 pb-3">
                <div className="w-10 h-10 rounded-xl bg-burgundy-50 border border-burgundy-200 flex items-center justify-center text-burgundy-800">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-charcoal-900">Confirm Guest Change</h3>
                  <p className="text-xs text-charcoal-500">Formal Budget Escalation Notice</p>
                </div>
              </div>

              <div className="text-xs text-charcoal-600 space-y-2">
                <p>
                  You are submitting a formal request to add <strong>+{extraGuestCount} guests</strong> to the wedding roster (Total: <strong>{simulatedImpact.new_total_guests} guests</strong>).
                </p>
                <div className="p-3 rounded-xl bg-ivory-100 border border-gold-200 space-y-1">
                  <div className="flex justify-between">
                    <span>Projected Budget Increment:</span>
                    <span className="font-bold text-burgundy-900">₹{simulatedImpact.cost_breakdown.total_estimated_impact.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-charcoal-500">
                    <span>Includes:</span>
                    <span>Catering, 18% GST, Tableware & Favors</span>
                  </div>
                </div>
                <p className="text-[11px] italic text-charcoal-500">
                  In compliance with Section 5.9, budgets cannot be altered silently. Once submitted, your assigned wedding planner (Ananya Sharma) will review venue capacities and issue authorization.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyConfirmModal(false)}
                  className="px-4 py-2 rounded-xl border border-gold-300 text-charcoal-600 text-xs font-semibold hover:bg-ivory-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteChangeRequest}
                  className="px-5 py-2 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-semibold uppercase tracking-wider shadow-sm"
                >
                  Confirm & Submit Request
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Simulated Payment Modal */}
        {activePaymentForModal && (
          <SimulatedPaymentModal
            isOpen={true}
            onClose={() => setActivePaymentForModal(null)}
            title={activePaymentForModal.title}
            stage={activePaymentForModal.stage}
            amount={activePaymentForModal.amount}
            invoiceNumber={activePaymentForModal.invoice_number || 'INV-TRK-2026-092'}
            onPaymentSuccess={async (res) => {
              await api.simulatePaymentSettlement(activePaymentForModal.id, {
                payment_method: res.method
              });
              const refreshedPayments = await api.getPayments(activeWeddingId);
              const refreshedBudget = await api.getBudgetOverview(activeWeddingId);
              setPayments(refreshedPayments);
              setBudgetOverview(refreshedBudget);
              setActivePaymentForModal(null);
            }}
          />
        )}
      </div>
    </div>
  );
};
