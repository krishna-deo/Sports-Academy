import React from 'react';
import { 
  FacebookLogo, 
  InstagramLogo, 
  TwitterLogo, 
  YoutubeLogo, 
  PaperPlaneRight,
  Phone,
  Envelope,
  Lock
} from '@phosphor-icons/react';

export const Footer: React.FC = () => {
  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Thank you for subscribing! Keep an eye on your inbox.');
    e.currentTarget.reset();
  };

  return (
    <footer className="bg-primary text-white pt-20 font-main">
      <div className="max-w-[1380px] mx-auto px-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
        
        {/* Footer Brand Column */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight text-white leading-none">
              RANILAXMIBAI SPORTS
            </span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            Ranilaxmibai Sports Academy is dedicated to discovering and nurturing grassroots sports talent. Inspired by standard-setting athletic facilities and high-performance programs, we shape national and international champions.
          </p>
          <div className="flex gap-3">
            <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/10 hover:bg-accent hover:text-primary flex items-center justify-center text-lg hover:-translate-y-1 transition-all"><FacebookLogo size={18} /></a>
            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/10 hover:bg-accent hover:text-primary flex items-center justify-center text-lg hover:-translate-y-1 transition-all"><InstagramLogo size={18} /></a>
            <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full bg-white/10 hover:bg-accent hover:text-primary flex items-center justify-center text-lg hover:-translate-y-1 transition-all"><TwitterLogo size={18} /></a>
            <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-full bg-white/10 hover:bg-accent hover:text-primary flex items-center justify-center text-lg hover:-translate-y-1 transition-all"><YoutubeLogo size={18} /></a>
            <a href="#/admin" aria-label="Admin Portal" className="w-9 h-9 rounded-full bg-white/10 hover:bg-accent hover:text-primary flex items-center justify-center text-lg hover:-translate-y-1 transition-all" title="Admin Portal"><Lock size={18} /></a>
          </div>
        </div>

        {/* Footer Links: Quick Explore */}
        <div>
          <h3 className="text-lg font-bold text-white mb-6 relative pb-2.5 after:absolute after:bottom-0 after:left-0 after:w-9 after:h-0.5 after:bg-accent">
            Quick Links
          </h3>
          <ul className="list-none flex flex-col gap-3 text-sm">
            <li><a href="#/" className="text-white/70 hover:text-accent hover:pl-1.5 transition-all">Home</a></li>
            <li><a href="#/about/story" className="text-white/70 hover:text-accent hover:pl-1.5 transition-all">Our Story</a></li>
            <li><a href="#/about/facilities" className="text-white/70 hover:text-accent hover:pl-1.5 transition-all">Facilities & Grounds</a></li>
            <li><a href="#/academy/coaches" className="text-white/70 hover:text-accent hover:pl-1.5 transition-all">Meet the Coaches</a></li>
            <li><a href="#/academy/success-stories" className="text-white/70 hover:text-accent hover:pl-1.5 transition-all">Success Stories</a></li>
            <li><a href="#/academy/faqs" className="text-white/70 hover:text-accent hover:pl-1.5 transition-all">Academy FAQs</a></li>
          </ul>
        </div>

        {/* Footer Links: Programs */}
        <div>
          <h3 className="text-lg font-bold text-white mb-6 relative pb-2.5 after:absolute after:bottom-0 after:left-0 after:w-9 after:h-0.5 after:bg-accent">
            Programs
          </h3>
          <ul className="list-none flex flex-col gap-3 text-sm">
            <li><a href="#/programs/all" className="text-white/70 hover:text-accent hover:pl-1.5 transition-all">Football</a></li>
            <li><a href="#/programs/all" className="text-white/70 hover:text-accent hover:pl-1.5 transition-all">Handball</a></li>
            <li><a href="#/programs/all" className="text-white/70 hover:text-accent hover:pl-1.5 transition-all">Rugby</a></li>
            <li><a href="#/programs/all" className="text-white/70 hover:text-accent hover:pl-1.5 transition-all">Athletics</a></li>
            <li><a href="#/events/upcoming" className="text-white/70 hover:text-accent hover:pl-1.5 transition-all">Upcoming Tournaments</a></li>
          </ul>
        </div>

        {/* Footer Links: Newsletter & Contact */}
        <div className="flex flex-col gap-5">
          <h3 className="text-lg font-bold text-white relative pb-2.5 after:absolute after:bottom-0 after:left-0 after:w-9 after:h-0.5 after:bg-accent">
            Subscribe & Stay Updated
          </h3>
          <p className="text-white/70 text-sm leading-relaxed">
            Subscribe to our newsletter to receive tournament announcements, training guidelines, and nutrition advice.
          </p>
          <form className="flex border border-white/15 rounded-md overflow-hidden bg-white/5 focus-within:border-accent" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Your Email Address" 
              required 
              aria-label="Email address for newsletter"
              className="flex-1 bg-transparent border-none outline-none py-3 px-4 text-sm text-white placeholder-white/40 min-w-0"
            />
            <button 
              type="submit" 
              aria-label="Subscribe" 
              className="bg-accent text-primary px-5 hover:bg-white transition-all cursor-pointer flex items-center justify-center shrink-0"
            >
              <PaperPlaneRight size={16} />
            </button>
          </form>
          <div className="flex flex-col gap-2 text-sm font-semibold text-white/85">
            <p className="flex items-center gap-2"><Phone size={16} className="text-accent" /> +91 98765 43210</p>
            <p className="flex items-center gap-2"><Envelope size={16} className="text-accent" /> contact@rlbsports.in</p>
          </div>
        </div>

      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-[#002D2D] py-6 text-xs text-white/50">
        <div className="max-w-[1380px] mx-auto px-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; 2026 Ranilaxmibai Sports Academy. All Rights Reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-accent">Privacy Policy</a>
            <a href="#" className="hover:text-accent">Terms of Service</a>
            <a href="#" className="hover:text-accent">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
