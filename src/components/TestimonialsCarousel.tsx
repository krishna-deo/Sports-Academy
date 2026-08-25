import React, { useState, useEffect } from 'react';
import { successStories as initialSuccessStories } from '../data/sportsData';

export const TestimonialsCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stories, setStories] = useState<any[]>(initialSuccessStories);

  useEffect(() => {
    fetch('http://localhost:5000/api/public/success-stories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setStories(data);
        }
      })
      .catch(err => console.error("Error loading success stories:", err));
  }, []);

  return (
    <div className="relative max-w-[800px] mx-auto">
      {/* Slides */}
      {stories.map((story, idx) => (
        <div 
          key={idx} 
          className={`text-center transition-opacity duration-500 ease-in-out ${
            idx === activeIndex ? 'block animate-fade-in' : 'hidden'
          }`}
        >
          <p className="text-lg md:text-xl italic text-primary font-medium leading-relaxed mb-8">
            "{story.quote}"
          </p>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-accent text-primary flex items-center justify-center text-xl font-bold shadow-md">
              {story.name.charAt(0)}
            </div>
            <span className="font-bold text-lg text-primary">{story.name}</span>
            <span className="text-xs font-semibold text-text-light uppercase tracking-wider">
              {story.sport} &bull; {story.achievement}
            </span>
          </div>
        </div>
      ))}

      {/* Dots navigation */}
      <div className="flex justify-center gap-2 mt-8">
        {stories.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
              idx === activeIndex ? 'bg-accent w-6' : 'bg-border-gray w-2.5 hover:bg-text-light'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
