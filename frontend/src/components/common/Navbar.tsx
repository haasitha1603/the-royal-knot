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

          {/* Desktop Nav Links (Optimized text size & spacing) */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 text-[11px] uppercase font-medium tracking-normal xl:tracking-wider text-charcoal-600">
            <Link
              to="/"
              className={`hover:text-burgundy-700 transition-colors ${
                isActive('/') ? 'text-burgundy-800 font-bold border-b-2 border-gold-400 pb-0.5' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/venues"
              className={`hover:text-burgundy-700 transition-colors ${
                isActive('/venues') ? 'text-burgundy-800 font-bold border-b-2 border-gold-400 pb-0.5' : ''
              }`}
            >
              Palace Venues
            </Link>
            <Link
              to="/vendors"
              className={`hover:text-burgundy-700 transition-colors ${
                isActive('/vendors') ? 'text-burgundy-800 font-bold border-b-2 border-gold-400 pb-0.5' : ''
              }`}
            >
              Marketplace
            </Link>
            <Link
              to="/destination"
              className={`hover:text-burgundy-700 transition-colors ${
                isActive('/destination') ? 'text-burgundy-800 font-bold border-b-2 border-gold-400 pb-0.5' : ''
              }`}
            >
              Destinations
            </Link>
            <Link
              to="/marriage-registration"
              className={`hover:text-burgundy-700 transition-colors ${
                isActive('/marriage-registration') ? 'text-burgundy-800 font-bold border-b-2 border-gold-400 pb-0.5' : ''
              }`}
            >
              Marriage Registration
            </Link>
            <Link
              to="/command-centre"
              className={`hover:text-burgundy-700 transition-colors flex items-center gap-1 ${
                isActive('/command-centre') ? 'text-burgundy-800 font-bold border-b-2 border-gold-400 pb-0.5' : ''
              }`}
            >
              <Sparkles className="w-3 h-3 text-gold-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Command Centre</span>
            </Link>
            <Link
              to="/how-it-works"
              className={`hover:text-burgundy-700 transition-colors ${
                isActive('/how-it-works') ? 'text-burgundy-800 font-bold border-b-2 border-gold-400 pb-0.5' : ''
              }`}
            >
              How It Works
            </Link>
            <Link
              to="/contact"
              className={`hover:text-burgundy-700 transition-colors ${
                isActive('/contact') ? 'text-burgundy-800 font-bold border-b-2 border-gold-400 pb-0.5' : ''
              }`}
            >
              Concierge
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ivory-200 border border-gold-300 text-[11px] font-semibold text-charcoal-800 hover:bg-gold-50 transition-colors"
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
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 hover:text-burgundy-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/onboarding"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-burgundy-700 hover:bg-burgundy-800 text-white text-[11px] font-semibold uppercase tracking-wider shadow-sm transition-all border border-gold-400/40 hover:scale-105"
                >
                  <Sparkles className="w-3 h-3 text-gold-300" />
                  <span>Plan a Wedding</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-charcoal-600 hover:text-charcoal-900 hover:bg-ivory-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gold-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-royal-lg animate-in fade-in duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-charcoal-800 hover:text-burgundy-700"
          >
            Home
          </Link>
          <Link
            to="/venues"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-charcoal-800 hover:text-burgundy-700"
          >
            Palace Venues
          </Link>
          <Link
            to="/vendors"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-charcoal-800 hover:text-burgundy-700"
          >
            Marketplace & Vendors
          </Link>
          <Link
            to="/destination"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-charcoal-800 hover:text-burgundy-700"
          >
            Destination Weddings
          </Link>
          <Link
            to="/marriage-registration"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-charcoal-800 hover:text-burgundy-700"
          >
            Marriage Registration
          </Link>
          <Link
            to="/command-centre"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-burgundy-800 font-bold"
          >
            Live Command Centre
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-charcoal-800 hover:text-burgundy-700"
          >
            How It Works
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-charcoal-800 hover:text-burgundy-700"
          >
            Concierge & Support
          </Link>

          <div className="pt-3 border-t border-gold-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-xl bg-burgundy-700 text-white font-semibold text-xs uppercase"
                >
                  My Wedding Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 text-center text-xs text-charcoal-500 hover:text-burgundy-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-xs font-semibold uppercase text-charcoal-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/onboarding"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-xl bg-burgundy-700 text-white font-semibold text-xs uppercase"
                >
                  Plan a Wedding
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
