import React from 'react';
import {
  GraduationCap,
  Award,
  Building2,
  Stethoscope,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Doctor } from '../../types';

interface DoctorOverviewProps {
  doctor: Doctor;
}

export function DoctorOverview({ doctor }: DoctorOverviewProps) {
  // Focus areas / Common conditions treated derived cleanly based on doctor specialty
  const getConditionsTreated = (specialty: string) => {
    switch (specialty) {
      case 'Cardiology':
        return [
          'Coronary Artery Disease',
          'Hypertension & High Blood Pressure',
          'Arrhythmia & Palpitations',
          'Heart Failure & Valve Disorders',
          'Preventive Cardiology & Lipid Management',
          'Chest Pain Evaluation (ECG/Echo)',
        ];
      case 'Dermatology':
        return [
          'Acne Vulgaris & Cystic Acne',
          'Eczema, Psoriasis & Dermatitis',
          'Full-Body Mole & Skin Cancer Screening',
          'Rosacea & Facial Redness',
          'Skin Biopsies & Cryotherapy',
          'Hair Loss & Alopecia Evaluation',
        ];
      case 'General Practice':
        return [
          'Annual Preventive Physical Exams',
          'Chronic Disease Management (Diabetes, HTN)',
          'Upper Respiratory Infections',
          'Preventive Health Screenings & Blood Panels',
          'Vaccinations & Travel Immunizations',
          'Fatigue & Lifestyle Counseling',
        ];
      case 'Pediatrics':
        return [
          'Newborn & Well-Child Development Checks',
          'Pediatric Asthma & Allergies',
          'Childhood Immunization Schedules',
          'Ear Infections & Strep Throat',
          'Growth & Nutritional Guidance',
          'Behavioral & ADHD Screenings',
        ];
      case 'Neurology':
        return [
          'Chronic Migraines & Tension Headaches',
          'Neuropathy & Nerve Pain',
          'Epilepsy & Seizure Disorders',
          'Tremors & Parkinsonism Evaluation',
          'Memory Loss & Cognitive Health',
          'Spinal & Radiculopathy Diagnostics',
        ];
      case 'Orthopedics':
        return [
          'Knee, Hip & Shoulder Osteoarthritis',
          'Sports Injuries (ACL, Meniscus, Rotator Cuff)',
          'Bone Fractures & Sprains',
          'Tendonitis & Bursitis',
          'Joint Injections (Corticosteroid & PRP)',
          'Post-Surgical Rehabilitation Protocols',
        ];
      default:
        return [
          'Comprehensive Clinical Diagnosis',
          'Specialist Second Opinions',
          'Long-term Preventive Care Plans',
          'Diagnostic Imaging Review',
          'Personalized Therapy Protocols',
          'Post-Consultation Health Tracking',
        ];
    }
  };

  const conditions = getConditionsTreated(doctor.specialty);

  return (
    <div className="space-y-8">
      {/* 1. About Biography */}
      <div className="rounded-3xl border border-[#C4CFC0] bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F0F4ED] text-[#5F6F65]">
            <BookOpen className="h-4 w-4" />
          </div>
          <h2 className="font-serif text-xl font-bold text-[#1C231F]">
            About & Clinical Philosophy
          </h2>
        </div>

        <p className="text-sm text-[#2B352F] leading-relaxed whitespace-pre-line">
          {doctor.about}
        </p>

        <div className="mt-6 rounded-2xl border border-[#E2E8DF] bg-[#F8FAF7] p-4 flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-[#5F6F65] shrink-0 mt-0.5" />
          <div className="text-xs text-[#5F6F65] leading-relaxed">
            <span className="font-bold text-[#1C231F]">Evidence-Based Practice:</span> All diagnoses and treatment plans follow latest clinical guidelines from the American College of Physicians.
          </div>
        </div>
      </div>

      {/* 2. Common Conditions Treated */}
      <div className="rounded-3xl border border-[#C4CFC0] bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F0F4ED] text-[#5F6F65]">
            <Stethoscope className="h-4 w-4" />
          </div>
          <h2 className="font-serif text-xl font-bold text-[#1C231F]">
            Conditions Treated & Focus Areas
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {conditions.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2.5 rounded-xl border border-[#E2E8DF] bg-[#FDFEFC] p-3 text-xs font-medium text-[#2B352F]"
            >
              <CheckCircle2 className="h-4 w-4 text-[#5F6F65] shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Education & Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Education History */}
        <div className="rounded-3xl border border-[#C4CFC0] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F0F4ED] text-[#5F6F65]">
              <GraduationCap className="h-4 w-4" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1C231F]">
              Education & Training
            </h3>
          </div>

          <ul className="space-y-4">
            {doctor.education.map((edu, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E7EFE3] text-xs font-bold text-[#5F6F65]">
                  {idx + 1}
                </span>
                <span className="text-xs text-[#2B352F] font-medium leading-relaxed">
                  {edu}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Board Certifications */}
        <div className="rounded-3xl border border-[#C4CFC0] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F0F4ED] text-[#5F6F65]">
              <Award className="h-4 w-4" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1C231F]">
              Board Certifications
            </h3>
          </div>

          <ul className="space-y-3">
            {doctor.qualifications.map((qual, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2.5 rounded-xl border border-[#E2E8DF] bg-[#FDFEFC] p-3 text-xs text-[#2B352F]"
              >
                <CheckCircle2 className="h-4 w-4 text-[#9CA986] shrink-0" />
                <span className="font-medium">{qual}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-4 border-t border-[#E2E8DF] flex items-center gap-2 text-xs text-[#5F6F65]">
            <Building2 className="h-4 w-4 text-[#808D7C] shrink-0" />
            <span>Hospital Affiliation: <strong className="text-[#1C231F]">{doctor.hospitalAffiliation}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
