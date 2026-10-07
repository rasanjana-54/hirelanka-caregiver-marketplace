import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { StarRating } from '../components/common/StarRating';
import { apiRequest } from '../lib/api';
import { ShieldCheck, Plus, CheckCircle2, AlertTriangle, MapPin, Search, FileText } from 'lucide-react';
export const AdminDashboardPage = () => {
    const { t } = useLanguage();
  const { hospitals, addHospital } = useData();
  const [dashboard, setDashboard] = useState(null);
  const [dashboardError, setDashboardError] = useState('');
  const [actionError, setActionError] = useState('');
  const [savingAction, setSavingAction] = useState(false);
      const [dashboardRetry, setDashboardRetry] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAuditCg, setSelectedAuditCg] = useState(null);
  const summary = dashboard?.summary;
  const caregivers = dashboard?.caregivers || [];
  const reviews = dashboard?.reviews || [];
  useEffect(() => {
    let active = true;
    setDashboardError('');
    apiRequest('/admin/dashboard')
      .then(data => {
      if (active)
        setDashboard(data);
    })
      .catch(error => {
      if (active)
        setDashboardError(error instanceof Error ? error.message : 'Could not load administrator data.');
    });
    return () => { active = false; };
  }, [dashboardRetry]);
  const handleCaregiverVerification = async (caregiver, isVerified) => {
    setSavingAction(true);
    setActionError('');
    try {
      await apiRequest(`/caregivers/${caregiver.id}/verification`, {
        method: 'PATCH',
        body: JSON.stringify({ is_verified: isVerified })
      });
      setDashboard(previous => ({
        ...previous,
        caregivers: previous.caregivers.map(item => item.id === caregiver.id ? { ...item, isVerified } : item),
        summary: {
          ...previous.summary,
          verifiedCaregivers: previous.summary.verifiedCaregivers + (isVerified ? 1 : -1),
          pendingCaregivers: previous.summary.pendingCaregivers + (isVerified ? -1 : 1)
        }
      }));
      setSelectedAuditCg(null);
    }
    catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not update caregiver verification.');
    }
    finally {
      setSavingAction(false);
    }
  };
  const handleReviewVerification = async (review, isVerified) => {
    setSavingAction(true);
    setActionError('');
    try {
      await apiRequest(`/admin/reviews/${review.id}/verification`, {
        method: 'PATCH',
        body: JSON.stringify({ is_verified: isVerified })
      });
      setDashboard(previous => ({
        ...previous,
        reviews: previous.reviews.map(item => item.id === review.id ? { ...item, isVerified } : item),
        summary: {
          ...previous.summary,
          pendingReviews: previous.summary.pendingReviews + (review.isVerified === isVerified ? 0 : isVerified ? -1 : 1)
        }
      }));
    }
    catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not update review visibility.');
    }
    finally {
      setSavingAction(false);
    }
  };
    // New hospital modal state
    const [hospModalOpen, setHospModalOpen] = useState(false);
    const [newHospName, setNewHospName] = useState('');
    const [newHospDistrict, setNewHospDistrict] = useState('Colombo');
    const [newHospLocation, setNewHospLocation] = useState('');
    const [newHospType, setNewHospType] = useState('government');
    const [newHospPhone, setNewHospPhone] = useState('+94 11 ');
    const handleCreateHospital = (e) => {
        e.preventDefault();
        if (!newHospName || !newHospLocation)
            return;
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
    const filteredCaregivers = caregivers.filter(c => (c.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()));
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Header */}
      <div className="bg-white border border-[#b1f2ff] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#3dcfff] uppercase tracking-wider">
            HireLanka Care Administration
          </span>
          <h1 className="text-2xl font-bold text-[#172B25] mt-1">
            Admin Overview &amp; Moderation
          </h1>
          <p className="text-xs text-[#64746D] mt-0.5">
            Review caregiver profiles, moderate family reviews, and manage hospital records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#27865C] bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4"/> Admin workspace
          </span>
        </div>
      </div>

      {/* Tabs */}
            {dashboardError ? (<div role="alert" className="flex items-center justify-between gap-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-800">
                <span>{dashboardError}</span>
                <button type="button" onClick={() => setDashboardRetry(value => value + 1)} className="font-bold underline">Retry</button>
              </div>) : !dashboard && (<p aria-live="polite" className="text-xs text-[#64746D]">Loading admin data...</p>)}
            {actionError && <p role="alert" className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-800">{actionError}</p>}

            {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white border border-[#b1f2ff] rounded-xl overflow-x-auto text-xs font-semibold">
        {[
            { id: 'overview', label: t('dashboard') },
            { id: 'caregivers', label: `Caregivers (${summary?.pendingCaregivers ?? '—'} pending)` },
            { id: 'hospitals', label: `${t('popularHospitals')} (${hospitals.length})` },
            { id: 'reviews', label: `Reviews (${summary?.pendingReviews ?? '—'} pending)` }
        ].map(tab => (<button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.id
                ? 'bg-[#3dcfff] text-white shadow-xs'
                : 'text-[#64746D] hover:text-[#172B25] hover:bg-slate-50'}`}>
            {tab.label}
          </button>))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (<div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#b1f2ff] rounded-2xl p-5 shadow-xs">
              <div className="text-xs text-[#64746D]">Registered Caregivers</div>
              <div className="text-3xl font-extrabold text-[#172B25] mt-2 font-mono tabular-nums">
                 {summary?.totalCaregivers ?? '—'}
              </div>
              <div className="text-[11px] text-[#27865C] mt-1 font-medium">
                {caregivers.filter(c => c.isVerified).length} Verified by Admin
              </div>
            </div>

            <div className="bg-white border border-[#b1f2ff] rounded-2xl p-5 shadow-xs">
              <div className="text-xs text-[#64746D]">Care Agencies</div>
              <div className="text-3xl font-extrabold text-[#172B25] mt-2 font-mono tabular-nums">
                 {summary?.totalAgencies ?? '—'}
              </div>
              <div className="text-[11px] text-[#64746D] mt-1">
                Registered agencies
              </div>
            </div>

            <div className="bg-white border border-[#b1f2ff] rounded-2xl p-5 shadow-xs">
              <div className="text-xs text-[#64746D]">Hospitals Indexed</div>
              <div className="text-3xl font-extrabold text-[#172B25] mt-2 font-mono tabular-nums">
                {hospitals.length}
              </div>
              <div className="text-[11px] text-[#64746D] mt-1">
                Government &amp; Private facilities
              </div>
            </div>

            <div className="bg-white border border-[#b1f2ff] rounded-2xl p-5 shadow-xs">
              <div className="text-xs text-[#64746D]">Total Family Inquiries</div>
              <div className="text-3xl font-extrabold text-[#3dcfff] mt-2 font-mono tabular-nums">
                 {summary?.totalInquiries ?? '—'}
              </div>
              <div className="text-[11px] text-[#27865C] mt-1 font-medium">
                All recorded family inquiries
              </div>
            </div>
          </div>

          {/* Quick Security & Moderation Log */}
          <div className="bg-white border border-[#b1f2ff] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#172B25]">
              Caregiver Review Scope
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#64746D]">
              <div className="p-3 bg-[#d8f9ff] rounded-xl border border-[#b1f2ff] space-y-1">
                <div className="font-bold text-[#172B25]">Profile approval</div>
                  <p>Verification records an admin decision on the caregiver profile.</p>
              </div>
              <div className="p-3 bg-[#d8f9ff] rounded-xl border border-[#b1f2ff] space-y-1">
                <div className="font-bold text-[#172B25]">Document storage</div>
                <p>Document uploads are not currently stored in this system.</p>
              </div>
              <div className="p-3 bg-[#d8f9ff] rounded-xl border border-[#b1f2ff] space-y-1">
                <div className="font-bold text-[#172B25]">Current data</div>
                <p>Review only the profile information shown in the caregiver queue.</p>
              </div>
            </div>
          </div>
        </div>)}

      {/* Tab 2: Caregiver Verification */}
      {activeTab === 'caregivers' && (<div className="bg-white border border-[#b1f2ff] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#172B25]">
                Caregiver Verification &amp; Credential Audit Queue
              </h2>
              <p className="text-xs text-[#64746D] mt-0.5">
                Review caregiver profile details before granting a verified badge.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#64746D] absolute left-3 top-2.5"/>
              <input type="text" placeholder="Search caregiver name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#d8f9ff] border border-[#b1f2ff] rounded-xl outline-none"/>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#b1f2ff] text-[#64746D]">
                  <th className="py-3 px-3 font-semibold">Caregiver</th>
                  <th className="py-3 px-3 font-semibold">Age / Exp</th>
                  <th className="py-3 px-3 font-semibold">Phone (WhatsApp)</th>
                  <th className="py-3 px-3 font-semibold">Daily Rate</th>
                  <th className="py-3 px-3 font-semibold">Verification Status</th>
                  <th className="py-3 px-3 font-semibold text-right">Audit Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#b1f2ff]">
                {filteredCaregivers.map(cg => (<tr key={cg.id} className="hover:bg-[#d8f9ff]">
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#172B25]">{cg.fullName}</div>
                      <div className="text-[11px] text-[#64746D]">{cg.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div>{cg.age} yrs</div>
                      <div className="text-[#64746D]">{cg.experienceYears} yrs exp</div>
                    </td>
                    <td className="py-3 px-3 font-mono">{cg.phoneNumber}</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#3dcfff]">
                      Rs. {cg.pricePerDay.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      {cg.isVerified ? (<span className="inline-flex items-center gap-1 text-[#27865C] bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded-full font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5"/> Verified Badge Active
                        </span>) : (<span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5"/> Pending Admin Review
                        </span>)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button type="button" onClick={() => setSelectedAuditCg(cg)} className="px-3.5 py-1.5 text-xs font-semibold bg-[#3dcfff] hover:bg-[#1eb5df] text-white rounded-lg transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5"/>
                        <span>Review Profile</span>
                      </button>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>)}

      {/* Tab 3: Hospital Management */}
      {activeTab === 'hospitals' && (<div className="bg-white border border-[#b1f2ff] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#172B25]">
                Sri Lankan Hospital Database ({summary?.totalHospitals ?? hospitals.length})
              </h2>
              <p className="text-xs text-[#64746D] mt-0.5">
                Manage government teaching hospitals and private healthcare facilities indexed for search.
              </p>
            </div>

            <button type="button" onClick={() => setHospModalOpen(true)} className="px-4 py-2 text-xs font-semibold bg-[#3dcfff] hover:bg-[#1eb5df] text-white rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs">
              <Plus className="w-4 h-4"/>
              <span>Add Hospital</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hospitals.map(h => (<div key={h.id} className="p-4 bg-[#d8f9ff] border border-[#b1f2ff] rounded-xl space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-sm text-[#172B25]">{h.name}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 uppercase ${h.hospitalType === 'government'
                    ? 'bg-cyan-100 text-[#3dcfff]'
                    : 'bg-blue-100 text-blue-700'}`}>
                    {h.hospitalType}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#64746D]">
                  <MapPin className="w-3.5 h-3.5 text-[#3dcfff]"/>
                  <span>{h.location} ({h.district})</span>
                </div>

                {h.phone && (<div className="text-[11px] font-mono text-[#64746D]">
                    Ward Desk: {h.phone}
                  </div>)}
              </div>))}
          </div>
        </div>)}

      {/* Tab 4: Reviews */}
      {activeTab === 'reviews' && (<div className="bg-white border border-[#b1f2ff] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#b1f2ff]">
            <h2 className="text-lg font-bold text-[#172B25]">
              Family Reviews ({reviews.length})
            </h2>
            <span className="text-xs text-[#64746D]">
              Approved reviews are visible on caregiver and agency profiles.
            </span>
          </div>

          <div className="divide-y divide-[#b1f2ff]">
            {reviews.map(r => (<div key={r.id} className="py-4 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StarRating rating={r.rating} size="sm"/>
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
                  <span>· Profile: <strong>{r.revieweeName}</strong></span>
                  {r.hospitalName && <span>· Hospital: {r.hospitalName}</span>}
                  <span>· Status: <strong className={r.isVerified ? 'text-[#27865C]' : 'text-amber-700'}>{r.isVerified ? 'Approved' : 'Pending'}</strong></span>
                  <button type="button" disabled={savingAction} onClick={() => void handleReviewVerification(r, !r.isVerified)} className="ml-auto px-3 py-1 text-xs font-semibold border border-[#b1f2ff] rounded-lg hover:bg-[#d8f9ff] disabled:opacity-50">
                    {savingAction ? 'Saving...' : r.isVerified ? 'Hide review' : 'Approve review'}
                  </button>
                </div>
              </div>))}
          </div>
        </div>)}

      {/* Caregiver Profile Review Modal */}
      {selectedAuditCg && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="max-w-xl w-full bg-white rounded-3xl border border-[#b1f2ff] shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#b1f2ff]">
              <div>
                <span className="text-[11px] font-bold text-[#3dcfff] uppercase tracking-wider">
                  Caregiver Profile Review
                </span>
                <h3 className="text-lg font-bold text-[#172B25]">
                  Review: {selectedAuditCg.fullName}
                </h3>
              </div>
              <button type="button" onClick={() => setSelectedAuditCg(null)} className="text-xs text-[#64746D] hover:text-[#172B25] p-1 font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Profile details */}
              <div className="p-4 bg-[#d8f9ff] rounded-2xl border border-[#b1f2ff] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#172B25] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#3dcfff]"/>
                    <span>Caregiver Profile</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${selectedAuditCg.isVerified ? 'bg-cyan-100 text-[#3dcfff]' : 'bg-amber-100 text-amber-800'}`}>
                    {selectedAuditCg.isVerified ? 'Verified' : 'Pending admin review'}
                  </span>
                </div>
                <p className="text-[#64746D]">
                  Age: <strong>{selectedAuditCg.age} years</strong> · Experience: <strong>{selectedAuditCg.experienceYears} years</strong>
                </p>
                <div className="p-2 bg-white rounded-xl border border-dashed border-[#b1f2ff] text-[11px] text-[#64746D] font-mono">
                  Qualifications: {Array.isArray(selectedAuditCg.qualifications) ? selectedAuditCg.qualifications.join(', ') || 'Not provided' : selectedAuditCg.qualifications || 'Not provided'}
                </div>
              </div>

              {/* Contact information */}
              <div className="p-4 bg-[#d8f9ff] rounded-2xl border border-[#b1f2ff] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#172B25] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#3dcfff]"/>
                    <span>Contact Details</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${selectedAuditCg.phoneNumber ? 'bg-cyan-100 text-[#3dcfff]' : 'bg-amber-100 text-amber-800'}`}>
                    {selectedAuditCg.phoneNumber ? 'Phone available' : 'Phone not provided'}
                  </span>
                </div>
                <p className="text-[#64746D]">
                  Phone: {selectedAuditCg.phoneNumber || 'Not provided'} · Email: {selectedAuditCg.email || 'Not provided'}
                </p>
                <div className="p-2 bg-white rounded-xl border border-dashed border-[#b1f2ff] text-[11px] text-[#64746D] font-mono">
                  Primary hospital: {selectedAuditCg.hospitalName || 'Not provided'}
                </div>
              </div>

              {/* Rate details */}
              <div className="p-4 bg-[#d8f9ff] rounded-2xl border border-[#b1f2ff] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#172B25] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#3dcfff]"/>
                    <span>Daily Rate</span>
                  </div>
                  <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-cyan-100 text-[#3dcfff]">
                    Rs. {Number(selectedAuditCg.pricePerDay || 0).toLocaleString()}
                  </span>
                </div>
                <p className="text-[#64746D]">
                  Review the profile information above before changing verification status.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#b1f2ff]">
              <button type="button" onClick={() => setSelectedAuditCg(null)} className="px-4 py-2 text-xs font-semibold text-[#64746D] hover:text-[#172B25]">
                Close Review
              </button>

              <div className="flex items-center gap-2">
                <button type="button" disabled={savingAction} onClick={() => void handleCaregiverVerification(selectedAuditCg, !selectedAuditCg.isVerified)} className="px-5 py-2 text-xs font-semibold bg-[#3dcfff] hover:bg-[#1eb5df] text-white rounded-xl shadow-xs disabled:opacity-50">
                  {savingAction ? 'Saving...' : selectedAuditCg.isVerified ? 'Remove Verified Badge' : 'Approve &amp; Grant Verified Badge'}
                </button>
              </div>
            </div>
          </div>
        </div>)}

      {/* Add Hospital Modal */}
      {hospModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="max-w-md w-full bg-white rounded-2xl border border-[#b1f2ff] shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#172B25]">Add Sri Lankan Hospital</h3>

            <form onSubmit={handleCreateHospital} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  Hospital Name
                </label>
                <input type="text" required placeholder="e.g. Base Hospital Panadura" value={newHospName} onChange={e => setNewHospName(e.target.value)} className="w-full px-3 py-2 text-xs border border-[#b1f2ff] rounded-xl outline-none"/>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#172B25] mb-1">
                    District
                  </label>
                  <select value={newHospDistrict} onChange={e => setNewHospDistrict(e.target.value)} className="w-full px-3 py-2 text-xs border border-[#b1f2ff] rounded-xl outline-none">
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
                  <select value={newHospType} onChange={e => setNewHospType(e.target.value)} className="w-full px-3 py-2 text-xs border border-[#b1f2ff] rounded-xl outline-none">
                    <option value="government">Government</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  Town / Location
                </label>
                <input type="text" required placeholder="e.g. Panadura Town" value={newHospLocation} onChange={e => setNewHospLocation(e.target.value)} className="w-full px-3 py-2 text-xs border border-[#b1f2ff] rounded-xl outline-none"/>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B25] mb-1">
                  Hospital Phone
                </label>
                <input type="tel" placeholder="+94 38 223 2261" value={newHospPhone} onChange={e => setNewHospPhone(e.target.value)} className="w-full px-3 py-2 text-xs border border-[#b1f2ff] rounded-xl outline-none font-mono"/>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button type="button" onClick={() => setHospModalOpen(false)} className="px-4 py-2 text-xs text-[#64746D] hover:text-[#172B25]">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 text-xs font-semibold bg-[#3dcfff] text-white rounded-xl hover:bg-[#1eb5df]">
                  Add Hospital
                </button>
              </div>
            </form>
          </div>
        </div>)}
    </div>);
};
