import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Clock,
  Plus,
  Video,
  MapPin,
  FileText,
  Sparkles,
  ChevronDown,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { useUIStore } from '../stores/useUIStore';
import { Appointment } from '../types';
import { AppointmentCard } from '../components/appointments/AppointmentCard';
import { AppointmentsSummaryStats } from '../components/appointments/AppointmentsSummaryStats';
import { RescheduleModal } from '../components/appointments/RescheduleModal';
import { CancelModal } from '../components/appointments/CancelModal';
import { AppointmentDetailsModal } from '../components/appointments/AppointmentDetailsModal';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/utils';

type FilterTab = 'upcoming' | 'past' | 'cancelled' | 'all';
type ModalityFilter = 'all' | 'in_person' | 'telehealth';
type SortOrder = 'date_asc' | 'date_desc';

interface AppointmentsPageProps {
  initialTab?: FilterTab;
}

export function AppointmentsPage({ initialTab = 'upcoming' }: AppointmentsPageProps) {
  const { appointments, activeFilterTab, setActiveFilterTab } = useAppointmentStore();
  const { navigate } = useUIStore();

  const [activeTab, setActiveTab] = useState<FilterTab>(initialTab || activeFilterTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalityFilter, setModalityFilter] = useState<ModalityFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('date_asc');

  // Modal states
  const [selectedForReschedule, setSelectedForReschedule] = useState<Appointment | null>(null);
  const [selectedForCancel, setSelectedForCancel] = useState<Appointment | null>(null);
  const [selectedForDetails, setSelectedForDetails] = useState<Appointment | null>(null);

  // Tab counts
  const counts = useMemo(() => {
    return {
      upcoming: appointments.filter((a) => a.status === 'upcoming').length,
      past: appointments.filter((a) => a.status === 'completed').length,
      cancelled: appointments.filter((a) => a.status === 'cancelled').length,
      all: appointments.length,
    };
  }, [appointments]);

  // Filtered & sorted appointments
  const filteredAppointments = useMemo(() => {
    let list = appointments.filter((apt) => {
      // Tab filter
      if (activeTab === 'upcoming' && apt.status !== 'upcoming') return false;
      if (activeTab === 'past' && apt.status !== 'completed') return false;
      if (activeTab === 'cancelled' && apt.status !== 'cancelled') return false;

      // Modality filter
      if (modalityFilter === 'in_person' && apt.visitType === 'telehealth') return false;
      if (modalityFilter === 'telehealth' && apt.visitType !== 'telehealth') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = apt.doctorName.toLowerCase().includes(q);
        const matchSpecialty = apt.doctorSpecialty.toLowerCase().includes(q);
        const matchClinic = apt.clinic.name.toLowerCase().includes(q);
        const matchRef = apt.id.toLowerCase().includes(q);
        const matchPatient = apt.patientDetails.fullName.toLowerCase().includes(q);
        if (!matchName && !matchSpecialty && !matchClinic && !matchRef && !matchPatient) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    list.sort((a, b) => {
      const d1 = new Date(`${a.dateStr}T${a.startTime}`).getTime();
      const d2 = new Date(`${b.dateStr}T${b.startTime}`).getTime();
      return sortOrder === 'date_asc' ? d1 - d2 : d2 - d1;
    });

    return list;
  }, [appointments, activeTab, modalityFilter, searchQuery, sortOrder]);

  const handleRebook = (doctorId: string) => {
    navigate({ path: '/book/:id', id: doctorId });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1C231F]">
            My Medical Appointments
          </h1>
          <p className="text-sm text-[#5F6F65] mt-1">
            Manage your scheduled clinic visits, telehealth video links, and prescription records.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate({ path: '/search' })}
          leftIcon={<Plus className="h-4 w-4" />}
          className="shadow-xs"
        >
          Book New Consultation
        </Button>
      </div>

      {/* Summary Stats & Highlights */}
      <AppointmentsSummaryStats
        appointments={appointments}
        onBookNew={() => navigate({ path: '/search' })}
        onViewNext={(apt) => setSelectedForDetails(apt)}
      />

      {/* Search, Modality & Filter Bar */}
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E2E8DF]">
          <button
            type="button"
            id="tab-upcoming"
            onClick={() => {
              setActiveTab('upcoming');
              setActiveFilterTab('upcoming');
            }}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
              activeTab === 'upcoming'
                ? 'bg-[#5F6F65] text-white shadow-xs'
                : 'text-[#5F6F65] hover:bg-[#F0F4ED]'
            )}
          >
            <span>Upcoming Visits</span>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-mono',
                activeTab === 'upcoming'
                  ? 'bg-white text-[#5F6F65]'
                  : 'bg-[#E7EFE3] text-[#1C231F]'
              )}
            >
              {counts.upcoming}
            </span>
          </button>

          <button
            type="button"
            id="tab-past"
            onClick={() => {
              setActiveTab('past');
              setActiveFilterTab('past');
            }}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
              activeTab === 'past'
                ? 'bg-[#5F6F65] text-white shadow-xs'
                : 'text-[#5F6F65] hover:bg-[#F0F4ED]'
            )}
          >
            <span>Past & Completed</span>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-mono',
                activeTab === 'past' ? 'bg-white text-[#5F6F65]' : 'bg-[#E7EFE3] text-[#1C231F]'
              )}
            >
              {counts.past}
            </span>
          </button>

          <button
            type="button"
            id="tab-cancelled"
            onClick={() => {
              setActiveTab('cancelled');
              setActiveFilterTab('cancelled');
            }}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
              activeTab === 'cancelled'
                ? 'bg-[#5F6F65] text-white shadow-xs'
                : 'text-[#5F6F65] hover:bg-[#F0F4ED]'
            )}
          >
            <span>Cancelled</span>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-mono',
                activeTab === 'cancelled'
                  ? 'bg-white text-[#5F6F65]'
                  : 'bg-[#E7EFE3] text-[#1C231F]'
              )}
            >
              {counts.cancelled}
            </span>
          </button>

          <button
            type="button"
            id="tab-all"
            onClick={() => {
              setActiveTab('all');
            }}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
              activeTab === 'all'
                ? 'bg-[#5F6F65] text-white shadow-xs'
                : 'text-[#5F6F65] hover:bg-[#F0F4ED]'
            )}
          >
            <span>All History</span>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-mono',
                activeTab === 'all' ? 'bg-white text-[#5F6F65]' : 'bg-[#E7EFE3] text-[#1C231F]'
              )}
            >
              {counts.all}
            </span>
          </button>
        </div>

        {/* Search & Sub-filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#808D7C]" />
            <input
              type="text"
              id="search-appointments-input"
              placeholder="Search by doctor, specialty, clinic, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-[#C4CFC0] bg-white pl-10 pr-4 py-2 text-xs text-[#1C231F] placeholder:text-[#808D7C] focus:border-[#5F6F65] focus:outline-none"
            />
          </div>

          {/* Modality & Sorting */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Modality toggle */}
            <div className="flex items-center rounded-xl border border-[#C4CFC0] bg-white p-0.5 text-xs font-medium text-[#5F6F65]">
              <button
                type="button"
                onClick={() => setModalityFilter('all')}
                className={cn(
                  'rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer',
                  modalityFilter === 'all' ? 'bg-[#E7EFE3] text-[#1C231F] font-bold' : ''
                )}
              >
                All Modes
              </button>
              <button
                type="button"
                onClick={() => setModalityFilter('in_person')}
                className={cn(
                  'rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer flex items-center gap-1',
                  modalityFilter === 'in_person' ? 'bg-[#E7EFE3] text-[#1C231F] font-bold' : ''
                )}
              >
                <MapPin className="h-3 w-3" /> Clinic
              </button>
              <button
                type="button"
                onClick={() => setModalityFilter('telehealth')}
                className={cn(
                  'rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer flex items-center gap-1',
                  modalityFilter === 'telehealth' ? 'bg-[#E7EFE3] text-[#1C231F] font-bold' : ''
                )}
              >
                <Video className="h-3 w-3" /> Video
              </button>
            </div>

            {/* Sort Toggle */}
            <button
              type="button"
              onClick={() =>
                setSortOrder(sortOrder === 'date_asc' ? 'date_desc' : 'date_asc')
              }
              className="flex items-center gap-1.5 rounded-xl border border-[#C4CFC0] bg-white px-3 py-1.5 text-xs font-medium text-[#5F6F65] hover:bg-[#F8FAF7]"
            >
              <ArrowUpDown className="h-3.5 w-3.5 text-[#808D7C]" />
              <span>{sortOrder === 'date_asc' ? 'Earliest First' : 'Latest First'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#C4CFC0] bg-white p-12 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E7EFE3] text-[#5F6F65]">
              <Calendar className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#1C231F]">
                No Appointments Found
              </h3>
              <p className="text-xs text-[#5F6F65] mt-1 max-w-md mx-auto">
                {searchQuery
                  ? `No consultations matching "${searchQuery}". Try clearing search filters.`
                  : activeTab === 'upcoming'
                  ? 'You currently have no upcoming medical visits on record.'
                  : `No ${activeTab} appointments in your archive.`}
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              {searchQuery && (
                <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate({ path: '/search' })}
                leftIcon={<Sparkles className="h-3.5 w-3.5" />}
              >
                Book a Specialist in 60s
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onReschedule={(apt) => setSelectedForReschedule(apt)}
                onCancel={(apt) => setSelectedForCancel(apt)}
                onViewDetails={(apt) => setSelectedForDetails(apt)}
                onRebook={handleRebook}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {selectedForReschedule && (
        <RescheduleModal
          isOpen={Boolean(selectedForReschedule)}
          onClose={() => setSelectedForReschedule(null)}
          appointment={selectedForReschedule}
        />
      )}

      {/* Cancel Modal */}
      {selectedForCancel && (
        <CancelModal
          isOpen={Boolean(selectedForCancel)}
          onClose={() => setSelectedForCancel(null)}
          appointment={selectedForCancel}
        />
      )}

      {/* Details / Pass Modal */}
      {selectedForDetails && (
        <AppointmentDetailsModal
          isOpen={Boolean(selectedForDetails)}
          onClose={() => setSelectedForDetails(null)}
          appointment={selectedForDetails}
          onOpenReschedule={() => {
            const apt = selectedForDetails;
            setSelectedForDetails(null);
            setSelectedForReschedule(apt);
          }}
          onOpenCancel={() => {
            const apt = selectedForDetails;
            setSelectedForDetails(null);
            setSelectedForCancel(apt);
          }}
        />
      )}
    </div>
  );
}
