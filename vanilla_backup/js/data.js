// Sports Academy Demo Data

export const programsData = {
  beginner: {
    title: "Beginner Sports Program",
    subtitle: "Building Solid Foundations (Ages 5 - 12)",
    description: "Our Beginner Program is specifically structured to introduce children to the joy of sports, developing fundamental motor skills, spatial awareness, teamwork, and baseline techniques. We focus on active learning, ensuring every child builds confidence while staying physically active.",
    benefits: [
      "Fundamental movement skills (running, jumping, throwing, catching)",
      "Basic sports terminology and game rules",
      "Hand-eye coordination and spatial awareness",
      "Introduction to teamwork and sportsmanship",
      "Low student-to-coach ratio (8:1) for personalized attention"
    ],
    schedule: "Every Monday, Wednesday & Friday | 4:00 PM - 5:30 PM",
    pricing: "₹3,500 / Month",
    image: "beginner"
  },
  advanced: {
    title: "Advanced Performance Program",
    subtitle: "Shaping Competitive Champions (Ages 12 - 18)",
    description: "Designed for youth athletes aspiring to compete at district, state, or national levels. This intensive program includes rigorous tactical sessions, strength & conditioning, video analysis, mental toughness workshops, and nutrition guidance. Led by elite-licensed coaches.",
    benefits: [
      "High-intensity technical and tactical training",
      "Individual performance analysis using slow-motion video playback",
      "Strength, speed, and endurance conditioning sessions",
      "Tactical positioning and game-play strategy",
      "Mental conditioning, pressure management, and tournament preparation"
    ],
    schedule: "Tuesday, Thursday & Saturday | 5:00 PM - 7:30 PM",
    pricing: "₹6,000 / Month",
    image: "advanced"
  },
  summer: {
    title: "Elite Summer Camp 2026",
    subtitle: "Accelerated Skill Development & Fun",
    description: "Our highly anticipated Annual Summer Camp runs for 6 weeks, offering children an immersive environment to try multiple sports or specialize in their favorite one. It combines intensive daily training with exciting friendly matches, team challenges, and fun recreational activities.",
    benefits: [
      "Daily multi-sport modules and specialized coaching clinics",
      "Guest sessions by national-level athletes and sports experts",
      "Academy jersey kit, certificates, and participation medals",
      "Exciting weekend mini-tournaments and parent-athlete relays",
      "Hydration and energy snacks provided daily"
    ],
    schedule: "May 1st - June 15th | Daily 8:00 AM - 11:30 AM",
    pricing: "₹8,500 (One-time Registration)",
    image: "summer"
  },
  personal: {
    title: "Personal Coaching & Mentorship",
    subtitle: "Tailored Development for Elite Athletes",
    description: "Get undivided attention from our senior head coaches. A highly customizable program where coaches customize drills, physical conditioning, and performance strategies specifically to address the athlete's strengths, weaknesses, and playing position. Includes personalized diet plans.",
    benefits: [
      "1-on-1 dedicated training sessions with certified head coaches",
      "Custom progression plans updated weekly based on fitness metrics",
      "Detailed biomechanical analysis of techniques (e.g., swing, kick, throw)",
      "Tailored nutritional mapping, hydration guides, and lifestyle coaching",
      "Flexible timing schedules to accommodate academic profiles"
    ],
    schedule: "Flexible Booking | Standard: 3 sessions per week",
    pricing: "₹12,000 / Month",
    image: "personal"
  }
};

