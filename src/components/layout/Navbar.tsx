import React, { useState, useRef, useEffect } from "react";
import {
  Calendar,
  Menu,
  X,
  Globe,
  Search,
  CheckCircle,
  ChevronDown,
  PhoneCall,
  TestTube,
  Radio,
  Users,
  ShieldCheck,
  FileText,
  Clock,
  Heart,
  Sparkles,
  ArrowRight,
  Plus,
  Stethoscope,
} from "lucide-react";
import { useUIStore, AVAILABLE_TIMEZONES } from "../../stores/useUIStore";
import { useAppointmentStore } from "../../stores/useAppointmentStore";
import { useFamilyProfilesStore } from "../../stores/useFamilyProfilesStore";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { cn } from "../../lib/utils";

export function Navbar() {
  const {
    currentRoute,
    navigate,
    selectedTimezone,
    setTimezone,
    isMobileMenuOpen,
    toggleMobileMenu,
  } = useUIStore();
  const { appointments } = useAppointmentStore();
  const { profiles, activeProfileId, setActiveProfileId, getActiveProfile } =
    useFamilyProfilesStore();
  const activeProfile = getActiveProfile();

  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const servicesRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node)
      ) {
        setShowServicesDropdown(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const upcomingCount = appointments.filter(
    (a) => a.status === "upcoming",
  ).length;
  const activePath = currentRoute.path;

  const currentTzLabel =
    AVAILABLE_TIMEZONES.find((t) => t.value === selectedTimezone)?.label.split(
      " ",
    )[0] ||
    selectedTimezone.split("/")[1]?.replace("_", " ") ||
    "Local Time";

  const isServicesActive =
    activePath === "/lab-tests" ||
    activePath === "/chamber-tracker" ||
    activePath === "/insurance" ||
    activePath === "/family-profiles" ||
    activePath === "/prescriptions" ||
    activePath === "/dashboard/prescriptions" ||
    activePath === "/health-records";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#D7E6E8] bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* 1. Left: High-Clarity Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              id="navbar-brand-logo"
              onClick={() => {
                navigate({ path: "/" });
                if (isMobileMenuOpen) toggleMobileMenu();
              }}
              className="group flex items-center gap-3 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168292] rounded-lg p-1 -ml-1 transition-all"
              aria-label="MediBook Home"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#126675] text-white group-hover:bg-[#0F5360] transition-colors">
                <Stethoscope className="h-6 w-6 text-[#E7EFE3]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-sans text-2xl font-bold tracking-tight text-[#143B43]">
                    Medi<span className="text-[#168292]">Book</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center rounded-full bg-[#E7EFE3] px-2.5 py-0.5 text-xs font-bold text-[#2B352F] border border-[#C9DABF]">
                    Easy Healthcare
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#5F6F65] leading-none mt-0.5">
                  Doctors • Diagnostics • Live Queue
                </p>
              </div>
            </button>

            {/* 2. Desktop Navigation: Clean, Uncluttered & High Legibility */}
            <nav
              className="hidden lg:flex items-center gap-1.5 ml-2"
              aria-label="Main Navigation"
            >
              {/* Find Doctors */}
              <button
                type="button"
                id="nav-find-doctors"
                onClick={() => navigate({ path: "/search" })}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors cursor-pointer",
                  activePath === "/search" || activePath.startsWith("/doctors")
                    ? "bg-[#E7EFE3] text-[#1C231F]"
                    : "text-[#46544C] hover:bg-[#F0F4ED] hover:text-[#1C231F]",
                )}
              >
                <Search className="h-4 w-4 text-[#5F6F65]" />
                <span>Find Doctors</span>
              </button>

              {/* My Appointments */}
              <button
                type="button"
                id="nav-appointments"
                onClick={() =>
                  navigate({ path: "/dashboard/appointments", tab: "upcoming" })
                }
                className={cn(
                  "relative flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors cursor-pointer",
                  activePath.startsWith("/dashboard/appointments")
                    ? "bg-[#E7EFE3] text-[#1C231F]"
                    : "text-[#46544C] hover:bg-[#F0F4ED] hover:text-[#1C231F]",
                )}
              >
                <Calendar className="h-4 w-4 text-[#5F6F65]" />
                <span>My Appointments</span>
                {upcomingCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#5F6F65] px-1.5 text-xs font-bold text-white shadow-xs">
                    {upcomingCount}
                  </span>
                )}
              </button>

              {/* Services Dropdown (Cleans up 5 previously separate cluttered buttons) */}
              <div className="relative" ref={servicesRef}>
                <button
                  type="button"
                  id="nav-services-menu"
                  onClick={() => {
                    setShowServicesDropdown(!showServicesDropdown);
                    setShowProfileDropdown(false);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors cursor-pointer",
                    isServicesActive || showServicesDropdown
                      ? "bg-[#E7EFE3] text-[#1C231F]"
                      : "text-[#46544C] hover:bg-[#F0F4ED] hover:text-[#1C231F]",
                  )}
                  aria-expanded={showServicesDropdown}
                >
                  <span>Services & Labs</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-[#5F6F65] transition-transform duration-200",
                      showServicesDropdown && "rotate-180",
                    )}
                  />
                </button>

                {showServicesDropdown && (
                  <div className="absolute left-0 mt-2 z-50 w-72 rounded-2xl border border-[#C4CFC0] bg-white p-2.5 shadow-xl animate-in fade-in-50 zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#808D7C] border-b border-[#E2E8DF] mb-1.5">
                      Healthcare Services
                    </div>

                    <div className="space-y-1">
                      {/* Lab Tests */}
                      <button
                        type="button"
                        id="nav-dropdown-lab-tests"
                        onClick={() => {
                          setShowServicesDropdown(false);
                          navigate({ path: "/lab-tests" });
                        }}
                        className={cn(
                          "w-full text-left rounded-xl p-2.5 transition-colors flex items-start gap-3 cursor-pointer",
                          activePath === "/lab-tests"
                            ? "bg-[#E7EFE3] text-[#1C231F]"
                            : "hover:bg-[#F4F7F2]",
                        )}
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700 shrink-0 mt-0.5">
                          <TestTube className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-[#1C231F]">
                              Diagnostic Lab Tests
                            </span>
                            <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-1.5 py-0.2 rounded">
                              Home Sample
                            </span>
                          </div>
                          <p className="text-xs text-[#5F6F65] mt-0.5">
                            Blood tests, health packages & reports
                          </p>
                        </div>
                      </button>

                      {/* Live Queue */}
                      <button
                        type="button"
                        id="nav-dropdown-chamber-tracker"
                        onClick={() => {
                          setShowServicesDropdown(false);
                          navigate({ path: "/chamber-tracker" });
                        }}
                        className={cn(
                          "w-full text-left rounded-xl p-2.5 transition-colors flex items-start gap-3 cursor-pointer",
                          activePath === "/chamber-tracker"
                            ? "bg-[#E7EFE3] text-[#1C231F]"
                            : "hover:bg-[#F4F7F2]",
                        )}
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                          <Radio className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-[#1C231F]">
                              Live Chamber Serial
                            </span>
                            <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
                          </div>
                          <p className="text-xs text-[#5F6F65] mt-0.5">
                            Track your OPD doctor serial number
                          </p>
                        </div>
                      </button>

                      {/* Family Health Profiles */}
                      <button
                        type="button"
                        id="nav-dropdown-family"
                        onClick={() => {
                          setShowServicesDropdown(false);
                          navigate({ path: "/family-profiles" });
                        }}
                        className={cn(
                          "w-full text-left rounded-xl p-2.5 transition-colors flex items-start gap-3 cursor-pointer",
                          activePath === "/family-profiles"
                            ? "bg-[#E7EFE3] text-[#1C231F]"
                            : "hover:bg-[#F4F7F2]",
                        )}
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E7EFE3] text-[#5F6F65] shrink-0 mt-0.5">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="font-bold text-sm text-[#1C231F] block">
                            Family Health Circle
                          </span>
                          <p className="text-xs text-[#5F6F65] mt-0.5">
                            Manage parents, spouse & child records
                          </p>
                        </div>
                      </button>

                      {/* Insurance & Claims */}
                      <button
                        type="button"
                        id="nav-dropdown-insurance"
                        onClick={() => {
                          setShowServicesDropdown(false);
                          navigate({ path: "/insurance" });
                        }}
                        className={cn(
                          "w-full text-left rounded-xl p-2.5 transition-colors flex items-start gap-3 cursor-pointer",
                          activePath === "/insurance"
                            ? "bg-[#E7EFE3] text-[#1C231F]"
                            : "hover:bg-[#F4F7F2]",
                        )}
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                          <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-[#1C231F]">
                              Health Insurance
                            </span>
                            <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded">
                              Cashless
                            </span>
                          </div>
                          <p className="text-xs text-[#5F6F65] mt-0.5">
                            Coverage limits & instant claim filing
                          </p>
                        </div>
                      </button>

                      {/* Digital Prescriptions & Records */}
                      <button
                        type="button"
                        id="nav-dropdown-records"
                        onClick={() => {
                          setShowServicesDropdown(false);
                          navigate({ path: "/dashboard/prescriptions" });
                        }}
                        className={cn(
                          "w-full text-left rounded-xl p-2.5 transition-colors flex items-start gap-3 cursor-pointer",
                          activePath === "/dashboard/prescriptions"
                            ? "bg-[#E7EFE3] text-[#1C231F]"
                            : "hover:bg-[#F4F7F2]",
                        )}
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-800 shrink-0 mt-0.5">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="font-bold text-sm text-[#1C231F] block">
                            Prescriptions & Vault
                          </span>
                          <p className="text-xs text-[#5F6F65] mt-0.5">
                            Doctor advice, dosage & test results
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 24/7 SOS Emergency (Directly accessible & distinct) */}
              <button
                type="button"
                id="nav-emergency-sos"
                onClick={() => navigate({ path: "/emergency" })}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer shadow-xs ml-1",
                  activePath === "/emergency"
                    ? "bg-red-600 text-white shadow-md"
                    : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white",
                )}
              >
                <PhoneCall className="h-3.5 w-3.5 animate-bounce" />
                <span>24/7 SOS</span>
              </button>
            </nav>
          </div>

          {/* 3. Right: Active Patient Profile Switcher & Primary CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Active Patient Profile Pill (Clear, recognizable for all ages) */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                id="navbar-patient-profile-btn"
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown);
                  setShowServicesDropdown(false);
                }}
                className="flex items-center gap-2.5 rounded-2xl border border-[#C4CFC0] bg-[#F8FAF7] px-3 py-1.5 text-xs font-bold text-[#1C231F] hover:bg-[#EAEFE6] transition-colors cursor-pointer shadow-2xs"
                title="Current Patient Profile"
                aria-expanded={showProfileDropdown}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-black shadow-xs ${activeProfile.avatarBgColor}`}
                >
                  {activeProfile.fullName.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-sm text-[#1C231F] max-w-28 truncate">
                      {activeProfile.fullName.split(" ")[0]}
                    </span>
                    <span className="text-[11px] font-medium text-[#5F6F65]">
                      ({activeProfile.relationship})
                    </span>
                  </div>
                  <span className="text-[10px] text-[#5F6F65] font-semibold block leading-none">
                    Patient Active
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-[#5F6F65] transition-transform duration-200",
                    showProfileDropdown && "rotate-180",
                  )}
                />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 z-50 w-72 rounded-2xl border border-[#C4CFC0] bg-white p-3 shadow-xl animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2E8DF]">
                    <div>
                      <span className="text-xs font-bold text-[#1C231F] block">
                        Select Patient
                      </span>
                      <span className="text-[11px] text-[#808D7C]">
                        Book appointments for anyone
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        navigate({ path: "/family-profiles" });
                      }}
                      className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
                    >
                      Manage
                    </button>
                  </div>

                  {/* Family member list */}
                  <div className="space-y-1 max-h-56 overflow-y-auto">
                    {profiles.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setActiveProfileId(p.id);
                          setShowProfileDropdown(false);
                        }}
                        className={cn(
                          "w-full text-left rounded-xl p-2 text-xs transition-colors flex items-center justify-between cursor-pointer",
                          activeProfileId === p.id
                            ? "bg-[#E7EFE3] text-[#1C231F] font-bold"
                            : "text-[#46544C] hover:bg-[#F0F4ED]",
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-black shadow-2xs ${p.avatarBgColor}`}
                          >
                            {p.fullName.charAt(0)}
                          </span>
                          <div>
                            <span className="font-bold text-sm block leading-snug">
                              {p.fullName}
                            </span>
                            <span className="text-[11px] text-[#808D7C] font-normal">
                              {p.relationship} • {p.bloodGroup || "Blood N/A"}
                            </span>
                          </div>
                        </div>
                        {activeProfileId === p.id && (
                          <CheckCircle className="h-4 w-4 text-emerald-700 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Timezone Preference in Profile Dropdown (Clean & Uncluttered) */}
                  <div className="pt-2.5 mt-2 border-t border-[#E2E8DF]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-[#5F6F65] flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5" /> Timezone
                      </span>
                      <span className="text-[11px] font-semibold text-[#1C231F]">
                        {currentTzLabel}
                      </span>
                    </div>
                    <select
                      value={selectedTimezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full rounded-xl border border-[#C4CFC0] bg-[#F8FAF7] px-2.5 py-1.5 text-xs text-[#2B352F] font-semibold cursor-pointer"
                    >
                      {AVAILABLE_TIMEZONES.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2 mt-2 border-t border-[#E2E8DF]">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        navigate({ path: "/family-profiles" });
                      }}
                      className="w-full text-center py-2 rounded-xl bg-[#E7EFE3] text-[#1C231F] font-bold text-xs hover:bg-[#C9DABF] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Family Member
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Find Doctor CTA */}
            <Button
              size="md"
              variant="primary"
              onClick={() => navigate({ path: "/search" })}
              leftIcon={<Search className="h-4 w-4" />}
              className="text-sm font-bold shadow-sm"
              id="navbar-book-now-btn"
            >
              Book Doctor
            </Button>
          </div>

          {/* 4. Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Quick Active Patient Avatar on Mobile */}
            <button
              type="button"
              onClick={() => navigate({ path: "/family-profiles" })}
              className={`h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-xs ${activeProfile.avatarBgColor}`}
              title={`Active: ${activeProfile.fullName}`}
            >
              {activeProfile.fullName.charAt(0)}
            </button>

            <button
              type="button"
              id="navbar-mobile-toggle-btn"
              onClick={() => toggleMobileMenu()}
              className="rounded-2xl border border-[#C4CFC0] bg-white p-2.5 text-[#1C231F] hover:bg-[#F0F4ED] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Mobile Drawer Menu (Large, crystal-clear buttons for seniors, parents & children) */}
      {isMobileMenuOpen && (
        <div className="border-b border-[#C4CFC0] bg-white px-4 pt-3 pb-8 lg:hidden animate-in slide-in-from-top-4 duration-200 shadow-xl max-h-[85vh] overflow-y-auto">
          {/* Active Patient Card on Mobile */}
          <div className="flex items-center justify-between rounded-2xl bg-[#F0F4ED] p-3.5 mb-4 border border-[#C4CFC0]">
            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-extrabold text-sm ${activeProfile.avatarBgColor}`}
              >
                {activeProfile.fullName.charAt(0)}
              </div>
              <div>
                <span className="text-xs text-[#5F6F65] block font-semibold">
                  Active Patient Profile
                </span>
                <span className="text-base font-extrabold text-[#1C231F] block">
                  {activeProfile.fullName}
                </span>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toggleMobileMenu();
                navigate({ path: "/family-profiles" });
              }}
              className="text-xs font-bold bg-white"
            >
              Switch
            </Button>
          </div>

          <nav className="flex flex-col gap-2">
            {/* Find Doctors */}
            <button
              type="button"
              onClick={() => {
                toggleMobileMenu();
                navigate({ path: "/search" });
              }}
              className={cn(
                "flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-bold text-left transition-colors cursor-pointer",
                activePath === "/search" || activePath.startsWith("/doctors")
                  ? "bg-[#E7EFE3] text-[#1C231F]"
                  : "text-[#2B352F] hover:bg-[#F0F4ED]",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5F6F65] text-white">
                  <Search className="h-5 w-5" />
                </div>
                <span>Find & Book Doctors</span>
              </div>
              <ArrowRight className="h-4 w-4 text-[#808D7C]" />
            </button>

            {/* My Appointments */}
            <button
              type="button"
              onClick={() => {
                toggleMobileMenu();
                navigate({ path: "/dashboard/appointments", tab: "upcoming" });
              }}
              className={cn(
                "flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-bold text-left transition-colors cursor-pointer",
                activePath.startsWith("/dashboard/appointments")
                  ? "bg-[#E7EFE3] text-[#1C231F]"
                  : "text-[#2B352F] hover:bg-[#F0F4ED]",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5F6F65] text-white">
                  <Calendar className="h-5 w-5" />
                </div>
                <span>My Appointments</span>
              </div>
              {upcomingCount > 0 ? (
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#5F6F65] px-2 text-xs font-bold text-white">
                  {upcomingCount}
                </span>
              ) : (
                <ArrowRight className="h-4 w-4 text-[#808D7C]" />
              )}
            </button>

            {/* Lab Tests */}
            <button
              type="button"
              onClick={() => {
                toggleMobileMenu();
                navigate({ path: "/lab-tests" });
              }}
              className={cn(
                "flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-bold text-left transition-colors cursor-pointer",
                activePath === "/lab-tests"
                  ? "bg-[#E7EFE3] text-[#1C231F]"
                  : "text-[#2B352F] hover:bg-[#F0F4ED]",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white">
                  <TestTube className="h-5 w-5" />
                </div>
                <div>
                  <span className="block leading-tight">
                    Diagnostic Lab Tests
                  </span>
                  <span className="text-xs text-[#5F6F65] font-normal">
                    Home blood sample collection
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-[#808D7C]" />
            </button>

            {/* Chamber Queue Tracker */}
            <button
              type="button"
              onClick={() => {
                toggleMobileMenu();
                navigate({ path: "/chamber-tracker" });
              }}
              className={cn(
                "flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-bold text-left transition-colors cursor-pointer",
                activePath === "/chamber-tracker"
                  ? "bg-[#E7EFE3] text-[#1C231F]"
                  : "text-[#2B352F] hover:bg-[#F0F4ED]",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-white">
                  <Radio className="h-5 w-5" />
                </div>
                <div>
                  <span className="block leading-tight">
                    Live Doctor Serial
                  </span>
                  <span className="text-xs text-[#5F6F65] font-normal">
                    Track your OPD queue number
                  </span>
                </div>
              </div>
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-600 animate-ping mr-2" />
            </button>

            {/* Family Health Profiles */}
            <button
              type="button"
              onClick={() => {
                toggleMobileMenu();
                navigate({ path: "/family-profiles" });
              }}
              className={cn(
                "flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-bold text-left transition-colors cursor-pointer",
                activePath === "/family-profiles"
                  ? "bg-[#E7EFE3] text-[#1C231F]"
                  : "text-[#2B352F] hover:bg-[#F0F4ED]",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5F6F65] text-white">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <span className="block leading-tight">
                    Family Health Circle
                  </span>
                  <span className="text-xs text-[#5F6F65] font-normal">
                    Parents & children medical profiles
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-[#808D7C]" />
            </button>

            {/* Health Insurance */}
            <button
              type="button"
              onClick={() => {
                toggleMobileMenu();
                navigate({ path: "/insurance" });
              }}
              className={cn(
                "flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-bold text-left transition-colors cursor-pointer",
                activePath === "/insurance"
                  ? "bg-[#E7EFE3] text-[#1C231F]"
                  : "text-[#2B352F] hover:bg-[#F0F4ED]",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-700 text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <span className="block leading-tight">
                    Health Insurance & Claims
                  </span>
                  <span className="text-xs text-[#5F6F65] font-normal">
                    Cashless limits & claim tracking
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-[#808D7C]" />
            </button>

            {/* 24/7 Emergency Button on Mobile */}
            <button
              type="button"
              onClick={() => {
                toggleMobileMenu();
                navigate({ path: "/emergency" });
              }}
              className="flex items-center justify-between rounded-2xl px-4 py-4 text-base font-extrabold text-white bg-red-600 hover:bg-red-700 shadow-md cursor-pointer mt-2"
            >
              <div className="flex items-center gap-3">
                <PhoneCall className="h-5 w-5 animate-pulse" />
                <span>24/7 Emergency & Ambulance</span>
              </div>
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold">
                SOS
              </span>
            </button>

            {/* Mobile Timezone Selector */}
            <div className="pt-4 mt-2 border-t border-[#E2E8DF]">
              <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] block mb-2">
                Consultation Timezone
              </label>
              <select
                value={selectedTimezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full rounded-2xl border border-[#C4CFC0] bg-[#F8FAF7] px-3.5 py-3 text-sm text-[#2B352F] font-bold"
              >
                {AVAILABLE_TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
