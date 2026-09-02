import React, { useState, useMemo } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Shield,
  ArrowLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Info,
  ShieldAlert,
  CreditCard,
  UploadCloud,
} from 'lucide-react';
import { PatientDetails, Gender } from '../../types';
import { Button } from '../ui/Button';

interface Step2PatientInfoProps {
  initialDetails: PatientDetails;
  onUpdateDetails: (details: Partial<PatientDetails>) => void;
  onBack: () => void;
  onContinue: () => void;
}

const COMMON_REASONS = [
  'Routine health checkup & annual screening',
  'Follow-up on existing condition',
  'New acute symptoms or localized pain',
  'Prescription renewal & dosage review',
  'Specialist second opinion',
  'Review lab / imaging test results',
];

const INSURANCE_PROVIDERS = [
  'Self-Pay / Direct Payment',
  'Green Delta Health Insurance',
  'Pragati Life Insurance (Health)',
  'Delta Life Insurance (Health Plus)',
  'MetLife Bangladesh Health Scheme',
  'National Life Insurance (Mediclaim)',
  'Corporate Health Panel / TPA Provider',
  'Guardian Life Insurance (Easy Health)',
];

function formatPhoneNumber(value: string): string {
  // Support Bangladesh phone formats (e.g., 01712-345678 or +880 1712-345678)
  const cleaned = value.replace(/[^\d+]/g, '').slice(0, 14);
  return cleaned;
}

