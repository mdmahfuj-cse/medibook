import { Appointment } from '../types';
import { formatTimeSlot } from './scheduleUtils';

/**
 * Generates an .ics file string for an appointment
 */
export function generateICS(appointment: Appointment): string {
  const [year, month, day] = appointment.dateStr.split('-').map(Number);
  const [startHour, startMin] = appointment.startTime.split(':').map(Number);
  const [endHour, endMin] = appointment.endTime.split(':').map(Number);

  // Format YYYYMMDDTHHMMSS
  const formatICSDate = (y: number, m: number, d: number, h: number, min: number) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${y}${pad(m)}${pad(d)}T${pad(h)}${pad(min)}00`;
  };

  const dtStart = formatICSDate(year, month, day, startHour, startMin);
  const dtEnd = formatICSDate(year, month, day, endHour, endMin);
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const summary = `Medical Appointment: ${appointment.doctorName} (${appointment.doctorSpecialty})`;
  const location = `${appointment.clinic.name}, ${appointment.clinic.address}, ${appointment.clinic.city}, ${appointment.clinic.state}`;
  const description = `Doctor: ${appointment.doctorName}\\nSpecialty: ${appointment.doctorSpecialty}\\nPatient: ${appointment.patientDetails.fullName}\\nReason: ${appointment.patientDetails.reasonForVisit || 'General Consultation'}\\nClinic Phone: ${appointment.clinic.phone}\\nBooking Ref: ${appointment.id}`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MediBook Healthcare Systems//Appointment//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${appointment.id}@medibook.health`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Upcoming Doctor Appointment in 2 Hours',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Triggers a browser download of the .ics file
 */
export function downloadICS(appointment: Appointment) {
  const icsData = generateICS(appointment);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `appointment-${appointment.doctorName.replace(/[^a-zA-Z0-9]/g, '_')}-${appointment.dateStr}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates a Google Calendar web creation URL
 */
export function generateGoogleCalendarUrl(appointment: Appointment): string {
  const [year, month, day] = appointment.dateStr.split('-').map(Number);
  const [startHour, startMin] = appointment.startTime.split(':').map(Number);
  const [endHour, endMin] = appointment.endTime.split(':').map(Number);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const startIso = `${year}${pad(month)}${pad(day)}T${pad(startHour)}${pad(startMin)}00`;
  const endIso = `${year}${pad(month)}${pad(day)}T${pad(endHour)}${pad(endMin)}00`;

  const title = encodeURIComponent(`Doctor Appointment: ${appointment.doctorName}`);
  const details = encodeURIComponent(
    `Specialist: ${appointment.doctorName} (${appointment.doctorSpecialty})\nPatient: ${appointment.patientDetails.fullName}\nReason: ${appointment.patientDetails.reasonForVisit || 'Consultation'}\nClinic Phone: ${appointment.clinic.phone}\nReference: ${appointment.id}`
  );
  const location = encodeURIComponent(`${appointment.clinic.name}, ${appointment.clinic.address}, ${appointment.clinic.city}, ${appointment.clinic.state}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
}
