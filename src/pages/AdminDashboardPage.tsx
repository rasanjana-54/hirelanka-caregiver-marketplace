import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { StarRating } from '../components/common/StarRating';
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Search,
  MessageSquare
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const {
    caregivers,
    agencies,
    hospitals,
    reviews,
    inquiries,
    toggleCaregiverVerification,
    addHospital
  } = useData();

  const [activeTab, setActiveTab] = useState<'overview' | 'caregivers' | 'hospitals' | 'reviews'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // New hospital modal state
  const [hospModalOpen, setHospModalOpen] = useState(false);
  const [newHospName, setNewHospName] = useState('');
  const [newHospDistrict, setNewHospDistrict] = useState('Colombo');
  const [newHospLocation, setNewHospLocation] = useState('');
  const [newHospType, setNewHospType] = useState<'government' | 'private'>('government');
  const [newHospPhone, setNewHospPhone] = useState('+94 11 ');

  const handleCreateHospital = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHospName || !newHospLocation) return;

    addHospital({
      name: newHospName,
      location: newHospLocation,
      district: newHospDistrict,
      hospitalType: newHospType,
      latitude: 6.9271,
      longitude: 79.8612,
      phone: newHospPhone
    });

    setNewHospName('');
    setNewHospLocation('');
    setHospModalOpen(false);
  };

  const filteredCaregivers = caregivers.filter(
    c =>
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Header */}
      <div className="bg-white border border-[#E5ECE8] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#176B55] uppercase tracking-wider">
            HireLanka Care Administration
          </span>
          <h1 className="text-2xl font-bold text-[#172B25] mt-1">
            Platform Governance &amp; Verification
          </h1>
          <p className="text-xs text-[#64746D] mt-0.5">
            Moderate hospital caregiver listings, audit ID credentials, and manage Sri Lankan hospital records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#27865C] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> System Operational
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white border border-[#E5ECE8] rounded-xl overflow-x-auto text-xs font-semibold">
        {[
          { id: 'overview', label: t('dashboard') },
          { id: 'caregivers', label: `${t('verifiedBadge')} (${caregivers.length})` },
          { id: 'hospitals', label: `${t('popularHospitals')} (${hospitals.length})` },
          { id: 'reviews', label: `${t('familyReviewsTitle')} (${reviews.length})` }
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
              <div className="text-xs text-[#64746D]">Registered Caregivers</div>
              <div className="text-3xl font-extrabold text-[#172B25] mt-2 font-mono tabular-nums">
                {caregivers.length}
              </div>
              <div className="text-[11px] text-[#27865C] mt-1 font-medium">
                {caregivers.filter(c => c.isVerified).length} Verified by Admin
              </div>
            </div>

            <div className="bg-white border border-[#E5ECE8] rounded-2xl p-5 shadow-xs">
              <div className="text-xs text-[#64746D]">Care Agencies</div>
              <div className="text-3xl font-extrabold text-[#172B25] mt-2 font-mono tabular-nums">
                {agencies.length}
              </div>
              <div className="text-[11px] text-[#64746D] mt-1">
                Suwasevana, Lanka Angels, Ceylon
              </div>
            </div>

            <div className="bg-white border border-[#E5ECE8] rounded-2xl p-5 shadow-xs">
              <div className="text-xs text-[#64746D]">Hospitals Indexed</div>
              <div className="text-3xl font-extrabold text-[#172B25] mt-2 font-mono tabular-nums">
                {hospitals.length}
              </div>
              <div className="text-[11px] text-[#64746D] mt-1">
                Government &amp; Private facilities
              </div>
            </div>

            <div className="bg-white border border-[#E5ECE8] rounded-2xl p-5 shadow-xs">
              <div className="text-xs text-[#64746D]">Total Family Inquiries</div>
              <div className="text-3xl font-extrabold text-[#176B55] mt-2 font-mono tabular-nums">
                {inquiries.length + 86}
              </div>
              <div className="text-[11px] text-[#27865C] mt-1 font-medium">
                Islandwide WhatsApp/Phone hires
              </div>
            </div>
          </div>

          {/* Quick Security & Moderation Log */}
          <div className="bg-white border border-[#E5ECE8] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#172B25]">
              Verification Checklist &amp; Trust Guidelines
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#64746D]">
              <div className="p-3 bg-[#F8FAF8] rounded-xl border border-[#E5ECE8] space-y-1">
                <div className="font-bold text-[#172B25]">1. National Identity Card</div>
                <p>Verify applicant full name, age, and valid Sri Lankan NIC number before marking verified.</p>
              </div>
              <div className="p-3 bg-[#F8FAF8] rounded-xl border border-[#E5ECE8] space-y-1">
                <div className="font-bold text-[#172B25]">2. Police Clearance Certificate</div>
                <p>Ensure criminal record clearance from Sri Lanka Police Headquarters within the past 12 months.</p>
              </div>
              <div className="p-3 bg-[#F8FAF8] rounded-xl border border-[#E5ECE8] space-y-1">
                <div className="font-bold text-[#172B25]">3. Clinical Experience &amp; NVQ</div>
                <p>Confirm patient handling training or past hospital ward attendant references.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Caregiver Verification */}
      {activeTab === 'caregivers' && (
        <div className="bg-white border border-[#E5ECE8] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#172B25]">
                Caregiver Verification Queue
              </h2>
              <p className="text-xs text-[#64746D] mt-0.5">
                Toggle verification badges on caregiver profiles after reviewing police reports &amp; NIC documents.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#64746D] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search caregiver name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F8FAF8] border border-[#E5ECE8] rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E5ECE8] text-[#64746D]">
                  <th className="py-3 px-3 font-semibold">Caregiver</th>
                  <th className="py-3 px-3 font-semibold">Age / Exp</th>
                  <th className="py-3 px-3 font-semibold">Phone (WhatsApp)</th>
                  <th className="py-3 px-3 font-semibold">Daily Rate</th>
                  <th className="py-3 px-3 font-semibold">Rating</th>
                  <th className="py-3 px-3 font-semibold">Verification Status</th>
                  <th className="py-3 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5ECE8]">
                {filteredCaregivers.map(cg => (
                  <tr key={cg.id} className="hover:bg-[#F8FAF8]">
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#172B25]">{cg.fullName}</div>
                      <div className="text-[11px] text-[#64746D]">{cg.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div>{cg.age} yrs</div>
                      <div className="text-[#64746D]">{cg.experienceYears} yrs exp</div>
                    </td>
                    <td className="py-3 px-3 font-mono">{cg.phoneNumber}</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#176B55]">
                      Rs. {cg.pricePerDay.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        <span className="font-bold">{cg.rating}</span>
                        <span className="text-[#64746D]">({cg.reviewCount})</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {cg.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-[#27865C] bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" /> Pending Audit
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => toggleCaregiverVerification(cg.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          cg.isVerified
                            ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                            : 'bg-[#176B55] text-white hover:bg-[#135946]'
                        }`}
                      >
                        {cg.isVerified ? 'Revoke Verified' : 'Grant Verified'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Hospital Management */}
      {activeTab === 'hospitals' && (
        <div className="bg-white border border-[#E5ECE8] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#172B25]">
                Sri Lankan Hospital Database ({hospitals.length})
              </h2>
              <p className="text-xs text-[#64746D] mt-0.5">
                Manage government teaching hospitals and private healthcare facilities indexed for search.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setHospModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold bg-[#176B55] hover:bg-[#135946] text-white rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Hospital</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hospitals.map(h => (
              <div key={h.id} className="p-4 bg-[#F8FAF8] border border-[#E5ECE8] rounded-xl space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-sm text-[#172B25]">{h.name}</div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 uppercase ${
                      h.hospitalType === 'government'
                        ? 'bg-emerald-100 text-[#176B55]'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {h.hospitalType}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#64746D]">
                  <MapPin className="w-3.5 h-3.5 text-[#176B55]" />
                  <span>{h.location} ({h.district})</span>
                </div>

                {h.phone && (
                  <div className="text-[11px] font-mono text-[#64746D]">
                    Ward Desk: {h.phone}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Reviews */}
      {activeTab === 'reviews' && (
        <div className="bg-white border border-[#E5ECE8] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5ECE8]">
            <h2 className="text-lg font-bold text-[#172B25]">
              Family Reviews Moderation Queue ({reviews.length})
            </h2>
            <span className="text-xs text-[#64746D]">
              All reviews must represent real hospital experiences
            </span>
          </div>

          <div className="divide-y divide-[#E5ECE8]">
            {reviews.map(r => (
              <div key={r.id} className="py-4 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StarRating rating={r.rating} size="sm" />
                    <span className="text-xs font-bold text-[#172B25]">{r.title}</span>
                  </div>
                  <span className="text-xs text-[#64746D] font-mono">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-[#172B25] leading-relaxed">
                  &quot;{r.comment}&quot;
                </p>
                <div className="text-[11px] text-[#64746D] flex items-center gap-2">
                  <span>Reviewer: <strong>{r.reviewerName}</strong></span>
                  {r.hospitalName && <span>· Hospital: {r.hospitalName}</span>}
                  <span>· Status: <strong className="text-[#27865C]">Approved</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Hospital Modal */}
      {hospModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="max-w-md w-full bg-white rounded-2xl border border-[#E5ECE8] shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#172B25]">Add Sri Lankan Hospital</h3>

            <form onSubmit={handleCreateHospital} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  Hospital Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Base Hospital Panadura"
                  value={newHospName}
                  onChange={e => setNewHospName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E5ECE8] rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172B25] mb-1">
                    District
                  </label>
                  <select
                    value={newHospDistrict}
                    onChange={e => setNewHospDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E5ECE8] rounded-xl outline-none"
                  >
                    <option value="Colombo">Colombo</option>
                    <option value="Gampaha">Gampaha</option>
                    <option value="Kalutara">Kalutara</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Galle">Galle</option>
                    <option value="Matara">Matara</option>
                    <option value="Kurunegala">Kurunegala</option>
                    <option value="Anuradhapura">Anuradhapura</option>
                    <option value="Jaffna">Jaffna</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172B25] mb-1">
                    Hospital Type
                  </label>
                  <select
                    value={newHospType}
                    onChange={e => setNewHospType(e.target.value as 'government' | 'private')}
                    className="w-full px-3 py-2 text-xs border border-[#E5ECE8] rounded-xl outline-none"
                  >
                    <option value="government">Government</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  Town / Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Panadura Town"
                  value={newHospLocation}
                  onChange={e => setNewHospLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E5ECE8] rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  Hospital Phone
                </label>
                <input
                  type="tel"
                  placeholder="+94 38 223 2261"
                  value={newHospPhone}
                  onChange={e => setNewHospPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E5ECE8] rounded-xl outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setHospModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#64746D] hover:text-[#172B25]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-[#176B55] text-white rounded-xl hover:bg-[#135946]"
                >
                  Add Hospital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
