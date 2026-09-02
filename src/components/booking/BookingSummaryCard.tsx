import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  Video,
  ShieldCheck,
  CreditCard,
  User,
  Zap,
  Tag,
} from 'lucide-react';
import { Doctor, TimeSlot, PatientDetails } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { formatTimeSlot } from '../../utils/scheduleUtils';
import { useBookingStore } from '../../stores/useBookingStore';
import { Badge } from '../ui/Badge';

interface BookingSummaryCardProps {
  doctor: Doctor;
  selectedDateStr: string | null;
  selectedSlot: TimeSlot | null;
  patientDetails?: PatientDetails;
  visitType?: 'in-person' | 'telehealth';
  onChangeSlot?: () => void;
  showFeeBreakdown?: boolean;
}

export function BookingSummaryCard({
  doctor,
  selectedDateStr,
  selectedSlot,
  patientDetails,
  visitType = 'in-person',
  onChangeSlot,
  showFeeBreakdown = true,
}: BookingSummaryCardProps) {
  const { appliedPromo } = useBookingStore();
  const isVideo = visitType === 'telehealth';

  const discount = appliedPromo ? appliedPromo.discountAmount : 0;
  const total = Math.max(0, doctor.consultationFee - discount);

  return (
    <div className="sticky top-24 rounded-3xl border border-[#C4CFC0] bg-white p-6 shadow-sm space-y-6">
      {/* Card Title */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8DF]">
        <h3 className="font-serif text-lg font-bold text-[#1C231F]">
          Booking Summary
        </h3>
        <Badge variant="sage" size="sm">
          <Zap className="h-3 w-3 mr-1 inline" /> Instant Booking
        </Badge>
      </div>

      {/* Doctor Mini Profile */}
      <div className="flex items-start gap-4">
        <img
          src={doctor.avatar}
          alt={doctor.name}
          className="h-16 w-16 rounded-2xl object-cover border border-[#E2E8DF] shrink-0"
        />
        <div className="min-w-0 flex-1">
          <Badge variant="sage" size="sm" className="mb-1">
            {doctor.specialty}
          </Badge>
          <h4 className="font-serif text-base font-bold text-[#1C231F] truncate">
            {doctor.name}
          </h4>
          <p className="text-xs text-[#5F6F65] truncate mt-0.5">{doctor.title}</p>
        </div>
      </div>

      {/* Appointment Logistics Box */}
      <div className="rounded-2xl border border-[#E2E8DF] bg-[#F8FAF7] p-4 space-y-3 text-xs">
        {/* Modality */}
        <div className="flex items-center justify-between">
          <span className="text-[#808D7C] font-medium flex items-center gap-1.5">
            {isVideo ? (
              <Video className="h-3.5 w-3.5 text-[#5F6F65]" />
            ) : (
              <Building2 className="h-3.5 w-3.5 text-[#5F6F65]" />
            )}
            Modality
          </span>
          <span className="font-bold text-[#1C231F]">
            {isVideo ? 'Telehealth Video Visit' : 'In-Person Clinic Visit'}
          </span>
        </div>

        {/* Date & Time */}
        <div className="flex items-center justify-between">
          <span className="text-[#808D7C] font-medium flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#5F6F65]" />
            Date & Time
          </span>
          <div className="text-right">
            {selectedDateStr && selectedSlot ? (
              <div>
                <span className="font-bold text-[#1C231F] block">
                  {selectedDateStr}
                </span>
                <span className="text-[#5F6F65]">
                  {formatTimeSlot(selectedSlot.startTime)} - {formatTimeSlot(selectedSlot.endTime)}
                </span>
              </div>
            ) : selectedDateStr ? (
              <span className="font-semibold text-amber-700">{selectedDateStr} (Slot pending)</span>
            ) : (
              <span className="text-[#808D7C] italic">Not selected</span>
            )}
          </div>
        </div>

        {/* Clinic Location (if in-person) */}
        {!isVideo && (
          <div className="pt-2 border-t border-[#E2E8DF]/60">
            <span className="text-[#808D7C] font-medium flex items-center gap-1.5 mb-1">
              <MapPin className="h-3.5 w-3.5 text-[#5F6F65]" />
              Clinic
            </span>
            <p className="font-semibold text-[#1C231F]">{doctor.clinic.name}</p>
            <p className="text-[#5F6F65] text-[11px]">
              {doctor.clinic.address}, {doctor.clinic.city}
            </p>
          </div>
        )}

        {/* Patient (if entered) */}
        {patientDetails?.fullName && (
          <div className="pt-2 border-t border-[#E2E8DF]/60 flex items-center justify-between">
            <span className="text-[#808D7C] font-medium flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-[#5F6F65]" />
              Patient
            </span>
            <span className="font-bold text-[#1C231F] truncate max-w-[140px]">
              {patientDetails.fullName}
            </span>
          </div>
        )}

        {onChangeSlot && (
          <button
            type="button"
            onClick={onChangeSlot}
            className="w-full text-center text-xs font-semibold text-[#5F6F65] hover:text-[#1C231F] hover:underline pt-1 cursor-pointer"
          >
            Change date or time slot
          </button>
        )}
      </div>

      {/* Fee Breakdown */}
      {showFeeBreakdown && (
        <div className="space-y-2.5 pt-2 border-t border-[#E2E8DF] text-xs">
          <div className="flex items-center justify-between text-[#5F6F65]">
            <span>Consultation Rate (30m)</span>
            <span className="font-mono font-medium text-[#1C231F]">
              {formatCurrency(doctor.consultationFee)}
            </span>
          </div>

          {appliedPromo && (
            <div className="flex items-center justify-between text-emerald-700 font-medium">
              <span className="flex items-center gap-1">
                <Tag className="h-3 w-3" /> Promo: {appliedPromo.code}
              </span>
              <span className="font-mono">-${appliedPromo.discountAmount}.00</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[#5F6F65]">
            <span>Platform Service & HIPAA Fee</span>
            <span className="text-emerald-700 font-semibold font-mono">FREE ($0.00)</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#E2E8DF] text-sm font-bold text-[#1C231F]">
            <span>Estimated Total</span>
            <span className="font-mono text-base text-[#5F6F65]">
              {formatCurrency(total)}
            </span>
          </div>

          <p className="text-[11px] text-[#808D7C] leading-tight">
            *Insurance co-pay or self-pay processed at clinic check-in or via selected payment method.
          </p>
        </div>
      )}

      {/* Trust & Guarantee */}
      <div className="rounded-2xl bg-[#F0F4ED] p-3.5 flex items-start gap-2.5 text-xs text-[#5F6F65]">
        <ShieldCheck className="h-4 w-4 text-[#5F6F65] shrink-0 mt-0.5" />
        <div className="text-[11px] leading-relaxed">
          <strong className="text-[#1C231F] block">Peace of Mind Guarantee</strong>
          100% free cancellation up to 24 hours prior to visit.
        </div>
      </div>
    </div>
  );
}
