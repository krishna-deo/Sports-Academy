const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g. INC-1001
  type: { type: String, enum: ['injury', 'safeguarding', 'conduct', 'other'], default: 'other' },
  date: { type: Date, required: true, default: Date.now },
  description: { type: String, required: true },
  involvedPeople: { type: String, default: '' },
  actionsTaken: { type: String, default: '' },
  status: { type: String, enum: ['reported', 'investigating', 'closed'], default: 'reported' },
  confidentialNotes: { type: String, default: '' } // strictly private, role restricted
}, { timestamps: true });

module.exports = mongoose.model('Incident', IncidentSchema);
