const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const tempDir = path.join(__dirname, '..', 'uploads', 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const upload = multer({
  dest: tempDir,
  limits: { fileSize: 1024 * 1024 * 1024 } // Support video size up to 1 GB
});

const Student = require('../models/Student');
const Coach = require('../models/Coach');
const Gallery = require('../models/Gallery');
const Event = require('../models/Event');
const Enquiry = require('../models/Enquiry');
const Milestone = require('../models/Milestone');
const User = require('../models/User');
const TeamMember = require('../models/TeamMember');
const SuccessStory = require('../models/SuccessStory');
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

// Student Upload Setup
const protectedDir = path.join(__dirname, '..', 'protected_uploads');
if (!fs.existsSync(protectedDir)) {
  fs.mkdirSync(protectedDir, { recursive: true });
}

const studentUpload = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'documents', maxCount: 10 }
]);

// Students CRUD
router.get('/students', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      sport = '', 
      gender = '', 
      residency = '', 
      batch = '', 
      coach = '', 
      status = '', 
      admissionYear = '',
      showDeleted = 'false'
    } = req.query;

    const query = { isDeleted: showDeleted === 'true' };

    // Search query
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { 'contact.phone': { $regex: search, $options: 'i' } },
        { primarySport: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter params
    if (sport) {
      query.primarySport = { $regex: new RegExp(`^${sport}$`, 'i') };
    }
    if (gender) {
      query.gender = gender;
    }
    if (residency) {
      query.residency = residency;
    }
    if (batch) {
      query.batch = { $regex: new RegExp(`^${batch}$`, 'i') };
    }
    if (coach) {
      query.coach = { $regex: new RegExp(`^${coach}$`, 'i') };
    }
    if (status) {
      query.status = status;
    }
    if (admissionYear) {
      const year = parseInt(admissionYear);
      if (!isNaN(year)) {
        const start = new Date(`${year}-01-01`);
        const end = new Date(`${year}-12-31T23:59:59.999Z`);
        query.admissionDate = { $gte: start, $lte: end };
      }
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const items = await Student.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalItems = await Student.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limitNum);

    // Calculate dynamically age on the fly for returned students
    const mappedItems = items.map(student => {
      const dob = student.dateOfBirth;
      let calculatedAge = 0;
      if (dob) {
        const diff = Date.now() - new Date(dob).getTime();
        calculatedAge = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
      }
      
      const studentObj = student.toObject();
      studentObj.age = calculatedAge;
      return studentObj;
    });

    // Resolve dashboard statistics
    const statsQuery = { isDeleted: false };
    const allActiveStudents = await Student.countDocuments({ ...statsQuery, status: 'Active' });
    const allResidents = await Student.countDocuments({ ...statsQuery, residency: 'resident' });
    const allNonResidents = await Student.countDocuments({ ...statsQuery, residency: 'non-resident' });
    const totalStudents = await Student.countDocuments(statsQuery);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newAdmissions = await Student.countDocuments({ ...statsQuery, admissionDate: { $gte: thirtyDaysAgo } });

    res.json({
      success: true,
      items: mappedItems,
      totalItems,
      totalPages,
      page: pageNum,
      limit: limitNum,
      stats: {
        totalStudents,
        activeStudents: allActiveStudents,
        residentStudents: allResidents,
        nonResidentStudents: allNonResidents,
        newAdmissions
      }
    });

  } catch (err) {
    console.error("Fetch students list error:", err);
    res.status(500).json({ error: "Failed to fetch student list." });
  }
});

router.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findOne({ id: req.params.id });
    if (!student) {
      return res.status(404).json({ error: "Student profile not found." });
    }

    const dob = student.dateOfBirth;
    let calculatedAge = 0;
    if (dob) {
      const diff = Date.now() - new Date(dob).getTime();
      calculatedAge = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    }

    const studentObj = student.toObject();
    studentObj.age = calculatedAge;

    res.json({ success: true, student: studentObj });
  } catch (err) {
    console.error("Get student profile error:", err);
    res.status(500).json({ error: "Failed to fetch student profile details." });
  }
});

