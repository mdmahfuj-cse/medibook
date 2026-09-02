import { create } from 'zustand';
import { SearchFilters, SortOption } from '../types';

interface SearchState {
  filters: SearchFilters;
  currentPage: number;
  pageSize: number;

  // Convenient Getters/Actions
  query: string;
  specialty: string;
  location: string;
  minRating: number;
  maxFee: number;
  minExperience: number;
  telehealthOnly: boolean;
  acceptingNewPatientsOnly: boolean;
  availableTodayOnly: boolean;
  sortBy: SortOption;

  setQuery: (query: string) => void;
  setSpecialty: (specialty: string) => void;
  setLocation: (location: string) => void;
  setAvailabilityDate: (date?: string) => void;
  setFeeRange: (min: number, max: number) => void;
  setMaxFee: (max: number) => void;
  setMinRating: (rating: number) => void;
  setMinExperience: (years: number) => void;
  setTelehealthOnly: (val: boolean) => void;
  setAcceptingNewPatientsOnly: (val: boolean) => void;
  setAvailableTodayOnly: (val: boolean) => void;
  setSortBy: (sortBy: SortOption) => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;
  setAllFilters: (filters: Partial<SearchFilters>) => void;
}

const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  specialty: 'All',
  location: 'All',
  availabilityDate: undefined,
  minFee: 0,
  maxFee: 2500,
  minRating: 0,
  minExperience: 0,
  telehealthOnly: false,
  acceptingNewPatientsOnly: false,
  availableTodayOnly: false,
  sortBy: 'availability-asc',
};

export const useSearchStore = create<SearchState>((set) => ({
  filters: DEFAULT_FILTERS,
  currentPage: 1,
  pageSize: 6,

  // Direct getters mapped to initial defaults
  query: DEFAULT_FILTERS.query,
  specialty: DEFAULT_FILTERS.specialty,
  location: DEFAULT_FILTERS.location,
  minRating: DEFAULT_FILTERS.minRating,
  maxFee: DEFAULT_FILTERS.maxFee,
  minExperience: DEFAULT_FILTERS.minExperience,
  telehealthOnly: false,
  acceptingNewPatientsOnly: false,
  availableTodayOnly: false,
  sortBy: DEFAULT_FILTERS.sortBy,

  setQuery: (query) =>
    set((state) => ({
      query,
      filters: { ...state.filters, query },
      currentPage: 1,
    })),

  setSpecialty: (specialty) =>
    set((state) => ({
      specialty,
      filters: { ...state.filters, specialty },
      currentPage: 1,
    })),

  setLocation: (location) =>
    set((state) => ({
      location,
      filters: { ...state.filters, location },
      currentPage: 1,
    })),

  setAvailabilityDate: (availabilityDate) =>
    set((state) => ({
      filters: { ...state.filters, availabilityDate },
      currentPage: 1,
    })),

  setFeeRange: (minFee, maxFee) =>
    set((state) => ({
      maxFee,
      filters: { ...state.filters, minFee, maxFee },
      currentPage: 1,
    })),

  setMaxFee: (maxFee) =>
    set((state) => ({
      maxFee,
      filters: { ...state.filters, maxFee },
      currentPage: 1,
    })),

  setMinRating: (minRating) =>
    set((state) => ({
      minRating,
      filters: { ...state.filters, minRating },
      currentPage: 1,
    })),

  setMinExperience: (minExperience) =>
    set((state) => ({
      minExperience,
      filters: { ...state.filters, minExperience },
      currentPage: 1,
    })),

  setTelehealthOnly: (telehealthOnly) =>
    set((state) => ({
      telehealthOnly,
      filters: { ...state.filters, telehealthOnly },
      currentPage: 1,
    })),

  setAcceptingNewPatientsOnly: (acceptingNewPatientsOnly) =>
    set((state) => ({
      acceptingNewPatientsOnly,
      filters: { ...state.filters, acceptingNewPatientsOnly },
      currentPage: 1,
    })),

  setAvailableTodayOnly: (availableTodayOnly) =>
    set((state) => ({
      availableTodayOnly,
      filters: { ...state.filters, availableTodayOnly },
      currentPage: 1,
    })),

  setSortBy: (sortBy) =>
    set((state) => ({
      sortBy,
      filters: { ...state.filters, sortBy },
      currentPage: 1,
    })),

  setCurrentPage: (currentPage) => set({ currentPage }),

  resetFilters: () =>
    set({
      ...DEFAULT_FILTERS,
      filters: DEFAULT_FILTERS,
      currentPage: 1,
    }),

  setAllFilters: (newFilters) =>
    set((state) => {
      const merged = { ...state.filters, ...newFilters };
      return {
        ...merged,
        filters: merged,
        currentPage: 1,
      };
    }),
}));
