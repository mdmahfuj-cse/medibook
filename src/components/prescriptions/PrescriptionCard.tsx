import React from 'react';
import { Calendar, FileText, User, Hospital, Pill, ArrowRight, Printer, ShoppingBag, ShieldCheck, ChevronRight } from 'lucide-react';
import { ExtendedPrescription } from '../../data/mockPrescriptions';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatDateLong } from '../../lib/utils';

interface PrescriptionCardProps {
  key?: string | number;
  prescription: ExtendedPrescription;
  onViewDetails: (rx: ExtendedPrescription) => void;
  onOrderMedicines: (rx: ExtendedPrescription) => void;
  onBookFollowUp?: (doctorId: string) => void;
}

export function PrescriptionCard({
  prescription,
  onViewDetails,
  onOrderMedicines,
  onBookFollowUp,
}: PrescriptionCardProps) {
  return (
    <div className="group relative rounded-2xl border border-[#C4CFC0] bg-white p-5 shadow-xs transition-all hover:border-[#5F6F65] hover:shadow-md">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8DF] pb-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E7EFE3] text-[#5F6F65]">
            <FileText className="h-4 w-4" />
          </div>
          <span className="font-mono text-xs font-bold text-[#2B352F] tracking-wide">
            {prescription.id}
          </span>
          <Badge variant="outline" className="bg-[#F8FAF7] text-[11px] text-[#5F6F65] border-[#C4CFC0]">
            Official e-Rx
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#808D7C]">
          <Calendar className="h-3.5 w-3.5" />
          <span>Issued: {formatDateLong(prescription.date)}</span>
        </div>
      </div>

      {/* Doctor & Hospital Info */}
      <div className="mt-4 flex items-start gap-3.5">
        <img
          src={prescription.doctorAvatar}
          alt={prescription.doctorName}
          referrerPolicy="no-referrer"
          className="h-12 w-12 rounded-xl object-cover border border-[#E2E8DF] shadow-2xs"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-[#1C231F] text-base truncate group-hover:text-[#5F6F65] transition-colors">
              {prescription.doctorName}
            </h3>
            <ShieldCheck className="h-4 w-4 text-[#5F6F65] shrink-0" title="Verified BMDC Practitioner" />
          </div>
          <p className="text-xs text-[#5F6F65] font-medium">{prescription.doctorDegrees}</p>
          <div className="mt-1 flex items-center gap-1 text-xs text-[#808D7C]">
            <Hospital className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{prescription.clinicName}</span>
          </div>
        </div>
      </div>

      {/* Diagnosis Highlight */}
      <div className="mt-3.5 rounded-xl bg-[#F8FAF7] border border-[#E2E8DF] p-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#808D7C]">
          Clinical Diagnosis
        </div>
        <p className="text-sm font-semibold text-[#1C231F] mt-0.5">
          {prescription.diagnosis}
        </p>
      </div>

      {/* Prescribed Medications Preview */}
      <div className="mt-3.5 space-y-1.5">
        <div className="flex items-center justify-between text-xs text-[#808D7C] font-semibold">
          <span className="flex items-center gap-1">
            <Pill className="h-3.5 w-3.5 text-[#5F6F65]" />
            Prescribed Medicines ({prescription.medicines.length})
          </span>
          <span className="text-[11px] text-[#5F6F65]">Dose & Frequency</span>
        </div>

        <div className="space-y-1.5">
          {prescription.medicines.slice(0, 2).map((med, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-2 rounded-lg bg-[#F0F4ED]/60 px-2.5 py-1.5 text-xs text-[#2B352F]"
            >
              <div className="truncate">
                <span className="font-semibold text-[#1C231F]">{med.name}</span>{' '}
                <span className="text-[#5F6F65]">({med.dosage})</span>
              </div>
              <span className="shrink-0 text-[11px] font-mono text-[#5F6F65] bg-white px-1.5 py-0.5 rounded border border-[#E2E8DF]">
                {med.frequency.split('(')[0].trim()}
              </span>
            </div>
          ))}

          {prescription.medicines.length > 2 && (
            <div className="text-[11px] text-[#808D7C] pl-1 font-medium">
              +{prescription.medicines.length - 2} more item(s)...
            </div>
          )}
        </div>
      </div>

      {/* Follow-up Note */}
      {prescription.followUpDate && (
        <div className="mt-3 text-[11px] text-[#5F6F65] bg-[#E7EFE3]/50 rounded-lg px-2.5 py-1 flex items-center justify-between">
          <span className="font-semibold">Next Follow-up:</span>
          <span>{prescription.followUpDate}</span>
        </div>
      )}

      {/* Card Actions */}
      <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-[#E2E8DF]">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onViewDetails(prescription)}
          className="flex-1 text-xs gap-1"
        >
          <span>View Full Rx</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onOrderMedicines(prescription)}
          className="text-xs gap-1.5 border-[#C4CFC0] hover:bg-[#F0F4ED] text-[#2B352F]"
        >
          <ShoppingBag className="h-3.5 w-3.5 text-[#5F6F65]" />
          <span>Order Meds</span>
        </Button>

        {onBookFollowUp && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBookFollowUp(prescription.doctorId)}
            className="text-xs text-[#5F6F65] hover:bg-[#F0F4ED]"
          >
            Re-book
          </Button>
        )}
      </div>
    </div>
  );
}
