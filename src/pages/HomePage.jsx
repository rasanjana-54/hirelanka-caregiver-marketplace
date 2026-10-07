import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { HospitalAutocomplete } from '../components/common/HospitalAutocomplete';
import { CaregiverCard } from '../components/common/CaregiverCard';
import { InquiryModal } from '../components/common/InquiryModal';
import { ShieldCheck, Coins, MessageCircle, Building2, ArrowRight, CheckCircle2, Sparkles, PhoneCall } from 'lucide-react';
import heroCareImage from '../assets/images/elderly_care_warm_1791087234928.jpg';
export const HomePage = () => {
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
    const [targetContact, setTargetContact] = useState(null);
    const [targetType, setTargetType] = useState('caregiver');
    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (selectedHospital)
            params.set('hospital', selectedHospital);
        if (selectedService)
            params.set('availability', selectedService);
        if (maxBudget)
            params.set('max_price', maxBudget.toString());
        navigate(`/caregivers?${params.toString()}`);
    };
    const handleQuickContact = (caregiver) => {
        setTargetContact(caregiver);
        setTargetType('caregiver');
        setModalOpen(true);
    };
    const featuredCaregivers = caregivers.slice(0, 3);
    return (<div className="space-y-14 lg:space-y-20 pb-12">
      {/* Top Banner Notice (EldCare style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex items-center justify-between py-2 px-4 bg-white/80 backdrop-blur-xs border border-[#b1f2ff] rounded-2xl text-xs text-[#64746D]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3dcfff] animate-pulse"/>
            <span className="font-semibold text-[#172B25]">{t('emergencyNotice')}</span>
            <span className="hidden sm:inline">· National Hospital NHSL, Kalubowila, Ragama &amp; Kandy</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:1990" className="flex items-center gap-1.5 font-semibold text-[#3dcfff] hover:underline">
              <PhoneCall className="w-3.5 h-3.5"/>
              <span>{t('call247')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section — EXACT EldCare Style Curved Container (Image 2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#3dcfff] via-[#63e5ff] to-[#d8f9ff] rounded-[2.5rem] overflow-hidden text-[#172B25] shadow-xl relative ring-1 ring-[#b1f2ff]">
          <div className="absolute -top-24 -left-16 w-64 h-64 rounded-full bg-white/20 blur-3xl"/>
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#d8f9ff]/60 blur-3xl"/>
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center relative z-10">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-5xl lg:text-5xl font-normal leading-[1.15] tracking-tight font-serif text-[#172B25]">
                  {t('heroTitle1')}{' '}
                  <span className="italic font-serif text-[#0d4c5a] block sm:inline">
                    {t('heroTitleHighlight')}
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-[#173c4a]/80 leading-relaxed font-sans max-w-lg">
                  {t('heroSubtitle')}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap pt-2">
                <Link to="/caregivers" className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-[#172B25] bg-white hover:bg-cyan-50 rounded-full transition-all shadow-md flex items-center gap-2 group cursor-pointer">
                  <span>{t('scheduleConsultation')}</span>
                  <ArrowRight className="w-4 h-4 text-[#172B25] group-hover:translate-x-1 transition-transform"/>
                </Link>
                <Link to="/how-it-works" className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-[#172B25] border border-[#172B25]/20 hover:bg-white/30 rounded-full transition-all">
                  {t('howItWorks')}
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-[#172B25]/20 flex items-center gap-6 text-xs text-[#173c4a]/80 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0d4c5a]"/>
                  <span>{t('policeIdVerified')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0d4c5a]"/>
                  <span>{t('directWhatsAppContact')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0d4c5a]"/>
                  <span>{t('transparentLkrRates')}</span>
                </div>
              </div>
            </div>

            {/* Right Photo Column */}
            <div className="lg:col-span-6 h-full min-h-[360px] lg:min-h-[500px] relative">
              <img src={heroCareImage} alt="Smiling elderly grandfather with caring family and gentle healthcare caregiver" className="w-full h-full object-cover rounded-b-[2.5rem] lg:rounded-b-none lg:rounded-r-[2.5rem]"/>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d4c5a]/20 via-transparent to-transparent lg:hidden"/>
            </div>

          </div>
        </div>
      </section>

      {/* Floating Hospital Search Widget */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="bg-white border border-[#b1f2ff] rounded-3xl p-6 sm:p-8 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#b1f2ff]">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#3dcfff]"/>
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
              <HospitalAutocomplete value={selectedHospital} onChange={setSelectedHospital} placeholder={t('hospitalSearchPlaceholder')}/>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-[#172B25] mb-1">
                {t('shiftCoverage')}
              </label>
              <select value={selectedService} onChange={e => setSelectedService(e.target.value)} className="w-full px-3 py-2.5 text-xs bg-white border border-[#b1f2ff] rounded-xl text-[#172B25] focus:border-[#3dcfff] outline-none">
                <option value="whole_day">{t('whole_day')}</option>
                <option value="nights">{t('nights')}</option>
                <option value="half_day_morning">{t('half_day_morning')}</option>
                <option value="half_day_afternoon">{t('half_day_afternoon')}</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#172B25] mb-1">
                <span>{t('maxBudget')}</span>
                <span className="font-bold text-[#3dcfff] tabular-nums">
                  Rs. {maxBudget}
                </span>
              </div>
              <input type="range" min={3000} max={8000} step={500} value={maxBudget} onChange={e => setMaxBudget(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg accent-[#3dcfff] cursor-pointer mt-2"/>
            </div>

            <div className="md:col-span-2">
              <button type="submit" className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#3dcfff] hover:bg-[#1eb5df] rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer h-10">
                <span>{t('searchBtn')}</span>
                <ArrowRight className="w-3.5 h-3.5"/>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Our Story / Editorial Mission Section (EldCare style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-800">
            <Sparkles className="w-3 h-3 text-[#E4B35E]"/>
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
          <div className="bg-white border border-[#b1f2ff] rounded-3xl p-7 shadow-xs space-y-3 hover:-translate-y-1 hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-[#3dcfff] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6"/>
            </div>
            <h3 className="text-base font-bold text-[#172B25]">
              {t('card1Title')}
            </h3>
            <p className="text-xs text-[#64746D] leading-relaxed">
              {t('card1Desc')}
            </p>
          </div>

          <div className="bg-white border border-[#b1f2ff] rounded-3xl p-7 shadow-xs space-y-3 hover:-translate-y-1 hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D9A441] flex items-center justify-center">
              <Coins className="w-6 h-6"/>
            </div>
            <h3 className="text-base font-bold text-[#172B25]">
              {t('card2Title')}
            </h3>
            <p className="text-xs text-[#64746D] leading-relaxed">
              {t('card2Desc')}
            </p>
          </div>

          <div className="bg-white border border-[#b1f2ff] rounded-3xl p-7 shadow-xs space-y-3 hover:-translate-y-1 hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-[#63e5ff] flex items-center justify-center">
              <MessageCircle className="w-6 h-6"/>
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
            <span className="text-xs font-semibold text-[#3dcfff] uppercase tracking-wider">
              {t('findCaregivers')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B25] tracking-tight mt-1">
              {t('topRatedCaregivers')}
            </h2>
            <p className="text-xs text-[#64746D] mt-1">
              {t('topRatedSubtitle')}
            </p>
          </div>

          <Link to="/caregivers" className="text-xs font-bold text-[#3dcfff] hover:text-[#1eb5df] flex items-center gap-1.5 transition-colors">
            <span>{t('viewAllProviders')}</span>
            <ArrowRight className="w-3.5 h-3.5"/>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCaregivers.map(cg => (<CaregiverCard key={cg.id} caregiver={cg} onQuickContact={handleQuickContact}/>))}
        </div>
      </section>

      {/* Agency Partner Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#3dcfff] via-[#63e5ff] to-[#d8f9ff] text-[#172B25] rounded-3xl p-8 lg:p-12 relative overflow-hidden shadow-lg ring-1 ring-[#b1f2ff]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.5),_transparent_36%)]"/>
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-semibold text-[#0d4c5a] uppercase tracking-wider">
              {t('forAgencies')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif tracking-tight text-[#172B25]">
              {t('agencyBannerTitle')}
            </h2>
            <p className="text-sm text-[#173c4a]/80 leading-relaxed font-sans">
              {t('agencyBannerSubtitle')}
            </p>
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <Link to="/register" className="px-5 py-3 text-xs font-bold text-white bg-[#0d4c5a] hover:bg-[#123f50] rounded-xl transition-colors shadow-sm">
                {t('listYourAgency')}
              </Link>
              <Link to="/agencies" className="px-5 py-3 text-xs font-semibold text-[#172B25] border border-[#172B25]/20 hover:bg-white/30 rounded-xl transition-colors">
                {t('agenciesDirectory')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold text-[#3dcfff] uppercase tracking-wider">
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
          <div className="bg-white border border-[#b1f2ff] rounded-3xl p-6 flex flex-col justify-between shadow-xs">
            <p className="text-xs text-[#172B25] leading-relaxed italic">
              &quot;My mother was admitted to Colombo National Hospital for hip surgery. Nadeesha took care of her bathing, medication times, and helped her take her first walking steps with the physio. She kept our family updated on WhatsApp continuously.&quot;
            </p>
            <div className="mt-4 pt-4 border-t border-[#b1f2ff] text-xs">
              <div className="font-bold text-[#172B25]">Ravi Jayawardena</div>
              <div className="text-[#64746D]">National Hospital of Sri Lanka (Ward 14)</div>
            </div>
          </div>

          <div className="bg-white border border-[#b1f2ff] rounded-3xl p-6 flex flex-col justify-between shadow-xs">
            <p className="text-xs text-[#172B25] leading-relaxed italic">
              &quot;Sanduni stayed alert throughout the night at Ragama Hospital, monitoring saline and assisting my sister. Finding a verified caregiver within an hour on HireLanka Care was a huge relief for our working family.&quot;
            </p>
            <div className="mt-4 pt-4 border-t border-[#b1f2ff] text-xs">
              <div className="font-bold text-[#172B25]">Manel Gunaratne</div>
              <div className="text-[#64746D]">Colombo North Teaching Hospital (Ragama)</div>
            </div>
          </div>

          <div className="bg-white border border-[#b1f2ff] rounded-3xl p-6 flex flex-col justify-between shadow-xs">
            <p className="text-xs text-[#172B25] leading-relaxed italic">
              &quot;Kumar helped my father immensely during his stroke recovery at Kalubowila hospital. His patient handling technique and kind manner helped my father stay positive.&quot;
            </p>
            <div className="mt-4 pt-4 border-t border-[#b1f2ff] text-xs">
              <div className="font-bold text-[#172B25]">Priyantha De Silva</div>
              <div className="text-[#64746D]">Colombo South Teaching Hospital</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      {targetContact && (<InquiryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} target={targetContact} targetType={targetType}/>)}
    </div>);
};
