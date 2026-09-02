import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Building2,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Zap,
  Sparkles,
  AlertCircle,
  Bell,
} from 'lucide-react';
import { Doctor, TimeSlot } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../lib/utils';
import {
  getUpcomingAvailableDates,
  generateSlotsForDoctor,
  formatTimeSlot,
} from '../../utils/scheduleUtils';
import { useUIStore } from '../../stores/useUIStore';
import { useBookingStore } from '../../stores/useBookingStore';
import { WaitlistModal } from '../appointments/WaitlistModal';

interface DoctorBookingSidebarProps {
  doctor: Doctor;
  onProceedToBooking: (slot?: TimeSlot, dateStr?: string) => void;
}

export function DoctorBookingSidebar({
  doctor,
  onProceedToBooking,
}: DoctorBookingSidebarProps) {
  const { addToast } = useUIStore();
  const { initBooking, setSelectedDateStr, setSelectedSlot } = useBookingStore();

  const [visitType, setVisitType] = useState<'in-person' | 'telehealth'>('in-person');
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);

  // Generate next 14 days
  const availableDates = useMemo(() => {
    return getUpcomingAvailableDates(doctor, 14);
  }, [doctor]);

  // Default to first working date
  const firstWorkingDate = availableDates.find((d) => d.isAvailable)?.dateStr || availableDates[0]?.dateStr;
  const [selectedDate, setSelectedDate] = useState<string>(firstWorkingDate);

  // Generate slots for selected date
  const slots = useMemo(() => {
    if (!selectedDate) return [];
    return generateSlotsForDoctor(doctor, selectedDate);
  }, [doctor, selectedDate]);

  const [selectedSlot, setSelectedSlotLocal] = useState<TimeSlot | null>(null);

  // Group slots by morning (before 12:00), afternoon (12:00 - 17:00), evening (17:00+)
  const morningSlots = slots.filter((s) => parseInt(s.startTime.split(':')[0], 10) < 12);
  const afternoonSlots = slots.filter((s) => {
    const hour = parseInt(s.startTime.split(':')[0], 10);
    return hour >= 12 && hour < 17;
  });
  const eveningSlots = slots.filter((s) => parseInt(s.startTime.split(':')[0], 10) >= 17);

  const availableSlotsCount = slots.filter((s) => s.isAvailable).length;

  const handleSelectSlot = (slot: TimeSlot) => {
    if (!slot.isAvailable) return;
    setSelectedSlotLocal(slot);
  };

  const handleContinue = () => {
    initBooking(doctor, selectedDate);
    setSelectedDateStr(selectedDate);
    if (selectedSlot) {
      setSelectedSlot(selectedSlot);
    }
    onProceedToBooking(selectedSlot || undefined, selectedDate);
  };

  const handleJoinWaitlist = () => {
    setShowWaitlistModal(true);
  };

  return (
    <div className="sticky top-24 rounded-3xl border border-[#C4CFC0] bg-white p-6 shadow-md space-y-6">
      {/* Header with Price */}
      <div className="flex items-baseline justify-between pb-4 border-b border-[#E2E8DF]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5F6F65]">
            Consultation Fee
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-serif text-3xl font-bold text-[#1C231F]">
              {formatCurrency(doctor.consultationFee)}
            </span>
            <span className="text-xs text-[#808D7C]">/ 30 min</span>
          </div>
        </div>

        <Badge variant="sage" size="sm">
          <Zap className="h-3 w-3 mr-1 inline" /> Instant Booking
        </Badge>
      </div>

      {/* Visit Modality Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] block">
          Appointment Modality
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setVisitType('in-person')}
            className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-semibold transition-all cursor-pointer ${
              visitType === 'in-person'
                ? 'border-[#5F6F65] bg-[#5F6F65] text-white shadow-xs'
                : 'border-[#E2E8DF] bg-[#F8FAF7] text-[#2B352F] hover:bg-[#E7EFE3]'
            }`}
          >
            <Building2 className="h-4 w-4" />
            In-Person Visit
          </button>

          <button
            type="button"
            disabled={!doctor.telehealthAvailable}
            onClick={() => setVisitType('telehealth')}
            className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
              !doctor.telehealthAvailable
                ? 'opacity-50 cursor-not-allowed border-[#E2E8DF] bg-gray-50 text-[#808D7C]'
                : visitType === 'telehealth'
                ? 'border-[#5F6F65] bg-[#5F6F65] text-white shadow-xs cursor-pointer'
                : 'border-[#E2E8DF] bg-[#F8FAF7] text-[#2B352F] hover:bg-[#E7EFE3] cursor-pointer'
            }`}
          >
            <Video className="h-4 w-4" />
            Video Visit
          </button>
        </div>
      </div>

      {/* Horizontal Date Picker Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-[#808D7C]" />
            Select Date
          </label>
          <span className="text-[11px] text-[#808D7C]">
            {availableSlotsCount} slots available
          </span>
        </div>

        {/* Scrollable date strip */}
        <div className="flex gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {availableDates.map((item) => {
            const isSelected = selectedDate === item.dateStr;
            return (
              <button
                key={item.dateStr}
                type="button"
                disabled={!item.isAvailable}
                onClick={() => {
                  setSelectedDate(item.dateStr);
                  setSelectedSlotLocal(null);
                }}
                className={`flex flex-col items-center justify-center min-w-[58px] py-2 px-1.5 rounded-xl border text-center transition-all ${
                  !item.isAvailable
                    ? 'opacity-40 border-[#E2E8DF] bg-gray-50 cursor-not-allowed'
                    : isSelected
                    ? 'border-[#5F6F65] bg-[#5F6F65] text-white shadow-sm cursor-pointer scale-105'
                    : 'border-[#C4CFC0] bg-white text-[#2B352F] hover:border-[#9CA986] hover:bg-[#F0F4ED] cursor-pointer'
                }`}
              >
                <span className="text-[10px] font-medium uppercase tracking-wider">
                  {item.dayName}
                </span>
                <span className="text-base font-bold my-0.5">{item.dayNumber}</span>
                <span className="text-[10px]">{item.monthName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Available Time Slots Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-[#808D7C]" />
            Available Time Slots
          </label>
          <span className="text-[10px] text-[#808D7C]">
            Timezone: {doctor.scheduleConfig.timezone.split('/')[1]?.replace('_', ' ') || 'Local'}
          </span>
        </div>

        {slots.length > 0 && availableSlotsCount > 0 ? (
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {/* Morning */}
            {morningSlots.length > 0 && (
              <div>
                <span className="text-[10px] font-bold text-[#808D7C] uppercase tracking-wider block mb-1.5">
                  Morning
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {morningSlots.map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={!slot.isAvailable}
                        onClick={() => handleSelectSlot(slot)}
                        className={`rounded-lg py-2 px-1 text-xs font-medium text-center transition-all ${
                          !slot.isAvailable
                            ? 'bg-gray-100 text-gray-400 line-through cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#5F6F65] text-white font-bold shadow-xs cursor-pointer'
                            : 'bg-[#F0F4ED] text-[#1C231F] hover:bg-[#E7EFE3] hover:border-[#9CA986] border border-[#E2E8DF] cursor-pointer'
                        }`}
                      >
                        {formatTimeSlot(slot.startTime)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Afternoon */}
            {afternoonSlots.length > 0 && (
              <div>
                <span className="text-[10px] font-bold text-[#808D7C] uppercase tracking-wider block mb-1.5">
                  Afternoon
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {afternoonSlots.map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={!slot.isAvailable}
                        onClick={() => handleSelectSlot(slot)}
                        className={`rounded-lg py-2 px-1 text-xs font-medium text-center transition-all ${
                          !slot.isAvailable
                            ? 'bg-gray-100 text-gray-400 line-through cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#5F6F65] text-white font-bold shadow-xs cursor-pointer'
                            : 'bg-[#F0F4ED] text-[#1C231F] hover:bg-[#E7EFE3] hover:border-[#9CA986] border border-[#E2E8DF] cursor-pointer'
                        }`}
                      >
                        {formatTimeSlot(slot.startTime)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Evening */}
            {eveningSlots.length > 0 && (
              <div>
                <span className="text-[10px] font-bold text-[#808D7C] uppercase tracking-wider block mb-1.5">
                  Evening
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {eveningSlots.map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={!slot.isAvailable}
                        onClick={() => handleSelectSlot(slot)}
                        className={`rounded-lg py-2 px-1 text-xs font-medium text-center transition-all ${
                          !slot.isAvailable
                            ? 'bg-gray-100 text-gray-400 line-through cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#5F6F65] text-white font-bold shadow-xs cursor-pointer'
                            : 'bg-[#F0F4ED] text-[#1C231F] hover:bg-[#E7EFE3] hover:border-[#9CA986] border border-[#E2E8DF] cursor-pointer'
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
          /* No slots on this day */
          <div className="rounded-2xl border border-dashed border-[#C4CFC0] bg-[#F8FAF7] p-4 text-center">
            <AlertCircle className="h-5 w-5 text-[#808D7C] mx-auto mb-1.5" />
            <p className="text-xs font-medium text-[#1C231F]">No open slots for this date</p>
            <p className="text-[11px] text-[#5F6F65] mt-0.5">
              Doctor is off-duty or all appointments are filled.
            </p>
            <button
              type="button"
              onClick={handleJoinWaitlist}
              className="mt-3 inline-flex items-center gap-1 rounded-lg bg-white border border-[#C4CFC0] px-3 py-1.5 text-xs font-semibold text-[#5F6F65] hover:bg-[#E7EFE3] transition-colors cursor-pointer"
            >
              <Bell className="h-3.5 w-3.5 text-[#5F6F65]" />
              Get Cancellation Alert
            </button>
          </div>
        )}
      </div>

      {/* Selected Slot Summary Callout */}
      {selectedSlot && (
        <div className="rounded-2xl border border-[#9CA986] bg-[#F0F4ED] p-3.5 flex items-center justify-between text-xs animate-in fade-in duration-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F6F65] block">
              Selected Appointment
            </span>
            <span className="font-bold text-[#1C231F]">
              {selectedDate} at {formatTimeSlot(selectedSlot.startTime)}
            </span>
          </div>
          <Badge variant="woodland" size="sm">
            {visitType === 'in-person' ? 'Clinic Visit' : 'Video Visit'}
          </Badge>
        </div>
      )}

      {/* CTA Button */}
      <div className="pt-2">
        <Button
          variant="primary"
          size="lg"
          className="w-full justify-center font-bold text-sm shadow-md"
          onClick={handleContinue}
          rightIcon={<ChevronRight className="h-4 w-4" />}
        >
          {selectedSlot ? 'Proceed to Patient Details' : 'Select Slot & Book'}
        </Button>

        <p className="text-[11px] text-[#808D7C] text-center mt-2.5">
          Free cancellation up to 24 hours prior to appointment.
        </p>
      </div>

      {showWaitlistModal && (
        <WaitlistModal
          doctor={doctor}
          onClose={() => setShowWaitlistModal(false)}
        />
      )}
    </div>
  );
}
