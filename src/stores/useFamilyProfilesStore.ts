import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FamilyMemberProfile } from '../types/phase10';

export const INITIAL_FAMILY_PROFILES: FamilyMemberProfile[] = [
  {
    id: 'fam-tanvir',
    fullName: 'Tanvir Hossain',
    relationship: 'Self',
    gender: 'Male',
    dateOfBirth: '1990-05-14',
    age: 36,
    bloodGroup: 'B+',
    phone: '+880 1711-234567',
    emergencyContact: '+880 1819-876543 (Wife)',
    nationalIdOrBirthCert: '19902692019000124',
    allergies: ['Penicillin (Amoxicillin)', 'Sulfa Drugs'],
    chronicConditions: ['Primary Hypertension (Controlled)'],
    avatarBgColor: 'bg-emerald-600',
    avatarIcon: 'User',
    activePrescriptionsCount: 2,
    upcomingAppointmentsCount: 1,
  },
  {
    id: 'fam-nusrat',
    fullName: 'Dr. Nusrat Jahan',
    relationship: 'Spouse',
    gender: 'Female',
    dateOfBirth: '1993-09-22',
    age: 33,
    bloodGroup: 'O+',
    phone: '+880 1819-876543',
    emergencyContact: '+880 1711-234567 (Husband)',
    nationalIdOrBirthCert: '19932692019000456',
    allergies: ['Aspirin (Mild Gastric)'],
    chronicConditions: ['Migraine with Aura'],
    avatarBgColor: 'bg-rose-600',
    avatarIcon: 'Heart',
    activePrescriptionsCount: 1,
    upcomingAppointmentsCount: 1,
  },
  {
    id: 'fam-fatema',
    fullName: 'Fatema Begum (Mother)',
    relationship: 'Mother',
    gender: 'Female',
    dateOfBirth: '1958-03-10',
    age: 68,
    bloodGroup: 'O+',
    phone: '+880 1712-887766',
    emergencyContact: '+880 1711-234567 (Son)',
    nationalIdOrBirthCert: '19582692019000789',
    allergies: ['Ciprofloxacin', 'NSAIDs'],
    chronicConditions: ['Type-2 Diabetes Mellitus', 'Essential Hypertension', 'Osteoarthritis Knee'],
    avatarBgColor: 'bg-amber-600',
    avatarIcon: 'ShieldAlert',
    activePrescriptionsCount: 4,
    upcomingAppointmentsCount: 2,
  },
  {
    id: 'fam-ayan',
    fullName: 'Ayan Hossain (Son)',
    relationship: 'Son',
    gender: 'Male',
    dateOfBirth: '2020-11-05',
    age: 5,
    bloodGroup: 'B+',
    emergencyContact: '+880 1711-234567 (Father)',
    nationalIdOrBirthCert: 'BRN-20202692019000888',
    allergies: ['Peanuts (Mild Rash)'],
    chronicConditions: ['Childhood Asthma (Mild Reactive)'],
    avatarBgColor: 'bg-blue-600',
    avatarIcon: 'Smile',
    activePrescriptionsCount: 1,
    upcomingAppointmentsCount: 0,
  },
];

interface FamilyProfilesStore {
  profiles: FamilyMemberProfile[];
  activeProfileId: string;
  setActiveProfileId: (id: string) => void;
  getActiveProfile: () => FamilyMemberProfile;
  addProfile: (profile: FamilyMemberProfile) => void;
  updateProfile: (id: string, updates: Partial<FamilyMemberProfile>) => void;
  removeProfile: (id: string) => void;
}

export const useFamilyProfilesStore = create<FamilyProfilesStore>()(
  persist(
    (set, get) => ({
      profiles: INITIAL_FAMILY_PROFILES,
      activeProfileId: INITIAL_FAMILY_PROFILES[0].id,

      setActiveProfileId: (id) => set({ activeProfileId: id }),

      getActiveProfile: () => {
        const found = get().profiles.find((p) => p.id === get().activeProfileId);
        return found || get().profiles[0];
      },

      addProfile: (profile) => set({ profiles: [...get().profiles, profile] }),

      updateProfile: (id, updates) => {
        set({
          profiles: get().profiles.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        });
      },

      removeProfile: (id) => {
        if (id === get().profiles[0]?.id) return; // Cannot remove self
        set({
          profiles: get().profiles.filter((p) => p.id !== id),
          activeProfileId: get().activeProfileId === id ? get().profiles[0].id : get().activeProfileId,
        });
      },
    }),
    {
      name: 'healthcare_family_profiles_v10',
    }
  )
);
