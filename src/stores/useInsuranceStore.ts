import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InsurancePolicy, InsuranceClaim } from '../types/phase10';

export const INITIAL_POLICIES: InsurancePolicy[] = [
  {
    id: 'pol-metlife-001',
    providerName: 'MetLife Bangladesh',
    policyNumber: 'ML-BD-789045-2026',
    policyHolderName: 'Tanvir Hossain',
    planName: 'Executive Health Care Plan Plus (360° Health)',
    planType: 'Comprehensive Health',
    annualLimit: 500000,
    usedAmount: 85000,
    remainingAmount: 415000,
    opdLimit: 50000,
    opdRemaining: 34500,
    validUntil: '2027-04-30',
    coPayPercentage: 0,
    tpaHelpline: '16344 / 09666716344',
    coveredMembers: ['Tanvir Hossain (Self)', 'Nusrat Jahan (Spouse)', 'Ayan Hossain (Child)'],
    networkHospitalsCount: 148,
  },
  {
    id: 'pol-greendelta-002',
    providerName: 'Green Delta Insurance Co.',
    policyNumber: 'GDIC-CORP-4491-BD',
    policyHolderName: 'Tanvir Hossain (Corporate Benefit)',
    planName: 'Corporate Group Health Shield',
    planType: 'Corporate Group Health',
    annualLimit: 300000,
    usedAmount: 18000,
    remainingAmount: 282000,
    opdLimit: 30000,
    opdRemaining: 21500,
    validUntil: '2026-12-31',
    coPayPercentage: 10,
    tpaHelpline: '16457',
    coveredMembers: ['Tanvir Hossain (Self)'],
    networkHospitalsCount: 110,
  },
];

export const INITIAL_CLAIMS: InsuranceClaim[] = [
  {
    id: 'clm-8891',
    claimNumber: 'CLM-ML-2026-8891',
    policyId: 'pol-metlife-001',
    providerName: 'MetLife Bangladesh',
    patientName: 'Tanvir Hossain',
    claimType: 'OPD_Consultation',
    treatmentDate: '2026-08-20',
    hospitalOrClinicName: 'Popular Diagnostic Centre, Dhanmondi',
    doctorName: 'Prof. Dr. Mohammad Rafiqul Islam (Cardiology)',
    claimedAmount: 2200,
    approvedAmount: 2200,
    status: 'disbursed',
    reimbursementMethod: 'bKash',
    reimbursementAccount: '01711234567',
    documentsCount: 2,
    submittedAt: '2026-08-21T10:00:00Z',
    auditNotes: 'Prescription verified with diagnostic slip. Claim 100% approved without deduction.',
  },
  {
    id: 'clm-7742',
    claimNumber: 'CLM-ML-2026-7742',
    policyId: 'pol-metlife-001',
    providerName: 'MetLife Bangladesh',
    patientName: 'Nusrat Jahan',
    claimType: 'Diagnostic_Tests',
    treatmentDate: '2026-08-28',
    hospitalOrClinicName: 'Ibn Sina Diagnostic Centre',
    doctorName: 'Dr. Nusrat Jahan Chowdhury',
    claimedAmount: 3850,
    status: 'under_audit',
    reimbursementMethod: 'bKash',
    reimbursementAccount: '01819876543',
    documentsCount: 3,
    submittedAt: '2026-08-29T14:30:00Z',
    auditNotes: 'TPA Medical Auditor reviewing itemized biochemistry invoice and doctor requisition.',
  },
];

interface InsuranceStore {
  policies: InsurancePolicy[];
  claims: InsuranceClaim[];
  addClaim: (claim: InsuranceClaim) => void;
  updateClaimStatus: (claimId: string, status: InsuranceClaim['status'], approvedAmount?: number) => void;
}

export const useInsuranceStore = create<InsuranceStore>()(
  persist(
    (set, get) => ({
      policies: INITIAL_POLICIES,
      claims: INITIAL_CLAIMS,

      addClaim: (claim) => set({ claims: [claim, ...get().claims] }),

      updateClaimStatus: (claimId, status, approvedAmount) => {
        set({
          claims: get().claims.map((c) =>
            c.id === claimId
              ? {
                  ...c,
                  status,
                  ...(approvedAmount !== undefined ? { approvedAmount } : {}),
                }
              : c
          ),
        });
      },
    }),
    {
      name: 'healthcare_insurance_v10',
    }
  )
);
