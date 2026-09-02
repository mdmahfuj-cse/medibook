import { create } from 'zustand';
import { Appointment, AppointmentStatus, PatientDetails, Specialty, Clinic } from '../types';
import { CLINICS } from '../data/mockDoctors';

const APPOINTMENTS_STORAGE_KEY = 'medibook_appointments_v1';

// Initial realistic appointments for testing / demonstration
const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    doctorId: 'doc-1',
    doctorName: 'Prof. Dr. M. A. Hashem',
    doctorSpecialty: 'Cardiology',
    doctorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    clinic: CLINICS.c1,
    dateStr: '2026-09-04',
    startTime: '10:00',
    endTime: '10:20',
    timezone: 'Asia/Dhaka',
    patientDetails: {
      fullName: 'Tanvir Hossain',
      phone: '01712-345678',
      email: 'tanvir.hossain@gmail.com',
      dateOfBirth: '1995-06-15',
      gender: 'male',
      reasonForVisit: 'Annual cardiovascular risk screening and resting blood pressure evaluation.',
      insuranceProvider: 'Self-Pay / Direct Payment',
    },
    consultationFee: 1500,
    status: 'upcoming',
    createdAt: '2026-08-28T14:20:00Z',
    updatedAt: '2026-08-28T14:20:00Z',
  },
  {
    id: 'apt-102',
    doctorId: 'doc-3',
    doctorName: 'Dr. Tanvir Ahmed',
    doctorSpecialty: 'General Practice',
    doctorAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600',
    clinic: CLINICS.c5,
    dateStr: '2026-08-15',
    startTime: '17:00',
    endTime: '17:20',
    timezone: 'Asia/Dhaka',
    patientDetails: {
      fullName: 'Tanvir Hossain',
      phone: '01712-345678',
      email: 'tanvir.hossain@gmail.com',
      dateOfBirth: '1995-06-15',
      gender: 'male',
      reasonForVisit: 'Routine wellness physical, blood pressure checkup and standard blood panel workup.',
    },
    consultationFee: 1000,
    status: 'completed',
    createdAt: '2026-08-10T09:15:00Z',
    updatedAt: '2026-08-15T18:00:00Z',
  },
];

interface AppointmentState {
  appointments: Appointment[];
  activeFilterTab: 'upcoming' | 'past' | 'cancelled';
  
  // Actions
  setActiveFilterTab: (tab: 'upcoming' | 'past' | 'cancelled') => void;
  createAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Appointment;
  cancelAppointment: (id: string, reason: string) => void;
  rescheduleAppointment: (id: string, newDateStr: string, newStartTime: string, newEndTime: string) => void;
  getAppointmentById: (id: string) => Appointment | undefined;
  getDoctorBookedSlots: (doctorId: string, dateStr: string) => string[]; // returns ["09:00", "10:30"]
}

function loadAppointments(): Appointment[] {
  try {
    const raw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse stored appointments:', err);
  }
  return INITIAL_APPOINTMENTS;
}

function persistAppointments(appointments: Appointment[]) {
  try {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
  } catch (err) {
    console.error('Failed to save appointments to localStorage:', err);
  }
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: loadAppointments(),
  activeFilterTab: 'upcoming',

  setActiveFilterTab: (tab) => set({ activeFilterTab: tab }),

  createAppointment: (data) => {
    const now = new Date().toISOString();
    const id = `apt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newAppointment: Appointment = {
      ...data,
      id,
      status: 'upcoming',
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newAppointment, ...get().appointments];
    set({ appointments: updated });
    persistAppointments(updated);
    return newAppointment;
  },

  cancelAppointment: (id, reason) => {
    const now = new Date().toISOString();
    const updated = get().appointments.map((apt) => {
      if (apt.id === id) {
        return {
          ...apt,
          status: 'cancelled' as AppointmentStatus,
          cancelReason: reason,
          updatedAt: now,
        };
      }
      return apt;
    });

    set({ appointments: updated });
    persistAppointments(updated);
  },

  rescheduleAppointment: (id, newDateStr, newStartTime, newEndTime) => {
    const now = new Date().toISOString();
    const updated = get().appointments.map((apt) => {
      if (apt.id === id) {
        const history = apt.rescheduleHistory || [];
        return {
          ...apt,
          dateStr: newDateStr,
          startTime: newStartTime,
          endTime: newEndTime,
          status: 'upcoming' as AppointmentStatus,
          updatedAt: now,
          rescheduleHistory: [
            ...history,
            {
              previousDate: apt.dateStr,
              previousTime: apt.startTime,
              rescheduledAt: now,
            },
          ],
        };
      }
      return apt;
    });

    set({ appointments: updated });
    persistAppointments(updated);
  },

  getAppointmentById: (id) => {
    return get().appointments.find((apt) => apt.id === id);
  },

  getDoctorBookedSlots: (doctorId, dateStr) => {
    return get()
      .appointments.filter(
        (apt) =>
          apt.doctorId === doctorId &&
          apt.dateStr === dateStr &&
          apt.status !== 'cancelled'
      )
      .map((apt) => apt.startTime);
  },
}));
