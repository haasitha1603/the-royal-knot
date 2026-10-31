import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar,
  Users,
  MapPin,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const MarriageRegistrationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'special_marriage' | 'hindu_marriage' | 'checklist'>('special_marriage');
  const [submittedInquiry, setSubmittedInquiry] = useState(false);
  const [consultForm, setConsultForm] = useState({
    coupleNames: 'Aarav Singhania & Meera Kapoor',
    cityJurisdiction: 'Jaipur, Rajasthan',
    targetDate: '2026-11-21',
    actType: 'Special Marriage Act, 1954',
    email: 'aarav@singhania.in',
    phone: '+91 98290 12345'
  });

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedInquiry(true);
  };

  return (
    <div className="bg-ivory text-charcoal-700 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-50 border border-gold-300 text-gold-800 text-xs font-semibold uppercase tracking-widest mb-4 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Civil & Legal Advisory</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-charcoal-900 leading-tight mb-3">
            Civil Marriage Registration Assistance
          </h1>
          <p className="font-serif italic text-lg sm:text-xl text-charcoal-600 max-w-2xl mx-auto mb-4">
            Navigating statutory marriage solemnization and Sub-Registrar protocols across Indian jurisdictions.
          </p>
          <p className="text-xs sm:text-sm text-charcoal-500 max-w-2xl mx-auto leading-relaxed">
            Essential documentation checklists, 30-day notice timelines, and administrative appointment facilitation for couples solemnizing interfaith, civil, or post-ceremonial registrations.
          </p>
        </div>

        {/* Mandatory Legal Disclaimer Banner */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950 space-y-1">
            <span className="font-bold uppercase tracking-wider text-[11px] block">
              Important Statutory Disclaimer
            </span>
            <p className="leading-relaxed">
              <strong>The Royal Knot is an administrative guidance and document facilitation concierge, not a legal authority or court registry.</strong> We assist couples in document readiness, affidavit drafting, and Sub-Registrar appointment scheduling. Legal marriage certificates are granted exclusively by the competent Government Marriage Officer / SDM pursuant to Indian statutory law.
            </p>
          </div>
        </div>

        {/* Tabs for Legal Acts */}
        <div className="flex border-b border-gold-200 gap-6 text-xs sm:text-sm font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('special_marriage')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'special_marriage'
                ? 'border-burgundy-700 text-burgundy-800 font-bold'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            Special Marriage Act, 1954
          </button>
          <button
            onClick={() => setActiveTab('hindu_marriage')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'hindu_marriage'
                ? 'border-burgundy-700 text-burgundy-800 font-bold'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            Hindu Marriage Act, 1955
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'checklist'
                ? 'border-burgundy-700 text-burgundy-800 font-bold'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            Mandatory Documents Checklist
          </button>
        </div>

        {/* Tab 1: Special Marriage Act */}
        {activeTab === 'special_marriage' && (
          <div className="bg-white rounded-3xl border border-gold-300 p-6 sm:p-8 shadow-royal space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-burgundy-800 bg-burgundy-50 px-2.5 py-1 rounded-full border border-burgundy-200">
                Civil / Interfaith Solemnization
              </span>
              <h2 className="font-serif text-2xl font-bold text-charcoal-800 mt-2">
                Special Marriage Act, 1954: Step-by-Step Roadmap
              </h2>
              <p className="text-xs text-charcoal-500 mt-1">
                Applicable to all Indian citizens and NRIs irrespective of religion, caste, or faith without requiring religious conversion.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-ivory-50 border border-gold-200 space-y-2">
                <span className="w-7 h-7 rounded-full bg-burgundy-700 text-white font-bold flex items-center justify-center text-xs">1</span>
                <h4 className="font-serif font-bold text-charcoal-800">30-Day Prior Notice</h4>
                <p className="text-charcoal-500 text-[11px] leading-relaxed">
                  Notice of Intended Marriage filed in the district where at least one partner has resided for at least 30 days.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-ivory-50 border border-gold-200 space-y-2">
                <span className="w-7 h-7 rounded-full bg-burgundy-700 text-white font-bold flex items-center justify-center text-xs">2</span>
                <h4 className="font-serif font-bold text-charcoal-800">Notice Publication</h4>
                <p className="text-charcoal-500 text-[11px] leading-relaxed">
                  Notice is affixed on the office notice board for a mandatory 30-day statutory objection period.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-ivory-50 border border-gold-200 space-y-2">
                <span className="w-7 h-7 rounded-full bg-burgundy-700 text-white font-bold flex items-center justify-center text-xs">3</span>
                <h4 className="font-serif font-bold text-charcoal-800">Solemnization & Vows</h4>
                <p className="text-charcoal-500 text-[11px] leading-relaxed">
                  Appearance before the Marriage Officer along with 3 adult witnesses carrying original identity proofs.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-ivory-50 border border-gold-200 space-y-2">
                <span className="w-7 h-7 rounded-full bg-burgundy-700 text-white font-bold flex items-center justify-center text-xs">4</span>
                <h4 className="font-serif font-bold text-charcoal-800">Certificate Issuance</h4>
                <p className="text-charcoal-500 text-[11px] leading-relaxed">
                  Government-issued Marriage Certificate entered in the Marriage Certificate Book signed by all parties.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Hindu Marriage Act */}
        {activeTab === 'hindu_marriage' && (
          <div className="bg-white rounded-3xl border border-gold-300 p-6 sm:p-8 shadow-royal space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-gold-800 bg-gold-50 px-2.5 py-1 rounded-full border border-gold-200">
                Post-Ceremonial Registration
              </span>
              <h2 className="font-serif text-2xl font-bold text-charcoal-800 mt-2">
                Hindu Marriage Act, 1955 Registration
              </h2>
              <p className="text-xs text-charcoal-500 mt-1">
                For couples who have already performed traditional religious rituals (Saptapadi / Pheras) and seek statutory civil legal certification.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-ivory-50 border border-gold-200 text-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-charcoal-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Prerequisites for Registration</span>
              </div>
              <ul className="space-y-1.5 text-charcoal-600 list-disc list-inside">
                <li>Performance of sacred rites, custom traditions, or Saptapadi (Seven Vows around the holy fire).</li>
                <li>Joint wedding photograph taken during the actual ceremony at the mandap.</li>
                <li>Wedding invitation card showing dates, family names, and banquet venue.</li>
                <li>Signed certificate from the officiating Vedic Pandit / Priest or venue hall authority.</li>
                <li>Presence of two adult witnesses who attended the ceremony.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Mandatory Document Checklist */}
        {activeTab === 'checklist' && (
          <div className="bg-white rounded-3xl border border-gold-300 p-6 sm:p-8 shadow-royal space-y-6">
            <h2 className="font-serif text-2xl font-bold text-charcoal-800">
              Statutory Documentation Checklist
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-ivory-50 border border-gold-200 space-y-2">
                <h4 className="font-bold text-charcoal-900 border-b border-gold-100 pb-1">
                  1. Age & Identity Proofs (Both Partners)
                </h4>
                <ul className="space-y-1 text-charcoal-600">
                  <li>• Valid Passport (mandatory for foreign nationals/NRIs)</li>
                  <li>• Aadhaar Card or Voter ID</li>
                  <li>• Birth Certificate or Class 10 Matriculation Certificate</li>
                  <li>• Minimum age: Bride 18+, Groom 21+</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-ivory-50 border border-gold-200 space-y-2">
                <h4 className="font-bold text-charcoal-900 border-b border-gold-100 pb-1">
                  2. Residential & Marital Status Proofs
                </h4>
                <ul className="space-y-1 text-charcoal-600">
                  <li>• Proof of residence within registrar district (&gt;30 days)</li>
                  <li>• Sworn Affidavits of Single/Unmarried status</li>
                  <li>• Certified copy of Divorce Decree (if previously married)</li>
                  <li>• Death Certificate of former spouse (if widowed)</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-ivory-50 border border-gold-200 space-y-2">
                <h4 className="font-bold text-charcoal-900 border-b border-gold-100 pb-1">
                  3. Three Adult Witnesses (Special Marriage Act)
                </h4>
                <ul className="space-y-1 text-charcoal-600">
                  <li>• 3 Witnesses of legal majority (Age 18+)</li>
                  <li>• Original Aadhaar Cards / Passports</li>
                  <li>• Passport size photographs of all 3 witnesses</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-ivory-50 border border-gold-200 space-y-2">
                <h4 className="font-bold text-charcoal-900 border-b border-gold-100 pb-1">
                  4. Photographic & Form Attestations
                </h4>
                <ul className="space-y-1 text-charcoal-600">
                  <li>• 6 Passport size photographs each (white background)</li>
                  <li>• Statutory application form signed by both parties</li>
                  <li>• Official fee receipt deposited at treasury/e-portal</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Concierge Legal Facilitation Booking Form */}
        <div className="bg-white rounded-3xl border border-gold-300 p-6 sm:p-8 shadow-royal">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200">
              Concierge Guidance Booking
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-800 mt-2 mb-2">
              Request Document Audit & Appointment Facilitation
            </h3>
            <p className="text-xs text-charcoal-500 mb-6">
              Our legal concierge team will verify your document readiness and assist with appointment booking at the Jaipur / relevant Sub-Registrar office.
            </p>

            {submittedInquiry ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-lg font-bold">Assistance Request Received</h4>
                <p>
                  A legal concierge specialist will contact <strong>{consultForm.email}</strong> within 24 business hours to conduct your preliminary document checklist audit.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-charcoal-700 mb-1">Couple Names</label>
                    <input
                      type="text"
                      required
                      value={consultForm.coupleNames}
                      onChange={(e) => setConsultForm({ ...consultForm, coupleNames: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-charcoal-700 mb-1">Registrar Jurisdiction</label>
                    <input
                      type="text"
                      required
                      value={consultForm.cityJurisdiction}
                      onChange={(e) => setConsultForm({ ...consultForm, cityJurisdiction: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-charcoal-700 mb-1">Applicable Statutory Act</label>
                    <select
                      value={consultForm.actType}
                      onChange={(e) => setConsultForm({ ...consultForm, actType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800"
                    >
                      <option value="Special Marriage Act, 1954">Special Marriage Act, 1954 (Civil / Interfaith)</option>
                      <option value="Hindu Marriage Act, 1955">Hindu Marriage Act, 1955 (Post-Ceremony)</option>
                      <option value="Foreign Marriage Act, 1969">Foreign Marriage Act, 1969 (NRI / International)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-charcoal-700 mb-1">Target Solemnization Date</label>
                    <input
                      type="date"
                      value={consultForm.targetDate}
                      onChange={(e) => setConsultForm({ ...consultForm, targetDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-burgundy-700 hover:bg-burgundy-800 text-white font-medium uppercase tracking-wider text-xs transition-colors shadow-sm"
                >
                  Submit Legal Concierge Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
