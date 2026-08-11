const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema({
  districtMedals: { type: Number, default: 240 },
  stateSelection: { type: Number, default: 15 },
  nationalSelections: { type: Number, default: 120 },
  certifications: { type: Number, default: 4 }
}, { timestamps: true });

module.exports = mongoose.model('Milestone', MilestoneSchema);
