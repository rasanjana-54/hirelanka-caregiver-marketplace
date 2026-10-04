import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { StarRating } from '../components/common/StarRating';
import { ReviewModal } from '../components/common/ReviewModal';
import { InquiryModal } from '../components/common/InquiryModal';
import {
  Building2,
  Users,
  MapPin,
  ShieldCheck,
  MessageCircle,
  Phone,
  Mail,
  CheckCircle2,
  ChevronRight,
  Info,
  Clock
} from 'lucide-react';

export const AgencyProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getAgencyById, getHospitalById, getReviewsForProfile } = useData();

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

  const agency = getAgencyById(id || '');

  if (!agency) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#172B25]">Agency Not Found</h2>
        <p className="text-sm text-[#64746D]">
          The care agency profile you requested does not exist.
        </p>
        <Link
          to="/agencies"
          className="inline-flex px-5 py-2.5 text-xs font-semibold bg-[#176B55] text-white rounded-xl"
        >
          Browse Agencies Directory
        </Link>
      </div>
    );
  }

  const primaryHospital = getHospitalById(agency.primaryHospitalId);
  const secondaryHospitals = agency.secondaryHospitalIds
    ? agency.secondaryHospitalIds.map(hId => getHospitalById(hId)).filter(Boolean)
    : [];
  const reviews = getReviewsForProfile(agency.id);

  const cleanPhone = agency.contactWhatsapp.replace(/[^0-9]/g, '');
  const whatsAppMessage = encodeURIComponent(
    `Hello ${agency.agencyName}, I found your agency on HireLanka Care. We need caregiver support for a patient at ${
      primaryHospital ? primaryHospital.name : 'the hospital'
    }. Could you let me know attendant availability and daily rates?`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#64746D]">
        <Link to="/" className="hover:text-[#176B55]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/agencies" className="hover:text-[#176B55]">Agencies</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#172B25] font-semibold">{agency.agencyName}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white border border-[#E5ECE8] rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-[#E5ECE8] shrink-0 bg-slate-100">
                <img
                  src={agency.logoUrl}
                  alt={agency.agencyName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B25] tracking-tight">
                    {agency.agencyName}
                  </h1>
                  {agency.isVerified && (
                    <span className="text-xs font-semibold text-[#176B55] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Registered
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2 text-xs text-[#64746D] flex-wrap">
                  <span>Reg: <strong className="font-mono text-[#172B25]">{agency.registrationNumber}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>{agency.numCaregivers} Attendants on Staff</span>
                  <span aria-hidden="true">·</span>
                  <span>Primary: {primaryHospital ? primaryHospital.name : 'Colombo'}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-[#E5ECE8] flex items-center gap-4">
                  <StarRating rating={agency.rating} showNumber reviewCount={agency.reviewCount} size="md" />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E5ECE8] space-y-3">
              <h3 className="text-sm font-bold text-[#172B25] uppercase tracking-wider">
                Agency Overview
              </h3>
              <p className="text-sm text-[#172B25] leading-relaxed">
                {agency.description}
              </p>
            </div>
          </div>

          {/* Services Provided */}
          <div className="bg-white border border-[#E5ECE8] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#172B25] uppercase tracking-wider">
              Caregiver Services Provided
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {agency.services.map((srv, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-3 bg-[#F8FAF8] rounded-xl border border-[#E5ECE8] text-xs font-medium text-[#172B25]">
                  <CheckCircle2 className="w-4 h-4 text-[#176B55] shrink-0" />
                  <span>{srv}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hospitals Covered */}
          <div className="bg-white border border-[#E5ECE8] rounded-2xl p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#172B25] uppercase tracking-wider">
              Hospital Coverage in Sri Lanka
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {primaryHospital && (
                <span className="px-3 py-1.5 bg-emerald-50 text-[#176B55] border border-emerald-200 rounded-lg text-xs font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{primaryHospital.name} (Primary)</span>
                </span>
              )}
              {secondaryHospitals.map(sh => (
                <span key={sh?.id} className="px-3 py-1.5 bg-[#F8FAF8] text-[#172B25] border border-[#E5ECE8] rounded-lg text-xs font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#64746D]" />
                  <span>{sh?.name}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Staff Roster: ONLY shown if agency.showStaffProfiles === true */}
          {agency.showStaffProfiles && agency.staff && agency.staff.length > 0 && (
            <div className="bg-white border border-[#E5ECE8] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#172B25]">
                    Available Agency Caregivers &amp; Attendants
                  </h3>
                  <p className="text-xs text-[#64746D]">
                    Direct staff roster managed by {agency.agencyName}
                  </p>
                </div>
                <span className="text-xs text-[#176B55] font-semibold">
                  {agency.staff.length} Listed Staff
                </span>
              </div>

              <div className="divide-y divide-[#E5ECE8]">
                {agency.staff.map(member => (
                  <div key={member.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-bold text-[#172B25]">
                        {member.staffName}
                      </div>
                      <div className="text-xs text-[#64746D] mt-0.5">
                        {member.staffAge} yrs · {member.gender} · {member.experienceYears} yrs experience
                      </div>
                      <p className="text-xs text-[#172B25] mt-1.5 font-medium">
                        Specialization: {member.specialization}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setInquiryModalOpen(true)}
                      className="px-3 py-1.5 bg-[#F8FAF8] hover:bg-emerald-50 text-xs font-semibold text-[#176B55] border border-[#E5ECE8] rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      Request Attendant
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="bg-white border border-[#E5ECE8] rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5ECE8] flex-wrap gap-3">
              <div>
                <h3 className="text-base font-bold text-[#172B25]">
                  Family Reviews ({reviews.length})
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={agency.rating} showNumber size="md" />
                  <span className="text-xs text-[#64746D]">based on {reviews.length} completed hospital stays</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setReviewModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold bg-[#F8FAF8] hover:bg-slate-100 text-[#172B25] border border-[#E5ECE8] rounded-xl transition-colors cursor-pointer"
              >
                + Write a Review
              </button>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#64746D]">
                No reviews yet. Be the first to share your experience with this agency!
              </div>
            ) : (
              <div className="divide-y divide-[#E5ECE8] space-y-4">
                {reviews.map(rev => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StarRating rating={rev.rating} size="sm" />
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
                      {rev.hospitalName && <span>· {rev.hospitalName}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sticky Card */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-[#E5ECE8] rounded-2xl p-6 shadow-md space-y-6 sticky top-24">
            <div>
              <span className="text-xs font-bold text-[#64746D] uppercase tracking-wider">
                Agency Rate Range
              </span>
              <div className="mt-2 text-3xl font-extrabold text-[#176B55] tabular-nums">
                Rs. {agency.priceRangeMin.toLocaleString()} - {agency.priceRangeMax.toLocaleString()}
                <span className="text-xs font-normal text-[#64746D] ml-1">/ shift</span>
              </div>
              <p className="text-xs text-[#64746D] mt-1">
                Rates vary based on patient condition (e.g. ICU step-down, mobility requirement, night monitoring).
              </p>
            </div>

            <div className="space-y-3">
              <a
                href={`https://wa.me/${cleanPhone}?text=${whatsAppMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-[#27865C] hover:bg-[#1f6d4a] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact via WhatsApp</span>
              </a>

              <a
                href={`tel:${agency.contactPhone.replace(/\s+/g, '')}`}
                className="w-full py-3 px-4 bg-[#F8FAF8] hover:bg-slate-100 text-[#172B25] font-semibold text-xs border border-[#E5ECE8] rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#176B55]" />
                <span>Call Agency: {agency.contactPhone}</span>
              </a>

              <a
                href={`mailto:${agency.contactEmail}`}
                className="w-full py-2.5 px-4 text-xs font-semibold text-[#176B55] hover:bg-emerald-50 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Mail className="w-4 h-4" />
                <span>Email: {agency.contactEmail}</span>
              </a>
            </div>

            <div className="bg-[#F8FAF8] p-4 rounded-xl border border-[#E5ECE8] space-y-2">
              <div className="text-xs font-bold text-[#172B25]">
                Agency Guarantees
              </div>
              <ul className="text-xs text-[#64746D] space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#27865C]" />
                  <span>Immediate attendant replacement on leave</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#27865C]" />
                  <span>Police cleared &amp; uniform attendants</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#27865C]" />
                  <span>24/7 care coordination desk</span>
                </li>
              </ul>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Payment terms and invoices are handled directly between your family and the agency.
              </span>
            </div>
          </div>
        </div>
      </div>

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        revieweeId={agency.id}
        revieweeName={agency.agencyName}
        revieweeType="agency"
      />

      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        target={agency}
        targetType="agency"
      />
    </div>
  );
};
