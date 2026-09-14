require('dotenv').config({ path: '../.env' });
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');
const Coach = require('../models/Coach');
const Gallery = require('../models/Gallery');
const Event = require('../models/Event');
const Update = require('../models/Update');
const Enquiry = require('../models/Enquiry');
const Milestone = require('../models/Milestone');
const TeamMember = require('../models/TeamMember');
const SuccessStory = require('../models/SuccessStory');
const Policy = require('../models/Policy');
const ComplianceReminder = require('../models/ComplianceReminder');
const StoryMilestone = require('../models/StoryMilestone');
const Facility = require('../models/Facility');

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
    name: "Academy Football Team Practice Drill",
    category: "Training",
    date: new Date("2026-08-10"),
    description: "Daily tactical passing and sprint practice drills on the track and football grounds.",
    location: "Football Ground Area",
    coverImage: "/uploads/gallery/football_win.jpg",
    photos: [
      { path: "/uploads/gallery/football_win.jpg", size: 102456 }
    ],
    status: "published",
    uploadedBy: "admin",
    logs: [{ action: "upload", timestamp: new Date(), operator: "admin" }]
  },
  {
    name: "Annual State Handball Selections Camp",
    category: "Events",
    date: new Date("2026-08-12"),
    description: "State level selection trials and matches played at Rani Laxmi Bai Sports Academy.",
    location: "Main Indoor Sports Court",
    coverImage: "/uploads/gallery/handball_win.jpg",
    photos: [
      { path: "/uploads/gallery/handball_win.jpg", size: 84930 }
    ],
    status: "published",
    uploadedBy: "admin",
    logs: [{ action: "upload", timestamp: new Date(), operator: "admin" }]
  }
];

const initialEvents = [
  {
    id: "evt-1",
    title: "RLBSA Inter-District Girls Football Championship",
    slug: "rlbsa-inter-district-girls-football-championship",
    category: "Tournament",
    shortDescription: "An elite youth tournament featuring top school teams from Bihar.",
    content: "An elite youth tournament featuring top school teams from Bihar. Local selectors and scouts will be present to scout for state-level coaching pools.",
    coverMedia: "/images/hero1.jpeg",
    galleryMedia: ["/images/about_rlbsa.jpeg"],
    startDate: new Date("2026-09-10"),
    endDate: new Date("2026-09-12"),
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    location: "RLBSA Main Ground",
    registrationRequired: true,
    registrationUrl: "#/events/registration",
    status: "Published",
    visibility: "Public",
    isFeatured: true,
    publishedAt: new Date(),
    date: "2026-09-10",
    time: "09:00 AM onwards",
    venue: "RLBSA Main Ground"
  },
  {
    id: "evt-2",
    title: "Specialized Athletics Speed & Hurdle Clinic",
    slug: "specialized-athletics-speed-hurdle-clinic",
    category: "Workshop",
    shortDescription: "Led by Senior Athletics Director Coach Vikram Rathore.",
    content: "Led by Senior Athletics Director Coach Vikram Rathore. Learn sprint acceleration protocols, block starts, and biomechanical form checks.",
    coverMedia: "/images/hero2.jpg",
    galleryMedia: [],
    startDate: new Date("2026-09-22"),
    startTime: "08:00 AM",
    endTime: "11:30 AM",
    location: "Athletics Track",
    registrationRequired: false,
    status: "Published",
    visibility: "Public",
    isFeatured: false,
    publishedAt: new Date(),
    date: "2026-09-22",
    time: "08:00 AM - 11:30 AM",
    venue: "Athletics Track"
  },
  {
    id: "evt-3",
    title: "Annual State Handball Selections Camp",
    slug: "annual-state-handball-selections-camp",
    category: "Camp",
    shortDescription: "State-level selection camp hosted at the academy.",
    content: "State-level selection camp hosted at the academy for under-17 boys and girls categories, targeting state league teams.",
    coverMedia: "/images/about_rlbsa.jpeg",
    galleryMedia: [],
    startDate: new Date("2026-10-15"),
    endDate: new Date("2026-10-20"),
    startTime: "07:30 AM",
    endTime: "12:00 PM",
    location: "Handball Court Area",
    registrationRequired: true,
    registrationUrl: "#/events/registration",
    status: "Published",
    visibility: "Public",
    isFeatured: true,
    publishedAt: new Date(),
    date: "2026-10-15",
    time: "Daily 07:30 AM - 12:00 PM",
    venue: "Handball Court Area"
  }
];

