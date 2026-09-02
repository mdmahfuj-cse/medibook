import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LabTest, LabPackage, DiagnosticCenter, LabOrder } from '../types/phase10';

export const INITIAL_LAB_TESTS: LabTest[] = [
  {
    id: 'test-cbc',
    code: 'HEM-001',
    name: 'Complete Blood Count (CBC) with ESR',
    category: 'Hematology',
    description: 'Measures RBC, WBC count, Platelets, Hemoglobin (Hb), and Erythrocyte Sedimentation Rate.',
    price: 500,
    discountedPrice: 400,
    sampleType: 'Blood',
    fastingRequired: false,
    reportTurnaroundHours: 12,
    homeCollectionAvailable: true,
    popular: true,
    prerequisites: ['No special dietary restriction required.'],
    parametersIncludedCount: 24,
  },
  {
    id: 'test-hba1c',
    code: 'BIO-004',
    name: 'HbA1c (Glycated Hemoglobin)',
    category: 'Biochemistry',
    description: 'Gold-standard blood test evaluating average blood sugar control over the past 3 months.',
    price: 900,
    discountedPrice: 750,
    sampleType: 'Blood',
    fastingRequired: false,
    reportTurnaroundHours: 12,
    homeCollectionAvailable: true,
    popular: true,
    prerequisites: ['Can be taken anytime regardless of food intake.'],
    parametersIncludedCount: 3,
  },
  {
    id: 'test-fbs',
    code: 'BIO-001',
    name: 'Fasting Blood Sugar (FBS) & 2HABF',
    category: 'Biochemistry',
    description: 'Measures blood glucose after 8-10 hours of overnight fasting and 2 hours after breakfast.',
    price: 450,
    discountedPrice: 350,
    sampleType: 'Blood',
    fastingRequired: true,
    fastingHours: 10,
    reportTurnaroundHours: 8,
    homeCollectionAvailable: true,
    popular: true,
    prerequisites: ['Fast for minimum 8 to 10 hours overnight.', 'Drink plain water only.'],
    parametersIncludedCount: 2,
  },
  {
    id: 'test-lipid',
    code: 'BIO-008',
    name: 'Lipid Profile Comprehensive',
    category: 'Biochemistry',
    description: 'Evaluates Total Cholesterol, HDL (Good), LDL (Bad), VLDL, and Triglycerides.',
    price: 1200,
    discountedPrice: 950,
    sampleType: 'Blood',
    fastingRequired: true,
    fastingHours: 12,
    reportTurnaroundHours: 18,
    homeCollectionAvailable: true,
    popular: true,
    prerequisites: ['10-12 hours strict fasting required.', 'Avoid heavy fatty dinner previous night.'],
    parametersIncludedCount: 7,
  },
  {
    id: 'test-thyroid',
    code: 'END-002',
    name: 'Thyroid Function Panel (FT3, FT4, TSH)',
    category: 'Endocrinology',
    description: 'Comprehensive evaluation of thyroid gland activity, diagnosing hypo/hyperthyroidism.',
    price: 1600,
    discountedPrice: 1350,
    sampleType: 'Blood',
    fastingRequired: true,
    fastingHours: 8,
    reportTurnaroundHours: 24,
    homeCollectionAvailable: true,
    popular: true,
    prerequisites: ['Morning sample preferred.', 'Consult doctor if taking Levothyroxine (Thyrox).'],
    parametersIncludedCount: 3,
  },
  {
    id: 'test-creatinine',
    code: 'BIO-009',
    name: 'Serum Creatinine & eGFR (Kidney Health)',
    category: 'Biochemistry',
    description: 'Assesses renal filtration efficiency and early kidney function health.',
    price: 450,
    discountedPrice: 380,
    sampleType: 'Blood',
    fastingRequired: false,
    reportTurnaroundHours: 8,
    homeCollectionAvailable: true,
    popular: true,
    prerequisites: ['Stay hydrated prior to sampling.'],
    parametersIncludedCount: 2,
  },
  {
    id: 'test-lft',
    code: 'BIO-012',
    name: 'Liver Function Test (LFT Profile)',
    category: 'Biochemistry',
    description: 'Measures Bilirubin (Total/Direct), SGPT/ALT, SGOT/AST, Alkaline Phosphatase, Total Protein, and Albumin.',
    price: 1400,
    discountedPrice: 1100,
    sampleType: 'Blood',
    fastingRequired: true,
    fastingHours: 8,
    reportTurnaroundHours: 18,
    homeCollectionAvailable: true,
    popular: false,
    prerequisites: ['Overnight 8-hour fasting recommended.'],
    parametersIncludedCount: 9,
  },
  {
    id: 'test-vitamind',
    code: 'BIO-025',
    name: 'Vitamin D (25-Hydroxy) & Vitamin B12',
    category: 'Biochemistry',
    description: 'Screens for bone mineralization deficiencies, nerve health, and immune resilience.',
    price: 3200,
    discountedPrice: 2600,
    sampleType: 'Blood',
    fastingRequired: false,
    reportTurnaroundHours: 36,
    homeCollectionAvailable: true,
    popular: true,
    prerequisites: ['No specific fasting needed.'],
    parametersIncludedCount: 2,
  },
  {
    id: 'test-dengue',
    code: 'MIC-009',
    name: 'Dengue Duo Combo (NS1 Antigen + IgM/IgG)',
    category: 'Microbiology',
    description: 'Rapid confirmation for early Dengue fever and antibody response tracking.',
    price: 1100,
    discountedPrice: 900,
    sampleType: 'Blood',
    fastingRequired: false,
    reportTurnaroundHours: 4,
    homeCollectionAvailable: true,
    popular: true,
    prerequisites: ['Urgent report within 4 hours.'],
    parametersIncludedCount: 3,
  },
  {
    id: 'test-ecg',
    code: 'CAR-001',
    name: '12-Lead Resting Digital ECG with Cardiologist Interpretation',
    category: 'Cardiac Diagnostics',
    description: 'Records electrical activity of the heart to detect arrhythmias, ischemia, or prior infarcts.',
    price: 600,
    discountedPrice: 500,
    sampleType: 'ECG',
    fastingRequired: false,
    reportTurnaroundHours: 2,
    homeCollectionAvailable: true,
    popular: true,
    prerequisites: ['Wear loose comfortable clothing.'],
    parametersIncludedCount: 1,
  },
  {
    id: 'test-usg-abdomen',
    code: 'RAD-005',
    name: 'Ultrasound of Whole Abdomen & Pelvis (4D)',
    category: 'Radiology & Imaging',
    description: 'High-resolution acoustic imaging of Liver, Gallbladder, Kidneys, Spleen, Pancreas, and Urinary Bladder.',
    price: 2200,
    discountedPrice: 1900,
    sampleType: 'Imaging/Scan',
    fastingRequired: true,
    fastingHours: 6,
    reportTurnaroundHours: 4,
    homeCollectionAvailable: false,
    popular: true,
    prerequisites: ['6 hours fasting required.', 'Full urinary bladder (drink 1L water 1 hour prior).'],
    parametersIncludedCount: 8,
  },
];

