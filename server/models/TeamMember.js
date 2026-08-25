const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: true },
  image: { type: String, required: true },
  objectPosition: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', TeamMemberSchema);
