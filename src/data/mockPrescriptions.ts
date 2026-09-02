import { Prescription } from '../types';

export interface ExtendedPrescription extends Prescription {
  vitals?: {
    bloodPressure?: string;
    pulseRate?: string;
    weightKg?: number;
    bloodSugar?: string;
    temperature?: string;
  };
  investigations?: {
    testName: string;
    urgency: 'Routine' | 'Urgent';
    notes?: string;
  }[];
  lifestyleAdvice?: string[];
  bmdcRegNo: string;
  doctorDegrees: string;
}

export const MOCK_PRESCRIPTIONS: ExtendedPrescription[] = [
  {
    id: 'rx-2026-001',
    appointmentId: 'apt-101',
    doctorId: 'doc-1',
    doctorName: 'Prof. Dr. M. A. Hashem',
    doctorSpecialty: 'Cardiology',
    doctorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    doctorDegrees: 'MBBS, FCPS (Medicine), MD (Cardiology), FACC (USA)',
    bmdcRegNo: 'BMDC: A-28491',
    clinicName: 'Evercare Hospital Dhaka',
    clinicAddress: 'Plot 81, Block E, Bashundhara R/A, Dhaka 1229',
    patientName: 'Tanvir Hossain',
    patientAge: 31,
    patientGender: 'Male',
    date: '2026-08-28',
    diagnosis: 'Stage 1 Essential Hypertension & Borderline Dyslipidemia',
    vitals: {
      bloodPressure: '138/88 mmHg',
      pulseRate: '74 bpm',
      weightKg: 72,
      bloodSugar: '5.8 mmol/L (Fasting)',
      temperature: '98.4 °F',
    },
    medicines: [
      {
        name: 'Tab. Telmisartan (Telma / Bipress)',
        dosage: '40 mg',
        frequency: '1 + 0 + 0 (Morning after breakfast)',
        duration: '30 Days (Continue)',
        instructions: 'Take daily with a glass of water at the same time in the morning.',
      },
      {
        name: 'Tab. Rosuvastatin (Rostor / Rosu)',
        dosage: '10 mg',
        frequency: '0 + 0 + 1 (Night after dinner)',
        duration: '30 Days',
        instructions: 'Take 30 minutes after dinner before bedtime.',
      },
      {
        name: 'Tab. Aspirin (Ecosprin / Micropirin)',
        dosage: '75 mg',
        frequency: '0 + 1 + 0 (Afternoon after lunch)',
        duration: '30 Days',
        instructions: 'Always take with or immediately after a full meal. Do not take on an empty stomach.',
      },
    ],
    investigations: [
      { testName: 'Lipid Profile (Fasting 12 hours)', urgency: 'Routine', notes: 'Evaluate LDL, HDL, Triglycerides' },
      { testName: 'Serum Creatinine & Electrolytes', urgency: 'Routine', notes: 'Renal function baseline' },
      { testName: '12-Lead Electrocardiogram (ECG)', urgency: 'Routine', notes: 'Resting cardiac rhythm check' },
    ],
    generalAdvice:
      'Maintain strict low-sodium dietary habits. Restrict salt to less than 5g per day. Engage in at least 30 minutes of aerobic exercise (brisk walking or cycling) 5 days a week. Record resting blood pressure twice weekly in morning.',
    lifestyleAdvice: [
      'Avoid deep-fried and processed foods, extra dining table salt, and high-fat red meat.',
      'Maintain adequate hydration (at least 2.5 - 3 Litres of water daily).',
      'Daily 30 minutes of brisk walking in open fresh air.',
      'Maintain consistent 7-8 hours of nighttime sleep.',
    ],
    followUpDate: '2026-09-28 (After 1 Month with lab test reports)',
  },
  {
    id: 'rx-2026-002',
    appointmentId: 'apt-102',
    doctorId: 'doc-3',
    doctorName: 'Dr. Tanvir Ahmed',
    doctorSpecialty: 'General Practice',
    doctorAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600',
    doctorDegrees: 'MBBS, BCS (Health), MD (Internal Medicine), MACP (USA)',
    bmdcRegNo: 'BMDC: A-36780',
    clinicName: 'Popular Diagnostic Centre & Hospital',
    clinicAddress: 'House 16, Road 2, Dhanmondi, Dhaka 1205',
    patientName: 'Tanvir Hossain',
    patientAge: 31,
    patientGender: 'Male',
    date: '2026-08-15',
    diagnosis: 'Post-Viral Fatigue Syndrome & Acute Acid Peptic Disease (Gastritis)',
    vitals: {
      bloodPressure: '120/78 mmHg',
      pulseRate: '78 bpm',
      weightKg: 71.5,
      bloodSugar: '5.4 mmol/L',
      temperature: '98.6 °F',
    },
    medicines: [
      {
        name: 'Cap. Esomeprazole (Maxpro / Sergel)',
        dosage: '20 mg',
        frequency: '1 + 0 + 1 (Morning & Night 30 mins before meal)',
        duration: '14 Days',
        instructions: 'Take with a glass of water 30 minutes before breakfast and dinner.',
      },
      {
        name: 'Tab. Paracetamol (Napa Extra / Fast)',
        dosage: '665 mg',
        frequency: '1 + 1 + 1 (As needed for body ache or headache)',
        duration: '5 Days (SOS)',
        instructions: 'Take only if fever > 100°F or body pain persists. Max 3 tablets in 24 hours.',
      },
      {
        name: 'Cap. Multivitamin with Zinc & B-Complex (Bextram Gold / Zinconil)',
        dosage: '1 Capsule',
        frequency: '0 + 1 + 0 (Afternoon after lunch)',
        duration: '30 Days',
        instructions: 'Take 1 capsule daily after lunch for nutritional recovery.',
      },
      {
        name: 'Oral Saline (ORS - SMC Taste Saline)',
        dosage: '1 Sachet in 500ml clean water',
        frequency: '1-2 times daily',
        duration: '7 Days',
        instructions: 'Dissolve full sachet in 500ml water. Drink whenever thirsty.',
      },
    ],
    investigations: [
      { testName: 'Complete Blood Count (CBC) with ESR', urgency: 'Routine', notes: 'Check platelet and hemoglobin levels' },
      { testName: 'Serum SGPT / ALT', urgency: 'Routine', notes: 'Liver enzyme assessment' },
    ],
    generalAdvice:
      'Eat freshly cooked, mild non-spicy meals on regular timings. Avoid prolonged fasting, oily street food, and carbonated soft drinks. Stay well hydrated with green coconut water and oral rehydration saline.',
    lifestyleAdvice: [
      'Avoid spicy, sour, and deep-fried fast food items.',
      'Do not lie down immediately after eating; wait at least 45 minutes.',
      'Drink plenty of warm fluid, soups, and green coconut water (Dab er pani).',
    ],
    followUpDate: '2026-09-01 (Or earlier if heartburn or fever recurs)',
  },
  {
    id: 'rx-2026-003',
    appointmentId: 'apt-103',
    doctorId: 'doc-2',
    doctorName: 'Dr. Nusrat Jahan Chowdhury',
    doctorSpecialty: 'Dermatology',
    doctorAvatar: 'https://images.unsplash.com/photo-1594824813591-a53b53c15569?auto=format&fit=crop&q=80&w=600',
    doctorDegrees: 'MBBS, DDV, FCPS (Dermatology & Venereology)',
    bmdcRegNo: 'BMDC: A-41902',
    clinicName: 'Square Hospitals Ltd.',
    clinicAddress: '18/F Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath, Dhaka 1205',
    patientName: 'Tanvir Hossain',
    patientAge: 31,
    patientGender: 'Male',
    date: '2026-07-22',
    diagnosis: 'Allergic Contact Dermatitis & Xerosis Cutis (Dry Skin Barrier)',
    vitals: {
      bloodPressure: '122/80 mmHg',
      pulseRate: '70 bpm',
      weightKg: 72,
    },
    medicines: [
      {
        name: 'Tab. Fexofenadine (Fexo / Telfast)',
        dosage: '120 mg',
        frequency: '0 + 0 + 1 (Night after dinner)',
        duration: '15 Days',
        instructions: 'Non-sedating antihistamine for itching and skin redness relief.',
      },
      {
        name: 'Cream Mometasone Furoate (Elocon / Momate)',
        dosage: '0.1% Cream (Thin layer)',
        frequency: 'Apply once daily at night on affected itchy spots',
        duration: '7 Days only',
        instructions: 'Apply gently on lesion areas only. Do not apply around eyes or broken open skin.',
      },
      {
        name: 'Physiogel / Cetaphil Moisturizing Lotion',
        dosage: 'Generous application',
        frequency: 'Twice daily immediately within 3 minutes of bathing',
        duration: 'Ongoing daily use',
        instructions: 'Apply on damp skin to lock in hydration and restore skin lipid barrier.',
      },
    ],
    investigations: [
      { testName: 'Serum Total IgE Level', urgency: 'Routine', notes: 'Check for allergic diathesis' },
    ],
    generalAdvice:
      'Use gentle soap-free cleansers (syndet bars). Avoid very hot water showers. Wear loose, breathable 100% cotton clothing. Keep fingernails short to prevent skin excoriation.',
    lifestyleAdvice: [
      'Do not use harsh antibacterial bath soaps or harsh detergents on bare hands.',
      'Moisturize skin within 3 minutes after stepping out of the shower.',
      'Wear pure cotton fabrics in humid Bangladesh weather.',
    ],
    followUpDate: '2026-08-25',
  },
];
