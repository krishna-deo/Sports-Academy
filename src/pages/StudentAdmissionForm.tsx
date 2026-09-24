import React, { useState, useRef } from 'react';
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
  Printer,
  X,
  Camera
} from '@phosphor-icons/react';
import { COUNTRY_CODES } from '../data/countryCodes';

export const StudentAdmissionForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'female',
    bloodGroup: '',
    aadhaarNumber: '',
    photo: '',
    primarySport: 'Football',
    secondarySports: [] as string[],
    residency: 'resident',
    contact: {
      countryCode: '+91',
      phone: '',
      email: '',
      address: ''
    },
    guardian: {
      name: '',
      relationship: 'Parent',
      countryCode: '+91',
      phone: '',
      emergencyCountryCode: '+91',
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

  // Image Cropper States (1:1 Ratio)
  const [showCropperModal, setShowCropperModal] = useState<boolean>(false);
  const [cropperSource, setCropperSource] = useState<string>('');
  const [cropZoom, setCropZoom] = useState<number>(1);
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [isDragMoving, setIsDragMoving] = useState(false);
  const [dragStartPoint, setDragStartPoint] = useState({ x: 0, y: 0 });
  const [dragInitialOffset, setDragInitialOffset] = useState({ x: 0, y: 0 });
  const cropperBoxRef = useRef<HTMLDivElement>(null);

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

  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCropperSource(event.target.result as string);
          setCropZoom(1);
          setCropPosition({ x: 0, y: 0 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const applyCrop = () => {
    if (!cropperSource) return;

    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400; // 1:1 Aspect Ratio
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const containerWidth = cropperBoxRef.current?.offsetWidth || 340;
      const containerHeight = cropperBoxRef.current?.offsetHeight || 340;

      const scale = (containerWidth / img.naturalWidth) * cropZoom;
      const drawWidth = img.naturalWidth * scale;
      const drawHeight = img.naturalHeight * scale;

      const centerX = containerWidth / 2 + cropPosition.x;
      const centerY = containerHeight / 2 + cropPosition.y;

      const drawX = centerX - drawWidth / 2;
      const drawY = centerY - drawHeight / 2;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 400, 400);

      const ratio = 400 / containerWidth;
      ctx.drawImage(img, drawX * ratio, drawY * ratio, drawWidth * ratio, drawHeight * ratio);

      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.92);
      handleInputChange('photo', croppedBase64);
      setShowCropperModal(false);
      setCropperSource('');
    };
    img.src = cropperSource;
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

    // Phone validation (10 digits numeric only)
    const phoneClean = formData.contact.phone.replace(/\D/g, '');
    if (phoneClean.length !== 10) {
      setErrorMessage('Student contact phone number must be exactly 10 numeric digits.');
      return;
    }

    if (!formData.guardian.name.trim() || !formData.guardian.phone.trim()) {
      setErrorMessage('Please enter parent/guardian name and phone number.');
      return;
    }

    // Guardian phone validation (10 digits numeric only)
    const guardianPhoneClean = formData.guardian.phone.replace(/\D/g, '');
    if (guardianPhoneClean.length !== 10) {
      setErrorMessage('Parent/Guardian phone number must be exactly 10 numeric digits.');
      return;
    }

    // Emergency contact validation if entered
    if (formData.guardian.emergencyContact.trim()) {
      const emergencyClean = formData.guardian.emergencyContact.replace(/\D/g, '');
      if (emergencyClean.length !== 10) {
        setErrorMessage('Emergency contact number must be exactly 10 numeric digits.');
        return;
      }
    }

    // Email validation if entered
    if (formData.contact.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.contact.email.trim())) {
        setErrorMessage('Please enter a valid email address (e.g. student@gmail.com).');
        return;
      }
    }

    // Aadhaar number validation if entered
    if (formData.aadhaarNumber.trim()) {
      const aadhaarClean = formData.aadhaarNumber.replace(/\D/g, '');
      if (aadhaarClean.length !== 12) {
        setErrorMessage('Aadhaar card number must be exactly 12 numeric digits.');
        return;
      }
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
                  <div className="flex gap-6 pt-2">
                    {['female', 'male'].map((g) => (
                      <label key={g} className="flex items-center gap-2.5 cursor-pointer text-sm font-semibold text-slate-800">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={formData.gender === g}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                        />
                        {g === 'female' ? 'Female' : 'Male'}
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

                {/* Aadhaar Number (Strictly Confidential - Admin Only) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Aadhaar Number (12 Digits)
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    placeholder="12-digit numeric Aadhaar number"
                    value={formData.aadhaarNumber}
                    onChange={(e) => handleInputChange('aadhaarNumber', e.target.value.replace(/\D/g, '').slice(0, 12))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm outline-none font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    🔒 Strictly confidential — for official academy verification (Admin panel access only).
                  </span>
                </div>

                {/* Profile Photo Upload & 1:1 Aspect Ratio Cropper */}
                <div className="sm:col-span-2 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Student Profile Photo (Aspect Ratio 1:1)
                  </label>
                  {formData.photo ? (
                    <div className="flex items-center gap-4">
                      <img
                        src={formData.photo}
                        alt="Cropped Profile Avatar"
                        className="w-20 h-20 aspect-square object-cover rounded-2xl border-2 border-emerald-500 shadow-md bg-white"
                      />
                      <div>
                        <span className="text-xs text-emerald-700 font-bold bg-emerald-100/80 px-2.5 py-1 rounded-md uppercase tracking-wider inline-block mb-1">
                          ✓ Photo Ready (1:1 Ratio)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setCropperSource('');
                            setShowCropperModal(true);
                          }}
                          className="block text-xs text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer bg-transparent border-none p-0 mt-1"
                        >
                          Change / Adjust Photo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setCropperSource('');
                          setShowCropperModal(true);
                        }}
                        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
                      >
                        <Camera className="w-4 h-4 text-emerald-600" /> Choose & Crop Photo (1:1 Ratio)
                      </button>
                      <span className="text-[11px] text-slate-500">
                        Upload candidate photo and adjust square crop for official ID card.
                      </span>
                    </div>
                  )}
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
                    Mobile Phone Number (10 Digits) <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.contact.countryCode || '+91'}
                      onChange={(e) => handleNestedInputChange('contact', 'countryCode', e.target.value)}
                      className="px-3 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-xs font-bold outline-none bg-slate-50 text-slate-800 cursor-pointer shrink-0 max-w-[115px]"
                      title="Country Code"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={formData.contact.phone}
                      onChange={(e) => handleNestedInputChange('contact', 'phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="flex-1 w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. student@gmail.com"
                    value={formData.contact.email}
                    onChange={(e) => handleNestedInputChange('contact', 'email', e.target.value.trim())}
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
                    Guardian Phone Number (10 Digits) <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.guardian.countryCode || '+91'}
                      onChange={(e) => handleNestedInputChange('guardian', 'countryCode', e.target.value)}
                      className="px-3 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-xs font-bold outline-none bg-slate-50 text-slate-800 cursor-pointer shrink-0 max-w-[115px]"
                      title="Country Code"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={formData.guardian.phone}
                      onChange={(e) => handleNestedInputChange('guardian', 'phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="flex-1 w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Emergency Contact Number (10 Digits)
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.guardian.emergencyCountryCode || '+91'}
                      onChange={(e) => handleNestedInputChange('guardian', 'emergencyCountryCode', e.target.value)}
                      className="px-3 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-xs font-bold outline-none bg-slate-50 text-slate-800 cursor-pointer shrink-0 max-w-[115px]"
                      title="Country Code"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="10-digit alternative number"
                      value={formData.guardian.emergencyContact}
                      onChange={(e) => handleNestedInputChange('guardian', 'emergencyContact', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="flex-1 w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm outline-none font-mono"
                    />
                  </div>
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

      {/* 1:1 Aspect Ratio Photo Cropper Modal */}
      {showCropperModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowCropperModal(false)}>
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden text-left relative flex flex-col max-h-[90vh] my-auto animate-fade-in" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-600" /> Upload & Adjust Profile Photo (1:1 Ratio)
              </h3>
              <button 
                type="button" 
                className="text-slate-400 hover:text-slate-700 p-1 border-none bg-transparent cursor-pointer" 
                onClick={() => setShowCropperModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 flex-1 overflow-y-auto">
              {!cropperSource ? (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50 flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold">
                    📷
                  </div>
                  <p className="text-sm font-bold text-slate-800">Select Student Photo</p>
                  <p className="text-xs text-slate-500">Choose a clear photo from your device to crop into a 1:1 square profile picture.</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleLocalFileSelect} 
                    className="hidden" 
                    id="admission-photo-input" 
                  />
                  <label 
                    htmlFor="admission-photo-input" 
                    className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs cursor-pointer transition-all shadow-md"
                  >
                    Select Local Photo
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs font-semibold text-slate-600">
                    Drag to adjust position & scroll mouse wheel or slider to zoom:
                  </p>

                  {/* 1:1 Square Canvas Container */}
                  <div 
                    ref={cropperBoxRef}
                    className="w-full max-w-[320px] aspect-square mx-auto bg-slate-950 rounded-2xl overflow-hidden relative cursor-grab active:cursor-grabbing border-2 border-emerald-500 shadow-inner select-none"
                    onWheel={(e) => {
                      e.preventDefault();
                      const delta = e.deltaY < 0 ? 0.05 : -0.05;
                      setCropZoom(prev => Math.min(Math.max(parseFloat((prev + delta).toFixed(2)), 0.4), 3.5));
                    }}
                    onMouseDown={(e) => {
                      setIsDragMoving(true);
                      setDragStartPoint({ x: e.clientX, y: e.clientY });
                      setDragInitialOffset({ ...cropPosition });
                    }}
                    onMouseMove={(e) => {
                      if (!isDragMoving) return;
                      const dx = e.clientX - dragStartPoint.x;
                      const dy = e.clientY - dragStartPoint.y;
                      setCropPosition({
                        x: dragInitialOffset.x + dx,
                        y: dragInitialOffset.y + dy
                      });
                    }}
                    onMouseUp={() => setIsDragMoving(false)}
                    onMouseLeave={() => setIsDragMoving(false)}
                  >
                    <img 
                      src={cropperSource} 
                      alt="Cropper Target" 
                      style={{
                        transform: `translate(${cropPosition.x}px, ${cropPosition.y}px) scale(${cropZoom})`,
                        transformOrigin: 'center center',
                        maxWidth: 'none',
                        maxHeight: 'none',
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                      className="pointer-events-none transition-transform duration-75"
                    />

                    {/* 1:1 Grid Overlay */}
                    <div className="absolute inset-0 border border-white/30 pointer-events-none grid grid-cols-3 grid-rows-3">
                      <div className="border-r border-b border-white/20"></div>
                      <div className="border-r border-b border-white/20"></div>
                      <div className="border-b border-white/20"></div>
                      <div className="border-r border-b border-white/20"></div>
                      <div className="border-r border-b border-white/20"></div>
                      <div className="border-b border-white/20"></div>
                      <div className="border-r border-white/20"></div>
                      <div className="border-r border-white/20"></div>
                      <div></div>
                    </div>
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center gap-3 max-w-[320px] mx-auto bg-slate-100 p-3 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-700">Zoom:</span>
                    <input 
                      type="range" 
                      min="0.4" 
                      max="3.5" 
                      step="0.02" 
                      value={cropZoom} 
                      onChange={(e) => setCropZoom(parseFloat(e.target.value))} 
                      className="flex-1 accent-emerald-600 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-600 w-10 text-right">{Math.round(cropZoom * 100)}%</span>
                    <button
                      type="button"
                      onClick={() => { setCropZoom(1); setCropPosition({ x: 0, y: 0 }); }}
                      className="text-[10px] font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 px-2 py-1 rounded-md cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button 
                type="button" 
                onClick={() => {
                  if (cropperSource) {
                    setCropperSource('');
                  } else {
                    setShowCropperModal(false);
                  }
                }}
                className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs cursor-pointer transition-all"
              >
                {cropperSource ? 'Choose Another Photo' : 'Cancel'}
              </button>
              {cropperSource && (
                <button 
                  type="button" 
                  onClick={applyCrop}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-5 rounded-xl text-xs cursor-pointer transition-all border-none shadow-md"
                >
                  Apply 1:1 Crop
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
