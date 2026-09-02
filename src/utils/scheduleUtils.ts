import { Doctor, TimeSlot } from '../types';

/**
 * Converts "HH:mm" 24h string to minutes from midnight (e.g. "09:30" -> 570)
 */
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Converts minutes from midnight back to "HH:mm"
 */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Formats "09:00" or "14:30" to "9:00 AM" / "2:30 PM"
 */
export function formatTimeSlot(timeStr: string): string {
  const [hoursStr, minutesStr] = timeStr.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 hour is 12 AM
  return `${hours}:${minutes} ${ampm}`;
}

/**
 * Formats a slot in a target timezone if different from provider timezone
 */
export function formatTimeSlotInTimezone(
  timeStr: string,
  dateStr: string,
  sourceTimezone: string = 'America/New_York',
  targetTimezone?: string
): { formattedTime: string; isConverted: boolean; originalFormatted: string } {
  const originalFormatted = formatTimeSlot(timeStr);

  if (!targetTimezone || targetTimezone === sourceTimezone) {
    return {
      formattedTime: originalFormatted,
      isConverted: false,
      originalFormatted,
    };
  }

  try {
    // Construct UTC-comparable ISO date
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);

    // Create a date in source timezone approximate
    const dateObj = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    const targetFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: targetTimezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const targetFormatted = targetFormatter.format(dateObj);
    return {
      formattedTime: targetFormatted,
      isConverted: true,
      originalFormatted,
    };
  } catch (e) {
    return {
      formattedTime: originalFormatted,
      isConverted: false,
      originalFormatted,
    };
  }
}

/**
 * Checks if doctor works on a given YYYY-MM-DD
 */
export function isDoctorWorkingOnDate(doctor: Doctor, dateStr: string): boolean {
  const dateObj = new Date(`${dateStr}T00:00:00`);
  const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon ...
  const config = doctor.scheduleConfig;

  if (!config.workingDays.includes(dayOfWeek)) {
    return false;
  }

  if (config.unavailableDates && config.unavailableDates.includes(dateStr)) {
    return false;
  }

  return true;
}

/**
 * Generates all time slots for a doctor on a specific date,
 * strictly honoring shifts, lunch breaks, slot duration, buffer times, and unavailable intervals.
 */
export function generateSlotsForDoctor(
  doctor: Doctor,
  dateStr: string,
  bookedSlotTimes: string[] = [],
  slotDurationOverride?: number
): TimeSlot[] {
  if (!isDoctorWorkingOnDate(doctor, dateStr)) {
    return [];
  }

  const { shifts, lunchBreak, slotDurationMinutes, timezone } = doctor.scheduleConfig;
  const duration = slotDurationOverride || slotDurationMinutes || 30;
  const lunchStart = lunchBreak ? timeToMinutes(lunchBreak.start) : -1;
  const lunchEnd = lunchBreak ? timeToMinutes(lunchBreak.end) : -1;

  const slots: TimeSlot[] = [];
  const mockBooked = new Set(bookedSlotTimes);

  shifts.forEach((shift) => {
    const shiftStart = timeToMinutes(shift.start);
    const shiftEnd = timeToMinutes(shift.end);

    for (let current = shiftStart; current + duration <= shiftEnd; current += duration) {
      // Skip if slot overlaps with lunch break
      if (lunchStart !== -1 && lunchEnd !== -1) {
        if (current >= lunchStart && current < lunchEnd) {
          continue;
        }
      }

      const startTime = minutesToTime(current);
      const endTime = minutesToTime(current + duration);
      const slotId = `${doctor.id}-${dateStr}-${startTime}`;

      // Check if slot is in the past (if today)
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      let isPast = false;
      if (dateStr < todayStr) {
        isPast = true;
      } else if (dateStr === todayStr) {
        const currentMinutesNow = now.getHours() * 60 + now.getMinutes();
        if (current < currentMinutesNow) {
          isPast = true;
        }
      }

      const isBooked = mockBooked.has(startTime);
      const isAvailable = !isBooked && !isPast;

      slots.push({
        id: slotId,
        doctorId: doctor.id,
        dateStr,
        startTime,
        endTime,
        isBooked,
        isPast,
        isAvailable,
        timezone: timezone || 'America/New_York',
      });
    }
  });

  return slots;
}

/**
 * Returns upcoming days list (e.g. next 14 days)
 */
export function getUpcomingAvailableDates(doctor: Doctor, daysAhead: number = 14) {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < daysAhead; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    const dayNumber = d.getDate();
    const isWorking = isDoctorWorkingOnDate(doctor, dateStr);

    dates.push({
      dateStr,
      dayName,
      dayNumber,
      monthName,
      isAvailable: isWorking,
      isToday: i === 0,
      isTomorrow: i === 1,
    });
  }

  return dates;
}

/**
 * Finds the earliest available slot for a doctor across the next N days
 */
export function getNextAvailableSlot(
  doctor: Doctor,
  getBookedSlotsFn?: (doctorId: string, dateStr: string) => string[],
  daysToCheck: number = 14
): { dateStr: string; slot: TimeSlot; formatted: string } | null {
  const upcomingDates = getUpcomingAvailableDates(doctor, daysToCheck);

  for (const dateObj of upcomingDates) {
    if (!dateObj.isAvailable) continue;

    const bookedSlots = getBookedSlotsFn ? getBookedSlotsFn(doctor.id, dateObj.dateStr) : [];
    const slots = generateSlotsForDoctor(doctor, dateObj.dateStr, bookedSlots);
    const firstAvailable = slots.find((s) => s.isAvailable);

    if (firstAvailable) {
      return {
        dateStr: dateObj.dateStr,
        slot: firstAvailable,
        formatted: `${dateObj.dayName}, ${dateObj.monthName} ${dateObj.dayNumber} at ${formatTimeSlot(firstAvailable.startTime)}`,
      };
    }
  }

  return null;
}

/**
 * Validates whether a specific slot is still available or has conflict
 */
export function checkSlotConflict(
  doctor: Doctor,
  dateStr: string,
  startTime: string,
  bookedSlotTimes: string[]
): boolean {
  if (!isDoctorWorkingOnDate(doctor, dateStr)) {
    return true; // Not working -> conflict
  }
  if (bookedSlotTimes.includes(startTime)) {
    return true; // Already booked -> conflict
  }
  return false;
}

