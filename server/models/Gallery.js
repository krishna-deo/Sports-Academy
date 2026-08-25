const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Events', 'Tournaments', 'Training', 'Achievements', 'Workshops', 'Celebrations', 'Videos', 'Other']
  },
  date: { 
    type: Date, 
    required: true 
  },
  description: { 
    type: String, 
    trim: true,
    default: ''
  },
  location: { 
    type: String, 
    trim: true,
    default: ''
  },
  coverImage: { 
    type: String, 
    default: '' 
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  videoUrl: {
    type: String,
    default: ''
  },
  photos: [
    {
      path: { type: String, required: true },
      size: { type: Number, default: 0 }
    }
  ],
  status: { 
    type: String, 
    default: 'draft', 
    enum: ['draft', 'published'] 
  },
  isDeleted: { 
    type: Boolean, 
    default: false 
  },
  deletedAt: { 
    type: Date, 
    default: null 
  },
  uploadedBy: { 
    type: String, 
    default: 'admin' 
  },
  logs: [
    {
      action: { type: String, required: true }, // 'upload' | 'edit' | 'publish' | 'soft_delete' | 'restore'
      timestamp: { type: Date, default: Date.now },
      operator: { type: String, default: 'admin' }
    }
  ]
}, { timestamps: true });

// Ensure text indexes for search support
GallerySchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Gallery', GallerySchema);
