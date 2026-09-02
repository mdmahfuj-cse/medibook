import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Droplets,
  Sun,
  Moon,
  Apple,
  Footprints,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Play,
  Pause,
  CheckCircle2,
  Smile,
  ShieldAlert,
  Glasses,
  Baby,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useUIStore } from '../../stores/useUIStore';

export interface HealthTip {
  id: string;
  title: string;
  simpleAdvice: string;
  targetGroup: 'All Ages' | 'Children & Kids' | 'Seniors & Elders' | 'Daily Habit';
  categoryBadge: string;
  badgeColor: string;
  bgGradient: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
  illustrationType: 'water' | 'walk' | 'sleep' | 'fruit' | 'screen' | 'sunshine';
  keyBenefit: string;
  actionText?: string;
  actionRoute?: { path: string; query?: Record<string, string> };
}

export const HEALTH_TIPS: HealthTip[] = [
  {
    id: 'tip-water',
    title: 'Drink 6 to 8 Glasses of Fresh Water',
    simpleAdvice: 'Water gives you energy, keeps skin glowing, and helps your kidneys stay clean every day.',
    targetGroup: 'All Ages',
    categoryBadge: 'Hydration Power',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    bgGradient: 'from-blue-50/90 via-sky-50/50 to-white',
    borderColor: 'border-blue-200',
    iconBg: 'bg-blue-600',
    iconColor: 'text-white',
    illustrationType: 'water',
    keyBenefit: 'Boosts brain focus and smooth digestion.',
    actionText: 'Book Kidney / Health Check',
    actionRoute: { path: '/lab-tests' },
  },
  {
    id: 'tip-walk',
    title: 'A 20-Minute Daily Walk Keeps Hearts Young',
    simpleAdvice: 'Walking lightly around the park or home strengthens bones, lowers blood pressure, and lifts your mood.',
    targetGroup: 'Seniors & Elders',
    categoryBadge: 'Heart & Bones',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    bgGradient: 'from-emerald-50/90 via-teal-50/50 to-white',
    borderColor: 'border-emerald-200',
    iconBg: 'bg-emerald-700',
    iconColor: 'text-white',
    illustrationType: 'walk',
    keyBenefit: 'Gentle on joints, great for steady blood pressure.',
    actionText: 'Find Cardiologist',
    actionRoute: { path: '/search', query: { specialty: 'Cardiologist' } },
  },
  {
    id: 'tip-fruit',
    title: 'Eat 1 Colorful Fruit or Veggie With Every Meal',
    simpleAdvice: 'Bright fruits like papayas, apples, oranges, and greens build strong natural shields against illness.',
    targetGroup: 'Children & Kids',
    categoryBadge: 'Strong Immunity',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
    bgGradient: 'from-amber-50/90 via-orange-50/40 to-white',
    borderColor: 'border-amber-200',
    iconBg: 'bg-amber-600',
    iconColor: 'text-white',
    illustrationType: 'fruit',
    keyBenefit: 'Natural vitamins for sharp eyesight and growth.',
    actionText: 'Consult Pediatrician',
    actionRoute: { path: '/search', query: { specialty: 'Pediatrician' } },
  },
  {
    id: 'tip-sleep',
    title: 'Sleep 7–8 Hours in a Dark & Quiet Room',
    simpleAdvice: 'Good sleep heals your body, repairs tired muscles, and wakes you up smiling and refreshed.',
    targetGroup: 'All Ages',
    categoryBadge: 'Restful Sleep',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    bgGradient: 'from-indigo-50/90 via-purple-50/40 to-white',
    borderColor: 'border-indigo-200',
    iconBg: 'bg-indigo-600',
    iconColor: 'text-white',
    illustrationType: 'sleep',
    keyBenefit: 'Lowers stress hormones and improves memory.',
    actionText: 'Find General Physician',
    actionRoute: { path: '/search', query: { specialty: 'General Physician' } },
  },
  {
    id: 'tip-screen',
    title: '20-20-20 Rule for Mobile & Computer Eyes',
    simpleAdvice: 'Every 20 minutes, look at something 20 feet away for 20 seconds. It prevents headaches and eye tiredness.',
    targetGroup: 'Children & Kids',
    categoryBadge: 'Happy Eyes',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    bgGradient: 'from-purple-50/90 via-pink-50/40 to-white',
    borderColor: 'border-purple-200',
    iconBg: 'bg-purple-600',
    iconColor: 'text-white',
    illustrationType: 'screen',
    keyBenefit: 'Prevents dry eyes and digital strain.',
    actionText: 'Find Eye Specialist',
    actionRoute: { path: '/search', query: { specialty: 'Ophthalmologist' } },
  },
  {
    id: 'tip-sunshine',
    title: '15 Minutes of Morning Sunlight for Vitamin D',
    simpleAdvice: 'Morning gentle sun helps your body absorb calcium for unbreakable bones and healthy teeth.',
    targetGroup: 'Seniors & Elders',
    categoryBadge: 'Bone Strength',
    badgeColor: 'bg-yellow-100 text-yellow-900 border-yellow-200',
    bgGradient: 'from-yellow-50/90 via-amber-50/40 to-white',
    borderColor: 'border-yellow-200',
    iconBg: 'bg-yellow-600',
    iconColor: 'text-white',
    illustrationType: 'sunshine',
    keyBenefit: 'Natural immunity and strong bone density.',
    actionText: 'Book Vitamin D Test',
    actionRoute: { path: '/lab-tests' },
  },
];

