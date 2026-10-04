import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { HospitalAutocomplete } from '../components/common/HospitalAutocomplete';
import { StarRating } from '../components/common/StarRating';
import { InquiryModal } from '../components/common/InquiryModal';
import { SRI_LANKA_DISTRICTS } from '../data/sriLankanData';
import { CaregiverProfile, AgencyProfile } from '../types';
import {
  MapPin,
  Clock,
  ShieldCheck,
  SlidersHorizontal,
  X,
  MessageCircle,
  Phone,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Navigation,
  Sparkles,
  Share2,
  ChevronDown
} from 'lucide-react';

export const FindCaregiversPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { caregivers, hospitals, getHospitalById } = useData();
  const { t } = useLanguage();

  // Search URL params or defaults
  const initialHospital = searchParams.get('hospital') || '';
  const initialAvailability = searchParams.get('availability') || 'all';
  const initialMaxPrice = Number(searchParams.get('max_price')) || 8000;

  // Filter states
  const [selectedHospital, setSelectedHospital] = useState(initialHospital);
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [availabilityFilter, setAvailabilityFilter] = useState(initialAvailability);
  const [searchRadius, setSearchRadius] = useState(25);
  const [visitTypeInPerson, setVisitTypeInPerson] = useState(true);
  const [visitTypeNight, setVisitTypeNight] = useState(false);
  const [availableTodayOnly, setAvailableTodayOnly] = useState(false);
  const [genderFilter, setGenderFilter] = useState<'all' | 'Female' | 'Male'>('all');
  const [ageFilter, setAgeFilter] = useState<'all' | 'under35' | '35to50' | 'above50'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice);
  const [sortBy, setSortBy] = useState('recommended');

  // Currently selected caregiver for Right Inspector Column (Zocdoc style)
  const [selectedCaregiverId, setSelectedCaregiverId] = useState<string>(
    caregivers[0]?.id || ''
  );

  // Inspector interactive booking choices
  const [inspectorShift, setInspectorShift] = useState<'whole_day' | 'nights' | 'half_day'>('whole_day');
  const [inspectorDate, setInspectorDate] = useState('2026-10-06');
  const [inspectorTime, setInspectorTime] = useState('7:00 AM');

  // Modal contact state
  const [modalOpen, setModalOpen] = useState(false);
  const [targetContact, setTargetContact] = useState<CaregiverProfile | AgencyProfile | null>(null);

  // Haversine distance formula in kilometers
  const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filter caregivers
  const filteredCaregivers = useMemo(() => {
    const refHosp = selectedHospital ? getHospitalById(selectedHospital) : hospitals[0]; // NHSL default

    return caregivers.filter(cg => {
      // Hospital filter
      if (selectedHospital) {
        const matchesPrimary = cg.primaryHospitalId === selectedHospital;
        const matchesSecondary = cg.secondaryHospitalIds?.includes(selectedHospital);
        if (!matchesPrimary && !matchesSecondary) return false;
      }

      // District filter
      if (selectedDistrict !== 'All Districts') {
        const primaryHosp = getHospitalById(cg.primaryHospitalId);
        if (!primaryHosp || primaryHosp.district !== selectedDistrict) return false;
      }

      // Search Radius (Haversine Proximity Filter)
      if (refHosp) {
        const cgHosp = getHospitalById(cg.primaryHospitalId);
        if (cgHosp) {
          const distance = calculateDistanceKm(
            refHosp.latitude,
            refHosp.longitude,
            cgHosp.latitude,
            cgHosp.longitude
          );
          if (distance > searchRadius) return false;
        }
      }

      // Available Today Only Checkbox
      if (availableTodayOnly) {
        if (!cg.isActive) return false;
      }

      // Availability / Shift
      if (availabilityFilter !== 'all' && cg.availabilityType !== availabilityFilter) {
        return false;
      }

      // Night shift filter checkbox
      if (visitTypeNight && cg.availabilityType !== 'nights' && cg.availabilityType !== 'whole_day') {
        return false;
      }

      // Gender
      if (genderFilter !== 'all' && cg.gender !== genderFilter) {
        return false;
      }

      // Age Filter
      if (ageFilter === 'under35' && cg.age >= 35) return false;
      if (ageFilter === '35to50' && (cg.age < 35 || cg.age > 50)) return false;
      if (ageFilter === 'above50' && cg.age <= 50) return false;

      // Price
      if (cg.pricePerDay > maxPrice) return false;

      return true;
    });
  }, [
    caregivers,
    hospitals,
    selectedHospital,
    selectedDistrict,
    searchRadius,
    availableTodayOnly,
    availabilityFilter,
    visitTypeNight,
    genderFilter,
    ageFilter,
    maxPrice,
    getHospitalById
  ]);

  // Sort
  const sortedCaregivers = useMemo(() => {
    return [...filteredCaregivers].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price_asc') return a.pricePerDay - b.pricePerDay;
      if (sortBy === 'price_desc') return b.pricePerDay - a.pricePerDay;
      if (a.isVerified !== b.isVerified) return a.isVerified ? -1 : 1;
      return b.rating - a.rating;
    });
  }, [filteredCaregivers, sortBy]);

  // Active selected caregiver for the right inspector
  const activeCaregiver = caregivers.find(c => c.id === selectedCaregiverId) || sortedCaregivers[0] || caregivers[0];
  const activeHospital = activeCaregiver ? getHospitalById(activeCaregiver.primaryHospitalId) : null;

  const handleQuickInquiry = (cg: CaregiverProfile) => {
    setTargetContact(cg);
    setModalOpen(true);
  };

  const handleInspectorContinueWhatsApp = () => {
    if (!activeCaregiver) return;
    const cleanPhone = activeCaregiver.whatsappNumber.replace(/[^0-9]/g, '');
    const shiftLabel = inspectorShift === 'whole_day' ? 'Full Day Care' : inspectorShift === 'nights' ? 'Night Shift' : 'Half Day';
    const text = encodeURIComponent(
      `Hello ${activeCaregiver.fullName},\nI found your profile on HireLanka Care for ${
        activeHospital ? activeHospital.name : 'hospital care'
      }.\n\nRequired Shift: ${shiftLabel}\nDate: ${inspectorDate} (${inspectorTime})\nAre you available for patient assistance?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Search & Filter Header (Image 3 style) */}
      <div className="bg-white border border-[#E5ECE8] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#172B25] tracking-tight">
              {t('findAProviderTitle')}
            </h1>
            <p className="text-xs text-[#64746D] mt-0.5">
              {t('findAProviderSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-72">
              <HospitalAutocomplete
                value={selectedHospital}
                onChange={setSelectedHospital}
                placeholder={t('hospitalSearchPlaceholder')}
              />
            </div>
            {selectedHospital && (
              <button
                type="button"
                onClick={() => setSelectedHospital('')}
                className="px-3 py-2 text-xs font-semibold text-[#176B55] hover:bg-emerald-50 rounded-xl transition-colors border border-emerald-200"
              >
                {t('clearFilters')}
              </button>
            )}
          </div>
        </div>

        {/* Filter Chips Bar (Image 3 style) */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 text-xs">
          {/* District Dropdown Chip */}
          <div className="relative shrink-0">
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="appearance-none pl-3 pr-7 py-1.5 bg-[#F8FAF8] hover:bg-slate-100 border border-[#E5ECE8] rounded-full font-medium text-[#172B25] outline-none cursor-pointer"
            >
              {SRI_LANKA_DISTRICTS.map(d => (
                <option key={d} value={d}>
                  {d === 'All Districts' ? t('allDistricts') : d}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#64746D] absolute right-2 top-2 pointer-events-none" />
          </div>

          {/* Shift Dropdown Chip */}
          <div className="relative shrink-0">
            <select
              value={availabilityFilter}
              onChange={e => setAvailabilityFilter(e.target.value)}
              className="appearance-none pl-3 pr-7 py-1.5 bg-[#F8FAF8] hover:bg-slate-100 border border-[#E5ECE8] rounded-full font-medium text-[#172B25] outline-none cursor-pointer"
            >
              <option value="all">{t('shiftCoverage')}: {t('allShifts')}</option>
              <option value="whole_day">{t('whole_day')}</option>
              <option value="nights">{t('nights')}</option>
              <option value="half_day_morning">{t('half_day_morning')}</option>
              <option value="half_day_afternoon">{t('half_day_afternoon')}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#64746D] absolute right-2 top-2 pointer-events-none" />
          </div>

          {/* Gender Chip */}
          <div className="relative shrink-0">
            <select
              value={genderFilter}
              onChange={e => setGenderFilter(e.target.value as typeof genderFilter)}
              className="appearance-none pl-3 pr-7 py-1.5 bg-[#F8FAF8] hover:bg-slate-100 border border-[#E5ECE8] rounded-full font-medium text-[#172B25] outline-none cursor-pointer"
            >
              <option value="all">{t('allGenders')}</option>
              <option value="Female">{t('femaleCaregivers')}</option>
              <option value="Male">{t('maleCaregivers')}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#64746D] absolute right-2 top-2 pointer-events-none" />
          </div>

          {/* Age Chip */}
          <div className="relative shrink-0">
            <select
              value={ageFilter}
              onChange={e => setAgeFilter(e.target.value as typeof ageFilter)}
              className="appearance-none pl-3 pr-7 py-1.5 bg-[#F8FAF8] hover:bg-slate-100 border border-[#E5ECE8] rounded-full font-medium text-[#172B25] outline-none cursor-pointer"
            >
              <option value="all">Age: Any</option>
              <option value="under35">Under 35 yrs</option>
              <option value="35to50">35 - 50 yrs</option>
              <option value="above50">Above 50 yrs</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#64746D] absolute right-2 top-2 pointer-events-none" />
          </div>

          {/* Reset Chip */}
          {(selectedHospital || selectedDistrict !== 'All Districts' || availabilityFilter !== 'all' || genderFilter !== 'all' || ageFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSelectedHospital('');
                setSelectedDistrict('All Districts');
                setAvailabilityFilter('all');
                setGenderFilter('all');
                setAgeFilter('all');
              }}
              className="shrink-0 px-3 py-1.5 text-xs text-[#176B55] hover:underline font-semibold"
            >
              {t('clearFilters')}
            </button>
          )}
        </div>
      </div>

      {/* 3-COLUMN LAYOUT (Exact Image 3 Architecture) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMN 1: Left Filters & Map Proximity (3 cols on desktop) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Map Preview Card */}
          <div className="bg-white border border-[#E5ECE8] rounded-2xl overflow-hidden shadow-xs">
            <div className="relative h-44 bg-gradient-to-br from-emerald-100/70 via-teal-50 to-slate-100 p-4 flex flex-col justify-between overflow-hidden">
              {/* Stylized Sri Lanka Map Outline & Hospital Markers */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#176B55_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#176B55] bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-2xs">
                  {t('hospitalMapTitle')}
                </span>
                <span className="text-[10px] text-[#64746D] bg-white/80 px-2 py-0.5 rounded-md font-mono">
                  Active GPS
                </span>
              </div>

              {/* Pin markers */}
              <div className="relative z-10 flex items-center justify-around">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-[#176B55] text-white flex items-center justify-center shadow-md animate-bounce">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold text-[#172B25] bg-white/90 px-1.5 py-0.5 rounded shadow-2xs mt-1">
                    NHSL
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full bg-[#2E8B70] text-white flex items-center justify-center shadow-md">
                    <MapPin className="w-3 h-3" />
                  </div>
                  <span className="text-[10px] font-bold text-[#172B25] bg-white/90 px-1.5 py-0.5 rounded shadow-2xs mt-1">
                    Kalubowila
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full bg-[#2E8B70] text-white flex items-center justify-center shadow-md">
                    <MapPin className="w-3 h-3" />
                  </div>
                  <span className="text-[10px] font-bold text-[#172B25] bg-white/90 px-1.5 py-0.5 rounded shadow-2xs mt-1">
                    Ragama
                  </span>
                </div>
              </div>

              <div className="relative z-10 text-[11px] text-[#64746D] bg-white/90 p-1.5 rounded-lg text-center font-medium">
                {selectedHospital ? (
                  <span>Filtered to: <strong>{getHospitalById(selectedHospital)?.name}</strong></span>
                ) : (
                  <span>Showing providers within Western Province &amp; Islandwide</span>
                )}
              </div>
            </div>

            {/* Search Radius Slider */}
            <div className="p-4 border-t border-[#E5ECE8] space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#172B25]">
                <span>{t('searchRadius')}</span>
                <span className="text-[#176B55] font-mono tabular-nums">{searchRadius} km</span>
              </div>
              <input
                type="range"
                min={5}
                max={60}
                step={5}
                value={searchRadius}
                onChange={e => setSearchRadius(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg accent-[#176B55] cursor-pointer"
              />
            </div>
          </div>

          {/* Filter Options (Image 3 style) */}
          <div className="bg-white border border-[#E5ECE8] rounded-2xl p-5 shadow-xs space-y-5">
            {/* Visit Type */}
            <div>
              <div className="text-xs font-bold text-[#172B25] mb-2.5 uppercase tracking-wider">
                {t('visitAndCareType')}
              </div>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2.5 text-[#172B25] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visitTypeInPerson}
                    onChange={e => setVisitTypeInPerson(e.target.checked)}
                    className="w-4 h-4 rounded text-[#176B55] accent-[#176B55]"
                  />
                  <span>{t('inPersonHospitalWard')}</span>
                </label>

                <label className="flex items-center gap-2.5 text-[#172B25] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visitTypeNight}
                    onChange={e => setVisitTypeNight(e.target.checked)}
                    className="w-4 h-4 rounded text-[#176B55] accent-[#176B55]"
                  />
                  <span>{t('nightShiftVigilance')}</span>
                </label>

                <label className="flex items-center gap-2.5 text-[#172B25] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={availableTodayOnly}
                    onChange={e => setAvailableTodayOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-[#176B55] accent-[#176B55]"
                  />
                  <span>{t('availableTodayImmediate')}</span>
                </label>
              </div>
            </div>

            {/* Daily Price Slider */}
            <div className="pt-4 border-t border-[#E5ECE8]">
              <div className="flex items-center justify-between text-xs font-bold text-[#172B25] mb-2">
                <span>{t('maximumRate')}</span>
                <span className="text-[#176B55] font-mono tabular-nums">Rs. {maxPrice}/day</span>
              </div>
              <input
                type="range"
                min={3000}
                max={8000}
                step={500}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg accent-[#176B55] cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-[#64746D] mt-1 font-mono">
                <span>Rs. 3,000</span>
                <span>Rs. 8,000</span>
              </div>
            </div>

            {/* Support hotline card */}
            <div className="p-3 bg-[#F8FAF8] border border-[#E5ECE8] rounded-xl text-xs space-y-1">
              <div className="font-bold text-[#172B25] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#176B55]" />
                <span>Need Emergency Attendant?</span>
              </div>
              <p className="text-[11px] text-[#64746D]">
                Suwa Seriya ambulance hotline: <strong>1990</strong>. Contact hospital helpdesk directly.
              </p>
            </div>
          </div>
        </div>

        {/* COLUMN 2: Center Caregiver Results List (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between bg-white border border-[#E5ECE8] rounded-xl px-4 py-3 text-xs">
            <span className="font-bold text-[#172B25] tabular-nums">
              {sortedCaregivers.length} {t('providersFound')}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[#64746D]">{t('sortBy')}</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-[#F8FAF8] border border-[#E5ECE8] rounded-lg px-2 py-1 text-xs text-[#172B25] outline-none font-medium cursor-pointer"
              >
                <option value="recommended">{t('relevance')}</option>
                <option value="rating">{t('highestRated')}</option>
                <option value="price_asc">{t('feeLowToHigh')}</option>
                <option value="price_desc">{t('feeHighToLow')}</option>
              </select>
            </div>
          </div>

          {/* Cards Stack (Exact Image 3 Card Anatomy) */}
          <div className="space-y-3">
            {sortedCaregivers.map(cg => {
              const cgHosp = getHospitalById(cg.primaryHospitalId);
              const isSelected = cg.id === selectedCaregiverId;

              return (
                <div
                  key={cg.id}
                  onClick={() => setSelectedCaregiverId(cg.id)}
                  className={`bg-white border rounded-2xl p-4 sm:p-5 transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-[#176B55] shadow-md ring-1 ring-[#176B55]/30'
                      : 'border-[#E5ECE8] hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Avatar + Details */}
                    <div className="flex items-start gap-3.5">
                      <div className="relative shrink-0">
                        <img
                          src={cg.profileImageUrl}
                          alt={cg.fullName}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-full object-cover border border-[#E5ECE8]"
                          onError={e => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=200&q=80';
                          }}
                        />
                        {cg.isVerified && (
                          <div className="absolute -bottom-0.5 -right-0.5 bg-[#176B55] text-white p-0.5 rounded-full border border-white">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-[#172B25] hover:text-[#176B55] transition-colors">
                            {cg.fullName}
                          </h3>
                        </div>

                        <div className="text-xs text-[#64746D]">
                          {cgHosp ? cgHosp.name : 'Hospital Attendant'}
                        </div>

                        <div className="text-xs text-[#64746D]">
                          {cg.experienceYears} years experience · {cg.age} yrs
                        </div>

                        {/* Stars */}
                        <div className="pt-0.5">
                          <StarRating rating={cg.rating} showNumber reviewCount={cg.reviewCount} size="sm" />
                        </div>

                        {/* Badges (Image 3 style) */}
                        <div className="flex items-center gap-2 pt-1 text-[11px] text-[#64746D]">
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#27865C]" />
                            In-hospital
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#176B55]" />
                            {cg.availabilityType === 'nights' ? 'Night Shift' : 'Full Day'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Next Available & Fee Starting At */}
                    <div className="text-right shrink-0 flex flex-col justify-between h-full space-y-3">
                      <div>
                        <div className="text-[11px] text-[#64746D]">{t('nextAvailable')}</div>
                        <div className="text-xs font-bold text-[#27865C]">
                          Today, 3:30 PM
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] text-[#64746D]">{t('feeStartingAt')}</div>
                        <div className="text-sm font-bold text-[#172B25] font-mono tabular-nums">
                          Rs. {cg.pricePerDay.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Quick Action Footer */}
                  <div className="mt-3 pt-3 border-t border-[#E5ECE8] flex items-center justify-between lg:hidden text-xs">
                    <span className="text-[#64746D]">Tap to inspect details</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickInquiry(cg);
                      }}
                      className="px-3 py-1 bg-[#27865C] text-white font-semibold rounded-lg flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 3: Right Sticky Booking & Profile Inspector (4 cols on desktop) */}
        <div className="lg:col-span-4 sticky top-20 space-y-4">
          {activeCaregiver ? (
            <div className="bg-white border border-[#E5ECE8] rounded-2xl p-6 shadow-md space-y-5">
              {/* Header profile */}
              <div className="flex items-start gap-4">
                <img
                  src={activeCaregiver.profileImageUrl}
                  alt={activeCaregiver.fullName}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover border border-[#E5ECE8] shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-base font-bold text-[#172B25] truncate">
                      {activeCaregiver.fullName}
                    </h2>
                  </div>
                  <div className="text-xs text-[#64746D]">
                    {activeHospital ? activeHospital.name : 'Hospital Caregiver'}
                  </div>
                  <div className="mt-1">
                    <StarRating rating={activeCaregiver.rating} showNumber reviewCount={activeCaregiver.reviewCount} size="sm" />
                  </div>
                </div>
              </div>

              {/* Bio snippet */}
              <p className="text-xs text-[#64746D] leading-relaxed line-clamp-3">
                {activeCaregiver.bio}
              </p>

              <Link
                to={`/caregivers/${activeCaregiver.id}`}
                className="text-xs font-semibold text-[#176B55] hover:underline block"
              >
                {t('viewProfile')} →
              </Link>

              {/* Choose Appointment Type (Image 3 style) */}
              <div className="pt-2 border-t border-[#E5ECE8] space-y-2">
                <div className="text-xs font-bold text-[#172B25] uppercase tracking-wider">
                  {t('chooseAppointmentType')}
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setInspectorShift('whole_day')}
                    className={`p-2.5 rounded-xl text-center border text-xs font-semibold transition-colors cursor-pointer ${
                      inspectorShift === 'whole_day'
                        ? 'bg-[#176B55] text-white border-[#176B55]'
                        : 'border-[#E5ECE8] text-[#172B25] hover:bg-slate-50'
                    }`}
                  >
                    {t('whole_day')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectorShift('nights')}
                    className={`p-2.5 rounded-xl text-center border text-xs font-semibold transition-colors cursor-pointer ${
                      inspectorShift === 'nights'
                        ? 'bg-[#176B55] text-white border-[#176B55]'
                        : 'border-[#E5ECE8] text-[#172B25] hover:bg-slate-50'
                    }`}
                  >
                    {t('nights')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectorShift('half_day')}
                    className={`p-2.5 rounded-xl text-center border text-xs font-semibold transition-colors cursor-pointer ${
                      inspectorShift === 'half_day'
                        ? 'bg-[#176B55] text-white border-[#176B55]'
                        : 'border-[#E5ECE8] text-[#172B25] hover:bg-slate-50'
                    }`}
                  >
                    {t('half_day')}
                  </button>
                </div>
              </div>

              {/* Select Date & Time (Image 3 style) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#172B25]">
                  <span>{t('selectDateTime')}</span>
                  <span className="text-[#64746D] font-normal">October 2026</span>
                </div>

                {/* Calendar Days Row */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <span key={i} className="text-[10px] font-semibold text-[#64746D]">
                      {d}
                    </span>
                  ))}
                  {[4, 5, 6, 7, 8, 9, 10].map(day => {
                    const dateStr = `2026-10-${day.toString().padStart(2, '0')}`;
                    const isSelectedDate = inspectorDate === dateStr;
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setInspectorDate(dateStr)}
                        className={`py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-colors ${
                          isSelectedDate
                            ? 'bg-[#176B55] text-white'
                            : 'hover:bg-slate-100 text-[#172B25]'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {/* Time slot chips */}
                <div className="grid grid-cols-3 gap-1.5 pt-2">
                  {['7:00 AM', '1:00 PM', '7:00 PM'].map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setInspectorTime(time)}
                      className={`py-1.5 px-2 text-xs rounded-lg border font-mono transition-colors cursor-pointer ${
                        inspectorTime === time
                          ? 'border-[#176B55] bg-emerald-50 text-[#176B55] font-bold'
                          : 'border-[#E5ECE8] text-[#172B25] hover:bg-slate-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Continue to Intake / WhatsApp CTA (Image 3 style) */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleInspectorContinueWhatsApp}
                  className="w-full py-3 px-4 bg-[#176B55] hover:bg-[#135946] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('continueToWhatsApp')}</span>
                </button>

                <div className="text-center text-[11px] text-[#64746D] flex items-center justify-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#27865C]" />
                  <span>{t('directHiringZeroCommission')}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E5ECE8] rounded-2xl p-8 text-center text-xs text-[#64746D]">
              Select a caregiver from the list to view booking details.
            </div>
          )}
        </div>

      </div>

      {/* Inquiry Modal */}
      {targetContact && (
        <InquiryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          target={targetContact}
          targetType="caregiver"
        />
      )}
    </div>
  );
};
