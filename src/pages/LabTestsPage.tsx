import { useState } from 'react';
import {
  TestTube,
  Package,
  Building2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Trash2,
  ChevronRight,
  Search,
  Sparkles,
  User,
  Phone,
  ShieldCheck,
  FileText,
  Download,
  Flame,
  ArrowRight,
  X,
  CreditCard,
  Truck,
} from 'lucide-react';
import { useLabTestsStore } from '../stores/useLabTestsStore';
import { useFamilyProfilesStore } from '../stores/useFamilyProfilesStore';
import { useUIStore } from '../stores/useUIStore';
import { LabTest, LabPackage } from '../types/phase10';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatCurrency } from '../lib/utils';

export function LabTestsPage() {
  const {
    tests,
    packages,
    diagnosticCenters,
    selectedCenter,
    setSelectedCenter,
    cartTests,
    cartPackages,
    addTestToCart,
    removeTestFromCart,
    addPackageToCart,
    removePackageFromCart,
    clearCart,
    orders,
    addOrder,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useLabTestsStore();

  const { profiles, getActiveProfile } = useFamilyProfilesStore();
  const { navigate } = useUIStore();
  const activeFamilyMember = getActiveProfile();

  const [activeTab, setActiveTab] = useState<'catalog' | 'orders'>('catalog');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTestDetail, setSelectedTestDetail] = useState<LabTest | null>(null);

  // Booking Form State
  const [selectedPatientId, setSelectedPatientId] = useState(activeFamilyMember.id);
  const [collectionType, setCollectionType] = useState<'home_collection' | 'center_walkin'>('home_collection');
  const [scheduledDate, setScheduledDate] = useState('2026-09-02');
  const [scheduledTimeSlot, setScheduledTimeSlot] = useState('07:30 AM - 08:30 AM');
  const [streetAddress, setStreetAddress] = useState('Flat 4B, House 12, Road 4');
  const [area, setArea] = useState('Dhanmondi');
  const [city, setCity] = useState('Dhaka');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'card' | 'cash_on_collection'>('bkash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessMessage, setOrderSuccessMessage] = useState<string | null>(null);

  // Filter tests
  const categories = ['All', 'Hematology', 'Biochemistry', 'Endocrinology', 'Microbiology', 'Cardiac Diagnostics', 'Radiology & Imaging'];

  const filteredTests = tests.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Calculate Cart Subtotal
  const testsTotal = cartTests.reduce((acc, t) => acc + (t.discountedPrice || t.price), 0);
  const packagesTotal = cartPackages.reduce((acc, p) => acc + p.price, 0);
  const subtotal = testsTotal + packagesTotal;
  const homeCollectionFee = collectionType === 'home_collection' ? (subtotal > 2000 ? 0 : 150) : 0;
  const centerDiscount = Math.round(subtotal * (selectedCenter.homeCollectionDiscountPercent / 100));
  const netPayable = subtotal - centerDiscount + homeCollectionFee;

  const handleCheckout = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const selectedPatient = profiles.find((p) => p.id === selectedPatientId) || activeFamilyMember;
      const newOrderNumber = `LAB-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const newOrder = {
        id: `lab-ord-${Date.now()}`,
        orderNumber: newOrderNumber,
        patientId: selectedPatient.id,
        patientName: selectedPatient.fullName,
        patientPhone: selectedPatient.phone || '+880 1711-000000',
        tests: [...cartTests],
        packages: [...cartPackages],
        diagnosticCenter: selectedCenter,
        collectionType,
        scheduledDate,
        scheduledTimeSlot,
        address:
          collectionType === 'home_collection'
            ? {
                street: streetAddress,
                area,
                city,
              }
            : undefined,
        totalAmount: subtotal,
        discountAmount: centerDiscount,
        homeCollectionFee,
        netPayable,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash_on_collection' ? ('pending' as const) : ('paid' as const),
        status: 'confirmed' as const,
        phlebotomist:
          collectionType === 'home_collection'
            ? {
                name: 'Kawsar Mahmud (Senior Phlebotomist)',
                phone: '+880 1819-223344',
                vaccinationStatus: 'Fully Vaccinated & Verified Technologist',
                photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
                temperatureChecked: '98.4°F (Before Dispatch)',
              }
            : undefined,
        createdAt: new Date().toISOString(),
      };

      addOrder(newOrder);
      clearCart();
      setIsSubmitting(false);
      setIsBookingModalOpen(false);
      setIsCartOpen(false);
      setActiveTab('orders');
      setOrderSuccessMessage(`Booking ${newOrderNumber} placed successfully! Our certified phlebotomist has been notified.`);
      setTimeout(() => setOrderSuccessMessage(null), 8000);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E2E8DF] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E7EFE3] text-[#1C231F]">
                <TestTube className="h-3.5 w-3.5 text-[#5F6F65]" />
                Diagnostic Pathology & Scans
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                <Truck className="h-3.5 w-3.5 text-blue-600" />
                Home Sample Collection
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C231F] mt-1.5">
              Diagnostic Lab Tests & Packages
            </h1>
            <p className="text-sm text-[#5F6F65] mt-1 max-w-2xl">
              Book certified pathology tests, biochemistry profiles, and radiology scans with doorstep sample collection from Bangladesh's accredited diagnostic laboratories.
            </p>
          </div>

          {/* Cart trigger button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="view-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#1C231F] text-white font-medium text-sm hover:bg-[#2C3E35] transition-all shadow-sm cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Lab Cart</span>
              {cartTests.length + cartPackages.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold">
                  {cartTests.length + cartPackages.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {orderSuccessMessage && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-medium">{orderSuccessMessage}</p>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex border-b border-[#E2E8DF] mt-6 gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === 'catalog'
                ? 'text-[#1C231F] border-b-2 border-[#1C231F]'
                : 'text-[#5F6F65] hover:text-[#1C231F]'
            }`}
          >
            Browse Tests & Full Body Packages
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'text-[#1C231F] border-b-2 border-[#1C231F]'
                : 'text-[#5F6F65] hover:text-[#1C231F]'
            }`}
          >
            <span>My Lab Orders & Phlebotomist Tracking</span>
            {orders.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-[#E7EFE3] text-[#1C231F] font-bold">
                {orders.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: CATALOG */}
        {activeTab === 'catalog' && (
          <div className="mt-6 space-y-8">
            {/* Diagnostic Center Selector Bar */}
            <div className="bg-white p-5 rounded-3xl border border-[#C4CFC0] shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#808D7C] block">
                    Choose Partner Diagnostic Lab
                  </label>
                  <p className="text-sm font-medium text-[#1C231F] mt-0.5">
                    Selected Lab: <span className="font-bold">{selectedCenter.name}</span> ({selectedCenter.branch})
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {diagnosticCenters.map((center) => (
                    <button
                      key={center.id}
                      type="button"
                      onClick={() => setSelectedCenter(center)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedCenter.id === center.id
                          ? 'bg-[#1C231F] text-white shadow-xs'
                          : 'bg-[#F0F4ED] text-[#5F6F65] hover:bg-[#E2E8DF] hover:text-[#1C231F]'
                      }`}
                    >
                      {center.name.split(' ')[0]} {center.name.split(' ')[1] || ''}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#E2E8DF] flex flex-wrap items-center justify-between text-xs text-[#5F6F65] gap-2">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#808D7C]" />
                  {selectedCenter.address}
                </span>
                <span className="flex items-center gap-1.5 font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  {selectedCenter.accredited.join(' • ')}
                </span>
                <span className="font-bold text-[#1C231F]">
                  Special {selectedCenter.homeCollectionDiscountPercent}% Discount Applied
                </span>
              </div>
            </div>

            {/* Popular Health Packages Showcase */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-amber-500" />
                  <h2 className="text-lg font-bold text-[#1C231F]">Featured Health & Wellness Checkup Packages</h2>
                </div>
                <span className="text-xs text-[#5F6F65]">Up to 45% lower than individual tests</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {packages.map((pkg) => {
                  const isInCart = cartPackages.some((p) => p.id === pkg.id);
                  return (
                    <div
                      key={pkg.id}
                      className="flex flex-col justify-between bg-white rounded-3xl border border-[#C4CFC0] p-5 hover:shadow-md transition-all relative overflow-hidden"
                    >
                      {pkg.badge && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="success" className="text-[10px] font-bold">
                            {pkg.badge}
                          </Badge>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-[#808D7C] mb-1 font-medium">
                          <Package className="h-3.5 w-3.5 text-emerald-700" />
                          <span>{pkg.totalTestsCount} Parameters Included</span>
                        </div>
                        <h3 className="font-bold text-sm text-[#1C231F] leading-snug">{pkg.name}</h3>
                        <p className="text-xs text-[#5F6F65] mt-1 line-clamp-2">{pkg.tagline}</p>

                        <div className="mt-3 flex flex-wrap gap-1">
                          {pkg.testsIncluded.slice(0, 3).map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-[#F0F4ED] text-[#1C231F] px-2 py-0.5 rounded-md font-medium"
                            >
                              {t}
                            </span>
                          ))}
                          {pkg.testsIncluded.length > 3 && (
                            <span className="text-[10px] text-[#5F6F65] font-semibold">
                              +{pkg.testsIncluded.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-[#E2E8DF] flex items-center justify-between">
                        <div>
                          <span className="text-xs text-[#808D7C] line-through block">
                            {formatCurrency(pkg.originalPrice)}
                          </span>
                          <span className="text-base font-bold text-[#1C231F]">
                            {formatCurrency(pkg.price)}
                          </span>
                        </div>

                        <Button
                          type="button"
                          id={`add-pkg-${pkg.id}`}
                          variant={isInCart ? 'secondary' : 'primary'}
                          size="sm"
                          onClick={() => {
                            if (isInCart) {
                              removePackageFromCart(pkg.id);
                            } else {
                              addPackageToCart(pkg);
                            }
                          }}
                          className="text-xs"
                        >
                          {isInCart ? 'In Cart ✓' : 'Add Package'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Individual Pathology Tests Directory */}
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-[#1C231F]">All Pathology & Diagnostic Lab Tests</h2>
                  <p className="text-xs text-[#5F6F65]">Accredited high-precision clinical biochemistry, hematology, and scans</p>
                </div>

                {/* Search input */}
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#808D7C]" />
                  <input
                    type="text"
                    id="lab-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search test (e.g. CBC, HbA1c, Lipid, Thyroid)..."
                    className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl border border-[#C4CFC0] bg-white focus:outline-none focus:ring-2 focus:ring-[#5F6F65]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#808D7C] hover:text-black"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#1C231F] text-white shadow-xs'
                        : 'bg-white border border-[#C4CFC0] text-[#5F6F65] hover:border-[#1C231F] hover:text-[#1C231F]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Tests Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {filteredTests.map((test) => {
                  const isInCart = cartTests.some((t) => t.id === test.id);
                  return (
                    <div
                      key={test.id}
                      className="bg-white rounded-3xl border border-[#C4CFC0] p-5 flex flex-col justify-between hover:border-[#5F6F65] transition-all hover:shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-bold text-[#808D7C] uppercase tracking-wider bg-[#F0F4ED] px-2 py-0.5 rounded-md">
                            {test.code}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {test.sampleType}
                          </span>
                        </div>

                        <h3 className="font-bold text-sm text-[#1C231F] leading-snug">{test.name}</h3>
                        <p className="text-xs text-[#5F6F65] mt-1 leading-relaxed line-clamp-2">
                          {test.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#5F6F65]">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="h-3 w-3 text-[#808D7C]" />
                            Report in {test.reportTurnaroundHours}h
                          </span>
                          {test.fastingRequired && (
                            <span className="flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                              <AlertCircle className="h-3 w-3 text-amber-600" />
                              {test.fastingHours}h Fasting
                            </span>
                          )}
                          {test.homeCollectionAvailable && (
                            <span className="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                              Home Collection
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#E2E8DF] flex items-center justify-between">
                        <div>
                          {test.discountedPrice ? (
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-base font-bold text-[#1C231F]">
                                {formatCurrency(test.discountedPrice)}
                              </span>
                              <span className="text-xs text-[#808D7C] line-through">
                                {formatCurrency(test.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-base font-bold text-[#1C231F]">
                              {formatCurrency(test.price)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedTestDetail(test)}
                            className="text-xs text-[#5F6F65] hover:text-[#1C231F] font-semibold underline cursor-pointer"
                          >
                            Details
                          </button>
                          <Button
                            type="button"
                            id={`add-test-${test.id}`}
                            variant={isInCart ? 'secondary' : 'primary'}
                            size="sm"
                            onClick={() => {
                              if (isInCart) {
                                removeTestFromCart(test.id);
                              } else {
                                addTestToCart(test);
                              }
                            }}
                            className="text-xs"
                          >
                            {isInCart ? 'Added ✓' : 'Add to Cart'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS & PHLEBOTOMIST TRACKING */}
        {activeTab === 'orders' && (
          <div className="mt-6 space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#C4CFC0] p-12 text-center">
                <TestTube className="h-12 w-12 text-[#808D7C] mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#1C231F]">No Diagnostic Lab Orders Yet</h3>
                <p className="text-xs text-[#5F6F65] mt-1 max-w-md mx-auto">
                  Browse our extensive lab directory or health packages to book certified diagnostic tests with doorstep phlebotomist collection.
                </p>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveTab('catalog')}
                  className="mt-4 text-xs"
                >
                  Browse Lab Catalog
                </Button>
              </div>
            ) : (
              orders.map((order) => {
                const statusSteps = [
                  { id: 'confirmed', label: 'Order Placed' },
                  { id: 'phlebotomist_assigned', label: 'Phlebotomist Assigned' },
                  { id: 'sample_collected', label: 'Sample Collected' },
                  { id: 'processing_at_lab', label: 'Lab Processing' },
                  { id: 'report_ready', label: 'Report Ready' },
                ];

                const currentStepIndex = statusSteps.findIndex((s) => s.id === order.status);

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl border border-[#C4CFC0] p-6 shadow-xs space-y-6"
                  >
                    {/* Order Top Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8DF] pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#1C231F] bg-[#F0F4ED] px-2.5 py-1 rounded-lg">
                            {order.orderNumber}
                          </span>
                          <Badge
                            variant={order.status === 'report_ready' ? 'success' : 'sage'}
                            className="text-[11px] font-bold"
                          >
                            {order.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-[#5F6F65] mt-1 font-medium">
                          Patient: <strong className="text-[#1C231F]">{order.patientName}</strong> • {order.diagnosticCenter.name} ({order.diagnosticCenter.branch})
                        </p>
                      </div>

                      <div className="text-right sm:text-right">
                        <span className="text-xs text-[#808D7C] block">Total Amount</span>
                        <span className="text-base font-bold text-[#1C231F]">
                          {formatCurrency(order.netPayable)}
                        </span>
                        <span className="text-[10px] text-emerald-700 block font-bold">
                          Paid via {order.paymentMethod.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar Timeline */}
                    <div>
                      <div className="grid grid-cols-5 gap-2 relative">
                        {statusSteps.map((step, idx) => {
                          const isDone = idx <= currentStepIndex;
                          const isCurrent = idx === currentStepIndex;
                          return (
                            <div key={step.id} className="flex flex-col items-center text-center">
                              <div
                                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all ${
                                  isDone
                                    ? 'bg-[#1C231F] text-white shadow-xs'
                                    : 'bg-[#F0F4ED] text-[#808D7C]'
                                } ${isCurrent ? 'ring-4 ring-emerald-200' : ''}`}
                              >
                                {isDone ? '✓' : idx + 1}
                              </div>
                              <span
                                className={`text-[11px] leading-tight font-medium ${
                                  isDone ? 'text-[#1C231F] font-bold' : 'text-[#808D7C]'
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Phlebotomist & Logistics Card if Home Collection */}
                    {order.collectionType === 'home_collection' && order.phlebotomist && (
                      <div className="bg-[#F6F8F5] rounded-2xl p-4 border border-[#E2E8DF] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={order.phlebotomist.photoUrl}
                            alt={order.phlebotomist.name}
                            className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-xs"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#1C231F]">
                                {order.phlebotomist.name}
                              </span>
                              <Badge variant="outline" className="text-[10px] text-emerald-800 border-emerald-300">
                                Certified Phlebotomist
                              </Badge>
                            </div>
                            <p className="text-[11px] text-[#5F6F65] mt-0.5">
                              {order.phlebotomist.vaccinationStatus} • Temp: {order.phlebotomist.temperatureChecked}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${order.phlebotomist.phone}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#C4CFC0] text-xs font-bold text-[#1C231F] hover:bg-[#F0F4ED]"
                          >
                            <Phone className="h-3.5 w-3.5 text-emerald-700" />
                            Call Phlebotomist ({order.phlebotomist.phone})
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Itemized Tests in this Order */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#808D7C]">
                        Booked Diagnostics & Panels
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {order.tests.map((t) => (
                          <div
                            key={t.id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-[#F0F4ED]/50 border border-[#E2E8DF] text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <TestTube className="h-3.5 w-3.5 text-[#5F6F65]" />
                              <span className="font-bold text-[#1C231F]">{t.name}</span>
                            </div>
                            <span className="font-bold text-[#5F6F65]">
                              {formatCurrency(t.discountedPrice || t.price)}
                            </span>
                          </div>
                        ))}
                        {order.packages.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-[#E7EFE3]/50 border border-[#C4CFC0] text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <Package className="h-3.5 w-3.5 text-emerald-800" />
                              <span className="font-bold text-[#1C231F]">{p.name}</span>
                            </div>
                            <span className="font-bold text-[#1C231F]">{formatCurrency(p.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Report Download Action */}
                    {order.status === 'report_ready' && (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-6 w-6 text-emerald-700" />
                          <div>
                            <span className="text-xs font-bold text-emerald-950 block">
                              Digital Pathology Report Released
                            </span>
                            <span className="text-[11px] text-emerald-800">
                              Digitally signed by Chief Pathologist & ISO 15189 verified
                            </span>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            alert(`Downloading official verified laboratory report: ${order.orderNumber}.pdf`);
                          }}
                          leftIcon={<Download className="h-3.5 w-3.5" />}
                          className="text-xs bg-emerald-800 hover:bg-emerald-900"
                        >
                          Download Verified PDF
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* CART DRAWER / MODAL */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
            <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
              <div>
                <div className="flex items-center justify-between border-b border-[#E2E8DF] pb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-[#1C231F]" />
                    <h2 className="text-lg font-bold text-[#1C231F]">Diagnostic Lab Cart</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="h-8 w-8 rounded-full bg-[#F0F4ED] flex items-center justify-center text-[#5F6F65] hover:bg-[#E2E8DF] cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {cartTests.length === 0 && cartPackages.length === 0 ? (
                  <div className="py-16 text-center">
                    <TestTube className="h-10 w-10 text-[#808D7C] mx-auto mb-2" />
                    <p className="text-sm font-bold text-[#1C231F]">Your cart is empty</p>
                    <p className="text-xs text-[#5F6F65] mt-1">Add individual blood tests or comprehensive packages to proceed.</p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    {cartTests.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-start justify-between p-3 rounded-2xl bg-[#FBFBFA] border border-[#E2E8DF]"
                      >
                        <div>
                          <h4 className="text-xs font-bold text-[#1C231F]">{t.name}</h4>
                          <span className="text-[10px] text-[#808D7C]">
                            {t.sampleType} • {t.fastingRequired ? `${t.fastingHours}h Fasting` : 'No fasting'}
                          </span>
                          <span className="text-xs font-bold text-[#1C231F] block mt-1">
                            {formatCurrency(t.discountedPrice || t.price)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTestFromCart(t.id)}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    {cartPackages.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-start justify-between p-3 rounded-2xl bg-[#E7EFE3]/40 border border-[#C4CFC0]"
                      >
                        <div>
                          <Badge variant="outline" className="text-[9px] text-emerald-800 border-emerald-300">
                            Package ({p.totalTestsCount} Tests)
                          </Badge>
                          <h4 className="text-xs font-bold text-[#1C231F] mt-1">{p.name}</h4>
                          <span className="text-xs font-bold text-[#1C231F] block mt-1">
                            {formatCurrency(p.price)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePackageFromCart(p.id)}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cartTests.length + cartPackages.length > 0 && (
                <div className="border-t border-[#E2E8DF] pt-4 space-y-3">
                  <div className="space-y-1.5 text-xs text-[#5F6F65]">
                    <div className="flex justify-between">
                      <span>Tests & Packages Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Lab Center Promo ({selectedCenter.homeCollectionDiscountPercent}%)</span>
                      <span>-{formatCurrency(centerDiscount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Home Phlebotomist Visit</span>
                      <span>{homeCollectionFee === 0 ? 'FREE' : formatCurrency(homeCollectionFee)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-[#1C231F] pt-2 border-t border-[#E2E8DF]">
                      <span>Estimated Net Total</span>
                      <span>{formatCurrency(netPayable)}</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    id="proceed-booking-btn"
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsBookingModalOpen(true);
                    }}
                    className="w-full text-xs font-bold py-3"
                  >
                    Proceed to Phlebotomist Booking
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BOOKING CHECKOUT MODAL */}
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#E2E8DF] pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#1C231F]">Schedule Lab Sample Collection</h3>
                  <p className="text-xs text-[#5F6F65]">Accredited sample pickup with temperature-controlled logistics</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="h-8 w-8 rounded-full bg-[#F0F4ED] flex items-center justify-center text-[#5F6F65]"
                >
                  ✕
                </button>
              </div>

              {/* Patient Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#808D7C] block mb-2">
                  Select Patient (Family Profile)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {profiles.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPatientId(p.id)}
                      className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer ${
                        selectedPatientId === p.id
                          ? 'border-[#1C231F] bg-[#E7EFE3] text-[#1C231F] font-bold'
                          : 'border-[#C4CFC0] bg-white text-[#5F6F65] hover:bg-[#F0F4ED]'
                      }`}
                    >
                      <span className="text-xs block truncate">{p.fullName}</span>
                      <span className="text-[10px] text-[#808D7C] font-normal">({p.relationship})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Collection Type Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#808D7C] block mb-2">
                  Sample Collection Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCollectionType('home_collection')}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      collectionType === 'home_collection'
                        ? 'border-[#1C231F] bg-[#F6F8F5] ring-2 ring-[#1C231F]'
                        : 'border-[#C4CFC0] bg-white text-[#5F6F65]'
                    }`}
                  >
                    <Truck className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-[#1C231F] block">Home Phlebotomist Visit</span>
                      <span className="text-[10px] text-[#5F6F65]">Doorstep sterile sample collection with ice box</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCollectionType('center_walkin')}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      collectionType === 'center_walkin'
                        ? 'border-[#1C231F] bg-[#F6F8F5] ring-2 ring-[#1C231F]'
                        : 'border-[#C4CFC0] bg-white text-[#5F6F65]'
                    }`}
                  >
                    <Building2 className="h-4 w-4 text-[#5F6F65] mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-[#1C231F] block">Center Walk-In</span>
                      <span className="text-[10px] text-[#5F6F65]">Fast-track token at {selectedCenter.branch}</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#1C231F] block mb-1">Collection Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#C4CFC0] text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1C231F] block mb-1">Preferred Time Window</label>
                  <select
                    value={scheduledTimeSlot}
                    onChange={(e) => setScheduledTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#C4CFC0] text-xs font-medium"
                  >
                    <option value="07:00 AM - 08:00 AM">07:00 AM - 08:00 AM (Ideal for Fasting)</option>
                    <option value="07:30 AM - 08:30 AM">07:30 AM - 08:30 AM</option>
                    <option value="08:30 AM - 09:30 AM">08:30 AM - 09:30 AM</option>
                    <option value="09:30 AM - 10:30 AM">09:30 AM - 10:30 AM</option>
                    <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM (Evening)</option>
                  </select>
                </div>
              </div>

              {/* Address Fields if Home Collection */}
              {collectionType === 'home_collection' && (
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#808D7C] block">
                    Collection Address
                  </label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="House / Flat / Road number"
                    className="w-full px-3 py-2 rounded-xl border border-[#C4CFC0] text-xs"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="Area (e.g. Dhanmondi, Gulshan, Uttara)"
                      className="w-full px-3 py-2 rounded-xl border border-[#C4CFC0] text-xs"
                    />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City (e.g. Dhaka)"
                      className="w-full px-3 py-2 rounded-xl border border-[#C4CFC0] text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#808D7C] block mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['bkash', 'nagad', 'card', 'cash_on_collection'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-2.5 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                        paymentMethod === method
                          ? 'border-[#1C231F] bg-[#1C231F] text-white'
                          : 'border-[#C4CFC0] bg-white text-[#5F6F65] hover:bg-[#F0F4ED]'
                      }`}
                    >
                      {method.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Summary & Confirm Button */}
              <div className="border-t border-[#E2E8DF] pt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#808D7C] block">Total Payable Amount</span>
                  <span className="text-lg font-bold text-[#1C231F]">
                    {formatCurrency(netPayable)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsBookingModalOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    id="confirm-lab-order-btn"
                    variant="primary"
                    size="sm"
                    onClick={handleCheckout}
                    disabled={isSubmitting}
                    className="text-xs font-bold"
                  >
                    {isSubmitting ? 'Confirming Order...' : 'Confirm & Schedule Booking'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEST DETAIL MODAL */}
        {selectedTestDetail && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2E8DF] pb-3">
                <div>
                  <span className="text-[10px] font-bold text-[#808D7C] uppercase">{selectedTestDetail.code}</span>
                  <h3 className="text-base font-bold text-[#1C231F]">{selectedTestDetail.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTestDetail(null)}
                  className="h-8 w-8 rounded-full bg-[#F0F4ED] flex items-center justify-center text-[#5F6F65]"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs text-[#5F6F65]">
                <p className="leading-relaxed">{selectedTestDetail.description}</p>
                <div className="bg-[#F0F4ED] p-3 rounded-2xl space-y-1 text-[11px]">
                  <strong className="text-[#1C231F] block">Test Preparation Guidelines:</strong>
                  <ul className="list-disc list-inside space-y-0.5">
                    {selectedTestDetail.prerequisites.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-[#E2E8DF] pt-4 flex items-center justify-between">
                <span className="text-base font-bold text-[#1C231F]">
                  {formatCurrency(selectedTestDetail.discountedPrice || selectedTestDetail.price)}
                </span>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    addTestToCart(selectedTestDetail);
                    setSelectedTestDetail(null);
                  }}
                  className="text-xs"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
