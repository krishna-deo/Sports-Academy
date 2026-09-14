import React from 'react';
import { teamMembers } from '../data/teamData';
import { useHash } from '../hooks/useHash';

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

export const About: React.FC<AboutProps> = ({ sub }) => {
  const [team, setTeam] = React.useState<any[]>(teamMembers);
  const [milestones, setMilestones] = React.useState<any[]>(defaultMilestones);
  const [facilities, setFacilities] = React.useState<any[]>(defaultFacilities);

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
      if (sub === 'founders') {
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
          {/* Hero Banner Section */}
          <div className="max-w-[1100px] mx-auto relative h-[250px] md:h-[380px] rounded-xl overflow-hidden mb-16 shadow-lg border border-slate-100 select-none">
            <img 
              src="/images/hero2.jpg" 
              alt="RLBSA Our Story Banner" 
              className="w-full h-full object-cover" 
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#082142]/85 via-[#082142]/35 to-transparent"></div>
            
            {/* Title Lockup in the center */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-wider uppercase italic drop-shadow-md">
                Our Story
              </h2>
              <div className="w-16 h-1 bg-[#00a896] mt-4 rounded-full shadow"></div>
            </div>
          </div>

          {/* Intro & Collage Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24 max-w-[1100px] mx-auto text-left">
            {/* Left side info: width 5 columns */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[10px] font-black text-[#00a896] uppercase tracking-[0.2em] bg-[#e6f7f5] px-3.5 py-1.5 rounded-full inline-block">
                Grassroots Legacy
              </span>
              <p className="text-[#082142] text-xl md:text-[23px] font-black leading-snug">
                At Rani Laxmibai Sports Academy, we are passionate about identifying and nurturing rural sports talent, empowering youth athletes to achieve national glory and transform their communities.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                We believe that every child in rural India, regardless of gender or economic background, deserves a platform to showcase their potential. What started as a modest coaching program in Siwan has grown into a regional center of athletic excellence, giving underprivileged youth a pathway to state, national, and professional success.
              </p>
            </div>

            {/* Right side collage: width 7 columns */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-3 gap-3 relative h-[380px] md:h-[450px]">
                {/* Column 1 */}
                <div className="w-full space-y-3 flex flex-col justify-between h-full">
                  <div className="w-full h-[55%] rounded-xl overflow-hidden shadow-md border-2 border-white bg-slate-50">
                    <img src="/images/hero1.jpeg" alt="Story collage 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="w-full h-[41%] rounded-xl overflow-hidden shadow-md border-2 border-white bg-slate-50">
                    <img src="/images/player_rahul.png" alt="Story collage 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                </div>

                {/* Column 2 (Offset/Centered column) */}
                <div className="w-full space-y-3 flex flex-col justify-center h-full">
                  <div className="w-full h-[80%] rounded-xl overflow-hidden shadow-md border-2 border-white bg-slate-50">
                    <img src="/images/about_rlbsa.jpeg" alt="Story collage 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                </div>

                {/* Column 3 */}
                <div className="w-full space-y-3 flex flex-col justify-between h-full">
                  <div className="w-full h-[43%] rounded-xl overflow-hidden shadow-md border-2 border-white bg-slate-50">
                    <img src="/images/hero2.jpg" alt="Story collage 4" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="w-full h-[53%] rounded-xl overflow-hidden shadow-md border-2 border-white bg-slate-50">
                    <img src="/images/hero1.jpeg" alt="Story collage 5" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alternating Story Rows */}
          <div className="space-y-24 max-w-[1100px] mx-auto mb-20">
            {milestones.map((item, idx) => {
              const isEven = idx % 2 === 1; // Alternating layout
              const yearColor = isEven ? 'text-[#082142]' : 'text-[#00a896]';
              const titleColor = isEven ? 'text-[#00a896]' : 'text-[#082142]';
              
              return (
                <RevealRow 
                  key={item._id || item.year} 
                  id={`row-${item.year}`} 
                  className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16 text-left"
                >
                  {(isVisible) => {
                    const detailsBlock = (
                      <div className={`w-full md:w-1/2 transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : isEven ? 'opacity-0 translate-x-12' : 'opacity-0 -translate-x-12'} order-2 md:order-none`}>
                        <div className={`text-4xl font-black ${yearColor} mb-3`}>{item.year}</div>
                        <h3 className={`text-2.5xl font-black ${titleColor} mb-4`}>{item.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed font-semibold">
                          {item.description}
                        </p>
                        {item.year.toLowerCase() === 'today' && (
                          <div className="mt-6">
                            <a 
                              href="#/donate" 
                              className="inline-flex items-center gap-2 bg-[#082142] hover:bg-[#00a896] text-white font-bold py-3.5 px-8 rounded-full text-xs uppercase tracking-wider transition-colors duration-300 border-none shadow-md"
                            >
                              Support Our Mission
                            </a>
                          </div>
                        )}
                      </div>
                    );

                    const imageBlock = (
                      <div className={`w-full md:w-1/2 transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : isEven ? 'opacity-0 -translate-x-12' : 'opacity-0 translate-x-12'} order-1 md:order-none`}>
                        <div className="rounded-xl overflow-hidden shadow-md aspect-[16/10] border border-slate-100 bg-[#082142]/5">
                          <img 
                            src={item.image.startsWith('http') || item.image.startsWith('/images') || item.image.startsWith('/uploads') ? item.image : `http://localhost:5000${item.image}`} 
                            alt={`${item.year} - RLBSA ${item.title}`} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </div>
                    );

                    return (
                      <>
                        {isEven ? (
                          <>
                            {imageBlock}
                            {detailsBlock}
                          </>
                        ) : (
                          <>
                            {detailsBlock}
                            {imageBlock}
                          </>
                        )}
                      </>
                    );
                  }}
                </RevealRow>
              );
            })}
          </div>
        </>
      )}

      {sub === 'vision-mission' && (
        <>
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent">
              Vision & Mission
            </h2>
            <p className="text-text-light text-base md:text-lg">
              Our guiding philosophies that drive student development and leadership styles.
            </p>
          </div>

          <div className="flex flex-col gap-24 mb-24 max-w-[1100px] mx-auto">
            {/* ROW 1: MISSION */}
            <RevealRow id="mission-row" className="flex flex-col lg:flex-row items-center justify-between gap-12 text-left">
              {(isVisible) => (
                <>
                  <div className={`w-full lg:w-[48%] transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                    <span className="text-[10px] font-black text-[#00a896] uppercase tracking-[0.2em] mb-2.5 block">
                      About Us
                    </span>
                    <h3 className="text-3xl md:text-4xl font-black text-[#082142] mb-5 leading-tight">
                      Our Mission
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
                      RLBSA strives for excellence in sports development by providing access to quality training, guidance, and opportunities. Through our dedication, we aim to inspire young athletes, nurture their potential, and empower them to achieve greatness while transforming lives through sports.
                    </p>
                    <a
                      href="#/about/story"
                      className="inline-flex items-center gap-2 bg-[#082142] hover:bg-[#00a896] text-white hover:text-white font-bold py-3.5 px-8 rounded-full text-xs uppercase tracking-wider shadow transition-colors duration-300 border-none cursor-pointer"
                    >
                      Learn More
                    </a>
                  </div>

                  <div className={`w-full lg:w-[48%] transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
                    <div className="relative rounded-xl overflow-hidden shadow-lg aspect-[4/3] border border-slate-100 bg-[#082142]/5">
                      {/* Top-left rounded compound shape like the mockup */}
                      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden">
                        <img 
                          src="/images/hero2.jpg" 
                          alt="Our Mission Team" 
                          className="w-full h-full object-cover rounded-tl-[5rem]" 
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </RevealRow>

            {/* ROW 2: VISION */}
            <RevealRow id="vision-row" className="flex flex-col lg:flex-row items-center justify-between gap-12 text-left">
              {(isVisible) => (
                <>
                  {/* Left Side: Compound Images overlay block */}
                  <div className={`w-full lg:w-[48%] transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'} order-2 lg:order-1`}>
                    <div className="relative w-full aspect-[4/3] flex items-center justify-center">
                      
                      {/* Arch-shaped first image */}
                      <div className="w-[45%] h-[85%] rounded-t-full overflow-hidden shadow-lg border-4 border-white bg-slate-100 shrink-0">
                        <img 
                          src="/images/about_rlbsa.jpeg" 
                          alt="Our Vision Athlete" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      {/* Standard round second image offset */}
                      <div className="w-[45%] h-[80%] rounded-xl overflow-hidden shadow-lg border-4 border-white bg-slate-100 shrink-0 mt-16 -ml-8">
                        <img 
                          src="/images/hero1.jpeg" 
                          alt="Youth Sports Training" 
                          className="w-full h-full object-cover" 
                        />
                      </div>

                    </div>
                  </div>

                  {/* Right Side: Text details */}
                  <div className={`w-full lg:w-[48%] transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'} order-1 lg:order-2`}>
                    <span className="text-[10px] font-black text-[#00a896] uppercase tracking-[0.2em] mb-2.5 block">
                      What We Do
                    </span>
                    <h3 className="text-3xl md:text-4xl font-black text-[#082142] mb-5 leading-tight">
                      Our Vision
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
                      To envision a world transformed by the power of sports, creating positive change for youth athletes and communities. We strive to provide every aspiring athlete with opportunities to grow, achieve excellence, and contribute to healthier, stronger, and more inclusive communities.
                    </p>
                    <a
                      href="#/about/what-we-do"
                      className="inline-flex items-center gap-2 bg-[#082142] hover:bg-[#00a896] text-white hover:text-white font-bold py-3.5 px-8 rounded-full text-xs uppercase tracking-wider shadow transition-colors duration-300 border-none cursor-pointer"
                    >
                      Our Programs
                    </a>
                  </div>
                </>
              )}
            </RevealRow>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold text-primary mb-10">Our Core Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl border border-border-gray text-center hover:shadow-md transition-all">
                <div className="text-3xl mb-4">🏆</div>
                <h4 className="text-lg font-bold text-primary mb-2">Excellence</h4>
                <p className="text-text-light text-sm leading-relaxed">
                  Constantly pushing technical limits to refine stroke, positioning, speed, and endurance.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl border border-border-gray text-center hover:shadow-md transition-all">
                <div className="text-3xl mb-4">🤝</div>
                <h4 className="text-lg font-bold text-primary mb-2">Integrity</h4>
                <p className="text-text-light text-sm leading-relaxed">
                  Fair play, respect for opponents, and honesty under pressure are non-negotiable principles.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl border border-border-gray text-center hover:shadow-md transition-all">
                <div className="text-3xl mb-4">⚡</div>
                <h4 className="text-lg font-bold text-primary mb-2">Dedication</h4>
                <p className="text-text-light text-sm leading-relaxed">
                  Understanding that physical gains and gold medals are outputs of steady daily discipline.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {sub === 'what-we-do' && (
        <>
          {/* Centered Heading */}
          <div className="text-center max-w-[700px] mx-auto mb-20">
            <span className="text-accent text-xs font-extrabold uppercase tracking-widest bg-accent/10 px-3.5 py-1.5 rounded-full mb-3.5 inline-block animate-fade-in">
              Our Core Operations
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent animate-fade-in">
              What We Do
            </h2>
            <p className="text-text-light text-base md:text-lg animate-fade-in">
              Delivering a comprehensive structure of professional sports coaching, standard academic schooling, healthy dietary plans, and safe student lodging.
            </p>
          </div>

          {/* Staggered Alternating Rows (Flat Typography Theme) */}
          <div className="flex flex-col gap-28 max-w-[1140px] mx-auto overflow-hidden pb-12">
            {/* 1. Sports Training (Image Left, Text Right) */}
            <RevealRow id="sports" className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              {(isVisible) => (
                <>
                  {/* Left Column: Image */}
                  <div className={`transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}>
                    <div className="relative rounded-md overflow-hidden shadow-lg aspect-[4/3] max-h-[380px] border border-border-gray/30">
                      <img src="/images/sports_training_card.jpg" alt="Sports Training" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Right Column: Details */}
                  <div className={`flex flex-col justify-center text-left transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}>
                    <span className="text-accent text-[11px] font-black tracking-[0.15em] uppercase mb-2 block leading-none">Athletic Development</span>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-primary mb-4 leading-tight">Sports Training</h3>
                    <p className="text-text-light text-sm md:text-base leading-relaxed mb-6">
                      Providing top-tier professional coaching in multiple fields including Football, Handball, Rugby, and Athletics. The academy offers structured training regimes, regular physical fitness audits, and full sponsorship for representing the state and nation in high-profile competitions.
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm text-text-light font-bold">
                      <li className="flex items-center gap-2">🏅 Elite Certified Coaches</li>
                      <li className="flex items-center gap-2">⚽ Free Professional Gear</li>
                      <li className="flex items-center gap-2">🏃 Daily Conditioning Drills</li>
                      <li className="flex items-center gap-2">🏆 Tournament Sponsorship</li>
                    </ul>
                  </div>
                </>
              )}
            </RevealRow>

            {/* 2. Education & Academic Support (Text Left, Image Right) */}
            <RevealRow id="education" className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              {(isVisible) => (
                <>
                  {/* Left Column: Details */}
                  <div className={`flex flex-col justify-center text-left order-2 md:order-1 transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}>
                    <span className="text-accent text-[11px] font-black tracking-[0.15em] uppercase mb-2 block leading-none">Academic Excellence</span>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-primary mb-4 leading-tight">Education & Academic Support</h3>
                    <p className="text-text-light text-sm md:text-base leading-relaxed mb-6">
                      Ensuring formal schooling for every athlete at local schools and colleges with full tuition and textbook coverage. In addition to primary schooling, the foundation runs daily personality development workshops, computer literacy classes, and English speaking courses.
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm text-text-light font-bold">
                      <li className="flex items-center gap-2">📚 100% Tuition Coverage</li>
                      <li className="flex items-center gap-2">💬 English Speaking Classes</li>
                      <li className="flex items-center gap-2">💻 Computer Literacy Labs</li>
                      <li className="flex items-center gap-2">🌱 Life Skills & Guidance</li>
                    </ul>
                  </div>

                  {/* Right Column: Image */}
                  <div className={`order-1 md:order-2 transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}>
                    <div className="relative rounded-md overflow-hidden shadow-lg aspect-[4/3] max-h-[380px] border border-border-gray/30">
                      <img src="/images/education_card.jpg" alt="Education & Academic Support" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </>
              )}
            </RevealRow>

            {/* 3. Food & Nutrition (Image Left, Text Right) */}
            <RevealRow id="nutrition" className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              {(isVisible) => (
                <>
                  {/* Left Column: Image */}
                  <div className={`transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}>
                    <div className="relative rounded-md overflow-hidden shadow-lg aspect-[4/3] max-h-[380px] border border-border-gray/30">
                      <img src="/images/nutrition_card.jpg" alt="Food & Nutrition" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Right Column: Details */}
                  <div className={`flex flex-col justify-center text-left transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}>
                    <span className="text-accent text-[11px] font-black tracking-[0.15em] uppercase mb-2 block leading-none">Dietary Health</span>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-primary mb-4 leading-tight">Food & Nutrition</h3>
                    <p className="text-text-light text-base md:text-lg leading-relaxed mb-6">
                      Providing daily healthy high-protein diets designed specifically to support rigorous sports training. All meals are calorie-mapped under expert supervision to build muscle, increase speed, and promote rapid physical recovery after games.
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm text-text-light font-bold">
                      <li className="flex items-center gap-2">🥗 Expert Calorie-Mapped</li>
                      <li className="flex items-center gap-2">🥩 High-Protein Diets</li>
                      <li className="flex items-center gap-2">🩺 Regular Health Audits</li>
                      <li className="flex items-center gap-2">🥛 Daily Supplements & Milk</li>
                    </ul>
                  </div>
                </>
              )}
            </RevealRow>

            {/* 4. Hostel & Accommodation (Text Left, Image Right) */}
            <RevealRow id="hostel" className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              {(isVisible) => (
                <>
                  {/* Left Column: Details */}
                  <div className={`flex flex-col justify-center text-left order-2 md:order-1 transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}>
                    <span className="text-accent text-[11px] font-black tracking-[0.15em] uppercase mb-2 block leading-none">Residential Boarding</span>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-primary mb-4 leading-tight">Hostel & Accommodation</h3>
                    <p className="text-text-light text-base md:text-lg leading-relaxed mb-6">
                      Offering standard, secure, and hygienic boarding hostels accommodating up to 50 resident students. The facility features dynamic studying halls, clean laundry rooms, recreation zones, and gated surveillance for safety.
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm text-text-light font-bold">
                      <li className="flex items-center gap-2">🏠 Hygienic Dormitory</li>
                      <li className="flex items-center gap-2">🔒 Secure Gated Watch</li>
                      <li className="flex items-center gap-2">📖 Study Halls & Library</li>
                      <li className="flex items-center gap-2">🧺 Laundry & Hygiene Care</li>
                    </ul>
                  </div>

                  {/* Right Column: Image */}
                  <div className={`order-1 md:order-2 transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}>
                    <div className="relative rounded-md overflow-hidden shadow-lg aspect-[4/3] max-h-[380px] border border-border-gray/30">
                      <img src="/images/hostel_card.png" alt="Hostel & Accommodation" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </>
              )}
            </RevealRow>

            {/* 5. Transportation (Image Left, Text Right) */}
            <RevealRow id="transportation" className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              {(isVisible) => (
                <>
                  {/* Left Column: Image */}
                  <div className={`transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}>
                    <div className="relative rounded-md overflow-hidden shadow-lg aspect-[4/3] max-h-[380px] border border-border-gray/30">
                      <img src="/images/transportation_card.png" alt="Transportation" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Right Column: Details */}
                  <div className={`flex flex-col justify-center text-left transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}>
                    <span className="text-accent text-[11px] font-black tracking-[0.15em] uppercase mb-2 block leading-none">Safe Transit</span>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-primary mb-4 leading-tight">Transportation</h3>
                    <p className="text-text-light text-sm md:text-base leading-relaxed mb-6">
                      Ensuring daily secure pickup and drop transit services for non-residential local student-athletes. Our dedicated fleet of buses and vans enables students from remote rural locations to commute safely and punctually for daily practices and academic lectures.
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm text-text-light font-bold">
                      <li className="flex items-center gap-2">🚌 Free Pick & Drop</li>
                      <li className="flex items-center gap-2">📍 GPS Fleet Tracking</li>
                      <li className="flex items-center gap-2">🛡️ Safe & Trained Drivers</li>
                      <li className="flex items-center gap-2">🕒 Daily Timely Commutes</li>
                    </ul>
                  </div>
                </>
              )}
            </RevealRow>

            {/* 6. Career & Athlete Development (Text Left, Image Right) */}
            <RevealRow id="career" className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              {(isVisible) => (
                <>
                  {/* Left Column: Details */}
                  <div className={`flex flex-col justify-center text-left order-2 md:order-1 transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}>
                    <span className="text-accent text-[11px] font-black tracking-[0.15em] uppercase mb-2 block leading-none">Future Planning</span>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-primary mb-4 leading-tight">Career & Athlete Development</h3>
                    <p className="text-text-light text-sm md:text-base leading-relaxed mb-6">
                      Guiding our student-athletes towards bright future careers inside and outside of professional sports. We organize regular career counseling workshops, university admission assistance, vocational training programs, and job placement support.
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm text-text-light font-bold">
                      <li className="flex items-center gap-2">🎯 Career Counseling</li>
                      <li className="flex items-center gap-2">🎓 College Admissions</li>
                      <li className="flex items-center gap-2">💼 Vocational Training</li>
                      <li className="flex items-center gap-2">🚀 Placement Assistance</li>
                    </ul>
                  </div>

                  {/* Right Column: Image */}
                  <div className={`order-1 md:order-2 transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}>
                    <div className="relative rounded-md overflow-hidden shadow-lg aspect-[4/3] max-h-[380px] border border-border-gray/30">
                      <img src="/images/career_development.png" alt="Career & Athlete Development" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </>
              )}
            </RevealRow>

            {/* 7. Tournament & Competition Preparation (Image Left, Text Right) */}
            <RevealRow id="tournament" className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              {(isVisible) => (
                <>
                  {/* Left Column: Image */}
                  <div className={`transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}>
                    <div className="relative rounded-md overflow-hidden shadow-lg aspect-[4/3] max-h-[380px] border border-border-gray/30">
                      <img src="/images/tournament_prep.png" alt="Tournament & Competition Preparation" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Right Column: Details */}
                  <div className={`flex flex-col justify-center text-left transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}>
                    <span className="text-accent text-[11px] font-black tracking-[0.15em] uppercase mb-2 block leading-none">Championship Bound</span>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-primary mb-4 leading-tight">Tournament & Competition Preparation</h3>
                    <p className="text-text-light text-sm md:text-base leading-relaxed mb-6">
                      Getting our trainees physically, tactically, and mentally prepared for high-stakes tournaments. We conduct simulated match plays, video analysis of opponents, sports psychology counseling, and special game-strategy briefings.
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm text-text-light font-bold">
                      <li className="flex items-center gap-2">📈 Match Simulations</li>
                      <li className="flex items-center gap-2">🎥 Tactical Video Analysis</li>
                      <li className="flex items-center gap-2">🧠 Sports Psychology</li>
                      <li className="flex items-center gap-2">🛡️ Opponent Scouting</li>
                    </ul>
                  </div>
                </>
              )}
            </RevealRow>
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
                  <div className={`bg-white border border-border-gray/70 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-24'} flex flex-col lg:flex-row w-full min-h-[400px]`}>
                    {/* Hero Left: Image */}
                    <div className="lg:w-1/2 relative h-[300px] lg:h-auto min-h-[300px] bg-primary">
                      <img 
                        src={team[0].image} 
                        alt={team[0].name} 
                        className="w-full h-full object-cover"
                        style={{ objectPosition: team[0].objectPosition || 'center' }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-accent text-primary text-xs font-black px-3 py-1.5 rounded shadow uppercase tracking-wider">
                          FOUNDER &amp; LEADER
                        </span>
                      </div>
                    </div>

                    {/* Hero Right: Details */}
                    <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center text-left">
                      <span className="text-accent text-[11.5px] font-black tracking-[0.2em] uppercase mb-2 block">
                        {team[0].role}
                      </span>
                      <h3 className="text-3xl font-extrabold text-primary mb-4 leading-tight">
                        {team[0].name}
                      </h3>
                      <p className="text-text-light text-sm md:text-base leading-relaxed">
                        {team[0].bio}
                      </p>
                    </div>
                  </div>
                )}
              </RevealRow>
            )}

            {/* DIRECTORS STACK: Alternating smaller horizontal profile cards */}
            {team.slice(1).map((member, idx) => {
              const isEven = idx % 2 === 0;
              const isImgLeft = !isEven;
              const slideInClass = isImgLeft ? '-translate-x-24' : 'translate-x-24';
              const directionClass = isImgLeft ? 'lg:flex-row' : 'lg:flex-row-reverse';

              return (
                <RevealRow key={member.id} id={member.id} className="w-full">
                  {(isVisible) => (
                    <div className={`bg-white border border-border-gray/70 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${slideInClass}`} flex flex-col ${directionClass} w-full min-h-[280px]`}>
                      {/* Image container */}
                      <div className="lg:w-[38%] relative h-[220px] lg:h-auto min-h-[220px] bg-primary">
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-full h-full object-cover"
                          style={{ objectPosition: member.objectPosition || 'center' }}
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-accent text-primary text-[10px] font-black px-2.5 py-1 rounded tracking-wider uppercase">
                            DIRECTOR
                          </span>
                        </div>
                      </div>

                      {/* Content container */}
                      <div className="lg:w-[62%] p-6 md:p-8 flex flex-col justify-center text-left">
                        <span className="text-accent text-[11px] font-black tracking-[0.15em] uppercase mb-1.5 block">
                          {member.role}
                        </span>
                        <h3 className="text-xl md:text-2xl font-extrabold text-primary mb-3 leading-tight">
                          {member.name}
                        </h3>
                        <p className="text-text-light text-xs md:text-sm leading-relaxed">
                          {member.bio}
                        </p>
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
