import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { StayPicker } from '../../components/ui/StayPicker';
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
  Info,
  Hotel,
  PenTool,
  Check,
  LayoutGrid,
  ChevronRight
} from 'lucide-react';

export const CoupleDashboardPage: React.FC = () => {
  const { user, activeWeddingId } = useAuth();

  // Active progressive tab: 'overview' | 'venues' | 'vendors' | 'budget' | 'seating'
  const [activeTab, setActiveTab] = useState<'overview' | 'venues' | 'vendors' | 'budget' | 'seating'>('overview');

  // Core Data State
  const [wedding, setWedding] = useState<Wedding | null>(() => {
    const cached = localStorage.getItem('royal_knot_active_wedding');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return null;
  });

  const [budgetOverview, setBudgetOverview] = useState<BudgetOverview | null>(null);
  const [cateringComparison, setCateringComparison] = useState<any | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Guest Impact Simulator State
  const BASE_GUESTS = wedding?.estimated_guests || 400;
  const [extraGuestCount, setExtraGuestCount] = useState(60);
  const [applyToReception, setApplyToReception] = useState(true);
  const [applyToPheras, setApplyToPheras] = useState(true);
  const [applyToSangeet, setApplyToSangeet] = useState(false);
  const [applyToHaldi, setApplyToHaldi] = useState(false);
  const [simulatedImpact, setSimulatedImpact] = useState<any | null>(null);
  const [changeRequestStatus, setChangeRequestStatus] = useState<string | null>(null);
  const [showApplyConfirmModal, setShowApplyConfirmModal] = useState(false);
  const [applyToast, setApplyToast] = useState<string | null>(null);

  // Active Modals
  const [activePaymentForModal, setActivePaymentForModal] = useState<PaymentRecord | null>(null);
  const [showContractSigning, setShowContractSigning] = useState(false);
  const [selectedVendorForContract, setSelectedVendorForContract] = useState<string>('Royal Mewar Imperial Kitchens');
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

        // Prioritize custom couple names if saved locally
        const cachedWedding = localStorage.getItem('royal_knot_active_wedding');
        if (cachedWedding) {
          try {
            const parsed = JSON.parse(cachedWedding);
            setWedding(parsed);
          } catch (e) {
            setWedding(wData);
          }
        } else {
          setWedding(wData);
        }

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

  // Real-time reactive calculation whenever extraGuestCount or functions change
  useEffect(() => {
    const funcCount = [applyToReception, applyToPheras, applyToSangeet, applyToHaldi].filter(Boolean).length || 1;
    const pricePerPlate = 2800;
    const cateringSubtotal = extraGuestCount * pricePerPlate * (funcCount >= 2 ? 1.5 : 1.0);
    const cateringGst = cateringSubtotal * 0.18;
    const seatingTableware = extraGuestCount * 650;
    const favorsAmenities = extraGuestCount * 500;
    const totalImpact = Math.round(cateringSubtotal + cateringGst + seatingTableware + favorsAmenities);

    const currentBase = wedding?.estimated_guests || 400;
    const newTotal = currentBase + extraGuestCount;

    setSimulatedImpact({
      additional_guests: extraGuestCount,
      new_total_guests: newTotal,
      cost_breakdown: {
        catering_subtotal: Math.round(cateringSubtotal),
        catering_gst_18pct: Math.round(cateringGst),
        seating_and_tableware: seatingTableware,
        guest_favors_and_amenities: favorsAmenities,
        total_estimated_impact: totalImpact
      },
      capacity_warning: newTotal > 420
    });
  }, [extraGuestCount, applyToReception, applyToPheras, applyToSangeet, applyToHaldi, wedding?.estimated_guests]);

  // Reset Simulator
  const handleResetSimulator = () => {
    setExtraGuestCount(60);
    setApplyToReception(true);
    setApplyToPheras(true);
    setApplyToSangeet(false);
    setApplyToHaldi(false);
    setChangeRequestStatus(null);
  };

  // Submit and Immediately Apply Changes to Official Wedding State & Financial Ledger
  const handleExecuteChangeRequest = async () => {
    setShowApplyConfirmModal(false);
    try {
      const additionalCost = simulatedImpact?.cost_breakdown?.total_estimated_impact || (extraGuestCount * 4454);
      const currentGuests = wedding?.estimated_guests || 400;
      const currentBudget = wedding?.total_budget || 5000000;
      const updatedGuests = currentGuests + extraGuestCount;
      const updatedBudget = currentBudget + additionalCost;

      // 1. Dispatch change request to API
      await api.createBudgetChangeRequest(activeWeddingId, {
        additional_guests: extraGuestCount,
        reason: `Family addition of ${extraGuestCount} guests for Jaipur Reception & Pheras.`
      });

      // 2. Immediately synchronize active wedding state and localStorage
      const updatedWedding: Wedding = {
        id: wedding?.id || activeWeddingId,
        owner_id: wedding?.owner_id || 'user-couple-01',
        planner_id: wedding?.planner_id || 'user-planner-01',
        couple_names: wedding?.couple_names || 'Aarav Singhania & Meera Kapoor',
        partner1_name: wedding?.partner1_name || 'Aarav Singhania',
        partner2_name: wedding?.partner2_name || 'Meera Kapoor',
        wedding_date: wedding?.wedding_date || '2026-11-21',
        destination_city: wedding?.destination_city || 'Jaipur',
        destination_state: wedding?.destination_state || 'Rajasthan',
        estimated_guests: updatedGuests,
        total_budget: updatedBudget,
        allocated_budget: (wedding?.allocated_budget || 4450000) + additionalCost,
        currency: wedding?.currency || 'INR',
        style: wedding?.style || 'Royal Palace',
        ceremony_tradition: wedding?.ceremony_tradition || 'Hindu Traditional',
        status: wedding?.status || 'planning',
        is_demo: wedding?.is_demo ?? true,
        primary_venue_name: wedding?.primary_venue_name || 'Rambagh Palace, Jaipur'
      };

      setWedding(updatedWedding);
      localStorage.setItem('royal_knot_active_wedding', JSON.stringify(updatedWedding));
      localStorage.setItem('royal_knot_active_wedding_id', updatedWedding.id);

      // 3. Immediately update budget overview
      setBudgetOverview(prev => prev ? {
        ...prev,
        total_approved_budget: updatedBudget,
        total_allocated: (prev.total_allocated || (prev as any).allocated_budget || 4450000) + additionalCost,
        remaining_balance: Math.max(0, updatedBudget - ((prev.total_allocated || (prev as any).allocated_budget || 4450000) + additionalCost))
      } : null);

      setChangeRequestStatus('approved');
      setApplyToast(`✓ Wedding successfully updated to ${updatedGuests} guests and ₹${(updatedBudget / 100000).toFixed(2)} Lakhs budget.`);
      setTimeout(() => setApplyToast(null), 5000);
    } catch (err) {
      console.error('Error applying budget change:', err);
    }
  };

  // Accept a catering quote
  const handleAcceptQuote = async (quoteId: string) => {
    try {
      await api.acceptQuotation(quoteId);
      const refreshedComp = await api.compareCateringQuotations(activeWeddingId);
      setCateringComparison(refreshedComp);
      setApplyToast("Catering quotation accepted! Contract locked into the financial ledger.");
      setTimeout(() => setApplyToast(null), 4000);
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
        {/* Toast Alert */}
        {applyToast && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in slide-in-from-top-4 duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{applyToast}</span>
          </div>
        )}

        {/* Top Banner: Wedding Overview & Countdown */}
        <div className="rounded-3xl bg-white border border-gold-300 p-6 sm:p-8 shadow-royal flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-burgundy-700 bg-burgundy-50 px-3 py-0.5 rounded-full border border-burgundy-200">
                Active Celebration Portal
              </span>
              <span className="text-xs text-charcoal-400">
                {wedding?.destination_city || 'Jaipur'}, {wedding?.destination_state || 'Rajasthan'}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
              {wedding?.couple_names || 'Aarav Singhania & Meera Kapoor'}
            </h1>
            <p className="text-xs text-charcoal-500 mt-1">
              {wedding?.primary_venue_name || 'Rambagh Palace, Jaipur'} • {wedding?.ceremony_tradition || 'Hindu Traditional'} • {wedding?.style || 'Royal Palace'}
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
              <span className="text-[10px] uppercase tracking-wider text-charcoal-500">Confirmed Guests</span>
            </div>
            <div className="text-center px-3">
              <span className="font-serif text-2xl font-bold text-gold-700 block">
                ₹{((wedding?.total_budget || 5000000) / 100000).toFixed(1)}L
              </span>
              <span className="text-[10px] uppercase tracking-wider text-charcoal-500">Approved Budget</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PROGRESSIVE MILESTONE TABS (Section 1 -> 2 -> 3 -> 4)
            Budget Page is the final step after couples book venues & vendors!
            ========================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gold-300 text-xs uppercase font-semibold tracking-wider">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-burgundy-700 text-white shadow-sm'
                : 'bg-white text-charcoal-700 hover:bg-gold-50 border border-gold-200'
            }`}
          >
            <Clock className="w-4 h-4 text-gold-300" />
            <span>1. Overview & Schedule</span>
          </button>

          <button
            onClick={() => setActiveTab('venues')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'venues'
                ? 'bg-burgundy-700 text-white shadow-sm'
                : 'bg-white text-charcoal-700 hover:bg-gold-50 border border-gold-200'
            }`}
          >
            <Hotel className="w-4 h-4 text-gold-300" />
            <span>2. Palace Venues & Room Blocks</span>
          </button>

          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'vendors'
                ? 'bg-burgundy-700 text-white shadow-sm'
                : 'bg-white text-charcoal-700 hover:bg-gold-50 border border-gold-200'
            }`}
          >
            <ChefHat className="w-4 h-4 text-gold-300" />
            <span>3. Vendor & Planner Bookings</span>
          </button>

          <button
            onClick={() => setActiveTab('budget')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'budget'
                ? 'bg-burgundy-700 text-white shadow-sm ring-2 ring-gold-400'
                : 'bg-white text-charcoal-700 hover:bg-gold-50 border border-gold-200'
            }`}
          >
            <Coins className="w-4 h-4 text-gold-300" />
            <span>4. Budget Guardian & Simulation (Final Stage)</span>
          </button>

          <button
            onClick={() => setActiveTab('seating')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'seating'
                ? 'bg-burgundy-700 text-white shadow-sm'
                : 'bg-white text-charcoal-700 hover:bg-gold-50 border border-gold-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-gold-300" />
            <span>5. Visual Seating Canvas</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: OVERVIEW & SCHEDULE
            ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Wedding Functions Timeline */}
              <div className="md:col-span-2 bg-white rounded-3xl border border-gold-300 p-6 sm:p-8 shadow-royal">
                <div className="flex items-center justify-between pb-4 border-b border-gold-200 mb-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-charcoal-800">
                      Ceremonial Schedule & Functions
                    </h2>
                    <p className="text-xs text-charcoal-500">
                      {wedding?.ceremony_tradition || 'Hindu Traditional'} • 5 Ceremonies Curated
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200">
                    Auspicious Timings
                  </span>
                </div>

                <div className="space-y-4">
                  {[
                    { name: 'Ganesh Puja & Mandap Muhurat', date: '20 Nov 2026', time: '09:00 AM – 11:30 AM', venue: 'Palace Mandir Courtyard' },
                    { name: 'Haldi & Phoolon Ki Holi', date: '20 Nov 2026', time: '10:30 AM – 01:30 PM', venue: 'Baradari Floral Terrace' },
                    { name: 'Mehendi & Sangeet Gala', date: '20 Nov 2026', time: '07:00 PM – 11:59 PM', venue: 'Maharani Amphitheatre' },
                    { name: 'Baraat, Sacred Pheras & Wedding', date: '21 Nov 2026', time: '04:30 PM – 08:30 PM', venue: 'Sunken Lotus Pavilion' },
                    { name: 'Grand Royal Reception & Banquet', date: '21 Nov 2026', time: '08:30 PM – 11:59 PM', venue: 'Imperial Banquet Lawn' }
                  ].map((fn, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-ivory-50 border border-gold-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gold-100 border border-gold-300 flex items-center justify-center font-serif font-bold text-xs text-gold-900">
                          0{idx + 1}
                        </div>
                        <div>
                          <h4 className="font-serif text-sm font-bold text-charcoal-900">{fn.name}</h4>
                          <p className="text-[11px] text-charcoal-500">{fn.venue}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-burgundy-800 block">{fn.date}</span>
                        <span className="text-[11px] text-charcoal-500">{fn.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operations & Senior Concierge Allocation */}
              <div className="bg-white rounded-3xl border border-gold-300 p-6 sm:p-8 shadow-royal flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-1">
                    Senior Wedding Planner
                  </h3>
                  <p className="text-xs text-charcoal-500 mb-4">Dedicated Royal Knot Operations Lead</p>

                  <div className="p-4 rounded-2xl bg-ivory-50 border border-gold-200 flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gold-300">
                      <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                        alt="Ananya Sharma"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-charcoal-900">Ananya Sharma</h4>
                      <p className="text-[11px] text-gold-700">Senior Royal Planner • Jaipur Wing</p>
                      <span className="text-[10px] text-emerald-700 font-medium">● Active on Ground</span>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-3">
                    Next Critical Milestones
                  </h4>
                  <div className="space-y-2.5 text-xs text-charcoal-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Rambagh Palace Walkthrough Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Royal Mewar Catering Menu Verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Room Block Allocation (25 Suites) Pending</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gold-200 mt-6">
                  <button
                    onClick={() => setActiveTab('venues')}
                    className="w-full py-3 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-medium text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Step 2: Venues & Room Blocks</span>
                    <ArrowRight className="w-4 h-4 text-gold-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: PALACE VENUES & ROOM BLOCKS
            ========================================================================= */}
        {activeTab === 'venues' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-gold-300 p-6 sm:p-8 shadow-royal">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-gold-200 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Hotel className="w-5 h-5 text-burgundy-700" />
                    <h2 className="font-serif text-2xl font-bold text-charcoal-800">
                      Destination Stay & Room Blocks Management
                    </h2>
                  </div>
                  <p className="text-xs text-charcoal-500 mt-0.5">
                    Reserve multi-night accommodation, calculate group discounts, and dispatch formal room block requests.
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Palace Concierge Connected
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Active Venue Overview */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="rounded-2xl overflow-hidden border border-gold-300 shadow-sm h-52">
                    <img
                      src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
                      alt="Rambagh Palace"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gold-700">Primary Palace</span>
                    <h3 className="font-serif text-2xl font-bold text-charcoal-900">
                      {wedding?.primary_venue_name || 'Rambagh Palace, Jaipur'}
                    </h3>
                    <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">
                      47 acres of ornamental gardens and heritage rooms. Exclusive palace buyout arrangements available for royal wedding entourages.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-ivory-100 border border-gold-200 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-charcoal-500">Walkthrough Date:</span>
                      <span className="font-semibold text-charcoal-800">12 Nov 2026 (Confirmed)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal-500">Group Privilege:</span>
                      <span className="font-semibold text-emerald-700">15% Discount on Suites</span>
                    </div>
                  </div>
                </div>

                {/* Right: Interactive StayPicker Component */}
                <div className="lg:col-span-2">
                  <StayPicker
                    venueName={wedding?.primary_venue_name || 'Rambagh Palace, Jaipur'}
                    defaultRooms={25}
                    defaultGuests={60}
                    onConfirm={(details) => {
                      setApplyToast(`Room Block Requisition recorded: ${details.rooms} rooms for ${details.guests} guests.`);
                      setTimeout(() => setApplyToast(null), 4000);
                    }}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gold-200 mt-8 flex justify-end">
                <button
                  onClick={() => setActiveTab('vendors')}
                  className="py-3 px-6 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-medium text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                >
                  <span>Proceed to Step 3: Vendor Bookings</span>
                  <ArrowRight className="w-4 h-4 text-gold-300" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: VENDOR & PLANNER BOOKINGS
            ========================================================================= */}
        {activeTab === 'vendors' && (
          <div className="space-y-8">
            {/* Catering Quotation Comparison */}
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
                    Objective analysis for {wedding?.estimated_guests || 400} guests across imperial banquet options.
                  </p>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Value Engine Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {cateringComparison?.options?.map((quote: any, idx: number) => {
                  const isAccepted = quote.status === 'accepted';
                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl p-6 border flex flex-col justify-between transition-all ${
                        isAccepted
                          ? 'border-2 border-emerald-500 bg-emerald-50/20 shadow-md ring-2 ring-emerald-200'
                          : 'border-gold-300 bg-white hover:border-gold-400'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-gold-800 bg-gold-50 px-2.5 py-0.5 rounded border border-gold-200">
                            Verified Imperial Vendor
                          </span>
                          {isAccepted && (
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300">
                              ✓ Accepted & Booked
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif text-2xl font-bold text-charcoal-900 mb-1">
                          {quote.vendor_name}
                        </h3>

                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="font-serif text-3xl font-bold text-burgundy-900">
                            ₹{quote.price_per_plate?.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-charcoal-500">per plate • ₹{quote.total_price?.toLocaleString('en-IN')} Total</span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-ivory-50 border border-gold-200 text-xs mb-4">
                          <span className="font-bold text-charcoal-700 block mb-1">Culinary Highlights:</span>
                          <ul className="list-disc list-inside space-y-1 text-charcoal-600">
                            {quote.menu_highlights?.map((h: string, i: number) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gold-200 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedVendorForContract(quote.vendor_name);
                            setShowContractSigning(true);
                          }}
                          className="px-4 py-2 rounded-xl border border-gold-300 hover:bg-gold-50 text-charcoal-800 text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                        >
                          <PenTool className="w-3.5 h-3.5 text-gold-600" />
                          <span>Review & Sign Contract</span>
                        </button>

                        {!isAccepted && (
                          <button
                            type="button"
                            onClick={() => handleAcceptQuote(quote.quotation_id)}
                            className="px-5 py-2 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                          >
                            Accept Quotation
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Other Luxury Vendors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gold-200 text-xs">
                <div className="p-4 rounded-xl bg-ivory-50 border border-gold-200">
                  <span className="text-[10px] uppercase font-bold text-charcoal-400">Photography</span>
                  <h4 className="font-bold text-charcoal-900 mt-0.5">Bespoke Heritage Cinema</h4>
                  <p className="text-[11px] text-charcoal-500 mt-1">₹4,00,000 • 5-day cinematography & drone</p>
                  <span className="text-[10px] text-emerald-700 font-semibold mt-2 block">✓ Contract Executed</span>
                </div>
                <div className="p-4 rounded-xl bg-ivory-50 border border-gold-200">
                  <span className="text-[10px] uppercase font-bold text-charcoal-400">Floral Architecture</span>
                  <h4 className="font-bold text-charcoal-900 mt-0.5">Imperial Rajputana Decor</h4>
                  <p className="text-[11px] text-charcoal-500 mt-1">₹6,00,000 • Rose pavilions & mandap</p>
                  <span className="text-[10px] text-emerald-700 font-semibold mt-2 block">✓ Advance Paid</span>
                </div>
                <div className="p-4 rounded-xl bg-ivory-50 border border-gold-200">
                  <span className="text-[10px] uppercase font-bold text-charcoal-400">Royal Sufi & Symphony</span>
                  <h4 className="font-bold text-charcoal-900 mt-0.5">Udaipur Sufi Ensemble</h4>
                  <p className="text-[11px] text-charcoal-500 mt-1">₹2,50,000 • Sangeet night gala performance</p>
                  <span className="text-[10px] text-amber-700 font-semibold mt-2 block">● Quotation Awaiting Sign-off</span>
                </div>
              </div>

              <div className="pt-6 border-t border-gold-200 mt-6 flex justify-end">
                <button
                  onClick={() => setActiveTab('budget')}
                  className="py-3 px-6 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-medium text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                >
                  <span>Open Step 4: Budget Guardian & Simulation</span>
                  <ArrowRight className="w-4 h-4 text-gold-300" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: BUDGET GUARDIAN & COST SIMULATION (THE FINAL FINANCIAL STAGE)
            User requirement: "budget page should be the last page after a couple book
            the vendors and professional and planner , then the budget page should open
            and simullate the estimated costs"
            ========================================================================= */}
        {activeTab === 'budget' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Budget Financial Ledger Cards */}
            <div className="bg-white rounded-3xl border border-gold-300 p-6 sm:p-8 shadow-royal">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-gold-200 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-gold-600" />
                    <h2 className="font-serif text-2xl font-bold text-charcoal-800">
                      Budget Guardian & Financial Command
                    </h2>
                  </div>
                  <p className="text-xs text-charcoal-500 mt-0.5">
                    Real-time consolidated balance sheet reflecting all vendor contracts, venue commitments, and guest escalations.
                  </p>
                </div>
                <div className="text-xs text-charcoal-600">
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Escrow Protection Guaranteed
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-ivory-50 border border-gold-200">
                  <span className="text-[10px] uppercase font-bold text-charcoal-400 block mb-1">Total Approved Budget</span>
                  <span className="font-serif text-2xl font-bold text-charcoal-900">
                    ₹{((wedding?.total_budget || 5000000) / 100000).toFixed(2)}L
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-ivory-50 border border-gold-200">
                  <span className="text-[10px] uppercase font-bold text-charcoal-400 block mb-1">Allocated to Bookings</span>
                  <span className="font-serif text-2xl font-bold text-burgundy-800">
                    ₹{(((budgetOverview?.total_allocated || (budgetOverview as any)?.allocated_budget) || 4450000) / 100000).toFixed(2)}L
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-ivory-50 border border-gold-200">
                  <span className="text-[10px] uppercase font-bold text-charcoal-400 block mb-1">Total Settled via Escrow</span>
                  <span className="font-serif text-2xl font-bold text-emerald-800">
                    ₹{(((budgetOverview?.total_actual_spent || (budgetOverview as any)?.total_spent) || 1850000) / 100000).toFixed(2)}L
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-ivory-50 border border-gold-200">
                  <span className="text-[10px] uppercase font-bold text-charcoal-400 block mb-1">Escrow Remaining Balance</span>
                  <span className="font-serif text-2xl font-bold text-gold-700">
                    ₹{(((budgetOverview?.remaining_balance || (budgetOverview as any)?.pending_payments) || 2600000) / 100000).toFixed(2)}L
                  </span>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-3 mb-8">
                <h4 className="font-serif text-lg font-bold text-charcoal-900">
                  Service Categories & Allocation Progress
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  {budgetOverview?.categories?.map((cat, idx) => {
                    const allocated = cat.allocated || (cat as any).allocated_amount || 1000000;
                    const spent = cat.actual_spent || (cat as any).spent_amount || 0;
                    return (
                      <div key={idx} className="p-4 rounded-2xl bg-white border border-gold-200 shadow-sm space-y-2">
                        <div className="flex justify-between font-bold text-charcoal-800">
                          <span>{cat.name}</span>
                          <span>₹{(allocated / 100000).toFixed(1)}L</span>
                        </div>
                        <div className="w-full bg-ivory-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gold-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, (spent / allocated) * 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-charcoal-500">
                          <span>Paid: ₹{(spent / 100000).toFixed(1)}L</span>
                          <span className="capitalize text-burgundy-800 font-semibold">Active Escrow</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Staged Payment Milestones Table */}
              <div className="pt-6 border-t border-gold-200">
                <h4 className="font-serif text-lg font-bold text-charcoal-900 mb-3">
                  Staged Payment Releases & Milestones
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-charcoal-700">
                    <thead className="bg-ivory-100 text-charcoal-500 uppercase tracking-wider border-b border-gold-200">
                      <tr>
                        <th className="py-3 px-4 font-semibold">Payment Title</th>
                        <th className="py-3 px-4 font-semibold">Category / Stage</th>
                        <th className="py-3 px-4 font-semibold">Scheduled Amount</th>
                        <th className="py-3 px-4 font-semibold">Due Date</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-100">
                      {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-ivory-50">
                          <td className="py-3 px-4 font-semibold text-charcoal-900">{p.title}</td>
                          <td className="py-3 px-4 text-charcoal-500 capitalize">{p.stage}</td>
                          <td className="py-3 px-4 font-bold text-charcoal-800">₹{p.amount.toLocaleString('en-IN')}</td>
                          <td className="py-3 px-4 text-charcoal-500">{p.due_date}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                p.status === 'completed'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : p.status === 'overdue'
                                  ? 'bg-red-50 text-red-800 border border-red-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {p.status !== 'completed' ? (
                              <button
                                type="button"
                                onClick={() => setActivePaymentForModal(p)}
                                className="px-3 py-1 rounded-lg bg-burgundy-700 hover:bg-burgundy-800 text-white font-medium text-[11px] uppercase tracking-wider transition-colors"
                              >
                                Release Escrow
                              </button>
                            ) : (
                              <span className="text-emerald-700 font-semibold text-[11px]">Paid via {p.payment_method || 'RTGS'}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* =========================================================================
                THE GUEST IMPACT SIMULATOR (Fully Reactive, Working & Directly Applies!)
                ========================================================================= */}
            <div className="bg-white rounded-3xl border border-gold-300 p-6 sm:p-8 shadow-royal">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-gold-200 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-burgundy-700" />
                    <h3 className="font-serif text-2xl font-bold text-charcoal-800">
                      Guest Impact & Extra Headcount Cost Simulator
                    </h3>
                  </div>
                  <p className="text-xs text-charcoal-500 mt-0.5">
                    Reactive mathematical simulation of guest count escalations across banquet catering, 18% GST, tableware, and amenities.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleResetSimulator}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gold-300 bg-ivory-100 hover:bg-gold-50 text-charcoal-700 text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                  title="Reset to default baseline"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-gold-600" />
                  <span>Reset Simulator</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Controls */}
                <div className="space-y-4">
                  <div className="bg-ivory-50 rounded-2xl p-5 border border-gold-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-charcoal-800 text-sm">Additional Guests</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-burgundy-800 font-bold text-xl">+{extraGuestCount}</span>
                        <span className="text-charcoal-500 text-xs">({(wedding?.estimated_guests || 400) + extraGuestCount} Total Guests)</span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="150"
                      step="5"
                      value={extraGuestCount}
                      onChange={(e) => setExtraGuestCount(parseInt(e.target.value) || 0)}
                      className="w-full accent-burgundy-700 cursor-pointer h-2 bg-gold-200 rounded-lg"
                    />

                    {/* Checkboxes for Impacted Ceremonies */}
                    <div className="pt-3 border-t border-gold-200/80">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-500 mb-2">
                        Include in Ceremonial Banquets
                      </label>
                      <div className="grid grid-cols-2 gap-2.5 text-xs text-charcoal-800">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={applyToReception}
                            onChange={(e) => setApplyToReception(e.target.checked)}
                            className="rounded text-burgundy-700 focus:ring-gold-400"
                          />
                          <span>Grand Reception Banquet</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={applyToPheras}
                            onChange={(e) => setApplyToPheras(e.target.checked)}
                            className="rounded text-burgundy-700 focus:ring-gold-400"
                          />
                          <span>Sacred Pheras Feast</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={applyToSangeet}
                            onChange={(e) => setApplyToSangeet(e.target.checked)}
                            className="rounded text-burgundy-700 focus:ring-gold-400"
                          />
                          <span>Sangeet Gala</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={applyToHaldi}
                            onChange={(e) => setApplyToHaldi(e.target.checked)}
                            className="rounded text-burgundy-700 focus:ring-gold-400"
                          />
                          <span>Haldi High Tea</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Capacity Alert */}
                  {simulatedImpact?.capacity_warning && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>Palace Capacity Notice:</strong> {simulatedImpact.new_total_guests} guests exceeds the standard Rambagh Ballroom capacity of 420. Supplemental royal marquee setup will be provisioned on the Maharani Lawn.
                      </div>
                    </div>
                  )}
                </div>

                {/* Reactive Live Breakdown & Apply Action */}
                <div className="bg-ivory-50 rounded-2xl p-6 border border-gold-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-gold-300 mb-4">
                      <span className="font-serif text-lg font-bold text-charcoal-900">
                        Projected Financial Impact
                      </span>
                      <span className="font-serif text-2xl font-bold text-burgundy-800">
                        +₹{simulatedImpact?.cost_breakdown?.total_estimated_impact?.toLocaleString('en-IN') || 0}
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs text-charcoal-700 mb-6">
                      <div className="flex justify-between">
                        <span>Catering Subtotal (₹2,800/plate × {extraGuestCount}):</span>
                        <span className="font-semibold text-charcoal-900">
                          ₹{simulatedImpact?.cost_breakdown?.catering_subtotal?.toLocaleString('en-IN') || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mandatory Hospitality GST (18%):</span>
                        <span className="font-semibold text-charcoal-900">
                          ₹{simulatedImpact?.cost_breakdown?.catering_gst_18pct?.toLocaleString('en-IN') || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Seating Rentals & Royal Tableware (₹650/guest):</span>
                        <span className="font-semibold text-charcoal-900">
                          ₹{simulatedImpact?.cost_breakdown?.seating_and_tableware?.toLocaleString('en-IN') || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Imperial Welcome Favors & Gifts (₹500/guest):</span>
                        <span className="font-semibold text-charcoal-900">
                          ₹{simulatedImpact?.cost_breakdown?.guest_favors_and_amenities?.toLocaleString('en-IN') || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {changeRequestStatus === 'approved' ? (
                      <div className="p-3.5 rounded-xl bg-emerald-100 border border-emerald-300 text-center text-xs font-bold text-emerald-900">
                        ✓ Budget & Guest Count Formally Synchronized (+{extraGuestCount} Guests Applied)
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowApplyConfirmModal(true)}
                        className="w-full py-3.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-semibold text-xs uppercase tracking-wider shadow-royal transition-all inline-flex items-center justify-center gap-2"
                      >
                        <span>Apply Changes Directly (+{extraGuestCount} Guests to Wedding)</span>
                        <ArrowRight className="w-4 h-4 text-gold-300" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: VISUAL SEATING ARCHITECTURE
            ========================================================================= */}
        {activeTab === 'seating' && (
          <div className="bg-white rounded-3xl border border-gold-300 p-6 sm:p-8 shadow-royal space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-gold-200">
              <div>
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-burgundy-700" />
                  <h2 className="font-serif text-2xl font-bold text-charcoal-800">
                    Visual Seating & Banquet Floorplan Architecture
                  </h2>
                </div>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  Circular 10-seater tables, radial chair placement, and VIP Rectangular Head Tables for the Royal Couple and Patriarchs.
                </p>
              </div>

              <Link
                to="/guests"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors"
              >
                <span>Launch Full Seating Canvas</span>
                <ArrowRight className="w-4 h-4 text-gold-300" />
              </Link>
            </div>

            {/* Quick Preview Floorplan Architecture */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-ivory-50 border border-gold-200 text-center">
                <div className="w-16 h-16 rounded-full bg-gold-100 border-2 border-gold-400 mx-auto flex items-center justify-center font-bold text-charcoal-800 mb-2">
                  8 / 10
                </div>
                <h4 className="font-bold text-charcoal-900">Table 1</h4>
                <p className="text-[11px] text-charcoal-500">Singhania Elders</p>
              </div>

              <div className="p-4 rounded-2xl bg-ivory-50 border border-gold-200 text-center">
                <div className="w-16 h-16 rounded-full bg-gold-100 border-2 border-gold-400 mx-auto flex items-center justify-center font-bold text-charcoal-800 mb-2">
                  7 / 10
                </div>
                <h4 className="font-bold text-charcoal-900">Table 2</h4>
                <p className="text-[11px] text-charcoal-500">Kapoor Patriarchs</p>
              </div>

              <div className="p-4 rounded-2xl bg-ivory-50 border border-gold-200 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 mx-auto flex items-center justify-center font-bold text-emerald-800 mb-2">
                  10 / 10
                </div>
                <h4 className="font-bold text-charcoal-900">Table 3</h4>
                <p className="text-[11px] text-charcoal-500">Imperial Youth & Cousins</p>
              </div>

              <div className="p-4 rounded-2xl bg-gold-50 border-2 border-gold-400 text-center">
                <div className="w-20 h-14 rounded-xl bg-gold-200/60 border border-gold-400 mx-auto flex items-center justify-center font-bold text-burgundy-900 mb-2">
                  6 / 12
                </div>
                <h4 className="font-bold text-burgundy-900">VIP Head Table</h4>
                <p className="text-[11px] text-charcoal-500">Royal Couple & Parents</p>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Confirm Apply Changes */}
        {showApplyConfirmModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-gold-300 p-6 sm:p-8 max-w-md w-full shadow-royal text-center">
              <div className="w-14 h-14 rounded-full bg-gold-50 border border-gold-300 text-gold-700 flex items-center justify-center mx-auto mb-4">
                <Coins className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-charcoal-900 mb-2">
                Apply Headcount Escalation?
              </h3>
              <p className="text-xs text-charcoal-600 mb-6 leading-relaxed">
                Applying will immediately update your wedding guest count from{' '}
                <strong>{wedding?.estimated_guests || 400}</strong> to{' '}
                <strong className="text-burgundy-800">
                  {(wedding?.estimated_guests || 400) + extraGuestCount} guests
                </strong>
                , and adjust the approved budget by{' '}
                <strong className="text-burgundy-800">
                  +₹{simulatedImpact?.cost_breakdown?.total_estimated_impact?.toLocaleString('en-IN')}
                </strong>
                .
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowApplyConfirmModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-gold-300 text-charcoal-700 text-xs font-semibold uppercase tracking-wider hover:bg-ivory-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteChangeRequest}
                  className="w-1/2 py-2.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Confirm & Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contract Signature Modal */}
        {showContractSigning && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-gold-300 p-6 sm:p-8 max-w-xl w-full shadow-royal">
              <h3 className="font-serif text-2xl font-bold text-charcoal-900 mb-1">
                Digital Contract Execution
              </h3>
              <p className="text-xs text-charcoal-500 mb-6">
                Party: {wedding?.couple_names} & {selectedVendorForContract}
              </p>

              <div className="p-4 rounded-xl bg-ivory-50 border border-gold-200 text-xs text-charcoal-600 space-y-2 mb-6 max-h-40 overflow-y-auto">
                <p><strong>1. Scope of Service:</strong> Provision of heritage Rajasthani banquet service for {wedding?.estimated_guests || 400} guests at Rambagh Palace Jaipur.</p>
                <p><strong>2. Escrow Release:</strong> Payments governed by The Royal Knot Escrow Milestones.</p>
                <p><strong>3. Cancellation:</strong> 100% refund up to 45 days prior to wedding date.</p>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-semibold text-charcoal-700 mb-2">
                  Sign Below with Mouse or Touch:
                </label>
                <SignaturePad
                  onSave={(signatureData) => {
                    setContractSignedTime(new Date().toLocaleString('en-IN'));
                    setShowContractSigning(false);
                    setApplyToast(`Contract executed with ${selectedVendorForContract}!`);
                    setTimeout(() => setApplyToast(null), 4000);
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => setShowContractSigning(false)}
                className="w-full py-2.5 rounded-xl border border-gold-300 text-charcoal-700 text-xs font-semibold uppercase tracking-wider hover:bg-ivory-100 transition-colors"
              >
                Close Without Signing
              </button>
            </div>
          </div>
        )}

        {/* Payment Settlement Modal */}
        {activePaymentForModal && (
          <SimulatedPaymentModal
            isOpen={true}
            onClose={() => setActivePaymentForModal(null)}
            title={activePaymentForModal.title}
            stage={activePaymentForModal.stage}
            amount={activePaymentForModal.amount}
            invoiceNumber={activePaymentForModal.invoice_number || 'INV-2026-RK'}
            onPaymentSuccess={(details) => {
              setActivePaymentForModal(null);
              setApplyToast(`Milestone payment of ₹${details.amount.toLocaleString('en-IN')} released successfully via ${details.method}!`);
              setTimeout(() => setApplyToast(null), 4000);
            }}
          />
        )}
      </div>
    </div>
  );
};
