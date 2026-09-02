import React from 'react';
import {
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  Video,
  Building2,
  Languages,
  GraduationCap,
} from 'lucide-react';
import { Doctor } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../lib/utils';
import { useUIStore } from '../../stores/useUIStore';
import { useBookingStore } from '../../stores/useBookingStore';

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
  onViewProfile: (doctorId: string) => void;
}

export function DoctorCard({ doctor, onBook, onViewProfile }: DoctorCardProps) {
  return (
    <div className="group rounded-2xl border border-[#C4CFC0] bg-white p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-[#9CA986] transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Info Row */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* Avatar with Badges */}
          <div className="relative shrink-0">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover border border-[#E2E8DF]"
              loading="lazy"
            />
            {doctor.telehealthAvailable && (
              <span
                title="Telehealth Video Consultation Available"
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#5F6F65] text-white ring-2 ring-white shadow-xs"
              >
                <Video className="h-3.5 w-3.5" />
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#5F6F65]">
                  {doctor.specialty}
                </span>
                <h3
                  onClick={() => onViewProfile(doctor.id)}
                  className="font-serif text-xl font-bold text-[#1C231F] hover:text-[#5F6F65] transition-colors cursor-pointer"
                >
                  {doctor.name}
                </h3>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 rounded-full bg-[#F0F4ED] px-2.5 py-1 text-xs font-bold text-[#1C231F]">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{doctor.rating.toFixed(2)}</span>
                <span className="text-[10px] text-[#808D7C]">({doctor.reviewCount})</span>
              </div>
            </div>

            <p className="text-xs text-[#5F6F65] mt-1 line-clamp-1">
              {doctor.qualifications.join(', ')} · {doctor.experienceYears} years practice
            </p>

            {/* Clinic / Location info */}
            <div className="mt-2.5 flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-[#808D7C]">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[#9CA986] shrink-0" />
                <span className="text-[#2B352F] font-medium">{doctor.clinic.name}</span>
                <span>({doctor.clinic.city})</span>
              </span>
              <span className="hidden sm:inline-block text-[#C4CFC0]">•</span>
              <span className="flex items-center gap-1">
                <Languages className="h-3.5 w-3.5 text-[#9CA986] shrink-0" />
                <span>{doctor.languages.join(', ')}</span>
              </span>
            </div>

            {/* Badges / Highlights */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {doctor.acceptingNewPatients ? (
                <Badge variant="sage" size="sm">
                  <CheckCircle2 className="mr-1 h-3 w-3 inline" />
                  Accepting Patients
                </Badge>
              ) : (
                <Badge variant="outline" size="sm" className="text-[#808D7C]">
                  Waitlist Only
                </Badge>
              )}

              {doctor.telehealthAvailable && (
                <Badge variant="woodland" size="sm">
                  <Video className="mr-1 h-3 w-3 inline" />
                  Video Visit
                </Badge>
              )}

              <Badge variant="outline" size="sm" className="hidden sm:inline-flex">
                <GraduationCap className="mr-1 h-3 w-3 inline text-[#808D7C]" />
                {doctor.qualifications[0]}
              </Badge>
            </div>
          </div>
        </div>

        {/* Bio snippet */}
        <p className="text-xs text-[#5F6F65] mt-3.5 line-clamp-2 leading-relaxed border-t border-[#E2E8DF] pt-3">
          {doctor.about}
        </p>
      </div>

      {/* Footer Bottom Bar */}
      <div className="mt-5 pt-3 border-t border-[#E2E8DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs text-[#808D7C]">Consultation Fee:</span>
          <span className="text-lg font-serif font-bold text-[#1C231F]">
            {formatCurrency(doctor.consultationFee)}
          </span>
          <span className="text-[10px] text-[#808D7C]">/ 30 min</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none text-xs"
            onClick={() => onViewProfile(doctor.id)}
          >
            View Details
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex-1 sm:flex-none text-xs font-semibold"
            onClick={() => onBook(doctor)}
          >
            Book Appointment
          </Button>
        </div>
      </div>
    </div>
  );
}
