const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  // Legacy / Compatibility fields
  id: { type: String, required: true, unique: true },
  name: { type: String, default: '' },
  age: { type: Number },
  sport: { type: String, default: '' },
  joined: { type: String, default: '' },
  medalNumber: { type: Number, default: 0 },
  avatar: { type: String, default: '🎓' },

  // New structured fields
  studentId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['boy', 'girl'], default: 'girl' },
  bloodGroup: { type: String, default: '' },
  contact: {
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' }
  },
  guardian: {
    name: { type: String, default: '' },
    relationship: { type: String, default: '' },
    phone: { type: String, default: '' },
    emergencyContact: { type: String, default: '' },
    address: { type: String, default: '' }
  },
  primarySport: { type: String, required: true },
  secondarySports: [{ type: String }],
  batch: { type: String, default: '' },
  coach: { type: String, default: '' },
  residency: { type: String, enum: ['resident', 'non-resident'], default: 'resident' },
  hostelRoom: { type: String, default: '' },
  education: {
    schoolName: { type: String, default: '' },
    className: { type: String, default: '' },
    academicInfo: { type: String, default: '' }
  },
  achievements: [
    {
      title: { type: String, default: '' },
      competition: { type: String, default: '' },
      position: { type: String, default: '' },
      year: { type: Number },
      description: { type: String, default: '' }
    }
  ],
  documents: [
    {
      name: { type: String },
      path: { type: String },
      uploadedAt: { type: Date, default: Date.now }
    }
  ],
  admissionDate: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'On Leave', 'Inactive', 'Graduated'], default: 'Active' },
  isDeleted: { type: Boolean, default: false },
  showOnPublicWebsite: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
