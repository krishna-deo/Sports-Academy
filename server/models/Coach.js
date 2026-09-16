const mongoose = require('mongoose');

const CoachSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  specialization: { type: String, default: '' },
  experienceYears: { type: Number, default: 0 },
  experienceMonths: { type: Number, default: 0 },
  experience: { type: String, required: true },
  certificationStatus: { type: String, required: true, default: 'SAI Certified / Elite License' },
  bio: { type: String, default: '' },
  avatar: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Coach', CoachSchema);
