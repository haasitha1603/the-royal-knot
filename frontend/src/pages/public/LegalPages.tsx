import React, { useState } from 'react';
import { Shield, Trash2, CheckCircle2, FileText, Lock, AlertCircle } from 'lucide-react';

interface LegalPagesProps {
  initialTab?: 'privacy' | 'terms' | 'refund' | 'cancellation' | 'cookie' | 'deletion';
}

export const LegalPages: React.FC<LegalPagesProps> = ({ initialTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [deletionSubmitted, setDeletionSubmitted] = useState(false);
  const [deletionEmail, setDeletionEmail] = useState('');
  const [deletionReason, setDeletionReason] = useState('');

  const handleDeletionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDeletionSubmitted(true);
  };

  return (
    <div className="bg-ivory min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest font-bold text-gold-700 bg-gold-100/80 px-3 py-1 rounded-full border border-gold-300">
            Trust, Privacy & Legal Charter
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 mt-3 mb-2">
            Governance & Legal Policies
          </h1>
          <p className="text-xs text-charcoal-500">
            Compliant with the Digital Personal Data Protection Act (DPDP), Indian Information Technology Act, and Consumer Protection Regulations.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 border-b border-gold-200 pb-4">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'privacy'
                ? 'bg-burgundy-700 text-white shadow-sm'
                : 'bg-white text-charcoal-700 border border-gold-200 hover:border-gold-300'
            }`}
          >
            Privacy Policy
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'terms'
                ? 'bg-burgundy-700 text-white shadow-sm'
                : 'bg-white text-charcoal-700 border border-gold-200 hover:border-gold-300'
            }`}
          >
            Terms of Service
          </button>

          <button
            onClick={() => setActiveTab('refund')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'refund'
                ? 'bg-burgundy-700 text-white shadow-sm'
                : 'bg-white text-charcoal-700 border border-gold-200 hover:border-gold-300'
            }`}
          >
            Refund Policy
          </button>

          <button
            onClick={() => setActiveTab('cancellation')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'cancellation'
                ? 'bg-burgundy-700 text-white shadow-sm'
                : 'bg-white text-charcoal-700 border border-gold-200 hover:border-gold-300'
            }`}
          >
            Cancellation Policy
          </button>

          <button
            onClick={() => setActiveTab('cookie')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'cookie'
                ? 'bg-burgundy-700 text-white shadow-sm'
                : 'bg-white text-charcoal-700 border border-gold-200 hover:border-gold-300'
            }`}
          >
            Cookie Policy
          </button>

          <button
            onClick={() => setActiveTab('deletion')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'deletion'
                ? 'bg-charcoal-800 text-gold-300 shadow-sm'
                : 'bg-white text-charcoal-700 border border-gold-200 hover:border-gold-300'
            }`}
          >
            Data Deletion Request
          </button>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl border border-gold-300 p-8 sm:p-10 shadow-royal">
          {activeTab === 'privacy' && (
            <div className="space-y-6 text-xs text-charcoal-600 leading-relaxed">
              <h2 className="font-serif text-2xl font-bold text-charcoal-800">Privacy Policy</h2>
              <p className="text-[11px] text-charcoal-400">Effective Date: October 2026</p>

              <h4 className="font-serif text-base font-bold text-charcoal-800">1. Data Minimization & Collection</h4>
              <p>
                The Royal Knot collects only the minimum personal data required to personalize and manage your wedding. This includes names, wedding date, guest estimates, and destination preferences. We do not harvest extraneous biometric or financial data.
              </p>

              <h4 className="font-serif text-base font-bold text-charcoal-800">2. Vendor Verification Documents</h4>
              <p>
                Government identifiers, GSTIN credentials, PAN cards, and food safety licenses submitted by vendors for verification are strictly encrypted at rest and accessible only to authorized platform compliance administrators. They are never published or sold to third parties.
              </p>

              <h4 className="font-serif text-base font-bold text-charcoal-800">3. Zero Third-Party Advertising</h4>
              <p>
                We do not sell, rent, or monetize couple or guest data to third-party ad networks. Platform notifications are strictly transactional and directly tied to your active bookings, quotations, and operational schedule.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-6 text-xs text-charcoal-600 leading-relaxed">
              <h2 className="font-serif text-2xl font-bold text-charcoal-800">Terms of Service</h2>
              <p className="text-[11px] text-charcoal-400">Effective Date: October 2026</p>

              <h4 className="font-serif text-base font-bold text-charcoal-800">1. Role as an Ecosystem & Marketplace</h4>
              <p>
                The Royal Knot provides a digital coordination infrastructure and verified marketplace connecting couples with independent wedding professionals, palace venues, and on-site planners. Contracts executed between couples and vendors represent mutual agreements subject to our platform governance.
              </p>

              <h4 className="font-serif text-base font-bold text-charcoal-800">2. Prohibited Conduct & Integrity</h4>
              <p>
                Users agree not to submit fraudulent quotation records, fabricated reviews, or defamatory complaints. The Royal Knot reserves the right to suspend any vendor or planner account found misrepresenting qualifications or violating on-site contractual terms.
              </p>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-6 text-xs text-charcoal-600 leading-relaxed">
              <h2 className="font-serif text-2xl font-bold text-charcoal-800">Refund Policy</h2>
              <p className="text-[11px] text-charcoal-400">Effective Date: October 2026</p>

              <h4 className="font-serif text-base font-bold text-charcoal-800">1. Staged Milestone Escrow</h4>
              <p>
                Platform staged payments are held in simulated or authenticated escrow until each operational milestone is formally confirmed. If a vendor fails to deliver verified services, dispute investigations are initiated by platform administrators.
              </p>

              <h4 className="font-serif text-base font-bold text-charcoal-800">2. Transparent Refund Processing</h4>
              <p>
                Approved refunds are dispatched within 7 business days to the original payment source. Any statutory GST deductions required by Indian tax authorities will be transparently itemized with official credit notes.
              </p>
            </div>
          )}

          {activeTab === 'cancellation' && (
            <div className="space-y-6 text-xs text-charcoal-600 leading-relaxed">
              <h2 className="font-serif text-2xl font-bold text-charcoal-800">Cancellation Policy</h2>
              <p className="text-[11px] text-charcoal-400">Effective Date: October 2026</p>

              <h4 className="font-serif text-base font-bold text-charcoal-800">1. Palace Venue Bookings</h4>
              <p>
                Heritage palace venue bookings follow the individual heritage property's seasonal cancellation timelines. Cancellations received greater than 90 days prior to the first ceremony qualify for full advance rollover or partial retention per verified contract terms.
              </p>

              <h4 className="font-serif text-base font-bold text-charcoal-800">2. Vendor Contract Terminations</h4>
              <p>
                In the rare event that an on-site vendor is unable to perform due to verified emergency, The Royal Knot Concierge immediately provides replacement matching from our verified network without markup.
              </p>
            </div>
          )}

          {activeTab === 'cookie' && (
            <div className="space-y-6 text-xs text-charcoal-600 leading-relaxed">
              <h2 className="font-serif text-2xl font-bold text-charcoal-800">Cookie Policy</h2>
              <p className="text-[11px] text-charcoal-400">Effective Date: October 2026</p>

              <h4 className="font-serif text-base font-bold text-charcoal-800">1. Strict Consent Prior to Activation</h4>
              <p>
                We do not trigger optional analytics or preference cookies until you explicitly select 'Accept All' or configure custom choices in our Cookie Consent banner. Essential session tokens required for secure JWT authentication are exempt from marketing use.
              </p>
            </div>
          )}

          {activeTab === 'deletion' && (
            <div className="space-y-6 text-xs text-charcoal-600 leading-relaxed">
              <div>
                <h2 className="font-serif text-2xl font-bold text-charcoal-800">DPDP / GDPR Data Deletion Workflow</h2>
                <p className="text-xs text-charcoal-500 mt-1">
                  Exercise your statutory right to be forgotten. Once verified, all non-essential account profiles, guest lists, and communications are expunged from platform storage.
                </p>
              </div>

              {deletionSubmitted ? (
                <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-emerald-900">Deletion Request Registered</h4>
                  <p className="text-xs text-emerald-800 mt-1 mb-4">
                    Your formal request for {deletionEmail} has been logged in the Platform Administrator audit queue. You will receive an encrypted dispatch once processing is finalised.
                  </p>
                  <button
                    onClick={() => setDeletionSubmitted(false)}
                    className="text-xs text-emerald-900 underline font-semibold"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDeletionSubmit} className="space-y-4 max-w-lg bg-ivory-50 p-6 rounded-2xl border border-gold-200">
                  <div>
                    <label className="block font-semibold text-charcoal-700 mb-1">Account Registered Email</label>
                    <input
                      type="email"
                      required
                      value={deletionEmail}
                      onChange={(e) => setDeletionEmail(e.target.value)}
                      placeholder="e.g. couple@theroyalknot.com"
                      className="w-full px-3.5 py-2 rounded-xl border border-gold-300 bg-white text-charcoal-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal-700 mb-1">Scope of Request</label>
                    <select className="w-full px-3.5 py-2 rounded-xl border border-gold-300 bg-white text-charcoal-800">
                      <option>Complete Personal Data Deletion</option>
                      <option>Data Export Archive (.JSON)</option>
                      <option>Withdrawal of Marketing Consent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal-700 mb-1">Reason / Notes (Optional)</label>
                    <textarea
                      rows={3}
                      value={deletionReason}
                      onChange={(e) => setDeletionReason(e.target.value)}
                      placeholder="e.g. Wedding concluded; wishing to archive personal guest records."
                      className="w-full px-3.5 py-2 rounded-xl border border-gold-300 bg-white text-charcoal-800"
                    />
                  </div>

                  <div className="flex items-start gap-2 text-[11px] text-charcoal-500">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>Per legal requirements, verified tax invoices and concluded escrow receipts must be retained for statutory financial compliance.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-charcoal-800 hover:bg-charcoal-900 text-gold-300 font-semibold uppercase tracking-wider text-xs shadow-sm transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Submit Deletion Request</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
