import React, { useState, useEffect } from 'react';
import {
  CaretDown,
  List,
  X
} from '@phosphor-icons/react';
import { useHash } from '../hooks/useHash';

export const Header: React.FC = () => {
  const hash = useHash();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  // Close drawer when hash changes
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [hash]);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const toggleAccordion = (name: string) => {
    setActiveAccordion(activeAccordion === name ? null : name);
  };

  const isActive = (href: string) => {
    if (href === '#/') {
      return hash === '#/' || hash === '#/home';
    }
    const prefix = href.split('/')[1]; // e.g. 'about'
    if (prefix && hash.startsWith(`#/${prefix}`)) {
      return true;
    }
    return hash === href;
  };

  // Nav Items configuration
  const navItems = [
    { label: '🏠 Home', href: '#/' },
    {
      label: '👤 About Us',
      href: '#/about/story',
      dropdown: [
        { label: 'Our Story', href: '#/about/story' },
        { label: 'Vision & Mission', href: '#/about/vision-mission' },
        { label: 'What We Do', href: '#/about/what-we-do' },
        { label: 'Facilities', href: '#/about/facilities' },
        { label: 'Achievements', href: '#/about/achievements' },
        { label: 'Founders & Key Members', href: '#/about/founders' },
      ],
    },
    {
      label: '🏫 Academy',
      href: '#/academy/coaches',
      dropdown: [
        { label: 'Sports Programs', href: '#/programs/all' },
        { label: 'Coaches', href: '#/academy/coaches' },
        { label: 'Students', href: '#/academy/students' },
        { label: 'Featured Players', href: '#/academy/featured-players' },
        { label: 'Success Stories', href: '#/academy/success-stories' },
        { label: 'Certifications', href: '#/academy/certifications' },
        { label: 'FAQs', href: '#/academy/faqs' },
      ],
    },
    {
      label: '🖼️ Gallery',
      href: '#/gallery/photos',
      dropdown: [
        { label: 'Photos', href: '#/gallery/photos' },
        { label: 'Videos', href: '#/gallery/videos' },
        { label: 'Tournament Highlights', href: '#/gallery/tournament' },
        { label: 'Academy Events', href: '#/gallery/events' },
        { label: 'Student Achievements', href: '#/gallery/student-achievements' },
        { label: 'Facilities Tour', href: '#/gallery/tour' },
        { label: 'Media Coverage', href: '#/gallery/media' },
      ],
    },
    { label: '📞 Contact Us', href: '#/contact' },
  ];

  return (
    <>

      {/* Header Navigation */}
      <header className="bg-white sticky top-0 z-50 shadow-sm transition-all duration-300">
        <div className="max-w-[1240px] mx-auto px-5 flex justify-between items-center h-20">

          {/* Brand Logo */}
          <a href="#/" className="flex items-center gap-3.5 mr-4 group">
            {/* Direct Circular Logo (Simple, transparent and clean, no border/shadow) */}
            <img
              src="/images/logo.png"
              alt="RLBSA Foundation Logo"
              className="h-11 md:h-[50px] w-auto object-contain flex-shrink-0"
            />

            {/* Elegant Vertical Divider */}
            <div className="h-10 w-[1px] bg-slate-300 hidden sm:block"></div>

            {/* Typography Lockup matching the shared image exactly */}
            <div className="flex flex-col justify-center text-left hidden sm:flex">
              <span
                className="text-2xl md:text-[25px] font-black text-[#082142] leading-none transition-colors duration-300"
                style={{ letterSpacing: '0.70em', marginRight: '-0.12em' }}
              >
                RLBSA
              </span>
              <span
                className="text-[9.5px] md:text-[10px] font-black text-[#00a896] leading-none mt-1"
                style={{ letterSpacing: '0.90em', marginRight: '-0.34em' }}
              >
                FOUNDATION
              </span>
              <div className="text-[6.5px] md:text-[7.5px] font-extrabold text-[#082142]/80 tracking-[0.05em] leading-none mt-1.5 whitespace-nowrap text-left">
                — EMPOWER • ENCOURAGE • EXCEL —
              </div>
            </div>
          </a>

          {/* Desktop Navigation Menu */}
          <nav className="hidden xl:flex items-center h-full" aria-label="Main Navigation">
            <ul className="flex items-center h-full list-none">
              {navItems.map((item, idx) => (
                <li key={idx} className="relative group h-full flex items-center">
                  <a
                    href={item.href}
                    className={`text-[13px] font-semibold text-dark px-2 lg:px-3 h-full flex items-center gap-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[3px] after:bg-accent after:transition-all after:duration-300 hover:text-primary hover:after:w-full ${isActive(item.href) ? 'text-primary after:w-full' : ''
                      }`}
                  >
                    {item.label}
                    {item.dropdown && <CaretDown size={12} className="group-hover:rotate-180 transition-transform duration-200" />}
                  </a>

                  {item.dropdown && (
                    <ul className="absolute top-full left-0 bg-white min-width-[240px] shadow-xl border-t-3 border-accent rounded-b-md list-none py-2.5 z-50 transition-all duration-200 scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto">
                      {item.dropdown.map((sub, sIdx) => (
                        <li key={sIdx}>
                          <a
                            href={sub.href}
                            className="block px-5 py-2.5 text-[13px] font-medium text-text-body hover:bg-soft-light hover:text-primary border-l-3 border-transparent hover:border-accent hover:pl-6 transition-all duration-150 whitespace-nowrap"
                          >
                            {sub.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Header Action Button & Mobile Toggle */}
          <div className="flex items-center gap-4 ml-auto xl:ml-0">
            <a
              href="#/donate"
              className="bg-accent text-primary text-[13px] font-bold py-2 px-5 hover:bg-primary hover:text-white transition-all duration-200 whitespace-nowrap shrink-0 rounded"
              id="btn-donate"
            >
              DONATE NOW
            </a>

            <button
              className="xl:hidden bg-none border-none text-2xl text-primary cursor-pointer p-1"
              onClick={toggleDrawer}
              aria-label="Toggle Navigation Menu"
            >
              <List size={28} />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Drawer */}
      <div
        className={`fixed top-0 right-0 w-[300px] h-screen bg-white shadow-2xl z-[110] flex flex-col transition-all duration-300 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="p-5 border-b border-border-gray flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-[#003C3C] tracking-tight leading-none">
              RANILAXMIBAI
            </span>
            <span className="text-[9px] font-bold text-text-light tracking-[0.15em] leading-none mt-1">
              SPORTS ACADEMY
            </span>
          </div>
          <button className="text-2xl text-primary cursor-pointer p-1" onClick={toggleDrawer}>
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ul className="list-none py-2.5">
            {navItems.map((item, idx) => (
              <li key={idx} className="block">
                {!item.dropdown ? (
                  <a
                    href={item.href}
                    className={`block px-6 py-3 font-semibold text-[15px] text-dark border-b border-black/5 hover:text-primary ${isActive(item.href) ? 'text-primary bg-soft-light' : ''
                      }`}
                  >
                    {item.label}
                  </a>
                ) : (
                  <div>
                    <button
                      className="w-full text-left bg-none border-none px-6 py-3 font-semibold text-[15px] text-dark flex justify-between items-center border-b border-black/5 cursor-pointer hover:text-primary"
                      onClick={() => toggleAccordion(item.label)}
                    >
                      {item.label}
                      <CaretDown
                        size={14}
                        className={`transition-transform duration-200 ${activeAccordion === item.label ? 'rotate-180' : 'rotate-0'
                          }`}
                      />
                    </button>
                    <ul
                      className={`list-none bg-soft-light transition-all duration-300 overflow-hidden ${activeAccordion === item.label ? 'max-h-[500px] border-b border-black/5' : 'max-h-0'
                        }`}
                    >
                      {item.dropdown.map((sub, sIdx) => (
                        <li key={sIdx}>
                          <a
                            href={sub.href}
                            className="block px-10 py-2.5 text-[14px] font-medium text-text-body hover:text-primary"
                          >
                            {sub.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="p-5 text-center">
            <a
              href="#/donate"
              className="block w-full bg-accent text-primary font-bold py-3 px-5 hover:bg-primary hover:text-white transition-all duration-200 rounded-md"
            >
              DONATE NOW
            </a>
          </div>
        </div>
      </div>

      {/* Drawer Overlay */}
      <div
        className={`fixed top-0 left-0 w-screen h-screen bg-primary/40 backdrop-blur-sm z-[109] transition-all duration-300 ${isDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        onClick={toggleDrawer}
      ></div>
    </>
  );
};
