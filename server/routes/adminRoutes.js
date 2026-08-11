const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Coach = require('../models/Coach');
const Gallery = require('../models/Gallery');
const Event = require('../models/Event');
const Enquiry = require('../models/Enquiry');
const Milestone = require('../models/Milestone');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const emailService = require('../services/emailService');

function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>]/g, '');
}

// Profile CRUD endpoints
router.get('/profile', async (req, res) => {
  try {
    const adminUser = await User.findOne({ username: req.admin.username });
    if (!adminUser) return res.status(404).json({ error: "Admin user not found." });
    res.json({
      success: true,
      username: adminUser.username,
      name: adminUser.name || 'Administrator',
      email: adminUser.email || 'admin@sportsacademy.com'
    });
  } catch (err) {
    console.error("Fetch profile error:", err);
    res.status(500).json({ error: "Failed to fetch admin profile." });
  }
});

router.put('/profile', async (req, res) => {
  let { name, email, username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }

  username = sanitizeInput(username).trim();
  name = name ? sanitizeInput(name).trim() : 'Administrator';
  email = email ? sanitizeInput(email).trim().toLowerCase() : 'admin@sportsacademy.com';

  try {
    const currentUsername = req.admin.username;
    const adminUser = await User.findOne({ username: currentUsername });
    if (!adminUser) return res.status(404).json({ error: "Admin user not found." });

    // Check if new username conflicts with another user
    if (username !== currentUsername) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: "Username already taken." });
      }
    }

    const emailChanged = email !== (adminUser.email || '').toLowerCase();

    if (emailChanged) {
      // Generate email verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Update other fields but NOT email. Set tempEmail and verification fields
      const updatedUser = await User.findOneAndUpdate(
        { username: currentUsername },
        { 
          $set: { 
            username, 
            name,
            tempEmail: email,
            emailVerificationToken: code,
            emailVerificationExpires: Date.now() + 10 * 60 * 1000
          } 
        },
        { new: true }
      );

      // Send the email verification code
      await emailService.sendEmailVerificationCode(email, code);

      return res.json({
        success: true,
        emailVerificationRequired: true,
        message: "Display name and username updated. Please enter the verification code sent to your new email to verify the change.",
        user: {
          username: updatedUser.username,
          name: updatedUser.name,
          email: adminUser.email || 'admin@sportsacademy.com' // return old email until verified
        }
      });
    } else {
      // Update everything directly
      const updatedUser = await User.findOneAndUpdate(
        { username: currentUsername },
        { $set: { username, name, email } },
        { new: true }
      );

      return res.json({
        success: true,
        emailVerificationRequired: false,
        message: "Profile updated successfully.",
        user: {
          username: updatedUser.username,
          name: updatedUser.name,
          email: updatedUser.email
        }
      });
    }
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Failed to update admin profile." });
  }
});

router.post('/profile/verify-email', async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Verification code is required." });
  }

  try {
    const currentUsername = req.admin.username;
    const user = await User.findOne({ 
      username: currentUsername,
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired verification code." });
    }

    // Finalize email change
    user.email = user.tempEmail;
    user.tempEmail = null;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    res.json({ 
      success: true, 
      message: "Email address verified and updated successfully.",
      email: user.email
    });
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).json({ error: "Failed to verify email code." });
  }
});

router.put('/profile/password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current password and new password are required." });
  }

  try {
    const currentUsername = req.admin.username;
    const adminUser = await User.findOne({ username: currentUsername });
    if (!adminUser) return res.status(404).json({ error: "Admin user not found." });

    const validPass = bcrypt.compareSync(currentPassword, adminUser.password);
    if (!validPass) {
      return res.status(400).json({ error: "Incorrect current password." });
    }

    // Hash and update to new password using findOneAndUpdate to bypass Mongoose validation state
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await User.findOneAndUpdate(
      { username: currentUsername },
      { $set: { password: hashedPassword } }
    );

    res.json({ success: true, message: "Password updated successfully." });
  } catch (err) {
    console.error("Update password error:", err);
    res.status(500).json({ error: "Failed to change password." });
  }
});

// Students CRUD
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find({}).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch student roster." });
  }
});

router.post('/students', async (req, res) => {
  let { name, age, sport, medalNumber, avatar } = req.body;
  if (!name || !age || !sport) {
    return res.status(400).json({ error: "Name, age, and sport are required." });
  }

  name = sanitizeInput(name).trim();
  sport = sanitizeInput(sport).trim();
  const parsedAge = parseInt(age);
  const parsedMedal = parseInt(medalNumber) || 0;
  const sanitizedAvatar = avatar ? sanitizeInput(avatar).trim() : '🎓';

  if (isNaN(parsedAge) || parsedAge < 4 || parsedAge > 30) {
    return res.status(400).json({ error: "Invalid age limits (4-30)." });
  }

  try {
    const newStudent = new Student({
      id: 'ST-' + Math.floor(100 + Math.random() * 900),
      name,
      age: parsedAge,
      sport,
      joined: new Date().toISOString().split('T')[0],
      medalNumber: parsedMedal,
      avatar: sanitizedAvatar
    });
    await newStudent.save();
    res.status(201).json({ success: true, student: newStudent });
  } catch (err) {
    console.error("Error saving student:", err);
    res.status(500).json({ error: "Failed to save student record: " + err.message });
  }
});

