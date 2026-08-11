import React, { useState, useEffect } from 'react';
import { 
  Student, 
  Users, 
  Image as ImageIcon, 
  Video, 
  CalendarPlus, 
  EnvelopeOpen, 
  Plus,
  Trash,
  X,
  CheckCircle,
  FilePlus,
  Buildings,
  Megaphone,
  UserPlus,
  Notebook,
  Gear,
  UserGear,
  Lock,
  MagnifyingGlass,
  CheckSquare,
  Square,
  ArrowCounterClockwise,
  Eye
} from '@phosphor-icons/react';

interface AdminViewsProps {
  activeTab: string;
}

interface MockStudent {
  id: string;
  name: string;
  age: number;
  sport: string;
  joined: string;
  medalNumber?: number;
  avatar?: string;
}

interface MockEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
}

export const AdminViews: React.FC<AdminViewsProps> = ({ activeTab }) => {
  const [students, setStudents] = useState<MockStudent[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [dashboardGallery, setDashboardGallery] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<MockEnquiry[]>([]);
  const [milestones, setMilestones] = useState({ districtMedals: 240, stateSelection: 15, nationalSelections: 120, certifications: 4 });

  // Gallery Management Module states
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [galleryTotal, setGalleryTotal] = useState<number>(0);
  const [galleryPage, setGalleryPage] = useState<number>(1);
  const [galleryTotalPages, setGalleryTotalPages] = useState<number>(1);
  const [gallerySearch, setGallerySearch] = useState<string>('');
  const [galleryCategory, setGalleryCategory] = useState<string>('');
  const [galleryMediaType, setGalleryMediaType] = useState<string>('');
  const [galleryStatus, setGalleryStatus] = useState<string>(''); // empty means both draft and published
  const [galleryIsDeleted, setGalleryIsDeleted] = useState<boolean>(false); // toggle Trash Bin mode
  const [selectedGalleryIds, setSelectedGalleryIds] = useState<string[]>([]);

  // Multi-step upload and preview states
  const [uploadedPreviewItem, setUploadedPreviewItem] = useState<any | null>(null);
  const [galleryFormFiles, setGalleryFormFiles] = useState<{ media: File | null; thumbnail: File | null }>({ media: null, thumbnail: null });
  const [galleryFormInputs, setGalleryFormInputs] = useState({
    title: '',
    description: '',
    category: 'Tournament',
    mediaType: 'image' as 'image' | 'video',
    featured: false,
    visibility: 'public' as 'public' | 'private',
    status: 'draft' as 'draft' | 'published'
  });
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Modal Control States
  const [activeModal, setActiveModal] = useState<string | null>(null); // 'student' | 'coach' | 'gallery' | 'event'
  const [successToast, setSuccessToast] = useState<string>('');

  // Form Fields State
  const [studentForm, setStudentForm] = useState({ name: '', age: '', sport: 'Football', medalNumber: '', avatar: '🎓' });
  const [coachForm, setCoachForm] = useState({ name: '', role: '', specialization: '', experience: '', bio: '', avatar: '👨‍🏫' });
  const [eventForm, setEventForm] = useState({ title: '', category: 'tournaments', date: '', time: '', venue: '', description: '' });
  const [profileForm, setProfileForm] = useState({ name: '', email: '', username: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState<boolean>(false);
  const [showEmailVerifyModal, setShowEmailVerifyModal] = useState<boolean>(false);
  const [emailVerifyCode, setEmailVerifyCode] = useState<string>('');
  const [tempEmailToVerify, setTempEmailToVerify] = useState<string>('');
  const [isVerifyingEmail, setIsVerifyingEmail] = useState<boolean>(false);

  const token = localStorage.getItem('rlbsa_admin_token') || '';

  const fetchData = async () => {
    try {
      // Fetch public content
      const [cRes, gRes, eRes, mRes] = await Promise.all([
        fetch('http://localhost:5000/api/public/coaches'),
        fetch('http://localhost:5000/api/public/gallery'),
        fetch('http://localhost:5000/api/public/events'),
        fetch('http://localhost:5000/api/public/milestones')
      ]);
      if (cRes.ok) setCoaches(await cRes.json());
      if (gRes.ok) {
        const data = await gRes.json();
        setDashboardGallery(data.items || []);
      }
      if (eRes.ok) setEvents(await eRes.json());
      if (mRes.ok) setMilestones(await mRes.json());

      // Fetch protected admin data if token exists
      if (token) {
        const [sRes, enqRes, pRes] = await Promise.all([
          fetch('http://localhost:5000/api/admin/students', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/admin/enquiries', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/admin/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        if (sRes.status === 401 || sRes.status === 403 || enqRes.status === 401 || enqRes.status === 403) {
          localStorage.removeItem('rlbsa_admin_token');
          window.location.reload();
          return;
        }
        if (sRes.ok) setStudents(await sRes.json());
        if (enqRes.ok) setEnquiries(await enqRes.json());
        if (pRes.ok) {
          const profileData = await pRes.json();
          setProfileForm({
            name: profileData.name || '',
            email: profileData.email || '',
            username: profileData.username || ''
          });
        }
      }
    } catch (err) {
      console.error("Error loading backend api data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const triggerSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Add Action Handlers
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/students', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(studentForm)
      });
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('rlbsa_admin_token');
        window.location.reload();
        return;
      }
      const data = await response.json();
      if (response.ok && data.success) {
        setStudents([data.student, ...students]);
        triggerSuccess('Student registered successfully.');
        setActiveModal(null);
        setStudentForm({ name: '', age: '', sport: 'Football', medalNumber: '', avatar: '🎓' });
      } else {
        alert(data.error || "Failed to add student.");
      }
    } catch (err) {
      alert("Error contacting the backend server.");
    }
  };

  const handleAddCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/coaches', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...coachForm,
          experience: coachForm.experience + ' Years Coaching'
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setCoaches([...coaches, data.coach]);
        triggerSuccess('Coach added successfully.');
        setActiveModal(null);
        setCoachForm({ name: '', role: '', specialization: '', experience: '', bio: '', avatar: '👨‍🏫' });
      } else {
        alert(data.error || "Failed to add coach.");
      }
    } catch (err) {
      alert("Error contacting the backend server.");
    }
  };

  const fetchGallery = async () => {
    if (!token) return;
    try {
      const queryParams = new URLSearchParams({
        page: String(galleryPage),
        limit: '12',
        isDeleted: String(galleryIsDeleted),
        status: galleryStatus,
        category: galleryCategory,
        mediaType: galleryMediaType,
        search: gallerySearch
      });
      const res = await fetch(`http://localhost:5000/api/admin/gallery?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('rlbsa_admin_token');
        window.location.reload();
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setGalleryItems(data.items || []);
        setGalleryTotal(data.total || 0);
        setGalleryTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Error loading admin gallery:", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'gallery') {
      fetchGallery();
    }
  }, [activeTab, galleryPage, galleryIsDeleted, galleryStatus, galleryCategory, galleryMediaType, gallerySearch]);

  const handleUploadOrPreview = async (e: React.FormEvent, forcePublish: boolean = false) => {
    e.preventDefault();
    if (!galleryFormFiles.media) {
      alert("Please select a media file to upload.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', galleryFormInputs.title);
      formData.append('description', galleryFormInputs.description);
      formData.append('category', galleryFormInputs.category);
      formData.append('mediaType', galleryFormInputs.mediaType);
      formData.append('featured', String(galleryFormInputs.featured));
      formData.append('visibility', galleryFormInputs.visibility);
      formData.append('status', forcePublish ? 'published' : galleryFormInputs.status);
      formData.append('media', galleryFormFiles.media);

      if (galleryFormFiles.thumbnail) {
        formData.append('thumbnail', galleryFormFiles.thumbnail);
      }

      const response = await fetch('http://localhost:5000/api/admin/gallery', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('rlbsa_admin_token');
        window.location.reload();
        return;
      }

      const data = await response.json();
      if (response.ok && data.success) {
        // If we want to preview first, store the optimization stats
        if (!forcePublish && galleryFormInputs.status === 'draft') {
          setUploadedPreviewItem(data.item);
          triggerSuccess('Draft saved. Optimization preview ready!');
        } else {
          // Add directly to active list
          setGalleryItems([data.item, ...galleryItems]);
          triggerSuccess('Media published successfully.');
          setActiveModal(null);
          resetGalleryForm();
        }
        fetchGallery();
      } else {
        alert(data.error || "Upload failed.");
      }
    } catch (err) {
      console.error("Upload handler error:", err);
      alert("Error contacting the backend server.");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePublishPreviewItem = async () => {
    if (!uploadedPreviewItem) return;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/gallery/${uploadedPreviewItem._id}/publish`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('rlbsa_admin_token');
        window.location.reload();
        return;
      }
      const data = await response.json();
      if (response.ok && data.success) {
        triggerSuccess('Draft successfully published.');
        setUploadedPreviewItem(null);
        setActiveModal(null);
        resetGalleryForm();
        fetchGallery();
      } else {
        alert(data.error || "Failed to publish.");
      }
    } catch (err) {
      alert("Error publishing item.");
    }
  };

  const resetGalleryForm = () => {
    setGalleryFormInputs({
      title: '',
      description: '',
      category: 'Tournament',
      mediaType: 'image',
      featured: false,
      visibility: 'public',
      status: 'draft'
    });
    setGalleryFormFiles({ media: null, thumbnail: null });
    setUploadedPreviewItem(null);
  };

  const handleSoftDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/gallery/${id}/soft`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setGalleryItems(galleryItems.filter(item => item._id !== id));
        setSelectedGalleryIds(selectedGalleryIds.filter(x => x !== id));
        triggerSuccess('Media moved to Trash Bin.');
        fetchGallery();
      }
    } catch (err) {
      alert("Error soft deleting gallery item.");
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/gallery/${id}/restore`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setGalleryItems(galleryItems.filter(item => item._id !== id));
        setSelectedGalleryIds(selectedGalleryIds.filter(x => x !== id));
        triggerSuccess('Media restored successfully.');
        fetchGallery();
      }
    } catch (err) {
      alert("Error restoring gallery item.");
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (!id || id === 'undefined') {
      alert("Cannot delete mock media item. Only uploaded database items can be permanently deleted.");
      return;
    }
    if (!window.confirm("Are you sure you want to permanently delete this media file and all optimized sizes? This action is irreversible.")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/gallery/${id}/permanent`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setGalleryItems(galleryItems.filter(item => item._id !== id));
        setSelectedGalleryIds(selectedGalleryIds.filter(x => x !== id));
        triggerSuccess('Media purged permanently.');
        fetchGallery();
      } else {
        alert(data.error || "Failed to purge media.");
      }
    } catch (err) {
      alert("Error purging gallery item.");
    }
  };

  // Bulk Actions
  const handleBulkPublish = async () => {
    if (selectedGalleryIds.length === 0) return;
    try {
      const response = await fetch('http://localhost:5000/api/admin/gallery/bulk-publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids: selectedGalleryIds })
      });
      if (response.ok) {
        triggerSuccess(`${selectedGalleryIds.length} items published.`);
        setSelectedGalleryIds([]);
        fetchGallery();
      }
    } catch (err) {
      alert("Error performing bulk publish.");
    }
  };

  const handleBulkSoftDelete = async () => {
    if (selectedGalleryIds.length === 0) return;
    try {
      const response = await fetch('http://localhost:5000/api/admin/gallery/bulk-soft-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids: selectedGalleryIds })
      });
      if (response.ok) {
        triggerSuccess(`${selectedGalleryIds.length} items moved to Trash Bin.`);
        setSelectedGalleryIds([]);
        fetchGallery();
      }
    } catch (err) {
      alert("Error performing bulk delete.");
    }
  };

  const handleBulkRestore = async () => {
    if (selectedGalleryIds.length === 0) return;
    try {
      const response = await fetch('http://localhost:5000/api/admin/gallery/bulk-restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids: selectedGalleryIds })
      });
      if (response.ok) {
        triggerSuccess(`${selectedGalleryIds.length} items restored.`);
        setSelectedGalleryIds([]);
        fetchGallery();
      }
    } catch (err) {
      alert("Error performing bulk restore.");
    }
  };

  const handleBulkPermanentDelete = async () => {
    if (selectedGalleryIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to permanently delete the ${selectedGalleryIds.length} selected media files? This is irreversible.`)) return;
    try {
      const response = await fetch('http://localhost:5000/api/admin/gallery/bulk-permanent-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids: selectedGalleryIds })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        triggerSuccess(`${selectedGalleryIds.length} items permanently deleted.`);
        setSelectedGalleryIds([]);
        fetchGallery();
      } else {
        alert(data.error || "Failed to bulk delete permanently.");
      }
    } catch (err) {
      alert("Error performing bulk permanent delete.");
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/events', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventForm)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setEvents([data.event, ...events]);
        triggerSuccess('Event scheduled successfully.');
        setActiveModal(null);
        setEventForm({ title: '', category: 'tournaments', date: '', time: '', venue: '', description: '' });
      } else {
        alert(data.error || "Failed to add event.");
      }
    } catch (err) {
      alert("Error contacting the backend server.");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.username.trim()) {
      alert("Username cannot be empty.");
      return;
    }
    setIsSavingProfile(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        if (data.emailVerificationRequired) {
          setTempEmailToVerify(profileForm.email);
          setShowEmailVerifyModal(true);
          triggerSuccess('Name & username updated. Email verification code sent.');
        } else {
          triggerSuccess('Profile information updated successfully.');
        }
        
        // Check if username was modified and sync
        const currentSavedUsername = localStorage.getItem('rlbsa_admin_username') || 'admin';
        if (profileForm.username !== currentSavedUsername) {
          alert("Your username has been changed. You will now be redirected to log in again with your new credentials.");
          localStorage.removeItem('rlbsa_admin_token');
          localStorage.setItem('rlbsa_admin_username', profileForm.username);
          window.location.reload();
        }
      } else {
        alert(data.error || "Failed to update profile info.");
      }
    } catch (err) {
      alert("Error contacting server for profile update.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleVerifyEmailCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailVerifyCode.trim()) return;
    setIsVerifyingEmail(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/profile/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token: emailVerifyCode.trim() })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        triggerSuccess('Email verified and updated successfully.');
        setShowEmailVerifyModal(false);
        setEmailVerifyCode('');
        // Update profileForm local email value
        setProfileForm(prev => ({ ...prev, email: data.email }));
      } else {
        alert(data.error || 'Failed to verify email code.');
      }
    } catch (err) {
      alert('Error verifying code.');
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      alert("All password fields are required.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        triggerSuccess('Password changed successfully.');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        alert(data.error || "Failed to update password.");
      }
    } catch (err) {
      alert("Error contacting server for password change.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Delete Handlers
  const deleteStudent = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/students/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setStudents(students.filter(s => s.id !== id));
        triggerSuccess('Student record deleted.');
      }
    } catch (err) {
      alert("Error deleting student.");
    }
  };

  const deleteCoach = async (name: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/coaches/${encodeURIComponent(name)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setCoaches(coaches.filter(c => c.name !== name));
        triggerSuccess('Coach record deleted.');
      }
    } catch (err) {
      alert("Error deleting coach.");
    }
  };


  // Event handlers below

  const deleteEvent = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setEvents(events.filter(e => e.id !== id));
        triggerSuccess('Event details removed.');
      }
    } catch (err) {
      alert("Error deleting event.");
    }
  };

  const deleteEnquiry = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/enquiries/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setEnquiries(enquiries.filter(e => e.id !== id));
        triggerSuccess('Enquiry message dismissed.');
      }
    } catch (err) {
      alert("Error deleting enquiry.");
    }
  };

  const handleSaveMilestones = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/milestones', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(milestones)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        triggerSuccess('Milestones updated.');
      } else {
        alert(data.error || "Failed to update milestones.");
      }
    } catch (err) {
      alert("Error saving milestones.");
    }
  };

  return (
    <div className="relative font-main animate-fade-in">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 bg-primary border border-emerald-500/20 text-emerald-400 py-3 px-5 rounded-xl shadow-xl flex items-center gap-3 z-[300] animate-bounce">
          <CheckCircle size={20} className="text-emerald-500" weight="fill" />
          <span className="text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* DASHBOARD TAB VIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          
          {/* Stats Counters Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-border-gray shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-primary/8 text-primary rounded-xl flex items-center justify-center text-xl font-bold"><Student size={24} /></div>
              <div>
                <span className="block text-[11px] font-bold text-text-light uppercase tracking-wider mb-0.5">Total Students</span>
                <p className="text-2xl font-extrabold text-primary">{students.length}</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-border-gray shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-primary/8 text-primary rounded-xl flex items-center justify-center text-xl font-bold"><Users size={24} /></div>
              <div>
                <span className="block text-[11px] font-bold text-text-light uppercase tracking-wider mb-0.5">Total Coaches</span>
                <p className="text-2xl font-extrabold text-primary">{coaches.length}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border-gray shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-primary/8 text-primary rounded-xl flex items-center justify-center text-xl font-bold"><ImageIcon size={24} /></div>
              <div>
                <span className="block text-[11px] font-bold text-text-light uppercase tracking-wider mb-0.5">Gallery Photos</span>
                <p className="text-2xl font-extrabold text-primary">{dashboardGallery.filter(item => item.mediaType === 'image' || item.mediaType === 'photo').length}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border-gray shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-primary/8 text-primary rounded-xl flex items-center justify-center text-xl font-bold"><Video size={24} /></div>
              <div>
                <span className="block text-[11px] font-bold text-text-light uppercase tracking-wider mb-0.5">Gallery Videos</span>
                <p className="text-2xl font-extrabold text-primary">{dashboardGallery.filter(item => item.mediaType === 'video').length}</p>
              </div>
            </div>
          </div>

          {/* KPI Mini-stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary text-white p-6 rounded-xl border border-primary-light shadow-md flex justify-between items-center hover:scale-[1.01] transition-all">
              <div>
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-1">Recent Admissions</span>
                <p className="text-3xl font-extrabold">{students.length}</p>
              </div>
              <span className="text-text-light"><Plus size={36} /></span>
            </div>
            
            <div className="bg-primary text-white p-6 rounded-xl border border-primary-light shadow-md flex justify-between items-center hover:scale-[1.01] transition-all">
              <div>
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-1">Upcoming Events Scheduled</span>
                <p className="text-3xl font-extrabold">{events.length}</p>
              </div>
              <span className="text-text-light"><CalendarPlus size={36} /></span>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white p-8 rounded-xl border border-border-gray shadow-sm">
            <h3 className="text-base font-bold text-primary mb-5 border-b border-border-gray pb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button 
                onClick={() => setActiveModal('student')}
                className="py-4 px-5 rounded-lg bg-soft-light border border-border-gray text-primary hover:bg-primary hover:text-white transition-all cursor-pointer font-bold text-xs flex flex-col items-center gap-2"
              >
                <UserPlus size={22} /> + Add Student
              </button>
              <button 
                onClick={() => setActiveModal('coach')}
                className="py-4 px-5 rounded-lg bg-soft-light border border-border-gray text-primary hover:bg-primary hover:text-white transition-all cursor-pointer font-bold text-xs flex flex-col items-center gap-2"
              >
                <Users size={22} /> + Add Coach
              </button>
              <button 
                onClick={() => setActiveModal('gallery')}
                className="py-4 px-5 rounded-lg bg-soft-light border border-border-gray text-primary hover:bg-primary hover:text-white transition-all cursor-pointer font-bold text-xs flex flex-col items-center gap-2"
              >
                <ImageIcon size={22} /> + Upload Gallery
              </button>
              <button 
                onClick={() => setActiveModal('event')}
                className="py-4 px-5 rounded-lg bg-soft-light border border-border-gray text-primary hover:bg-primary hover:text-white transition-all cursor-pointer font-bold text-xs flex flex-col items-center gap-2"
              >
                <CalendarPlus size={22} /> + Add Event
              </button>
            </div>
          </div>

          {/* Table Panels: Enquiries & Gallery uploads */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Recent Enquiries List */}
            <div className="bg-white p-6 rounded-xl border border-border-gray shadow-sm lg:col-span-2 flex flex-col">
              <h3 className="text-base font-bold text-primary mb-4 pb-3 border-b border-border-gray flex items-center justify-between">
                <span>Recent Enquiries</span>
                <span className="text-[10px] font-bold text-text-light uppercase">Incoming messages</span>
              </h3>
              <div className="flex-1 flex flex-col gap-4">
                {enquiries.slice(0, 3).map((enq, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-soft-light border border-border-gray flex gap-4 text-left relative group">
                    <div className="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center shrink-0">
                      <EnvelopeOpen size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-primary">{enq.name}</h4>
                        <span className="text-[10px] text-text-light font-semibold">{enq.date}</span>
                      </div>
                      <span className="block text-[10px] font-bold text-accent uppercase tracking-wider mt-0.5">{enq.subject}</span>
                      <p className="text-text-body text-xs mt-2 italic leading-relaxed">
                        "{enq.message}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Gallery Uploads */}
            <div className="bg-white p-6 rounded-xl border border-border-gray shadow-sm flex flex-col">
              <h3 className="text-base font-bold text-primary mb-4 pb-3 border-b border-border-gray">
                Latest Uploads
              </h3>
              <div className="flex-1 flex flex-col gap-3">
                {dashboardGallery.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-soft-light border border-border-gray flex items-center justify-between text-left">
                    <div>
                      <h4 className="text-xs font-bold text-primary truncate max-w-[170px]">{item.title}</h4>
                      <span className="text-[9px] font-semibold text-text-light capitalize">{item.category} &bull; {item.mediaType}</span>
                    </div>
                    <span className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center text-sm">
                      {item.mediaType === 'video' ? <Video size={16} /> : <ImageIcon size={16} />}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* STUDENTS TAB VIEW */}
      {activeTab === 'students' && (
        <div className="bg-white p-6 md:p-8 rounded-xl border border-border-gray shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-border-gray">
            <div>
              <h3 className="text-base font-bold text-primary">Students Roster</h3>
              <p className="text-text-light text-xs mt-0.5">Active boarding and coaching students directory</p>
            </div>
            <button 
              onClick={() => setActiveModal('student')}
              className="bg-primary text-white hover:bg-accent hover:text-primary transition-all font-bold py-2.5 px-5 rounded-lg cursor-pointer text-xs flex items-center gap-1.5 self-start"
            >
              <Plus size={16} /> Add Student
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-gray text-text-light text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-center">Pic</th>
                  <th className="py-3.5 px-4">Student ID</th>
                  <th className="py-3.5 px-4">Full Name</th>
                  <th className="py-3.5 px-4">Age</th>
                  <th className="py-3.5 px-4">Sport</th>
                  <th className="py-3.5 px-4 text-center">Medals</th>
                  <th className="py-3.5 px-4">Admission Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-gray text-sm font-semibold text-primary-light">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-55/40">
                    <td className="py-3.5 px-4 text-center text-lg">{student.avatar || '🎓'}</td>
                    <td className="py-3.5 px-4 text-xs font-bold text-text-light">{student.id}</td>
                    <td className="py-3.5 px-4 text-primary">{student.name}</td>
                    <td className="py-3.5 px-4">{student.age} Yrs</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block bg-primary/10 text-primary py-0.5 px-2.5 rounded text-xs font-bold">
                        {student.sport}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-primary">{student.medalNumber || 0}</td>
                    <td className="py-3.5 px-4 text-xs text-text-light">{student.joined}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={() => deleteStudent(student.id)}
                        className="text-rose-500 hover:text-rose-700 bg-transparent border-none p-1 cursor-pointer"
                        title="Delete Student"
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COACHES TAB VIEW */}
      {activeTab === 'coaches' && (
        <div className="bg-white p-6 md:p-8 rounded-xl border border-border-gray shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-border-gray">
            <div>
              <h3 className="text-base font-bold text-primary">Coaches & Roster</h3>
              <p className="text-text-light text-xs mt-0.5">Manage coaching staff and sport specializations</p>
            </div>
            <button 
              onClick={() => setActiveModal('coach')}
              className="bg-primary text-white hover:bg-accent hover:text-primary transition-all font-bold py-2.5 px-5 rounded-lg cursor-pointer text-xs flex items-center gap-1.5 self-start"
            >
              <Plus size={16} /> Add Coach
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coaches.map((coach, idx) => (
              <div key={idx} className="p-5 border border-border-gray rounded-xl flex gap-4 text-left hover:shadow-sm transition-all items-start relative group">
                <div className="w-12 h-12 bg-border-gray text-2xl rounded-full flex items-center justify-center shrink-0">
                  {coach.avatar}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-primary text-base">{coach.name}</h4>
                  <span className="text-xs font-bold text-accent uppercase tracking-wider block mt-0.5">{coach.role}</span>
                  <span className="block text-[11px] text-text-light font-semibold italic mt-1">{coach.specialization} &bull; {coach.experience}</span>
                  <p className="text-text-body text-xs mt-2.5 leading-relaxed">{coach.bio}</p>
                </div>
                <button
                  onClick={() => deleteCoach(coach.name)}
                  className="absolute top-4 right-4 text-text-light hover:text-rose-500 bg-transparent border-none p-1 cursor-pointer"
                  title="Remove Coach"
                >
                  <Trash size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GALLERY TAB VIEW */}
      {activeTab === 'gallery' && (
        <div className="bg-white p-6 md:p-8 rounded-xl border border-border-gray shadow-sm space-y-6 text-left">
          
          {/* Header section */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-border-gray">
            <div>
              <h3 className="text-base font-bold text-primary">Gallery Media Catalog</h3>
              <p className="text-text-light text-xs mt-0.5">Manage optimized photos, videos, compression percentages, and homepage features</p>
            </div>
            <button 
              onClick={() => {
                resetGalleryForm();
                setActiveModal('gallery');
              }}
              className="bg-primary text-white hover:bg-accent hover:text-primary transition-all font-bold py-2.5 px-5 rounded-lg cursor-pointer text-xs flex items-center gap-1.5 self-start"
            >
              <Plus size={16} /> Upload New Media
            </button>
          </div>

          {/* Search & Filters Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 bg-soft-light p-4 rounded-xl border border-border-gray">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-text-light"><MagnifyingGlass size={16} /></span>
              <input 
                type="text" 
                placeholder="Search Title..." 
                value={gallerySearch}
                onChange={(e) => {
                  setGallerySearch(e.target.value);
                  setGalleryPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 border border-border-gray rounded bg-white text-xs text-primary font-semibold outline-none focus:border-primary transition-all"
              />
            </div>
            <div>
              <select 
                value={galleryCategory}
                onChange={(e) => {
                  setGalleryCategory(e.target.value);
                  setGalleryPage(1);
                }}
                className="w-full px-3 py-2 border border-border-gray rounded bg-white text-xs text-primary font-semibold outline-none focus:border-primary transition-all"
              >
                <option value="">All Categories</option>
                <option value="Tournament">Tournament</option>
                <option value="Training Sessions">Training Sessions</option>
                <option value="Academy Events">Academy Events</option>
                <option value="Student Achievements">Student Achievements</option>
                <option value="Facilities">Facilities</option>
                <option value="Summer Camp">Summer Camp</option>
                <option value="Workshops">Workshops</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div>
              <select 
                value={galleryMediaType}
                onChange={(e) => {
                  setGalleryMediaType(e.target.value);
                  setGalleryPage(1);
                }}
                className="w-full px-3 py-2 border border-border-gray rounded bg-white text-xs text-primary font-semibold outline-none focus:border-primary transition-all"
              >
                <option value="">All Media Types</option>
                <option value="image">Image Format</option>
                <option value="video">Video Format</option>
              </select>
            </div>
            <div>
              <select 
                value={galleryStatus}
                onChange={(e) => {
                  setGalleryStatus(e.target.value);
                  setGalleryPage(1);
                }}
                className="w-full px-3 py-2 border border-border-gray rounded bg-white text-xs text-primary font-semibold outline-none focus:border-primary transition-all"
              >
                <option value="">All Statuses (Active)</option>
                <option value="published">Published Only</option>
                <option value="draft">Drafts Only</option>
              </select>
            </div>
            <div className="flex items-center gap-2 px-1">
              <input 
                type="checkbox" 
                id="trashMode"
                checked={galleryIsDeleted}
                onChange={(e) => {
                  setGalleryIsDeleted(e.target.checked);
                  setGalleryPage(1);
                  setSelectedGalleryIds([]);
                }}
                className="rounded border-border-gray text-primary focus:ring-primary w-4 h-4 cursor-pointer"
              />
              <label htmlFor="trashMode" className="text-xs font-bold text-rose-500 cursor-pointer select-none">
                View Trash Bin ({galleryIsDeleted ? 'Active' : 'Show'})
              </label>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedGalleryIds.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-500/10 border border-amber-500/25 p-3 px-4 rounded-lg animate-fade-in">
              <span className="text-xs font-bold text-amber-700">
                Selected {selectedGalleryIds.length} media item(s) for bulk processing:
              </span>
              <div className="flex gap-2">
                {!galleryIsDeleted ? (
                  <>
                    <button 
                      onClick={handleBulkPublish}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded text-[10px] uppercase cursor-pointer transition-all"
                    >
                      Bulk Publish
                    </button>
                    <button 
                      onClick={handleBulkSoftDelete}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-1.5 px-3 rounded text-[10px] uppercase cursor-pointer transition-all"
                    >
                      Move to Trash
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={handleBulkRestore}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded text-[10px] uppercase cursor-pointer transition-all"
                    >
                      Bulk Restore
                    </button>
                    <button 
                      onClick={handleBulkPermanentDelete}
                      className="bg-rose-700 hover:bg-rose-900 text-white font-bold py-1.5 px-3 rounded text-[10px] uppercase cursor-pointer transition-all"
                    >
                      Purge Permanently
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Media list grid */}
          {galleryItems.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border-gray rounded-xl text-text-light text-xs">
              <ImageIcon size={40} className="mx-auto mb-3 text-text-light/50" />
              No gallery items found matching filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galleryItems.map((item) => {
                const isSelected = selectedGalleryIds.includes(item._id);
                // Compute sizing representations
                const origMb = item.originalFile ? (item.originalFile.size / (1024 * 1024)).toFixed(2) : '0';
                const optMb = item.optimizedFile ? (item.optimizedFile.size / (1024 * 1024)).toFixed(2) : '0';
                const ratio = item.optimizedFile?.compressionRatio || 0;
                
                return (
                  <div key={item._id} className="border border-border-gray rounded-xl overflow-hidden shadow-sm flex flex-col justify-between bg-white relative group hover:shadow-md transition-all">
                    
                    {/* Checkbox select */}
                    <button 
                      onClick={() => {
                        if (isSelected) {
                          setSelectedGalleryIds(selectedGalleryIds.filter(id => id !== item._id));
                        } else {
                          setSelectedGalleryIds([...selectedGalleryIds, item._id]);
                        }
                      }}
                      className="absolute top-3 left-3 z-10 w-6 h-6 rounded bg-white/90 flex items-center justify-center border-none shadow cursor-pointer text-primary"
                    >
                      {isSelected ? <CheckSquare size={18} weight="fill" /> : <Square size={18} />}
                    </button>

                    {/* Image / Video preview wrapper */}
                    <div className="h-[150px] bg-primary relative overflow-hidden flex items-center justify-center text-white">
                      {item.thumbnail ? (
                        <img 
                          src={`http://localhost:5000${item.thumbnail}`} 
                          alt={item.title} 
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-300"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 opacity-60">
                          {item.mediaType === 'video' ? <Video size={36} /> : <ImageIcon size={36} />}
                          <span className="text-[9px] uppercase font-bold tracking-widest">No Thumbnail</span>
                        </div>
                      )}
                      
                      {/* Media format & category tags */}
                      <span className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-white text-[8px] font-extrabold px-2 py-0.5 rounded tracking-wide uppercase">
                        {item.category}
                      </span>
                      <span className="absolute bottom-2.5 right-2.5 bg-primary/90 text-accent text-[8px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wide">
                        {item.mediaType}
                      </span>

                      {/* Featured badge */}
                      {item.featured && (
                        <span className="absolute top-3 right-3 bg-amber-500 text-white text-[8px] font-bold py-0.5 px-2 rounded">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Meta info & Stats */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-primary leading-snug truncate" title={item.title}>
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-text-light line-clamp-1 h-3.5">
                          {item.description || 'No description provided.'}
                        </p>
                      </div>

                      {/* Compression stats */}
                      {item.optimizedFile && (
                        <div className="bg-soft-light p-2.5 rounded-lg border border-border-gray text-[10px] font-bold space-y-1">
                          <div className="flex justify-between text-text-light">
                            <span>Original size:</span>
                            <span className="text-primary">{origMb} MB</span>
                          </div>
                          <div className="flex justify-between text-text-light">
                            <span>Optimized WebP:</span>
                            <span className="text-primary">{optMb} MB</span>
                          </div>
                          <div className="flex justify-between border-t border-border-gray pt-1 mt-1 text-primary">
                            <span>Saved:</span>
                            <span className="text-emerald-500 font-extrabold">-{ratio}%</span>
                          </div>
                        </div>
                      )}

                      {/* State status badge & visibility */}
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-extrabold uppercase py-0.5 px-2 rounded ${
                          item.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {item.status}
                        </span>
                        <span className="text-[10px] text-text-light capitalize font-semibold">
                          {item.visibility} visibility
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2 border-t border-border-gray pt-3">
                        {!galleryIsDeleted ? (
                          <>
                            {item.status === 'draft' && (
                              <button 
                                onClick={async () => {
                                  setUploadedPreviewItem(item);
                                  setActiveModal('gallery');
                                }}
                                className="text-primary hover:text-accent bg-transparent border-none p-1 cursor-pointer"
                                title="Preview Media Stats"
                              >
                                <Eye size={16} />
                              </button>
                            )}
                            {item.status === 'draft' && (
                              <button 
                                onClick={async () => {
                                  setSelectedGalleryIds([item._id]);
                                  await handleBulkPublish();
                                }}
                                className="text-emerald-500 hover:text-emerald-700 bg-transparent border-none p-1 cursor-pointer"
                                title="Publish"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            <button 
                              onClick={() => handleSoftDelete(item._id)}
                              className="text-rose-500 hover:text-rose-700 bg-transparent border-none p-1 cursor-pointer"
                              title="Send to Trash"
                            >
                              <Trash size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleRestore(item._id)}
                              className="text-emerald-500 hover:text-emerald-700 bg-transparent border-none p-1 cursor-pointer"
                              title="Restore"
                            >
                              <ArrowCounterClockwise size={16} />
                            </button>
                            <button 
                              onClick={() => handlePermanentDelete(item._id)}
                              className="text-rose-700 hover:text-rose-900 bg-transparent border-none p-1 cursor-pointer"
                              title="Delete Permanently"
                            >
                              <Trash size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination bar */}
          {galleryTotalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-border-gray">
              <span className="text-xs font-semibold text-text-light">
                Showing page {galleryPage} of {galleryTotalPages} (Total {galleryTotal} records)
              </span>
              <div className="flex gap-2">
                <button
                  disabled={galleryPage <= 1}
                  onClick={() => setGalleryPage(galleryPage - 1)}
                  className="px-3.5 py-1.5 rounded border border-border-gray bg-white text-xs font-bold text-primary hover:bg-soft-light transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <button
                  disabled={galleryPage >= galleryTotalPages}
                  onClick={() => setGalleryPage(galleryPage + 1)}
                  className="px-3.5 py-1.5 rounded border border-border-gray bg-white text-xs font-bold text-primary hover:bg-soft-light transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* EVENTS TAB VIEW */}
      {activeTab === 'events' && (
        <div className="bg-white p-6 md:p-8 rounded-xl border border-border-gray shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-border-gray">
            <div>
              <h3 className="text-base font-bold text-primary">Event Calendars</h3>
              <p className="text-text-light text-xs mt-0.5">Publish and manage regional trials, tournaments, and events</p>
            </div>
            <button 
              onClick={() => setActiveModal('event')}
              className="bg-primary text-white hover:bg-accent hover:text-primary transition-all font-bold py-2.5 px-5 rounded-lg cursor-pointer text-xs flex items-center gap-1.5 self-start"
            >
              <Plus size={16} /> Schedule Event
            </button>
          </div>

          <div className="flex flex-col gap-5">
            {events.map((evt) => (
              <div key={evt.id} className="p-5 border border-border-gray rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left relative group">
                <div className="flex-1">
                  <span className="bg-accent/20 text-primary text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded tracking-wide">
                    {evt.category}
                  </span>
                  <h4 className="font-bold text-primary text-base mt-2 mb-1">{evt.title}</h4>
                  <div className="flex gap-4 text-xs font-semibold text-text-light mt-1 mb-2.5">
                    <span>Date: {evt.date}</span>
                    <span>Time: {evt.time}</span>
                    <span>Venue: {evt.venue}</span>
                  </div>
                  <p className="text-text-body text-xs leading-relaxed max-w-[650px]">{evt.description}</p>
                </div>
                <button
                  onClick={() => deleteEvent(evt.id)}
                  className="absolute top-5 right-5 text-text-light hover:text-rose-500 bg-transparent border-none p-1 cursor-pointer"
                  title="Cancel Event"
                >
                  <Trash size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ENQUIRIES TAB VIEW */}
      {activeTab === 'enquiries' && (
        <div className="bg-white p-6 md:p-8 rounded-xl border border-border-gray shadow-sm">
          <div className="pb-4 border-b border-border-gray mb-6 text-left">
            <h3 className="text-base font-bold text-primary">Support Enquiries</h3>
            <p className="text-text-light text-xs mt-0.5">Inbox for incoming questions and request emails</p>
          </div>

          <div className="flex flex-col gap-5">
            {enquiries.map((enq) => (
              <div key={enq.id} className="p-6 border border-border-gray rounded-xl text-left relative group flex flex-col md:flex-row gap-5">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl shrink-0">
                  <EnvelopeOpen size={22} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-primary text-base">{enq.name}</h4>
                    <span className="text-xs text-text-light font-semibold">{enq.date}</span>
                  </div>
                  <div className="flex gap-4 text-[11px] font-bold text-accent uppercase tracking-wider mt-1.5 mb-3 flex-wrap">
                    <span>Email: {enq.email}</span>
                    <span>Phone: {enq.phone}</span>
                    <span>Subject: {enq.subject}</span>
                  </div>
                  <p className="text-text-body text-sm leading-relaxed italic bg-soft-light p-4 rounded-lg border border-border-gray">
                    "{enq.message}"
                  </p>
                </div>
                <button
                  onClick={() => deleteEnquiry(enq.id)}
                  className="absolute top-5 right-5 text-text-light hover:text-rose-500 bg-transparent border-none p-1 cursor-pointer"
                  title="Dismiss Enquiry"
                >
                  <Trash size={16} />
                </button>
              </div>
            ))}

            {enquiries.length === 0 && (
              <div className="text-center py-16 text-text-light text-xs font-semibold">
                All enquiries processed. Inbox is empty!
              </div>
            )}
          </div>
        </div>
      )}

      {/* ACHIEVEMENTS TAB VIEW */}
      {activeTab === 'achievements' && (
        <div className="bg-white p-8 rounded-xl border border-border-gray shadow-sm text-left">
          <h3 className="text-base font-bold text-primary mb-2">Manage Achievements</h3>
          <p className="text-text-light text-xs mb-6">Edit regional and national trophies displayed on the landing page</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="p-5 border border-border-gray rounded-xl bg-soft-light">
              <span className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1">District Medals</span>
              <input type="number" value={milestones.districtMedals} onChange={(e) => setMilestones({ ...milestones, districtMedals: parseInt(e.target.value) || 0 })} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-white font-bold outline-none" />
            </div>
            <div className="p-5 border border-border-gray rounded-xl bg-soft-light">
              <span className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1">State Selection</span>
              <input type="number" value={milestones.stateSelection} onChange={(e) => setMilestones({ ...milestones, stateSelection: parseInt(e.target.value) || 0 })} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-white font-bold outline-none" />
            </div>
            <div className="p-5 border border-border-gray rounded-xl bg-soft-light">
              <span className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1">National Selections</span>
              <input type="number" value={milestones.nationalSelections} onChange={(e) => setMilestones({ ...milestones, nationalSelections: parseInt(e.target.value) || 0 })} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-white font-bold outline-none" />
            </div>
            <div className="p-5 border border-border-gray rounded-xl bg-soft-light">
              <span className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1">Certifications</span>
              <input type="number" value={milestones.certifications} onChange={(e) => setMilestones({ ...milestones, certifications: parseInt(e.target.value) || 0 })} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-white font-bold outline-none" />
            </div>
          </div>
          <button onClick={handleSaveMilestones} className="bg-primary text-white py-2.5 px-6 hover:bg-accent hover:text-primary transition-all font-bold rounded-lg text-xs cursor-pointer border-none shadow">
            Save Milestones
          </button>
        </div>
      )}

      {/* SETTINGS TAB VIEW */}
      {activeTab === 'settings' && (
        <div className="space-y-8 text-left">
          
          {/* Header section */}
          <div className="bg-white p-6 md:p-8 rounded-xl border border-border-gray shadow-sm">
            <h3 className="text-base font-bold text-primary flex items-center gap-2">
              <Gear size={22} className="text-accent" /> Academy Settings
            </h3>
            <p className="text-text-light text-xs mt-0.5">Manage administrative credentials, system variables, and profile information</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Personal Information Form */}
            <div className="bg-white p-6 md:p-8 rounded-xl border border-border-gray shadow-sm space-y-6">
              <div className="pb-3 border-b border-border-gray">
                <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                  <UserGear size={18} className="text-accent" /> Personal Information
                </h4>
                <p className="text-[10px] text-text-light mt-0.5">Update your display name, contact email, and active login username</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Full Display Name</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="E.g. Principal Sarita" 
                    value={profileForm.name} 
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} 
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    placeholder="E.g. admin@academy.com" 
                    value={profileForm.email} 
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} 
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Login Username</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="E.g. admin" 
                    value={profileForm.username} 
                    onChange={(e) => setProfileForm({...profileForm, username: e.target.value})} 
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSavingProfile}
                  className="bg-primary hover:bg-accent text-white hover:text-primary transition-all font-bold py-2.5 px-5 rounded-lg cursor-pointer text-xs disabled:opacity-60 flex items-center justify-center gap-1.5"
                >
                  {isSavingProfile ? 'Saving...' : 'Save Profile Details'}
                </button>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="bg-white p-6 md:p-8 rounded-xl border border-border-gray shadow-sm space-y-6">
              <div className="pb-3 border-b border-border-gray">
                <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                  <Lock size={18} className="text-accent" /> Change Password
                </h4>
                <p className="text-[10px] text-text-light mt-0.5">Change your password frequently to keep your administrative account secure</p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Current Password</label>
                  <input 
                    required 
                    type="password" 
                    placeholder="••••••••" 
                    value={passwordForm.currentPassword} 
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})} 
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">New Password</label>
                  <input 
                    required 
                    type="password" 
                    placeholder="Min 6 characters" 
                    value={passwordForm.newPassword} 
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} 
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Confirm New Password</label>
                  <input 
                    required 
                    type="password" 
                    placeholder="Re-type new password" 
                    value={passwordForm.confirmPassword} 
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} 
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isUpdatingPassword}
                  className="bg-primary hover:bg-accent text-white hover:text-primary transition-all font-bold py-2.5 px-5 rounded-lg cursor-pointer text-xs disabled:opacity-60 flex items-center justify-center gap-1.5"
                >
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>

          </div>

        </div>
      )}

      {/* OTHER PLACEHOLDER VIEWS */}
      {!['dashboard', 'students', 'coaches', 'gallery', 'events', 'enquiries', 'achievements', 'settings'].includes(activeTab) && (
        <div className="bg-white p-8 rounded-xl border border-border-gray shadow-sm text-left">
          <h3 className="text-base font-bold text-primary mb-2">Management Module</h3>
          <p className="text-text-light text-xs mb-6">Database configuration values for Category: <strong className="text-primary font-bold">{activeTab}</strong></p>
          <div className="border border-dashed border-border-gray rounded-xl p-10 text-center text-text-light text-xs">
            {activeTab === 'facilities' && <Buildings size={40} className="mx-auto mb-3 text-text-light" />}
            {activeTab === 'announcements' && <Megaphone size={40} className="mx-auto mb-3 text-text-light" />}
            {activeTab === 'documents' && <FilePlus size={40} className="mx-auto mb-3 text-text-light" />}
            {activeTab === 'content' && <Notebook size={40} className="mx-auto mb-3 text-text-light" />}
            {activeTab === 'users' && <Users size={40} className="mx-auto mb-3 text-text-light" />}
            This panel controls the active data values for <strong className="text-text-body font-bold capitalize">{activeTab}</strong> directly in the UI template.
          </div>
        </div>
      )}

      {/* QUICK ACTION MODALS LAYOUT */}
      
      {/* 1. Add Student Modal */}
      {activeModal === 'student' && (
        <div className="fixed inset-0 bg-black/15 backdrop-blur-sm z-[250] flex items-center justify-center p-5 animate-fade-in" onClick={() => setActiveModal(null)}>
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 md:p-8 text-left relative animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-5 right-5 text-text-light hover:text-primary cursor-pointer border-none bg-transparent" onClick={() => setActiveModal(null)}><X size={20} /></button>
            <h3 className="text-lg font-bold text-primary mb-5 flex items-center gap-2">
              <UserPlus size={20} className="text-accent" /> Add New Student
            </h3>
            <form onSubmit={handleAddStudent} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Student Name</label>
                <input required type="text" placeholder="E.g. Puja Kumari" value={studentForm.name} onChange={(e) => setStudentForm({...studentForm, name: e.target.value})} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Age</label>
                <input required type="number" min="5" max="25" placeholder="E.g. 14" value={studentForm.age} onChange={(e) => setStudentForm({...studentForm, age: e.target.value})} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Sport Discipline</label>
                <select value={studentForm.sport} onChange={(e) => setStudentForm({...studentForm, sport: e.target.value})} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all">
                  <option value="Football">Football</option>
                  <option value="Handball">Handball</option>
                  <option value="Rugby">Rugby</option>
                  <option value="Athletics">Athletics</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Medals Won</label>
                <input type="number" min="0" placeholder="E.g. 3" value={studentForm.medalNumber} onChange={(e) => setStudentForm({...studentForm, medalNumber: e.target.value})} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Profile Pic / Emoji Avatar</label>
                <input type="text" placeholder="E.g. 🎓 or 👩‍🎓" value={studentForm.avatar} onChange={(e) => setStudentForm({...studentForm, avatar: e.target.value})} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all" />
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-accent hover:text-primary transition-all text-white font-bold py-3 mt-3 rounded-lg cursor-pointer text-sm">
                Save Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add Coach Modal */}
      {activeModal === 'coach' && (
        <div className="fixed inset-0 bg-black/15 backdrop-blur-sm z-[250] flex items-center justify-center p-5 animate-fade-in" onClick={() => setActiveModal(null)}>
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 md:p-8 text-left relative animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-5 right-5 text-text-light hover:text-primary cursor-pointer border-none bg-transparent" onClick={() => setActiveModal(null)}><X size={20} /></button>
            <h3 className="text-lg font-bold text-primary mb-5 flex items-center gap-2">
              <Plus size={20} className="text-accent" /> Add Coach
            </h3>
            <form onSubmit={handleAddCoach} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Full Name</label>
                <input required type="text" placeholder="E.g. Coach Sarita" value={coachForm.name} onChange={(e) => setCoachForm({...coachForm, name: e.target.value})} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Role Title</label>
                <input required type="text" placeholder="E.g. Head Athletics Coach" value={coachForm.role} onChange={(e) => setCoachForm({...coachForm, role: e.target.value})} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Certifications</label>
                <input required type="text" placeholder="E.g. NIS Certified, ex-athlete" value={coachForm.specialization} onChange={(e) => setCoachForm({...coachForm, specialization: e.target.value})} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Experience (Years)</label>
                <input required type="number" min="1" max="40" placeholder="E.g. 10" value={coachForm.experience} onChange={(e) => setCoachForm({...coachForm, experience: e.target.value})} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Bio Description</label>
                <textarea required rows={3} placeholder="Coach profile info..." value={coachForm.bio} onChange={(e) => setCoachForm({...coachForm, bio: e.target.value})} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all" />
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-accent hover:text-primary transition-all text-white font-bold py-3 mt-3 rounded-lg cursor-pointer text-sm">
                Save Record
              </button>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'gallery' && (
        <div className="fixed inset-0 bg-black/15 backdrop-blur-sm z-[250] flex items-center justify-center p-5 animate-fade-in" onClick={() => setActiveModal(null)}>
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl p-6 md:p-8 text-left relative animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-5 right-5 text-text-light hover:text-primary cursor-pointer border-none bg-transparent" onClick={() => {
              setActiveModal(null);
              resetGalleryForm();
            }}><X size={20} /></button>

            {/* 1. Preview View Mode */}
            {uploadedPreviewItem ? (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest block mb-1">Step 2: Preview & Optimization Results</span>
                  <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                    <Eye size={20} className="text-accent" /> Media Optimization Report
                  </h3>
                </div>

                {/* Media Preview Box */}
                <div className="h-[260px] bg-slate-900 rounded-lg overflow-hidden relative flex items-center justify-center">
                  {uploadedPreviewItem.mediaType === 'video' ? (
                    <video 
                      src={`http://localhost:5000${uploadedPreviewItem.optimizedFile?.path || uploadedPreviewItem.originalFile.path}`} 
                      className="w-full h-full object-contain" 
                      controls 
                    />
                  ) : (
                    <img 
                      src={`http://localhost:5000${uploadedPreviewItem.optimizedFile?.path || uploadedPreviewItem.originalFile.path}`} 
                      alt="Optimized preview" 
                      className="w-full h-full object-contain" 
                    />
                  )}
                </div>

                {/* Stats Table */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-soft-light p-4 rounded-xl border border-border-gray text-xs font-bold">
                  <div className="space-y-2.5">
                    <h4 className="text-[10px] text-text-light uppercase tracking-wider">Metadata Info</h4>
                    <div className="flex justify-between border-b border-border-gray/50 pb-1">
                      <span className="text-text-light font-semibold">Title:</span>
                      <span className="text-primary">{uploadedPreviewItem.title}</span>
                    </div>
                    <div className="flex justify-between border-b border-border-gray/50 pb-1">
                      <span className="text-text-light font-semibold">Category:</span>
                      <span className="text-primary">{uploadedPreviewItem.category}</span>
                    </div>
                    <div className="flex justify-between border-b border-border-gray/50 pb-1">
                      <span className="text-text-light font-semibold">Format:</span>
                      <span className="text-primary uppercase">{uploadedPreviewItem.mediaType}</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="text-text-light font-semibold">Visibility:</span>
                      <span className="text-primary capitalize">{uploadedPreviewItem.visibility}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <h4 className="text-[10px] text-text-light uppercase tracking-wider">Compression Statistics</h4>
                    <div className="flex justify-between border-b border-border-gray/50 pb-1">
                      <span className="text-text-light font-semibold">Original Size:</span>
                      <span className="text-primary">{(uploadedPreviewItem.originalFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                    <div className="flex justify-between border-b border-border-gray/50 pb-1">
                      <span className="text-text-light font-semibold">Optimized WebP:</span>
                      <span className="text-primary">{(uploadedPreviewItem.optimizedFile?.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                    <div className="flex justify-between border-b border-border-gray/50 pb-1">
                      <span className="text-text-light font-semibold">Max Resolution:</span>
                      <span className="text-primary">
                        {uploadedPreviewItem.optimizedFile?.dimensions?.width || '1920'}x
                        {uploadedPreviewItem.optimizedFile?.dimensions?.height || '1080'} px
                      </span>
                    </div>
                    <div className="flex justify-between pb-1 text-emerald-600">
                      <span>Saved File Space:</span>
                      <span className="font-extrabold bg-emerald-50 px-2 py-0.5 rounded">-{uploadedPreviewItem.optimizedFile?.compressionRatio}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-border-gray">
                  <button 
                    onClick={() => {
                      setActiveModal(null);
                      resetGalleryForm();
                    }}
                    className="py-2.5 px-5 rounded-lg border border-border-gray bg-white hover:bg-soft-light text-primary font-bold text-xs cursor-pointer transition-all"
                  >
                    Keep as Draft / Cancel
                  </button>
                  <button 
                    onClick={handlePublishPreviewItem}
                    className="py-2.5 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer transition-all"
                  >
                    Publish to Website
                  </button>
                </div>
              </div>
            ) : (
              // 2. Upload / Input Fields form
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <ImageIcon size={20} className="text-accent" /> Upload & Optimize Media
                </h3>
                
                <form onSubmit={(e) => handleUploadOrPreview(e, galleryFormInputs.status === 'published')} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Title *</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="E.g. Under-19 Football Champions" 
                      value={galleryFormInputs.title} 
                      onChange={(e) => setGalleryFormInputs({...galleryFormInputs, title: e.target.value})} 
                      className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                    />
                  </div>

                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Description</label>
                    <textarea 
                      placeholder="Enter a brief caption describing this gallery upload..." 
                      value={galleryFormInputs.description} 
                      onChange={(e) => setGalleryFormInputs({...galleryFormInputs, description: e.target.value})} 
                      className="w-full py-2 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none h-16 resize-none focus:bg-white focus:border-primary transition-all font-semibold" 
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Category Tag</label>
                    <select 
                      value={galleryFormInputs.category} 
                      onChange={(e) => setGalleryFormInputs({...galleryFormInputs, category: e.target.value})} 
                      className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-white outline-none focus:border-primary transition-all font-semibold"
                    >
                      <option value="Tournament">Tournament</option>
                      <option value="Training Sessions">Training Sessions</option>
                      <option value="Academy Events">Academy Events</option>
                      <option value="Student Achievements">Student Achievements</option>
                      <option value="Facilities">Facilities</option>
                      <option value="Summer Camp">Summer Camp</option>
                      <option value="Workshops">Workshops</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Media Format</label>
                    <select 
                      value={galleryFormInputs.mediaType} 
                      onChange={(e) => setGalleryFormInputs({...galleryFormInputs, mediaType: e.target.value as 'image' | 'video'})} 
                      className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-white outline-none focus:border-primary transition-all font-semibold"
                    >
                      <option value="image">Image File (JPG, PNG, WEBP)</option>
                      <option value="video">Video File (MP4, MOV)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Upload File * (Max Image: 10MB, Video: 300MB)</label>
                    <input 
                      required 
                      type="file" 
                      accept={galleryFormInputs.mediaType === 'image' ? 'image/*' : 'video/*'}
                      onChange={(e) => {
                        const file = e.target.files ? e.target.files[0] : null;
                        setGalleryFormFiles({...galleryFormFiles, media: file});
                      }}
                      className="w-full py-1.5 px-2 border border-border-gray rounded text-xs bg-white focus:border-primary transition-all font-semibold cursor-pointer"
                    />
                  </div>

                  {galleryFormInputs.mediaType === 'video' && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Video Thumbnail (Optional WebP/JPG)</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files ? e.target.files[0] : null;
                          setGalleryFormFiles({...galleryFormFiles, thumbnail: file});
                        }}
                        className="w-full py-1.5 px-2 border border-border-gray rounded text-xs bg-white focus:border-primary transition-all font-semibold cursor-pointer"
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Visibility Setting</label>
                    <select 
                      value={galleryFormInputs.visibility} 
                      onChange={(e) => setGalleryFormInputs({...galleryFormInputs, visibility: e.target.value as 'public' | 'private'})} 
                      className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-white outline-none focus:border-primary transition-all font-semibold"
                    >
                      <option value="public">Public (Visible on site)</option>
                      <option value="private">Private (Staff only)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Initial Publish Action</label>
                    <select 
                      value={galleryFormInputs.status} 
                      onChange={(e) => setGalleryFormInputs({...galleryFormInputs, status: e.target.value as 'draft' | 'published'})} 
                      className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-white outline-none focus:border-primary transition-all font-semibold"
                    >
                      <option value="draft">Save as Draft (Allows optimization preview)</option>
                      <option value="published">Publish Directly (Visible immediately)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2.5 px-1 py-1 md:col-span-2">
                    <input 
                      type="checkbox" 
                      id="featuredHome" 
                      checked={galleryFormInputs.featured} 
                      onChange={(e) => setGalleryFormInputs({...galleryFormInputs, featured: e.target.checked})}
                      className="w-4 h-4 text-primary border-border-gray rounded focus:ring-primary cursor-pointer" 
                    />
                    <label htmlFor="featuredHome" className="text-xs font-bold text-primary cursor-pointer select-none">
                      Featured on Public Homepage Carousel
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-border-gray md:col-span-2">
                    <button 
                      type="button" 
                      onClick={() => {
                        setActiveModal(null);
                        resetGalleryForm();
                      }}
                      className="py-2.5 px-5 rounded-lg border border-border-gray bg-white hover:bg-soft-light text-primary font-bold text-xs cursor-pointer transition-all"
                    >
                      Cancel
                    </button>

                    {galleryFormInputs.status === 'draft' ? (
                      <button 
                        type="submit" 
                        disabled={isUploading}
                        className="py-2.5 px-5 rounded-lg bg-primary hover:bg-accent text-white hover:text-primary disabled:opacity-60 font-bold text-xs cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        {isUploading ? 'Optimizing...' : 'Upload & Save Draft'}
                      </button>
                    ) : (
                      <button 
                        type="submit" 
                        disabled={isUploading}
                        className="py-2.5 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-60 font-bold text-xs cursor-pointer transition-all"
                      >
                        {isUploading ? 'Optimizing...' : 'Publish Directly'}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Add Event Modal */}
      {activeModal === 'event' && (
        <div className="fixed inset-0 bg-black/15 backdrop-blur-sm z-[250] flex items-center justify-center p-5 animate-fade-in" onClick={() => setActiveModal(null)}>
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 md:p-8 text-left relative animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-5 right-5 text-text-light hover:text-primary cursor-pointer border-none bg-transparent" onClick={() => setActiveModal(null)}><X size={20} /></button>
            <h3 className="text-lg font-bold text-primary mb-5 flex items-center gap-2">
              <CalendarPlus size={20} className="text-accent" /> Schedule New Event
            </h3>
            <form onSubmit={handleAddEvent} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Event Title</label>
                <input required type="text" placeholder="E.g. District Athletics trials" value={eventForm.title} onChange={(e) => setEventForm({...eventForm, title: e.target.value})} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Category</label>
                <select value={eventForm.category} onChange={(e) => setEventForm({...eventForm, category: e.target.value})} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all">
                  <option value="tournaments">Tournaments</option>
                  <option value="camps">Summer/Winter Camps</option>
                  <option value="workshops">Workshops & Clinics</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Date</label>
                  <input required type="date" value={eventForm.date} onChange={(e) => setEventForm({...eventForm, date: e.target.value})} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Time</label>
                  <input required type="text" placeholder="09:00 AM" value={eventForm.time} onChange={(e) => setEventForm({...eventForm, time: e.target.value})} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Venue Location</label>
                <input required type="text" placeholder="Main Complex, Siwan" value={eventForm.venue} onChange={(e) => setEventForm({...eventForm, venue: e.target.value})} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Description</label>
                <textarea required rows={3} placeholder="Event info..." value={eventForm.description} onChange={(e) => setEventForm({...eventForm, description: e.target.value})} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all" />
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-accent hover:text-primary transition-all text-white font-bold py-3 mt-3 rounded-lg cursor-pointer text-sm">
                Schedule Event
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. Email Change Verification Modal */}
      {showEmailVerifyModal && (
        <div className="fixed inset-0 bg-black/15 backdrop-blur-sm z-[250] flex items-center justify-center p-5 animate-fade-in" onClick={() => setShowEmailVerifyModal(false)}>
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 md:p-8 text-left relative animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-5 right-5 text-text-light hover:text-primary cursor-pointer border-none bg-transparent" onClick={() => {
              setShowEmailVerifyModal(false);
              setEmailVerifyCode('');
            }}><X size={20} /></button>
            <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
              <EnvelopeOpen size={20} className="text-accent" /> Verify Email Address
            </h3>
            <p className="text-xs text-text-body mb-5 leading-relaxed">
              We have sent a verification code to <strong className="text-primary font-bold">{tempEmailToVerify}</strong>. Please enter the code below to complete updating your email address.
            </p>

            <form onSubmit={handleVerifyEmailCode} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">6-Digit Code</label>
                <input 
                  required 
                  type="text" 
                  maxLength={6} 
                  placeholder="Enter 6-digit code" 
                  value={emailVerifyCode} 
                  onChange={(e) => setEmailVerifyCode(e.target.value)} 
                  className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-bold tracking-widest text-center" 
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isVerifyingEmail} 
                className="w-full bg-primary hover:bg-accent hover:text-primary transition-all text-white font-bold py-3 mt-3 rounded-lg cursor-pointer text-sm disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isVerifyingEmail ? 'VERIFYING...' : 'CONFIRM EMAIL CHANGE'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