router.post('/students', studentUpload, async (req, res) => {
  try {
    let {
      fullName,
      dateOfBirth,
      gender,
      bloodGroup,
      phone,
      email,
      address,
      guardianName,
      guardianRelationship,
      guardianPhone,
      guardianEmergency,
      guardianAddress,
      admissionDate,
      primarySport,
      secondarySports,
      batch,
      coach,
      residency,
      hostelRoom,
      schoolName,
      className,
      academicInfo,
      achievements,
      status,
      showOnPublicWebsite
    } = req.body;

    if (!fullName || !dateOfBirth || !gender || !primarySport || !residency || !admissionDate) {
      return res.status(400).json({ error: "Required fields (FullName, Date of Birth, Gender, Primary Sport, Residency, Admission Date) are missing." });
    }

    const idCount = await Student.countDocuments({});
    const studentId = 'ST-' + (100 + idCount + Math.floor(Math.random() * 50));

    // Handle photo upload (avatar)
    let photoPath = '🎓';
    if (req.files && req.files.avatar && req.files.avatar[0]) {
      const uploadedFile = req.files.avatar[0];
      const studentsPhotosDir = path.join(__dirname, '..', 'uploads', 'students');
      if (!fs.existsSync(studentsPhotosDir)) {
        fs.mkdirSync(studentsPhotosDir, { recursive: true });
      }
      const fileExt = path.extname(uploadedFile.originalname) || '.jpg';
      const newFileName = `${studentId}_avatar${fileExt}`;
      const destPath = path.join(studentsPhotosDir, newFileName);
      fs.renameSync(uploadedFile.path, destPath);
      photoPath = `/uploads/students/${newFileName}`;
    }

    // Handle documents upload
    let documentItems = [];
    if (req.files && req.files.documents) {
      const protectedDir = path.join(__dirname, '..', 'protected_uploads');
      if (!fs.existsSync(protectedDir)) {
        fs.mkdirSync(protectedDir, { recursive: true });
      }

      req.files.documents.forEach((file, index) => {
        const fileExt = path.extname(file.originalname) || '.pdf';
        const docName = req.body[`docName_${index}`] || file.originalname;
        const newFileName = `${studentId}_doc_${Date.now()}_${index}${fileExt}`;
        const destPath = path.join(protectedDir, newFileName);
        fs.renameSync(file.path, destPath);

        documentItems.push({
          name: docName,
          path: `/api/admin/students/documents/${newFileName}`,
          uploadedAt: new Date()
        });
      });
    }

    // Parse achievements
    let parsedAchievements = [];
    if (achievements) {
      try {
        parsedAchievements = typeof achievements === 'string' ? JSON.parse(achievements) : achievements;
      } catch (e) {
        console.error("Failed to parse achievements JSON:", e);
      }
    }

    // Parse secondary sports
    let parsedSecondarySports = [];
    if (secondarySports) {
      try {
        parsedSecondarySports = typeof secondarySports === 'string' ? JSON.parse(secondarySports) : secondarySports;
      } catch (e) {
        if (typeof secondarySports === 'string') {
          parsedSecondarySports = secondarySports.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
    }

    const student = new Student({
      id: studentId,
      studentId: studentId,
      fullName: sanitizeInput(fullName).trim(),
      name: sanitizeInput(fullName).trim(),
      dateOfBirth: new Date(dateOfBirth),
      gender: gender.toLowerCase(),
      bloodGroup: bloodGroup ? sanitizeInput(bloodGroup).trim() : '',
      contact: {
        phone: phone ? sanitizeInput(phone).trim() : '',
        email: email ? sanitizeInput(email).trim().toLowerCase() : '',
        address: address ? sanitizeInput(address).trim() : ''
      },
      guardian: {
        name: guardianName ? sanitizeInput(guardianName).trim() : '',
        relationship: guardianRelationship ? sanitizeInput(guardianRelationship).trim() : '',
        phone: guardianPhone ? sanitizeInput(guardianPhone).trim() : '',
        emergencyContact: guardianEmergency ? sanitizeInput(guardianEmergency).trim() : '',
        address: guardianAddress ? sanitizeInput(guardianAddress).trim() : ''
      },
      primarySport: sanitizeInput(primarySport).trim(),
      sport: sanitizeInput(primarySport).trim(),
      secondarySports: parsedSecondarySports,
      batch: batch ? sanitizeInput(batch).trim() : '',
      coach: coach ? sanitizeInput(coach).trim() : '',
      residency: residency.toLowerCase(),
      hostelRoom: hostelRoom ? sanitizeInput(hostelRoom).trim() : '',
      education: {
        schoolName: schoolName ? sanitizeInput(schoolName).trim() : '',
        className: className ? sanitizeInput(className).trim() : '',
        academicInfo: academicInfo ? sanitizeInput(academicInfo).trim() : ''
      },
      achievements: parsedAchievements,
      documents: documentItems,
      admissionDate: new Date(admissionDate),
      joined: new Date(admissionDate).toISOString().split('T')[0],
      status: status || 'Active',
      avatar: photoPath,
      showOnPublicWebsite: showOnPublicWebsite === 'true' || showOnPublicWebsite === true
    });

    await student.save();
    res.status(201).json({ success: true, student });

  } catch (err) {
    console.error("Create student error:", err);
    res.status(500).json({ error: "Failed to register student record: " + err.message });
  }
});

router.put('/students/:id', studentUpload, async (req, res) => {
  try {
    const student = await Student.findOne({ id: req.params.id });
    if (!student) {
      return res.status(404).json({ error: "Student record not found." });
    }

    let {
      fullName,
      dateOfBirth,
      gender,
      bloodGroup,
      phone,
      email,
      address,
      guardianName,
      guardianRelationship,
      guardianPhone,
      guardianEmergency,
      guardianAddress,
      admissionDate,
      primarySport,
      secondarySports,
      batch,
      coach,
      residency,
      hostelRoom,
      schoolName,
      className,
      academicInfo,
      achievements,
      status,
      showOnPublicWebsite,
      deletedDocPaths
    } = req.body;

    if (req.files && req.files.avatar && req.files.avatar[0]) {
      const uploadedFile = req.files.avatar[0];
      const studentsPhotosDir = path.join(__dirname, '..', 'uploads', 'students');
      if (!fs.existsSync(studentsPhotosDir)) {
        fs.mkdirSync(studentsPhotosDir, { recursive: true });
      }
      const fileExt = path.extname(uploadedFile.originalname) || '.jpg';
      const newFileName = `${student.id}_avatar_${Date.now()}${fileExt}`;
      const destPath = path.join(studentsPhotosDir, newFileName);
      fs.renameSync(uploadedFile.path, destPath);
      student.avatar = `/uploads/students/${newFileName}`;
    }

    if (deletedDocPaths) {
      let toDelete = [];
      try {
        toDelete = typeof deletedDocPaths === 'string' ? JSON.parse(deletedDocPaths) : deletedDocPaths;
      } catch (e) {
        console.error("Failed to parse deletedDocPaths JSON:", e);
      }
      if (toDelete.length > 0) {
        student.documents = student.documents.filter(doc => {
          const match = toDelete.includes(doc.path);
          if (match) {
            const parts = doc.path.split('/');
            const filename = parts[parts.length - 1];
            const filePath = path.join(__dirname, '..', 'protected_uploads', filename);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
          return !match;
        });
      }
    }

    if (req.files && req.files.documents) {
      const protectedDir = path.join(__dirname, '..', 'protected_uploads');
      if (!fs.existsSync(protectedDir)) {
        fs.mkdirSync(protectedDir, { recursive: true });
      }

      req.files.documents.forEach((file, index) => {
        const fileExt = path.extname(file.originalname) || '.pdf';
        const docName = req.body[`docName_${index}`] || file.originalname;
        const newFileName = `${student.id}_doc_${Date.now()}_${index}${fileExt}`;
        const destPath = path.join(protectedDir, newFileName);
        fs.renameSync(file.path, destPath);

        student.documents.push({
          name: docName,
          path: `/api/admin/students/documents/${newFileName}`,
          uploadedAt: new Date()
        });
      });
    }

    if (achievements) {
      try {
        student.achievements = typeof achievements === 'string' ? JSON.parse(achievements) : achievements;
      } catch (e) {
        console.error("Failed to parse achievements JSON:", e);
      }
    }

    if (secondarySports) {
      try {
        student.secondarySports = typeof secondarySports === 'string' ? JSON.parse(secondarySports) : secondarySports;
      } catch (e) {
        if (typeof secondarySports === 'string') {
          student.secondarySports = secondarySports.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
    }

    if (fullName) {
      student.fullName = sanitizeInput(fullName).trim();
      student.name = sanitizeInput(fullName).trim();
    }
    if (dateOfBirth) student.dateOfBirth = new Date(dateOfBirth);
    if (gender) student.gender = gender.toLowerCase();
    if (bloodGroup !== undefined) student.bloodGroup = sanitizeInput(bloodGroup).trim();
    
    if (phone !== undefined) student.contact.phone = sanitizeInput(phone).trim();
    if (email !== undefined) student.contact.email = sanitizeInput(email).trim().toLowerCase();
    if (address !== undefined) student.contact.address = sanitizeInput(address).trim();

    if (guardianName !== undefined) student.guardian.name = sanitizeInput(guardianName).trim();
    if (guardianRelationship !== undefined) student.guardian.relationship = sanitizeInput(guardianRelationship).trim();
    if (guardianPhone !== undefined) student.guardian.phone = sanitizeInput(guardianPhone).trim();
    if (guardianEmergency !== undefined) student.guardian.emergencyContact = sanitizeInput(guardianEmergency).trim();
    if (guardianAddress !== undefined) student.guardian.address = sanitizeInput(guardianAddress).trim();

    if (primarySport) {
      student.primarySport = sanitizeInput(primarySport).trim();
      student.sport = sanitizeInput(primarySport).trim();
    }
    if (batch !== undefined) student.batch = sanitizeInput(batch).trim();
    if (coach !== undefined) student.coach = sanitizeInput(coach).trim();
    if (residency) student.residency = residency.toLowerCase();
    if (hostelRoom !== undefined) student.hostelRoom = sanitizeInput(hostelRoom).trim();

    if (schoolName !== undefined) student.education.schoolName = sanitizeInput(schoolName).trim();
    if (className !== undefined) student.education.className = sanitizeInput(className).trim();
    if (academicInfo !== undefined) student.education.academicInfo = sanitizeInput(academicInfo).trim();

    if (admissionDate) {
      student.admissionDate = new Date(admissionDate);
      student.joined = new Date(admissionDate).toISOString().split('T')[0];
    }
    if (status) student.status = status;
    if (showOnPublicWebsite !== undefined) {
      student.showOnPublicWebsite = showOnPublicWebsite === 'true' || showOnPublicWebsite === true;
    }

    await student.save();
    res.json({ success: true, student });

  } catch (err) {
    console.error("Update student error:", err);
    res.status(500).json({ error: "Failed to update student record: " + err.message });
  }
});

router.delete('/students/:id', async (req, res) => {
  try {
    const student = await Student.findOne({ id: req.params.id });
    if (!student) return res.status(404).json({ error: "Student record not found." });
    
    student.isDeleted = true;
    await student.save();
    res.json({ success: true, message: "Student record soft-deleted successfully." });
  } catch (err) {
    console.error("Error soft-deleting student:", err);
    res.status(500).json({ error: "Failed to deactivate student record." });
  }
});

router.post('/students/:id/restore', async (req, res) => {
  try {
    const student = await Student.findOne({ id: req.params.id });
    if (!student) return res.status(404).json({ error: "Student record not found." });
    
    student.isDeleted = false;
    await student.save();
    res.json({ success: true, message: "Student record restored successfully." });
  } catch (err) {
    console.error("Error restoring student:", err);
    res.status(500).json({ error: "Failed to restore student record." });
  }
});

router.post('/students/bulk-status', async (req, res) => {
  const { ids, status } = req.body;
  if (!ids || !Array.isArray(ids) || !status) {
    return res.status(400).json({ error: "Missing ids or status value." });
  }
  try {
    await Student.updateMany({ id: { $in: ids } }, { $set: { status } });
    res.json({ success: true, message: "Status updated in bulk." });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status in bulk." });
  }
});

router.post('/students/bulk-delete', async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ error: "Missing ids." });
  }
  try {
    await Student.updateMany({ id: { $in: ids } }, { $set: { isDeleted: true } });
    res.json({ success: true, message: "Deactivated selected students in bulk." });
  } catch (err) {
    res.status(500).json({ error: "Failed to deactivate students in bulk." });
  }
});

router.post('/students/bulk-assign', async (req, res) => {
  const { ids, batch, coach } = req.body;
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ error: "Missing ids." });
  }
  try {
    const update = {};
    if (batch !== undefined) update.batch = batch;
    if (coach !== undefined) update.coach = coach;
    await Student.updateMany({ id: { $in: ids } }, { $set: update });
    res.json({ success: true, message: "Batch/Coach assigned in bulk." });
  } catch (err) {
    res.status(500).json({ error: "Failed to perform bulk assignment." });
  }
});

