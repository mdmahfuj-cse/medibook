import React from 'react';
import {
  MapPin,
  Building2,
  Phone,
  Clock,
  Car,
  Accessibility,
  Navigation,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Clinic } from '../../types';
import { Button } from '../ui/Button';

interface ClinicLocationCardProps {
  clinic: Clinic;
}

export function ClinicLocationCard({ clinic }: ClinicLocationCardProps) {
  const mapQueryUrl = `https://maps.google.com/?q=${encodeURIComponent(
    `${clinic.name} ${clinic.address} ${clinic.city} ${clinic.state}`
  )}`;

  return (
    <div className="rounded-3xl border border-[#C4CFC0] bg-white p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F0F4ED] text-[#5F6F65]">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-[#1C231F]">{clinic.name}</h2>
            <p className="text-xs text-[#808D7C] flex items-center gap-1 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-[#9CA986]" />
              {clinic.address}, {clinic.city}, {clinic.state} {clinic.zip}
            </p>
          </div>
        </div>

        <a
          href={mapQueryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#C4CFC0] bg-[#F8FAF7] px-3.5 py-2 text-xs font-semibold text-[#1C231F] hover:bg-[#E7EFE3] hover:border-[#9CA986] transition-colors"
        >
          <Navigation className="h-3.5 w-3.5 text-[#5F6F65]" />
          Get Directions
          <ExternalLink className="h-3 w-3 text-[#808D7C]" />
        </a>
      </div>

      {/* Interactive Simulated Map Box */}
      <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-[#C4CFC0] bg-[#E9EFE6] flex items-center justify-center">
        {/* Subtle grid pattern resembling map tiles */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(#5F6F65 1px, transparent 1px), radial-gradient(#9CA986 1px, #E9EFE6 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        />

        {/* Major Avenue / Street Lines */}
        <div className="absolute w-full h-3 bg-white/70 rotate-[-12deg] shadow-xs" />
        <div className="absolute h-full w-4 bg-white/70 rotate-[28deg] shadow-xs" />
        <div className="absolute w-3/4 h-2.5 bg-[#C9DABF]/80 top-1/3 left-0" />

        {/* Center Doctor Location Marker */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2 shadow-xl border border-[#C4CFC0] animate-bounce">
            <div className="h-2.5 w-2.5 rounded-full bg-[#5F6F65] animate-ping" />
            <div className="text-xs font-bold text-[#1C231F]">{clinic.name}</div>
          </div>
          <div className="h-3 w-3 rotate-45 bg-white border-r border-b border-[#C4CFC0] -mt-1.5 shadow-xs" />
          <div className="h-4 w-4 rounded-full bg-[#5F6F65]/30 blur-xs mt-1" />
        </div>

        {/* Map Watermark & Coordinates */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-mono text-[#5F6F65] border border-[#E2E8DF] shadow-xs">
          GPS: {clinic.coordinates?.lat.toFixed(4) ?? '23.8099'}° N,{' '}
          {Math.abs(clinic.coordinates?.lng ?? 90.4312).toFixed(4)}° {(clinic.coordinates?.lng ?? 90.4312) >= 0 ? 'E' : 'W'}
        </div>
      </div>

      {/* Clinic Logistics & Facilities */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="rounded-2xl border border-[#E2E8DF] bg-[#FDFEFC] p-4">
          <div className="flex items-center gap-2 text-[#5F6F65] font-bold mb-1">
            <Clock className="h-4 w-4" />
            <span>Clinic Hours</span>
          </div>
          <p className="text-[#2B352F] mt-1">Mon – Fri: 8:00 AM – 6:00 PM</p>
          <p className="text-[#808D7C] mt-0.5">Sat: 9:00 AM – 2:00 PM (Rotational)</p>
        </div>

        <div className="rounded-2xl border border-[#E2E8DF] bg-[#FDFEFC] p-4">
          <div className="flex items-center gap-2 text-[#5F6F65] font-bold mb-1">
            <Car className="h-4 w-4" />
            <span>Parking & Transit</span>
          </div>
          <p className="text-[#2B352F] mt-1">On-site validated parking garage.</p>
          <p className="text-[#808D7C] mt-0.5">Metro station 1.5 blocks away.</p>
        </div>

        <div className="rounded-2xl border border-[#E2E8DF] bg-[#FDFEFC] p-4">
          <div className="flex items-center gap-2 text-[#5F6F65] font-bold mb-1">
            <Accessibility className="h-4 w-4" />
            <span>Accessibility</span>
          </div>
          <p className="text-[#2B352F] mt-1">Wheelchair accessible entrances.</p>
          <p className="text-[#808D7C] mt-0.5">Elevator access on every floor.</p>
        </div>
      </div>

      {/* Phone Contact Banner */}
      <div className="rounded-2xl bg-[#F0F4ED] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Phone className="h-4 w-4 text-[#5F6F65]" />
          <span>
            Clinic Reception Desk:{' '}
            <strong className="text-[#1C231F] font-mono font-bold">{clinic.phone}</strong>
          </span>
        </div>
        <span className="text-[#5F6F65] font-medium">Appointments booked 100% online</span>
      </div>
    </div>
  );
}