function calculateAge(dobStr: string): number | null {
  if (!dobStr) return null;
  const dob = new Date(dobStr);
  if (isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
}

export function Step2PatientInfo({
  initialDetails,
  onUpdateDetails,
  onBack,
  onContinue,
}: Step2PatientInfoProps) {
  const [formData, setFormData] = useState<PatientDetails>(initialDetails);
  const [isFirstTimePatient, setIsFirstTimePatient] = useState(initialDetails.isFirstTime ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const age = useMemo(() => calculateAge(formData.dateOfBirth), [formData.dateOfBirth]);
  const isMinor = age !== null && age < 18;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = 'Please enter patient full legal name (at least 2 characters)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address (e.g. name@domain.com)';
    }

    const rawDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim() || rawDigits.length < 10) {
      errs.phone = 'Please enter a complete 10-digit phone number for SMS reminders';
    }

    if (!formData.dateOfBirth) {
      errs.dateOfBirth = 'Date of birth is required for clinical records';
    } else if (age !== null && age > 125) {
      errs.dateOfBirth = 'Please enter a realistic date of birth';
    }

    if (isMinor) {
      if (!formData.guardianName?.trim()) {
        errs.guardianName = 'Parent or legal guardian name is required for minors';
      }
      const rawGuardianDigits = (formData.guardianPhone || '').replace(/\D/g, '');
      if (!formData.guardianPhone?.trim() || rawGuardianDigits.length < 10) {
        errs.guardianPhone = 'Parent or guardian contact phone is required';
      }
    }

    if (!formData.reasonForVisit.trim() || formData.reasonForVisit.trim().length < 5) {
      errs.reasonForVisit = 'Please state your primary symptoms or visit purpose (min 5 characters)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    // Quick validate on single field
    const errs = { ...errors };
    if (field === 'email' && formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errs.email = 'Please enter a valid email address';
      } else {
        delete errs.email;
      }
    }
    if (field === 'phone' && formData.phone) {
      const rawDigits = formData.phone.replace(/\D/g, '');
      if (rawDigits.length < 10) {
        errs.phone = 'Please enter a complete 10-digit phone number';
      } else {
        delete errs.phone;
      }
    }
    setErrors(errs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onUpdateDetails({
        ...formData,
        isFirstTime: isFirstTimePatient,
      });
      onContinue();
    } else {
      // Scroll to top of form if errors
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
  };

  const handleGuardianPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({ ...prev, guardianPhone: formatted }));
    if (errors.guardianPhone) setErrors((prev) => ({ ...prev, guardianPhone: '' }));
  };

  const handleReasonPresetClick = (reason: string) => {
    setFormData((prev) => ({ ...prev, reasonForVisit: reason }));
    if (errors.reasonForVisit) {
      setErrors((prev) => ({ ...prev, reasonForVisit: '' }));
    }
  };

  const errorCount = Object.keys(errors).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-200">
      {/* Error Alert Banner if validation failed */}
      {errorCount > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-red-800 flex items-start gap-3 shadow-xs">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold">Please complete {errorCount} required field{errorCount > 1 ? 's' : ''}:</p>
            <ul className="list-disc pl-4 space-y-0.5 text-red-700">
              {Object.values(errors).map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 1. Patient Intake Card */}
      <div className="rounded-3xl border border-[#C4CFC0] bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="pb-4 border-b border-[#E2E8DF]">
          <h3 className="font-serif text-xl font-bold text-[#1C231F]">
            Patient Demographics & Contact
          </h3>
          <p className="text-xs text-[#5F6F65] mt-0.5">
            Please enter the legal name and contact information of the patient.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] block mb-1">
              Full Legal Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-[#808D7C]" />
              <input
                type="text"
                id="patient-fullname-input"
                placeholder="e.g. Eleanor Vance"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  if (errors.fullName) setErrors({ ...errors, fullName: '' });
                }}
                onBlur={() => handleBlur('fullName')}
                className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm text-[#1C231F] focus:outline-none transition-colors ${
                  errors.fullName
                    ? 'border-red-400 bg-red-50/50 focus:border-red-500'
                    : 'border-[#C4CFC0] bg-white focus:border-[#5F6F65]'
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.fullName}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] block mb-1">
              Email Address (For Confirmation & Link) *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#808D7C]" />
              <input
                type="email"
                id="patient-email-input"
                placeholder="patient@example.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                onBlur={() => handleBlur('email')}
                className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm text-[#1C231F] focus:outline-none transition-colors ${
                  errors.email
                    ? 'border-red-400 bg-red-50/50 focus:border-red-500'
                    : 'border-[#C4CFC0] bg-white focus:border-[#5F6F65]'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.email}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] block mb-1">
              Phone Number (SMS Reminders) *
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 h-4 w-4 text-[#808D7C]" />
              <input
                type="tel"
                id="patient-phone-input"
                placeholder="01712-345678 or +880 1812-345678"
                value={formData.phone}
                onChange={handlePhoneChange}
                onBlur={() => handleBlur('phone')}
                maxLength={18}
                className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm text-[#1C231F] focus:outline-none transition-colors ${
                  errors.phone
                    ? 'border-red-400 bg-red-50/50 focus:border-red-500'
                    : 'border-[#C4CFC0] bg-white focus:border-[#5F6F65]'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.phone}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65]">
                Date of Birth *
              </label>
              {age !== null && (
                <span className="text-[11px] font-semibold text-[#5F6F65] bg-[#E7EFE3] px-2 py-0.5 rounded-full">
                  Age: {age} yrs {isMinor && '· Minor'}
                </span>
              )}
            </div>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-[#808D7C]" />
              <input
                type="date"
                id="patient-dob-input"
                max={new Date().toISOString().split('T')[0]}
                value={formData.dateOfBirth}
                onChange={(e) => {
                  setFormData({ ...formData, dateOfBirth: e.target.value });
                  if (errors.dateOfBirth) setErrors({ ...errors, dateOfBirth: '' });
                }}
                className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm text-[#1C231F] focus:outline-none transition-colors ${
                  errors.dateOfBirth
                    ? 'border-red-400 bg-red-50/50 focus:border-red-500'
                    : 'border-[#C4CFC0] bg-white focus:border-[#5F6F65]'
                }`}
              />
            </div>
            {errors.dateOfBirth && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.dateOfBirth}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] block mb-1">
              Gender Identity
            </label>
            <select
              id="patient-gender-select"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value as Gender })
              }
              className="w-full rounded-xl border border-[#C4CFC0] bg-white px-3.5 py-2.5 text-sm text-[#1C231F] focus:border-[#5F6F65] focus:outline-none cursor-pointer"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-Binary</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>

        {/* Minor Patient Notice (if under 18) */}
        {isMinor && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              <span>Minor Patient Consent & Guardian Contact Required</span>
            </div>
            <p className="text-[11px] text-amber-700">
              Because this patient is under 18, medical regulations require authorized parent or legal guardian details.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-bold uppercase text-amber-900 block mb-1">
                  Parent / Legal Guardian Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Robert Vance"
                  value={formData.guardianName || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, guardianName: e.target.value });
                    if (errors.guardianName) setErrors({ ...errors, guardianName: '' });
                  }}
                  className={`w-full rounded-xl border px-3 py-2 text-xs bg-white text-[#1C231F] focus:outline-none ${
                    errors.guardianName ? 'border-red-400' : 'border-amber-300'
                  }`}
                />
                {errors.guardianName && (
                  <p className="text-[10px] text-red-600 mt-1">{errors.guardianName}</p>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-amber-900 block mb-1">
                  Guardian Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="(555) 000-0000"
                  value={formData.guardianPhone || ''}
                  onChange={handleGuardianPhoneChange}
                  maxLength={14}
                  className={`w-full rounded-xl border px-3 py-2 text-xs bg-white text-[#1C231F] focus:outline-none ${
                    errors.guardianPhone ? 'border-red-400' : 'border-amber-300'
                  }`}
                />
                {errors.guardianPhone && (
                  <p className="text-[10px] text-red-600 mt-1">{errors.guardianPhone}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* First time patient toggle */}
        <div className="pt-3 border-t border-[#E2E8DF] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#1C231F]">
              Are you a new patient for this healthcare provider?
            </span>
            <p className="text-[11px] text-[#5F6F65]">
              New patients will receive a brief digital medical questionnaire link prior to the appointment.
            </p>
          </div>
          <button
            type="button"
            id="first-time-patient-toggle"
            onClick={() => setIsFirstTimePatient(!isFirstTimePatient)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isFirstTimePatient ? 'bg-[#5F6F65]' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                isFirstTimePatient ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. Medical Concern & Visit Reason */}
      <div className="rounded-3xl border border-[#C4CFC0] bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="pb-4 border-b border-[#E2E8DF]">
          <h3 className="font-serif text-xl font-bold text-[#1C231F]">
            Reason for Consultation & Symptoms
          </h3>
          <p className="text-xs text-[#5F6F65] mt-0.5">
            Helps your doctor prepare appropriate diagnostics, chart reviews, and clinical materials.
          </p>
        </div>

        {/* Quick presets */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] block mb-2">
            Select a common visit topic (or type below)
          </label>
          <div className="flex flex-wrap gap-2">
            {COMMON_REASONS.map((reason) => (
              <button
                key={reason}
                type="button"
                onClick={() => handleReasonPresetClick(reason)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors text-left cursor-pointer ${
                  formData.reasonForVisit === reason
                    ? 'border-[#5F6F65] bg-[#5F6F65] text-white shadow-xs'
                    : 'border-[#C4CFC0] bg-[#F8FAF7] text-[#2B352F] hover:bg-[#E7EFE3]'
                }`}
              >
                {reason}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea Reason */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65]">
              Primary Concern / Symptoms Description *
            </label>
            <span className="text-[11px] text-[#808D7C]">
              {formData.reasonForVisit.length} / 500 characters
            </span>
          </div>
          <textarea
            id="patient-reason-input"
            rows={3}
            required
            maxLength={500}
            placeholder="Please briefly describe your symptoms, duration, or specific questions you'd like addressed..."
            value={formData.reasonForVisit}
            onChange={(e) => {
              setFormData({ ...formData, reasonForVisit: e.target.value });
              if (errors.reasonForVisit) setErrors({ ...errors, reasonForVisit: '' });
            }}
            className={`w-full rounded-xl border p-3.5 text-sm text-[#1C231F] focus:outline-none transition-colors ${
              errors.reasonForVisit
                ? 'border-red-400 bg-red-50/50 focus:border-red-500'
                : 'border-[#C4CFC0] bg-white focus:border-[#5F6F65]'
            }`}
          />
          {errors.reasonForVisit && (
            <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.reasonForVisit}
            </p>
          )}
        </div>

        {/* Medical Notes / Allergies (Optional) */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] block mb-1">
            Known Allergies or Current Medications (Optional)
          </label>
          <input
            type="text"
            id="patient-allergies-input"
            placeholder="e.g. Penicillin allergy, Lisinopril 10mg daily"
            value={formData.additionalNotes || ''}
            onChange={(e) =>
              setFormData({ ...formData, additionalNotes: e.target.value })
            }
            className="w-full rounded-xl border border-[#C4CFC0] bg-white px-3.5 py-2.5 text-sm text-[#1C231F] focus:border-[#5F6F65] focus:outline-none"
          />
        </div>
      </div>

      {/* 3. Insurance & Payment Info */}
      <div className="rounded-3xl border border-[#C4CFC0] bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="pb-4 border-b border-[#E2E8DF]">
          <h3 className="font-serif text-xl font-bold text-[#1C231F]">
            Insurance & Coverage Verification
          </h3>
          <p className="text-xs text-[#5F6F65] mt-0.5">
            Your provider accepts in-network commercial insurance plans and direct self-pay.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] block mb-1">
              Primary Health Insurance Plan
            </label>
            <div className="relative">
              <Shield className="absolute left-3.5 top-3 h-4 w-4 text-[#808D7C]" />
              <select
                id="patient-insurance-select"
                value={formData.insuranceProvider || 'Self-Pay / No Insurance'}
                onChange={(e) =>
                  setFormData({ ...formData, insuranceProvider: e.target.value })
                }
                className="w-full rounded-xl border border-[#C4CFC0] bg-white pl-10 pr-4 py-2.5 text-sm text-[#1C231F] focus:border-[#5F6F65] focus:outline-none cursor-pointer"
              >
                {INSURANCE_PROVIDERS.map((ins) => (
                  <option key={ins} value={ins}>
                    {ins}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] block mb-1">
              Insurance Member ID / Policy # (Optional)
            </label>
            <input
              type="text"
              id="patient-memberid-input"
              placeholder="e.g. BCB-893049102"
              value={formData.insuranceMemberId || ''}
              onChange={(e) =>
                setFormData({ ...formData, insuranceMemberId: e.target.value })
              }
              className="w-full rounded-xl border border-[#C4CFC0] bg-white px-3.5 py-2.5 text-sm text-[#1C231F] focus:border-[#5F6F65] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] block mb-1">
              Group Number (Optional)
            </label>
            <input
              type="text"
              id="patient-groupnum-input"
              placeholder="e.g. GRP-48201"
              value={formData.insuranceGroupNumber || ''}
              onChange={(e) =>
                setFormData({ ...formData, insuranceGroupNumber: e.target.value })
              }
              className="w-full rounded-xl border border-[#C4CFC0] bg-white px-3.5 py-2.5 text-sm text-[#1C231F] focus:border-[#5F6F65] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl border border-dashed border-[#C4CFC0] bg-[#F8FAF7] text-xs text-[#5F6F65]">
            <Info className="h-4 w-4 text-[#5F6F65] shrink-0" />
            <span>
              Copay will be verified at check-in. You may also present physical cards upon clinic arrival.
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          id="back-to-step1-btn"
          variant="outline"
          size="lg"
          onClick={onBack}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Date & Time
        </Button>

        <Button
          type="submit"
          id="continue-to-step3-btn"
          variant="primary"
          size="lg"
          rightIcon={<ChevronRight className="h-4 w-4" />}
          className="font-bold text-sm shadow-md"
        >
          Review & Payment
        </Button>
      </div>
    </form>
  );
}
