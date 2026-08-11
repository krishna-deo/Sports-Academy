const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  sport: { type: String, required: true },
  joined: { type: String, required: true },
  medalNumber: { type: Number, default: 0 },
  avatar: { type: String, default: '🎓' }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
