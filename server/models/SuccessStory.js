const mongoose = require('mongoose');

const SuccessStorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  sport: { type: String, required: true },
  achievement: { type: String, required: true },
  description: { type: String, required: true },
  quote: { type: String, required: true },
  image: { type: String, required: true },
  joined: { type: String, required: true },
  age: { type: Number, required: true },
  medals: { type: Number, default: 0 },
  objectPosition: { type: String, default: 'center' }
}, { timestamps: true });

module.exports = mongoose.model('SuccessStory', SuccessStorySchema);
