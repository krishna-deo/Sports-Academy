const mongoose = require('mongoose');

const StudentConsentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  studentId: { type: String, required: true }, // e.g. ST-101
  consentType: { type: String, enum: ['media', 'medical', 'safeguarding', 'data-sharing'], required: true },
  status: { type: String, enum: ['granted', 'denied', 'withdrawn'], default: 'granted' },
  givenBy: { type: String, required: true }, // parent or student name
  policyVersion: { type: String, default: '1.0' },
  proof: { type: String, default: '' }, // optional proof link/file path
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('StudentConsent', StudentConsentSchema);