export const sportsList = [
  {
    id: "football",
    name: "Football (Soccer)",
    category: "Team Sports",
    age: "Ages 6+",
    description: "Master ball control, tactical passing, off-the-ball movement, and positioning. Our academy pitch features state-of-the-art FIFA-certified turf.",
    icon: "⚽"
  },
  {
    id: "basketball",
    name: "Basketball",
    category: "Team Sports",
    age: "Ages 7+",
    description: "Focuses on dribbling speed, shooting forms, tactical defensive press, transition gameplay, and fast-breaks on our indoor wooden court.",
    icon: "🏀"
  },
  {
    id: "tennis",
    name: "Lawn Tennis",
    category: "Racket Sports",
    age: "Ages 6+",
    description: "Covers forehand/backhand techniques, court coverage, serves, volleys, and baseline strategies. Featuring clay and hard courts.",
    icon: "🎾"
  },
  {
    id: "swimming",
    name: "Swimming",
    category: "Aquatic Sports",
    age: "Ages 5+",
    description: "From water adaptation to Olympic-level stroke refinement (Freestyle, Breaststroke, Backstroke, Butterfly). Taught in our temperature-controlled pool.",
    icon: "🏊"
  },
  {
    id: "cricket",
    name: "Cricket",
    category: "Team Sports",
    age: "Ages 8+",
    description: "Learn batting technique, bowling actions, spin variations, wicket-keeping, and modern power-hitting. Equpped with automated bowling machines.",
    icon: "🏏"
  },
  {
    id: "badminton",
    name: "Badminton",
    category: "Racket Sports",
    age: "Ages 6+",
    description: "Develop explosive footwork, court speed, wrist-flex smash techniques, and deceptive net play. Hosted inside our multi-court indoor stadium.",
    icon: "🏸"
  },
  {
    id: "athletics",
    name: "Athletics (Track & Field)",
    category: "Individual Sports",
    age: "Ages 8+",
    description: "Coaches specialize in sprints, middle-distance running, long-jump, and hurdles, building core explosive power and endurance on our synthetic track.",
    icon: "🏃"
  },
  {
    id: "tabletennis",
    name: "Table Tennis",
    category: "Racket Sports",
    age: "Ages 6+",
    description: "Sharpen lightning-fast reflexes, paddle spin angles, control, block, and loop counters on international-standard butterfly tables.",
    icon: "🏓"
  }
];

export const coachesList = [
  {
    name: "Coach Rajesh Sen",
    role: "Head Football Coach",
    specialization: "UEFA 'A' Licensed Coach, Ex-National Player",
    experience: "15+ Years Coaching",
    bio: "Coach Rajesh has guided youth teams to national championships and specialized in advanced youth player scouting and tactical positioning frameworks.",
    avatar: "👨‍🏫"
  },
  {
    name: "Coach Sarah D'Souza",
    role: "Head Swimming Coach",
    specialization: "ASCA Level 4 Certified, Olympic Trialist",
    experience: "12+ Years Coaching",
    bio: "Sarah brings high-performance aquatic training methods, specializing in stroke biomechanics and cardiovascular conditioning systems.",
    avatar: "👩‍🏫"
  },
  {
    name: "Coach Vikram Rathore",
    role: "Senior Cricket Director",
    specialization: "BCCI Level 3 Coach, Ex-Ranji Trophy Captain",
    experience: "18+ Years Coaching",
    bio: "Vikram specializes in batting biomechanics and player mental performance, helping over a dozen academy players make state debuts.",
    avatar: "👨‍🏫"
  },
  {
    name: "Coach Priya Nair",
    role: "Head Tennis Coach",
    specialization: "ITF Level 2 Certified Coach",
    experience: "10+ Years Coaching",
    bio: "Priya emphasizes footwork efficiency and baseline aggression. She has produced 5 top-ranked national junior tennis players.",
    avatar: "👩‍🏫"
  }
];

export const successStories = [
  {
    name: "Aman Malhotra",
    sport: "Cricket (Under-19 State Team)",
    achievement: "Selected for National Zonal Academy",
    quote: "Ranilaxmibai Academy took me from playing street cricket to representing the state. The structured training, fitness drills, and mental preparation completely changed my game.",
    image: "aman"
  },
  {
    name: "Rhea Deshmukh",
    sport: "Swimming (National Gold Medalist)",
    achievement: "3 Gold Medals at SGFI National Games",
    quote: "The temperature-controlled Olympic pool and Sarah Coach's stroke adjustments were critical. Ranilaxmibai provided me with the discipline needed to compete at the highest level.",
    image: "rhea"
  },
  {
    name: "Kabir Mehta",
    sport: "Football (Elite Youth League)",
    achievement: "Signed Professional Youth Contract with ISL Club",
    quote: "The tactical drills and video feedback at Ranilaxmibai prepared me for trials. The exposure matches organized by the academy gave me visibility to top scouts.",
    image: "kabir"
  }
];

