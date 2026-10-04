import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { StarRating } from '../components/common/StarRating';
import {
  Building2,
  Users,
  MapPin,
  CheckCircle2,
  Plus,
  Eye,
  EyeOff,
  Save,
  MessageCircle,
  Phone,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

export const AgencyDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const {
    agencies,
    hospitals,
    updateAgencyProfile,
    addAgencyStaff,
    toggleStaffVisibility,
    getInquiriesForUser,
    getReviewsForProfile
  } = useData();

  const agency = agencies.find(a => a.userId === currentUser?.id) || agencies[0];
  const inquiries = getInquiriesForUser(undefined, agency.id);
  const reviews = getReviewsForProfile(agency.id);

  const [activeTab, setActiveTab] = useState<'overview' | 'staff' | 'profile' | 'inquiries'>('overview');

  // Edit agency state
  const [agencyName, setAgencyName] = useState(agency.agencyName);
  const [description, setDescription] = useState(agency.description);
  const [priceMin, setPriceMin] = useState(agency.priceRangeMin);
  const [priceMax, setPriceMax] = useState(agency.priceRangeMax);
  const [contactPhone, setContactPhone] = useState(agency.contactPhone);
  const [contactWhatsapp, setContactWhatsapp] = useState(agency.contactWhatsapp);
  const [contactEmail, setContactEmail] = useState(agency.contactEmail);
  const [showStaff, setShowStaff] = useState(agency.showStaffProfiles);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New staff modal / form
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffAge, setNewStaffAge] = useState(35);
  const [newStaffGender, setNewStaffGender] = useState<'Female' | 'Male'>('Female');
  const [newStaffExp, setNewStaffExp] = useState(4);
  const [newStaffSpec, setNewStaffSpec] = useState('');

  const handleSaveAgency = (e: React.FormEvent) => {
    e.preventDefault();
    updateAgencyProfile(agency.id, {
      agencyName,
      description,
      priceRangeMin: priceMin,
      priceRangeMax: priceMax,
      contactPhone,
      contactWhatsapp,
      contactEmail,
      showStaffProfiles: showStaff
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffSpec) return;

    addAgencyStaff(agency.id, {
      staffName: newStaffName,
      staffAge: newStaffAge,
      gender: newStaffGender,
      specialization: newStaffSpec,
      experienceYears: newStaffExp
    });

    setNewStaffName('');
    setNewStaffSpec('');
    setStaffModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Welcome Card */}
      <div className="bg-white border border-[#E5ECE8] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#E5ECE8] shrink-0 bg-slate-100">
            <img
              src={agency.logoUrl}
              alt={agency.agencyName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#172B25]">
                {agency.agencyName}
              </h1>
              <span className="text-xs font-semibold text-[#176B55] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Registered Agency
              </span>
            </div>
            <p className="text-xs text-[#64746D] mt-1">
              Agency Management Portal · Staff Roster, Hospital Dispatch, Inquiries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#64746D]">
          Reg No: <span className="font-mono font-bold text-[#172B25]">{agency.registrationNumber}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white border border-[#E5ECE8] rounded-xl overflow-x-auto text-xs font-semibold">
        {[
          { id: 'overview', label: t('dashboard') },
          { id: 'staff', label: `${t('activeAttendants')} (${agency.staff?.length || 0})` },
          { id: 'profile', label: `${t('editProfile')} & Rates` },
          { id: 'inquiries', label: `${t('recentInquiries')} (${inquiries.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#176B55] text-white shadow-xs'
                : 'text-[#64746D] hover:text-[#172B25] hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E5ECE8] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-[#64746D] text-xs">
                <span>Caregivers on Staff</span>
                <Users className="w-4 h-4 text-[#176B55]" />
              </div>
              <div className="text-2xl font-bold text-[#172B25] mt-2 font-mono tabular-nums">
                {agency.numCaregivers}
              </div>
              <div className="text-[11px] text-[#64746D] mt-1">
                Active attendants &amp; aides
              </div>
            </div>

            <div className="bg-white border border-[#E5ECE8] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-[#64746D] text-xs">
                <span>Family Inquiries</span>
                <MessageCircle className="w-4 h-4 text-[#27865C]" />
              </div>
              <div className="text-2xl font-bold text-[#172B25] mt-2 font-mono tabular-nums">
                {inquiries.length + 42}
              </div>
              <div className="text-[11px] text-[#27865C] mt-1 font-medium">
                Hospital ward requests
              </div>
            </div>

            <div className="bg-white border border-[#E5ECE8] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-[#64746D] text-xs">
                <span>Average Agency Rating</span>
                <ShieldCheck className="w-4 h-4 text-[#D9A441]" />
              </div>
              <div className="text-2xl font-bold text-[#172B25] mt-2 font-mono tabular-nums">
                {agency.rating.toFixed(1)} / 5.0
              </div>
              <div className="text-[11px] text-[#64746D] mt-1">
                From {agency.reviewCount} client reviews
              </div>
            </div>

            <div className="bg-white border border-[#E5ECE8] rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-[#64746D] text-xs">
                <span>Daily Shift Range</span>
                <Briefcase className="w-4 h-4 text-[#176B55]" />
              </div>
              <div className="text-xl font-bold text-[#176B55] mt-2 font-mono tabular-nums">
                Rs. {agency.priceRangeMin.toLocaleString()} - {agency.priceRangeMax.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#64746D] mt-1">
                Per 24h / 12h ward shift
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E5ECE8] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#172B25]">
              Quick Staff Roster Summary
            </h3>
            <p className="text-xs text-[#64746D]">
              Public staff profiles visibility is currently{' '}
              <strong className={agency.showStaffProfiles ? 'text-[#27865C]' : 'text-amber-700'}>
                {agency.showStaffProfiles ? 'ENABLED' : 'HIDDEN (Agency Level Representation Only)'}
              </strong>.
            </p>
            <button
              type="button"
              onClick={() => toggleStaffVisibility(agency.id)}
              className="px-4 py-2 text-xs font-semibold bg-[#F8FAF8] hover:bg-slate-100 text-[#172B25] border border-[#E5ECE8] rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              {agency.showStaffProfiles ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>Toggle Public Staff Visibility</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Staff Roster Management */}
      {activeTab === 'staff' && (
        <div className="bg-white border border-[#E5ECE8] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5ECE8]">
            <div>
              <h2 className="text-lg font-bold text-[#172B25]">
                Agency Staff Roster ({agency.staff?.length || 0})
              </h2>
              <p className="text-xs text-[#64746D] mt-0.5">
                Manage your patient attendants and nursing assistants for hospital placements.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStaffModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold bg-[#176B55] hover:bg-[#135946] text-white rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Caregiver</span>
            </button>
          </div>

          <div className="divide-y divide-[#E5ECE8]">
            {agency.staff && agency.staff.length > 0 ? (
              agency.staff.map(member => (
                <div key={member.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#172B25]">{member.staffName}</span>
                      <span className="text-xs text-[#64746D]">({member.staffAge} yrs, {member.gender})</span>
                    </div>
                    <div className="text-xs text-[#172B25] mt-1 font-medium">
                      Specialization: {member.specialization}
                    </div>
                    <div className="text-xs text-[#64746D] mt-0.5 font-mono">
                      {member.experienceYears} Years Clinical Ward Experience
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-[#27865C] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                    Active on Roster
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-[#64746D]">
                No staff members listed yet. Add your first caregiver using the button above.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Company Profile & Rates */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-[#E5ECE8] rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5ECE8] mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#172B25]">
                Agency Profile &amp; Hospital Settings
              </h2>
              <p className="text-xs text-[#64746D] mt-0.5">
                Update business details, phone contacts, and daily LKR pricing ranges.
              </p>
            </div>

            {savedSuccess && (
              <div className="px-3 py-1.5 bg-emerald-50 text-[#176B55] border border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Agency Details Updated!</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSaveAgency} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-[#172B25] mb-1">
                Agency Name
              </label>
              <input
                type="text"
                required
                value={agencyName}
                onChange={e => setAgencyName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF8] focus:bg-white border border-[#E5ECE8] focus:border-[#176B55] rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B25] mb-1">
                Description &amp; Agency Qualifications
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF8] focus:bg-white border border-[#E5ECE8] focus:border-[#176B55] rounded-xl outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#F8FAF8] border border-[#E5ECE8] rounded-2xl">
              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  Minimum Daily Rate (LKR)
                </label>
                <input
                  type="number"
                  step={100}
                  required
                  value={priceMin}
                  onChange={e => setPriceMin(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#E5ECE8] focus:border-[#176B55] rounded-xl outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  Maximum Daily Rate (LKR)
                </label>
                <input
                  type="number"
                  step={100}
                  required
                  value={priceMax}
                  onChange={e => setPriceMax(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#E5ECE8] focus:border-[#176B55] rounded-xl outline-none font-mono font-bold text-[#176B55]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  Official Phone
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF8] focus:bg-white border border-[#E5ECE8] rounded-xl outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  required
                  value={contactWhatsapp}
                  onChange={e => setContactWhatsapp(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF8] focus:bg-white border border-[#E5ECE8] rounded-xl outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F8FAF8] focus:bg-white border border-[#E5ECE8] rounded-xl outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5ECE8] flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#176B55] hover:bg-[#135946] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Agency Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 4: Inquiries */}
      {activeTab === 'inquiries' && (
        <div className="bg-white border border-[#E5ECE8] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5ECE8]">
            <h2 className="text-lg font-bold text-[#172B25]">
              Hospital Placement Inquiries ({inquiries.length})
            </h2>
            <span className="text-xs text-[#64746D]">
              Direct hospital and home dispatch requests
            </span>
          </div>

          {inquiries.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#64746D]">
              No inquiries yet for your agency.
            </div>
          ) : (
            <div className="divide-y divide-[#E5ECE8]">
              {inquiries.map(inq => (
                <div key={inq.id} className="py-4 first:pt-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#172B25]">{inq.familyName}</span>
                    <span className="text-xs text-[#64746D] font-mono tabular-nums">
                      {new Date(inq.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-[#64746D]">
                    Hospital: <strong className="text-[#172B25]">{inq.hospitalName}</strong> · Shift: {inq.shiftNeeded}
                  </div>
                  {inq.message && (
                    <p className="text-xs text-[#172B25] bg-[#F8FAF8] p-3 rounded-xl border border-[#E5ECE8]">
                      &quot;{inq.message}&quot;
                    </p>
                  )}
                  <a
                    href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#27865C] hover:underline pt-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Contact Family via WhatsApp ({inq.phone})</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Staff Modal */}
      {staffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="max-w-md w-full bg-white rounded-2xl border border-[#E5ECE8] shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#172B25]">
              Add Caregiver to Agency Roster
            </h3>

            <form onSubmit={handleAddStaff} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  Staff Member Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohini Samaranayake"
                  value={newStaffName}
                  onChange={e => setNewStaffName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E5ECE8] rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172B25] mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={70}
                    required
                    value={newStaffAge}
                    onChange={e => setNewStaffAge(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-[#E5ECE8] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172B25] mb-1">
                    Gender
                  </label>
                  <select
                    value={newStaffGender}
                    onChange={e => setNewStaffGender(e.target.value as 'Female' | 'Male')}
                    className="w-full px-3 py-2 text-xs border border-[#E5ECE8] rounded-xl outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min={0}
                  max={40}
                  required
                  value={newStaffExp}
                  onChange={e => setNewStaffExp(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-[#E5ECE8] rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Geriatric bathing, catheter hygiene, stroke recovery"
                  value={newStaffSpec}
                  onChange={e => setNewStaffSpec(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E5ECE8] rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setStaffModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#64746D] hover:text-[#172B25]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-[#176B55] text-white rounded-xl hover:bg-[#135946]"
                >
                  Save to Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
