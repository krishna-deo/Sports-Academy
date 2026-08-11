const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    trim: true,
    default: ''
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Tournament', 'Training Sessions', 'Academy Events', 'Student Achievements', 'Facilities', 'Summer Camp', 'Workshops', 'Others']
  },
  mediaType: { 
    type: String, 
    required: true, 
    enum: ['image', 'video'] 
  },
  originalFile: {
    path: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true }
  },
  optimizedFile: {
    path: { type: String },          // WebP format (Image) or compressed video
    size: { type: Number },
    compressionRatio: { type: Number },
    dimensions: {
      width: { type: Number },
      height: { type: Number }
    },
    // Multi-resolutions for responsive images
    sizes: {
      thumbnail: { type: String },   // 300x300 WebP
      medium: { type: String },      // 800x600 WebP
      large: { type: String }        // 1600x900 WebP
    }
  },
  thumbnail: { 
    type: String, 
    default: '' 
  }, // Custom thumbnail, or auto-generated video frame
  featured: { 
    type: Boolean, 
    default: false 
  },
  visibility: { 
    type: String, 
    default: 'public', 
    enum: ['public', 'private'] 
  },
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
GallerySchema.index({ title: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Gallery', GallerySchema);
