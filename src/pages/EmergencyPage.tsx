import React, { useState } from 'react';
import {
  PhoneCall,
  Siren,
  Heart,
  Activity,
  MapPin,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Truck,
  Phone,
  User,
  Building2,
  Share2,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useEmergencyStore } from '../stores/useEmergencyStore';
import { useUIStore } from '../stores/useUIStore';
import { AmbulanceType } from '../types/healthRecords';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatCurrency } from '../lib/utils';

export function EmergencyPage() {
  const {
    activeAmbulanceBooking,
    bloodDonors,
    hospitalIcuList,
    bookAmbulance,
    cancelAmbulanceBooking,
    registerBloodDonor,
  } = useEmergencyStore();
  const { addToast } = useUIStore();

  const [activeTab, setActiveTab] = useState<'ambulance' | 'hotlines' | 'blood' | 'icu'>('ambulance');

  // Ambulance Booking Form State
  const [selectedAmbulanceType, setSelectedAmbulanceType] = useState<AmbulanceType>('basic_ac');
  const [pickupAddress, setPickupAddress] = useState('House 18, Road 11, Sector 4, Uttara, Dhaka 1230');
  const [dropoffHospital, setDropoffHospital] = useState('Square Hospital Ltd. (Panthapath)');
  const [patientCondition, setPatientCondition] = useState('Acute chest tightness and shortness of breath');
  const [contactPhone, setContactPhone] = useState('01712-345678');
  const [isBooking, setIsBooking] = useState(false);

  // Blood Donor Search State
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('All');
  const [donorLocationSearch, setDonorLocationSearch] = useState('');
  const [showRegisterDonorModal, setShowRegisterDonorModal] = useState(false);

  // ICU Search State
  const [icuSearchQuery, setIcuSearchQuery] = useState('');

  // Pricing Matrix for Ambulance in BDT
  const ambulancePrices: Record<AmbulanceType, number> = {
    basic_ac: 1500,
    icu_life_support: 4500,
    freezer: 2800,
    air_heli: 45000,
  };

  const handleBookAmbulance = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooking(true);

    setTimeout(() => {
      const booking = bookAmbulance({
        ambulanceType: selectedAmbulanceType,
        pickupAddress,
        dropoffHospital,
        patientCondition,
        contactPhone,
        fare: ambulancePrices[selectedAmbulanceType],
      });

      setIsBooking(false);
      addToast({
        type: 'success',
        title: 'Ambulance Dispatched!',
        message: `Driver Mohammad Alamgir is en route (ETA 12 mins). Vehicle: ${booking.vehicleNo}`,
      });
    }, 1000);
  };

  // Filter blood donors
  const filteredDonors = bloodDonors.filter((donor) => {
    const matchesGroup = selectedBloodGroup === 'All' || donor.bloodGroup === selectedBloodGroup;
    const matchesLoc =
      donor.location.toLowerCase().includes(donorLocationSearch.toLowerCase()) ||
      donor.district.toLowerCase().includes(donorLocationSearch.toLowerCase()) ||
      donor.name.toLowerCase().includes(donorLocationSearch.toLowerCase());
    return matchesGroup && matchesLoc;
  });

  // Filter ICU hospitals
  const filteredHospitals = hospitalIcuList.filter((hosp) =>
    hosp.hospitalName.toLowerCase().includes(icuSearchQuery.toLowerCase()) ||
    hosp.area.toLowerCase().includes(icuSearchQuery.toLowerCase()) ||
    hosp.district.toLowerCase().includes(icuSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAF7] pb-24 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Emergency SOS Banner */}
        <div className="rounded-3xl bg-linear-to-r from-red-600 to-rose-700 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-white animate-ping" />
              <Badge variant="outline" className="border-white/40 bg-white/20 text-white font-bold text-xs uppercase tracking-wider">
                24/7 Bangladesh Emergency Network
              </Badge>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Medical Emergency & Ambulance Dispatch
            </h1>
            <p className="text-sm text-red-100 max-w-2xl">
              Instant GPS-tracked life support ambulances, urgent blood donor registry, and live hospital ICU/CCU bed capacity tracker.
            </p>
          </div>

          {/* Quick SOS Emergency Call Trigger */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="tel:999"
              className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-red-700 shadow-lg hover:bg-red-50 transition-all hover:scale-105"
            >
              <PhoneCall className="h-5 w-5 text-red-600 animate-bounce" />
              <span>Call 999 (National SOS)</span>
            </a>

            <a
              href="tel:16263"
              className="flex items-center gap-2 rounded-2xl bg-red-900/60 border border-white/30 px-4 py-3.5 text-sm font-bold text-white hover:bg-red-900 transition-all"
            >
              <Phone className="h-4 w-4" />
              <span>16263 (Health Hotline)</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-[#E2E8DF] pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('ambulance')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ambulance'
                ? 'bg-[#5F6F65] text-white shadow-xs'
                : 'bg-white text-[#5F6F65] hover:bg-[#F0F4ED] border border-[#E2E8DF]'
            }`}
          >
            <Truck className="h-4 w-4" />
            <span>Book Emergency Ambulance</span>
            {activeAmbulanceBooking && (
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hotlines')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'hotlines'
                ? 'bg-[#5F6F65] text-white shadow-xs'
                : 'bg-white text-[#5F6F65] hover:bg-[#F0F4ED] border border-[#E2E8DF]'
            }`}
          >
            <PhoneCall className="h-4 w-4" />
            <span>Govt. & Hospital Hotlines</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('blood')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'blood'
                ? 'bg-[#5F6F65] text-white shadow-xs'
                : 'bg-white text-[#5F6F65] hover:bg-[#F0F4ED] border border-[#E2E8DF]'
            }`}
          >
            <Heart className="h-4 w-4 text-red-500" />
            <span>Blood Donor Registry</span>
            <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${activeTab === 'blood' ? 'bg-white/20 text-white' : 'bg-[#E7EFE3] text-[#5F6F65]'}`}>
              {bloodDonors.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('icu')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'icu'
                ? 'bg-[#5F6F65] text-white shadow-xs'
                : 'bg-white text-[#5F6F65] hover:bg-[#F0F4ED] border border-[#E2E8DF]'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Hospital ICU/CCU Bed Capacity</span>
            <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${activeTab === 'icu' ? 'bg-white/20 text-white' : 'bg-[#E7EFE3] text-[#5F6F65]'}`}>
              {hospitalIcuList.length}
            </span>
          </button>
        </div>

        {/* TAB 1: Ambulance Dispatch */}
        {activeTab === 'ambulance' && (
          <div className="space-y-6">
            {/* Active Dispatch Tracker Card if booking exists */}
            {activeAmbulanceBooking && (
              <div className="rounded-3xl border-2 border-emerald-600 bg-emerald-50/70 p-6 shadow-md space-y-4 animate-in fade-in">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                      <Truck className="h-6 w-6 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-lg font-bold text-emerald-950">
                          Ambulance Dispatched & En Route
                        </h3>
                        <Badge variant="outline" className="bg-emerald-600 text-white font-bold text-xs">
                          ETA {activeAmbulanceBooking.etaMinutes} Mins
                        </Badge>
                      </div>
                      <p className="text-xs text-emerald-800">
                        Tracking ID: {activeAmbulanceBooking.id} • Vehicle: <strong>{activeAmbulanceBooking.vehicleNo}</strong>
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      cancelAmbulanceBooking(activeAmbulanceBooking.id);
                      addToast({
                        type: 'info',
                        title: 'Ambulance Booking Cancelled',
                        message: 'Booking has been cancelled.',
                      });
                    }}
                    className="text-xs text-red-700 border-red-300 hover:bg-red-50"
                  >
                    Cancel Dispatch
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="rounded-2xl bg-white p-3.5 border border-emerald-200">
                    <span className="text-[#808D7C] block font-semibold">Assigned Driver:</span>
                    <p className="font-bold text-[#1C231F] text-sm mt-0.5">{activeAmbulanceBooking.driverName}</p>
                    <a
                      href={`tel:${activeAmbulanceBooking.driverPhone}`}
                      className="inline-flex items-center gap-1.5 text-emerald-800 font-bold mt-2 hover:underline"
                    >
                      <PhoneCall className="h-3.5 w-3.5" />
                      <span>{activeAmbulanceBooking.driverPhone} (Call Driver)</span>
                    </a>
                  </div>

                  <div className="rounded-2xl bg-white p-3.5 border border-emerald-200">
                    <span className="text-[#808D7C] block font-semibold">Pickup Address:</span>
                    <p className="text-[#1C231F] mt-0.5 leading-snug">{activeAmbulanceBooking.pickupAddress}</p>
                  </div>

                  <div className="rounded-2xl bg-white p-3.5 border border-emerald-200">
                    <span className="text-[#808D7C] block font-semibold">Destination Hospital:</span>
                    <p className="font-bold text-[#1C231F] mt-0.5">{activeAmbulanceBooking.dropoffHospital}</p>
                    <p className="text-emerald-800 font-mono font-bold mt-1">
                      Fare: {formatCurrency(activeAmbulanceBooking.fare)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Booking Form */}
            <div className="rounded-3xl border border-[#C4CFC0] bg-white p-6 sm:p-8 shadow-xs">
              <div className="border-b border-[#E2E8DF] pb-4 mb-6">
                <h3 className="font-serif text-xl font-bold text-[#1C231F]">
                  Request an Emergency Ambulance
                </h3>
                <p className="text-xs text-[#5F6F65]">
                  Select the required life-support capabilities and provide accurate location details.
                </p>
              </div>

              <form onSubmit={handleBookAmbulance} className="space-y-6">
                {/* Ambulance Type Selection */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#808D7C] block mb-3">
                    Select Ambulance Fleet Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Basic AC */}
                    <button
                      type="button"
                      onClick={() => setSelectedAmbulanceType('basic_ac')}
                      className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                        selectedAmbulanceType === 'basic_ac'
                          ? 'border-[#5F6F65] bg-[#F0F4ED] ring-2 ring-[#5F6F65]/20'
                          : 'border-[#E2E8DF] bg-white hover:bg-[#F8FAF7]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Truck className="h-5 w-5 text-[#5F6F65]" />
                        <span className="font-mono font-bold text-sm text-[#1C231F]">
                          {formatCurrency(ambulancePrices.basic_ac)}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#1C231F] mt-2">Basic AC Ambulance</h4>
                      <p className="text-[11px] text-[#5F6F65] mt-0.5">
                        Oxygen cylinder, stretcher, paramedic assistant. Ideal for non-critical transfers.
                      </p>
                    </button>

                    {/* ICU Life Support */}
                    <button
                      type="button"
                      onClick={() => setSelectedAmbulanceType('icu_life_support')}
                      className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                        selectedAmbulanceType === 'icu_life_support'
                          ? 'border-[#5F6F65] bg-[#F0F4ED] ring-2 ring-[#5F6F65]/20'
                          : 'border-[#E2E8DF] bg-white hover:bg-[#F8FAF7]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Activity className="h-5 w-5 text-red-600" />
                        <span className="font-mono font-bold text-sm text-red-700">
                          {formatCurrency(ambulancePrices.icu_life_support)}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#1C231F] mt-2">ICU Life Support</h4>
                      <p className="text-[11px] text-[#5F6F65] mt-0.5">
                        Transport ventilator, cardiac monitor, suction machine, and critical care nurse.
                      </p>
                    </button>

                    {/* Freezer */}
                    <button
                      type="button"
                      onClick={() => setSelectedAmbulanceType('freezer')}
                      className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                        selectedAmbulanceType === 'freezer'
                          ? 'border-[#5F6F65] bg-[#F0F4ED] ring-2 ring-[#5F6F65]/20'
                          : 'border-[#E2E8DF] bg-white hover:bg-[#F8FAF7]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Truck className="h-5 w-5 text-blue-600" />
                        <span className="font-mono font-bold text-sm text-[#1C231F]">
                          {formatCurrency(ambulancePrices.freezer)}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#1C231F] mt-2">Freezer Ambulance</h4>
                      <p className="text-[11px] text-[#5F6F65] mt-0.5">
                        Temperature-controlled casket transport for dignified long-distance preservation.
                      </p>
                    </button>

                    {/* Air Heli */}
                    <button
                      type="button"
                      onClick={() => setSelectedAmbulanceType('air_heli')}
                      className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                        selectedAmbulanceType === 'air_heli'
                          ? 'border-[#5F6F65] bg-[#F0F4ED] ring-2 ring-[#5F6F65]/20'
                          : 'border-[#E2E8DF] bg-white hover:bg-[#F8FAF7]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Flame className="h-5 w-5 text-amber-600" />
                        <span className="font-mono font-bold text-sm text-[#1C231F]">
                          {formatCurrency(ambulancePrices.air_heli)}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#1C231F] mt-2">Air / Helicopter</h4>
                      <p className="text-[11px] text-[#5F6F65] mt-0.5">
                        Rapid aero-medical evacuation across Bangladesh districts with flight doctor.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Pickup & Destination */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#808D7C] block mb-1">
                      Patient Pickup Location (Dhaka / Nationwide)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-[#808D7C]" />
                      <textarea
                        rows={2}
                        value={pickupAddress}
                        onChange={(e) => setPickupAddress(e.target.value)}
                        className="w-full rounded-xl border border-[#C4CFC0] pl-10 pr-3 py-2 text-xs text-[#1C231F] focus:border-[#5F6F65] focus:outline-none"
                        placeholder="House, road, sector, landmark..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#808D7C] block mb-1">
                      Destination Hospital
                    </label>
                    <select
                      value={dropoffHospital}
                      onChange={(e) => setDropoffHospital(e.target.value)}
                      className="w-full rounded-xl border border-[#C4CFC0] px-3 py-2.5 text-xs text-[#1C231F] bg-white"
                    >
                      <option value="Square Hospital Ltd. (Panthapath)">Square Hospital Ltd. (Panthapath)</option>
                      <option value="Evercare Hospital Dhaka (Bashundhara)">Evercare Hospital Dhaka (Bashundhara)</option>
                      <option value="Dhaka Medical College Hospital (DMCH)">Dhaka Medical College Hospital (DMCH)</option>
                      <option value="United Hospital Limited (Gulshan-2)">United Hospital Limited (Gulshan-2)</option>
                      <option value="National Heart Foundation (Mirpur)">National Heart Foundation (Mirpur)</option>
                      <option value="NICVD (Agargaon)">NICVD (Agargaon)</option>
                      <option value="Nearest Emergency Hospital">Nearest Emergency Trauma Center</option>
                    </select>

                    <div className="mt-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#808D7C] block mb-1">
                        Emergency Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full rounded-xl border border-[#C4CFC0] px-3 py-2 text-xs text-[#1C231F]"
                      />
                    </div>
                  </div>
                </div>

                {/* Patient Condition */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#808D7C] block mb-1">
                    Patient Clinical Condition & Notes
                  </label>
                  <input
                    type="text"
                    value={patientCondition}
                    onChange={(e) => setPatientCondition(e.target.value)}
                    className="w-full rounded-xl border border-[#C4CFC0] px-3 py-2 text-xs text-[#1C231F]"
                    placeholder="E.g., Heart attack symptoms, severe trauma, stroke, difficulty breathing..."
                  />
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-between pt-4 border-t border-[#E2E8DF]">
                  <div>
                    <span className="text-xs text-[#5F6F65] block">Estimated Base Fare:</span>
                    <span className="font-mono text-xl font-bold text-[#1C231F]">
                      {formatCurrency(ambulancePrices[selectedAmbulanceType])}
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    disabled={isBooking}
                    className="bg-red-600 hover:bg-red-700 text-white gap-2 font-bold px-8"
                  >
                    <Truck className="h-5 w-5" />
                    <span>{isBooking ? 'Locating Nearest Ambulance...' : 'Dispatch Ambulance Now'}</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: Bangladesh Emergency Hotlines */}
        {activeTab === 'hotlines' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-[#C4CFC0] bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700">
                  <PhoneCall className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1C231F]">999 National Emergency</h3>
                  <p className="text-xs text-[#5F6F65]">Police, Fire Service & Ambulance</p>
                </div>
              </div>
              <p className="text-xs text-[#2B352F] leading-relaxed">
                Toll-free 24/7 central emergency dispatch for any critical danger, accident, fire, or acute life hazard.
              </p>
              <a
                href="tel:999"
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call 999 Now</span>
              </a>
            </div>

            <div className="rounded-3xl border border-[#C4CFC0] bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1C231F]">16263 Shastho Batayan</h3>
                  <p className="text-xs text-[#5F6F65]">Ministry of Health & Family Welfare</p>
                </div>
              </div>
              <p className="text-xs text-[#2B352F] leading-relaxed">
                24/7 tele-doctor medical consultation, hospital lookup, and government health services guidance.
              </p>
              <a
                href="tel:16263"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#5F6F65] py-2.5 text-xs font-bold text-white hover:bg-[#4E5C53]"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call 16263 Hotline</span>
              </a>
            </div>

            <div className="rounded-3xl border border-[#C4CFC0] bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-800">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1C231F]">10655 IEDCR Control Room</h3>
                  <p className="text-xs text-[#5F6F65]">Institute of Epidemiology & Disease</p>
                </div>
              </div>
              <p className="text-xs text-[#2B352F] leading-relaxed">
                Infectious disease outbreaks (Dengue, COVID-19, Nipah virus) surveillance and clinical management.
              </p>
              <a
                href="tel:10655"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#2B352F] py-2.5 text-xs font-bold text-white hover:bg-black"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call 10655</span>
              </a>
            </div>
          </div>
        )}

        {/* TAB 3: Blood Donor Registry */}
        {activeTab === 'blood' && (
          <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#C4CFC0] shadow-xs">
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <span className="text-xs font-bold uppercase text-[#808D7C] shrink-0">Blood Group:</span>
                {['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setSelectedBloodGroup(group)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                      selectedBloodGroup === group
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-[#F0F4ED] text-[#5F6F65] hover:bg-[#E2E8DF]'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#808D7C]" />
                <input
                  type="text"
                  placeholder="Filter by location / district..."
                  value={donorLocationSearch}
                  onChange={(e) => setDonorLocationSearch(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8DF] bg-[#F8FAF7] pl-10 pr-3 py-1.5 text-xs text-[#1C231F] focus:border-[#5F6F65] focus:outline-none"
                />
              </div>
            </div>

            {/* Donors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredDonors.map((donor) => (
                <div
                  key={donor.id}
                  className="rounded-2xl border border-[#C4CFC0] bg-white p-4 shadow-xs space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-700 font-bold text-base">
                      {donor.bloodGroup}
                    </span>
                    <Badge variant="outline" className={donor.isAvailable ? 'bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]' : 'bg-zinc-50 text-zinc-600 text-[10px]'}>
                      {donor.isAvailable ? 'Ready to Donate' : 'Recent Donation'}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-[#1C231F]">{donor.name}</h4>
                    <p className="text-xs text-[#5F6F65] flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span>{donor.location}</span>
                    </p>
                    <p className="text-[11px] text-[#808D7C] mt-1">
                      Total Donated: <strong>{donor.totalDonations} Times</strong>
                    </p>
                  </div>

                  <a
                    href={`tel:${donor.phone}`}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[#F0F4ED] border border-[#D8E2D4] py-2 text-xs font-bold text-[#1C231F] hover:bg-[#5F6F65] hover:text-white transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call {donor.phone}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ICU / CCU Bed Capacity */}
        {activeTab === 'icu' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#C4CFC0] bg-white p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8DF] pb-4 mb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1C231F]">
                    Live Hospital ICU, CCU & NICU Bed Availability
                  </h3>
                  <p className="text-xs text-[#5F6F65]">
                    Real-time vacant bed monitoring across leading hospitals in Dhaka & major divisions.
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#808D7C]" />
                  <input
                    type="text"
                    placeholder="Search hospital or area..."
                    value={icuSearchQuery}
                    onChange={(e) => setIcuSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8DF] bg-[#F8FAF7] pl-10 pr-3 py-1.5 text-xs text-[#1C231F] focus:border-[#5F6F65] focus:outline-none"
                  />
                </div>
              </div>

              <div className="divide-y divide-[#E2E8DF]">
                {filteredHospitals.map((hosp) => (
                  <div key={hosp.id} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-[#5F6F65]" />
                        <h4 className="font-bold text-sm text-[#1C231F]">{hosp.hospitalName}</h4>
                        <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-800 border-blue-200">
                          {hosp.area}, {hosp.district}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#5F6F65]">{hosp.address}</p>
                      <p className="text-[11px] text-[#808D7C]">
                        Direct Emergency Line: <strong className="text-[#1C231F]">{hosp.emergencyLine}</strong> (Updated: {hosp.lastUpdated})
                      </p>
                    </div>

                    {/* Bed Capacity Counters */}
                    <div className="flex items-center gap-3 shrink-0 flex-wrap">
                      <div className="rounded-xl bg-[#F0F4ED] border border-[#D8E2D4] px-3 py-2 text-center min-w-20">
                        <span className="text-[10px] font-bold text-[#808D7C] block uppercase">ICU Beds</span>
                        <span className="font-mono text-sm font-bold text-emerald-800">
                          {hosp.availableIcuBeds} <span className="text-[10px] text-[#808D7C]">/ {hosp.totalIcuBeds}</span>
                        </span>
                      </div>

                      <div className="rounded-xl bg-[#F0F4ED] border border-[#D8E2D4] px-3 py-2 text-center min-w-20">
                        <span className="text-[10px] font-bold text-[#808D7C] block uppercase">CCU Beds</span>
                        <span className="font-mono text-sm font-bold text-emerald-800">
                          {hosp.availableCcuBeds} <span className="text-[10px] text-[#808D7C]">/ {hosp.totalCcuBeds}</span>
                        </span>
                      </div>

                      <div className="rounded-xl bg-[#F0F4ED] border border-[#D8E2D4] px-3 py-2 text-center min-w-20">
                        <span className="text-[10px] font-bold text-[#808D7C] block uppercase">NICU Beds</span>
                        <span className="font-mono text-sm font-bold text-emerald-800">
                          {hosp.nicuAvailable} Vacant
                        </span>
                      </div>

                      <a
                        href={`tel:${hosp.emergencyLine.split('/')[0].trim()}`}
                        className="rounded-xl bg-[#5F6F65] px-4 py-2 text-xs font-bold text-white hover:bg-[#4E5C53] transition-colors"
                      >
                        Call Emergency Desk
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
