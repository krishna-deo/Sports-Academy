import React, { useState } from 'react';
import { 
  User, 
  Trophy, 
  Phone, 
  Users, 
  GraduationCap, 
  CheckCircle, 
  ArrowRight,
  ShieldCheck,
  WarningCircle,
  Copy,
  Printer
} from '@phosphor-icons/react';

export const StudentAdmissionForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'female',
    bloodGroup: '',
    primarySport: 'Football',
    secondarySports: [] as string[],
    residency: 'resident',
    contact: {
      phone: '',
      email: '',
      address: ''
    },
    guardian: {
      name: '',
      relationship: 'Parent',
      phone: '',
      emergencyContact: '',
      address: ''
    },
    education: {
      schoolName: '',
      className: '',
      academicInfo: ''
    },
    medicalNotes: ''
  });

  const [secondaryInput, setSecondaryInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedData, setSubmittedData] = useState<{ applicationId: string; fullName: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const sportsList = [
    'Football',
    'Handball',
    'Athletics',
    'Rugby',
    'Kabaddi'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (section: 'contact' | 'guardian' | 'education', field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addSecondarySport = (sport: string) => {
    if (!sport) return;
    if (!formData.secondarySports.includes(sport)) {
      setFormData(prev => ({
        ...prev,
        secondarySports: [...prev.secondarySports, sport]
      }));
    }
    setSecondaryInput('');
  };

  const removeSecondarySport = (sportToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      secondarySports: prev.secondarySports.filter(s => s !== sportToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter the student\'s full name.');
      return;
    }
    if (!formData.dateOfBirth) {
      setErrorMessage('Please select the date of birth.');
      return;
    }
    if (!formData.primarySport) {
      setErrorMessage('Please select a primary sport.');
      return;
    }
    if (!formData.contact.phone.trim()) {
      setErrorMessage('Please enter student/parent contact phone number.');
      return;
    }
    if (!formData.guardian.name.trim() || !formData.guardian.phone.trim()) {
      setErrorMessage('Please enter parent/guardian name and phone number.');
      return;
    }

    try {
      setIsSubmitting(true);
      const apiEndpoint = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:5000/api/public/admission-applications' 
        : '/api/public/admission-applications';

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const responseText = await response.text();
      let data: any = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseErr) {
        throw new Error('Invalid response from server. Please ensure backend server is running on port 5000.');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application.');
      }

      setSubmittedData({
        applicationId: data.applicationId,
        fullName: formData.fullName
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Server error while submitting application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyApplicationId = () => {
    if (submittedData?.applicationId) {
      navigator.clipboard.writeText(submittedData.applicationId);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-main">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Hero Section */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Official Registration Form
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
              Student Admission Form
            </h1>
            <p className="text-emerald-100 text-base sm:text-lg max-w-2xl leading-relaxed">
              Rani Laxmibai Sports Academy (RLBSA) — Empowering youth through high-performance sports training, academic support, and residential academy programs.
            </p>
          </div>
        </div>

        {/* Confirmation Screen on Success */}
        {submittedData ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-100 text-center animate-fade-in">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle className="w-12 h-12" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Application Submitted Successfully!
            </h2>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Thank you, <strong className="text-slate-800">{submittedData.fullName}</strong>. Your admission request has been recorded and is currently under review by our academy administration.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-lg mx-auto mb-8">
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">
                Application Tracking Reference ID
              </div>
              <div className="text-3xl font-black text-emerald-700 tracking-wider flex items-center justify-center gap-3">
                {submittedData.applicationId}
                <button 
                  onClick={copyApplicationId}
                  className="p-2 text-slate-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50"
                  title="Copy Reference ID"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              {copiedLink && (
                <div className="text-xs font-semibold text-emerald-600 mt-1">Copied to clipboard!</div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button 
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all"
              >
                <Printer className="w-4 h-4" /> Print Application Slip
              </button>
              <a 
                href="#/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-md hover:shadow-emerald-600/20"
              >
                Return to Academy Home <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          /* Admission Application Form */
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-100 space-y-8">
            
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
                <WarningCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>{errorMessage}</div>
              </div>
            )}

            {/* Section 1: Personal Details */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">1. Student Personal Details</h2>
                  <p className="text-xs text-slate-500">Basic details of the candidate student</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Kumari"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Date of Birth <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Gender <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-4 pt-1">
                    {['female', 'male'].map((g) => (
                      <label key={g} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={formData.gender === g}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                        />
                        {g === 'female' ? 'Girl / Female' : 'Boy / Male'}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Blood Group
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm outline-none bg-white"
                  >
                    <option value="">Select Blood Group</option>
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Sports & Residency */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">2. Sports & Training Preferences</h2>
                  <p className="text-xs text-slate-500">Select primary sport discipline & hostel preference</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Primary Sport <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.primarySport}
                    onChange={(e) => handleInputChange('primarySport', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm outline-none bg-white"
                  >
                    {sportsList.map(sport => (
                      <option key={sport} value={sport}>{sport}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Residency Choice <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.residency}
                    onChange={(e) => handleInputChange('residency', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm outline-none bg-white"
                  >
                    <option value="resident">Residential Athlete (Academy Hostel & Food)</option>
                    <option value="non-resident">Day Scholar / Non-Resident (Training Only)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Secondary / Additional Sports Interests
                  </label>
                  <div className="flex gap-2 mb-3">
                    <select
                      value={secondaryInput}
                      onChange={(e) => setSecondaryInput(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none bg-white"
                    >
                      <option value="">Select Sport to add...</option>
                      {sportsList.filter(s => s !== formData.primarySport && !formData.secondarySports.includes(s)).map(sport => (
                        <option key={sport} value={sport}>{sport}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => addSecondarySport(secondaryInput)}
                      className="px-4 py-2.5 bg-slate-800 text-white font-medium text-sm rounded-xl hover:bg-slate-900 transition-all"
                    >
                      Add
                    </button>
                  </div>

                  {formData.secondarySports.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.secondarySports.map((sport) => (
                        <span key={sport} className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-full text-xs font-medium">
                          {sport}
                          <button type="button" onClick={() => removeSecondarySport(sport)} className="text-teal-500 hover:text-teal-900">
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Contact Details */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">3. Contact & Address</h2>
                  <p className="text-xs text-slate-500">Student mobile number, email & home address</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Mobile Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 9876543210"
                    value={formData.contact.phone}
                    onChange={(e) => handleNestedInputChange('contact', 'phone', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. student@gmail.com"
                    value={formData.contact.email}
                    onChange={(e) => handleNestedInputChange('contact', 'email', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Residential Address
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Village / Town, District, State, Pincode"
                    value={formData.contact.address}
                    onChange={(e) => handleNestedInputChange('contact', 'address', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Parent / Guardian Details */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">4. Parent / Guardian Information</h2>
                  <p className="text-xs text-slate-500">Contact details of parent or guardian</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Parent / Guardian Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Singh"
                    value={formData.guardian.name}
                    onChange={(e) => handleNestedInputChange('guardian', 'name', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Relationship
                  </label>
                  <select
                    value={formData.guardian.relationship}
                    onChange={(e) => handleNestedInputChange('guardian', 'relationship', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm outline-none bg-white"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Relative">Relative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Guardian Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 9876543210"
                    value={formData.guardian.phone}
                    onChange={(e) => handleNestedInputChange('guardian', 'phone', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Emergency Contact Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Alternative Phone"
                    value={formData.guardian.emergencyContact}
                    onChange={(e) => handleNestedInputChange('guardian', 'emergencyContact', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Schooling & Health */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">5. Schooling & Medical Notes</h2>
                  <p className="text-xs text-slate-500">School name, class, and medical disclosures</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Current School / College Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Govt High School, Siwan"
                    value={formData.education.schoolName}
                    onChange={(e) => handleNestedInputChange('education', 'schoolName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Class / Grade
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Class 9th / 10th"
                    value={formData.education.className}
                    onChange={(e) => handleNestedInputChange('education', 'className', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Medical Notes / Allergies (If Any)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Mention any existing medical conditions, past injuries, or food allergies..."
                    value={formData.medicalNotes}
                    onChange={(e) => handleInputChange('medicalNotes', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submission Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg hover:shadow-emerald-600/30 transition-all text-base flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting Application...
                  </>
                ) : (
                  <>
                    Submit Admission Application <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
