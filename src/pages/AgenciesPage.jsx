import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { StarRating } from '../components/common/StarRating';
import { InquiryModal } from '../components/common/InquiryModal';
import { Users, MapPin, ShieldCheck, MessageCircle, ArrowRight } from 'lucide-react';
import { agencyFallbackImage, handleImageFallback } from '../lib/imageFallbacks';
export const AgenciesPage = () => {
    const { agencies, getHospitalById } = useData();
    const { t } = useLanguage();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAgency, setSelectedAgency] = useState(null);
    const handleQuickContact = (agency) => {
        setSelectedAgency(agency);
        setModalOpen(true);
    };
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white border border-[#b1f2ff] rounded-2xl p-6 sm:p-8 shadow-xs">
        <span className="text-xs font-semibold text-[#3dcfff] uppercase tracking-wider">
          {t('forAgencies')}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B25] tracking-tight mt-1">
          {t('agenciesPageTitle')}
        </h1>
        <p className="text-sm text-[#64746D] mt-2 max-w-2xl">
          {t('agenciesPageSubtitle')}
        </p>
      </div>

      {/* Agency Directory List */}
      <div className="space-y-6">
        {agencies.map(agency => {
            const primaryHospital = getHospitalById(agency.primaryHospitalId);
            return (<div key={agency.id} className="bg-white border border-[#b1f2ff] rounded-2xl p-6 sm:p-8 hover:border-[#3dcfff]/50 hover:shadow-sm transition-all">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                <div className="flex items-start gap-3 sm:gap-5 min-w-0">
                  <div className="w-18 h-18 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-[#b1f2ff] shrink-0 bg-slate-100">
                    <img src={agency.logoUrl || agencyFallbackImage} alt={agency.agencyName} referrerPolicy="no-referrer" className="w-full h-full object-cover" onError={e => handleImageFallback(e, agencyFallbackImage)}/>
                  </div>

                  <div className="min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link to={`/agencies/${agency.id}`} className="break-words text-xl font-bold text-[#172B25] hover:text-[#3dcfff] transition-colors">
                        {agency.agencyName}
                      </Link>
                      {agency.isVerified && (<span className="text-xs font-semibold text-[#3dcfff] bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5"/> {t('verifiedBadge')}
                        </span>)}
                    </div>

                    <p className="text-xs text-[#64746D] leading-relaxed max-w-2xl">
                      {agency.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-[#64746D] flex-wrap pt-1">
                      <span className="flex items-center gap-1.5 font-medium text-[#172B25]">
                        <Users className="w-3.5 h-3.5 text-[#3dcfff]"/>
                        {agency.numCaregivers} {t('activeAttendants')}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#3dcfff]"/>
                        {t('primaryHospital')} {primaryHospital ? primaryHospital.name : 'Colombo'}
                      </span>
                      <span>·</span>
                      <span className="text-[11px] font-mono text-[#64746D]">
                        Reg: {agency.registrationNumber}
                      </span>
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <StarRating rating={agency.rating} showNumber reviewCount={agency.reviewCount} size="sm"/>
                    </div>
                  </div>
                </div>

                {/* Right Rates & Action Box */}
                <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#b1f2ff]">
                  <div className="text-left lg:text-right">
                    <div className="text-xs text-[#64746D] font-medium">{t('directHiringRates')}</div>
                    <div className="text-xl font-extrabold text-[#3dcfff] tabular-nums">
                      Rs. {agency.priceRangeMin.toLocaleString()} - {agency.priceRangeMax.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-[#64746D]">{t('whole_day')}</div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full sm:w-auto">
                    <button type="button" onClick={() => handleQuickContact(agency)} className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold bg-[#27865C] hover:bg-[#1f6d4a] text-white rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap">
                      <MessageCircle className="w-3.5 h-3.5"/>
                      <span>{t('contactAgency')}</span>
                    </button>
                    <Link to={`/agencies/${agency.id}`} className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold bg-[#d8f9ff] hover:bg-slate-100 text-[#172B25] border border-[#b1f2ff] rounded-xl flex items-center justify-center gap-1 transition-colors whitespace-nowrap">
                      <span>{t('viewAgencyProfile')}</span>
                      <ArrowRight className="w-3.5 h-3.5"/>
                    </Link>
                  </div>
                </div>
              </div>
            </div>);
        })}
      </div>

      {selectedAgency && (<InquiryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} target={selectedAgency} targetType="agency"/>)}
    </div>);
};
