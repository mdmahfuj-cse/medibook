import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Globe,
  Building2,
  Video,
  ChevronRight,
  AlertCircle,
  Bell,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Doctor, TimeSlot } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  getUpcomingAvailableDates,
  generateSlotsForDoctor,
  formatTimeSlot,
  formatTimeSlotInTimezone,
} from '../../utils/scheduleUtils';
import { useUIStore, COMMON_TIMEZONES } from '../../stores/useUIStore';
import { useAppointmentStore } from '../../stores/useAppointmentStore';

interface Step1DateTimeProps {
  doctor: Doctor;
  selectedDateStr: string | null;
  selectedSlot: TimeSlot | null;
  visitType: 'in-person' | 'telehealth';
  onDateChange: (dateStr: string) => void;
  onSlotChange: (slot: TimeSlot | null) => void;
  onVisitTypeChange: (type: 'in-person' | 'telehealth') => void;
  onContinue: () => void;
}

export function Step1DateTime({
  doctor,
  selectedDateStr,
  selectedSlot,
  visitType,
  onDateChange,
  onSlotChange,
  onVisitTypeChange,
  onContinue,
}: Step1DateTimeProps) {
  const { selectedTimezone, setTimezone, addToast } = useUIStore();
  const { getDoctorBookedSlots } = useAppointmentStore();

  // Upcoming 14 days
  const availableDates = useMemo(() => {
    return getUpcomingAvailableDates(doctor, 14);
  }, [doctor]);

  // Initial active date
  const activeDateStr =
    selectedDateStr ||
    availableDates.find((d) => d.isAvailable)?.dateStr ||
    availableDates[0]?.dateStr;

  // Real booked slot times from storage
  const bookedSlotTimes = useMemo(() => {
    return getDoctorBookedSlots(doctor.id, activeDateStr);
  }, [doctor.id, activeDateStr, getDoctorBookedSlots]);

  // Slots for the active date
  const slots = useMemo(() => {
    if (!activeDateStr) return [];
    return generateSlotsForDoctor(doctor, activeDateStr, bookedSlotTimes);
  }, [doctor, activeDateStr, bookedSlotTimes]);

  const morningSlots = slots.filter((s) => parseInt(s.startTime.split(':')[0], 10) < 12);
  const afternoonSlots = slots.filter((s) => {
    const hour = parseInt(s.startTime.split(':')[0], 10);
    return hour >= 12 && hour < 17;
  });
  const eveningSlots = slots.filter((s) => parseInt(s.startTime.split(':')[0], 10) >= 17);

  const availableSlotsCount = slots.filter((s) => s.isAvailable).length;

  const handleJoinWaitlist = () => {
    addToast({
      type: 'info',
      title: 'Joined Cancellation Waitlist',
      message: `You'll be alerted immediately if a slot opens up on ${activeDateStr}.`,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Visit Modality Selector */}
      <div className="rounded-3xl border border-[#C4CFC0] bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1C231F]">
              1. Select Appointment Modality
            </h3>
            <p className="text-xs text-[#5F6F65] mt-0.5">
              Choose how you would like to consult with {doctor.name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* In-Person Option */}
          <button
            type="button"
            onClick={() => onVisitTypeChange('in-person')}
            className={`flex items-start gap-4 rounded-2xl border p-4 text-left transition-all cursor-pointer ${
              visitType === 'in-person'
                ? 'border-[#5F6F65] bg-[#F0F4ED] ring-2 ring-[#5F6F65]/20 shadow-xs'
                : 'border-[#C4CFC0] bg-white hover:border-[#9CA986] hover:bg-[#F8FAF7]'
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                visitType === 'in-person'
                  ? 'bg-[#5F6F65] text-white'
                  : 'bg-[#E7EFE3] text-[#5F6F65]'
              }`}
            >
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1C231F]">In-Person Visit</span>
                {visitType === 'in-person' && (
                  <CheckCircle2 className="h-4 w-4 text-[#5F6F65]" />
                )}
              </div>
              <p className="text-xs text-[#5F6F65] mt-1 leading-relaxed">
                Meet face-to-face at {doctor.clinic.name}, {doctor.clinic.city}.
              </p>
            </div>
          </button>

          {/* Telehealth Video Option */}
          <button
            type="button"
            disabled={!doctor.telehealthAvailable}
            onClick={() => onVisitTypeChange('telehealth')}
            className={`flex items-start gap-4 rounded-2xl border p-4 text-left transition-all ${
              !doctor.telehealthAvailable
                ? 'opacity-50 border-[#E2E8DF] bg-gray-50 cursor-not-allowed'
                : visitType === 'telehealth'
                ? 'border-[#5F6F65] bg-[#F0F4ED] ring-2 ring-[#5F6F65]/20 shadow-xs cursor-pointer'
                : 'border-[#C4CFC0] bg-white hover:border-[#9CA986] hover:bg-[#F8FAF7] cursor-pointer'
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                visitType === 'telehealth'
                  ? 'bg-[#5F6F65] text-white'
                  : 'bg-[#E7EFE3] text-[#5F6F65]'
              }`}
            >
              <Video className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1C231F]">
                  Telehealth Video Consultation
                </span>
                {visitType === 'telehealth' && (
                  <CheckCircle2 className="h-4 w-4 text-[#5F6F65]" />
                )}
              </div>
              <p className="text-xs text-[#5F6F65] mt-1 leading-relaxed">
                {doctor.telehealthAvailable
                  ? 'Join secure HD video room from your phone, tablet, or browser.'
                  : 'Provider only accepts in-clinic appointments at this time.'}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Date & Timezone Selection */}
      <div className="rounded-3xl border border-[#C4CFC0] bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1C231F]">
              2. Select Date & Time Slot
            </h3>
            <p className="text-xs text-[#5F6F65] mt-0.5">
              Available slots for the next 14 business days
            </p>
          </div>

          {/* Timezone Switcher */}
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#808D7C] shrink-0" />
            <select
              value={selectedTimezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="rounded-xl border border-[#C4CFC0] bg-[#F8FAF7] px-3 py-1.5 text-xs font-semibold text-[#1C231F] focus:border-[#5F6F65] focus:outline-none cursor-pointer"
            >
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label} ({tz.offset})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Selector Strip */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#5F6F65]">
            <span className="font-bold uppercase tracking-wider text-[#5F6F65] flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5 text-[#808D7C]" />
              Select Day
            </span>
            <span>{availableSlotsCount} open times on selected date</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {availableDates.map((item) => {
              const isSelected = activeDateStr === item.dateStr;
              return (
                <button
                  key={item.dateStr}
                  type="button"
                  disabled={!item.isAvailable}
                  onClick={() => {
                    onDateChange(item.dateStr);
                    onSlotChange(null);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                    !item.isAvailable
                      ? 'opacity-40 border-[#E2E8DF] bg-gray-50 cursor-not-allowed'
                      : isSelected
                      ? 'border-[#5F6F65] bg-[#5F6F65] text-white shadow-sm cursor-pointer scale-102'
                      : 'border-[#C4CFC0] bg-white text-[#2B352F] hover:border-[#9CA986] hover:bg-[#F0F4ED] cursor-pointer'
                  }`}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider">
                    {item.dayName}
                  </span>
                  <span className="text-lg font-bold my-0.5">{item.dayNumber}</span>
                  <span className="text-[10px] opacity-90">{item.monthName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Slots Grid */}
        <div className="space-y-4 pt-2">
          {slots.length > 0 && availableSlotsCount > 0 ? (
            <div className="space-y-5">
              {/* Morning Slots */}
              {morningSlots.length > 0 && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#808D7C] block mb-2.5">
                    Morning (Before 12:00 PM)
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {morningSlots.map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={!slot.isAvailable}
                          onClick={() => onSlotChange(slot)}
                          className={`rounded-xl py-3 px-2 text-xs font-semibold text-center transition-all ${
                            !slot.isAvailable
                              ? 'bg-gray-100 text-gray-400 line-through cursor-not-allowed border border-transparent'
                              : isSelected
                              ? 'bg-[#5F6F65] text-white font-bold shadow-md cursor-pointer scale-102'
                              : 'bg-[#F0F4ED] text-[#1C231F] hover:bg-[#E7EFE3] hover:border-[#9CA986] border border-[#C4CFC0] cursor-pointer'
                          }`}
                        >
                          {formatTimeSlot(slot.startTime)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Afternoon Slots */}
              {afternoonSlots.length > 0 && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#808D7C] block mb-2.5">
                    Afternoon (12:00 PM – 5:00 PM)
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {afternoonSlots.map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={!slot.isAvailable}
                          onClick={() => onSlotChange(slot)}
                          className={`rounded-xl py-3 px-2 text-xs font-semibold text-center transition-all ${
                            !slot.isAvailable
                              ? 'bg-gray-100 text-gray-400 line-through cursor-not-allowed border border-transparent'
                              : isSelected
                              ? 'bg-[#5F6F65] text-white font-bold shadow-md cursor-pointer scale-102'
                              : 'bg-[#F0F4ED] text-[#1C231F] hover:bg-[#E7EFE3] hover:border-[#9CA986] border border-[#C4CFC0] cursor-pointer'
                          }`}
                        >
                          {formatTimeSlot(slot.startTime)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Evening Slots */}
              {eveningSlots.length > 0 && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#808D7C] block mb-2.5">
                    Evening (After 5:00 PM)
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {eveningSlots.map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={!slot.isAvailable}
                          onClick={() => onSlotChange(slot)}
                          className={`rounded-xl py-3 px-2 text-xs font-semibold text-center transition-all ${
                            !slot.isAvailable
                              ? 'bg-gray-100 text-gray-400 line-through cursor-not-allowed border border-transparent'
                              : isSelected
                              ? 'bg-[#5F6F65] text-white font-bold shadow-md cursor-pointer scale-102'
                              : 'bg-[#F0F4ED] text-[#1C231F] hover:bg-[#E7EFE3] hover:border-[#9CA986] border border-[#C4CFC0] cursor-pointer'
                          }`}
                        >
                          {formatTimeSlot(slot.startTime)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty slots state */
            <div className="rounded-2xl border border-dashed border-[#C4CFC0] bg-[#F8FAF7] p-8 text-center">
              <AlertCircle className="h-8 w-8 text-[#808D7C] mx-auto mb-2" />
              <h4 className="font-serif text-base font-bold text-[#1C231F]">
                No Appointments Available on {activeDateStr}
              </h4>
              <p className="text-xs text-[#5F6F65] mt-1 max-w-sm mx-auto">
                All regular booking slots are currently filled for this date or the provider is out of clinic.
              </p>
              <button
                type="button"
                onClick={handleJoinWaitlist}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-white border border-[#C4CFC0] px-4 py-2 text-xs font-semibold text-[#1C231F] hover:bg-[#E7EFE3] transition-colors cursor-pointer"
              >
                <Bell className="h-4 w-4 text-[#5F6F65]" />
                Join Cancellation Waitlist
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Selected Slot Callout & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="text-xs text-[#5F6F65]">
          {selectedSlot ? (
            <span className="flex items-center gap-1.5 font-medium text-[#1C231F]">
              <CheckCircle2 className="h-4 w-4 text-[#5F6F65]" />
              Selected: <strong>{activeDateStr}</strong> at{' '}
              <strong>{formatTimeSlot(selectedSlot.startTime)}</strong>
            </span>
          ) : (
            <span className="text-[#808D7C]">Please select an open time slot above to proceed.</span>
          )}
        </div>

        <Button
          variant="primary"
          size="lg"
          disabled={!selectedSlot}
          onClick={onContinue}
          rightIcon={<ChevronRight className="h-4 w-4" />}
          className="font-bold text-sm shadow-md"
        >
          Continue to Patient Info
        </Button>
      </div>
    </div>
  );
}
