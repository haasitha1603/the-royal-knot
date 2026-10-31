import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  X,
  Sparkles,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  HeartHandshake
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, loginAsRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const activeWedding = (() => {
    try {
      return JSON.parse(localStorage.getItem('royal_knot_active_wedding') || 'null');
    } catch (e) {
      return null;
    }
  })();

  const isActive = (path: string) => location.pathname === path;

  const handleRoleSwitch = async (role: 'couple' | 'vendor' | 'planner' | 'admin') => {
    await loginAsRole(role);
    setRoleDropdownOpen(false);
    if (role === 'couple') navigate('/dashboard');
    else if (role === 'vendor') navigate('/vendor-portal');
    else if (role === 'planner') navigate('/planner-portal');
    else if (role === 'admin') navigate('/admin-portal');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gold-200/80 shadow-sm transition-all">
      {/* Top Royal Announcement Bar */}
      <div className="bg-gradient-to-r from-burgundy-900 via-burgundy-800 to-burgundy-900 text-gold-200 text-[11px] py-1.5 px-4 text-center font-medium tracking-wider flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2 mx-auto">
          <Sparkles className="w-3 h-3 text-gold-400" />
          <span>Curating India’s Most Exquisite Royal Weddings • Jaipur • Udaipur • Jodhpur</span>
          <Sparkles className="w-3 h-3 text-gold-400" />
        </div>
        
        {/* Quick Demo Role Switcher */}
        <div className="relative ml-auto sm:ml-0">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-burgundy-950/70 hover:bg-burgundy-950 text-gold-300 border border-gold-400/30 text-[10px] uppercase font-semibold transition-colors"
          >
            <span>Role: {user ? user.role.toUpperCase() : 'DEMO SELECTOR'}</span>
            <ChevronDown className="w-2.5 h-2.5" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-1 w-48 rounded-xl bg-white text-charcoal-700 shadow-royal-lg border border-gold-300 py-1.5 z-50 text-xs">
              <div className="px-3 py-1 font-semibold text-[10px] uppercase tracking-wider text-charcoal-400 border-b border-gold-100">
                Switch Demo Persona
              </div>
              <button
                onClick={() => handleRoleSwitch('couple')}
                className="w-full text-left px-3 py-1.5 hover:bg-gold-50 flex items-center justify-between"
              >
                <span className="truncate max-w-[120px]">
                  {activeWedding?.couple_names ? `Couple (${activeWedding.couple_names.split('&')[0].trim()})` : 'Couple (Aarav & Meera)'}
                </span>
                <span className="text-[10px] text-burgundy-700 font-bold shrink-0">Couple</span>
              </button>
              <button
                onClick={() => handleRoleSwitch('vendor')}
                className="w-full text-left px-3 py-1.5 hover:bg-gold-50 flex items-center justify-between"
              >
                <span>Royal Mewar Caterers</span>
                <span className="text-[10px] text-gold-700 font-bold">Vendor</span>
              </button>
              <button
                onClick={() => handleRoleSwitch('planner')}
                className="w-full text-left px-3 py-1.5 hover:bg-gold-50 flex items-center justify-between"
              >
                <span>Ananya Sharma</span>
                <span className="text-[10px] text-indigo-700 font-bold">Planner</span>
              </button>
              <button
                onClick={() => handleRoleSwitch('admin')}
                className="w-full text-left px-3 py-1.5 hover:bg-gold-50 flex items-center justify-between"
              >
                <span>Maharaj Digvijay</span>
                <span className="text-[10px] text-emerald-700 font-bold">Admin</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo with User Provided Wedding Silhouette Logo & Cursive Brand Name */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gold-400 shadow-sm group-hover:scale-105 transition-transform ring-2 ring-gold-50 shrink-0 bg-white p-0.5">
              <img
                src="/royal-knot-logo.png"
                alt="The Royal Knot"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-cursive text-2xl font-bold text-charcoal-800 block group-hover:text-burgundy-800 transition-colors leading-none">
                The Royal Knot
              </span>
            </div>
          </Link>

          {/* Right Action Area: ONLY Sign In (or User Hub) and beside that the Three Lines Hamburger Menu */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={
                    user.role === 'couple'
                      ? '/dashboard'
                      : user.role === 'vendor'
                      ? '/vendor-portal'
                      : user.role === 'planner'
                      ? '/planner-portal'
                      : '/admin-portal'
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ivory-200 border border-gold-300 text-xs font-semibold text-charcoal-800 hover:bg-gold-50 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-gold-700" />
                  <span>{user.role === 'couple' ? 'Couple Portal' : `${user.role.toUpperCase()} Hub`}</span>
                </Link>

                <button
                  onClick={logout}
                  className="p-1.5 rounded-xl text-charcoal-400 hover:text-burgundy-700 hover:bg-ivory-200 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-full bg-ivory-100 hover:bg-gold-50 text-charcoal-800 text-xs font-semibold uppercase tracking-wider border border-gold-300 shadow-sm transition-all hover:border-gold-400"
              >
                Sign In
              </Link>
            )}

            {/* Three Lines Menu Toggle Button (Hamburger) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-charcoal-700 hover:text-burgundy-800 hover:bg-ivory-200 border border-gold-300/80 transition-all flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-burgundy-700" />
              ) : (
                <Menu className="w-5 h-5 text-charcoal-800" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Menu Toggled by Three Lines */}
      {mobileMenuOpen && (
        <div className="border-t border-gold-200/80 bg-white/98 backdrop-blur-md shadow-royal-lg animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pb-6 border-b border-gold-100">
              {/* Column 1: Celebrations & Palaces */}
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold-700 block mb-3">
                  Celebrations & Venues
                </span>
                <div className="space-y-1.5">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/')
                        ? 'bg-gold-50 text-burgundy-800 font-bold'
                        : 'text-charcoal-700 hover:text-burgundy-700 hover:bg-ivory-50'
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    to="/venues"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/venues')
                        ? 'bg-gold-50 text-burgundy-800 font-bold'
                        : 'text-charcoal-700 hover:text-burgundy-700 hover:bg-ivory-50'
                    }`}
                  >
                    Palace Venues & Forts
                  </Link>
                  <Link
                    to="/vendors"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/vendors')
                        ? 'bg-gold-50 text-burgundy-800 font-bold'
                        : 'text-charcoal-700 hover:text-burgundy-700 hover:bg-ivory-50'
                    }`}
                  >
                    Marketplace & Vendors
                  </Link>
                  <Link
                    to="/destination"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/destination')
                        ? 'bg-gold-50 text-burgundy-800 font-bold'
                        : 'text-charcoal-700 hover:text-burgundy-700 hover:bg-ivory-50'
                    }`}
                  >
                    Destination Weddings
                  </Link>
                </div>
              </div>

              {/* Column 2: Operations & Registry */}
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold-700 block mb-3">
                  Operations & Guidance
                </span>
                <div className="space-y-1.5">
                  <Link
                    to="/command-centre"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/command-centre')
                        ? 'bg-gold-50 text-burgundy-800 font-bold'
                        : 'text-charcoal-700 hover:text-burgundy-700 hover:bg-ivory-50'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                    <span>Live Command Centre</span>
                  </Link>
                  <Link
                    to="/marriage-registration"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/marriage-registration')
                        ? 'bg-gold-50 text-burgundy-800 font-bold'
                        : 'text-charcoal-700 hover:text-burgundy-700 hover:bg-ivory-50'
                    }`}
                  >
                    Marriage Registration
                  </Link>
                  <Link
                    to="/how-it-works"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/how-it-works')
                        ? 'bg-gold-50 text-burgundy-800 font-bold'
                        : 'text-charcoal-700 hover:text-burgundy-700 hover:bg-ivory-50'
                    }`}
                  >
                    How It Works
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/contact')
                        ? 'bg-gold-50 text-burgundy-800 font-bold'
                        : 'text-charcoal-700 hover:text-burgundy-700 hover:bg-ivory-50'
                    }`}
                  >
                    Royal Concierge
                  </Link>
                </div>
              </div>

              {/* Column 3: Quick Action & Celebration Setup */}
              <div className="flex flex-col justify-between bg-ivory-50/80 p-5 rounded-2xl border border-gold-200">
                <div>
                  <h4 className="font-serif text-lg font-bold text-charcoal-900 mb-1">
                    Your Royal Celebration
                  </h4>
                  <p className="text-xs text-charcoal-500 mb-4 leading-relaxed">
                    Set up your wedding requirements, explore palace venues, and orchestrate every detail.
                  </p>
                </div>
                <Link
                  to="/onboarding"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition-all border border-gold-400/40"
                >
                  <Sparkles className="w-3.5 h-3.5 text-gold-300" />
                  <span>Plan a Wedding</span>
                </Link>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="pt-4 flex flex-wrap items-center justify-between text-xs text-charcoal-500">
              <span className="font-serif italic text-charcoal-600">
                The Royal Knot — Every detail connected. Every moment managed.
              </span>
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <Link to="/faqs" onClick={() => setMobileMenuOpen(false)} className="hover:text-gold-700 underline">
                  FAQs
                </Link>
                <Link to="/privacy-policy" onClick={() => setMobileMenuOpen(false)} className="hover:text-gold-700 underline">
                  Privacy
                </Link>
                <Link to="/terms-of-service" onClick={() => setMobileMenuOpen(false)} className="hover:text-gold-700 underline">
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
