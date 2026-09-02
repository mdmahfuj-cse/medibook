import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  Video,
} from 'lucide-react';
import { Appointment, Doctor, TimeSlot } from '../../types';
import { DOCTORS } from '../../data/mockDoctors';
import { useAppointmentStore } from '../../stores/useAppointmentStore';
import { useUIStore } from '../../stores/useUIStore';
import {
  generateSlotsForDoctor,
  getUpcomingAvailableDates,
  formatTimeSlot,
  formatTimeSlotInTimezone,
} from '../../utils/scheduleUtils';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn, formatDateLong } from '../../lib/utils';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
}

export function RescheduleModal({ isOpen, onClose, appointment }: RescheduleModalProps) {
  const { rescheduleAppointment, getDoctorBookedSlots } = useAppointmentStore();
  const { selectedTimezone, addToast } = useUIStore();

  const doctor: Doctor | undefined = useMemo(() => {
    return DOCTORS.find((d) => d.id === appointment.doctorId) || {
      id: appointment.doctorId,
      name: appointment.doctorName,
      title: 'Attending Specialist',
      specialty: appointment.doctorSpecialty,
      avatar: appointment.doctorAvatar,
      rating: 4.9,
      reviewCount: 150,
      experienceYears: 12,
      consultationFee: appointment.consultationFee,
      hospitalAffiliation: appointment.clinic.name,
      acceptingNewPatients: true,
      telehealthAvailable: appointment.visitType === 'telehealth',
      featured: true,
      verified: true,
      clinic: appointment.clinic,
      about: '',
      education: [],
      qualifications: [],
      languages: ['English'],
      scheduleConfig: {
        workingDays: [1, 2, 3, 4, 5],
        shifts: [
          { start: '09:00', end: '13:00' },
          { start: '14:00', end: '18:00' },
        ],
        lunchBreak: { start: '13:00', end: '14:00' },
        slotDurationMinutes: 30,
        unavailableDates: [],
        timezone: appointment.timezone || 'America/New_York',
      },
    };
  }, [appointment]);

  // Next 14 available dates
  const availableDates = useMemo(() => {
    if (!doctor) return [];
    return getUpcomingAvailableDates(doctor, 14);
  }, [doctor]);

  // Local state for selected new date & slot
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    // Default to first upcoming working date or today
    const firstWorking = availableDates.find((d) => d.isAvailable && d.dateStr !== appointment.dateStr);
    return firstWorking ? firstWorking.dateStr : availableDates[0]?.dateStr || appointment.dateStr;
  });

  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState('Schedule Conflict');

  // Booked slots for selected doctor on chosen date
  const bookedSlots = useMemo(() => {
    if (!doctor) return [];
    return getDoctorBookedSlots(doctor.id, selectedDateStr);
  }, [doctor, selectedDateStr, getDoctorBookedSlots]);

  // Generate slots for selected date
  const slotsForDate = useMemo(() => {
    if (!doctor) return [];
    return generateSlotsForDoctor(doctor, selectedDateStr, bookedSlots);
  }, [doctor, selectedDateStr, bookedSlots]);

  const morningSlots = slotsForDate.filter((s) => parseInt(s.startTime.split(':')[0], 10) < 12);
  const afternoonSlots = slotsForDate.filter((s) => parseInt(s.startTime.split(':')[0], 10) >= 12);

  const handleConfirmReschedule = async () => {
    if (!selectedSlot) return;

    setIsSubmitting(true);
    try {
      // Simulate fast network update
      await new Promise((r) => setTimeout(r, 450));

      rescheduleAppointment(
        appointment.id,
        selectedSlot.dateStr,
        selectedSlot.startTime,
        selectedSlot.endTime
      );

      addToast({
        type: 'success',
        title: 'Appointment Rescheduled',
        message: `Successfully moved with ${appointment.doctorName} to ${formatDateLong(selectedSlot.dateStr)} at ${formatTimeSlot(selectedSlot.startTime)}.`,
      });

      onClose();
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Reschedule Failed',
        message: 'Could not update slot. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-[#5F6F65]" />
          <span>Reschedule Consultation</span>
        </div>
      }
      description={`Select a new available time slot with ${appointment.doctorName}. No rebooking fees apply.`}
    >
      <div className="space-y-6 pt-1">
        {/* Current vs New comparison banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#F8FAF7] border border-[#C4CFC0]/70">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#808D7C] block">
              Current Booking
            </span>
            <div className="font-semibold text-sm text-[#1C231F]">
              {formatDateLong(appointment.dateStr)}
            </div>
            <div className="text-xs text-[#5F6F65] flex items-center gap-1.5 font-mono">
              <Clock className="h-3.5 w-3.5" />
              {formatTimeSlot(appointment.startTime)} - {formatTimeSlot(appointment.endTime)}
            </div>
          </div>

          <div className="space-y-1 sm:border-l sm:border-[#E2E8DF] sm:pl-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5F6F65] block">
              New Requested Slot
            </span>
            {selectedSlot ? (
              <>
                <div className="font-bold text-sm text-emerald-800">
                  {formatDateLong(selectedSlot.dateStr)}
                </div>
                <div className="text-xs text-emerald-700 flex items-center gap-1.5 font-mono font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  {formatTimeSlot(selectedSlot.startTime)} - {formatTimeSlot(selectedSlot.endTime)}
                </div>
              </>
            ) : (
              <p className="text-xs text-[#808D7C] italic pt-1">
                Select a date and available time slot below
              </p>
            )}
          </div>
        </div>

        {/* Step 1: Select New Date */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#2B352F] flex items-center gap-1.5">
              <span>1. Choose New Date</span>
            </label>
            <span className="text-xs text-[#808D7C]">Next 14 Days</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin">
            {availableDates.map((dateObj) => {
              const isSelected = selectedDateStr === dateObj.dateStr;
              const isCurrentBookingDate = appointment.dateStr === dateObj.dateStr;

              return (
                <button
                  key={dateObj.dateStr}
                  type="button"
                  id={`reschedule-date-${dateObj.dateStr}`}
                  disabled={!dateObj.isAvailable}
                  onClick={() => {
                    setSelectedDateStr(dateObj.dateStr);
                    setSelectedSlot(null); // Reset slot on date change
                  }}
                  className={cn(
                    'flex min-w-[72px] flex-col items-center justify-center rounded-2xl border p-2.5 transition-all text-center cursor-pointer select-none shrink-0',
                    isSelected
                      ? 'border-[#5F6F65] bg-[#5F6F65] text-white shadow-sm ring-2 ring-[#5F6F65]/20'
                      : dateObj.isAvailable
                      ? 'border-[#C4CFC0] bg-white text-[#1C231F] hover:border-[#808D7C] hover:bg-[#F8FAF7]'
                      : 'border-transparent bg-neutral-100 text-neutral-400 opacity-40 cursor-not-allowed'
                  )}
                >
                  <span
                    className={cn(
                      'text-[10px] font-bold uppercase tracking-wider',
                      isSelected ? 'text-[#C9DABF]' : 'text-[#808D7C]'
                    )}
                  >
                    {dateObj.isToday ? 'Today' : dateObj.isTomorrow ? 'Tmrw' : dateObj.dayName}
                  </span>
                  <span className="text-base font-bold my-0.5">{dateObj.dayNumber}</span>
                  <span
                    className={cn(
                      'text-[9px]',
                      isSelected ? 'text-white/80' : 'text-[#808D7C]'
                    )}
                  >
                    {dateObj.monthName}
                  </span>

                  {isCurrentBookingDate && (
                    <span className="mt-1 text-[8px] font-semibold uppercase px-1 rounded bg-amber-100 text-amber-800">
                      Current
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Time Slot */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#2B352F]">
              2. Available Time Slots ({formatDateLong(selectedDateStr)})
            </label>
            <span className="text-[11px] text-[#808D7C] font-mono">
              TZ: {selectedTimezone.split('/')[1]?.replace('_', ' ') || selectedTimezone}
            </span>
          </div>

          {slotsForDate.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#C4CFC0] bg-[#F8FAF7] p-6 text-center text-xs text-[#5F6F65]">
              Doctor is not holding office hours on this selected date. Please choose another date above.
            </div>
          ) : (
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {/* Morning Group */}
              {morningSlots.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-[#808D7C] uppercase tracking-wider block mb-1.5">
                    Morning (Before 12:00 PM)
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {morningSlots.map((slot) => {
                      const isSelected =
                        selectedSlot?.dateStr === slot.dateStr &&
                        selectedSlot?.startTime === slot.startTime;
                      const isCurrent =
                        appointment.dateStr === slot.dateStr &&
                        appointment.startTime === slot.startTime;

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          id={`reschedule-slot-${slot.startTime}`}
                          disabled={!slot.isAvailable || isCurrent}
                          onClick={() => setSelectedSlot(slot)}
                          className={cn(
                            'rounded-xl border py-2 px-2.5 text-xs font-mono font-medium transition-all text-center cursor-pointer',
                            isSelected
                              ? 'border-[#5F6F65] bg-[#5F6F65] text-white shadow-xs font-bold'
                              : isCurrent
                              ? 'border-amber-300 bg-amber-50 text-amber-800 opacity-60 cursor-not-allowed'
                              : slot.isAvailable
                              ? 'border-[#C4CFC0] bg-white text-[#1C231F] hover:border-[#5F6F65] hover:bg-[#F0F4ED]'
                              : 'border-transparent bg-neutral-100 text-neutral-400 opacity-40 cursor-not-allowed'
                          )}
                        >
                          {formatTimeSlot(slot.startTime)}
                          {isCurrent && <span className="block text-[9px] font-sans">Current</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Afternoon Group */}
              {afternoonSlots.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-[#808D7C] uppercase tracking-wider block mb-1.5">
                    Afternoon / Evening (After 12:00 PM)
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {afternoonSlots.map((slot) => {
                      const isSelected =
                        selectedSlot?.dateStr === slot.dateStr &&
                        selectedSlot?.startTime === slot.startTime;
                      const isCurrent =
                        appointment.dateStr === slot.dateStr &&
                        appointment.startTime === slot.startTime;

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          id={`reschedule-slot-${slot.startTime}`}
                          disabled={!slot.isAvailable || isCurrent}
                          onClick={() => setSelectedSlot(slot)}
                          className={cn(
                            'rounded-xl border py-2 px-2.5 text-xs font-mono font-medium transition-all text-center cursor-pointer',
                            isSelected
                              ? 'border-[#5F6F65] bg-[#5F6F65] text-white shadow-xs font-bold'
                              : isCurrent
                              ? 'border-amber-300 bg-amber-50 text-amber-800 opacity-60 cursor-not-allowed'
                              : slot.isAvailable
                              ? 'border-[#C4CFC0] bg-white text-[#1C231F] hover:border-[#5F6F65] hover:bg-[#F0F4ED]'
                              : 'border-transparent bg-neutral-100 text-neutral-400 opacity-40 cursor-not-allowed'
                          )}
                        >
                          {formatTimeSlot(slot.startTime)}
                          {isCurrent && <span className="block text-[9px] font-sans">Current</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reason for Reschedule (Optional) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] block">
            Reason for Rescheduling (Optional)
          </label>
          <select
            value={rescheduleReason}
            onChange={(e) => setRescheduleReason(e.target.value)}
            className="w-full rounded-xl border border-[#C4CFC0] bg-white px-3 py-2 text-xs text-[#1C231F] focus:border-[#5F6F65] focus:outline-none"
          >
            <option value="Schedule Conflict">Schedule Conflict / Work Commitment</option>
            <option value="Personal / Travel">Personal / Travel Emergency</option>
            <option value="Preferred Earlier Time">Prefer different time of day</option>
            <option value="Doctor Follow-up Adjustment">Doctor Follow-up Adjustment</option>
            <option value="Other">Other Reason</option>
          </select>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E2E8DF]">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Keep Current Slot
          </Button>

          <Button
            type="button"
            id="confirm-reschedule-btn"
            variant="primary"
            size="sm"
            disabled={!selectedSlot || isSubmitting}
            onClick={handleConfirmReschedule}
          >
            {isSubmitting ? (
              'Confirming New Slot...'
            ) : selectedSlot ? (
              <span className="flex items-center gap-1.5">
                <span>Confirm Move to {formatTimeSlot(selectedSlot.startTime)}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            ) : (
              'Select a New Slot to Continue'
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
