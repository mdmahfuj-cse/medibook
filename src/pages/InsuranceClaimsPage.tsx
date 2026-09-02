import React, { useState } from 'react';
import {
  ShieldCheck,
  Building,
  FileCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  Upload,
  Download,
  CreditCard,
  Phone,
  HelpCircle,
  FileText,
  DollarSign,
  Zap,
} from 'lucide-react';
import { useInsuranceStore } from '../stores/useInsuranceStore';
import { useFamilyProfilesStore } from '../stores/useFamilyProfilesStore';
import { useUIStore } from '../stores/useUIStore';
import { InsuranceClaim, InsurancePolicy } from '../types/phase10';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatCurrency } from '../lib/utils';

export function InsuranceClaimsPage() {
  const { policies, claims, addClaim, updateClaimStatus } = useInsuranceStore();
  const { profiles, getActiveProfile } = useFamilyProfilesStore();
  const { navigate } = useUIStore();
  const activeFamilyMember = getActiveProfile();

  const [activeTab, setActiveTab] = useState<'policies' | 'claims'>('policies');
  const [isSubmitClaimOpen, setIsSubmitClaimOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [selectedPolicyId, setSelectedPolicyId] = useState(policies[0]?.id || '');
  const [patientName, setPatientName] = useState(activeFamilyMember.fullName);
  const [claimType, setClaimType] = useState<InsuranceClaim['claimType']>('OPD_Consultation');
  const [treatmentDate, setTreatmentDate] = useState('2026-08-30');
  const [hospitalOrClinicName, setHospitalOrClinicName] = useState('Popular Diagnostic Centre, Dhanmondi');
  const [doctorName, setDoctorName] = useState('Prof. Dr. Mohammad Rafiqul Islam');
  const [claimedAmount, setClaimedAmount] = useState('2200');
  const [reimbursementMethod, setReimbursementMethod] = useState<'bKash' | 'Bank_Transfer'>('bKash');
  const [reimbursementAccount, setReimbursementAccount] = useState('01711234567');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const selectedPolicy = policies.find((p) => p.id === selectedPolicyId) || policies[0];
      const newClaimNumber = `CLM-${selectedPolicy.providerName.substring(0, 2).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const newClaim: InsuranceClaim = {
        id: `clm-${Date.now()}`,
        claimNumber: newClaimNumber,
        policyId: selectedPolicy.id,
        providerName: selectedPolicy.providerName,
        patientName,
        claimType,
        treatmentDate,
        hospitalOrClinicName,
        doctorName,
        claimedAmount: parseFloat(claimedAmount) || 0,
        status: 'submitted',
        reimbursementMethod,
        reimbursementAccount,
        documentsCount: 2,
        submittedAt: new Date().toISOString(),
        auditNotes: 'Claim received. TPA Medical Officer will review attached e-prescription and billing receipt within 24 hours.',
      };

      addClaim(newClaim);
      setIsSubmitting(false);
      setIsSubmitClaimOpen(false);
      setActiveTab('claims');
      setSuccessMessage(`Claim ${newClaimNumber} filed successfully for ${formatCurrency(newClaim.claimedAmount)}!`);
      setTimeout(() => setSuccessMessage(null), 8000);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8DF] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E7EFE3] text-[#1C231F]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#5F6F65]" />
                Health Insurance & Takaful
              </span>
              <span className="text-xs text-[#5F6F65]">Cashless OPD & Claim Reimbursements</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C231F] mt-1.5">
              Health Insurance & Claims Hub
            </h1>
            <p className="text-sm text-[#5F6F65] mt-1">
              Verify your policy coverage, track OPD/IPD annual limits, and submit paperless medical reimbursement claims with fast settlement directly into your bKash or bank account.
            </p>
          </div>

          <Button
            type="button"
            id="file-new-claim-btn"
            variant="primary"
            size="sm"
            onClick={() => setIsSubmitClaimOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
            className="text-xs font-bold"
          >
            File Medical Claim
          </Button>
        </div>

        {/* Success Banner */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-medium">{successMessage}</p>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex border-b border-[#E2E8DF] gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('policies')}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === 'policies'
                ? 'text-[#1C231F] border-b-2 border-[#1C231F]'
                : 'text-[#5F6F65] hover:text-[#1C231F]'
            }`}
          >
            Active Policies & Coverage Limits
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('claims')}
            className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-2 ${
              activeTab === 'claims'
                ? 'text-[#1C231F] border-b-2 border-[#1C231F]'
                : 'text-[#5F6F65] hover:text-[#1C231F]'
            }`}
          >
            <span>Claims History & Settlement Tracker</span>
            {claims.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-[#E7EFE3] text-[#1C231F] font-bold">
                {claims.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: POLICIES */}
        {activeTab === 'policies' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {policies.map((policy) => {
                const usedPercent = Math.round((policy.usedAmount / policy.annualLimit) * 100);
                const opdUsedPercent = Math.round(((policy.opdLimit - policy.opdRemaining) / policy.opdLimit) * 100);

                return (
                  <div
                    key={policy.id}
                    className="bg-white rounded-3xl border border-[#C4CFC0] p-6 shadow-xs flex flex-col justify-between space-y-6"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 border-b border-[#E2E8DF] pb-4">
                        <div>
                          <Badge variant="outline" className="text-[10px] text-emerald-800 border-emerald-300 mb-1">
                            {policy.planType}
                          </Badge>
                          <h3 className="text-base font-bold text-[#1C231F]">{policy.providerName}</h3>
                          <p className="text-xs text-[#5F6F65]">{policy.planName}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-[#808D7C] block">POLICY #</span>
                          <span className="text-xs font-mono font-bold text-[#1C231F]">{policy.policyNumber}</span>
                        </div>
                      </div>

                      {/* Annual Limits Gauges */}
                      <div className="mt-5 space-y-4">
                        {/* Overall IPD / Total Health Limit */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-[#808D7C] font-semibold">Annual Sum Insured</span>
                            <span className="font-bold text-[#1C231F]">
                              {formatCurrency(policy.remainingAmount)} remaining of {formatCurrency(policy.annualLimit)}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-[#E2E8DF] rounded-full overflow-hidden">
                            <div
                              className="bg-[#1C231F] h-full rounded-full"
                              style={{ width: `${usedPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* OPD Limit */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-[#808D7C] font-semibold">OPD Outpatient Sub-Limit</span>
                            <span className="font-bold text-emerald-800">
                              {formatCurrency(policy.opdRemaining)} remaining of {formatCurrency(policy.opdLimit)}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-[#E2E8DF] rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full rounded-full"
                              style={{ width: `${opdUsedPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Covered Members */}
                      <div className="mt-5 pt-4 border-t border-[#E2E8DF] text-xs space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#808D7C] block">
                          Covered Beneficiaries:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {policy.coveredMembers.map((m, idx) => (
                            <span key={idx} className="bg-[#F0F4ED] text-[#1C231F] px-2 py-0.5 rounded-md font-medium">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#E2E8DF] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-[#5F6F65]">
                        <Phone className="h-3.5 w-3.5 text-emerald-700" />
                        <span>TPA Helpline: {policy.tpaHelpline}</span>
                      </div>

                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setSelectedPolicyId(policy.id);
                          setIsSubmitClaimOpen(true);
                        }}
                        className="text-xs"
                      >
                        Claim for this Policy
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cashless Hospital Network Banner */}
            <div className="bg-[#F0F4ED] rounded-3xl border border-[#C4CFC0] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <Building className="h-8 w-8 text-[#5F6F65] shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-[#1C231F]">
                    250+ Cashless Hospital Network Across Bangladesh
                  </h4>
                  <p className="text-xs text-[#5F6F65] mt-0.5">
                    Present your digital health policy card at Evercare, Square, United, Labaid, or Apollo for instant cashless admission with zero upfront deposit.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => alert('Searching network hospitals in Dhaka, Chittagong, Sylhet, and Rajshahi...')}
                className="text-xs font-bold whitespace-nowrap"
              >
                View Hospital Network
              </Button>
            </div>
          </div>
        )}

        {/* TAB 2: CLAIMS HISTORY */}
        {activeTab === 'claims' && (
          <div className="space-y-4">
            {claims.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#C4CFC0] p-12 text-center">
                <FileCheck className="h-12 w-12 text-[#808D7C] mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#1C231F]">No Medical Claims Filed Yet</h3>
                <p className="text-xs text-[#5F6F65] mt-1 max-w-md mx-auto">
                  Submit your doctor consultation slips or diagnostic pathology invoices to receive direct reimbursement within 24–48 hours.
                </p>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setIsSubmitClaimOpen(true)}
                  className="mt-4 text-xs"
                >
                  File Your First Claim
                </Button>
              </div>
            ) : (
              claims.map((claim) => (
                <div
                  key={claim.id}
                  className="bg-white rounded-3xl border border-[#C4CFC0] p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8DF] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#1C231F] bg-[#F0F4ED] px-2.5 py-1 rounded-lg">
                          {claim.claimNumber}
                        </span>
                        <Badge
                          variant={
                            claim.status === 'disbursed'
                              ? 'success'
                              : claim.status === 'approved'
                              ? 'success'
                              : claim.status === 'under_audit'
                              ? 'warning'
                              : 'sage'
                          }
                          className="text-[11px] font-bold"
                        >
                          {claim.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#5F6F65] mt-1 font-medium">
                        Patient: <strong className="text-[#1C231F]">{claim.patientName}</strong> • {claim.providerName}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-[#808D7C] block">Claimed Amount</span>
                      <span className="text-base font-bold text-[#1C231F]">
                        {formatCurrency(claim.claimedAmount)}
                      </span>
                      {claim.approvedAmount && (
                        <span className="text-[10px] text-emerald-700 font-bold block">
                          Disbursed: {formatCurrency(claim.approvedAmount)} ({claim.reimbursementMethod})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#5F6F65]">
                    <div>
                      <span className="text-[#808D7C] block">Treatment Facility</span>
                      <strong className="text-[#1C231F]">{claim.hospitalOrClinicName}</strong>
                    </div>
                    <div>
                      <span className="text-[#808D7C] block">Consulting Doctor</span>
                      <strong className="text-[#1C231F]">{claim.doctorName}</strong>
                    </div>
                    <div>
                      <span className="text-[#808D7C] block">Disbursement Account</span>
                      <strong className="text-[#1C231F]">
                        {claim.reimbursementMethod} ({claim.reimbursementAccount})
                      </strong>
                    </div>
                  </div>

                  {claim.auditNotes && (
                    <div className="p-3 rounded-2xl bg-[#F0F4ED] text-xs text-[#5F6F65] border border-[#E2E8DF] flex items-start gap-2">
                      <Clock className="h-4 w-4 text-[#808D7C] shrink-0 mt-0.5" />
                      <span>{claim.auditNotes}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* SUBMIT CLAIM MODAL */}
        {isSubmitClaimOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#E2E8DF] pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#1C231F]">Submit Health Insurance Claim</h3>
                  <p className="text-xs text-[#5F6F65]">Paperless OPD / Diagnostic bill reimbursement</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSubmitClaimOpen(false)}
                  className="h-8 w-8 rounded-full bg-[#F0F4ED] flex items-center justify-center text-[#5F6F65]"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs">
                {/* Select Policy */}
                <div>
                  <label className="font-semibold text-[#1C231F] block mb-1">Insurance Policy</label>
                  <select
                    value={selectedPolicyId}
                    onChange={(e) => setSelectedPolicyId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#C4CFC0] text-xs font-medium"
                  >
                    {policies.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.providerName} — {p.policyNumber} (OPD Balance: {formatCurrency(p.opdRemaining)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Patient Name */}
                <div>
                  <label className="font-semibold text-[#1C231F] block mb-1">Patient Name</label>
                  <select
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#C4CFC0] text-xs"
                  >
                    {profiles.map((pr) => (
                      <option key={pr.id} value={pr.fullName}>
                        {pr.fullName} ({pr.relationship})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Claim Type & Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#1C231F] block mb-1">Claim Category</label>
                    <select
                      value={claimType}
                      onChange={(e) => setClaimType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-[#C4CFC0] text-xs"
                    >
                      <option value="OPD_Consultation">Doctor OPD Consultation</option>
                      <option value="Diagnostic_Tests">Diagnostic Pathology / Scan</option>
                      <option value="Pharmacy_Bill">Prescribed Pharmacy Medicines</option>
                      <option value="IPD_Hospitalization">Hospital Inpatient Admission</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-[#1C231F] block mb-1">Date of Treatment</label>
                    <input
                      type="date"
                      value={treatmentDate}
                      onChange={(e) => setTreatmentDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#C4CFC0] text-xs"
                    />
                  </div>
                </div>

                {/* Hospital & Doctor */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#1C231F] block mb-1">Hospital / Diagnostic Clinic</label>
                    <input
                      type="text"
                      required
                      value={hospitalOrClinicName}
                      onChange={(e) => setHospitalOrClinicName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#C4CFC0] text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#1C231F] block mb-1">Consulting Doctor</label>
                    <input
                      type="text"
                      required
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#C4CFC0] text-xs"
                    />
                  </div>
                </div>

                {/* Claimed Amount */}
                <div>
                  <label className="font-semibold text-[#1C231F] block mb-1">Total Bill Amount (BDT)</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={claimedAmount}
                    onChange={(e) => setClaimedAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#C4CFC0] text-xs font-bold"
                  />
                </div>

                {/* Disbursement Method */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#1C231F] block mb-1">Payout Method</label>
                    <select
                      value={reimbursementMethod}
                      onChange={(e) => setReimbursementMethod(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-[#C4CFC0] text-xs font-bold"
                    >
                      <option value="bKash">bKash Mobile Wallet</option>
                      <option value="Bank_Transfer">Direct Bank BEFTN Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-[#1C231F] block mb-1">Wallet / Account Number</label>
                    <input
                      type="text"
                      required
                      value={reimbursementAccount}
                      onChange={(e) => setReimbursementAccount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#C4CFC0] text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Mock File Upload Box */}
                <div className="p-4 rounded-2xl bg-[#F0F4ED] border border-dashed border-[#808D7C] text-center space-y-1 cursor-pointer hover:bg-[#E2E8DF]/60 transition-colors">
                  <Upload className="h-5 w-5 text-[#5F6F65] mx-auto" />
                  <span className="text-xs font-bold text-[#1C231F] block">
                    Prescription & Money Receipts Attached (2 files)
                  </span>
                  <span className="text-[10px] text-[#808D7C] block">
                    Auto-attached from your digital health vault
                  </span>
                </div>

                <div className="pt-4 border-t border-[#E2E8DF] flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSubmitClaimOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isSubmitting}
                    className="text-xs font-bold"
                  >
                    {isSubmitting ? 'Submitting to TPA...' : 'Submit Claim'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
