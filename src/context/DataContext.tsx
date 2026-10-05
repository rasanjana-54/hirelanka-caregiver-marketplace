import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import { useAuth } from './AuthContext';
import {
  Hospital,
  CaregiverProfile,
  AgencyProfile,
  Review,
  AvailabilitySlot,
  CaregiverInquiry
} from '../types';
import {
  INITIAL_HOSPITALS,
  INITIAL_CAREGIVERS,
  INITIAL_AGENCIES,
  INITIAL_REVIEWS,
  INITIAL_AVAILABILITY
} from '../data/sriLankanData';

interface DataContextType {
  hospitals: Hospital[];
  caregivers: CaregiverProfile[];
  agencies: AgencyProfile[];
  reviews: Review[];
  availability: AvailabilitySlot[];
  inquiries: CaregiverInquiry[];
  
  // Hospital actions
  getHospitalById: (id: string) => Hospital | undefined;
  addHospital: (hospital: Omit<Hospital, 'id'>) => Hospital;
  
  // Caregiver actions
  getCaregiverById: (id: string) => CaregiverProfile | undefined;
  updateCaregiverProfile: (id: string, updates: Partial<CaregiverProfile>) => void;
  toggleCaregiverVerification: (id: string) => void;
  
  // Agency actions
  getAgencyById: (id: string) => AgencyProfile | undefined;
  updateAgencyProfile: (id: string, updates: Partial<AgencyProfile>) => void;
  addAgencyStaff: (agencyId: string, staff: { staffName: string; staffAge: number; gender: 'Female' | 'Male'; specialization: string; experienceYears: number }) => void;
  toggleStaffVisibility: (agencyId: string) => void;
  
  // Availability actions
  getCaregiverAvailability: (caregiverId: string) => AvailabilitySlot[];
  updateSlotAvailability: (caregiverId: string, date: string, isAvailable: boolean, timeSlot?: 'whole_day' | 'morning' | 'afternoon' | 'night', notes?: string) => void;
  bulkUpdateAvailability: (caregiverId: string, slots: { date: string; isAvailable: boolean; timeSlot: 'whole_day' | 'morning' | 'afternoon' | 'night' }[]) => void;
  
