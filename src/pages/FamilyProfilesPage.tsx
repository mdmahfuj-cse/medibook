import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Heart,
  ShieldAlert,
  Calendar,
  Phone,
  FileText,
  Activity,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  ArrowRight,
  User,
  Smile,
} from 'lucide-react';
import { useFamilyProfilesStore } from '../stores/useFamilyProfilesStore';
import { useUIStore } from '../stores/useUIStore';
import { FamilyMemberProfile } from '../types/phase10';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function FamilyProfilesPage() {
  const {
    profiles,
    activeProfileId,
    setActiveProfileId,
    addProfile,
    updateProfile,
    removeProfile,
  } = useFamilyProfilesStore();

  const { navigate } = useUIStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<FamilyMemberProfile | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState<FamilyMemberProfile['relationship']>('Father');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [dateOfBirth, setDateOfBirth] = useState('1960-01-01');
  const [bloodGroup, setBloodGroup] = useState<FamilyMemberProfile['bloodGroup']>('O+');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [allergiesInput, setAllergiesInput] = useState('');
  const [chronicConditionsInput, setChronicConditionsInput] = useState('');

  const handleOpenAdd = () => {
    setFullName('');
    setRelationship('Father');
    setGender('Male');
    setDateOfBirth('1965-05-15');
    setBloodGroup('B+');
    setPhone('');
    setEmergencyContact('+880 1711-234567 (Self)');
    setNationalId('');
    setAllergiesInput('');
    setChronicConditionsInput('');
    setEditingProfile(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: FamilyMemberProfile) => {
    setEditingProfile(p);
    setFullName(p.fullName);
    setRelationship(p.relationship);
    setGender(p.gender);
    setDateOfBirth(p.dateOfBirth);
    setBloodGroup(p.bloodGroup);
    setPhone(p.phone || '');
    setEmergencyContact(p.emergencyContact || '');
    setNationalId(p.nationalIdOrBirthCert || '');
    setAllergiesInput(p.allergies.join(', '));
    setChronicConditionsInput(p.chronicConditions.join(', '));
    setIsAddModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    // Calculate approximate age
    const birthYear = new Date(dateOfBirth).getFullYear();
    const currentYear = new Date().getFullYear();
    const calculatedAge = Math.max(1, currentYear - birthYear);

    const allergies = allergiesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const chronicConditions = chronicConditionsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingProfile) {
      updateProfile(editingProfile.id, {
        fullName,
        relationship,
        gender,
        dateOfBirth,
        age: calculatedAge,
        bloodGroup,
        phone,
        emergencyContact,
        nationalIdOrBirthCert: nationalId,
        allergies,
        chronicConditions,
      });
    } else {
      const newProfile: FamilyMemberProfile = {
        id: `fam-${Date.now()}`,
        fullName,
        relationship,
        gender,
        dateOfBirth,
        age: calculatedAge,
        bloodGroup,
        phone,
        emergencyContact,
        nationalIdOrBirthCert: nationalId,
        allergies,
        chronicConditions,
        avatarBgColor: relationship === 'Father' || relationship === 'Mother' ? 'bg-amber-600' : 'bg-blue-600',
        avatarIcon: relationship === 'Son' || relationship === 'Daughter' ? 'Smile' : 'User',
        activePrescriptionsCount: 0,
        upcomingAppointmentsCount: 0,
      };
      addProfile(newProfile);
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8DF] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E7EFE3] text-[#1C231F]">
                <Users className="h-3.5 w-3.5 text-[#5F6F65]" />
                Family Health Circle
              </span>
              <span className="text-xs text-[#5F6F65]">Multi-Patient Care Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C231F] mt-1.5">
              Family Health Profiles
            </h1>
            <p className="text-sm text-[#5F6F65] mt-1">
              Manage personal health records, chronic illnesses, and book appointments or diagnostic tests seamlessly on behalf of your family members.
            </p>
          </div>

          <Button
            type="button"
            id="add-family-member-btn"
            variant="primary"
            size="sm"
            onClick={handleOpenAdd}
            leftIcon={<UserPlus className="h-4 w-4" />}
            className="text-xs font-bold"
          >
            Add Family Member
          </Button>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profiles.map((profile) => {
            const isActive = profile.id === activeProfileId;

            return (
              <div
                key={profile.id}
                className={`bg-white rounded-3xl border p-6 transition-all relative flex flex-col justify-between ${
                  isActive
                    ? 'border-[#1C231F] ring-2 ring-[#1C231F] shadow-md'
                    : 'border-[#C4CFC0] hover:border-[#808D7C]'
                }`}
              >
                {/* Active Indicator Badge */}
                {isActive && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="success" className="text-[10px] font-bold">
                      Active Profile ✓
                    </Badge>
                  </div>
                )}

                <div>
                  {/* Avatar & Basics */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-xs ${profile.avatarBgColor}`}
                    >
                      {profile.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#1C231F]">{profile.fullName}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-[#F0F4ED] font-semibold text-[#5F6F65]">
                          {profile.relationship}
                        </span>
                      </div>
                      <p className="text-xs text-[#5F6F65] mt-0.5">
                        {profile.age} yrs • {profile.gender} • Blood Group: <strong className="text-red-700 font-bold">{profile.bloodGroup}</strong>
                      </p>
                      {profile.phone && (
                        <p className="text-xs text-[#808D7C] flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3" /> {profile.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Medical Conditions & Allergies */}
                  <div className="mt-5 space-y-3 pt-4 border-t border-[#E2E8DF]">
                    {/* Allergies */}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1 mb-1">
                        <AlertCircle className="h-3 w-3 text-rose-600" />
                        Known Drug Allergies
                      </span>
                      {profile.allergies.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {profile.allergies.map((allergy, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-semibold bg-rose-50 text-rose-900 border border-rose-200 px-2 py-0.5 rounded-md"
                            >
                              {allergy}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-[#808D7C]">No known allergies recorded</span>
                      )}
                    </div>

                    {/* Chronic Conditions */}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1 mb-1">
                        <Activity className="h-3 w-3 text-amber-600" />
                        Chronic Conditions
                      </span>
                      {profile.chronicConditions.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {profile.chronicConditions.map((cond, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md"
                            >
                              {cond}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-[#808D7C]">None recorded</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-6 pt-4 border-t border-[#E2E8DF] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(profile)}
                      className="p-1.5 rounded-lg text-[#5F6F65] hover:bg-[#F0F4ED] hover:text-[#1C231F] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" /> Edit
                    </button>
                    {profile.relationship !== 'Self' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove ${profile.fullName} from family profiles?`)) {
                            removeProfile(profile.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    )}
                  </div>

                  {isActive ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => navigate({ path: '/search' })}
                      className="text-xs font-bold"
                    >
                      Book for {profile.fullName.split(' ')[0]}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveProfileId(profile.id)}
                      className="text-xs"
                    >
                      Switch to Profile
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ADD / EDIT MODAL */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#E2E8DF] pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#1C231F]">
                    {editingProfile ? 'Edit Family Health Profile' : 'Add New Family Member'}
                  </h3>
                  <p className="text-xs text-[#5F6F65]">Ensure accurate medical tags for safe prescribing & clinical triage</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="h-8 w-8 rounded-full bg-[#F0F4ED] flex items-center justify-center text-[#5F6F65]"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                {/* Full Name */}
                <div>
                  <label className="font-semibold text-[#1C231F] block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Mahfuzur Rahman"
                    className="w-full px-3 py-2 rounded-xl border border-[#C4CFC0] text-xs"
                  />
                </div>

                {/* Relationship & Gender */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#1C231F] block mb-1">Relationship</label>
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-[#C4CFC0] text-xs"
                    >
                      <option value="Self">Self</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-[#1C231F] block mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-[#C4CFC0] text-xs"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Date of Birth & Blood Group */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#1C231F] block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#C4CFC0] text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#1C231F] block mb-1">Blood Group</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-[#C4CFC0] text-xs font-bold text-red-800"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Phone & Emergency Contact */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#1C231F] block mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 17..."
                      className="w-full px-3 py-2 rounded-xl border border-[#C4CFC0] text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#1C231F] block mb-1">Emergency Contact</label>
                    <input
                      type="text"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="+880 18... (Name)"
                      className="w-full px-3 py-2 rounded-xl border border-[#C4CFC0] text-xs"
                    />
                  </div>
                </div>

                {/* Allergies & Conditions */}
                <div>
                  <label className="font-semibold text-rose-900 block mb-1">
                    Known Drug Allergies (comma separated)
                  </label>
                  <input
                    type="text"
                    value={allergiesInput}
                    onChange={(e) => setAllergiesInput(e.target.value)}
                    placeholder="e.g. Penicillin, Sulfa, Aspirin"
                    className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-rose-50/40 text-xs text-rose-950"
                  />
                </div>

                <div>
                  <label className="font-semibold text-amber-900 block mb-1">
                    Chronic Conditions (comma separated)
                  </label>
                  <input
                    type="text"
                    value={chronicConditionsInput}
                    onChange={(e) => setChronicConditionsInput(e.target.value)}
                    placeholder="e.g. Type-2 Diabetes, Hypertension, Asthma"
                    className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-amber-50/40 text-xs text-amber-950"
                  />
                </div>

                <div className="pt-4 border-t border-[#E2E8DF] flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddModalOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="text-xs font-bold"
                  >
                    {editingProfile ? 'Save Changes' : 'Create Profile'}
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
