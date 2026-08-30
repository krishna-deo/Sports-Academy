const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // slug: e.g. 'privacy-policy'
  title: { type: String, required: true },
  description: { type: String, default: '' },
  content: { type: String, default: '' }, // HTML formatted content
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  version: { type: String, default: '1.0' },
  effectiveDate: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  attachments: [
    {
      name: { type: String },
      path: { type: String } // File secure URL
    }
  ],
  history: [
    {
      version: { type: String },
      content: { type: String },
      lastUpdated: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Policy', PolicySchema);
