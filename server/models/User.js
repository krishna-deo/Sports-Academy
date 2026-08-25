const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Administrator' },
  email: { type: String, default: 'admin@sportsacademy.com' },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  tempEmail: { type: String, default: null },
  emailVerificationToken: { type: String, default: null },
  emailVerificationExpires: { type: Date, default: null },
  role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
