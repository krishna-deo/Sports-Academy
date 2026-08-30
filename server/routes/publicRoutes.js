const express = require('express');
const router = express.Router();
const Coach = require('../models/Coach');
const Student = require('../models/Student');
const Gallery = require('../models/Gallery');
const Event = require('../models/Event');
const Enquiry = require('../models/Enquiry');
const Milestone = require('../models/Milestone');
const TeamMember = require('../models/TeamMember');
const SuccessStory = require('../models/SuccessStory');
const Policy = require('../models/Policy');
const Document = require('../models/Document');
const Complaint = require('../models/Complaint');

function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>]/g, '');
}

router.get('/coaches', async (req, res) => {
  try {
    const coaches = await Coach.find({});
    res.json(coaches);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch coaches list." });
  }
});

router.get('/students', async (req, res) => {
  try {
    const students = await Student.find({ showOnPublicWebsite: true, isDeleted: false }).sort({ admissionDate: -1 });
    const mapped = students.map(student => {
      const dob = student.dateOfBirth;
      let calculatedAge = 0;
      if (dob) {
        const diff = Date.now() - new Date(dob).getTime();
        calculatedAge = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
      }
      return {
        id: student.id,
        name: student.fullName,
        age: calculatedAge,
        sport: student.primarySport,
        joined: student.admissionDate ? new Date(student.admissionDate).toISOString().split('T')[0] : '',
        medalNumber: student.medalNumber || 0,
        avatar: student.avatar || '🎓',
        gender: student.gender || 'girl',
        residency: student.residency || 'resident'
      };
    });
    res.json(mapped);
  } catch (err) {
    console.error("Public fetch students error:", err);
    res.status(500).json({ error: "Failed to fetch student roster." });
  }
});

const galleryController = require('../controllers/galleryController');

router.get('/gallery', (req, res, next) => {
  // Override query parameters to guarantee only published, non-deleted files are served
  req.query.status = 'published';
  req.query.isDeleted = 'false';
  next();
}, (req, res) => galleryController.getItems(req, res));

router.get('/events', async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events." });
  }
});

router.get('/milestones', async (req, res) => {
  try {
    let milestone = await Milestone.findOne({});
    if (!milestone) {
      milestone = await Milestone.create({});
    }
    res.json(milestone);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch milestones." });
  }
});

router.post('/enquiry', async (req, res) => {
  let { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Required fields (name, email, message) are missing." });
  }

  name = sanitizeInput(name).trim();
  email = sanitizeInput(email).trim();
  phone = phone ? sanitizeInput(phone).trim() : '';
  subject = subject ? sanitizeInput(subject).trim() : 'General Inquiry';
  message = sanitizeInput(message).trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format provided." });
  }

  try {
    const newEnquiry = new Enquiry({
      id: 'ENQ-' + Math.floor(100 + Math.random() * 900),
      name,
      email,
      phone,
      subject,
      message,
      date: new Date().toISOString().split('T')[0]
    });
    await newEnquiry.save();
    res.status(201).json({ success: true, message: "Enquiry submitted successfully.", data: newEnquiry });
  } catch (err) {
    console.error("Enquiry saving error:", err);
    res.status(500).json({ error: "Failed to submit enquiry." });
  }
});

router.get('/team', async (req, res) => {
  try {
    const team = await TeamMember.find({}).sort({ createdAt: 1 });
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch founders and directors list." });
  }
});

// --- Public Legal & Compliance Routes ---

// Get all published policies (only metadata: id, title, description, version, effectiveDate, lastUpdated)
router.get('/compliance/policies', async (req, res) => {
  try {
    const policies = await Policy.find({ status: 'published' }).select('id title description version effectiveDate lastUpdated');
    res.json(policies);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch compliance policies." });
  }
});

// Get a specific policy by its ID slug (full content & attachments)
router.get('/compliance/policies/:id', async (req, res) => {
  try {
    const policy = await Policy.findOne({ id: req.params.id, status: 'published' });
    if (!policy) {
      return res.status(404).json({ error: "Policy not found or not published." });
    }
    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch policy details." });
  }
});

// Get all published public documents
router.get('/compliance/documents', async (req, res) => {
  try {
    const documents = await Document.find({ visibility: 'public', status: 'published' }).sort({ uploadedAt: -1 });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch public documents." });
  }
});

// Submit a public grievance complaint
router.post('/compliance/complaints', async (req, res) => {
  let { reporterName, reporterEmail, reporterPhone, subject, description } = req.body;
  if (!reporterName || !reporterEmail || !subject || !description) {
    return res.status(400).json({ error: "Required fields (reporterName, reporterEmail, subject, description) are missing." });
  }

  reporterName = sanitizeInput(reporterName).trim();
  reporterEmail = sanitizeInput(reporterEmail).trim().toLowerCase();
  reporterPhone = reporterPhone ? sanitizeInput(reporterPhone).trim() : '';
  subject = sanitizeInput(subject).trim();
  description = sanitizeInput(description).trim();

  try {
    const count = await Complaint.countDocuments({});
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    const complaintId = `COMP-${count + 1}-${randomSuffix}`;

    const newComplaint = new Complaint({
      id: complaintId,
      reporterName,
      reporterEmail,
      reporterPhone,
      subject,
      description,
      status: 'pending',
      internalNotes: ''
    });

    await newComplaint.save();
    res.status(201).json({ success: true, message: "Grievance submitted successfully.", id: complaintId });
  } catch (err) {
    console.error("Complaint save error:", err);
    res.status(500).json({ error: "Failed to submit grievance complaint." });
  }
});

router.get('/success-stories', async (req, res) => {
  try {
    const stories = await SuccessStory.find({}).sort({ createdAt: 1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch success stories." });
  }
});

module.exports = router;
