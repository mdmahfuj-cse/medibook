import { create } from 'zustand';
import {
  AmbulanceBooking,
  AmbulanceType,
  BloodDonor,
  HospitalICUStatus,
} from '../types/healthRecords';

interface EmergencyState {
  activeAmbulanceBooking: AmbulanceBooking | null;
  pastAmbulanceBookings: AmbulanceBooking[];
  bloodDonors: BloodDonor[];
  hospitalIcuList: HospitalICUStatus[];

  // Actions
  bookAmbulance: (data: {
    ambulanceType: AmbulanceType;
    pickupAddress: string;
    dropoffHospital: string;
    patientCondition: string;
    contactPhone: string;
    fare: number;
  }) => AmbulanceBooking;
  cancelAmbulanceBooking: (id: string) => void;
  updateBookingStatus: (id: string, status: AmbulanceBooking['status']) => void;
  registerBloodDonor: (donor: Omit<BloodDonor, 'id' | 'totalDonations' | 'verified'>) => void;
  toggleDonorAvailability: (id: string) => void;
}

const INITIAL_BLOOD_DONORS: BloodDonor[] = [
  {
    id: 'bd-1',
    name: 'Sabbir Ahmed',
    bloodGroup: 'B+',
    location: 'Mirpur-10, Dhaka',
    district: 'Dhaka',
    phone: '01711-889900',
    lastDonationDate: '2026-05-10',
    totalDonations: 8,
    isAvailable: true,
    verified: true,
  },
  {
    id: 'bd-2',
    name: 'Dr. Tahmidul Islam',
    bloodGroup: 'O+',
    location: 'Dhanmondi, Dhaka',
    district: 'Dhaka',
    phone: '01819-445566',
    lastDonationDate: '2026-04-18',
    totalDonations: 14,
    isAvailable: true,
    verified: true,
  },
  {
    id: 'bd-3',
    name: 'Farhana Kabir',
    bloodGroup: 'A+',
    location: 'Uttara Sector 7, Dhaka',
    district: 'Dhaka',
    phone: '01912-334455',
    lastDonationDate: '2026-06-01',
    totalDonations: 5,
    isAvailable: true,
    verified: true,
  },
  {
    id: 'bd-4',
    name: 'Mahmudur Rahman',
    bloodGroup: 'O-',
    location: 'Agrabad, Chattogram',
    district: 'Chattogram',
    phone: '01715-667788',
    lastDonationDate: '2026-03-20',
    totalDonations: 11,
    isAvailable: true,
    verified: true,
  },
  {
    id: 'bd-5',
    name: 'Shahriar Hossain',
    bloodGroup: 'AB+',
    location: 'Zindabazar, Sylhet',
    district: 'Sylhet',
    phone: '01678-112233',
    lastDonationDate: '2026-05-25',
    totalDonations: 4,
    isAvailable: true,
    verified: true,
  },
  {
    id: 'bd-6',
    name: 'Anika Tabassum',
    bloodGroup: 'B-',
    location: 'Gulshan-2, Dhaka',
    district: 'Dhaka',
    phone: '01799-556677',
    lastDonationDate: '2026-02-14',
    totalDonations: 6,
    isAvailable: true,
    verified: true,
  },
  {
    id: 'bd-7',
    name: 'Kamrul Hasan',
    bloodGroup: 'A-',
    location: 'Rajshahi Sadar',
    district: 'Rajshahi',
    phone: '01713-224466',
    lastDonationDate: '2026-06-15',
    totalDonations: 7,
    isAvailable: true,
    verified: true,
  },
  {
    id: 'bd-8',
    name: 'Fahim Faisal',
    bloodGroup: 'AB-',
    location: 'Mohakhali DOHS, Dhaka',
    district: 'Dhaka',
    phone: '01844-332211',
    lastDonationDate: '2026-04-02',
    totalDonations: 9,
    isAvailable: true,
    verified: true,
  },
];

