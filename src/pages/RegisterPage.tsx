import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserType } from '../types';
import {
  HeartHandshake,
  User,
  Users,
  Building2,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [userType, setUserType] = useState<UserType>('family');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+94 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the HireLanka Care Terms & Conditions.');
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        email,
        fullName,
        phoneNumber,
        userType,
        password
      });

      if (result.success) {
        if (userType === 'individual') {
          navigate('/dashboard/caregiver');
        } else if (userType === 'agency') {
          navigate('/dashboard/agency');
        } else {
          navigate('/caregivers');
        }
      } else {
        setError(result.error || 'Could not complete registration. Please try again.');
      }
    } catch {
      setError('Registration error. Please verify input fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-[#b1f2ff] shadow-lg overflow-hidden">
        {/* Left Info Panel */}
        <div className="lg:col-span-5 bg-[#3dcfff] p-8 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-white text-[#3dcfff] flex items-center justify-center font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">HireLanka Care</span>
            </div>

            <h2 className="text-2xl font-extrabold leading-snug">
              {t('registerTitle')}
            </h2>
            <p className="text-xs text-emerald-100 mt-3 leading-relaxed">
              {t('registerSubtitle')}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-emerald-600/50 space-y-3 text-xs text-emerald-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{t('policeIdVerified')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{t('directWhatsAppContact')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{t('transparentLkrRates')}</span>
            </div>
          </div>
        </div>

        {/* Right Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-[#172B25]">{t('createAccountBtn')}</h3>
            <p className="text-xs text-[#64746D] mt-1">
              {t('iAmA')}
            </p>
          </div>

          {/* Account Type Selector */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#d8f9ff] border border-[#b1f2ff] rounded-2xl">
            <button
              type="button"
              onClick={() => setUserType('family')}
              className={`p-2.5 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                userType === 'family'
                  ? 'bg-white text-[#3dcfff] shadow-xs font-bold border border-[#b1f2ff]'
                  : 'text-[#64746D] hover:text-[#172B25]'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="text-xs">{t('familyOption')}</span>
            </button>

            <button
              type="button"
              onClick={() => setUserType('individual')}
              className={`p-2.5 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                userType === 'individual'
                  ? 'bg-white text-[#3dcfff] shadow-xs font-bold border border-[#b1f2ff]'
                  : 'text-[#64746D] hover:text-[#172B25]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="text-xs">{t('caregiverOption')}</span>
            </button>

            <button
              type="button"
              onClick={() => setUserType('agency')}
              className={`p-2.5 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                userType === 'agency'
                  ? 'bg-white text-[#3dcfff] shadow-xs font-bold border border-[#b1f2ff]'
                  : 'text-[#64746D] hover:text-[#172B25]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span className="text-xs">{t('agencyOption')}</span>
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#172B25] mb-1">
                {userType === 'agency' ? 'Agency Business Name' : t('fullName')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={userType === 'agency' ? 'e.g. Suwasevana Healthcare Services' : 'e.g. Nadeesha Perera'}
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#d8f9ff] focus:bg-white border border-[#b1f2ff] focus:border-[#3dcfff] rounded-xl outline-none transition-colors text-[#172B25]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  {t('emailAddress')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#d8f9ff] focus:bg-white border border-[#b1f2ff] focus:border-[#3dcfff] rounded-xl outline-none transition-colors text-[#172B25]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  {t('phoneLKR')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+94 77 123 4567"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#d8f9ff] focus:bg-white border border-[#b1f2ff] focus:border-[#3dcfff] rounded-xl outline-none transition-colors text-[#172B25]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  {t('password')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 8 characters"
                    value={password}
                    minLength={8}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#d8f9ff] focus:bg-white border border-[#b1f2ff] focus:border-[#3dcfff] rounded-xl outline-none transition-colors text-[#172B25] pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#64746D] hover:text-[#172B25]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  {t('confirmPassword')} <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#d8f9ff] focus:bg-white border border-[#b1f2ff] focus:border-[#3dcfff] rounded-xl outline-none transition-colors text-[#172B25]"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded text-[#3dcfff] focus:ring-[#3dcfff]"
              />
              <label htmlFor="terms" className="text-xs text-[#64746D] leading-tight">
                {t('disclaimer')}
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#3dcfff] hover:bg-[#1eb5df] text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{loading ? 'Creating Account...' : t('createAccountBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-[#64746D]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#3dcfff] font-semibold hover:underline">
              {t('login')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