export const INITIAL_LAB_PACKAGES: LabPackage[] = [
  {
    id: 'pkg-executive-master',
    name: 'Executive Master Health Checkup (Full Body)',
    tagline: 'Complete 68-parameter full organ wellness screening',
    description: 'Covers Complete Hemogram, Heart Lipid Profile, Liver Panel, Kidney Panel, HbA1c, Thyroid TSH, Urine Routine, Vitamin D3, and ECG.',
    testsIncluded: ['CBC with ESR', 'Lipid Profile', 'Liver Function Test', 'Kidney Function & Creatinine', 'HbA1c', 'TSH', 'Urine R/M/E', 'Vitamin D', '12-Lead ECG'],
    totalTestsCount: 68,
    price: 4999,
    originalPrice: 8500,
    genderTarget: 'All',
    badge: 'Best Value',
    sampleType: 'Blood, Urine & ECG',
    fastingRequired: true,
    fastingHours: 10,
  },
  {
    id: 'pkg-diabetic-care',
    name: 'Comprehensive Diabetic Wellness & Renal Guard',
    tagline: 'Essential quarterly monitoring for diabetic patients',
    description: 'Tracks blood glucose control, lipid balance, urine microalbumin, kidney filtration rate, and serum electrolytes.',
    testsIncluded: ['Fasting Blood Sugar', 'HbA1c Glycated Hb', 'Serum Creatinine', 'Lipid Profile', 'Urine Microalbumin / Creatinine Ratio', 'Serum Electrolytes'],
    totalTestsCount: 22,
    price: 2499,
    originalPrice: 4200,
    genderTarget: 'All',
    badge: 'Popular',
    sampleType: 'Blood & Urine',
    fastingRequired: true,
    fastingHours: 10,
  },
  {
    id: 'pkg-cardiac-vital',
    name: 'Advanced Cardiac Health & Lipid Screen',
    tagline: 'Targeted cardiovascular risk assessment for heart protection',
    description: 'Includes High-Sensitivity Troponin-I, hs-CRP, Lipid Profile, Blood Pressure recording, Serum Electrolytes, and 12-Lead ECG.',
    testsIncluded: ['Lipid Profile', 'hs-CRP (Cardiac Inflammation)', 'Serum Electrolytes', '12-Lead ECG', 'Serum Uric Acid'],
    totalTestsCount: 18,
    price: 3100,
    originalPrice: 5000,
    genderTarget: 'All',
    badge: 'Heart Care',
    sampleType: 'Blood & ECG',
    fastingRequired: true,
    fastingHours: 12,
  },
  {
    id: 'pkg-women-wellness',
    name: 'Well-Woman & Hormonal Health Panel',
    tagline: 'Comprehensive screen for PCOS, thyroid, iron deficiency & bone density',
    description: 'Evaluates Serum Ferritin (Iron stores), Thyroid FT3/FT4/TSH, Prolactin, Vitamin D3, Calcium, CBC, and Blood Glucose.',
    testsIncluded: ['CBC & ESR', 'Serum Ferritin', 'TSH & FT4', 'Serum Calcium', 'Vitamin D3', 'Fasting Blood Glucose', 'Prolactin'],
    totalTestsCount: 32,
    price: 3850,
    originalPrice: 6200,
    genderTarget: 'Women',
    badge: 'Women Health',
    sampleType: 'Blood & Urine',
    fastingRequired: true,
    fastingHours: 8,
  },
];

