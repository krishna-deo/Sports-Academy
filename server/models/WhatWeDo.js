const mongoose = require('mongoose');

const WhatWeDoSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  tag: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  features: [{ type: String }],
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Hidden'], default: 'Active' },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('WhatWeDo', WhatWeDoSchema);
