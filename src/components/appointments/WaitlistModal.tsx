import React, { useState } from 'react';
import {
  X,
  Bell,
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  User,
  Phone,
  Mail,
} from 'lucide-react';
import { Doctor } from '../../types';
import { useWaitlistStore } from '../../stores/useWaitlistStore';
import { useUIStore } from '../../stores/useUIStore';
import { Button } from '../ui/Button';

interface WaitlistModalProps {
  doctor: Doctor;
  onClose: () => void;
}

export function WaitlistModal({ doctor, onClose }: WaitlistModalProps) {
  const { addToWaitlist } = useWaitlistStore();
  const { addToast } = useUIStore();

  const [patientName, setPatientName] = useState('Tanvir Hossain');
  const [email, setEmail] = useState('tanvir.hossain@gmail.com');
  const [phone, setPhone] = useState('01712-345678');
  const [preferredDate, setPreferredDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<'morning' | 'afternoon' | 'evening' | 'any'>('any');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      addToWaitlist({
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        patientName,
        email,
        phone,
        preferredDate,
        preferredTimeSlot,
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      addToast({
        type: 'success',
        title: 'Joined Priority Waitlist',
        message: `You will receive an instant SMS alert when an earlier slot opens for ${doctor.name}.`,
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-[#C4CFC0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8DF] bg-[#F8FAF7] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5F6F65] text-white">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-sans text-base font-bold text-[#1C231F]">
                Cancellation Waitlist Alert
              </h2>
              <p className="text-xs text-[#5F6F65]">
                Get notified first when an earlier appointment slot frees up
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#808D7C] hover:bg-[#E2E8DF] hover:text-[#1C231F] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-[#1C231F]">
                You're on the Priority List!
              </h3>
              <p className="text-xs text-[#5F6F65] max-w-sm mx-auto">
                If another patient reschedules or cancels with <strong>{doctor.name}</strong> around {preferredDate}, we will send an instant SMS alert to <strong>{phone}</strong>.
              </p>
            </div>
            <div className="pt-4 flex justify-center">
              <Button variant="primary" onClick={onClose} className="px-8">
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Doctor Info */}
            <div className="flex items-center gap-3 rounded-2xl bg-[#F0F4ED] p-3 border border-[#D8E2D4]">
              <img
                src={doctor.avatar}
                alt={doctor.name}
                referrerPolicy="no-referrer"
                className="h-10 w-10 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-bold text-xs text-[#1C231F]">{doctor.name}</h4>
                <p className="text-[11px] text-[#5F6F65]">{doctor.specialty} • {doctor.clinic.name}</p>
              </div>
            </div>

            {/* Target Date */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#808D7C] block mb-1">
                Target Preferred Date
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full rounded-xl border border-[#C4CFC0] px-3 py-2 text-xs text-[#1C231F]"
              />
            </div>

            {/* Time Slot Preference */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#808D7C] block mb-1">
                Preferred Shift Time
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {(['any', 'morning', 'afternoon', 'evening'] as const).map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setPreferredTimeSlot(slot)}
                    className={`rounded-xl border py-2 text-center capitalize transition-all ${
                      preferredTimeSlot === slot
                        ? 'border-[#5F6F65] bg-[#5F6F65] text-white font-bold'
                        : 'border-[#E2E8DF] bg-white text-[#5F6F65] hover:bg-[#F8FAF7]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-bold text-[#5F6F65] block mb-1">Patient Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full rounded-xl border border-[#C4CFC0] px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#5F6F65] block mb-1">SMS Alert Mobile Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-[#C4CFC0] px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8DF]">
              <Button variant="outline" size="sm" type="button" onClick={onClose} className="text-xs">
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={isSubmitting}
                className="text-xs px-6"
              >
                {isSubmitting ? 'Registering...' : 'Join Waitlist Alert'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
