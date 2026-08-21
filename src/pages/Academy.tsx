import React, { useState, useEffect } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { coachesList as initialCoaches, certificationsList, faqsList, successStories } from '../data/sportsData';
import { useHash } from '../hooks/useHash';

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
    <div ref={ref} id={id} className={className} data-id={id}>
      {children(isVisible)}
    </div>
  );
};

interface AcademyProps {
  sub: string;
}

export const Academy: React.FC<AcademyProps> = ({ sub }) => {
  const hash = useHash();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    if (sub === 'success-stories' || sub === 'featured-players') {
      const hashParts = hash.split('?');
      if (hashParts.length > 1) {
        const params = new URLSearchParams(hashParts[1]);
        const playerId = params.get('player');
        if (playerId) {
          const scrollToElement = () => {
            const element = document.getElementById(playerId);
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
    }
  }, [hash, sub]);

  useEffect(() => {
    if (sub === 'coaches') {
      fetch('http://localhost:5000/api/public/coaches')
        .then(res => res.json())
        .then(data => setCoaches(data))
        .catch(err => {
          console.error(err);
          setCoaches(initialCoaches);
        });
    } else if (sub === 'students') {
      fetch('http://localhost:5000/api/public/students')
        .then(res => res.json())
        .then(data => setStudents(data))
        .catch(err => {
          console.error(err);
          setStudents([
            { id: "ST-101", name: "Amrit Kumari", age: 24, sport: "Football", joined: "2018-06-15", medalNumber: 15, avatar: "👩‍🎓" },
            { id: "ST-102", name: "Tara Khatoon", age: 20, sport: "Football", joined: "2020-01-10", medalNumber: 10, avatar: "👩‍🎓" },
            { id: "ST-103", name: "Khushbu Kumari", age: 21, sport: "Football & Handball", joined: "2019-08-05", medalNumber: 12, avatar: "👩‍🎓" },
            { id: "ST-104", name: "Nisha Kumari", age: 22, sport: "Football", joined: "2019-09-20", medalNumber: 8, avatar: "👩‍🎓" },
            { id: "ST-105", name: "Khushi Kumari", age: 19, sport: "Football", joined: "2021-03-12", medalNumber: 14, avatar: "👩‍🎓" },
            { id: "ST-106", name: "Shruti Kumari", age: 18, sport: "Football", joined: "2020-11-18", medalNumber: 11, avatar: "👩‍🎓" }
          ]);
        });
    }
  }, [sub]);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <section className="py-20 px-5 max-w-[1380px] mx-auto animate-fade-in">
      {sub === 'coaches' && (
        <>
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent">
              Our Coaching Roster
            </h2>
            <p className="text-text-light text-base md:text-lg">
              Learn from international certified coaches, former athletes, and physical instructors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coaches.map((coach, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-xl border border-border-gray overflow-hidden hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
              >
                <div className="h-[220px] bg-soft-light flex items-center justify-center text-7xl border-b border-border-gray relative">
                  <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold py-1 px-2.5 rounded">
                    {coach.experience}
                  </span>
                  {coach.avatar}
                </div>
                <div className="p-6">
                  <h3 className="text-base font-bold text-primary mb-1">{coach.name}</h3>
                  <p className="text-xs font-bold text-accent uppercase tracking-wider mb-2">
                    {coach.role}
                  </p>
                  <p className="text-xs text-text-light font-semibold italic mb-3">
                    {coach.specialization}
                  </p>
                  <p className="text-xs text-text-body leading-relaxed">
                    {coach.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {sub === 'students' && (
        <>
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent">
              Our Student Directory
            </h2>
            <p className="text-text-light text-base md:text-lg">
              Meet our dedicated academy players, active tournament competitors, and medal winners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {students.map((student, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-xl border border-border-gray overflow-hidden hover:shadow-lg hover:-translate-y-2 transition-all duration-300 flex flex-col items-center p-6 text-center"
              >
                <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-accent/40 flex items-center justify-center text-4xl mb-4 relative shadow-sm">
                  {student.avatar || '🎓'}
                  <span className="absolute bottom-0 right-0 bg-accent text-primary text-[10px] font-extrabold py-0.5 px-2 rounded-full border border-white">
                    Age {student.age}
                  </span>
                </div>
                
                <h3 className="text-base font-bold text-primary mb-1">{student.name}</h3>
                <p className="text-xs font-bold text-accent uppercase tracking-wider mb-3">
                  {student.sport || 'Athlete'}
                </p>
                
                <div className="w-full pt-3 border-t border-dashed border-border-gray flex justify-between items-center text-xs text-text-light">
                  <span className="font-semibold">Joined:</span>
                  <span>{student.joined || 'N/A'}</span>
                </div>
                
                <div className="w-full mt-2 flex justify-between items-center text-xs text-text-body bg-soft-light py-1.5 px-3 rounded-lg border border-border-gray">
                  <span className="font-bold flex items-center gap-1"><span className="text-sm">🏅</span> Medals Won:</span>
                  <span className="font-extrabold text-primary">{student.medalNumber || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {(sub === 'success-stories' || sub === 'featured-players') && (
        <>
          <div className="text-center max-w-[700px] mx-auto mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent">
              {sub === 'success-stories' ? 'Success Stories & Alumni' : 'Featured Academy Players'}
            </h2>
            <p className="text-text-light text-base md:text-lg">
              {sub === 'success-stories' 
                ? 'See how our sports coaching methodology transformed young prospects into professional athletes.' 
                : 'Meet our elite young champions who have excelled at state and national levels, representing the academy with outstanding sportsmanship.'}
            </p>
          </div>

          <div className="flex flex-col gap-24 md:gap-32 max-w-[1000px] mx-auto">
            {successStories.map((player, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <RevealRow id={player.id} className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center" key={player.id}>
                  {(isVisible) => (
                    <>
                      {/* Left Column: Image (Even index) or Details (Odd index, on desktop) */}
                      {isEven ? (
                        <div className={`transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'} order-1`}>
                          <div className="relative rounded-md overflow-hidden shadow-lg aspect-[4/3] max-h-[380px] border border-border-gray/30 bg-soft-light">
                            <img src={player.image} alt={player.name} className={`w-full h-full object-cover ${player.objectPosition || 'object-top'}`} />
                          </div>
                        </div>
                      ) : (
                        <div className={`transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'} order-2 md:order-1`}>
                          <div className="flex flex-col text-left">
                            <span className="text-accent text-[11px] font-extrabold tracking-[0.15em] uppercase mb-2 inline-block">
                              {player.sport} &bull; {player.achievement}
                            </span>
                            <h3 className="text-3xl font-extrabold text-primary mb-4">
                              {player.name}
                            </h3>
                            <p className="text-text-light text-base leading-relaxed mb-4">
                              {player.description}
                            </p>
                            {sub === 'success-stories' && (
                              <div className="pl-3 border-l-2 border-accent/60 italic text-sm text-text-light/95 leading-relaxed mb-6 font-medium">
                                "{player.quote}"
                              </div>
                            )}
                            <div className="flex flex-wrap gap-4 pt-4 border-t border-dashed border-border-gray/40">
                              <div className="flex flex-col">
                                <span className="text-[10px] text-text-light uppercase tracking-wider font-extrabold">Joined Academy</span>
                                <span className="text-primary font-bold text-sm">{player.joined}</span>
                              </div>
                              <div className="h-8 w-[1px] bg-slate-300"></div>
                              <div className="flex flex-col">
                                <span className="text-[10px] text-text-light uppercase tracking-wider font-extrabold">Age</span>
                                <span className="text-primary font-bold text-sm">{player.age} Years</span>
                              </div>
                              <div className="h-8 w-[1px] bg-slate-300"></div>
                              <div className="flex flex-col">
                                <span className="text-[10px] text-text-light uppercase tracking-wider font-extrabold">Medals Won</span>
                                <span className="text-accent font-extrabold text-sm">🏅 {player.medals} Medals</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Right Column: Details (Even index) or Image (Odd index, on desktop) */}
                      {isEven ? (
                        <div className={`transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'} order-2`}>
                          <div className="flex flex-col text-left">
                            <span className="text-accent text-[11px] font-extrabold tracking-[0.15em] uppercase mb-2 inline-block">
                              {player.sport} &bull; {player.achievement}
                            </span>
                            <h3 className="text-3xl font-extrabold text-primary mb-4">
                              {player.name}
                            </h3>
                            <p className="text-text-light text-base leading-relaxed mb-4">
                              {player.description}
                            </p>
                            {sub === 'success-stories' && (
                              <div className="pl-3 border-l-2 border-accent/60 italic text-sm text-text-light/95 leading-relaxed mb-6 font-medium">
                                "{player.quote}"
                              </div>
                            )}
                            <div className="flex flex-wrap gap-4 pt-4 border-t border-dashed border-border-gray/40">
                              <div className="flex flex-col">
                                <span className="text-[10px] text-text-light uppercase tracking-wider font-extrabold">Joined Academy</span>
                                <span className="text-primary font-bold text-sm">{player.joined}</span>
                              </div>
                              <div className="h-8 w-[1px] bg-slate-300"></div>
                              <div className="flex flex-col">
                                <span className="text-[10px] text-text-light uppercase tracking-wider font-extrabold">Age</span>
                                <span className="text-primary font-bold text-sm">{player.age} Years</span>
                              </div>
                              <div className="h-8 w-[1px] bg-slate-300"></div>
                              <div className="flex flex-col">
                                <span className="text-[10px] text-text-light uppercase tracking-wider font-extrabold">Medals Won</span>
                                <span className="text-accent font-extrabold text-sm">🏅 {player.medals} Medals</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={`transition-all duration-[1000ms] ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'} order-1 md:order-2`}>
                          <div className="relative rounded-md overflow-hidden shadow-lg aspect-[4/3] max-h-[380px] border border-border-gray/30 bg-soft-light">
                            <img src={player.image} alt={player.name} className={`w-full h-full object-cover ${player.objectPosition || 'object-top'}`} />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </RevealRow>
              );
            })}
          </div>
        </>
      )}

      {sub === 'certifications' && (
        <>
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent">
              Affiliations & Certifications
            </h2>
            <p className="text-text-light text-base md:text-lg">
              We align our methods and safety guidelines with top athletic regulatory authorities.
            </p>
          </div>

          <div className="max-w-[900px] mx-auto flex flex-col gap-6">
            {certificationsList.map((cert, idx) => (
              <div 
                key={idx} 
                className="bg-white p-7 rounded-xl border border-border-gray flex flex-col md:flex-row gap-6 items-center text-center md:text-left hover:shadow-md hover:scale-[1.01] transition-all duration-200"
              >
                <div className="w-[80px] h-[80px] bg-accent/15 text-accent rounded-full flex items-center justify-center text-3.5xl shrink-0">
                  {cert.badge}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary mb-1">{cert.title}</h3>
                  <p className="text-xs font-bold text-accent uppercase tracking-wider mb-3">
                    {cert.authority}
                  </p>
                  <p className="text-text-light text-sm leading-relaxed">
                    {cert.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {sub === 'faqs' && (
        <>
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent">
              Academy FAQs
            </h2>
            <p className="text-text-light text-base md:text-lg">
              Find fast answers regarding program timings, certifications, batches, and safety methods.
            </p>
          </div>

          <div className="max-w-[800px] mx-auto flex flex-col gap-4">
            {faqsList.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="bg-white rounded-lg border border-border-gray overflow-hidden">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left bg-none border-none py-5 px-6 font-bold text-[15px] md:text-base text-primary flex justify-between items-center cursor-pointer hover:bg-soft-light transition-all"
                  >
                    <span>{faq.question}</span>
                    <CaretDown 
                      size={18} 
                      className={`transition-transform duration-300 text-primary ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </button>
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-[300px] border-t border-border-gray' : 'max-h-0'
                    }`}
                  >
                    <div className="p-6 text-sm md:text-[15px] leading-relaxed text-text-light">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}


    </section>
  );
};
