import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, Language } from '../../context/LanguageContext';
import { HeartHandshake, Globe, Menu, X, User as UserIcon, LogOut, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLangChange = (lang: Language) => {
    setLanguage(lang);
    setLangMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!currentUser) return '/login';
    if (currentUser.userType === 'individual') return '/dashboard/caregiver';
    if (currentUser.userType === 'agency') return '/dashboard/agency';
    if (currentUser.userType === 'admin') return '/admin';
    return '/dashboard/family';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#b1f2ff] transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single Text Element Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="HireLanka Care Home"
          >
            <div className="w-9 h-9 rounded-xl bg-[#3dcfff] text-white flex items-center justify-center shadow-xs group-hover:bg-[#1eb5df] transition-colors">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#172B25] group-hover:text-[#3dcfff] transition-colors">
              HireLanka Care
            </span>
          </Link>

          {/* Zone 2: Clean 4-6 text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#64746D]">
            <Link
              to="/"
              className={`hover:text-[#3dcfff] transition-colors whitespace-nowrap ${
                isActive('/') ? 'text-[#3dcfff] font-semibold' : ''
              }`}
            >
              {t('home')}
            </Link>
            <Link
              to="/caregivers"
              className={`hover:text-[#3dcfff] transition-colors whitespace-nowrap ${
                isActive('/caregivers') ? 'text-[#3dcfff] font-semibold' : ''
              }`}
            >
              {t('findCaregivers')}
            </Link>
            <Link
              to="/agencies"
              className={`hover:text-[#3dcfff] transition-colors whitespace-nowrap ${
                isActive('/agencies') ? 'text-[#3dcfff] font-semibold' : ''
              }`}
            >
              {t('agenciesDirectory')}
            </Link>
            <Link
              to="/how-it-works"
              className={`hover:text-[#3dcfff] transition-colors whitespace-nowrap ${
                isActive('/how-it-works') ? 'text-[#3dcfff] font-semibold' : ''
              }`}
            >
              {t('howItWorks')}
            </Link>
          </nav>

          {/* Zone 3: 1-2 primary actions + Language selector */}
          <div className="flex items-center gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#172B25] hover:bg-[#d8f9ff] border border-[#b1f2ff] rounded-lg transition-colors cursor-pointer"
                title="Change language"
              >
                <Globe className="w-3.5 h-3.5 text-[#3dcfff]" />
                <span className="uppercase">{language}</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-[#b1f2ff] rounded-xl shadow-lg py-1 z-50">
                  <button
                    type="button"
                    onClick={() => handleLangChange('en')}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                      language === 'en' ? 'font-bold text-[#3dcfff] bg-cyan-50' : 'text-[#172B25] hover:bg-slate-50'
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && <span className="text-[#3dcfff]">✓</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLangChange('si')}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                      language === 'si' ? 'font-bold text-[#3dcfff] bg-cyan-50' : 'text-[#172B25] hover:bg-slate-50'
                    }`}
                  >
                    <span>සිංහල (Sinhala)</span>
                    {language === 'si' && <span className="text-[#3dcfff]">✓</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLangChange('ta')}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                      language === 'ta' ? 'font-bold text-[#3dcfff] bg-cyan-50' : 'text-[#172B25] hover:bg-slate-50'
                    }`}
                  >
                    <span>தமிழ் (Tamil)</span>
                    {language === 'ta' && <span className="text-[#3dcfff]">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Auth Actions */}
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardLink()}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-[#3dcfff] hover:bg-[#1eb5df] rounded-xl transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>{currentUser.userType === 'admin' ? t('adminPanel') : t('dashboard')}</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="p-2 text-[#64746D] hover:text-[#D9534F] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title={t('logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-3 py-2 text-xs font-semibold text-[#172B25] hover:text-[#3dcfff] transition-colors whitespace-nowrap"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/caregivers"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#3dcfff] hover:bg-[#1eb5df] rounded-xl transition-colors shadow-xs whitespace-nowrap"
                >
                  {t('findCaregivers')}
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#172B25] hover:bg-[#d8f9ff] rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#b1f2ff] px-4 pt-3 pb-5 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#172B25] py-2"
          >
            {t('home')}
          </Link>
          <Link
            to="/caregivers"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#172B25] py-2"
          >
            {t('findCaregivers')}
          </Link>
          <Link
            to="/agencies"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#172B25] py-2"
          >
            {t('agenciesDirectory')}
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#172B25] py-2"
          >
            {t('howItWorks')}
          </Link>
          <div className="pt-3 border-t border-[#b1f2ff] flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-semibold text-white bg-[#3dcfff] rounded-xl"
                >
                  {currentUser?.userType === 'admin' ? t('adminPanel') : t('dashboard')}
                </Link>
                <button
                  type="button"
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full text-center py-2 text-xs font-medium text-[#D9534F]"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-semibold text-[#172B25] border border-[#b1f2ff] rounded-xl"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-semibold text-white bg-[#3dcfff] rounded-xl"
                >
                  {t('register')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
