import React from 'react';
import {
  Star,
  MapPin,
  CheckCircle2,
  Share2,
  Heart,
  Calendar,
  Video,
  Languages,
  ShieldCheck,
  Building2,
  GraduationCap,
  Clock,
} from 'lucide-react';
import { Doctor } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../lib/utils';
import { useUIStore } from '../../stores/useUIStore';

interface DoctorHeaderProps {
  doctor: Doctor;
  onBookNow: () => void;
}

export function DoctorHeader({ doctor, onBookNow }: DoctorHeaderProps) {
  const { savedDoctorIds, toggleFavoriteDoctor, addToast } = useUIStore();
  const isFavorited = savedDoctorIds.includes(doctor.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        type: 'success',
        title: 'Link Copied',
        message: `Profile link for ${doctor.name} copied to clipboard.`,
      });
    }
  };

  const handleToggleFavorite = () => {
    toggleFavoriteDoctor(doctor.id);
    addToast({
      type: 'info',
      title: isFavorited ? 'Removed from Saved' : 'Saved to Favorites',
      message: `${doctor.name} has been ${isFavorited ? 'removed from' : 'added to'} your saved providers.`,
    });
  };

  return (
    <div className="rounded-3xl border border-[#C4CFC0] bg-white p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col md:flex-row items-start gap-6 lg:gap-8">
        {/* Doctor Photo & Badges */}
        <div className="relative shrink-0 mx-auto md:mx-0">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="h-32 w-32 sm:h-40 sm:w-40 rounded-3xl object-cover border-2 border-[#E2E8DF] shadow-md"
          />
          {doctor.telehealthAvailable && (
            <span
              title="Telehealth Video Consultations Available"
              className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#5F6F65] text-white ring-4 ring-white shadow-md"
            >
              <Video className="h-5 w-5" />
            </span>
          )}
        </div>

        {/* Doctor Main Info */}
        <div className="flex-1 w-full text-center md:text-left">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5">
                <Badge variant="sage" size="sm">
                  {doctor.specialty}
                </Badge>
                {doctor.verified && (
                  <Badge variant="woodland" size="sm">
                    <ShieldCheck className="h-3 w-3 mr-1 inline" />
                    Verified Provider
                  </Badge>
                )}
                {doctor.acceptingNewPatients && (
                  <Badge variant="outline" size="sm" className="text-[#5F6F65] border-[#9CA986]">
                    <CheckCircle2 className="h-3 w-3 mr-1 inline text-[#5F6F65]" />
                    Accepting Patients
                  </Badge>
                )}
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1C231F]">
                {doctor.name}
              </h1>

              <p className="text-sm font-medium text-[#5F6F65] mt-1">
                {doctor.title}
              </p>
            </div>

            {/* Action buttons (Share & Favorite) */}
            <div className="flex items-center justify-center md:justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={handleShare}
                title="Share Profile"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#C4CFC0] bg-white text-[#5F6F65] hover:bg-[#F0F4ED] hover:text-[#1C231F] transition-colors cursor-pointer"
              >
                <Share2 className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleToggleFavorite}
                title={isFavorited ? 'Remove from Saved' : 'Save Doctor'}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors cursor-pointer ${
                  isFavorited
                    ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                    : 'border-[#C4CFC0] bg-white text-[#5F6F65] hover:bg-[#F0F4ED] hover:text-[#1C231F]'
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`}
                />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-b border-[#E2E8DF] py-3.5 text-left">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#808D7C] block">
                Rating
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-sm text-[#1C231F]">{doctor.rating.toFixed(2)}</span>
                <span className="text-xs text-[#808D7C]">({doctor.reviewCount})</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#808D7C] block">
                Experience
              </span>
              <span className="font-bold text-sm text-[#1C231F] mt-0.5 block">
                {doctor.experienceYears} Years
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#808D7C] block">
                Consultation
              </span>
              <span className="font-bold text-sm text-[#1C231F] mt-0.5 block">
                {formatCurrency(doctor.consultationFee)} <span className="text-xs font-normal text-[#808D7C]">/ 30m</span>
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#808D7C] block">
                Languages
              </span>
              <span className="font-bold text-sm text-[#1C231F] mt-0.5 block line-clamp-1">
                {doctor.languages.join(', ')}
              </span>
            </div>
          </div>

          {/* Clinic Affiliation Location & CTA on small screens */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#5F6F65]">
            <div className="flex items-center gap-1.5 justify-center md:justify-start">
              <Building2 className="h-4 w-4 text-[#9CA986] shrink-0" />
              <span>
                <strong className="text-[#1C231F]">{doctor.clinic.name}</strong> · {doctor.clinic.address}, {doctor.clinic.city}
              </span>
            </div>

            <div className="flex items-center gap-2 justify-center md:justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={onBookNow}
                leftIcon={<Calendar className="h-4 w-4" />}
                className="font-semibold shadow-xs"
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