export const certificationsList = [
  {
    title: "Affiliated with Sports Authority of India (SAI)",
    authority: "Ministry of Youth Affairs and Sports",
    description: "Ranilaxmibai Sports Academy is officially recognized as a regional training partner under SAI, promoting standard sports curriculum and youth development programs.",
    badge: "🏛️"
  },
  {
    title: "FIFA Quality Standard Facility Certification",
    authority: "FIFA Development Committee",
    description: "Our football pitch has been certified for optimal shock absorption, ball bounce, and player traction, ensuring maximum safety and professional play parameters.",
    badge: "⚽"
  },
  {
    title: "ISO 9001:2015 Quality Management",
    authority: "International Standards Organization",
    description: "Certified for maintaining top safety standards, qualified coaching hierarchies, standardized sports curriculum, and state-of-the-art facility hygiene.",
    badge: "📜"
  }
];

export const faqsList = [
  {
    question: "What is the minimum age to enroll in Ranilaxmibai Sports Academy?",
    answer: "Our minimum enrollment age is 5 years for Swimming and 6 years for sports like Football, Tennis, and Table Tennis. We design specific fundamental movement modules tailored for early-childhood sports adaptation."
  },
  {
    question: "Are coaches certified and verified?",
    answer: "Absolutely. Every single coach at Ranilaxmibai holds recognized certifications (e.g., UEFA, BCCI, ITF, ASCA, SAI) and undergoes rigorous background verifications, safety audits, and child protection training before joining our teaching staff."
  },
  {
    question: "Does the academy provide transport services for students?",
    answer: "Yes, we operate air-conditioned shuttle buses across major routes in the city for morning and evening batches. Detailed routes, pick-up points, and monthly transport fees can be requested at the reception desk."
  },
  {
    question: "Can an athlete switch sports after enrollment?",
    answer: "Yes. In our Beginner Program, we encourage multi-sport exploration. If a student shows strong aptitude or interest in a different sport, they can transition to another program at the end of their monthly cycle after consulting with our coaches."
  },
  {
    question: "How do you evaluate and track student progress?",
    answer: "We perform quarterly assessments tracking athletic parameters (speed, flexibility, strength, agility) alongside sport-specific technical skills. Parents receive detailed digital report cards, and coaches sit down for individual feedback sessions."
  }
];

export const galleryItems = [
  {
    id: 1,
    title: "State-of-the-Art Indoor Basketball Arena",
    category: "facilities-tour",
    mediaType: "photo",
    src: "basketball_court"
  },
  {
    id: 2,
    title: "Under-15 Football Team Winning the Regional Cup",
    category: "tournament-highlights",
    mediaType: "photo",
    src: "football_win"
  },
  {
    id: 3,
    title: "Our Olympic-size Temperature Controlled Pool",
    category: "facilities-tour",
    mediaType: "photo",
    src: "swimming_pool"
  },
  {
    id: 4,
    title: "Interactive Strength & Conditioning Seminar",
    category: "academy-events",
    mediaType: "photo",
    src: "strength_conditioning"
  },
  {
    id: 5,
    title: "Rhea Deshmukh receiving National Gold Medal",
    category: "student-achievements",
    mediaType: "photo",
    src: "rhea_gold"
  },
  {
    id: 6,
    title: "Summer Camp Opening Ceremony Highlights",
    category: "academy-events",
    mediaType: "photo",
    src: "summer_camp_opening"
  },
  {
    id: 7,
    title: "Featured Article on Youth Sports in Times Herald",
    category: "media-coverage",
    mediaType: "photo",
    src: "media_article"
  },
  {
    id: 8,
    title: "Coach Rajesh demonstrating tactical passing drills",
    category: "videos",
    mediaType: "video",
    src: "passing_drills"
  },
  {
    id: 9,
    title: "Intense Cricket Academy Net Practice Sessions",
    category: "photos",
    mediaType: "photo",
    src: "cricket_practice"
  },
  {
    id: 10,
    title: "High Performance Tennis Volley Drill",
    category: "tournament-highlights",
    mediaType: "photo",
    src: "tennis_volley"
  }
];

