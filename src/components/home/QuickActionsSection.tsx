import React from 'react';
import {
  CalendarPlus,
  FileText,
  PhoneCall,
  ArrowRight,
  Sparkles,
  Search,
  Clock,
  ShieldAlert,
  Download,
  Stethoscope,
  HeartHandshake,
} from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { Badge } from '../ui/Badge';

export function QuickActionsSection() {
  const { navigate } = useUIStore();

  const quickActions = [
    {
      id: 'quick-action-book',
      title: 'Book Appointment',
      subtitle: 'Schedule a chamber visit or video consultation in 60 seconds with verified doctors.',
      badge: 'Easy Booking',
      badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      icon: CalendarPlus,
      iconContainerClass: 'bg-emerald-700 text-white shadow-md',
      hoverBorder: 'hover:border-emerald-600',
      arrowColor: 'text-emerald-800',
      btnText: 'Find & Book Now',
      onClick: () => navigate({ path: '/search' }),
    },
    {
      id: 'quick-action-prescriptions',
      title: 'View Prescriptions',
      subtitle: 'Access doctor advice, medicine schedules, test referrals, and download official PDF slips.',
      badge: 'Digital Vault',
      badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
      icon: FileText,
      iconContainerClass: 'bg-blue-600 text-white shadow-md',
      hoverBorder: 'hover:border-blue-600',
      arrowColor: 'text-blue-800',
      btnText: 'Open Prescriptions',
      onClick: () => navigate({ path: '/prescriptions' }),
    },
    {
      id: 'quick-action-emergency',
      title: 'Emergency Help',
      subtitle: 'Immediate 24/7 SOS, ICU on Wheels, ambulance dispatch, and national crisis hotlines.',
      badge: '24/7 SOS Active',
      badgeClass: 'bg-red-100 text-red-900 border-red-300',
      icon: PhoneCall,
      iconContainerClass: 'bg-red-600 text-white shadow-md animate-pulse',
      hoverBorder: 'hover:border-red-600',
      arrowColor: 'text-red-800',
      btnText: 'Get Emergency Help',
      onClick: () => navigate({ path: '/emergency' }),
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Quick Actions Navigation">
      <div className="rounded-3xl border border-[#C4CFC0] bg-[#F8FAF7] p-5 sm:p-7 shadow-xs">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E2E8DF]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5F6F65] text-white shadow-xs">
              <HeartHandshake className="h-6 w-6 text-[#E7EFE3]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#1C231F] tracking-tight">
                  Quick Actions
                </h3>
                <span className="inline-flex items-center rounded-full bg-[#E7EFE3] px-2.5 py-0.5 text-xs font-bold text-[#2B352F] border border-[#C9DABF]">
                  Fast Access
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#5F6F65] mt-0.5">
                Instant shortcuts for patients of all ages — one-touch booking, records & emergency care.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Large, Accessible Friendly Action Cards */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                id={action.id}
                onClick={action.onClick}
                className={`group flex flex-col justify-between rounded-3xl border border-[#C4CFC0] bg-white p-6 text-left transition-all duration-200 ${action.hoverBorder} hover:shadow-md cursor-pointer active:scale-[0.99]`}
              >
                <div>
                  {/* Top Bar: Large Icon & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${action.iconContainerClass} group-hover:scale-105 transition-transform duration-200`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold border ${action.badgeClass}`}>
                      {action.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle in Large, High-Contrast Fonts */}
                  <h4 className="text-lg sm:text-xl font-extrabold text-[#1C231F] group-hover:text-[#1C231F] tracking-tight">
                    {action.title}
                  </h4>
                  <p className="text-sm text-[#46544C] mt-2 leading-relaxed font-medium">
                    {action.subtitle}
                  </p>
                </div>

                {/* Bottom Call-To-Action Link with arrow */}
                <div className="pt-5 mt-4 border-t border-[#F0F4ED] flex items-center justify-between">
                  <span className={`text-sm font-extrabold ${action.arrowColor} flex items-center gap-1.5 group-hover:underline`}>
                    {action.btnText}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0F4ED] text-[#1C231F] group-hover:bg-[#5F6F65] group-hover:text-white transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
