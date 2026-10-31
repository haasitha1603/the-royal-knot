import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Couple',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-ivory min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest font-bold text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200">
            Dedicated Royal Service
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal-900 mt-3 mb-2">
            The Royal Knot Concierge
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 leading-relaxed">
            Our luxury wedding advisory and technical team is at your disposal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Business Details Card */}
          <div className="bg-white rounded-3xl border border-gold-300 p-8 shadow-royal flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-2xl font-bold text-charcoal-800 mb-2">Registered Concierge Office</h3>
              <p className="text-xs text-charcoal-500 mb-8">
                Operating under The Royal Knot Private Limited (Incorporated in India).
              </p>

              <div className="space-y-6 text-xs text-charcoal-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-charcoal-900 block">Registered Address</span>
                    <span>Palace Road, C-Scheme, Jaipur, Rajasthan 302001, India</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-charcoal-900 block">Direct Concierge Telephone</span>
                    <a href="tel:+911412899000" className="text-burgundy-800 font-bold hover:underline">
                      +91 141 289 9000
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-charcoal-900 block">Official Inquiries & Support</span>
                    <a href="mailto:concierge@theroyalknot.com" className="text-burgundy-800 font-bold hover:underline">
                      concierge@theroyalknot.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-charcoal-900 block">Concierge Hours</span>
                    <span>9:00 AM – 8:00 PM IST (Monday through Saturday)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gold-200 mt-8 flex items-center gap-2 text-xs text-gold-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Dedicated response SLA within 2 business hours.</span>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl border border-gold-300 p-8 shadow-royal">
            {submitted ? (
              <div className="p-8 text-center h-full flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-2xl font-bold text-charcoal-800 mb-2">Message Received</h4>
                <p className="text-xs text-charcoal-500 max-w-sm mb-6">
                  Thank you, {formData.name}. Our Senior Royal Concierge in Jaipur has been alerted and will connect via phone or secure dispatch.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 rounded-xl bg-burgundy-700 text-white text-xs font-semibold uppercase"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="font-serif text-xl font-bold text-charcoal-800 mb-4">Send a Confidential Dispatch</h3>

                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sanyukta Rathore"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-charcoal-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="sanyukta@sample.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-400"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-charcoal-700 mb-1">Contact Telephone</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98290 12345"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">You Are Joining As</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  >
                    <option value="Couple">Prospective Couple / Family</option>
                    <option value="Planner">Professional Wedding Planner</option>
                    <option value="Vendor">Vendor / Artisan Partner</option>
                    <option value="Venue">Palace or Estate Representative</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Message or Requirements</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your wedding date, destination preferences, or partnership inquiry..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-medium text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit to Concierge</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
