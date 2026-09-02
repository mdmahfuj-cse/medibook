import React from 'react';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Phone,
  Video,
  Download,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Printer,
  Sparkles,
  Share2,
  Info,
} from 'lucide-react';
import { Appointment } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../lib/utils';
import { formatTimeSlot } from '../../utils/scheduleUtils';
import { downloadICS, generateGoogleCalendarUrl } from '../../utils/calendarUtils';
import { useUIStore } from '../../stores/useUIStore';

interface Step4ConfirmationProps {
  appointment: Appointment;
  onViewAppointments: () => void;
  onBookAnother: () => void;
}

export function Step4Confirmation({
  appointment,
  onViewAppointments,
  onBookAnother,
}: Step4ConfirmationProps) {
  const { addToast } = useUIStore();
  const isVideo = appointment.clinic.name.toLowerCase().includes('telehealth') || false;

  const handleDownloadCalendar = () => {
    downloadICS(appointment);
    addToast({
      type: 'success',
      title: 'Calendar File Downloaded',
      message: 'iCalendar (.ics) invite has been saved to your downloads.',
    });
  };

  const handleGoogleCalendar = () => {
    const url = generateGoogleCalendarUrl(appointment);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      {/* 1. Success Hero Banner */}
      <div className="rounded-3xl border border-[#9CA986] bg-linear-to-b from-[#F0F4ED] to-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#5F6F65] text-white ring-8 ring-[#E7EFE3] shadow-lg mb-5 animate-bounce">
          <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
        </div>

        <Badge variant="sage" size="md" className="mb-3">
          Appointment Confirmed
        </Badge>

        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1C231F]">
          You're All Set for Your Consultation!
        </h2>

        <p className="text-sm text-[#5F6F65] mt-2 max-w-lg mx-auto leading-relaxed">
          Confirmation details and instructions have been dispatched to{' '}
          <strong className="text-[#1C231F]">{appointment.patientDetails.email}</strong>.
        </p>

        {/* Appointment ID Badge */}
        <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white border border-[#C4CFC0] px-4 py-2 text-xs font-mono font-bold text-[#1C231F] shadow-xs">
          <span>BOOKING REF:</span>
          <span className="text-[#5F6F65]">{appointment.id.toUpperCase()}</span>
        </div>
      </div>

      {/* 2. Digital Appointment Pass / Card */}
      <div className="rounded-3xl border border-[#C4CFC0] bg-white overflow-hidden shadow-md">
        {/* Pass Header */}
        <div className="bg-[#5F6F65] p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={appointment.doctorAvatar}
              alt={appointment.doctorName}
              className="h-16 w-16 rounded-2xl object-cover border-2 border-white/40 shadow-sm"
            />
            <div>
              <span className="text-xs uppercase tracking-wider text-[#E7EFE3] font-semibold">
                Confirmed Specialist
              </span>
              <h3 className="font-serif text-2xl font-bold">{appointment.doctorName}</h3>
              <p className="text-xs text-white/90">{appointment.doctorSpecialty}</p>
            </div>
          </div>

          <div className="text-left sm:text-right border-t sm:border-t-0 border-white/20 pt-3 sm:pt-0">
            <span className="text-xs uppercase tracking-wider text-[#E7EFE3] font-semibold block">
              Consultation Fee
            </span>
            <span className="font-serif text-2xl font-bold">
              {formatCurrency(appointment.consultationFee)}
            </span>
          </div>
        </div>

        {/* Pass Details Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Main Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-6 border-b border-[#E2E8DF]">
            <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E8DF]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#808D7C] block flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-[#5F6F65]" /> Date
              </span>
              <span className="font-bold text-sm text-[#1C231F] mt-1 block">
                {appointment.dateStr}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E8DF]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#808D7C] block flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-[#5F6F65]" /> Time
              </span>
              <span className="font-bold text-sm text-[#1C231F] mt-1 block">
                {formatTimeSlot(appointment.startTime)} - {formatTimeSlot(appointment.endTime)}
              </span>
              <span className="text-[10px] text-[#808D7C]">{appointment.timezone}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E8DF]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#808D7C] block flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-[#5F6F65]" /> Location
              </span>
              <span className="font-bold text-sm text-[#1C231F] mt-1 block truncate">
                {appointment.clinic.name}
              </span>
              <span className="text-[10px] text-[#5F6F65] block truncate">
                {appointment.clinic.city}, {appointment.clinic.state}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E8DF]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#808D7C] block flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-[#5F6F65]" /> Reception
              </span>
              <span className="font-bold text-sm text-[#1C231F] mt-1 block font-mono">
                {appointment.clinic.phone}
              </span>
            </div>
          </div>

          {/* Patient Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[#808D7C] block font-medium">Patient Name</span>
              <span className="font-bold text-[#1C231F] text-sm mt-0.5 block">
                {appointment.patientDetails.fullName}
              </span>
              {appointment.patientDetails.guardianName && (
                <span className="text-[11px] text-amber-800 block mt-0.5 font-medium">
                  Parent/Guardian: {appointment.patientDetails.guardianName} ({appointment.patientDetails.guardianRelationship || 'Authorized'})
                </span>
              )}
            </div>
            <div>
              <span className="text-[#808D7C] block font-medium">Contact Details</span>
              <span className="font-medium text-[#1C231F] mt-0.5 block">
                {appointment.patientDetails.phone}
              </span>
              <span className="text-[#808D7C]">{appointment.patientDetails.email}</span>
            </div>
            <div>
              <span className="text-[#808D7C] block font-medium">Insurance / Coverage</span>
              <span className="font-medium text-[#1C231F] mt-0.5 block">
                {appointment.patientDetails.insuranceProvider || 'Self-Pay'}
              </span>
              {appointment.patientDetails.insuranceMemberId && (
                <span className="text-[11px] text-[#5F6F65] block font-mono">
                  Member ID: {appointment.patientDetails.insuranceMemberId}
                </span>
              )}
              {appointment.discountAmount && (
                <span className="text-[11px] text-emerald-700 block font-semibold mt-0.5">
                  Applied Promo: -{formatCurrency(appointment.discountAmount)}
                </span>
              )}
            </div>
          </div>

          {/* Action Tools: Calendar Export & Print */}
          <div className="pt-4 border-t border-[#E2E8DF] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleGoogleCalendar}
                leftIcon={<Calendar className="h-4 w-4" />}
              >
                Add to Google Calendar
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadCalendar}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Download .ICS File
              </Button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#C4CFC0] bg-white px-3 py-2 text-xs font-semibold text-[#5F6F65] hover:bg-[#F0F4ED] transition-colors cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                Print Pass
              </button>
            </div>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                `${appointment.clinic.name} ${appointment.clinic.address} ${appointment.clinic.city}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#5F6F65] hover:text-[#1C231F] inline-flex items-center gap-1"
            >
              <MapPin className="h-3.5 w-3.5" />
              Driving Directions
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. Next Steps & Checklist Card */}
      <div className="rounded-3xl border border-[#C4CFC0] bg-[#F8FAF7] p-6 sm:p-8 space-y-4">
        <h4 className="font-serif text-lg font-bold text-[#1C231F] flex items-center gap-2">
          <Info className="h-5 w-5 text-[#5F6F65]" />
          Pre-Consultation Checklist
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#2B352F]">
          <div className="rounded-2xl border border-[#E2E8DF] bg-white p-4 space-y-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E7EFE3] text-xs font-bold text-[#5F6F65] mb-2">
              1
            </span>
            <strong className="text-[#1C231F] block">Bring Government ID & Insurance</strong>
            <p className="text-[#5F6F65] text-[11px]">
              Required at front-desk registration check-in.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2E8DF] bg-white p-4 space-y-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E7EFE3] text-xs font-bold text-[#5F6F65] mb-2">
              2
            </span>
            <strong className="text-[#1C231F] block">Medication & Allergy List</strong>
            <p className="text-[#5F6F65] text-[11px]">
              Have your current prescription dosages and vitamins ready.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2E8DF] bg-white p-4 space-y-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E7EFE3] text-xs font-bold text-[#5F6F65] mb-2">
              3
            </span>
            <strong className="text-[#1C231F] block">Arrive 10 Minutes Early</strong>
            <p className="text-[#5F6F65] text-[11px]">
              Allows brief vital-signs intake by clinical nursing staff.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Primary Route Navigation CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Button
          variant="primary"
          size="lg"
          onClick={onViewAppointments}
          rightIcon={<ArrowRight className="h-4 w-4" />}
          className="font-bold text-sm shadow-md w-full sm:w-auto"
        >
          View in My Appointments
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={onBookAnother}
          className="w-full sm:w-auto"
        >
          Book Another Doctor
        </Button>
      </div>
    </div>
  );
}
