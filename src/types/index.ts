export type Specialty =
  | 'Cardiology'
  | 'Dermatology'
  | 'Neurology'
  | 'Pediatrics'
  | 'Orthopedics'
  | 'General Practice'
  | 'Psychiatry'
  | 'Ophthalmology'
  | 'Gynecology'
  | 'Dentistry'
  | 'Endocrinology'
  | 'Gastroenterology';

export interface Clinic {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  image?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Shift {
  start: string; // "09:00"
  end: string;   // "13:00"
}

export interface ScheduleConfig {
  workingDays: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday (e.g., [1, 2, 3, 4, 5])
  shifts: Shift[]; // e.g. [{ start: '09:00', end: '13:00' }, { start: '15:00', end: '18:00' }]
  lunchBreak: {
    start: string; // "13:00"
    end: string;   // "15:00"
  };
  slotDurationMinutes: number; // 30
  unavailableDates: string[]; // ['2026-09-01', ...]
  timezone: string; // "America/New_York", etc.
}

export interface DoctorReview {
  id: string;
  doctorId?: string;
  author: string;
  title?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPatient: boolean;
  waitDurationMinutes?: number;
}

export type SortOption =
  | 'recommended'
  | 'rating-desc'
  | 'experience-desc'
  | 'fee-asc'
  | 'fee-desc'
  | 'name-asc'
  | 'availability-asc';

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: Specialty;
  avatar: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  consultationFee: number;
  about: string;
  education: string[];
  qualifications: string[];
  languages: string[];
  clinic: Clinic;
  scheduleConfig: ScheduleConfig;
  verified: boolean;
  hospitalAffiliation: string;
  acceptingNewPatients: boolean;
  telehealthAvailable?: boolean;
  featured?: boolean;
}

export interface TimeSlot {
  id: string;
  doctorId: string;
  dateStr: string; // "YYYY-MM-DD"
  startTime: string; // "09:00"
  endTime: string; // "09:30"
  isBooked: boolean;
  isPast: boolean;
  isAvailable: boolean;
  timezone: string;
}

export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';

export interface PatientDetails {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: Gender;
  reasonForVisit: string;
  additionalNotes?: string;
  insuranceProvider?: string;
  insuranceMemberId?: string;
  insuranceGroupNumber?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianRelationship?: string;
  isFirstTime?: boolean;
}

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled' | 'rescheduled';

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: Specialty;
  doctorAvatar: string;
  clinic: Clinic;
  dateStr: string; // "YYYY-MM-DD"
  startTime: string; // "09:30"
  endTime: string; // "10:00"
  timezone: string;
  patientDetails: PatientDetails;
  visitType?: 'in_person' | 'telehealth';
  consultationFee: number;
  discountAmount?: number;
  promoCode?: string;
  paymentMethod?: 'clinic' | 'card' | 'hsa' | 'insurance';
  paymentStatus?: 'paid' | 'pay_at_clinic' | 'pending';
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
  cancelReason?: string;
  rescheduleHistory?: {
    previousDate: string;
    previousTime: string;
    rescheduledAt: string;
  }[];
}

export interface Medicine {
  name: string;
  dosage: string; // "500mg"
  frequency: string; // "Twice daily with meals"
  duration: string; // "7 days"
  instructions: string; // "Take after breakfast and dinner"
}

export interface Prescription {
  id: string;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: Specialty;
  doctorAvatar: string;
  clinicName: string;
  clinicAddress: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  date: string;
  diagnosis: string;
  medicines: Medicine[];
  generalAdvice: string;
  followUpDate?: string;
}

export interface WaitlistEntry {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: Specialty;
  patientName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTimeSlot?: 'morning' | 'afternoon' | 'evening' | 'any';
  createdAt: string;
  status: 'pending' | 'notified';
}

export interface SearchFilters {
  query: string;
  specialty: string;
  location: string;
  availabilityDate?: string;
  minFee: number;
  maxFee: number;
  minRating: number;
  minExperience: number;
  telehealthOnly?: boolean;
  acceptingNewPatientsOnly?: boolean;
  availableTodayOnly?: boolean;
  sortBy: SortOption;
}

export type AppRoute =
  | { path: '/' }
  | { path: '/search'; query?: Partial<SearchFilters> }
  | { path: '/doctors/:id'; id: string }
  | { path: '/book'; id?: string; preselectedDate?: string }
  | { path: '/book/:id'; id: string; preselectedDate?: string }
  | { path: '/appointments'; tab?: 'upcoming' | 'past' | 'cancelled' }
  | { path: '/dashboard/appointments'; tab?: 'upcoming' | 'past' | 'cancelled' }
  | { path: '/prescriptions' }
  | { path: '/dashboard/prescriptions' }
  | { path: '/telehealth'; appointmentId?: string }
  | { path: '/emergency' }
  | { path: '/health-records' }
  | { path: '/lab-tests' }
  | { path: '/chamber-tracker'; appointmentId?: string }
  | { path: '/family-profiles' }
  | { path: '/insurance' }
  | { path: '/component-guide' };
