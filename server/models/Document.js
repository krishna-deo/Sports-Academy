const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  path: { type: String, required: true }, // secure file link
  visibility: { type: String, enum: ['public', 'internal', 'private'], default: 'public' },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  expiryDate: { type: Date, default: null },
  uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);
