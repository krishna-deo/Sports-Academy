const mongoose = require('mongoose');

const StoryMilestoneSchema = new mongoose.Schema({
  year: { type: String, default: 'Milestone' },
  title: { type: String, default: 'Academy Journey' },
  subtitle: { type: String, default: '' },
  description: { type: String, required: true },
  image: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('StoryMilestone', StoryMilestoneSchema);
