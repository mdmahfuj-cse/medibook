import React, { useRef } from 'react';
import {
  X,
  Printer,
  ShoppingBag,
  Download,
  Share2,
  Calendar,
  CheckCircle2,
  HeartPulse,
  Activity,
  User,
  ShieldCheck,
  Stethoscope,
  Hospital,
  AlertCircle,
  Clock,
  Pill,
} from 'lucide-react';
import { ExtendedPrescription } from '../../data/mockPrescriptions';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatDateLong } from '../../lib/utils';
import { useUIStore } from '../../stores/useUIStore';

interface PrescriptionDetailsModalProps {
  prescription: ExtendedPrescription | null;
  onClose: () => void;
  onOrderMedicines: (rx: ExtendedPrescription) => void;
}

export function PrescriptionDetailsModal({
  prescription,
  onClose,
  onOrderMedicines,
}: PrescriptionDetailsModalProps) {
  const { addToast } = useUIStore();
  const printRef = useRef<HTMLDivElement>(null);

  if (!prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Digital Prescription ${prescription.id} from ${prescription.doctorName} (${prescription.clinicName}) - MediBook Bangladesh`
      );
      addToast({
        type: 'success',
        title: 'Prescription Link Copied',
        message: 'Shareable record details copied to clipboard.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-[#C4CFC0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-[#E2E8DF] bg-[#F8FAF7] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5F6F65] text-white">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-sans text-base font-bold text-[#1C231F]">
                Digital Prescription (e-Rx)
              </h2>
              <p className="text-xs text-[#5F6F65]">
                {prescription.id} • Issued {formatDateLong(prescription.date)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 text-xs text-[#2B352F] border-[#C4CFC0]"
              title="Print Prescription (A4)"
            >
              <Printer className="h-4 w-4 text-[#5F6F65]" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-1.5 text-xs text-[#2B352F] border-[#C4CFC0]"
              title="Share prescription summary"
            >
              <Share2 className="h-4 w-4 text-[#5F6F65]" />
              <span className="hidden sm:inline">Share</span>
            </Button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-[#808D7C] hover:bg-[#E2E8DF] hover:text-[#1C231F] transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Prescription Body / Printable Canvas */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#FAFCF9]" ref={printRef}>
          <div className="mx-auto max-w-3xl rounded-2xl border-2 border-[#D8E2D4] bg-white p-6 sm:p-10 shadow-xs">
            {/* Header: Clinic & Doctor Letterhead */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b-2 border-[#5F6F65]/20 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-2xl font-bold tracking-tight text-[#1C231F]">
                    {prescription.doctorName}
                  </span>
                  <ShieldCheck className="h-5 w-5 text-[#5F6F65]" />
                </div>
                <p className="text-sm font-semibold text-[#5F6F65] mt-0.5">
                  {prescription.doctorDegrees}
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-md bg-[#E7EFE3] px-2.5 py-0.5 text-xs font-mono font-bold text-[#2B352F]">
                  <span>{prescription.bmdcRegNo}</span>
                </div>
                <p className="text-xs text-[#808D7C] mt-1 font-medium">
                  Specialist: {prescription.doctorSpecialty}
                </p>
              </div>

              <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E2E8DF]">
                <div className="font-sans text-base font-bold text-[#1C231F] flex sm:justify-end items-center gap-1.5">
                  <Hospital className="h-4 w-4 text-[#5F6F65]" />
                  <span>{prescription.clinicName}</span>
                </div>
                <p className="text-xs text-[#5F6F65] max-w-xs sm:ml-auto mt-0.5">
                  {prescription.clinicAddress}
                </p>
                <div className="mt-2 text-xs font-mono text-[#808D7C]">
                  Prescription No: <strong className="text-[#1C231F]">{prescription.id}</strong>
                </div>
              </div>
            </div>

            {/* Patient Demographics & Vitals Row */}
            <div className="mt-5 rounded-xl bg-[#F0F4ED]/80 border border-[#D8E2D4] p-4 text-xs text-[#2B352F]">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-[#808D7C] font-semibold block text-[11px] uppercase">Patient Name:</span>
                  <strong className="text-sm text-[#1C231F]">{prescription.patientName}</strong>
                </div>
                <div>
                  <span className="text-[#808D7C] font-semibold block text-[11px] uppercase">Age / Gender:</span>
                  <span className="text-sm font-medium">{prescription.patientAge} Yrs / {prescription.patientGender}</span>
                </div>
                <div>
                  <span className="text-[#808D7C] font-semibold block text-[11px] uppercase">Date of Visit:</span>
                  <span className="text-sm font-medium">{formatDateLong(prescription.date)}</span>
                </div>
                <div>
                  <span className="text-[#808D7C] font-semibold block text-[11px] uppercase">Blood Pressure:</span>
                  <span className="text-sm font-bold text-[#5F6F65]">{prescription.vitals?.bloodPressure || '120/80 mmHg'}</span>
                </div>
              </div>

              {/* Secondary Vitals */}
              {prescription.vitals && (
                <div className="mt-3 pt-2.5 border-t border-[#D8E2D4] flex flex-wrap gap-4 text-xs text-[#5F6F65]">
                  {prescription.vitals.pulseRate && (
                    <span><strong>Pulse:</strong> {prescription.vitals.pulseRate}</span>
                  )}
                  {prescription.vitals.weightKg && (
                    <span><strong>Weight:</strong> {prescription.vitals.weightKg} kg</span>
                  )}
                  {prescription.vitals.bloodSugar && (
                    <span><strong>Blood Sugar:</strong> {prescription.vitals.bloodSugar}</span>
                  )}
                  {prescription.vitals.temperature && (
                    <span><strong>Temp:</strong> {prescription.vitals.temperature}</span>
                  )}
                </div>
              )}
            </div>

            {/* Two-Column Clinical Layout */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Diagnosis & Investigations (4 Cols) */}
              <div className="md:col-span-4 space-y-5 border-b md:border-b-0 md:border-r border-[#E2E8DF] pb-5 md:pb-0 md:pr-5">
                {/* Clinical Impression */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#808D7C]">
                    Clinical Diagnosis
                  </h4>
                  <div className="mt-1.5 rounded-lg bg-[#F8FAF7] border border-[#E2E8DF] p-2.5">
                    <p className="text-xs font-bold text-[#1C231F] leading-snug">
                      {prescription.diagnosis}
                    </p>
                  </div>
                </div>

                {/* Advised Diagnostic Investigations */}
                {prescription.investigations && prescription.investigations.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#808D7C] flex items-center gap-1">
                      <Activity className="h-3.5 w-3.5 text-[#5F6F65]" />
                      Advised Investigations (R/X)
                    </h4>
                    <ul className="mt-2 space-y-2 text-xs">
                      {prescription.investigations.map((inv, idx) => (
                        <li key={idx} className="rounded-lg border border-[#E2E8DF] bg-white p-2 text-[#2B352F]">
                          <div className="font-semibold text-[#1C231F]">{inv.testName}</div>
                          {inv.notes && <div className="text-[11px] text-[#808D7C]">{inv.notes}</div>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Follow-up Note */}
                {prescription.followUpDate && (
                  <div className="rounded-xl bg-[#E7EFE3] p-3 text-xs">
                    <span className="font-bold text-[#2B352F] block">Next Visit / Follow-up:</span>
                    <p className="text-[#5F6F65] font-medium mt-0.5">{prescription.followUpDate}</p>
                  </div>
                )}
              </div>

              {/* Right Column: Medications & Rx (8 Cols) */}
              <div className="md:col-span-8 space-y-6">
                <div>
                  <div className="flex items-center justify-between border-b border-[#E2E8DF] pb-2">
                    <span className="font-serif text-3xl font-bold italic text-[#5F6F65]">
                      ℞
                    </span>
                    <span className="text-xs font-semibold text-[#808D7C]">
                      Prescribed Medications ({prescription.medicines.length})
                    </span>
                  </div>

                  <div className="mt-4 space-y-4">
                    {prescription.medicines.map((med, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-[#D8E2D4] bg-[#FAFCF9] p-3.5 text-xs transition-colors hover:bg-white"
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#5F6F65] text-[10px] font-bold text-white">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-sm text-[#1C231F]">
                              {med.name}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-xs text-[#5F6F65] bg-white px-2 py-0.5 rounded border border-[#C4CFC0]">
                            {med.dosage}
                          </span>
                        </div>

                        {/* Frequency & Duration Pill */}
                        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                          <span className="inline-flex items-center gap-1 rounded-md bg-[#E7EFE3] px-2 py-0.5 font-medium text-[#2B352F]">
                            <Clock className="h-3 w-3 text-[#5F6F65]" />
                            <strong>Schedule:</strong> {med.frequency}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-md bg-[#F0F4ED] px-2 py-0.5 text-[#5F6F65]">
                            <strong>Duration:</strong> {med.duration}
                          </span>
                        </div>

                        {med.instructions && (
                          <p className="mt-2 text-[11px] text-[#5F6F65] bg-white/80 rounded-md p-1.5 border border-[#E2E8DF] italic">
                            • {med.instructions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dietary & Lifestyle Instructions */}
                <div className="rounded-xl bg-[#F8FAF7] border border-[#E2E8DF] p-4 text-xs">
                  <h4 className="font-bold text-[#1C231F] flex items-center gap-1.5">
                    <HeartPulse className="h-4 w-4 text-[#5F6F65]" />
                    Doctor's Advice & Patient Instructions
                  </h4>
                  <p className="mt-1.5 text-[#2B352F] leading-relaxed">
                    {prescription.generalAdvice}
                  </p>

                  {prescription.lifestyleAdvice && prescription.lifestyleAdvice.length > 0 && (
                    <ul className="mt-2.5 space-y-1 list-disc list-inside text-[11px] text-[#5F6F65]">
                      {prescription.lifestyleAdvice.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Digital Stamp & Doctor Signature Footer */}
                <div className="flex items-end justify-between pt-6 border-t border-[#E2E8DF]">
                  <div className="text-[10px] text-[#808D7C] leading-tight">
                    <p>Generated by MediBook Digital Health Records</p>
                    <p>Secured with 256-Bit Bangladesh Health Key</p>
                  </div>

                  <div className="text-center">
                    <div className="font-serif italic text-lg font-bold text-[#5F6F65] tracking-wider mb-1">
                      {prescription.doctorName.split(' ').slice(0, 3).join(' ')}
                    </div>
                    <div className="w-36 border-b border-dashed border-[#5F6F65] mx-auto" />
                    <p className="text-[10px] font-bold text-[#2B352F] uppercase mt-1">
                      Registered Medical Practitioner
                    </p>
                    <p className="text-[9px] text-[#808D7C] font-mono">{prescription.bmdcRegNo}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8DF] bg-white px-6 py-4">
          <div className="text-xs text-[#5F6F65]">
            Need original brand medicines delivered?
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Close
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onOrderMedicines(prescription);
              }}
              className="gap-2 text-xs"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Order Medicines (Home Delivery)</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
