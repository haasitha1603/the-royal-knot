import React from 'react';
import { Link } from 'react-router-dom';
import {
  Crown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  Building,
  Users,
  CalendarCheck,
  CreditCard,
  ChefHat,
  Camera,
  Music,
  Heart,
  DoorOpen
} from 'lucide-react';
import { MouseEffectCard } from '../../components/ui/MouseEffectCard';
import { RadialOrbitalTimeline } from '../../components/ui/RadialOrbitalTimeline';

interface HomePageProps {
  onReopenCurtain?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onReopenCurtain }) => {
  return (
    <div className="bg-ivory text-charcoal-700">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 border-b border-gold-200">
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
          <p className="font-serif italic text-xl sm:text-2xl text-charcoal-600 max-w-3xl mx-auto mb-8 font-medium">
            “Every detail connected. Every moment managed. Every wedding unforgettable.”
          </p>

          <p className="text-sm sm:text-base text-charcoal-500 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            From imperial palace discovery in Rajasthan to AI-grounded quotation comparison, staged financial tracking, and a live minute-by-minute wedding day operations command centre.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              to="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-burgundy-700 hover:bg-burgundy-800 text-white font-medium text-xs sm:text-sm uppercase tracking-wider shadow-royal transition-all duration-300 hover:scale-105 border border-gold-400/40"
            >
              <Crown className="w-4 h-4 text-gold-300" />
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
                <DoorOpen className="w-3.5 h-3.5" />
                <span>Replay Entrance Curtain</span>
              </button>
            )}
          </div>

          {/* Hero Showcase Photography Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-royal border border-gold-200 group h-72 sm:h-80">
              <img
                src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80"
                alt="Imperial Indian Bride in Red & Gold"
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

      {/* Two Clear Get Started Journeys (Section 3.4) */}
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
                  <span>Direct client enquiry management and itemized quotation submissions</span>
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

      {/* The Regal Pathway Planning Milestones (Section 6.2) */}
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
                Filter verified venues by capacity, heritage classification, and budget with OpenStreetMap coordinate visualization.
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

      {/* Featured Demonstration Scenario Callout (Section 18) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-ivory-100 via-cream-100 to-ivory-100 border border-gold-300 p-8 sm:p-12 shadow-royal flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-widest font-bold text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200">
                Live Demonstration Scenario
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-800 mt-3 mb-2">
                Jaipur Grand Royal Wedding: Aarav & Meera (400 Guests)
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed mb-4">
                Experience the complete live scenario: compare 3 catering quotations at Rambagh Palace, simulate a 30-minute vendor delay cascading into the schedule, evaluate the financial impact of 60 extra guests, and review administrator vendor verification queues.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gold-800">
                <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-gold-200">
                  <CalendarCheck className="w-3.5 h-3.5 text-gold-600" />
                  Nov 20-22, 2026
                </span>
                <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-gold-200">
                  <Users className="w-3.5 h-3.5 text-gold-600" />
                  400 Guests Basis
                </span>
                <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-gold-200">
                  <CreditCard className="w-3.5 h-3.5 text-gold-600" />
                  ₹50 Lakh Budget
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-burgundy-700 text-white font-medium text-xs uppercase tracking-wider hover:bg-burgundy-800 transition-colors shadow-sm"
              >
                <span>Launch Couple Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/command-centre"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-charcoal-800 font-medium text-xs uppercase tracking-wider border border-gold-300 hover:bg-gold-50 transition-colors"
              >
                <span>Live Command Centre</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