const initialUpdates = [
  {
    id: "upd-1",
    title: "RLBSA Academy Admission Open for 2026-27 Session",
    slug: "rlbsa-admission-open-2026-27",
    category: "Admission Update",
    summary: "Applications are invited for residential sports scholarships for the upcoming session.",
    content: "<p>We are excited to announce that admission trials for the 2026-27 residential batch are officially open. Girls and boys aged 11-16 with exceptional talent in football, handball, rugby, or athletics are encouraged to apply.</p><p>Selected student-athletes will receive a 100% scholarship covering high-performance coaching, residential boarding, nutrition-calibrated meals, school education, and competition exposure.</p>",
    coverMedia: "/images/hero1.jpeg",
    attachments: [],
    status: "Published",
    visibility: "Public",
    isFeatured: true,
    publishedAt: new Date()
  },
  {
    id: "upd-2",
    title: "Academy Athletes Triumph at National Athletics Meet",
    slug: "academy-athletes-triumph-national-athletics",
    category: "Achievement",
    summary: "Our student-athletes bagged 3 gold and 2 silver medals at the Youth National Athletics Championship.",
    content: "<p>Rani Laxmibai Sports Academy is proud to share that our athletics squad delivered a stellar performance at the recent Youth National Athletics Championship held in Pune.</p><p>Aarti Kumari clinched gold in the 400m hurdles, while Rahul Kumar secured gold in the javelin throw. The handball girls squad also reached the semi-finals.</p>",
    coverMedia: "/images/about_rlbsa.jpeg",
    attachments: [],
    status: "Published",
    visibility: "Public",
    isFeatured: true,
    publishedAt: new Date()
  }
];

