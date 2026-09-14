const mongoose = require('mongoose');

const EdgeCardSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  tag: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String, default: '#/about/what-we-do' },
  linkText: { type: String, default: 'EXPLORE MORE →' },
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Hidden'], default: 'Active' },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('EdgeCard', EdgeCardSchema);
