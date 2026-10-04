import React, { createContext, useContext, useState, useEffect } from 'react';
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

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hospitals, setHospitals] = useState<Hospital[]>(() => {
    const saved = localStorage.getItem('hl_hospitals');
    return saved ? JSON.parse(saved) : INITIAL_HOSPITALS;
  });

  const [caregivers, setCaregivers] = useState<CaregiverProfile[]>(() => {
    const saved = localStorage.getItem('hl_caregivers');
    return saved ? JSON.parse(saved) : INITIAL_CAREGIVERS;
  });

  const [agencies, setAgencies] = useState<AgencyProfile[]>(() => {
    const saved = localStorage.getItem('hl_agencies');
    return saved ? JSON.parse(saved) : INITIAL_AGENCIES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('hl_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [availability, setAvailability] = useState<AvailabilitySlot[]>(() => {
    const saved = localStorage.getItem('hl_availability');
    return saved ? JSON.parse(saved) : INITIAL_AVAILABILITY;
  });

  const [inquiries, setInquiries] = useState<CaregiverInquiry[]>(() => {
    const saved = localStorage.getItem('hl_inquiries');
    return saved ? JSON.parse(saved) : [
      {
        id: 'inq-1',
        caregiverId: 'cg-nadeesha',
        familyName: 'Jayawardena Family',
        phone: '+94 77 123 4567',
        hospitalName: 'National Hospital of Sri Lanka',
        shiftNeeded: 'Full Day Care',
        startDate: '2026-10-06',
        message: 'Looking for attentive care for elderly mother post hip replacement surgery in Ward 14.',
        contactMethodUsed: 'whatsapp',
        createdAt: '2026-10-02T11:30:00Z'
      },
      {
        id: 'inq-2',
        caregiverId: 'cg-kumar',
        familyName: 'Peris Family',
        phone: '+94 71 998 7654',
        hospitalName: 'Colombo South Teaching Hospital (Kalubowila)',
        shiftNeeded: 'Full Day Care',
        startDate: '2026-10-08',
        message: 'Need strong patient attendant for stroke recovery mobility support.',
        contactMethodUsed: 'phone',
        createdAt: '2026-10-01T15:20:00Z'
      }
    ];
  });

  // Sync with Express Backend server when online
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const [hospRes, cgRes, revRes] = await Promise.all([
          fetch('http://localhost:5000/api/hospitals'),
          fetch('http://localhost:5000/api/search'),
          fetch('http://localhost:5000/api/caregivers/cg-nadeesha/reviews')
        ]);

        if (hospRes.ok) {
          const hospData = await hospRes.json();
          if (hospData.hospitals && hospData.hospitals.length > 0) {
            setHospitals(hospData.hospitals);
          }
        }

        if (cgRes.ok) {
          const cgData = await cgRes.json();
          if (cgData.results && cgData.results.length > 0) {
            // Map snake_case backend fields to camelCase frontend models
            const mappedCaregivers: CaregiverProfile[] = cgData.results.map((c: any) => ({
              id: c.id,
              userId: c.user_id,
              fullName: c.full_name,
              age: c.age,
              gender: c.gender || 'Female',
              bio: c.bio,
              primaryHospitalId: c.primary_hospital_id,
              secondaryHospitalIds: c.secondary_hospitals || [],
              pricePerHour: c.price_per_hour,
              pricePerDay: c.price_per_day,
              pricePerShift: c.price_per_shift,
              availabilityType: c.availability_type,
              experienceYears: c.experience_years,
              qualifications: c.qualifications ? [c.qualifications] : [],
              specializations: c.specializations || ['General Ward Care'],
              languages: ['Sinhala', 'English'],
              contactPhone: c.contact_phone,
              contactEmail: c.contact_email,
              contactWhatsapp: c.contact_whatsapp,
              phoneNumber: c.phone_number,
              whatsappNumber: c.whatsapp_number,
              email: c.email,
              profileImageUrl: c.profile_image_url,
              isActive: c.is_active,
              isVerified: c.is_verified,
              rating: c.rating,
              reviewCount: c.review_count,
              createdAt: c.created_at
            }));
            setCaregivers(mappedCaregivers);
          }
        }
      } catch {
        // Express backend offline; fallback to initial / localStorage state
      }
    };

    fetchBackendData();
  }, []);

  // Save changes to localStorage as secondary backup
  useEffect(() => {
    localStorage.setItem('hl_hospitals', JSON.stringify(hospitals));
  }, [hospitals]);

  useEffect(() => {
    localStorage.setItem('hl_caregivers', JSON.stringify(caregivers));
  }, [caregivers]);

  useEffect(() => {
    localStorage.setItem('hl_agencies', JSON.stringify(agencies));
  }, [agencies]);

  useEffect(() => {
    localStorage.setItem('hl_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('hl_availability', JSON.stringify(availability));
  }, [availability]);

  useEffect(() => {
    localStorage.setItem('hl_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  const getHospitalById = (id: string) => hospitals.find(h => h.id === id);

  const addHospital = (newHosp: Omit<Hospital, 'id'>) => {
    const created: Hospital = {
      ...newHosp,
      id: `hosp-${Date.now()}`
    };
    setHospitals(prev => [created, ...prev]);
    return created;
  };

  const getCaregiverById = (id: string) => caregivers.find(c => c.id === id);

  const updateCaregiverProfile = (id: string, updates: Partial<CaregiverProfile>) => {
    setCaregivers(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const toggleCaregiverVerification = (id: string) => {
    setCaregivers(prev =>
      prev.map(c => (c.id === id ? { ...c, isVerified: !c.isVerified } : c))
    );
  };

  const getAgencyById = (id: string) => agencies.find(a => a.id === id);

  const updateAgencyProfile = (id: string, updates: Partial<AgencyProfile>) => {
    setAgencies(prev =>
      prev.map(a => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const addAgencyStaff = (agencyId: string, staffData: { staffName: string; staffAge: number; gender: 'Female' | 'Male'; specialization: string; experienceYears: number }) => {
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
    slots.forEach(slot => {
      updateSlotAvailability(caregiverId, slot.date, slot.isAvailable, slot.timeSlot);
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
