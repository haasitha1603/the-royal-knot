import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Vendor } from '../../types';
import { RoyalLoader } from '../../components/ui/RoyalLoader';
import {
  Search,
  Star,
  ShieldCheck,
  Award,
  MapPin,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Layers,
  X
} from 'lucide-react';

export const VendorsPage: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForComparison, setSelectedForComparison] = useState<Vendor[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [enquiryVendor, setEnquiryVendor] = useState<Vendor | null>(null);
  const [enquirySent, setEnquirySent] = useState(false);

  const categories = [
    'All',
    'Caterers',
    'Decorators',
    'Photographers',
    'Planners',
    'Entertainment'
  ];

  useEffect(() => {
    async function fetchVendors() {
      setIsLoading(true);
      try {
        const data = await api.getVendors({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
        });
        setVendors(data);
      } catch (err) {
        console.error('Error fetching vendors:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchVendors();
  }, [selectedCategory]);

  const filtered = vendors.filter(v =>
    v.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCompare = (vendor: Vendor) => {
    if (selectedForComparison.find(v => v.id === vendor.id)) {
      setSelectedForComparison(selectedForComparison.filter(v => v.id !== vendor.id));
    } else {
      if (selectedForComparison.length >= 3) {
        alert("You can compare up to 3 vendors simultaneously.");
        return;
      }
      setSelectedForComparison([...selectedForComparison, vendor]);
    }
  };

  return (
    <div className="bg-ivory min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest font-bold text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200">
            Curated Artisans & Masters
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal-900 mt-3 mb-2">
            The Royal Knot Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 leading-relaxed">
            Every professional passes our compliance and culinary/artistic standards before earning the ‘Verified by The Royal Knot’ trust emblem.
          </p>
        </div>

        {/* Category Pills & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-burgundy-700 text-white shadow-sm'
                    : 'bg-white text-charcoal-700 border border-gold-200 hover:border-gold-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vendors by name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gold-200 bg-white text-charcoal-800 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>
        </div>

        {/* Floating Compare Drawer trigger if vendors selected */}
        {selectedForComparison.length > 0 && (
          <div className="fixed bottom-6 right-6 z-40 bg-white rounded-2xl border-2 border-gold-400 shadow-royal-lg p-4 flex items-center gap-4 animate-in slide-in-from-bottom duration-300">
            <div>
              <p className="text-xs font-bold text-charcoal-800">{selectedForComparison.length} Vendors Shortlisted</p>
              <p className="text-[11px] text-charcoal-500">Ready for side-by-side comparison</p>
            </div>
            <button
              onClick={() => setShowComparisonModal(true)}
              className="px-4 py-2 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Compare Now
            </button>
            <button
              onClick={() => setSelectedForComparison([])}
              className="text-xs text-charcoal-400 hover:text-charcoal-700"
            >
              Clear
            </button>
          </div>
        )}

        {/* Vendor Grid */}
        {isLoading ? (
          <div className="py-20">
            <RoyalLoader message="Accessing verified vendor profiles and portfolio archives..." />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gold-200 p-8">
            <p className="font-serif text-lg text-charcoal-700">No wedding professionals found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((vendor) => {
              const isComparing = selectedForComparison.some(v => v.id === vendor.id);
              const isApproved = vendor.verified_status === 'approved';

              return (
                <div
                  key={vendor.id}
                  className="bg-white rounded-3xl border border-gold-300/80 overflow-hidden shadow-royal hover:shadow-royal-lg transition-all group flex flex-col justify-between"
                >
                  <div>
                    {/* Image Header */}
                    <div className="relative h-48 overflow-hidden bg-ivory-200">
                      <img
                        src={vendor.portfolio_urls_json[0] || 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80'}
                        alt={vendor.business_name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-charcoal-800 border border-gold-200">
                          {vendor.category}
                        </span>
                        {vendor.is_sample && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-100 text-gold-900 border border-gold-300">
                            Sample
                          </span>
                        )}
                      </div>

                      {/* Verification Status Emblem (Section 5.6) */}
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                        {isApproved ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-emerald-800 border border-emerald-300 shadow-sm backdrop-blur-sm">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Verified by The Royal Knot</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50/95 text-amber-800 border border-amber-300 shadow-sm">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Verification Under Review</span>
                          </span>
                        )}
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-charcoal-900/80 text-gold-300 backdrop-blur-sm">
                          {vendor.price_range}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-serif text-xl font-bold text-charcoal-900 group-hover:text-burgundy-800 transition-colors">
                          {vendor.business_name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs font-bold text-charcoal-800 bg-gold-50 px-2 py-0.5 rounded border border-gold-200 shrink-0">
                          <Star className="w-3 h-3 text-gold-500 fill-current" />
                          <span>{vendor.rating}</span>
                          <span className="text-[10px] text-charcoal-400 font-normal">({vendor.review_count})</span>
                        </div>
                      </div>

                      <p className="text-xs text-charcoal-500 mb-2">
                        Led by <span className="font-medium text-charcoal-700">{vendor.representative_name}</span> • {vendor.experience_years} Years Heritage
                      </p>

                      <p className="text-xs text-charcoal-600 line-clamp-3 leading-relaxed mb-4">
                        {vendor.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 pt-0 border-t border-gold-100 flex items-center justify-between gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => toggleCompare(vendor)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                        isComparing
                          ? 'border-burgundy-700 bg-burgundy-50 text-burgundy-900 font-semibold'
                          : 'border-gold-200 text-charcoal-600 hover:border-gold-300'
                      }`}
                    >
                      {isComparing ? '✓ Comparing' : '+ Compare'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEnquiryVendor(vendor);
                        setEnquirySent(false);
                      }}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                    >
                      <span>Request Quote</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Side-by-Side Comparison Modal */}
        {showComparisonModal && selectedForComparison.length > 0 && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-gold-300 p-6 shadow-royal-lg">
              <div className="flex items-center justify-between pb-4 border-b border-gold-200 mb-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-charcoal-800">Side-by-Side Vendor Evaluation</h3>
                  <p className="text-xs text-charcoal-500">Objective analysis based on verified platform records</p>
                </div>
                <button
                  onClick={() => setShowComparisonModal(false)}
                  className="p-1 rounded-full text-charcoal-400 hover:text-charcoal-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {selectedForComparison.map((v) => (
                  <div key={v.id} className="bg-ivory-50 rounded-2xl p-4 border border-gold-200 text-xs space-y-3">
                    <h4 className="font-serif text-lg font-bold text-charcoal-900">{v.business_name}</h4>
                    <p className="text-charcoal-500 font-medium">Category: {v.category}</p>
                    <div className="flex justify-between border-b border-gold-200/60 pb-1.5">
                      <span className="text-charcoal-400">Experience:</span>
                      <span className="font-semibold text-charcoal-800">{v.experience_years} Years</span>
                    </div>
                    <div className="flex justify-between border-b border-gold-200/60 pb-1.5">
                      <span className="text-charcoal-400">Rating:</span>
                      <span className="font-semibold text-emerald-800">{v.rating} / 5.0</span>
                    </div>
                    <div className="flex justify-between border-b border-gold-200/60 pb-1.5">
                      <span className="text-charcoal-400">Price Tier:</span>
                      <span className="font-semibold text-burgundy-800">{v.price_range}</span>
                    </div>
                    <div className="flex justify-between border-b border-gold-200/60 pb-1.5">
                      <span className="text-charcoal-400">Verification:</span>
                      <span className="font-bold text-emerald-700 capitalize">{v.verified_status}</span>
                    </div>
                    <p className="text-charcoal-600 italic">{v.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Request Quotation Modal */}
        {enquiryVendor && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-white rounded-3xl border border-gold-300 p-6 shadow-royal-lg">
              <div className="flex items-center justify-between pb-3 border-b border-gold-200 mb-4">
                <h4 className="font-serif text-xl font-bold text-charcoal-800">
                  Request Quotation: {enquiryVendor.business_name}
                </h4>
                <button
                  onClick={() => setEnquiryVendor(null)}
                  className="p-1 rounded-full text-charcoal-400 hover:text-charcoal-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {enquirySent ? (
                <div className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h5 className="font-serif text-lg font-bold text-emerald-900">Enquiry Dispatched</h5>
                  <p className="text-xs text-charcoal-600 mt-1 mb-4">
                    Your request has been routed to {enquiryVendor.representative_name}. Itemized line-item quotations will appear in your Wedding Dashboard.
                  </p>
                  <button
                    onClick={() => setEnquiryVendor(null)}
                    className="px-6 py-2 rounded-xl bg-burgundy-700 text-white text-xs font-semibold uppercase"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setEnquirySent(true);
                  }}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="block font-semibold text-charcoal-700 mb-1">Expected Guests</label>
                    <input
                      type="number"
                      defaultValue={400}
                      className="w-full px-3 py-2 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-charcoal-700 mb-1">Specific Ceremony / Requirements</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Royal Buffet with 18 live counters for 400 guests, Dal Baati Churma & Awadhi live stations..."
                      className="w-full px-3 py-2 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-charcoal-400">
                    The vendor will be required to provide transparent line-item pricing, GST inclusions, and staff ratios.
                  </p>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-semibold uppercase tracking-wider text-xs"
                  >
                    Submit Quotation Request
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
