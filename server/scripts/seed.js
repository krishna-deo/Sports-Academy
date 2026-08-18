require('dotenv').config({ path: '../.env' });
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');
const Coach = require('../models/Coach');
const Gallery = require('../models/Gallery');
const Event = require('../models/Event');
const Enquiry = require('../models/Enquiry');
const Milestone = require('../models/Milestone');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://krishnasinghhaji26_db_user:UiXTvIEJs8l5ehjP@cluster0.3gnkbbd.mongodb.net/';

const initialCoaches = [
  {
    name: "Coach Rajesh Sen",
    role: "Head Football Coach",
    specialization: "A-Licensed Youth Coach, Former State Captain",
    experience: "15+ Years Coaching",
    bio: "Coach Rajesh focuses on tactical positions and player physical conditioning frameworks.",
    avatar: "👨‍🏫"
  },
  {
    name: "Coach Sarita Devi",
    role: "Handball Coordinator",
    specialization: "National Handball Medalist, SAI Certified Coach",
    experience: "8+ Years Coaching",
    bio: "Sarita is highly passionate about promoting handball in schools and training young girls for state-level selections.",
    avatar: "👩‍🏫"
  },
  {
    name: "Coach Vikram Rathore",
    role: "Senior Athletics Director",
    specialization: "NIS Athletics Coach, Former Decathlete",
    experience: "12+ Years Coaching",
    bio: "Vikram specializes in running biomechanics, explosive speed development, and endurance mapping.",
    avatar: "👨‍🏫"
  },
  {
    name: "Coach Alan Mercer",
    role: "Rugby Technical Lead",
    specialization: "IRB Level 2 Certified Trainer",
    experience: "10+ Years Coaching",
    bio: "Alan is focused on introducing rugby to young learners, emphasizing safety protocols and game logic.",
    avatar: "👨‍🏫"
  }
];

const initialGallery = [
  {
    id: 1,
    title: "Academy Football Team Practice Drill",
    category: "tour",
    mediaType: "photo",
    src: "football_win"
  },
  {
    id: 2,
    title: "Handball Match at State School Games",
    category: "tournament",
    mediaType: "photo",
    src: "handball_win"
  },
  {
    id: 3,
    title: "Athletes practicing sprints on track",
    category: "tour",
    mediaType: "photo",
    src: "cricket_practice"
  },
  {
    id: 4,
    title: "Rugby introductory clinic for children",
    category: "events",
    mediaType: "photo",
    src: "strength_conditioning"
  },
  {
    id: 5,
    title: "Aarti Kumari receiving state award",
    category: "student-achievements",
    mediaType: "photo",
    src: "rhea_gold"
  },
  {
    id: 6,
    title: "Annual Sports Festival Highlights",
    category: "events",
    mediaType: "photo",
    src: "summer_camp_opening"
  },
  {
    id: 7,
    title: "Ex-National coach showing tactical passing",
    category: "videos",
    mediaType: "video",
    src: "passing_drills"
  }
];

const initialEvents = [
  {
    id: "evt-1",
    title: "RLBSA Inter-District Girls Football Championship",
    category: "tournaments",
    date: "2026-08-10",
    time: "09:00 AM onwards",
    venue: "RLBSA Main Ground",
    description: "An elite youth tournament featuring top school teams from Bihar. Local selectors and scouts will be present.",
    status: "open"
  },
  {
    id: "evt-2",
    title: "Specialized Athletics Speed & Hurdle Clinic",
    category: "workshops",
    date: "2026-08-22",
    time: "08:00 AM - 11:30 AM",
    venue: "Athletics Track",
    description: "Led by Senior Athletics Director Coach Vikram Rathore. Learn sprint acceleration protocols and biomechanical form.",
    status: "open"
  },
  {
    id: "evt-3",
    title: "Annual State Handball Selections Camp",
    category: "camps",
    date: "2026-10-15",
    time: "Daily 07:30 AM - 12:00 PM",
    venue: "Handball Court Area",
    description: "State-level selection camp hosted at the academy for under-17 boys and girls categories.",
    status: "upcoming"
  }
];

