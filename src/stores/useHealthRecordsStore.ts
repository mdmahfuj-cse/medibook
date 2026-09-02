import { create } from 'zustand';
import {
  VitalReading,
  MedicalDocument,
  MedicalIDProfile,
  EmergencyContact,
} from '../types/healthRecords';

interface HealthRecordsState {
  medicalProfile: MedicalIDProfile;
  vitals: VitalReading[];
  documents: MedicalDocument[];
  
  // Actions
  updateMedicalProfile: (updates: Partial<MedicalIDProfile>) => void;
  addVitalReading: (vital: Omit<VitalReading, 'id' | 'recordedAt'>) => void;
  deleteVitalReading: (id: string) => void;
  addDocument: (doc: Omit<MedicalDocument, 'id'>) => void;
  deleteDocument: (id: string) => void;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  removeEmergencyContact: (id: string) => void;
}

const INITIAL_PROFILE: MedicalIDProfile = {
  fullName: 'Tanvir Hossain',
  bloodGroup: 'B+',
  dateOfBirth: '1988-06-15',
  gender: 'Male',
  nationalIdNumber: '19882691234567890',
  heightCm: 175,
  weightKg: 74,
  allergies: ['Penicillin', 'Sulfa Drugs', 'Shrimp / Crustaceans'],
  chronicConditions: ['Primary Hypertension', 'Mild Dyslipidemia'],
  currentMedications: [
    'Tab. Losartan Potassium 50mg (Once Daily)',
    'Tab. Rosuvastatin 10mg (At Night)',
    'Tab. Montelukast 10mg (SOS)',
  ],
  primaryHospital: 'Square Hospital / Evercare Dhaka',
  primaryPhysician: 'Prof. Dr. M. A. Rashid (Cardiology)',
  organDonor: true,
  emergencyContacts: [
    {
      id: 'em-1',
      name: 'Nusrat Jahan (Spouse)',
      relationship: 'Spouse',
      phone: '01711-223344',
      altPhone: '01988-776655',
      isPrimary: true,
    },
    {
      id: 'em-2',
      name: 'Rafiqul Hossain (Brother)',
      relationship: 'Brother',
      phone: '01819-998877',
      isPrimary: false,
    },
  ],
};

