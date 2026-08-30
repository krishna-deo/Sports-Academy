const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const storageService = require('../services/storageService');

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
const Policy = require('../models/Policy');
const Document = require('../models/Document');
const StudentConsent = require('../models/StudentConsent');
const Complaint = require('../models/Complaint');
const Incident = require('../models/Incident');
const ComplianceReminder = require('../models/ComplianceReminder');
const AuditLog = require('../models/AuditLog');
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
      email: adminUser.email || 'admin@sportsacademy.com',
      role: adminUser.role || 'admin'
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
      if (storageService.isCloudinaryActive()) {
        try {
          photoPath = await storageService.uploadToCloud(uploadedFile.path, 'students');
        } catch (err) {
          console.error("Cloudinary upload for student avatar failed:", err);
          const fileExt = path.extname(uploadedFile.originalname) || '.jpg';
          const newFileName = `${studentId}_avatar${fileExt}`;
          const destPath = path.join(__dirname, '..', 'uploads', 'students', newFileName);
          if (!fs.existsSync(path.dirname(destPath))) {
            fs.mkdirSync(path.dirname(destPath), { recursive: true });
          }
          fs.renameSync(uploadedFile.path, destPath);
          photoPath = `/uploads/students/${newFileName}`;
        }
      } else {
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
      if (storageService.isCloudinaryActive()) {
        try {
          student.avatar = await storageService.uploadToCloud(uploadedFile.path, 'students');
        } catch (err) {
          console.error("Cloudinary upload for student avatar failed:", err);
          const fileExt = path.extname(uploadedFile.originalname) || '.jpg';
          const newFileName = `${student.id}_avatar_${Date.now()}${fileExt}`;
          const destPath = path.join(__dirname, '..', 'uploads', 'students', newFileName);
          if (!fs.existsSync(path.dirname(destPath))) {
            fs.mkdirSync(path.dirname(destPath), { recursive: true });
          }
          fs.renameSync(uploadedFile.path, destPath);
          student.avatar = `/uploads/students/${newFileName}`;
        }
      } else {
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
  if (!name || !role || !experience) {
    return res.status(400).json({ error: "Required fields (name, role, experience) are missing." });
  }

  name = sanitizeInput(name).trim();
  role = sanitizeInput(role).trim();
  specialization = specialization ? sanitizeInput(specialization).trim() : role;
  experience = sanitizeInput(experience).trim();
  bio = bio ? sanitizeInput(bio).trim() : '';
  avatar = avatar ? sanitizeInput(avatar).trim() : '👨‍🏫';

  if (avatar && avatar.startsWith('data:image/')) {
    try {
      avatar = await storageService.uploadBase64(avatar, 'coaches');
    } catch (err) {
      console.error("Cloudinary Base64 upload failed for coach avatar:", err);
    }
  }

  try {
    const newCoach = new Coach({ name, role, specialization, experience, bio, avatar });
    await newCoach.save();
    res.status(201).json({ success: true, coach: newCoach });
  } catch (err) {
    console.error("Error saving coach:", err);
    res.status(500).json({ error: "Failed to save coach profile: " + err.message });
  }
});

