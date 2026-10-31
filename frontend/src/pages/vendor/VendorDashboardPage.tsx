import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Vendor, Quotation } from '../../types';
import { RoyalLoader } from '../../components/ui/RoyalLoader';
import {
  ShieldCheck,
  Clock,
  ChefHat,
  Star,
  FileText,
  DollarSign,
  Send,
  Plus,
  CheckCircle2,
  AlertCircle,
  Camera,
  Sparkles,
  Music,
  Flame,
  Palette
} from 'lucide-react';

type VendorCategory = 'catering' | 'photography' | 'makeup' | 'decor' | 'entertainment' | 'mandap';

export const VendorDashboardPage: React.FC = () => {
  const { user, activeWeddingId } = useAuth();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active Category Workspace
  const [activeCategory, setActiveCategory] = useState<VendorCategory>('catering');

  // Category-specific Quote Builder State
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState(false);

  // 1. Catering specific
  const [cateringVegRate, setCateringVegRate] = useState(2400);
  const [cateringNonVegRate, setCateringNonVegRate] = useState(2800);
  const [cateringLiveCounters, setCateringLiveCounters] = useState(18);
  const [cateringTableware, setCateringTableware] = useState('Imperial Fine Bone China & Brass Chafing Dishes');

  // 2. Photography specific
  const [photoShootsCount, setPhotoShootsCount] = useState(4); // Pre-wedding, Haldi, Sangeet, Wedding
  const [photoCoverageHours, setPhotoCoverageHours] = useState(36);
  const [photoTeaserDays, setPhotoTeaserDays] = useState(7);
  const [photoAlbumDays, setPhotoAlbumDays] = useState(35);
  const [photoDroneEnabled, setPhotoDroneEnabled] = useState(true);

  // 3. Makeup specific
  const [makeupBridalPackage, setMakeupBridalPackage] = useState('Ultra HD Airbrush & Sabyasachi Drapery');
  const [makeupFamilyCount, setMakeupFamilyCount] = useState(6);
  const [makeupBrandTier, setMakeupBrandTier] = useState('Dior, Charlotte Tilbury, MAC Pro');

  // 4. Decor specific
  const [decorTheme, setDecorTheme] = useState('Royal Rajputana Heritage & Floating Rajwada Mandap');
  const [decorFlowerType, setDecorFlowerType] = useState('Fresh Exotic Marigolds, Orchids & Tuberoses');
  const [decorRigHours, setDecorRigHours] = useState(12);

  // 5. Entertainment specific
  const [djWattage, setDjWattage] = useState('20,000 Watts JBL VTX Line Array');
  const [djDholCount, setDjDholCount] = useState(4);
  const [djCurfewPermit, setDjCurfewPermit] = useState('Approved up to 10:00 PM (Acoustic indoor after)');

  // 6. Mandap / Pandit specific
  const [panditName, setPanditName] = useState('Acharya Vidyadhar Shastri (25+ Yrs Vedic Pheras)');
  const [panditLanguages, setPanditLanguages] = useState('Sanskrit, Hindi, Rajasthani, English');
  const [panditHavanType, setPanditHavanType] = useState('Pure Desi Ghee & Smoke-Free Indoor Palace Safe Kund');

  useEffect(() => {
    async function fetchVendorData() {
      setIsLoading(true);
      try {
        const vData = await api.getVendor('vendor-royal-mewar');
        const qData = await api.getWeddingQuotations(activeWeddingId);
        setVendor(vData);
        setQuotations(qData);
      } catch (err) {
        console.error('Error loading vendor portal data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchVendorData();
  }, [activeWeddingId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <RoyalLoader message="Accessing category-specific professional workspace and compliance records..." />
      </div>
    );
  }

  const handleDispatchCategoryQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSuccessMsg(true);
    setTimeout(() => setQuoteSuccessMsg(false), 5000);
  };

  return (
    <div className="bg-ivory min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="rounded-3xl bg-white border border-gold-300 p-6 sm:p-8 shadow-royal flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-700 bg-gold-50 px-3 py-0.5 rounded-full border border-gold-200">
                Wedding Professional Workspace
              </span>
              <span className="text-xs text-charcoal-400">Jaipur Hub</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
              {vendor?.business_name || 'Royal Mewar Caterers & Banquets'}
            </h1>
            <p className="text-xs text-charcoal-500 mt-1">
              Representative: {vendor?.representative_name || 'Vikramaditya Rathore'} • Category: {activeCategory.toUpperCase()} • {vendor?.experience_years} Years Standing
            </p>
          </div>

          <div className="flex items-center gap-3">
            {vendor?.verified_status === 'approved' ? (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 px-4 py-2.5 rounded-2xl text-emerald-900 text-xs shadow-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold block uppercase tracking-wider text-[10px]">Platform Trust Mark</span>
                  <span className="font-serif text-sm font-semibold">Verified by The Royal Knot</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 px-4 py-2.5 rounded-2xl text-amber-900 text-xs">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>Verification Under Review</span>
              </div>
            )}
          </div>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex flex-wrap gap-2 p-2 bg-white rounded-2xl border border-gold-300 shadow-sm">
          <button
            onClick={() => setActiveCategory('catering')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeCategory === 'catering'
                ? 'bg-burgundy-700 text-white shadow-sm'
                : 'bg-ivory-50 text-charcoal-700 hover:bg-gold-50'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Catering & Banquets</span>
          </button>

          <button
            onClick={() => setActiveCategory('photography')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeCategory === 'photography'
                ? 'bg-burgundy-700 text-white shadow-sm'
                : 'bg-ivory-50 text-charcoal-700 hover:bg-gold-50'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Photography & Cinema</span>
          </button>

          <button
            onClick={() => setActiveCategory('makeup')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeCategory === 'makeup'
                ? 'bg-burgundy-700 text-white shadow-sm'
                : 'bg-ivory-50 text-charcoal-700 hover:bg-gold-50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Bridal Makeup & Styling</span>
          </button>

          <button
            onClick={() => setActiveCategory('decor')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeCategory === 'decor'
                ? 'bg-burgundy-700 text-white shadow-sm'
                : 'bg-ivory-50 text-charcoal-700 hover:bg-gold-50'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Floral & Decor Artistry</span>
          </button>

          <button
            onClick={() => setActiveCategory('entertainment')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeCategory === 'entertainment'
                ? 'bg-burgundy-700 text-white shadow-sm'
                : 'bg-ivory-50 text-charcoal-700 hover:bg-gold-50'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>DJ & Live Entertainment</span>
          </button>

          <button
            onClick={() => setActiveCategory('mandap')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeCategory === 'mandap'
                ? 'bg-burgundy-700 text-white shadow-sm'
                : 'bg-ivory-50 text-charcoal-700 hover:bg-gold-50'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Mandap & Vedic Pandit</span>
          </button>
        </div>

        {/* Verification Credentials Card */}
        <div className="bg-white rounded-3xl border border-gold-300 p-6 shadow-royal">
          <h2 className="font-serif text-xl font-bold text-charcoal-800 mb-4 pb-2 border-b border-gold-200">
            Compliance & Verification Credentials ({activeCategory.toUpperCase()})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-ivory-50 border border-gold-200">
              <span className="text-charcoal-400 block mb-1">PAN / GST Registration</span>
              <span className="font-mono font-bold text-charcoal-800">{vendor?.pan_gst || '08AABCR1234F1Z1'}</span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-1">✓ Active State Filing</span>
            </div>
            <div className="p-4 rounded-xl bg-ivory-50 border border-gold-200">
              <span className="text-charcoal-400 block mb-1">Category License / Registration</span>
              <span className="font-mono font-bold text-charcoal-800">
                {activeCategory === 'catering'
                  ? 'FSSAI License 10018013001890'
                  : activeCategory === 'photography'
                  ? 'DGCA Drone Flight Clearance #TRK-DRN-902'
                  : activeCategory === 'entertainment'
                  ? 'IPRS & PPL Public Performance License'
                  : 'Rajasthan Heritage Guild Certification'}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-1">✓ Verified Grade A</span>
            </div>
            <div className="p-4 rounded-xl bg-ivory-50 border border-gold-200">
              <span className="text-charcoal-400 block mb-1">Escrow Payout Account</span>
              <span className="font-mono font-bold text-charcoal-800">HDFC Bank ••••••4019</span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-1">✓ Verified via Penny Drop</span>
            </div>
          </div>
        </div>

        {/* Dedicated Category Dashboard & Quotation Submitter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Quotes for Active Client */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gold-300 p-6 sm:p-8 shadow-royal">
            <h2 className="font-serif text-2xl font-bold text-charcoal-800 mb-2">
              Active Quotations & Deliverables ({activeCategory.toUpperCase()})
            </h2>
            <p className="text-xs text-charcoal-500 mb-6">
              Track your live client quotations for Aarav & Meera's Jaipur wedding.
            </p>

            <div className="space-y-4">
              {quotations.map((q) => (
                <div key={q.id} className="p-5 rounded-2xl bg-ivory-50 border border-gold-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base font-bold text-charcoal-900">
                      {q.package_description}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        q.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-charcoal-600 pt-2 border-t border-gold-100">
                    <div>
                      <span className="text-charcoal-400 block text-[10px]">Price Basis:</span>
                      <span className="font-bold text-burgundy-900">₹{q.price_per_unit.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-charcoal-400 block text-[10px]">Basis Count:</span>
                      <span className="font-bold text-charcoal-800">{q.guest_count} Units</span>
                    </div>
                    <div>
                      <span className="text-charcoal-400 block text-[10px]">Total Contract:</span>
                      <span className="font-bold text-charcoal-800">₹{q.total_amount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-charcoal-500 pt-1">
                    Terms: {q.payment_terms}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Category-Specific Quotation Form */}
          <div className="bg-white rounded-3xl border border-gold-300 p-6 shadow-royal flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal-800 mb-1">
                Dispatch {activeCategory.toUpperCase()} Quotation
              </h3>
              <p className="text-xs text-charcoal-500 mb-4">
                Structured quotation with category-specific line items and service SLAs.
              </p>

              {quoteSuccessMsg ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <p className="font-bold">Quotation Dispatched</p>
                  <p className="text-[11px] mt-1">Synchronized with Couple & Planner Dashboards.</p>
                </div>
              ) : (
                <form onSubmit={handleDispatchCategoryQuote} className="space-y-3 text-xs">
                  {/* Category 1: Catering Specific Fields */}
                  {activeCategory === 'catering' && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-semibold text-charcoal-700 mb-1">Veg / Plate (₹)</label>
                          <input
                            type="number"
                            value={cateringVegRate}
                            onChange={(e) => setCateringVegRate(parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-1.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-charcoal-700 mb-1">Non-Veg / Plate (₹)</label>
                          <input
                            type="number"
                            value={cateringNonVegRate}
                            onChange={(e) => setCateringNonVegRate(parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-1.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-charcoal-700 mb-1">Live Counters Count</label>
                        <input
                          type="number"
                          value={cateringLiveCounters}
                          onChange={(e) => setCateringLiveCounters(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-1.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-charcoal-700 mb-1">Tableware & Cutlery Tier</label>
                        <input
                          type="text"
                          value={cateringTableware}
                          onChange={(e) => setCateringTableware(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 text-[11px]"
                        />
                      </div>
                    </>
                  )}

                  {/* Category 2: Photography Specific Fields */}
                  {activeCategory === 'photography' && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-semibold text-charcoal-700 mb-1">Ceremonies Covered</label>
                          <input
                            type="number"
                            value={photoShootsCount}
                            onChange={(e) => setPhotoShootsCount(parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-1.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-charcoal-700 mb-1">Total Shoot Hours</label>
                          <input
                            type="number"
                            value={photoCoverageHours}
                            onChange={(e) => setPhotoCoverageHours(parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-1.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-semibold text-charcoal-700 mb-1">Teaser Video SLA</label>
                          <input
                            type="text"
                            value={`${photoTeaserDays} Days`}
                            onChange={(e) => setPhotoTeaserDays(parseInt(e.target.value) || 7)}
                            className="w-full px-3 py-1.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-charcoal-700 mb-1">Album Delivery</label>
                          <input
                            type="text"
                            value={`${photoAlbumDays} Days`}
                            onChange={(e) => setPhotoAlbumDays(parseInt(e.target.value) || 30)}
                            className="w-full px-3 py-1.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={photoDroneEnabled}
                          onChange={(e) => setPhotoDroneEnabled(e.target.checked)}
                          className="rounded text-burgundy-700"
                        />
                        <span className="text-[11px] font-medium text-charcoal-700">Include 4K Drone Aerial Pilot</span>
                      </label>
                    </>
                  )}

                  {/* Category 3: Makeup Specific Fields */}
                  {activeCategory === 'makeup' && (
                    <>
                      <div>
                        <label className="block font-semibold text-charcoal-700 mb-1">Bridal Package Specification</label>
                        <input
                          type="text"
                          value={makeupBridalPackage}
                          onChange={(e) => setMakeupBridalPackage(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-charcoal-700 mb-1">Family Members / Bridesmaids</label>
                        <input
                          type="number"
                          value={makeupFamilyCount}
                          onChange={(e) => setMakeupFamilyCount(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-1.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-charcoal-700 mb-1">Cosmetic Brand Tiers</label>
                        <input
                          type="text"
                          value={makeupBrandTier}
                          onChange={(e) => setMakeupBrandTier(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 text-[11px]"
                        />
                      </div>
                    </>
                  )}

                  {/* Category 4: Decor Specific Fields */}
                  {activeCategory === 'decor' && (
                    <>
                      <div>
                        <label className="block font-semibold text-charcoal-700 mb-1">Theme & Architectural Style</label>
                        <input
                          type="text"
                          value={decorTheme}
                          onChange={(e) => setDecorTheme(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-charcoal-700 mb-1">Floral Inclusions</label>
                        <input
                          type="text"
                          value={decorFlowerType}
                          onChange={(e) => setDecorFlowerType(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-charcoal-700 mb-1">On-Site Setup Hours Needed</label>
                        <input
                          type="number"
                          value={decorRigHours}
                          onChange={(e) => setDecorRigHours(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-1.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 font-bold"
                        />
                      </div>
                    </>
                  )}

                  {/* Category 5: Entertainment Specific Fields */}
                  {activeCategory === 'entertainment' && (
                    <>
                      <div>
                        <label className="block font-semibold text-charcoal-700 mb-1">Audio Rig & Console Specs</label>
                        <input
                          type="text"
                          value={djWattage}
                          onChange={(e) => setDjWattage(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-charcoal-700 mb-1">Baraat Dhol Artists Count</label>
                        <input
                          type="number"
                          value={djDholCount}
                          onChange={(e) => setDjDholCount(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-1.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-charcoal-700 mb-1">Sound Permit & Curfew Clearance</label>
                        <input
                          type="text"
                          value={djCurfewPermit}
                          onChange={(e) => setDjCurfewPermit(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 text-[11px]"
                        />
                      </div>
                    </>
                  )}

                  {/* Category 6: Mandap & Pandit Specific Fields */}
                  {activeCategory === 'mandap' && (
                    <>
                      <div>
                        <label className="block font-semibold text-charcoal-700 mb-1">Lead Officiant / Pandit</label>
                        <input
                          type="text"
                          value={panditName}
                          onChange={(e) => setPanditName(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-charcoal-700 mb-1">Linguistic Fluency</label>
                        <input
                          type="text"
                          value={panditLanguages}
                          onChange={(e) => setPanditLanguages(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-charcoal-700 mb-1">Havan Kund Palace Safety Protocol</label>
                        <input
                          type="text"
                          value={panditHavanType}
                          onChange={(e) => setPanditHavanType(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 text-[11px]"
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-sm mt-2"
                  >
                    Dispatch {activeCategory.toUpperCase()} Quotation
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
