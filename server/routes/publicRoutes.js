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
const StoryMilestone = require('../models/StoryMilestone');
const Update = require('../models/Update');
const Facility = require('../models/Facility');
const EdgeCard = require('../models/EdgeCard');
const OutreachProgram = require('../models/OutreachProgram');
const VisionMission = require('../models/VisionMission');

const defaultVisionMission = {
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
};

const defaultOutreach = {
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
      outreach = await OutreachProgram.create(defaultOutreach);
    }
    res.json(outreach);
  } catch (err) {
    console.error("Fetch outreach error:", err);
    res.json(defaultOutreach);
  }
});

router.get('/facilities', async (req, res) => {
  try {
    const facilities = await Facility.find({ status: 'Active', isDeleted: { $ne: true } }).sort({ order: 1 });
    res.json(facilities);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch facilities." });
  }
});

router.get('/edge-cards', async (req, res) => {
  try {
    const cards = await EdgeCard.find({ status: 'Active', isDeleted: { $ne: true } }).sort({ order: 1 });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch RLBSA edge cards." });
  }
});

router.get('/story-milestones', async (req, res) => {
  try {
    const milestones = await StoryMilestone.find({ isDeleted: { $ne: true } }).sort({ order: 1 });
    res.json(milestones);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch story milestones." });
  }
});

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const featured = req.query.featured;

    const query = { status: 'Published', visibility: 'Public' };
    if (category) {
      query.category = category;
    }
    if (featured === 'true') {
      query.isFeatured = true;
    }

    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .sort({ startDate: 1 })
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
    console.error("Fetch events error:", err);
    res.status(500).json({ error: "Failed to fetch events." });
  }
});

router.get('/events/upcoming', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const query = { 
      status: 'Published', 
      visibility: 'Public', 
      startDate: { $gte: today } 
    };

    const events = await Event.find(query).sort({ startDate: 1 });
    res.json(events);
  } catch (err) {
    console.error("Fetch upcoming events error:", err);
    res.status(500).json({ error: "Failed to fetch upcoming events." });
  }
});

router.get('/events/tournaments', async (req, res) => {
  try {
    const query = { 
      status: 'Published', 
      visibility: 'Public', 
      category: 'Tournament' 
    };

    const events = await Event.find(query).sort({ startDate: 1 });
    res.json(events);
  } catch (err) {
    console.error("Fetch tournaments error:", err);
    res.status(500).json({ error: "Failed to fetch tournaments." });
  }
});

router.get('/events/camps-workshops', async (req, res) => {
  try {
    const query = { 
      status: 'Published', 
      visibility: 'Public', 
      category: { $in: ['Camp', 'Workshop'] } 
    };

    const events = await Event.find(query).sort({ startDate: 1 });
    res.json(events);
  } catch (err) {
    console.error("Fetch camps & workshops error:", err);
    res.status(500).json({ error: "Failed to fetch camps & workshops." });
  }
});

router.get('/events/:slug', async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug });
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    if (event.status !== 'Published' || event.visibility !== 'Public') {
      return res.status(403).json({ error: "Access denied to private or draft content." });
    }

    res.json(event);
  } catch (err) {
    console.error("Fetch event details error:", err);
    res.status(500).json({ error: "Failed to fetch event details." });
  }
});

router.get('/updates', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const featured = req.query.featured;

    const query = { status: 'Published', visibility: 'Public' };
    if (category) {
      query.category = category;
    }
    if (featured === 'true') {
      query.isFeatured = true;
    }

    const total = await Update.countDocuments(query);
    const updates = await Update.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
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
    console.error("Fetch updates error:", err);
    res.status(500).json({ error: "Failed to fetch updates." });
  }
});

router.get('/updates/:slug', async (req, res) => {
  try {
    const update = await Update.findOne({ slug: req.params.slug });
    if (!update) {
      return res.status(404).json({ error: "Update not found." });
    }

    if (update.status !== 'Published' || update.visibility !== 'Public') {
      return res.status(403).json({ error: "Access denied to private or draft content." });
    }

    res.json(update);
  } catch (err) {
    console.error("Fetch update details error:", err);
    res.status(500).json({ error: "Failed to fetch update details." });
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
    const team = await TeamMember.find({ isDeleted: { $ne: true } }).sort({ createdAt: 1 });
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
    const stories = await SuccessStory.find({ isDeleted: { $ne: true } }).sort({ createdAt: 1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch success stories." });
  }
});

router.get('/vision-mission', async (req, res) => {
  try {
    let doc = await VisionMission.findOne({});
    if (!doc) {
      doc = await VisionMission.create(defaultVisionMission);
    }
    res.json(doc);
  } catch (err) {
    console.error("Fetch vision-mission error:", err);
    res.status(500).json({ error: "Failed to fetch Vision & Mission settings." });
  }
});

module.exports = router;