router.get('/students/documents/:filename', async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '..', 'protected_uploads', filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Requested document does not exist." });
  }
  res.sendFile(filePath);
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
const galleryController = require('../controllers/galleryController');

const galleryUpload = upload.fields([
  { name: 'photos', maxCount: 100 },
  { name: 'coverImage', maxCount: 1 }
]);

router.get('/gallery', (req, res) => galleryController.getItems(req, res));
router.get('/gallery/stats', (req, res) => galleryController.getStats(req, res));
router.post('/gallery', galleryUpload, (req, res) => galleryController.uploadItem(req, res));
router.put('/gallery/:id', galleryUpload, (req, res) => galleryController.updateItem(req, res));
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

// Team Members CRUD
router.get('/team', async (req, res) => {
  try {
    const team = await TeamMember.find({}).sort({ createdAt: 1 });
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch founders and directors list." });
  }
});

router.post('/team', async (req, res) => {
  let { name, role, bio, image, objectPosition } = req.body;
  if (!name || !role || !bio || !image) {
    return res.status(400).json({ error: "Name, role, bio, and image are required." });
  }

  name = sanitizeInput(name).trim();
  role = sanitizeInput(role).trim();
  bio = sanitizeInput(bio).trim();
  image = sanitizeInput(image).trim();
  objectPosition = objectPosition ? sanitizeInput(objectPosition).trim() : 'center';

  try {
    const newMember = new TeamMember({
      id: 'TM-' + Math.floor(100 + Math.random() * 900),
      name,
      role,
      bio,
      image,
      objectPosition
    });
    await newMember.save();
    res.status(201).json({ success: true, member: newMember });
  } catch (err) {
    console.error("Error saving team member:", err);
    res.status(500).json({ error: "Failed to add team member: " + err.message });
  }
});