router.put('/coaches/:name', async (req, res) => {
  let { name, role, specialization, experience, bio, avatar } = req.body;
  if (!name || !role || !experience) {
    return res.status(400).json({ error: "Required fields (name, role, experience) are missing." });
  }

  try {
    const coach = await Coach.findOne({ name: req.params.name });
    if (!coach) return res.status(404).json({ error: "Coach not found." });

    coach.name = sanitizeInput(name).trim();
    coach.role = sanitizeInput(role).trim();
    coach.specialization = specialization ? sanitizeInput(specialization).trim() : role;
    coach.experience = sanitizeInput(experience).trim();
    coach.bio = bio ? sanitizeInput(bio).trim() : '';

    if (avatar && avatar !== coach.avatar) {
      avatar = sanitizeInput(avatar).trim();
      if (avatar.startsWith('data:image/')) {
        try {
          avatar = await storageService.uploadBase64(avatar, 'coaches');
        } catch (err) {
          console.error("Cloudinary Base64 upload failed for coach avatar update:", err);
        }
      }
      coach.avatar = avatar;
    }

    await coach.save();
    res.json({ success: true, coach });
  } catch (err) {
    console.error("Error updating coach:", err);
    res.status(500).json({ error: "Failed to update coach profile: " + err.message });
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

  if (image.startsWith('data:image/')) {
    try {
      image = await storageService.uploadBase64(image, 'team');
    } catch (err) {
      console.error("Cloudinary Base64 upload failed for team member:", err);
    }
  }

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

  if (image.startsWith('data:image/')) {
    try {
      image = await storageService.uploadBase64(image, 'team');
    } catch (err) {
      console.error("Cloudinary Base64 upload failed for team member:", err);
    }
  }

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

  if (image.startsWith('data:image/')) {
    try {
      image = await storageService.uploadBase64(image, 'success-stories');
    } catch (err) {
      console.error("Cloudinary Base64 upload failed for success story:", err);
    }
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

  if (image.startsWith('data:image/')) {
    try {
      image = await storageService.uploadBase64(image, 'success-stories');
    } catch (err) {
      console.error("Cloudinary Base64 upload failed for success story:", err);
    }
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

// --- Administrative Legal & Compliance CMS Routes ---

// Helper to log administrative actions to AuditLog
async function logAdminAction(username, action, target, details) {
  try {
    const logId = `AUD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const newLog = new AuditLog({
      id: logId,
      user: username,
      action,
      target,
      details
    });
    await newLog.save();
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}

// 1. Dashboard Statistics
router.get('/compliance/stats', async (req, res) => {
  try {
    const totalPolicies = await Policy.countDocuments({});
    const publishedPolicies = await Policy.countDocuments({ status: 'published' });
    const draftPolicies = await Policy.countDocuments({ status: 'draft' });
    
    const totalDocuments = await Document.countDocuments({});
    const publicDocs = await Document.countDocuments({ visibility: 'public', status: 'published' });
    const internalDocs = await Document.countDocuments({ visibility: 'internal' });
    const privateDocs = await Document.countDocuments({ visibility: 'private' });
    
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const expiringSoonReminders = await ComplianceReminder.countDocuments({
      status: 'pending',
      dueDate: { $lte: thirtyDaysFromNow }
    });
    
    const pendingConsents = await StudentConsent.countDocuments({ status: 'denied' });
    const openComplaints = await Complaint.countDocuments({ status: { $in: ['pending', 'in-progress'] } });
    const openIncidents = await Incident.countDocuments({ status: { $in: ['reported', 'investigating'] } });
    
    res.json({
      success: true,
      stats: {
        totalPolicies,
        publishedPolicies,
        draftPolicies,
        totalDocuments,
        publicDocs,
        internalDocs,
        privateDocs,
        expiringSoonReminders,
        pendingConsents,
        openComplaints,
        openIncidents
      }
    });
  } catch (err) {
    console.error("Fetch compliance stats error:", err);
    res.status(500).json({ error: "Failed to load compliance statistics." });
  }
});

// 2. Policies Management (CRUD)
router.get('/compliance/policies', async (req, res) => {
  try {
    const policies = await Policy.find({}).sort({ updatedAt: -1 });
    res.json({ success: true, policies });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch policies." });
  }
});

router.post('/compliance/policies', async (req, res) => {
  const { id, title, description, content, status, version, effectiveDate, attachments } = req.body;
  if (!id || !title) {
    return res.status(400).json({ error: "Policy ID and Title are required." });
  }
  
  try {
    const newPolicy = new Policy({
      id: sanitizeInput(id).trim(),
      title: sanitizeInput(title).trim(),
      description: description ? sanitizeInput(description).trim() : '',
      content: content || '',
      status: status || 'draft',
      version: version || '1.0',
      effectiveDate: effectiveDate ? new Date(effectiveDate) : new Date(),
      lastUpdated: new Date(),
      attachments: attachments || []
    });
    
    await newPolicy.save();
    await logAdminAction(req.admin.username, 'policy-create', newPolicy.id, `Created policy: ${newPolicy.title}`);
    res.status(201).json({ success: true, policy: newPolicy });
  } catch (err) {
    console.error("Create policy error:", err);
    res.status(500).json({ error: "Failed to create policy: " + err.message });
  }
});

router.put('/compliance/policies/:id', async (req, res) => {
  const { title, description, content, status, version, effectiveDate, attachments } = req.body;
  try {
    const policy = await Policy.findOne({ id: req.params.id });
    if (!policy) return res.status(404).json({ error: "Policy not found." });
    
    if (version && version !== policy.version) {
      policy.history.push({
        version: policy.version,
        content: policy.content,
        lastUpdated: policy.lastUpdated
      });
    }
    
    if (title !== undefined) policy.title = sanitizeInput(title).trim();
    if (description !== undefined) policy.description = sanitizeInput(description).trim();
    if (content !== undefined) policy.content = content;
    if (status !== undefined) policy.status = status;
    if (version !== undefined) policy.version = version;
    if (effectiveDate !== undefined) policy.effectiveDate = new Date(effectiveDate);
    if (attachments !== undefined) policy.attachments = attachments;
    policy.lastUpdated = new Date();
    
    await policy.save();
    await logAdminAction(req.admin.username, 'policy-update', policy.id, `Updated policy: ${policy.title} to version ${policy.version}`);
    res.json({ success: true, policy });
  } catch (err) {
    console.error("Update policy error:", err);
    res.status(500).json({ error: "Failed to update policy: " + err.message });
  }
});

router.delete('/compliance/policies/:id', async (req, res) => {
  try {
    const result = await Policy.findOneAndDelete({ id: req.params.id });
    if (!result) return res.status(404).json({ error: "Policy not found." });
    
    await logAdminAction(req.admin.username, 'policy-delete', req.params.id, `Deleted policy: ${result.title}`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete policy." });
  }
});

// 3. Document Management (Upload/Delete)
router.get('/compliance/documents', async (req, res) => {
  try {
    const documents = await Document.find({}).sort({ createdAt: -1 });
    res.json({ success: true, documents });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch documents." });
  }
});

router.post('/compliance/documents', upload.single('file'), async (req, res) => {
  const { name, visibility, status, expiryDate } = req.body;
  if (!name || !req.file) {
    return res.status(400).json({ error: "Document Name and File upload are required." });
  }
  
  try {
    let filePath = '';
    if (storageService.isCloudinaryActive()) {
      filePath = await storageService.uploadToCloud(req.file.path, 'documents');
    } else {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      filePath = await storageService.save(req.file.path, 'original', fileName);
    }
    
    const docId = `DOC-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const newDoc = new Document({
      id: docId,
      name: sanitizeInput(name).trim(),
      path: filePath,
      visibility: visibility || 'public',
      status: status || 'published',
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      uploadedAt: new Date()
    });
    
    await newDoc.save();
    await logAdminAction(req.admin.username, 'document-upload', newDoc.id, `Uploaded document: ${newDoc.name}`);
    res.status(201).json({ success: true, document: newDoc });
  } catch (err) {
    console.error("Document upload error:", err);
    res.status(500).json({ error: "Failed to upload document: " + err.message });
  }
});

router.delete('/compliance/documents/:id', async (req, res) => {
  try {
    const doc = await Document.findOne({ id: req.params.id });
    if (!doc) return res.status(404).json({ error: "Document not found." });
    
    await storageService.delete(doc.path);
    await Document.deleteOne({ id: req.params.id });
    
    await logAdminAction(req.admin.username, 'document-delete', req.params.id, `Deleted document: ${doc.name}`);
    res.json({ success: true });
  } catch (err) {
    console.error("Delete document error:", err);
    res.status(500).json({ error: "Failed to delete document." });
  }
});

// 4. Student Consents Management
router.get('/compliance/consents', async (req, res) => {
  try {
    const consents = await StudentConsent.find({}).sort({ updatedAt: -1 });
    res.json({ success: true, consents });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch student consents." });
  }
});

router.post('/compliance/consents', async (req, res) => {
  const { studentId, consentType, status, givenBy, policyVersion, proof } = req.body;
  if (!studentId || !consentType || !status || !givenBy) {
    return res.status(400).json({ error: "studentId, consentType, status, and givenBy are required." });
  }
  
  try {
    let consent = await StudentConsent.findOne({ studentId, consentType });
    const isNew = !consent;
    
    if (isNew) {
      const consentId = `CNS-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      consent = new StudentConsent({
        id: consentId,
        studentId,
        consentType,
        status,
        givenBy: sanitizeInput(givenBy).trim(),
        policyVersion: policyVersion || '1.0',
        proof: proof || '',
        updatedAt: new Date()
      });
    } else {
      consent.status = status;
      consent.givenBy = sanitizeInput(givenBy).trim();
      if (policyVersion) consent.policyVersion = policyVersion;
      if (proof !== undefined) consent.proof = proof;
      consent.updatedAt = new Date();
    }
    
    await consent.save();
    await logAdminAction(
      req.admin.username, 
      isNew ? 'consent-record' : 'consent-update', 
      consent.studentId, 
      `${isNew ? 'Recorded' : 'Updated'} ${consent.consentType} consent for student ${consent.studentId} to status: ${consent.status}`
    );
    res.json({ success: true, consent });
  } catch (err) {
    console.error("Save consent error:", err);
    res.status(500).json({ error: "Failed to save student consent: " + err.message });
  }
});

// 5. Complaints and Grievances Redressal
router.get('/compliance/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find({}).sort({ createdAt: -1 });
    res.json({ success: true, complaints });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch complaints list." });
  }
});

router.put('/compliance/complaints/:id', async (req, res) => {
  const { status, internalNotes } = req.body;
  try {
    const complaint = await Complaint.findOne({ id: req.params.id });
    if (!complaint) return res.status(404).json({ error: "Complaint not found." });
    
    if (status !== undefined) complaint.status = status;
    if (internalNotes !== undefined) complaint.internalNotes = sanitizeInput(internalNotes).trim();
    
    await complaint.save();
    await logAdminAction(req.admin.username, 'complaint-redress', complaint.id, `Updated complaint status to ${complaint.status}`);
    res.json({ success: true, complaint });
  } catch (err) {
    console.error("Redress complaint error:", err);
    res.status(500).json({ error: "Failed to update complaint: " + err.message });
  }
});

// Helper role-checking middleware for Safeguarding & Incident logs (Enforces Superadmin only)
async function requireSuperAdmin(req, res, next) {
  try {
    const adminUser = await User.findOne({ username: req.admin.username });
    if (!adminUser || adminUser.role !== 'superadmin') {
      return res.status(403).json({ error: "Unauthorized access. This action requires superadmin privileges." });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: "Database error during role validation." });
  }
}

// 6. Safeguarding & Incidents (RBAC Superadmin restricted)
router.get('/compliance/incidents', requireSuperAdmin, async (req, res) => {
  try {
    const incidents = await Incident.find({}).sort({ date: -1 });
    res.json({ success: true, incidents });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch incident logs." });
  }
});

router.post('/compliance/incidents', requireSuperAdmin, async (req, res) => {
  const { type, date, description, involvedPeople, actionsTaken, status, confidentialNotes } = req.body;
  if (!description || !date) {
    return res.status(400).json({ error: "Incident date and description are required." });
  }
  
  try {
    const incId = `INC-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const newIncident = new Incident({
      id: incId,
      type: type || 'other',
      date: new Date(date),
      description: sanitizeInput(description).trim(),
      involvedPeople: involvedPeople ? sanitizeInput(involvedPeople).trim() : '',
      actionsTaken: actionsTaken ? sanitizeInput(actionsTaken).trim() : '',
      status: status || 'reported',
      confidentialNotes: confidentialNotes ? sanitizeInput(confidentialNotes).trim() : ''
    });
    
    await newIncident.save();
    await logAdminAction(req.admin.username, 'incident-report', newIncident.id, `Logged safeguarding/incident report: ${newIncident.id}`);
    res.status(201).json({ success: true, incident: newIncident });
  } catch (err) {
    console.error("Create incident error:", err);
    res.status(500).json({ error: "Failed to record incident report: " + err.message });
  }
});

// 7. Compliance Calendar Reminders
router.get('/compliance/reminders', async (req, res) => {
  try {
    const reminders = await ComplianceReminder.find({}).sort({ dueDate: 1 });
    res.json({ success: true, reminders });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch compliance reminders." });
  }
});

router.post('/compliance/reminders', async (req, res) => {
  const { title, description, type, dueDate } = req.body;
  if (!title || !dueDate) {
    return res.status(400).json({ error: "Reminder title and due date are required." });
  }
  
  try {
    const remId = `REM-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const newReminder = new ComplianceReminder({
      id: remId,
      title: sanitizeInput(title).trim(),
      description: description ? sanitizeInput(description).trim() : '',
      type: type || 'other',
      dueDate: new Date(dueDate),
      status: 'pending'
    });
    
    await newReminder.save();
    await logAdminAction(req.admin.username, 'reminder-create', newReminder.id, `Created reminder: ${newReminder.title}`);
    res.status(201).json({ success: true, reminder: newReminder });
  } catch (err) {
    console.error("Create reminder error:", err);
    res.status(500).json({ error: "Failed to create compliance reminder." });
  }
});

router.put('/compliance/reminders/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: "Status is required." });
  
  try {
    const reminder = await ComplianceReminder.findOne({ id: req.params.id });
    if (!reminder) return res.status(404).json({ error: "Reminder not found." });
    
    reminder.status = status;
    await reminder.save();
    await logAdminAction(req.admin.username, 'reminder-update', reminder.id, `Updated reminder status to ${reminder.status}`);
    res.json({ success: true, reminder });
  } catch (err) {
    console.error("Update reminder status error:", err);
    res.status(500).json({ error: "Failed to update compliance reminder." });
  }
});

// 8. Audit Logs
router.get('/compliance/audit-logs', async (req, res) => {
  try {
    const logs = await AuditLog.find({}).sort({ timestamp: -1 }).limit(100);
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch system audit logs." });
  }
});

module.exports = router;
