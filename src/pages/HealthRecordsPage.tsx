import React, { useState } from 'react';
import {
  Activity,
  FileText,
  Heart,
  Plus,
  Trash2,
  Download,
  Printer,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  UploadCloud,
  X,
  Phone,
  User,
  BadgeAlert,
  Search,
  Tag,
  Filter,
} from 'lucide-react';
import { useHealthRecordsStore } from '../stores/useHealthRecordsStore';
import { useUIStore } from '../stores/useUIStore';
import { VitalReading, DocumentCategory } from '../types/healthRecords';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatDateLong } from '../lib/utils';

export function HealthRecordsPage() {
  const {
    medicalProfile,
    vitals,
    documents,
    addVitalReading,
    deleteVitalReading,
    addDocument,
    deleteDocument,
  } = useHealthRecordsStore();
  const { addToast } = useUIStore();

  const [activeTab, setActiveTab] = useState<'vitals' | 'documents' | 'medical-id'>('vitals');
  const [docCategoryFilter, setDocCategoryFilter] = useState<'all' | DocumentCategory>('all');
  const [docSearchQuery, setDocSearchQuery] = useState('');

  // Add Vital Modal State
  const [showAddVitalModal, setShowAddVitalModal] = useState(false);
  const [newVitalType, setNewVitalType] = useState<VitalReading['type']>('bp');
  const [newVitalValue, setNewVitalValue] = useState('120/80');
  const [newVitalNotes, setNewVitalNotes] = useState('');

  // Add Document Modal State
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<DocumentCategory>('lab_report');
  const [newDocHospital, setNewDocHospital] = useState('Popular Diagnostic Centre (Dhanmondi)');
  const [newDocNotes, setNewDocNotes] = useState('');

  // Filter Documents
  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = docCategoryFilter === 'all' || doc.category === docCategoryFilter;
    const matchesSearch =
      doc.title.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      doc.hospitalOrClinic.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(docSearchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSaveVital = (e: React.FormEvent) => {
    e.preventDefault();
    const unitMap: Record<VitalReading['type'], string> = {
      bp: 'mmHg',
      glucose: 'mmol/L',
      heart_rate: 'bpm',
      spo2: '%',
      temperature: '°C',
      weight: 'kg',
    };

    let status: VitalReading['status'] = 'normal';
    if (newVitalType === 'bp') {
      const [sys] = newVitalValue.split('/').map(Number);
      if (sys && sys < 120) status = 'optimal';
      else if (sys && sys >= 130) status = 'warning';
    }

    addVitalReading({
      type: newVitalType,
      value: newVitalValue,
      unit: unitMap[newVitalType],
      status,
      notes: newVitalNotes || 'Manual patient entry',
    });

    setShowAddVitalModal(false);
    setNewVitalNotes('');
    addToast({
      type: 'success',
      title: 'Vital Reading Logged',
      message: `Recorded ${newVitalValue} ${unitMap[newVitalType]} into health vault.`,
    });
  };

  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle) return;

    addDocument({
      title: newDocTitle,
      category: newDocCategory,
      hospitalOrClinic: newDocHospital,
      date: new Date().toISOString().split('T')[0],
      fileSize: '2.4 MB',
      fileType: 'pdf',
      notes: newDocNotes,
      tags: [newDocCategory.replace('_', ' '), 'Self Uploaded'],
    });

    setShowAddDocModal(false);
    setNewDocTitle('');
    setNewDocNotes('');
    addToast({
      type: 'success',
      title: 'Medical Document Uploaded',
      message: `"${newDocTitle}" successfully archived in your digital health vault.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] pb-24 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8DF] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5F6F65]">
              <ShieldCheck className="h-4 w-4" />
              <span>Digital Health Records & Personal Vault</span>
            </div>
            <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1C231F]">
              Patient Health Vault & Vitals
            </h1>
            <p className="mt-1 text-sm text-[#5F6F65]">
              Track clinical vitals over time, archive lab reports, and manage your emergency medical ID.
            </p>
          </div>

          {/* Quick Profile Summary Badge */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-[#C4CFC0] shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5F6F65] text-white font-bold">
              {medicalProfile.bloodGroup}
            </div>
            <div>
              <span className="font-bold text-xs text-[#1C231F] block">{medicalProfile.fullName}</span>
              <span className="text-[11px] text-[#5F6F65]">
                {medicalProfile.gender}, {new Date().getFullYear() - Number(medicalProfile.dateOfBirth.split('-')[0])} Yrs • BMI 24.2
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-[#E2E8DF] pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('vitals')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'vitals'
                ? 'bg-[#5F6F65] text-white shadow-xs'
                : 'bg-white text-[#5F6F65] hover:bg-[#F0F4ED] border border-[#E2E8DF]'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Vitals & Biomarkers</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'documents'
                ? 'bg-[#5F6F65] text-white shadow-xs'
                : 'bg-white text-[#5F6F65] hover:bg-[#F0F4ED] border border-[#E2E8DF]'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Diagnostic Reports & Records</span>
            <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${activeTab === 'documents' ? 'bg-white/20 text-white' : 'bg-[#E7EFE3] text-[#5F6F65]'}`}>
              {documents.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('medical-id')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'medical-id'
                ? 'bg-[#5F6F65] text-white shadow-xs'
                : 'bg-white text-[#5F6F65] hover:bg-[#F0F4ED] border border-[#E2E8DF]'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Emergency Medical ID Card</span>
          </button>
        </div>

        {/* TAB 1: Vitals & Biomarkers */}
        {activeTab === 'vitals' && (
          <div className="space-y-6">
            {/* Top Vitals Scoreboard */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="rounded-2xl border border-[#C4CFC0] bg-white p-4 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#808D7C] block">
                  Blood Pressure
                </span>
                <div className="mt-1 font-mono text-xl font-bold text-[#1C231F]">
                  120/80 <span className="text-xs font-normal text-[#5F6F65]">mmHg</span>
                </div>
                <Badge variant="outline" className="mt-2 text-[9px] bg-emerald-50 text-emerald-800 border-emerald-200">
                  Optimal (JNC-8)
                </Badge>
              </div>

              <div className="rounded-2xl border border-[#C4CFC0] bg-white p-4 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#808D7C] block">
                  Fasting Glucose
                </span>
                <div className="mt-1 font-mono text-xl font-bold text-[#1C231F]">
                  5.8 <span className="text-xs font-normal text-[#5F6F65]">mmol/L</span>
                </div>
                <Badge variant="outline" className="mt-2 text-[9px] bg-emerald-50 text-emerald-800 border-emerald-200">
                  Normal FBS
                </Badge>
              </div>

              <div className="rounded-2xl border border-[#C4CFC0] bg-white p-4 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#808D7C] block">
                  Heart Rate
                </span>
                <div className="mt-1 font-mono text-xl font-bold text-[#1C231F]">
                  72 <span className="text-xs font-normal text-[#5F6F65]">bpm</span>
                </div>
                <Badge variant="outline" className="mt-2 text-[9px] bg-emerald-50 text-emerald-800 border-emerald-200">
                  Resting Rhythm
                </Badge>
              </div>

              <div className="rounded-2xl border border-[#C4CFC0] bg-white p-4 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#808D7C] block">
                  SpO₂ Blood Oxygen
                </span>
                <div className="mt-1 font-mono text-xl font-bold text-[#1C231F]">
                  99% <span className="text-xs font-normal text-[#5F6F65]">Room Air</span>
                </div>
                <Badge variant="outline" className="mt-2 text-[9px] bg-emerald-50 text-emerald-800 border-emerald-200">
                  Excellent
                </Badge>
              </div>

              <div className="rounded-2xl border border-[#C4CFC0] bg-white p-4 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#808D7C] block">
                  Body Weight
                </span>
                <div className="mt-1 font-mono text-xl font-bold text-[#1C231F]">
                  74.0 <span className="text-xs font-normal text-[#5F6F65]">kg</span>
                </div>
                <Badge variant="outline" className="mt-2 text-[9px] bg-blue-50 text-blue-800 border-blue-200">
                  BMI 24.2 (Normal)
                </Badge>
              </div>

              <div className="rounded-2xl border border-[#C4CFC0] bg-white p-4 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#808D7C] block">
                  Temperature
                </span>
                <div className="mt-1 font-mono text-xl font-bold text-[#1C231F]">
                  36.6 <span className="text-xs font-normal text-[#5F6F65]">°C</span>
                </div>
                <Badge variant="outline" className="mt-2 text-[9px] bg-emerald-50 text-emerald-800 border-emerald-200">
                  97.9 °F Normal
                </Badge>
              </div>
            </div>

            {/* Vitals History Log Header & Add CTA */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1C231F]">Recorded Clinical Vitals Log</h3>
                <p className="text-xs text-[#5F6F65]">Historical home readings and doctor chamber measurements.</p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddVitalModal(true)}
                className="gap-1.5 text-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Log New Reading</span>
              </Button>
            </div>

            {/* Vitals Timeline Table */}
            <div className="rounded-2xl border border-[#C4CFC0] bg-white overflow-hidden shadow-xs">
              <div className="divide-y divide-[#E2E8DF]">
                {vitals.map((reading) => (
                  <div
                    key={reading.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-[#F8FAF7] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0F4ED] text-[#5F6F65]">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-bold text-[#1C231F]">
                            {reading.value} {reading.unit}
                          </span>
                          <Badge
                            variant="outline"
                            className={
                              reading.status === 'optimal' || reading.status === 'normal'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]'
                                : 'bg-amber-50 text-amber-800 border-amber-200 text-[10px]'
                            }
                          >
                            {reading.type.toUpperCase()} • {reading.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-[#5F6F65] mt-0.5">{reading.notes}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-[#808D7C]">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatDateLong(reading.recordedAt.split('T')[0])}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteVitalReading(reading.id)}
                        className="rounded-lg p-1.5 text-[#808D7C] hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Diagnostic Documents */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            {/* Search & Category Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#C4CFC0] shadow-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {(['all', 'lab_report', 'radiology', 'vaccination', 'discharge_summary'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setDocCategoryFilter(cat)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap ${
                      docCategoryFilter === cat
                        ? 'bg-[#5F6F65] text-white shadow-xs'
                        : 'bg-[#F0F4ED] text-[#5F6F65] hover:bg-[#E2E8DF]'
                    }`}
                  >
                    {cat.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#808D7C]" />
                  <input
                    type="text"
                    placeholder="Search report or test..."
                    value={docSearchQuery}
                    onChange={(e) => setDocSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-[#E2E8DF] bg-[#F8FAF7] pl-9 pr-3 py-1.5 text-xs text-[#1C231F] focus:border-[#5F6F65] focus:outline-none"
                  />
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowAddDocModal(true)}
                  className="gap-1.5 text-xs shrink-0"
                >
                  <UploadCloud className="h-4 w-4" />
                  <span>Upload Report</span>
                </Button>
              </div>
            </div>

            {/* Documents List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-2xl border border-[#C4CFC0] bg-white p-5 shadow-xs space-y-3 relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0F4ED] text-[#5F6F65]">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#1C231F] leading-tight">{doc.title}</h4>
                          <p className="text-xs text-[#5F6F65]">{doc.hospitalOrClinic}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-800 border-blue-200 capitalize">
                        {doc.category.replace('_', ' ')}
                      </Badge>
                    </div>

                    {doc.notes && (
                      <p className="mt-3 rounded-xl bg-[#F8FAF7] border border-[#E2E8DF] p-2.5 text-xs text-[#2B352F] leading-relaxed">
                        {doc.notes}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {doc.tags.map((tag, i) => (
                        <span key={i} className="rounded-md bg-[#F0F4ED] px-2 py-0.5 text-[10px] text-[#5F6F65] font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#E2E8DF] pt-3 text-xs text-[#808D7C]">
                    <span>Date: {formatDateLong(doc.date)} ({doc.fileSize})</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          addToast({
                            type: 'success',
                            title: 'Downloading Document',
                            message: `Downloading "${doc.title}.pdf"...`,
                          });
                        }}
                        className="rounded-lg p-1.5 text-[#5F6F65] hover:bg-[#F0F4ED] hover:text-[#1C231F] transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteDocument(doc.id)}
                        className="rounded-lg p-1.5 text-[#808D7C] hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Emergency Medical ID Card */}
        {activeTab === 'medical-id' && (
          <div className="space-y-6">
            <div className="max-w-3xl mx-auto rounded-3xl border-2 border-[#5F6F65] bg-white p-6 sm:p-8 shadow-xl space-y-6">
              {/* Card Top Header */}
              <div className="flex items-center justify-between border-b border-[#E2E8DF] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white font-bold text-lg shadow-md">
                    {medicalProfile.bloodGroup}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#1C231F]">
                      EMERGENCY MEDICAL IDENTIFICATION CARD
                    </h3>
                    <p className="text-xs text-[#5F6F65]">
                      Republic of Bangladesh • Digital Health ID Registry
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    addToast({
                      type: 'success',
                      title: 'Print Preview Ready',
                      message: 'Sending Emergency Medical Card to printer layout.',
                    });
                  }}
                  className="gap-1.5 text-xs hidden sm:flex"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Card</span>
                </Button>
              </div>

              {/* Patient Core Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[#808D7C] block font-semibold">Full Name:</span>
                  <strong className="text-sm text-[#1C231F]">{medicalProfile.fullName}</strong>
                </div>
                <div>
                  <span className="text-[#808D7C] block font-semibold">Blood Group:</span>
                  <strong className="text-sm text-red-700">{medicalProfile.bloodGroup} Positive</strong>
                </div>
                <div>
                  <span className="text-[#808D7C] block font-semibold">Date of Birth:</span>
                  <span className="font-bold text-[#1C231F]">{medicalProfile.dateOfBirth}</span>
                </div>
                <div>
                  <span className="text-[#808D7C] block font-semibold">National ID (NID):</span>
                  <span className="font-mono font-bold text-[#1C231F]">{medicalProfile.nationalIdNumber}</span>
                </div>
              </div>

              {/* Allergies & Conditions Alert */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-red-50 border border-red-200 p-4 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <span>Known Severe Allergies:</span>
                  </div>
                  <ul className="list-disc list-inside text-red-900 space-y-0.5">
                    {medicalProfile.allergies.map((al, idx) => (
                      <li key={idx}><strong>{al}</strong></li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Activity className="h-4 w-4" />
                    <span>Chronic Health Conditions:</span>
                  </div>
                  <ul className="list-disc list-inside text-amber-950 space-y-0.5">
                    {medicalProfile.chronicConditions.map((cond, idx) => (
                      <li key={idx}>{cond}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#808D7C]">
                  Emergency Contacts (Immediate Notification)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {medicalProfile.emergencyContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="rounded-2xl bg-[#F8FAF7] border border-[#E2E8DF] p-3.5 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-[#1C231F]">
                        <span>{contact.name}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {contact.relationship}
                        </Badge>
                      </div>
                      <a
                        href={`tel:${contact.phone}`}
                        className="inline-flex items-center gap-1.5 text-emerald-800 font-bold hover:underline"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <span>{contact.phone}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Vital Modal */}
      {showAddVitalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-[#C4CFC0]">
            <div className="flex items-center justify-between border-b border-[#E2E8DF] pb-3">
              <h3 className="font-bold text-sm text-[#1C231F]">Record Clinical Vital</h3>
              <button
                onClick={() => setShowAddVitalModal(false)}
                className="text-[#808D7C] hover:text-[#1C231F]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVital} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#808D7C] block mb-1">Vital Biomarker</label>
                <select
                  value={newVitalType}
                  onChange={(e) => setNewVitalType(e.target.value as VitalReading['type'])}
                  className="w-full rounded-xl border border-[#C4CFC0] p-2 bg-white"
                >
                  <option value="bp">Blood Pressure (mmHg)</option>
                  <option value="glucose">Blood Glucose (mmol/L)</option>
                  <option value="heart_rate">Heart Rate (bpm)</option>
                  <option value="spo2">SpO₂ Blood Oxygen (%)</option>
                  <option value="weight">Body Weight (kg)</option>
                  <option value="temperature">Body Temperature (°C)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#808D7C] block mb-1">Measurement Value</label>
                <input
                  type="text"
                  value={newVitalValue}
                  onChange={(e) => setNewVitalValue(e.target.value)}
                  placeholder="e.g. 120/80 or 6.1"
                  className="w-full rounded-xl border border-[#C4CFC0] p-2 text-[#1C231F]"
                />
              </div>

              <div>
                <label className="font-bold text-[#808D7C] block mb-1">Clinical Context / Notes</label>
                <input
                  type="text"
                  value={newVitalNotes}
                  onChange={(e) => setNewVitalNotes(e.target.value)}
                  placeholder="e.g., Morning seated resting test"
                  className="w-full rounded-xl border border-[#C4CFC0] p-2 text-[#1C231F]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8DF]">
                <Button variant="outline" size="sm" type="button" onClick={() => setShowAddVitalModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Reading
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-[#C4CFC0]">
            <div className="flex items-center justify-between border-b border-[#E2E8DF] pb-3">
              <h3 className="font-bold text-sm text-[#1C231F]">Upload Diagnostic Report</h3>
              <button
                onClick={() => setShowAddDocModal(false)}
                className="text-[#808D7C] hover:text-[#1C231F]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDocument} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#808D7C] block mb-1">Report / Test Name</label>
                <input
                  type="text"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  placeholder="e.g., Complete Blood Count & Serum Creatinine"
                  className="w-full rounded-xl border border-[#C4CFC0] p-2 text-[#1C231F]"
                />
              </div>

              <div>
                <label className="font-bold text-[#808D7C] block mb-1">Category</label>
                <select
                  value={newDocCategory}
                  onChange={(e) => setNewDocCategory(e.target.value as DocumentCategory)}
                  className="w-full rounded-xl border border-[#C4CFC0] p-2 bg-white"
                >
                  <option value="lab_report">Lab Pathology Report</option>
                  <option value="radiology">Radiology (X-Ray / MRI / CT / Echo)</option>
                  <option value="vaccination">Vaccination Certificate</option>
                  <option value="discharge_summary">Hospital Discharge Summary</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#808D7C] block mb-1">Diagnostic Centre / Hospital</label>
                <input
                  type="text"
                  value={newDocHospital}
                  onChange={(e) => setNewDocHospital(e.target.value)}
                  className="w-full rounded-xl border border-[#C4CFC0] p-2 text-[#1C231F]"
                />
              </div>

              <div>
                <label className="font-bold text-[#808D7C] block mb-1">Key Findings Summary</label>
                <textarea
                  rows={2}
                  value={newDocNotes}
                  onChange={(e) => setNewDocNotes(e.target.value)}
                  placeholder="Summary values or doctor comments..."
                  className="w-full rounded-xl border border-[#C4CFC0] p-2 text-[#1C231F]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8DF]">
                <Button variant="outline" size="sm" type="button" onClick={() => setShowAddDocModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Upload & Archive
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
