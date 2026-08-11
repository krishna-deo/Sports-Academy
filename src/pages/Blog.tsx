import React, { useState } from 'react';
import { User, Calendar, X } from '@phosphor-icons/react';
import { blogPosts } from '../data/sportsData';
import type { BlogPost } from '../data/sportsData';
import { SportSVG } from '../components/SportSVG';

interface BlogProps {
  category: string;
}

export const Blog: React.FC<BlogProps> = ({ category }) => {
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  const categories = [
    { name: 'Latest Articles', slug: 'latest' },
    { name: 'Training Tips', slug: 'training' },
    { name: 'Fitness Tips', slug: 'fitness' },
    { name: 'Nutrition & Diet', slug: 'nutrition' },
    { name: 'Success Stories', slug: 'stories' },
    { name: 'Announcements', slug: 'announcements' }
  ];

  const dbTags: Record<string, string> = {
    training: "training-tips",
    fitness: "fitness-tips",
    nutrition: "nutrition-diet",
    stories: "success-stories",
    announcements: "announcements"
  };

  const dbTag = dbTags[category];
  const filteredPosts = dbTag 
    ? blogPosts.filter(p => p.category === dbTag) 
    : blogPosts;

  return (
    <section className="py-20 px-5 max-w-[1240px] mx-auto animate-fade-in">
      <div className="text-center max-w-[700px] mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent">
          Ranilaxmibai Sports Blog
        </h2>
        <p className="text-text-light text-base md:text-lg">
          Sports science analysis, workouts, diet planners, and corporate announcements.
        </p>
      </div>

      {/* Categories Filters */}
      <div className="flex justify-center gap-2 mb-12 flex-wrap">
        {categories.map((cat, idx) => (
          <a
            key={idx}
            href={`#/blog/${cat.slug}`}
            className={`py-2.5 px-5 rounded-md font-semibold text-xs transition-all ${
              category === cat.slug
                ? 'bg-primary text-white'
                : 'bg-soft-light text-text-body hover:bg-primary hover:text-white'
            }`}
          >
            {cat.name}
          </a>
        ))}
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-border-gray overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300"
          >
            <div className="h-[200px] bg-primary flex items-center justify-center text-6xl border-b border-border-gray">
              <SportSVG sportType="blog" colorStart="#003C3C" colorEnd="#E0BC66" />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <span className="inline-block bg-primary/8 text-primary text-[9px] font-extrabold uppercase px-2 py-0.5 rounded mb-3 self-start tracking-wider">
                {post.category.replace('-', ' ')}
              </span>
              <h3 className="text-base md:text-lg font-bold text-primary mb-2.5 leading-snug">
                {post.title}
              </h3>
              <p className="text-text-light text-xs md:text-sm leading-relaxed mb-5 flex-1">
                {post.excerpt}
              </p>
              
              <div className="flex justify-between items-center text-xs font-semibold text-text-light border-t border-border-gray pt-4 mt-auto">
                <span>By {post.author.split('(')[0].trim()}</span>
                <button
                  onClick={() => setActiveArticle(post)}
                  className="bg-soft-light text-primary hover:bg-primary hover:text-white py-1.5 px-3.5 rounded text-[11px] font-bold cursor-pointer transition-all border-none outline-none"
                >
                  Read More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-20 text-text-light text-sm">
          <p>No blog posts found in this category.</p>
        </div>
      )}

      {/* Detailed Article Modal */}
      {activeArticle && (
        <div
          className="fixed inset-0 bg-primary/75 backdrop-blur-sm z-[200] flex items-center justify-center p-5 animate-fade-in"
          onClick={() => setActiveArticle(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-[750px] max-h-[85vh] overflow-y-auto relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-soft-light hover:bg-accent hover:text-primary text-primary flex items-center justify-center text-lg cursor-pointer border-none transition-all duration-200"
              onClick={() => setActiveArticle(null)}
              aria-label="Close article modal"
            >
              <X size={18} weight="bold" />
            </button>

            <div className="p-8 md:p-10 border-b border-border-gray text-left">
              <span className="inline-block bg-primary/8 text-primary text-[10px] font-extrabold uppercase px-2 py-0.5 rounded mb-3 tracking-wider">
                {activeArticle.category.replace('-', ' ')}
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-primary leading-tight mt-1">
                {activeArticle.title}
              </h2>
              <div className="flex gap-5 text-xs font-semibold text-text-light mt-4">
                <span className="flex items-center gap-1"><User size={14} /> By {activeArticle.author}</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> {activeArticle.date}</span>
              </div>
            </div>

            <div className="p-8 md:p-10 text-left text-sm md:text-base leading-relaxed text-text-body">
              <p className="mb-5">{activeArticle.content}</p>
              <p className="text-text-light text-xs md:text-sm mt-8 border-t border-border-gray pt-6">
                Ranilaxmibai Sports Academy encourages all enrolled students and parents to incorporate sports science principles into their daily habits. For personalized training or specific dietary mapping, consult our head coaches or book a session under the Personal Coaching Program.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
