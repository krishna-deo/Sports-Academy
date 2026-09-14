const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Tournament', 'Camp', 'Workshop', 'General Event'],
    index: true 
  },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true }, // Rich text full content
  coverMedia: { type: String }, // Cover image URL
  galleryMedia: { type: [String], default: [] }, // Additional gallery photo URLs
  startDate: { type: Date, required: true, index: true },
  endDate: { type: Date },
  startTime: { type: String },
  endTime: { type: String },
  location: { type: String, required: true }, // e.g. venue
  registrationRequired: { type: Boolean, default: false },
  registrationUrl: { type: String },
  status: { 
    type: String, 
    enum: ['Draft', 'Published', 'Archived', 'Cancelled', 'Postponed'], 
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
  updatedBy: { type: String },

  // Backwards compatibility legacy fields
  date: { type: String }, // fallback string representation of date
  time: { type: String }, // fallback string representation of time
  venue: { type: String } // fallback string representation of location
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