router.put('/team/:id', async (req, res) => {
  let { name, role, bio, image, objectPosition } = req.body;
  if (!name || !role || !bio || !image) {
    return res.status(400).json({ error: "Name, role, bio, and image are required." });
  }

  name = sanitizeInput(name).trim();
  role = sanitizeInput(role).trim();
  bio = sanitizeInput(bio).trim();
  image = sanitizeInput(image).trim();
  objectPosition = objectPosition ? sanitizeInput(objectPosition).trim() : 'center';

  try {
    const updatedMember = await TeamMember.findOneAndUpdate(
      { id: req.params.id },
      { $set: { name, role, bio, image, objectPosition } },
      { new: true }
    );
    if (!updatedMember) return res.status(404).json({ error: "Team member not found." });
    res.json({ success: true, member: updatedMember });
  } catch (err) {
    console.error("Error updating team member:", err);
    res.status(500).json({ error: "Failed to update team member: " + err.message });
  }
});

router.delete('/team/:id', async (req, res) => {
  try {
    const result = await TeamMember.findOneAndDelete({ id: req.params.id });
    if (!result) return res.status(404).json({ error: "Team member not found." });
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting team member:", err);
    res.status(500).json({ error: "Failed to delete team member." });
  }
});

// Success Stories CRUD
router.get('/success-stories', async (req, res) => {
  try {
    const stories = await SuccessStory.find({}).sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch success stories." });
  }
});

