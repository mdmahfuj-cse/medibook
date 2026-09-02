import React from 'react';
import {
  HeartPulse,
  Sparkles,
  Stethoscope,
  Baby,
  Brain,
  Activity,
  Smile,
  Eye,
  ShieldCheck,
  SmilePlus,
  ActivitySquare,
  Salad,
  type LucideIcon,
} from 'lucide-react';
import { Specialty } from '../types';

export const SPECIALTY_ICONS: Record<string, LucideIcon> = {
  Cardiology: HeartPulse,
  Dermatology: Sparkles,
  'General Practice': Stethoscope,
  Pediatrics: Baby,
  Neurology: Brain,
  Orthopedics: Activity,
  Psychiatry: Smile,
  Ophthalmology: Eye,
  Gynecology: ShieldCheck,
  Dentistry: SmilePlus,
  Endocrinology: ActivitySquare,
  Gastroenterology: Salad,
};

export function getSpecialtyIcon(specialty: Specialty | string): LucideIcon {
  return SPECIALTY_ICONS[specialty] || Stethoscope;
}
