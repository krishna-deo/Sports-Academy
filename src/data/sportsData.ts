// Sports Academy Data & Types

export interface SportItem {
  id: string;
  name: string;
  category: string;
  age: string;
  description: string;
  icon: string;
}

export interface CoachItem {
  name: string;
  role: string;
  specialization: string;
  experience: string;
  bio: string;
  avatar: string;
}

export interface SuccessStory {
  name: string;
  sport: string;
  achievement: string;
  quote: string;
  image: string;
}

export interface CertificationItem {
  title: string;
  authority: string;
  description: string;
  badge: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  mediaType: "photo" | "video";
  src: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  status: "open" | "upcoming" | "closed";
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
}

export const sportsList: SportItem[] = [
  {
    id: "football",
    name: "Football",
    category: "Team Sports",
    age: "Ages 6+",
    description: "Master ball control, tactical passing, defensive press, and team coordination on our outdoor turf pitches.",
    icon: "⚽"
  },
  {
    id: "handball",
    name: "Handball",
    category: "Team Sports",
    age: "Ages 8+",
    description: "Develop speed dribbling, tactical coordination, dynamic jumps, and high-precision throwing techniques.",
    icon: "🤾"
  },
  {
    id: "rugby",
    name: "Rugby",
    category: "Team Sports",
    age: "Ages 10+",
    description: "Learn safe contact tackling, scrums, passing, and teamwork under professional guidelines.",
    icon: "🏉"
  },
  {
    id: "athletics",
    name: "Athletics",
    category: "Individual Sports",
    age: "Ages 6+",
    description: "Refine sprinting forms, endurance, hurdles, long jump, and general physical performance metrics.",
    icon: "🏃"
  }
];

export const coachesList: CoachItem[] = [
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

export const successStories: SuccessStory[] = [
  {
    name: "Aarti Kumari",
    sport: "Handball (Under-19 State Team)",
    achievement: "Represented Bihar at School National Games",
    quote: "Rani Laxmibai Academy gave me free boarding, kit, and coaching that changed my life. Now, I hope to represent India.",
    image: "aarti"
  },
  {
    name: "Pooja Patel",
    sport: "Football (National Sub-Junior Camp)",
    achievement: "Selected for National Zonal Selection",
    quote: "The intensive practice matches and constant support of coaches prepared me for national-level trials.",
    image: "pooja"
  },
  {
    name: "Rahul Kumar",
    sport: "Athletics (100m Sprint Gold)",
    achievement: "Gold Medal at State Athletics Championship",
    quote: "Refining my sprinting form with Coach Vikram helped me shave off half a second from my running times.",
    image: "rahul"
  }
];

export const certificationsList: CertificationItem[] = [
  {
    title: "Affiliated with Bihar State Sports Association",
    authority: "State Sports Ministry",
    description: "RLBSA is recognized as a key partner for scouting and nurturing rural sports talent across Bihar.",
    badge: "🏛️"
  },
  {
    title: "NFI Supporting Partner",
    authority: "National Foundation for India",
    description: "Working together to make boarding, education, and sports kits free for kids from underprivileged families.",
    badge: "🤝"
  },
  {
    title: "Standard Safety Certification",
    authority: "Sports Board India",
    description: "Certified for maintaining strict safety regulations, certified coaching roster, and first-aid kits.",
    badge: "📜"
  }
];

export const faqsList: FaqItem[] = [
  {
    question: "What is the fee structure at RLBSA?",
    answer: "Rani Laxmibai Sports Academy provides boarding, nutritious meals, coaching, sports kits, and school education completely FREE of charge for selected talented kids from rural and underprivileged backgrounds."
  },
  {
    question: "Which sports are coached at the academy?",
    answer: "We specialize in four sports: Football, Handball, Rugby, and Athletics (Track & Field)."
  },
  {
    question: "How are students selected for the academy?",
    answer: "We organize annual trials across districts of Bihar to identify kids with strong physical parameters and raw athletic talent. Selected candidates receive boarding scholarships."
  },
  {
    question: "Does the academy focus on education as well?",
    answer: "Yes. Every student-athlete at RLBSA is enrolled in local partner schools. We provide tuition support, English speaking classes, public speaking clinics, and personality development workshops."
  }
];

export const galleryItems: GalleryItem[] = [
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

export const eventsList: EventItem[] = [
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

export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    title: "The Importance of Hydration in High-Performance Training",
    category: "nutrition",
    excerpt: "Discover why clean water is the most critical fuel for an athlete's muscles and endurance.",
    content: "When training at a high intensity in outdoor environments, an athlete loses vital fluids through sweat. Dehydration leads to premature fatigue, muscle cramps, and reduced focus. At the academy, we guide athletes to consume water before, during, and after practice sessions to keep muscles fully responsive.",
    author: "Diet Support Team",
    date: "July 12, 2026",
    image: "hydration"
  },
  {
    id: "blog-2",
    title: "Developing Mental Resilience in Young Athletes",
    category: "training",
    excerpt: "Coaches share core techniques for helping young players overcome mistakes and stay confident.",
    content: "Talent is only half the battle; mental resilience defines champions. At RLBSA, we teach youth athletes to replace self-doubt with positive talk and to view mistakes as actionable feedback loops that will help improve their next play.",
    author: "Coach Rajesh Sen",
    date: "June 28, 2026",
    image: "resilience"
  },
  {
    id: "blog-3",
    title: "Core Drills for Building Sprint Acceleration",
    category: "fitness",
    excerpt: "Enhance your sprint speeds and power with these drills recommended by our coaches.",
    content: "Explosive speed is crucial in Football, Handball, Rugby, and Track. Incorporating plyometric drills, medicine ball throws, and high-knee skips into weekly workouts builds fast-twitch muscle fibers.",
    author: "Coach Vikram Rathore",
    date: "June 15, 2026",
    image: "explosive_power"
  }
];