  // Reviews
  getReviewsForProfile: (profileId: string) => Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  
  // Inquiries
  recordInquiry: (inquiry: Omit<CaregiverInquiry, 'id' | 'createdAt'>) => void;
  getInquiriesForUser: (caregiverId?: string, agencyId?: string) => CaregiverInquiry[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const mapUpdatesToApi = (updates: Record<string, unknown>, fields: Record<string, string>) =>
  Object.fromEntries(Object.entries(updates).map(([key, value]) => [fields[key] || key, value]));

const normalizeHospitals = (items: Hospital[]): Hospital[] => items.map(hospital => ({
  ...hospital,
  latitude: Number(hospital.latitude),
  longitude: Number(hospital.longitude)
}));

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authToken, currentUser } = useAuth();
  const [hospitals, setHospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [caregivers, setCaregivers] = useState<CaregiverProfile[]>(INITIAL_CAREGIVERS);
  const [agencies, setAgencies] = useState<AgencyProfile[]>(INITIAL_AGENCIES);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(INITIAL_AVAILABILITY);
  const [inquiries, setInquiries] = useState<CaregiverInquiry[]>([]);

  useEffect(() => {
    let active = true;
    const loadMarketplaceData = async () => {
      try {
        const [hospitalData, caregiverData, agencyData] = await Promise.all([
          apiRequest<{ hospitals: Hospital[] }>('/hospitals'),
          apiRequest<{ results: CaregiverProfile[] }>('/search?limit=100'),
          apiRequest<{ agencies: AgencyProfile[] }>('/agencies')
        ]);
        if (!active) return;
        setHospitals(normalizeHospitals(hospitalData.hospitals));
        const loadedCaregivers = caregiverData.results.map(caregiver => ({
          ...caregiver,
          age: Number(caregiver.age),
          pricePerHour: Number(caregiver.pricePerHour),
          pricePerDay: Number(caregiver.pricePerDay),
          pricePerShift: Number(caregiver.pricePerShift),
          experienceYears: Number(caregiver.experienceYears),
          rating: Number(caregiver.rating),
          reviewCount: Number(caregiver.reviewCount)
        }));
        const loadedAgencies = agencyData.agencies.map(agency => ({
          ...agency,
          priceRangeMin: Number(agency.priceRangeMin),
          priceRangeMax: Number(agency.priceRangeMax),
          rating: Number(agency.rating),
          reviewCount: Number(agency.reviewCount),
          staff: agency.staff || []
        }));
        setCaregivers(loadedCaregivers);
        setAgencies(loadedAgencies);

        if (authToken && currentUser?.userType === 'individual') {
          try {
            const { caregiver } = await apiRequest<{ caregiver: CaregiverProfile }>('/caregivers/me');
            setCaregivers(prev => [...prev.filter(item => item.id !== caregiver.id), caregiver]);
          } catch {
            // This account may not have completed profile creation yet.
          }
        }
        if (authToken && currentUser?.userType === 'agency') {
          try {
            const { agency } = await apiRequest<{ agency: AgencyProfile }>('/agencies/me');
            setAgencies(prev => [...prev.filter(item => item.id !== agency.id), agency]);
          } catch {
            // This account may not have completed profile creation yet.
          }
        }

        const caregiverDetails = await Promise.all(loadedCaregivers.slice(0, 20).map(async caregiver => {
          const [reviewData, availabilityData] = await Promise.all([
            apiRequest<{ reviews: Review[] }>(`/caregivers/${caregiver.id}/reviews`),
            apiRequest<{ calendar_data: AvailabilitySlot[] }>(`/caregivers/${caregiver.id}/availability`)
          ]);
          return {
            reviews: reviewData.reviews.map(review => ({ ...review, revieweeId: caregiver.id })),
            availability: availabilityData.calendar_data
          };
        }));
        const agencyReviews = await Promise.all(loadedAgencies.slice(0, 20).map(async agency => {
          const response = await apiRequest<{ reviews: Review[] }>(`/agencies/${agency.id}/reviews`);
          return response.reviews.map(review => ({ ...review, revieweeId: agency.id }));
        }));
        if (!active) return;
        setReviews([...caregiverDetails.flatMap(detail => detail.reviews), ...agencyReviews.flat()]);
        setAvailability(caregiverDetails.flatMap(detail => detail.availability));

        if (authToken) {
          try {
            const inquiryData = await apiRequest<{ inquiries: CaregiverInquiry[] }>('/inquiries/me');
            if (active) setInquiries(inquiryData.inquiries);
          } catch {
            if (active) setInquiries([]);
          }
        }
      } catch {
        // Keep initial sample data visible if the API is not configured yet.
      }
    };

    void loadMarketplaceData();
    return () => { active = false; };
  }, [authToken, currentUser?.id]);

  const getHospitalById = (id: string) => hospitals.find(h => h.id === id);

  const addHospital = (newHosp: Omit<Hospital, 'id'>) => {
    const created: Hospital = {
      ...newHosp,
      id: `hosp-${Date.now()}`
    };
    setHospitals(prev => [created, ...prev]);
    void apiRequest<{ latitude: number; longitude: number }>('/hospitals/geocode', {
      method: 'POST',
      body: JSON.stringify({ address: `${created.name}, ${created.location}, ${created.district}, Sri Lanka` })
    }).then(coordinates => apiRequest<{ hospital: Hospital }>('/hospitals', {
      method: 'POST',
      body: JSON.stringify({
        name: created.name,
        location: created.location,
        district: created.district,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        hospital_type: created.hospitalType,
        phone: created.phone
      })
    })).then(({ hospital }) => {
      const normalized = normalizeHospitals([hospital])[0];
      setHospitals(prev => prev.map(item => item.id === created.id ? normalized : item));
    }).catch(error => {
      setHospitals(prev => prev.filter(item => item.id !== created.id));
      console.error('Hospital save failed:', error);
    });
    return created;
  };

  const getCaregiverById = (id: string) => caregivers.find(c => c.id === id);

  const updateCaregiverProfile = (id: string, updates: Partial<CaregiverProfile>) => {
    const apiFields = mapUpdatesToApi(updates, {
      userId: 'user_id', fullName: 'full_name', primaryHospitalId: 'primary_hospital_id',
      secondaryHospitalIds: 'secondary_hospitals', pricePerHour: 'price_per_hour',
      pricePerDay: 'price_per_day', pricePerShift: 'price_per_shift', availabilityType: 'availability_type',
      experienceYears: 'experience_years', contactPhone: 'contact_phone', contactEmail: 'contact_email',
      contactWhatsapp: 'contact_whatsapp', phoneNumber: 'phone_number', whatsappNumber: 'whatsapp_number',
      profileImageUrl: 'profile_image_url', isActive: 'is_active'
    });
    void apiRequest(`/caregivers/${id}`, { method: 'PUT', body: JSON.stringify(apiFields) })
      .catch(error => console.error('Caregiver profile save failed:', error));
    setCaregivers(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const toggleCaregiverVerification = (id: string) => {
    const caregiver = caregivers.find(item => item.id === id);
    if (caregiver) {
      void apiRequest(`/caregivers/${id}/verification`, {
        method: 'PATCH',
        body: JSON.stringify({ is_verified: !caregiver.isVerified })
      }).catch(error => console.error('Caregiver verification update failed:', error));
    }
    setCaregivers(prev =>
      prev.map(c => (c.id === id ? { ...c, isVerified: !c.isVerified } : c))
    );
  };

  const getAgencyById = (id: string) => agencies.find(a => a.id === id);

  const updateAgencyProfile = (id: string, updates: Partial<AgencyProfile>) => {
    const apiFields = mapUpdatesToApi(updates, {
      userId: 'user_id', agencyName: 'agency_name', registrationNumber: 'registration_number',
      numCaregivers: 'num_caregivers', primaryHospitalId: 'primary_hospital_id',
      secondaryHospitalIds: 'secondary_hospitals', priceRangeMin: 'price_range_min',
      priceRangeMax: 'price_range_max', contactPhone: 'contact_phone', contactEmail: 'contact_email',
      contactWhatsapp: 'contact_whatsapp', showStaffProfiles: 'show_staff_profiles', logoUrl: 'logo_url',
      isActive: 'is_active'
    });
    void apiRequest(`/agencies/${id}`, { method: 'PUT', body: JSON.stringify(apiFields) })
      .catch(error => console.error('Agency profile save failed:', error));
    setAgencies(prev =>
      prev.map(a => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const addAgencyStaff = (agencyId: string, staffData: { staffName: string; staffAge: number; gender: 'Female' | 'Male'; specialization: string; experienceYears: number }) => {
    void apiRequest(`/agencies/${agencyId}/staff`, {
      method: 'POST',
      body: JSON.stringify({
        staff_name: staffData.staffName,
        staff_age: staffData.staffAge,
        gender: staffData.gender,
        specialization: staffData.specialization,
        experience_years: staffData.experienceYears
      })
    }).catch(error => console.error('Agency staff save failed:', error));
    setAgencies(prev =>
      prev.map(a => {
        if (a.id === agencyId) {
          const newMember = {
            id: `staff-${Date.now()}`,
            agencyId,
            ...staffData,
            isVisible: true,
            createdAt: new Date().toISOString()
          };
          return {
            ...a,
            numCaregivers: (a.numCaregivers || 0) + 1,
            staff: [...(a.staff || []), newMember]
          };
        }
        return a;
      })
    );
  };

  const toggleStaffVisibility = (agencyId: string) => {
    const agency = agencies.find(item => item.id === agencyId);
    if (agency) {
      void apiRequest(`/agencies/${agencyId}`, {
        method: 'PUT',
        body: JSON.stringify({ show_staff_profiles: !agency.showStaffProfiles })
      }).catch(error => console.error('Agency staff visibility update failed:', error));
    }
    setAgencies(prev =>
      prev.map(a => (a.id === agencyId ? { ...a, showStaffProfiles: !a.showStaffProfiles } : a))
    );
  };

  const getCaregiverAvailability = (caregiverId: string) => {
    return availability.filter(a => a.caregiverId === caregiverId);
  };

  const updateSlotAvailability = (
    caregiverId: string,
    date: string,
    isAvailable: boolean,
    timeSlot: 'whole_day' | 'morning' | 'afternoon' | 'night' = 'whole_day',
    notes?: string
  ) => {
    void apiRequest(`/caregivers/${caregiverId}/availability/update`, {
      method: 'POST',
      body: JSON.stringify({ date, is_available: isAvailable, time_slot: timeSlot, notes })
    }).catch(error => console.error('Availability update failed:', error));
    setAvailability(prev => {
      const existingIndex = prev.findIndex(
        s => s.caregiverId === caregiverId && s.date === date
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          isAvailable,
          timeSlot,
          notes: notes !== undefined ? notes : updated[existingIndex].notes
        };
        return updated;
      } else {
        const newSlot: AvailabilitySlot = {
          id: `av-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          caregiverId,
          date,
          isAvailable,
          timeSlot,
          notes
        };
        return [...prev, newSlot];
      }
    });
  };

  const bulkUpdateAvailability = (
    caregiverId: string,
    slots: { date: string; isAvailable: boolean; timeSlot: 'whole_day' | 'morning' | 'afternoon' | 'night' }[]
  ) => {
    void apiRequest(`/caregivers/${caregiverId}/availability/bulk-update`, {
      method: 'PUT',
      body: JSON.stringify({ dates: slots.map(slot => ({
        date: slot.date,
        is_available: slot.isAvailable,
        time_slot: slot.timeSlot
      })) })
    }).catch(error => console.error('Bulk availability update failed:', error));
    setAvailability(prev => {
      const next = [...prev];
      for (const slot of slots) {
        const index = next.findIndex(item => item.caregiverId === caregiverId && item.date === slot.date);
        const updatedSlot = {
          id: index >= 0 ? next[index].id : `av-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          caregiverId,
          ...slot
        };
        if (index >= 0) next[index] = { ...next[index], ...updatedSlot };
        else next.push(updatedSlot);
      }
      return next;
    });
  };

  const getReviewsForProfile = (profileId: string) => {
    return reviews.filter(r => r.revieweeId === profileId);
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    void apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify({
        reviewee_id: reviewData.revieweeId,
        reviewee_type: reviewData.revieweeType,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        hospital_name: reviewData.hospitalName
      })
    }).catch(error => console.error('Review save failed:', error));
    setReviews(prev => [newRev, ...prev]);

    // Recalculate average rating on caregiver or agency
    if (reviewData.revieweeType === 'individual') {
      setCaregivers(prev =>
        prev.map(c => {
          if (c.id === reviewData.revieweeId) {
            const allCgReviews = [...reviews.filter(r => r.revieweeId === c.id), newRev];
            const sum = allCgReviews.reduce((acc, curr) => acc + curr.rating, 0);
            const avg = Number((sum / allCgReviews.length).toFixed(1));
            return {
              ...c,
              rating: avg,
              reviewCount: allCgReviews.length
            };
          }
          return c;
        })
      );
    } else {
      setAgencies(prev =>
        prev.map(a => {
          if (a.id === reviewData.revieweeId) {
            const allAgReviews = [...reviews.filter(r => r.revieweeId === a.id), newRev];
            const sum = allAgReviews.reduce((acc, curr) => acc + curr.rating, 0);
            const avg = Number((sum / allAgReviews.length).toFixed(1));
            return {
              ...a,
              rating: avg,
              reviewCount: allAgReviews.length
            };
          }
          return a;
        })
      );
    }
  };

  const recordInquiry = (inquiryData: Omit<CaregiverInquiry, 'id' | 'createdAt'>) => {
    const newInquiry: CaregiverInquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    void apiRequest('/inquiries', {
      method: 'POST',
      body: JSON.stringify({
        caregiver_id: inquiryData.caregiverId,
        agency_id: inquiryData.agencyId,
        family_name: inquiryData.familyName,
        patient_name: inquiryData.patientName,
        phone: inquiryData.phone,
        hospital_name: inquiryData.hospitalName,
        shift_needed: inquiryData.shiftNeeded,
        start_date: inquiryData.startDate,
        message: inquiryData.message,
        contact_method_used: inquiryData.contactMethodUsed
      })
    }).catch(error => console.error('Inquiry save failed:', error));
    setInquiries(prev => [newInquiry, ...prev]);
  };

  const getInquiriesForUser = (caregiverId?: string, agencyId?: string) => {
    return inquiries.filter(
      i =>
        (caregiverId && i.caregiverId === caregiverId) ||
        (agencyId && i.agencyId === agencyId)
    );
  };

  return (
    <DataContext.Provider
      value={{
        hospitals,
        caregivers,
        agencies,
        reviews,
        availability,
        inquiries,
        getHospitalById,
        addHospital,
        getCaregiverById,
        updateCaregiverProfile,
        toggleCaregiverVerification,
        getAgencyById,
        updateAgencyProfile,
        addAgencyStaff,
        toggleStaffVisibility,
        getCaregiverAvailability,
        updateSlotAvailability,
        bulkUpdateAvailability,
        getReviewsForProfile,
        addReview,
        recordInquiry,
        getInquiriesForUser
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
