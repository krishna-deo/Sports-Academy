import React from 'react';
import { X, ArrowRight } from '@phosphor-icons/react';
import { teamMembers } from '../data/teamData';
import { defaultStaffMembers } from '../data/teamMembersData';
import { useHash } from '../hooks/useHash';
import { getBioParagraphs } from '../utils/textUtils';

interface AboutProps {
  sub: string;
}

interface RevealRowProps {
  id: string;
  className?: string;
  children: (visible: boolean) => React.ReactNode;
}

const RevealRow: React.FC<RevealRowProps> = ({ id, className, children }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div ref={ref} id={id} className={className} data-id={id}>
      {children(isVisible)}
    </div>
  );
};

const defaultMilestones = [
  {
    _id: 't2009',
    year: '2009',
    title: 'The Beginning',
    subtitle: 'Milestone Year',
    description: 'Rani Laxmibai Sports Academy (RLBSA) was established in Laxmipur, Siwan, Bihar with a vision to identify and nurture rural talent, especially girls, through sports and education.',
    image: '/images/hero1.jpeg'
  },
  {
    _id: 't2010',
    year: '2010',
    title: 'First Batch',
    subtitle: 'First Cohort',
    description: 'Our first cohort of 15 girls began training in athletics and handball, defying local societal norms to pursue active sports leadership careers.',
    image: '/images/player_rahul.png'
  },
  {
    _id: 't2016',
    year: '2016',
    title: 'National Recognition',
    subtitle: 'National Stage',
    description: 'Several academy athletes earned opportunities to represent India and their respective states in national and international competitions, bringing recognition to rural Bihar.',
    image: '/images/about_rlbsa.jpeg'
  },
  {
    _id: 't2020',
    year: '2020',
    title: 'Campus Completed',
    subtitle: 'Campus Completed',
    description: 'A major milestone was achieved with the completion of a residential hostel facility accommodating approximately 50 children, while another 50 non-residential students continued receiving support.',
    image: '/images/hero1.jpeg'
  },
  {
    _id: 't2021',
    year: '2021',
    title: 'Growth Beyond Sports',
    subtitle: 'Growth Beyond Sports',
    description: 'Beyond sports coaching, the academy expanded focus to formal education, English communication, public speaking, personality development, and life skills training.',
    image: '/images/player_rahul.png'
  },
  {
    _id: 't2022',
    year: '2022',
    title: 'Community Partners',
    subtitle: 'Community Partners',
    description: 'Support from organizations such as the National Foundation for India, Garnet Foundation, Nalanda Charitable Foundation, and IMA Siwan enabled the academy to strengthen facilities.',
    image: '/images/about_rlbsa.jpeg'
  },
  {
    _id: 'tToday',
    year: 'Today',
    title: 'Transforming Rural Talent',
    subtitle: 'Empowering Bihar',
    description: 'Today, RLBSA supports over 100 young athletes through free coaching, accommodation, meals, education, and tournament exposure, empowering rural youth, especially girls.',
    image: '/images/hero2.jpg'
  }
];

const defaultFacilities = [
  {
    id: 'fac-1',
    title: 'Sports Infrastructure',
    tag: 'Olympic Standard',
    image: '/images/sports_training_card.jpg',
    description: 'Vast outdoor turf, international track fields, court complexes, and specialized indoor arenas built for high-performance athletic training.'
  },
  {
    id: 'fac-2',
    title: 'Gym & Fitness Center',
    tag: 'Advanced Gear',
    image: '/images/gym_card.png',
    description: 'State-of-the-art strength and conditioning facility equipped with elite weight training, cardio, and performance tracking systems.'
  },
  {
    id: 'fac-3',
    title: 'Hostel & Accommodation',
    tag: 'Residential',
    image: '/images/hostel_card.png',
    description: 'Secure, hygienic, and comfortable residential dormitories for student-athletes with dedicated study zones and lounge areas.'
  },
  {
    id: 'fac-4',
    title: 'Mess & Dining',
    tag: 'Nutritional Diet',
    image: '/images/nutrition_card.jpg',
    description: 'Expert calorie-mapped kitchen providing high-protein, balanced meal plans custom-tailored by sports nutritionists for athlete recovery.'
  },
  {
    id: 'fac-5',
    title: 'Education & Study Facilities',
    tag: 'Modern Learning',
    image: '/images/education_card.jpg',
    description: 'Fully-equipped classrooms, computer labs, and a quiet library supporting academic tutoring and personality development sessions.'
  },
  {
    id: 'fac-6',
    title: 'Medical & Physiotherapy',
    tag: '24/7 Care',
    image: '/images/medical_card.png',
    description: 'On-campus medical clinic and physiotherapy unit offering active recovery therapies, injury rehabilitation, and routine health checks.'
  },
  {
    id: 'fac-7',
    title: 'Safety & Security',
    tag: 'Secure Campus',
    image: '/images/security_card.png',
    description: '24/7 round-the-clock gated security, CCTV surveillance networks, and trained staff ensuring a safe environment for all trainees.'
  },
  {
    id: 'fac-8',
    title: 'Recreation & Common Areas',
    tag: 'Lounge Zone',
    image: '/images/recreation_card.png',
    description: 'Interactive spaces featuring indoor table games, audio-visual screens, and social hubs for students to unwind and connect.'
  },
  {
    id: 'fac-9',
    title: 'Wi-Fi & Technology',
    tag: 'High-Speed',
    image: '/images/wifi_card.png',
    description: 'High-speed campus-wide wireless internet access to support digital education, video analysis of sports, and communication.'
  }
];

