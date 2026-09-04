import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  MapPin,
  Calendar,
  Star,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Building2,
  Users,
  ChevronRight,
  HeartHandshake,
  BadgeCheck,
  Stethoscope,
  Activity,
  PhoneCall,
  Video,
  Heart,
  TestTube,
  Radio,
} from "lucide-react";
import { useUIStore } from "../stores/useUIStore";
import { useSearchStore } from "../stores/useSearchStore";
import { useBookingStore } from "../stores/useBookingStore";
import {
  MOCK_DOCTORS,
  SPECIALTIES,
  MOCK_REVIEWS,
  CLINICS,
} from "../data/mockDoctors";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { formatCurrency } from "../lib/utils";
import { getSpecialtyIcon } from "../utils/specialtyIcons";
import { HealthTipsCarousel } from "../components/home/HealthTipsCarousel";
import { QuickActionsSection } from "../components/home/QuickActionsSection";

export function HomePage() {
  const { navigate } = useUIStore();
  const { setQuery, setSpecialty, setLocation } = useSearchStore();
  const { initBooking } = useBookingStore();

  // Local hero search state
  const [searchDocName, setSearchDocName] = useState("");
  const [selectedSpecialty, setSelectedSpecialtyState] = useState("All");
  const [selectedLocation, setSelectedLocationState] = useState("All");

  const popularDoctors = MOCK_DOCTORS.slice(0, 4);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchDocName);
    setSpecialty(selectedSpecialty);
    setLocation(selectedLocation);
    navigate({
      path: "/search",
      query: {
        query: searchDocName,
        specialty: selectedSpecialty,
        location: selectedLocation,
      },
    });
  };

  const handleSelectSpecialtyCard = (specName: string) => {
    setSpecialty(specName);
    navigate({
      path: "/search",
      query: { specialty: specName },
    });
  };

  const handleBookDoctor = (docId: string) => {
    const doc = MOCK_DOCTORS.find((d) => d.id === docId);
    if (doc) {
      initBooking(doc);
      navigate({ path: "/book/:id", id: docId });
    }
  };

  const handleViewProfile = (docId: string) => {
    navigate({ path: "/doctors/:id", id: docId });
  };

  return (
    <div className="space-y-12 lg:space-y-20 pb-12">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-[#EAF5F6] pt-10 pb-14 sm:pt-16 sm:pb-20 border-b border-[#D7E6E8]">
        {/* Subtle Decorative Elements */}

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Subtle Motion Hero Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 border-l-2 border-[#168292] bg-white/70 px-3 py-1.5 mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#5F6F65] animate-pulse" />
              <span className="text-xs font-semibold text-[#2B352F] tracking-wide">
                Direct Clinic API · Real-time Availability
              </span>
              <Badge variant="sage" size="sm" className="hidden sm:inline-flex">
                Instant Confirmation
              </Badge>
            </motion.div>

            {/* Hero Headline - High legibility font for all ages */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-2xl text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#143B43] leading-[1.08]"
            >
              Book a verified doctor in{" "}
              <span className="text-[#5F6F65] underline decoration-[#C9DABF] decoration-4 underline-offset-8">
                60 seconds
              </span>{" "}
              — zero hassle.
            </motion.h1>

            {/* Hero Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 max-w-2xl text-base sm:text-lg text-[#37616A] leading-relaxed"
            >
              Discover board-certified physicians, compare honest patient
              reviews, view live available slots, and book your in-person or
              telehealth visit seamlessly.
            </motion.p>
          </div>

          {/* ========================================================================= */}
          {/* SEARCH BAR CARD */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 max-w-5xl"
          >
            <form
              onSubmit={handleHeroSearch}
              className="rounded-lg border border-[#AFC8CC] bg-white p-3 sm:p-4 shadow-[0_12px_30px_rgba(20,59,67,0.08)] transition-all"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* Doctor name / condition search input */}
                <div className="md:col-span-5 relative">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#5F6F65] block mb-1 px-1">
                    Doctor, Condition, or Clinic
                  </label>
                  <div className="relative flex items-center">
                    <Search className="absolute left-3.5 h-4 w-4 text-[#808D7C]" />
                    <input
                      type="text"
                      placeholder="e.g. Prof. Hashem, Evercare, Cardiology..."
                      value={searchDocName}
                      onChange={(e) => setSearchDocName(e.target.value)}
                      className="w-full rounded-xl border border-[#E2E8DF] bg-[#F8FAF7] pl-10 pr-3.5 py-2.5 text-sm text-[#1C231F] placeholder:text-[#808D7C]/70 focus:bg-white focus:border-[#5F6F65] focus:outline-none focus:ring-2 focus:ring-[#5F6F65]/15 transition-all"
                    />
                  </div>
                </div>

                {/* Specialty Select */}
                <div className="md:col-span-3">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#5F6F65] block mb-1 px-1">
                    Specialty
                  </label>
                  <div className="relative flex items-center">
                    <Stethoscope className="absolute left-3.5 h-4 w-4 text-[#808D7C] pointer-events-none" />
                    <select
                      value={selectedSpecialty}
                      onChange={(e) =>
                        setSelectedSpecialtyState(e.target.value)
                      }
                      className="w-full appearance-none rounded-xl border border-[#E2E8DF] bg-[#F8FAF7] pl-10 pr-8 py-2.5 text-sm text-[#1C231F] font-medium focus:bg-white focus:border-[#5F6F65] focus:outline-none focus:ring-2 focus:ring-[#5F6F65]/15 transition-all cursor-pointer"
                    >
                      <option value="All">All Specialties</option>
                      {SPECIALTIES.map((spec) => (
                        <option key={spec.name} value={spec.name}>
                          {spec.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location Select */}
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#5F6F65] block mb-1 px-1">
                    Location
                  </label>
                  <div className="relative flex items-center">
                    <MapPin className="absolute left-3.5 h-4 w-4 text-[#808D7C] pointer-events-none" />
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocationState(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-[#E2E8DF] bg-[#F8FAF7] pl-10 pr-8 py-2.5 text-sm text-[#1C231F] font-medium focus:bg-white focus:border-[#5F6F65] focus:outline-none focus:ring-2 focus:ring-[#5F6F65]/15 transition-all cursor-pointer"
                    >
                      <option value="All">All Cities</option>
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chattogram">Chattogram</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rajshahi">Rajshahi</option>
                    </select>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="md:col-span-2 md:pt-5">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full justify-center h-10.5 font-semibold"
                    leftIcon={<Search className="h-4 w-4" />}
                  >
                    Find Doctor
                  </Button>
                </div>
              </div>
            </form>

            {/* Quick Filter Tags */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-[#5F6F65]">
              <span className="font-semibold text-[#1C231F]">Popular:</span>
              {[
                "Cardiology",
                "Dermatology",
                "General Practice",
                "Pediatrics",
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleSelectSpecialtyCard(tag)}
                  className="rounded-lg bg-white border border-[#C4CFC0] px-2.5 py-1 text-xs text-[#2B352F] hover:bg-[#E7EFE3] hover:border-[#9CA986] transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Trust stats row */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden border border-[#AFC8CC] bg-[#AFC8CC] text-left">
            <div className="bg-white p-4">
              <p className="font-serif text-3xl font-bold text-[#1C231F]">
                100%
              </p>
              <p className="text-xs font-semibold text-[#5F6F65] mt-1">
                Verified Medical Credentials
              </p>
            </div>
            <div className="bg-white p-4">
              <p className="font-serif text-3xl font-bold text-[#1C231F]">
                4.95 / 5
              </p>
              <p className="text-xs font-semibold text-[#5F6F65] mt-1">
                Average Patient Satisfaction
              </p>
            </div>
            <div className="bg-white p-4">
              <p className="font-serif text-3xl font-bold text-[#1C231F]">
                0 min
              </p>
              <p className="text-xs font-semibold text-[#5F6F65] mt-1">
                Hold Music or Call Waiting
              </p>
            </div>
            <div className="bg-white p-4">
              <p className="font-serif text-3xl font-bold text-[#1C231F]">
                60 Sec
              </p>
              <p className="text-xs font-semibold text-[#5F6F65] mt-1">
                Average Booking Completion
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DAILY HEALTH TIPS CAROUSEL (For all age groups: Kids, Seniors & Adults) */}
      {/* ========================================================================= */}
      <HealthTipsCarousel />

      {/* ========================================================================= */}
      {/* 3. QUICK ACTIONS SHORTCUTS (Book Appointment, View Prescriptions, Emergency) */}
      {/* ========================================================================= */}
      <QuickActionsSection />

      {/* ========================================================================= */}
      {/* 4. SPECIALTIES SECTION */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <Badge variant="sage" size="sm" className="mb-2">
              Clinical Specializations
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1C231F]">
              Explore by Medical Specialty
            </h2>
            <p className="text-sm text-[#5F6F65] mt-1">
              Connect with certified specialists tailored to your precise
              healthcare needs.
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ path: "/search" })}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Browse All 12 Specialties
          </Button>
        </div>

        {/* Specialty Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {SPECIALTIES.map((spec) => {
            const Icon = getSpecialtyIcon(spec.name);
            return (
              <button
                key={spec.name}
                type="button"
                onClick={() => handleSelectSpecialtyCard(spec.name)}
                className="group flex flex-col items-center text-center rounded-2xl border border-[#E2E8DF] bg-white p-5 hover:border-[#9CA986] hover:bg-[#F4F7F2] hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E7EFE3] text-[#5F6F65] group-hover:bg-[#C9DABF] group-hover:text-[#1C231F] transition-colors mb-3">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-[#1C231F] group-hover:text-[#5F6F65] transition-colors">
                  {spec.name}
                </h3>
                <span className="text-[11px] text-[#808D7C] mt-1">
                  {spec.doctorCount} Doctors
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. POPULAR / FEATURED DOCTORS */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <Badge variant="woodland" size="sm" className="mb-2">
              Top Rated Providers
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1C231F]">
              Recommended Physicians
            </h2>
            <p className="text-sm text-[#5F6F65] mt-1">
              Top-reviewed doctors with immediate appointment slots available
              this week.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ path: "/search" })}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            View All Doctors
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDoctors.map((doc) => (
            <motion.div
              key={doc.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col justify-between rounded-2xl border border-[#C4CFC0]/80 bg-white p-5 shadow-xs hover:shadow-lg transition-all"
            >
              <div>
                {/* Doctor Avatar + Rating Pill */}
                <div className="relative mb-4">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="h-44 w-full rounded-xl object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-bold text-[#1C231F] shadow-xs backdrop-blur-xs">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{doc.rating.toFixed(2)}</span>
                    <span className="text-[10px] text-[#808D7C]">
                      ({doc.reviewCount})
                    </span>
                  </div>
                  {doc.acceptingNewPatients && (
                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-md bg-[#5F6F65] px-2 py-0.5 text-[10px] font-semibold text-white">
                      <CheckCircle2 className="h-3 w-3" />
                      Accepting New Patients
                    </div>
                  )}
                </div>

                {/* Doctor Info */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#5F6F65]">
                      {doc.specialty}
                    </span>
                    <span className="text-xs text-[#808D7C]">
                      {doc.experienceYears}y exp
                    </span>
                  </div>

                  <h3
                    onClick={() => handleViewProfile(doc.id)}
                    className="text-base font-bold text-[#1C231F] hover:text-[#5F6F65] transition-colors cursor-pointer line-clamp-1"
                  >
                    {doc.name}
                  </h3>

                  <p className="text-xs text-[#808D7C] flex items-center gap-1 line-clamp-1">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#9CA986]" />
                    {doc.clinic.name} · {doc.clinic.city}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-[#E2E8DF] mt-3">
                    <span className="text-xs text-[#5F6F65]">
                      Consultation fee:
                    </span>
                    <span className="text-sm font-bold text-[#1C231F]">
                      {formatCurrency(doc.consultationFee)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => handleViewProfile(doc.id)}
                >
                  Profile
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 text-xs font-semibold"
                  onClick={() => handleBookDoctor(doc.id)}
                >
                  Book Slot
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. HOW BOOKING WORKS */}
      {/* ========================================================================= */}


      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Phase 9 Emergency Care & Digital Health Quick Access Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {/* Emergency & Ambulance Dispatch */}
          <button
            type="button"
            onClick={() => navigate({ path: "/emergency" })}
            className="group flex items-start gap-4 rounded-3xl border-2 border-red-200 bg-red-50/70 p-5 text-left transition-all hover:bg-red-50 hover:border-red-400 hover:shadow-lg cursor-pointer"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white shrink-0 group-hover:scale-105 transition-transform shadow-md">
              <PhoneCall className="h-6 w-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-red-950">
                  24/7 SOS & Ambulance
                </span>
                <span className="flex h-2 w-2 rounded-full bg-red-600 animate-ping" />
              </div>
              <p className="text-xs text-red-800 leading-snug">
                GPS-tracked ICU ambulances, 999 hotline, blood donor registry,
                and live hospital ICU bed tracker.
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 pt-1 group-hover:underline">
                Emergency Hub <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </button>

          {/* Instant Telehealth Video Room */}
          <button
            type="button"
            onClick={() => navigate({ path: "/telehealth" })}
            className="group flex items-start gap-4 rounded-3xl border border-[#C4CFC0] bg-white p-5 text-left transition-all hover:border-[#5F6F65] hover:shadow-lg cursor-pointer"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shrink-0 group-hover:scale-105 transition-transform shadow-md">
              <Video className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#1C231F]">
                  Live Video Consultation
                </span>
                <Badge
                  variant="outline"
                  className="text-[10px] text-blue-700 border-blue-300 bg-blue-50"
                >
                  HD Telehealth
                </Badge>
              </div>
              <p className="text-xs text-[#5F6F65] leading-snug">
                Real-time encrypted video room with in-call vitals monitoring,
                doctor chat, and live e-Rx writing.
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 pt-1 group-hover:underline">
                Launch Video Suite <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </button>

          {/* Personal Health Vault & Vitals */}
          <button
            type="button"
            onClick={() => navigate({ path: "/health-records" })}
            className="group flex items-start gap-4 rounded-3xl border border-[#C4CFC0] bg-white p-5 text-left transition-all hover:border-[#5F6F65] hover:shadow-lg cursor-pointer"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5F6F65] text-white shrink-0 group-hover:scale-105 transition-transform shadow-md">
              <Activity className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#1C231F]">
                  Patient Health Vault
                </span>
                <Badge
                  variant="outline"
                  className="text-[10px] text-emerald-800 border-emerald-300 bg-emerald-50"
                >
                  EHR
                </Badge>
              </div>
              <p className="text-xs text-[#5F6F65] leading-snug">
                Track BP & glucose biomarkers, archive diagnostic lab PDFs, and
                generate your Emergency Medical ID.
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5F6F65] pt-1 group-hover:underline">
                Open Health Vault <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </button>
        </div>

        {/* Phase 10 Smart Diagnostic, Queue & Insurance Services Grid */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {/* 1. Diagnostic Lab Tests */}
          <button
            type="button"
            onClick={() => navigate({ path: "/lab-tests" })}
            className="group flex flex-col justify-between rounded-3xl border border-[#C4CFC0] bg-white p-5 text-left transition-all hover:border-[#5F6F65] hover:shadow-md cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                  <TestTube className="h-5 w-5" />
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] text-purple-700 border-purple-300 bg-purple-50"
                >
                  Home Sample
                </Badge>
              </div>
              <h4 className="font-bold text-sm text-[#1C231F]">
                Diagnostic Lab Tests
              </h4>
              <p className="text-xs text-[#5F6F65] mt-1 leading-snug">
                Pathology packages from Popular, Ibn Sina & Labaid with home
                phlebotomist collection.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 pt-3 group-hover:underline">
              Explore Lab Tests <ArrowRight className="h-3 w-3" />
            </span>
          </button>

          {/* 2. Live Chamber Queue Tracker */}
          <button
            type="button"
            onClick={() => navigate({ path: "/chamber-tracker" })}
            className="group flex flex-col justify-between rounded-3xl border border-[#C4CFC0] bg-white p-5 text-left transition-all hover:border-emerald-600 hover:shadow-md cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-xs group-hover:scale-105 transition-transform">
                  <Radio className="h-5 w-5" />
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping" />
                  Live Serial
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#1C231F]">
                Chamber Queue Tracker
              </h4>
              <p className="text-xs text-[#5F6F65] mt-1 leading-snug">
                Monitor your live OPD doctor token in real time with delay
                alerts and digital gate passes.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 pt-3 group-hover:underline">
              Track Live Serial <ArrowRight className="h-3 w-3" />
            </span>
          </button>

          {/* 3. Family Health Profiles */}
          <button
            type="button"
            onClick={() => navigate({ path: "/family-profiles" })}
            className="group flex flex-col justify-between rounded-3xl border border-[#C4CFC0] bg-white p-5 text-left transition-all hover:border-[#5F6F65] hover:shadow-md cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5F6F65] text-white shadow-xs group-hover:scale-105 transition-transform">
                  <Users className="h-5 w-5" />
                </div>
                <Badge variant="sage" size="sm" className="text-[10px]">
                  Multi-Patient
                </Badge>
              </div>
              <h4 className="font-bold text-sm text-[#1C231F]">
                Family Health Profiles
              </h4>
              <p className="text-xs text-[#5F6F65] mt-1 leading-snug">
                Manage medical histories, chronic illnesses, and drug allergies
                for your parents & children.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5F6F65] pt-3 group-hover:underline">
              Manage Family <ArrowRight className="h-3 w-3" />
            </span>
          </button>

          {/* 4. Health Insurance & Takaful */}
          <button
            type="button"
            onClick={() => navigate({ path: "/insurance" })}
            className="group flex flex-col justify-between rounded-3xl border border-[#C4CFC0] bg-white p-5 text-left transition-all hover:border-[#5F6F65] hover:shadow-md cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-700 text-white shadow-xs group-hover:scale-105 transition-transform">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] text-amber-800 border-amber-300 bg-amber-50"
                >
                  Cashless OPD
                </Badge>
              </div>
              <h4 className="font-bold text-sm text-[#1C231F]">
                Insurance & Claims Hub
              </h4>
              <p className="text-xs text-[#5F6F65] mt-1 leading-snug">
                Check corporate policy limits and submit paperless medical
                reimbursement claims.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 pt-3 group-hover:underline">
              File Claims <ArrowRight className="h-3 w-3" />
            </span>
          </button>
        </div>
      </section>
      {/* ========================================================================= */}
      {/* 5. FEATURED HOSPITALS & PAVILIONS */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="outline" size="sm" className="mb-2">
            Clinical Partner Network
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1C231F]">
            Affiliated Medical Centers
          </h2>
          <p className="text-sm text-[#5F6F65] mt-1">
            Care delivered across premier medical facilities and certified
            clinics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(CLINICS)
            .slice(0, 3)
            .map((clinic) => (
              <div
                key={clinic.id}
                className="rounded-2xl border border-[#E2E8DF] bg-white p-6 hover:border-[#9CA986] transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0F4ED] text-[#5F6F65] mb-4">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-[#1C231F]">
                  {clinic.name}
                </h3>
                <p className="text-xs text-[#808D7C] mt-1 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#9CA986]" />
                  {clinic.address}, {clinic.city}, {clinic.state}
                </p>
                <div className="mt-4 pt-3 border-t border-[#E2E8DF] flex items-center justify-between text-xs text-[#5F6F65]">
                  <span>Contact: {clinic.phone}</span>
                  <span className="font-semibold text-[#5F6F65]">
                    Open 8am-6pm
                  </span>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. PATIENT REVIEWS */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <Badge variant="sage" size="sm" className="mb-2">
              Verified Testimonials
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1C231F]">
              What Patients Are Saying
            </h2>
            <p className="text-sm text-[#5F6F65] mt-1">
              Real feedback from patients who booked their consultations through
              MediBook.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {MOCK_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col justify-between rounded-2xl border border-[#E2E8DF] bg-white p-5 shadow-xs"
            >
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-xs text-[#2B352F] leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E2E8DF] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#1C231F]">
                    {rev.author}
                  </h4>
                  <span className="text-[10px] text-[#808D7C]">{rev.date}</span>
                </div>
                {rev.waitDurationMinutes && (
                  <span className="rounded-md bg-[#E7EFE3] px-2 py-0.5 text-[10px] font-semibold text-[#5F6F65]">
                    {rev.waitDurationMinutes}m clinic wait
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. APPOINTMENT CTA BANNER */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#5F6F65] p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-[#C9DABF]/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-[#9CA986]/30 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <Badge
              variant="sage"
              size="md"
              className="mb-4 bg-[#C9DABF] text-[#1C231F]"
            >
              Ready for your appointment?
            </Badge>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white leading-tight">
              Take charge of your health in less than a minute.
            </h2>

            <p className="mt-4 text-sm sm:text-base text-[#E7EFE3] leading-relaxed">
              Find top doctors in your area, select your preferred time slot,
              and receive immediate booking confirmation.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                variant="sage"
                onClick={() => navigate({ path: "/search" })}
                leftIcon={<Search className="h-5 w-5" />}
              >
                Find a Doctor Now
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white/60 hover:bg-white/10 hover:text-white"
                onClick={() =>
                  navigate({ path: "/dashboard/appointments", tab: "upcoming" })
                }
              >
                Manage My Bookings
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
