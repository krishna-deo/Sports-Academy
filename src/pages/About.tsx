import React from 'react';
import { Eye, Target } from '@phosphor-icons/react';
import { SportSVG } from '../components/SportSVG';

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
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05 }
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
    <div ref={ref} className={className} data-id={id}>
      {children(isVisible)}
    </div>
  );
};

export const About: React.FC<AboutProps> = ({ sub }) => {

  return (
    <section className="py-20 px-5 max-w-[1240px] mx-auto animate-fade-in">
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
                      <img src="/images/about_rlbsa.png" alt="Growing Partnerships" className="w-full h-full object-cover" />
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

            {/* 2. Education & Schooling (Text Left, Image Right) */}
            <RevealRow id="education" className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              {(isVisible) => (
                <>
                  {/* Left Column: Details */}
                  <div className={`flex flex-col justify-center text-left order-2 md:order-1 transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}>
                    <span className="text-accent text-[11px] font-black tracking-[0.15em] uppercase mb-2 block leading-none">Academic Excellence</span>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-primary mb-4 leading-tight">Education & Schooling</h3>
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
                      <img src="/images/education_card.jpg" alt="Education & Schooling" className="w-full h-full object-cover" />
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

            {/* 4. Hostel & Lodging (Text Left, Image Right) */}
            <RevealRow id="hostel" className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              {(isVisible) => (
                <>
                  {/* Left Column: Details */}
                  <div className={`flex flex-col justify-center text-left order-2 md:order-1 transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}>
                    <span className="text-accent text-[11px] font-black tracking-[0.15em] uppercase mb-2 block leading-none">Residential Boarding</span>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-primary mb-4 leading-tight">Hostel & Lodging</h3>
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
                      <img src="/images/hostel_card.png" alt="Hostel & Lodging" className="w-full h-full object-cover" />
                    </div>
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
              <div className="h-[200px] bg-primary flex items-center justify-center text-5xl relative">
                <SportSVG sportType="football" colorStart="#004D4D" colorEnd="#1A1A1A" />
                <span className="absolute bottom-3 right-3 bg-primary/85 text-white py-1 px-2.5 rounded text-xs font-semibold">
                  FIFA Quality
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-primary mb-2">Elite Synthetic Football Turf</h3>
                <p className="text-text-light text-sm leading-relaxed">
                  Full-size pitch featuring shock-absorption turf technology to reduce knee stress, equipped with high-intensity spotlights for night matches.
                </p>
              </div>
            </div>

            {/* Facility Card 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-border-gray hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="h-[200px] bg-primary flex items-center justify-center text-5xl relative">
                <SportSVG sportType="swimming" colorStart="#002B36" colorEnd="#1E3A8A" />
                <span className="absolute bottom-3 right-3 bg-primary/85 text-white py-1 px-2.5 rounded text-xs font-semibold">
                  25 &deg;C Heated
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-primary mb-2">Olympic Swimming Arena</h3>
                <p className="text-text-light text-sm leading-relaxed">
                  10-lane temperature-controlled pool with underwater camera ports for video analysis and dedicated physical recovery steam room.
                </p>
              </div>
            </div>

            {/* Facility Card 3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-border-gray hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="h-[200px] bg-primary flex items-center justify-center text-5xl relative">
                <SportSVG sportType="basketball" colorStart="#854D0E" colorEnd="#1A1A1A" />
                <span className="absolute bottom-3 right-3 bg-primary/85 text-white py-1 px-2.5 rounded text-xs font-semibold">
                  Indoor Wood
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-primary mb-2">Indoor Multi-Sport Arena</h3>
                <p className="text-text-light text-sm leading-relaxed">
                  Premium wooden flooring basketball and badminton courts designed with optimal bounce metrics, fully air-conditioned with seating for 1,000 spectators.
                </p>
              </div>
            </div>

            {/* Facility Card 4 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-border-gray hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="h-[200px] bg-primary flex items-center justify-center text-5xl relative">
                <SportSVG sportType="cricket" colorStart="#003C3C" colorEnd="#854D0E" />
                <span className="absolute bottom-3 right-3 bg-primary/85 text-white py-1 px-2.5 rounded text-xs font-semibold">
                  Auto nets
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-primary mb-2">Cricket Lanes & Bowling Sims</h3>
                <p className="text-text-light text-sm leading-relaxed">
                  Four turf and synthetic cricket pitches equipped with automated bowling machines and speed cameras tracking bowling rotations.
                </p>
              </div>
            </div>

            {/* Facility Card 5 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-border-gray hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="h-[200px] bg-primary flex items-center justify-center text-5xl relative">
                <SportSVG sportType="tennis" colorStart="#EA580C" colorEnd="#1A1A1A" />
                <span className="absolute bottom-3 right-3 bg-primary/85 text-white py-1 px-2.5 rounded text-xs font-semibold">
                  Clay Courts
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-primary mb-2">Hard & Clay Tennis Courts</h3>
                <p className="text-text-light text-sm leading-relaxed">
                  6 international-standard courts mapping tournament dimensions, featuring specialized high-grip surfaces and automatic ball launchers.
                </p>
              </div>
            </div>

            {/* Facility Card 6 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-border-gray hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="h-[200px] bg-primary flex items-center justify-center text-5xl relative">
                <SportSVG sportType="athletics" colorStart="#111827" colorEnd="#005A5A" />
                <span className="absolute bottom-3 right-3 bg-primary/85 text-white py-1 px-2.5 rounded text-xs font-semibold">
                  ISO Certified
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-primary mb-2">Strength & Bio-Performance Lab</h3>
                <p className="text-text-light text-sm leading-relaxed">
                  Modern conditioning gym containing high-twitch muscle builders, dynamic run track grids, and medical body fat mapping machinery.
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
          <div className="text-center max-w-[700px] mx-auto mb-20 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent">
              Founders & Key Members
            </h2>
            <p className="text-text-light text-base md:text-lg">
              The dedicated team behind the establishment, welfare, and coaching excellence of the Ranilaxmibai Sports Academy.
            </p>
          </div>

          {/* Staggered Alternating Rows (Flat Typography Theme) */}
          <div className="flex flex-col gap-28 max-w-[1140px] mx-auto overflow-hidden pb-12">
            {/* 1. Sanjay Kumar (Image Left, Details Right) */}
            <RevealRow id="sanjay" className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              {(isVisible) => (
                <>
                  {/* Left Column: Image */}
                  <div className={`transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                    <div className="relative rounded-md overflow-hidden shadow-lg aspect-[4/3] max-h-[380px] border border-border-gray/30 bg-soft-light">
                      <img src="/images/member_sanjay.png" alt="Sanjay Kumar" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Right Column: Details */}
                  <div className={`flex flex-col justify-center text-left transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                    <span className="text-[11px] md:text-[12.5px] font-black tracking-[0.15em] uppercase mb-2 block leading-none text-accent">Founder & President</span>
                    <h3 className="text-3xl font-extrabold text-primary mb-4 leading-tight">Sanjay Kumar</h3>
                    <p className="text-text-light text-base leading-relaxed mb-6">
                      Sanjay Kumar is the core visionary who founded Rani Laxmibai Sports Academy. Driven by the mission to elevate sports opportunities for rural youth in Bihar, he established free lodging, training, and academic support to ensure financial background never limits athletic dreams.
                    </p>
                  </div>
                </>
              )}
            </RevealRow>

            {/* 2. Poonam Devi (Details Left, Image Right) */}
            <RevealRow id="poonam" className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              {(isVisible) => (
                <>
                  {/* Left Column: Details */}
                  <div className={`flex flex-col justify-center text-left order-2 md:order-1 transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                    <span className="text-[11px] md:text-[12.5px] font-black tracking-[0.15em] uppercase mb-2 block leading-none text-accent">Co-Founder & Director of Welfare</span>
                    <h3 className="text-3xl font-extrabold text-primary mb-4 leading-tight">Poonam Devi</h3>
                    <p className="text-text-light text-base leading-relaxed mb-6">
                      Poonam Devi co-founded the academy with a strong commitment to children's welfare and safety. She manages hostel operations, nutritional sports diet charting, and is highly active in creating a secure, empowering environment for female athletes.
                    </p>
                  </div>

                  {/* Right Column: Image */}
                  <div className={`order-1 md:order-2 transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                    <div className="relative rounded-md overflow-hidden shadow-lg aspect-[4/3] max-h-[380px] border border-border-gray/30 bg-soft-light">
                      <img src="/images/member_poonam.png" alt="Poonam Devi" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </>
              )}
            </RevealRow>

            {/* 3. Vikram Rathore (Image Left, Details Right) */}
            <RevealRow id="vikram" className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              {(isVisible) => (
                <>
                  {/* Left Column: Image */}
                  <div className={`transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                    <div className="relative rounded-md overflow-hidden shadow-lg aspect-[4/3] max-h-[380px] border border-border-gray/30 bg-soft-light">
                      <img src="/images/member_vikram.png" alt="Vikram Rathore" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Right Column: Details */}
                  <div className={`flex flex-col justify-center text-left transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                    <span className="text-[11px] md:text-[12.5px] font-black tracking-[0.15em] uppercase mb-2 block leading-none text-accent">Director of Athletics</span>
                    <h3 className="text-3xl font-extrabold text-primary mb-4 leading-tight">Vikram Rathore</h3>
                    <p className="text-text-light text-base leading-relaxed mb-6">
                      Vikram Rathore manages sports training modules, athlete bio-assessments, and national development pathways. Under his supervision, multiple academy members have qualified for state and national selections across different athletic categories.
                    </p>
                  </div>
                </>
              )}
            </RevealRow>
          </div>
        </>
      )}
    </section>
  );
};
