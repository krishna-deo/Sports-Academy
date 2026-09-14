const mongoose = require('mongoose');

const StoryMilestoneSchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  order: { type: Number, required: true, default: 0 },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('StoryMilestone', StoryMilestoneSchema);
