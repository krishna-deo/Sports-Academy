import React from 'react';
import { Trophy, BookOpen, ForkKnife, House, CaretLeft, CaretRight, Barbell, Bus } from '@phosphor-icons/react';
import { HeroSlider } from '../components/HeroSlider';

export const Home: React.FC = () => {
  const successPlayers = [
    {
      name: 'Aarti Kumari',
      sport: 'Handball',
      achievement: '5x State Gold Medalist',
      description: 'A key playmaker and captain of our Handball team, Aarti has represented Bihar in multiple national-level school championships.',
      quote: 'Rani Laxmibai Academy gave me free boarding, kit, and coaching that changed my life. Now, I hope to represent India.',
      image: '/images/player_aarti.png',
      joined: 'May 2023',
    },
    {
      name: 'Pooja Patel',
      sport: 'Football',
      achievement: 'Best Striker Award (U17)',
      description: 'An outstanding forward striker who scored 12 goals in the Regional Youth League. She has been shortlisted for state team trials.',
      quote: 'The intensive practice matches and constant support of coaches prepared me for national-level trials.',
      image: '/images/player_pooja.png',
      joined: 'Feb 2024',
    },
    {
      name: 'Rahul Kumar',
      sport: 'Athletics',
      achievement: 'National U16 800m Gold',
      description: 'Rahul is a phenomenal middle-distance runner who clocked a personal best of 1m 58s in the National Athletics Championships.',
      quote: 'Refining my sprinting form with Coach Vikram helped me shave off half a second from my running times.',
      image: '/images/player_rahul.png',
      joined: 'Sep 2024',
    },
  ];

  const team = [
    {
      name: 'Sanjay Kumar',
      role: 'Founder & President',
      bio: 'A visionary leader dedicated to discovering and elevating grassroots sports talent from underprivileged rural communities.',
      image: '/images/member_sanjay.png',
    },
    {
      name: 'Poonam Devi',
      role: 'Co-Founder & Director of Welfare',
      bio: 'Ensuring absolute care, nutritious sports diet management, and a secure residential environment for academy students.',
      image: '/images/member_poonam.png',
    },
    {
      name: 'Vikram Rathore',
      role: 'Director of Athletics',
      bio: 'Leading sports training modules, athlete biomechanical assessment, and tournament performance pathway strategies.',
      image: '/images/member_vikram.png',
    },
  ];

  const [activeCard, setActiveCard] = React.useState<number>(0);
  const aboutRef = React.useRef<HTMLDivElement>(null);
  const [isAboutVisible, setIsAboutVisible] = React.useState(false);
  const teamRef = React.useRef<HTMLDivElement>(null);
  const [isTeamVisible, setIsTeamVisible] = React.useState(false);
  const [currentMember, setCurrentMember] = React.useState(0);
  const storiesRef = React.useRef<HTMLDivElement>(null);
  const [isStoriesVisible, setIsStoriesVisible] = React.useState(false);
  const edgeRef = React.useRef<HTMLDivElement>(null);
  const [isEdgeVisible, setIsEdgeVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAboutVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.15,
      }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => {
      if (aboutRef.current) {
        observer.unobserve(aboutRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsTeamVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (teamRef.current) {
      observer.observe(teamRef.current);
    }

    return () => {
      if (teamRef.current) {
        observer.unobserve(teamRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsStoriesVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (storiesRef.current) {
      observer.observe(storiesRef.current);
    }

    return () => {
      if (storiesRef.current) {
        observer.unobserve(storiesRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsEdgeVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (edgeRef.current) {
      observer.observe(edgeRef.current);
    }

    return () => {
      if (edgeRef.current) {
        observer.unobserve(edgeRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return;
    }
    const timer = setInterval(() => {
      setCurrentMember((prev) => (prev + 1) % team.length);
    }, 3000); // Auto-slide every 3 seconds
    return () => clearInterval(timer);
  }, [currentMember, team.length]);


  const cards = [
    {
      title: 'Sports Training',
      tag: 'Empowerment',
      description: 'Free professional coaching, kits, and tournament sponsorships.',
      image: '/images/sports_training_card.jpg',
      icon: Trophy,
    },
    {
      title: 'Education',
      tag: 'Scholarship',
      description: '100% sponsored schooling, tuition fees, and books.',
      image: '/images/education_card.jpg',
      icon: BookOpen,
    },
    {
      title: 'Food & Nutrition',
      tag: 'Athletic Diet',
      description: 'Calorie-mapped healthy diets and high-protein sports meals.',
      image: '/images/nutrition_card.jpg',
      icon: ForkKnife,
    },
    {
      title: 'Hostel & Lodging',
      tag: 'Residential',
      description: 'Secure gated campus, studying rooms, and clean laundry.',
      image: '/images/hostel_card.png',
      icon: House,
    },
    {
      title: 'Gym & Fitness',
      tag: 'Strength & Conditioning',
      description: 'Fully equipped high-performance gym, strength training, and rehabilitation.',
      image: '/images/gym_card.png',
      icon: Barbell,
    },
    {
      title: 'Transportation',
      tag: 'Safe Transit',
      description: 'Daily safe pickup and drop facilities for local and remote student-athletes.',
      image: '/images/transportation_card.png',
      icon: Bus,
    },
  ];

  return (
    <div className="animate-fade-in">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover, .animate-marquee:active {
          animation-play-state: paused;
        }
      `}</style>

      {/* Hero Slider */}
      <HeroSlider />

      {/* About RLBSA Section */}
      <section className="py-10 md:py-24 bg-white w-full border-b border-border-gray/50 overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-5">
          <div
            ref={aboutRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left Column: Heading, Mobile Photo, Paragraphs, Link */}
            <div className="flex flex-col h-full justify-center">
              {/* Heading */}
              <div className={`transition-all duration-[1200ms] ease-out transform ${isAboutVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
                }`}>
                <span className="text-accent text-[11px] font-bold tracking-[0.2em] uppercase mb-3 inline-block">
                  Empowering Youth through Sport
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-6 leading-tight">
                  About <br className="hidden sm:inline" />
                  <span className="text-accent">RLBSA Foundation</span>
                </h2>
              </div>

              {/* Mobile Photo (Visible only on mobile/tablet, slides in horizontally from the right) */}
              <div className={`transition-all duration-[1200ms] ease-out transform ${isAboutVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'
                } lg:hidden my-6`}>
                <div className="relative rounded-md overflow-hidden shadow-2xl group border border-border-gray/30">
                  <img
                    src="/images/about_rlbsa.png"
                    alt="Young Indian athletes training at RLBSA"
                    className="w-full h-[300px] object-cover"
                  />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 pointer-events-none" />
                </div>
              </div>

              {/* Paragraphs and Link */}
              <div className={`transition-all duration-[1200ms] ease-out transform delay-75 ${isAboutVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
                }`}>
                <p className="text-text-light text-base md:text-lg leading-relaxed mb-6">
                  Rani Laxmibai Sports Academy (RLBSA) is a pioneering non-profit institution dedicated to identifying and elevating athletic talent from underprivileged and rural communities. Nestled in Laxmipur, Siwan, Bihar, the academy is a haven where aspiring youth receive professional sports coaching, fully sponsored boarding, calibrated nutritional meals, and standard academic schooling.
                </p>
                <p className="text-text-light text-sm md:text-base leading-relaxed mb-8">
                  By removing financial barriers and providing top-tier training facilities, RLBSA bridges the gap between rural raw potential and national athletic success. We nurture dreams, foster leadership, and build champions who represent the spirit and resilience of our nation on the grandest stages.
                </p>
                <div>
                  <a
                    href="#/about/story"
                    className="inline-flex items-center gap-2 text-primary font-bold text-sm border-b-2 border-accent pb-1 hover:text-accent hover:border-primary transition-all group"
                  >
                    Read Our Full Story
                    <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Desktop Photo (Visible only on desktop lg screens, slides in horizontally from the right) */}
            <div className={`hidden lg:block transition-all duration-[1200ms] ease-out transform ${isAboutVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'
              }`}>
              <div className="relative rounded-md overflow-hidden shadow-2xl group border border-border-gray/30">
                <img
                  src="/images/about_rlbsa.png"
                  alt="Young Indian athletes training at RLBSA"
                  className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Cards Grid Section */}
      <section className="py-20 bg-soft-light w-full select-none border-b border-border-gray/50">
        <div className="max-w-[1380px] mx-auto px-5">
          <div className="text-center max-w-[700px] mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent">
              What We Do
            </h2>
            <p className="text-text-light text-base md:text-lg">
              Delivering a comprehensive structure of professional sports coaching, standard academic schooling, healthy dietary plans, and safe student lodging.
            </p>
          </div>

          {/* Desktop Layout: Expand-on-Hover Flex Accordion */}
          <div className="hidden md:flex md:flex-row gap-6 w-full h-[340px]">
            {cards.map((card, idx) => {
              const CardIcon = card.icon;
              const isActive = activeCard === idx;
              return (
                <div
                  key={idx}
                  className="group rounded-lg overflow-hidden shadow-lg border border-border-gray hover:border-transparent hover:shadow-2xl transition-all duration-700 ease-in-out relative h-full bg-primary cursor-pointer"
                  style={{ flex: isActive ? '3.5 1 0%' : '1 1 0%' }}
                  onMouseEnter={() => setActiveCard(idx)}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-all duration-500"
                    style={{ backgroundImage: `url('${card.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent z-10" />
                  <a
                    href="#/about/what-we-do"
                    className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white text-left no-underline h-full"
                  >
                    <div className="w-12 h-12 rounded-lg bg-accent text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg flex-shrink-0">
                      <CardIcon size={24} weight="bold" />
                    </div>
                    <span className="text-[10px] font-bold text-accent tracking-widest uppercase block mb-1">{card.tag}</span>
                    <h3 className="text-xl font-extrabold tracking-tight mb-1 group-hover:text-accent transition-colors">{card.title}</h3>

                    <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isActive ? 'max-h-[120px] opacity-100 mt-2' : 'max-h-0 opacity-0 pointer-events-none'
                      }`}>
                      <p className="text-white/80 text-xs leading-relaxed font-semibold">
                        {card.description}
                      </p>
                      <span className="text-[10px] font-bold text-accent mt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        LEARN MORE &rarr;
                      </span>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>

          {/* Mobile Layout: Swipeable Horizontal Carousel with Center Snapping */}
          <div className="md:hidden w-full relative py-4">
            <div className="flex overflow-x-auto gap-6 snap-x snap-mandatory scroll-smooth pb-4 px-5 -mx-5 hide-scrollbar">
              {cards.map((card, idx) => {
                const CardIcon = card.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-xl overflow-hidden shadow-lg border border-border-gray/30 relative h-[340px] bg-primary cursor-pointer w-[85vw] max-w-[320px] flex-shrink-0 snap-center first:ml-[7.5vw] last:mr-[7.5vw]"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${card.image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />
                    <a
                      href="#/about/what-we-do"
                      className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white text-left no-underline h-full"
                    >
                      <div className="w-11 h-11 rounded-lg bg-accent text-primary flex items-center justify-center mb-4 shadow-md flex-shrink-0">
                        <CardIcon size={22} weight="bold" />
                      </div>
                      <span className="text-[10px] font-bold text-accent tracking-widest uppercase block mb-1">{card.tag}</span>
                      <h3 className="text-xl font-extrabold tracking-tight mb-2">{card.title}</h3>
                      <p className="text-white/80 text-xs leading-relaxed font-semibold mb-2">
                        {card.description}
                      </p>
                      <span className="text-[10px] font-bold text-accent flex items-center gap-1">
                        LEARN MORE &rarr;
                      </span>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Founders & Key Members Section */}
      <section className="py-24 px-5 bg-white w-full border-b border-border-gray/50 overflow-hidden select-none">
        <div className="max-w-[1380px] mx-auto">
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent">
              Founders & Key Members
            </h2>
            <p className="text-text-light text-base md:text-lg">
              Meet the visionary minds driving the mission of RLBSA Foundation to nurture athletic excellence and build youth sports champions.
            </p>
          </div>

          {/* Slider Outer Wrapper */}
          <div 
            ref={teamRef}
            className={`relative max-w-[1380px] mx-auto px-4 sm:px-8 md:px-10 transition-all duration-[1000ms] ease-out transform ${
              isTeamVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
            }`}
          >
            {/* Sliding Buttons (Visible on desktop/tablet, hidden on mobile) */}
            <button 
              onClick={() => setCurrentMember((prev) => (prev - 1 + team.length) % team.length)}
              className="hidden sm:flex absolute left-6 sm:left-10 top-[150px] sm:top-1/2 -translate-y-1/2 w-8 sm:w-12 h-8 sm:h-12 rounded-full bg-white/90 opacity-75 hover:opacity-100 shadow-md border border-border-gray/30 hover:bg-primary hover:text-white items-center justify-center transition-all duration-300 z-20 hover:scale-105 active:scale-95 text-primary group"
              aria-label="Previous Member"
            >
              <CaretLeft className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" weight="bold" />
            </button>

            <button 
              onClick={() => setCurrentMember((prev) => (prev + 1) % team.length)}
              className="hidden sm:flex absolute right-6 sm:right-10 top-[150px] sm:top-1/2 -translate-y-1/2 w-8 sm:w-12 h-8 sm:h-12 rounded-full bg-white/90 opacity-75 hover:opacity-100 shadow-md border border-border-gray/30 hover:bg-primary hover:text-white items-center justify-center transition-all duration-300 z-20 hover:scale-105 active:scale-95 text-primary group"
              aria-label="Next Member"
            >
              <CaretRight className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" weight="bold" />
            </button>

            {/* Slider Viewport Container (Horizontal swipe on mobile, slider on desktop) */}
            <div className="flex overflow-x-auto gap-6 snap-x snap-mandatory scroll-smooth pb-4 px-5 -mx-5 hide-scrollbar sm:block sm:relative sm:overflow-hidden w-full sm:min-h-[460px] md:min-h-[380px] sm:px-0 sm:mx-0">
              {team.map((member, idx) => {
                const isActive = idx === currentMember;
                return (
                  <a
                    href="#/about/founders"
                    key={idx}
                    className={`w-[85vw] max-w-[320px] sm:w-auto sm:max-w-none flex-shrink-0 snap-center first:ml-[7.5vw] last:mr-[7.5vw] sm:first:ml-0 sm:last:mr-0 relative sm:absolute inset-x-0 top-0 transition-opacity sm:transition-all duration-0 sm:duration-500 sm:ease-in-out sm:transform flex flex-col sm:flex-row bg-white rounded-xl overflow-hidden border-l-[5px] border-l-accent border-r border-y border-border-gray/70 min-h-[480px] sm:min-h-[440px] md:min-h-[360px] hover:-translate-y-1.5 cursor-pointer block group ${
                      isActive 
                        ? 'opacity-100 translate-x-0 sm:scale-100 pointer-events-auto z-10' 
                        : idx < currentMember
                          ? 'opacity-100 sm:opacity-0 translate-x-0 sm:-translate-x-full sm:scale-95 pointer-events-auto sm:pointer-events-none z-10 sm:z-0'
                          : 'opacity-100 sm:opacity-0 translate-x-0 sm:translate-x-full sm:scale-95 pointer-events-auto sm:pointer-events-none z-10 sm:z-0'
                    }`}
                  >
                    {/* Left Column: Photo */}
                    <div className="w-full sm:w-[340px] md:w-[400px] h-[240px] sm:h-auto relative flex-shrink-0 bg-soft-light overflow-hidden">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-l from-black/15 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Right Column: Member Details (Vertically Aligned) */}
                    <div className="flex-grow p-6 sm:p-12 md:p-16 flex flex-col justify-center text-left">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary mb-2 leading-tight">
                        {member.name}
                      </h3>
                      <span className="text-[11px] md:text-[12.5px] font-extrabold text-accent tracking-[0.15em] uppercase mb-4 block leading-none">
                        {member.role}
                      </span>
                      <p className="text-text-light text-sm sm:text-base md:text-lg leading-relaxed max-w-[580px]">
                        {member.bio}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Dots Indicator (Hidden on mobile) */}
            <div className="hidden sm:flex justify-center gap-2.5 mt-8">
              {team.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentMember(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentMember === idx ? 'bg-primary w-6' : 'bg-border-gray/60 hover:bg-text-light'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* The RLBSA Edge Section */}
      <section ref={edgeRef} className="py-24 bg-soft-light/40 w-full border-b border-border-gray/50 overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-5">
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent">
              RLBSA Edge
            </h2>
            <p className="text-text-light text-base md:text-lg">
              We go beyond ordinary coaching centers. We build a high-performance ecosystem for long-term athletic success.
            </p>
          </div>

          {/* Grid Layout inspired by Reliance Foundation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Column 1: Large Featured Card (Spans full height on desktop) */}
            <div className="lg:col-span-1 flex">
              <a
                href="#/about/what-we-do"
                className={`flex flex-col bg-white rounded-xl overflow-hidden border border-border-gray/50 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-[1000ms] ease-out transform w-full group cursor-pointer ${
                  isEdgeVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-24'
                }`}
              >
                <div className="h-[240px] sm:h-[300px] lg:h-[280px] overflow-hidden relative bg-soft-light flex-shrink-0">
                  <img
                    src="/images/about_rlbsa.png"
                    alt="RLBSA Residential Scholarship"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="p-8 flex flex-col justify-between flex-grow text-left">
                  <div>
                    <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-3 block">
                      RESIDENTIAL SCHOLARSHIP
                    </span>
                    <h3 className="text-xl md:text-2xl font-extrabold text-primary mb-4 leading-tight group-hover:text-accent transition-colors">
                      “We identify raw grassroots potential and nurture them into national-level sports champions.”
                    </h3>
                    <p className="text-text-light text-sm leading-relaxed mb-6">
                      RLBSA provides selected talented kids from rural Bihar with free professional coaching, fully sponsored boarding, sports diet, and educational support.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-primary group-hover:text-accent flex items-center gap-1 mt-auto">
                    READ MORE &rarr;
                  </span>
                </div>
              </a>
            </div>

            {/* Columns 2 & 3: 2x2 Grid of Smaller Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              
              {/* Card 2: Certified Curriculum */}
              <a
                href="#/about/what-we-do"
                className={`flex flex-col bg-white rounded-xl overflow-hidden border border-border-gray/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-[1000ms] ease-out transform delay-150 group cursor-pointer ${
                  isEdgeVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-24'
                }`}
              >
                <div className="h-[160px] overflow-hidden relative bg-soft-light">
                  <img
                    src="/images/sports_training_card.jpg"
                    alt="Certified Curriculum"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col justify-between flex-grow text-left">
                  <div>
                    <span className="text-[9px] font-extrabold text-accent uppercase tracking-wider mb-2 block">
                      CURRICULUM
                    </span>
                    <h3 className="text-base font-extrabold text-primary mb-2 leading-snug group-hover:text-accent transition-colors">
                      Structured Multi-Sport Development Pathways
                    </h3>
                    <p className="text-text-light text-xs leading-relaxed">
                      Structured progression pathways for multi-sport learners, beginner development, and competitive youth performance modules.
                    </p>
                  </div>
                </div>
              </a>

              {/* Card 3: Modern Infrastructure */}
              <a
                href="#/about/facilities"
                className={`flex flex-col bg-white rounded-xl overflow-hidden border border-border-gray/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-[1000ms] ease-out transform delay-300 group cursor-pointer ${
                  isEdgeVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-24'
                }`}
              >
                <div className="h-[160px] overflow-hidden relative bg-soft-light">
                  <img
                    src="/images/hero2.jpg"
                    alt="Modern Infrastructure"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col justify-between flex-grow text-left">
                  <div>
                    <span className="text-[9px] font-extrabold text-accent uppercase tracking-wider mb-2 block">
                      INFRASTRUCTURE
                    </span>
                    <h3 className="text-base font-extrabold text-primary mb-2 leading-snug group-hover:text-accent transition-colors">
                      Vast Olympic-Level Sports Facilities & Arenas
                    </h3>
                    <p className="text-text-light text-xs leading-relaxed">
                      Access temperature-controlled pools, synthetic athletics tracks, indoor wooden courts, and bowling simulations.
                    </p>
                  </div>
                </div>
              </a>

              {/* Card 4: Sports Science & Diet */}
              <a
                href="#/about/what-we-do"
                className={`flex flex-col bg-white rounded-xl overflow-hidden border border-border-gray/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-[1000ms] ease-out transform delay-450 group cursor-pointer ${
                  isEdgeVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-24'
                }`}
              >
                <div className="h-[160px] overflow-hidden relative bg-soft-light">
                  <img
                    src="/images/nutrition_card.jpg"
                    alt="Sports Science & Diet"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col justify-between flex-grow text-left">
                  <div>
                    <span className="text-[9px] font-extrabold text-accent uppercase tracking-wider mb-2 block">
                      SPORTS SCIENCE
                    </span>
                    <h3 className="text-base font-extrabold text-primary mb-2 leading-snug group-hover:text-accent transition-colors">
                      Calorie-Mapped Nutrition & Rehab Metrics
                    </h3>
                    <p className="text-text-light text-xs leading-relaxed">
                      Integrated biomechanical assessment, nutritional counsel, sports psychologists, and muscle rehab tracking.
                    </p>
                  </div>
                </div>
              </a>

              {/* Card 5: Solid Announcement Card */}
              <a
                href="#/events/registration"
                className={`flex flex-col bg-primary rounded-xl p-8 justify-between text-left border border-primary hover:-translate-y-1 transition-all duration-[1000ms] ease-out transform delay-600 shadow-sm hover:shadow-lg h-full group cursor-pointer ${
                  isEdgeVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-24'
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-accent text-primary flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Trophy size={24} weight="bold" />
                </div>
                <div>
                  <span className="text-[9px] font-black text-accent uppercase tracking-widest mb-2 block">
                    UPCOMING TRIALS
                  </span>
                  <h3 className="text-lg font-extrabold text-white mb-3 leading-snug group-hover:text-accent transition-colors">
                    Join Our Annual Selection Trials & Camps
                  </h3>
                  <p className="text-white/85 text-xs leading-relaxed mb-6">
                    Annual selection trials are open for resident academy scholarships. Open to under-17 girls and boys in multiple athletic fields.
                  </p>
                </div>
                <span className="text-xs font-bold text-accent group-hover:translate-x-1 transition-transform flex items-center gap-1 mt-auto">
                  REGISTER NOW &rarr;
                </span>
              </a>

            </div>

          </div>
        </div>
      </section>

      {/* Success Testimonials Section */}
      <section ref={storiesRef} className="py-24 bg-soft-light w-full border-t border-border-gray/30 overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-5">
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent">
              Success Stories
            </h2>
            <p className="text-text-light text-base md:text-lg">
              Meet our elite young champions whose lives and athletic careers were transformed at the academy.
            </p>
          </div>

          <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 pb-6 md:pb-0 snap-x snap-mandatory scroll-smooth px-5 -mx-5 hide-scrollbar">
            {successPlayers.map((player, idx) => {
              const delays = ['delay-0', 'delay-200', 'delay-400'];
              const delayClass = delays[idx] || 'delay-0';
              return (
                <a
                  href="#/academy/featured-players"
                  key={idx}
                  className={`flex-shrink-0 w-[85vw] max-w-[320px] md:w-auto snap-center first:ml-[7.5vw] md:first:ml-0 last:mr-[7.5vw] md:last:mr-0 group bg-white rounded-md overflow-hidden border border-border-gray/30 shadow-md hover:shadow-xl hover:-translate-y-1 flex flex-col cursor-pointer transition-all duration-[1000ms] ease-out transform ${delayClass} ${
                    isStoriesVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-24'
                  }`}
                >
                  {/* Image Section */}
                  <div className="h-[280px] overflow-hidden relative bg-soft-light">
                    <img
                      src={player.image}
                      alt={player.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-accent text-primary text-[10px] font-black tracking-[0.12em] uppercase py-1 px-3.5 rounded-full shadow-sm leading-none border border-white/20">
                      {player.sport}
                    </span>
                  </div>

                  {/* Details Section */}
                  <div className="p-8 flex flex-col justify-between flex-grow text-left">
                    <div>
                      <h3 className="text-2xl font-extrabold text-primary mb-1 group-hover:text-accent transition-colors">
                        {player.name}
                      </h3>
                      <span className="text-[11px] font-extrabold text-accent uppercase tracking-wider block mb-4">
                        {player.achievement}
                      </span>
                      <p className="text-text-light text-sm leading-relaxed mb-4">
                        {player.description}
                      </p>
                      <div className="pl-3 border-l-2 border-accent/60 italic text-xs text-text-light/95 leading-relaxed mb-6 font-medium">
                        "{player.quote}"
                      </div>
                    </div>
                    <div className="pt-4 border-t border-dashed border-border-gray/40 flex justify-between items-center text-[11px] text-text-light font-bold">
                      <span>Joined Academy:</span>
                      <span className="text-primary">{player.joined}</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
