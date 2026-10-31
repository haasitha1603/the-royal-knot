import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CurtainEntrance } from './components/ui/CurtainEntrance';
import { CookieConsentBanner } from './components/ui/CookieConsentBanner';
import { AIWeddingAssistant } from './components/ui/AIWeddingAssistant';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { VenuesPage } from './pages/public/VenuesPage';
import { VendorsPage } from './pages/public/VendorsPage';
import { DestinationPage } from './pages/public/DestinationPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { FAQsPage } from './pages/public/FAQsPage';
import { ContactPage } from './pages/public/ContactPage';
import { LegalPages } from './pages/public/LegalPages';
import { MarriageRegistrationPage } from './pages/public/MarriageRegistrationPage';
import { WaitlistPage, ThankYouPage } from './pages/public/WaitlistPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage, ForgotPasswordPage, NotFoundPage } from './pages/auth/RegisterPage';

// Authenticated Portals
import { CoupleOnboardingPage } from './pages/couple/CoupleOnboardingPage';
import { CoupleDashboardPage } from './pages/couple/CoupleDashboardPage';
import { VendorDashboardPage } from './pages/vendor/VendorDashboardPage';
import { PlannerDashboardPage } from './pages/planner/PlannerDashboardPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { CommandCentrePage } from './pages/operations/CommandCentrePage';
import { GuestManagementPage } from './pages/guests/GuestManagementPage';

function AppContent() {
  const [showCurtain, setShowCurtain] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-ivory selection:bg-gold-200 selection:text-burgundy-900">
      {/* First-time Fabric Curtain Entrance (Section 3.1 & Redesign) */}
      <CurtainEntrance forceShow={showCurtain} onEnter={() => setShowCurtain(false)} />

      {/* Global Navigation Bar */}
      <Navbar />

      {/* Dynamic Route Content */}
      <main className="flex-1">
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