const INITIAL_VITALS: VitalReading[] = [
  {
    id: 'vit-1',
    type: 'bp',
    value: '120/80',
    numericValue: 120,
    unit: 'mmHg',
    status: 'optimal',
    notes: 'Resting morning reading after 5 mins seated',
    recordedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'vit-2',
    type: 'bp',
    value: '135/88',
    numericValue: 135,
    unit: 'mmHg',
    status: 'warning',
    notes: 'Post-work evening check',
    recordedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'vit-3',
    type: 'glucose',
    value: '5.8',
    numericValue: 5.8,
    unit: 'mmol/L',
    status: 'normal',
    notes: 'Fasting Blood Sugar (FBS) morning test',
    recordedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'vit-4',
    type: 'glucose',
    value: '7.4',
    numericValue: 7.4,
    unit: 'mmol/L',
    status: 'normal',
    notes: '2 Hours Post Prandial (2ABF)',
    recordedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'vit-5',
    type: 'heart_rate',
    value: '72',
    numericValue: 72,
    unit: 'bpm',
    status: 'optimal',
    notes: 'Resting pulse rate',
    recordedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'vit-6',
    type: 'spo2',
    value: '99%',
    numericValue: 99,
    unit: '%',
    status: 'optimal',
    notes: 'Room air pulse oximeter',
    recordedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'vit-7',
    type: 'weight',
    value: '74.0',
    numericValue: 74.0,
    unit: 'kg',
    status: 'normal',
    notes: 'Morning digital scale (BMI: 24.2)',
    recordedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'vit-8',
    type: 'temperature',
    value: '36.6',
    numericValue: 36.6,
    unit: '°C',
    status: 'normal',
    notes: 'Oral digital thermometer',
    recordedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const INITIAL_DOCUMENTS: MedicalDocument[] = [
  {
    id: 'doc-1',
    title: 'Fasting Lipid Profile & HbA1c Lab Report',
    category: 'lab_report',
    hospitalOrClinic: 'Popular Diagnostic Centre (Dhanmondi)',
    doctorName: 'Prof. Dr. M. A. Rashid',
    date: '2026-08-25',
    fileSize: '1.8 MB',
    fileType: 'pdf',
    notes: 'HbA1c: 5.6% (Normal), Total Cholesterol: 185 mg/dL, HDL: 46 mg/dL',
    tags: ['Blood Test', 'Pathology', 'Lipid', 'HbA1c'],
  },
  {
    id: 'doc-2',
    title: '12-Lead Electrocardiogram (ECG) & 2D Echo Report',
    category: 'radiology',
    hospitalOrClinic: 'National Heart Foundation Hospital & Research Institute',
    doctorName: 'Prof. Dr. M. A. Rashid',
    date: '2026-08-20',
    fileSize: '3.4 MB',
    fileType: 'pdf',
    notes: 'Normal Sinus Rhythm, LVEF 65%, No regional wall motion abnormality.',
    tags: ['Cardiology', 'ECG', 'Echocardiogram'],
  },
  {
    id: 'doc-3',
    title: 'COVID-19 & Booster Immunization Certificate',
    category: 'vaccination',
    hospitalOrClinic: 'Directorate General of Health Services (Surokkha BD)',
    date: '2025-11-10',
    fileSize: '850 KB',
    fileType: 'pdf',
    notes: 'Pfizer-BioNTech Bivalent Booster dose completed. Verified QR code attached.',
    tags: ['Vaccine', 'DGHS', 'Surokkha'],
  },
  {
    id: 'doc-4',
    title: 'Chest X-Ray (PA View) Report',
    category: 'radiology',
    hospitalOrClinic: 'Square Hospital Diagnostic Wing',
    doctorName: 'Dr. Shahana Akhter',
    date: '2026-06-12',
    fileSize: '4.2 MB',
    fileType: 'pdf',
    notes: 'Bilateral lung fields clear. Costophrenic angles normal.',
    tags: ['X-Ray', 'Radiology', 'Chest'],
  },
  {
    id: 'doc-5',
    title: 'Hospital Discharge Summary (Post-Observation)',
    category: 'discharge_summary',
    hospitalOrClinic: 'Evercare Hospital Dhaka',
    doctorName: 'Dr. K. M. Saifullah',
    date: '2025-09-18',
    fileSize: '2.1 MB',
    fileType: 'pdf',
    notes: 'Discharged in stable hemodynamic status with oral antihypertensive regimen.',
    tags: ['Hospitalization', 'Discharge', 'Evercare'],
  },
];

export const useHealthRecordsStore = create<HealthRecordsState>((set) => ({
  medicalProfile: INITIAL_PROFILE,
  vitals: INITIAL_VITALS,
  documents: INITIAL_DOCUMENTS,

  updateMedicalProfile: (updates) =>
    set((state) => ({
      medicalProfile: { ...state.medicalProfile, ...updates },
    })),

  addVitalReading: (vital) =>
    set((state) => ({
      vitals: [
        {
          ...vital,
          id: `vit-${Date.now()}`,
          recordedAt: new Date().toISOString(),
        },
        ...state.vitals,
      ],
    })),

  deleteVitalReading: (id) =>
    set((state) => ({
      vitals: state.vitals.filter((v) => v.id !== id),
    })),

  addDocument: (doc) =>
    set((state) => ({
      documents: [
        {
          ...doc,
          id: `doc-${Date.now()}`,
        },
        ...state.documents,
      ],
    })),

  deleteDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id),
    })),

  addEmergencyContact: (contact) =>
    set((state) => ({
      medicalProfile: {
        ...state.medicalProfile,
        emergencyContacts: [
          ...state.medicalProfile.emergencyContacts,
          { ...contact, id: `em-${Date.now()}` },
        ],
      },
    })),

  removeEmergencyContact: (id) =>
    set((state) => ({
      medicalProfile: {
        ...state.medicalProfile,
        emergencyContacts: state.medicalProfile.emergencyContacts.filter(
          (c) => c.id !== id
        ),
      },
    })),
}));
