import React, { useState } from 'react';
import {
  ChevronRight,
  Home,
  User,
  GraduationCap,
  MapPin,
  Star,
  Calendar,
  Phone,
  ShieldCheck,
  Building2,
  ArrowLeft,
} from 'lucide-react';
import { Doctor } from '../types';
import { MOCK_DOCTORS } from '../data/mockDoctors';
import { useUIStore } from '../stores/useUIStore';
import { useBookingStore } from '../stores/useBookingStore';
import { DoctorHeader } from '../components/doctor/DoctorHeader';
import { DoctorOverview } from '../components/doctor/DoctorOverview';
import { ClinicLocationCard } from '../components/doctor/ClinicLocationCard';
import { ReviewsSection } from '../components/doctor/ReviewsSection';
import { DoctorBookingSidebar } from '../components/doctor/DoctorBookingSidebar';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

interface DoctorProfilePageProps {
  doctorId: string;
}

type TabType = 'overview' | 'education' | 'clinic' | 'reviews';

export function DoctorProfilePage({ doctorId }: DoctorProfilePageProps) {
  const { navigate } = useUIStore();
  const { initBooking } = useBookingStore();

  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const doctor: Doctor | undefined = MOCK_DOCTORS.find((d) => d.id === doctorId);

  if (!doctor) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="rounded-3xl border border-[#C4CFC0] bg-white p-12 shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F0F4ED] text-[#5F6F65] mb-4">
            <User className="h-8 w-8" />
          </div>
          <h2 className="font-serif text-3xl font-normal text-[#1C231F]">
            Doctor Profile Not Found
          </h2>
          <p className="text-sm text-[#5F6F65] mt-2 max-w-md mx-auto">
            The doctor profile you requested could not be located. They may have relocated or updated their practice listing.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button
              variant="primary"
              onClick={() => navigate({ path: '/search' })}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Browse All Doctors
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    initBooking(doctor);
    navigate({ path: '/book/:id', id: doctor.id });
  };

  const handleProceedToBooking = () => {
    navigate({ path: '/book/:id', id: doctor.id });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#5F6F65]">
        <button
          type="button"
          onClick={() => navigate({ path: '/' })}
          className="flex items-center gap-1 hover:text-[#1C231F] transition-colors cursor-pointer"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </button>
        <ChevronRight className="h-3 w-3 text-[#9CA986]" />
        <button
          type="button"
          onClick={() => navigate({ path: '/search' })}
          className="hover:text-[#1C231F] transition-colors cursor-pointer"
        >
          Doctors
        </button>
        <ChevronRight className="h-3 w-3 text-[#9CA986]" />
        <button
          type="button"
          onClick={() =>
            navigate({
              path: '/search',
              query: { specialty: doctor.specialty },
            })
          }
          className="hover:text-[#1C231F] transition-colors cursor-pointer"
        >
          {doctor.specialty}
        </button>
        <ChevronRight className="h-3 w-3 text-[#9CA986]" />
        <span className="font-semibold text-[#1C231F] truncate">{doctor.name}</span>
      </nav>

      {/* Doctor Header Banner */}
      <DoctorHeader doctor={doctor} onBookNow={handleBookNow} />

      {/* Main Grid: Content Tabs & Sticky Booking Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Main Column (7 or 8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Navigation Sub-Tabs */}
          <div className="flex border-b border-[#C4CFC0] bg-white rounded-2xl p-1.5 shadow-xs overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#5F6F65] text-white shadow-xs'
                  : 'text-[#5F6F65] hover:text-[#1C231F] hover:bg-[#F0F4ED]'
              }`}
            >
              <User className="h-4 w-4" />
              Overview & Focus
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('education')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'education'
                  ? 'bg-[#5F6F65] text-white shadow-xs'
                  : 'text-[#5F6F65] hover:text-[#1C231F] hover:bg-[#F0F4ED]'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Education & Certifications
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('clinic')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'clinic'
                  ? 'bg-[#5F6F65] text-white shadow-xs'
                  : 'text-[#5F6F65] hover:text-[#1C231F] hover:bg-[#F0F4ED]'
              }`}
            >
              <MapPin className="h-4 w-4" />
              Clinic Location & Map
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-[#5F6F65] text-white shadow-xs'
                  : 'text-[#5F6F65] hover:text-[#1C231F] hover:bg-[#F0F4ED]'
              }`}
            >
              <Star className="h-4 w-4" />
              Patient Reviews ({doctor.reviewCount})
            </button>
          </div>

          {/* Active Tab View */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <DoctorOverview doctor={doctor} />
              <ClinicLocationCard clinic={doctor.clinic} />
              <ReviewsSection doctor={doctor} />
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <DoctorOverview doctor={doctor} />
            </div>
          )}

          {activeTab === 'clinic' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <ClinicLocationCard clinic={doctor.clinic} />
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <ReviewsSection doctor={doctor} />
            </div>
          )}
        </div>

        {/* Right Column: Sticky Booking Widget & Clinic Card (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-6">
          <DoctorBookingSidebar
            doctor={doctor}
            onProceedToBooking={handleProceedToBooking}
          />

          {/* Practice Highlights Card */}
          <div className="rounded-3xl border border-[#C4CFC0] bg-white p-6 shadow-xs space-y-4 text-xs text-[#5F6F65]">
            <h3 className="font-serif text-base font-bold text-[#1C231F]">
              Practice Standards
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-[#5F6F65] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1C231F] block">HIPAA & Privacy Compliant</strong>
                  Encrypted electronic records and confidential consultations.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Building2 className="h-4 w-4 text-[#5F6F65] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1C231F] block">Direct Insurance Submission</strong>
                  Superbill provided for major PPO out-of-network reimbursement.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-[#5F6F65] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1C231F] block">Need Assistance?</strong>
                  Call clinic concierge at{' '}
                  <span className="font-mono font-bold text-[#1C231F]">
                    {doctor.clinic.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
