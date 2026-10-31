import React, { useState, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CurtainEntrance } from './components/ui/CurtainEntrance';
import { CookieConsentBanner } from './components/ui/CookieConsentBanner';
import { AIWeddingAssistant } from './components/ui/AIWeddingAssistant';
import { RoyalLoader } from './components/ui/RoyalLoader';

// Lazy Loaded Public Pages
const HomePage = React.lazy(() => import('./pages/public/HomePage').then(m => ({ default: m.HomePage })));
const VenuesPage = React.lazy(() => import('./pages/public/VenuesPage').then(m => ({ default: m.VenuesPage })));
const VendorsPage = React.lazy(() => import('./pages/public/VendorsPage').then(m => ({ default: m.VendorsPage })));
const DestinationPage = React.lazy(() => import('./pages/public/DestinationPage').then(m => ({ default: m.DestinationPage })));
const HowItWorksPage = React.lazy(() => import('./pages/public/HowItWorksPage').then(m => ({ default: m.HowItWorksPage })));
const FAQsPage = React.lazy(() => import('./pages/public/FAQsPage').then(m => ({ default: m.FAQsPage })));
const ContactPage = React.lazy(() => import('./pages/public/ContactPage').then(m => ({ default: m.ContactPage })));
const LegalPages = React.lazy(() => import('./pages/public/LegalPages').then(m => ({ default: m.LegalPages })));
const MarriageRegistrationPage = React.lazy(() => import('./pages/public/MarriageRegistrationPage').then(m => ({ default: m.MarriageRegistrationPage })));
const WaitlistPage = React.lazy(() => import('./pages/public/WaitlistPage').then(m => ({ default: m.WaitlistPage })));
const ThankYouPage = React.lazy(() => import('./pages/public/WaitlistPage').then(m => ({ default: m.ThankYouPage })));
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = React.lazy(() => import('./pages/auth/RegisterPage').then(m => ({ default: m.ForgotPasswordPage })));
const NotFoundPage = React.lazy(() => import('./pages/auth/RegisterPage').then(m => ({ default: m.NotFoundPage })));

// Lazy Loaded Authenticated Portals
const CoupleOnboardingPage = React.lazy(() => import('./pages/couple/CoupleOnboardingPage').then(m => ({ default: m.CoupleOnboardingPage })));
const CoupleDashboardPage = React.lazy(() => import('./pages/couple/CoupleDashboardPage').then(m => ({ default: m.CoupleDashboardPage })));
const VendorDashboardPage = React.lazy(() => import('./pages/vendor/VendorDashboardPage').then(m => ({ default: m.VendorDashboardPage })));
const PlannerDashboardPage = React.lazy(() => import('./pages/planner/PlannerDashboardPage').then(m => ({ default: m.PlannerDashboardPage })));
const AdminDashboardPage = React.lazy(() => import('./pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const CommandCentrePage = React.lazy(() => import('./pages/operations/CommandCentrePage').then(m => ({ default: m.CommandCentrePage })));
const GuestManagementPage = React.lazy(() => import('./pages/guests/GuestManagementPage').then(m => ({ default: m.GuestManagementPage })));

function RouteFallback() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-ivory">
      <RoyalLoader message="Opening royal wedding portals..." size="md" />
    </div>
  );
}

function AppContent() {
  const [showCurtain, setShowCurtain] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-ivory selection:bg-gold-200 selection:text-burgundy-900">
      {/* First-time Fabric Curtain Entrance (Section 3.1 & Redesign) */}
      <CurtainEntrance forceShow={showCurtain} onEnter={() => setShowCurtain(false)} />

      {/* Global Navigation Bar */}
      <Navbar />

      {/* Dynamic Route Content with Lazy Suspense */}
      <main className="flex-1">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage onReopenCurtain={() => setShowCurtain(true)} />} />
            <Route path="/venues" element={<VenuesPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/destination" element={<DestinationPage />} />
            <Route path="/marriage-registration" element={<MarriageRegistrationPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/faqs" element={<FAQsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/waitlist" element={<WaitlistPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />

            {/* Legal Pages */}
            <Route path="/privacy-policy" element={<LegalPages initialTab="privacy" />} />
            <Route path="/terms-of-service" element={<LegalPages initialTab="terms" />} />
            <Route path="/refund-policy" element={<LegalPages initialTab="refund" />} />
            <Route path="/cancellation-policy" element={<LegalPages initialTab="cancellation" />} />
            <Route path="/cookie-policy" element={<LegalPages initialTab="cookie" />} />
            <Route path="/data-deletion" element={<LegalPages initialTab="deletion" />} />

            {/* Authentication */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Onboarding & Dashboards */}
            <Route path="/onboarding" element={<CoupleOnboardingPage />} />
            <Route path="/dashboard" element={<CoupleDashboardPage />} />
            <Route path="/vendor-portal" element={<VendorDashboardPage />} />
            <Route path="/planner-portal" element={<PlannerDashboardPage />} />
            <Route path="/admin-portal" element={<AdminDashboardPage />} />
            <Route path="/command-centre" element={<CommandCentrePage />} />
            <Route path="/guests" element={<GuestManagementPage />} />

            {/* Fallback 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Real AI Wedding Concierge Floating Assistant */}
      <AIWeddingAssistant />

      {/* Cookie Consent Banner */}
      <CookieConsentBanner />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
