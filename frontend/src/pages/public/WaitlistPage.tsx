import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const WaitlistPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [destination, setDestination] = useState('Jaipur');
  const [weddingYear, setWeddingYear] = useState('2026 / 2027');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/thank-you');
  };

  return (
    <div className="bg-ivory min-h-screen py-16 flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto px-4">
        <div className="bg-white rounded-3xl border border-gold-300 p-8 sm:p-10 shadow-royal text-center">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-gold-400 mx-auto mb-3 shadow-sm ring-4 ring-gold-50 bg-white p-1">
            <img
              src="/royal-knot-logo.png"
              alt="The Royal Knot"
              className="w-full h-full object-contain"
            />
          </div>

          <span className="font-cursive text-3xl font-bold text-burgundy-900 block leading-tight">
            The Royal Knot
          </span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-gold-700 block mb-3">
            Exclusive Heritage Registry
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 mt-1 mb-2">
            Join The Royal Knot Private Registry
          </h1>

          <p className="font-serif italic text-base text-charcoal-600 mb-6">
            “Every detail connected. Every moment managed. Every wedding unforgettable.”
          </p>

          <p className="text-xs text-charcoal-500 mb-8 leading-relaxed max-w-md mx-auto">
            Receive invitation-only previews of seasonal palace venue slots, private chef tastings in Rajasthan, and prioritized concierge assignments.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs max-w-md mx-auto">
            <div>
              <label className="block font-semibold text-charcoal-700 mb-1">Confidential Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="couple@royalmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Target Destination</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800"
                >
                  <option value="Jaipur">Jaipur Heritage</option>
                  <option value="Udaipur">Udaipur Lakes</option>
                  <option value="Jodhpur">Jodhpur Sun Palace</option>
                  <option value="Goa">Goa Coastal</option>
                  <option value="International">International</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Expected Year</label>
                <select
                  value={weddingYear}
                  onChange={(e) => setWeddingYear(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800"
                >
                  <option value="2026 / 2027">Late 2026 / 2027</option>
                  <option value="2027">2027 / 2028</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 text-[11px] text-charcoal-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>We never share registry details with external marketing brokers.</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-medium text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-300" />
              <span>Request Private Registry Entry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const ThankYouPage: React.FC = () => {
  return (
    <div className="bg-ivory min-h-screen py-20 flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto px-4 text-center">
        <div className="bg-white rounded-3xl border border-gold-300 p-8 sm:p-12 shadow-royal">
          <div className="w-20 h-20 rounded-full overflow-hidden border border-gold-400 mx-auto mb-4 shadow-sm ring-4 ring-gold-50 bg-white p-1">
            <img
              src="/royal-knot-logo.png"
              alt="The Royal Knot"
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="font-cursive text-5xl sm:text-6xl font-bold text-burgundy-900 mb-2 leading-tight">
            The Royal Knot
          </h1>

          <p className="text-[11px] uppercase tracking-widest font-bold text-gold-700 mb-3">
            With Immense Honor & Gratitude
          </p>

          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto my-3" />

          <h2 className="font-serif italic text-xl text-burgundy-800 mb-4 font-semibold">
            We Thank You for Your Auspicious Trust
          </h2>

          <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed mb-8 max-w-sm mx-auto">
            Your dispatch has been registered within the royal registry. Our Senior Jaipur Concierge has been allocated to oversee your bespoke requirements.
          </p>

          <div className="space-y-3">
            <a
              href="/dashboard"
              className="block w-full py-3 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-medium text-xs uppercase tracking-wider shadow-sm transition-colors"
            >
              Open Demonstration Dashboard
            </a>
            <a
              href="/"
              className="block w-full py-2.5 rounded-xl bg-ivory-100 hover:bg-gold-50 text-charcoal-700 text-xs font-semibold uppercase tracking-wider transition-colors border border-gold-200"
            >
              Return to Grand Foyer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
