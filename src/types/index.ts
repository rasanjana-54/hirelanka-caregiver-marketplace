export type UserType = 'family' | 'individual' | 'agency' | 'admin';

export type AvailabilityType = 'whole_day' | 'half_day_morning' | 'half_day_afternoon' | 'nights';

export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  userType: UserType;
  fullName: string;
  isVerified: boolean;
  createdAt: string;
  avatarUrl?: string;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  district: string;
  latitude: number;
  longitude: number;
  hospitalType: 'government' | 'private';
  phone?: string;
}

export interface CaregiverProfile {
  id: string;
  userId: string;
  fullName: string;
  age: number;
  gender: 'Female' | 'Male';
  bio: string;
  primaryHospitalId: string;
  secondaryHospitalIds: string[];
  pricePerHour: number;
  pricePerDay: number;
  pricePerShift: number;
  availabilityType: AvailabilityType;
  experienceYears: number;
  qualifications: string[];
  specializations: string[];
  languages: string[];
  contactPhone: boolean;
  contactEmail: boolean;
  contactWhatsapp: boolean;
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  profileImageUrl: string;
  isActive: boolean;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  policeReportVerified?: boolean;
  idCardVerified?: boolean;
  medicalTrainingVerified?: boolean;
}

export interface AgencyStaff {
  id: string;
  agencyId: string;
  staffName: string;
  staffAge: number;
  gender: 'Female' | 'Male';
  specialization: string;
  experienceYears: number;
  contactInfo?: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
  isVisible: boolean;
  createdAt: string;
}

export interface AgencyProfile {
  id: string;
  userId: string;
  agencyName: string;
  registrationNumber: string;
  description: string;
  numCaregivers: number;
  primaryHospitalId: string;
  secondaryHospitalIds: string[];
  priceRangeMin: number;
  priceRangeMax: number;
  contactPhone: string;
  contactEmail: string;
  contactWhatsapp: string;
  showStaffProfiles: boolean;
  logoUrl: string;
  isActive: boolean;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  services: string[];
  staff: AgencyStaff[];
  createdAt: string;
}

export interface AvailabilitySlot {
  id: string;
  caregiverId: string;
  date: string; // YYYY-MM-DD
  isAvailable: boolean;
  timeSlot: 'whole_day' | 'morning' | 'afternoon' | 'night';
  notes?: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  revieweeId: string;
  revieweeType: 'individual' | 'agency';
  rating: number;
  title: string;
  comment: string;
  hospitalName?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface CaregiverInquiry {
  id: string;
  caregiverId?: string;
  agencyId?: string;
  familyName: string;
  patientName?: string;
  phone: string;
  hospitalName: string;
  shiftNeeded: string;
  startDate: string;
  message?: string;
  contactMethodUsed: 'whatsapp' | 'phone' | 'email';
  createdAt: string;
}
