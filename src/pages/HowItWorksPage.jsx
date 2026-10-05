import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, ArrowRight } from 'lucide-react';
export const HowItWorksPage = () => {
    const { t } = useLanguage();
    return (<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-semibold text-[#3dcfff] uppercase tracking-wider">
          {t('policeIdVerified')} · {t('transparentLkrRates')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B25] tracking-tight">
          {t('howItWorksTitle')}
        </h1>
        <p className="text-base text-[#64746D] leading-relaxed">
          {t('howItWorksSubtitle')}
        </p>
      </div>

      {/* For Families Step-by-Step */}
      <div className="bg-white border border-[#b1f2ff] rounded-3xl p-8 sm:p-10 shadow-xs space-y-8">
        <div>
          <span className="text-xs font-semibold text-[#3dcfff] uppercase tracking-wider">
            {t('forFamiliesTitle')}
          </span>
          <h2 className="text-2xl font-bold text-[#172B25] mt-1">
            {t('forFamiliesTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-[#3dcfff] flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="text-base font-bold text-[#172B25]">
              {t('step1Title')}
            </h3>
            <p className="text-xs text-[#64746D] leading-relaxed">
              {t('step1Desc')}
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-[#3dcfff] flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="text-base font-bold text-[#172B25]">
              {t('step2Title')}
            </h3>
            <p className="text-xs text-[#64746D] leading-relaxed">
              {t('step2Desc')}
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-[#3dcfff] flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="text-base font-bold text-[#172B25]">
              {t('step3Title')}
            </h3>
            <p className="text-xs text-[#64746D] leading-relaxed">
              {t('step3Desc')}
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-center">
          <Link to="/caregivers" className="px-6 py-3 text-xs font-semibold text-white bg-[#3dcfff] hover:bg-[#1eb5df] rounded-xl transition-colors shadow-xs flex items-center gap-2">
            <span>{t('findCaregivers')}</span>
            <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>
      </div>

      {/* Why Direct Contact (No In-App Payments) */}
      <div className="bg-[#d8f9ff] border border-[#b1f2ff] rounded-3xl p-8 sm:p-10 space-y-6">
        <h2 className="text-xl font-bold text-[#172B25]">
          {t('zeroCommissionTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#64746D] leading-relaxed">
          <div className="space-y-2 bg-white p-5 rounded-2xl border border-[#b1f2ff]">
            <div className="font-bold text-[#172B25] text-sm">
              {t('directWhatsAppContact')}
            </div>
            <p>
              {t('card3Desc')}
            </p>
          </div>

          <div className="space-y-2 bg-white p-5 rounded-2xl border border-[#b1f2ff]">
            <div className="font-bold text-[#172B25] text-sm">
              {t('zeroCommissionTitle')}
            </div>
            <p>
              {t('zeroCommissionDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* For Caregivers & Agencies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-[#b1f2ff] rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold text-[#172B25]">
            {t('forCaregivers')}
          </h3>
          <p className="text-xs text-[#64746D] leading-relaxed">
            {t('card1Desc')}
          </p>
          <ul className="text-xs text-[#172B25] space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3dcfff]"/>
              <span>{t('policeIdVerified')}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3dcfff]"/>
              <span>{t('directWhatsAppContact')}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3dcfff]"/>
              <span>{t('transparentLkrRates')}</span>
            </li>
          </ul>
          <div className="pt-2">
            <Link to="/register" className="inline-flex px-4 py-2.5 text-xs font-semibold bg-[#3dcfff] text-white rounded-xl hover:bg-[#1eb5df]">
              {t('register')}
            </Link>
          </div>
        </div>

        <div className="bg-white border border-[#b1f2ff] rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold text-[#172B25]">
            {t('forAgencies')}
          </h3>
          <p className="text-xs text-[#64746D] leading-relaxed">
            {t('agencyBannerSubtitle')}
          </p>
          <ul className="text-xs text-[#172B25] space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3dcfff]"/>
              <span>{t('activeAttendants')}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3dcfff]"/>
              <span>{t('hospitalsCovered')}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3dcfff]"/>
              <span>{t('directWhatsAppContact')}</span>
            </li>
          </ul>
          <div className="pt-2">
            <Link to="/register" className="inline-flex px-4 py-2.5 text-xs font-semibold bg-[#3dcfff] text-white rounded-xl hover:bg-[#1eb5df]">
              {t('listYourAgency')}
            </Link>
          </div>
        </div>
      </div>
    </div>);
};
