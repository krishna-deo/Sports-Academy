const mongoose = require('mongoose');

const CoachSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: String, required: true },
  bio: { type: String, required: true },
  avatar: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Coach', CoachSchema);