const initialStudents = [
  { id: "ST-101", name: "Amrit Kumari", age: 24, sport: "Football", joined: "2018-06-15", medalNumber: 15, avatar: "👩‍🎓" },
  { id: "ST-102", name: "Tara Khatoon", age: 20, sport: "Football", joined: "2020-01-10", medalNumber: 10, avatar: "👩‍🎓" },
  { id: "ST-103", name: "Khushbu Kumari", age: 21, sport: "Football & Handball", joined: "2019-08-05", medalNumber: 12, avatar: "👩‍🎓" },
  { id: "ST-104", name: "Nisha Kumari", age: 22, sport: "Football", joined: "2019-09-20", medalNumber: 8, avatar: "👩‍🎓" },
  { id: "ST-105", name: "Khushi Kumari", age: 19, sport: "Football", joined: "2021-03-12", medalNumber: 14, avatar: "👩‍🎓" },
  { id: "ST-106", name: "Shruti Kumari", age: 18, sport: "Football", joined: "2020-11-18", medalNumber: 11, avatar: "👩‍🎓" }
];

const initialEnquiries = [
  {
    id: "ENQ-901",
    name: "Sanjay Shah",
    email: "sanjay@gmail.com",
    phone: "9876543212",
    subject: "Admissions Inquiry",
    message: "Hello, what is the selection criteria for girls boarding scholarship trials?",
    date: "2026-07-26"
  },
  {
    id: "ENQ-902",
    name: "Meena Devi",
    email: "meenad@yahoo.com",
    phone: "9876543224",
    subject: "Timings Support",
    message: "My daughter is 12 years old. Can she join the non-residential evening camp for athletics?",
    date: "2026-07-25"
  },
  {
    id: "ENQ-903",
    name: "Rakesh Ranjan",
    email: "rranjan@rediff.com",
    phone: "9876543230",
    subject: "Facility Rental",
    message: "Do you rent out the football turf for local school matches on weekend mornings?",
    date: "2026-07-23"
  }
];

async function seed() {
  console.log("Connecting to MongoDB for seeding...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully.");

  // 1. Seed Admin User
  const userCount = await User.countDocuments({});
  if (userCount === 0) {
    await User.create({
      username: "admin",
      password: "$2a$10$Gbs7UrhSzVgl2zMiN5Sj.uMZ1GhdvdlHEjUKq9eUFFozyk4.KiUBO" // admin123
    });
    console.log("Admin user seeded.");
  }

  // 2. Seed Coaches
  const coachCount = await Coach.countDocuments({});
  if (coachCount === 0) {
    await Coach.insertMany(initialCoaches);
    console.log("Coaches seeded.");
  }

  // 3. Seed Gallery
  const galleryCount = await Gallery.countDocuments({});
  if (galleryCount === 0) {
    await Gallery.insertMany(initialGallery);
    console.log("Gallery items seeded.");
  }

  // 4. Seed Events
  const eventCount = await Event.countDocuments({});
  if (eventCount === 0) {
    await Event.insertMany(initialEvents);
    console.log("Events seeded.");
  }

  // 5. Seed Students
  await Student.deleteMany({});
  await Student.insertMany(initialStudents);
  console.log("Students seeded.");

  // 6. Seed Enquiries
  const enquiryCount = await Enquiry.countDocuments({});
  if (enquiryCount === 0) {
    await Enquiry.insertMany(initialEnquiries);
    console.log("Enquiries seeded.");
  }

  // 7. Seed Milestones
  const milestoneCount = await Milestone.countDocuments({});
  if (milestoneCount === 0) {
    await Milestone.create({
      districtMedals: 240,
      stateSelection: 15,
      nationalSelections: 120,
      certifications: 4
    });
    console.log("Milestones seeded.");
  }

  console.log("Database seeding completed.");
  await mongoose.connection.close();
  console.log("Connection closed.");
}

seed().catch(err => {
  console.error("Database seeding failed:", err);
  process.exit(1);
});
