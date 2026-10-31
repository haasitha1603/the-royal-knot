import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Crown, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginAsRole } = useAuth();
  const [email, setEmail] = useState('couple@theroyalknot.com');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Incorrect credentials. Please verify or use demo persona.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickPersona = async (role: 'couple' | 'vendor' | 'planner' | 'admin') => {
    setIsSubmitting(true);
    try {
      await loginAsRole(role);
      if (role === 'couple') navigate('/dashboard');
      else if (role === 'vendor') navigate('/vendor-portal');
      else if (role === 'planner') navigate('/planner-portal');
      else if (role === 'admin') navigate('/admin-portal');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error signing in as demo persona.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-ivory min-h-screen py-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white rounded-3xl border border-gold-300 p-8 sm:p-10 shadow-royal">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-gold-50 border border-gold-400 flex items-center justify-center text-gold-700 mx-auto mb-3">
              <Crown className="w-6 h-6 text-gold-600" />
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-gold-700">
              The Royal Knot Portal
            </span>
            <h1 className="font-serif text-3xl font-bold text-charcoal-900 mt-1">
              Sign In to Your Wedding
            </h1>
            <p className="text-xs text-charcoal-500 mt-1">
              Access your real-time operations, quotations, and financial ledger.
            </p>
          </div>

          {/* Quick Demo Persona Switcher */}
          <div className="mb-6 p-3 rounded-2xl bg-ivory-50 border border-gold-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block mb-2 text-center">
              One-Click Demonstration Logins
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickPersona('couple')}
                className="p-2 rounded-xl border border-gold-200 bg-white hover:bg-gold-50 text-charcoal-800 font-semibold text-center"
              >
                Couple (Aarav & Meera)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPersona('planner')}
                className="p-2 rounded-xl border border-gold-200 bg-white hover:bg-gold-50 text-charcoal-800 font-semibold text-center"
              >
                Planner (Ananya)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPersona('vendor')}
                className="p-2 rounded-xl border border-gold-200 bg-white hover:bg-gold-50 text-charcoal-800 font-semibold text-center"
              >
                Vendor (Royal Mewar)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPersona('admin')}
                className="p-2 rounded-xl border border-gold-200 bg-white hover:bg-gold-50 text-charcoal-800 font-semibold text-center"
              >
                Admin (Digvijay)
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs text-center">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-charcoal-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-charcoal-700">Password</label>
                <Link to="/forgot-password" className="text-[11px] text-gold-700 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-medium text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Crown className="w-3.5 h-3.5 text-gold-300" />
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Foyer'}</span>
            </button>
          </form>

          <div className="pt-6 border-t border-gold-100 text-center text-xs text-charcoal-500 mt-6">
            New to The Royal Knot?{' '}
            <Link to="/register" className="font-bold text-burgundy-800 hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
