import React, { useState } from 'react';
import {
  Sun,
  Sunset,
  Moon,
  CheckCircle2,
  Circle,
  Pill,
  Clock,
  Sparkles,
  Calendar,
  AlertCircle,
  Bell,
  Heart,
} from 'lucide-react';
import { usePrescriptionStore } from '../../stores/usePrescriptionStore';
import { useUIStore } from '../../stores/useUIStore';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function MedicationScheduleTracker() {
  const { prescriptions, isMedicineTaken, toggleMedicineIntake } = usePrescriptionStore();
  const { addToast } = useUIStore();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // Group all medicines from active prescriptions into slots
  const morningMeds: { rxId: string; medIdx: number; name: string; dosage: string; instructions: string; doctorName: string }[] = [];
  const afternoonMeds: { rxId: string; medIdx: number; name: string; dosage: string; instructions: string; doctorName: string }[] = [];
  const nightMeds: { rxId: string; medIdx: number; name: string; dosage: string; instructions: string; doctorName: string }[] = [];

  prescriptions.forEach((rx) => {
    rx.medicines.forEach((med, idx) => {
      const freqLower = med.frequency.toLowerCase();
      // Heuristic parsing for Bangladesh standard 1+0+1 notation
      if (freqLower.includes('1 +') || freqLower.includes('morning') || freqLower.includes('breakfast') || freqLower.includes('twice daily') || freqLower.includes('three times')) {
        morningMeds.push({ rxId: rx.id, medIdx: idx, name: med.name, dosage: med.dosage, instructions: med.instructions, doctorName: rx.doctorName });
      }
      if (freqLower.includes('+ 1 +') || freqLower.includes('afternoon') || freqLower.includes('lunch') || freqLower.includes('three times')) {
        afternoonMeds.push({ rxId: rx.id, medIdx: idx, name: med.name, dosage: med.dosage, instructions: med.instructions, doctorName: rx.doctorName });
      }
      if (freqLower.includes('+ 1') || freqLower.includes('night') || freqLower.includes('dinner') || freqLower.includes('bedtime') || freqLower.includes('twice daily') || freqLower.includes('three times')) {
        nightMeds.push({ rxId: rx.id, medIdx: idx, name: med.name, dosage: med.dosage, instructions: med.instructions, doctorName: rx.doctorName });
      }
    });
  });

  const totalDosesCount = morningMeds.length + afternoonMeds.length + nightMeds.length;

  let takenDosesCount = 0;
  morningMeds.forEach((m) => {
    if (isMedicineTaken(selectedDate, m.rxId, m.medIdx, 'morning')) takenDosesCount++;
  });
  afternoonMeds.forEach((m) => {
    if (isMedicineTaken(selectedDate, m.rxId, m.medIdx, 'afternoon')) takenDosesCount++;
  });
  nightMeds.forEach((m) => {
    if (isMedicineTaken(selectedDate, m.rxId, m.medIdx, 'night')) takenDosesCount++;
  });

  const progressPercentage = totalDosesCount > 0 ? Math.round((takenDosesCount / totalDosesCount) * 100) : 100;

  const handleToggle = (rxId: string, medIdx: number, slot: 'morning' | 'afternoon' | 'night', medName: string) => {
    const wasTaken = isMedicineTaken(selectedDate, rxId, medIdx, slot);
    toggleMedicineIntake(selectedDate, rxId, medIdx, slot);

    if (!wasTaken) {
      addToast({
        type: 'success',
        title: 'Dose Recorded',
        message: `Marked "${medName}" as taken for ${slot}.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Daily Progress & Motivation Banner */}
      <div className="rounded-3xl border border-[#C4CFC0] bg-gradient-to-br from-[#F0F4ED] to-[#E7EFE3] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#5F6F65] shadow-2xs border border-[#D8E2D4]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Smart Dosage Adherence</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C231F]">
              Today's Medication Schedule
            </h3>
            <p className="text-xs sm:text-sm text-[#5F6F65] max-w-xl">
              Stay on track with your prescribed prescription regimen. Check off your doses as you take them.
            </p>
          </div>

          {/* Progress Ring / Bar */}
          <div className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-[#C4CFC0] shadow-xs min-w-[220px]">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F0F4ED] border-4 border-[#5F6F65]">
              <span className="font-mono text-xs font-bold text-[#1C231F]">{progressPercentage}%</span>
            </div>
            <div>
              <div className="text-xs font-bold text-[#1C231F]">Daily Goal</div>
              <div className="text-xs text-[#5F6F65] mt-0.5">
                <strong>{takenDosesCount}</strong> of <strong>{totalDosesCount}</strong> taken
              </div>
              <div className="mt-1 text-[11px] font-semibold text-emerald-800">
                {progressPercentage === 100 ? '🎉 All complete!' : 'In progress'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Main Time Slot Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Morning Slot */}
        <div className="rounded-2xl border border-[#C4CFC0] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E2E8DF] pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                <Sun className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1C231F]">Morning</h4>
                <p className="text-[11px] text-[#808D7C]">08:00 AM • After Breakfast</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {morningMeds.length} meds
            </Badge>
          </div>

          <div className="space-y-3">
            {morningMeds.length === 0 ? (
              <p className="text-xs text-[#808D7C] py-4 text-center">No morning medicines scheduled.</p>
            ) : (
              morningMeds.map((med, idx) => {
                const taken = isMedicineTaken(selectedDate, med.rxId, med.medIdx, 'morning');
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggle(med.rxId, med.medIdx, 'morning', med.name)}
                    className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                      taken
                        ? 'border-emerald-300 bg-emerald-50/40 text-emerald-950'
                        : 'border-[#E2E8DF] bg-[#F8FAF7] hover:bg-[#F0F4ED]'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 shrink-0 text-[#5F6F65]"
                    >
                      {taken ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="h-5 w-5 text-[#808D7C]" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className={`text-xs font-bold ${taken ? 'line-through text-[#808D7C]' : 'text-[#1C231F]'}`}>
                          {med.name}
                        </span>
                        <span className="text-[11px] font-mono text-[#5F6F65] shrink-0 font-semibold">{med.dosage}</span>
                      </div>
                      <p className="text-[11px] text-[#5F6F65] mt-0.5 line-clamp-1">{med.instructions}</p>
                      <p className="text-[10px] text-[#808D7C] mt-1">Prescribed by {med.doctorName}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Afternoon Slot */}
        <div className="rounded-2xl border border-[#C4CFC0] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E2E8DF] pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-700 border border-orange-200">
                <Sunset className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1C231F]">Afternoon</h4>
                <p className="text-[11px] text-[#808D7C]">02:00 PM • After Lunch</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {afternoonMeds.length} meds
            </Badge>
          </div>

          <div className="space-y-3">
            {afternoonMeds.length === 0 ? (
              <p className="text-xs text-[#808D7C] py-4 text-center">No afternoon medicines scheduled.</p>
            ) : (
              afternoonMeds.map((med, idx) => {
                const taken = isMedicineTaken(selectedDate, med.rxId, med.medIdx, 'afternoon');
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggle(med.rxId, med.medIdx, 'afternoon', med.name)}
                    className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                      taken
                        ? 'border-emerald-300 bg-emerald-50/40 text-emerald-950'
                        : 'border-[#E2E8DF] bg-[#F8FAF7] hover:bg-[#F0F4ED]'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 shrink-0 text-[#5F6F65]"
                    >
                      {taken ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="h-5 w-5 text-[#808D7C]" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className={`text-xs font-bold ${taken ? 'line-through text-[#808D7C]' : 'text-[#1C231F]'}`}>
                          {med.name}
                        </span>
                        <span className="text-[11px] font-mono text-[#5F6F65] shrink-0 font-semibold">{med.dosage}</span>
                      </div>
                      <p className="text-[11px] text-[#5F6F65] mt-0.5 line-clamp-1">{med.instructions}</p>
                      <p className="text-[10px] text-[#808D7C] mt-1">Prescribed by {med.doctorName}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Night Slot */}
        <div className="rounded-2xl border border-[#C4CFC0] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E2E8DF] pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Moon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1C231F]">Night / Bedtime</h4>
                <p className="text-[11px] text-[#808D7C]">09:30 PM • After Dinner</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {nightMeds.length} meds
            </Badge>
          </div>

          <div className="space-y-3">
            {nightMeds.length === 0 ? (
              <p className="text-xs text-[#808D7C] py-4 text-center">No night medicines scheduled.</p>
            ) : (
              nightMeds.map((med, idx) => {
                const taken = isMedicineTaken(selectedDate, med.rxId, med.medIdx, 'night');
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggle(med.rxId, med.medIdx, 'night', med.name)}
                    className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                      taken
                        ? 'border-emerald-300 bg-emerald-50/40 text-emerald-950'
                        : 'border-[#E2E8DF] bg-[#F8FAF7] hover:bg-[#F0F4ED]'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 shrink-0 text-[#5F6F65]"
                    >
                      {taken ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="h-5 w-5 text-[#808D7C]" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className={`text-xs font-bold ${taken ? 'line-through text-[#808D7C]' : 'text-[#1C231F]'}`}>
                          {med.name}
                        </span>
                        <span className="text-[11px] font-mono text-[#5F6F65] shrink-0 font-semibold">{med.dosage}</span>
                      </div>
                      <p className="text-[11px] text-[#5F6F65] mt-0.5 line-clamp-1">{med.instructions}</p>
                      <p className="text-[10px] text-[#808D7C] mt-1">Prescribed by {med.doctorName}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
