const mongoose = require('mongoose');

const AdmissionApplicationSchema = new mongoose.Schema({
  applicationId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['boy', 'girl', 'male', 'female', 'Boy', 'Girl', 'Male', 'Female'], default: 'female' },
  bloodGroup: { type: String, default: '' },
  aadhaarNumber: { type: String, default: '' },
  photo: { type: String, default: '' },
  
  // Sports & Residency Preferences
  primarySport: { type: String, required: true },
  secondarySports: [{ type: String }],
  residency: { type: String, enum: ['resident', 'non-resident'], default: 'resident' },
  
  // Contact Info
  contact: {
    countryCode: { type: String, default: '+91' },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    address: { type: String, default: '' }
  },

  // Guardian / Parent Info
  guardian: {
    name: { type: String, required: true },
    relationship: { type: String, default: 'Parent' },
    countryCode: { type: String, default: '+91' },
    phone: { type: String, required: true },
    emergencyCountryCode: { type: String, default: '+91' },
    emergencyContact: { type: String, default: '' },
    address: { type: String, default: '' }
  },

  // Education Info
  education: {
    schoolName: { type: String, default: '' },
    className: { type: String, default: '' },
    academicInfo: { type: String, default: '' }
  },

  // Medical Notes / Extra Info
  medicalNotes: { type: String, default: '' },

  // Status Workflow: 'Pending', 'Approved', 'Rejected'
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  rejectionReason: { type: String, default: '' },
  approvedStudentId: { type: String, default: '' },

  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('AdmissionApplication', AdmissionApplicationSchema);
