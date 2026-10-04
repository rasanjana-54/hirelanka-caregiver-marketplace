import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { HospitalAutocomplete } from '../components/common/HospitalAutocomplete';
import { CaregiverCard } from '../components/common/CaregiverCard';
import { InquiryModal } from '../components/common/InquiryModal';
import { CaregiverProfile, AgencyProfile } from '../types';
import {
  ShieldCheck,
  Coins,
  MessageCircle,
  Building2,
  Clock,
  ArrowRight,
  Heart,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  PhoneCall,
  MapPin,
  Star
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { caregivers, agencies, hospitals } = useData();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Search widget state
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedService, setSelectedService] = useState('whole_day');
  const [selectedDate, setSelectedDate] = useState('2026-10-05');
  const [maxBudget, setMaxBudget] = useState(6000);

  // Modal contact state
  const [modalOpen, setModalOpen] = useState(false);
  const [targetContact, setTargetContact] = useState<CaregiverProfile | AgencyProfile | null>(null);
  const [targetType, setTargetType] = useState<'caregiver' | 'agency'>('caregiver');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedHospital) params.set('hospital', selectedHospital);
    if (selectedService) params.set('availability', selectedService);
    if (maxBudget) params.set('max_price', maxBudget.toString());
    navigate(`/caregivers?${params.toString()}`);
  };

  const handleQuickContact = (caregiver: CaregiverProfile) => {
    setTargetContact(caregiver);
    setTargetType('caregiver');
    setModalOpen(true);
  };

  const featuredCaregivers = caregivers.slice(0, 3);

  return (
    <div className="space-y-14 lg:space-y-20 pb-12">
      {/* Top Banner Notice (EldCare style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex items-center justify-between py-2 px-4 bg-white/80 backdrop-blur-xs border border-[#E5ECE8] rounded-2xl text-xs text-[#64746D]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#27865C] animate-pulse" />
            <span className="font-semibold text-[#172B25]">{t('emergencyNotice')}</span>
            <span className="hidden sm:inline">· National Hospital NHSL, Kalubowila, Ragama &amp; Kandy</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:1990"
              className="flex items-center gap-1.5 font-semibold text-[#176B55] hover:underline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{t('call247')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section — EXACT EldCare Style Curved Container (Image 2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#16423C] rounded-[2.5rem] overflow-hidden text-white shadow-xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-5xl lg:text-5xl font-normal leading-[1.15] tracking-tight font-serif text-white">
                  {t('heroTitle1')}{' '}
                  <span className="italic font-serif text-[#E4B35E] block sm:inline">
                    {t('heroTitleHighlight')}
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-sans max-w-lg">
                  {t('heroSubtitle')}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap pt-2">
                <Link
                  to="/caregivers"
                  className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-[#16423C] bg-white hover:bg-emerald-50 rounded-full transition-all shadow-md flex items-center gap-2 group cursor-pointer"
                >
                  <span>{t('scheduleConsultation')}</span>
                  <ArrowRight className="w-4 h-4 text-[#16423C] group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-white border border-white/30 hover:bg-white/10 rounded-full transition-all"
                >
                  {t('howItWorks')}
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-emerald-700/60 flex items-center gap-6 text-xs text-emerald-100/80 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#E4B35E]" />
                  <span>{t('policeIdVerified')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#E4B35E]" />
                  <span>{t('directWhatsAppContact')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#E4B35E]" />
                  <span>{t('transparentLkrRates')}</span>
                </div>
              </div>
            </div>

            {/* Right Photo Column */}
            <div className="lg:col-span-6 h-full min-h-[360px] lg:min-h-[500px] relative">
              <img
                src="/src/assets/images/elderly_care_warm_1791087234928.jpg"
                alt="Smiling elderly grandfather with caring family and gentle healthcare caregiver"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-b-[2.5rem] lg:rounded-b-none lg:rounded-r-[2.5rem]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#16423C]/50 via-transparent to-transparent lg:hidden" />
            </div>

          </div>
        </div>
      </section>

      {/* Floating Hospital Search Widget */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="bg-white border border-[#E5ECE8] rounded-3xl p-6 sm:p-8 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5ECE8]">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#176B55]" />
              <span className="text-xs font-bold text-[#172B25] uppercase tracking-wider">
                {t('quickHospitalSearch')}
              </span>
            </div>
            <span className="text-xs text-[#64746D] hidden sm:inline">
              {t('govPrivateHospitals')}
            </span>
          </div>

          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-5">
              <label className="block text-xs font-semibold text-[#172B25] mb-1">
                {t('selectHospitalOrDistrict')}
              </label>
              <HospitalAutocomplete
                value={selectedHospital}
                onChange={setSelectedHospital}
                placeholder={t('hospitalSearchPlaceholder')}
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-[#172B25] mb-1">
                {t('shiftCoverage')}
              </label>
              <select
                value={selectedService}
                onChange={e => setSelectedService(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-white border border-[#E5ECE8] rounded-xl text-[#172B25] focus:border-[#176B55] outline-none"
              >
                <option value="whole_day">{t('whole_day')}</option>
                <option value="nights">{t('nights')}</option>
                <option value="half_day_morning">{t('half_day_morning')}</option>
                <option value="half_day_afternoon">{t('half_day_afternoon')}</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#172B25] mb-1">
                <span>{t('maxBudget')}</span>
                <span className="font-bold text-[#176B55] tabular-nums">
                  Rs. {maxBudget}
                </span>
              </div>
              <input
                type="range"
                min={3000}
                max={8000}
                step={500}
                value={maxBudget}
                onChange={e => setMaxBudget(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg accent-[#176B55] cursor-pointer mt-2"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#176B55] hover:bg-[#135946] rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer h-10"
              >
                <span>{t('searchBtn')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Our Story / Editorial Mission Section (EldCare style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-800">
            <Sparkles className="w-3 h-3 text-[#E4B35E]" />
            <span>{t('dedicatedToFamilies')}</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-normal text-[#172B25] tracking-tight font-serif">
            {t('storyTitle')}
          </h2>
          <p className="text-sm text-[#64746D] leading-relaxed">
            {t('storyText')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E5ECE8] rounded-3xl p-7 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#176B55] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#172B25]">
              {t('card1Title')}
            </h3>
            <p className="text-xs text-[#64746D] leading-relaxed">
              {t('card1Desc')}
            </p>
          </div>

          <div className="bg-white border border-[#E5ECE8] rounded-3xl p-7 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D9A441] flex items-center justify-center">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#172B25]">
              {t('card2Title')}
            </h3>
            <p className="text-xs text-[#64746D] leading-relaxed">
              {t('card2Desc')}
            </p>
          </div>

          <div className="bg-white border border-[#E5ECE8] rounded-3xl p-7 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#2E8B70] flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#172B25]">
              {t('card3Title')}
            </h3>
            <p className="text-xs text-[#64746D] leading-relaxed">
              {t('card3Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Caregivers Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-[#176B55] uppercase tracking-wider">
              {t('findCaregivers')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B25] tracking-tight mt-1">
              {t('topRatedCaregivers')}
            </h2>
            <p className="text-xs text-[#64746D] mt-1">
              {t('topRatedSubtitle')}
            </p>
          </div>

          <Link
            to="/caregivers"
            className="text-xs font-bold text-[#176B55] hover:text-[#135946] flex items-center gap-1.5 transition-colors"
          >
            <span>{t('viewAllProviders')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCaregivers.map(cg => (
            <CaregiverCard
              key={cg.id}
              caregiver={cg}
              onQuickContact={handleQuickContact}
            />
          ))}
        </div>
      </section>

      {/* Agency Partner Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#176B55] text-white rounded-3xl p-8 lg:p-12 relative overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">
              {t('forAgencies')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif tracking-tight">
              {t('agencyBannerTitle')}
            </h2>
            <p className="text-sm text-emerald-100 leading-relaxed font-sans">
              {t('agencyBannerSubtitle')}
            </p>
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <Link
                to="/register"
                className="px-5 py-3 text-xs font-bold text-[#176B55] bg-white hover:bg-emerald-50 rounded-xl transition-colors shadow-sm"
              >
                {t('listYourAgency')}
              </Link>
              <Link
                to="/agencies"
                className="px-5 py-3 text-xs font-semibold text-white border border-white/30 hover:bg-white/10 rounded-xl transition-colors"
              >
                {t('agenciesDirectory')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold text-[#176B55] uppercase tracking-wider">
            {t('familyReviewsTitle')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#172B25] mt-1 tracking-tight">
            {t('testimonialsTitle')}
          </h2>
          <p className="text-xs text-[#64746D] mt-1">
            {t('testimonialsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E5ECE8] rounded-3xl p-6 flex flex-col justify-between shadow-xs">
            <p className="text-xs text-[#172B25] leading-relaxed italic">
              &quot;My mother was admitted to Colombo National Hospital for hip surgery. Nadeesha took care of her bathing, medication times, and helped her take her first walking steps with the physio. She kept our family updated on WhatsApp continuously.&quot;
            </p>
            <div className="mt-4 pt-4 border-t border-[#E5ECE8] text-xs">
              <div className="font-bold text-[#172B25]">Ravi Jayawardena</div>
              <div className="text-[#64746D]">National Hospital of Sri Lanka (Ward 14)</div>
            </div>
          </div>

          <div className="bg-white border border-[#E5ECE8] rounded-3xl p-6 flex flex-col justify-between shadow-xs">
            <p className="text-xs text-[#172B25] leading-relaxed italic">
              &quot;Sanduni stayed alert throughout the night at Ragama Hospital, monitoring saline and assisting my sister. Finding a verified caregiver within an hour on HireLanka Care was a huge relief for our working family.&quot;
            </p>
            <div className="mt-4 pt-4 border-t border-[#E5ECE8] text-xs">
              <div className="font-bold text-[#172B25]">Manel Gunaratne</div>
              <div className="text-[#64746D]">Colombo North Teaching Hospital (Ragama)</div>
            </div>
          </div>

          <div className="bg-white border border-[#E5ECE8] rounded-3xl p-6 flex flex-col justify-between shadow-xs">
            <p className="text-xs text-[#172B25] leading-relaxed italic">
              &quot;Kumar helped my father immensely during his stroke recovery at Kalubowila hospital. His patient handling technique and kind manner helped my father stay positive.&quot;
            </p>
            <div className="mt-4 pt-4 border-t border-[#E5ECE8] text-xs">
              <div className="font-bold text-[#172B25]">Priyantha De Silva</div>
              <div className="text-[#64746D]">Colombo South Teaching Hospital</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      {targetContact && (
        <InquiryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          target={targetContact}
          targetType={targetType}
        />
      )}
    </div>
  );
};
