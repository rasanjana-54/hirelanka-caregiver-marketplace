import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { HeartHandshake, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        if (email.includes('nadeesha') || email.includes('caregiver')) {
          navigate('/dashboard/caregiver');
        } else if (email.includes('suwasevana') || email.includes('agency')) {
          navigate('/dashboard/agency');
        } else if (email.includes('admin')) {
          navigate('/admin');
        } else {
          navigate('/caregivers');
        }
      }
    } catch {
      setError('Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: 'family' | 'individual' | 'agency' | 'admin') => {
    switchDemoRole(role);
    if (role === 'individual') navigate('/dashboard/caregiver');
    else if (role === 'agency') navigate('/dashboard/agency');
    else if (role === 'admin') navigate('/admin');
    else navigate('/caregivers');
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-[#E5ECE8] shadow-lg overflow-hidden">
        {/* Left Branding Column */}
        <div className="lg:col-span-5 bg-[#176B55] p-8 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-white text-[#176B55] flex items-center justify-center font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">HireLanka Care</span>
            </div>

            <h2 className="text-2xl font-extrabold leading-snug">
              {t('loginTitle')}
            </h2>
            <p className="text-xs text-emerald-100 mt-3 leading-relaxed">
              {t('loginSubtitle')}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-emerald-600/50 space-y-3 text-xs text-emerald-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{t('directWhatsAppContact')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{t('govPrivateHospitals')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{t('zeroCommissionTitle')}</span>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-8 sm:p-10 space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-[#172B25]">{t('login')}</h3>
            <p className="text-xs text-[#64746D] mt-1">
              {t('loginSubtitle')}
            </p>
          </div>

          {/* Quick Demo Switcher */}
          <div className="p-3 bg-[#F8FAF8] border border-[#E5ECE8] rounded-2xl space-y-2">
            <span className="text-[11px] font-bold text-[#64746D] uppercase tracking-wider block">
              {t('demoPortals')} (1-Click)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('family')}
                className="p-2 bg-white hover:bg-emerald-50 border border-[#E5ECE8] rounded-xl text-left font-medium text-[#172B25] transition-colors cursor-pointer"
              >
                {t('familyClient')}
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('individual')}
                className="p-2 bg-white hover:bg-emerald-50 border border-[#E5ECE8] rounded-xl text-left font-medium text-[#172B25] transition-colors cursor-pointer"
              >
                {t('caregiverNadeesha')}
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('agency')}
                className="p-2 bg-white hover:bg-emerald-50 border border-[#E5ECE8] rounded-xl text-left font-medium text-[#172B25] transition-colors cursor-pointer"
              >
                {t('agencySuwasevana')}
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="p-2 bg-white hover:bg-emerald-50 border border-[#E5ECE8] rounded-xl text-left font-medium text-[#172B25] transition-colors cursor-pointer"
              >
                {t('hireLankaAdmin')}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#172B25] mb-1">
                {t('emailAddress')}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF8] border border-[#E5ECE8] rounded-xl text-[#172B25] focus:bg-white focus:border-[#176B55] outline-none transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#172B25]">
                  {t('password')}
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#176B55] hover:underline"
                >
                  {t('forgotPassword')}
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF8] border border-[#E5ECE8] rounded-xl text-[#172B25] focus:bg-white focus:border-[#176B55] outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#64746D] hover:text-[#172B25]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-[#176B55] hover:bg-[#135946] rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Signing in...' : t('signInBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center text-xs text-[#64746D] pt-2">
            <span>{t('dontHaveAccount')} </span>
            <Link to="/register" className="text-[#176B55] font-semibold hover:underline">
              {t('registerHere')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
