import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { StarRating } from '../components/common/StarRating';
import { AvailabilityCalendar } from '../components/common/AvailabilityCalendar';
import { ReviewModal } from '../components/common/ReviewModal';
import { InquiryModal } from '../components/common/InquiryModal';
import { ShieldCheck, MapPin, Phone, MessageCircle, Award, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { caregiverFallbackImage, handleImageFallback } from '../lib/imageFallbacks';
export const CaregiverProfilePage = () => {
    const { id } = useParams();
    const { getCaregiverById, getHospitalById, getCaregiverAvailability, getReviewsForProfile } = useData();
    const { t } = useLanguage();
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
    const caregiver = getCaregiverById(id || '');
    if (!caregiver) {
        return (<div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#172B25]">Caregiver Profile Not Found</h2>
        <p className="text-sm text-[#64746D]">
          The caregiver profile you requested does not exist or may have been deactivated.
        </p>
        <Link to="/caregivers" className="inline-flex px-5 py-2.5 text-xs font-semibold bg-[#3dcfff] text-white rounded-xl hover:bg-[#1eb5df]">
          Browse All Available Caregivers
        </Link>
      </div>);
    }
    const primaryHospital = getHospitalById(caregiver.primaryHospitalId);
    const secondaryHospitals = caregiver.secondaryHospitalIds
        ? caregiver.secondaryHospitalIds.map(hId => getHospitalById(hId)).filter(Boolean)
        : [];
    const slots = getCaregiverAvailability(caregiver.id);
    const reviews = getReviewsForProfile(caregiver.id);
    const cleanPhone = caregiver.whatsappNumber.replace(/[^0-9]/g, '');
    const whatsAppMessage = encodeURIComponent(`Hello ${caregiver.fullName}, I saw your profile on HireLanka Care for care at ${primaryHospital ? primaryHospital.name : 'the hospital'}. Could you let me know if you are available?`);
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#64746D]">
        <Link to="/" className="hover:text-[#3dcfff]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5"/>
        <Link to="/caregivers" className="hover:text-[#3dcfff]">Caregivers</Link>
        <ChevronRight className="w-3.5 h-3.5"/>
        <span className="text-[#172B25] font-semibold">{caregiver.fullName}</span>
      </nav>

      {/* Main Grid: Left Profile & Bio, Right Sticky Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Profile Header Card */}
          <div className="bg-white border border-[#b1f2ff] rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="relative shrink-0">
        <img src={caregiver.profileImageUrl || caregiverFallbackImage} alt={caregiver.fullName} referrerPolicy="no-referrer" className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border border-[#b1f2ff] bg-slate-100 shadow-xs" onError={e => handleImageFallback(e, caregiverFallbackImage)}/>
                {caregiver.isVerified && (<div className="absolute -bottom-2 -right-2 bg-[#3dcfff] text-white p-1.5 rounded-full shadow-md" title="Verified Caregiver">
                    <ShieldCheck className="w-5 h-5"/>
                  </div>)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B25] tracking-tight">
                    {caregiver.fullName}
                  </h1>
                  {caregiver.isVerified && (<span className="text-xs font-semibold text-[#3dcfff] bg-cyan-50 border border-cyan-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5"/> {t('policeIdVerified')}
                    </span>)}
                </div>

                {/* Clean unboxed metadata */}
                <div className="flex items-center gap-2 mt-2 text-xs text-[#64746D] flex-wrap">
                  <span>{caregiver.age} {t('yearsOld')}</span>
                  <span aria-hidden="true">·</span>
                  <span>{caregiver.experienceYears} {t('yearsExperience')}</span>
                  <span aria-hidden="true">·</span>
                  <span>{caregiver.gender}</span>
                </div>

                {/* Primary Hospital */}
                <div className="flex items-start gap-1.5 mt-3 text-xs font-medium text-[#172B25]">
                  <MapPin className="w-4 h-4 text-[#3dcfff] shrink-0 mt-0.5"/>
                  <div>
                    <span className="font-bold">{t('primaryHospital')} </span>
                    <span>{primaryHospital ? primaryHospital.name : 'Colombo Hospital'}</span>
                    {primaryHospital && (<span className="text-[#64746D] ml-1">({primaryHospital.district} - {primaryHospital.hospitalType === 'government' ? 'Government' : primaryHospital.hospitalType === 'private' ? 'Private' : 'Type not listed'})</span>)}
                  </div>
                </div>

                {/* Rating breakdown summary */}
                <div className="mt-4 pt-4 border-t border-[#b1f2ff] flex items-center gap-4 flex-wrap">
                  <StarRating rating={caregiver.rating} showNumber reviewCount={caregiver.reviewCount} size="md"/>
                  <div className="text-xs text-[#64746D]">
                    {t('languagesLabel')} <strong className="text-[#172B25]">{caregiver.languages.join(', ')}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* About / Bio */}
            <div className="mt-8 pt-6 border-t border-[#b1f2ff] space-y-3">
              <h3 className="text-sm font-bold text-[#172B25] uppercase tracking-wider">
                {t('aboutCaregiver')} - {caregiver.fullName}
              </h3>
              <p className="text-sm text-[#172B25] leading-relaxed">
                {caregiver.bio}
              </p>
            </div>
          </div>

          {/* Specializations & Qualifications */}
          <div className="bg-white border border-[#b1f2ff] rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-[#172B25] uppercase tracking-wider mb-3">
                {t('specializationsTitle')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {caregiver.specializations.map((spec, i) => (<div key={i} className="flex items-center gap-2 p-2.5 bg-[#d8f9ff] rounded-xl border border-[#b1f2ff] text-xs font-medium text-[#172B25]">
                    <CheckCircle2 className="w-4 h-4 text-[#63e5ff] shrink-0"/>
                    <span>{spec}</span>
                  </div>))}
              </div>
            </div>

            {caregiver.qualifications.length > 0 && (<div className="pt-4 border-t border-[#b1f2ff]">
                <h3 className="text-sm font-bold text-[#172B25] uppercase tracking-wider mb-3">
                  {t('certificationsTitle')}
                </h3>
                <div className="space-y-2">
                  {caregiver.qualifications.map((q, i) => (<div key={i} className="flex items-start gap-2 text-xs text-[#172B25]">
                      <Award className="w-4 h-4 text-[#D9A441] shrink-0 mt-0.5"/>
                      <span>{q}</span>
                    </div>))}
                </div>
              </div>)}

            {secondaryHospitals.length > 0 && (<div className="pt-4 border-t border-[#b1f2ff]">
                <h3 className="text-sm font-bold text-[#172B25] uppercase tracking-wider mb-2">
                  {t('secondaryHospitals')}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {secondaryHospitals.map(sh => (<Link key={sh?.id} to={`/caregivers?hospital=${sh?.id}`} className="px-3 py-1.5 bg-[#d8f9ff] hover:bg-cyan-50 text-xs font-medium text-[#172B25] border border-[#b1f2ff] rounded-lg transition-colors flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#3dcfff]"/>
                      <span>{sh?.name}</span>
                    </Link>))}
                </div>
              </div>)}
          </div>

          {/* Availability Calendar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#172B25]">
                {t('availabilityCalendarTitle')}
              </h3>
              <span className="text-xs text-[#64746D]">
                Asia/Colombo Timezone
              </span>
            </div>
            <AvailabilityCalendar slots={slots}/>
          </div>

          {/* Reviews Section */}
          <div className="bg-white border border-[#b1f2ff] rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#b1f2ff] flex-wrap gap-3">
              <div>
                <h3 className="text-base font-bold text-[#172B25]">
                  {t('familyReviewsTitle')} ({reviews.length})
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={caregiver.rating} showNumber size="md"/>
                  <span className="text-xs text-[#64746D]">based on {reviews.length} completed hospital stays</span>
                </div>
              </div>

              <button type="button" onClick={() => setReviewModalOpen(true)} className="px-4 py-2 text-xs font-semibold bg-[#d8f9ff] hover:bg-slate-100 text-[#172B25] border border-[#b1f2ff] rounded-xl transition-colors cursor-pointer">
                {t('writeReviewBtn')}
              </button>
            </div>

            {reviews.length === 0 ? (<div className="text-center py-8 text-xs text-[#64746D]">
                No reviews left yet for this caregiver. Be the first to share your experience!
              </div>) : (<div className="divide-y divide-[#b1f2ff] space-y-5">
                {reviews.map(rev => (<div key={rev.id} className="pt-5 first:pt-0 space-y-2">
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

                    <div className="flex items-center gap-2 text-[11px] text-[#64746D]">
                      <span className="font-semibold text-[#172B25]">{rev.reviewerName}</span>
                      {rev.hospitalName && (<>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#3dcfff]"/>
                            {rev.hospitalName}
                          </span>
                        </>)}
                      <span>·</span>
                      <span className="text-[#27865C] font-medium">Verified Family</span>
                    </div>
                  </div>))}
              </div>)}
          </div>
        </div>

        {/* Right Column: Sticky Contact & Hiring Card (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-[#b1f2ff] rounded-2xl p-6 shadow-md space-y-6 sticky top-24">
            {/* Pricing Rates Table */}
            <div>
              <span className="text-xs font-bold text-[#64746D] uppercase tracking-wider">
                {t('directHiringRates')}
              </span>
              <div className="mt-2 text-3xl font-extrabold text-[#3dcfff] tabular-nums">
                Rs. {caregiver.pricePerDay.toLocaleString()}
                <span className="text-xs font-normal text-[#64746D] ml-1">{t('perDay')}</span>
              </div>

              <div className="mt-4 space-y-2 text-xs border-t border-b border-[#b1f2ff] py-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#64746D]">{t('perHourRate')}</span>
                  <span className="font-bold text-[#172B25] font-mono tabular-nums">
                    Rs. {caregiver.pricePerHour}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64746D]">{t('whole_day')}</span>
                  <span className="font-bold text-[#172B25] font-mono tabular-nums">
                    Rs. {caregiver.pricePerDay.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64746D]">{t('nightShiftCare')}</span>
                  <span className="font-bold text-[#172B25] font-mono tabular-nums">
                    Rs. {caregiver.pricePerShift.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Contact Actions */}
            <div className="space-y-3">
              <a href={`https://wa.me/${cleanPhone}?text=${whatsAppMessage}`} target="_blank" rel="noopener noreferrer" className="w-full py-3 px-4 bg-[#27865C] hover:bg-[#1f6d4a] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer">
                <MessageCircle className="w-4 h-4"/>
                <span>{t('chatOnWhatsApp')}</span>
              </a>

              <a href={`tel:${caregiver.phoneNumber.replace(/\s+/g, '')}`} className="w-full py-3 px-4 bg-[#d8f9ff] hover:bg-slate-100 text-[#172B25] font-semibold text-xs border border-[#b1f2ff] rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer">
                <Phone className="w-4 h-4 text-[#3dcfff]"/>
                <span>{t('callNow')}: {caregiver.phoneNumber}</span>
              </a>

              <button type="button" onClick={() => setInquiryModalOpen(true)} className="w-full py-2.5 px-4 text-xs font-semibold text-[#3dcfff] hover:bg-cyan-50 rounded-xl transition-colors cursor-pointer">
                {t('contactCaregiverDirectly')}
              </button>
            </div>

            {/* Verification Status Breakdown */}
            <div className="bg-[#d8f9ff] p-4 rounded-xl border border-[#b1f2ff] space-y-2.5">
              <div className="text-xs font-bold text-[#172B25]">
                {t('verifiedBadge')}
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-[#172B25]">
                  <CheckCircle2 className="w-4 h-4 text-[#27865C] shrink-0"/>
                  <span>National Identity Card (NIC) Verified</span>
                </div>
                <div className="flex items-center gap-2 text-[#172B25]">
                  <CheckCircle2 className="w-4 h-4 text-[#27865C] shrink-0"/>
                  <span>Police Clearance Report on Record</span>
                </div>
                <div className="flex items-center gap-2 text-[#172B25]">
                  <CheckCircle2 className="w-4 h-4 text-[#27865C] shrink-0"/>
                  <span>Hospital Patient Care Training Verified</span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5"/>
              <span>
                {t('disclaimer')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ReviewModal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} revieweeId={caregiver.id} revieweeName={caregiver.fullName} revieweeType="individual"/>

      <InquiryModal isOpen={inquiryModalOpen} onClose={() => setInquiryModalOpen(false)} target={caregiver} targetType="caregiver"/>
    </div>);
};
