import React, { useState, useRef, useEffect } from 'react';
import { Hospital } from '../../types';
import { useData } from '../../context/DataContext';
import { apiRequest } from '../../lib/api';
import { Search, MapPin, Building2, X } from 'lucide-react';

interface HospitalAutocompleteProps {
  value: string; // hospitalId or ''
  onChange: (hospitalId: string) => void;
  placeholder?: string;
  className?: string;
}

export const HospitalAutocomplete: React.FC<HospitalAutocompleteProps> = ({
  value,
  onChange,
  placeholder = 'Search by hospital name or district...',
  className = ''
}) => {
  const { hospitals } = useData();
  const [apiHospitals, setApiHospitals] = useState<Hospital[] | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedHospital = hospitals.find(h => h.id === value);

  useEffect(() => {
    if (selectedHospital) {
      setQuery(selectedHospital.name);
    } else {
      setQuery('');
    }
  }, [value, selectedHospital]);

  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setApiHospitals(null);
      return;
    }
    const controller = new AbortController();
    apiRequest<{ hospitals: Hospital[] }>(`/hospitals/search?query=${encodeURIComponent(term)}`, { signal: controller.signal })
      .then(result => setApiHospitals(result.hospitals))
      .catch(error => {
        if (error.name !== 'AbortError') setApiHospitals(null);
      });
    return () => controller.abort();
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const localFilteredHospitals = query.trim()
    ? hospitals.filter(
        h =>
          h.name.toLowerCase().includes(query.toLowerCase()) ||
          h.district.toLowerCase().includes(query.toLowerCase()) ||
          h.location.toLowerCase().includes(query.toLowerCase())
      )
    : hospitals;
  const filteredHospitals = apiHospitals ?? localFilteredHospitals;

  const handleSelect = (hospitalId: string) => {
    onChange(hospitalId);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setQuery('');
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-[#64746D] pointer-events-none">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (!e.target.value) {
              onChange('');
            }
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-[#b1f2ff] rounded-xl text-[#172B25] placeholder:text-[#64746D] focus:border-[#3dcfff] focus:ring-1 focus:ring-[#3dcfff] outline-none transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 text-[#64746D] hover:text-[#172B25] rounded-md transition-colors"
            title="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 max-h-72 overflow-y-auto bg-white border border-[#b1f2ff] rounded-xl shadow-lg divide-y divide-[#b1f2ff]">
          <div className="p-2 text-xs font-semibold text-[#64746D] bg-[#d8f9ff] flex items-center justify-between">
            <span>Sri Lankan Hospitals ({filteredHospitals.length})</span>
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="text-[#3dcfff] hover:underline"
              >
                Clear Selection
              </button>
            )}
          </div>
          {filteredHospitals.length === 0 ? (
            <div className="p-4 text-center text-sm text-[#64746D]">
              No hospitals found matching &quot;{query}&quot;. Try searching by district (e.g., Colombo, Kandy, Galle).
            </div>
          ) : (
            filteredHospitals.map(h => (
              <button
                key={h.id}
                type="button"
                onClick={() => handleSelect(h.id)}
                className={`w-full text-left p-3 hover:bg-[#d8f9ff] transition-colors flex items-start gap-2.5 ${
                  h.id === value ? 'bg-cyan-50/70 border-l-4 border-[#3dcfff]' : ''
                }`}
              >
                <div className="mt-0.5 p-1.5 bg-[#d8f9ff] text-[#3dcfff] rounded-lg shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-[#172B25] truncate">
                    {h.name}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-[#64746D]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#3dcfff]" />
                      {h.district}
                    </span>
                    <span>·</span>
                    <span className="truncate">{h.location}</span>
                    <span>·</span>
                    <span className={h.hospitalType === 'government' ? 'text-[#3dcfff] font-medium' : 'text-slate-600'}>
                      {h.hospitalType === 'government' ? 'Government' : 'Private'}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
