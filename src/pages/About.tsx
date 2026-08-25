import React from 'react';
import { Eye, Target } from '@phosphor-icons/react';
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

export const About: React.FC<AboutProps> = ({ sub }) => {
  const [team, setTeam] = React.useState<any[]>(teamMembers);

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
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent">
              Our Story
            </h2>
            <p className="text-text-light text-base md:text-lg">
              How we started as a small grassroots coaching academy and expanded into the region's elite sports school.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative max-w-[960px] mx-auto py-10 after:absolute after:w-[3px] after:bg-border-gray after:top-0 after:bottom-0 after:left-1/2 after:-ml-[1.5px] after:hidden md:after:block select-none overflow-hidden">
            {/* Item 1: 2009 (Details Left, Image Right) */}
            <RevealRow id="t2009" className="relative flex flex-col md:flex-row items-center w-full mb-16 last:mb-0">
              {(isVisible) => (
                <>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-accent rounded-full z-10 hidden md:block"></div>

                  {/* Left Side: Details Card */}
                  <div className={`w-full md:w-1/2 pr-0 md:pr-10 text-left md:text-right flex justify-end transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'} order-2 md:order-1`}>
                    <div className="p-7 bg-soft-light rounded-xl hover:bg-white hover:shadow-lg border border-border-gray/30 transition-all duration-300 w-full max-w-[400px]">
                      <div className="text-2xl font-extrabold text-accent mb-2">2009</div>
                      <h3 className="text-lg font-bold text-primary mb-2">The Beginning</h3>
                      <p className="text-text-light text-sm leading-relaxed">
                        Rani Laxmibai Sports Academy (RLBSA) was established in Laxmipur, Siwan, Bihar with a vision to identify and nurture rural talent, especially girls, through sports and education.
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Image */}
                  <div className={`w-full md:w-1/2 pl-0 md:pl-10 text-left flex justify-start transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'} order-1 md:order-2 mb-6 md:mb-0`}>
                    <div className="relative rounded-md overflow-hidden shadow-md aspect-[16/10] w-full max-w-[400px] border border-border-gray/30 bg-soft-light">
                      <img src="/images/hero1.jpeg" alt="The Beginning" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </>
              )}
            </RevealRow>

            {/* Item 2: 2010 (Image Left, Details Right) */}
            <RevealRow id="t2010" className="relative flex flex-col md:flex-row items-center w-full mb-16 last:mb-0">
              {(isVisible) => (
                <>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-accent rounded-full z-10 hidden md:block"></div>

                  {/* Left Side: Image */}
                  <div className={`w-full md:w-1/2 pr-0 md:pr-10 text-left md:text-right flex justify-end transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'} order-1 mb-6 md:mb-0`}>
                    <div className="relative rounded-md overflow-hidden shadow-md aspect-[16/10] w-full max-w-[400px] border border-border-gray/30 bg-soft-light">
                      <img src="/images/education_card.jpg" alt="Free Sports & Education" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Right Side: Details Card */}
                  <div className={`w-full md:w-1/2 pl-0 md:pl-10 text-left flex justify-start transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'} order-2`}>
                    <div className="p-7 bg-soft-light rounded-xl hover:bg-white hover:shadow-lg border border-border-gray/30 transition-all duration-300 w-full max-w-[400px]">
                      <div className="text-2xl font-extrabold text-accent mb-2">2010</div>
                      <h3 className="text-lg font-bold text-primary mb-2">Free Sports & Education</h3>
                      <p className="text-text-light text-sm leading-relaxed">
                        RLBSA introduced completely free boarding, coaching, kits, nutritious meals, and educational support, ensuring that children from underprivileged backgrounds could pursue sports.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </RevealRow>

            {/* Item 3: 2013 (Details Left, Image Right) */}
            <RevealRow id="t2013" className="relative flex flex-col md:flex-row items-center w-full mb-16 last:mb-0">
              {(isVisible) => (
                <>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-accent rounded-full z-10 hidden md:block"></div>

                  {/* Left Side: Details Card */}
                  <div className={`w-full md:w-1/2 pr-0 md:pr-10 text-left md:text-right flex justify-end transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'} order-2 md:order-1`}>
                    <div className="p-7 bg-soft-light rounded-xl hover:bg-white hover:shadow-lg border border-border-gray/30 transition-all duration-300 w-full max-w-[400px]">
                      <div className="text-2xl font-extrabold text-accent mb-2">2013</div>
                      <h3 className="text-lg font-bold text-primary mb-2">Producing State Athletes</h3>
                      <p className="text-text-light text-sm leading-relaxed">
                        The academy started producing talented players who represented Bihar in Football, Handball, and Athletics, proving that rural athletes could compete successfully at higher levels.
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Image */}
                  <div className={`w-full md:w-1/2 pl-0 md:pl-10 text-left flex justify-start transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'} order-1 md:order-2 mb-6 md:mb-0`}>
                    <div className="relative rounded-md overflow-hidden shadow-md aspect-[16/10] w-full max-w-[400px] border border-border-gray/30 bg-soft-light">
                      <img src="/images/sports_training_card.jpg" alt="State-Level Athletes" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </>
              )}
            </RevealRow>

            {/* Item 4: 2016 (Image Left, Details Right) */}
            <RevealRow id="t2016" className="relative flex flex-col md:flex-row items-center w-full mb-16 last:mb-0">
              {(isVisible) => (
                <>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-accent rounded-full z-10 hidden md:block"></div>

                  {/* Left Side: Image */}
                  <div className={`w-full md:w-1/2 pr-0 md:pr-10 text-left md:text-right flex justify-end transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'} order-1 mb-6 md:mb-0`}>
                    <div className="relative rounded-md overflow-hidden shadow-md aspect-[16/10] w-full max-w-[400px] border border-border-gray/30 bg-soft-light">
                      <img src="/images/player_aarti.png" alt="National Recognition" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Right Side: Details Card */}
                  <div className={`w-full md:w-1/2 pl-0 md:pl-10 text-left flex justify-start transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'} order-2`}>
                    <div className="p-7 bg-soft-light rounded-xl hover:bg-white hover:shadow-lg border border-border-gray/30 transition-all duration-300 w-full max-w-[400px]">
                      <div className="text-2xl font-extrabold text-accent mb-2">2016</div>
                      <h3 className="text-lg font-bold text-primary mb-2">National Recognition</h3>
                      <p className="text-text-light text-sm leading-relaxed">
                        Several academy athletes earned opportunities to represent India and their respective states in national and international competitions, bringing recognition to rural Bihar.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </RevealRow>

            {/* Item 5: 2020 (Details Left, Image Right) */}
            <RevealRow id="t2020" className="relative flex flex-col md:flex-row items-center w-full mb-16 last:mb-0">
              {(isVisible) => (
                <>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-accent rounded-full z-10 hidden md:block"></div>

                  {/* Left Side: Details Card */}
                  <div className={`w-full md:w-1/2 pr-0 md:pr-10 text-left md:text-right flex justify-end transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'} order-2 md:order-1`}>
                    <div className="p-7 bg-soft-light rounded-xl hover:bg-white hover:shadow-lg border border-border-gray/30 transition-all duration-300 w-full max-w-[400px]">
                      <div className="text-2xl font-extrabold text-accent mb-2">2020</div>
                      <h3 className="text-lg font-bold text-primary mb-2">Campus Completed</h3>
                      <p className="text-text-light text-sm leading-relaxed">
                        A major milestone was achieved with the completion of a residential hostel facility accommodating approximately 50 children, while another 50 non-residential students continued receiving support.
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Image */}
                  <div className={`w-full md:w-1/2 pl-0 md:pl-10 text-left flex justify-start transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'} order-1 md:order-2 mb-6 md:mb-0`}>
                    <div className="relative rounded-md overflow-hidden shadow-md aspect-[16/10] w-full max-w-[400px] border border-border-gray/30 bg-soft-light">
                      <img src="/images/hostel_card.png" alt="Residential Campus" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </>
              )}
            </RevealRow>

            {/* Item 6: 2021 (Image Left, Details Right) */}
            <RevealRow id="t2021" className="relative flex flex-col md:flex-row items-center w-full mb-16 last:mb-0">
              {(isVisible) => (
                <>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-accent rounded-full z-10 hidden md:block"></div>

                  {/* Left Side: Image */}
                  <div className={`w-full md:w-1/2 pr-0 md:pr-10 text-left md:text-right flex justify-end transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'} order-1 mb-6 md:mb-0`}>
                    <div className="relative rounded-md overflow-hidden shadow-md aspect-[16/10] w-full max-w-[400px] border border-border-gray/30 bg-soft-light">
                      <img src="/images/player_rahul.png" alt="Holistic Development" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Right Side: Details Card */}
                  <div className={`w-full md:w-1/2 pl-0 md:pl-10 text-left flex justify-start transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'} order-2`}>
                    <div className="p-7 bg-soft-light rounded-xl hover:bg-white hover:shadow-lg border border-border-gray/30 transition-all duration-300 w-full max-w-[400px]">
                      <div className="text-2xl font-extrabold text-accent mb-2">2021</div>
                      <h3 className="text-lg font-bold text-primary mb-2">Holistic Athlete Development</h3>
                      <p className="text-text-light text-sm leading-relaxed">
                        Beyond sports coaching, the academy expanded focus to formal education, English communication, public speaking, personality development, and life skills training.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </RevealRow>

            {/* Item 7: 2022 (Details Left, Image Right) */}
            <RevealRow id="t2022" className="relative flex flex-col md:flex-row items-center w-full mb-16 last:mb-0">
              {(isVisible) => (
                <>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-accent rounded-full z-10 hidden md:block"></div>

                  {/* Left Side: Details Card */}
                  <div className={`w-full md:w-1/2 pr-0 md:pr-10 text-left md:text-right flex justify-end transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'} order-2 md:order-1`}>
                    <div className="p-7 bg-soft-light rounded-xl hover:bg-white hover:shadow-lg border border-border-gray/30 transition-all duration-300 w-full max-w-[400px]">
                      <div className="text-2xl font-extrabold text-accent mb-2">2022</div>
                      <h3 className="text-lg font-bold text-primary mb-2">Growing Partnerships</h3>
                      <p className="text-text-light text-sm leading-relaxed">
                        Support from organizations such as the National Foundation for India, Garnet Foundation, Nalanda Charitable Foundation, and IMA Siwan enabled the academy to strengthen facilities.
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Image */}
                  <div className={`w-full md:w-1/2 pl-0 md:pl-10 text-left flex justify-start transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'} order-1 md:order-2 mb-6 md:mb-0`}>
                    <div className="relative rounded-md overflow-hidden shadow-md aspect-[16/10] w-full max-w-[400px] border border-border-gray/30 bg-soft-light">
                      <img src="/images/about_rlbsa.jpeg" alt="Growing Partnerships" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </>
              )}
            </RevealRow>

            {/* Item 8: Today (Image Left, Details Right) */}
            <RevealRow id="tToday" className="relative flex flex-col md:flex-row items-center w-full mb-16 last:mb-0">
              {(isVisible) => (
                <>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-accent rounded-full z-10 hidden md:block"></div>

                  {/* Left Side: Image */}
                  <div className={`w-full md:w-1/2 pr-0 md:pr-10 text-left md:text-right flex justify-end transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'} order-1 mb-6 md:mb-0`}>
                    <div className="relative rounded-md overflow-hidden shadow-md aspect-[16/10] w-full max-w-[400px] border border-border-gray/30 bg-soft-light">
                      <img src="/images/hero2.jpg" alt="Transforming Talent Today" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Right Side: Details Card */}
                  <div className={`w-full md:w-1/2 pl-0 md:pl-10 text-left flex justify-start transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'} order-2`}>
                    <div className="p-7 bg-soft-light rounded-xl hover:bg-white hover:shadow-lg border border-border-gray/30 transition-all duration-300 w-full max-w-[400px]">
                      <div className="text-2xl font-extrabold text-accent mb-2">Today</div>
                      <h3 className="text-lg font-bold text-primary mb-2">Transforming Rural Talent</h3>
                      <p className="text-text-light text-sm leading-relaxed">
                        Today, RLBSA supports over 100 young athletes through free coaching, accommodation, meals, education, and tournament exposure, empowering rural youth, especially girls.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </RevealRow>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
            <div className="bg-white p-10 rounded-xl shadow-md border-l-5 border-primary hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-bold text-primary mb-5 flex items-center gap-2.5">
                <Eye size={28} className="text-primary" /> Our Vision
              </h3>
              <p className="text-text-body text-sm leading-relaxed">
                To envision a world transformed by the power of sports, creating positive change for youth athletes and communities. We strive to provide every aspiring athlete with opportunities to grow, achieve excellence, and contribute to healthier, stronger, and more inclusive communities.</p>
            </div>

            <div className="bg-white p-10 rounded-xl shadow-md border-l-5 border-accent hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-bold text-primary mb-5 flex items-center gap-2.5">
                <Target size={28} className="text-accent" /> Our Mission
              </h3>
              <p className="text-text-body text-sm leading-relaxed">
                RLBSA strives for excellence in sports development by providing access to quality training, guidance, and opportunities. Through our dedication, we aim to inspire young athletes, nurture their potential, and empower them to achieve greatness while transforming lives through sports.</p>
            </div>
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
            {/* Facility Card 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-border-gray hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="h-[200px] relative overflow-hidden bg-primary">
                <img src="/images/sports_training_card.jpg" alt="Sports Infrastructure" className="w-full h-full object-cover" />
                <span className="absolute bottom-3 right-3 bg-primary/85 text-white py-1 px-2.5 rounded text-xs font-semibold">
                  Olympic Standard
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-primary mb-2">Sports Infrastructure</h3>
                <p className="text-text-light text-sm leading-relaxed">
                  Vast outdoor turf, international track fields, court complexes, and specialized indoor arenas built for high-performance athletic training.
                </p>
              </div>
            </div>

            {/* Facility Card 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-border-gray hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="h-[200px] relative overflow-hidden bg-primary">
                <img src="/images/gym_card.png" alt="Gym & Fitness Center" className="w-full h-full object-cover" />
                <span className="absolute bottom-3 right-3 bg-primary/85 text-white py-1 px-2.5 rounded text-xs font-semibold">
                  Advanced Gear
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-primary mb-2">Gym & Fitness Center</h3>
                <p className="text-text-light text-sm leading-relaxed">
                  State-of-the-art strength and conditioning facility equipped with elite weight training, cardio, and performance tracking systems.
                </p>
              </div>
            </div>

            {/* Facility Card 3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-border-gray hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="h-[200px] relative overflow-hidden bg-primary">
                <img src="/images/hostel_card.png" alt="Hostel & Accommodation" className="w-full h-full object-cover" />
                <span className="absolute bottom-3 right-3 bg-primary/85 text-white py-1 px-2.5 rounded text-xs font-semibold">
                  Residential
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-primary mb-2">Hostel & Accommodation</h3>
                <p className="text-text-light text-sm leading-relaxed">
                  Secure, hygienic, and comfortable residential dormitories for student-athletes with dedicated study zones and lounge areas.
                </p>
              </div>
            </div>

            {/* Facility Card 4 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-border-gray hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="h-[200px] relative overflow-hidden bg-primary">
                <img src="/images/nutrition_card.jpg" alt="Mess & Dining" className="w-full h-full object-cover" />
                <span className="absolute bottom-3 right-3 bg-primary/85 text-white py-1 px-2.5 rounded text-xs font-semibold">
                  Nutritional Diet
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-primary mb-2">Mess & Dining</h3>
                <p className="text-text-light text-sm leading-relaxed">
                  Expert calorie-mapped kitchen providing high-protein, balanced meal plans custom-tailored by sports nutritionists for athlete recovery.
                </p>
              </div>
            </div>

            {/* Facility Card 5 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-border-gray hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="h-[200px] relative overflow-hidden bg-primary">
                <img src="/images/education_card.jpg" alt="Education & Study Facilities" className="w-full h-full object-cover" />
                <span className="absolute bottom-3 right-3 bg-primary/85 text-white py-1 px-2.5 rounded text-xs font-semibold">
                  Modern Learning
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-primary mb-2">Education & Study Facilities</h3>
                <p className="text-text-light text-sm leading-relaxed">
                  Fully-equipped classrooms, computer labs, and a quiet library supporting academic tutoring and personality development sessions.
                </p>
              </div>
            </div>

            {/* Facility Card 6 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-border-gray hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="h-[200px] relative overflow-hidden bg-primary">
                <img src="/images/medical_card.png" alt="Medical & Physiotherapy" className="w-full h-full object-cover" />
                <span className="absolute bottom-3 right-3 bg-primary/85 text-white py-1 px-2.5 rounded text-xs font-semibold">
                  24/7 Care
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-primary mb-2">Medical & Physiotherapy</h3>
                <p className="text-text-light text-sm leading-relaxed">
                  On-campus medical clinic and physiotherapy unit offering active recovery therapies, injury rehabilitation, and routine health checks.
                </p>
              </div>
            </div>

            {/* Facility Card 7 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-border-gray hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="h-[200px] relative overflow-hidden bg-primary">
                <img src="/images/security_card.png" alt="Safety & Security" className="w-full h-full object-cover" />
                <span className="absolute bottom-3 right-3 bg-primary/85 text-white py-1 px-2.5 rounded text-xs font-semibold">
                  Secure Campus
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-primary mb-2">Safety & Security</h3>
                <p className="text-text-light text-sm leading-relaxed">
                  24/7 round-the-clock gated security, CCTV surveillance networks, and trained staff ensuring a safe environment for all trainees.
                </p>
              </div>
            </div>

            {/* Facility Card 8 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-border-gray hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="h-[200px] relative overflow-hidden bg-primary">
                <img src="/images/recreation_card.png" alt="Recreation & Common Areas" className="w-full h-full object-cover" />
                <span className="absolute bottom-3 right-3 bg-primary/85 text-white py-1 px-2.5 rounded text-xs font-semibold">
                  Lounge Zone
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-primary mb-2">Recreation & Common Areas</h3>
                <p className="text-text-light text-sm leading-relaxed">
                  Interactive spaces featuring indoor table games, audio-visual screens, and social hubs for students to unwind and connect.
                </p>
              </div>
            </div>

            {/* Facility Card 9 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-border-gray hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="h-[200px] relative overflow-hidden bg-primary">
                <img src="/images/wifi_card.png" alt="Wi-Fi & Technology" className="w-full h-full object-cover" />
                <span className="absolute bottom-3 right-3 bg-primary/85 text-white py-1 px-2.5 rounded text-xs font-semibold">
                  High-Speed
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-primary mb-2">Wi-Fi & Technology</h3>
                <p className="text-text-light text-sm leading-relaxed">
                  High-speed campus-wide wireless internet access to support digital education, video analysis of sports, and communication.
                </p>
              </div>
            </div>
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
                  <div className={`bg-white border border-border-gray/70 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-24'} flex flex-col lg:flex-row w-full min-h-[400px]`}>
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
                    <div className={`bg-white border border-border-gray/70 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${slideInClass}`} flex flex-col ${directionClass} w-full min-h-[280px]`}>
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
