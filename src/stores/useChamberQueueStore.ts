import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChamberQueue } from '../types/phase10';

export const INITIAL_QUEUES: ChamberQueue[] = [
  {
    appointmentId: 'apt-001',
    doctorName: 'Prof. Dr. Mohammad Rafiqul Islam',
    doctorSpecialty: 'Cardiology & Heart Specialist',
    doctorAvatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
    chamberName: 'Popular Diagnostic Centre, Dhanmondi',
    chamberRoom: 'Chamber #402, 4th Floor (Building B)',
    chamberAddress: 'House #16, Road #2, Dhanmondi R/A, Dhaka',
    appointmentDate: 'Today',
    shift: 'Evening',
    doctorStatus: 'in_chamber',
    currentServingSerial: 12,
    patientSerial: 16,
    totalSerialsBooked: 28,
    avgMinutesPerPatient: 6,
    gatePassToken: 'CHMB-DHN-402-16',
    emergencyCasesAhead: 0,
    lastUpdated: '1 min ago',
  },
  {
    appointmentId: 'apt-002',
    doctorName: 'Dr. Nusrat Jahan Chowdhury',
    doctorSpecialty: 'Gynecology & Obstetrics',
    doctorAvatarUrl: 'https://images.unsplash.com/photo-1594824813593-3561a38b5d38?auto=format&fit=crop&q=80&w=200',
    chamberName: 'Ibn Sina Diagnostic Centre, Dhanmondi',
    chamberRoom: 'Room #305, 3rd Floor',
    chamberAddress: 'House #48, Road #9/A, Dhanmondi, Dhaka',
    appointmentDate: 'Today',
    shift: 'Evening',
    doctorStatus: 'in_chamber',
    currentServingSerial: 8,
    patientSerial: 9,
    totalSerialsBooked: 22,
    avgMinutesPerPatient: 8,
    gatePassToken: 'CHMB-IBN-305-09',
    emergencyCasesAhead: 0,
    lastUpdated: 'Just now',
  },
  {
    appointmentId: 'apt-003',
    doctorName: 'Dr. Shahabuddin Ahmed',
    doctorSpecialty: 'Orthopedics & Spine Surgery',
    doctorAvatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200',
    chamberName: 'Square Hospital OPD Clinic',
    chamberRoom: 'OPD Suite 210, Level 2',
    chamberAddress: '18/F, Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath, Dhaka',
    appointmentDate: 'Tomorrow',
    shift: 'Morning',
    doctorStatus: 'arriving_soon',
    currentServingSerial: 1,
    patientSerial: 5,
    totalSerialsBooked: 18,
    avgMinutesPerPatient: 10,
    gatePassToken: 'CHMB-SQR-210-05',
    emergencyCasesAhead: 0,
    lastUpdated: '10 mins ago',
  },
];

interface ChamberQueueStore {
  queues: ChamberQueue[];
  activeAppointmentId: string;
  setActiveAppointmentId: (id: string) => void;
  advanceQueue: (appointmentId: string) => void;
  setDoctorStatus: (appointmentId: string, status: ChamberQueue['doctorStatus']) => void;
  resetQueue: (appointmentId: string) => void;
  audioAlertEnabled: boolean;
  setAudioAlertEnabled: (enabled: boolean) => void;
}

export const useChamberQueueStore = create<ChamberQueueStore>()(
  persist(
    (set, get) => ({
      queues: INITIAL_QUEUES,
      activeAppointmentId: INITIAL_QUEUES[0].appointmentId,
      setActiveAppointmentId: (id) => set({ activeAppointmentId: id }),

      advanceQueue: (appointmentId) => {
        set({
          queues: get().queues.map((q) => {
            if (q.appointmentId === appointmentId) {
              const nextServing = Math.min(q.currentServingSerial + 1, q.totalSerialsBooked);
              return {
                ...q,
                currentServingSerial: nextServing,
                lastUpdated: 'Just now',
              };
            }
            return q;
          }),
        });
      },

      setDoctorStatus: (appointmentId, status) => {
        set({
          queues: get().queues.map((q) =>
            q.appointmentId === appointmentId ? { ...q, doctorStatus: status, lastUpdated: 'Just now' } : q
          ),
        });
      },

      resetQueue: (appointmentId) => {
        set({
          queues: get().queues.map((q) =>
            q.appointmentId === appointmentId ? { ...q, currentServingSerial: 1, lastUpdated: 'Reset to #1' } : q
          ),
        });
      },

      audioAlertEnabled: true,
      setAudioAlertEnabled: (enabled) => set({ audioAlertEnabled: enabled }),
    }),
    {
      name: 'healthcare_chamber_queue_v10',
    }
  )
);
