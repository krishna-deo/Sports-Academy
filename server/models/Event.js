const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'upcoming', 'closed'], default: 'open' }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
