import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { HeartHandshake, CheckCircle2, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E5ECE8] shadow-md p-8 space-y-6">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-[#176B55] text-white flex items-center justify-center mx-auto mb-3">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-[#172B25]">{t('forgotPassword')}</h2>
          <p className="text-xs text-[#64746D] mt-1">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-[#176B55] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#172B25]">Reset Email Sent</h3>
            <p className="text-xs text-[#64746D] leading-relaxed">
              If an account exists for <strong className="text-[#172B25]">{email}</strong>, we have sent instructions to reset your password.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#176B55] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('login')}</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#172B25] mb-1">
                {t('emailAddress')}
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF8] focus:bg-white border border-[#E5ECE8] focus:border-[#176B55] rounded-xl outline-none text-[#172B25]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#176B55] hover:bg-[#135946] text-white font-semibold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              Send Password Reset Link
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-[#64746D] hover:text-[#172B25]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('login')}</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
