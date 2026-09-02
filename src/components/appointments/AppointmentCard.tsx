import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  ChevronRight,
  MoreVertical,
  Download,
  ExternalLink,
  RotateCcw,
  XCircle,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  Printer,
  Tag,
  Radio,
} from 'lucide-react';
import { Appointment } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDateLong, formatCurrency, cn } from '../../lib/utils';
import { formatTimeSlot } from '../../utils/scheduleUtils';
import { downloadICS, generateGoogleCalendarUrl } from '../../utils/calendarUtils';
import { useUIStore } from '../../stores/useUIStore';

export interface AppointmentCardProps {
  key?: React.Key;
  appointment: Appointment;
  onReschedule: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
  onViewDetails: (appointment: Appointment) => void;
  onRebook: (doctorId: string) => void;
}

export function AppointmentCard({
  appointment,
  onReschedule,
  onCancel,
  onViewDetails,
  onRebook,
}: AppointmentCardProps) {
  const { navigate } = useUIStore();
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);

  const isUpcoming = appointment.status === 'upcoming';
  const isCompleted = appointment.status === 'completed';
  const isCancelled = appointment.status === 'cancelled';
  const isVideo = appointment.visitType === 'telehealth';

  const [year, month, day] = appointment.dateStr.split('-');
  const dateObj = new Date(`${appointment.dateStr}T00:00:00`);
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
  const dayNum = dateObj.getDate();

  return (
    <div
      id={`appointment-card-${appointment.id}`}
      className={cn(
        'group relative rounded-3xl border bg-white p-5 sm:p-6 transition-all shadow-xs hover:shadow-md',
        isUpcoming
          ? 'border-[#C4CFC0] hover:border-[#808D7C]'
          : isCompleted
          ? 'border-[#E2E8DF] bg-white'
          : 'border-red-100 bg-[#FCF9F9]/80 opacity-90'
      )}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left: Date badge + Doctor info */}
        <div className="flex items-start gap-4">
          {/* Visual Date Capsule */}
          <div
            className={cn(
              'flex flex-col items-center justify-center rounded-2xl p-3 min-w-[70px] text-center border shrink-0',
              isUpcoming
                ? 'border-[#5F6F65]/20 bg-[#E7EFE3] text-[#1C231F]'
                : isCompleted
                ? 'border-neutral-200 bg-neutral-100 text-neutral-700'
                : 'border-red-200 bg-red-50 text-red-700'
            )}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {dayName}
            </span>
            <span className="text-2xl font-extrabold my-0.5 leading-none">{dayNum}</span>
            <span className="text-[10px] font-medium uppercase tracking-wider">{monthName}</span>
          </div>

          {/* Doctor & Clinic Info */}
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4
                onClick={() => navigate({ path: '/doctors/:id', id: appointment.doctorId })}
                className="font-serif text-lg font-bold text-[#1C231F] hover:text-[#5F6F65] cursor-pointer transition-colors"
              >
                {appointment.doctorName}
              </h4>
              <Badge variant="sage" size="sm">
                {appointment.doctorSpecialty}
              </Badge>

              {/* Status Badge */}
              <Badge
                variant={isUpcoming ? 'sage' : isCompleted ? 'slate' : 'destructive'}
                size="sm"
                className="ml-auto sm:ml-0"
              >
                {isUpcoming && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />}
                {isUpcoming ? 'Upcoming' : isCompleted ? 'Completed' : 'Cancelled'}
              </Badge>
            </div>

            {/* Time & Modality row */}
            <div className="flex items-center gap-3 text-xs text-[#5F6F65] flex-wrap font-medium">
              <span className="flex items-center gap-1 font-mono text-[#1C231F]">
                <Clock className="h-3.5 w-3.5 text-[#808D7C]" />
                {formatTimeSlot(appointment.startTime)} – {formatTimeSlot(appointment.endTime)}
              </span>

              <span>•</span>

              <span className="flex items-center gap-1">
                {isVideo ? (
                  <>
                    <Video className="h-3.5 w-3.5 text-blue-600" />
                    <span className="text-blue-700 font-semibold">Telehealth Video</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-3.5 w-3.5 text-[#808D7C]" />
                    <span className="truncate max-w-[200px] sm:max-w-xs">{appointment.clinic.name}</span>
                  </>
                )}
              </span>

              {appointment.discountAmount && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold font-mono">
                    <Tag className="h-3 w-3" />
                    Promo -{formatCurrency(appointment.discountAmount)}
                  </span>
                </>
              )}
            </div>

            {/* Patient & Reason Brief */}
            <div className="text-xs text-[#808D7C] flex items-center gap-2 pt-0.5">
              <span>Patient: <strong className="text-[#1C231F]">{appointment.patientDetails.fullName}</strong></span>
              {appointment.patientDetails.insuranceProvider && (
                <span>({appointment.patientDetails.insuranceProvider})</span>
              )}
              {appointment.rescheduleHistory && appointment.rescheduleHistory.length > 0 && (
                <span className="text-[11px] text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  Rescheduled
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions Toolbar */}
        <div className="flex items-center gap-2 flex-wrap lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-[#E2E8DF]">
          {/* Primary Action depending on status */}
          {isUpcoming && (
            <>
              {/* Calendar Export Dropdown */}
              <div className="relative">
                <Button
                  type="button"
                  id={`calendar-dropdown-btn-${appointment.id}`}
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCalendarMenu(!showCalendarMenu)}
                  leftIcon={<Calendar className="h-3.5 w-3.5 text-[#5F6F65]" />}
                  className="text-xs"
                >
                  Calendar
                </Button>

                {showCalendarMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowCalendarMenu(false)}
                    />
                    <div className="absolute right-0 bottom-full mb-1 sm:bottom-auto sm:top-full sm:mt-1 z-20 w-48 rounded-xl border border-[#C4CFC0] bg-white p-1 shadow-lg text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          downloadICS(appointment);
                          setShowCalendarMenu(false);
                        }}
                        className="w-full text-left rounded-lg px-3 py-2 hover:bg-[#F0F4ED] text-[#1C231F] flex items-center gap-2 cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5 text-[#5F6F65]" />
                        Apple / Outlook (.ics)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          window.open(generateGoogleCalendarUrl(appointment), '_blank');
                          setShowCalendarMenu(false);
                        }}
                        className="w-full text-left rounded-lg px-3 py-2 hover:bg-[#F0F4ED] text-[#1C231F] flex items-center gap-2 cursor-pointer"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-[#5F6F65]" />
                        Google Calendar
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Reschedule Button */}
              <Button
                type="button"
                id={`reschedule-btn-${appointment.id}`}
                variant="outline"
                size="sm"
                onClick={() => onReschedule(appointment)}
                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                className="text-xs"
              >
                Reschedule
              </Button>

              {/* Cancel Button */}
              <Button
                type="button"
                id={`cancel-btn-${appointment.id}`}
                variant="ghost"
                size="sm"
                onClick={() => onCancel(appointment)}
                className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                Cancel
              </Button>

              {/* Join Telehealth Video Call if Video Appointment */}
              {isVideo ? (
                <Button
                  type="button"
                  id={`join-video-btn-${appointment.id}`}
                  variant="primary"
                  size="sm"
                  onClick={() => navigate({ path: '/telehealth', appointmentId: appointment.id })}
                  leftIcon={<Video className="h-3.5 w-3.5" />}
                  className="text-xs bg-blue-600 hover:bg-blue-700 font-bold"
                >
                  Join Video Room
                </Button>
              ) : (
                <Button
                  type="button"
                  id={`live-queue-btn-${appointment.id}`}
                  variant="outline"
                  size="sm"
                  onClick={() => navigate({ path: '/chamber-tracker' })}
                  leftIcon={<Radio className="h-3.5 w-3.5 text-emerald-600" />}
                  className="text-xs text-emerald-800 border-emerald-300 hover:bg-emerald-50 font-bold"
                >
                  Live Serial Tracker
                </Button>
              )}

              {/* Details / Pass Modal */}
              <Button
                type="button"
                id={`details-btn-${appointment.id}`}
                variant={isVideo ? 'outline' : 'primary'}
                size="sm"
                onClick={() => onViewDetails(appointment)}
                className="text-xs"
              >
                Pass / Details
              </Button>
            </>
          )}

          {isCompleted && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(appointment)}
                leftIcon={<FileText className="h-3.5 w-3.5" />}
                className="text-xs"
              >
                Intake & Summary
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => onRebook(appointment.doctorId)}
                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                className="text-xs"
              >
                Book Follow-up
              </Button>
            </>
          )}

          {isCancelled && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(appointment)}
                className="text-xs text-[#5F6F65]"
              >
                View Reason
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => onRebook(appointment.doctorId)}
                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                className="text-xs"
              >
                Rebook Provider
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
