import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  XCircle,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import { Appointment } from '../../types';
import { useAppointmentStore } from '../../stores/useAppointmentStore';
import { useUIStore } from '../../stores/useUIStore';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { formatDateLong } from '../../lib/utils';
import { formatTimeSlot } from '../../utils/scheduleUtils';

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
}

const CANCEL_REASONS = [
  'Schedule conflict or work meeting',
  'Symptoms resolved / feeling better',
  'Found an earlier appointment or alternative clinic',
  'Transportation or travel difficulty',
  'Insurance or billing consideration',
  'Other reason',
];

export function CancelModal({ isOpen, onClose, appointment }: CancelModalProps) {
  const { cancelAppointment } = useAppointmentStore();
  const { addToast } = useUIStore();

  const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0]);
  const [customNotes, setCustomNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmCancel = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 450));

      const finalReason =
        selectedReason === 'Other reason' && customNotes.trim()
          ? `Other: ${customNotes.trim()}`
          : selectedReason;

      cancelAppointment(appointment.id, finalReason);

      addToast({
        type: 'info',
        title: 'Appointment Cancelled',
        message: `Your booking with ${appointment.doctorName} for ${formatDateLong(appointment.dateStr)} has been released.`,
      });

      onClose();
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Cancellation Error',
        message: 'Unable to cancel appointment at this moment.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <span>Cancel Consultation</span>
        </div>
      }
      description="Please let us know why you need to cancel so we can release this reserved time for waiting patients."
    >
      <div className="space-y-5 pt-1">
        {/* Appointment summary card */}
        <div className="rounded-2xl border border-red-100 bg-red-50/40 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#5F6F65]">
            <span className="font-bold uppercase tracking-wider text-red-800">To Be Cancelled</span>
            <span className="font-mono text-[#808D7C]">Ref #{appointment.id}</span>
          </div>
          <div className="font-bold text-sm text-[#1C231F]">{appointment.doctorName}</div>
          <div className="text-xs text-[#5F6F65] flex items-center gap-2">
            <span className="flex items-center gap-1 font-medium">
              <Calendar className="h-3.5 w-3.5 text-[#808D7C]" />
              {formatDateLong(appointment.dateStr)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono font-medium">
              <Clock className="h-3.5 w-3.5 text-[#808D7C]" />
              {formatTimeSlot(appointment.startTime)}
            </span>
          </div>
        </div>

        {/* Cancellation Reason Picker */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#2B352F] block">
            Select Reason for Cancellation
          </label>
          <div className="space-y-2">
            {CANCEL_REASONS.map((reason) => {
              const isChecked = selectedReason === reason;
              return (
                <label
                  key={reason}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-xs transition-all cursor-pointer select-none ${
                    isChecked
                      ? 'border-[#5F6F65] bg-[#E7EFE3]/60 text-[#1C231F] font-semibold ring-1 ring-[#5F6F65]'
                      : 'border-[#C4CFC0] bg-white text-[#5F6F65] hover:border-[#808D7C]'
                  }`}
                >
                  <input
                    type="radio"
                    name="cancel-reason"
                    value={reason}
                    checked={isChecked}
                    onChange={() => setSelectedReason(reason)}
                    className="h-4 w-4 text-[#5F6F65] focus:ring-[#5F6F65]"
                  />
                  <span>{reason}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Additional Optional Note */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-[#808D7C] block">
            Additional Comments (Optional)
          </label>
          <textarea
            rows={2}
            id="cancel-custom-notes"
            placeholder="Any specific note for the clinical reception team..."
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            className="w-full rounded-xl border border-[#C4CFC0] bg-white p-3 text-xs text-[#1C231F] placeholder:text-[#808D7C] focus:border-[#5F6F65] focus:outline-none"
          />
        </div>

        {/* Cancellation Policy Banner */}
        <div className="flex items-start gap-2.5 rounded-xl border border-[#C4CFC0]/60 bg-[#F8FAF7] p-3 text-xs text-[#5F6F65]">
          <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
          <p>
            <strong className="text-[#1C231F]">No Penalty:</strong> There is no cancellation charge. If you made an upfront card payment, funds will be released back to your card within 2–3 business days.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E2E8DF]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Keep Appointment
          </Button>

          <Button
            type="button"
            id="confirm-cancel-btn"
            variant="danger"
            size="sm"
            disabled={isSubmitting}
            onClick={handleConfirmCancel}
          >
            {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