router.post('/success-stories', async (req, res) => {
  let { name, sport, achievement, description, quote, image, joined, age, medals, objectPosition } = req.body;
  if (!name || !sport || !achievement || !description || !quote || !image || !joined || !age) {
    return res.status(400).json({ error: "Required fields are missing." });
  }
  
  name = sanitizeInput(name).trim();
  sport = sanitizeInput(sport).trim();
  achievement = sanitizeInput(achievement).trim();
  description = sanitizeInput(description).trim();
  quote = sanitizeInput(quote).trim();
  image = sanitizeInput(image).trim();
  joined = sanitizeInput(joined).trim();
  const parsedAge = parseInt(age);
  const parsedMedals = parseInt(medals) || 0;
  const sanitizedPos = objectPosition ? sanitizeInput(objectPosition).trim() : 'center';

  if (isNaN(parsedAge) || parsedAge < 4 || parsedAge > 40) {
    return res.status(400).json({ error: "Invalid age limit." });
  }

  try {
    const newStory = new SuccessStory({
      id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name,
      sport,
      achievement,
      description,
      quote,
      image,
      joined,
      age: parsedAge,
      medals: parsedMedals,
      objectPosition: sanitizedPos
    });
    await newStory.save();
    res.status(201).json({ success: true, story: newStory });
  } catch (err) {
    console.error("Error saving success story:", err);
    res.status(500).json({ error: "Failed to save success story: " + err.message });
  }
});

