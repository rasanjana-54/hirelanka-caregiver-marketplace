import React from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { StarRating } from './StarRating';
import { ShieldCheck, MessageCircle, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { caregiverFallbackImage, handleImageFallback } from '../../lib/imageFallbacks';
export const CaregiverCard = ({ caregiver, onQuickContact, viewMode = 'grid' }) => {
    const { getHospitalById, recordInquiry } = useData();
    const { t } = useLanguage();
    const primaryHospital = getHospitalById(caregiver.primaryHospitalId);
    const getShiftLabel = (type) => {
        switch (type) {
            case 'whole_day':
                return t('whole_day');
            case 'half_day_morning':
                return t('half_day_morning');
            case 'half_day_afternoon':
                return t('half_day_afternoon');
            case 'nights':
                return t('nights');
            default:
                return t('whole_day');
        }
    };
    const handleWhatsAppClick = (e) => {
        e.stopPropagation();
        recordInquiry({
            caregiverId: caregiver.id,
            familyName: 'Family Inquiry',
            phone: 'Direct WhatsApp',
            hospitalName: primaryHospital ? primaryHospital.name : 'Sri Lanka Hospital',
            shiftNeeded: getShiftLabel(caregiver.availabilityType),
            startDate: new Date().toISOString().split('T')[0],
            contactMethodUsed: 'whatsapp'
        });
        if (onQuickContact) {
            onQuickContact(caregiver, 'whatsapp');
        }
        else {
            const cleanPhone = caregiver.whatsappNumber.replace(/[^0-9]/g, '');
            const message = encodeURIComponent(`Hello ${caregiver.fullName}, I saw your caregiver profile on HireLanka Care for ${primaryHospital ? primaryHospital.name : 'hospital care'}. Are you available for patient care?`);
            window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank', 'noopener,noreferrer');
        }
    };
    if (viewMode === 'list') {
        return (<div className="bg-white border border-[#b1f2ff] rounded-2xl p-5 hover:border-[#3dcfff]/40 hover:shadow-sm transition-all duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <img src={caregiver.profileImageUrl || caregiverFallbackImage} alt={caregiver.fullName} referrerPolicy="no-referrer" className="w-18 h-18 rounded-xl object-cover border border-[#b1f2ff] bg-slate-100" onError={e => handleImageFallback(e, caregiverFallbackImage)}/>
              {caregiver.isVerified && (<div className="absolute -bottom-1 -right-1 bg-[#3dcfff] text-white p-1 rounded-full shadow-sm" title="Police & Credential Verified Caregiver">
                  <ShieldCheck className="w-3.5 h-3.5"/>
                </div>)}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Link to={`/caregivers/${caregiver.id}`} className="text-lg font-bold text-[#172B25] hover:text-[#3dcfff] transition-colors">
                  {caregiver.fullName}
                </Link>
                {caregiver.isVerified && (<span className="text-xs font-semibold text-[#3dcfff] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5"/> {t('verifiedBadge')}
                  </span>)}
              </div>

              {/* Unboxed metadata */}
              <div className="flex items-center gap-2 mt-1 text-xs text-[#64746D]">
                <span>{caregiver.age} {t('yearsOld')}</span>
                <span aria-hidden="true">·</span>
                <span>{caregiver.experienceYears} {t('yearsExperience')}</span>
                <span aria-hidden="true">·</span>
                <span>{caregiver.gender}</span>
              </div>

              <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-[#172B25]">
                <MapPin className="w-3.5 h-3.5 text-[#3dcfff] shrink-0"/>
                <span className="truncate">{primaryHospital ? primaryHospital.name : 'Colombo Hospital'}</span>
                {primaryHospital && (<span className="text-[#64746D]">({primaryHospital.district})</span>)}
              </div>

              <div className="mt-2.5 flex items-center gap-3">
                <StarRating rating={caregiver.rating} showNumber reviewCount={caregiver.reviewCount} size="sm"/>
                <span className="text-xs text-[#64746D] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#63e5ff]"/>
                  {getShiftLabel(caregiver.availabilityType)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col md:items-end justify-between items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#b1f2ff]">
            <div className="text-left md:text-right">
              <div className="text-xl font-bold text-[#3dcfff] tabular-nums">
                Rs. {caregiver.pricePerDay.toLocaleString()}
              </div>
              <div className="text-xs text-[#64746D]">
                per day · Rs. {caregiver.pricePerHour}/hr
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" onClick={handleWhatsAppClick} className="px-3.5 py-2 text-xs font-semibold bg-[#27865C] hover:bg-[#1f6d4a] text-white rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer whitespace-nowrap">
                <MessageCircle className="w-3.5 h-3.5"/>
                <span>WhatsApp</span>
              </button>
              <Link to={`/caregivers/${caregiver.id}`} className="px-3.5 py-2 text-xs font-semibold bg-[#d8f9ff] hover:bg-[#b1f2ff] text-[#172B25] border border-[#b1f2ff] rounded-xl transition-colors whitespace-nowrap">
                {t('viewProfile')}
              </Link>
            </div>
          </div>
        </div>
      </div>);
    }
    // Default Grid Card
    return (<div className="bg-white border border-[#b1f2ff] rounded-2xl overflow-hidden hover:border-[#3dcfff]/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Card Header & Photo */}
        <div className="p-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="relative">
              <img src={caregiver.profileImageUrl || caregiverFallbackImage} alt={caregiver.fullName} referrerPolicy="no-referrer" className="w-16 h-16 rounded-xl object-cover border border-[#b1f2ff] bg-slate-100 group-hover:scale-[1.02] transition-transform" onError={e => handleImageFallback(e, caregiverFallbackImage)}/>
              {caregiver.isVerified && (<div className="absolute -bottom-1 -right-1 bg-[#3dcfff] text-white p-1 rounded-full shadow-sm" title="Verified Caregiver">
                  <ShieldCheck className="w-3.5 h-3.5"/>
                </div>)}
            </div>

            <div className="text-right">
              <div className="text-lg font-bold text-[#3dcfff] tabular-nums">
                Rs. {caregiver.pricePerDay.toLocaleString()}
              </div>
              <div className="text-xs text-[#64746D] tabular-nums">
                per day · Rs. {caregiver.pricePerHour}/hr
              </div>
            </div>
          </div>

          {/* Title & Name */}
          <div className="mt-3">
            <Link to={`/caregivers/${caregiver.id}`} className="text-base font-bold text-[#172B25] hover:text-[#3dcfff] transition-colors block truncate">
              {caregiver.fullName}
            </Link>

            {/* Unboxed clean metadata */}
            <div className="flex items-center gap-2 mt-1 text-xs text-[#64746D]">
              <span>{caregiver.age} {t('yearsOld')}</span>
              <span aria-hidden="true">·</span>
              <span>{caregiver.experienceYears} {t('yearsExperience')}</span>
              <span aria-hidden="true">·</span>
              <span>{caregiver.gender}</span>
            </div>
          </div>

          {/* Hospital indicator */}
          <div className="flex items-start gap-1.5 mt-3 text-xs text-[#172B25] font-medium min-h-[32px]">
            <MapPin className="w-3.5 h-3.5 text-[#3dcfff] mt-0.5 shrink-0"/>
            <span className="line-clamp-2">
              {primaryHospital ? primaryHospital.name : 'Hospital in Sri Lanka'}
            </span>
          </div>

          {/* Rating */}
          <div className="mt-2.5 flex items-center justify-between">
            <StarRating rating={caregiver.rating} showNumber reviewCount={caregiver.reviewCount} size="sm"/>
            <span className="text-xs text-[#63e5ff] font-medium">
              {getShiftLabel(caregiver.availabilityType)}
            </span>
          </div>

          {/* Specializations snippet */}
          {caregiver.specializations.length > 0 && (<div className="mt-3 pt-3 border-t border-[#b1f2ff] text-xs text-[#64746D] line-clamp-1">
              <span className="font-medium text-[#172B25]">Focus: </span>
              {caregiver.specializations.slice(0, 2).join(', ')}
            </div>)}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#b1f2ff]">
          <button type="button" onClick={handleWhatsAppClick} className="w-full py-2.5 px-3 text-xs font-semibold bg-[#27865C] hover:bg-[#1f6d4a] text-white rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer whitespace-nowrap">
            <MessageCircle className="w-3.5 h-3.5"/>
            <span>WhatsApp</span>
          </button>
          <Link to={`/caregivers/${caregiver.id}`} className="w-full py-2.5 px-3 text-xs font-semibold bg-[#d8f9ff] hover:bg-[#b1f2ff] text-[#172B25] border border-[#b1f2ff] rounded-xl flex items-center justify-center transition-colors whitespace-nowrap">
            {t('viewProfile')}
          </Link>
        </div>
      </div>
    </div>);
};
