import React from 'react';
import { Check, Calendar, User, CreditCard, CheckCircle2 } from 'lucide-react';
import { BookingStep } from '../../stores/useBookingStore';

interface BookingStepperProps {
  currentStep: BookingStep;
  onStepClick?: (step: BookingStep) => void;
}

interface StepConfig {
  step: BookingStep;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepConfig[] = [
  {
    step: 1,
    label: 'Date & Time',
    sublabel: 'Select slot & modality',
    icon: Calendar,
  },
  {
    step: 2,
    label: 'Patient Info',
    sublabel: 'Intake & details',
    icon: User,
  },
  {
    step: 3,
    label: 'Review & Pay',
    sublabel: 'Pricing & terms',
    icon: CreditCard,
  },
  {
    step: 4,
    label: 'Confirmation',
    sublabel: 'Pass & receipt',
    icon: CheckCircle2,
  },
];

export function BookingStepper({ currentStep, onStepClick }: BookingStepperProps) {
  return (
    <div className="w-full rounded-3xl border border-[#C4CFC0] bg-white p-4 sm:p-6 shadow-xs">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 relative">
        {STEPS.map((item, idx) => {
          const isCompleted = currentStep > item.step;
          const isCurrent = currentStep === item.step;
          const isUpcoming = currentStep < item.step;
          const Icon = item.icon;
          const isClickable = isCompleted && onStepClick;

          return (
            <div
              key={item.step}
              onClick={() => isClickable && onStepClick(item.step)}
              className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl border transition-all ${
                isCurrent
                  ? 'border-[#5F6F65] bg-[#F0F4ED] shadow-xs'
                  : isCompleted
                  ? 'border-[#C4CFC0] bg-white hover:bg-[#F8FAF7] cursor-pointer'
                  : 'border-transparent bg-gray-50/60 opacity-60'
              }`}
            >
              {/* Step indicator circle */}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs transition-colors ${
                  isCompleted
                    ? 'bg-[#5F6F65] text-white'
                    : isCurrent
                    ? 'bg-[#5F6F65] text-white ring-4 ring-[#E7EFE3]'
                    : 'bg-[#E2E8DF] text-[#808D7C]'
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : item.step}
              </div>

              {/* Step Labels */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-bold truncate ${
                      isCurrent
                        ? 'text-[#1C231F]'
                        : isCompleted
                        ? 'text-[#2B352F]'
                        : 'text-[#808D7C]'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                <p className="text-[11px] text-[#808D7C] truncate hidden sm:block">
                  {item.sublabel}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
