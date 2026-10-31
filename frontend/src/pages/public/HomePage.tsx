import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  CalendarCheck,
  CreditCard,
  ChefHat,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Bell,
  CheckSquare,
  FileCheck2,
  Calendar,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Wedding, BudgetOverview, Task, Notification } from '../../types';
import { MouseEffectCard } from '../../components/ui/MouseEffectCard';
import { RadialOrbitalTimeline } from '../../components/ui/RadialOrbitalTimeline';

interface HomePageProps {
  onReopenCurtain?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onReopenCurtain }) => {
  const { user, activeWeddingId } = useAuth();
  const [wedding, setWedding] = useState<Wedding | null>(() => {
    const cached = localStorage.getItem('royal_knot_active_wedding');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return null;
  });
  const [budget, setBudget] = useState<BudgetOverview | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    async function loadConciseOverview() {
      try {
        const [wData, bData, tData, nData] = await Promise.all([
          api.getWedding(activeWeddingId),
          api.getBudgetOverview(activeWeddingId),
          api.getTasks(activeWeddingId),
          api.getNotifications()
        ]);
        const cached = localStorage.getItem('royal_knot_active_wedding');
        if (cached) {
          try {
            setWedding(JSON.parse(cached));
          } catch (e) {
            setWedding(wData);
          }
        } else {
          setWedding(wData);
        }
        setBudget(bData);
        setTasks(tData);
        setNotifications(nData);
      } catch (err) {
        console.error('Failed to load overview for homepage:', err);
      }
    }
    loadConciseOverview();
  }, [activeWeddingId]);

  // Days remaining calculation
  const targetDate = new Date(wedding?.wedding_date || '2026-11-21');
  const today = new Date();
  const diffDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 65;

  return (
    <div className="bg-ivory text-charcoal-700">
      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 border-b border-gold-200">
        {/* Soft Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
          <div className="absolute top-12 left-10 w-96 h-96 rounded-full bg-gold-200/30 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-burgundy-100/40 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Subtle Tag badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-50 border border-gold-300 text-gold-800 text-xs font-semibold uppercase tracking-widest mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>The Premier Indian Wedding Operations Ecosystem</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-charcoal-900 max-w-5xl mx-auto leading-tight mb-6">
            Where Royal Heritage Meets <br className="hidden sm:inline" />
            <span className="text-gold-gradient font-serif italic">Meticulous Execution</span>
          </h1>

          {/* Tagline */}
          <p className="font-serif italic text-xl sm:text-2xl text-charcoal-600 max-w-3xl mx-auto mb-6 font-medium">
            “Every detail connected. Every moment managed. Every wedding unforgettable.”
          </p>

          <p className="text-sm sm:text-base text-charcoal-500 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            From imperial palace discovery in Rajasthan to AI-grounded quotation comparison, staged financial tracking, and a live minute-by-minute wedding day operations command centre.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              to="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-burgundy-700 hover:bg-burgundy-800 text-white font-medium text-xs sm:text-sm uppercase tracking-wider shadow-royal transition-all duration-300 hover:scale-105 border border-gold-400/40"
            >
              <Sparkles className="w-4 h-4 text-gold-300" />
              <span>Begin Your Royal Journey</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/venues"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white hover:bg-gold-50 text-charcoal-800 font-medium text-xs sm:text-sm uppercase tracking-wider border border-gold-300 shadow-sm transition-all hover:border-gold-400"
            >
              <Compass className="w-4 h-4 text-gold-600" />
              <span>Explore Palace Venues</span>
            </Link>

            {onReopenCurtain && (
              <button
                onClick={onReopenCurtain}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs text-charcoal-500 hover:text-gold-700 underline transition-colors"
                title="View the ceremonial fabric entrance curtain"
              >
                <span>Replay Entrance Curtain</span>
              </button>
            )}
          </div>

          {/* Hero Showcase Photography Grid (Hand-holding / Wedding Traditions) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-royal border border-gold-200 group h-72 sm:h-80">
              <img
                src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80"
                alt="Imperial Indian Bride and Groom hands holding with wedding jewellery"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold-300">Imperial Traditions</span>
                  <h4 className="font-serif text-xl font-bold text-white">Vedic Ceremonies & Sacred Pheras</h4>
                </div>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-royal border border-gold-200 group h-72 sm:h-80">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
                alt="Rambagh Palace Jaipur illuminated"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold-300">Palace Residences</span>
                  <h4 className="font-serif text-xl font-bold text-white">Jaipur, Udaipur & Jodhpur</h4>
                </div>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-royal border border-gold-200 group h-72 sm:h-80">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
                alt="Royal Wedding Banquet & Floral Architecture"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold-300">Live Operations</span>
                  <h4 className="font-serif text-xl font-bold text-white">400+ Guests Flawlessly Managed</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTEGRATED WEDDING OVERVIEW ON HOMEPAGE
          Integrated directly into the home page so users do not have to navigate
          away to get a concise, actionable view of their celebration.
          ========================================================================= */}
      <section className="py-14 bg-gradient-to-b from-white via-ivory-50 to-white border-b border-gold-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-burgundy-50 border border-burgundy-200 text-burgundy-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                <HeartHandshake className="w-3.5 h-3.5 text-burgundy-700" />
                <span>Wedding Progress Command</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
                {wedding?.couple_names || 'Aarav Singhania & Meera Kapoor'}
              </h2>
              <p className="text-xs text-charcoal-500 mt-1">
                Rambagh Palace, Jaipur • {wedding?.ceremony_tradition || 'Hindu Traditional'} • {wedding?.estimated_guests || 400} Guests
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors"
              >
                <span>Full Couple Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/command-centre"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-ivory-100 hover:bg-gold-100 text-charcoal-800 text-xs font-semibold uppercase tracking-wider border border-gold-300 transition-colors"
              >
                <span>Operations</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar: Countdown, Progress, Budget, Approvals */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* 1. Countdown to Wedding Day */}
            <div className="p-5 rounded-2xl bg-white border border-gold-300 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-burgundy-50 border border-burgundy-200 flex items-center justify-center text-burgundy-800 shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="font-serif text-3xl font-bold text-burgundy-900 leading-none block">
                  {diffDays > 0 ? diffDays : 21}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-charcoal-500 font-semibold block mt-1">
                  Days to Wedding Muhurat
                </span>
                <span className="text-[10px] text-charcoal-400">Nov 20-22, 2026</span>
              </div>
            </div>

            {/* 2. Planning Progress */}
            <div className="p-5 rounded-2xl bg-white border border-gold-300 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-700 shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-serif text-2xl font-bold text-charcoal-900 leading-none">
                    {progressPercent}%
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    On Schedule
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-ivory-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-400 to-burgundy-700 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-charcoal-500 font-semibold block mt-1">
                  Overall Planning Milestones
                </span>
              </div>
            </div>

            {/* 3. Budget Overview */}
            <div className="p-5 rounded-2xl bg-white border border-gold-300 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-charcoal-900 leading-none block">
                  ₹{((budget?.total_committed || 1420000) / 100000).toFixed(1)}L / ₹{((wedding?.total_budget || 5000000) / 100000).toFixed(0)}L
                </span>
                <span className="text-[10px] uppercase tracking-wider text-charcoal-500 font-semibold block mt-1">
                  {budget?.spending_percentage || 28}% Budget Committed
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">₹35.8L Remaining in Escrow</span>
              </div>
            </div>

            {/* 4. Pending Approvals & Alerts */}
            <div className="p-5 rounded-2xl bg-white border border-gold-300 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-amber-900 leading-none block">
                  2 Pending
                </span>
                <span className="text-[10px] uppercase tracking-wider text-charcoal-500 font-semibold block mt-1">
                  Awaiting Couple Sign-off
                </span>
                <span className="text-[10px] text-amber-700 font-medium">Catering & Decor Contracts</span>
              </div>
            </div>
          </div>

          {/* Two-Column Overview: Functions Itinerary & Live Tasks/Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Column A: Upcoming Wedding Functions */}
            <div className="p-6 rounded-3xl bg-white border border-gold-300 shadow-royal">
              <div className="flex items-center justify-between pb-3 border-b border-gold-200 mb-4">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-burgundy-700" />
                  <h3 className="font-serif text-lg font-bold text-charcoal-800">
                    Ceremonies & Functions
                  </h3>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-gold-800 font-bold bg-gold-50 px-2 py-0.5 rounded border border-gold-200">
                  4 Scheduled
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-ivory-50 border border-gold-200 flex items-center justify-between">
                  <div>
                    <span className="font-serif text-sm font-bold text-charcoal-900 block">
                      Haldi & Phoolon Ki Holi
                    </span>
                    <span className="text-xs text-charcoal-500">
                      Friday, Nov 20, 2026 • 10:30 AM – 01:30 PM • Palace Gardens
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Confirmed
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-ivory-50 border border-gold-200 flex items-center justify-between">
                  <div>
                    <span className="font-serif text-sm font-bold text-charcoal-900 block">
                      Mehendi & Sangeet Gala
                    </span>
                    <span className="text-xs text-charcoal-500">
                      Friday, Nov 20, 2026 • 07:00 PM – 11:59 PM • Maharani Courtyard
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Confirmed
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-ivory-50 border border-gold-200 flex items-center justify-between">
                  <div>
                    <span className="font-serif text-sm font-bold text-charcoal-900 block">
                      Sacred Pheras & Nuptials
                    </span>
                    <span className="text-xs text-charcoal-500">
                      Saturday, Nov 21, 2026 • 04:30 PM – 08:30 PM • Imperial Baradari Mandap
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-burgundy-800 bg-burgundy-50 px-2 py-0.5 rounded-full border border-burgundy-200 font-bold">
                    Main Muhurat
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-ivory-50 border border-gold-200 flex items-center justify-between">
                  <div>
                    <span className="font-serif text-sm font-bold text-charcoal-900 block">
                      Grand Royal Banquet & Reception
                    </span>
                    <span className="text-xs text-charcoal-500">
                      Saturday, Nov 21, 2026 • 08:30 PM – Midnight • Grand Ballroom
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Confirmed
                  </span>
                </div>
              </div>
            </div>

            {/* Column B: Upcoming Tasks & Live Alerts */}
            <div className="p-6 rounded-3xl bg-white border border-gold-300 shadow-royal flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-gold-200 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-burgundy-700" />
                    <h3 className="font-serif text-lg font-bold text-charcoal-800">
                      Upcoming Tasks & Active Alerts
                    </h3>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-charcoal-500 font-bold bg-ivory-100 px-2 py-0.5 rounded border border-gold-200">
                    Real-time
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-900 block">
                        Action Required: Countersign Catering Agreement
                      </span>
                      <span className="text-amber-800">
                        Royal Mewar quote accepted for 400 guests (₹2,800/plate). Requires digital signature.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-ivory-50 border border-gold-200 text-xs flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-charcoal-800 block">
                        Guest Seating Allocation: Table #1 & #2 Complete
                      </span>
                      <span className="text-charcoal-500">
                        VIP dignitary tables finalized. 48 guests assigned to banquet tables.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-ivory-50 border border-gold-200 text-xs flex items-start gap-2.5">
                    <Bell className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-charcoal-800 block">
                        Sound Permit Approved
                      </span>
                      <span className="text-charcoal-500">
                        Jaipur district administration granted outdoor loudspeaker clearance up to 10:00 PM.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gold-100 flex items-center justify-between text-xs">
                <span className="text-charcoal-500">Wedding Coordinator: Ananya Sharma</span>
                <Link
                  to="/dashboard"
                  className="text-burgundy-700 hover:text-burgundy-900 font-semibold flex items-center gap-1"
                >
                  <span>Manage All Tasks</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          TWO CLEAR GET STARTED JOURNEYS
          ========================================================================= */}
      <section className="py-20 bg-white border-b border-gold-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest font-bold text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200">
              Personalized Journeys
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-800 mt-3">
              Crafted for Couples & Industry Masters
            </h2>
            <p className="text-sm text-charcoal-500 mt-2">
              Select your pathway into The Royal Knot ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Path 1: Plan a Wedding */}
            <MouseEffectCard
              badge="For Couples & Families"
              title="Plan Your Royal Wedding"
              description="Guided onboarding tailored to your date, guest count, auspicious traditions, and bespoke vision. Discover palace venues, evaluate verified quotations, and oversee your dream day."
              className="bg-ivory-50/70"
            >
              <ul className="space-y-2.5 text-xs text-charcoal-600 mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                  <span>Interactive multi-function planning (Haldi, Mehendi, Sangeet, Nuptials, Reception)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                  <span>Intelligent 3-way catering and banquet quotation comparison</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                  <span>Dynamic Budget Guardian with 60-guest impact simulations</span>
                </li>
              </ul>

              <Link
                to="/onboarding"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-burgundy-700 text-white font-medium text-xs uppercase tracking-wider hover:bg-burgundy-800 transition-colors shadow-sm"
              >
                <span>Enter Couple Onboarding</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </MouseEffectCard>

            {/* Path 2: Join as Wedding Professional */}
            <MouseEffectCard
              badge="For Planners & Vendors"
              title="Join as a Wedding Professional"
              description="Showcase your culinary banquets, floral artistry, photography cinema, or planning expertise to discerning couples across India and destination hubs."
              className="bg-cream-50/70"
            >
              <ul className="space-y-2.5 text-xs text-charcoal-600 mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy-600" />
                  <span>Rigorous verification protocol & ‘Verified by The Royal Knot’ trust mark</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy-600" />
                  <span>Category-specific profiles for Photography, Catering, Makeup, Decor, DJ, Mandap</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy-600" />
                  <span>Staged escrow milestone releases with clear audit trails</span>
                </li>
              </ul>

              <Link
                to="/register"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-charcoal-800 text-gold-200 font-medium text-xs uppercase tracking-wider hover:bg-charcoal-900 transition-colors shadow-sm"
              >
                <span>Register as a Professional</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </MouseEffectCard>
          </div>
        </div>
      </section>

      {/* The Regal Pathway Planning Milestones */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <RadialOrbitalTimeline />
      </section>

      {/* Five Core Pillars Showcase */}
      <section className="py-20 bg-ivory-100/70 border-t border-b border-gold-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest font-bold text-gold-700 bg-gold-100/80 px-3 py-1 rounded-full border border-gold-300">
              Integrated Capabilities
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-800 mt-3">
              Not Just a Dashboard — An End-to-End Agency
            </h2>
            <p className="text-sm text-charcoal-500 mt-2">
              Combining digital curation, market transparency, and military-grade on-site operational synchrony.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-gold-200 shadow-sm hover:shadow-royal transition-all">
              <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700 mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-800 mb-2">Palace Discovery</h3>
              <p className="text-xs text-charcoal-500 leading-relaxed">
                Filter verified venues by capacity, heritage classification, and budget with coordinate visualization.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gold-200 shadow-sm hover:shadow-royal transition-all">
              <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700 mb-4">
                <ChefHat className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-800 mb-2">Quotation Intelligence</h3>
              <p className="text-xs text-charcoal-500 leading-relaxed">
                Evaluate multi-vendor catering quotes on price-per-plate, live counters, waitstaff ratios, and hidden line items.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gold-200 shadow-sm hover:shadow-royal transition-all">
              <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700 mb-4">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-800 mb-2">Budget Guardian</h3>
              <p className="text-xs text-charcoal-500 leading-relaxed">
                Dynamic cost modeling that estimates +60 extra guest impacts and halts unapproved budget escalations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gold-200 shadow-sm hover:shadow-royal transition-all">
              <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700 mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-800 mb-2">Guest Architect</h3>
              <p className="text-xs text-charcoal-500 leading-relaxed">
                Track RSVP attendance, VIP status, dietary tags (satvik, vegan, jain), and visual seating table capacity constraints.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gold-200 shadow-sm hover:shadow-royal transition-all">
              <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700 mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-800 mb-2">Command Centre</h3>
              <p className="text-xs text-charcoal-500 leading-relaxed">
                Real-time minute-by-minute run of show. Simulate late vendor transit, identify cascades, and publish revisions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gold-200 shadow-sm hover:shadow-royal transition-all">
              <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-800 mb-2">Zero Dark Patterns</h3>
              <p className="text-xs text-charcoal-500 leading-relaxed">
                No fake timers, no fabricated reviews, transparent staged payment simulations, and rigorous GDPR/DPDP privacy deletion.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
