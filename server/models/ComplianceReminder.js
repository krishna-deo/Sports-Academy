const mongoose = require('mongoose');

const ComplianceReminderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: { type: String, enum: ['policy-review', 'document-expiry', 'audit', 'other'], default: 'other' },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('ComplianceReminder', ComplianceReminderSchema);
