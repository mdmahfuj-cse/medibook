import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  Clock,
  ThumbsUp,
  MessageSquarePlus,
  X,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Doctor, DoctorReview } from '../../types';
import { MOCK_REVIEWS } from '../../data/mockDoctors';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useUIStore } from '../../stores/useUIStore';

interface ReviewsSectionProps {
  doctor: Doctor;
}

export function ReviewsSection({ doctor }: ReviewsSectionProps) {
  const { addToast } = useUIStore();

  // Local reviews state initialized with mock reviews
  const [reviews, setReviews] = useState<DoctorReview[]>([
    ...MOCK_REVIEWS,
    {
      id: `rev-${doctor.id}-custom-1`,
      doctorId: doctor.id,
      author: 'Eleanor Vance',
      rating: 5,
      date: '5 days ago',
      title: 'Attentive and compassionate specialist',
      comment: `${doctor.name} was incredibly thorough during my consultation. Took the time to review my full medical history and answered all questions with patience.`,
      verifiedPatient: true,
      waitDurationMinutes: 6,
    },
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [authorName, setAuthorName] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [waitMinutes, setWaitMinutes] = useState(5);

  // Rating Distribution Calculation
  const totalReviews = reviews.length;
  const fiveStars = reviews.filter((r) => r.rating === 5).length;
  const fourStars = reviews.filter((r) => r.rating === 4).length;
  const threeStars = reviews.filter((r) => r.rating === 3).length;
  const twoStars = reviews.filter((r) => r.rating === 2).length;
  const oneStar = reviews.filter((r) => r.rating === 1).length;

  const getPercent = (count: number) =>
    totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

  const avgWaitTime = Math.round(
    reviews.reduce((acc, r) => acc + (r.waitDurationMinutes || 6), 0) / (totalReviews || 1)
  );

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewComment.trim()) {
      addToast({
        type: 'error',
        title: 'Missing Fields',
        message: 'Please provide your name and review comments.',
      });
      return;
    }

    const newReview: DoctorReview = {
      id: `rev-${Date.now()}`,
      doctorId: doctor.id,
      author: authorName.trim(),
      title: reviewTitle.trim() || 'Verified Patient Review',
      rating: newRating,
      date: 'Just now',
      comment: reviewComment.trim(),
      verifiedPatient: true,
      waitDurationMinutes: Number(waitMinutes) || 5,
    };

    setReviews([newReview, ...reviews]);
    setIsModalOpen(false);
    setAuthorName('');
    setReviewTitle('');
    setReviewComment('');
    setNewRating(5);

    addToast({
      type: 'success',
      title: 'Review Published',
      message: 'Thank you! Your verified patient review has been posted.',
    });
  };

  return (
    <div className="rounded-3xl border border-[#C4CFC0] bg-white p-6 sm:p-8 shadow-xs space-y-8">
      {/* Header & Write Review CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8DF]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-bold text-[#1C231F]">
              Patient Reviews & Ratings
            </h2>
            <Badge variant="sage" size="sm">
              {totalReviews} Verified Reviews
            </Badge>
          </div>
          <p className="text-xs text-[#5F6F65] mt-1">
            All reviews are from verified patients who booked through MediBook.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<MessageSquarePlus className="h-4 w-4" />}
          className="font-semibold shadow-xs"
        >
          Write a Review
        </Button>
      </div>

      {/* Aggregate Score & Distribution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#F8FAF7] rounded-2xl p-5 sm:p-6 border border-[#E2E8DF]">
        {/* Big Rating Score */}
        <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-[#E2E8DF] pb-5 md:pb-0 md:pr-6">
          <div className="font-serif text-5xl font-bold text-[#1C231F]">
            {doctor.rating.toFixed(2)}
          </div>
          <div className="flex items-center justify-center md:justify-start gap-1 my-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-xs text-[#5F6F65]">
            Based on <strong className="text-[#1C231F]">{totalReviews}</strong> verified patient encounters
          </p>

          <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-[#5F6F65] border border-[#E2E8DF]">
              <Clock className="h-3 w-3 text-[#9CA986]" />
              ~{avgWaitTime} min clinic wait
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-[#5F6F65] border border-[#E2E8DF]">
              <ThumbsUp className="h-3 w-3 text-[#9CA986]" />
              99% Recommend
            </span>
          </div>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="md:col-span-8 space-y-2">
          {[
            { stars: 5, count: fiveStars, pct: getPercent(fiveStars) },
            { stars: 4, count: fourStars, pct: getPercent(fourStars) },
            { stars: 3, count: threeStars, pct: getPercent(threeStars) },
            { stars: 2, count: twoStars, pct: getPercent(twoStars) },
            { stars: 1, count: oneStar, pct: getPercent(oneStar) },
          ].map((bar) => (
            <div key={bar.stars} className="flex items-center gap-3 text-xs">
              <span className="w-12 text-right font-medium text-[#1C231F] flex items-center justify-end gap-1">
                {bar.stars} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              </span>

              <div className="flex-1 h-2 rounded-full bg-[#E2E8DF] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#5F6F65] transition-all duration-500"
                  style={{ width: `${bar.pct}%` }}
                />
              </div>

              <span className="w-8 text-[#808D7C] text-right font-mono text-[11px]">
                {bar.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="rounded-2xl border border-[#E2E8DF] bg-white p-5 sm:p-6 space-y-3 hover:border-[#9CA986] transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < rev.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                {rev.title && (
                  <h4 className="text-sm font-bold text-[#1C231F] ml-1">{rev.title}</h4>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-[#808D7C]">
                {rev.waitDurationMinutes && (
                  <span className="rounded-md bg-[#F0F4ED] px-2 py-0.5 text-[10px] font-semibold text-[#5F6F65]">
                    {rev.waitDurationMinutes} min wait
                  </span>
                )}
                <span>{rev.date}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#2B352F] leading-relaxed">
              "{rev.comment}"
            </p>

            <div className="pt-2 border-t border-[#E2E8DF]/60 flex items-center justify-between text-xs text-[#808D7C]">
              <span className="font-semibold text-[#1C231F]">{rev.author}</span>
              {rev.verifiedPatient && (
                <span className="flex items-center gap-1 text-[#5F6F65] font-medium text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#5F6F65]" />
                  Verified Patient Appointment
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* WRITE A REVIEW MODAL */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-[#C4CFC0] bg-white p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8DF]">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1C231F]">
                  Write a Patient Review
                </h3>
                <p className="text-xs text-[#5F6F65] mt-0.5">
                  Sharing your experience with {doctor.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-[#808D7C] hover:bg-[#F0F4ED]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="mt-5 space-y-4">
              {/* Star Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] block mb-1.5">
                  Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`h-7 w-7 ${
                          star <= newRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-[#1C231F]">
                    {newRating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] block mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full rounded-xl border border-[#C4CFC0] bg-white px-3.5 py-2.5 text-sm text-[#1C231F] focus:border-[#5F6F65] focus:outline-none focus:ring-1 focus:ring-[#5F6F65]"
                />
              </div>

              {/* Headline / Title */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] block mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Excellent care, very clear explanations"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#C4CFC0] bg-white px-3.5 py-2.5 text-sm text-[#1C231F] focus:border-[#5F6F65] focus:outline-none focus:ring-1 focus:ring-[#5F6F65]"
                />
              </div>

              {/* Wait Duration */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] block mb-1">
                  Clinic Wait Time (Minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={waitMinutes}
                  onChange={(e) => setWaitMinutes(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#C4CFC0] bg-white px-3.5 py-2.5 text-sm text-[#1C231F] focus:border-[#5F6F65] focus:outline-none focus:ring-1 focus:ring-[#5F6F65]"
                />
              </div>

              {/* Comments */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#5F6F65] block mb-1">
                  Your Detailed Review
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your visit, bedside manner, clinic cleanliness, and whether you felt heard..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full rounded-xl border border-[#C4CFC0] bg-white px-3.5 py-2.5 text-sm text-[#1C231F] focus:border-[#5F6F65] focus:outline-none focus:ring-1 focus:ring-[#5F6F65]"
                />
              </div>

              <div className="pt-3 border-t border-[#E2E8DF] flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" className="font-semibold">
                  Submit Verified Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
