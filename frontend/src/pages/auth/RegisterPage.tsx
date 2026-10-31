import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Crown, Lock, Mail, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<'couple' | 'vendor' | 'planner'>('couple');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Caterers');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert("Please accept the terms of service and privacy policy to proceed.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await api.register({
        email,
        password,
        full_name: fullName,
        phone,
        role,
        business_name: role === 'vendor' ? businessName : undefined,
        category: role === 'vendor' ? category : undefined,
      });
      await login(email, password);
      if (role === 'couple') navigate('/onboarding');
      else if (role === 'vendor') navigate('/vendor-portal');
      else navigate('/planner-portal');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please check details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-ivory min-h-screen py-16 flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto px-4">
        <div className="bg-white rounded-3xl border border-gold-300 p-8 sm:p-10 shadow-royal">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-gold-50 border border-gold-400 flex items-center justify-center text-gold-700 mx-auto mb-3">
              <Crown className="w-6 h-6 text-gold-600" />
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-gold-700">
              The Royal Knot Registry
            </span>
            <h1 className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
              Create Your Account
            </h1>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <button
              type="button"
              onClick={() => setRole('couple')}
              className={`py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all ${
                role === 'couple'
                  ? 'bg-burgundy-700 text-white border-burgundy-700 shadow-sm'
                  : 'bg-ivory-50 text-charcoal-600 border-gold-200'
              }`}
            >
              Couple
            </button>
            <button
              type="button"
              onClick={() => setRole('vendor')}
              className={`py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all ${
                role === 'vendor'
                  ? 'bg-burgundy-700 text-white border-burgundy-700 shadow-sm'
                  : 'bg-ivory-50 text-charcoal-600 border-gold-200'
              }`}
            >
              Professional
            </button>
            <button
              type="button"
              onClick={() => setRole('planner')}
              className={`py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all ${
                role === 'planner'
                  ? 'bg-burgundy-700 text-white border-burgundy-700 shadow-sm'
                  : 'bg-ivory-50 text-charcoal-600 border-gold-200'
              }`}
            >
              Planner
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-charcoal-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sanyukta Rathore"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            {role === 'vendor' && (
              <>
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Royal Mewar Catering Co."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Vendor Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800"
                  >
                    <option value="Caterers">Caterers & Royal Feasts</option>
                    <option value="Decorators">Mandap & Floral Artistry</option>
                    <option value="Photographers">Heritage Wedding Cinema</option>
                    <option value="Planners">Bespoke Wedding Planners</option>
                    <option value="Entertainment">Symphony, Shehnai & DJs</option>
                  </select>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98290 00000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-charcoal-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            {/* Form Consent Checkboxes (Section 13.3) */}
            <div className="pt-2 space-y-2">
              <label className="flex items-start gap-2 cursor-pointer text-[11px] text-charcoal-600">
                <input
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="rounded text-burgundy-700 focus:ring-gold-400 w-4 h-4 shrink-0 mt-0.5"
                />
                <span>
                  I acknowledge and agree to the <Link to="/terms-of-service" className="text-burgundy-700 underline">Terms of Service</Link>, <Link to="/privacy-policy" className="text-burgundy-700 underline">Privacy Policy</Link>, and escrow refund guidelines.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-medium text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Crown className="w-3.5 h-3.5 text-gold-300" />
              <span>{isSubmitting ? 'Registering...' : 'Register Royal Account'}</span>
            </button>
          </form>

          <div className="pt-6 border-t border-gold-100 text-center text-xs text-charcoal-500 mt-6">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-burgundy-800 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <div className="bg-ivory min-h-screen py-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white rounded-3xl border border-gold-300 p-8 shadow-royal text-center text-xs">
          <div className="w-12 h-12 rounded-full bg-gold-50 border border-gold-400 flex items-center justify-center text-gold-700 mx-auto mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-charcoal-900 mb-2">Reset Password</h1>
          <p className="text-charcoal-500 mb-6">
            Enter your registered royal email to receive a cryptographically signed recovery token.
          </p>

          {sent ? (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800">
              Recovery dispatch sent to {email}. Please check your inbox.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-4 text-left"
            >
              <div>
                <label className="block font-semibold text-charcoal-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="couple@royalmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-burgundy-700 text-white font-semibold uppercase tracking-wider text-xs"
              >
                Send Password Reset Dispatch
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-gold-100 text-center">
            <Link to="/login" className="text-burgundy-800 font-semibold hover:underline">
              Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotFoundPage: React.FC = () => {
  return (
    <div className="bg-ivory min-h-screen py-20 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 text-center">
        <div className="bg-white rounded-3xl border border-gold-300 p-8 sm:p-12 shadow-royal">
          <span className="font-serif text-6xl font-bold text-gold-600 block mb-2">404</span>
          <h1 className="font-serif text-2xl font-bold text-charcoal-900 mb-2">
            Palace Wing Not Found
          </h1>
          <p className="text-xs text-charcoal-500 mb-6">
            The page or ceremonial gallery you requested does not exist within the royal registry.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-burgundy-700 text-white text-xs font-semibold uppercase tracking-wider shadow-sm hover:bg-burgundy-800 transition-colors"
          >
            <span>Return to Grand Foyer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
