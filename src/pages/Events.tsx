import React, { useState, useEffect } from 'react';
import { Clock, MapPin, CheckCircle, Printer, ArrowLeft } from '@phosphor-icons/react';
import { eventsList as initialEvents } from '../data/sportsData';

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

  // Determine content lists based on subroutes
  let filteredEvents = eventsList;
  let pageTitle = "Upcoming Sports Events";

  if (sub === 'tournaments') {
    filteredEvents = eventsList.filter(e => e.category === 'tournaments');
    pageTitle = "Ranilaxmibai Tournaments Schedule";
  } else if (sub === 'camps') {
    filteredEvents = eventsList.filter(e => e.category === 'camps');
    pageTitle = "Summer & Winter Camps";
  } else if (sub === 'workshops') {
    filteredEvents = eventsList.filter(e => e.category === 'workshops');
    pageTitle = "Specialized Workshops & Clinics";
  }

  const formatEventDate = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'short' });
    return { day, month };
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
            <div className="bg-white p-8 md:p-10 rounded-xl border border-border-gray shadow-lg">
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
                    className="w-full py-3 px-4 border border-border-gray rounded bg-soft-light text-sm outline-none focus:border-primary focus:bg-white focus:ring-3 focus:ring-primary/8 transition-all"
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
                    className="w-full py-3 px-4 border border-border-gray rounded bg-soft-light text-sm outline-none focus:border-primary focus:bg-white focus:ring-3 focus:ring-primary/8 transition-all"
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
                    className="w-full py-3 px-4 border border-border-gray rounded bg-soft-light text-sm outline-none focus:border-primary focus:bg-white focus:ring-3 focus:ring-primary/8 transition-all"
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
                    className="w-full py-3 px-4 border border-border-gray rounded bg-soft-light text-sm outline-none focus:border-primary focus:bg-white focus:ring-3 focus:ring-primary/8 transition-all"
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
                    className="w-full py-3 px-4 border border-border-gray rounded bg-soft-light text-sm outline-none focus:border-primary focus:bg-white focus:ring-3 focus:ring-primary/8 transition-all"
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
                    className="w-full py-3 px-4 border border-border-gray rounded bg-soft-light text-sm outline-none focus:border-primary focus:bg-white focus:ring-3 focus:ring-primary/8 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white font-bold py-3.5 hover:bg-accent hover:text-primary transition-all rounded-md cursor-pointer mt-2.5"
                >
                  SUBMIT REGISTRATION
                </button>
              </form>
            </div>
          ) : (
            /* Ticket Receipt */
            <div className="bg-white border-2 border-dashed border-accent rounded-xl p-8 shadow-lg animate-fade-in print:shadow-none print:border-solid">
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
                  <p className="text-sm font-bold text-primary mt-0.5">Ranilaxmibai Main Complex, Vadodara</p>
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
                  className="bg-primary text-white font-bold py-2.5 px-6 hover:bg-accent hover:text-primary transition-all rounded-md cursor-pointer flex items-center gap-1.5 text-sm"
                >
                  <Printer size={18} /> Print Ticket
                </button>
                <a
                  href="#/events/upcoming"
                  className="border border-border-gray text-text-body font-bold py-2.5 px-6 hover:bg-soft-light transition-all rounded-md flex items-center gap-1.5 text-sm"
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
    <section className="py-20 px-5 max-w-[1380px] mx-auto animate-fade-in">
      <div className="text-center max-w-[700px] mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent">
          {pageTitle}
        </h2>
        <p className="text-text-light text-base md:text-lg">
          Participate in tournaments, get certified, and join clinics.
        </p>
      </div>

      <div className="max-w-[900px] mx-auto flex flex-col gap-6">
        {filteredEvents.map((evt, idx) => {
          const { day, month } = formatEventDate(evt.date);
          const isOpen = evt.status === 'open';

          return (
            <div
              key={idx}
              className="bg-white border border-border-gray rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              {/* Date Badge */}
              <div className="w-[90px] h-[90px] bg-primary border-b-[5px] border-b-accent text-white flex flex-col items-center justify-center rounded-lg shrink-0">
                <span className="text-3xl font-extrabold leading-none">{day}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider mt-1">{month}</span>
              </div>

              {/* Details */}
              <div className="flex-1 text-center md:text-left">
                <span 
                  className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded text-white mb-2.5 tracking-wider ${
                    isOpen ? 'bg-emerald-500' : 'bg-primary'
                  }`}
                >
                  {isOpen ? 'REGISTRATION OPEN' : 'UPCOMING'}
                </span>
                <h3 className="text-lg font-bold text-primary mb-2 leading-snug">{evt.title}</h3>
                
                <div className="flex justify-center md:justify-start gap-4 text-xs font-semibold text-text-light mb-3 flex-wrap">
                  <span className="flex items-center gap-1"><Clock size={14} className="text-accent" /> {evt.time}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} className="text-accent" /> {evt.venue}</span>
                </div>
                
                <p className="text-text-body text-xs md:text-sm leading-relaxed">
                  {evt.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="shrink-0 w-full md:w-auto">
                {isOpen ? (
                  <a
                    href="#/events/registration"
                    className="block w-full md:w-auto bg-primary text-white text-center font-bold py-2.5 px-6 hover:bg-accent hover:text-primary transition-all rounded-md text-sm"
                  >
                    Register
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full md:w-auto bg-border-gray text-text-light text-center font-bold py-2.5 px-6 rounded-md text-sm cursor-not-allowed opacity-60"
                  >
                    Closed
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="text-center py-20 text-text-light text-sm">
            <p>No active events matching this criteria at this time.</p>
          </div>
        )}
      </div>
    </section>
  );
};
