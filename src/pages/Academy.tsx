import React, { useState, useEffect } from 'react';
import { CaretDown, X } from '@phosphor-icons/react';
import { coachesList as initialCoaches, certificationsList, faqsList, successStories as initialStories } from '../data/sportsData';
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
  const [stories, setStories] = useState<any[]>([]);
  const [genderFilter, setGenderFilter] = useState<'all' | 'boy' | 'girl'>('all');
  const [residencyFilter, setResidencyFilter] = useState<'all' | 'resident' | 'non-resident'>('all');
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [isResidencyDropdownOpen, setIsResidencyDropdownOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<any | null>(null);

  useEffect(() => {
    const handleOutsideClick = () => {
      setIsGenderDropdownOpen(false);
      setIsResidencyDropdownOpen(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleGenderFilterChange = (filter: 'all' | 'boy' | 'girl') => {
    setGenderFilter(filter);
    setResidencyFilter('all');
  };

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
            { id: "ST-101", name: "Amrit Kumari", age: 24, sport: "Football", joined: "2018-06-15", medalNumber: 15, avatar: "👩‍🎓", gender: "girl", residency: "resident" },
            { id: "ST-102", name: "Tara Khatoon", age: 20, sport: "Football", joined: "2020-01-10", medalNumber: 10, avatar: "👩‍🎓", gender: "girl", residency: "non-resident" },
            { id: "ST-103", name: "Khushbu Kumari", age: 21, sport: "Football & Handball", joined: "2019-08-05", medalNumber: 12, avatar: "👩‍🎓", gender: "girl", residency: "resident" },
            { id: "ST-104", name: "Nisha Kumari", age: 22, sport: "Football", joined: "2019-09-20", medalNumber: 8, avatar: "👩‍🎓", gender: "girl", residency: "non-resident" },
            { id: "ST-105", name: "Khushi Kumari", age: 19, sport: "Football", joined: "2021-03-12", medalNumber: 14, avatar: "👩‍🎓", gender: "girl", residency: "resident" },
            { id: "ST-106", name: "Shruti Kumari", age: 18, sport: "Football", joined: "2020-11-18", medalNumber: 11, avatar: "👩‍🎓", gender: "girl", residency: "non-resident" },
            { id: "ST-107", name: "Aarav Singh", age: 16, sport: "Football", joined: "2023-04-12", medalNumber: 9, avatar: "👦", gender: "boy", residency: "resident" },
            { id: "ST-108", name: "Rahul Kumar", age: 17, sport: "Athletics", joined: "2022-09-15", medalNumber: 7, avatar: "👦", gender: "boy", residency: "non-resident" },
            { id: "ST-109", name: "Vikram Jeet", age: 18, sport: "Handball", joined: "2021-11-03", medalNumber: 12, avatar: "👦", gender: "boy", residency: "resident" }
          ]);
        });
    } else if (sub === 'success-stories' || sub === 'featured-players') {
      fetch('http://localhost:5000/api/public/success-stories')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setStories(data);
          } else {
            setStories(initialStories);
          }
        })
        .catch(err => {
          console.error(err);
          setStories(initialStories);
        });
    }
  }, [sub]);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <>
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
                onClick={() => setSelectedCoach(coach)}
                className="bg-white rounded-xl border border-border-gray overflow-hidden hover:shadow-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              >
                <div className="h-[220px] bg-soft-light flex items-center justify-center text-7xl border-b border-border-gray relative">
                  <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold py-1 px-2.5 rounded">
                    {coach.experience}
                  </span>
                  {coach.avatar && (coach.avatar.startsWith('http') || coach.avatar.startsWith('/') || coach.avatar.startsWith('data:')) ? (
                    <img 
                      src={coach.avatar} 
                      alt={coach.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    coach.avatar
                  )}
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

      {sub === 'students' && (() => {
        const filteredStudents = students.filter(student => {
          const sGender = student.gender || 'girl';
          if (genderFilter !== 'all' && sGender !== genderFilter) {
            return false;
          }
          const sResidency = student.residency || 'resident';
          if (residencyFilter !== 'all' && sResidency !== residencyFilter) {
            return false;
          }
          return true;
        });

        return (
          <>
            <div className="text-center max-w-[700px] mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent">
                Our Student Directory
              </h2>
              <p className="text-text-light text-base md:text-lg">
                Meet our dedicated academy players, active tournament competitors, and medal winners.
              </p>
            </div>

            {/* FILTER CONTROLS & COUNT HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-5 mb-10 animate-fade-in z-50 relative">
              {/* Left Side: Count Indicator */}
              {filteredStudents.length > 0 && (
                <div className="text-left self-start md:self-end">
                  <span className="text-[10px] font-bold text-text-light uppercase tracking-wider bg-soft-light border border-border-gray py-2.5 px-4.5 rounded-full shadow-xs">
                    Showing {filteredStudents.length} {filteredStudents.length === 1 ? 'Athlete' : 'Athletes'} Matching Selection
                  </span>
                </div>
              )}

              {/* Right Side: Dropdowns */}
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-stretch sm:items-end justify-end ml-auto">
                {/* Gender Dropdown */}
                <div className="relative w-full sm:w-56 text-left">
                  <label className="block text-left text-[10px] font-bold text-accent uppercase tracking-wider mb-1.5 pl-1">
                    Gender Group
                  </label>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsGenderDropdownOpen(!isGenderDropdownOpen);
                      setIsResidencyDropdownOpen(false);
                    }}
                    className="w-full bg-white border border-border-gray py-3 px-4.5 rounded-xl text-xs font-bold text-primary flex justify-between items-center shadow-xs cursor-pointer hover:border-accent hover:shadow-md transition-all outline-none"
                  >
                    <span className="flex items-center gap-2">
                      {genderFilter === 'all' && '🌍 All Athletes'}
                      {genderFilter === 'boy' && '👦 Boys Section'}
                      {genderFilter === 'girl' && '👧 Girls Section'}
                    </span>
                    <CaretDown size={14} className={`transition-transform duration-200 text-primary-light ${isGenderDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isGenderDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-2 bg-white border border-border-gray rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                      <button
                        type="button"
                        onClick={() => {
                          handleGenderFilterChange('all');
                          setIsGenderDropdownOpen(false);
                        }}
                        className={`w-full py-3 px-4.5 text-xs font-bold text-left hover:bg-soft-light transition-colors cursor-pointer border-none block ${genderFilter === 'all' ? 'text-accent bg-soft-light/40' : 'text-primary'}`}
                      >
                        🌍 All Athletes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleGenderFilterChange('boy');
                          setIsGenderDropdownOpen(false);
                        }}
                        className={`w-full py-3 px-4.5 text-xs font-bold text-left hover:bg-soft-light transition-colors cursor-pointer border-none block ${genderFilter === 'boy' ? 'text-accent bg-soft-light/40' : 'text-primary'}`}
                      >
                        👦 Boys Section
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleGenderFilterChange('girl');
                          setIsGenderDropdownOpen(false);
                        }}
                        className={`w-full py-3 px-4.5 text-xs font-bold text-left hover:bg-soft-light transition-colors cursor-pointer border-none block ${genderFilter === 'girl' ? 'text-accent bg-soft-light/40' : 'text-primary'}`}
                      >
                        👧 Girls Section
                      </button>
                    </div>
                  )}
                </div>

                {/* Residency Dropdown */}
                <div className="relative w-full sm:w-56 text-left">
                  <label className="block text-left text-[10px] font-bold text-accent uppercase tracking-wider mb-1.5 pl-1">
                    Residency Status
                  </label>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsResidencyDropdownOpen(!isResidencyDropdownOpen);
                      setIsGenderDropdownOpen(false);
                    }}
                    className="w-full bg-white border border-border-gray py-3 px-4.5 rounded-xl text-xs font-bold text-primary flex justify-between items-center shadow-xs cursor-pointer hover:border-accent hover:shadow-md transition-all outline-none"
                  >
                    <span className="flex items-center gap-2">
                      {residencyFilter === 'all' && '🏢 All Residencies'}
                      {residencyFilter === 'resident' && '🏠 Boarding (Residents)'}
                      {residencyFilter === 'non-resident' && '🎒 Day Scholar'}
                    </span>
                    <CaretDown size={14} className={`transition-transform duration-200 text-primary-light ${isResidencyDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isResidencyDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-2 bg-white border border-border-gray rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                      <button
                        type="button"
                        onClick={() => {
                          setResidencyFilter('all');
                          setIsResidencyDropdownOpen(false);
                        }}
                        className={`w-full py-3 px-4.5 text-xs font-bold text-left hover:bg-soft-light transition-colors cursor-pointer border-none block ${residencyFilter === 'all' ? 'text-accent bg-soft-light/40' : 'text-primary'}`}
                      >
                        🏢 All Residencies
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setResidencyFilter('resident');
                          setIsResidencyDropdownOpen(false);
                        }}
                        className={`w-full py-3 px-4.5 text-xs font-bold text-left hover:bg-soft-light transition-colors cursor-pointer border-none block ${residencyFilter === 'resident' ? 'text-accent bg-soft-light/40' : 'text-primary'}`}
                      >
                        🏠 Boarding (Residents)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setResidencyFilter('non-resident');
                          setIsResidencyDropdownOpen(false);
                        }}
                        className={`w-full py-3 px-4.5 text-xs font-bold text-left hover:bg-soft-light transition-colors cursor-pointer border-none block ${residencyFilter === 'non-resident' ? 'text-accent bg-soft-light/40' : 'text-primary'}`}
                      >
                        🎒 Day Scholar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="text-center py-20 px-4 bg-soft-light rounded-3xl border border-dashed border-border-gray max-w-[480px] mx-auto animate-fade-in mb-12 shadow-xs">
                <span className="text-5xl block mb-4">🔍</span>
                <h3 className="text-lg font-bold text-primary mb-1.5">No athletes found</h3>
                <p className="text-xs text-text-light leading-relaxed max-w-[340px] mx-auto">
                  We don't have records matching these filters currently. Try selecting another residency or gender group.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredStudents.map((student, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedStudent(student)}
                    className="bg-white rounded-2xl border border-border-gray overflow-hidden hover:shadow-2xl hover:-translate-y-2.5 hover:border-accent/30 transition-all duration-300 flex flex-col items-center p-6 text-center group relative cursor-pointer"
                  >
                    {/* top highlight gradient strip */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 ${(student.residency || 'resident') === 'resident' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>

                    <div className="w-24 h-24 rounded-full bg-soft-light border-4 border-white shadow-md flex items-center justify-center text-4xl mb-4 relative transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 overflow-hidden">
                      {student.avatar && (student.avatar.startsWith('data:') || student.avatar.includes('/') || student.avatar.includes('.')) ? (
                        <img src={student.avatar} alt={student.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <span>{student.avatar || '🎓'}</span>
                      )}
                      <span className="absolute -bottom-1 -right-1 bg-accent text-primary text-[10px] font-black py-0.5 px-2.5 rounded-full border border-white shadow-xs">
                        Age {student.age}
                      </span>
                    </div>
                    
                    <h3 className="text-base font-extrabold text-primary mb-1 tracking-tight group-hover:text-accent transition-colors duration-200">{student.name}</h3>
                    <span className="inline-block bg-primary/5 text-primary text-[10px] font-bold py-0.5 px-2.5 rounded-md uppercase tracking-wider mb-3">
                      {student.sport || 'Athlete'}
                    </span>

                    <div className="mb-4">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider py-1 px-3 rounded-full shadow-xs ${
                        (student.residency || 'resident') === 'resident'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {(student.residency || 'resident') === 'resident' ? '🏠 Boarding Athlete' : '🎒 Day Scholar'}
                      </span>
                    </div>
                    
                    <div className="w-full mt-auto pt-3.5 border-t border-dashed border-border-gray">
                      <div className="flex justify-between items-center text-[11px] text-text-light font-semibold mb-2">
                        <span>Joined Academy:</span>
                        <span className="font-bold text-primary">{student.joined || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-text-body bg-soft-light py-2 px-3.5 rounded-xl border border-border-gray transition-all group-hover:bg-accent/10 group-hover:border-accent/20">
                        <span className="font-bold flex items-center gap-1.5"><span className="text-sm">🏅</span> Medals Won:</span>
                        <span className="font-black text-sm text-primary">{student.medalNumber || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        );
      })()}

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
            {stories.map((player, idx) => {
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
      
    </section>
      
      {/* Detailed Student Modal */}
      {selectedStudent && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 text-left animate-fade-in" 
          onClick={() => setSelectedStudent(null)}
        >
          <div 
            className="bg-white rounded-2xl border border-border-gray shadow-2xl max-w-3xl w-full overflow-hidden animate-scale-up relative flex flex-col md:flex-row h-auto md:h-[450px]" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left side: Photo - 38% width */}
            <div className="w-full md:w-[38%] h-64 md:h-full relative bg-soft-light flex items-center justify-center shrink-0 border-b md:border-b-0 md:border-r border-border-gray">
              {selectedStudent.avatar && (selectedStudent.avatar.startsWith('data:') || selectedStudent.avatar.includes('/') || selectedStudent.avatar.includes('.')) ? (
                <img 
                  src={selectedStudent.avatar.startsWith('/') ? `http://localhost:5000${selectedStudent.avatar}` : selectedStudent.avatar} 
                  alt={selectedStudent.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span className="text-8xl">{selectedStudent.avatar || '🎓'}</span>
              )}
              {/* Highlight strip overlay */}
              <div className={`absolute top-0 left-0 right-0 h-2 ${(selectedStudent.residency || 'resident') === 'resident' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </div>

            {/* Right side: Details - 62% width */}
            <div className="w-full md:w-[62%] p-6 md:p-8 flex flex-col justify-between relative overflow-y-auto h-full">
              {/* Close button */}
              <button 
                onClick={() => setSelectedStudent(null)}
                className="absolute top-4 right-4 text-text-light hover:text-primary hover:bg-soft-light transition-all p-1.5 rounded-full cursor-pointer border-none bg-transparent outline-none z-10"
              >
                <X size={20} />
              </button>

              <div className="space-y-4">
                {/* Header section with Name & Badges */}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="text-2xl font-black text-primary tracking-tight">{selectedStudent.name}</h3>
                    <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider py-0.5 px-2.5 rounded-full border ${
                      (selectedStudent.residency || 'resident') === 'resident'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {(selectedStudent.residency || 'resident') === 'resident' ? 'Boarding Resident' : 'Day Scholar'}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-text-light">
                    <span className="bg-primary/5 text-primary text-[10px] font-black py-0.5 px-2.5 rounded uppercase tracking-wider">
                      {selectedStudent.sport || 'Athlete'}
                    </span>
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold py-0.5 px-2.5 rounded uppercase">
                      Age {selectedStudent.age} Yrs
                    </span>
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold py-0.5 px-2.5 rounded uppercase">
                      Gender: {selectedStudent.gender || 'Girl'}
                    </span>
                  </div>
                </div>

                {/* Metrics Stats Dashboard */}
                <div className="grid grid-cols-2 gap-3.5 pt-3">
                  <div className="bg-gradient-to-br from-amber-50/60 to-orange-50/60 border border-amber-150 p-3 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-xl shrink-0">🏅</div>
                    <div className="text-left">
                      <span className="block text-[9px] font-bold text-amber-800 uppercase tracking-wider leading-none">Medals Won</span>
                      <span className="text-lg font-black text-amber-700">{selectedStudent.medalNumber || 0} Medals</span>
                    </div>
                  </div>

                  <div className="bg-blue-50/40 border border-blue-100 p-3 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-xl shrink-0">📅</div>
                    <div className="text-left">
                      <span className="block text-[9px] font-bold text-blue-800 uppercase tracking-wider leading-none">Joined Academy</span>
                      <span className="text-sm font-black text-blue-700">{selectedStudent.joined || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Bio / Speech Bubble */}
                <div className="pt-2">
                  <span className="block text-[10px] font-black text-primary uppercase tracking-wider mb-1.5">Athlete Profile & Achievements</span>
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl relative overflow-hidden">
                    <span className="absolute -right-2 -bottom-4 text-primary/[0.04] text-8xl font-black italic select-none">RLS</span>
                    <p className="text-xs text-text-body leading-relaxed font-semibold italic relative z-10">
                      "{selectedStudent.name} is a highly dedicated student athlete specializing in {selectedStudent.sport || 'sports'}. They have shown exceptional performance, winning {selectedStudent.medalNumber || 0} medals and contributing significantly to the academy's successes."
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3.5 border-t border-border-gray/50 flex justify-end">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-6 py-2.5 bg-primary hover:bg-accent hover:text-primary text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md uppercase tracking-wider"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Coach Modal */}
      {selectedCoach && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 text-left animate-fade-in" 
          onClick={() => setSelectedCoach(null)}
        >
          <div 
            className="bg-white rounded-2xl border border-border-gray shadow-2xl max-w-3xl w-full overflow-hidden animate-scale-up relative flex flex-col md:flex-row h-auto md:h-[450px]" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left side: Photo - 38% width */}
            <div className="w-full md:w-[38%] h-64 md:h-full relative bg-soft-light flex items-center justify-center shrink-0 border-b md:border-b-0 md:border-r border-border-gray">
              {selectedCoach.avatar && (selectedCoach.avatar.startsWith('http') || selectedCoach.avatar.startsWith('/') || selectedCoach.avatar.startsWith('data:')) ? (
                <img 
                  src={selectedCoach.avatar} 
                  alt={selectedCoach.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span className="text-8xl">{selectedCoach.avatar || '👨‍🏫'}</span>
              )}
              {/* Experience badge */}
              <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold py-1 px-3 rounded shadow-md z-10">
                {selectedCoach.experience}
              </span>
            </div>

            {/* Right side: Details - 62% width */}
            <div className="w-full md:w-[62%] p-6 md:p-8 flex flex-col justify-between relative overflow-y-auto h-full">
              {/* Close button */}
              <button 
                onClick={() => setSelectedCoach(null)}
                className="absolute top-4 right-4 text-text-light hover:text-primary hover:bg-soft-light transition-all p-1.5 rounded-full cursor-pointer border-none bg-transparent outline-none z-10"
              >
                <X size={20} />
              </button>

              <div className="space-y-4">
                {/* Header section with Name & Badge */}
                <div>
                  <h3 className="text-2xl font-black text-primary tracking-tight mb-1.5">{selectedCoach.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-accent text-primary text-[10px] font-black py-0.5 px-2.5 rounded uppercase tracking-wider">
                      {selectedCoach.role}
                    </span>
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold py-0.5 px-2.5 rounded uppercase">
                      {selectedCoach.specialization}
                    </span>
                  </div>
                </div>

                {/* Stats Dashboard for Coaches */}
                <div className="grid grid-cols-2 gap-3.5 pt-3">
                  <div className="bg-gradient-to-br from-indigo-50/60 to-purple-50/60 border border-indigo-100 p-3 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-xl shrink-0">🎓</div>
                    <div className="text-left">
                      <span className="block text-[9px] font-bold text-indigo-800 uppercase tracking-wider leading-none">Experience</span>
                      <span className="text-sm font-black text-indigo-700">{selectedCoach.experience}</span>
                    </div>
                  </div>

                  <div className="bg-emerald-50/40 border border-emerald-100 p-3 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-xl shrink-0">🛡️</div>
                    <div className="text-left">
                      <span className="block text-[9px] font-bold text-emerald-800 uppercase tracking-wider leading-none">Certification Status</span>
                      <span className="text-sm font-black text-emerald-700">SAI Certified / Elite License</span>
                    </div>
                  </div>
                </div>

                {/* Bio / Speach box */}
                <div className="pt-2">
                  <span className="block text-[10px] font-black text-primary uppercase tracking-wider mb-1.5">Coach Bio & Training Philosophy</span>
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl relative overflow-hidden">
                    <span className="absolute -right-2 -bottom-4 text-primary/[0.04] text-8xl font-black italic select-none">RLS</span>
                    <p className="text-xs text-text-body leading-relaxed font-semibold italic relative z-10">
                      "{selectedCoach.bio}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3.5 border-t border-border-gray/50 flex justify-end">
                <button
                  onClick={() => setSelectedCoach(null)}
                  className="px-6 py-2.5 bg-primary hover:bg-accent hover:text-primary text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md uppercase tracking-wider"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
