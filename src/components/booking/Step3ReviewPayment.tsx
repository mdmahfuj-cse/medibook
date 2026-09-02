import React, { useState } from 'react';
import {
  CreditCard,
  Building2,
  Calendar,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Lock,
  FileText,
  AlertCircle,
  HelpCircle,
  Video,
  Wallet,
  Tag,
  X,
  Sparkles,
} from 'lucide-react';
import { Doctor, TimeSlot, PatientDetails } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { formatTimeSlot } from '../../utils/scheduleUtils';
import { useBookingStore } from '../../stores/useBookingStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface Step3ReviewPaymentProps {
  doctor: Doctor;
  selectedDateStr: string;
  selectedSlot: TimeSlot;
  patientDetails: PatientDetails;
  visitType: 'in-person' | 'telehealth';
  isSubmitting: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

type PaymentOption = 'clinic' | 'card' | 'hsa' | 'insurance';

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  const parts: string[] = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.slice(i, i + 4));
  }
  return parts.join(' ');
}

function formatCardExp(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
}

export function Step3ReviewPayment({
  doctor,
  selectedDateStr,
  selectedSlot,
  patientDetails,
  visitType,
  isSubmitting,
  onBack,
  onConfirm,
}: Step3ReviewPaymentProps) {
  const { appliedPromo, applyPromoCode, removePromoCode } = useBookingStore();
  const [paymentOption, setPaymentOption] = useState<PaymentOption>('clinic');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [consentError, setConsentError] = useState(false);

  // Promo code local state
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Simulated card fields
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExp, setCardExp] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('891');
  const [billingZip, setBillingZip] = useState('10021');
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  const discount = appliedPromo ? appliedPromo.discountAmount : 0;
  const finalFee = Math.max(0, doctor.consultationFee - discount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (res.success) {
      setPromoMessage({ text: res.message, isError: false });
      setPromoInput('');
    } else {
      setPromoMessage({ text: res.message, isError: true });
    }
  };

  const validateCard = (): boolean => {
    if (paymentOption !== 'card' && paymentOption !== 'hsa') return true;

    const errs: Record<string, string> = {};
    const rawCard = cardNumber.replace(/\s/g, '');
    if (rawCard.length < 15) {
      errs.cardNumber = 'Please enter a valid 16-digit card number';
    }
    if (cardExp.length < 5) {
      errs.cardExp = 'Expiry must be MM/YY';
    }
    if (cardCvc.length < 3) {
      errs.cardCvc = '3-digit security code required';
    }
    if (!billingZip.trim()) {
      errs.billingZip = 'ZIP required';
    }

    setCardErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFinalConfirm = () => {
    if (!agreedTerms) {
      setConsentError(true);
      return;
    }
    setConsentError(false);

    if (!validateCard()) {
      return;
    }

    onConfirm();
  };

  const isVideo = visitType === 'telehealth';

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Appointment Details Summary Review */}
      <div className="rounded-3xl border border-[#C4CFC0] bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8DF]">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#1C231F]">
              Review Appointment Details
            </h3>
            <p className="text-xs text-[#5F6F65] mt-0.5">
              Please double check your schedule and clinical intake information
            </p>
          </div>
          <Badge variant="sage" size="sm">
            {isVideo ? 'Telehealth Video' : 'In-Person Visit'}
          </Badge>
        </div>

        {/* Doctor & Clinic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Doctor Info */}
          <div className="flex items-start gap-4 p-4 rounded-2xl border border-[#E2E8DF] bg-[#F8FAF7]">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="h-14 w-14 rounded-2xl object-cover border border-[#C4CFC0] shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5F6F65] block">
                Healthcare Specialist
              </span>
              <h4 className="font-serif text-base font-bold text-[#1C231F] truncate">
                {doctor.name}
              </h4>
              <p className="text-xs text-[#5F6F65]">{doctor.specialty} · {doctor.hospitalAffiliation}</p>
            </div>
          </div>

          {/* Schedule & Location Info */}
          <div className="p-4 rounded-2xl border border-[#E2E8DF] bg-[#F8FAF7] space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#1C231F] font-bold">
              <Calendar className="h-4 w-4 text-[#5F6F65]" />
              <span>{selectedDateStr}</span>
              <span className="text-[#808D7C]">·</span>
              <Clock className="h-4 w-4 text-[#5F6F65]" />
              <span>
                {formatTimeSlot(selectedSlot.startTime)} - {formatTimeSlot(selectedSlot.endTime)}
              </span>
            </div>

            <div className="flex items-start gap-2 text-[#5F6F65] pt-1 border-t border-[#E2E8DF]/60">
              {isVideo ? (
                <>
                  <Video className="h-4 w-4 text-[#5F6F65] shrink-0 mt-0.5" />
                  <span>Encrypted HD Video Room link will be sent via email & SMS</span>
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 text-[#5F6F65] shrink-0 mt-0.5" />
                  <span>
                    {doctor.clinic.name} ({doctor.clinic.address}, {doctor.clinic.city})
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Patient Summary */}
        <div className="rounded-2xl border border-[#E2E8DF] p-4 bg-[#FDFEFC] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[#808D7C] block font-medium">Patient Name</span>
            <span className="font-bold text-[#1C231F] mt-0.5 block">{patientDetails.fullName}</span>
            {patientDetails.guardianName && (
              <span className="text-[11px] text-amber-700 block mt-0.5">
                Guardian: {patientDetails.guardianName}
              </span>
            )}
          </div>
          <div>
            <span className="text-[#808D7C] block font-medium">Contact Details</span>
            <span className="font-medium text-[#1C231F] mt-0.5 block">{patientDetails.email}</span>
            <span className="text-[#808D7C]">{patientDetails.phone}</span>
          </div>
          <div>
            <span className="text-[#808D7C] block font-medium">Insurance / Coverage</span>
            <span className="font-bold text-[#1C231F] mt-0.5 block">
              {patientDetails.insuranceProvider || 'Self-Pay'}
            </span>
            {patientDetails.insuranceMemberId && (
              <span className="text-[11px] text-[#5F6F65] block font-mono">
                ID: {patientDetails.insuranceMemberId}
              </span>
            )}
          </div>
        </div>

        {/* Visit Reason Note */}
        <div className="rounded-2xl border border-[#E2E8DF] p-4 bg-[#F8FAF7] text-xs">
          <span className="text-[#808D7C] block font-semibold uppercase tracking-wider mb-1">
            Reason for Consultation:
          </span>
          <p className="text-[#2B352F] italic">"{patientDetails.reasonForVisit}"</p>
        </div>
      </div>

      {/* 2. Promo Code & Voucher Section */}
      <div className="rounded-3xl border border-[#C4CFC0] bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8DF]">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-[#5F6F65]" />
            <h4 className="font-serif text-base font-bold text-[#1C231F]">
              Have a Promo or Referral Code?
            </h4>
          </div>
          <span className="text-xs text-[#808D7C]">Try FIRSTVISIT or HEALTH10</span>
        </div>

        {appliedPromo ? (
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/80 text-emerald-800">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <div>
                <span className="font-bold text-xs uppercase tracking-wider">{appliedPromo.code}</span>
                <p className="text-xs text-emerald-700">{appliedPromo.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-emerald-900">-{formatCurrency(appliedPromo.discountAmount)}</span>
              <button
                type="button"
                onClick={removePromoCode}
                className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer"
                title="Remove discount"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleApplyPromo} className="flex gap-2">
            <input
              type="text"
              id="promo-code-input"
              placeholder="Enter voucher code (e.g. FIRSTVISIT)"
              value={promoInput}
              onChange={(e) => {
                setPromoInput(e.target.value.toUpperCase());
                if (promoMessage) setPromoMessage(null);
              }}
              className="flex-1 rounded-xl border border-[#C4CFC0] bg-white px-3.5 py-2 text-xs font-mono uppercase text-[#1C231F] focus:border-[#5F6F65] focus:outline-none"
            />
            <Button type="submit" variant="outline" size="sm" className="px-4 text-xs font-bold">
              Apply Code
            </Button>
          </form>
        )}

        {promoMessage && (
          <p
            className={`text-xs flex items-center gap-1.5 ${
              promoMessage.isError ? 'text-red-600' : 'text-emerald-700'
            }`}
          >
            {promoMessage.isError ? (
              <AlertCircle className="h-3.5 w-3.5" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5" />
            )}
            {promoMessage.text}
          </p>
        )}
      </div>

      {/* 3. Payment Method Selector */}
      <div className="rounded-3xl border border-[#C4CFC0] bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="pb-4 border-b border-[#E2E8DF]">
          <h3 className="font-serif text-xl font-bold text-[#1C231F]">
            Choose Payment Method
          </h3>
          <p className="text-xs text-[#5F6F65] mt-0.5">
            Select your preferred consultation payment method.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Option 1: Pay at Hospital / Clinic */}
          <button
            type="button"
            id="payment-option-clinic"
            onClick={() => setPaymentOption('clinic')}
            className={`flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all cursor-pointer ${
              paymentOption === 'clinic'
                ? 'border-[#5F6F65] bg-[#F0F4ED] ring-2 ring-[#5F6F65]/20'
                : 'border-[#C4CFC0] bg-white hover:bg-[#F8FAF7]'
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                paymentOption === 'clinic'
                  ? 'bg-[#5F6F65] text-white'
                  : 'bg-[#E7EFE3] text-[#5F6F65]'
              }`}
            >
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1C231F]">Pay at Hospital / Clinic</span>
                {paymentOption === 'clinic' && (
                  <CheckCircle2 className="h-4 w-4 text-[#5F6F65]" />
                )}
              </div>
              <p className="text-xs text-[#5F6F65] mt-0.5">
                Pay in-person at hospital reception counter via Cash, Card, or bKash.
              </p>
            </div>
          </button>

          {/* Option 2: bKash / Nagad / Mobile Banking */}
          <button
            type="button"
            id="payment-option-mfs"
            onClick={() => setPaymentOption('hsa')}
            className={`flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all cursor-pointer ${
              paymentOption === 'hsa'
                ? 'border-[#5F6F65] bg-[#F0F4ED] ring-2 ring-[#5F6F65]/20'
                : 'border-[#C4CFC0] bg-white hover:bg-[#F8FAF7]'
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                paymentOption === 'hsa'
                  ? 'bg-[#5F6F65] text-white'
                  : 'bg-[#E7EFE3] text-[#5F6F65]'
              }`}
            >
              <Wallet className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1C231F]">bKash / Nagad / Rocket</span>
                {paymentOption === 'hsa' && (
                  <CheckCircle2 className="h-4 w-4 text-[#5F6F65]" />
                )}
              </div>
              <p className="text-xs text-[#5F6F65] mt-0.5">
                Instant digital checkout via bKash, Nagad, or Upay gateway.
              </p>
            </div>
          </button>

          {/* Option 3: Credit / Debit Card / Net Banking */}
          <button
            type="button"
            id="payment-option-card"
            onClick={() => setPaymentOption('card')}
            className={`flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all cursor-pointer ${
              paymentOption === 'card'
                ? 'border-[#5F6F65] bg-[#F0F4ED] ring-2 ring-[#5F6F65]/20'
                : 'border-[#C4CFC0] bg-white hover:bg-[#F8FAF7]'
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                paymentOption === 'card'
                  ? 'bg-[#5F6F65] text-white'
                  : 'bg-[#E7EFE3] text-[#5F6F65]'
              }`}
            >
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1C231F]">Credit / Debit Card (Visa/Mastercard)</span>
                {paymentOption === 'card' && (
                  <CheckCircle2 className="h-4 w-4 text-[#5F6F65]" />
                )}
              </div>
              <p className="text-xs text-[#5F6F65] mt-0.5">
                Secure SSLCommerz 256-bit encrypted online card processing.
              </p>
            </div>
          </button>

          {/* Option 4: Insurance / Corporate Panel */}
          <button
            type="button"
            id="payment-option-insurance"
            onClick={() => setPaymentOption('insurance')}
            className={`flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all cursor-pointer ${
              paymentOption === 'insurance'
                ? 'border-[#5F6F65] bg-[#F0F4ED] ring-2 ring-[#5F6F65]/20'
                : 'border-[#C4CFC0] bg-white hover:bg-[#F8FAF7]'
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                paymentOption === 'insurance'
                  ? 'bg-[#5F6F65] text-white'
                  : 'bg-[#E7EFE3] text-[#5F6F65]'
              }`}
            >
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1C231F]">Corporate / Health Insurance Panel</span>
                {paymentOption === 'insurance' && (
                  <CheckCircle2 className="h-4 w-4 text-[#5F6F65]" />
                )}
              </div>
              <p className="text-xs text-[#5F6F65] mt-0.5">
                Hospital bills directly to your corporate health partner or insurance provider.
              </p>
            </div>
          </button>
        </div>

        {/* Card Entry Fields (if card or hsa selected) */}
        {(paymentOption === 'card' || paymentOption === 'hsa') && (
          <div className="p-5 rounded-2xl border border-[#C4CFC0] bg-[#F8FAF7] space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-[#5F6F65]" />
                Cardholder Payment Details
              </span>
              <span className="text-[11px] text-[#808D7C]">Demo Safe Checkout</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-3">
                <label className="text-[11px] font-bold text-[#5F6F65] block mb-1">
                  Card Number *
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-3 h-4 w-4 text-[#808D7C]" />
                  <input
                    type="text"
                    id="card-number-input"
                    maxLength={19}
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={(e) => {
                      setCardNumber(formatCardNumber(e.target.value));
                      if (cardErrors.cardNumber) setCardErrors({ ...cardErrors, cardNumber: '' });
                    }}
                    className={`w-full rounded-xl border bg-white pl-10 pr-4 py-2.5 text-sm font-mono text-[#1C231F] focus:outline-none ${
                      cardErrors.cardNumber ? 'border-red-400' : 'border-[#C4CFC0] focus:border-[#5F6F65]'
                    }`}
                  />
                </div>
                {cardErrors.cardNumber && (
                  <p className="text-[10px] text-red-600 mt-1">{cardErrors.cardNumber}</p>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#5F6F65] block mb-1">
                  Expires (MM/YY) *
                </label>
                <input
                  type="text"
                  id="card-exp-input"
                  maxLength={5}
                  placeholder="MM/YY"
                  value={cardExp}
                  onChange={(e) => {
                    setCardExp(formatCardExp(e.target.value));
                    if (cardErrors.cardExp) setCardErrors({ ...cardErrors, cardExp: '' });
                  }}
                  className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm font-mono text-[#1C231F] focus:outline-none ${
                    cardErrors.cardExp ? 'border-red-400' : 'border-[#C4CFC0] focus:border-[#5F6F65]'
                  }`}
                />
                {cardErrors.cardExp && (
                  <p className="text-[10px] text-red-600 mt-1">{cardErrors.cardExp}</p>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#5F6F65] block mb-1">
                  CVC / Security Code *
                </label>
                <input
                  type="password"
                  id="card-cvc-input"
                  maxLength={4}
                  placeholder="CVC"
                  value={cardCvc}
                  onChange={(e) => {
                    setCardCvc(e.target.value.replace(/\D/g, ''));
                    if (cardErrors.cardCvc) setCardErrors({ ...cardErrors, cardCvc: '' });
                  }}
                  className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm font-mono text-[#1C231F] focus:outline-none ${
                    cardErrors.cardCvc ? 'border-red-400' : 'border-[#C4CFC0] focus:border-[#5F6F65]'
                  }`}
                />
                {cardErrors.cardCvc && (
                  <p className="text-[10px] text-red-600 mt-1">{cardErrors.cardCvc}</p>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#5F6F65] block mb-1">
                  Billing ZIP *
                </label>
                <input
                  type="text"
                  id="card-zip-input"
                  maxLength={10}
                  placeholder="ZIP"
                  value={billingZip}
                  onChange={(e) => {
                    setBillingZip(e.target.value);
                    if (cardErrors.billingZip) setCardErrors({ ...cardErrors, billingZip: '' });
                  }}
                  className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm font-mono text-[#1C231F] focus:outline-none ${
                    cardErrors.billingZip ? 'border-red-400' : 'border-[#C4CFC0] focus:border-[#5F6F65]'
                  }`}
                />
                {cardErrors.billingZip && (
                  <p className="text-[10px] text-red-600 mt-1">{cardErrors.billingZip}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Consent & Cancellation Agreement */}
      <div className="rounded-3xl border border-[#C4CFC0] bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            id="terms-checkbox"
            checked={agreedTerms}
            onChange={(e) => {
              setAgreedTerms(e.target.checked);
              if (e.target.checked) setConsentError(false);
            }}
            className="h-5 w-5 rounded-md border-[#C4CFC0] text-[#5F6F65] focus:ring-[#5F6F65] mt-0.5 cursor-pointer"
          />
          <div className="text-xs text-[#5F6F65] leading-relaxed">
            <span className="font-bold text-[#1C231F]">
              I agree to the Clinic Policies, HIPAA Privacy Notice, and 24-Hour Cancellation Policy.
            </span>
            <p className="mt-1 text-[#808D7C]">
              You can reschedule or cancel free of charge up to 24 hours prior to your scheduled consultation. By clicking confirm, you authorize the clinic to reserve this provider's appointment slot.
            </p>
          </div>
        </label>

        {consentError && (
          <p className="text-xs text-red-600 font-medium flex items-center gap-1.5 pt-1">
            <AlertCircle className="h-4 w-4" /> Please accept the clinical policies to proceed.
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          id="back-to-step2-btn"
          variant="outline"
          size="lg"
          disabled={isSubmitting}
          onClick={onBack}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Patient Info
        </Button>

        <Button
          type="button"
          id="final-confirm-booking-btn"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          onClick={handleFinalConfirm}
          className="font-bold text-sm shadow-md"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Securing Appointment...
            </span>
          ) : (
            `Confirm & Book (${formatCurrency(finalFee)})`
          )}
        </Button>
      </div>
    </div>
  );
}
