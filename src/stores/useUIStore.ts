import { create } from 'zustand';
import { AppRoute } from '../types';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
}

interface UIState {
  currentRoute: AppRoute;
  selectedTimezone: string;
  isMobileMenuOpen: boolean;
  toasts: ToastMessage[];
  savedDoctorIds: string[];
  
  // Actions
  navigate: (route: AppRoute) => void;
  setTimezone: (tz: string) => void;
  toggleMobileMenu: (open?: boolean) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  toggleFavoriteDoctor: (id: string) => void;
}

// Common realistic timezones
export const AVAILABLE_TIMEZONES = [
  { value: 'Asia/Dhaka', label: 'Bangladesh Standard Time (BST)', offset: 'UTC+6' },
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST)', offset: 'UTC+5:30' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST)', offset: 'UTC+4' },
  { value: 'Europe/London', label: 'London (GMT/BST)', offset: 'UTC+1' },
  { value: 'Europe/Paris', label: 'Central Europe (CET)', offset: 'UTC+2' },
  { value: 'America/New_York', label: 'Eastern Time (ET)', offset: 'UTC-4' },
  { value: 'America/Chicago', label: 'Central Time (CT)', offset: 'UTC-5' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', offset: 'UTC-7' },
  { value: 'Asia/Tokyo', label: 'Japan Standard (JST)', offset: 'UTC+9' },
];

export const COMMON_TIMEZONES = AVAILABLE_TIMEZONES;

export const useUIStore = create<UIState>((set) => ({
  currentRoute: { path: '/' },
  selectedTimezone: 'Asia/Dhaka',
  isMobileMenuOpen: false,
  toasts: [],
  savedDoctorIds: ['doc-1'], // Seed Prof. Dr. M. A. Hashem

  navigate: (route: AppRoute) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    set({ currentRoute: route, isMobileMenuOpen: false });
  },

  setTimezone: (selectedTimezone: string) => set({ selectedTimezone }),

  toggleMobileMenu: (open) =>
    set((state) => ({
      isMobileMenuOpen: open !== undefined ? open : !state.isMobileMenuOpen,
    })),

  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { ...toast, id };
    
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    const duration = toast.duration || 4000;
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },

  removeToast: (id: string) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  toggleFavoriteDoctor: (id: string) =>
    set((state) => {
      const isSaved = state.savedDoctorIds.includes(id);
      const nextSaved = isSaved
        ? state.savedDoctorIds.filter((docId) => docId !== id)
        : [...state.savedDoctorIds, id];
      return { savedDoctorIds: nextSaved };
    }),
}));
