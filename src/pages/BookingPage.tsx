import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, UserPlus, ShieldCheck, AlertCircle, Stethoscope } from 'lucide-react';
import { MOCK_DOCTORS } from '../data/mockDoctors';
import { Doctor, Appointment } from '../types';
import { useBookingStore, BookingStep } from '../stores/useBookingStore';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { useUIStore } from '../stores/useUIStore';
import { BookingStepper } from '../components/booking/BookingStepper';
import { BookingSummaryCard } from '../components/booking/BookingSummaryCard';
import { Step1DateTime } from '../components/booking/Step1DateTime';
import { Step2PatientInfo } from '../components/booking/Step2PatientInfo';
import { Step3ReviewPayment } from '../components/booking/Step3ReviewPayment';
import { Step4Confirmation } from '../components/booking/Step4Confirmation';
import { Button } from '../components/ui/Button';

interface BookingPageProps {
  doctorId?: string;
}

export function BookingPage({ doctorId }: BookingPageProps) {
  const { navigate, addToast } = useUIStore();
  const {
    currentStep,
    doctor,
    selectedDateStr,
    selectedSlot,
    patientDetails,
    appliedPromo,
    isSubmitting,
    confirmedAppointmentId,
    initBooking,
    setStep,
    nextStep,
    prevStep,
    setSelectedDateStr,
    setSelectedSlot,
    setPatientDetails,
    setSubmitting,
    setConfirmedAppointmentId,
    resetBooking,
  } = useBookingStore();

  const { createAppointment, getAppointmentById } = useAppointmentStore();
  const [visitType, setVisitType] = useState<'in-person' | 'telehealth'>('in-person');

  // If doctor is not yet loaded in booking store or URL has a specific doctorId
  useEffect(() => {
    if (doctorId && (!doctor || doctor.id !== doctorId)) {
      const foundDoctor = MOCK_DOCTORS.find((d) => d.id === doctorId);
      if (foundDoctor) {
        initBooking(foundDoctor);
      }
    } else if (!doctor && MOCK_DOCTORS.length > 0) {
      // Default to first doctor if accessed without param
      initBooking(MOCK_DOCTORS[0]);
    }
  }, [doctorId, doctor, initBooking]);

  // Handle final appointment creation
  const handleFinalConfirmation = async () => {
    if (!doctor || !selectedDateStr || !selectedSlot) return;

    setSubmitting(true);

    try {
      // Simulate booking network handshake
      await new Promise((resolve) => setTimeout(resolve, 750));

      const discount = appliedPromo ? appliedPromo.discountAmount : 0;

      const newAppt = createAppointment({
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        doctorAvatar: doctor.avatar,
        clinic: {
          ...doctor.clinic,
          name:
            visitType === 'telehealth'
              ? `${doctor.clinic.name} (Telehealth Video Room)`
              : doctor.clinic.name,
        },
        dateStr: selectedDateStr,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        timezone: selectedSlot.timezone || 'America/New_York',
        patientDetails,
        consultationFee: doctor.consultationFee,
        discountAmount: discount > 0 ? discount : undefined,
        promoCode: appliedPromo ? appliedPromo.code : undefined,
      });

      setConfirmedAppointmentId(newAppt.id);
      setStep(4);
      addToast({
        type: 'success',
        title: 'Appointment Booked!',
        message: `Your visit with ${doctor.name} on ${selectedDateStr} is confirmed.`,
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Booking Error',
        message: 'Could not complete appointment reservation. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // If waiting for doctor initialization
  if (!doctor) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="rounded-3xl border border-[#C4CFC0] bg-white p-12 shadow-sm space-y-4">
          <Stethoscope className="h-10 w-10 text-[#5F6F65] mx-auto animate-pulse" />
          <h3 className="font-serif text-2xl font-bold text-[#1C231F]">
            Loading Provider Schedule...
          </h3>
          <p className="text-xs text-[#5F6F65]">
            Preparing real-time slot inventory and clinical intake forms.
          </p>
        </div>
      </div>
    );
  }

  const confirmedAppointment = confirmedAppointmentId
    ? getAppointmentById(confirmedAppointmentId)
    : undefined;

  return (
    <div className="min-h-screen bg-[#FDFEFC] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (currentStep > 1 && currentStep < 4) {
                  prevStep();
                } else {
                  navigate({ path: '/doctors/:id', id: doctor.id });
                }
              }}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#C4CFC0] bg-white text-[#5F6F65] hover:bg-[#F0F4ED] hover:text-[#1C231F] transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5F6F65]">
                Doctor Appointment Wizard
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C231F]">
                Book with {doctor.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#5F6F65]">
            <ShieldCheck className="h-4 w-4 text-[#5F6F65]" />
            <span>256-Bit Encrypted & HIPAA Compliant</span>
          </div>
        </div>

        {/* 4-Step Stepper Header */}
        <BookingStepper
          currentStep={currentStep}
          onStepClick={(step) => {
            if (step < currentStep && currentStep !== 4) {
              setStep(step);
            }
          }}
        />

        {/* Main Content Layout */}
        {currentStep === 4 && confirmedAppointment ? (
          /* Step 4: Instant Confirmation Pass (Full Width) */
          <div className="max-w-4xl mx-auto">
            <Step4Confirmation
              appointment={confirmedAppointment}
              onViewAppointments={() => navigate({ path: '/appointments' })}
              onBookAnother={() => {
                resetBooking();
                navigate({ path: '/search' });
              }}
            />
          </div>
        ) : (
          /* Steps 1, 2, 3: Two-Column Form & Summary Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Active Step Form */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentStep === 1 && (
                    <Step1DateTime
                      doctor={doctor}
                      selectedDateStr={selectedDateStr}
                      selectedSlot={selectedSlot}
                      visitType={visitType}
                      onDateChange={setSelectedDateStr}
                      onSlotChange={setSelectedSlot}
                      onVisitTypeChange={setVisitType}
                      onContinue={nextStep}
                    />
                  )}

                  {currentStep === 2 && (
                    <Step2PatientInfo
                      initialDetails={patientDetails}
                      onUpdateDetails={setPatientDetails}
                      onBack={prevStep}
                      onContinue={nextStep}
                    />
                  )}

                  {currentStep === 3 && selectedDateStr && selectedSlot && (
                    <Step3ReviewPayment
                      doctor={doctor}
                      selectedDateStr={selectedDateStr}
                      selectedSlot={selectedSlot}
                      patientDetails={patientDetails}
                      visitType={visitType}
                      isSubmitting={isSubmitting}
                      onBack={prevStep}
                      onConfirm={handleFinalConfirmation}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Column: Sticky Summary Card */}
            <div className="lg:col-span-4">
              <BookingSummaryCard
                doctor={doctor}
                selectedDateStr={selectedDateStr}
                selectedSlot={selectedSlot}
                patientDetails={patientDetails}
                visitType={visitType}
                onChangeSlot={currentStep > 1 ? () => setStep(1) : undefined}
                showFeeBreakdown={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
