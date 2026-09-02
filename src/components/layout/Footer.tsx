import React from 'react';
import { Heart, ShieldCheck, Clock, MapPin, Phone, Lock, Sparkles } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';

export function Footer() {
  const { navigate } = useUIStore();

  return (
    <footer className="border-t border-[#E2E8DF] bg-[#F0F4ED]/60 text-[#2B352F] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5F6F65] text-white shadow-xs">
                <span className="font-serif text-xl font-bold italic">M</span>
              </div>
              <span className="font-sans text-xl font-bold tracking-tight text-[#1C231F]">
                Medi<span className="text-[#5F6F65]">Book</span>
              </span>
            </div>
            <p className="text-sm text-[#5F6F65] leading-relaxed max-w-sm">
              Empowering patients with transparent, friction-free healthcare access. Book verified top-rated specialists, manage appointments, and access digital prescriptions in 60 seconds.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#C9DABF]/50 px-2.5 py-1 text-xs font-semibold text-[#1C231F]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#5F6F65]" />
                100% HIPAA Ready UX
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#C9DABF]/50 px-2.5 py-1 text-xs font-semibold text-[#1C231F]">
                <Clock className="h-3.5 w-3.5 text-[#5F6F65]" />
                Zero Phone Calls
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] mb-4">
              Patient Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate({ path: '/search' })}
                  className="text-[#5F6F65] hover:text-[#1C231F] transition-colors"
                >
                  Find Doctors & Clinics
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ path: '/dashboard/appointments', tab: 'upcoming' })}
                  className="text-[#5F6F65] hover:text-[#1C231F] transition-colors"
                >
                  My Appointments
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ path: '/dashboard/prescriptions' })}
                  className="text-[#5F6F65] hover:text-[#1C231F] transition-colors"
                >
                  Digital Prescriptions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ path: '/search', query: { specialty: 'Cardiology' } })}
                  className="text-[#5F6F65] hover:text-[#1C231F] transition-colors"
                >
                  Cardiologists
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ path: '/component-guide' })}
                  className="text-[#5F6F65] hover:text-[#1C231F] transition-colors"
                >
                  Component Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] mb-4">
              Popular Specialties
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate({ path: '/search', query: { specialty: 'Dermatology' } })}
                  className="text-[#5F6F65] hover:text-[#1C231F] transition-colors"
                >
                  Dermatology
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ path: '/search', query: { specialty: 'General Practice' } })}
                  className="text-[#5F6F65] hover:text-[#1C231F] transition-colors"
                >
                  General Practice
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ path: '/search', query: { specialty: 'Pediatrics' } })}
                  className="text-[#5F6F65] hover:text-[#1C231F] transition-colors"
                >
                  Pediatrics
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ path: '/search', query: { specialty: 'Psychiatry' } })}
                  className="text-[#5F6F65] hover:text-[#1C231F] transition-colors"
                >
                  Mental Health & Psychiatry
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] mb-4">
              Clinical Quality
            </h4>
            <div className="rounded-xl border border-[#C4CFC0] bg-white p-3.5 space-y-2">
              <p className="text-xs font-semibold text-[#1C231F] flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-[#5F6F65]" />
                Emergency Notice
              </p>
              <p className="text-[11px] text-[#808D7C] leading-normal">
                If you are experiencing life-threatening symptoms or a medical emergency, call 999 or Shastho Batayon (16263) or visit your nearest hospital emergency room immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#E2E8DF] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#808D7C]">
          <p>© {new Date().getFullYear()} MediBook Healthcare Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Clinical Service</span>
            <span>Patient Data Rights</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
