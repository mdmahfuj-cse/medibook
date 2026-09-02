import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  CheckCircle2,
  ThumbsUp,
  Clock,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useUIStore } from '../../stores/useUIStore';

interface DoctorReviewModalProps {
  doctorId: string;
  doctorName: string;
  doctorAvatar: string;
  specialty: string;
  onClose: () => void;
  onSubmitted?: () => void;
}

const REVIEW_TAGS = [
  'Punctual & On Time',
  'Thorough Explanation',
  'Polite Bedside Manner',
  'Accurate Diagnosis',
  'Clear Prescription Advice',
  'No Unnecessary Tests',
  'Comfortable Clinic Environment',
  'Listens Empathetically',
];

export function DoctorReviewModal({
  doctorId,
  doctorName,
  doctorAvatar,
  specialty,
  onClose,
  onSubmitted,
}: DoctorReviewModalProps) {
  const { addToast } = useUIStore();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [waitTimeRating, setWaitTimeRating] = useState<'< 10 mins' | '10-20 mins' | '20-30 mins' | '30+ mins'>('< 10 mins');
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Thorough Explanation',
    'Clear Prescription Advice',
  ]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      addToast({
        type: 'success',
        title: 'Review Published!',
        message: `Thank you! Your verified rating for ${doctorName} has been recorded.`,
      });
      if (onSubmitted) onSubmitted();
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-[#C4CFC0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8DF] bg-[#F8FAF7] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5F6F65] text-white">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-sans text-base font-bold text-[#1C231F]">
                Rate Your Consultation
              </h2>
              <p className="text-xs text-[#5F6F65]">
                Verified Patient Feedback • Helps other patients find care
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#808D7C] hover:bg-[#E2E8DF] hover:text-[#1C231F] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Doctor Summary */}
        <div className="bg-[#F0F4ED]/60 border-b border-[#E2E8DF] px-6 py-4 flex items-center gap-3.5">
          <img
            src={doctorAvatar}
            alt={doctorName}
            referrerPolicy="no-referrer"
            className="h-12 w-12 rounded-xl object-cover border border-[#E2E8DF]"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-[#1C231F]">{doctorName}</h3>
              <ShieldCheck className="h-4 w-4 text-[#5F6F65]" />
            </div>
            <p className="text-xs text-[#5F6F65]">{specialty} Specialist</p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Star Rating */}
          <div className="text-center space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#808D7C]">
              Overall Clinical Experience
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-[#C4CFC0]'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-xs font-semibold text-[#5F6F65]">
              {rating === 5 && 'Outstanding • Highly Recommend'}
              {rating === 4 && 'Very Good • Satisfied'}
              {rating === 3 && 'Average • Met Expectations'}
              {rating === 2 && 'Below Expectations'}
              {rating === 1 && 'Unsatisfactory'}
            </div>
          </div>

          {/* Wait Duration */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#808D7C] flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#5F6F65]" />
              How long was your clinic waiting time?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['< 10 mins', '10-20 mins', '20-30 mins', '30+ mins'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setWaitTimeRating(opt)}
                  className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                    waitTimeRating === opt
                      ? 'border-[#5F6F65] bg-[#F0F4ED] text-[#1C231F] font-bold ring-1 ring-[#5F6F65]'
                      : 'border-[#E2E8DF] bg-white text-[#5F6F65] hover:bg-[#F8FAF7]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Positive Attributes Tags */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#808D7C] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#5F6F65]" />
              Highlight Key Doctor Qualities
            </label>
            <div className="flex flex-wrap gap-2">
              {REVIEW_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#5F6F65] bg-[#5F6F65] text-white shadow-2xs'
                        : 'border-[#C4CFC0] bg-white text-[#2B352F] hover:bg-[#F0F4ED]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Written Feedback */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#808D7C] flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-[#5F6F65]" />
              Write your Review & Comments (Optional)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details about the doctor's communication, diagnosis accuracy, or clinic staff..."
              className="w-full rounded-xl border border-[#C4CFC0] p-3 text-xs text-[#1C231F] focus:border-[#5F6F65] focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8DF]">
            <Button variant="outline" size="sm" type="button" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={isSubmitting}
              className="text-xs px-6"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Verified Review'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
