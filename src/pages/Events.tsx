import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  CheckCircle, 
  Printer, 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  WarningCircle, 
  ArrowUUpLeft 
} from '@phosphor-icons/react';

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

// ----------------------------------------------------
// PUBLIC EVENTS FEED AND LISTING PAGE
// ----------------------------------------------------
export const Events: React.FC<EventsProps> = ({ sub }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination State for All Events
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Registration states
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    age: '',
    email: '',
    phone: '',
    event: '',
    notes: ''
  });
  const [confirmedTicket, setConfirmedTicket] = useState<any | null>(null);

  // Fetch events based on route prop
  const fetchEventsData = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = 'http://localhost:5000/api/public/events';
      if (sub === 'upcoming') {
        url = 'http://localhost:5000/api/public/events/upcoming';
      } else if (sub === 'tournaments') {
        url = 'http://localhost:5000/api/public/events/tournaments';
      } else if (sub === 'camps-workshops') {
        url = 'http://localhost:5000/api/public/events/camps-workshops';
      } else if (sub === 'all') {
        url = `http://localhost:5000/api/public/events?page=${currentPage}&limit=9`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load events data from the server.");
      const data = await res.json();

      if (sub === 'all') {
        setEvents(data.events || []);
        setTotalPages(data.pages || 1);
      } else {
        setEvents(Array.isArray(data) ? data : []);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sub !== 'registration') {
      fetchEventsData();
    }
  }, [sub, currentPage]);

  // Handle Event registration submission
  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ticketCode = "RLB-" + Math.floor(100000 + Math.random() * 900000);
    
    let selectedName = formData.event;
    const match = events.find(evt => evt.id === formData.event || evt._id === formData.event);
    if (match) selectedName = match.title;

    setConfirmedTicket({
      code: ticketCode,
      eventName: selectedName,
      athleteName: formData.name,
      athleteAge: formData.age,
      phone: formData.phone,
      email: formData.email
    });
  };

  const getPageTitle = () => {
    switch (sub) {
      case 'upcoming': return 'Upcoming Events';
      case 'tournaments': return 'Tournaments & Matches';
      case 'camps-workshops': return 'Camps & Workshops';
      case 'registration': return 'Event & Camp Registration';
      default: return 'All Events & Activities';
    }
  };

  const getPageDescription = () => {
    switch (sub) {
      case 'upcoming': return 'Stay ahead with our upcoming tournaments, schedules, and active training sessions.';
      case 'tournaments': return 'Compete at the highest level. View current and scheduled tournament programs.';
      case 'camps-workshops': return 'Immersive coaching camps and specialized technique workshops led by certified directors.';
      case 'registration': return 'Secure your entry ticket for upcoming championship matches, clinics, and selections.';
      default: return 'Browse the full spectrum of events, training camps, and tournaments hosted by RLBSA Siwan.';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getStatusBadgeStyles = (status: string, startDateStr: string, endDateStr?: string) => {
    const now = new Date();
    const start = new Date(startDateStr);
    const end = endDateStr ? new Date(endDateStr) : new Date(start.getTime() + 24*60*60*1000);

    let calculatedStatus = status;
    if (status === 'Published') {
      if (start > now) calculatedStatus = 'Upcoming';
      else if (start <= now && end >= now) calculatedStatus = 'Ongoing';
      else calculatedStatus = 'Completed';
    }

    switch (calculatedStatus) {
      case 'Upcoming':
      case 'upcoming':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      case 'Ongoing':
      case 'open':
        return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'Completed':
      case 'closed':
        return 'bg-slate-100 text-slate-500 border border-slate-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-600 border border-rose-200';
      case 'Postponed':
        return 'bg-blue-50 text-blue-600 border border-blue-200';
      default:
        return 'bg-slate-50 text-slate-500';
    }
  };

  const getDisplayState = (status: string, startDateStr: string, endDateStr?: string) => {
    const now = new Date();
    const start = new Date(startDateStr);
    const end = endDateStr ? new Date(endDateStr) : new Date(start.getTime() + 24*60*60*1000);

    if (status === 'Cancelled') return 'Cancelled';
    if (status === 'Postponed') return 'Postponed';
    if (status === 'Archived') return 'Archived';

    if (start > now) return 'Upcoming';
    if (start <= now && end >= now) return 'Ongoing';
    return 'Completed';
  };

  if (sub === 'registration') {
    return (
      <section className="py-20 px-5 max-w-[1380px] mx-auto animate-fade-in text-left">
        <div className="text-center max-w-[700px] mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent">
            {getPageTitle()}
          </h2>
          <p className="text-text-light text-base md:text-lg">
            {getPageDescription()}
          </p>
        </div>

        <div className="max-w-[600px] mx-auto">
          {!confirmedTicket ? (
            <div className="bg-white p-8 md:p-10 rounded-xl border border-border-gray shadow-lg">
              <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary uppercase tracking-wider">Athlete Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Rohan Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full py-3 px-4 border border-border-gray rounded-xl bg-soft-light text-sm outline-none focus:border-primary focus:bg-white focus:ring-3 focus:ring-primary/8 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary uppercase tracking-wider">Athlete Age</label>
                  <input
                    type="number"
                    required
                    min="5"
                    max="30"
                    placeholder="E.g. 14"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full py-3 px-4 border border-border-gray rounded-xl bg-soft-light text-sm outline-none focus:border-primary focus:bg-white focus:ring-3 focus:ring-primary/8 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary uppercase tracking-wider">Guardian Email</label>
                  <input
                    type="email"
                    required
                    placeholder="guardian@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full py-3 px-4 border border-border-gray rounded-xl bg-soft-light text-sm outline-none focus:border-primary focus:bg-white focus:ring-3 focus:ring-primary/8 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary uppercase tracking-wider">Parent Phone Number</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    placeholder="10 Digit Mobile Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full py-3 px-4 border border-border-gray rounded-xl bg-soft-light text-sm outline-none focus:border-primary focus:bg-white focus:ring-3 focus:ring-primary/8 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white font-bold py-3.5 hover:bg-accent hover:text-primary transition-all rounded-xl cursor-pointer mt-2.5 border-none"
                >
                  SUBMIT REGISTRATION
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-accent rounded-xl p-8 shadow-lg print:shadow-none print:border-solid">
              <div className="text-center border-b border-border-gray pb-5 mb-6">
                <div className="font-extrabold text-primary text-lg tracking-tight">RANILAXMIBAI SPORTS ACADEMY</div>
                <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full mt-3">
                  <CheckCircle size={14} weight="fill" /> Slot Confirmed
                </span>
                <p className="text-xs text-text-light mt-2.5">
                  Booking Code: <strong className="text-primary font-bold">{confirmedTicket.code}</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <span className="block text-[10px] font-bold text-text-light uppercase tracking-wider">Selected Event</span>
                  <p className="text-sm font-bold text-primary mt-0.5">{confirmedTicket.eventName || "Coaching Session"}</p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-text-light uppercase tracking-wider">Athlete Name</span>
                  <p className="text-sm font-bold text-primary mt-0.5">{confirmedTicket.athleteName} (Age {confirmedTicket.athleteAge})</p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-text-light uppercase tracking-wider">Primary Phone</span>
                  <p className="text-sm font-bold text-primary mt-0.5">{confirmedTicket.phone}</p>
                </div>
                <div className="col-span-2">
                  <span className="block text-[10px] font-bold text-text-light uppercase tracking-wider">Guardian Email</span>
                  <p className="text-sm font-bold text-primary mt-0.5">{confirmedTicket.email}</p>
                </div>
              </div>

              <div className="border-t border-dashed border-border-gray mt-6 pt-5 text-center">
                <p className="text-[11px] text-text-light leading-relaxed">
                  Present this receipt code at admission desk. For queries contact academy support.
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
    <section className="py-16 px-5 max-w-[1380px] mx-auto animate-fade-in text-left">
      <div className="text-center max-w-[700px] mx-auto mb-12">
        <span className="text-[10px] font-black text-[#00a896] uppercase tracking-[0.2em] bg-[#e6f7f5] px-3.5 py-1.5 rounded-full inline-block mb-3.5">
          Academy Feed
        </span>
        <h2 className="text-3xl md:text-[42px] font-black text-[#082142] mb-4 leading-tight">
          {getPageTitle()}
        </h2>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed">
          {getPageDescription()}
        </p>
      </div>

      {loading ? (
        // Pulse Skeleton Loading States
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border border-slate-100 rounded-2xl p-5 bg-white space-y-4 animate-pulse">
              <div className="h-44 bg-slate-200 rounded-xl w-full"></div>
              <div className="h-5 bg-slate-200 rounded w-2/3"></div>
              <div className="h-3 bg-slate-200 rounded w-full"></div>
              <div className="h-3 bg-slate-200 rounded w-5/6"></div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-8 bg-slate-200 rounded-full w-24"></div>
                <div className="h-8 bg-slate-200 rounded-full w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-rose-50/50 rounded-2xl border border-rose-100 max-w-lg mx-auto">
          <WarningCircle size={40} className="text-rose-500 mx-auto mb-3" />
          <h4 className="font-bold text-primary text-sm mb-1">Failed to Load Content</h4>
          <p className="text-xs text-text-light mb-4">{error}</p>
          <button 
            onClick={fetchEventsData}
            className="px-4 py-2 bg-primary text-white font-semibold text-xs rounded-lg cursor-pointer"
          >
            Retry Fetching
          </button>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-100 max-w-lg mx-auto">
          <Calendar size={44} className="text-primary/40 mx-auto mb-3" />
          <p className="text-xs text-text-light font-bold">No active events found in this category at this time.</p>
        </div>
      ) : (
        <>
          {/* Card Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((evt) => {
              const coverUrl = evt.coverMedia 
                ? (evt.coverMedia.startsWith('http') || evt.coverMedia.startsWith('/images') || evt.coverMedia.startsWith('/uploads') ? evt.coverMedia : `http://localhost:5000${evt.coverMedia}`)
                : 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop';
              
              const calculatedStatus = getDisplayState(evt.status, evt.startDate, evt.endDate);

              return (
                <div 
                  key={evt._id} 
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Image and status badge overlay */}
                  <div className="h-48 overflow-hidden relative bg-soft-light flex-shrink-0">
                    <img 
                      src={coverUrl} 
                      alt={evt.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" 
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${getStatusBadgeStyles(evt.status, evt.startDate, evt.endDate)}`}>
                        {calculatedStatus}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 z-10">
                      <span className="text-[9px] font-extrabold uppercase bg-primary text-white px-2.5 py-1 rounded">
                        {evt.category}
                      </span>
                    </div>
                  </div>

                  {/* Card description details */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-base font-bold text-primary group-hover:text-accent transition-colors leading-snug line-clamp-1 mb-2">
                      {evt.title}
                    </h3>
                    
                    <p className="text-xs text-text-light line-clamp-2 leading-relaxed mb-4">
                      {evt.shortDescription}
                    </p>

                    <div className="mt-auto space-y-2 border-t border-slate-50 pt-4 text-xs font-medium text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-accent" />
                        <span>
                          {formatDate(evt.startDate)}
                          {evt.endDate && ` - ${formatDate(evt.endDate)}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-accent" />
                        <span className="line-clamp-1">{evt.location}</span>
                      </div>
                    </div>

                    <div className="mt-5 flex gap-2">
                      <a 
                        href={`#/events/${evt.slug}`}
                        className="flex-1 py-2 bg-primary hover:bg-[#00a896] text-white hover:text-white transition-all text-center rounded-lg text-xs font-bold"
                      >
                        View Details
                      </a>
                      {evt.registrationRequired && calculatedStatus === 'Upcoming' && (
                        <a 
                          href={`#/events/registration?event=${evt.id}`}
                          className="px-3.5 py-2 border border-border-gray hover:border-primary text-primary hover:bg-soft-light transition-all rounded-lg text-xs font-bold"
                        >
                          Register
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Strategy */}
          {sub === 'all' && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12 border-t border-slate-100 pt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="w-9 h-9 rounded-full border border-border-gray hover:border-primary text-primary flex items-center justify-center cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={16} />
              </button>
              <span className="text-xs font-bold text-primary">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="w-9 h-9 rounded-full border border-border-gray hover:border-primary text-primary flex items-center justify-center cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};


// ----------------------------------------------------
// DYNAMIC EVENT DETAIL PAGE COMPONENT
// ----------------------------------------------------
interface EventDetailProps {
  slug: string;
}

export const EventDetail: React.FC<EventDetailProps> = ({ slug }) => {
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:5000/api/public/events/${slug}`)
      .then(res => {
        if (!res.ok) {
          if (res.status === 403) throw new Error("Private or draft content access is restricted.");
          if (res.status === 404) throw new Error("The requested event details could not be found.");
          throw new Error("Failed to load details sheet.");
        }
        return res.json();
      })
      .then(data => setEvent(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
  };

  const getDisplayState = (status: string, startDateStr: string, endDateStr?: string) => {
    const now = new Date();
    const start = new Date(startDateStr);
    const end = endDateStr ? new Date(endDateStr) : new Date(start.getTime() + 24*60*60*1000);

    if (status === 'Cancelled') return 'Cancelled';
    if (status === 'Postponed') return 'Postponed';

    if (start > now) return 'Upcoming';
    if (start <= now && end >= now) return 'Ongoing';
    return 'Completed';
  };

  if (loading) {
    return (
      <div className="py-24 px-5 max-w-4xl mx-auto space-y-6 animate-pulse text-left">
        <div className="h-64 bg-slate-200 rounded-2xl w-full"></div>
        <div className="h-8 bg-slate-200 rounded w-1/2"></div>
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="space-y-2 pt-4">
          <div className="h-3 bg-slate-200 rounded w-full"></div>
          <div className="h-3 bg-slate-200 rounded w-full"></div>
          <div className="h-3 bg-slate-200 rounded w-4/5"></div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="py-24 px-5 max-w-md mx-auto text-center">
        <WarningCircle size={48} className="text-rose-500 mx-auto mb-4" />
        <h3 className="text-lg font-black text-primary mb-2">Details Retrieval Failed</h3>
        <p className="text-xs text-text-light leading-relaxed mb-6">{error || "Event detail not found."}</p>
        <a 
          href="#/events/all"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-[#00a896] text-white font-bold rounded-xl transition-all text-xs"
        >
          <ArrowUUpLeft size={16} /> Back to Events feed
        </a>
      </div>
    );
  }

  const coverUrl = event.coverMedia 
    ? (event.coverMedia.startsWith('http') || event.coverMedia.startsWith('/images') || event.coverMedia.startsWith('/uploads') ? event.coverMedia : `http://localhost:5000${event.coverMedia}`)
    : 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop';

  const calculatedStatus = getDisplayState(event.status, event.startDate, event.endDate);

  return (
    <article className="py-12 px-5 max-w-4xl mx-auto animate-fade-in text-left">
      {/* Return button */}
      <a 
        href="#/events/all"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary border-b border-border-gray hover:border-primary pb-1 mb-8"
      >
        <ArrowLeft size={14} /> Back to Events listing
      </a>

      {/* Cover image header banner */}
      <div className="h-[300px] md:h-[400px] w-full rounded-2xl overflow-hidden relative shadow-md bg-soft-light mb-8 border border-slate-100">
        <img 
          src={coverUrl} 
          alt={event.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/65 via-primary/10 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#00a896] px-3 py-1 rounded mb-2 inline-block">
              {event.category}
            </span>
            <h1 className="text-xl md:text-3xl font-black leading-tight text-white drop-shadow-md">
              {event.title}
            </h1>
          </div>
          <span className="bg-white/95 text-primary text-xs font-black uppercase px-4 py-1.5 rounded-full shrink-0 border border-slate-100 self-start md:self-auto">
            {calculatedStatus}
          </span>
        </div>
      </div>

      {/* Grid details block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left main content body */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-2.5">Brief Summary</h3>
            <p className="text-sm font-medium text-slate-600 leading-relaxed">
              {event.shortDescription}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-black text-primary border-b border-slate-100 pb-2">Full Program Description</h3>
            <div 
              className="text-sm text-slate-600 leading-relaxed font-medium space-y-4 overflow-hidden break-words"
              dangerouslySetInnerHTML={{ __html: event.content }}
            />
          </div>

          {/* Event Gallery */}
          {event.galleryMedia && event.galleryMedia.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="text-base font-black text-primary border-b border-slate-100 pb-2">Event Media Gallery</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {event.galleryMedia.map((url: string, index: number) => {
                  const mediaUrl = url.startsWith('http') || url.startsWith('/images') || url.startsWith('/uploads') ? url : `http://localhost:5000${url}`;
                  return (
                    <div 
                      key={index} 
                      className="h-28 rounded-xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer hover:scale-105 transition-all"
                    >
                      <img src={mediaUrl} alt={`gallery-${index}`} className="w-full h-full object-cover" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar quick check details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#e6f7f5] text-primary p-6 rounded-2xl border border-[#00a896]/20">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-[#00a896]/25 pb-2.5 mb-4">
              Timing & Location
            </h3>
            
            <div className="space-y-4 text-xs font-bold">
              <div className="flex gap-2">
                <Calendar size={18} className="text-[#00a896] shrink-0" />
                <div>
                  <p className="text-text-light font-medium uppercase text-[9px] leading-none mb-1">Date</p>
                  <p className="leading-tight">
                    {formatDate(event.startDate)}
                    {event.endDate && (
                      <span className="block mt-0.5 text-slate-600">
                        to {formatDate(event.endDate)}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {(event.startTime || event.time) && (
                <div className="flex gap-2">
                  <Clock size={18} className="text-[#00a896] shrink-0" />
                  <div>
                    <p className="text-text-light font-medium uppercase text-[9px] leading-none mb-1">Time</p>
                    <p className="leading-tight">
                      {event.startTime || event.time}
                      {event.endTime && ` - ${event.endTime}`}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <MapPin size={18} className="text-[#00a896] shrink-0" />
                <div>
                  <p className="text-text-light font-medium uppercase text-[9px] leading-none mb-1">Venue</p>
                  <p className="leading-tight">{event.location || event.venue}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration sidebar block */}
          {calculatedStatus === 'Upcoming' && (
            <div className="bg-[#082142] text-white p-6 rounded-2xl border border-primary/20">
              <h3 className="text-xs font-bold uppercase tracking-wider border-b border-white/10 pb-2.5 mb-4">
                Slot Registration
              </h3>
              {event.registrationRequired ? (
                <div>
                  <p className="text-xs opacity-75 leading-relaxed mb-5">
                    Official booking is required for this activity. Click register below to submit details and request entry credentials.
                  </p>
                  <a 
                    href={event.registrationUrl || `#/events/registration?event=${event.id}`}
                    className="block w-full py-2.5 bg-[#00a896] hover:bg-accent text-white hover:text-primary transition-all text-center rounded-xl text-xs font-bold"
                  >
                    Register Online Now
                  </a>
                </div>
              ) : (
                <div>
                  <p className="text-xs opacity-75 leading-relaxed">
                    This event is open for all general audiences. No prior booking required. Gate entry is free.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
