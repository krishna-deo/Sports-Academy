const mongoose = require('mongoose');

const UpdateSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  category: { 
    type: String, 
    required: true, 
    enum: [
      'Academy News', 
      'Announcement', 
      'Achievement', 
      'Training Update', 
      'Admission Update', 
      'General Update'
    ],
    index: true 
  },
  summary: { type: String, required: true },
  content: { type: String, required: true }, // Full content rich text or markdown
  coverMedia: { type: String }, // Cover image URL
  attachments: { type: [String], default: [] }, // Document attachment paths/URLs
  status: { 
    type: String, 
    enum: ['Draft', 'Published', 'Archived'], 
    default: 'Draft',
    index: true
  },
  visibility: { 
    type: String, 
    enum: ['Public', 'Internal', 'Private'], 
    default: 'Public',
    index: true
  },
  isFeatured: { type: Boolean, default: false },
  publishedAt: { type: Date },
  createdBy: { type: String },
  updatedBy: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Update', UpdateSchema);
