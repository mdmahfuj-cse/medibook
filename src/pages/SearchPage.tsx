import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Stethoscope,
  Frown,
  RotateCcw,
  Sparkles,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Video,
} from 'lucide-react';
import { useUIStore } from '../stores/useUIStore';
import { useSearchStore } from '../stores/useSearchStore';
import { useBookingStore } from '../stores/useBookingStore';
import { useDebounce } from '../hooks/useDebounce';
import { MOCK_DOCTORS } from '../data/mockDoctors';
import { Doctor, SortOption } from '../types';
import { DoctorCard } from '../components/search/DoctorCard';
import { SearchFilters } from '../components/search/SearchFilters';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { getSpecialtyIcon } from '../utils/specialtyIcons';

const ITEMS_PER_PAGE = 6;

export function SearchPage() {
  const { currentRoute, navigate } = useUIStore();
  const {
    query,
    specialty,
    location,
    minRating,
    maxFee,
    telehealthOnly,
    acceptingNewPatientsOnly,
    availableTodayOnly,
    sortBy,
    setQuery,
    setSpecialty,
    setLocation,
    setMinRating,
    setMaxFee,
    setTelehealthOnly,
    setAcceptingNewPatientsOnly,
    setAvailableTodayOnly,
    setSortBy,
    resetFilters,
  } = useSearchStore();

  const { initBooking } = useBookingStore();

  // Local state for instant input handling, debounced for filtering
  const [searchInput, setSearchInput] = useState(query);
  const debouncedSearch = useDebounce(searchInput, 300);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync debounced search to global store
  useEffect(() => {
    setQuery(debouncedSearch);
    setCurrentPage(1); // Reset page on query change
  }, [debouncedSearch, setQuery]);

  // Read URL query params on mount or route change if present
  useEffect(() => {
    if (currentRoute.path === '/search' && currentRoute.query) {
      const q = currentRoute.query;
      if (q.query !== undefined) {
        setSearchInput(q.query);
        setQuery(q.query);
      }
      if (q.specialty !== undefined) setSpecialty(q.specialty);
      if (q.location !== undefined) setLocation(q.location);
    }
  }, [currentRoute]);

  // Compute Active Filter Count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (specialty !== 'All') count++;
    if (location !== 'All') count++;
    if (minRating > 0) count++;
    if (maxFee < 2500) count++;
    if (telehealthOnly) count++;
    if (acceptingNewPatientsOnly) count++;
    if (availableTodayOnly) count++;
    return count;
  }, [
    specialty,
    location,
    minRating,
    maxFee,
    telehealthOnly,
    acceptingNewPatientsOnly,
    availableTodayOnly,
  ]);

  const hasActiveFilters = activeFilterCount > 0 || searchInput.trim().length > 0;

  // Filter and Sort Doctors
  const filteredDoctors = useMemo(() => {
    return MOCK_DOCTORS.filter((doc) => {
      // 1. Text Search (Name, Specialty, Clinic Name, Conditions, Bio)
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(q);
        const matchesSpec = doc.specialty.toLowerCase().includes(q);
        const matchesClinic = doc.clinic.name.toLowerCase().includes(q);
        const matchesCity = doc.clinic.city.toLowerCase().includes(q);
        const matchesBio = doc.about.toLowerCase().includes(q);
        const matchesQuals = doc.qualifications.some((qual) =>
          qual.toLowerCase().includes(q)
        );

        if (
          !matchesName &&
          !matchesSpec &&
          !matchesClinic &&
          !matchesCity &&
          !matchesBio &&
          !matchesQuals
        ) {
          return false;
        }
      }

      // 2. Specialty Filter
      if (specialty !== 'All' && doc.specialty !== specialty) {
        return false;
      }

      // 3. Location Filter
      if (location !== 'All' && doc.clinic.city !== location) {
        return false;
      }

      // 4. Rating Filter
      if (minRating > 0 && doc.rating < minRating) {
        return false;
      }

      // 5. Fee Filter
      if (doc.consultationFee > maxFee) {
        return false;
      }

      // 6. Telehealth Filter
      if (telehealthOnly && !doc.telehealthAvailable) {
        return false;
      }

      // 7. Accepting New Patients
      if (acceptingNewPatientsOnly && !doc.acceptingNewPatients) {
        return false;
      }

      // 8. Available Today
      if (availableTodayOnly) {
        // Deterministic mock logic: doctors with even IDs have slots today
        const docNum = parseInt(doc.id.replace('doc-', ''), 10) || 0;
        if (docNum % 2 !== 0) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Sorting Logic
      switch (sortBy) {
        case 'rating-desc':
          return b.rating - a.rating;
        case 'experience-desc':
          return b.experienceYears - a.experienceYears;
        case 'fee-asc':
          return a.consultationFee - b.consultationFee;
        case 'fee-desc':
          return b.consultationFee - a.consultationFee;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'availability-asc':
        default:
          // Default: higher rating with high reviews first
          return b.rating * b.reviewCount - a.rating * a.reviewCount;
      }
    });
  }, [
    debouncedSearch,
    specialty,
    location,
    minRating,
    maxFee,
    telehealthOnly,
    acceptingNewPatientsOnly,
    availableTodayOnly,
    sortBy,
  ]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE) || 1;
  const paginatedDoctors = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDoctors.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredDoctors, currentPage]);

  const handleClearAll = () => {
    setSearchInput('');
    resetFilters();
    setCurrentPage(1);
  };

  const handleBook = (doctor: Doctor) => {
    initBooking(doctor);
    navigate({ path: '/book/:id', id: doctor.id });
  };

  const handleViewProfile = (doctorId: string) => {
    navigate({ path: '/doctors/:id', id: doctorId });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Banner / Breadcrumb Heading */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1C231F]">
              Find & Book Doctors
            </h1>
            <p className="text-sm text-[#5F6F65] mt-1">
              Browse board-certified specialists with verified ratings and instant online scheduling.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Filter Toggle Button */}
            <Button
              variant="outline"
              size="md"
              className="lg:hidden flex items-center gap-2"
              onClick={() => setIsMobileFilterOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <Badge variant="woodland" size="sm">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Search Bar Row */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#808D7C]" />
            <input
              type="text"
              placeholder="Search by doctor name, specialty, condition, clinic, or degree..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-xl border border-[#C4CFC0] bg-white pl-10 pr-10 py-3 text-sm text-[#1C231F] placeholder:text-[#808D7C]/80 focus:border-[#5F6F65] focus:outline-none focus:ring-2 focus:ring-[#5F6F65]/15 shadow-xs transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#808D7C] hover:bg-[#F0F4ED] hover:text-[#1C231F]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative w-full sm:w-auto">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#808D7C] pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full appearance-none rounded-xl border border-[#C4CFC0] bg-white pl-9 pr-8 py-3 text-sm text-[#1C231F] font-medium focus:border-[#5F6F65] focus:outline-none focus:ring-2 focus:ring-[#5F6F65]/15 shadow-xs cursor-pointer"
              >
                <option value="availability-asc">Recommended</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="experience-desc">Most Experienced</option>
                <option value="fee-asc">Fee: Low to High</option>
                <option value="fee-desc">Fee: High to Low</option>
                <option value="name-asc">Doctor Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-[#5F6F65]">Active filters:</span>

            {debouncedSearch && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#F0F4ED] border border-[#C4CFC0] px-2.5 py-1 text-xs text-[#1C231F]">
                Search: "{debouncedSearch}"
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {specialty !== 'All' && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#F0F4ED] border border-[#C4CFC0] px-2.5 py-1 text-xs text-[#1C231F]">
                Specialty: {specialty}
                <button
                  type="button"
                  onClick={() => setSpecialty('All')}
                  className="hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {location !== 'All' && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#F0F4ED] border border-[#C4CFC0] px-2.5 py-1 text-xs text-[#1C231F]">
                Location: {location}
                <button
                  type="button"
                  onClick={() => setLocation('All')}
                  className="hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {minRating > 0 && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#F0F4ED] border border-[#C4CFC0] px-2.5 py-1 text-xs text-[#1C231F]">
                Rating: {minRating}+
                <button
                  type="button"
                  onClick={() => setMinRating(0)}
                  className="hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {maxFee < 350 && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#F0F4ED] border border-[#C4CFC0] px-2.5 py-1 text-xs text-[#1C231F]">
                Max Fee: ${maxFee}
                <button
                  type="button"
                  onClick={() => setMaxFee(350)}
                  className="hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {telehealthOnly && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#F0F4ED] border border-[#C4CFC0] px-2.5 py-1 text-xs text-[#1C231F]">
                Telehealth Only
                <button
                  type="button"
                  onClick={() => setTelehealthOnly(false)}
                  className="hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {acceptingNewPatientsOnly && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#F0F4ED] border border-[#C4CFC0] px-2.5 py-1 text-xs text-[#1C231F]">
                Accepting Patients
                <button
                  type="button"
                  onClick={() => setAcceptingNewPatientsOnly(false)}
                  className="hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {availableTodayOnly && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#F0F4ED] border border-[#C4CFC0] px-2.5 py-1 text-xs text-[#1C231F]">
                Available Today
                <button
                  type="button"
                  onClick={() => setAvailableTodayOnly(false)}
                  className="hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-[#5F6F65] underline hover:text-[#1C231F] font-semibold ml-2 cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main Content Layout (Sidebar + Results) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Filter Sidebar */}
        <SearchFilters
          specialty={specialty}
          setSpecialty={setSpecialty}
          location={location}
          setLocation={setLocation}
          minRating={minRating}
          setMinRating={setMinRating}
          maxFee={maxFee}
          setMaxFee={setMaxFee}
          telehealthOnly={telehealthOnly}
          setTelehealthOnly={setTelehealthOnly}
          acceptingNewPatientsOnly={acceptingNewPatientsOnly}
          setAcceptingNewPatientsOnly={setAcceptingNewPatientsOnly}
          availableTodayOnly={availableTodayOnly}
          setAvailableTodayOnly={setAvailableTodayOnly}
          onReset={handleClearAll}
          hasActiveFilters={hasActiveFilters}
          activeFilterCount={activeFilterCount}
          isMobileOpen={isMobileFilterOpen}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />

        {/* Results Area */}
        <div className="flex-1 w-full min-w-0">
          {/* Results Count Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E2E8DF]">
            <span className="text-sm font-semibold text-[#1C231F]">
              Showing{' '}
              <span className="font-bold text-[#5F6F65]">
                {filteredDoctors.length}
              </span>{' '}
              {filteredDoctors.length === 1 ? 'doctor' : 'doctors'}
            </span>

            {filteredDoctors.length > 0 && (
              <span className="text-xs text-[#808D7C]">
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>

          {/* Doctors List or Empty State */}
          {filteredDoctors.length > 0 ? (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {paginatedDoctors.map((doc) => (
                  <motion.div
                    key={doc.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DoctorCard
                      doctor={doc}
                      onBook={handleBook}
                      onViewProfile={handleViewProfile}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 pt-6 border-t border-[#E2E8DF] flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    leftIcon={<ChevronLeft className="h-4 w-4" />}
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      const isCurrent = currentPage === pageNum;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            isCurrent
                              ? 'bg-[#5F6F65] text-white'
                              : 'bg-white border border-[#E2E8DF] text-[#2B352F] hover:bg-[#F0F4ED]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    rightIcon={<ChevronRight className="h-4 w-4" />}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-3xl border border-[#C4CFC0] bg-white p-12 text-center my-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0F4ED] text-[#5F6F65] mb-4">
                <Frown className="h-7 w-7" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-[#1C231F]">
                No matching physicians found
              </h3>
              <p className="mt-2 text-sm text-[#5F6F65] max-w-md mx-auto leading-relaxed">
                We couldn't find any doctors matching your criteria. Try adjusting your search query, clearing filters, or broadening your location.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleClearAll}
                  leftIcon={<RotateCcw className="h-4 w-4" />}
                >
                  Reset All Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
