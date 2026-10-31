import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, ShieldCheck } from 'lucide-react';

export const FAQsPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does The Royal Knot verify palace venues and wedding vendors?",
      a: "Our verification team validates legal business registrations, PAN/GST records, food safety compliance (FSSAI for caterers), and historical client audit records before awarding the 'Verified by The Royal Knot' distinction. Private verification documents are strictly shielded and never exposed publicly."
    },
    {
      q: "What makes the Catering Quotation Comparison intelligent?",
      a: "Rather than simply sorting by the cheapest price-per-plate, our comparison evaluates the complete value proposition: total live counters (e.g. 18 vs 12), tableware quality (fine bone china vs melamine), staff-to-guest ratios (1:8 vs 1:12), GST transparency, and transport line items. This protects couples from unexpected day-of surcharges."
    },
    {
      q: "How does the Budget Guardian handle unexpected guest additions?",
      a: "If your family wishes to invite 60 extra guests, our system models the exact ripple effect across your accepted per-plate catering quotation (plus 18% GST), additional banquet seating arrangements, and personalized gifts. Crucially, the budget is never altered silently; a formal Budget Change Request requires planner or owner sign-off."
    },
    {
      q: "What happens during a wedding day delay in the Live Command Centre?",
      a: "If a decorator or caterer is held up by transit, the on-site coordinator records the delay (e.g. +30 mins). The Command Centre immediately flags dependent ceremonies (like Milni or Buffet Service), alerts responsible coordinators, and drafts a revised run of show that requires formal authorization before being published."
    },
    {
      q: "Are the payments real or simulated on this platform?",
      a: "To adhere to rigorous financial security and avoid dark patterns, we never store raw card numbers or CVV codes. Unless an authenticated production payment gateway is configured with verified merchant keys, our system operates a clearly labelled simulated escrow settlement workflow that stamps genuine immutable audit timestamps and transaction references."
    },
    {
      q: "Can I exercise my GDPR or Digital Personal Data Protection (DPDP) rights?",
      a: "Yes. You have full sovereignty over your wedding and identity records. You can submit a data export or complete deletion request through our Legal & Privacy centre, which is processed by our platform administrators in accordance with statutory retention regulations."
    }
  ];

  return (
    <div className="bg-ivory min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-gold-700 bg-gold-100/80 px-3 py-1 rounded-full border border-gold-300">
            Clear Answers
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal-900 mt-3 mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 leading-relaxed">
            Everything you need to know about our standards, governance, and technology.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gold-300 overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-ivory-50 transition-colors"
                >
                  <span className="font-serif text-base sm:text-lg font-bold text-charcoal-800">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gold-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-charcoal-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-charcoal-600 leading-relaxed border-t border-gold-100 bg-ivory-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
