import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle,
  Warning,
  ArrowRight,
  Download,
  Calendar
} from '@phosphor-icons/react';

interface PolicyAttachment {
  name: string;
  path: string;
}

interface PolicyData {
  id: string;
  title: string;
  description: string;
  content: string;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  attachments?: PolicyAttachment[];
}

interface ComplianceProps {
  sub: string;
}

export const Compliance: React.FC<ComplianceProps> = ({ sub }) => {
  const [policy, setPolicy] = useState<PolicyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Grievance Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const policyMenu = [
    { id: 'privacy-policy', label: 'Privacy Policy', icon: '🔒' },
    { id: 'terms-and-conditions', label: 'Terms & Conditions', icon: '📝' },
    { id: 'student-conduct', label: 'Code of Conduct', icon: '🎓' },
    { id: 'child-protection', label: 'Safeguarding Policy', icon: '🛡️' },
    { id: 'health-safety', label: 'Health & Safety', icon: '🩺' },
    { id: 'grievance-complaints', label: 'Grievance & Complaints', icon: '⚖️' },
    { id: 'cookie-policy', label: 'Cookie Policy', icon: '🍪' }
  ];

  useEffect(() => {
    setLoading(true);
    setError(null);
    setSubmitSuccess(null);

    fetch(`http://localhost:5000/api/public/compliance/policies/${sub}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Policy details could not be loaded or are not published yet.');
        }
        return res.json();
      })
      .then((data: PolicyData) => {
        setPolicy(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching policy:", err);
        setError(err.message || 'Failed to fetch policy.');
        setLoading(false);
      });
  }, [sub]);

  const handleGrievanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formSubject.trim() || !formDesc.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/public/compliance/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporterName: formName,
          reporterEmail: formEmail,
          reporterPhone: formPhone,
          subject: formSubject,
          description: formDesc
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSubmitSuccess(data.id);
        setFormName('');
        setFormEmail('');
        setFormPhone('');
        setFormSubject('');
        setFormDesc('');
      } else {
        alert(data.error || "Failed to submit grievance. Please try again.");
      }
    } catch (err) {
      alert("Failed to connect to the server. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMenuClick = (id: string) => {
    window.location.hash = `#/compliance/${id}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-primary text-white py-16 px-5 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 bottom-0 w-72 h-72 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="max-w-[800px] mx-auto relative z-10">
          <span className="bg-accent/15 text-accent text-xs font-black uppercase tracking-widest py-1.5 px-4 rounded-full border border-accent/20">
            Legal & Compliance CMS
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-4 mb-3">
            RLBSA Compliance Portal
          </h1>
          <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-[580px] mx-auto">
            Review our public safety frameworks, student codes of conduct, privacy safeguards, and file official grievances directly to our redressal committee.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1380px] mx-auto px-5 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Mobile Menu Dropdown & Desktop Sidebar */}
        <div className="lg:col-span-3">
          {/* Mobile Select Menu */}
          <div className="block lg:hidden mb-5">
            <label htmlFor="policy-select" className="block text-xs font-bold text-text-light uppercase tracking-wider mb-2">
              Select Policy / Section
            </label>
            <select 
              id="policy-select"
              value={sub}
              onChange={(e) => handleMenuClick(e.target.value)}
              className="w-full bg-white border border-border-gray py-3 px-4 rounded-xl font-semibold text-primary outline-none focus:border-primary shadow-xs"
            >
              {policyMenu.map(menu => (
                <option key={menu.id} value={menu.id}>
                  {menu.icon} {menu.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Sidebar List */}
          <div className="hidden lg:block bg-white rounded-xl border border-border-gray p-4 shadow-sm space-y-1">
            <span className="block text-[10px] font-black text-text-light uppercase tracking-widest px-4 py-2 mb-2">
              Compliance Index
            </span>
            {policyMenu.map(menu => {
              const active = sub === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => handleMenuClick(menu.id)}
                  className={`w-full text-left py-3.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer border-none ${
                    active 
                      ? 'bg-primary text-white shadow-md translate-x-1' 
                      : 'bg-transparent text-text-body hover:bg-soft-light hover:text-primary'
                  }`}
                >
                  <span className="text-base shrink-0">{menu.icon}</span>
                  <span>{menu.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:block mt-6 bg-accent/5 rounded-xl border border-accent/20 p-5 text-left">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={20} className="text-primary" />
              <h4 className="text-sm font-extrabold text-primary">Trust & Safety</h4>
            </div>
            <p className="text-[11px] leading-relaxed text-text-body font-medium">
              We update our policies regularly in compliance with national sports federations, SAI regulations, and child welfare guidelines.
            </p>
          </div>
        </div>

        {/* Right Side: Content Area */}
        <div className="lg:col-span-9">
          {loading ? (
            <div className="bg-white rounded-xl border border-border-gray p-16 text-center shadow-sm">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-text-light font-semibold text-sm">Loading policy details dynamically...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl border border-border-gray p-16 text-center shadow-sm">
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-xs">
                <Warning size={24} />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">Content Unavailable</h3>
              <p className="text-xs text-text-light max-w-[380px] mx-auto leading-relaxed mb-6">
                {error}
              </p>
              <button 
                onClick={() => handleMenuClick('privacy-policy')}
                className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl text-xs cursor-pointer shadow-md hover:bg-accent hover:text-primary transition-all border-none"
              >
                Return to Privacy Policy
              </button>
            </div>
          ) : policy ? (
            <div className="space-y-6">
              {/* Policy Header Card */}
              <div className="bg-white rounded-xl border border-border-gray p-6 md:p-8 shadow-sm text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/[0.02] rounded-full translate-x-6 -translate-y-6"></div>
                
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-border-gray/50">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-primary tracking-tight">
                      {policy.title}
                    </h2>
                    <p className="text-xs text-text-light mt-1 font-semibold leading-relaxed">
                      {policy.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-primary/5 text-primary text-[10px] font-black py-1 px-3 rounded-lg border border-primary/10">
                      Version {policy.version}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black py-1 px-3 rounded-lg border border-emerald-200">
                      Active
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs font-semibold text-text-light mb-6">
                  <span className="flex items-center gap-1.5"><Calendar size={15} /> Effective Date: {formatDate(policy.effectiveDate)}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={15} /> Last Updated: {formatDate(policy.lastUpdated)}</span>
                </div>

                {/* Policy Dynamic Body HTML */}
                <div 
                  className="prose prose-sm max-w-none text-text-body leading-relaxed text-xs md:text-sm font-semibold space-y-4 compliance-content"
                  dangerouslySetInnerHTML={{ __html: policy.content }}
                />

                {/* Attachments List */}
                {policy.attachments && policy.attachments.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-border-gray/50">
                    <h4 className="text-xs font-black text-primary uppercase tracking-wider mb-3">
                      Attached Reference Documents
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {policy.attachments.map((attach, idx) => (
                        <a
                          key={idx}
                          href={attach.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-soft-light border border-border-gray hover:border-primary p-3 rounded-xl flex items-center justify-between group transition-all text-left text-xs font-bold text-text-body decoration-none hover:shadow-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg">📁</span>
                            <span className="truncate max-w-[200px]">{attach.name}</span>
                          </div>
                          <Download size={15} className="text-text-light group-hover:text-primary group-hover:scale-110 transition-all" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Grievance Submission Form Panel */}
              {policy.id === 'grievance-complaints' && (
                <div className="bg-white rounded-xl border border-border-gray p-6 md:p-8 shadow-sm text-left relative">
                  <h3 className="text-lg font-black text-primary mb-1">Redressal Filing Form</h3>
                  <p className="text-xs text-text-light mb-6 font-semibold">
                    Submit your grievance directly to our Internal Complaints Committee. Fields marked * are required.
                  </p>

                  {submitSuccess ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center animate-scale-up">
                      <CheckCircle size={44} className="text-emerald-500 mx-auto mb-3" />
                      <h4 className="text-sm font-bold text-emerald-800 mb-1">Grievance Registered Successfully</h4>
                      <p className="text-xs text-emerald-700 font-semibold mb-4 leading-relaxed max-w-[340px] mx-auto">
                        Your complain reference ID is <span className="font-extrabold underline">{submitSuccess}</span>. Please save this code for future status audits.
                      </p>
                      <button
                        onClick={() => setSubmitSuccess(null)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer border-none"
                      >
                        File Another Report
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleGrievanceSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">
                            Reporter Name *
                          </label>
                          <input 
                            type="text" 
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            required 
                            placeholder="E.g. Mr. Anil Kumar"
                            className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl text-xs text-primary font-semibold outline-none focus:border-primary focus:bg-white transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">
                            Reporter Email *
                          </label>
                          <input 
                            type="email" 
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            required 
                            placeholder="E.g. anil@gmail.com"
                            className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl text-xs text-primary font-semibold outline-none focus:border-primary focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">
                            Phone Number
                          </label>
                          <input 
                            type="tel" 
                            value={formPhone}
                            onChange={(e) => setFormPhone(e.target.value)}
                            placeholder="E.g. +91 98765 43210"
                            className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl text-xs text-primary font-semibold outline-none focus:border-primary focus:bg-white transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">
                            Complaint Subject *
                          </label>
                          <input 
                            type="text" 
                            value={formSubject}
                            onChange={(e) => setFormSubject(e.target.value)}
                            required 
                            placeholder="E.g. Hostel Facility Cleanliness Concern"
                            className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl text-xs text-primary font-semibold outline-none focus:border-primary focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">
                          Description & Grievance Narrative *
                        </label>
                        <textarea 
                          rows={4}
                          value={formDesc}
                          onChange={(e) => setFormDesc(e.target.value)}
                          required
                          placeholder="Provide detailed description of the incident, including dates, names, and any actions taken..."
                          className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl text-xs text-primary font-semibold outline-none focus:border-primary focus:bg-white transition-all resize-none"
                        ></textarea>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-6 py-3 bg-primary text-white font-bold rounded-xl text-xs cursor-pointer shadow-md hover:bg-accent hover:text-primary transition-all border-none uppercase tracking-wider flex items-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Submitting...
                            </>
                          ) : (
                            <>
                              Submit Grievance
                              <ArrowRight size={14} />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
