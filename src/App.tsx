import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { FindCaregiversPage } from './pages/FindCaregiversPage';
import { CaregiverProfilePage } from './pages/CaregiverProfilePage';
import { AgenciesPage } from './pages/AgenciesPage';
import { AgencyProfilePage } from './pages/AgencyProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { CaregiverDashboardPage } from './pages/CaregiverDashboardPage';
import { AgencyDashboardPage } from './pages/AgencyDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { FamilyDashboardPage } from './pages/FamilyDashboardPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Generic Role Guard
function RequireRole({ role, children }: { role: 'family' | 'individual' | 'agency' | 'admin'; children: React.ReactNode }) {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white border border-[#E5ECE8] rounded-2xl shadow-sm text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#176B55]/10 text-[#176B55] flex items-center justify-center mx-auto text-xl font-bold">
          🔒
        </div>
        <h2 className="text-lg font-bold text-[#172B25]">Authentication Required</h2>
        <p className="text-xs text-[#64746D]">
          Please log in to your {role} account to access this private dashboard portal.
        </p>
      </div>
    );
  }

  if (currentUser.userType !== role && currentUser.userType !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white border border-[#E5ECE8] rounded-2xl shadow-sm text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-xl font-bold">
          ⚠️
        </div>
        <h2 className="text-lg font-bold text-[#172B25]">Access Restricted</h2>
        <p className="text-xs text-[#64746D]">
          Your account ({currentUser.userType}) does not have permission to access the {role} dashboard portal.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <LanguageProvider>
      <DataProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-[#F8FAF8] text-[#172B25]">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/caregivers" element={<FindCaregiversPage />} />
                  <Route path="/caregivers/:id" element={<CaregiverProfilePage />} />
                  <Route path="/agencies" element={<AgenciesPage />} />
                  <Route path="/agencies/:id" element={<AgencyProfilePage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/dashboard" element={<RequireRole role="family"><FamilyDashboardPage /></RequireRole>} />
                  <Route path="/dashboard/family" element={<RequireRole role="family"><FamilyDashboardPage /></RequireRole>} />
                  <Route path="/dashboard/caregiver" element={<RequireRole role="individual"><CaregiverDashboardPage /></RequireRole>} />
                  <Route path="/dashboard/agency" element={<RequireRole role="agency"><AgencyDashboardPage /></RequireRole>} />
                  <Route path="/admin" element={<RequireRole role="admin"><AdminDashboardPage /></RequireRole>} />
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </DataProvider>
    </LanguageProvider>
  );
}
