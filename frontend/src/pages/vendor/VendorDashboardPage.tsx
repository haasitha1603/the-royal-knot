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
  AlertCircle
} from 'lucide-react';

export const VendorDashboardPage: React.FC = () => {
  const { user, activeWeddingId } = useAuth();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Quote Form State
  const [newQuoteRate, setNewQuoteRate] = useState(2800);
  const [newQuoteNotes, setNewQuoteNotes] = useState('Imperial Banquet: 18 Live Counters, Fine Bone China');
  const [quoteSubmittedMsg, setQuoteSubmittedMsg] = useState(false);

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
        <RoyalLoader message="Accessing vendor workspace and escrow records..." />
      </div>
    );
  }

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
              <span className="text-xs text-charcoal-400">Jaipur Central Kitchen</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
              {vendor?.business_name || 'Royal Mewar Caterers & Banquets'}
            </h1>
            <p className="text-xs text-charcoal-500 mt-1">
              Representative: {vendor?.representative_name || 'Vikramaditya Rathore'} • Category: {vendor?.category} • {vendor?.experience_years} Years Standing
            </p>
          </div>

          <div className="flex items-center gap-3">
            {vendor?.verified_status === 'approved' ? (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 px-4 py-2.5 rounded-2xl text-emerald-900 text-xs shadow-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold block uppercase tracking-wider text-[10px]">Platform Distinction</span>
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

        {/* Verification & Compliance Status Block */}
        <div className="bg-white rounded-3xl border border-gold-300 p-6 shadow-royal">
          <h2 className="font-serif text-xl font-bold text-charcoal-800 mb-4 pb-2 border-b border-gold-200">
            Compliance & Verification Credentials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-ivory-50 border border-gold-200">
              <span className="text-charcoal-400 block mb-1">PAN / GST Registration</span>
              <span className="font-mono font-bold text-charcoal-800">{vendor?.pan_gst || '08AABCR1234F1Z1'}</span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-1">✓ Active State Filing</span>
            </div>
            <div className="p-4 rounded-xl bg-ivory-50 border border-gold-200">
              <span className="text-charcoal-400 block mb-1">FSSAI Food Safety License</span>
              <span className="font-mono font-bold text-charcoal-800">10018013001890 (Valid till 2028)</span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-1">✓ Verified Banquet Grade</span>
            </div>
            <div className="p-4 rounded-xl bg-ivory-50 border border-gold-200">
              <span className="text-charcoal-400 block mb-1">Escrow Payout Account</span>
              <span className="font-mono font-bold text-charcoal-800">HDFC Bank ••••••4019</span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-1">✓ Verified via Penny Drop</span>
            </div>
          </div>
        </div>

        {/* Quotations & Enquiries Management */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gold-300 p-6 sm:p-8 shadow-royal">
            <h2 className="font-serif text-2xl font-bold text-charcoal-800 mb-2">
              Active Quotation Submissions
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
                      <span className="text-charcoal-400 block text-[10px]">Price / Plate:</span>
                      <span className="font-bold text-burgundy-900">₹{q.price_per_unit.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-charcoal-400 block text-[10px]">Guest Count:</span>
                      <span className="font-bold text-charcoal-800">{q.guest_count} Guests</span>
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

          {/* Quick Line-Item Quotation Submitter */}
          <div className="bg-white rounded-3xl border border-gold-300 p-6 shadow-royal flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal-800 mb-1">
                Dispatch Revised Quotation
              </h3>
              <p className="text-xs text-charcoal-500 mb-4">
                Submit an updated line-item quote for client evaluation.
              </p>

              {quoteSubmittedMsg ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <p className="font-bold">Quotation Successfully Dispatched</p>
                  <p className="text-[11px] mt-1">Synchronized with Couple & Planner Dashboards.</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setQuoteSubmittedMsg(true);
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="block font-semibold text-charcoal-700 mb-1">Price per Plate (INR)</label>
                    <input
                      type="number"
                      value={newQuoteRate}
                      onChange={(e) => setNewQuoteRate(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal-700 mb-1">Package Specification</label>
                    <textarea
                      rows={4}
                      value={newQuoteNotes}
                      onChange={(e) => setNewQuoteNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800"
                    />
                  </div>

                  <div className="bg-ivory-100 p-3 rounded-xl border border-gold-200 text-[11px] text-charcoal-600">
                    Calculated for 400 Guests: <strong>₹{(newQuoteRate * 400 * 1.18).toLocaleString('en-IN')}</strong> (incl. 18% GST).
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Submit Line-Item Quotation
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
