import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { AvailabilityCalendar } from '../components/common/AvailabilityCalendar';
import { StarRating } from '../components/common/StarRating';
import { Eye, MessageCircle, Star, CheckCircle2, Save, ShieldCheck } from 'lucide-react';
import { caregiverFallbackImage, handleImageFallback } from '../lib/imageFallbacks';
export const CaregiverDashboardPage = () => {
    const { currentUser } = useAuth();
    const { caregivers, hospitals, updateCaregiverProfile, getCaregiverAvailability, updateSlotAvailability, bulkUpdateAvailability, getInquiriesForUser, getReviewsForProfile } = useData();
    // Find caregiver profile matching currentUser or default to Nadeesha
    const caregiver = caregivers.find(c => c.userId === currentUser?.id) || caregivers[0];
    const { t } = useLanguage();
    const slots = getCaregiverAvailability(caregiver.id);
    const inquiries = getInquiriesForUser(caregiver.id);
    const reviews = getReviewsForProfile(caregiver.id);
    // Active dashboard tab
    const [activeTab, setActiveTab] = useState('overview');
    // Profile edit form state
    const [fullName, setFullName] = useState(caregiver.fullName);
    const [age, setAge] = useState(caregiver.age);
    const [bio, setBio] = useState(caregiver.bio);
    const [pricePerHour, setPricePerHour] = useState(caregiver.pricePerHour);
    const [pricePerDay, setPricePerDay] = useState(caregiver.pricePerDay);
    const [pricePerShift, setPricePerShift] = useState(caregiver.pricePerShift);
    const [primaryHospitalId, setPrimaryHospitalId] = useState(caregiver.primaryHospitalId);
    const [phoneNumber, setPhoneNumber] = useState(caregiver.phoneNumber);
    const [whatsappNumber, setWhatsappNumber] = useState(caregiver.whatsappNumber);
    const [isActive, setIsActive] = useState(caregiver.isActive);
    const [savedSuccess, setSavedSuccess] = useState(false);
    // Bulk update slot
    const [bulkSlotType, setBulkSlotType] = useState('whole_day');
    const handleSaveProfile = (e) => {
        e.preventDefault();
        updateCaregiverProfile(caregiver.id, {
            fullName,
            age,
            bio,
            pricePerHour,
            pricePerDay,
            pricePerShift,
            primaryHospitalId,
            phoneNumber,
            whatsappNumber,
            isActive
        });
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
    };
    const handleToggleSlot = (date, isAvailable, timeSlot) => {
        updateSlotAvailability(caregiver.id, date, isAvailable, timeSlot);
    };
    const handleBulkAvailableWeek = () => {
        const dates = [
            '2026-10-16',
            '2026-10-17',
            '2026-10-18',
            '2026-10-19',
            '2026-10-20',
            '2026-10-21',
            '2026-10-22'
        ];
        bulkUpdateAvailability(caregiver.id, dates.map(date => ({
            date,
            isAvailable: true,
            timeSlot: bulkSlotType
        })));
    };
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Welcome Bar */}
      <div className="bg-white border border-[#b1f2ff] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src={caregiver.profileImageUrl || caregiverFallbackImage} alt={caregiver.fullName} referrerPolicy="no-referrer" className="w-16 h-16 rounded-2xl object-cover border border-[#b1f2ff] shadow-xs" onError={e => handleImageFallback(e, caregiverFallbackImage)}/>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#172B25]">
                {caregiver.fullName}
              </h1>
              {caregiver.isVerified && (<span className="text-xs font-semibold text-[#3dcfff] bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5"/> Verified Caregiver
                </span>)}
            </div>
            <p className="text-xs text-[#64746D] mt-1">
              Caregiver Portal · Manage availability, update hospital rates, and review patient inquiries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-[#64746D]">
            Profile Status:{' '}
            <span className={caregiver.isActive ? 'text-[#27865C] font-bold' : 'text-[#D9534F] font-bold'}>
              {caregiver.isActive ? '● Active on Marketplace' : '○ Paused (Unavailable)'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 p-1 bg-white border border-[#b1f2ff] rounded-xl overflow-x-auto text-xs font-semibold">
        {[
            { id: 'overview', label: t('dashboard') },
            { id: 'availability', label: t('availabilityCalendarTitle') },
            { id: 'profile', label: `${t('editProfile')} & Rates` },
            { id: 'inquiries', label: `${t('recentInquiries')} (${inquiries.length})` },
            { id: 'reviews', label: `${t('familyReviewsTitle')} (${reviews.length})` }
        ].map(tab => (<button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.id
                ? 'bg-[#3dcfff] text-white shadow-xs'
                : 'text-[#64746D] hover:text-[#172B25] hover:bg-slate-50'}`}>
            {tab.label}
          </button>))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (<div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#b1f2ff] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-[#64746D] text-xs">
                <span>Profile Views</span>
                <Eye className="w-4 h-4 text-[#3dcfff]"/>
              </div>
              <div className="text-2xl font-bold text-[#172B25] mt-2 font-mono tabular-nums">
                348
              </div>
              <div className="text-[11px] text-[#27865C] mt-1 font-medium">
                +24% this week
              </div>
            </div>

            <div className="bg-white border border-[#b1f2ff] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-[#64746D] text-xs">
                <span>WhatsApp &amp; Phone Inquiries</span>
                <MessageCircle className="w-4 h-4 text-[#27865C]"/>
              </div>
              <div className="text-2xl font-bold text-[#172B25] mt-2 font-mono tabular-nums">
                {inquiries.length + 18}
              </div>
              <div className="text-[11px] text-[#64746D] mt-1">
                Direct family connections
              </div>
            </div>

            <div className="bg-white border border-[#b1f2ff] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-[#64746D] text-xs">
                <span>Average Rating</span>
                <Star className="w-4 h-4 text-[#D9A441]"/>
              </div>
              <div className="text-2xl font-bold text-[#172B25] mt-2 font-mono tabular-nums">
                {caregiver.rating.toFixed(1)} / 5.0
              </div>
              <div className="text-[11px] text-[#64746D] mt-1">
                From {caregiver.reviewCount} family reviews
              </div>
            </div>

            <div className="bg-white border border-[#b1f2ff] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-[#64746D] text-xs">
                <span>Profile Completeness</span>
                <CheckCircle2 className="w-4 h-4 text-[#3dcfff]"/>
              </div>
              <div className="text-2xl font-bold text-[#172B25] mt-2 font-mono tabular-nums">
                95%
              </div>
              <div className="text-[11px] text-[#27865C] mt-1">
                NIC &amp; Police clearance verified
              </div>
            </div>
          </div>

          {/* Quick Schedule Preview & Recent Inquiries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-[#b1f2ff] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#172B25]">
                  October 2026 Schedule
                </h3>
                <button type="button" onClick={() => setActiveTab('availability')} className="text-xs text-[#3dcfff] font-semibold hover:underline">
                  Manage All Dates →
                </button>
              </div>
              <AvailabilityCalendar slots={slots} isEditable onSlotToggle={handleToggleSlot}/>
            </div>

            <div className="bg-white border border-[#b1f2ff] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#172B25]">
                  Recent Patient Inquiries
                </h3>
                <button type="button" onClick={() => setActiveTab('inquiries')} className="text-xs text-[#3dcfff] font-semibold hover:underline">
                  View All ({inquiries.length}) →
                </button>
              </div>

              {inquiries.length === 0 ? (<div className="text-center py-8 text-xs text-[#64746D]">
                  No inquiries recorded yet.
                </div>) : (<div className="divide-y divide-[#b1f2ff]">
                  {inquiries.slice(0, 3).map(inq => (<div key={inq.id} className="py-3 first:pt-0 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#172B25]">{inq.familyName}</span>
                        <span className="text-[#64746D] font-mono tabular-nums text-[11px]">
                          {inq.createdAt.split('T')[0]}
                        </span>
                      </div>
                      <div className="text-xs text-[#64746D]">
                        Hospital: <strong>{inq.hospitalName}</strong> · Shift: {inq.shiftNeeded}
                      </div>
                      <div className="text-xs text-[#3dcfff] font-mono">
                        Phone: {inq.phone} ({inq.contactMethodUsed})
                      </div>
                    </div>))}
                </div>)}
            </div>
          </div>
        </div>)}

      {/* Tab 2: Availability Calendar Manager */}
      {activeTab === 'availability' && (<div className="bg-white border border-[#b1f2ff] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#b1f2ff]">
            <div>
              <h2 className="text-lg font-bold text-[#172B25]">
                Manage Your Hospital Availability
              </h2>
              <p className="text-xs text-[#64746D] mt-0.5">
                Click any day below to toggle between Available and Booked. Families check this schedule in real time.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select value={bulkSlotType} onChange={e => setBulkSlotType(e.target.value)} className="px-3 py-1.5 text-xs border border-[#b1f2ff] rounded-xl bg-[#d8f9ff]">
                <option value="whole_day">Full Day Shift</option>
                <option value="night">Night Shift</option>
                <option value="morning">Morning Shift</option>
                <option value="afternoon">Afternoon Shift</option>
              </select>
              <button type="button" onClick={handleBulkAvailableWeek} className="px-3.5 py-1.5 text-xs font-semibold bg-[#3dcfff] text-white rounded-xl hover:bg-[#1eb5df] transition-colors cursor-pointer">
                + Mark Oct 16-22 Available
              </button>
            </div>
          </div>

          <AvailabilityCalendar slots={slots} isEditable={true} onSlotToggle={handleToggleSlot}/>
        </div>)}

      {/* Tab 3: Edit Profile & Rates */}
      {activeTab === 'profile' && (<div className="bg-white border border-[#b1f2ff] rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between pb-6 border-b border-[#b1f2ff] mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#172B25]">
                Edit Profile &amp; Hospital Rates
              </h2>
              <p className="text-xs text-[#64746D] mt-0.5">
                Set your LKR charges, contact numbers, and hospital ward preferences.
              </p>
            </div>

            {savedSuccess && (<div className="px-3 py-1.5 bg-cyan-50 text-[#3dcfff] border border-cyan-200 text-xs font-bold rounded-xl flex items-center gap-1.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4"/>
                <span>Profile Changes Saved!</span>
              </div>)}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  Full Name
                </label>
                <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-3.5 py-2.5 text-xs bg-[#d8f9ff] focus:bg-white border border-[#b1f2ff] focus:border-[#3dcfff] rounded-xl outline-none"/>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  Age (Years)
                </label>
                <input type="number" min={18} max={75} required value={age} onChange={e => setAge(Number(e.target.value))} className="w-full px-3.5 py-2.5 text-xs bg-[#d8f9ff] focus:bg-white border border-[#b1f2ff] focus:border-[#3dcfff] rounded-xl outline-none"/>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B25] mb-1">
                Bio &amp; Hospital Ward Experience
              </label>
              <textarea rows={3} required value={bio} onChange={e => setBio(e.target.value)} className="w-full px-3.5 py-2.5 text-xs bg-[#d8f9ff] focus:bg-white border border-[#b1f2ff] focus:border-[#3dcfff] rounded-xl outline-none resize-none"/>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#d8f9ff] border border-[#b1f2ff] rounded-2xl">
              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  Price Per Hour (LKR)
                </label>
                <input type="number" step={50} required value={pricePerHour} onChange={e => setPricePerHour(Number(e.target.value))} className="w-full px-3.5 py-2 text-xs bg-white border border-[#b1f2ff] focus:border-[#3dcfff] rounded-xl outline-none font-mono"/>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  Full Day Rate (LKR)
                </label>
                <input type="number" step={100} required value={pricePerDay} onChange={e => setPricePerDay(Number(e.target.value))} className="w-full px-3.5 py-2 text-xs bg-white border border-[#b1f2ff] focus:border-[#3dcfff] rounded-xl outline-none font-mono font-bold text-[#3dcfff]"/>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  Night Shift Rate (LKR)
                </label>
                <input type="number" step={100} required value={pricePerShift} onChange={e => setPricePerShift(Number(e.target.value))} className="w-full px-3.5 py-2 text-xs bg-white border border-[#b1f2ff] focus:border-[#3dcfff] rounded-xl outline-none font-mono"/>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  Primary Hospital Served
                </label>
                <select value={primaryHospitalId} onChange={e => setPrimaryHospitalId(e.target.value)} className="w-full px-3.5 py-2.5 text-xs bg-[#d8f9ff] focus:bg-white border border-[#b1f2ff] focus:border-[#3dcfff] rounded-xl outline-none">
                  {hospitals.map(h => (<option key={h.id} value={h.id}>
                      {h.name} ({h.district})
                    </option>))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  WhatsApp Contact (+94)
                </label>
                <input type="tel" required value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} className="w-full px-3.5 py-2.5 text-xs bg-[#d8f9ff] focus:bg-white border border-[#b1f2ff] focus:border-[#3dcfff] rounded-xl outline-none font-mono"/>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input type="checkbox" id="activeToggle" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="rounded text-[#3dcfff] focus:ring-[#3dcfff]"/>
              <label htmlFor="activeToggle" className="text-xs text-[#172B25] font-semibold cursor-pointer">
                Profile is Active on HireLanka Care (Uncheck if you are currently on leave or not taking patients)
              </label>
            </div>

            <div className="pt-4 border-t border-[#b1f2ff] flex justify-end">
              <button type="submit" className="px-6 py-2.5 bg-[#3dcfff] hover:bg-[#1eb5df] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer">
                <Save className="w-4 h-4"/>
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>)}

      {/* Tab 4: Inquiries */}
      {activeTab === 'inquiries' && (<div className="bg-white border border-[#b1f2ff] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#b1f2ff]">
            <h2 className="text-lg font-bold text-[#172B25]">
              Family Hiring Inquiries ({inquiries.length})
            </h2>
            <span className="text-xs text-[#64746D]">
              Direct contacts initiated through WhatsApp &amp; Phone
            </span>
          </div>

          {inquiries.length === 0 ? (<div className="text-center py-12 text-xs text-[#64746D]">
              No inquiries yet. Keep your availability updated to rank higher in hospital searches!
            </div>) : (<div className="divide-y divide-[#b1f2ff]">
              {inquiries.map(inq => (<div key={inq.id} className="py-4 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#172B25]">{inq.familyName}</span>
                    <span className="text-xs text-[#64746D] font-mono tabular-nums">
                      {new Date(inq.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#64746D]">
                    <div>
                      Hospital: <strong className="text-[#172B25]">{inq.hospitalName}</strong>
                    </div>
                    <div>
                      Shift Needed: <strong className="text-[#172B25]">{inq.shiftNeeded}</strong>
                    </div>
                    <div>
                      Method: <span className="uppercase text-[#3dcfff] font-semibold">{inq.contactMethodUsed}</span>
                    </div>
                  </div>

                  {inq.message && (<p className="text-xs text-[#172B25] bg-[#d8f9ff] p-3 rounded-xl border border-[#b1f2ff]">
                      &quot;{inq.message}&quot;
                    </p>)}

                  <div className="flex items-center gap-3 pt-1">
                    <a href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#27865C] hover:underline flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5"/>
                      <span>Reply on WhatsApp ({inq.phone})</span>
                    </a>
                  </div>
                </div>))}
            </div>)}
        </div>)}

      {/* Tab 5: Reviews */}
      {activeTab === 'reviews' && (<div className="bg-white border border-[#b1f2ff] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#b1f2ff]">
            <div>
              <h2 className="text-lg font-bold text-[#172B25]">
                Patient Family Reviews ({reviews.length})
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={caregiver.rating} showNumber size="md"/>
                <span className="text-xs text-[#64746D]">Average score from verified stays</span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-[#b1f2ff]">
            {reviews.map(rev => (<div key={rev.id} className="py-4 first:pt-0 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StarRating rating={rev.rating} size="sm"/>
                    <span className="text-xs font-bold text-[#172B25]">{rev.title}</span>
                  </div>
                  <span className="text-[11px] text-[#64746D] tabular-nums font-mono">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-[#172B25] leading-relaxed">
                  {rev.comment}
                </p>
                <div className="text-[11px] text-[#64746D]">
                  By {rev.reviewerName} {rev.hospitalName && `· ${rev.hospitalName}`}
                </div>
              </div>))}
          </div>
        </div>)}
    </div>);
};
