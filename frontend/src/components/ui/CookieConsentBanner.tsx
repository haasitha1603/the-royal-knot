import React, { useState, useEffect } from 'react';
import { Shield, Settings, Check, X } from 'lucide-react';

export const CookieConsentBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const [marketingAllowed, setMarketingAllowed] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('royal_knot_cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const settings = { necessary: true, analytics: true, marketing: true };
    localStorage.setItem('royal_knot_cookie_consent', JSON.stringify(settings));
    setShowBanner(false);
  };

  const handleRejectOptional = () => {
    const settings = { necessary: true, analytics: false, marketing: false };
    localStorage.setItem('royal_knot_cookie_consent', JSON.stringify(settings));
    setShowBanner(false);
  };

  const handleSaveCustom = () => {
    const settings = { necessary: true, analytics: analyticsAllowed, marketing: marketingAllowed };
    localStorage.setItem('royal_knot_cookie_consent', JSON.stringify(settings));
    setShowPreferences(false);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:max-w-xl z-50 rounded-2xl bg-white/95 backdrop-blur-md border border-gold-300 p-5 shadow-royal-lg animate-in fade-in slide-in-from-bottom duration-300">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700 shrink-0 mt-0.5">
          <Shield className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h4 className="font-serif text-base font-bold text-charcoal-800">Privacy & Cookie Preferences</h4>
          <p className="text-xs text-charcoal-500 mt-1 leading-relaxed">
            The Royal Knot uses essential cookies to safeguard authentication and session security. With your consent, we also use non-intrusive analytical preferences to enhance your royal planning experience.
          </p>

          {showPreferences && (
            <div className="my-3 space-y-2 pt-2 border-t border-gold-200">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-charcoal-800">Essential Platform Cookies</span>
                  <p className="text-[11px] text-charcoal-400">Required for authentication, CSRF, and security tokens.</p>
                </div>
                <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Always Active</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-charcoal-800">Anonymous Experience Analytics</span>
                  <p className="text-[11px] text-charcoal-400">Helps us refine venue maps and budget calculator speed.</p>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsAllowed}
                  onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                  className="rounded text-burgundy-700 focus:ring-gold-400 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-charcoal-800">Personalized Vendor Recommendations</span>
                  <p className="text-[11px] text-charcoal-400">Tailors curated quotes based on selected wedding destinations.</p>
                </div>
                <input
                  type="checkbox"
                  checked={marketingAllowed}
                  onChange={(e) => setMarketingAllowed(e.target.checked)}
                  className="rounded text-burgundy-700 focus:ring-gold-400 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-4">
            {showPreferences ? (
              <button
                type="button"
                onClick={handleSaveCustom}
                className="px-3.5 py-1.5 rounded-lg bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-semibold uppercase tracking-wider transition-all"
              >
                Save My Preferences
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-3.5 py-1.5 rounded-lg bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-semibold uppercase tracking-wider transition-all"
                >
                  Accept All
                </button>
                <button
                  type="button"
                  onClick={handleRejectOptional}
                  className="px-3.5 py-1.5 rounded-lg bg-ivory-200 hover:bg-gold-100 text-charcoal-700 text-xs font-medium transition-all"
                >
                  Reject Optional
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreferences(true)}
                  className="px-2.5 py-1.5 text-xs text-gold-700 hover:text-gold-900 underline flex items-center gap-1"
                >
                  <Settings className="w-3 h-3" />
                  Customize
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