export const INITIAL_DIAGNOSTIC_CENTERS: DiagnosticCenter[] = [
  {
    id: 'dc-popular-dhanmondi',
    name: 'Popular Diagnostic Centre',
    branch: 'Dhanmondi Main Branch, Road 2',
    city: 'Dhaka',
    address: 'House #16, Road #2, Dhanmondi R/A, Dhaka-1205',
    rating: 4.8,
    reviewsCount: 3240,
    accredited: ['ISO 15189', 'DGHS Approved', 'EQAS Certified'],
    homeCollectionDiscountPercent: 10,
    phone: '09613-787801',
  },
  {
    id: 'dc-ibnsina-dhanmondi',
    name: 'Ibn Sina Diagnostic & Imaging Centre',
    branch: 'Dhanmondi Branch',
    city: 'Dhaka',
    address: 'House #48, Road #9/A, Dhanmondi, Dhaka',
    rating: 4.7,
    reviewsCount: 2890,
    accredited: ['ISO 9001', 'DGHS Approved'],
    homeCollectionDiscountPercent: 10,
    phone: '09610-010615',
  },
  {
    id: 'dc-labaid-gulshan',
    name: 'Labaid Diagnostic Centre',
    branch: 'Gulshan Branch',
    city: 'Dhaka',
    address: 'House #13/A, Road #35, Gulshan-2, Dhaka',
    rating: 4.9,
    reviewsCount: 1980,
    accredited: ['CAP Accredited', 'ISO 15189', 'JCI Compliant'],
    homeCollectionDiscountPercent: 15,
    phone: '10606',
  },
  {
    id: 'dc-praava-banani',
    name: 'Praava Health Hub & Molecular Lab',
    branch: 'Banani Flagship',
    city: 'Dhaka',
    address: 'Plot 9, Road 17, Block C, Banani, Dhaka-1213',
    rating: 4.9,
    reviewsCount: 1450,
    accredited: ['ISO 15189', 'DGHS Approved'],
    homeCollectionDiscountPercent: 12,
    phone: '10648',
  },
  {
    id: 'dc-evercare-bashundhara',
    name: 'Evercare Hospital Diagnostic Laboratories',
    branch: 'Bashundhara R/A',
    city: 'Dhaka',
    address: 'Plot 81, Block E, Bashundhara R/A, Dhaka-1229',
    rating: 4.9,
    reviewsCount: 4120,
    accredited: ['JCI Accredited', 'CAP Accredited', 'ISO 15189'],
    homeCollectionDiscountPercent: 5,
    phone: '10678',
  },
];

