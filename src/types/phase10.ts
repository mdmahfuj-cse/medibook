export interface LabTest {
  id: string;
  code: string;
  name: string;
  category: 'Hematology' | 'Biochemistry' | 'Radiology & Imaging' | 'Endocrinology' | 'Microbiology' | 'Cardiac Diagnostics' | 'Health Packages';
  description: string;
  price: number;
  discountedPrice?: number;
  sampleType: 'Blood' | 'Urine' | 'Stool' | 'Swab' | 'Imaging/Scan' | 'ECG';
  fastingRequired: boolean;
  fastingHours?: number;
  reportTurnaroundHours: number; // e.g. 12, 24, 48 hours
  homeCollectionAvailable: boolean;
  popular?: boolean;
  prerequisites: string[];
  parametersIncludedCount: number;
}

export interface LabPackage {
  id: string;
  name: string;
  tagline: string;
  description: string;
  testsIncluded: string[];
  totalTestsCount: number;
  price: number;
  originalPrice: number;
  genderTarget: 'All' | 'Men' | 'Women' | 'Senior Citizens';
  badge?: string;
  sampleType: string;
  fastingRequired: boolean;
  fastingHours: number;
}

export interface DiagnosticCenter {
  id: string;
  name: string;
  branch: string;
  city: string;
  address: string;
  rating: number;
  reviewsCount: number;
  accredited: string[]; // e.g. ["ISO 15189", "CAP Accredited", "DGHS Approved"]
  homeCollectionDiscountPercent: number;
  phone: string;
}

export interface LabOrder {
  id: string;
  orderNumber: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  tests: LabTest[];
  packages: LabPackage[];
  diagnosticCenter: DiagnosticCenter;
  collectionType: 'home_collection' | 'center_walkin';
  scheduledDate: string;
  scheduledTimeSlot: string;
  address?: {
    street: string;
    area: string;
    city: string;
    landmark?: string;
  };
  totalAmount: number;
  discountAmount: number;
  homeCollectionFee: number;
  netPayable: number;
  paymentMethod: 'bkash' | 'nagad' | 'card' | 'cash_on_collection';
  paymentStatus: 'paid' | 'pending';
  status: 'confirmed' | 'phlebotomist_assigned' | 'sample_collected' | 'processing_at_lab' | 'report_ready';
  phlebotomist?: {
    name: string;
    phone: string;
    vaccinationStatus: string;
    photoUrl: string;
    temperatureChecked: string;
  };
  reportUrl?: string;
  createdAt: string;
}

// Chamber / Clinic OPD Queue Token
export interface ChamberQueue {
  appointmentId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatarUrl: string;
  chamberName: string;
  chamberRoom: string;
  chamberAddress: string;
  appointmentDate: string;
  shift: 'Morning' | 'Evening';
  doctorStatus: 'in_chamber' | 'delayed_15m' | 'on_break' | 'arriving_soon';
  currentServingSerial: number;
  patientSerial: number;
  totalSerialsBooked: number;
  avgMinutesPerPatient: number;
  gatePassToken: string;
  emergencyCasesAhead: number;
  lastUpdated: string;
}

// Family Members Profile
export interface FamilyMemberProfile {
  id: string;
  fullName: string;
  relationship: 'Self' | 'Spouse' | 'Father' | 'Mother' | 'Son' | 'Daughter' | 'Sibling' | 'Other';
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  age: number;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
  phone?: string;
  emergencyContact?: string;
  nationalIdOrBirthCert?: string;
  allergies: string[];
  chronicConditions: string[];
  avatarBgColor: string;
  avatarIcon: string;
  activePrescriptionsCount: number;
  upcomingAppointmentsCount: number;
}

// Health Insurance & Takaful
export interface InsurancePolicy {
  id: string;
  providerName: string;
  policyNumber: string;
  policyHolderName: string;
  planName: string;
  planType: 'Comprehensive Health' | 'Corporate Group Health' | 'Family Takaful' | 'Critical Illness Cover';
  annualLimit: number;
  usedAmount: number;
  remainingAmount: number;
  opdLimit: number;
  opdRemaining: number;
  validUntil: string;
  coPayPercentage: number;
  tpaHelpline: string;
  coveredMembers: string[];
  networkHospitalsCount: number;
}

export interface InsuranceClaim {
  id: string;
  claimNumber: string;
  policyId: string;
  providerName: string;
  patientName: string;
  claimType: 'OPD_Consultation' | 'Diagnostic_Tests' | 'IPD_Hospitalization' | 'Pharmacy_Bill';
  treatmentDate: string;
  hospitalOrClinicName: string;
  doctorName: string;
  claimedAmount: number;
  approvedAmount?: number;
  status: 'submitted' | 'under_audit' | 'approved' | 'disbursed' | 'rejected';
  reimbursementMethod: 'bKash' | 'Bank_Transfer' | 'Direct_Settlement';
  reimbursementAccount: string;
  documentsCount: number;
  submittedAt: string;
  auditNotes?: string;
}
