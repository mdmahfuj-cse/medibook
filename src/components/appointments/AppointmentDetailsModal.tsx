import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Video,
  Download,
  Printer,
  FileText,
  ShieldCheck,
  CreditCard,
  User,
  History,
  ExternalLink,
  QrCode,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Copy,
  Check,
} from 'lucide-react';
import { Appointment } from '../../types';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatDateLong, formatCurrency, cn } from '../../lib/utils';
import { formatTimeSlot } from '../../utils/scheduleUtils';
import { downloadICS, generateGoogleCalendarUrl } from '../../utils/calendarUtils';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
  onOpenReschedule?: () => void;
  onOpenCancel?: () => void;
}

export function AppointmentDetailsModal({
  isOpen,
  onClose,
  appointment,
  onOpenReschedule,
  onOpenCancel,
}: AppointmentDetailsModalProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [showTelehealthSim, setShowTelehealthSim] = useState(false);

  const isUpcoming = appointment.status === 'upcoming';
  const isCompleted = appointment.status === 'completed';
  const isCancelled = appointment.status === 'cancelled';
  const isVideo = appointment.visitType === 'telehealth';

  const copyRefId = () => {
    navigator.clipboard.writeText(appointment.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5F6F65] text-white">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold text-[#1C231F] block">
                Appointment Pass & Intake
              </span>
              <span className="text-xs text-[#808D7C] font-mono font-normal">
                Ref #{appointment.id}
              </span>
            </div>
          </div>

          <Badge
            variant={isUpcoming ? 'sage' : isCompleted ? 'slate' : 'destructive'}
            size="sm"
          >
            {isUpcoming ? 'Confirmed Slot' : isCompleted ? 'Completed' : 'Cancelled'}
          </Badge>
        </div>
      }
    >
      <div className="space-y-6 pt-2 print:p-0">
        {/* Verification & Barcode Banner */}
        <div className="rounded-2xl border border-[#C4CFC0] bg-linear-to-r from-[#F8FAF7] via-white to-[#F8FAF7] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5F6F65]">
                Digital Check-in Token
              </span>
              <button
                type="button"
                onClick={copyRefId}
                className="text-[11px] text-[#808D7C] hover:text-[#1C231F] flex items-center gap-1 cursor-pointer font-mono"
                title="Copy Reference"
              >
                {copiedId ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                {copiedId ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="font-mono text-base font-bold text-[#1C231F] tracking-wide">
              {appointment.id.toUpperCase()}
            </p>
            <p className="text-[11px] text-[#808D7C]">
              Present this pass or scan upon clinic reception arrival.
            </p>
          </div>

          {/* Stylized QR placeholder */}
          <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-[#C4CFC0] shrink-0">
            <QrCode className="h-12 w-12 text-[#1C231F]" />
            <div className="text-[10px] text-[#5F6F65] leading-tight border-l border-[#E2E8DF] pl-2 font-mono">
              <span>SCAN FOR</span>
              <br />
              <span className="font-bold text-[#1C231F]">EXPRESS</span>
              <br />
              <span>INTAKE</span>
            </div>
          </div>
        </div>

        {/* Doctor & Location Info */}
        <div className="rounded-2xl border border-[#C4CFC0] bg-white p-5 space-y-4">
          <div className="flex items-start gap-4">
            <img
              src={appointment.doctorAvatar}
              alt={appointment.doctorName}
              className="h-14 w-14 rounded-2xl object-cover border border-[#C4CFC0]"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-base text-[#1C231F]">{appointment.doctorName}</h4>
                <Badge variant="sage" size="sm">
                  {appointment.doctorSpecialty}
                </Badge>
              </div>
              <p className="text-xs text-[#5F6F65] mt-0.5">{appointment.clinic.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#E2E8DF] text-xs">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#808D7C] uppercase tracking-wider block">
                Appointment Schedule
              </span>
              <div className="flex items-center gap-1.5 text-[#1C231F] font-semibold">
                <Calendar className="h-3.5 w-3.5 text-[#5F6F65]" />
                {formatDateLong(appointment.dateStr)}
              </div>
              <div className="flex items-center gap-1.5 text-[#5F6F65] font-mono">
                <Clock className="h-3.5 w-3.5 text-[#808D7C]" />
                {formatTimeSlot(appointment.startTime)} - {formatTimeSlot(appointment.endTime)} (
                {appointment.timezone})
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#808D7C] uppercase tracking-wider block">
                Consultation Modality
              </span>
              <div className="flex items-center gap-1.5 text-[#1C231F] font-medium">
                {isVideo ? (
                  <>
                    <Video className="h-3.5 w-3.5 text-blue-600" />
                    <span>HD Telehealth Video Call</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-3.5 w-3.5 text-[#5F6F65]" />
                    <span className="truncate">{appointment.clinic.address}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[#808D7C]">
                <Phone className="h-3.5 w-3.5" />
                <span>{appointment.clinic.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Intake Data */}
        <div className="rounded-2xl border border-[#C4CFC0] bg-white p-5 space-y-3">
          <h5 className="font-bold text-xs uppercase tracking-wider text-[#5F6F65]">
            Clinical Intake & Patient Record
          </h5>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[#808D7C] block">Patient Name</span>
              <span className="font-bold text-[#1C231F] mt-0.5 block">
                {appointment.patientDetails.fullName}
              </span>
              {appointment.patientDetails.guardianName && (
                <span className="text-[11px] text-amber-700 block">
                  Guardian: {appointment.patientDetails.guardianName}
                </span>
              )}
            </div>

            <div>
              <span className="text-[#808D7C] block">Contact Phone</span>
              <span className="font-medium text-[#1C231F] mt-0.5 block">
                {appointment.patientDetails.phone}
              </span>
              <span className="text-[#808D7C] text-[11px] block">
                {appointment.patientDetails.email}
              </span>
            </div>

            <div>
              <span className="text-[#808D7C] block">Insurance / Payer</span>
              <span className="font-bold text-[#1C231F] mt-0.5 block">
                {appointment.patientDetails.insuranceProvider || 'Self-Pay'}
              </span>
              {appointment.patientDetails.insuranceMemberId && (
                <span className="text-[11px] font-mono text-[#5F6F65] block">
                  ID: {appointment.patientDetails.insuranceMemberId}
                </span>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-[#E2E8DF]">
            <span className="text-[#808D7C] block text-xs">Reason for Visit</span>
            <p className="text-xs text-[#1C231F] mt-0.5 italic bg-[#F8FAF7] p-2.5 rounded-xl border border-[#E2E8DF]">
              "{appointment.patientDetails.reasonForVisit || 'General Medical Consultation'}"
            </p>
          </div>
        </div>

        {/* Reschedule History if applicable */}
        {appointment.rescheduleHistory && appointment.rescheduleHistory.length > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <History className="h-4 w-4 text-amber-700" />
              <span>Reschedule Audit Trail ({appointment.rescheduleHistory.length})</span>
            </div>
            <div className="space-y-1 text-amber-800">
              {appointment.rescheduleHistory.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px]">
                  <span>
                    Previously scheduled for <strong>{item.previousDate}</strong> at{' '}
                    <strong>{formatTimeSlot(item.previousTime)}</strong>
                  </span>
                  <span className="text-amber-600 font-mono">
                    {new Date(item.rescheduledAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cancellation Notice if cancelled */}
        {isCancelled && (
          <div className="rounded-2xl border border-red-200 bg-red-50/70 p-4 space-y-1 text-xs">
            <div className="flex items-center gap-2 font-bold text-red-900">
              <XCircle className="h-4 w-4 text-red-700" />
              <span>Consultation Cancelled</span>
            </div>
            <p className="text-red-800">
              Reason:{' '}
              <span className="font-medium italic">
                {appointment.cancelReason || 'Requested by patient'}
              </span>
            </p>
          </div>
        )}

        {/* Telehealth Room Simulation Launcher */}
        {isVideo && isUpcoming && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                <Video className="h-4 w-4 text-blue-600" />
                <span>Telehealth Video Waiting Room</span>
              </div>
              <Badge variant="outline" size="sm" className="bg-white text-blue-700 border-blue-200">
                Encrypted & HIPAA-Ready
              </Badge>
            </div>
            <p className="text-xs text-blue-800">
              Your consultation link opens 10 minutes prior to {formatTimeSlot(appointment.startTime)}.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-white text-blue-800 hover:bg-blue-100/50 border-blue-300 font-bold"
              onClick={() => setShowTelehealthSim(true)}
            >
              Launch Telehealth Test Chamber
            </Button>

            {showTelehealthSim && (
              <div className="p-3 rounded-xl bg-white border border-blue-200 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-blue-900">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Device Diagnostics: Microphone & Camera Ready
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowTelehealthSim(false)}
                    className="text-neutral-400 hover:text-neutral-700"
                  >
                    Dismiss
                  </button>
                </div>
                <p className="text-[11px] text-[#5F6F65]">
                  Latency: 28ms • Resolution: 1080p HD • Browser WebRTC: Compatible
                </p>
              </div>
            )}
          </div>
        )}

        {/* Digital Calendar & Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E2E8DF]">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => downloadICS(appointment)}
              leftIcon={<Download className="h-3.5 w-3.5" />}
            >
              Export .ics
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.open(generateGoogleCalendarUrl(appointment), '_blank')}
              leftIcon={<ExternalLink className="h-3.5 w-3.5" />}
            >
              Google Cal
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="h-3.5 w-3.5" />}
            >
              Print Pass
            </Button>
          </div>

          {isUpcoming && (
            <div className="flex items-center gap-2">
              {onOpenReschedule && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onOpenReschedule();
                  }}
                >
                  Reschedule
                </Button>
              )}

              {onOpenCancel && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onOpenCancel();
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
