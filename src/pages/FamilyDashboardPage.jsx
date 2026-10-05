import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { InquiryModal } from '../components/common/InquiryModal';
import { LayoutDashboard, Calendar as CalendarIcon, User, HelpCircle, LogOut, Search, MapPin, ChevronRight, ChevronLeft, Building2, Clock, MessageCircle } from 'lucide-react';
export const FamilyDashboardPage = () => {
    const { currentUser, logout } = useAuth();
    const { caregivers, hospitals, inquiries } = useData();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [activeNav, setActiveNav] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLocation, setSearchLocation] = useState('Colombo');
    const [selectedCaregiver, setSelectedCaregiver] = useState(null);
    const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
    // Month navigation for appointments card
    const [calendarMonth, setCalendarMonth] = useState('October 2026');
    const upcomingShifts = [
        {
            dateNumber: '06',
            dateDay: 'Mon',
            caregiverName: 'Nadeesha Perera',
            hospitalWard: 'National Hospital (NHSL) - Ward 14',
            timeSlot: '07:00 AM - 07:00 PM',
            shiftType: 'Full Day Care',
            status: 'Confirmed'
        },
        {
            dateNumber: '07',
            dateDay: 'Tue',
            caregiverName: 'Nadeesha Perera',
            hospitalWard: 'National Hospital (NHSL) - Ward 14',
            timeSlot: '07:00 AM - 07:00 PM',
            shiftType: 'Full Day Care',
            status: 'Confirmed'
        },
        {
            dateNumber: '09',
            dateDay: 'Thu',
            caregiverName: 'Sanduni Fernando',
            hospitalWard: 'Colombo North Teaching Hospital (Ragama)',
            timeSlot: '07:00 PM - 07:00 AM',
            shiftType: 'Night Shift Vigilance',
            status: 'Scheduled'
        }
    ];
    const nearbyHospitals = hospitals.slice(0, 3);
    const recommendedCaregivers = caregivers.slice(0, 3);
    const handleOpenContact = (cg) => {
        setSelectedCaregiver(cg);
        setInquiryModalOpen(true);
    };
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate(`/caregivers?hospital=${encodeURIComponent(searchQuery)}`);
    };
    return (<div className="min-h-screen bg-[#F4F6F5] flex">
      {/* LEFT SIDEBAR (HealthAI style - Image 1) */}
      <aside className="w-64 bg-white border-r border-[#b1f2ff] hidden md:flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#3dcfff] text-white flex items-center justify-center font-bold">
              +
            </div>
            <span className="text-lg font-bold tracking-tight text-[#172B25]">
              HireLanka Care
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-semibold">
            <button type="button" onClick={() => setActiveNav('dashboard')} className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-colors cursor-pointer ${activeNav === 'dashboard'
            ? 'bg-[#63e5ff] text-white shadow-xs'
            : 'text-[#64746D] hover:text-[#172B25] hover:bg-slate-50'}`}>
              <LayoutDashboard className="w-4 h-4"/>
              <span>{t('dashboard')}</span>
            </button>

            <button type="button" onClick={() => setActiveNav('calendar')} className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-colors cursor-pointer ${activeNav === 'calendar'
            ? 'bg-[#63e5ff] text-white shadow-xs'
            : 'text-[#64746D] hover:text-[#172B25] hover:bg-slate-50'}`}>
              <CalendarIcon className="w-4 h-4"/>
              <span>{t('availabilityCalendarTitle')}</span>
            </button>

            <Link to="/caregivers" className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[#64746D] hover:text-[#172B25] hover:bg-slate-50 transition-colors">
              <User className="w-4 h-4"/>
              <span>{t('findCaregivers')}</span>
            </Link>

            <Link to="/how-it-works" className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[#64746D] hover:text-[#172B25] hover:bg-slate-50 transition-colors">
              <HelpCircle className="w-4 h-4"/>
              <span>{t('howItWorks')}</span>
            </Link>

            <button type="button" onClick={logout} className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[#D9534F] hover:bg-red-50 transition-colors cursor-pointer">
              <LogOut className="w-4 h-4"/>
              <span>{t('logout')}</span>
            </button>
          </nav>
        </div>

        {/* Bottom Promo Card (Image 1 style) */}
        <div className="bg-[#172B25] text-white p-4 rounded-2xl space-y-3 relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <h4 className="text-xs font-bold">{t('emergencyNotice')}</h4>
            <p className="text-[11px] text-emerald-100/80 leading-relaxed">
              Immediate bedside attendants available across NHSL, Kalubowila, Ragama.
            </p>
          </div>
          <Link to="/caregivers" className="w-full py-2 px-3 text-[11px] font-bold text-[#172B25] bg-[#63e5ff] hover:bg-cyan-400 text-white rounded-xl block text-center transition-colors cursor-pointer">
            {t('findCaregivers')}
          </Link>
        </div>
      </aside>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto">
        
        {/* Top Header Bar (Image 1 style) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-[#64746D]">
              Hi, {currentUser ? currentUser.fullName.split(' ')[0] : 'Ravi'}
            </div>
            <h1 className="text-2xl font-extrabold text-[#172B25] tracking-tight">
              {t('welcomeBack')}
            </h1>
          </div>

          {/* Search bar + Profile */}
          <div className="flex items-center gap-3 flex-wrap">
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-white border border-[#b1f2ff] rounded-xl px-2 py-1 shadow-2xs">
              <div className="flex items-center gap-2 px-2 text-xs text-[#64746D]">
                <Search className="w-3.5 h-3.5"/>
                <input type="text" placeholder={t('findCaregiverInputPlaceholder')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-32 sm:w-40 text-xs outline-none bg-transparent text-[#172B25]"/>
              </div>
              <div className="h-4 w-px bg-[#b1f2ff]"/>
              <div className="flex items-center gap-1.5 px-2 text-xs text-[#64746D]">
                <MapPin className="w-3.5 h-3.5 text-[#3dcfff]"/>
                <input type="text" value={searchLocation} onChange={e => setSearchLocation(e.target.value)} className="w-20 text-xs outline-none bg-transparent text-[#172B25]"/>
              </div>
              <button type="submit" className="px-3 py-1.5 bg-[#63e5ff] hover:bg-[#25735c] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer">
                {t('searchBtn')}
              </button>
            </form>

            {/* User profile avatar */}
            <div className="flex items-center gap-2 pl-2">
              <img src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-[#b1f2ff]"/>
              <span className="text-xs font-semibold text-[#172B25] hidden sm:inline">
                {currentUser?.fullName || 'Ravi Jayawardena'}
              </span>
            </div>
          </div>
        </div>

        {/* HERO BANNER & APPOINTMENTS (Image 1 Split Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Announcement Banner (Image 1 style) */}
          <div className="lg:col-span-7 bg-[#63e5ff] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm min-h-[260px] flex flex-col justify-between">
            <div className="relative z-10 max-w-sm space-y-2">
              <h2 className="text-2xl font-bold tracking-tight leading-snug">
                {t('noStressBanner')}
              </h2>
              <p className="text-xs text-emerald-100 leading-relaxed">
                {t('noStressBannerSub')}
              </p>
              <div className="text-[11px] text-emerald-200 font-mono pt-1">
                Full Day · Night Shift · Post-Op Transition
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-3 pt-4">
              <div className="flex -space-x-2">
                {caregivers.slice(0, 3).map(cg => (<img key={cg.id} src={cg.profileImageUrl} alt={cg.fullName} className="w-7 h-7 rounded-full border-2 border-white object-cover"/>))}
              </div>
              <span className="text-xs text-emerald-100 font-medium">
                +180 caregivers active in Colombo &amp; Kandy
              </span>
            </div>

            {/* Right illustration / photo overlay */}
            <div className="absolute right-0 bottom-0 top-0 w-2/5 hidden sm:block opacity-90">
              <img src="/src/assets/images/healthcare_team_banner_1791087247272.jpg" alt="Sri Lankan healthcare attendants" className="w-full h-full object-cover rounded-r-3xl"/>
            </div>
          </div>

          {/* Right Upcoming Appointments Card (Image 1 style) */}
          <div className="lg:col-span-5 bg-white border border-[#b1f2ff] rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#b1f2ff]">
              <h3 className="text-sm font-bold text-[#172B25]">
                {t('upcomingHospitalShifts')}
              </h3>
              <Link to="/caregivers" className="text-xs text-[#63e5ff] font-semibold hover:underline">
                View All &gt;
              </Link>
            </div>

            {/* Month Header */}
            <div className="flex items-center justify-between text-xs text-[#172B25] px-1 font-semibold">
              <span>{calendarMonth}</span>
              <div className="flex items-center gap-1">
                <button type="button" className="p-1 hover:bg-slate-100 rounded">
                  <ChevronLeft className="w-3.5 h-3.5 text-[#64746D]"/>
                </button>
                <button type="button" className="p-1 hover:bg-slate-100 rounded">
                  <ChevronRight className="w-3.5 h-3.5 text-[#64746D]"/>
                </button>
              </div>
            </div>

            {/* Appointments items stack */}
            <div className="space-y-2.5">
              {upcomingShifts.map((shift, idx) => (<div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-[#d8f9ff] border border-[#b1f2ff] hover:border-[#63e5ff] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 text-[#3dcfff] flex flex-col items-center justify-center shrink-0">
                      <span className="text-[9px] uppercase font-bold">{shift.dateDay}</span>
                      <span className="text-sm font-extrabold font-mono leading-none">{shift.dateNumber}</span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#172B25]">
                        {shift.caregiverName}
                      </div>
                      <div className="text-[11px] text-[#64746D]">
                        {shift.timeSlot}
                      </div>
                      <div className="text-[10px] text-[#3dcfff] font-medium">
                        {shift.hospitalWard}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-[#64746D]"/>
                </div>))}
            </div>
          </div>

        </div>

        {/* NEARBY HOSPITALS & CARE CENTERS (Image 1 style) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#172B25]">
              {t('nearbyHospitals')}
            </h3>
            <Link to="/caregivers" className="text-xs text-[#63e5ff] font-semibold hover:underline">
              View All &gt;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {nearbyHospitals.map((hosp, i) => (<Link key={hosp.id} to={`/caregivers?hospital=${hosp.id}`} className="bg-white border border-[#b1f2ff] rounded-2xl p-4 hover:border-[#63e5ff] hover:shadow-xs transition-all flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-50 text-[#3dcfff] flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6"/>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#172B25] truncate">
                    {hosp.name}
                  </div>
                  <div className="text-[11px] text-[#64746D]">{hosp.district} · {hosp.hospitalType}</div>
                  <div className="text-[10px] text-[#63e5ff] font-medium mt-0.5">
                    {i === 0 ? '1.2 km away' : i === 1 ? '3.5 km away' : '8.1 km away'}
                  </div>
                </div>
              </Link>))}
          </div>
        </div>

        {/* RECOMMENDED CAREGIVERS CARDS GRID (Image 1 style) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#172B25]">
              {t('recommendedCaregivers')}
            </h3>
            <Link to="/caregivers" className="text-xs text-[#63e5ff] font-semibold hover:underline">
              View All &gt;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {recommendedCaregivers.map(cg => (<div key={cg.id} className="bg-white border border-[#b1f2ff] rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#63e5ff] transition-colors">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <img src={cg.profileImageUrl} alt={cg.fullName} referrerPolicy="no-referrer" className="w-14 h-14 rounded-2xl object-cover border border-[#b1f2ff]"/>
                    <div>
                      <h4 className="text-sm font-bold text-[#172B25]">
                        {cg.fullName}
                      </h4>
                      <div className="text-xs text-[#64746D]">
                        Specialist | {cg.experienceYears} {t('yearsExperience')}
                      </div>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-[#3dcfff] bg-cyan-50 px-2 py-0.5 rounded-full">
                        {cg.availabilityType === 'nights' ? t('nightShiftCare') : t('whole_day')}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#b1f2ff] flex items-center justify-between text-xs text-[#64746D]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#63e5ff]"/>
                      <span>Mon - Sat Shifts</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#172B25] font-mono tabular-nums">
                        Rs. {cg.pricePerDay.toLocaleString()}
                      </div>
                      <div className="text-[10px]">{t('feeStartingAt')}</div>
                    </div>
                  </div>
                </div>

                <button type="button" onClick={() => handleOpenContact(cg)} className="w-full py-2.5 px-3 bg-[#63e5ff] hover:bg-[#25735c] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5"/>
                  <span>{t('contactOnWhatsApp')}</span>
                </button>
              </div>))}
          </div>
        </div>

      </main>

      {/* Inquiry Modal */}
      {selectedCaregiver && (<InquiryModal isOpen={inquiryModalOpen} onClose={() => setInquiryModalOpen(false)} target={selectedCaregiver} targetType="caregiver"/>)}
    </div>);
};
