import React, { useState } from 'react';
import { CaregiverProfile, AgencyProfile } from '../../types';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, MessageCircle, Phone, Mail, CheckCircle2, ShieldAlert } from 'lucide-react';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: CaregiverProfile | AgencyProfile;
  targetType: 'caregiver' | 'agency';
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  target,
  targetType
}) => {
  const { recordInquiry } = useData();
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [familyName, setFamilyName] = useState('');
  const [phone, setPhone] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [shiftNeeded, setShiftNeeded] = useState('whole_day');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const isCaregiver = targetType === 'caregiver';
  const targetName = isCaregiver
    ? (target as CaregiverProfile).fullName
    : (target as AgencyProfile).agencyName;

  const rawPhone = isCaregiver
    ? (target as CaregiverProfile).phoneNumber
    : (target as AgencyProfile).contactPhone;

  const rawWhatsapp = isCaregiver
    ? (target as CaregiverProfile).whatsappNumber
    : (target as AgencyProfile).contactWhatsapp;

  const rawEmail = isCaregiver
    ? (target as CaregiverProfile).email
    : (target as AgencyProfile).contactEmail;

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyName || !phone) return;

    if (currentUser?.userType === 'family') recordInquiry({
      caregiverId: isCaregiver ? target.id : undefined,
      agencyId: !isCaregiver ? target.id : undefined,
      familyName,
      phone,
      hospitalName: hospitalName || 'Sri Lankan Hospital',
      shiftNeeded: t(shiftNeeded),
      startDate: new Date().toISOString().split('T')[0],
      message,
      contactMethodUsed: 'whatsapp'
    });

    const cleanPhone = rawWhatsapp.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello ${targetName},\n\nMy name is ${familyName} (${phone}). I found your profile on HireLanka Care for care at ${
        hospitalName || 'hospital'
      }.\n\nRequired Shift: ${t(shiftNeeded)}\nDetails: ${message || 'Please let me know if you are available.'}`
    );

    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  const handleDirectCall = () => {
    if (currentUser?.userType === 'family') recordInquiry({
      caregiverId: isCaregiver ? target.id : undefined,
      agencyId: !isCaregiver ? target.id : undefined,
      familyName: familyName || 'Phone Caller',
      phone: phone || 'Direct Phone Call',
      hospitalName: hospitalName || 'Sri Lankan Hospital',
      shiftNeeded: t(shiftNeeded),
      startDate: new Date().toISOString().split('T')[0],
      contactMethodUsed: 'phone'
    });
    window.location.href = `tel:${rawPhone.replace(/\s+/g, '')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#b1f2ff] shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-cyan-100 text-[#3dcfff] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#172B25]">{t('contactCaregiverDirectly')}</h3>
            <p className="text-sm text-[#64746D] mt-2 max-w-sm mx-auto">
              We opened WhatsApp with your message for <strong className="text-[#172B25]">{targetName}</strong>. You can discuss shift terms, exact hospital ward, and rates directly.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold bg-[#3dcfff] text-white rounded-xl hover:bg-[#1eb5df] transition-colors cursor-pointer"
              >
                {t('closeBtn')}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-[#172B25]">
                {t('contactCaregiverDirectly')}: {targetName}
              </h3>
              <p className="text-xs text-[#64746D] mt-1">
                {t('directHiringNotice')}
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                onClick={handleDirectCall}
                className="p-3 bg-[#d8f9ff] hover:bg-cyan-50/60 border border-[#b1f2ff] rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer text-left"
              >
                <div className="p-2 bg-cyan-100 text-[#3dcfff] rounded-lg">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#172B25]">{t('directCall')}</div>
                  <div className="text-xs text-[#3dcfff] font-mono tabular-nums">{rawPhone}</div>
                </div>
              </button>

              <a
                href={`mailto:${rawEmail}`}
                className="p-3 bg-[#d8f9ff] hover:bg-cyan-50/60 border border-[#b1f2ff] rounded-xl flex items-center gap-2.5 transition-colors text-left"
              >
                <div className="p-2 bg-cyan-100 text-[#3dcfff] rounded-lg">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#172B25]">Email</div>
                  <div className="text-xs text-[#64746D] truncate">{rawEmail}</div>
                </div>
              </a>
            </div>

            {/* WhatsApp Form */}
            <form onSubmit={handleSendWhatsApp} className="space-y-3.5">
              <div className="text-xs font-bold text-[#172B25] uppercase tracking-wider">
                {t('chatOnWhatsApp')}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#172B25] mb-1">
                  {t('patientName')} / Family Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ravi Jayawardena"
                  value={familyName}
                  onChange={e => setFamilyName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#b1f2ff] rounded-xl bg-[#d8f9ff] focus:bg-white focus:border-[#3dcfff] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#172B25] mb-1">
                  {t('mobileNumberLabel')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+94 77 123 4567"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#b1f2ff] rounded-xl bg-[#d8f9ff] focus:bg-white focus:border-[#3dcfff] outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#172B25] mb-1">
                    {t('hospitalNameLabel')}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NHSL Colombo Ward 14"
                    value={hospitalName}
                    onChange={e => setHospitalName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#b1f2ff] rounded-xl bg-[#d8f9ff] focus:bg-white focus:border-[#3dcfff] outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#172B25] mb-1">
                    {t('shiftNeeded')}
                  </label>
                  <select
                    value={shiftNeeded}
                    onChange={e => setShiftNeeded(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#b1f2ff] rounded-xl bg-[#d8f9ff] focus:bg-white focus:border-[#3dcfff] outline-none transition-colors"
                  >
                    <option value="whole_day">{t('whole_day')}</option>
                    <option value="nights">{t('nights')}</option>
                    <option value="half_day_morning">{t('half_day_morning')}</option>
                    <option value="half_day_afternoon">{t('half_day_afternoon')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#172B25] mb-1">
                  {t('notesOrCondition')}
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Elderly father recovering from surgery, needs help standing and bathing..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#b1f2ff] rounded-xl bg-[#d8f9ff] focus:bg-white focus:border-[#3dcfff] outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#27865C] hover:bg-[#1f6d4a] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('openWhatsAppChat')}</span>
              </button>
            </form>

            {/* Disclaimer */}
            <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                {t('disclaimer')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
