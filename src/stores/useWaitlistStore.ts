import { create } from 'zustand';
import { WaitlistEntry } from '../types';

const WAITLIST_STORAGE_KEY = 'medibook_waitlist_v1';

interface WaitlistState {
  entries: WaitlistEntry[];
  addToWaitlist: (entry: Omit<WaitlistEntry, 'id' | 'createdAt' | 'status'>) => WaitlistEntry;
  getEntriesByDoctor: (doctorId: string) => WaitlistEntry[];
  removeEntry: (id: string) => void;
}

function loadWaitlist(): WaitlistEntry[] {
  try {
    const raw = localStorage.getItem(WAITLIST_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to parse waitlist from storage:', err);
  }
  return [];
}

function persistWaitlist(entries: WaitlistEntry[]) {
  try {
    localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(entries));
  } catch (err) {
    console.error('Failed to save waitlist:', err);
  }
}

export const useWaitlistStore = create<WaitlistState>((set, get) => ({
  entries: loadWaitlist(),

  addToWaitlist: (data) => {
    const newEntry: WaitlistEntry = {
      ...data,
      id: `wl-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    const updated = [newEntry, ...get().entries];
    set({ entries: updated });
    persistWaitlist(updated);
    return newEntry;
  },

  getEntriesByDoctor: (doctorId) => {
    return get().entries.filter((entry) => entry.doctorId === doctorId);
  },

  removeEntry: (id) => {
    const updated = get().entries.filter((entry) => entry.id !== id);
    set({ entries: updated });
    persistWaitlist(updated);
  },
}));