const INITIAL_HOSPITALS_ICU: HospitalICUStatus[] = [
  {
    id: 'hosp-1',
    hospitalName: 'Square Hospital Ltd.',
    address: '18/F, Bir Uttam Qazi Nuruzzaman Sarak, Panthapath',
    area: 'Panthapath',
    district: 'Dhaka',
    emergencyLine: '10616 / 01713-377775',
    totalIcuBeds: 28,
    availableIcuBeds: 4,
    totalCcuBeds: 16,
    availableCcuBeds: 2,
    nicuAvailable: 3,
    lastUpdated: '10 mins ago',
    hasOxygenSupport: true,
  },
  {
    id: 'hosp-2',
    hospitalName: 'Evercare Hospital Dhaka',
    address: 'Plot 81, Block E, Bashundhara R/A',
    area: 'Bashundhara',
    district: 'Dhaka',
    emergencyLine: '10678 / 01713-041434',
    totalIcuBeds: 34,
    availableIcuBeds: 6,
    totalCcuBeds: 20,
    availableCcuBeds: 5,
    nicuAvailable: 4,
    lastUpdated: '15 mins ago',
    hasOxygenSupport: true,
  },
  {
    id: 'hosp-3',
    hospitalName: 'Dhaka Medical College Hospital (DMCH)',
    address: 'Secretariat Road, Bakshi Bazar',
    area: 'Old Dhaka',
    district: 'Dhaka',
    emergencyLine: '02-55165656 / 01711-229988',
    totalIcuBeds: 50,
    availableIcuBeds: 2,
    totalCcuBeds: 24,
    availableCcuBeds: 1,
    nicuAvailable: 2,
    lastUpdated: '5 mins ago',
    hasOxygenSupport: true,
  },
  {
    id: 'hosp-4',
    hospitalName: 'United Hospital Limited',
    address: 'Plot 15, Road 71, Gulshan-2',
    area: 'Gulshan',
    district: 'Dhaka',
    emergencyLine: '10666 / 01914-001234',
    totalIcuBeds: 30,
    availableIcuBeds: 5,
    totalCcuBeds: 18,
    availableCcuBeds: 3,
    nicuAvailable: 2,
    lastUpdated: '22 mins ago',
    hasOxygenSupport: true,
  },
  {
    id: 'hosp-5',
    hospitalName: 'National Institute of Cardiovascular Diseases (NICVD)',
    address: 'Sher-e-Bangla Nagar',
    area: 'Agargaon',
    district: 'Dhaka',
    emergencyLine: '02-9122560',
    totalIcuBeds: 40,
    availableIcuBeds: 3,
    totalCcuBeds: 32,
    availableCcuBeds: 4,
    nicuAvailable: 1,
    lastUpdated: '18 mins ago',
    hasOxygenSupport: true,
  },
  {
    id: 'hosp-6',
    hospitalName: 'National Heart Foundation Hospital',
    address: 'Plot 4, Section 2, Mirpur',
    area: 'Mirpur',
    district: 'Dhaka',
    emergencyLine: '02-58054708',
    totalIcuBeds: 24,
    availableIcuBeds: 2,
    totalCcuBeds: 20,
    availableCcuBeds: 3,
    nicuAvailable: 2,
    lastUpdated: '30 mins ago',
    hasOxygenSupport: true,
  },
];

export const useEmergencyStore = create<EmergencyState>((set) => ({
  activeAmbulanceBooking: null,
  pastAmbulanceBookings: [],
  bloodDonors: INITIAL_BLOOD_DONORS,
  hospitalIcuList: INITIAL_HOSPITALS_ICU,

  bookAmbulance: (data) => {
    const newBooking: AmbulanceBooking = {
      id: `AMB-${Math.floor(100000 + Math.random() * 900000)}`,
      ambulanceType: data.ambulanceType,
      pickupAddress: data.pickupAddress,
      dropoffHospital: data.dropoffHospital,
      patientCondition: data.patientCondition,
      contactPhone: data.contactPhone,
      fare: data.fare,
      status: 'dispatched',
      driverName: 'Mohammad Alamgir Kabir',
      driverPhone: '01819-765432',
      vehicleNo: 'Dhaka Metro-Cha 11-8934',
      etaMinutes: 12,
      bookedAt: new Date().toISOString(),
    };

    set((state) => ({
      activeAmbulanceBooking: newBooking,
      pastAmbulanceBookings: [newBooking, ...state.pastAmbulanceBookings],
    }));

    return newBooking;
  },

  cancelAmbulanceBooking: (id) =>
    set((state) => ({
      activeAmbulanceBooking:
        state.activeAmbulanceBooking?.id === id
          ? null
          : state.activeAmbulanceBooking,
      pastAmbulanceBookings: state.pastAmbulanceBookings.map((b) =>
        b.id === id ? { ...b, status: 'completed' } : b
      ),
    })),

  updateBookingStatus: (id, status) =>
    set((state) => ({
      activeAmbulanceBooking:
        state.activeAmbulanceBooking?.id === id
          ? { ...state.activeAmbulanceBooking, status }
          : state.activeAmbulanceBooking,
      pastAmbulanceBookings: state.pastAmbulanceBookings.map((b) =>
        b.id === id ? { ...b, status } : b
      ),
    })),

  registerBloodDonor: (donor) =>
    set((state) => ({
      bloodDonors: [
        {
          ...donor,
          id: `bd-${Date.now()}`,
          totalDonations: 0,
          verified: true,
        },
        ...state.bloodDonors,
      ],
    })),

  toggleDonorAvailability: (id) =>
    set((state) => ({
      bloodDonors: state.bloodDonors.map((d) =>
        d.id === id ? { ...d, isAvailable: !d.isAvailable } : d
      ),
    })),
}));