const defaultWhatWeDoCards = [
  {
    id: 'sports',
    tag: 'Athletic Development',
    title: 'Sports Training',
    description: 'Providing top-tier professional coaching in multiple fields including Football, Handball, Rugby, and Athletics. The academy offers structured training regimes, regular physical fitness audits, and full sponsorship for representing the state and nation in high-profile competitions.',
    image: '/images/sports_training_card.jpg',
    features: ['🏅 Elite Certified Coaches', '⚽ Free Professional Gear', '🏃 Daily Conditioning Drills', '🏆 Tournament Sponsorship']
  },
  {
    id: 'education',
    tag: 'Academic Excellence',
    title: 'Education & Academic Support',
    description: 'Ensuring formal schooling for every athlete at local schools and colleges with full tuition and textbook coverage. In addition to primary schooling, the foundation runs daily personality development workshops, computer literacy classes, and English speaking courses.',
    image: '/images/education_card.jpg',
    features: ['📚 100% Tuition Coverage', '💬 English Speaking Classes', '💻 Computer Literacy Labs', '🌱 Life Skills & Guidance']
  },
  {
    id: 'nutrition',
    tag: 'Dietary Health',
    title: 'Food & Nutrition',
    description: 'Providing daily healthy high-protein diets designed specifically to support rigorous sports training. All meals are calorie-mapped under expert supervision to build muscle, increase speed, and promote rapid physical recovery after games.',
    image: '/images/nutrition_card.jpg',
    features: ['🥗 Expert Calorie-Mapped', '🥩 High-Protein Diets', '🩺 Regular Health Audits', '🥛 Daily Supplements & Milk']
  },
  {
    id: 'hostel',
    tag: 'Residential Boarding',
    title: 'Hostel & Accommodation',
    description: 'Offering standard, secure, and hygienic boarding hostels accommodating up to 50 resident students. The facility features dynamic studying halls, clean laundry rooms, recreation zones, and gated surveillance for safety.',
    image: '/images/hostel_card.png',
    features: ['🏠 Hygienic Dormitory', '🔒 Secure Gated Watch', '📖 Study Halls & Library', '🧺 Laundry & Hygiene Care']
  },
  {
    id: 'transportation',
    tag: 'Safe Transit',
    title: 'Transportation',
    description: 'Ensuring daily secure pickup and drop transit services for non-residential local student-athletes. Our dedicated fleet of buses and vans enables students from remote rural locations to commute safely and punctually for daily practices and academic lectures.',
    image: '/images/transportation_card.png',
    features: ['🚌 Free Pick & Drop', '📍 GPS Fleet Tracking', '🛡️ Safe & Trained Drivers', '🕒 Daily Timely Commutes']
  }
];

