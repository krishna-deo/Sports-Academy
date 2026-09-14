import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  ArrowLeft, 
  ArrowRight, 
  FilePdf, 
  DownloadSimple, 
  WarningCircle, 
  Newspaper 
} from '@phosphor-icons/react';

// ----------------------------------------------------
// PUBLIC UPDATES FEED / LISTING PAGE
// ----------------------------------------------------
export const UpdatesList: React.FC = () => {
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtering & Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const categories = [
    'Academy News', 
    'Announcement', 
    'Achievement', 
    'Training Update', 
    'Admission Update', 
    'General Update'
  ];

  const fetchUpdates = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `http://localhost:5000/api/public/updates?page=${currentPage}&limit=9`;
      if (selectedCategory) {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load announcements feed.");
      const data = await res.json();
      setUpdates(data.updates || []);
      setTotalPages(data.pages || 1);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, [currentPage, selectedCategory]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <section className="py-16 px-5 max-w-[1380px] mx-auto animate-fade-in text-left">
      <div className="text-center max-w-[700px] mx-auto mb-10">
        <span className="text-[10px] font-black text-[#00a896] uppercase tracking-[0.2em] bg-[#e6f7f5] px-3.5 py-1.5 rounded-full inline-block mb-3.5">
          Announcements & News
        </span>
        <h2 className="text-3xl md:text-[42px] font-black text-[#082142] mb-4 leading-tight">
          Academy Updates & News
        </h2>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed">
          Stay updated with direct admissions notifications, training schedule revisions, and achievements won by RLBSA students.
        </p>
      </div>

      {/* Category Pills Selector */}
      <div className="flex flex-wrap justify-center items-center gap-2 mb-10 border-b border-slate-100 pb-6 max-w-2xl mx-auto">
        <button
          onClick={() => { setSelectedCategory(''); setCurrentPage(1); }}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all border-none cursor-pointer ${
            selectedCategory === '' 
              ? 'bg-[#082142] text-white shadow-sm' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Updates
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border-none cursor-pointer ${
              selectedCategory === cat 
                ? 'bg-[#082142] text-white shadow-sm' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border border-slate-100 rounded-2xl p-5 bg-white space-y-4 animate-pulse">
              <div className="h-44 bg-slate-200 rounded-xl w-full"></div>
              <div className="h-5 bg-slate-200 rounded w-2/3"></div>
              <div className="h-3 bg-slate-200 rounded w-full"></div>
              <div className="h-3 bg-slate-200 rounded w-5/6"></div>
              <div className="h-8 bg-slate-200 rounded w-24 pt-2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-rose-50/50 rounded-2xl border border-rose-100 max-w-lg mx-auto">
          <WarningCircle size={40} className="text-rose-500 mx-auto mb-3" />
          <h4 className="font-bold text-primary text-sm mb-1">Failed to Load Content</h4>
          <p className="text-xs text-text-light mb-4">{error}</p>
          <button 
            onClick={fetchUpdates}
            className="px-4 py-2 bg-primary text-white font-semibold text-xs rounded-lg cursor-pointer"
          >
            Retry Fetching
          </button>
        </div>
      ) : updates.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-100 max-w-lg mx-auto">
          <Newspaper size={44} className="text-primary/40 mx-auto mb-3" />
          <p className="text-xs text-text-light font-bold">No announcements found matching this category at this time.</p>
        </div>
      ) : (
        <>
          {/* Card Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {updates.map((upd) => {
              const coverUrl = upd.coverMedia 
                ? (upd.coverMedia.startsWith('http') || upd.coverMedia.startsWith('/images') || upd.coverMedia.startsWith('/uploads') ? upd.coverMedia : `http://localhost:5000${upd.coverMedia}`)
                : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop';

              return (
                <div 
                  key={upd._id} 
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
                >
                  {upd.coverMedia && (
                    <div className="h-44 overflow-hidden relative bg-soft-light flex-shrink-0">
                      <img 
                        src={coverUrl} 
                        alt={upd.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" 
                      />
                      <div className="absolute top-4 left-4 z-10">
                        <span className="text-[9px] font-extrabold uppercase bg-[#00a896] text-white px-2.5 py-1 rounded">
                          {upd.category}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-grow">
                    {!upd.coverMedia && (
                      <span className="text-[9px] font-extrabold uppercase bg-[#e6f7f5] text-[#00a896] px-2.5 py-1 rounded w-fit mb-3">
                        {upd.category}
                      </span>
                    )}

                    <h3 className="text-base font-bold text-primary group-hover:text-accent transition-colors leading-snug line-clamp-2 mb-2">
                      {upd.title}
                    </h3>
                    
                    <p className="text-xs text-text-light line-clamp-3 leading-relaxed mb-4">
                      {upd.summary}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Calendar size={14} className="text-accent" />
                        <span>{formatDate(upd.publishedAt || upd.createdAt)}</span>
                      </div>
                      
                      <a 
                        href={`#/updates/${upd.slug}`}
                        className="text-xs font-bold text-primary hover:text-accent flex items-center gap-1.5"
                      >
                        Read More &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
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
// DYNAMIC UPDATE DETAIL PAGE COMPONENT
// ----------------------------------------------------
interface UpdateDetailProps {
  slug: string;
}

export const UpdateDetail: React.FC<UpdateDetailProps> = ({ slug }) => {
  const [update, setUpdate] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:5000/api/public/updates/${slug}`)
      .then(res => {
        if (!res.ok) {
          if (res.status === 403) throw new Error("Private or draft update access is restricted.");
          if (res.status === 404) throw new Error("The requested update details could not be found.");
          throw new Error("Failed to load details sheets.");
        }
        return res.json();
      })
      .then(data => setEventDetails(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  // Hack-ish way to avoid naming collisions with react hooks
  const setEventDetails = (val: any) => {
    setUpdate(val);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="py-24 px-5 max-w-3xl mx-auto space-y-6 animate-pulse text-left">
        <div className="h-60 bg-slate-200 rounded-2xl w-full"></div>
        <div className="h-8 bg-slate-200 rounded w-2/3"></div>
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="space-y-2 pt-4">
          <div className="h-3 bg-slate-200 rounded w-full"></div>
          <div className="h-3 bg-slate-200 rounded w-full"></div>
          <div className="h-3 bg-slate-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error || !update) {
    return (
      <div className="py-24 px-5 max-w-md mx-auto text-center">
        <WarningCircle size={48} className="text-rose-500 mx-auto mb-4" />
        <h3 className="text-lg font-black text-primary mb-2">Content Retrieval Failed</h3>
        <p className="text-xs text-text-light leading-relaxed mb-6">{error || "Update detail not found."}</p>
        <a 
          href="#/updates"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-[#00a896] text-white font-bold rounded-xl transition-all text-xs"
        >
          <ArrowLeft size={16} /> Back to Updates feed
        </a>
      </div>
    );
  }

  const coverUrl = update.coverMedia 
    ? (update.coverMedia.startsWith('http') || update.coverMedia.startsWith('/images') || update.coverMedia.startsWith('/uploads') ? update.coverMedia : `http://localhost:5000${update.coverMedia}`)
    : '';

  return (
    <article className="py-12 px-5 max-w-3xl mx-auto animate-fade-in text-left">
      <a 
        href="#/updates"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary border-b border-border-gray hover:border-primary pb-1 mb-8"
      >
        <ArrowLeft size={14} /> Back to Updates listing
      </a>

      {coverUrl && (
        <div className="h-[250px] sm:h-[350px] w-full rounded-2xl overflow-hidden relative shadow-sm bg-soft-light mb-8 border border-slate-100">
          <img 
            src={coverUrl} 
            alt={update.title} 
            className="w-full h-full object-cover" 
          />
        </div>
      )}

      {/* Header Info */}
      <header className="space-y-4 mb-8">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-[10px] font-black uppercase tracking-wider bg-[#e6f7f5] text-[#00a896] px-3.5 py-1.5 rounded-full">
            {update.category}
          </span>
          <time className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Calendar size={15} className="text-accent" />
            Published on {formatDate(update.publishedAt || update.createdAt)}
          </time>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-primary leading-tight">
          {update.title}
        </h1>

        <div className="bg-slate-50 border-l-4 border-accent p-4 text-sm font-medium text-slate-600 rounded-r-xl">
          {update.summary}
        </div>
      </header>

      {/* Content body */}
      <section 
        className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-4 font-medium border-t border-slate-100 pt-6 overflow-hidden break-words"
        dangerouslySetInnerHTML={{ __html: update.content }}
      />

      {/* Public Attachments downloads */}
      {update.attachments && update.attachments.length > 0 && (
        <section className="mt-12 border-t border-slate-100 pt-8 space-y-4">
          <h3 className="text-base font-black text-primary flex items-center gap-1.5">
            <FilePdf size={20} className="text-rose-500" />
            Reference Documents & Attachments
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {update.attachments.map((att: string, idx: number) => {
              const fileName = att.split('/').pop() || `Attachment_${idx + 1}`;
              const docUrl = att.startsWith('http') || att.startsWith('/uploads') ? att : `http://localhost:5000${att}`;
              return (
                <div 
                  key={idx} 
                  className="flex items-center justify-between border border-border-gray hover:border-[#00a896] p-3.5 rounded-xl bg-white shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                      <FilePdf size={18} className="text-rose-600" />
                    </div>
                    <span className="text-xs font-bold text-primary line-clamp-1 max-w-[180px]">
                      {fileName}
                    </span>
                  </div>
                  <a 
                    href={docUrl} 
                    download 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-1.5 text-primary hover:text-accent cursor-pointer transition-colors"
                  >
                    <DownloadSimple size={18} weight="bold" />
                  </a>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
};
