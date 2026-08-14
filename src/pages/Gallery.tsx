import React, { useState, useEffect } from 'react';
import { Play, X } from '@phosphor-icons/react';
import { galleryItems as initialGallery } from '../data/sportsData';

interface GalleryProps {
  activeTag: string;
}

export const Gallery: React.FC<GalleryProps> = ({ activeTag }) => {
  const [lightboxItem, setLightboxItem] = useState<any | null>(null);
  const [gallery, setGallery] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    let mediaType = '';
    let category = '';

    if (activeTag === 'photos') {
      mediaType = 'image';
    } else if (activeTag === 'videos') {
      mediaType = 'video';
    } else if (activeTag === 'tournament') {
      category = 'Tournament';
    } else if (activeTag === 'events') {
      category = 'Academy Events';
    } else if (activeTag === 'student-achievements') {
      category = 'Student Achievements';
    } else if (activeTag === 'tour') {
      category = 'Facilities';
    } else if (activeTag === 'camp') {
      category = 'Summer Camp';
    } else if (activeTag === 'workshops') {
      category = 'Workshops';
    }

    const queryParams = new URLSearchParams({
      page: String(page),
      limit: '9', // 9 items per page
      mediaType,
      category
    });

    fetch(`http://localhost:5000/api/public/gallery?${queryParams}`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.items)) {
          setGallery(data.items);
          setTotalPages(data.totalPages || 1);
        } else {
          setGallery([]);
        }
      })
      .catch(err => {
        console.error("Failed to query public gallery:", err);
        // Fallback to local mock data
        const localFiltered = initialGallery.filter(item => {
          if (activeTag === 'photos') return item.mediaType === 'photo';
          if (activeTag === 'videos') return item.mediaType === 'video';
          return item.category === activeTag;
        });
        setGallery(localFiltered);
        setTotalPages(1);
      });
  }, [activeTag, page]);

  // Reset page when filter tag changes
  useEffect(() => {
    setPage(1);
  }, [activeTag]);

  const categories = [
    { name: 'Photos Only', slug: 'photos' },
    { name: 'Videos Only', slug: 'videos' },
    { name: 'Tournament Highlights', slug: 'tournament' },
    { name: 'Academy Events', slug: 'events' },
    { name: 'Student Achievements', slug: 'student-achievements' },
    { name: 'Facilities Tour', slug: 'tour' },
    { name: 'Summer Camp', slug: 'camp' },
    { name: 'Workshops', slug: 'workshops' }
  ];

  return (
    <section className="py-20 px-5 max-w-[1380px] mx-auto animate-fade-in text-left">
      <div className="text-center max-w-[700px] mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 relative inline-block pb-3.5 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-accent">
          Academy Media Gallery
        </h2>
        <p className="text-text-light text-base md:text-lg">
          Visual highlights of tournament wins, event launches, and daily training drills.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex justify-center gap-2 mb-12 flex-wrap">
        {categories.map((cat, idx) => (
          <a
            key={idx}
            href={`#/gallery/${cat.slug}`}
            className={`py-2.5 px-5 rounded-md font-semibold text-xs transition-all ${
              activeTag === cat.slug
                ? 'bg-primary text-white'
                : 'bg-soft-light text-text-body hover:bg-primary hover:text-white'
            }`}
          >
            {cat.name}
          </a>
        ))}
      </div>

      {/* Gallery Grid */}
      {gallery.length === 0 ? (
        <div className="text-center py-20 text-text-light text-sm">
          <p>No gallery files found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item, idx) => {
            const isMock = !item._id;
            // Get proper thumbnail and high-res source
            const thumbUrl = isMock ? `/src/assets/images/football_win.jpg` : `http://localhost:5000${item.thumbnail}`;
            
            return (
              <div
                key={idx}
                onClick={() => setLightboxItem(item)}
                className="relative rounded-xl overflow-hidden h-[260px] bg-primary shadow-md cursor-pointer group border border-border-gray/30"
              >
                <div className="absolute inset-0 z-0">
                  <img 
                    src={thumbUrl} 
                    alt={item.title} 
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-300"
                    onError={(e) => {
                      // Fallback image styling
                      e.currentTarget.src = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop";
                    }}
                  />
                </div>

                {/* Video Play Indicator */}
                {item.mediaType === 'video' && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center text-lg z-20 shadow-md group-hover:scale-115 group-hover:bg-white transition-all duration-300">
                    <Play size={18} weight="fill" className="ml-0.5" />
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent flex flex-col justify-end p-5 z-10 group-hover:from-primary/95 transition-all">
                  <span className="bg-accent text-primary text-[9px] font-extrabold uppercase px-2 py-0.5 rounded self-start mb-2.5 tracking-wider">
                    {item.mediaType}
                  </span>
                  <h4 className="text-white text-[15px] font-bold leading-snug group-hover:translate-x-1 transition-transform">
                    {item.title}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      )}

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

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div 
          className="fixed inset-0 bg-black/5 z-[200] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxItem(null)}
        >
          <div 
            className="relative flex flex-col items-center max-w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Media wrapper that tightly envelopes the media content to align the close button on its top-right */}
            <div className="relative max-w-full max-h-[90vh] rounded-lg overflow-hidden shadow-2xl">
              
              {/* Minimalist circular X close button at top-right of photo */}
              <button 
                className="absolute top-3 right-3 bg-black/60 hover:bg-black/85 text-white hover:text-accent rounded-full p-2 transition-all z-[250] cursor-pointer border border-white/10"
                onClick={() => setLightboxItem(null)}
                aria-label="Close lightbox"
              >
                <X size={18} weight="bold" />
              </button>

              {lightboxItem.mediaType === 'video' ? (
                /* Video Player */
                <video 
                  src={lightboxItem._id ? `http://localhost:5000${lightboxItem.optimizedFile?.path || lightboxItem.originalFile.path}` : `https://www.w3schools.com/html/mov_bbb.mp4`} 
                  className="max-w-full max-h-[90vh] object-contain block"
                  controls 
                  autoPlay
                />
              ) : (
                /* High-Res WebP Image */
                <img 
                  src={lightboxItem._id ? `http://localhost:5000${lightboxItem.optimizedFile?.path || lightboxItem.originalFile.path}` : `https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop`} 
                  alt={lightboxItem.title} 
                  className="max-w-full max-h-[90vh] object-contain block"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
