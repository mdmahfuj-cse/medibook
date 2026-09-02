import React from 'react';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Star,
  DollarSign,
  MapPin,
  Stethoscope,
  Video,
  CheckCircle2,
  Calendar,
  X,
} from 'lucide-react';
import { SPECIALTIES } from '../../data/mockDoctors';
import { SortOption } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface SearchFiltersProps {
  specialty: string;
  setSpecialty: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  minRating: number;
  setMinRating: (val: number) => void;
  maxFee: number;
  setMaxFee: (val: number) => void;
  telehealthOnly: boolean;
  setTelehealthOnly: (val: boolean) => void;
  acceptingNewPatientsOnly: boolean;
  setAcceptingNewPatientsOnly: (val: boolean) => void;
  availableTodayOnly: boolean;
  setAvailableTodayOnly: (val: boolean) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const CITIES = ['All', 'Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi'];

export function SearchFilters({
  specialty,
  setSpecialty,
  location,
  setLocation,
  minRating,
  setMinRating,
  maxFee,
  setMaxFee,
  telehealthOnly,
  setTelehealthOnly,
  acceptingNewPatientsOnly,
  setAcceptingNewPatientsOnly,
  availableTodayOnly,
  setAvailableTodayOnly,
  onReset,
  hasActiveFilters,
  activeFilterCount,
  isMobileOpen,
  onCloseMobile,
}: SearchFiltersProps) {
  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8DF]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#5F6F65]" />
          <h3 className="font-serif text-lg font-bold text-[#1C231F]">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="woodland" size="sm">
              {activeFilterCount}
            </Badge>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-[#5F6F65] hover:text-[#1C231F] font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            Reset all
          </button>
        )}
      </div>

      {/* Specialty Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] flex items-center gap-1.5">
          <Stethoscope className="h-3.5 w-3.5 text-[#808D7C]" />
          Medical Specialty
        </label>
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="w-full rounded-xl border border-[#C4CFC0] bg-white px-3 py-2 text-sm text-[#1C231F] font-medium focus:border-[#5F6F65] focus:outline-none focus:ring-1 focus:ring-[#5F6F65] cursor-pointer"
        >
          <option value="All">All Specialties ({SPECIALTIES.length})</option>
          {SPECIALTIES.map((spec) => (
            <option key={spec.name} value={spec.name}>
              {spec.name} ({spec.doctorCount})
            </option>
          ))}
        </select>
      </div>

      {/* Location Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-[#808D7C]" />
          City / Location
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CITIES.map((city) => {
            const isSelected = location === city;
            return (
              <button
                key={city}
                type="button"
                onClick={() => setLocation(city)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#5F6F65] text-white'
                    : 'bg-[#F0F4ED] text-[#2B352F] hover:bg-[#E7EFE3]'
                }`}
              >
                {city === 'All' ? 'All Cities' : city}
              </button>
            );
          })}
        </div>
      </div>

      {/* Maximum Fee Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] flex items-center gap-1.5">
            <span className="font-bold text-[#808D7C]">৳</span>
            Max Fee: ৳{maxFee}
          </label>
          <span className="text-xs text-[#808D7C]">৳500 - ৳2,500</span>
        </div>
        <input
          type="range"
          min={500}
          max={2500}
          step={100}
          value={maxFee}
          onChange={(e) => setMaxFee(Number(e.target.value))}
          className="w-full accent-[#5F6F65] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#808D7C]">
          <span>৳500</span>
          <span>৳1,500</span>
          <span>৳2,500</span>
        </div>
      </div>

      {/* Minimum Rating Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 text-[#808D7C]" />
          Minimum Rating
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: 'Any', val: 0 },
            { label: '4.5+', val: 4.5 },
            { label: '4.8+', val: 4.8 },
            { label: '4.9+', val: 4.9 },
          ].map((item) => {
            const isSelected = minRating === item.val;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setMinRating(item.val)}
                className={`flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#5F6F65] text-white shadow-xs'
                    : 'bg-[#F0F4ED] text-[#2B352F] hover:bg-[#E7EFE3]'
                }`}
              >
                {item.val > 0 && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggle Switches */}
      <div className="space-y-3 pt-2 border-t border-[#E2E8DF]">
        <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] block">
          Availability & Modality
        </label>

        {/* Telehealth */}
        <label className="flex items-center justify-between p-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF7] hover:bg-white hover:border-[#9CA986] transition-colors cursor-pointer">
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-[#5F6F65]" />
            <span className="text-xs font-medium text-[#1C231F]">Telehealth Visit</span>
          </div>
          <input
            type="checkbox"
            checked={telehealthOnly}
            onChange={(e) => setTelehealthOnly(e.target.checked)}
            className="h-4 w-4 rounded accent-[#5F6F65] cursor-pointer"
          />
        </label>

        {/* Accepting New Patients */}
        <label className="flex items-center justify-between p-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF7] hover:bg-white hover:border-[#9CA986] transition-colors cursor-pointer">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#5F6F65]" />
            <span className="text-xs font-medium text-[#1C231F]">Accepting Patients</span>
          </div>
          <input
            type="checkbox"
            checked={acceptingNewPatientsOnly}
            onChange={(e) => setAcceptingNewPatientsOnly(e.target.checked)}
            className="h-4 w-4 rounded accent-[#5F6F65] cursor-pointer"
          />
        </label>

        {/* Available Today */}
        <label className="flex items-center justify-between p-2.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF7] hover:bg-white hover:border-[#9CA986] transition-colors cursor-pointer">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#5F6F65]" />
            <span className="text-xs font-medium text-[#1C231F]">Available Today</span>
          </div>
          <input
            type="checkbox"
            checked={availableTodayOnly}
            onChange={(e) => setAvailableTodayOnly(e.target.checked)}
            className="h-4 w-4 rounded accent-[#5F6F65] cursor-pointer"
          />
        </label>
      </div>
    </div>
  );

  // Desktop sidebar wrapper
  return (
    <>
      <div className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 rounded-2xl border border-[#C4CFC0] bg-white p-5 shadow-xs">
          {content}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Slide-over panel */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white p-6 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8DF] mb-4">
              <span className="font-serif text-lg font-bold text-[#1C231F]">Search Filters</span>
              <button
                type="button"
                onClick={onCloseMobile}
                className="rounded-lg p-1.5 text-[#5F6F65] hover:bg-[#F0F4ED]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {content}

            <div className="mt-8 pt-4 border-t border-[#E2E8DF]">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center font-semibold"
                onClick={onCloseMobile}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
