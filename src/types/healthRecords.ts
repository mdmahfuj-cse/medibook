export interface VitalReading {
  id: string;
  type: 'bp' | 'glucose' | 'heart_rate' | 'spo2' | 'temperature' | 'weight';
  value: string; // e.g. "120/80", "6.2", "72", "98%", "36.8", "72"
  numericValue?: number;
  unit: string; // "mmHg", "mmol/L", "bpm", "%", "°C", "kg"
  status: 'normal' | 'warning' | 'critical' | 'optimal';
  notes?: string;
  recordedAt: string; // ISO date string
}

export type DocumentCategory =
  | 'lab_report'
  | 'discharge_summary'
  | 'vaccination'
  | 'radiology'
  | 'prescription_scanned';

export interface MedicalDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  hospitalOrClinic: string;
  doctorName?: string;
  date: string;
  fileSize: string;
  fileType: 'pdf' | 'jpg' | 'png';
  downloadUrl?: string;
  notes?: string;
  tags: string[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string; // e.g. "Spouse", "Brother", "Parent"
  phone: string;
  altPhone?: string;
  isPrimary: boolean;
}

export interface MedicalIDProfile {
  fullName: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  nationalIdNumber?: string;
  heightCm: number;
  weightKg: number;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  primaryHospital: string;
  primaryPhysician: string;
  organDonor: boolean;
  emergencyContacts: EmergencyContact[];
}

export type AmbulanceType =
  | 'basic_ac'
  | 'icu_life_support'
  | 'freezer'
  | 'air_heli';

export interface AmbulanceBooking {
  id: string;
  ambulanceType: AmbulanceType;
  pickupAddress: string;
  dropoffHospital: string;
  patientCondition: string;
  contactPhone: string;
  fare: number;
  status: 'searching' | 'dispatched' | 'en_route' | 'arrived' | 'completed';
  driverName: string;
  driverPhone: string;
  vehicleNo: string;
  etaMinutes: number;
  bookedAt: string;
}

export interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
  location: string;
  district: string;
  phone: string;
  lastDonationDate: string;
  totalDonations: number;
  isAvailable: boolean;
  verified: boolean;
}

export interface HospitalICUStatus {
  id: string;
  hospitalName: string;
  address: string;
  area: string;
  district: string;
  emergencyLine: string;
  totalIcuBeds: number;
  availableIcuBeds: number;
  totalCcuBeds: number;
  availableCcuBeds: number;
  nicuAvailable: number;
  lastUpdated: string;
  hasOxygenSupport: boolean;
}
