import React, { useState, useEffect, useRef } from 'react';
import { X, CaretLeft, CaretRight, ArrowLeft, Calendar, MapPin, ImageSquare, Funnel, CaretDown } from '@phosphor-icons/react';

interface GalleryProps {
  activeTag: string;
}

export const Gallery: React.FC<GalleryProps> = ({ activeTag }) => {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [events, setEvents] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync category slugs with slugs mapping
  const categoryMap: { [key: string]: string } = {
    'events': 'Events',
    'tournament': 'Tournaments',
    'training': 'Training',
    'student-achievements': 'Achievements',
    'workshops': 'Workshops',
    'celebrations': 'Celebrations',
  };

  useEffect(() => {
    setLoading(true);
    let category = '';
    
    if (activeTag !== 'all' && categoryMap[activeTag]) {
      category = categoryMap[activeTag];
    } else if (activeTag !== 'all' && activeTag !== 'photos' && activeTag !== 'videos') {
      // Direct string slug match fallback
      category = activeTag;
    }

    const queryParams = new URLSearchParams({
      page: String(page),
      limit: '8', // 8 events per page
      status: 'published'
    });

    if (activeTag === 'videos') {
      queryParams.append('mediaType', 'video');
    } else {
      if (category) {
        queryParams.append('category', category);
      }
    }

    fetch(`http://localhost:5000/api/public/gallery?${queryParams}`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.items)) {
          setEvents(data.items);
          setTotalPages(data.totalPages || 1);
        } else {
          setEvents([]);
        }
      })
      .catch(err => {
        console.error("Failed to query public gallery events:", err);
        setEvents([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeTag, page]);

  // Reset states when category tag changes
  useEffect(() => {
    setPage(1);
    setSelectedEvent(null);
    setLightboxIndex(null);
  }, [activeTag]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowLeft') {
        if (!selectedEvent?.photos) return;
        const len = selectedEvent.photos.length;
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + len) % len : null));
      } else if (e.key === 'ArrowRight') {
        if (!selectedEvent?.photos) return;
        const len = selectedEvent.photos.length;
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % len : null));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex, selectedEvent]);

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const categories = [
    { name: 'All Events', slug: 'all' },
    { name: 'Events', slug: 'events' },
    { name: 'Tournaments', slug: 'tournament' },
    { name: 'Training', slug: 'training' },
    { name: 'Achievements', slug: 'student-achievements' },
    { name: 'Workshops', slug: 'workshops' },
    { name: 'Celebrations', slug: 'celebrations' },
    { name: 'Videos', slug: 'videos' }
  ];

  // Handlers for lightbox slideshow
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null || !selectedEvent?.photos) return;
    const len = selectedEvent.photos.length;
    setLightboxIndex((lightboxIndex - 1 + len) % len);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null || !selectedEvent?.photos) return;
    const len = selectedEvent.photos.length;
    setLightboxIndex((lightboxIndex + 1) % len);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <>
      <section className="py-20 px-5 max-w-[1380px] mx-auto animate-fade-in text-left">
      
      {/* Dynamic Header & Filters */}
      {!selectedEvent && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border-gray/50 pb-6">
          <div className="text-left max-w-[700px]">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-3 relative inline-block pb-2 after:absolute after:bottom-0 after:left-0 after:w-[60px] after:h-[3px] after:bg-accent">
              Academy Media Gallery
            </h2>
            <p className="text-text-light text-sm md:text-base">
              Explore memorable moments, events, achievements, training sessions, and tournaments.
            </p>
          </div>
          
          {/* Top Right Filters */}
          <div className="flex items-center gap-3 self-start md:self-auto flex-wrap sm:flex-nowrap">
            {/* "All Events" button */}
            <a
              href="#/gallery/all"
              className={`py-2.5 px-5 rounded-lg font-bold text-xs transition-all tracking-wide shadow-sm flex items-center justify-center cursor-pointer border ${
                activeTag === 'all'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-text-body border-border-gray hover:bg-soft-light'
              }`}
            >
              All Events
            </a>

            {/* Custom Dropdown Filter */}
            {(() => {
              const activeCategory = categories.find(cat => cat.slug === activeTag);
              const dropdownLabel = activeCategory && activeTag !== 'all' ? activeCategory.name : 'Filter by Category';
              return (
                <div className="relative inline-block text-left" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`py-2.5 px-4 font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all border ${
                      activeTag !== 'all'
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-text-body border-border-gray hover:bg-soft-light'
                    }`}
                  >
                    <Funnel size={14} weight={activeTag !== 'all' ? 'fill' : 'bold'} />
                    {dropdownLabel}
                    <CaretDown size={12} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-border-gray/70 rounded-xl shadow-xl z-30 py-2 animate-scale-up origin-top-right">
                      {categories.filter(cat => cat.slug !== 'all').map((cat, idx) => (
                        <a
                          key={idx}
                          href={`#/gallery/${cat.slug}`}
                          onClick={() => setIsDropdownOpen(false)}
                          className={`flex items-center px-4 py-2.5 text-xs font-semibold transition-all ${
                            activeTag === cat.slug
                              ? 'bg-soft-light text-primary border-l-4 border-accent'
                              : 'text-text-body hover:bg-soft-light hover:text-primary border-l-4 border-transparent'
                          }`}
                        >
                          {cat.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {selectedEvent && (
        <div className="mb-10">
          <button 
            onClick={() => setSelectedEvent(null)}
            className="flex items-center gap-2 text-primary hover:text-accent font-bold text-xs uppercase cursor-pointer border-none bg-transparent mb-6 transition-all"
          >
            <ArrowLeft size={16} weight="bold" /> Back to Gallery
          </button>
          
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-border-gray/50 shadow-sm text-left space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-primary text-accent text-[9px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                {selectedEvent.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-text-light font-bold">
                <Calendar size={15} />
                {formatDate(selectedEvent.date)}
              </div>
              {selectedEvent.location && (
                <div className="flex items-center gap-1.5 text-xs text-text-light font-bold">
                  <MapPin size={15} />
                  {selectedEvent.location}
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs text-text-light font-bold">
                {selectedEvent.mediaType === 'video' ? (
                  <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[9px] uppercase tracking-wider font-extrabold">
                    Video Event
                  </span>
                ) : (
                  <>
                    <ImageSquare size={15} />
                    {selectedEvent.photos?.length || 0} Photos
                  </>
                )}
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-primary leading-tight">
              {selectedEvent.name}
            </h2>

            {selectedEvent.description && (
              <p className="text-text-body text-sm max-w-3xl leading-relaxed">
                {selectedEvent.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-4 border-accent border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-light text-xs font-semibold">Loading media gallery...</p>
        </div>
      ) : !selectedEvent ? (
        /* Render Events Grid List */
        events.length === 0 ? (
          <div className="text-center py-20 text-text-light text-sm border border-dashed border-border-gray rounded-xl">
            <p>No events found in this category.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map((event) => {
                const coverUrl = event.coverImage 
                  ? (event.coverImage.startsWith('http') ? event.coverImage : `http://localhost:5000${event.coverImage}`) 
                  : "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop";
                
                return (
                  <div 
                    key={event._id}
                    onClick={() => setSelectedEvent(event)}
                    className="flex flex-col bg-white border border-border-gray/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group text-left"
                  >
                    {/* Cover image wrap */}
                    <div className="h-[200px] overflow-hidden relative bg-primary">
                      <img 
                        src={coverUrl} 
                        alt={event.name}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop";
                        }}
                      />
                      
                      {event.mediaType === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/15 transition-all">
                          <div className="w-12 h-12 rounded-full bg-accent/90 text-primary flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                            <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      )}

                      <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[8px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider">
                        {event.category}
                      </span>
                    </div>
 
                    {/* Meta information */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-[15px] text-primary group-hover:text-accent leading-snug line-clamp-2 transition-colors">
                          {event.name}
                        </h4>
                        {event.description && (
                          <p className="text-[11px] text-text-light line-clamp-2 leading-relaxed">
                            {event.description}
                          </p>
                        )}
                      </div>
 
                      <div className="flex items-center justify-between pt-3 border-t border-border-gray/50 text-[10px] text-text-light font-bold">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} /> {formatDate(event.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          {event.mediaType === 'video' ? (
                            <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[8px] uppercase tracking-wider font-extrabold flex items-center gap-1">
                              🎥 Video
                            </span>
                          ) : (
                            <>
                              <ImageSquare size={13} /> {event.photos?.length || 0} Photos
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-12">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 border border-border-gray rounded bg-white text-xs font-bold text-primary hover:bg-soft-light transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-xs font-semibold text-text-light">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 border border-border-gray rounded bg-white text-xs font-bold text-primary hover:bg-soft-light transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )
      ) : (
        /* Render Detailed Event Gallery Content */
        selectedEvent.mediaType === 'video' ? (
          <div className="max-w-4xl mx-auto bg-black rounded-2xl overflow-hidden shadow-2xl border border-border-gray/30 aspect-video animate-scale-up">
            {(() => {
              const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
              const match = selectedEvent.videoUrl ? selectedEvent.videoUrl.match(regExp) : null;
              const youtubeId = (match && match[2].length === 11) ? match[2] : '';
              
              if (!youtubeId) {
                return (
                  <div className="flex flex-col items-center justify-center h-full text-white p-5">
                    <p className="text-sm font-semibold">Invalid YouTube link.</p>
                  </div>
                );
              }
              
              return (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                  title={selectedEvent.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              );
            })()}
          </div>
        ) : !selectedEvent.photos || selectedEvent.photos.length === 0 ? (
          <div className="text-center py-20 text-text-light text-sm border border-dashed border-border-gray rounded-xl">
            <p>No photos uploaded for this event.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {selectedEvent.photos.map((photo: any, index: number) => {
              const photoUrl = `http://localhost:5000${photo.path}`;
              
              return (
                <div 
                  key={index}
                  onClick={() => setLightboxIndex(index)}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow group bg-soft-light border border-border-gray/30"
                >
                  <img 
                    src={photoUrl} 
                    alt={`Event photo ${index + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-all duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all"></div>
                </div>
              );
            })}
          </div>
        )
      )}
      </section>

      {/* Lightbox Slideshow Modal */}
      {lightboxIndex !== null && selectedEvent?.photos && (
        <div 
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl z-[999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close button */}
          <button 
            className="absolute top-6 right-6 bg-white/10 hover:bg-red-500 hover:text-white text-white rounded-full p-3 transition-all duration-300 z-[1000] cursor-pointer border border-white/15 shadow-lg hover:scale-110 active:scale-95 outline-none"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close lightbox"
          >
            <X size={20} weight="bold" />
          </button>

          {/* Left Arrow */}
          <button 
            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 bg-white/5 md:bg-white/10 hover:bg-accent hover:text-primary text-white rounded-full p-2 md:p-3.5 transition-all duration-300 z-[1000] cursor-pointer border border-white/10 shadow-lg hover:scale-110 active:scale-95 outline-none"
            onClick={handlePrevImage}
            aria-label="Previous image"
          >
            <CaretLeft size={24} weight="bold" />
          </button>

          {/* Media Center content */}
          <div 
            className="relative flex flex-col items-center max-w-[90vw] max-h-[85vh] animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={`http://localhost:5000${selectedEvent.photos[lightboxIndex].path}`} 
              alt={`${selectedEvent.name} photo ${lightboxIndex + 1}`} 
              className="max-w-full max-h-[70vh] md:max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10 bg-black/40 block select-none"
            />
            
            {/* Elegant glassmorphic metadata bar */}
            <div className="mt-5 w-full max-w-[90vw] md:max-w-xl bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-xl flex items-center justify-between gap-4 text-white shadow-xl">
              <div className="flex flex-col text-left min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-accent font-extrabold">
                  {selectedEvent.category} • {formatDate(selectedEvent.date)}
                </span>
                <h4 className="text-sm font-extrabold truncate mt-0.5 text-white/95">
                  {selectedEvent.name}
                </h4>
              </div>
              <span className="text-[11px] font-bold bg-white/10 px-3.5 py-1.5 rounded-full border border-white/5 shrink-0 text-white/90">
                {lightboxIndex + 1} / {selectedEvent.photos.length}
              </span>
            </div>
          </div>

          {/* Right Arrow */}
          <button 
            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 bg-white/5 md:bg-white/10 hover:bg-accent hover:text-primary text-white rounded-full p-2 md:p-3.5 transition-all duration-300 z-[1000] cursor-pointer border border-white/10 shadow-lg hover:scale-110 active:scale-95 outline-none"
            onClick={handleNextImage}
            aria-label="Next image"
          >
            <CaretRight size={24} weight="bold" />
          </button>
        </div>
      )}
    </>
  );
};