export const eventsList = [
  {
    id: "evt-1",
    title: "Ranilaxmibai Inter-Academy Football Championship 2026",
    category: "tournaments",
    date: "2026-08-10",
    time: "09:00 AM onwards",
    venue: "Main Football Turf",
    description: "An elite youth tournament featuring 16 top football academies from the western region. Scouts from leading professional clubs will be in attendance. Registration is mandatory for player participation.",
    status: "open"
  },
  {
    id: "evt-2",
    title: "Specialized Sports Nutrition & Diet Clinic",
    category: "workshops-clinics",
    date: "2026-08-22",
    time: "10:00 AM - 01:00 PM",
    venue: "Main Academy Seminar Hall",
    description: "Led by certified sports nutritionist Dr. Anjali Bose. Learn meal prep, performance hydration protocols, carb-loading schedules, and recovery supplements tailored for active young athletes. Free for parents and students.",
    status: "open"
  },
  {
    id: "evt-3",
    title: "Ranilaxmibai Winter Training Camp 2026",
    category: "summer-winter-camps",
    date: "2026-12-15",
    time: "Daily 07:30 AM - 12:00 PM",
    venue: "All Multi-Sport Facilities",
    description: "Accelerate development during winter holidays with high-intensity drills, fitness training, and team building workshops. Open for age groups 7 to 17.",
    status: "upcoming"
  },
  {
    id: "evt-4",
    title: "Junior Tennis Challenger Series",
    category: "tournaments",
    date: "2026-09-05",
    time: "08:00 AM onwards",
    venue: "Ranilaxmibai Clay Courts",
    description: "A competitive local tournament for boys and girls under-12 and under-16. Trophies, merchandise vouchers, and ranking points to be won.",
    status: "upcoming"
  }
];

export const blogPosts = [
  {
    id: "blog-1",
    title: "The Role of Hydration in High-Performance Training",
    category: "nutrition-diet",
    excerpt: "Discover why water is the most critical fuel for an athlete's muscles, and how even mild dehydration can drop your athletic performance by 15%.",
    content: "When training at a high intensity, an athlete loses vital fluids and electrolytes through sweat. Dehydration leads to premature fatigue, muscle cramps, and reduced mental focus. Experts recommend consuming 500ml of water 2 hours before training, sipping fluids every 15 minutes during activity, and restoring hydration post-workout. Incorporating natural electrolytes like coconut water can significantly improve recovery speed and overall muscle responsiveness.",
    author: "Dr. Anjali Bose (Sports Dietician)",
    date: "July 12, 2026",
    image: "hydration"
  },
  {
    id: "blog-2",
    title: "Developing Mental Resilience in Youth Sports",
    category: "training-tips",
    excerpt: "Coaches share core techniques for helping young players overcome mistakes, manage pre-match anxiety, and focus on steady progressive growth.",
    content: "Talent and physical preparation are only half the battle; mental resilience defines champions. At Ranilaxmibai, we teach youth athletes to replace self-doubt with positive self-talk. Using deep-breathing exercises before a high-pressure match helps regulate heart rates. We encourage athletes to view mistakes not as failures, but as actionable feedback loops that will help improve their tactical positioning in the subsequent play.",
    author: "Coach Rajesh Sen",
    date: "June 28, 2026",
    image: "resilience"
  },
  {
    id: "blog-3",
    title: "5 Core Exercises for Building Explosive Power",
    category: "fitness-tips",
    excerpt: "Enhance your sprint speeds and vertical jump capabilities with these key strength & conditioning exercises recommended for youth athletes.",
    content: "Explosive speed is crucial in almost all modern sports, from accelerating past a defender in football to covering a tennis court. Incorporating plyometric drills like box jumps, kettlebell swings, medicine ball slams, and walking lunges into your weekly training program builds high-twitch muscle fibers. Always ensure warm-ups and correct alignment under a trainer's supervision to prevent joint injuries.",
    author: "Trainer Vikram Rathore",
    date: "June 15, 2026",
    image: "explosive_power"
  },
  {
    id: "blog-4",
    title: "Ranilaxmibai Sports Academy expands to Vadodara with Brand New Complex",
    category: "announcements",
    excerpt: "We are thrilled to announce the upcoming launch of our second state-of-the-art sports complex featuring premium indoor courts and fields.",
    content: "In our quest to make premium athletic training accessible to more aspiring talent, we are opening a brand-new training campus in Vadodara. The new complex will feature an indoor wooden basketball court, six clay tennis courts, automated cricket lanes, and a fully equipped biomechanics analysis lab. Registrations for the initial batch open next month with special early-bird scholarship offers.",
    author: "Academy Director Office",
    date: "May 20, 2026",
    image: "announcement"
  }
];
