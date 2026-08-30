import React from 'react';

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

interface ProgramsProps {
  sub: string;
}

export const Programs: React.FC<ProgramsProps> = () => {
  return (
    <section className="py-20 px-5 max-w-[1380px] mx-auto animate-fade-in">
      {/* Page Heading */}
      <div className="text-center max-w-[700px] mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent">
          Our Sports Roster
        </h2>
        <p className="text-text-light text-base md:text-lg">
          RLBSA provides coaching in Football, Handball, Rugby, and Athletics with a focus on holistic development and elite competition.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        {/* HERO CARD: Football */}
        <RevealRow id="football-hero" className="w-full">
          {(isVisible) => (
            <div className={`bg-white border border-border-gray/70 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-24'} flex flex-col lg:flex-row w-full min-h-[450px]`}>
              {/* Hero Left: Image */}
              <div className="lg:w-1/2 relative h-[300px] lg:h-auto min-h-[300px] bg-primary">
                <img 
                  src="/images/program_football.png" 
                  alt="Football Training Academy" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-accent text-primary text-xs font-black px-3 py-1.5 rounded shadow">
                    FLAGSHIP PROGRAM
                  </span>
                  <span className="bg-primary/90 text-white text-xs font-bold px-3 py-1.5 rounded shadow">
                    Ages 6+
                  </span>
                </div>
              </div>

              {/* Hero Right: Details */}
              <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center text-left">
                <span className="text-accent text-[11px] font-black tracking-[0.2em] uppercase mb-2 block">
                  Elite Level Development
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-primary mb-4">
                  Football Training Academy
                </h3>
                <p className="text-text-light text-sm md:text-base leading-relaxed mb-6">
                  Our flagship training program designed to identify, nurture, and accelerate grassroots football talent. With FIFA-certified turf, automated speed gates, and tactical coach-led drills, we groom raw potential for state, national, and professional league selections.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-dashed border-border-gray/60">
                  {/* Highlight Bullets */}
                  <div>
                    <h4 className="text-xs font-extrabold text-primary uppercase tracking-wider mb-3">
                      Core Highlights
                    </h4>
                    <ul className="text-xs text-text-light font-bold space-y-2">
                      <li className="flex items-center gap-2">⚽ Modern Tactical Systems</li>
                      <li className="flex items-center gap-2">🏃 Speed &amp; Stamina Audits</li>
                      <li className="flex items-center gap-2">🥅 Goalkeeper Training Clinics</li>
                      <li className="flex items-center gap-2">🏟️ Synthetic Turf Access</li>
                    </ul>
                  </div>

                  {/* Schedule / Coaches */}
                  <div>
                    <h4 className="text-xs font-extrabold text-primary uppercase tracking-wider mb-3">
                      Batch Information
                    </h4>
                    <div className="text-xs text-text-body space-y-2 font-semibold">
                      <p><span className="text-accent font-bold">⏱️ Morning:</span> 5:30 AM - 8:00 AM</p>
                      <p><span className="text-accent font-bold">⏱️ Evening:</span> 4:00 PM - 6:30 PM</p>
                      <p className="pt-1 text-[11px] text-text-light">👥 Led by Head Coach Rajesh Sen</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </RevealRow>

        {/* SUB CARDS GRID: Handball, Rugby, Athletics */}
        <RevealRow id="sub-cards-grid" className="w-full">
          {(isVisible) => (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Handball */}
              <div className={`bg-white border border-border-gray/70 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-24'} flex flex-col`}>
                <div className="h-[200px] relative overflow-hidden bg-primary">
                  <img 
                    src="/images/program_handball.png" 
                    alt="Handball Training" 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-3 left-3 bg-accent text-primary text-[10px] font-black px-2.5 py-1 rounded">
                    AGES 8+
                  </span>
                </div>
                <div className="p-6 text-left flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-primary mb-2">Handball Academy</h3>
                    <p className="text-text-light text-xs md:text-sm leading-relaxed mb-4">
                      Develop speed dribbling, tactical coordination, dynamic jumps, and high-precision throwing techniques under SAI certified coaching.
                    </p>
                  </div>
                  <ul className="text-[11px] font-bold text-text-light space-y-1.5 pt-4 border-t border-dashed border-border-gray/40">
                    <li className="flex items-center gap-2">🤾 Jump Shot Drills</li>
                    <li className="flex items-center gap-2">🛡️ Defensive Screens</li>
                    <li className="flex items-center gap-2">⏱️ Team Coordination</li>
                  </ul>
                </div>
              </div>

              {/* Card 2: Rugby */}
              <div className={`bg-white border border-border-gray/70 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-24'} delay-150 flex flex-col`}>
                <div className="h-[200px] relative overflow-hidden bg-primary">
                  <img 
                    src="/images/program_rugby.png" 
                    alt="Rugby Coaching" 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-3 left-3 bg-accent text-primary text-[10px] font-black px-2.5 py-1 rounded">
                    AGES 10+
                  </span>
                </div>
                <div className="p-6 text-left flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-primary mb-2">Rugby Technical</h3>
                    <p className="text-text-light text-xs md:text-sm leading-relaxed mb-4">
                      Learn safe contact tackling, scrums, passing, and teamwork under professional Technical Leads, strictly aligning with IRB safety guidelines.
                    </p>
                  </div>
                  <ul className="text-[11px] font-bold text-text-light space-y-1.5 pt-4 border-t border-dashed border-border-gray/40">
                    <li className="flex items-center gap-2">🏉 Safe Contact Tackles</li>
                    <li className="flex items-center gap-2">🤝 Scrums &amp; Rucks</li>
                    <li className="flex items-center gap-2">🏃 Physical Resilience</li>
                  </ul>
                </div>
              </div>

              {/* Card 3: Athletics */}
              <div className={`bg-white border border-border-gray/70 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-24'} delay-300 flex flex-col`}>
                <div className="h-[200px] relative overflow-hidden bg-primary">
                  <img 
                    src="/images/program_athletics.png" 
                    alt="Track &amp; Field Athletics" 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-3 left-3 bg-accent text-primary text-[10px] font-black px-2.5 py-1 rounded">
                    AGES 6+
                  </span>
                </div>
                <div className="p-6 text-left flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-primary mb-2">Track &amp; Field Athletics</h3>
                    <p className="text-text-light text-xs md:text-sm leading-relaxed mb-4">
                      Refine sprinting form, explosive speed acceleration, hurdles, long jumps, and overall physiological fitness metrics.
                    </p>
                  </div>
                  <ul className="text-[11px] font-bold text-text-light space-y-1.5 pt-4 border-t border-dashed border-border-gray/40">
                    <li className="flex items-center gap-2">🏃 Running Biomechanics</li>
                    <li className="flex items-center gap-2">⚡ Speed Acceleration</li>
                    <li className="flex items-center gap-2">📈 Endurance &amp; Pacing</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </RevealRow>
      </div>
    </section>
  );
};