export const INITIAL_LAB_ORDERS: LabOrder[] = [
  {
    id: 'lab-ord-1001',
    orderNumber: 'LAB-2026-8891',
    patientId: 'patient-tanvir-001',
    patientName: 'Tanvir Hossain',
    patientPhone: '+880 1711-234567',
    tests: [INITIAL_LAB_TESTS[0], INITIAL_LAB_TESTS[1]],
    packages: [],
    diagnosticCenter: INITIAL_DIAGNOSTIC_CENTERS[0],
    collectionType: 'home_collection',
    scheduledDate: '2026-09-02',
    scheduledTimeSlot: '07:30 AM - 08:30 AM',
    address: {
      street: 'Flat 4B, House 12, Road 4',
      area: 'Dhanmondi',
      city: 'Dhaka',
      landmark: 'Near Mastermind School',
    },
    totalAmount: 1400,
    discountAmount: 250,
    homeCollectionFee: 150,
    netPayable: 1300,
    paymentMethod: 'bkash',
    paymentStatus: 'paid',
    status: 'phlebotomist_assigned',
    phlebotomist: {
      name: 'Rabiul Islam (Certified Medical Technologist)',
      phone: '+880 1845-998811',
      vaccinationStatus: 'Fully Vaccinated (Hepatitis B & COVID-19)',
      photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
      temperatureChecked: '98.2°F (Checked 30m ago)',
    },
    createdAt: '2026-08-31T08:30:00Z',
  },
  {
    id: 'lab-ord-1002',
    orderNumber: 'LAB-2026-7734',
    patientId: 'patient-fatema-003',
    patientName: 'Fatema Begum',
    patientPhone: '+880 1712-887766',
    tests: [INITIAL_LAB_TESTS[3], INITIAL_LAB_TESTS[5]],
    packages: [INITIAL_LAB_PACKAGES[1]],
    diagnosticCenter: INITIAL_DIAGNOSTIC_CENTERS[1],
    collectionType: 'home_collection',
    scheduledDate: '2026-08-25',
    scheduledTimeSlot: '08:00 AM - 09:00 AM',
    address: {
      street: 'Apartment 6A, House 24, Road 8',
      area: 'Gulshan-1',
      city: 'Dhaka',
    },
    totalAmount: 4149,
    discountAmount: 650,
    homeCollectionFee: 0,
    netPayable: 3499,
    paymentMethod: 'bkash',
    paymentStatus: 'paid',
    status: 'report_ready',
    reportUrl: 'https://example.com/reports/LAB-2026-7734.pdf',
    createdAt: '2026-08-24T14:10:00Z',
  },
];

interface LabTestsStore {
  tests: LabTest[];
  packages: LabPackage[];
  diagnosticCenters: DiagnosticCenter[];
  selectedCenter: DiagnosticCenter;
  setSelectedCenter: (center: DiagnosticCenter) => void;
  
  // Cart
  cartTests: LabTest[];
  cartPackages: LabPackage[];
  addTestToCart: (test: LabTest) => void;
  removeTestFromCart: (testId: string) => void;
  addPackageToCart: (pkg: LabPackage) => void;
  removePackageFromCart: (pkgId: string) => void;
  clearCart: () => void;
  
  // Orders
  orders: LabOrder[];
  addOrder: (order: LabOrder) => void;
  updateOrderStatus: (orderId: string, status: LabOrder['status']) => void;
  
  // Filter & Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const useLabTestsStore = create<LabTestsStore>()(
  persist(
    (set, get) => ({
      tests: INITIAL_LAB_TESTS,
      packages: INITIAL_LAB_PACKAGES,
      diagnosticCenters: INITIAL_DIAGNOSTIC_CENTERS,
      selectedCenter: INITIAL_DIAGNOSTIC_CENTERS[0],
      setSelectedCenter: (center) => set({ selectedCenter: center }),

      cartTests: [],
      cartPackages: [],

      addTestToCart: (test) => {
        const { cartTests } = get();
        if (!cartTests.some((t) => t.id === test.id)) {
          set({ cartTests: [...cartTests, test] });
        }
      },

      removeTestFromCart: (testId) => {
        set({ cartTests: get().cartTests.filter((t) => t.id !== testId) });
      },

      addPackageToCart: (pkg) => {
        const { cartPackages } = get();
        if (!cartPackages.some((p) => p.id === pkg.id)) {
          set({ cartPackages: [...cartPackages, pkg] });
        }
      },

      removePackageFromCart: (pkgId) => {
        set({ cartPackages: get().cartPackages.filter((p) => p.id !== pkgId) });
      },

      clearCart: () => set({ cartTests: [], cartPackages: [] }),

      orders: INITIAL_LAB_ORDERS,

      addOrder: (order) => set({ orders: [order, ...get().orders] }),

      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        });
      },

      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      selectedCategory: 'All',
      setSelectedCategory: (cat) => set({ selectedCategory: cat }),
    }),
    {
      name: 'healthcare_lab_tests_v10',
    }
  )
);
