import { create } from 'zustand';
import { Doctor, TimeSlot, PatientDetails } from '../types';

export type BookingStep = 1 | 2 | 3 | 4;

export interface PromoDiscount {
  code: string;
  discountAmount: number;
  description: string;
}

interface BookingState {
  currentStep: BookingStep;
  doctor: Doctor | null;
  selectedDateStr: string | null;
  selectedSlot: TimeSlot | null;
  patientDetails: PatientDetails;
  appliedPromo: PromoDiscount | null;
  isSubmitting: boolean;
  confirmedAppointmentId: string | null;

  // Actions
  initBooking: (doctor: Doctor, preselectedDate?: string) => void;
  setStep: (step: BookingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setSelectedDateStr: (dateStr: string) => void;
  setSelectedSlot: (slot: TimeSlot | null) => void;
  setPatientDetails: (details: Partial<PatientDetails>) => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setConfirmedAppointmentId: (id: string | null) => void;
  resetBooking: () => void;
}

const DEFAULT_PATIENT_DETAILS: PatientDetails = {
  fullName: 'Tanvir Hossain',
  phone: '01712-345678',
  email: 'tanvir.hossain@gmail.com',
  dateOfBirth: '1995-06-15',
  gender: 'male',
  reasonForVisit: '',
  additionalNotes: '',
  insuranceProvider: 'Self-Pay / Direct Payment',
};

const VALID_PROMOS: Record<string, { amount: number; desc: string }> = {
  HEALTH10: { amount: 100, desc: '৳100 Off Consultation Care' },
  FIRSTVISIT: { amount: 200, desc: '৳200 Welcome Patient Voucher' },
  WELLNESS50: { amount: 500, desc: '৳500 Special Health Benefit' },
  TELEHEALTH20: { amount: 150, desc: '৳150 Video Consultation Discount' },
};

export const useBookingStore = create<BookingState>((set, get) => ({
  currentStep: 1,
  doctor: null,
  selectedDateStr: null,
  selectedSlot: null,
  patientDetails: DEFAULT_PATIENT_DETAILS,
  appliedPromo: null,
  isSubmitting: false,
  confirmedAppointmentId: null,

  initBooking: (doctor, preselectedDate) => {
    // Pick tomorrow's date or preselectedDate
    const defaultDate = preselectedDate || new Date(Date.now() + 86400000).toISOString().split('T')[0];
    set({
      currentStep: 1,
      doctor,
      selectedDateStr: defaultDate,
      selectedSlot: null,
      appliedPromo: null,
      confirmedAppointmentId: null,
      isSubmitting: false,
    });
  },

  setStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < 4) {
      set({ currentStep: (currentStep + 1) as BookingStep });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: (currentStep - 1) as BookingStep });
    }
  },

  setSelectedDateStr: (selectedDateStr) => {
    set({ selectedDateStr, selectedSlot: null });
  },

  setSelectedSlot: (selectedSlot) => set({ selectedSlot }),

  setPatientDetails: (details) =>
    set((state) => ({
      patientDetails: { ...state.patientDetails, ...details },
    })),

  applyPromoCode: (code: string) => {
    const clean = code.trim().toUpperCase();
    const promo = VALID_PROMOS[clean];
    if (promo) {
      set({
        appliedPromo: {
          code: clean,
          discountAmount: promo.amount,
          description: promo.desc,
        },
      });
      return { success: true, message: `Applied: ${promo.desc}` };
    }
    return { success: false, message: 'Invalid promo code. Try FIRSTVISIT or HEALTH10' };
  },

  removePromoCode: () => set({ appliedPromo: null }),

  setSubmitting: (isSubmitting) => set({ isSubmitting }),

  setConfirmedAppointmentId: (confirmedAppointmentId) => set({ confirmedAppointmentId }),

  resetBooking: () =>
    set({
      currentStep: 1,
      doctor: null,
      selectedDateStr: null,
      selectedSlot: null,
      appliedPromo: null,
      confirmedAppointmentId: null,
      isSubmitting: false,
    }),
}));
