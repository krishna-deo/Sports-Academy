import React from 'react';
import { sportsList } from '../data/sportsData';

interface ProgramsProps {
  sub: string;
}

export const Programs: React.FC<ProgramsProps> = () => {
  return (
    <section className="py-20 px-5 max-w-[1380px] mx-auto animate-fade-in">
      <div className="text-center max-w-[700px] mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent">
          Our Sports Roster
        </h2>
        <p className="text-text-light text-base md:text-lg">
          RLBSA provides coaching in Football, Handball, Rugby, and Athletics with a focus on holistic development.
        </p>
      </div>

      {/* Sports Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sportsList.map((sport, idx) => (
          <div 
            key={idx} 
            className="bg-white border border-border-gray rounded-xl p-8 hover:border-transparent hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
          >
            <div className="text-4.5xl mb-5">{sport.icon}</div>
            <span className="inline-block bg-accent/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded mb-3 self-start">
              {sport.age}
            </span>
            <h3 className="text-lg font-bold text-primary mb-3">{sport.name}</h3>
            <p className="text-text-light text-xs leading-relaxed">
              {sport.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