router.put('/success-stories/:id', async (req, res) => {
  let { name, sport, achievement, description, quote, image, joined, age, medals, objectPosition } = req.body;
  if (!name || !sport || !achievement || !description || !quote || !image || !joined || !age) {
    return res.status(400).json({ error: "Required fields are missing." });
  }
  
  name = sanitizeInput(name).trim();
  sport = sanitizeInput(sport).trim();
  achievement = sanitizeInput(achievement).trim();
  description = sanitizeInput(description).trim();
  quote = sanitizeInput(quote).trim();
  image = sanitizeInput(image).trim();
  joined = sanitizeInput(joined).trim();
  const parsedAge = parseInt(age);
  const parsedMedals = parseInt(medals) || 0;
  const sanitizedPos = objectPosition ? sanitizeInput(objectPosition).trim() : 'center';

  if (isNaN(parsedAge) || parsedAge < 4 || parsedAge > 40) {
    return res.status(400).json({ error: "Invalid age limit." });
  }

  try {
    const updatedStory = await SuccessStory.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          name,
          sport,
          achievement,
          description,
          quote,
          image,
          joined,
          age: parsedAge,
          medals: parsedMedals,
          objectPosition: sanitizedPos
        }
      },
      { new: true }
    );
    if (!updatedStory) return res.status(404).json({ error: "Success story not found." });
    res.json({ success: true, story: updatedStory });
  } catch (err) {
    console.error("Error updating success story:", err);
    res.status(500).json({ error: "Failed to update success story: " + err.message });
  }
});

router.delete('/success-stories/:id', async (req, res) => {
  try {
    const result = await SuccessStory.findOneAndDelete({ id: req.params.id });
    if (!result) return res.status(404).json({ error: "Success story not found." });
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting success story:", err);
    res.status(500).json({ error: "Failed to delete success story." });
  }
});

module.exports = router;