router.delete('/students/:id', async (req, res) => {
  try {
    const result = await Student.findOneAndDelete({ id: req.params.id });
    if (!result) return res.status(404).json({ error: "Student record not found." });
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ error: "Failed to delete student record." });
  }
});

// Coaches CRUD
router.post('/coaches', async (req, res) => {
  let { name, role, specialization, experience, bio, avatar } = req.body;
  if (!name || !role || !specialization || !experience) {
    return res.status(400).json({ error: "Required fields are missing." });
  }

  name = sanitizeInput(name).trim();
  role = sanitizeInput(role).trim();
  specialization = sanitizeInput(specialization).trim();
  experience = sanitizeInput(experience).trim();
  bio = bio ? sanitizeInput(bio).trim() : '';
  avatar = avatar ? sanitizeInput(avatar).trim() : '👨‍🏫';

  try {
    const newCoach = new Coach({ name, role, specialization, experience, bio, avatar });
    await newCoach.save();
    res.status(201).json({ success: true, coach: newCoach });
  } catch (err) {
    console.error("Error saving coach:", err);
    res.status(500).json({ error: "Failed to save coach profile: " + err.message });
  }
});

router.delete('/coaches/:name', async (req, res) => {
  try {
    const result = await Coach.findOneAndDelete({ name: req.params.name });
    if (!result) return res.status(404).json({ error: "Coach not found." });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete coach profile." });
  }
});

// Gallery CRUD with multer file uploading & advanced optimization
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const galleryController = require('../controllers/galleryController');

const tempDir = path.join(__dirname, '..', 'uploads', 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const upload = multer({
  dest: tempDir,
  limits: { fileSize: 300 * 1024 * 1024 } // Support video size up to 300 MB
});

const galleryUpload = upload.fields([
  { name: 'media', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

router.get('/gallery', (req, res) => galleryController.getItems(req, res));

router.post('/gallery', galleryUpload, (req, res) => {
  // Map files for uploadItem
  if (req.files && req.files.media) {
    req.file = req.files.media[0];
  }
  galleryController.uploadItem(req, res);
});

router.put('/gallery/:id', (req, res) => galleryController.updateItem(req, res));
router.post('/gallery/:id/publish', (req, res) => galleryController.publishItem(req, res));
router.post('/gallery/:id/restore', (req, res) => galleryController.restoreItem(req, res));
router.delete('/gallery/:id/soft', (req, res) => galleryController.softDeleteItem(req, res));
router.delete('/gallery/:id/permanent', (req, res) => galleryController.deletePermanently(req, res));
router.delete('/gallery/:id', (req, res) => galleryController.softDeleteItem(req, res)); // backwards compatible fallback

// Bulk Actions
router.post('/gallery/bulk-publish', (req, res) => galleryController.bulkPublish(req, res));
router.post('/gallery/bulk-soft-delete', (req, res) => galleryController.bulkSoftDelete(req, res));
router.post('/gallery/bulk-restore', (req, res) => galleryController.bulkRestore(req, res));
router.post('/gallery/bulk-permanent-delete', (req, res) => galleryController.bulkDeletePermanently(req, res));

// Events CRUD
router.post('/events', async (req, res) => {
  let { title, category, date, time, venue, description } = req.body;
  if (!title || !category || !date || !time || !venue) {
    return res.status(400).json({ error: "Required fields are missing." });
  }

  title = sanitizeInput(title).trim();
  category = sanitizeInput(category).trim();
  date = sanitizeInput(date).trim();
  time = sanitizeInput(time).trim();
  venue = sanitizeInput(venue).trim();
  description = description ? sanitizeInput(description).trim() : '';

  try {
    const count = await Event.countDocuments({});
    const newEvent = new Event({
      id: 'evt-' + (count + 1),
      title,
      category,
      date,
      time,
      venue,
      description,
      status: 'open'
    });
    await newEvent.save();
    res.status(201).json({ success: true, event: newEvent });
  } catch (err) {
    res.status(500).json({ error: "Failed to schedule event." });
  }
});

router.delete('/events/:id', async (req, res) => {
  try {
    const result = await Event.findOneAndDelete({ id: req.params.id });
    if (!result) return res.status(404).json({ error: "Event schedule not found." });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete event." });
  }
});

// Enquiries CRUD
router.get('/enquiries', async (req, res) => {
  try {
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch enquiries." });
  }
});

router.delete('/enquiries/:id', async (req, res) => {
  try {
    const result = await Enquiry.findOneAndDelete({ id: req.params.id });
    if (!result) return res.status(404).json({ error: "Enquiry message not found." });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to dismiss enquiry." });
  }
});

// Milestones CRUD
router.post('/milestones', async (req, res) => {
  const { districtMedals, stateSelection, nationalSelections, certifications } = req.body;
  try {
    let milestone = await Milestone.findOne({});
    if (!milestone) {
      milestone = new Milestone({});
    }
    milestone.districtMedals = parseInt(districtMedals) || 0;
    milestone.stateSelection = parseInt(stateSelection) || 0;
    milestone.nationalSelections = parseInt(nationalSelections) || 0;
    milestone.certifications = parseInt(certifications) || 0;

    await milestone.save();
    res.json({ success: true, milestones: milestone });
  } catch (err) {
    res.status(500).json({ error: "Failed to update milestone accomplishments." });
  }
});

module.exports = router;
