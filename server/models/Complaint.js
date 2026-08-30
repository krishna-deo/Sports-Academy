const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g. COMP-1001
  reporterName: { type: String, required: true },
  reporterEmail: { type: String, required: true },
  reporterPhone: { type: String, default: '' },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'resolved', 'dismissed'], default: 'pending' },
  internalNotes: { type: String, default: '' } // strictly private
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);