export function HealthTipsCarousel() {
  const { navigate } = useUIStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Kids' | 'Seniors' | 'All Ages'>('All');

  // Filter tips if user selected specific category
  const filteredTips = React.useMemo(() => {
    if (activeFilter === 'Kids') {
      return HEALTH_TIPS.filter((t) => t.targetGroup === 'Children & Kids');
    }
    if (activeFilter === 'Seniors') {
      return HEALTH_TIPS.filter((t) => t.targetGroup === 'Seniors & Elders');
    }
    if (activeFilter === 'All Ages') {
      return HEALTH_TIPS.filter((t) => t.targetGroup === 'All Ages');
    }
    return HEALTH_TIPS;
  }, [activeFilter]);

  // Ensure index in bounds
  const safeIndex = currentIndex >= filteredTips.length ? 0 : currentIndex;
  const currentTip = filteredTips[safeIndex] || HEALTH_TIPS[0];

  // Auto rotate carousel
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredTips.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPlaying, filteredTips.length]);

  // Audio Read Aloud feature (Great for children and elders)
  const handleReadAloud = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = `${currentTip.title}. ${currentTip.simpleAdvice}. Why it matters: ${currentTip.keyBenefit}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.92; // Slightly slower for elderly / kids
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Stop speech when changing slide
  const goToSlide = (index: number) => {
    if (isSpeaking && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setCurrentIndex(index);
  };

  const handleNext = () => {
    goToSlide((safeIndex + 1) % filteredTips.length);
  };

  const handlePrev = () => {
    goToSlide((safeIndex - 1 + filteredTips.length) % filteredTips.length);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Daily Health Tips">
      <div className="rounded-3xl border border-[#C4CFC0] bg-white p-5 sm:p-7 shadow-xs">
        
        {/* Header with Title & Filter Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E2E8DF]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E7EFE3] text-[#5F6F65] shadow-2xs">
              <Smile className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#1C231F] tracking-tight">
                  Easy Daily Health Tips
                </h3>
                <span className="inline-flex items-center rounded-full bg-[#E7EFE3] px-2 py-0.5 text-xs font-bold text-[#2B352F]">
                  For All Ages
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#5F6F65] mt-0.5">
                Simple habits to stay healthy, energetic, and happy every day.
              </p>
            </div>
          </div>

          {/* Category Filter Pills (Kids, Seniors, All) */}
          <div className="flex items-center flex-wrap gap-1.5 bg-[#F8FAF7] p-1.5 rounded-2xl border border-[#E2E8DF]">
            {(['All', 'All Ages', 'Kids', 'Seniors'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => {
                  setActiveFilter(filter);
                  goToSlide(0);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-[#5F6F65] text-white shadow-xs'
                    : 'text-[#5F6F65] hover:bg-[#EAEFE6] hover:text-[#1C231F]'
                }`}
              >
                {filter === 'Kids' ? 'For Children' : filter === 'Seniors' ? 'For Elders' : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel Content Card */}
        <div className="relative mt-5 overflow-hidden rounded-2xl border bg-gradient-to-r transition-all duration-300">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTip.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={`p-6 sm:p-8 rounded-2xl border ${currentTip.borderColor} bg-gradient-to-br ${currentTip.bgGradient}`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Left Illustration / Big Visual Card */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-white/80 border border-white/80 shadow-xs backdrop-blur-xs">
                  {/* Visual SVG Graphic / Icon */}
                  <div className={`h-20 w-20 sm:h-24 sm:w-24 rounded-3xl ${currentTip.iconBg} ${currentTip.iconColor} flex items-center justify-center shadow-md mb-3 transition-transform hover:scale-105`}>
                    {currentTip.illustrationType === 'water' && <Droplets className="h-10 w-10 sm:h-12 sm:w-12 animate-pulse" />}
                    {currentTip.illustrationType === 'walk' && <Footprints className="h-10 w-10 sm:h-12 sm:w-12" />}
                    {currentTip.illustrationType === 'fruit' && <Apple className="h-10 w-10 sm:h-12 sm:w-12" />}
                    {currentTip.illustrationType === 'sleep' && <Moon className="h-10 w-10 sm:h-12 sm:w-12" />}
                    {currentTip.illustrationType === 'screen' && <Glasses className="h-10 w-10 sm:h-12 sm:w-12" />}
                    {currentTip.illustrationType === 'sunshine' && <Sun className="h-10 w-10 sm:h-12 sm:w-12 animate-spin-slow" />}
                  </div>

                  <span className={`rounded-full px-3 py-1 text-xs font-extrabold border ${currentTip.badgeColor} mb-1`}>
                    {currentTip.categoryBadge}
                  </span>
                  <span className="text-[11px] font-bold text-[#808D7C]">
                    Recommended for: <strong className="text-[#1C231F]">{currentTip.targetGroup}</strong>
                  </span>
                </div>

                {/* Right: Large, Easy-to-Read Text & Actions */}
                <div className="lg:col-span-8 space-y-3.5">
                  
                  {/* Audio Listen Button for Accessibility */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5F6F65]">
                      Tip {safeIndex + 1} of {filteredTips.length}
                    </span>
                    
                    {'speechSynthesis' in window && (
                      <button
                        type="button"
                        onClick={handleReadAloud}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                          isSpeaking
                            ? 'bg-red-600 text-white shadow-xs animate-pulse'
                            : 'bg-white text-[#1C231F] border border-[#C4CFC0] hover:bg-[#F0F4ED]'
                        }`}
                        title="Read this health tip aloud for you"
                      >
                        {isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-[#5F6F65]" />}
                        <span>{isSpeaking ? 'Stop Reading' : 'Listen (Read Aloud)'}</span>
                      </button>
                    )}
                  </div>

                  {/* Big Headline */}
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-[#1C231F] leading-snug tracking-tight">
                    {currentTip.title}
                  </h4>

                  {/* Simple Explanation with large, easy-to-read font */}
                  <p className="text-base sm:text-lg text-[#2B352F] leading-relaxed font-medium">
                    {currentTip.simpleAdvice}
                  </p>

                  {/* Why It Matters Box */}
                  <div className="flex items-center gap-2.5 rounded-xl bg-white/90 p-3 border border-[#C4CFC0]/60">
                    <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-[#1C231F]">
                      <span className="text-[#5F6F65]">Why it helps:</span> {currentTip.keyBenefit}
                    </span>
                  </div>

                  {/* Action Link / Doctor Booking Button */}
                  {currentTip.actionText && currentTip.actionRoute && (
                    <div className="pt-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => navigate(currentTip.actionRoute!)}
                        rightIcon={<ArrowRight className="h-4 w-4" />}
                        className="text-xs sm:text-sm font-bold shadow-xs"
                      >
                        {currentTip.actionText}
                      </Button>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Bottom Controls: Previous / Next & Indicator Dots */}
        <div className="flex items-center justify-between pt-4 mt-1">
          {/* Pause / Play Toggle */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#5F6F65] hover:text-[#1C231F] cursor-pointer bg-[#F0F4ED] px-2.5 py-1.5 rounded-xl"
            title={isPlaying ? 'Pause Auto-Play' : 'Resume Auto-Play'}
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{isPlaying ? 'Auto-playing' : 'Paused'}</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {filteredTips.map((tip, idx) => (
              <button
                key={tip.id}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  safeIndex === idx
                    ? 'w-7 bg-[#5F6F65]'
                    : 'w-2.5 bg-[#C4CFC0] hover:bg-[#808D7C]'
                }`}
              />
            ))}
          </div>

          {/* Prev / Next Big Touch Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="health-tip-prev-btn"
              onClick={handlePrev}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#C4CFC0] bg-white text-[#1C231F] hover:bg-[#F0F4ED] active:scale-95 transition-all cursor-pointer shadow-2xs"
              aria-label="Previous tip"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              id="health-tip-next-btn"
              onClick={handleNext}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#C4CFC0] bg-white text-[#1C231F] hover:bg-[#F0F4ED] active:scale-95 transition-all cursor-pointer shadow-2xs"
              aria-label="Next tip"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
