import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ivory-200 border-t border-gold-300/80 text-charcoal-700 pt-16 pb-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          {/* Brand Info with Provided Logo & Fancy Cursive Typography */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-gold-400 flex items-center justify-center shadow-sm shrink-0 bg-white p-0.5">
                <img
                  src="/royal-knot-logo.png"
                  alt="The Royal Knot"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-cursive text-3xl font-bold text-charcoal-800 block leading-none pt-0.5">
                  The Royal Knot
                </span>
                <span className="text-[8px] tracking-[0.3em] uppercase text-gold-700 font-medium block mt-0.5">
                  Luxury Indian Weddings
                </span>
              </div>
            </Link>

            <p className="font-serif italic text-base text-charcoal-600 max-w-sm">
              “Every detail connected. Every moment managed. Every wedding unforgettable.”
            </p>

            <p className="text-xs text-charcoal-500 leading-relaxed max-w-sm">
              India’s premier bespoke wedding agency and real-time operations command platform. Dedicated to the authentic traditions, architectural grandeur, and meticulous execution of royal celebrations.
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs text-gold-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verified Indian Wedding Marketplace & Escrow Protocol</span>
            </div>
          </div>

          {/* Palace Destinations & Venues */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-charcoal-900 mb-4 pb-1 border-b border-gold-300/60">
              Royal Venues
            </h4>
            <ul className="space-y-2.5 text-xs text-charcoal-600">
              <li>
                <Link to="/venues?city=Jaipur" className="hover:text-burgundy-700 transition-colors">
                  Jaipur Heritage Palaces
                </Link>
              </li>
              <li>
                <Link to="/venues?city=Udaipur" className="hover:text-burgundy-700 transition-colors">
                  Udaipur Lakefront Domes
                </Link>
              </li>
              <li>
                <Link to="/venues?city=Jodhpur" className="hover:text-burgundy-700 transition-colors">
                  Jodhpur Sandstone Fortresses
                </Link>
              </li>
              <li>
                <Link to="/destination" className="hover:text-burgundy-700 transition-colors">
                  Goa Beachside Celebrations
                </Link>
              </li>
              <li>
                <Link to="/destination" className="hover:text-burgundy-700 transition-colors">
                  International Royal Escapes
                </Link>
              </li>
            </ul>
          </div>

          {/* Planning & Management */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-charcoal-900 mb-4 pb-1 border-b border-gold-300/60">
              Wedding Systems
            </h4>
            <ul className="space-y-2.5 text-xs text-charcoal-600">
              <li>
                <Link to="/onboarding" className="hover:text-burgundy-700 transition-colors">
                  Plan a Wedding
                </Link>
              </li>
              <li>
                <Link to="/marriage-registration" className="hover:text-burgundy-700 transition-colors font-semibold text-burgundy-900">
                  Marriage Registration
                </Link>
              </li>
              <li>
                <Link to="/vendors" className="hover:text-burgundy-700 transition-colors">
                  Curated Marketplace
                </Link>
              </li>
              <li>
                <Link to="/command-centre" className="hover:text-burgundy-700 transition-colors font-medium text-burgundy-800">
                  Live Operations Command
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-burgundy-700 transition-colors">
                  Budget Guardian
                </Link>
              </li>
              <li>
                <Link to="/guests" className="hover:text-burgundy-700 transition-colors">
                  Guest & Seating Architect
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-burgundy-700 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-burgundy-700 transition-colors">
                  Platform FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Registered Business */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-charcoal-900 mb-4 pb-1 border-b border-gold-300/60">
              Royal Concierge
            </h4>
            <ul className="space-y-3 text-xs text-charcoal-600">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                <span>Palace Road, C-Scheme, Jaipur, Rajasthan 302001, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-600 shrink-0" />
                <a href="tel:+911412899000" className="hover:text-burgundy-700">
                  +91 141 289 9000
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-600 shrink-0" />
                <a href="mailto:concierge@theroyalknot.com" className="hover:text-burgundy-700">
                  concierge@theroyalknot.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-600 shrink-0" />
                <span>9:00 AM – 8:00 PM IST (Mon – Sat)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal, Privacy & Transparency Bar */}
        <div className="pt-8 border-t border-gold-300/60 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-charcoal-500">
          <div>
            © {new Date().getFullYear()} The Royal Knot. All rights reserved. Registered under the Indian Companies Act.
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-burgundy-700 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms-of-service" className="hover:text-burgundy-700 transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link to="/refund-policy" className="hover:text-burgundy-700 transition-colors">
              Refund Policy
            </Link>
            <span>•</span>
            <Link to="/cancellation-policy" className="hover:text-burgundy-700 transition-colors">
              Cancellation Policy
            </Link>
            <span>•</span>
            <Link to="/cookie-policy" className="hover:text-burgundy-700 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
