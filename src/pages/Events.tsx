import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Clock, 
  MapPin, 
  CheckCircle, 
  Printer, 
  ArrowLeft, 
  ArrowRight, 
  User, 
  X 
} from '@phosphor-icons/react';
import { eventsList as initialEvents, blogPosts } from '../data/sportsData';
import type { BlogPost } from '../data/sportsData';

interface EventsProps {
  sub: string;
}

interface RegistrationFormData {
  name: string;
  age: string;
  email: string;
  phone: string;
  event: string;
  notes: string;
}

export const Events: React.FC<EventsProps> = ({ sub }) => {
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'events' | 'blogs'>('all');
  const [viewingArticle, setViewingArticle] = useState<BlogPost | null>(null);

  // Fetch events from public backend API or fallback to mock data
  useEffect(() => {
    fetch('http://localhost:5000/api/public/events')
      .then(res => res.json())
      .then(data => setEventsList(data))
      .catch(err => {
        console.error(err);
        setEventsList(initialEvents);
      });
  }, []);

  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    age: '',
    email: '',
    phone: '',
    event: '',
    notes: ''
  });

  const [confirmedTicket, setConfirmedTicket] = useState<{
    code: string;
    eventName: string;
    athleteName: string;
    athleteAge: string;
    phone: string;
    email: string;
  } | null>(null);

  // Pre-fill event dropdown from hash query params if any
  useEffect(() => {
    if (sub === 'registration') {
      setConfirmedTicket(null); // Reset ticket on navigation
      const hashPart = window.location.hash;
      const queryIndex = hashPart.indexOf('?');
      if (queryIndex !== -1) {
        const queryStr = hashPart.substring(queryIndex + 1);
        const params = new URLSearchParams(queryStr);
        const programId = params.get('program');
        if (programId) {
          setFormData((prev) => ({ ...prev, event: `prog-${programId}` }));
        }
      } else {
        setFormData({
          name: '',
          age: '',
          email: '',
          phone: '',
          event: '',
          notes: ''
        });
      }
    }
  }, [sub, window.location.hash]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ticketCode = "RLB-" + Math.floor(100000 + Math.random() * 900000);
    
    // Find selected event display name
    let selectedName = formData.event;
    if (formData.event.startsWith('prog-')) {
      const progKey = formData.event.replace('prog-', '');
      if (progKey === 'football') selectedName = "Football Coaching";
      else if (progKey === 'handball') selectedName = "Handball Coaching";
      else if (progKey === 'rugby') selectedName = "Rugby Coaching";
      else if (progKey === 'athletics') selectedName = "Athletics Coaching";
    } else {
      const match = eventsList.find(evt => evt.id === formData.event);
      if (match) selectedName = match.title;
    }

    setConfirmedTicket({
      code: ticketCode,
      eventName: selectedName,
      athleteName: formData.name,
      athleteAge: formData.age,
      phone: formData.phone,
      email: formData.email
    });
  };

  const formatEventDate = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'short' });
    return { day, month };
  };

  // Build the combined list
  const typedEvents = eventsList.map(e => ({ ...e, feedType: 'event' }));
  const typedBlogs = blogPosts.map(b => ({ ...b, feedType: 'blog' }));

  // Interleave events and blogs for the "All" view to look dynamic
  const interleaveFeed = () => {
    const combined: any[] = [];
    const max = Math.max(typedEvents.length, typedBlogs.length);
    for (let i = 0; i < max; i++) {
      if (i < typedEvents.length) combined.push(typedEvents[i]);
      if (i < typedBlogs.length) combined.push(typedBlogs[i]);
    }
    return combined;
  };

  const getFilteredFeed = () => {
    if (activeTab === 'events') return typedEvents;
    if (activeTab === 'blogs') return typedBlogs;
    return interleaveFeed();
  };

  const feedItems = getFilteredFeed();

  // Helper to determine the decorative background text for each card
  const getDecorativeText = (item: any) => {
    if (item.feedType === 'blog') {
      if (item.category === 'nutrition') return 'FUEL';
      if (item.category === 'training') return 'MIND';
      return 'FOCUS';
    } else {
      if (item.category === 'tournaments') return 'GOAL';
      if (item.category === 'workshops') return 'DRILL';
      return 'CAMP';
    }
  };

  // Helper to assign Bento Grid styling tags based on array index
  const getBentoCardStyles = (index: number) => {
    const layouts = [
      // 0: Large soft teal card (2 columns)
      {
        container: 'lg:col-span-2 bg-[#e6f7f5] text-[#082142] border border-[#00a896]/20 p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[360px] group transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_30px_rgba(0,168,150,0.12)]',
        badge: 'bg-[#00a896] text-white',
        accentText: 'text-[#00a896]',
        button: 'bg-[#082142] text-white group-hover:bg-[#00a896]',
        decorColor: 'text-[#00a896]/5'
      },
      // 1: Solid Navy card (1 column)
      {
        container: 'bg-[#082142] text-white p-7 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[360px] group transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_30px_rgba(8,33,66,0.2)]',
        badge: 'bg-[#00a896] text-white',
        accentText: 'text-[#00a896]',
        button: 'bg-white text-[#082142] group-hover:bg-[#00a896] group-hover:text-white',
        decorColor: 'text-white/5'
      },
      // 2: Solid Active Teal card (1 column)
      {
        container: 'bg-[#00a896] text-white p-7 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[360px] group transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_30px_rgba(0,168,150,0.2)]',
        badge: 'bg-[#082142] text-white',
        accentText: 'text-[#082142] font-black',
        button: 'bg-white text-[#00a896] group-hover:bg-[#082142] group-hover:text-white',
        decorColor: 'text-white/5'
      },
      // 3: White card (1 column)
      {
        container: 'bg-white text-[#082142] border border-slate-100 shadow-sm p-7 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[360px] group transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_30px_rgba(8,33,66,0.08)]',
        badge: 'bg-[#082142]/10 text-[#082142]',
        accentText: 'text-[#00a896]',
        button: 'bg-[#082142] text-white group-hover:bg-[#00a896]',
        decorColor: 'text-slate-100'
      },
      // 4: Large Navy Card (2 columns)
      {
        container: 'lg:col-span-2 bg-[#082142] text-white p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[360px] group transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_30px_rgba(8,33,66,0.25)]',
        badge: 'bg-[#00a896] text-white',
        accentText: 'text-[#00a896]',
        button: 'bg-white text-[#082142] group-hover:bg-[#00a896] group-hover:text-white',
        decorColor: 'text-white/5'
      },
      // 5: White card (1 column)
      {
        container: 'bg-white text-[#082142] border border-slate-100 shadow-sm p-7 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[360px] group transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_30px_rgba(8,33,66,0.08)]',
        badge: 'bg-[#082142]/10 text-[#082142]',
        accentText: 'text-[#00a896]',
        button: 'bg-[#082142] text-white group-hover:bg-[#00a896]',
        decorColor: 'text-slate-100'
      }
    ];
    return layouts[index % layouts.length];
  };

  if (sub === 'registration') {
    return (
      <section className="py-20 px-5 max-w-[1380px] mx-auto animate-fade-in">
        <div className="text-center max-w-[700px] mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent">
            Event & Camp Registration
          </h2>
          <p className="text-text-light text-base md:text-lg">
            Confirm your slot for upcoming tournaments, workshops, or training cycles.
          </p>
        </div>

        <div className="max-w-[600px] mx-auto">
          {!confirmedTicket ? (
            /* Registration Form */
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-border-gray shadow-lg">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reg-name" className="text-xs font-bold text-primary uppercase tracking-wider">
                    Athlete Full Name
                  </label>
                  <input
                    type="text"
                    id="reg-name"
                    placeholder="E.g. Rohan Shah"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full py-3 px-4 border border-border-gray rounded-xl bg-soft-light text-sm outline-none focus:border-primary focus:bg-white focus:ring-3 focus:ring-primary/8 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reg-age" className="text-xs font-bold text-primary uppercase tracking-wider">
                    Athlete Age
                  </label>
                  <input
                    type="number"
                    id="reg-age"
                    placeholder="E.g. 14"
                    min="5"
                    max="25"
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full py-3 px-4 border border-border-gray rounded-xl bg-soft-light text-sm outline-none focus:border-primary focus:bg-white focus:ring-3 focus:ring-primary/8 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reg-email" className="text-xs font-bold text-primary uppercase tracking-wider">
                    Parent/Guardian Email
                  </label>
                  <input
                    type="email"
                    id="reg-email"
                    placeholder="guardian@email.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full py-3 px-4 border border-border-gray rounded-xl bg-soft-light text-sm outline-none focus:border-primary focus:bg-white focus:ring-3 focus:ring-primary/8 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reg-phone" className="text-xs font-bold text-primary uppercase tracking-wider">
                    Parent Phone Number
                  </label>
                  <input
                    type="tel"
                    id="reg-phone"
                    placeholder="10 Digit Mobile Number"
                    pattern="[0-9]{10}"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full py-3 px-4 border border-border-gray rounded-xl bg-soft-light text-sm outline-none focus:border-primary focus:bg-white focus:ring-3 focus:ring-primary/8 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reg-event" className="text-xs font-bold text-primary uppercase tracking-wider">
                    Select Program / Event
                  </label>
                  <select
                    id="reg-event"
                    required
                    value={formData.event}
                    onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                    className="w-full py-3 px-4 border border-border-gray rounded-xl bg-soft-light text-sm outline-none focus:border-primary focus:bg-white focus:ring-3 focus:ring-primary/8 transition-all"
                  >
                    <option value="" disabled>Choose from list...</option>
                     <optgroup label="Sports Disciplines">
                       <option value="prog-football">Football</option>
                       <option value="prog-handball">Handball</option>
                       <option value="prog-rugby">Rugby</option>
                       <option value="prog-athletics">Athletics</option>
                     </optgroup>
                    <optgroup label="Upcoming Camps & Events">
                      {eventsList.map((evt, idx) => (
                        <option key={idx} value={evt.id}>{evt.title}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reg-notes" className="text-xs font-bold text-primary uppercase tracking-wider">
                    Special Medical/Coaching Instructions
                  </label>
                  <textarea
                    id="reg-notes"
                    rows={3}
                    placeholder="E.g. allergies, previous sports training, or health concerns..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full py-3 px-4 border border-border-gray rounded-xl bg-soft-light text-sm outline-none focus:border-primary focus:bg-white focus:ring-3 focus:ring-primary/8 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white font-bold py-3.5 hover:bg-accent hover:text-primary transition-all rounded-xl cursor-pointer mt-2.5"
                >
                  SUBMIT REGISTRATION
                </button>
              </form>
            </div>
          ) : (
            /* Ticket Receipt */
            <div className="bg-white border-2 border-dashed border-accent rounded-3xl p-8 shadow-lg animate-fade-in print:shadow-none print:border-solid">
              <div className="text-center border-b border-border-gray pb-5 mb-6">
                <div className="font-extrabold text-primary text-lg tracking-tight">
                  RANILAXMIBAI SPORTS ACADEMY
                </div>
                <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full mt-3">
                  <CheckCircle size={14} weight="fill" /> Slot Confirmed
                </span>
                <p className="text-xs text-text-light mt-2.5">
                  Booking Code: <strong className="text-primary font-bold">{confirmedTicket.code}</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="col-span-2">
                  <span className="block text-[10px] font-bold text-text-light uppercase tracking-wider">
                    Selected Event / Program
                  </span>
                  <p className="text-sm font-bold text-primary mt-0.5">{confirmedTicket.eventName}</p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-text-light uppercase tracking-wider">
                    Athlete Name
                  </span>
                  <p className="text-sm font-bold text-primary mt-0.5">
                    {confirmedTicket.athleteName} (Age {confirmedTicket.athleteAge})
                  </p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-text-light uppercase tracking-wider">
                    Primary Phone
                  </span>
                  <p className="text-sm font-bold text-primary mt-0.5">{confirmedTicket.phone}</p>
                </div>
                <div className="col-span-2">
                  <span className="block text-[10px] font-bold text-text-light uppercase tracking-wider">
                    Guardian Email
                  </span>
                  <p className="text-sm font-bold text-primary mt-0.5">{confirmedTicket.email}</p>
                </div>
                <div className="col-span-2">
                  <span className="block text-[10px] font-bold text-text-light uppercase tracking-wider">
                    Gate Entry Venue
                  </span>
                  <p className="text-sm font-bold text-primary mt-0.5">RLBSA Campus, Laxmipur, Siwan, Bihar</p>
                </div>
              </div>

              <div className="border-t border-dashed border-border-gray mt-6 pt-5 text-center">
                {/* QR Code Barcode Mockup */}
                <svg width="120" height="120" className="mx-auto block bg-soft-light">
                  <rect width="120" height="120" fill="#F4F6F6" />
                  <rect x="10" y="10" width="30" height="30" fill="#003C3C" />
                  <rect x="15" y="15" width="20" height="20" fill="#F4F6F6" />
                  <rect x="18" y="18" width="14" height="14" fill="#003C3C" />
                  
                  <rect x="80" y="10" width="30" height="30" fill="#003C3C" />
                  <rect x="85" y="15" width="20" height="20" fill="#F4F6F6" />
                  <rect x="88" y="18" width="14" height="14" fill="#003C3C" />
 
                  <rect x="10" y="80" width="30" height="30" fill="#003C3C" />
                  <rect x="15" y="85" width="20" height="20" fill="#F4F6F6" />
                  <rect x="18" y="88" width="14" height="14" fill="#003C3C" />
 
                  <rect x="50" y="20" width="10" height="10" fill="#003C3C" />
                  <rect x="65" y="10" width="10" height="20" fill="#003C3C" />
                  <rect x="50" y="45" width="20" height="10" fill="#003C3C" />
                  <rect x="80" y="50" width="15" height="15" fill="#003C3C" />
                  <rect x="15" y="55" width="20" height="10" fill="#003C3C" />
                  <rect x="45" y="70" width="30" height="15" fill="#003C3C" />
                  <rect x="85" y="85" width="25" height="25" fill="#003C3C" />
                  <rect x="90" y="90" width="15" height="15" fill="#F4F6F6" />
                </svg>
                <p className="text-[11px] text-text-light mt-3 leading-relaxed">
                  Present this digital ticket at reception to complete fees structure and kit sizing.
                </p>
              </div>

              <div className="flex gap-4 justify-center mt-7 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="bg-primary text-white font-bold py-2.5 px-6 hover:bg-[#00a896] transition-all rounded-xl cursor-pointer flex items-center gap-1.5 text-sm border-none"
                >
                  <Printer size={18} /> Print Ticket
                </button>
                <a
                  href="#/events/all"
                  className="border border-border-gray text-text-body font-bold py-2.5 px-6 hover:bg-soft-light transition-all rounded-xl flex items-center gap-1.5 text-sm"
                >
                  <ArrowLeft size={18} /> Back to Events
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-5 max-w-[1380px] mx-auto animate-fade-in">
      
      {/* Title Header area */}
      <div className="text-center max-w-[700px] mx-auto mb-10">
        <span className="text-[10px] font-black text-[#00a896] uppercase tracking-[0.2em] bg-[#e6f7f5] px-3.5 py-1.5 rounded-full inline-block mb-3.5">
          Announcements & News
        </span>
        <h2 className="text-3xl md:text-[42px] font-black text-[#082142] mb-4 leading-tight">
          What's Happening At RLBSA
        </h2>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed">
          Stay updated with our latest local tournaments, specialized training camps, and wellness blogs written by our expert coaches.
        </p>
      </div>

      {/* Tabs and Filters */}
      <div className="flex justify-center items-center gap-2 md:gap-3 mb-10 border-b border-slate-100 pb-5 max-w-lg mx-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border-none cursor-pointer ${
            activeTab === 'all' 
              ? 'bg-[#082142] text-white shadow-md' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Feed
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border-none cursor-pointer ${
            activeTab === 'events' 
              ? 'bg-[#082142] text-white shadow-md' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Upcoming Events
        </button>
        <button
          onClick={() => setActiveTab('blogs')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border-none cursor-pointer ${
            activeTab === 'blogs' 
              ? 'bg-[#082142] text-white shadow-md' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Articles & Blogs
        </button>
      </div>

      {/* Bento Box Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedItems.map((item, idx) => {
          const styles = getBentoCardStyles(idx);
          const decorText = getDecorativeText(item);
          
          if (item.feedType === 'event') {
            const { day, month } = formatEventDate(item.date);
            const isOpen = item.status === 'open';
            
            return (
              <div key={`event-${item.id}-${idx}`} className={styles.container}>
                {/* Sports Outline Text Watermark */}
                <div className={`absolute -bottom-6 -right-6 text-[100px] font-black uppercase select-none tracking-tighter opacity-100 leading-none ${styles.decorColor}`}>
                  {decorText}
                </div>

                {/* Card Header Info */}
                <div className="z-10 text-left">
                  <div className="flex justify-between items-start gap-2.5">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${styles.badge}`}>
                      {item.category}
                    </span>
                    
                    {/* Date Badge */}
                    <div className="flex flex-col items-center leading-none text-right shrink-0">
                      <span className="text-xl font-black">{day}</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">{month}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-black leading-snug mt-4 max-w-[90%]">
                    {item.title}
                  </h3>
                  
                  <p className="text-xs font-semibold opacity-75 mt-2.5 leading-relaxed max-w-[95%]">
                    {item.description}
                  </p>
                </div>

                {/* Card Footer Info */}
                <div className="z-10 mt-8 flex items-end justify-between text-left">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold">
                      <Clock size={13} className={styles.accentText} />
                      <span>{item.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold">
                      <MapPin size={13} className={styles.accentText} />
                      <span>{item.venue}</span>
                    </div>
                  </div>

                  {/* Register Button */}
                  {isOpen ? (
                    <a
                      href={`#/events/registration?event=${item.id}`}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:translate-x-1 ${styles.button}`}
                    >
                      <ArrowRight size={18} weight="bold" />
                    </a>
                  ) : (
                    <span className="text-[10px] font-black tracking-widest uppercase opacity-40 px-2">
                      Closed
                    </span>
                  )}
                </div>
              </div>
            );
          } else {
            // It is a Blog Post item
            return (
              <div 
                key={`blog-${item.id}-${idx}`} 
                onClick={() => setViewingArticle(item)}
                className={`${styles.container} cursor-pointer`}
              >
                {/* Sports Outline Text Watermark */}
                <div className={`absolute -bottom-6 -right-6 text-[100px] font-black uppercase select-none tracking-tighter opacity-100 leading-none ${styles.decorColor}`}>
                  {decorText}
                </div>

                {/* Card Header Info */}
                <div className="z-10 text-left w-full">
                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${styles.badge}`}>
                      {item.category}
                    </span>
                    <span className="text-[9px] font-bold opacity-60">
                      {item.date}
                    </span>
                  </div>

                  <h3 className="text-lg font-black leading-snug mt-4">
                    {item.title}
                  </h3>
                  
                  <p className="text-xs font-semibold opacity-75 mt-2.5 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                {/* Card Footer Info */}
                <div className="z-10 mt-8 flex items-center justify-between w-full text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200/50 flex items-center justify-center border border-slate-300/20">
                      <User size={12} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold leading-none">{item.author}</p>
                      <p className="text-[8px] opacity-60 mt-0.5">Coach/Staff</p>
                    </div>
                  </div>

                  {/* Read Article Arrow Button */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:translate-x-1 ${styles.button}`}
                  >
                    <ArrowRight size={18} weight="bold" />
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>

      {feedItems.length === 0 && (
        <div className="text-center py-24 text-[#082142]/60 bg-slate-50 rounded-3xl border border-slate-100 mt-6 font-semibold">
          <p>No active events or articles matching this tab at this time.</p>
        </div>
      )}

      {/* ARTICLE READER MODAL (Portal to document.body) */}
      {viewingArticle && createPortal(
        <div 
          className="fixed inset-0 bg-[#082142]/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setViewingArticle(null)}
        >
          <div 
            className="bg-white text-[#082142] rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-scale-up text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Area */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div>
                <span className="text-[9px] font-black uppercase bg-[#e6f7f5] text-[#00a896] px-3 py-1 rounded-full">
                  {viewingArticle.category}
                </span>
                <span className="text-[10px] font-bold text-slate-500 ml-3">
                  Published on {viewingArticle.date}
                </span>
              </div>
              <button 
                onClick={() => setViewingArticle(null)} 
                className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors border-none cursor-pointer outline-none text-[#082142]"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-5">
              <h2 className="text-2xl md:text-3xl font-black leading-tight text-[#082142]">
                {viewingArticle.title}
              </h2>

              <div className="flex items-center gap-3 border-y border-slate-100 py-3">
                <div className="w-9 h-9 rounded-full bg-[#e6f7f5] text-[#00a896] flex items-center justify-center font-bold">
                  {viewingArticle.author.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-black">{viewingArticle.author}</p>
                  <p className="text-[10px] text-slate-500 font-bold">RLBSA Coaching & Wellness Contributor</p>
                </div>
              </div>

              <div className="text-sm text-slate-600 leading-relaxed font-medium space-y-4 pt-2">
                {viewingArticle.content.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Footer Area */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-between items-center shrink-0 rounded-b-3xl">
              <span className="text-[10px] font-black text-slate-500 tracking-wider">
                © RANILAXMIBAI SPORTS ACADEMY
              </span>
              <button 
                onClick={() => setViewingArticle(null)}
                className="px-5 py-2 bg-[#082142] hover:bg-[#00a896] text-white font-bold rounded-xl transition-colors border-none cursor-pointer text-xs"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};