export const About: React.FC<AboutProps> = ({ sub }) => {
  const [team, setTeam] = React.useState<any[]>(teamMembers);
  const [staffTeam, setStaffTeam] = React.useState<any[]>(defaultStaffMembers);
  const [milestones, setMilestones] = React.useState<any[]>(defaultMilestones);
  const [facilities, setFacilities] = React.useState<any[]>(defaultFacilities);
  const [whatWeDoList, setWhatWeDoList] = React.useState<any[]>(defaultWhatWeDoCards);
  const [outreachData, setOutreachData] = React.useState<any>(null);
  const [visionMission, setVisionMission] = React.useState<any>(null);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/public/what-we-do')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setWhatWeDoList(data);
        }
      })
      .catch(err => console.error("Error loading what-we-do database values:", err));
  }, []);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/public/vision-mission')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setVisionMission(data);
        }
      })
      .catch(err => console.error("Error loading vision-mission data:", err));
  }, []);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/public/outreach')
      .then(res => res.json())
      .then(data => {
        if (data && data.header) {
          setOutreachData(data);
        }
      })
      .catch(err => console.error("Error loading outreach program data:", err));
  }, []);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/public/story-milestones')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setMilestones(data);
        }
      })
      .catch(err => console.error("Error loading story milestones:", err));
  }, []);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/public/team')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTeam(data);
        }
      })
      .catch(err => console.error("Error loading team database values:", err));
  }, []);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/public/staff-team')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setStaffTeam(data);
        }
      })
      .catch(err => console.error("Error loading staff team values:", err));
  }, []);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/public/facilities')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setFacilities(data);
        }
      })
      .catch(err => console.error("Error loading facilities:", err));
  }, []);

  const hash = useHash();

  React.useEffect(() => {
    const hashParts = hash.split('?');
    if (hashParts.length > 1) {
      const params = new URLSearchParams(hashParts[1]);
      let targetId = '';
      if (sub === 'founders' || sub === 'team' || sub === 'team-members') {
        targetId = params.get('member') || '';
      } else if (sub === 'what-we-do') {
        targetId = params.get('section') || '';
      }

      if (targetId) {
        const scrollToElement = () => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'auto', block: 'center' });
            return true;
          }
          return false;
        };

        // Try immediately
        if (!scrollToElement()) {
          const interval = setInterval(() => {
            if (scrollToElement()) {
              clearInterval(interval);
            }
          }, 50);
          setTimeout(() => clearInterval(interval), 1000);
        }
      }
    }
  }, [hash, sub]);

  return (
    <section className="py-20 px-5 max-w-[1380px] mx-auto animate-fade-in">
      {sub === 'story' && (
        <>
          {/* Centered Heading */}
          <div className="text-center max-w-[700px] mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent animate-fade-in">
              Our Story
            </h2>
            <p className="text-text-light text-sm md:text-base animate-fade-in">
              The inspiring journey of Rani Laxmibai Sports Academy in identifying, nurturing, and empowering rural youth in Bihar through sports and education.
            </p>
          </div>

          {/* Text-Only Justified Paragraphs Layout (No Photos) */}
          <div className="max-w-[1180px] mx-auto mb-20 space-y-6 px-2 sm:px-4">
            {milestones.map((item, idx) => {
              const paragraphs = item.description ? item.description.split('\n').filter(Boolean) : [];
              return (
                <RevealRow key={item._id || idx} id={`story-para-${idx}`} className="w-full">
                  {(isVisible) => (
                    <div className={`transition-all duration-[800ms] ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} space-y-5`}>
                      {paragraphs.map((para: string, pIdx: number) => {
                        const formattedText = para
                          .replace(/<strong>(.*?)<\/strong>/gi, '<strong class="font-extrabold text-[#082142]">$1</strong>')
                          .replace(/<b>(.*?)<\/b>/gi, '<strong class="font-extrabold text-[#082142]">$1</strong>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-[#082142]">$1</strong>');

                        return (
                          <p 
                            key={pIdx} 
                            className="text-slate-700 text-xs md:text-sm leading-relaxed text-justify font-normal"
                            dangerouslySetInnerHTML={{ __html: formattedText }}
                          />
                        );
                      })}
                    </div>
                  )}
                </RevealRow>
              );
            })}
          </div>

          {/* VISION & MISSION SECTION (Positioned right below all story milestones) */}
          <div className="mt-28 pt-16 border-t border-border-gray/60 max-w-[1100px] mx-auto">
            <div className="text-center max-w-[700px] mx-auto mb-16">
              <h3 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent animate-fade-in">
                Vision &amp; Mission
              </h3>
              <p className="text-text-light text-sm md:text-base animate-fade-in">
                The core philosophies that drive our athlete development, community upliftment, and long-term goals.
              </p>
            </div>

            <div className="flex flex-col gap-20 mb-16">
              {/* MISSION ROW */}
              <RevealRow id="mission-row" className="flex flex-col lg:flex-row items-center justify-between gap-12 text-left">
                {(isVisible) => (
                  <>
                    <div className={`w-full lg:w-[48%] transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                      <span className="text-[10px] font-black text-[#00a896] uppercase tracking-[0.2em] mb-2.5 block">
                        {visionMission?.missionPurpose || 'Our Purpose'}
                      </span>
                      <h4 className="text-3xl md:text-4xl font-black text-[#082142] mb-5 leading-tight">
                        {visionMission?.missionTitle || 'Our Mission'}
                      </h4>
                      <p 
                        className="text-slate-500 text-sm leading-relaxed mb-8 font-medium text-justify"
                        dangerouslySetInnerHTML={{
                          __html: (visionMission?.missionDescription || "RLBSA strives for excellence in sports development by providing access to quality training, guidance, and opportunities. Through our dedication, we aim to inspire young athletes, nurture their potential, and empower them to achieve greatness while transforming lives through sports.")
                            .replace(/<strong>(.*?)<\/strong>/gi, '<strong class="font-extrabold text-[#082142]">$1</strong>')
                            .replace(/<b>(.*?)<\/b>/gi, '<strong class="font-extrabold text-[#082142]">$1</strong>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-[#082142]">$1</strong>')
                        }}
                      />
                      {visionMission?.missionBtnText && (
                        <a
                          href={visionMission.missionBtnLink || '#/about/outreach-program'}
                          className="inline-flex items-center gap-2 bg-[#082142] hover:bg-[#00a896] text-white hover:text-white font-bold py-3.5 px-8 rounded-full text-xs uppercase tracking-wider shadow transition-colors duration-300 border-none cursor-pointer"
                        >
                          {visionMission.missionBtnText}
                        </a>
                      )}
                    </div>

                    <div className={`w-full lg:w-[48%] transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
                      <div className="relative rounded-xl overflow-hidden shadow-lg aspect-[4/3] border border-slate-100 bg-[#082142]/5">
                        <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden">
                          <img 
                            src={visionMission?.missionImage || '/images/hero2.jpg'} 
                            alt="Our Mission Team" 
                            className="w-full h-full object-cover rounded-tl-[5rem]" 
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </RevealRow>

              {/* VISION ROW */}
              <RevealRow id="vision-row" className="flex flex-col lg:flex-row items-center justify-between gap-12 text-left">
                {(isVisible) => (
                  <>
                    {/* Left Side: Single Image shape matching Mission */}
                    <div className={`w-full lg:w-[48%] transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'} order-2 lg:order-1`}>
                      <div className="relative rounded-xl overflow-hidden shadow-lg aspect-[4/3] border border-slate-100 bg-[#082142]/5">
                        <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden">
                          <img 
                            src={visionMission?.visionImage || '/images/about_rlbsa.jpeg'} 
                            alt="Our Vision Athlete" 
                            className="w-full h-full object-cover rounded-tr-[5rem]" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Text details */}
                    <div className={`w-full lg:w-[48%] transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'} order-1 lg:order-2`}>
                      <span className="text-[10px] font-black text-[#00a896] uppercase tracking-[0.2em] mb-2.5 block">
                        {visionMission?.visionFuture || 'Our Future'}
                      </span>
                      <h4 className="text-3xl md:text-4xl font-black text-[#082142] mb-5 leading-tight">
                        {visionMission?.visionTitle || 'Our Vision'}
                      </h4>
                      <p 
                        className="text-slate-500 text-sm leading-relaxed mb-8 font-medium text-justify"
                        dangerouslySetInnerHTML={{
                          __html: (visionMission?.visionDescription || "To envision a world transformed by the power of sports, creating positive change for youth athletes and communities. We strive to provide every aspiring athlete with opportunities to grow, achieve excellence, and contribute to healthier, stronger, and more inclusive communities.")
                            .replace(/<strong>(.*?)<\/strong>/gi, '<strong class="font-extrabold text-[#082142]">$1</strong>')
                            .replace(/<b>(.*?)<\/b>/gi, '<strong class="font-extrabold text-[#082142]">$1</strong>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-[#082142]">$1</strong>')
                        }}
                      />
                      {visionMission?.visionBtnText && (
                        <a
                          href={visionMission.visionBtnLink || '#/about/what-we-do'}
                          className="inline-flex items-center gap-2 bg-[#082142] hover:bg-[#00a896] text-white hover:text-white font-bold py-3.5 px-8 rounded-full text-xs uppercase tracking-wider shadow transition-colors duration-300 border-none cursor-pointer"
                        >
                          {visionMission.visionBtnText}
                        </a>
                      )}
                    </div>
                  </>
                )}
              </RevealRow>
            </div>

            {/* CORE VALUES */}
            <div className="text-center pt-8">
              <h4 className="text-2xl font-bold text-primary mb-8">Our Core Values</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(visionMission?.coreValues && visionMission.coreValues.length > 0 ? visionMission.coreValues : [
                  { icon: '🏆', title: 'Excellence', description: 'Constantly pushing technical limits to refine stroke, positioning, speed, and endurance.' },
                  { icon: '🤝', title: 'Integrity', description: 'Fair play, respect for opponents, and honesty under pressure are non-negotiable principles.' },
                  { icon: '⚡', title: 'Dedication', description: 'Understanding that physical gains and gold medals are outputs of steady daily discipline.' }
                ]).map((val: any, idx: number) => (
                  <div key={idx} className="bg-white p-7 rounded-xl border border-border-gray text-center hover:shadow-md transition-all">
                    <div className="text-3xl mb-3">{val.icon || '⭐'}</div>
                    <h5 className="text-base font-bold text-primary mb-2">{val.title}</h5>
                    <p className="text-text-light text-xs leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {(sub === 'outreach-program' || sub === 'outreach' || sub === 'vision-mission') && (
        <>
          {/* Header Banner */}
          <div className="text-center max-w-[850px] mx-auto mb-14">
            <h2 className="text-3xl md:text-5xl font-extrabold text-primary mb-4 relative inline-block pb-4 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[70px] after:h-[3.5px] after:bg-accent animate-fade-in">
              {outreachData?.header?.title || 'Outreach Program'}
            </h2>
            <p className="text-text-light text-base md:text-lg leading-relaxed animate-fade-in font-medium">
              {outreachData?.header?.subtitle || 'Taking sports excellence, education, and healthcare guidance directly to underprivileged rural communities across Bihar.'}
            </p>

            {/* Impact Counter Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              {(outreachData?.impactStats?.length ? outreachData.impactStats : [
                { val: '50+', label: 'Villages Reached' },
                { val: '5,000+', label: 'Youth Engaged' },
                { val: '100%', label: 'Free Training & Kits' },
                { val: '20+', label: 'School Camps' }
              ]).map((stat: any, idx: number) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-border-gray shadow-xs text-center">
                  <span className={`text-2xl md:text-3xl font-black block mb-0.5 ${idx % 2 === 1 ? 'text-accent' : 'text-primary'}`}>{stat.val}</span>
                  <span className="text-[11px] font-bold text-text-light uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SHOWCASE GALLERY GRID */}
          <div className="max-w-[1240px] mx-auto mb-16">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg md:text-xl font-black text-primary flex items-center gap-2">
                <span>📸 Outreach Program Gallery</span>
                <span className="text-xs font-bold text-accent bg-accent/15 px-2.5 py-0.5 rounded-full uppercase">
                  {(outreachData?.initiatives?.length || 5)} Key Initiatives
                </span>
              </h3>
              <span className="text-xs font-bold text-text-light hidden sm:inline-block">Click photo to expand</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {(outreachData?.initiatives?.length ? outreachData.initiatives : [
                {
                  id: 'outreach-1',
                  image: '/images/about_rlbsa.jpeg',
                  tag: '01. Grassroots Scouting',
                  caption: 'Village Talent Identification',
                  desc: 'Discovering hidden athletic potential in remote rural areas.'
                },
                {
                  id: 'outreach-2',
                  image: '/images/hero1.jpeg',
                  tag: '02. Athletic Camps',
                  caption: 'Free Sports Coaching',
                  desc: 'Professional training workshops for underprivileged youth.'
                },
                {
                  id: 'outreach-3',
                  image: '/images/hero2.jpg',
                  tag: '03. Campus Exposure',
                  caption: 'Academy Infrastructure Visit',
                  desc: 'Providing village children access to turf fields and gear.'
                },
                {
                  id: 'outreach-4',
                  image: '/images/program_handball.png',
                  tag: '04. Team Sports',
                  caption: 'Handball & Football Drives',
                  desc: 'Fostering teamwork, discipline, and competitive spirit.'
                },
                {
                  id: 'outreach-5',
                  image: '/images/education_card.jpg',
                  tag: '05. Education & Life Skills',
                  caption: 'Literacy & Mentorship',
                  desc: 'Combining athletic training with formal schooling support.'
                }
              ]).map((item: any) => (
                <div
                  key={item.id || item._id}
                  onClick={() => setPreviewImage(item.image)}
                  className="group relative bg-white rounded-xl overflow-hidden border border-border-gray/70 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-[280px]"
                >
                  <div className="relative h-[180px] w-full overflow-hidden bg-primary shrink-0">
                    <img
                      src={item.image}
                      alt={item.caption}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {item.tag && (
                      <div className="absolute top-2.5 left-2.5 bg-primary/85 backdrop-blur-xs text-white text-[9.5px] font-black px-2.5 py-1 rounded uppercase tracking-wider shadow-sm border border-white/20">
                        {item.tag}
                      </div>
                    )}
                  </div>
                  <div className="p-3.5 flex flex-col justify-between flex-grow text-left bg-white">
                    <div>
                      <h4 className="text-xs font-extrabold text-primary group-hover:text-accent transition-colors line-clamp-1">
                        {item.caption}
                      </h4>
                      <p className="text-[11px] text-text-light leading-snug mt-1 font-medium line-clamp-2">
                        {item.desc}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider mt-2 block">
                      🔍 Tap to View
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DETAILED PROGRAM DESCRIPTION SECTION */}
          <div className="max-w-[1140px] mx-auto bg-white border border-border-gray/70 rounded-2xl p-8 md:p-12 shadow-sm mb-16 text-left">
            <div className="max-w-[900px] mx-auto">
              <span className="text-[11px] font-black text-accent uppercase tracking-[0.2em] mb-2 block">
                {outreachData?.descriptionSection?.tagline || 'Empowering Rural Communities'}
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-primary mb-6 leading-tight">
                {outreachData?.descriptionSection?.heading || 'Transforming Lives Beyond the Boundary Lines'}
              </h3>

              <div className="space-y-5 text-text-light text-sm md:text-base leading-relaxed font-medium">
                {(outreachData?.descriptionSection?.paragraphs?.length ? outreachData.descriptionSection.paragraphs : [
                  "Rani Laxmibai Sports Academy (RLBSA) operates a dedicated, multi-faceted Grassroots Outreach Program tailored specifically for young boys and girls in rural Bihar. In many surrounding villages, children face severe financial challenges, lack of basic sports equipment, and traditional societal norms that hinder participation in organized sports.",
                  "Our outreach team visits remote schools, village sports clubs, and local communities to host open athletic trials, handball clinics, and football talent identification camps. We provide 100% free sports equipment, jerseys, and footwear to ensure no child is denied the chance to train due to poverty.",
                  "Beyond athletic coaching, the RLBSA Outreach Program actively promotes Girl Child Empowerment & Gender Equality. By mentoring young female athletes and engaging directly with village elders and parents, we break generational stigmas and demonstrate how sports can open doors to higher education, government sports jobs, and national representation.",
                  "Children selected during outreach drives earn full scholarships to join RLBSA's residential or daycare programs—receiving comprehensive sports training, standard academic schooling, daily protein-rich meals, and medical supervision."
                ]).map((pText: string, pIdx: number) => (
                  <p key={pIdx}>{pText}</p>
                ))}
              </div>
            </div>
          </div>

          {/* INITIATIVE PILLARS CARDS */}
          <div className="max-w-[1140px] mx-auto mb-16">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-extrabold text-primary mb-2">Core Pillars of Our Outreach</h3>
              <p className="text-text-light text-sm">Key focus areas driving impact across rural Siwan and neighboring districts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(outreachData?.pillars?.length ? outreachData.pillars : [
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
              ]).map((pillar: any, pIdx: number) => {
                const colorClasses = [
                  'bg-primary/10 text-primary',
                  'bg-accent/15 text-accent',
                  'bg-emerald-50 text-emerald-600',
                  'bg-amber-50 text-amber-600'
                ];
                return (
                  <div key={pillar.id || pIdx} className="bg-white p-6 rounded-xl border border-border-gray text-left hover:shadow-md transition-all">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4 font-black ${colorClasses[pIdx % colorClasses.length]}`}>
                      {pillar.icon || '🎯'}
                    </div>
                    <h4 className="text-base font-bold text-primary mb-2">{pillar.title}</h4>
                    <p className="text-text-light text-xs leading-relaxed font-medium">
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CALL TO ACTION BANNER */}
          <div className="max-w-[1140px] mx-auto bg-primary text-white rounded-2xl p-8 md:p-12 text-center relative overflow-hidden shadow-lg">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
            <span className="bg-accent text-primary text-[10px] font-black px-3 py-1 rounded uppercase tracking-wider mb-4 inline-block">
              {outreachData?.cta?.tagline || 'JOIN OUR MISSION'}
            </span>
            <h3 className="text-2xl md:text-4xl font-extrabold mb-4 leading-tight">
              {outreachData?.cta?.heading || 'Help Us Reach More Rural Athletes in Bihar'}
            </h3>
            <p className="text-white/80 text-sm md:text-base max-w-[700px] mx-auto mb-8 font-medium">
              {outreachData?.cta?.description || 'Partner with RLBSA to sponsor sports kits, fund village camps, or support residential scholarships for promising young athletes.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={outreachData?.cta?.buttonLink || '#/contact'}
                className="bg-accent hover:bg-white text-primary font-extrabold py-3.5 px-8 rounded-full text-xs uppercase tracking-wider shadow transition-all border-none cursor-pointer"
              >
                {outreachData?.cta?.buttonText || 'Get In Touch'}
              </a>
              <a
                href="#/donate"
                className="bg-white/10 hover:bg-white/20 text-white font-extrabold py-3.5 px-8 rounded-full text-xs uppercase tracking-wider transition-all border border-white/20 cursor-pointer"
              >
                Support An Athlete
              </a>
            </div>
          </div>

          {/* LIGHTBOX PREVIEW MODAL */}
          {previewImage && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in"
              onClick={() => setPreviewImage(null)}
            >
              <div
                className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-2 text-left"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full cursor-pointer z-10 transition-all border-none"
                >
                  <X size={20} />
                </button>
                <img
                  src={previewImage}
                  alt="Outreach Program Preview"
                  className="w-full h-auto max-h-[80vh] object-contain rounded-xl bg-black"
                />
              </div>
            </div>
          )}
        </>
      )}

      {sub === 'what-we-do' && (
        <>
          {/* Centered Heading */}
          <div className="text-center max-w-[700px] mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent animate-fade-in">
              What We Do
            </h2>
            <p className="text-text-light text-base md:text-lg animate-fade-in">
              Delivering a comprehensive structure of professional sports coaching, standard academic schooling, healthy dietary plans, and safe student lodging.
            </p>
          </div>

          {/* Staggered Alternating Rows (Flat Typography Theme) */}
          <div className="flex flex-col gap-28 max-w-[1140px] mx-auto overflow-hidden pb-12">
            {whatWeDoList.map((item, index) => {
              const isEven = index % 2 === 0;
              const imgUrl = item.image
                ? (item.image.startsWith('http') || item.image.startsWith('/images') || item.image.startsWith('/uploads') ? item.image : `http://localhost:5000${item.image}`)
                : '/images/sports_training_card.jpg';

              const featuresList = Array.isArray(item.features)
                ? item.features
                : (typeof item.features === 'string' ? item.features.split('\n').filter(Boolean) : []);

              const sectionId = item.id || `section-${index}`;

              return (
                <RevealRow key={item.id || item._id || index} id={sectionId} className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                  {(isVisible) => (
                    <>
                      {/* Image Column */}
                      <div className={`transition-all duration-[1000ms] ease-out transform ${
                        isEven 
                          ? (isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16') 
                          : `order-1 md:order-2 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`
                      }`}>
                        <div className="relative rounded-md overflow-hidden shadow-lg aspect-[4/3] max-h-[380px] border border-border-gray/30">
                          <img src={imgUrl} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                      </div>

                      {/* Details Column */}
                      <div className={`flex flex-col justify-center text-left transition-all duration-[1000ms] ease-out transform ${
                        isEven 
                          ? (isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16') 
                          : `order-2 md:order-1 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`
                      }`}>
                        {item.tag && <span className="text-accent text-[11px] font-black tracking-[0.15em] uppercase mb-2 block leading-none">{item.tag}</span>}
                        <h3 className="text-2xl md:text-3xl font-extrabold text-primary mb-4 leading-tight">{item.title}</h3>
                        <p className="text-text-light text-sm md:text-base leading-relaxed mb-6 text-justify">
                          {item.description}
                        </p>
                        {featuresList.length > 0 && (
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm text-text-light font-bold">
                            {featuresList.map((feature: string, fIdx: number) => (
                              <li key={fIdx} className="flex items-center gap-2">
                                {feature.match(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/u) ? feature : `• ${feature}`}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </>
                  )}
                </RevealRow>
              );
            })}
          </div>
        </>
      )}

      {sub === 'facilities' && (
        <>
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent">
              Our Facilities
            </h2>
            <p className="text-text-light text-base md:text-lg">
              World-class playing grounds and modern athletic labs engineered for safety and top performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((fac, idx) => (
              <div key={fac.id || fac._id || idx} className="bg-white rounded-xl overflow-hidden shadow-md border border-border-gray hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="h-[200px] relative overflow-hidden bg-primary">
                    <img 
                      src={fac.image ? (fac.image.startsWith('http') || fac.image.startsWith('/images') || fac.image.startsWith('/uploads') ? fac.image : `http://localhost:5000${fac.image}`) : '/images/sports_training_card.jpg'} 
                      alt={fac.title} 
                      className="w-full h-full object-cover" 
                    />
                    {fac.tag && (
                      <span className="absolute bottom-3 right-3 bg-primary/85 text-white py-1 px-2.5 rounded text-xs font-semibold">
                        {fac.tag}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-primary mb-2">{fac.title}</h3>
                    <p className="text-text-light text-sm leading-relaxed">
                      {fac.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {sub === 'achievements' && (
        <>
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent">
              Academy Achievements
            </h2>
            <p className="text-text-light text-base md:text-lg">
              Our record speaks for itself. Decades of hard work mapped in sports metrics.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white p-8 rounded-xl border border-border-gray text-center hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-4">🏆</div>
              <div className="text-3xl font-extrabold text-primary">240+</div>
              <p className="text-text-light text-sm mt-2 font-semibold">Tournament Medals</p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-border-gray text-center hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-4">🇮🇳</div>
              <div className="text-3xl font-extrabold text-primary">15+</div>
              <p className="text-text-light text-sm mt-2 font-semibold">National Selections</p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-border-gray text-center hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-4">🏅</div>
              <div className="text-3xl font-extrabold text-primary">120+</div>
              <p className="text-text-light text-sm mt-2 font-semibold">State-level Golds</p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-border-gray text-center hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-4">📜</div>
              <div className="text-3xl font-extrabold text-primary">4+</div>
              <p className="text-text-light text-sm mt-2 font-semibold">Affiliations</p>
            </div>
          </div>

          <div className="py-10 px-8 bg-soft-light rounded-xl">
            <h3 className="text-xl font-bold text-center text-primary mb-6">Accolades & Milestones</h3>
            <ul className="list-disc pl-5 leading-loose text-text-body text-sm space-y-2">
              <li>Selected as the <strong>Best Youth Sports Academy</strong> in the Western Region Sports Meet (2024).</li>
              <li>Our swimming alumni represented the national squad at the Asian Junior Swimming Meet.</li>
              <li>Trained 3 junior players who signed professional contracts with Indian Super League (ISL) Football clubs.</li>
              <li>Organized and hosted the annual Inter-Academy Tennis League with 350+ entries.</li>
            </ul>
          </div>
        </>
      )}

      {sub === 'founders' && (
        <>
          {/* Centered Heading */}
          <div className="text-center max-w-[700px] mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent animate-fade-in">
              Founders &amp; Directors
            </h2>
            <p className="text-text-light text-base md:text-lg animate-fade-in">
              Meet the visionary leadership and directors steering the welfare, academic growth, and athletic excellence of Rani Laxmibai Sports Academy.
            </p>
          </div>

          <div className="flex flex-col gap-10 max-w-[1140px] mx-auto overflow-hidden pb-12">
            {/* HERO CARD: Founder & Director (Mr. Sanjay Pathak) */}
            {team.length > 0 && (
              <RevealRow id={team[0].id} className="w-full">
                {(isVisible) => (
                  <div className={`bg-white border border-border-gray/70 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-24'} flex flex-col sm:flex-row w-full min-h-[220px] sm:min-h-[240px]`}>
                    {/* Hero Left: Image */}
                    <div className="w-full sm:w-[220px] md:w-[260px] h-[180px] sm:h-auto flex-shrink-0 relative bg-primary">
                      <img 
                        src={team[0].image} 
                        alt={team[0].name} 
                        className="w-full h-full object-cover"
                        style={{ objectPosition: team[0].objectPosition || 'center' }}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-accent text-primary text-[10px] font-black px-2.5 py-1 rounded shadow uppercase tracking-wider">
                          FOUNDER &amp; LEADER
                        </span>
                      </div>
                    </div>

                    {/* Hero Right: Details */}
                    <div className="flex-1 p-5 md:p-7 flex flex-col justify-center text-left">
                      <span className="text-accent text-[11px] font-black tracking-[0.15em] uppercase mb-1 block">
                        {team[0].role}
                      </span>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary mb-2 leading-tight">
                        {team[0].name}
                      </h3>
                      <div className="text-text-light text-xs sm:text-sm leading-relaxed space-y-2 text-justify font-normal">
                        {getBioParagraphs(team[0].bio).map((paragraph, idx) => (
                          <p key={idx} className="text-justify">{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </RevealRow>
            )}

            {/* DIRECTORS STACK: Comfortable horizontal profile cards */}
            {team.slice(1).map((member, idx) => {
              const isEven = idx % 2 === 0;
              const isImgLeft = !isEven;
              const slideInClass = isImgLeft ? '-translate-x-24' : 'translate-x-24';

              return (
                <RevealRow key={member.id} id={member.id} className="w-full">
                  {(isVisible) => (
                    <div className={`bg-white border border-border-gray/70 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${slideInClass}`} flex flex-col sm:flex-row w-full min-h-[170px] sm:min-h-[190px]`}>
                      {/* Image container */}
                      <div className="w-full sm:w-[150px] md:w-[180px] h-[150px] sm:h-auto flex-shrink-0 relative bg-primary">
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-full h-full object-cover"
                          style={{ objectPosition: member.objectPosition || 'center' }}
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span className="bg-accent text-primary text-[9px] font-black px-2 py-0.5 rounded tracking-wider uppercase">
                            DIRECTOR
                          </span>
                        </div>
                      </div>

                      {/* Content container */}
                      <div className="flex-1 p-4.5 sm:p-5 md:p-6 flex flex-col justify-center text-left">
                        <span className="text-accent text-[10.5px] font-black tracking-[0.15em] uppercase mb-1 block">
                          {member.role}
                        </span>
                        <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-primary mb-1.5 leading-tight">
                          {member.name}
                        </h3>
                        <div className="text-text-light text-xs md:text-sm leading-relaxed space-y-1.5 text-justify font-normal">
                          {getBioParagraphs(member.bio).map((paragraph, idx) => (
                            <p key={idx} className="text-justify">{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </RevealRow>
              );
            })}
          </div>

          {/* View Our Team CTA Button */}
          <div className="text-center mt-6 pb-4">
            <a
              href="#/about/team"
              className="inline-flex items-center gap-2.5 bg-primary hover:bg-primary/90 text-white hover:text-white font-extrabold py-3.5 px-8 rounded-full text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300 border-none cursor-pointer"
            >
              <span>View Our Team</span>
              <ArrowRight size={16} weight="bold" />
            </a>
          </div>
        </>
      )}

      {(sub === 'team' || sub === 'team-members') && (
        <>
          {/* Centered Heading */}
          <div className="text-center max-w-[700px] mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent animate-fade-in">
              Our Team
            </h2>
            <p className="text-text-light text-base md:text-lg animate-fade-in">
              Meet our dedicated operational managers, academic coordinators, and sports specialists driving excellence at Rani Laxmibai Sports Academy.
            </p>
          </div>

          <div className="flex flex-col gap-10 max-w-[1140px] mx-auto overflow-hidden pb-12">
            {/* HERO CARD: Lead Team Member */}
            {staffTeam.length > 0 && (
              <RevealRow id={staffTeam[0].id || 'staff-0'} className="w-full">
                {(isVisible) => (
                  <div className={`bg-white border border-border-gray/70 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-24'} flex flex-col sm:flex-row w-full min-h-[220px] sm:min-h-[240px]`}>
                    {/* Hero Left: Image */}
                    <div className="w-full sm:w-[220px] md:w-[260px] h-[180px] sm:h-auto flex-shrink-0 relative bg-primary">
                      <img 
                        src={staffTeam[0].image ? (staffTeam[0].image.startsWith('http') || staffTeam[0].image.startsWith('/images') || staffTeam[0].image.startsWith('/uploads') || staffTeam[0].image.startsWith('data:') ? staffTeam[0].image : `http://localhost:5000${staffTeam[0].image}`) : '/images/hero1.jpeg'} 
                        alt={staffTeam[0].name} 
                        className="w-full h-full object-cover"
                        style={{ objectPosition: staffTeam[0].objectPosition || 'center' }}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-accent text-primary text-[10px] font-black px-2.5 py-1 rounded shadow uppercase tracking-wider">
                          LEAD MEMBER
                        </span>
                      </div>
                    </div>

                    {/* Hero Right: Details */}
                    <div className="flex-1 p-5 md:p-7 flex flex-col justify-center text-left">
                      <span className="text-accent text-[11px] font-black tracking-[0.15em] uppercase mb-1 block">
                        {staffTeam[0].role}
                      </span>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary mb-2 leading-tight">
                        {staffTeam[0].name}
                      </h3>
                      <div className="text-text-light text-xs sm:text-sm leading-relaxed space-y-2 text-justify font-normal">
                        {getBioParagraphs(staffTeam[0].bio).map((paragraph: string, idx: number) => (
                          <p key={idx} className="text-justify">{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </RevealRow>
            )}

            {/* TEAM MEMBERS STACK: Comfortable horizontal profile cards matching Founders section */}
            {staffTeam.slice(1).map((member, idx) => {
              const isEven = idx % 2 === 0;
              const isImgLeft = !isEven;
              const slideInClass = isImgLeft ? '-translate-x-24' : 'translate-x-24';

              return (
                <RevealRow key={member.id || idx + 1} id={member.id || `staff-${idx + 1}`} className="w-full">
                  {(isVisible) => (
                    <div className={`bg-white border border-border-gray/70 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${slideInClass}`} flex flex-col sm:flex-row w-full min-h-[170px] sm:min-h-[190px]`}>
                      {/* Image container */}
                      <div className="w-full sm:w-[150px] md:w-[180px] h-[150px] sm:h-auto flex-shrink-0 relative bg-primary">
                        <img 
                          src={member.image ? (member.image.startsWith('http') || member.image.startsWith('/images') || member.image.startsWith('/uploads') || member.image.startsWith('data:') ? member.image : `http://localhost:5000${member.image}`) : '/images/hero1.jpeg'} 
                          alt={member.name} 
                          className="w-full h-full object-cover"
                          style={{ objectPosition: member.objectPosition || 'center' }}
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span className="bg-accent text-primary text-[9px] font-black px-2 py-0.5 rounded tracking-wider uppercase">
                            MEMBER
                          </span>
                        </div>
                      </div>

                      {/* Content container */}
                      <div className="flex-1 p-4.5 sm:p-5 md:p-6 flex flex-col justify-center text-left">
                        <span className="text-accent text-[10.5px] font-black tracking-[0.15em] uppercase mb-1 block">
                          {member.role}
                        </span>
                        <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-primary mb-1.5 leading-tight">
                          {member.name}
                        </h3>
                        <div className="text-text-light text-xs md:text-sm leading-relaxed space-y-1.5 text-justify font-normal">
                          {getBioParagraphs(member.bio).map((paragraph: string, pIdx: number) => (
                            <p key={pIdx} className="text-justify">{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </RevealRow>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};