const initialStudents = [
  { id: "ST-101", name: "Amrit Kumari", age: 24, sport: "Football", joined: "2018-06-15", medalNumber: 15, avatar: "👩‍🎓", gender: "girl", residency: "resident" },
  { id: "ST-102", name: "Tara Khatoon", age: 20, sport: "Football", joined: "2020-01-10", medalNumber: 10, avatar: "👩‍🎓", gender: "girl", residency: "non-resident" },
  { id: "ST-103", name: "Khushbu Kumari", age: 21, sport: "Football & Handball", joined: "2019-08-05", medalNumber: 12, avatar: "👩‍🎓", gender: "girl", residency: "resident" },
  { id: "ST-104", name: "Nisha Kumari", age: 22, sport: "Football", joined: "2019-09-20", medalNumber: 8, avatar: "👩‍🎓", gender: "girl", residency: "non-resident" },
  { id: "ST-105", name: "Khushi Kumari", age: 19, sport: "Football", joined: "2021-03-12", medalNumber: 14, avatar: "👩‍🎓", gender: "girl", residency: "resident" },
  { id: "ST-106", name: "Shruti Kumari", age: 18, sport: "Football", joined: "2020-11-18", medalNumber: 11, avatar: "👩‍🎓", gender: "girl", residency: "non-resident" },
  { id: "ST-107", name: "Aarav Singh", age: 16, sport: "Football", joined: "2023-04-12", medalNumber: 9, avatar: "👦", gender: "boy", residency: "resident" },
  { id: "ST-108", name: "Rahul Kumar", age: 17, sport: "Athletics", joined: "2022-09-15", medalNumber: 7, avatar: "👦", gender: "boy", residency: "non-resident" },
  { id: "ST-109", name: "Vikram Jeet", age: 18, sport: "Handball", joined: "2021-11-03", medalNumber: 12, avatar: "👦", gender: "boy", residency: "resident" }
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

const initialTeamMembers = [
  {
    id: 'sanjay-pathak',
    name: 'Mr. Sanjay Pathak',
    role: 'Founder & Director',
    bio: 'A visionary leader and sports administrator, Mr. Pathak founded the academy with a commitment to providing state-of-the-art training infrastructure and supporting grassroots athletes from underprivileged rural communities.',
    image: '/images/Mr. Sanjay Pathak (Founder and Director).jpeg',
    objectPosition: 'center 15%',
  },
  {
    id: 'shrad-chaudhary',
    name: 'Dr. Shrad Chaudhary',
    role: 'Director',
    bio: 'An accomplished academician and sports enthusiast, Dr. Chaudhary oversees sports integration programs, fostering a balanced approach between academic development and physical excellence for student-athletes.',
    image: '/images/Dr. Shrad Chaudhary (Director).jpeg',
    objectPosition: 'center 15%',
  },
  {
    id: 'rita-sinha',
    name: 'Dr. Rita Sinha',
    role: 'Director',
    bio: 'A dedicated advocate for youth empowerment and sports education, Dr. Sinha specializes in building inclusive developmental programs, mentoring junior athletes, and promoting sports wellness initiatives.',
    image: '/images/Dr. Rita Sinha (Director).jpeg',
    objectPosition: 'center 10%',
  },
  {
    id: 'rajeev-mishra',
    name: 'Rajeev Lochan Mishra',
    role: 'Director',
    bio: 'Bringing years of administrative expertise, Mr. Mishra leads strategic growth and partnership building, steering the academy\'s community outreach programs and talent scout networks.',
    image: '/images/Rajeev Lochan Mishra (Director).jpeg',
    objectPosition: 'center 10%',
  },
  {
    id: 'alakh-pandey',
    name: 'Mr. Alakh Niranjan Pandey',
    role: 'Director',
    bio: 'Mr. Pandey guides the development of residential infrastructure, campus operations, and athlete welfare programs, ensuring a secure and supportive training environment.',
    image: '/images/Dr. Alakh Niranjan Pandey (Director).jpeg',
    objectPosition: 'center 15%',
  }
];

const initialSuccessStories = [
  {
    id: "amrit",
    name: "Amrit Kumari",
    sport: "Football",
    achievement: "Former Indian Team Captain & Clerk, Bihar Govt",
    description: "Amrit Kumari is a legendary figure in Bihar women's sports. She captained the Indian national football team, demonstrating exemplary leadership on the field. Her achievements secured her a role as a Clerk in the Bihar Government under the state's sports quota.",
    quote: "Leading the national team was an absolute honor. Rani Laxmibai Sports Academy provided the foundation and support that made my dreams a reality.",
    image: "/images/Amrit Kumari Former Indian team captain(Clerk Bihar Govr).jpeg",
    joined: "June 2018",
    age: 24,
    medals: 15
  },
  {
    id: "tara",
    name: "Tara Khatoon",
    sport: "Football",
    achievement: "National Football Player",
    description: "Known for her exceptional speed and dribbling mastery on the wings, Tara Khatoon has represented Bihar and India in major national-level tournaments, becoming a cornerstone of our senior football lineup.",
    quote: "With consistent guidance and elite coaching at the academy, I transformed my passion into a professional football career.",
    image: "/images/Tara Khatoon (FootBall).jpeg",
    joined: "January 2020",
    age: 20,
    medals: 10
  },
  {
    id: "khushbu",
    name: "Khushbu Kumari",
    sport: "Football & Handball",
    achievement: "Dual-Sport National Athlete",
    description: "Khushbu is an outstanding multi-sport athlete, excelling at the national level in both Football and Handball. Her athletic versatility and determination make her a true role model for young academy players.",
    quote: "The multi-sport training environment at RLBSA helped me develop unique stamina and versatility to compete in both sports.",
    image: "/images/Khushbu Kumari (Football, HandBall).jpg",
    joined: "August 2019",
    age: 21,
    medals: 12,
    objectPosition: "object-center"
  },
  {
    id: "nisha",
    name: "Nisha Kumari",
    sport: "Football",
    achievement: "National Player (Home Guard, Bihar Govt)",
    description: "Nisha is a rock-solid defender who played at the national level. Through her sports credentials and dedication, she earned employment as a Home Guard with the Bihar Government, securing her family's livelihood.",
    quote: "Sports gave me not just fitness and medals, but also a stable life and career through the Bihar government's support.",
    image: "/images/NIsha Kumari (Homeguard Bihar Govr).jpeg",
    joined: "September 2019",
    age: 22,
    medals: 8
  },
  {
    id: "khushi",
    name: "Khushi Kumari",
    sport: "Football",
    achievement: "Indian Team Goalkeeper",
    description: "Khushi Kumari is a phenomenal goalkeeper who earned selection for the Indian National Women's Football team. Her lightning-fast reflexes and commanding presence in the box make her a tough barrier to breach.",
    quote: "Goalkeeping requires extreme mental strength. The academy's specialized coaches pushed me to my absolute limits.",
    image: "/images/Khushi Kumari (Football Goal keeper Indian Team).jpeg",
    joined: "March 2021",
    age: 19,
    medals: 14
  },
  {
    id: "shruti",
    name: "Shruti Kumari",
    sport: "Football",
    achievement: "International Football Player",
    description: "Shruti is a talented international-level winger who has represented India in youth championships. Her tactical intelligence and crossing ability have won praise from international selectors.",
    quote: "Playing internationally was my ultimate goal. The training standards and diet support at the academy made it possible.",
    image: "/images/Shruti Kumari (International football player).jpeg",
    joined: "November 2020",
    age: 18,
    medals: 11
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
  await Gallery.deleteMany({});
  await Gallery.insertMany(initialGallery);
  console.log("Gallery items seeded.");

  // 4. Seed Events & Updates
  await Event.deleteMany({});
  await Event.insertMany(initialEvents);
  console.log("Events seeded successfully.");

  await Update.deleteMany({});
  await Update.insertMany(initialUpdates);
  console.log("Updates seeded successfully.");

  // 5. Seed Students
  await Student.deleteMany({});
  const populatedStudents = initialStudents.map(student => {
    const calculatedAge = student.age || 18;
    const approxDOB = new Date();
    approxDOB.setFullYear(approxDOB.getFullYear() - calculatedAge);
    approxDOB.setMonth(5);
    approxDOB.setDate(15);
    return {
      ...student,
      studentId: student.id,
      fullName: student.name,
      dateOfBirth: approxDOB,
      primarySport: student.sport.includes('&') ? student.sport.split('&')[0].trim() : student.sport || 'Football',
      admissionDate: student.joined ? new Date(student.joined) : new Date(),
      status: 'Active',
      isDeleted: false,
      showOnPublicWebsite: true
    };
  });
  await Student.insertMany(populatedStudents);
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

  // 8. Seed Team Members
  await TeamMember.deleteMany({});
  await TeamMember.insertMany(initialTeamMembers);
  console.log("Team members (Founders & Directors) seeded.");

  // 9. Seed Success Stories
  await SuccessStory.deleteMany({});
  await SuccessStory.insertMany(initialSuccessStories);
  console.log("Success stories seeded.");

  // 10. Seed Compliance Policies
  const policyCount = await Policy.countDocuments({});
  if (policyCount === 0) {
    const initialPolicies = [
      {
        id: 'privacy-policy',
        title: 'Privacy Policy',
        description: 'Describes how we handle your personal data and privacy settings.',
        content: '<h2>1. Data Collection</h2><p>We collect student admission details, guardian contact info, and medical profiles to ensure proper care during residency.</p><h2>2. Data Usage</h2><p>Data is strictly utilized for academic performance analysis, medical emergencies, and tournament registries.</p><h2>3. Your Rights</h2><p>Guardians can request data exports or request profile deactivation at any time.</p>',
        status: 'published',
        version: '1.0',
        effectiveDate: new Date(),
        lastUpdated: new Date()
      },
      {
        id: 'terms-and-conditions',
        title: 'Terms and Conditions',
        description: 'The legal terms governing participation and usage of the academy.',
        content: '<h2>1. Admission Eligibility</h2><p>Enrolled athletes must adhere to training schedules and comply with physical fitness standards.</p><h2>2. Facility Utilization</h2><p>Academy assets, hostels, and gear must be handled with appropriate responsibility.</p><h2>3. Liability Waiver</h2><p>RLBSA Foundation is not liable for accidents that occur during normal athletic play, subject to compliance protocols.</p>',
        status: 'published',
        version: '1.0',
        effectiveDate: new Date(),
        lastUpdated: new Date()
      },
      {
        id: 'student-conduct',
        title: 'Student Code of Conduct',
        description: 'Behavioral expectations, integrity, and anti-bullying policies.',
        content: '<h2>1. Behavioral Discipline</h2><p>Respect coaches, fellow students, and staff. Anti-social behavior, substance use, or vandalism is strictly prohibited.</p><h2>2. Academic Engagement</h2><p>Day scholars and boarding athletes must maintain positive scholastic standing.</p><h2>3. Anti-Ragging Policy</h2><p>Zero tolerance policy against ragging or intimidation. Instant suspension applies to violations.</p>',
        status: 'published',
        version: '1.0',
        effectiveDate: new Date(),
        lastUpdated: new Date()
      },
      {
        id: 'child-protection',
        title: 'Child Protection and Safeguarding Policy',
        description: 'Safety guidelines and safeguarding frameworks for minor athletes.',
        content: '<h2>1. Safeguarding Commitment</h2><p>Our academy enforces strict background checks for all training instructors and staff.</p><h2>2. Reporting Incidents</h2><p>If any minor is subjected to mental or physical abuse, the matter must be reported immediately to the Child Welfare Officer.</p><h2>3. Gender Equity</h2><p>Separate, secure dormitories are provided for boys and girls with trained wardens present 24/7.</p>',
        status: 'published',
        version: '1.0',
        effectiveDate: new Date(),
        lastUpdated: new Date()
      },
      {
        id: 'health-safety',
        title: 'Health and Safety Policy',
        description: 'Emergency protocols, medical services, and facility safety.',
        content: '<h2>1. Medical Protocols</h2><p>Every student athlete receives a compulsory health screening. First-aid packs are available at every pitch during coaching hours.</p><h2>2. Emergency Evacuation</h2><p>Fire drills and evacuation routes are practiced biannually inside hostel buildings.</p><h2>3. Diet & Hygiene</h2><p>Hostel mess menus are mapped by certified sports nutritionists, emphasizing raw ingredient cleanliness.</p>',
        status: 'published',
        version: '1.0',
        effectiveDate: new Date(),
        lastUpdated: new Date()
      },
      {
        id: 'grievance-complaints',
        title: 'Grievance and Complaints Policy',
        description: 'Mechanism to file reports and complain about training or hostel issues.',
        content: '<h2>1. Grievance Redressal</h2><p>Any student or parent can file a complaint online or submit one directly to the coordinator. All grievances are resolved within 7 working days.</p><h2>2. Anonymous Reporting</h2><p>Whistleblower safety is guaranteed. Internal review notes are confidential and protected by role authorization.</p>',
        status: 'published',
        version: '1.0',
        effectiveDate: new Date(),
        lastUpdated: new Date()
      },
      {
        id: 'cookie-policy',
        title: 'Cookie Policy',
        description: 'Cookie files policies.',
        content: '<h2>1. Cookies Use</h2><p>Required session cookies are loaded for admin control systems.</p>',
        status: 'published',
        version: '1.0',
        effectiveDate: new Date(),
        lastUpdated: new Date()
      }
    ];
    await Policy.insertMany(initialPolicies);
    console.log("Compliance policies seeded.");
  }

  // 11. Seed Compliance Reminders
  const reminderCount = await ComplianceReminder.countDocuments({});
  if (reminderCount === 0) {
    const initialReminders = [
      {
        id: 'rem-101',
        title: 'Annual Safeguarding Policy Review',
        description: 'Review Child Protection frameworks with child welfare authorities.',
        type: 'policy-review',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        status: 'pending'
      },
      {
        id: 'rem-102',
        title: 'Fire Safety Certificate Renewal',
        description: 'Schedule inspection with fire department for hostel wings.',
        type: 'document-expiry',
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        status: 'pending'
      },
      {
        id: 'rem-103',
        title: 'Biannual Internal Medical Audit',
        description: 'Verify first-aid inventories and student medical clearance files.',
        type: 'audit',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
        status: 'pending'
      }
    ];
    await ComplianceReminder.insertMany(initialReminders);
    console.log("Compliance reminders seeded.");
  }

  // 12. Seed Story Milestones
  const storyCount = await StoryMilestone.countDocuments({});
  if (storyCount === 0) {
    const initialStories = [
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
    await StoryMilestone.insertMany(initialStories);
    console.log("Story milestones seeded.");
  }

  const initialFacilities = [
    {
      id: 'fac-1',
      title: 'Sports Infrastructure',
      tag: 'Olympic Standard',
      image: '/images/sports_training_card.jpg',
      description: 'Vast outdoor turf, international track fields, court complexes, and specialized indoor arenas built for high-performance athletic training.',
      order: 1,
      status: 'Active'
    },
    {
      id: 'fac-2',
      title: 'Gym & Fitness Center',
      tag: 'Advanced Gear',
      image: '/images/gym_card.png',
      description: 'State-of-the-art strength and conditioning facility equipped with elite weight training, cardio, and performance tracking systems.',
      order: 2,
      status: 'Active'
    },
    {
      id: 'fac-3',
      title: 'Hostel & Accommodation',
      tag: 'Residential',
      image: '/images/hostel_card.png',
      description: 'Secure, hygienic, and comfortable residential dormitories for student-athletes with dedicated study zones and lounge areas.',
      order: 3,
      status: 'Active'
    },
    {
      id: 'fac-4',
      title: 'Mess & Dining',
      tag: 'Nutritional Diet',
      image: '/images/nutrition_card.jpg',
      description: 'Expert calorie-mapped kitchen providing high-protein, balanced meal plans custom-tailored by sports nutritionists for athlete recovery.',
      order: 4,
      status: 'Active'
    },
    {
      id: 'fac-5',
      title: 'Education & Study Facilities',
      tag: 'Modern Learning',
      image: '/images/education_card.jpg',
      description: 'Fully-equipped classrooms, computer labs, and a quiet library supporting academic tutoring and personality development sessions.',
      order: 5,
      status: 'Active'
    },
    {
      id: 'fac-6',
      title: 'Medical & Physiotherapy',
      tag: '24/7 Care',
      image: '/images/medical_card.png',
      description: 'On-campus medical clinic and physiotherapy unit offering active recovery therapies, injury rehabilitation, and routine health checks.',
      order: 6,
      status: 'Active'
    },
    {
      id: 'fac-7',
      title: 'Safety & Security',
      tag: 'Secure Campus',
      image: '/images/security_card.png',
      description: '24/7 round-the-clock gated security, CCTV surveillance networks, and trained staff ensuring a safe environment for all trainees.',
      order: 7,
      status: 'Active'
    },
    {
      id: 'fac-8',
      title: 'Recreation & Common Areas',
      tag: 'Lounge Zone',
      image: '/images/recreation_card.png',
      description: 'Interactive spaces featuring indoor table games, audio-visual screens, and social hubs for students to unwind and connect.',
      order: 8,
      status: 'Active'
    },
    {
      id: 'fac-9',
      title: 'Wi-Fi & Technology',
      tag: 'High-Speed',
      image: '/images/wifi_card.png',
      description: 'High-speed campus-wide wireless internet access to support digital education, video analysis of sports, and communication.',
      order: 9,
      status: 'Active'
    }
  ];

  for (const fac of initialFacilities) {
    await Facility.updateOne({ id: fac.id }, { $setOnInsert: fac }, { upsert: true });
  }
  console.log("All 9 facility cards populated/verified.");

  console.log("Database seeding completed.");
  await mongoose.connection.close();
  console.log("Connection closed.");
}

seed().catch(err => {
  console.error("Database seeding failed:", err);
  process.exit(1);
});
