import React from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  ShieldCheck,
  Video,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Appointment } from '../../types';
import { formatDateLong } from '../../lib/utils';
import { formatTimeSlot } from '../../utils/scheduleUtils';
import { Button } from '../ui/Button';

interface AppointmentsSummaryStatsProps {
  appointments: Appointment[];
  onBookNew: () => void;
  onViewNext: (appointment: Appointment) => void;
}

export function AppointmentsSummaryStats({
  appointments,
  onBookNew,
  onViewNext,
}: AppointmentsSummaryStatsProps) {
  const upcoming = appointments.filter((a) => a.status === 'upcoming');
  const completed = appointments.filter((a) => a.status === 'completed');
  const cancelled = appointments.filter((a) => a.status === 'cancelled');

  // Next chronological upcoming appointment
  const nextAppointment = [...upcoming].sort((a, b) => {
    const d1 = new Date(`${a.dateStr}T${a.startTime}`);
    const d2 = new Date(`${b.dateStr}T${b.startTime}`);
    return d1.getTime() - d2.getTime();
  })[0];

  const uniqueDoctorsCount = new Set(appointments.map((a) => a.doctorId)).size;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Next Upcoming Hero Banner */}
      <div className="lg:col-span-2 rounded-3xl border border-[#C4CFC0] bg-linear-to-br from-[#F8FAF7] via-white to-[#E7EFE3]/30 p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5F6F65]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              Next Scheduled Care
            </span>
            <span className="text-xs text-[#808D7C] font-mono">
              {upcoming.length} Upcoming Slot{upcoming.length === 1 ? '' : 's'}
            </span>
          </div>

          {nextAppointment ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <img
                  src={nextAppointment.doctorAvatar}
                  alt={nextAppointment.doctorName}
                  className="h-12 w-12 rounded-2xl object-cover border border-[#C4CFC0]"
                />
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1C231F]">
                    {nextAppointment.doctorName}
                  </h3>
                  <p className="text-xs text-[#5F6F65]">{nextAppointment.doctorSpecialty}</p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#1C231F] mt-1 font-mono">
                    <Calendar className="h-3.5 w-3.5 text-[#5F6F65]" />
                    <span>{formatDateLong(nextAppointment.dateStr)}</span>
                    <span>•</span>
                    <Clock className="h-3.5 w-3.5 text-[#808D7C]" />
                    <span>{formatTimeSlot(nextAppointment.startTime)}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => onViewNext(nextAppointment)}
                className="shrink-0"
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              >
                View Pass
              </Button>
            </div>
          ) : (
            <div className="py-2">
              <h4 className="font-serif text-base font-bold text-[#1C231F]">
                No upcoming consultations scheduled
              </h4>
              <p className="text-xs text-[#5F6F65] mt-1">
                Book a verified in-network specialist in under 60 seconds.
              </p>
              <div className="mt-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onBookNew}
                  leftIcon={<Sparkles className="h-3.5 w-3.5" />}
                >
                  Find a Doctor Now
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-[#E2E8DF] flex items-center justify-between text-xs text-[#808D7C]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
            HIPAA-Protected Medical Records
          </span>
          <span>Instant calendar sync ready</span>
        </div>
      </div>

      {/* 2. Clinical Care Stats Card */}
      <div className="rounded-3xl border border-[#C4CFC0] bg-white p-6 shadow-xs flex flex-col justify-between space-y-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] mb-3">
            Care History Overview
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#E2E8DF] bg-[#F8FAF7] p-3 text-center">
              <span className="text-2xl font-serif font-extrabold text-[#1C231F] block">
                {completed.length}
              </span>
              <span className="text-[11px] text-[#5F6F65] font-medium">Completed Visits</span>
            </div>

            <div className="rounded-2xl border border-[#E2E8DF] bg-[#F8FAF7] p-3 text-center">
              <span className="text-2xl font-serif font-extrabold text-[#1C231F] block">
                {uniqueDoctorsCount}
              </span>
              <span className="text-[11px] text-[#5F6F65] font-medium">Care Providers</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs font-bold"
            onClick={onBookNew}
          >
            + Book Another Consultation
          </Button>
        </div>
      </div>
    </div>
  );
}
