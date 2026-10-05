import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { HeartHandshake, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
export const LoginPage = () => {
    const { login } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await login(email, password);
            if (result.success) {
                if (result.user?.userType === 'individual') {
                    navigate('/dashboard/caregiver');
                }
                else if (result.user?.userType === 'agency') {
                    navigate('/dashboard/agency');
                }
                else if (result.user?.userType === 'admin') {
                    navigate('/admin');
                }
                else {
                    navigate('/dashboard/family');
                }
            }
            else {
                setError(result.error || 'Invalid credentials. Please verify your email and password.');
            }
        }
        catch {
            setError('Connection error. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-[#b1f2ff] shadow-lg overflow-hidden">
        {/* Left Branding Column */}
        <div className="lg:col-span-5 bg-[#3dcfff] p-8 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-white text-[#3dcfff] flex items-center justify-center font-bold">
                <HeartHandshake className="w-5 h-5"/>
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
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0"/>
              <span>{t('directWhatsAppContact')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0"/>
              <span>{t('govPrivateHospitals')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0"/>
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

          {error && (<div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl">
              {error}
            </div>)}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#172B25] mb-1">
                {t('emailAddress')}
              </label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" className="w-full px-3.5 py-2.5 text-xs bg-[#d8f9ff] border border-[#b1f2ff] rounded-xl text-[#172B25] focus:bg-white focus:border-[#3dcfff] outline-none transition-colors"/>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#172B25]">
                  {t('password')}
                </label>
                <Link to="/forgot-password" className="text-xs text-[#3dcfff] hover:underline">
                  {t('forgotPassword')}
                </Link>
              </div>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-3.5 py-2.5 text-xs bg-[#d8f9ff] border border-[#b1f2ff] rounded-xl text-[#172B25] focus:bg-white focus:border-[#3dcfff] outline-none transition-colors"/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-[#64746D] hover:text-[#172B25]">
                  {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 px-4 text-xs font-bold text-white bg-[#3dcfff] hover:bg-[#1eb5df] rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
              <span>{loading ? 'Signing in...' : t('signInBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5"/>
            </button>
          </form>

          <div className="text-center text-xs text-[#64746D] pt-2">
            <span>{t('dontHaveAccount')} </span>
            <Link to="/register" className="text-[#3dcfff] font-semibold hover:underline">
              {t('registerHere')}
            </Link>
          </div>
        </div>
      </div>
    </div>);
};
