import React, { useState } from 'react';
import {
  FileText,
  Pill,
  Activity,
  ShoppingBag,
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Stethoscope,
  Sparkles,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  Building2,
  Truck,
  Bell,
} from 'lucide-react';
import { usePrescriptionStore, PharmacyOrder } from '../stores/usePrescriptionStore';
import { useUIStore } from '../stores/useUIStore';
import { useWaitlistStore } from '../stores/useWaitlistStore';
import { ExtendedPrescription } from '../data/mockPrescriptions';
import { PrescriptionCard } from '../components/prescriptions/PrescriptionCard';
import { PrescriptionDetailsModal } from '../components/prescriptions/PrescriptionDetailsModal';
import { OrderMedicineModal } from '../components/prescriptions/OrderMedicineModal';
import { MedicationScheduleTracker } from '../components/prescriptions/MedicationScheduleTracker';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatCurrency, formatDateLong } from '../lib/utils';

export function PrescriptionsPage() {
  const { prescriptions, pharmacyOrders } = usePrescriptionStore();
  const { entries: waitlistEntries, removeEntry } = useWaitlistStore();
  const { navigate, addToast } = useUIStore();

  const [activeTab, setActiveTab] = useState<'prescriptions' | 'tracker' | 'tests' | 'orders' | 'waitlist'>('prescriptions');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [activeRxForModal, setActiveRxForModal] = useState<ExtendedPrescription | null>(null);
  const [activeRxForOrder, setActiveRxForOrder] = useState<ExtendedPrescription | null>(null);

  // Filter prescriptions
  const filteredPrescriptions = prescriptions.filter((rx) => {
    const matchesSearch =
      rx.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.medicines.some((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      rx.clinicName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty = selectedSpecialty === 'All' || rx.doctorSpecialty === selectedSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  // Extract all recommended lab tests
  const allTests = prescriptions.flatMap((rx) =>
    (rx.investigations || []).map((inv) => ({
      ...inv,
      rxId: rx.id,
      doctorName: rx.doctorName,
      doctorSpecialty: rx.doctorSpecialty,
      clinicName: rx.clinicName,
      date: rx.date,
    }))
  );

  // Count active medicines
  const activeMedsCount = prescriptions.reduce((acc, curr) => acc + curr.medicines.length, 0);

  const specialtiesList = ['All', ...Array.from(new Set(prescriptions.map((p) => p.doctorSpecialty)))];

  return (
    <div className="min-h-screen bg-[#F8FAF7] pb-20 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8DF] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5F6F65]">
              <FileText className="h-4 w-4" />
              <span>Digital Health Records • Bangladesh</span>
            </div>
            <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1C231F]">
              Prescriptions & Care Hub
            </h1>
            <p className="mt-1 text-sm text-[#5F6F65]">
              Access verified digital prescriptions, daily medication routines, lab tests, and door-to-door medicine delivery.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-[#C4CFC0] bg-white px-4 py-2.5 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#808D7C] block">
                Total Prescriptions
              </span>
              <span className="font-mono text-xl font-bold text-[#1C231F]">
                {prescriptions.length}
              </span>
            </div>

            <div className="rounded-2xl border border-[#C4CFC0] bg-white px-4 py-2.5 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#808D7C] block">
                Active Medicines
              </span>
              <span className="font-mono text-xl font-bold text-[#5F6F65]">
                {activeMedsCount}
              </span>
            </div>

            <div className="rounded-2xl border border-[#C4CFC0] bg-white px-4 py-2.5 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#808D7C] block">
                Advised Lab Tests
              </span>
              <span className="font-mono text-xl font-bold text-[#2B352F]">
                {allTests.length}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-[#E2E8DF] pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('prescriptions')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'prescriptions'
                ? 'bg-[#5F6F65] text-white shadow-xs'
                : 'bg-white text-[#5F6F65] hover:bg-[#F0F4ED] border border-[#E2E8DF]'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Digital Prescriptions</span>
            <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${activeTab === 'prescriptions' ? 'bg-white/20 text-white' : 'bg-[#E7EFE3] text-[#5F6F65]'}`}>
              {prescriptions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tracker')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tracker'
                ? 'bg-[#5F6F65] text-white shadow-xs'
                : 'bg-white text-[#5F6F65] hover:bg-[#F0F4ED] border border-[#E2E8DF]'
            }`}
          >
            <Pill className="h-4 w-4" />
            <span>Daily Medication Tracker</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tests'
                ? 'bg-[#5F6F65] text-white shadow-xs'
                : 'bg-white text-[#5F6F65] hover:bg-[#F0F4ED] border border-[#E2E8DF]'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Lab & Diagnostic Tests</span>
            <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${activeTab === 'tests' ? 'bg-white/20 text-white' : 'bg-[#E7EFE3] text-[#5F6F65]'}`}>
              {allTests.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#5F6F65] text-white shadow-xs'
                : 'bg-white text-[#5F6F65] hover:bg-[#F0F4ED] border border-[#E2E8DF]'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Pharmacy Orders</span>
            {pharmacyOrders.length > 0 && (
              <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-[#5F6F65] text-white'}`}>
                {pharmacyOrders.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('waitlist')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'waitlist'
                ? 'bg-[#5F6F65] text-white shadow-xs'
                : 'bg-white text-[#5F6F65] hover:bg-[#F0F4ED] border border-[#E2E8DF]'
            }`}
          >
            <Bell className="h-4 w-4" />
            <span>Waitlist Alerts</span>
            {waitlistEntries.length > 0 && (
              <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${activeTab === 'waitlist' ? 'bg-white/20 text-white' : 'bg-[#5F6F65] text-white'}`}>
                {waitlistEntries.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: All Digital Prescriptions */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-6">
            {/* Search & Filter Toolbars */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#C4CFC0] shadow-xs">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#808D7C]" />
                <input
                  type="text"
                  placeholder="Search doctor, diagnosis, or medicine..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8DF] bg-[#F8FAF7] pl-10 pr-4 py-2 text-xs text-[#1C231F] focus:border-[#5F6F65] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <span className="text-xs font-semibold text-[#808D7C] shrink-0">Specialty:</span>
                <div className="flex gap-1">
                  {specialtiesList.map((spec) => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => setSelectedSpecialty(spec)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                        selectedSpecialty === spec
                          ? 'bg-[#5F6F65] text-white font-bold'
                          : 'bg-[#F0F4ED] text-[#5F6F65] hover:bg-[#E2E8DF]'
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Prescriptions Grid */}
            {filteredPrescriptions.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#C4CFC0] bg-white p-12 text-center">
                <FileText className="mx-auto h-10 w-10 text-[#808D7C]" />
                <h3 className="mt-3 text-base font-bold text-[#1C231F]">No Prescriptions Found</h3>
                <p className="text-xs text-[#5F6F65] mt-1">
                  Try adjusting your search keywords or specialty filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrescriptions.map((rx) => (
                  <PrescriptionCard
                    key={rx.id}
                    prescription={rx}
                    onViewDetails={(r) => setActiveRxForModal(r)}
                    onOrderMedicines={(r) => setActiveRxForOrder(r)}
                    onBookFollowUp={(docId) => navigate({ path: '/book', id: docId })}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Daily Medication Schedule */}
        {activeTab === 'tracker' && (
          <div>
            <MedicationScheduleTracker />
          </div>
        )}

        {/* Tab 3: Lab & Diagnostic Tests */}
        {activeTab === 'tests' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#C4CFC0] bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#E2E8DF] pb-4 mb-4">
                <div>
                  <h3 className="font-bold text-lg text-[#1C231F]">
                    Prescribed Diagnostic & Clinical Investigations
                  </h3>
                  <p className="text-xs text-[#5F6F65]">
                    Lab tests recommended by your consulting physicians with instructions and preparation guidance.
                  </p>
                </div>
                <Badge variant="outline" className="bg-[#F0F4ED] text-[#5F6F65]">
                  {allTests.length} Tests Advised
                </Badge>
              </div>

              <div className="divide-y divide-[#E2E8DF]">
                {allTests.map((test, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#E7EFE3] text-[#5F6F65] text-xs font-bold">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-sm text-[#1C231F]">{test.testName}</h4>
                        <Badge
                          variant="outline"
                          className={test.urgency === 'Urgent' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200 text-[10px]'}
                        >
                          {test.urgency}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#5F6F65] pl-8">
                        <strong>Clinical Purpose:</strong> {test.notes || 'Routine diagnostic evaluation'}
                      </p>
                      <div className="text-[11px] text-[#808D7C] pl-8">
                        Advised by <strong>{test.doctorName}</strong> ({test.doctorSpecialty}) at {test.clinicName}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 sm:pl-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          addToast({
                            type: 'success',
                            title: 'Diagnostic Partner Sample Collection',
                            message: `Home sample collection for "${test.testName}" request initiated with ${test.clinicName}.`,
                          });
                        }}
                        className="text-xs border-[#C4CFC0]"
                      >
                        Book Home Sample
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Pharmacy Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {pharmacyOrders.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#C4CFC0] bg-white p-12 text-center">
                <ShoppingBag className="mx-auto h-12 w-12 text-[#808D7C]" />
                <h3 className="mt-3 text-lg font-bold text-[#1C231F]">No Medicine Orders Placed Yet</h3>
                <p className="text-xs text-[#5F6F65] mt-1 max-w-md mx-auto">
                  You can order 100% authentic medicines directly from your verified digital prescriptions with fast 2-3 hour doorstep delivery.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveTab('prescriptions')}
                  className="mt-6 text-xs"
                >
                  Browse Prescriptions to Order
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {pharmacyOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-[#C4CFC0] bg-white p-5 shadow-xs space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8DF] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#1C231F]">
                          {order.id}
                        </span>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200">
                          {order.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-[#808D7C]">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Placed: {formatDateLong(order.createdAt.split('T')[0])}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-[#808D7C] font-semibold block">Prescribing Physician:</span>
                        <span className="font-bold text-[#1C231F]">{order.doctorName}</span>
                      </div>
                      <div>
                        <span className="text-[#808D7C] font-semibold block">Delivery Address:</span>
                        <span className="text-[#5F6F65]">{order.deliveryAddress}</span>
                      </div>
                      <div>
                        <span className="text-[#808D7C] font-semibold block">Estimated Delivery:</span>
                        <span className="font-bold text-emerald-800">{order.estimatedDelivery}</span>
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="rounded-xl bg-[#F8FAF7] border border-[#E2E8DF] p-3 text-xs space-y-1.5">
                      <div className="font-semibold text-[#808D7C]">Ordered Items:</div>
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-[#2B352F]">
                          <span>{it.name} ({it.dosage})</span>
                          <span className="font-mono font-bold">{formatCurrency(it.price)}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-[#E2E8DF] flex justify-between font-bold text-sm text-[#1C231F]">
                        <span>Grand Total:</span>
                        <span className="font-mono text-[#5F6F65]">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Waitlist Alerts */}
        {activeTab === 'waitlist' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#C4CFC0] bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#E2E8DF] pb-4 mb-4">
                <div>
                  <h3 className="font-bold text-lg text-[#1C231F]">
                    Active Cancellation Waitlists
                  </h3>
                  <p className="text-xs text-[#5F6F65]">
                    You will receive automated SMS notifications if any patient reschedules an earlier slot.
                  </p>
                </div>
                <Badge variant="outline" className="bg-[#F0F4ED] text-[#5F6F65]">
                  {waitlistEntries.length} Active Alerts
                </Badge>
              </div>

              {waitlistEntries.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#808D7C]">
                  No active waitlist alert subscriptions. You can join the waitlist from any doctor's profile or booking screen.
                </div>
              ) : (
                <div className="divide-y divide-[#E2E8DF]">
                  {waitlistEntries.map((entry) => (
                    <div key={entry.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#1C231F]">{entry.doctorName}</h4>
                          <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-800 border-amber-200">
                            Monitoring Openings
                          </Badge>
                        </div>
                        <p className="text-xs text-[#5F6F65] mt-0.5">
                          Preferred Target Date: <strong>{entry.preferredDate}</strong> • Shift: <span className="capitalize font-semibold">{entry.preferredTimeSlot || 'Any'}</span>
                        </p>
                        <p className="text-[11px] text-[#808D7C]">
                          Alert Destination: {entry.phone} ({entry.email})
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            removeEntry(entry.id);
                            addToast({
                              type: 'info',
                              title: 'Waitlist Alert Removed',
                              message: `Removed monitoring for ${entry.doctorName}.`,
                            });
                          }}
                          className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Cancel Alert
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Prescription Details Modal */}
      {activeRxForModal && (
        <PrescriptionDetailsModal
          prescription={activeRxForModal}
          onClose={() => setActiveRxForModal(null)}
          onOrderMedicines={(r) => {
            setActiveRxForModal(null);
            setActiveRxForOrder(r);
          }}
        />
      )}

      {/* Order Medicine Modal */}
      {activeRxForOrder && (
        <OrderMedicineModal
          prescription={activeRxForOrder}
          onClose={() => setActiveRxForOrder(null)}
        />
      )}
    </div>
  );
}
