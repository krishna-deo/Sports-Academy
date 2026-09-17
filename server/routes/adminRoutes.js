const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const storageService = require('../services/storageService');

// Safe Mongoose document lookup helper supporting both custom string id and ObjectId _id
async function findDoc(Model, idParam) {
  if (!idParam) return null;
  let doc = null;
  try {
    doc = await Model.findOne({ id: idParam });
  } catch (e) {
    doc = null;
  }
  if (!doc && mongoose.Types.ObjectId.isValid(idParam)) {
    try {
      doc = await Model.findById(idParam);
    } catch (e) {
      doc = null;
    }
  }
  return doc;
}

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
const Update = require('../models/Update');
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
const StoryMilestone = require('../models/StoryMilestone');
const Facility = require('../models/Facility');
const EdgeCard = require('../models/EdgeCard');
const OutreachProgram = require('../models/OutreachProgram');
const VisionMission = require('../models/VisionMission');
const bcrypt = require('bcryptjs');
const emailService = require('../services/emailService');

function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>]/g, '');
}

async function saveBase64File(base64Data, folder) {
  if (!base64Data || !base64Data.startsWith('data:')) {
    return base64Data;
  }

  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid Base64 string');
  }

  const mimeType = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');

  if (storageService.isCloudinaryActive()) {
    const tempFileName = `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const tempFilePath = path.join(__dirname, '..', 'uploads', 'temp', tempFileName);
    fs.writeFileSync(tempFilePath, buffer);
    
    try {
      const url = await storageService.uploadToCloud(tempFilePath, folder);
      return url;
    } catch (err) {
      if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
      throw err;
    }
  } else {
    const extMap = {
      'application/pdf': '.pdf',
      'application/msword': '.doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif'
    };
    const ext = extMap[mimeType] || '.bin';
    const fileName = `${Date.now()}_${Math.floor(100 + Math.random() * 900)}${ext}`;
    const destDir = path.join(__dirname, '..', 'uploads', folder);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    const destPath = path.join(destDir, fileName);
    fs.writeFileSync(destPath, buffer);
    return `/uploads/${folder}/${fileName}`;
  }
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
      const gLower = gender.toLowerCase();
      if (gLower === 'male' || gLower === 'boy') {
        query.gender = { $in: ['male', 'boy', 'Male', 'Boy'] };
      } else if (gLower === 'female' || gLower === 'girl') {
        query.gender = { $in: ['female', 'girl', 'Female', 'Girl'] };
      } else {
        query.gender = gender;
      }
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

    const sanitizeOrDefault = (val) => {
      if (!val || typeof val !== 'string' || !val.trim()) return 'NA';
      return sanitizeInput(val).trim();
    };

    const student = new Student({
      id: studentId,
      studentId: studentId,
      fullName: sanitizeInput(fullName).trim(),
      name: sanitizeInput(fullName).trim(),
      dateOfBirth: new Date(dateOfBirth),
      gender: gender.toLowerCase(),
      bloodGroup: sanitizeOrDefault(bloodGroup),
      contact: {
        phone: sanitizeOrDefault(phone),
        email: email ? sanitizeInput(email).trim().toLowerCase() : 'NA',
        address: sanitizeOrDefault(address)
      },
      guardian: {
        name: sanitizeOrDefault(guardianName),
        relationship: sanitizeOrDefault(guardianRelationship),
        phone: sanitizeOrDefault(guardianPhone),
        emergencyContact: sanitizeOrDefault(guardianEmergency),
        address: sanitizeOrDefault(guardianAddress)
      },
      primarySport: sanitizeInput(primarySport).trim(),
      sport: sanitizeInput(primarySport).trim(),
      secondarySports: parsedSecondarySports,
      batch: sanitizeOrDefault(batch),
      coach: sanitizeOrDefault(coach),
      residency: residency.toLowerCase(),
      hostelRoom: sanitizeOrDefault(hostelRoom),
      education: {
        schoolName: sanitizeOrDefault(schoolName),
        className: sanitizeOrDefault(className),
        academicInfo: sanitizeOrDefault(academicInfo)
      },
      achievements: parsedAchievements,
      documents: documentItems,
      admissionDate: new Date(admissionDate),
      joined: new Date(admissionDate).toISOString().split('T')[0],
      status: status || 'Active',
      avatar: photoPath,
      showOnPublicWebsite: showOnPublicWebsite !== undefined ? (showOnPublicWebsite === 'true' || showOnPublicWebsite === true) : true
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

    const sanitizeOrDefault = (val) => {
      if (!val || typeof val !== 'string' || !val.trim()) return 'NA';
      return sanitizeInput(val).trim();
    };

    if (fullName) {
      student.fullName = sanitizeInput(fullName).trim();
      student.name = sanitizeInput(fullName).trim();
    }
    if (dateOfBirth) student.dateOfBirth = new Date(dateOfBirth);
    if (gender) student.gender = gender.toLowerCase();
    if (bloodGroup !== undefined) student.bloodGroup = sanitizeOrDefault(bloodGroup);
    
    if (!student.contact) student.contact = {};
    if (phone !== undefined) student.contact.phone = sanitizeOrDefault(phone);
    if (email !== undefined) student.contact.email = email && email.trim() ? sanitizeInput(email).trim().toLowerCase() : 'NA';
    if (address !== undefined) student.contact.address = sanitizeOrDefault(address);

    if (!student.guardian) student.guardian = {};
    if (guardianName !== undefined) student.guardian.name = sanitizeOrDefault(guardianName);
    if (guardianRelationship !== undefined) student.guardian.relationship = sanitizeOrDefault(guardianRelationship);
    if (guardianPhone !== undefined) student.guardian.phone = sanitizeOrDefault(guardianPhone);
    if (guardianEmergency !== undefined) student.guardian.emergencyContact = sanitizeOrDefault(guardianEmergency);
    if (guardianAddress !== undefined) student.guardian.address = sanitizeOrDefault(guardianAddress);

    if (primarySport) {
      student.primarySport = sanitizeInput(primarySport).trim();
      student.sport = sanitizeInput(primarySport).trim();
    }
    if (batch !== undefined) student.batch = sanitizeOrDefault(batch);
    if (coach !== undefined) student.coach = sanitizeOrDefault(coach);
    if (residency) student.residency = residency.toLowerCase();
    if (hostelRoom !== undefined) student.hostelRoom = sanitizeOrDefault(hostelRoom);

    if (!student.education) student.education = {};
    if (schoolName !== undefined) student.education.schoolName = sanitizeOrDefault(schoolName);
    if (className !== undefined) student.education.className = sanitizeOrDefault(className);
    if (academicInfo !== undefined) student.education.academicInfo = sanitizeOrDefault(academicInfo);

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
  let { name, role, experienceYears, experienceMonths, experience, certificationStatus, avatar } = req.body;
  if (!name || !role || !certificationStatus || !avatar) {
    return res.status(400).json({ error: "All required fields (name, role, experience, certificationStatus, avatar) are compulsory." });
  }

  name = sanitizeInput(name).trim();
  role = sanitizeInput(role).trim();
  certificationStatus = sanitizeInput(certificationStatus).trim();
  const y = parseInt(experienceYears) || 0;
  const m = parseInt(experienceMonths) || 0;

  if (!experience) {
    if (y > 0 && m > 0) experience = `${y} Years ${m} Months Coaching`;
    else if (y > 0) experience = `${y} Years Coaching`;
    else if (m > 0) experience = `${m} Months Coaching`;
    else experience = '0 Years Coaching';
  } else {
    experience = sanitizeInput(experience).trim();
  }

  avatar = avatar ? sanitizeInput(avatar).trim() : '👨‍🏫';

  if (avatar && avatar.startsWith('data:image/')) {
    try {
      avatar = await storageService.uploadBase64(avatar, 'coaches');
    } catch (err) {
      console.error("Cloudinary Base64 upload failed for coach avatar:", err);
    }
  }

  try {
    const newCoach = new Coach({
      name,
      role,
      specialization: role,
      experienceYears: y,
      experienceMonths: m,
      experience,
      certificationStatus,
      bio: '',
      avatar
    });
    await newCoach.save();
    res.status(201).json({ success: true, coach: newCoach });
  } catch (err) {
    console.error("Error saving coach:", err);
    res.status(500).json({ error: "Failed to save coach profile: " + err.message });
  }
});

router.put('/coaches/:name', async (req, res) => {
  let { name, role, experienceYears, experienceMonths, experience, certificationStatus, avatar } = req.body;
  if (!name || !role || !certificationStatus || !avatar) {
    return res.status(400).json({ error: "All required fields (name, role, experience, certificationStatus, avatar) are compulsory." });
  }

  try {
    const coach = await Coach.findOne({ name: req.params.name });
    if (!coach) return res.status(404).json({ error: "Coach not found." });

    coach.name = sanitizeInput(name).trim();
    coach.role = sanitizeInput(role).trim();
    coach.specialization = coach.role;
    coach.certificationStatus = sanitizeInput(certificationStatus).trim();

    const y = parseInt(experienceYears) || 0;
    const m = parseInt(experienceMonths) || 0;
    coach.experienceYears = y;
    coach.experienceMonths = m;
    if (experience) {
      coach.experience = sanitizeInput(experience).trim();
    } else {
      if (y > 0 && m > 0) coach.experience = `${y} Years ${m} Months Coaching`;
      else if (y > 0) coach.experience = `${y} Years Coaching`;
      else if (m > 0) coach.experience = `${m} Months Coaching`;
      else coach.experience = '0 Years Coaching';
    }

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

// --- Events & Updates Admin Admin Dashboard Stats ---
router.get('/events-updates/stats', async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments({});
    const draftEvents = await Event.countDocuments({ status: 'Draft' });
    
    const totalUpdates = await Update.countDocuments({});
    const publishedUpdates = await Update.countDocuments({ status: 'Published' });
    const draftUpdates = await Update.countDocuments({ status: 'Draft' });

    const now = new Date();
    const allPubEvents = await Event.find({ status: 'Published', visibility: 'Public' });
    
    const upcomingEvents = allPubEvents.filter(e => new Date(e.startDate) >= now.setHours(0,0,0,0)).length;
    const ongoingEvents = allPubEvents.filter(e => {
      const start = new Date(e.startDate);
      const end = e.endDate ? new Date(e.endDate) : new Date(start.getTime() + 24*60*60*1000);
      return start <= now && end >= now;
    }).length;
    const completedEvents = allPubEvents.filter(e => {
      const end = e.endDate ? new Date(e.endDate) : new Date(e.startDate);
      return end < now;
    }).length;

    const upcomingEventsList = await Event.find({ 
      status: 'Published', 
      visibility: 'Public', 
      startDate: { $gte: new Date().setHours(0,0,0,0) } 
    }).sort({ startDate: 1 }).limit(5);

    const recentUpdatesList = await Update.find({
      status: 'Published',
      visibility: 'Public'
    }).sort({ publishedAt: -1, createdAt: -1 }).limit(5);

    const draftEventsList = await Event.find({ status: 'Draft' }).sort({ updatedAt: -1 }).limit(5);
    const draftUpdatesList = await Update.find({ status: 'Draft' }).sort({ updatedAt: -1 }).limit(5);

    res.json({
      success: true,
      stats: {
        totalEvents,
        upcomingEvents,
        ongoingEvents,
        completedEvents,
        draftEvents,
        totalUpdates,
        publishedUpdates,
        draftUpdates
      },
      upcomingEventsList,
      recentUpdatesList,
      draftContentList: [
        ...draftEventsList.map(e => ({ _id: e._id, title: e.title, type: 'Event', updatedAt: e.updatedAt })),
        ...draftUpdatesList.map(u => ({ _id: u._id, title: u.title, type: 'Update', updatedAt: u.updatedAt }))
      ]
    });
  } catch (err) {
    console.error("Fetch events-updates stats error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard statistics." });
  }
});

// --- Events CRUD admin endpoints ---
router.get('/events', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search;
    const category = req.query.category;
    const status = req.query.status;
    const visibility = req.query.visibility;

    const query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    if (status) {
      query.status = status;
    }
    if (visibility) {
      query.visibility = visibility;
    }

    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      events,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error("Admin fetch events error:", err);
    res.status(500).json({ error: "Failed to fetch events." });
  }
});

router.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found." });
    res.json({ success: true, event });
  } catch (err) {
    console.error("Admin fetch single event error:", err);
    res.status(500).json({ error: "Failed to fetch event." });
  }
});

router.post('/events', async (req, res) => {
  let {
    title,
    slug,
    category,
    shortDescription,
    content,
    coverMedia,
    galleryMedia,
    startDate,
    endDate,
    startTime,
    endTime,
    location,
    registrationRequired,
    registrationUrl,
    status,
    visibility,
    isFeatured
  } = req.body;

  if (!title || !slug || !category || !shortDescription || !content || !startDate || !location) {
    return res.status(400).json({ error: "Required fields are missing." });
  }

  // Sanitize
  title = sanitizeInput(title).trim();
  slug = sanitizeInput(slug).trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
  category = sanitizeInput(category).trim();
  shortDescription = sanitizeInput(shortDescription).trim();
  location = sanitizeInput(location).trim();
  if (registrationUrl) registrationUrl = sanitizeInput(registrationUrl).trim();

  // Validate unique slug
  const existing = await Event.findOne({ slug });
  if (existing) {
    return res.status(400).json({ error: "Event URL slug already exists. Please choose a unique title." });
  }

  // Upload cover Base64 if any
  if (coverMedia && coverMedia.startsWith('data:image/')) {
    try {
      coverMedia = await storageService.uploadBase64(coverMedia, 'events/covers');
    } catch (err) {
      console.error("Base64 cover upload failed:", err);
    }
  }

  // Upload gallery Base64 images if any
  let uploadedGallery = [];
  if (Array.isArray(galleryMedia)) {
    for (let img of galleryMedia) {
      if (img.startsWith('data:image/')) {
        try {
          const url = await storageService.uploadBase64(img, 'events/gallery');
          uploadedGallery.push(url);
        } catch (err) {
          console.error("Base64 gallery photo upload failed:", err);
        }
      } else {
        uploadedGallery.push(img);
      }
    }
  }

  try {
    const eventId = 'evt-' + Date.now();
    const newEvent = new Event({
      id: eventId,
      title,
      slug,
      category,
      shortDescription,
      content,
      coverMedia: coverMedia || '/images/hero1.jpeg',
      galleryMedia: uploadedGallery,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      startTime: startTime || '',
      endTime: endTime || '',
      location,
      registrationRequired: !!registrationRequired,
      registrationUrl: registrationRequired ? registrationUrl : '',
      status: status || 'Draft',
      visibility: visibility || 'Public',
      isFeatured: !!isFeatured,
      publishedAt: status === 'Published' ? new Date() : null,
      createdBy: req.admin.username,
      // legacy fields mapping
      date: new Date(startDate).toISOString().split('T')[0],
      time: startTime || 'All Day',
      venue: location
    });

    await newEvent.save();
    await logAdminAction(req.admin.username, 'event-create', newEvent.id, `Created event: ${newEvent.title}`);
    res.status(201).json({ success: true, event: newEvent });
  } catch (err) {
    console.error("Admin save event error:", err);
    res.status(500).json({ error: "Failed to create event." });
  }
});

router.put('/events/:id', async (req, res) => {
  let {
    title,
    slug,
    category,
    shortDescription,
    content,
    coverMedia,
    galleryMedia,
    startDate,
    endDate,
    startTime,
    endTime,
    location,
    registrationRequired,
    registrationUrl,
    status,
    visibility,
    isFeatured
  } = req.body;

  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found." });

    if (slug) {
      slug = sanitizeInput(slug).trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
      // check unique slug if changed
      if (slug !== event.slug) {
        const existing = await Event.findOne({ slug });
        if (existing) {
          return res.status(400).json({ error: "Event URL slug already exists. Please choose a unique title." });
        }
        event.slug = slug;
      }
    }

    if (title) event.title = sanitizeInput(title).trim();
    if (category) event.category = sanitizeInput(category).trim();
    if (shortDescription) event.shortDescription = sanitizeInput(shortDescription).trim();
    if (content) event.content = content;
    if (location) event.location = sanitizeInput(location).trim();
    if (startDate) event.startDate = new Date(startDate);
    if (endDate !== undefined) event.endDate = endDate ? new Date(endDate) : null;
    if (startTime !== undefined) event.startTime = startTime || '';
    if (endTime !== undefined) event.endTime = endTime || '';
    if (registrationRequired !== undefined) event.registrationRequired = !!registrationRequired;
    if (registrationUrl !== undefined) event.registrationUrl = registrationRequired ? sanitizeInput(registrationUrl).trim() : '';
    if (visibility) event.visibility = visibility;
    if (isFeatured !== undefined) event.isFeatured = !!isFeatured;

    // Check status transition
    if (status && status !== event.status) {
      event.status = status;
      if (status === 'Published' && !event.publishedAt) {
        event.publishedAt = new Date();
      }
    }

    // Cover upload Base64
    if (coverMedia && coverMedia.startsWith('data:image/')) {
      try {
        event.coverMedia = await storageService.uploadBase64(coverMedia, 'events/covers');
      } catch (err) {
        console.error("Base64 cover upload failed:", err);
      }
    } else if (coverMedia !== undefined) {
      event.coverMedia = coverMedia;
    }

    // Gallery upload Base64
    if (Array.isArray(galleryMedia)) {
      let uploadedGallery = [];
      for (let img of galleryMedia) {
        if (img.startsWith('data:image/')) {
          try {
            const url = await storageService.uploadBase64(img, 'events/gallery');
            uploadedGallery.push(url);
          } catch (err) {
            console.error("Base64 gallery photo upload failed:", err);
          }
        } else {
          uploadedGallery.push(img);
        }
      }
      event.galleryMedia = uploadedGallery;
    }

    // legacy fields update
    if (startDate) event.date = new Date(startDate).toISOString().split('T')[0];
    event.time = event.startTime || 'All Day';
    event.venue = event.location;
    event.updatedBy = req.admin.username;

    await event.save();
    await logAdminAction(req.admin.username, 'event-update', event.id, `Updated event: ${event.title}`);
    res.json({ success: true, event });
  } catch (err) {
    console.error("Admin update event error:", err);
    res.status(500).json({ error: "Failed to update event." });
  }
});

router.delete('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found." });

    // Clean up cover image and gallery images from storage service
    if (event.coverMedia) {
      await storageService.delete(event.coverMedia);
    }
    if (event.galleryMedia && event.galleryMedia.length > 0) {
      for (let img of event.galleryMedia) {
        await storageService.delete(img);
      }
    }

    await Event.findByIdAndDelete(req.params.id);
    await logAdminAction(req.admin.username, 'event-delete', event.id, `Deleted event: ${event.title}`);
    res.json({ success: true, message: "Event deleted successfully." });
  } catch (err) {
    console.error("Admin delete event error:", err);
    res.status(500).json({ error: "Failed to delete event." });
  }
});

// --- Updates CRUD admin endpoints ---
router.get('/updates', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search;
    const category = req.query.category;
    const status = req.query.status;
    const visibility = req.query.visibility;

    const query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    if (status) {
      query.status = status;
    }
    if (visibility) {
      query.visibility = visibility;
    }

    const total = await Update.countDocuments(query);
    const updates = await Update.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      updates,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error("Admin fetch updates error:", err);
    res.status(500).json({ error: "Failed to fetch updates." });
  }
});

router.get('/updates/:id', async (req, res) => {
  try {
    const update = await Update.findById(req.params.id);
    if (!update) return res.status(404).json({ error: "Update not found." });
    res.json({ success: true, update });
  } catch (err) {
    console.error("Admin fetch single update error:", err);
    res.status(500).json({ error: "Failed to fetch update." });
  }
});

router.post('/updates', async (req, res) => {
  let {
    title,
    slug,
    category,
    summary,
    content,
    coverMedia,
    attachments,
    status,
    visibility,
    isFeatured
  } = req.body;

  if (!title || !slug || !category || !summary || !content) {
    return res.status(400).json({ error: "Required fields are missing." });
  }

  title = sanitizeInput(title).trim();
  slug = sanitizeInput(slug).trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
  category = sanitizeInput(category).trim();
  summary = sanitizeInput(summary).trim();

  const existing = await Update.findOne({ slug });
  if (existing) {
    return res.status(400).json({ error: "Update URL slug already exists. Please choose a unique title." });
  }

  // Cover image Base64
  if (coverMedia && coverMedia.startsWith('data:image/')) {
    try {
      coverMedia = await saveBase64File(coverMedia, 'updates/covers');
    } catch (err) {
      console.error("Base64 cover upload failed:", err);
    }
  }

  // Attachments upload Base64
  let uploadedAttachments = [];
  if (Array.isArray(attachments)) {
    for (let att of attachments) {
      if (att.startsWith('data:')) {
        try {
          const url = await saveBase64File(att, 'updates/attachments');
          uploadedAttachments.push(url);
        } catch (err) {
          console.error("Attachment upload failed:", err);
        }
      } else {
        uploadedAttachments.push(att);
      }
    }
  }

  try {
    const updateId = 'upd-' + Date.now();
    const newUpdate = new Update({
      id: updateId,
      title,
      slug,
      category,
      summary,
      content,
      coverMedia: coverMedia || '',
      attachments: uploadedAttachments,
      status: status || 'Draft',
      visibility: visibility || 'Public',
      isFeatured: !!isFeatured,
      publishedAt: status === 'Published' ? new Date() : null,
      createdBy: req.admin.username
    });

    await newUpdate.save();
    await logAdminAction(req.admin.username, 'update-create', newUpdate.id, `Created update: ${newUpdate.title}`);
    res.status(201).json({ success: true, update: newUpdate });
  } catch (err) {
    console.error("Admin save update error:", err);
    res.status(500).json({ error: "Failed to create update." });
  }
});

router.put('/updates/:id', async (req, res) => {
  let {
    title,
    slug,
    category,
    summary,
    content,
    coverMedia,
    attachments,
    status,
    visibility,
    isFeatured
  } = req.body;

  try {
    const update = await Update.findById(req.params.id);
    if (!update) return res.status(404).json({ error: "Update not found." });

    if (slug) {
      slug = sanitizeInput(slug).trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
      if (slug !== update.slug) {
        const existing = await Update.findOne({ slug });
        if (existing) {
          return res.status(400).json({ error: "Update URL slug already exists. Please choose a unique title." });
        }
        update.slug = slug;
      }
    }

    if (title) update.title = sanitizeInput(title).trim();
    if (category) update.category = sanitizeInput(category).trim();
    if (summary) update.summary = sanitizeInput(summary).trim();
    if (content) update.content = content;
    if (attachments !== undefined) {
      let uploadedAttachments = [];
      if (Array.isArray(attachments)) {
        for (let att of attachments) {
          if (att.startsWith('data:')) {
            try {
              const url = await saveBase64File(att, 'updates/attachments');
              uploadedAttachments.push(url);
            } catch (err) {
              console.error("Attachment upload failed:", err);
            }
          } else {
            uploadedAttachments.push(att);
          }
        }
      }
      update.attachments = uploadedAttachments;
    }
    if (visibility) update.visibility = visibility;
    if (isFeatured !== undefined) update.isFeatured = !!isFeatured;

    // Check status transition
    if (status && status !== update.status) {
      update.status = status;
      if (status === 'Published' && !update.publishedAt) {
        update.publishedAt = new Date();
      }
    }

    // Cover upload Base64
    if (coverMedia && coverMedia.startsWith('data:image/')) {
      try {
        update.coverMedia = await saveBase64File(coverMedia, 'updates/covers');
      } catch (err) {
        console.error("Base64 cover upload failed:", err);
      }
    } else if (coverMedia !== undefined) {
      update.coverMedia = coverMedia;
    }

    update.updatedBy = req.admin.username;

    await update.save();
    await logAdminAction(req.admin.username, 'update-update', update.id, `Updated update: ${update.title}`);
    res.json({ success: true, update });
  } catch (err) {
    console.error("Admin update update error:", err);
    res.status(500).json({ error: "Failed to update update." });
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
    let team = await TeamMember.find({}).sort({ createdAt: 1 });
    if (team.length === 0) {
      const defaultTeam = [
        {
          id: 'TM-001',
          name: 'Mr. Sanjay Pathak',
          role: 'Founder & Director',
          bio: 'Sanjay Pathak is a transformative leader, educator, and the driving force behind a grassroots sports revolution in rural Bihar.\nA geography teacher by profession, he founded the Rani Laxmibai Sports Academy Foundation in 2009 with a powerful vision: to weaponise sports against deep-seated gender discrimination and generational poverty.',
          image: '/images/Mr. Sanjay Pathak (Founder and Director).jpeg',
          objectPosition: 'center 15%'
        }
      ];
      await TeamMember.insertMany(defaultTeam);
      team = await TeamMember.find({}).sort({ createdAt: 1 });
    }
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
    const member = await findDoc(TeamMember, req.params.id);
    if (!member) return res.status(404).json({ error: "Team member not found." });
    member.name = name;
    member.role = role;
    member.bio = bio;
    member.image = image;
    member.objectPosition = objectPosition;
    await member.save();
    res.json({ success: true, member });
  } catch (err) {
    console.error("Error updating team member:", err);
    res.status(500).json({ error: "Failed to update team member: " + err.message });
  }
});

router.delete('/team/:id', async (req, res) => {
  try {
    const isPermanent = req.query.permanent === 'true';
    const member = await findDoc(TeamMember, req.params.id);
    if (!member) return res.status(404).json({ error: "Team member not found." });

    if (isPermanent) {
      await TeamMember.deleteOne({ _id: member._id });
      await logAdminAction(req.admin.username, 'team-permanent-delete', req.params.id, `Permanently deleted team member: ${member.name}`);
      return res.json({ success: true, message: "Team member permanently deleted." });
    } else {
      member.isDeleted = true;
      await member.save();
      await logAdminAction(req.admin.username, 'team-soft-delete', req.params.id, `Moved team member to trash: ${member.name}`);
      return res.json({ success: true, message: "Team member moved to trash." });
    }
  } catch (err) {
    console.error("Error deleting team member:", err);
    res.status(500).json({ error: "Failed to delete team member." });
  }
});

router.put('/team/:id/restore', async (req, res) => {
  try {
    const member = await findDoc(TeamMember, req.params.id);
    if (!member) return res.status(404).json({ error: "Team member not found." });

    member.isDeleted = false;
    await member.save();
    await logAdminAction(req.admin.username, 'team-restore', req.params.id, `Restored team member: ${member.name}`);
    res.json({ success: true, member });
  } catch (err) {
    console.error("Error restoring team member:", err);
    res.status(500).json({ error: "Failed to restore team member." });
  }
});

// Success Stories CRUD
router.get('/success-stories', async (req, res) => {
  try {
    let stories = await SuccessStory.find({}).sort({ createdAt: -1 });
    if (stories.length === 0) {
      const defaultStories = [
        {
          id: 'amrit-kumari',
          name: 'Amrit Kumari',
          sport: 'Football',
          achievement: 'National U-17 Player',
          description: 'Trained at RLBSA and went on to represent the state and national youth teams.',
          quote: 'RLBSA gave me the wings to pursue my dreams when no one else believed.',
          image: '/images/success_story_1.png',
          joined: '2018',
          age: 17,
          medals: 3,
          objectPosition: 'center'
        }
      ];
      await SuccessStory.insertMany(defaultStories);
      stories = await SuccessStory.find({}).sort({ createdAt: -1 });
    }
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

router.delete('/success-stories/:id', async (req, res) => {
  try {
    const isPermanent = req.query.permanent === 'true';
    const story = await findDoc(SuccessStory, req.params.id);
    if (!story) return res.status(404).json({ error: "Success story not found." });

    if (isPermanent) {
      await SuccessStory.deleteOne({ _id: story._id });
      await logAdminAction(req.admin.username, 'success-story-permanent-delete', req.params.id, `Permanently deleted success story: ${story.name}`);
      return res.json({ success: true, message: "Success story permanently deleted." });
    } else {
      story.isDeleted = true;
      await story.save();
      await logAdminAction(req.admin.username, 'success-story-soft-delete', req.params.id, `Moved success story to trash: ${story.name}`);
      return res.json({ success: true, message: "Success story moved to trash." });
    }
  } catch (err) {
    console.error("Error deleting success story:", err);
    res.status(500).json({ error: "Failed to delete success story." });
  }
});

router.put('/success-stories/:id/restore', async (req, res) => {
  try {
    const story = await findDoc(SuccessStory, req.params.id);
    if (!story) return res.status(404).json({ error: "Success story not found." });

    story.isDeleted = false;
    await story.save();
    await logAdminAction(req.admin.username, 'success-story-restore', req.params.id, `Restored success story: ${story.name}`);
    res.json({ success: true, story });
  } catch (err) {
    console.error("Error restoring success story:", err);
    res.status(500).json({ error: "Failed to restore success story." });
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

// --- Story Milestone CRUD ---
router.post('/story-milestones/import-defaults', async (req, res) => {
  try {
    const count = await StoryMilestone.countDocuments({});
    if (count > 0) {
      return res.status(400).json({ error: "Milestones already exist in the database." });
    }
    
    const defaultStories = [
      {
        year: '2009',
        title: 'The Beginning',
        subtitle: 'Milestone Year',
        description: 'Rani Laxmibai Sports Academy (RLBSA) was established in Laxmipur, Siwan, Bihar with a vision to identify and nurture rural talent, especially girls, through sports and education.',
        image: '/images/hero1.jpeg',
        order: 1
      },
      {
        year: '2010',
        title: 'First Batch',
        subtitle: 'First Cohort',
        description: 'Our first cohort of 15 girls began training in athletics and handball, defying local societal norms to pursue active sports leadership careers.',
        image: '/images/player_rahul.png',
        order: 2
      },
      {
        year: '2016',
        title: 'National Recognition',
        subtitle: 'National Stage',
        description: 'Several academy athletes earned opportunities to represent India and their respective states in national and international competitions, bringing recognition to rural Bihar.',
        image: '/images/about_rlbsa.jpeg',
        order: 3
      },
      {
        year: '2020',
        title: 'Campus Completed',
        subtitle: 'Campus Completed',
        description: 'A major milestone was achieved with the completion of a residential hostel facility accommodating approximately 50 children, while another 50 non-residential students continued receiving support.',
        image: '/images/hero1.jpeg',
        order: 4
      },
      {
        year: '2021',
        title: 'Holistic Athlete Development',
        subtitle: 'Growth Beyond Sports',
        description: 'Beyond sports coaching, the academy expanded focus to formal education, English communication, public speaking, personality development, and life skills training.',
        image: '/images/player_rahul.png',
        order: 5
      },
      {
        year: '2022',
        title: 'Growing Partnerships',
        subtitle: 'Community Partners',
        description: 'Support from organizations such as the National Foundation for India, Garnet Foundation, Nalanda Charitable Foundation, and IMA Siwan enabled the academy to strengthen facilities.',
        image: '/images/about_rlbsa.jpeg',
        order: 6
      },
      {
        year: 'Today',
        title: 'Transforming Rural Talent',
        subtitle: 'Empowering Bihar',
        description: 'Today, RLBSA supports over 100 young athletes through free coaching, accommodation, meals, education, and tournament exposure, empowering rural youth, especially girls.',
        image: '/images/hero2.jpg',
        order: 7
      }
    ];
    
    await StoryMilestone.insertMany(defaultStories);
    await logAdminAction(req.admin.username, 'story-milestones-import-defaults', 'all', 'Imported 7 default story milestones');
    res.status(201).json({ success: true, message: "Default milestones imported successfully." });
  } catch (err) {
    console.error("Import default milestones error:", err);
    res.status(500).json({ error: "Failed to import default milestones." });
  }
});

router.get('/story-milestones', async (req, res) => {
  try {
    let milestones = await StoryMilestone.find({}).sort({ order: 1 });
    if (milestones.length === 0) {
      const defaultMilestones = [
        {
          year: '2009',
          title: 'The Beginning',
          subtitle: 'Milestone Year',
          description: 'Rani Laxmibai Sports Academy (RLBSA) was established in Laxmipur, Siwan, Bihar with a vision to identify and nurture rural talent, especially girls, through sports and education.',
          image: '/images/hero1.jpeg',
          order: 1
        },
        {
          year: '2010',
          title: 'First Batch',
          subtitle: 'First Cohort',
          description: 'Our first cohort of 15 girls began training in athletics and handball, defying local societal norms to pursue active sports leadership careers.',
          image: '/images/player_rahul.png',
          order: 2
        },
        {
          year: '2016',
          title: 'National Recognition',
          subtitle: 'National Stage',
          description: 'Several academy athletes earned opportunities to represent India and their respective states in national and international competitions, bringing recognition to rural Bihar.',
          image: '/images/about_rlbsa.jpeg',
          order: 3
        },
        {
          year: '2020',
          title: 'Campus Completed',
          subtitle: 'Campus Completed',
          description: 'A major milestone was achieved with the completion of a residential hostel facility accommodating approximately 50 children, while another 50 non-residential students continued receiving support.',
          image: '/images/hero1.jpeg',
          order: 4
        },
        {
          year: '2021',
          title: 'Holistic Athlete Development',
          subtitle: 'Growth Beyond Sports',
          description: 'Beyond sports coaching, the academy expanded focus to formal education, English communication, public speaking, personality development, and life skills training.',
          image: '/images/player_rahul.png',
          order: 5
        },
        {
          year: '2022',
          title: 'Growing Partnerships',
          subtitle: 'Community Partners',
          description: 'Support from organizations such as the National Foundation for India, Garnet Foundation, Nalanda Charitable Foundation, and IMA Siwan enabled the academy to strengthen facilities.',
          image: '/images/about_rlbsa.jpeg',
          order: 6
        },
        {
          year: 'Today',
          title: 'Transforming Rural Talent',
          subtitle: 'Empowering Bihar',
          description: 'Today, RLBSA supports over 100 young athletes through free coaching, accommodation, meals, education, and tournament exposure, empowering rural youth, especially girls.',
          image: '/images/hero2.jpg',
          order: 7
        }
      ];
      await StoryMilestone.insertMany(defaultMilestones);
      milestones = await StoryMilestone.find({}).sort({ order: 1 });
    }
    res.json({ success: true, milestones });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch milestones." });
  }
});

router.post('/story-milestones', async (req, res) => {
  let { year, title, subtitle, description, image, order } = req.body;
  if (!description) {
    return res.status(400).json({ error: "Description content is required." });
  }
  
  if (image && image.startsWith('data:image/')) {
    try {
      image = await storageService.uploadBase64(image, 'story-milestones');
    } catch (err) {
      console.error("Base64 upload failed for story milestone:", err);
    }
  }
  
  try {
    const milestone = new StoryMilestone({
      year: year ? sanitizeInput(year).trim() : '',
      title: title ? sanitizeInput(title).trim() : '',
      subtitle: subtitle ? sanitizeInput(subtitle).trim() : '',
      description: sanitizeInput(description).trim(),
      image: image || '/images/hero1.jpeg',
      order: Number(order) || 0
    });
    await milestone.save();
    await logAdminAction(req.admin.username, 'story-milestone-create', milestone.id, `Created story milestone ${milestone.year}: ${milestone.title}`);
    res.status(201).json({ success: true, milestone });
  } catch (err) {
    console.error("Create milestone error:", err);
    res.status(500).json({ error: "Failed to create milestone." });
  }
});

router.put('/story-milestones/:id', async (req, res) => {
  let { year, title, subtitle, description, image, order } = req.body;
  
  if (image && image.startsWith('data:image/')) {
    try {
      image = await storageService.uploadBase64(image, 'story-milestones');
    } catch (err) {
      console.error("Base64 upload failed for story milestone:", err);
    }
  }
  
  try {
    const milestone = await findDoc(StoryMilestone, req.params.id);
    if (!milestone) return res.status(404).json({ error: "Milestone not found." });
    
    if (year) milestone.year = sanitizeInput(year).trim();
    if (title) milestone.title = sanitizeInput(title).trim();
    if (subtitle) milestone.subtitle = sanitizeInput(subtitle).trim();
    if (description) milestone.description = sanitizeInput(description).trim();
    if (image) milestone.image = image;
    if (order !== undefined) milestone.order = Number(order) || 0;
    
    await milestone.save();
    await logAdminAction(req.admin.username, 'story-milestone-update', milestone.id, `Updated story milestone ${milestone.year}: ${milestone.title}`);
    res.json({ success: true, milestone });
  } catch (err) {
    console.error("Update milestone error:", err);
    res.status(500).json({ error: "Failed to update milestone." });
  }
});

router.delete('/story-milestones/:id', async (req, res) => {
  try {
    const isPermanent = req.query.permanent === 'true';
    const milestone = await findDoc(StoryMilestone, req.params.id);
    if (!milestone) return res.status(404).json({ error: "Milestone not found." });

    if (isPermanent) {
      await StoryMilestone.deleteOne({ _id: milestone._id });
      await logAdminAction(req.admin.username, 'story-milestone-permanent-delete', req.params.id, `Permanently deleted story milestone ${milestone.year}: ${milestone.title}`);
      return res.json({ success: true, message: "Milestone permanently deleted." });
    } else {
      milestone.isDeleted = true;
      await milestone.save();
      await logAdminAction(req.admin.username, 'story-milestone-soft-delete', req.params.id, `Moved story milestone to trash: ${milestone.title}`);
      return res.json({ success: true, message: "Milestone moved to trash." });
    }
  } catch (err) {
    console.error("Delete milestone error:", err);
    res.status(500).json({ error: "Failed to delete milestone." });
  }
});

router.put('/story-milestones/:id/restore', async (req, res) => {
  try {
    const milestone = await findDoc(StoryMilestone, req.params.id);
    if (!milestone) return res.status(404).json({ error: "Milestone not found." });

    milestone.isDeleted = false;
    await milestone.save();
    await logAdminAction(req.admin.username, 'story-milestone-restore', req.params.id, `Restored story milestone: ${milestone.title}`);
    res.json({ success: true, milestone });
  } catch (err) {
    console.error("Restore milestone error:", err);
    res.status(500).json({ error: "Failed to restore milestone." });
  }
});

// FACILITIES MANAGEMENT ENDPOINTS
router.get('/facilities', async (req, res) => {
  try {
    let facilities = await Facility.find({}).sort({ order: 1 });
    if (facilities.length === 0) {
      const defaultFacilities = [
        { id: 'fac-1', title: 'Sports Infrastructure', tag: 'Olympic Standard', image: '/images/sports_training_card.jpg', description: 'Vast outdoor turf, international track fields, court complexes, and specialized indoor arenas built for high-performance athletic training.', order: 1, status: 'Active' },
        { id: 'fac-2', title: 'Gym & Fitness Center', tag: 'Advanced Gear', image: '/images/gym_card.png', description: 'State-of-the-art strength and conditioning facility equipped with elite weight training, cardio, and performance tracking systems.', order: 2, status: 'Active' },
        { id: 'fac-3', title: 'Hostel & Accommodation', tag: 'Residential', image: '/images/hostel_card.png', description: 'Secure, hygienic, and comfortable residential dormitories for student-athletes with dedicated study zones and lounge areas.', order: 3, status: 'Active' },
        { id: 'fac-4', title: 'Mess & Dining', tag: 'Nutritional Diet', image: '/images/nutrition_card.jpg', description: 'Expert calorie-mapped kitchen providing high-protein, balanced meal plans custom-tailored by sports nutritionists for athlete recovery.', order: 4, status: 'Active' },
        { id: 'fac-5', title: 'Education & Study Facilities', tag: 'Modern Learning', image: '/images/education_card.jpg', description: 'Fully-equipped classrooms, computer labs, and a quiet library supporting academic tutoring and personality development sessions.', order: 5, status: 'Active' },
        { id: 'fac-6', title: 'Medical & Physiotherapy', tag: '24/7 Care', image: '/images/medical_card.png', description: 'On-campus medical clinic and physiotherapy unit offering active recovery therapies, injury rehabilitation, and routine health checks.', order: 6, status: 'Active' },
        { id: 'fac-7', title: 'Safety & Security', tag: 'Secure Campus', image: '/images/security_card.png', description: '24/7 round-the-clock gated security, CCTV surveillance networks, and trained staff ensuring a safe environment for all trainees.', order: 7, status: 'Active' },
        { id: 'fac-8', title: 'Recreation & Common Areas', tag: 'Lounge Zone', image: '/images/recreation_card.png', description: 'Interactive spaces featuring indoor table games, audio-visual screens, and social hubs for students to unwind and connect.', order: 8, status: 'Active' },
        { id: 'fac-9', title: 'Wi-Fi & Technology', tag: 'High-Speed', image: '/images/wifi_card.png', description: 'High-speed campus-wide wireless internet access to support digital education, video analysis of sports, and communication.', order: 9, status: 'Active' }
      ];
      await Facility.insertMany(defaultFacilities);
      facilities = await Facility.find({}).sort({ order: 1 });
    }
    res.json({ success: true, facilities });
  } catch (err) {
    console.error("Fetch facilities error:", err);
    res.status(500).json({ error: "Failed to fetch facilities." });
  }
});

router.post('/facilities', async (req, res) => {
  let { title, tag, description, image, order, status } = req.body;
  if (!title || !tag || !description) {
    return res.status(400).json({ error: "Title, tag badge, and description are required." });
  }
  
  if (image && image.startsWith('data:image/')) {
    try {
      image = await storageService.uploadBase64(image, 'facilities');
    } catch (err) {
      console.error("Base64 upload failed for facility:", err);
    }
  }
  
  try {
    const newFacility = new Facility({
      id: `fac-${Date.now()}`,
      title: sanitizeInput(title).trim(),
      tag: sanitizeInput(tag).trim(),
      description: sanitizeInput(description).trim(),
      image: image || '/images/sports_training_card.jpg',
      order: Number(order) || 0,
      status: status === 'Hidden' ? 'Hidden' : 'Active'
    });
    await newFacility.save();
    await logAdminAction(req.admin.username, 'facility-create', newFacility.id, `Created facility: ${newFacility.title}`);
    res.status(201).json({ success: true, facility: newFacility });
  } catch (err) {
    console.error("Create facility error:", err);
    res.status(500).json({ error: "Failed to create facility." });
  }
});

router.put('/facilities/:id', async (req, res) => {
  let { title, tag, description, image, order, status } = req.body;
  
  if (image && image.startsWith('data:image/')) {
    try {
      image = await storageService.uploadBase64(image, 'facilities');
    } catch (err) {
      console.error("Base64 upload failed for facility:", err);
    }
  }
  
  try {
    const facility = await findDoc(Facility, req.params.id);
    if (!facility) return res.status(404).json({ error: "Facility not found." });
    
    if (title) facility.title = sanitizeInput(title).trim();
    if (tag) facility.tag = sanitizeInput(tag).trim();
    if (description) facility.description = sanitizeInput(description).trim();
    if (image) facility.image = image;
    if (order !== undefined) facility.order = Number(order) || 0;
    if (status) facility.status = status;
    
    await facility.save();
    await logAdminAction(req.admin.username, 'facility-update', facility.id, `Updated facility: ${facility.title}`);
    res.json({ success: true, facility });
  } catch (err) {
    console.error("Update facility error:", err);
    res.status(500).json({ error: "Failed to update facility." });
  }
});

router.delete('/facilities/:id', async (req, res) => {
  try {
    const isPermanent = req.query.permanent === 'true';
    const facility = await findDoc(Facility, req.params.id);
    if (!facility) return res.status(404).json({ error: "Facility not found." });
    
    if (isPermanent) {
      await Facility.deleteOne({ _id: facility._id });
      await logAdminAction(req.admin.username, 'facility-permanent-delete', req.params.id, `Permanently deleted facility: ${facility.title}`);
      return res.json({ success: true, message: "Facility card permanently deleted." });
    } else {
      facility.isDeleted = true;
      await facility.save();
      await logAdminAction(req.admin.username, 'facility-soft-delete', req.params.id, `Moved facility to trash: ${facility.title}`);
      return res.json({ success: true, message: "Facility card moved to trash." });
    }
  } catch (err) {
    console.error("Delete facility error:", err);
    res.status(500).json({ error: "Failed to delete facility." });
  }
});

router.put('/facilities/:id/restore', async (req, res) => {
  try {
    const facility = await findDoc(Facility, req.params.id);
    if (!facility) return res.status(404).json({ error: "Facility not found." });

    facility.isDeleted = false;
    await facility.save();
    await logAdminAction(req.admin.username, 'facility-restore', req.params.id, `Restored facility: ${facility.title}`);
    res.json({ success: true, facility });
  } catch (err) {
    console.error("Restore facility error:", err);
    res.status(500).json({ error: "Failed to restore facility." });
  }
});

// RLBSA EDGE CARDS MANAGEMENT ENDPOINTS
router.get('/edge-cards', async (req, res) => {
  try {
    let cards = await EdgeCard.find({}).sort({ order: 1 });
    
    // Reset old generic test cards if present
    const hasOldGenericCards = cards.some(c => c.title && c.title.includes('WHY CHOOSE RLBSA?'));
    if (cards.length === 0 || hasOldGenericCards) {
      if (hasOldGenericCards) {
        await EdgeCard.deleteMany({});
      }
      const defaultEdgeCards = [
        {
          id: 'edge-1',
          tag: 'ROLE MODELS',
          title: '“Our athletes inspire future generations of rural sports champions.”',
          description: 'RLBSA champions act as pathfinders for communities in Siwan, Bihar, showing young girls and boys that they too can compete at the highest national levels and break all barriers.',
          image: '/images/role_models_card.png',
          link: '#/academy/success-stories',
          linkText: 'MEET CHAMPIONS →',
          isFeatured: true,
          order: 1,
          status: 'Active'
        },
        {
          id: 'edge-2',
          tag: 'CURRICULUM',
          title: 'Structured Multi-Sport Development Pathways',
          description: 'Structured progression pathways for multi-sport learners, beginner development, and competitive youth performance modules.',
          image: '/images/sports_training_card.jpg',
          link: '#/about/what-we-do',
          linkText: 'LEARN MORE →',
          isFeatured: false,
          order: 2,
          status: 'Active'
        },
        {
          id: 'edge-3',
          tag: 'INFRASTRUCTURE',
          title: 'Vast Olympic-Level Sports Facilities & Arenas',
          description: 'Access temperature-controlled pools, synthetic athletics tracks, indoor wooden courts, and bowling simulations.',
          image: '/images/hero2.jpg',
          link: '#/about/facilities',
          linkText: 'EXPLORE FACILITIES →',
          isFeatured: false,
          order: 3,
          status: 'Active'
        },
        {
          id: 'edge-4',
          tag: 'SPORTS SCIENCE',
          title: 'Calorie-Mapped Nutrition & Rehab Metrics',
          description: 'Integrated biomechanical assessment, nutritional counsel, sports psychologists, and muscle rehab tracking.',
          image: '/images/nutrition_card.jpg',
          link: '#/about/what-we-do',
          linkText: 'LEARN MORE →',
          isFeatured: false,
          order: 4,
          status: 'Active'
        },
        {
          id: 'edge-5',
          tag: 'RESIDENTIAL SCHOLARSHIP',
          title: 'Grassroots Potential to National Champions',
          description: 'Free professional coaching, fully sponsored boarding, sports diet, and educational support for selected rural kids.',
          image: '/images/about_rlbsa.jpeg',
          link: '#/about/what-we-do',
          linkText: 'LEARN MORE →',
          isFeatured: false,
          order: 5,
          status: 'Active'
        }
      ];
      await EdgeCard.insertMany(defaultEdgeCards);
      cards = await EdgeCard.find({}).sort({ order: 1 });
    }
    res.json({ success: true, cards, edgeCards: cards });
  } catch (err) {
    console.error("Fetch edge cards error:", err);
    res.status(500).json({ error: "Failed to fetch RLBSA edge cards." });
  }
});

router.post('/edge-cards', async (req, res) => {
  let { tag, title, description, image, link, linkText, isFeatured, order, status } = req.body;
  if (!tag || !title || !description) {
    return res.status(400).json({ error: "Tag badge, title, and description are required." });
  }

  if (image && image.startsWith('data:image/')) {
    try {
      image = await storageService.uploadBase64(image, 'edge-cards');
    } catch (err) {
      console.error("Base64 upload failed for edge card:", err);
    }
  }

  try {
    const newCard = new EdgeCard({
      id: `edge-${Date.now()}`,
      tag: sanitizeInput(tag).trim(),
      title: sanitizeInput(title).trim(),
      description: sanitizeInput(description).trim(),
      image: image || '/images/sports_training_card.jpg',
      link: link ? sanitizeInput(link).trim() : '#/about/what-we-do',
      linkText: linkText ? sanitizeInput(linkText).trim() : 'LEARN MORE →',
      isFeatured: Boolean(isFeatured),
      order: Number(order) || 0,
      status: status === 'Hidden' ? 'Hidden' : 'Active'
    });
    await newCard.save();
    await logAdminAction(req.admin.username, 'edge-card-create', newCard.id, `Created RLBSA edge card: ${newCard.title}`);
    res.status(201).json({ success: true, card: newCard });
  } catch (err) {
    console.error("Create edge card error:", err);
    res.status(500).json({ error: "Failed to create RLBSA edge card." });
  }
});

router.put('/edge-cards/:id', async (req, res) => {
  let { tag, title, description, image, link, linkText, isFeatured, order, status } = req.body;

  if (image && image.startsWith('data:image/')) {
    try {
      image = await storageService.uploadBase64(image, 'edge-cards');
    } catch (err) {
      console.error("Base64 upload failed for edge card:", err);
    }
  }

  try {
    const card = await findDoc(EdgeCard, req.params.id);
    if (!card) return res.status(404).json({ error: "RLBSA edge card not found." });

    if (tag) card.tag = sanitizeInput(tag).trim();
    if (title) card.title = sanitizeInput(title).trim();
    if (description) card.description = sanitizeInput(description).trim();
    if (image) card.image = image;
    if (link) card.link = sanitizeInput(link).trim();
    if (linkText) card.linkText = sanitizeInput(linkText).trim();
    if (isFeatured !== undefined) card.isFeatured = Boolean(isFeatured);
    if (order !== undefined) card.order = Number(order) || 0;
    if (status) card.status = status;

    await card.save();
    await logAdminAction(req.admin.username, 'edge-card-update', card.id, `Updated RLBSA edge card: ${card.title}`);
    res.json({ success: true, card });
  } catch (err) {
    console.error("Update edge card error:", err);
    res.status(500).json({ error: "Failed to update RLBSA edge card." });
  }
});

router.delete('/edge-cards/:id', async (req, res) => {
  try {
    const isPermanent = req.query.permanent === 'true';
    const card = await findDoc(EdgeCard, req.params.id);
    if (!card) return res.status(404).json({ error: "RLBSA edge card not found." });

    if (isPermanent) {
      await EdgeCard.deleteOne({ _id: card._id });
      await logAdminAction(req.admin.username, 'edge-card-permanent-delete', req.params.id, `Permanently deleted edge card: ${card.title}`);
      return res.json({ success: true, message: "RLBSA edge card permanently deleted." });
    } else {
      card.isDeleted = true;
      await card.save();
      await logAdminAction(req.admin.username, 'edge-card-soft-delete', req.params.id, `Moved edge card to trash: ${card.title}`);
      return res.json({ success: true, message: "RLBSA edge card moved to trash." });
    }
  } catch (err) {
    console.error("Delete edge card error:", err);
    res.status(500).json({ error: "Failed to delete edge card." });
  }
});

router.put('/edge-cards/:id/restore', async (req, res) => {
  try {
    const card = await findDoc(EdgeCard, req.params.id);
    if (!card) return res.status(404).json({ error: "RLBSA edge card not found." });

    card.isDeleted = false;
    await card.save();
    await logAdminAction(req.admin.username, 'edge-card-restore', req.params.id, `Restored edge card: ${card.title}`);
    res.json({ success: true, card });
  } catch (err) {
    console.error("Restore edge card error:", err);
    res.status(500).json({ error: "Failed to restore edge card." });
  }
});

// Outreach Program Admin Routes
const defaultOutreachData = {
  header: {
    title: 'Outreach Program',
    subtitle: 'Taking sports excellence, education, and healthcare guidance directly to underprivileged rural communities across Bihar.'
  },
  impactStats: [
    { val: '50+', label: 'Villages Reached' },
    { val: '5,000+', label: 'Youth Engaged' },
    { val: '100%', label: 'Free Training & Kits' },
    { val: '20+', label: 'School Camps' }
  ],
  initiatives: [
    {
      id: 'outreach-1',
      tag: '01. Grassroots Scouting',
      caption: 'Village Talent Identification',
      desc: 'Discovering hidden athletic potential in remote rural areas.',
      image: '/images/about_rlbsa.jpeg'
    },
    {
      id: 'outreach-2',
      tag: '02. Athletic Camps',
      caption: 'Free Sports Coaching',
      desc: 'Professional training workshops for underprivileged youth.',
      image: '/images/hero1.jpeg'
    },
    {
      id: 'outreach-3',
      tag: '03. Campus Exposure',
      caption: 'Academy Infrastructure Visit',
      desc: 'Providing village children access to turf fields and gear.',
      image: '/images/hero2.jpg'
    },
    {
      id: 'outreach-4',
      tag: '04. Team Sports',
      caption: 'Handball & Football Drives',
      desc: 'Fostering teamwork, discipline, and competitive spirit.',
      image: '/images/program_handball.png'
    },
    {
      id: 'outreach-5',
      tag: '05. Education & Life Skills',
      caption: 'Literacy & Mentorship',
      desc: 'Combining athletic training with formal schooling support.',
      image: '/images/education_card.jpg'
    }
  ],
  descriptionSection: {
    tagline: 'Empowering Rural Communities',
    heading: 'Transforming Lives Beyond the Boundary Lines',
    paragraphs: [
      "Rani Laxmibai Sports Academy (RLBSA) operates a dedicated, multi-faceted Grassroots Outreach Program tailored specifically for young boys and girls in rural Bihar. In many surrounding villages, children face severe financial challenges, lack of basic sports equipment, and traditional societal norms that hinder participation in organized sports.",
      "Our outreach team visits remote schools, village sports clubs, and local communities to host open athletic trials, handball clinics, and football talent identification camps. We provide 100% free sports equipment, jerseys, and footwear to ensure no child is denied the chance to train due to poverty.",
      "Beyond athletic coaching, the RLBSA Outreach Program actively promotes Girl Child Empowerment & Gender Equality. By mentoring young female athletes and engaging directly with village elders and parents, we break generational stigmas and demonstrate how sports can open doors to higher education, government sports jobs, and national representation.",
      "Children selected during outreach drives earn full scholarships to join RLBSA's residential or daycare programs—receiving comprehensive sports training, standard academic schooling, daily protein-rich meals, and medical supervision."
    ]
  },
  pillars: [
    {
      id: 'pillar-1',
      icon: '🎯',
      title: 'Talent Identification',
      desc: 'Organizing physical fitness assessments and open trials in rural school grounds to spot raw athletic talent early.'
    },
    {
      id: 'pillar-2',
      icon: '👧',
      title: 'Female Leadership',
      desc: 'Creating safe spaces for rural girls to play sports, build confidence, and become role models for their villages.'
    },
    {
      id: 'pillar-3',
      icon: '👟',
      title: 'Free Kit Distribution',
      desc: 'Providing free running shoes, sports apparel, balls, and gear directly to underprivileged young athletes.'
    },
    {
      id: 'pillar-4',
      icon: '🥗',
      title: 'Health & Nutrition',
      desc: 'Conducting health checkups, hygiene awareness workshops, and distributing nutritional meal supplements.'
    }
  ],
  cta: {
    tagline: 'JOIN OUR MISSION',
    heading: 'Help Us Reach More Rural Athletes in Bihar',
    description: 'Partner with RLBSA to sponsor sports kits, fund village camps, or support residential scholarships for promising young athletes.',
    buttonText: 'Get In Touch',
    buttonLink: '#/contact'
  }
};

router.get('/outreach', async (req, res) => {
  try {
    let outreach = await OutreachProgram.findOne({});
    if (!outreach) {
      outreach = await OutreachProgram.create(defaultOutreachData);
    }
    res.json(outreach);
  } catch (err) {
    console.error("Fetch admin outreach error:", err);
    res.status(500).json({ error: "Failed to fetch outreach program details." });
  }
});

router.put('/outreach', async (req, res) => {
  try {
    let outreach = await OutreachProgram.findOne({});
    if (!outreach) {
      outreach = new OutreachProgram(defaultOutreachData);
    }

    const { header, impactStats, initiatives, descriptionSection, pillars, cta } = req.body;

    if (header) {
      outreach.header = {
        title: header.title || outreach.header.title,
        subtitle: header.subtitle || outreach.header.subtitle
      };
    }

    if (Array.isArray(impactStats)) {
      outreach.impactStats = impactStats.map(s => ({
        val: s.val || '',
        label: s.label || ''
      }));
    }

    if (Array.isArray(initiatives)) {
      const processedInitiatives = [];
      for (let i = 0; i < initiatives.length; i++) {
        const init = initiatives[i];
        let imageUrl = init.image || '';
        if (imageUrl && imageUrl.startsWith('data:')) {
          try {
            imageUrl = await saveBase64File(imageUrl, 'outreach');
          } catch (e) {
            console.error("Error saving initiative image:", e);
          }
        }
        processedInitiatives.push({
          id: init.id || `outreach-${Date.now()}-${i}`,
          tag: init.tag || '',
          caption: init.caption || '',
          desc: init.desc || '',
          image: imageUrl
        });
      }
      outreach.initiatives = processedInitiatives;
    }

    if (descriptionSection) {
      outreach.descriptionSection = {
        tagline: descriptionSection.tagline || '',
        heading: descriptionSection.heading || '',
        paragraphs: Array.isArray(descriptionSection.paragraphs) ? descriptionSection.paragraphs : []
      };
    }

    if (Array.isArray(pillars)) {
      outreach.pillars = pillars.map((p, idx) => ({
        id: p.id || `pillar-${Date.now()}-${idx}`,
        icon: p.icon || '🎯',
        title: p.title || '',
        desc: p.desc || ''
      }));
    }

    if (cta) {
      outreach.cta = {
        tagline: cta.tagline || '',
        heading: cta.heading || '',
        description: cta.description || '',
        buttonText: cta.buttonText || '',
        buttonLink: cta.buttonLink || ''
      };
    }

    await outreach.save();
    if (typeof logAdminAction === 'function') {
      await logAdminAction(req.admin?.username || 'admin', 'update-outreach', outreach._id, 'Updated Outreach Program content');
    }
    res.json({ success: true, message: "Outreach Program content updated successfully!", outreach });
  } catch (err) {
    console.error("Update outreach error:", err);
    res.status(500).json({ error: "Failed to update outreach program details." });
  }
});

router.get('/vision-mission', async (req, res) => {
  try {
    let doc = await VisionMission.findOne({});
    if (!doc) {
      doc = await VisionMission.create({
        missionPurpose: 'Our Purpose',
        missionTitle: 'Our Mission',
        missionDescription: "RLBSA strives for excellence in sports development by providing access to quality training, guidance, and opportunities. Through our dedication, we aim to inspire young athletes, nurture their potential, and empower them to achieve greatness while transforming lives through sports.",
        missionImage: '/images/hero2.jpg',
        missionBtnText: 'Explore Outreach Program',
        missionBtnLink: '#/about/outreach-program',

        visionFuture: 'Our Future',
        visionTitle: 'Our Vision',
        visionDescription: "To envision a world transformed by the power of sports, creating positive change for youth athletes and communities. We strive to provide every aspiring athlete with opportunities to grow, achieve excellence, and contribute to healthier, stronger, and more inclusive communities.",
        visionImage: '/images/about_rlbsa.jpeg',
        visionBtnText: 'Our Operations',
        visionBtnLink: '#/about/what-we-do',

        coreValues: [
          {
            icon: '🏆',
            title: 'Excellence',
            description: 'Constantly pushing technical limits to refine stroke, positioning, speed, and endurance.'
          },
          {
            icon: '🤝',
            title: 'Integrity',
            description: 'Fair play, respect for opponents, and honesty under pressure are non-negotiable principles.'
          },
          {
            icon: '⚡',
            title: 'Dedication',
            description: 'Understanding that physical gains and gold medals are outputs of steady daily discipline.'
          }
        ]
      });
    }
    res.json(doc);
  } catch (err) {
    console.error("Admin fetch vision-mission error:", err);
    res.status(500).json({ error: "Failed to fetch Vision & Mission settings." });
  }
});

router.put('/vision-mission', async (req, res) => {
  try {
    const {
      missionPurpose,
      missionTitle,
      missionDescription,
      missionImage,
      missionBtnText,
      missionBtnLink,
      visionFuture,
      visionTitle,
      visionDescription,
      visionImage,
      visionBtnText,
      visionBtnLink,
      coreValues
    } = req.body;

    let doc = await VisionMission.findOne({});
    if (!doc) {
      doc = new VisionMission({});
    }

    if (missionPurpose !== undefined) doc.missionPurpose = missionPurpose;
    if (missionTitle !== undefined) doc.missionTitle = missionTitle;
    if (missionDescription !== undefined) doc.missionDescription = missionDescription;
    if (missionImage !== undefined) doc.missionImage = missionImage;
    if (missionBtnText !== undefined) doc.missionBtnText = missionBtnText;
    if (missionBtnLink !== undefined) doc.missionBtnLink = missionBtnLink;

    if (visionFuture !== undefined) doc.visionFuture = visionFuture;
    if (visionTitle !== undefined) doc.visionTitle = visionTitle;
    if (visionDescription !== undefined) doc.visionDescription = visionDescription;
    if (visionImage !== undefined) doc.visionImage = visionImage;
    if (visionBtnText !== undefined) doc.visionBtnText = visionBtnText;
    if (visionBtnLink !== undefined) doc.visionBtnLink = visionBtnLink;

    if (Array.isArray(coreValues)) {
      doc.coreValues = coreValues.map(v => ({
        icon: v.icon || '⭐',
        title: v.title || '',
        description: v.description || ''
      }));
    }

    await doc.save();
    if (typeof logAdminAction === 'function') {
      await logAdminAction(req.admin?.username || 'admin', 'update-vision-mission', doc._id, 'Updated Vision & Mission settings');
    }
    res.json({ success: true, message: "Vision & Mission settings updated successfully!", visionMission: doc });
  } catch (err) {
    console.error("Update vision-mission error:", err);
    res.status(500).json({ error: "Failed to update Vision & Mission settings." });
  }
});

module.exports = router;
