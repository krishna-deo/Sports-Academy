const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user: { type: String, required: true }, // username of action performing admin
  action: { type: String, required: true }, // e.g. 'policy-create'
  target: { type: String, default: '' }, // e.g. 'privacy-policy'
  details: { type: String, default: '' } // description of change
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
