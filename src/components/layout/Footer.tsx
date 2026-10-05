import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, PhoneCall, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-[#b1f2ff] mt-16 text-[#64746D]">
      {/* Emergency Notice Banner */}
      <div className="bg-[#3dcfff]/5 border-b border-[#b1f2ff] py-3 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs text-[#172B25] flex-wrap">
          <PhoneCall className="w-3.5 h-3.5 text-[#3dcfff]" />
          <span className="font-semibold">{t('medicalEmergencySL')}</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">{t('nhslHotline')}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#3dcfff] text-white flex items-center justify-center">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-[#172B25]">HireLanka Care</span>
            </div>
            <p className="text-xs leading-relaxed text-[#64746D] mb-4">
              {t('footerDesc')}
            </p>
            <div className="text-xs text-[#172B25] font-medium">
              Colombo · Kandy · Galle · Gampaha · Jaffna · Kurunegala
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-[#172B25] uppercase tracking-wider mb-3">
              {t('explore')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/caregivers" className="hover:text-[#3dcfff] transition-colors">
                  {t('findCaregivers')}
                </Link>
              </li>
              <li>
                <Link to="/agencies" className="hover:text-[#3dcfff] transition-colors">
                  {t('agenciesDirectory')}
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-[#3dcfff] transition-colors">
                  {t('howItWorks')}
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#3dcfff] transition-colors">
                  {t('caregiverOption')}
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#3dcfff] transition-colors">
                  {t('agencyOption')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Sri Lankan Hospitals */}
          <div>
            <h4 className="text-xs font-bold text-[#172B25] uppercase tracking-wider mb-3">
              {t('popularHospitals')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/caregivers?hospital=hosp-nhsl" className="hover:text-[#3dcfff] transition-colors">
                  National Hospital of Sri Lanka (NHSL)
                </Link>
              </li>
              <li>
                <Link to="/caregivers?hospital=hosp-kalubowila" className="hover:text-[#3dcfff] transition-colors">
                  Colombo South Hospital (Kalubowila)
                </Link>
              </li>
              <li>
                <Link to="/caregivers?hospital=hosp-ragama" className="hover:text-[#3dcfff] transition-colors">
                  Colombo North Hospital (Ragama)
                </Link>
              </li>
              <li>
                <Link to="/caregivers?hospital=hosp-kandy" className="hover:text-[#3dcfff] transition-colors">
                  Teaching Hospital Kandy
                </Link>
              </li>
              <li>
                <Link to="/caregivers?hospital=hosp-karapitiya" className="hover:text-[#3dcfff] transition-colors">
                  Teaching Hospital Karapitiya (Galle)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Transparency */}
          <div>
            <h4 className="text-xs font-bold text-[#172B25] uppercase tracking-wider mb-3">
              {t('trustTransparency')}
            </h4>
            <div className="bg-[#d8f9ff] p-3 rounded-xl border border-[#b1f2ff] text-xs leading-relaxed space-y-2">
              <div className="flex items-center gap-1.5 text-[#3dcfff] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>{t('zeroCommissionTitle')}</span>
              </div>
              <p className="text-[11px] text-[#64746D]">
                {t('zeroCommissionDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 border-t border-[#b1f2ff] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#64746D]">
          <p className="max-w-2xl text-[11px] leading-relaxed">
            {t('disclaimer')}
          </p>
          <div className="text-[11px] shrink-0 text-center md:text-right">
            {t('allRightsReserved')}
          </div>
        </div>
      </div>
    </footer>
  );
};
