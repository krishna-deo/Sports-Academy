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
  Eye,
  Trophy,
  Pencil,
  ArrowClockwise,
  ArrowCounterClockwise,
  DotsThreeVertical
} from '@phosphor-icons/react';

interface AdminViewsProps {
  activeTab: string;
}

interface MockStudent {
  id: string;
  studentId?: string;
  fullName?: string;
  name: string;
  age: number;
  sport: string;
  primarySport?: string;
  secondarySports?: string[];
  joined: string;
  admissionDate?: string;
  medalNumber?: number;
  avatar?: string;
  gender?: string;
  residency?: string;
  status?: string;
  isDeleted?: boolean;
  showOnPublicWebsite?: boolean;
  bloodGroup?: string;
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  guardian?: {
    name?: string;
    relationship?: string;
    phone?: string;
    emergencyContact?: string;
    address?: string;
  };
  batch?: string;
  coach?: string;
  hostelRoom?: string;
  education?: {
    schoolName?: string;
    className?: string;
    academicInfo?: string;
  };
  achievements?: Array<{
    title: string;
    competition: string;
    position: string;
    year: number;
    description: string;
  }>;
  documents?: Array<{
    name: string;
    path: string;
    uploadedAt: string;
  }>;
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
  const [galleryStatus, setGalleryStatus] = useState<string>(''); // empty means both draft and published
  const [galleryIsDeleted, setGalleryIsDeleted] = useState<boolean>(false); // toggle Trash Bin mode
  const [selectedGalleryIds, setSelectedGalleryIds] = useState<string[]>([]);

  // Event Gallery States
  const [galleryStats, setGalleryStats] = useState({
    totalEvents: 0,
    totalImages: 0,
    publishedEvents: 0,
    draftEvents: 0
  });

  const [eventGalleryForm, setEventGalleryForm] = useState({
    name: '',
    category: 'Events',
    date: '',
    location: '',
    description: '',
    status: 'draft' as 'draft' | 'published',
    mediaType: 'image' as 'image' | 'video',
    videoUrl: ''
  });

  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [selectedPhotoPreviews, setSelectedPhotoPreviews] = useState<string[]>([]);
  const [coverIndex, setCoverIndex] = useState<number>(0);
  const [customCoverImage, setCustomCoverImage] = useState<File | null>(null);
  const [customCoverPreview, setCustomCoverPreview] = useState<string>('');

  const [editingEventGallery, setEditingEventGallery] = useState<any | null>(null);
  const [existingPhotos, setExistingPhotos] = useState<any[]>([]);
  const [deletedExistingPhotos, setDeletedExistingPhotos] = useState<string[]>([]);
  const [showQuickViewEvent, setShowQuickViewEvent] = useState<any | null>(null);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [galleryDefaultSettings, setGalleryDefaultSettings] = useState({
    visibility: (localStorage.getItem('rlbsa_gallery_default_visibility') || 'public') as 'public' | 'private',
    status: (localStorage.getItem('rlbsa_gallery_default_status') || 'published') as 'draft' | 'published',
    featured: localStorage.getItem('rlbsa_gallery_default_featured') === 'true'
  });

  // Modal Control States
  const [activeModal, setActiveModal] = useState<string | null>(null); // 'student' | 'coach' | 'gallery' | 'event'
  const [successToast, setSuccessToast] = useState<string>('');
  const [confirmationModal, setConfirmationModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    show: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Form Fields State
  // Student Management Module states
  const [studentStats, setStudentStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    residentStudents: 0,
    nonResidentStudents: 0,
    newAdmissions: 0
  });
  const [studentPage, setStudentPage] = useState<number>(1);
  const [studentTotalPages, setStudentTotalPages] = useState<number>(1);
  const [studentTotalItems, setStudentTotalItems] = useState<number>(0);
  const studentLimit = 10;
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [studentSportFilter, setStudentSportFilter] = useState<string>('');
  const [studentGenderFilter, setStudentGenderFilter] = useState<string>('');
  const [studentResidencyFilter, setStudentResidencyFilter] = useState<string>('');
  const [studentBatchFilter, setStudentBatchFilter] = useState<string>('');
  const [studentCoachFilter, setStudentCoachFilter] = useState<string>('');
  const [studentStatusFilter, setStudentStatusFilter] = useState<string>('');
  const [studentYearFilter, setStudentYearFilter] = useState<string>('');
  const [studentShowDeleted, setStudentShowDeleted] = useState<boolean>(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [viewingStudentProfile, setViewingStudentProfile] = useState<any | null>(null);
  const [editingStudentProfile, setEditingStudentProfile] = useState<any | null>(null);
  
  // Form Fields State
  const [studentForm, setStudentForm] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'girl',
    bloodGroup: '',
    phone: '',
    email: '',
    address: '',
    guardianName: '',
    guardianRelationship: '',
    guardianPhone: '',
    guardianEmergency: '',
    guardianAddress: '',
    admissionDate: new Date().toISOString().split('T')[0],
    primarySport: 'Football',
    secondarySports: [] as string[],
    batch: '',
    coach: '',
    residency: 'resident',
    hostelRoom: '',
    schoolName: '',
    className: '',
    academicInfo: '',
    achievements: [] as any[], // array of { title, competition, position, year, description }
    status: 'Active',
    showOnPublicWebsite: false
  });
  const [studentPhotoFile, setStudentPhotoFile] = useState<File | null>(null);
  const [studentPhotoPreview, setStudentPhotoPreview] = useState<string>('');
  const [studentDocFiles, setStudentDocFiles] = useState<{ file: File; name: string }[]>([]);
  const [deletedDocuments, setDeletedDocuments] = useState<string[]>([]);
  const [coachForm, setCoachForm] = useState({ name: '', role: '', specialization: '', experience: '', bio: '', avatar: '👨‍🏫' });
  const [editingCoach, setEditingCoach] = useState<any | null>(null);
  const [openCoachDropdown, setOpenCoachDropdown] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState({ title: '', category: 'tournaments', date: '', time: '', venue: '', description: '' });
  const [profileForm, setProfileForm] = useState({ name: '', email: '', username: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState<boolean>(false);
  const [showEmailVerifyModal, setShowEmailVerifyModal] = useState<boolean>(false);
  const [emailVerifyCode, setEmailVerifyCode] = useState<string>('');
  const [tempEmailToVerify, setTempEmailToVerify] = useState<string>('');
  const [isVerifyingEmail, setIsVerifyingEmail] = useState<boolean>(false);

  // Founders & Directors states
  const [team, setTeam] = useState<any[]>([]);
  const [teamForm, setTeamForm] = useState({ name: '', role: '', bio: '', image: '', objectPosition: 'center 15%' });
  const [editingTeamMember, setEditingTeamMember] = useState<any | null>(null);

  // Success Stories states
  const [stories, setStories] = useState<any[]>([]);
  const [activeStudentFormTab, setActiveStudentFormTab] = useState<string>('personal');
  const [activeProfileViewTab, setActiveProfileViewTab] = useState<string>('overview');
  const [storyForm, setStoryForm] = useState({ name: '', sport: 'Football', achievement: '', description: '', quote: '', image: '', joined: '', age: '', medals: '', objectPosition: 'center' });
  const [editingStory, setEditingStory] = useState<any | null>(null);

  // Image Select & Crop states
  const [showCropperModal, setShowCropperModal] = useState<boolean>(false);
  const [cropperSource, setCropperSource] = useState<string>('');
  const [cropZoom, setCropZoom] = useState<number>(1);
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [isDragMoving, setIsDragMoving] = useState<boolean>(false);
  const [dragStartPoint, setDragStartPoint] = useState({ x: 0, y: 0 });
  const [dragInitialOffset, setDragInitialOffset] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 });
  const [cropperTab, setCropperTab] = useState<'upload' | 'gallery'>('upload');
  const [croppingTarget, setCroppingTarget] = useState<'student' | 'team' | 'story' | 'coach'>('story');

  const token = localStorage.getItem('rlbsa_admin_token') || '';

  const fetchStudents = async () => {
    if (!token) return;
    try {
      const queryParams = new URLSearchParams({
        page: String(studentPage),
        limit: String(studentLimit),
        search: studentSearch,
        sport: studentSportFilter,
        gender: studentGenderFilter,
        residency: studentResidencyFilter,
        batch: studentBatchFilter,
        coach: studentCoachFilter,
        status: studentStatusFilter,
        admissionYear: studentYearFilter,
        showDeleted: String(studentShowDeleted)
      });
      const res = await fetch(`http://localhost:5000/api/admin/students?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStudents(data.items || []);
        setStudentTotalPages(data.totalPages || 1);
        setStudentTotalItems(data.totalItems || 0);
        if (data.stats) {
          setStudentStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Failed to query student roster:", err);
    }
  };

  const fetchData = async () => {
    try {
      // Fetch public content
      const [cRes, gRes, eRes, mRes, tRes] = await Promise.all([
        fetch('http://localhost:5000/api/public/coaches'),
        fetch('http://localhost:5000/api/public/gallery'),
        fetch('http://localhost:5000/api/public/events'),
        fetch('http://localhost:5000/api/public/milestones'),
        fetch('http://localhost:5000/api/public/team')
      ]);
      if (cRes.ok) setCoaches(await cRes.json());
      if (gRes.ok) {
        const data = await gRes.json();
        setDashboardGallery(data.items || []);
      }
      if (eRes.ok) setEvents(await eRes.json());
      if (mRes.ok) setMilestones(await mRes.json());
      if (tRes.ok) setTeam(await tRes.json());

      // Fetch protected admin data if token exists
      if (token) {
        const [enqRes, pRes, storiesRes] = await Promise.all([
          fetch('http://localhost:5000/api/admin/enquiries', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/admin/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/admin/success-stories', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        if (enqRes.status === 401 || enqRes.status === 403) {
          localStorage.removeItem('rlbsa_admin_token');
          window.location.reload();
          return;
        }
        if (enqRes.ok) setEnquiries(await enqRes.json());
        if (storiesRes.ok) setStories(await storiesRes.json());
        if (pRes.ok) {
          const profileData = await pRes.json();
          setProfileForm({
            name: profileData.name || '',
            email: profileData.email || '',
            username: profileData.username || ''
          });
        }
        
        // Also fetch students initially
        fetchStudents();
      }
    } catch (err) {
      console.error("Error loading backend api data:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [
    studentPage, 
    studentLimit, 
    studentSearch, 
    studentSportFilter, 
    studentGenderFilter, 
    studentResidencyFilter, 
    studentBatchFilter, 
    studentCoachFilter, 
    studentStatusFilter, 
    studentYearFilter, 
    studentShowDeleted
  ]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const triggerSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Success Stories Action Handlers
  const handleAddOrUpdateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingStory 
        ? `http://localhost:5000/api/admin/success-stories/${editingStory.id}`
        : 'http://localhost:5000/api/admin/success-stories';
      const method = editingStory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(storyForm)
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('rlbsa_admin_token');
        window.location.reload();
        return;
      }

      const data = await response.json();
      if (response.ok && data.success) {
        if (editingStory) {
          setStories(stories.map(s => s.id === editingStory.id ? data.story : s));
          triggerSuccess('Success story updated.');
        } else {
          setStories([data.story, ...stories]);
          triggerSuccess('Success story added.');
        }
        setActiveModal(null);
        setEditingStory(null);
        setStoryForm({ name: '', sport: 'Football', achievement: '', description: '', quote: '', image: '', joined: '', age: '', medals: '', objectPosition: 'center' });
      } else {
        alert(data.error || "Failed to save record.");
      }
    } catch (err) {
      alert("Error contacting the backend server.");
    }
  };

  const deleteStory = async (id: string) => {
    setConfirmationModal({
      show: true,
      title: "Delete Success Story",
      message: "Are you sure you want to delete this success story?",
      onConfirm: async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/admin/success-stories/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          if (response.ok && data.success) {
            setStories(stories.filter(s => s.id !== id));
            triggerSuccess('Success story deleted.');
          } else {
            alert(data.error || "Error deleting success story.");
          }
        } catch (err) {
          alert("Error contacting the backend server.");
        }
      }
    });
  };

  const openEditStoryModal = (story: any) => {
    setEditingStory(story);
    setStoryForm({
      name: story.name,
      sport: story.sport || 'Football',
      achievement: story.achievement || '',
      description: story.description || '',
      quote: story.quote || '',
      image: story.image || '',
      joined: story.joined || '',
      age: story.age?.toString() || '',
      medals: story.medals?.toString() || '',
      objectPosition: story.objectPosition || 'center'
    });
    setActiveModal('success-story');
  };

  // Image Cropper Handlers
  const handleImageLoaded = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
    const vw = croppingTarget === 'student' ? 300 : 400;
    const vh = 300;
    const baseScale = Math.max(vw / img.naturalWidth, vh / img.naturalHeight);
    const displayedWidth = img.naturalWidth * baseScale;
    const displayedHeight = img.naturalHeight * baseScale;
    setCropPosition({
      x: (vw - displayedWidth) / 2,
      y: (vh - displayedHeight) / 2
    });
    setCropZoom(1);
  };

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragMoving(true);
    setDragStartPoint({ x: e.clientX, y: e.clientY });
    setDragInitialOffset({ x: cropPosition.x, y: cropPosition.y });
  };

  const onDrag = (e: React.MouseEvent) => {
    if (!isDragMoving) return;
    const dx = e.clientX - dragStartPoint.x;
    const dy = e.clientY - dragStartPoint.y;
    setCropPosition({
      x: dragInitialOffset.x + dx,
      y: dragInitialOffset.y + dy
    });
  };

  const stopDrag = () => {
    setIsDragMoving(false);
  };

  const startDragTouch = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setIsDragMoving(true);
    setDragStartPoint({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    setDragInitialOffset({ x: cropPosition.x, y: cropPosition.y });
  };

  const onDragTouch = (e: React.TouchEvent) => {
    if (!isDragMoving || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartPoint.x;
    const dy = e.touches[0].clientY - dragStartPoint.y;
    setCropPosition({
      x: dragInitialOffset.x + dx,
      y: dragInitialOffset.y + dy
    });
  };

  const applyCrop = () => {
    if (!cropperSource) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const vw = croppingTarget === 'student' ? 300 : 400;
      const vh = 300;
      const cw = croppingTarget === 'student' ? 600 : 800;
      const ch = 600;

      const canvas = document.createElement('canvas');
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, cw, ch);
      const baseScale = Math.max(vw / img.naturalWidth, vh / img.naturalHeight);
      const S_final = baseScale * cropZoom;
      const M = cw / vw;
      const dw = img.naturalWidth * S_final * M;
      const dh = img.naturalHeight * S_final * M;
      const dx = cropPosition.x * M;
      const dy = cropPosition.y * M;
      ctx.drawImage(img, dx, dy, dw, dh);
      try {
        const croppedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        if (croppingTarget === 'student') {
          fetch(croppedBase64)
            .then(res => res.blob())
            .then(blob => {
              const file = new File([blob], "student_cropped.jpg", { type: "image/jpeg" });
              setStudentPhotoFile(file);
              setStudentPhotoPreview(croppedBase64);
            });
        } else if (croppingTarget === 'team') {
          setTeamForm({ ...teamForm, image: croppedBase64 });
        } else if (croppingTarget === 'coach') {
          setCoachForm({ ...coachForm, avatar: croppedBase64 });
        } else {
          setStoryForm({ ...storyForm, image: croppedBase64 });
        }
        setShowCropperModal(false);
      } catch (err) {
        console.error("Canvas export failed:", err);
        alert("Unable to crop this image due to cross-origin security restrictions. Try using a local image upload instead.");
      }
    };
    img.src = cropperSource;
  };

  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCropperSource(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Add Action Handlers
  const resetStudentForm = () => {
    setStudentForm({
      fullName: '',
      dateOfBirth: '',
      gender: 'girl',
      bloodGroup: '',
      phone: '',
      email: '',
      address: '',
      guardianName: '',
      guardianRelationship: '',
      guardianPhone: '',
      guardianEmergency: '',
      guardianAddress: '',
      admissionDate: new Date().toISOString().split('T')[0],
      primarySport: 'Football',
      secondarySports: [],
      batch: '',
      coach: '',
      residency: 'resident',
      hostelRoom: '',
      schoolName: '',
      className: '',
      academicInfo: '',
      achievements: [],
      status: 'Active',
      showOnPublicWebsite: false
    });
    setStudentPhotoFile(null);
    setStudentPhotoPreview('');
    setStudentDocFiles([]);
    setDeletedDocuments([]);
    setEditingStudentProfile(null);
    setActiveModal(null);
    setActiveStudentFormTab('personal');
  };

  const handleEditStudentClick = (student: any) => {
    setEditingStudentProfile(student);
    setStudentForm({
      fullName: student.fullName || student.name || '',
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
      gender: student.gender || 'girl',
      bloodGroup: student.bloodGroup || '',
      phone: student.contact?.phone || '',
      email: student.contact?.email || '',
      address: student.contact?.address || '',
      guardianName: student.guardian?.name || '',
      guardianRelationship: student.guardian?.relationship || '',
      guardianPhone: student.guardian?.phone || '',
      guardianEmergency: student.guardian?.emergencyContact || '',
      guardianAddress: student.guardian?.address || '',
      admissionDate: student.admissionDate ? student.admissionDate.split('T')[0] : (student.joined || ''),
      primarySport: student.primarySport || student.sport || 'Football',
      secondarySports: student.secondarySports || [],
      batch: student.batch || '',
      coach: student.coach || '',
      residency: student.residency || 'resident',
      hostelRoom: student.hostelRoom || '',
      schoolName: student.education?.schoolName || '',
      className: student.education?.className || '',
      academicInfo: student.education?.academicInfo || '',
      achievements: student.achievements || [],
      status: student.status || 'Active',
      showOnPublicWebsite: student.showOnPublicWebsite || false
    });
    setStudentPhotoPreview(student.avatar && student.avatar.startsWith('/') ? `http://localhost:5000${student.avatar}` : student.avatar || '');
    setStudentPhotoFile(null);
    setStudentDocFiles([]);
    setDeletedDocuments([]);
    setActiveModal('student-edit');
  };

  const handleSaveStudent = async (e: React.FormEvent, forceStatus?: string) => {
    e.preventDefault();
    if (!studentForm.fullName.trim() || !studentForm.dateOfBirth || !studentForm.primarySport || !studentForm.admissionDate) {
      alert("Please fill in all required fields.");
      return;
    }

    const isEdit = !!editingStudentProfile;
    const url = isEdit 
      ? `http://localhost:5000/api/admin/students/${editingStudentProfile.id}`
      : 'http://localhost:5000/api/admin/students';
    const method = isEdit ? 'PUT' : 'POST';

    setIsUploading(true);
    try {
      const formData = new FormData();
      
      formData.append('fullName', studentForm.fullName);
      formData.append('dateOfBirth', studentForm.dateOfBirth);
      formData.append('gender', studentForm.gender);
      formData.append('bloodGroup', studentForm.bloodGroup);
      formData.append('phone', studentForm.phone);
      formData.append('email', studentForm.email);
      formData.append('address', studentForm.address);
      
      formData.append('guardianName', studentForm.guardianName);
      formData.append('guardianRelationship', studentForm.guardianRelationship);
      formData.append('guardianPhone', studentForm.guardianPhone);
      formData.append('guardianEmergency', studentForm.guardianEmergency);
      formData.append('guardianAddress', studentForm.guardianAddress);
      
      formData.append('admissionDate', studentForm.admissionDate);
      formData.append('primarySport', studentForm.primarySport);
      formData.append('batch', studentForm.batch);
      formData.append('coach', studentForm.coach);
      formData.append('residency', studentForm.residency);
      formData.append('hostelRoom', studentForm.hostelRoom);
      
      formData.append('schoolName', studentForm.schoolName);
      formData.append('className', studentForm.className);
      formData.append('academicInfo', studentForm.academicInfo);
      
      formData.append('status', forceStatus || studentForm.status);
      formData.append('showOnPublicWebsite', String(studentForm.showOnPublicWebsite));
      formData.append('secondarySports', JSON.stringify(studentForm.secondarySports));
      formData.append('achievements', JSON.stringify(studentForm.achievements));

      if (studentPhotoFile) {
        formData.append('avatar', studentPhotoFile);
      }

      studentDocFiles.forEach((doc, index) => {
        formData.append('documents', doc.file);
        formData.append(`docName_${index}`, doc.name);
      });

      if (isEdit) {
        formData.append('deletedDocPaths', JSON.stringify(deletedDocuments));
      }

      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('rlbsa_admin_token');
        window.location.reload();
        return;
      }

      const data = await response.json();
      if (response.ok && data.success) {
        triggerSuccess(`Student successfully ${isEdit ? 'updated' : 'registered'}.`);
        setActiveModal(null);
        resetStudentForm();
        fetchStudents();
      } else {
        alert(data.error || "Failed to save student record.");
      }

    } catch (err) {
      console.error("Save student error:", err);
      alert("Error contacting the backend server.");
    } finally {
      setIsUploading(false);
    }
  };

  const closeCoachModal = () => {
    setActiveModal(null);
    setEditingCoach(null);
    setCoachForm({ name: '', role: '', specialization: '', experience: '', bio: '', avatar: '👨‍🏫' });
  };

  const handleEditCoachClick = (coach: any) => {
    setEditingCoach(coach);
    setCoachForm({
      name: coach.name,
      role: coach.role,
      specialization: coach.specialization || '',
      experience: coach.experience ? coach.experience.replace(' Years Coaching', '') : '',
      bio: coach.bio,
      avatar: coach.avatar
    });
    setActiveModal('coach');
  };

  const handleAddCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachForm.avatar || coachForm.avatar === '👨‍🏫') {
      alert("Please upload and crop a profile photo for the coach.");
      return;
    }

    const isEdit = !!editingCoach;
    const url = isEdit 
      ? `http://localhost:5000/api/admin/coaches/${encodeURIComponent(editingCoach.name)}`
      : 'http://localhost:5000/api/admin/coaches';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...coachForm,
          specialization: coachForm.role, // Automatically default specialization to role title
          experience: coachForm.experience + ' Years Coaching'
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        if (isEdit) {
          setCoaches(coaches.map(c => c.name === editingCoach.name ? data.coach : c));
          triggerSuccess('Coach profile updated successfully.');
        } else {
          setCoaches([...coaches, data.coach]);
          triggerSuccess('Coach added successfully.');
        }
        closeCoachModal();
      } else {
        alert(data.error || `Failed to ${isEdit ? 'update' : 'add'} coach.`);
      }
    } catch (err) {
      alert("Error contacting the backend server.");
    }
  };

  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/team', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(teamForm)
      });
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('rlbsa_admin_token');
        window.location.reload();
        return;
      }
      const data = await response.json();
      if (response.ok && data.success) {
        setTeam([...team, data.member]);
        triggerSuccess('Team member added successfully.');
        setActiveModal(null);
        setTeamForm({ name: '', role: '', bio: '', image: '', objectPosition: 'center 15%' });
      } else {
        alert(data.error || "Failed to add team member.");
      }
    } catch (err) {
      alert("Error contacting the backend server.");
    }
  };

  const handleUpdateTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeamMember) return;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/team/${editingTeamMember.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(teamForm)
      });
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('rlbsa_admin_token');
        window.location.reload();
        return;
      }
      const data = await response.json();
      if (response.ok && data.success) {
        setTeam(team.map(m => m.id === editingTeamMember.id ? data.member : m));
        triggerSuccess('Team member details updated successfully.');
        setActiveModal(null);
        setEditingTeamMember(null);
        setTeamForm({ name: '', role: '', bio: '', image: '', objectPosition: 'center 15%' });
      } else {
        alert(data.error || "Failed to update team member.");
      }
    } catch (err) {
      alert("Error contacting the backend server.");
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    setConfirmationModal({
      show: true,
      title: "Remove Team Member",
      message: "Are you sure you want to remove this team member?",
      onConfirm: async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/admin/team/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('rlbsa_admin_token');
            window.location.reload();
            return;
          }
          const data = await response.json();
          if (response.ok && data.success) {
            setTeam(team.filter(m => m.id !== id));
            triggerSuccess('Team member removed successfully.');
          } else {
            alert(data.error || "Failed to delete team member.");
          }
        } catch (err) {
          alert("Error contacting the backend server.");
        }
      }
    });
  };

  useEffect(() => {
    if (activeTab === 'gallery') {
      fetchGallery();
      fetchGalleryStats();
    }
  }, [activeTab, galleryPage, galleryIsDeleted, galleryStatus, galleryCategory, gallerySearch]);

  const fetchGallery = async () => {
    if (!token) return;
    try {
      const queryParams = new URLSearchParams({
        page: String(galleryPage),
        limit: '12',
        isDeleted: String(galleryIsDeleted),
        status: galleryStatus,
        category: galleryCategory,
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

  const fetchGalleryStats = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:5000/api/admin/gallery/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setGalleryStats(data);
      }
    } catch (err) {
      console.error("Error loading gallery stats:", err);
    }
  };

  const resetEventGalleryForm = () => {
    setEventGalleryForm({
      name: '',
      category: 'Events',
      date: '',
      location: '',
      description: '',
      status: galleryDefaultSettings.status,
      mediaType: 'image',
      videoUrl: ''
    });
    setSelectedPhotos([]);
    setSelectedPhotoPreviews([]);
    setCoverIndex(0);
    setCustomCoverImage(null);
    setCustomCoverPreview('');
    setEditingEventGallery(null);
    setExistingPhotos([]);
    setDeletedExistingPhotos([]);
  };

  const handleSaveEventGallery = async (e: React.FormEvent, forceStatus?: 'draft' | 'published') => {
    e.preventDefault();
    if (!eventGalleryForm.name.trim() || !eventGalleryForm.category || !eventGalleryForm.date) {
      alert("Please fill in all required fields.");
      return;
    }

    const isEdit = !!editingEventGallery;
    const isVideo = eventGalleryForm.mediaType === 'video';
    
    if (!isEdit && !isVideo && selectedPhotos.length === 0) {
      alert("Please select at least one photo to upload.");
      return;
    }
    
    if (isVideo && !eventGalleryForm.videoUrl.trim()) {
      alert("Please provide a YouTube video URL.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('name', eventGalleryForm.name);
      formData.append('category', eventGalleryForm.category);
      formData.append('date', eventGalleryForm.date);
      formData.append('location', eventGalleryForm.location);
      formData.append('description', eventGalleryForm.description);
      formData.append('status', forceStatus || eventGalleryForm.status);
      formData.append('mediaType', eventGalleryForm.mediaType);
      formData.append('videoUrl', isVideo ? eventGalleryForm.videoUrl.trim() : '');
      formData.append('coverIndex', String(coverIndex));

      if (!isVideo) {
        selectedPhotos.forEach(file => {
          formData.append('photos', file);
        });
      }

      if (customCoverImage) {
        formData.append('coverImage', customCoverImage);
      }

      if (isEdit) {
        formData.append('deletedPhotos', JSON.stringify(deletedExistingPhotos));
        if (!customCoverImage) {
          const currentCover = editingEventGallery.coverImage;
          if (currentCover) {
            formData.append('coverImage', currentCover);
          }
        }
      }

      const url = isEdit 
        ? `http://localhost:5000/api/admin/gallery/${editingEventGallery._id}`
        : 'http://localhost:5000/api/admin/gallery';

      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('rlbsa_admin_token');
        window.location.reload();
        return;
      }

      const data = await response.json();
      if (response.ok && data.success) {
        triggerSuccess(isEdit ? 'Event updated successfully.' : 'Event created successfully.');
        setActiveModal(null);
        resetEventGalleryForm();
        fetchGallery();
        fetchGalleryStats();
      } else {
        alert(data.error || "Failed to save event.");
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting the server.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSoftDelete = async (id: string) => {
    setConfirmationModal({
      show: true,
      title: "Move to Trash Bin",
      message: "क्या आप इस फोटो/वीडियो को रद्दी (Trash Bin) में डालना चाहते हैं?\nAre you sure you want to move this media item to the Trash Bin?",
      onConfirm: async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/admin/gallery/${id}/soft`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            triggerSuccess('Event moved to Trash Bin.');
            fetchGallery();
            fetchGalleryStats();
          }
        } catch (err) {
          alert("Error soft deleting event.");
        }
      }
    });
  };

  const handleRestore = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/gallery/${id}/restore`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        triggerSuccess('Event restored successfully.');
        fetchGallery();
        fetchGalleryStats();
      }
    } catch (err) {
      alert("Error restoring event.");
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (!id || id === 'undefined') {
      alert("Cannot delete mock item. Only uploaded database items can be permanently deleted.");
      return;
    }
    setConfirmationModal({
      show: true,
      title: "Permanently Delete",
      message: "क्या आप इस फोटो/वीडियो को हमेशा के लिए हटाना चाहते हैं? यह वापस नहीं लाया जा सकता।\nAre you sure you want to permanently delete this media item? This action is irreversible.",
      onConfirm: async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/admin/gallery/${id}/permanent`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            triggerSuccess('Media item permanently deleted.');
            fetchGallery();
            fetchGalleryStats();
          }
        } catch (err) {
          alert("Error permanently deleting media item.");
        }
      }
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedPhotos(prev => [...prev, ...filesArray]);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setSelectedPhotoPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveSelectedPhoto = (index: number) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
    setSelectedPhotoPreviews(prev => prev.filter((_, i) => i !== index));
    if (coverIndex === index) {
      setCoverIndex(0);
    } else if (coverIndex > index) {
      setCoverIndex(coverIndex - 1);
    }
  };

  const handleCustomCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCustomCoverImage(file);
      setCustomCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleEditEventGalleryClick = (event: any) => {
    setEditingEventGallery(event);
    setEventGalleryForm({
      name: event.name,
      category: event.category,
      date: event.date ? event.date.split('T')[0] : '',
      location: event.location || '',
      description: event.description || '',
      status: event.status || 'draft',
      mediaType: event.mediaType || 'image',
      videoUrl: event.videoUrl || ''
    });
    setExistingPhotos(event.photos || []);
    setDeletedExistingPhotos([]);
    setSelectedPhotos([]);
    setSelectedPhotoPreviews([]);
    
    const idx = event.photos?.findIndex((p: any) => p.path === event.coverImage);
    setCoverIndex(idx !== -1 ? idx : 0);
    setCustomCoverImage(null);
    setCustomCoverPreview('');
    
    setActiveModal('gallery-edit');
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
    setConfirmationModal({
      show: true,
      title: "Bulk Move to Trash Bin",
      message: `क्या आप चुने हुए ${selectedGalleryIds.length} फोटो/वीडियो को रद्दी (Trash Bin) में डालना चाहते हैं?\nAre you sure you want to move the selected ${selectedGalleryIds.length} media items to the Trash Bin?`,
      onConfirm: async () => {
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
      }
    });
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
    setConfirmationModal({
      show: true,
      title: "Bulk Permanently Delete",
      message: `क्या आप चुने हुए ${selectedGalleryIds.length} फोटो/वीडियो को हमेशा के लिए हटाना चाहते हैं? यह वापस नहीं लाया जा सकता।\nAre you sure you want to permanently delete the ${selectedGalleryIds.length} selected media files? This is irreversible.`,
      onConfirm: async () => {
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
      }
    });
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
  const deleteStudent = async (id: string, name?: string) => {
    const displayName = name ? ` "${name}"` : '';
    setConfirmationModal({
      show: true,
      title: "Deactivate/Delete Student",
      message: `Are you sure you want to deactivate/delete student${displayName}? They will be marked as inactive and soft-deleted.`,
      onConfirm: async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/admin/students/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            triggerSuccess('Student record soft-deleted/deactivated.');
            fetchStudents();
          }
        } catch (err) {
          alert("Error soft-deleting student.");
        }
      }
    });
  };

  const restoreStudent = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/students/${id}/restore`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        triggerSuccess('Student record restored successfully.');
        fetchStudents();
      }
    } catch (err) {
      alert("Error restoring student.");
    }
  };

  const handleBulkStatusChange = async (status: string) => {
    if (selectedStudentIds.length === 0) return;
    try {
      const response = await fetch('http://localhost:5000/api/admin/students/bulk-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids: selectedStudentIds, status })
      });
      if (response.ok) {
        triggerSuccess(`Updated status for ${selectedStudentIds.length} students.`);
        setSelectedStudentIds([]);
        fetchStudents();
      }
    } catch (err) {
      alert("Error updating status in bulk.");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedStudentIds.length === 0) return;
    setConfirmationModal({
      show: true,
      title: "Bulk Deactivate/Soft-Delete",
      message: `Are you sure you want to deactivate/soft-delete the ${selectedStudentIds.length} selected student records?`,
      onConfirm: async () => {
        try {
          const response = await fetch('http://localhost:5000/api/admin/students/bulk-delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ ids: selectedStudentIds })
          });
          if (response.ok) {
            triggerSuccess(`Deactivated ${selectedStudentIds.length} student records.`);
            setSelectedStudentIds([]);
            fetchStudents();
          }
        } catch (err) {
          alert("Error deactivating students in bulk.");
        }
      }
    });
  };

  const handleBulkAssign = async (batchVal?: string, coachVal?: string) => {
    if (selectedStudentIds.length === 0) return;
    try {
      const response = await fetch('http://localhost:5000/api/admin/students/bulk-assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids: selectedStudentIds, batch: batchVal, coach: coachVal })
      });
      if (response.ok) {
        triggerSuccess(`Assigned batch/coach for ${selectedStudentIds.length} students.`);
        setSelectedStudentIds([]);
        fetchStudents();
      }
    } catch (err) {
      alert("Error bulk assigning coach/batch.");
    }
  };
 
  const handleExportStudents = (format: 'csv' | 'excel' | 'pdf') => {
    if (students.length === 0) {
      alert("No students to export.");
      return;
    }

    if (format === 'csv') {
      const headers = ["Student ID", "Full Name", "Gender", "Residency", "Age", "Sport", "Admission Date", "Status", "Contact Phone", "Guardian Name"];
      const rows = students.map(s => [
        s.studentId || s.id,
        s.fullName || s.name,
        s.gender,
        s.residency,
        s.age,
        s.primarySport || s.sport,
        s.admissionDate ? s.admissionDate.split('T')[0] : (s.joined || ''),
        s.status || 'Active',
        s.contact?.phone || '',
        s.guardian?.name || ''
      ]);

      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `RLBSA_Students_Export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'excel') {
      const headers = ["Student ID", "Full Name", "Gender", "Residency", "Age", "Sport", "Admission Date", "Status", "Contact Phone", "Guardian Name"];
      const rows = students.map(s => [
        s.studentId || s.id,
        s.fullName || s.name,
        s.gender,
        s.residency,
        s.age,
        s.primarySport || s.sport,
        s.admissionDate ? s.admissionDate.split('T')[0] : (s.joined || ''),
        s.status || 'Active',
        s.contact?.phone || '',
        s.guardian?.name || ''
      ]);

      const xmlContent = [headers.join("\t"), ...rows.map(e => e.join("\t"))].join("\n");
      const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `RLBSA_Students_Export_${Date.now()}.xls`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'pdf') {
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
      printWindow.document.write(`
        <html>
          <head>
            <title>Rani Laxmibai Sports Academy - Student Roster</title>
            <style>
              body { font-family: sans-serif; padding: 20px; color: #1e293b; }
              h1 { font-size: 20px; color: #1e1b4b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th, td { border: 1px solid #cbd5e1; padding: 10px 8px; text-align: left; font-size: 11px; }
              th { background-color: #f8fafc; font-weight: bold; }
              .logo { font-size: 14px; font-weight: bold; color: #f59e0b; margin-bottom: 5px; }
            </style>
          </head>
          <body>
            <div class="logo">Rani Laxmibai Sports Academy</div>
            <h1>Student Roster - Exported Report</h1>
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Full Name</th>
                  <th>Gender</th>
                  <th>Residency</th>
                  <th>Age</th>
                  <th>Sport</th>
                  <th>Admission Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${students.map(s => `
                  <tr>
                    <td>${s.studentId || s.id}</td>
                    <td>${s.fullName || s.name}</td>
                    <td>${s.gender}</td>
                    <td>${s.residency}</td>
                    <td>${s.age}</td>
                    <td>${s.primarySport || s.sport}</td>
                    <td>${s.admissionDate ? s.admissionDate.split('T')[0] : (s.joined || '')}</td>
                    <td>${s.status || 'Active'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
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
        <div className="bg-white p-6 md:p-8 rounded-xl border border-border-gray shadow-sm space-y-6 text-left">
          
          {/* Header section */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-border-gray">
            <div>
              <h3 className="text-base font-bold text-primary">Students Directory</h3>
              <p className="text-text-light text-xs mt-0.5">Manage student profiles, parent details, coaching metrics, and documents</p>
            </div>
            <button 
              onClick={() => {
                resetStudentForm();
                setActiveModal('student-create');
              }}
              className="bg-primary text-white hover:bg-accent hover:text-primary transition-all font-bold py-2.5 px-5 rounded-lg cursor-pointer text-xs flex items-center gap-1.5 self-start"
            >
              <Plus size={16} /> Register Student
            </button>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 border border-border-gray rounded-xl bg-soft-light shadow-sm text-left animate-fade-in">
              <span className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1">Total Students</span>
              <span className="text-xl font-extrabold text-primary">{studentStats.totalStudents}</span>
            </div>
            <div className="p-4 border border-border-gray rounded-xl bg-soft-light shadow-sm text-left animate-fade-in">
              <span className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1">Active Students</span>
              <span className="text-xl font-extrabold text-emerald-600">{studentStats.activeStudents}</span>
            </div>
            <div className="p-4 border border-border-gray rounded-xl bg-soft-light shadow-sm text-left animate-fade-in">
              <span className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1">Boarders (Residents)</span>
              <span className="text-xl font-extrabold text-primary">{studentStats.residentStudents}</span>
            </div>
            <div className="p-4 border border-border-gray rounded-xl bg-soft-light shadow-sm text-left animate-fade-in">
              <span className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1">Day Scholars</span>
              <span className="text-xl font-extrabold text-amber-600">{studentStats.nonResidentStudents}</span>
            </div>
            <div className="p-4 border border-border-gray rounded-xl bg-soft-light shadow-sm text-left col-span-2 md:col-span-1 animate-fade-in">
              <span className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1">New Admissions (30d)</span>
              <span className="text-xl font-extrabold text-accent">{studentStats.newAdmissions}</span>
            </div>
          </div>

          {/* Search, Filter & Export Panel */}
          <div className="bg-soft-light p-4 rounded-xl border border-border-gray space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Search Bar */}
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-text-light"><MagnifyingGlass size={16} /></span>
                <input 
                  type="text" 
                  placeholder="Search Name, ID, Phone, Sport..." 
                  value={studentSearch}
                  onChange={(e) => {
                    setStudentSearch(e.target.value);
                    setStudentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 border border-border-gray rounded bg-white text-xs text-primary font-semibold outline-none focus:border-primary transition-all"
                />
              </div>

              {/* Sport filter */}
              <div>
                <select 
                  value={studentSportFilter}
                  onChange={(e) => {
                    setStudentSportFilter(e.target.value);
                    setStudentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-border-gray rounded bg-white text-xs text-primary font-semibold outline-none focus:border-primary transition-all"
                >
                  <option value="">All Sports</option>
                  <option value="Football">Football</option>
                  <option value="Handball">Handball</option>
                  <option value="Athletics">Athletics</option>
                  <option value="Rugby">Rugby</option>
                  <option value="Kabaddi">Kabaddi</option>
                </select>
              </div>

              {/* Gender filter */}
              <div>
                <select 
                  value={studentGenderFilter}
                  onChange={(e) => {
                    setStudentGenderFilter(e.target.value);
                    setStudentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-border-gray rounded bg-white text-xs text-primary font-semibold outline-none focus:border-primary transition-all"
                >
                  <option value="">All Genders</option>
                  <option value="boy">Boys</option>
                  <option value="girl">Girls</option>
                </select>
              </div>

              {/* Residency filter */}
              <div>
                <select 
                  value={studentResidencyFilter}
                  onChange={(e) => {
                    setStudentResidencyFilter(e.target.value);
                    setStudentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-border-gray rounded bg-white text-xs text-primary font-semibold outline-none focus:border-primary transition-all"
                >
                  <option value="">All Residencies</option>
                  <option value="resident">Boarding (Resident)</option>
                  <option value="non-resident">Day Scholar (Non-Resident)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-1">
              {/* Batch filter */}
              <div>
                <input 
                  type="text" 
                  placeholder="Filter by Batch..." 
                  value={studentBatchFilter}
                  onChange={(e) => {
                    setStudentBatchFilter(e.target.value);
                    setStudentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-border-gray rounded bg-white text-xs text-primary font-semibold outline-none focus:border-primary transition-all"
                />
              </div>

              {/* Coach filter */}
              <div>
                <input 
                  type="text" 
                  placeholder="Filter by Coach..." 
                  value={studentCoachFilter}
                  onChange={(e) => {
                    setStudentCoachFilter(e.target.value);
                    setStudentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-border-gray rounded bg-white text-xs text-primary font-semibold outline-none focus:border-primary transition-all"
                />
              </div>

              {/* Status filter */}
              <div>
                <select 
                  value={studentStatusFilter}
                  onChange={(e) => {
                    setStudentStatusFilter(e.target.value);
                    setStudentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-border-gray rounded bg-white text-xs text-primary font-semibold outline-none focus:border-primary transition-all"
                >
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Graduated">Graduated</option>
                </select>
              </div>

              {/* Year filter */}
              <div>
                <input 
                  type="number" 
                  placeholder="Admission Year..." 
                  value={studentYearFilter}
                  onChange={(e) => {
                    setStudentYearFilter(e.target.value);
                    setStudentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-border-gray rounded bg-white text-xs text-primary font-semibold outline-none focus:border-primary transition-all"
                />
              </div>

              {/* Clear button */}
              <div className="flex gap-2 justify-end sm:col-span-2 md:col-span-1">
                <button 
                  onClick={() => {
                    setStudentSearch('');
                    setStudentSportFilter('');
                    setStudentGenderFilter('');
                    setStudentResidencyFilter('');
                    setStudentBatchFilter('');
                    setStudentCoachFilter('');
                    setStudentStatusFilter('');
                    setStudentYearFilter('');
                    setStudentShowDeleted(false);
                    setStudentPage(1);
                  }}
                  className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 rounded text-xs transition-all cursor-pointer text-center"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 gap-3 border-t border-border-gray">
              {/* Show deleted toggle */}
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="studentShowDeleted"
                  checked={studentShowDeleted}
                  onChange={(e) => {
                    setStudentShowDeleted(e.target.checked);
                    setStudentPage(1);
                    setSelectedStudentIds([]);
                  }}
                  className="rounded border-border-gray text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <label htmlFor="studentShowDeleted" className="text-xs font-bold text-rose-500 cursor-pointer select-none">
                  View Trash Bin ({studentShowDeleted ? 'Active' : 'Show Deactivated Records'})
                </label>
              </div>

              {/* Export Panel */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-light">Export List:</span>
                <button 
                  onClick={() => handleExportStudents('csv')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-2.5 rounded text-[11px] cursor-pointer transition-all"
                >
                  CSV
                </button>
                <button 
                  onClick={() => handleExportStudents('excel')}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-1 px-2.5 rounded text-[11px] cursor-pointer transition-all"
                >
                  Excel
                </button>
                <button 
                  onClick={() => handleExportStudents('pdf')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-2.5 rounded text-[11px] cursor-pointer transition-all"
                >
                  PDF Report
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Operations Bar */}
          {selectedStudentIds.length > 0 && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-amber-500/10 border border-amber-500/25 p-3.5 px-5 rounded-lg animate-fade-in text-xs font-bold">
              <span className="text-amber-700 flex items-center gap-1.5">
                <span>⚠️</span> Selected {selectedStudentIds.length} students:
              </span>
              <div className="flex flex-wrap items-center gap-3.5">
                <select 
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkStatusChange(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="px-2 py-1.5 border border-border-gray rounded bg-white text-[11px] font-semibold text-primary outline-none"
                >
                  <option value="">Bulk Status...</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Graduated">Graduated</option>
                </select>

                <input 
                  type="text" 
                  placeholder="Bulk Batch..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleBulkAssign((e.target as HTMLInputElement).value, undefined);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  className="px-2 py-1.5 border border-border-gray rounded bg-white text-[11px] font-semibold text-primary outline-none max-w-[100px]"
                />

                <input 
                  type="text" 
                  placeholder="Bulk Coach..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleBulkAssign(undefined, (e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  className="px-2 py-1.5 border border-border-gray rounded bg-white text-[11px] font-semibold text-primary outline-none max-w-[100px]"
                />

                <button 
                  onClick={handleBulkDelete}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-1.5 px-3.5 rounded text-[11px] cursor-pointer transition-all uppercase"
                >
                  Deactivate / Delete
                </button>
              </div>
            </div>
          )}

          {/* Roster Table Grid */}
          <div className="overflow-x-auto border border-border-gray rounded-xl">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="border-b border-border-gray bg-soft-light text-text-light text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 text-center w-12">
                    <input 
                      type="checkbox"
                      checked={students.length > 0 && selectedStudentIds.length === students.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudentIds(students.map(s => s.id));
                        } else {
                          setSelectedStudentIds([]);
                        }
                      }}
                      className="rounded border-border-gray text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4 text-center w-16">Photo</th>
                  <th className="py-3 px-4 w-28">Student ID</th>
                  <th className="py-3 px-4 min-w-[150px]">Full Name</th>
                  <th className="py-3 px-4 w-20">Gender</th>
                  <th className="py-3 px-4 w-28">Residency</th>
                  <th className="py-3 px-4 w-20">Age</th>
                  <th className="py-3 px-4 w-32">Sport</th>
                  <th className="py-3 px-4 w-28">Joined</th>
                  <th className="py-3 px-4 w-24">Status</th>
                  <th className="py-3 px-4 text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-gray text-xs font-semibold text-primary-light bg-white">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-text-light italic">
                      No student records match the active criteria.
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      {/* Checkbox */}
                      <td className="py-3 px-4 text-center">
                        <input 
                          type="checkbox"
                          checked={selectedStudentIds.includes(student.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudentIds([...selectedStudentIds, student.id]);
                            } else {
                              setSelectedStudentIds(selectedStudentIds.filter(id => id !== student.id));
                            }
                          }}
                          className="rounded border-border-gray text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                        />
                      </td>

                      {/* Photo */}
                      <td className="py-3 px-4 text-center cursor-pointer hover:opacity-80" onClick={() => setViewingStudentProfile(student)}>
                        <div className="w-8 h-8 rounded-full border border-border-gray flex items-center justify-center bg-slate-50 overflow-hidden mx-auto shadow-xs">
                          {student.avatar && (student.avatar.startsWith('data:') || student.avatar.includes('/') || student.avatar.includes('.')) ? (
                            <img 
                              src={student.avatar.startsWith('/') ? `http://localhost:5000${student.avatar}` : student.avatar} 
                              alt={student.fullName || student.name} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <span>{student.avatar || '🎓'}</span>
                          )}
                        </div>
                      </td>

                      {/* ID */}
                      <td className="py-3 px-4 text-[11px] font-bold text-text-light">{student.studentId || student.id}</td>

                      {/* Name */}
                      <td className="py-3 px-4 cursor-pointer hover:text-accent" onClick={() => setViewingStudentProfile(student)}>
                        <span className="font-bold text-primary block truncate max-w-[180px] hover:underline">{student.fullName || student.name}</span>
                        {student.showOnPublicWebsite && (
                          <span className="inline-block bg-emerald-50 text-emerald-600 text-[8px] font-extrabold px-1 rounded border border-emerald-100 uppercase tracking-wide mt-0.5">Public</span>
                        )}
                      </td>

                      {/* Gender */}
                      <td className="py-3 px-4 capitalize text-[10px] text-text-light">{student.gender || 'girl'}</td>

                      {/* Residency */}
                      <td className="py-3 px-4">
                        <span className={`inline-block py-0.5 px-2 rounded text-[10px] font-extrabold uppercase ${
                          student.residency === 'resident' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {student.residency === 'resident' ? 'Resident' : 'Day Scholar'}
                        </span>
                      </td>

                      {/* Age */}
                      <td className="py-3 px-4 font-bold">{student.age || 'N/A'} Yrs</td>

                      {/* Sport */}
                      <td className="py-3 px-4 truncate max-w-[120px]">
                        <span className="inline-block bg-primary/5 text-primary py-0.5 px-2 rounded text-[11px] font-bold">
                          {student.primarySport || student.sport}
                        </span>
                      </td>

                      {/* Admission Date */}
                      <td className="py-3 px-4 text-[10px] text-text-light">
                        {student.admissionDate ? student.admissionDate.split('T')[0] : (student.joined || 'N/A')}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full mr-1.5 ${
                          student.status === 'Active' ? 'bg-emerald-500' :
                          student.status === 'On Leave' ? 'bg-amber-400' :
                          student.status === 'Inactive' ? 'bg-slate-400' : 'bg-indigo-500'
                        }`} />
                        <span className="text-[11px]">{student.status || 'Active'}</span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button 
                            onClick={() => setViewingStudentProfile(student)}
                            className="text-primary hover:text-accent bg-transparent border-none p-1 cursor-pointer transition-colors"
                            title="View Student Profile"
                          >
                            <Eye size={15} />
                          </button>
                          
                          {!student.isDeleted ? (
                            <>
                              <button 
                                onClick={() => handleEditStudentClick(student)}
                                className="text-indigo-600 hover:text-indigo-800 bg-transparent border-none p-1 cursor-pointer transition-colors"
                                title="Edit Student Profile"
                              >
                                <Pencil size={15} />
                              </button>
                              <button 
                                onClick={() => deleteStudent(student.id, student.fullName || student.name)}
                                className="text-rose-500 hover:text-rose-700 bg-transparent border-none p-1 cursor-pointer transition-colors"
                                title="Deactivate Student"
                              >
                                <Trash size={15} />
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => restoreStudent(student.id)}
                              className="text-emerald-600 hover:text-emerald-800 bg-transparent border-none p-1 cursor-pointer transition-colors"
                              title="Restore Student"
                            >
                              <ArrowCounterClockwise size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {studentTotalPages > 1 && (
            <div className="flex justify-between items-center bg-soft-light p-3.5 px-5 rounded-xl border border-border-gray text-xs font-semibold text-text-light">
              <span>
                Showing <strong className="text-primary">{((studentPage - 1) * studentLimit) + 1}–{Math.min(studentPage * studentLimit, studentTotalItems)}</strong> of <strong className="text-primary">{studentTotalItems}</strong> students
              </span>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setStudentPage(p => Math.max(p - 1, 1))}
                  disabled={studentPage === 1}
                  className="px-2.5 py-1.5 border border-border-gray rounded bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white text-primary text-[11px] font-bold cursor-pointer transition-all"
                >
                  Previous
                </button>
                {Array.from({ length: studentTotalPages }).map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setStudentPage(i + 1)}
                    className={`w-7 h-7 rounded border font-bold text-[11px] flex items-center justify-center cursor-pointer transition-all ${
                      studentPage === i + 1 
                        ? 'bg-primary text-white border-primary' 
                        : 'border-border-gray bg-white text-primary hover:bg-slate-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  onClick={() => setStudentPage(p => Math.min(p + 1, studentTotalPages))}
                  disabled={studentPage === studentTotalPages}
                  className="px-2.5 py-1.5 border border-border-gray rounded bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white text-primary text-[11px] font-bold cursor-pointer transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
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
              onClick={() => {
                setEditingCoach(null);
                setCoachForm({ name: '', role: '', specialization: '', experience: '', bio: '', avatar: '👨‍🏫' });
                setActiveModal('coach');
              }}
              className="bg-primary text-white hover:bg-accent hover:text-primary transition-all font-bold py-2.5 px-5 rounded-lg cursor-pointer text-xs flex items-center gap-1.5 self-start"
            >
              <Plus size={16} /> Add Coach
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coaches.map((coach, idx) => (
              <div key={idx} className="p-5 border border-border-gray rounded-xl flex gap-4 text-left hover:shadow-sm transition-all items-start relative group">
                <div className="w-12 h-12 bg-border-gray rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                  {coach.avatar && (coach.avatar.startsWith('http') || coach.avatar.startsWith('/') || coach.avatar.startsWith('data:')) ? (
                    <img 
                      src={coach.avatar} 
                      alt={coach.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="text-2xl">{coach.avatar}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-primary text-base">{coach.name}</h4>
                  <span className="text-xs font-bold text-accent uppercase tracking-wider block mt-0.5">{coach.role}</span>
                  <span className="block text-[11px] text-text-light font-semibold italic mt-1">{coach.specialization} &bull; {coach.experience}</span>
                  <p className="text-text-body text-xs mt-2.5 leading-relaxed">{coach.bio}</p>
                </div>
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenCoachDropdown(openCoachDropdown === coach.name ? null : coach.name);
                    }}
                    className="text-text-light hover:text-primary bg-transparent border-none p-1 cursor-pointer rounded-full hover:bg-soft-light transition-all outline-none"
                    title="Coach Actions"
                  >
                    <DotsThreeVertical size={20} weight="bold" />
                  </button>

                  {openCoachDropdown === coach.name && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={(e) => { e.stopPropagation(); setOpenCoachDropdown(null); }} 
                      />
                      <div className="absolute right-0 mt-1 bg-white border border-border-gray rounded-xl shadow-xl z-20 py-1.5 w-28 animate-fade-in text-left">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenCoachDropdown(null);
                            handleEditCoachClick(coach);
                          }}
                          className="w-full text-left py-2 px-4.5 text-xs font-bold text-primary hover:bg-soft-light hover:text-accent transition-colors cursor-pointer border-none bg-transparent block flex items-center gap-2"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenCoachDropdown(null);
                            deleteCoach(coach.name);
                          }}
                          className="w-full text-left py-2 px-4.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border-none bg-transparent block flex items-center gap-2"
                        >
                          <Trash size={14} /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
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
              <h3 className="text-base font-bold text-primary">Event-Based Gallery Manager</h3>
              <p className="text-text-light text-xs mt-0.5">Manage event albums, upload multiple photos, and set event visibility</p>
            </div>
            <button 
              onClick={() => {
                resetEventGalleryForm();
                setActiveModal('gallery-create');
              }}
              className="bg-primary text-white hover:bg-accent hover:text-primary transition-all font-bold py-2.5 px-5 rounded-lg cursor-pointer text-xs flex items-center gap-1.5 self-start"
            >
              <Plus size={16} /> Create New Event
            </button>
          </div>

          {/* Stats Cards Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 border border-border-gray rounded-xl bg-soft-light shadow-sm text-left">
              <span className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1">Total Events</span>
              <span className="text-2xl font-extrabold text-primary">{galleryStats.totalEvents}</span>
            </div>
            <div className="p-5 border border-border-gray rounded-xl bg-soft-light shadow-sm text-left">
              <span className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1">Total Images</span>
              <span className="text-2xl font-extrabold text-primary">{galleryStats.totalImages}</span>
            </div>
            <div className="p-5 border border-border-gray rounded-xl bg-soft-light shadow-sm text-left">
              <span className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1">Published Events</span>
              <span className="text-2xl font-extrabold text-emerald-600">{galleryStats.publishedEvents}</span>
            </div>
            <div className="p-5 border border-border-gray rounded-xl bg-soft-light shadow-sm text-left">
              <span className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1">Draft Events</span>
              <span className="text-2xl font-extrabold text-amber-600">{galleryStats.draftEvents}</span>
            </div>
          </div>

          {/* Search & Filters Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-soft-light p-4 rounded-xl border border-border-gray">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-text-light"><MagnifyingGlass size={16} /></span>
              <input 
                type="text" 
                placeholder="Search by name..." 
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
                <option value="Events">Events</option>
                <option value="Tournaments">Tournaments</option>
                <option value="Training">Training</option>
                <option value="Achievements">Achievements</option>
                <option value="Workshops">Workshops</option>
                <option value="Celebrations">Celebrations</option>
                <option value="Other">Other</option>
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
                Selected {selectedGalleryIds.length} event(s) for bulk processing:
              </span>
              <div className="flex gap-2">
                {!galleryIsDeleted ? (
                  <>
                    <button 
                      onClick={handleBulkPublish}
                      className="bg-primary hover:bg-accent text-white hover:text-primary font-bold py-1.5 px-3 rounded text-[10px] uppercase cursor-pointer transition-all"
                    >
                      Publish
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
                      Permanently Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Events table */}
          {galleryItems.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border-gray rounded-xl text-text-light text-xs">
              <ImageIcon size={40} className="mx-auto mb-3 text-text-light/50" />
              No events found matching filters.
            </div>
          ) : (
            <div className="overflow-x-auto border border-border-gray rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-soft-light border-b border-border-gray text-text-light font-bold">
                    <th className="p-4 w-10">
                      <button 
                        onClick={() => {
                          if (selectedGalleryIds.length === galleryItems.length) {
                            setSelectedGalleryIds([]);
                          } else {
                            setSelectedGalleryIds(galleryItems.map(x => x._id));
                          }
                        }}
                        className="w-5 h-5 rounded border border-border-gray bg-white flex items-center justify-center cursor-pointer text-primary"
                      >
                        {selectedGalleryIds.length === galleryItems.length ? <CheckSquare size={16} weight="fill" /> : <Square size={16} />}
                      </button>
                    </th>
                    <th className="p-4 w-20">Cover</th>
                    <th className="p-4">Event Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Photos</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {galleryItems.map((event) => {
                    const isSelected = selectedGalleryIds.includes(event._id);
                    const coverUrl = event.coverImage 
                      ? (event.coverImage.startsWith('http') ? event.coverImage : `http://localhost:5000${event.coverImage}`) 
                      : "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=200&auto=format&fit=crop";
                    
                    return (
                      <tr key={event._id} className="border-b border-border-gray last:border-none hover:bg-soft-light/35 transition-colors">
                        <td className="p-4">
                          <button 
                            onClick={() => {
                              if (isSelected) {
                                setSelectedGalleryIds(selectedGalleryIds.filter(id => id !== event._id));
                              } else {
                                setSelectedGalleryIds([...selectedGalleryIds, event._id]);
                              }
                            }}
                            className="w-5 h-5 rounded border border-border-gray bg-white flex items-center justify-center cursor-pointer text-primary"
                          >
                            {isSelected ? <CheckSquare size={16} weight="fill" /> : <Square size={16} />}
                          </button>
                        </td>
                        <td className="p-4">
                          <img 
                            src={coverUrl} 
                            alt="" 
                            className="w-12 h-10 object-cover rounded border border-border-gray/60"
                            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=200&auto=format&fit=crop"; }}
                          />
                        </td>
                        <td className="p-4 font-bold text-primary max-w-xs truncate">
                          {event.name}
                        </td>
                        <td className="p-4">
                          <span className="bg-primary text-accent text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                            {event.category}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-text-light">
                          {event.date ? new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                        </td>
                        <td className="p-4 font-bold text-primary">
                          {event.mediaType === 'video' ? (
                            <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 w-fit text-[9px] uppercase tracking-wider font-extrabold">
                              Video
                            </span>
                          ) : (
                            <span>{event.photos?.length || 0} Photos</span>
                          )}
                        </td>
                        <td className="p-4">
                          {event.status === 'published' ? (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Published</span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Draft</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button 
                              onClick={() => setShowQuickViewEvent(event)}
                              className="p-1.5 bg-soft-light border border-border-gray hover:bg-primary hover:text-white rounded transition-all cursor-pointer text-xs"
                              title="View Photos"
                            >
                              <Eye size={14} />
                            </button>
                            <button 
                              onClick={() => handleEditEventGalleryClick(event)}
                              className="p-1.5 bg-soft-light border border-border-gray hover:bg-accent hover:text-primary rounded transition-all cursor-pointer text-xs"
                              title="Edit Event"
                            >
                              <Pencil size={14} />
                            </button>
                            {galleryIsDeleted ? (
                              <>
                                <button 
                                  onClick={() => handleRestore(event._id)}
                                  className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded border border-emerald-200 transition-all cursor-pointer text-xs"
                                  title="Restore"
                                >
                                  <ArrowClockwise size={14} />
                                </button>
                                <button 
                                  onClick={() => handlePermanentDelete(event._id)}
                                  className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded border border-rose-200 transition-all cursor-pointer text-xs"
                                  title="Delete Permanently"
                                >
                                  <Trash size={14} />
                                </button>
                              </>
                            ) : (
                              <button 
                                onClick={() => handleSoftDelete(event._id)}
                                className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded border border-rose-200 transition-all cursor-pointer text-xs"
                                title="Move to Trash"
                              >
                                <Trash size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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

            {/* Gallery Upload Default Settings */}
            <div className="bg-white p-6 md:p-8 rounded-xl border border-border-gray shadow-sm space-y-6 md:col-span-2 text-left">
              <div className="pb-3 border-b border-border-gray">
                <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                  <ImageIcon size={18} className="text-accent" /> Gallery Upload Defaults
                </h4>
                <p className="text-[10px] text-text-light mt-0.5">Configure the default settings applied to new gallery items during fast upload</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Default Visibility</label>
                  <select 
                    value={galleryDefaultSettings.visibility} 
                    onChange={(e) => {
                      const val = e.target.value as 'public' | 'private';
                      setGalleryDefaultSettings({...galleryDefaultSettings, visibility: val});
                      localStorage.setItem('rlbsa_gallery_default_visibility', val);
                      triggerSuccess('Gallery default visibility updated.');
                    }} 
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-white outline-none focus:border-primary transition-all font-semibold"
                  >
                    <option value="public">Public (Visible on website)</option>
                    <option value="private">Private (Staff only)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Default Publish Action</label>
                  <select 
                    value={galleryDefaultSettings.status} 
                    onChange={(e) => {
                      const val = e.target.value as 'draft' | 'published';
                      setGalleryDefaultSettings({...galleryDefaultSettings, status: val});
                      localStorage.setItem('rlbsa_gallery_default_status', val);
                      triggerSuccess('Gallery default publish action updated.');
                    }} 
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-white outline-none focus:border-primary transition-all font-semibold"
                  >
                    <option value="draft">Save as Draft (Allows preview)</option>
                    <option value="published">Publish Directly (Immediate)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 justify-center pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-primary cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={galleryDefaultSettings.featured} 
                      onChange={(e) => {
                        const val = e.target.checked;
                        setGalleryDefaultSettings({...galleryDefaultSettings, featured: val});
                        localStorage.setItem('rlbsa_gallery_default_featured', String(val));
                        triggerSuccess('Gallery default homepage feature updated.');
                      }}
                      className="w-4 h-4 text-primary border-border-gray rounded focus:ring-primary cursor-pointer" 
                    />
                    Feature on Homepage Carousel by Default
                  </label>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* OTHER PLACEHOLDER VIEWS */}
      {!['dashboard', 'students', 'coaches', 'gallery', 'events', 'enquiries', 'achievements', 'settings', 'founders', 'success-stories'].includes(activeTab) && (
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

      {/* FOUNDERS & DIRECTORS MANAGEMENT */}
      {activeTab === 'founders' && (
        <div className="bg-white p-8 rounded-xl border border-border-gray shadow-sm text-left flex flex-col gap-6">
          <div className="flex justify-between items-center pb-4 border-b border-border-gray/50">
            <div>
              <h2 className="text-xl font-bold text-primary">Founders &amp; Directors Management</h2>
              <p className="text-text-light text-xs mt-1">Configure profile cards for Mr. Sanjay Pathak and other directors shown on the website.</p>
            </div>
            <button
              onClick={() => {
                setTeamForm({ name: '', role: '', bio: '', image: '', objectPosition: 'center 15%' });
                setEditingTeamMember(null);
                setActiveModal('team');
              }}
              className="flex items-center gap-1.5 bg-primary hover:bg-accent hover:text-primary text-white font-bold py-2.5 px-4 rounded-lg transition-all text-xs border-none cursor-pointer"
            >
              <Plus size={16} /> Add Member
            </button>
          </div>

          {team.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border-gray rounded-xl text-text-light text-xs">
              No team members registered. Click "Add Member" to create one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member) => (
                <div key={member.id} className="border border-border-gray rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow transition-all bg-soft-light">
                  <div>
                    <div className="h-[180px] bg-primary relative">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" style={{ objectPosition: member.objectPosition || 'center' }} />
                      <span className="absolute bottom-3 left-3 bg-accent text-primary text-[10px] font-black px-2 py-0.5 rounded shadow uppercase">
                        {member.role.includes('Founder') ? 'Founder' : 'Director'}
                      </span>
                    </div>
                    <div className="p-5 text-left">
                      <h3 className="text-sm font-extrabold text-primary mb-1">{member.name}</h3>
                      <span className="text-[11px] font-bold text-accent block mb-3 uppercase tracking-wider">{member.role}</span>
                      <p className="text-text-light text-[11px] leading-relaxed line-clamp-3">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 border-t border-border-gray/50 flex gap-2 justify-end bg-white">
                    <button
                      onClick={() => {
                        setEditingTeamMember(member);
                        setTeamForm({
                          name: member.name,
                          role: member.role,
                          bio: member.bio,
                          image: member.image,
                          objectPosition: member.objectPosition || 'center'
                        });
                        setActiveModal('team');
                      }}
                      className="bg-primary-light/10 hover:bg-primary-light/20 text-primary-light font-bold py-1.5 px-3 rounded text-[11px] border-none cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTeamMember(member.id)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-1.5 px-3 rounded text-[11px] border-none cursor-pointer flex items-center gap-1"
                    >
                      <Trash size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUCCESS STORIES TAB VIEW */}
      {activeTab === 'success-stories' && (
        <div className="bg-white p-6 md:p-8 rounded-xl border border-border-gray shadow-sm text-left">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-border-gray">
            <div>
              <h2 className="text-xl font-bold text-primary">Success Stories Management</h2>
              <p className="text-text-light text-xs mt-1">Configure profile cards for former athletes and alumni shown on the website.</p>
            </div>
            <button
              onClick={() => {
                setStoryForm({ name: '', sport: 'Football', achievement: '', description: '', quote: '', image: '', joined: '', age: '', medals: '', objectPosition: 'center' });
                setEditingStory(null);
                setActiveModal('success-story');
              }}
              className="flex items-center gap-1.5 bg-primary hover:bg-accent hover:text-primary text-white font-bold py-2.5 px-4 rounded-lg transition-all text-xs border-none cursor-pointer"
            >
              <Plus size={16} /> Add Story
            </button>
          </div>

          {stories.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border-gray rounded-xl text-text-light text-xs">
              No success stories registered. Click "Add Story" to create one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <div key={story.id} className="border border-border-gray rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow transition-all bg-soft-light">
                  <div>
                    <div className="h-[180px] bg-primary relative">
                      <img src={story.image} alt={story.name} className="w-full h-full object-cover" style={{ objectPosition: story.objectPosition || 'center' }} />
                      <span className="absolute bottom-3 left-3 bg-accent text-primary text-[10px] font-black px-2 py-0.5 rounded shadow uppercase">
                        {story.sport}
                      </span>
                    </div>
                    <div className="p-5 text-left">
                      <h3 className="text-sm font-extrabold text-primary mb-1">{story.name}</h3>
                      <span className="text-[11px] font-bold text-accent block mb-3 uppercase tracking-wider">{story.achievement}</span>
                      <p className="text-text-light text-[11px] leading-relaxed line-clamp-3">
                        "{story.quote}"
                      </p>
                    </div>
                  </div>
                  <div className="p-4 border-t border-border-gray/50 flex gap-2 justify-end bg-white">
                    <button
                      onClick={() => openEditStoryModal(story)}
                      className="bg-primary-light/10 hover:bg-primary-light/20 text-primary-light font-bold py-1.5 px-3 rounded text-[11px] border-none cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteStory(story.id)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-1.5 px-3 rounded text-[11px] border-none cursor-pointer flex items-center gap-1"
                    >
                      <Trash size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Add / Edit Team Member Modal */}
      {activeModal === 'team' && (
        <div className="fixed inset-0 bg-black/15 backdrop-blur-sm z-[250] flex items-center justify-center p-5 animate-fade-in" onClick={() => setActiveModal(null)}>
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 md:p-8 text-left relative animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-5 right-5 text-text-light hover:text-primary cursor-pointer border-none bg-transparent" onClick={() => setActiveModal(null)}><X size={20} /></button>
            <h3 className="text-lg font-bold text-primary mb-5 flex items-center gap-2">
              <UserPlus size={20} className="text-accent" /> {editingTeamMember ? 'Edit Team Member' : 'Add Team Member'}
            </h3>
            <form onSubmit={editingTeamMember ? handleUpdateTeamMember : handleAddTeamMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">Display Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Mr. Sanjay Pathak"
                  value={teamForm.name} 
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  className="w-full py-2.5 px-4 border border-border-gray rounded-lg bg-soft-light text-xs text-dark placeholder-slate-400 outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">Role/Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Founder & Director"
                  value={teamForm.role} 
                  onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                  className="w-full py-2.5 px-4 border border-border-gray rounded-lg bg-soft-light text-xs text-dark placeholder-slate-400 outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">Member Photo</label>
                {teamForm.image ? (
                  <div className="flex items-center gap-4 p-3 bg-soft-light border border-border-gray rounded-xl">
                    <img 
                      src={teamForm.image} 
                      alt="Cropped Member" 
                      className="w-20 h-15 object-cover rounded border border-border-gray shadow-xs" 
                    />
                    <div className="text-left">
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded uppercase">Image Ready</span>
                      <button 
                        type="button"
                        onClick={() => {
                          setCroppingTarget('team');
                          setCropperSource('');
                          setCropZoom(1);
                          setCropPosition({ x: 0, y: 0 });
                          setShowCropperModal(true);
                        }}
                        className="block mt-1.5 text-xs text-primary-light hover:text-accent font-bold cursor-pointer underline bg-transparent border-none p-0"
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setCroppingTarget('team');
                      setCropperSource('');
                      setCropZoom(1);
                      setCropPosition({ x: 0, y: 0 });
                      setShowCropperModal(true);
                    }}
                    className="w-full py-5 px-4 border-2 border-dashed border-border-gray hover:border-primary rounded-xl flex flex-col items-center justify-center gap-2 bg-soft-light hover:bg-white transition-all cursor-pointer group outline-none"
                  >
                    <Plus size={20} className="text-text-light group-hover:text-primary transition-colors" />
                    <span className="text-xs font-bold text-text-light group-hover:text-primary transition-colors">Choose & Crop Photo (4:3)</span>
                  </button>
                )}
                <input type="hidden" name="image" value={teamForm.image} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">Object Position (CSS crop position)</label>
                <input 
                  type="text" 
                  placeholder="e.g. center 15%"
                  value={teamForm.objectPosition} 
                  onChange={(e) => setTeamForm({ ...teamForm, objectPosition: e.target.value })}
                  className="w-full py-2.5 px-4 border border-border-gray rounded-lg bg-soft-light text-xs text-dark placeholder-slate-400 outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">Bio/Description</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Brief biography or background information..."
                  value={teamForm.bio} 
                  onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                  className="w-full py-2.5 px-4 border border-border-gray rounded-lg bg-soft-light text-xs text-dark placeholder-slate-400 outline-none focus:border-primary focus:bg-white transition-all font-semibold resize-none"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-primary hover:bg-accent hover:text-primary text-white font-bold py-3.5 rounded-lg transition-all cursor-pointer text-xs uppercase tracking-wider border-none outline-none mt-2 shadow-md font-main"
              >
                {editingTeamMember ? 'Update Profile' : 'Add Profile'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. Add / Edit Success Story Modal */}
      {activeModal === 'success-story' && (
        <div className="fixed inset-0 bg-black/15 backdrop-blur-sm z-[250] flex items-center justify-center p-5 animate-fade-in" onClick={() => setActiveModal(null)}>
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 md:p-8 text-left relative animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-5 right-5 text-text-light hover:text-primary cursor-pointer border-none bg-transparent" onClick={() => setActiveModal(null)}><X size={20} /></button>
            <h3 className="text-lg font-bold text-primary mb-5 flex items-center gap-2">
              <Trophy size={20} className="text-accent" /> {editingStory ? 'Edit Success Story' : 'Add Success Story'}
            </h3>
            <form onSubmit={handleAddOrUpdateStory} className="space-y-3.5 max-h-[550px] overflow-y-auto pr-1">
              <div>
                <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Athlete Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Amrit Kumari"
                  value={storyForm.name} 
                  onChange={(e) => setStoryForm({ ...storyForm, name: e.target.value })}
                  className="w-full py-2 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Sport</label>
                  <select 
                    value={storyForm.sport} 
                    onChange={(e) => setStoryForm({ ...storyForm, sport: e.target.value })}
                    className="w-full py-2 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold"
                  >
                    <option value="Football">Football</option>
                    <option value="Handball">Handball</option>
                    <option value="Rugby">Rugby</option>
                    <option value="Athletics">Athletics</option>
                    <option value="Football & Handball">Football & Handball</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Admission Joined</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. June 2018"
                    value={storyForm.joined} 
                    onChange={(e) => setStoryForm({ ...storyForm, joined: e.target.value })}
                    className="w-full py-2 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Age</label>
                  <input 
                    type="number" 
                    required
                    min="10"
                    max="45"
                    placeholder="e.g. 24"
                    value={storyForm.age} 
                    onChange={(e) => setStoryForm({ ...storyForm, age: e.target.value })}
                    className="w-full py-2 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Medals Won</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    placeholder="e.g. 15"
                    value={storyForm.medals} 
                    onChange={(e) => setStoryForm({ ...storyForm, medals: e.target.value })}
                    className="w-full py-2 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Achievement Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Former Indian Team Captain & Clerk, Bihar Govt"
                  value={storyForm.achievement} 
                  onChange={(e) => setStoryForm({ ...storyForm, achievement: e.target.value })}
                  className="w-full py-2 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1.5">Athlete Photo</label>
                {storyForm.image ? (
                  <div className="flex items-center gap-4 p-3 bg-soft-light border border-border-gray rounded-xl">
                    <img 
                      src={storyForm.image} 
                      alt="Cropped Athlete" 
                      className="w-20 h-15 object-cover rounded border border-border-gray shadow-xs" 
                    />
                    <div className="text-left">
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded uppercase">Image Ready</span>
                      <button 
                        type="button"
                        onClick={() => {
                          setCroppingTarget('story');
                          setCropperSource('');
                          setCropZoom(1);
                          setCropPosition({ x: 0, y: 0 });
                          setShowCropperModal(true);
                        }}
                        className="block mt-1.5 text-xs text-primary-light hover:text-accent font-bold cursor-pointer underline bg-transparent border-none p-0"
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setCroppingTarget('story');
                      setCropperSource('');
                      setCropZoom(1);
                      setCropPosition({ x: 0, y: 0 });
                      setShowCropperModal(true);
                    }}
                    className="w-full py-5 px-4 border-2 border-dashed border-border-gray hover:border-primary rounded-xl flex flex-col items-center justify-center gap-2 bg-soft-light hover:bg-white transition-all cursor-pointer group outline-none"
                  >
                    <Plus size={20} className="text-text-light group-hover:text-primary transition-colors" />
                    <span className="text-xs font-bold text-text-light group-hover:text-primary transition-colors">Choose & Crop Photo (4:3)</span>
                  </button>
                )}
                <input type="hidden" name="image" value={storyForm.image} required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Crop Position (objectPosition CSS)</label>
                <input 
                  type="text" 
                  placeholder="e.g. center or object-center or center 15%"
                  value={storyForm.objectPosition} 
                  onChange={(e) => setStoryForm({ ...storyForm, objectPosition: e.target.value })}
                  className="w-full py-2 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Quote</label>
                <textarea 
                  required
                  rows={2}
                  placeholder="Inspirational quote from athlete..."
                  value={storyForm.quote} 
                  onChange={(e) => setStoryForm({ ...storyForm, quote: e.target.value })}
                  className="w-full py-2 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold resize-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Description / Achievement Story</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Detailed success history of the athlete..."
                  value={storyForm.description} 
                  onChange={(e) => setStoryForm({ ...storyForm, description: e.target.value })}
                  className="w-full py-2 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold resize-none"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-primary hover:bg-accent hover:text-primary text-white font-bold py-3 rounded-lg transition-all cursor-pointer text-xs uppercase tracking-wider border-none outline-none mt-2 shadow-md"
              >
                {editingStory ? 'Update Story' : 'Save Story'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. Success Story Image Chooser & Canvas Cropper Modal */}
      {showCropperModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[300] flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowCropperModal(false)}>
          <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden text-left relative flex flex-col max-h-[90vh] animate-fade-in" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="p-5 border-b border-border-gray flex justify-between items-center bg-soft-light shrink-0">
              <h3 className="text-md font-bold text-primary flex items-center gap-2">
                <Trophy size={18} className="text-accent" /> Select & Crop Image
              </h3>
              <button className="text-text-light hover:text-primary cursor-pointer border-none bg-transparent" onClick={() => setShowCropperModal(false)}><X size={20} /></button>
            </div>

            {/* Tab Headers */}
            <div className="flex border-b border-border-gray shrink-0 bg-white">
              <button 
                type="button"
                onClick={() => { setCropperTab('upload'); setCropperSource(''); }}
                className={`flex-1 py-3 text-center text-xs font-bold border-none cursor-pointer transition-all ${cropperTab === 'upload' ? 'text-primary border-b-2 border-b-primary bg-soft-light/20' : 'text-text-light hover:text-primary'}`}
              >
                Upload File
              </button>
              <button 
                type="button"
                onClick={() => { setCropperTab('gallery'); setCropperSource(''); }}
                className={`flex-1 py-3 text-center text-xs font-bold border-none cursor-pointer transition-all ${cropperTab === 'gallery' ? 'text-primary border-b-2 border-b-primary bg-soft-light/20' : 'text-text-light hover:text-primary'}`}
              >
                Choose from Gallery
              </button>
            </div>

            {/* Tab Content & Cropper Work Area */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5 items-center justify-center min-h-[360px]">
              {!cropperSource ? (
                // Image Selection Screen
                cropperTab === 'upload' ? (
                  // Local File Upload Widget
                  <div className="w-full max-w-sm">
                    <label 
                      htmlFor="story-image-file-input" 
                      className="w-full py-10 px-6 border-2 border-dashed border-border-gray hover:border-primary rounded-xl flex flex-col items-center justify-center gap-3 bg-soft-light hover:bg-white transition-all cursor-pointer group"
                    >
                      <Plus size={24} className="text-text-light group-hover:text-primary transition-colors" />
                      <div className="text-center">
                        <span className="block text-xs font-bold text-primary mb-1">Select from computer</span>
                        <span className="text-[10px] text-text-light">Supports JPEG, PNG, WebP</span>
                      </div>
                    </label>
                    <input 
                      type="file" 
                      id="story-image-file-input" 
                      accept="image/*" 
                      onChange={handleLocalFileSelect} 
                      className="hidden" 
                    />
                  </div>
                ) : (
                  // Select from Existing Gallery Grid
                  <div className="w-full">
                    {dashboardGallery.length === 0 ? (
                      <div className="text-center py-10 border border-dashed border-border-gray rounded-xl text-xs text-text-light">
                        No images found in gallery database. Try uploading a local file.
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[280px] overflow-y-auto pr-1">
                        {dashboardGallery.map((item) => (
                          <div 
                            key={item._id} 
                            onClick={() => setCropperSource(item.mediaUrl)}
                            className="aspect-square bg-slate-100 rounded-lg overflow-hidden border border-border-gray hover:border-primary shadow-xs hover:shadow-md cursor-pointer transition-all relative group"
                          >
                            <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover animate-fade-in" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-[9px] font-bold text-white bg-primary/80 py-1 px-2 rounded uppercase shadow-sm">Select</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              ) : (
                // Cropper Canvas & Adjustments Screen
                <div className="w-full flex flex-col items-center gap-4">
                  {/* Fixed Aspect Crop Frame Viewport */}
                  <div 
                    className="relative overflow-hidden bg-slate-900 border-2 border-primary rounded-xl shadow-inner select-none cursor-move mx-auto"
                    style={{
                      width: croppingTarget === 'student' ? '300px' : '400px',
                      height: '300px'
                    }}
                    onMouseDown={startDrag}
                    onMouseMove={onDrag}
                    onMouseUp={stopDrag}
                    onMouseLeave={stopDrag}
                    onTouchStart={startDragTouch}
                    onTouchMove={onDragTouch}
                    onTouchEnd={stopDrag}
                  >
                    <img 
                      src={cropperSource} 
                      alt="Crop Source" 
                      onLoad={handleImageLoaded}
                      draggable={false}
                      className="absolute max-w-none origin-top-left pointer-events-none select-none"
                      style={{
                        transform: `translate(${cropPosition.x}px, ${cropPosition.y}px) scale(${cropZoom * Math.max((croppingTarget === 'student' ? 300 : 400) / imageSize.width, 300 / imageSize.height)})`
                      }}
                    />
                    {/* Fixed aspect crop frames overlay */}
                    <div className="absolute inset-0 border border-white/30 pointer-events-none" />
                    <div className="absolute top-1/3 left-0 right-0 border-t border-dashed border-white/25 pointer-events-none" />
                    <div className="absolute top-2/3 left-0 right-0 border-t border-dashed border-white/25 pointer-events-none" />
                    <div className="absolute left-1/3 top-0 bottom-0 border-l border-dashed border-white/25 pointer-events-none" />
                    <div className="absolute left-2/3 top-0 bottom-0 border-l border-dashed border-white/25 pointer-events-none" />
                  </div>

                  <span className="text-[10px] text-text-light font-medium uppercase tracking-wider">
                    Drag photo to pan & align within frame
                  </span>

                  {/* Zoom Slider Control */}
                  <div className="w-full max-w-sm flex items-center gap-3.5 mt-2 bg-soft-light py-2.5 px-4 rounded-xl border border-border-gray">
                    <span className="text-[10px] font-bold text-primary uppercase">Zoom</span>
                    <input 
                      type="range" 
                      min="1" 
                      max="3" 
                      step="0.01" 
                      value={cropZoom} 
                      onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                      className="flex-1 accent-primary h-1 bg-border-gray rounded-lg appearance-none cursor-pointer" 
                    />
                    <span className="text-[10px] font-bold text-primary w-8 text-right">
                      {Math.round(cropZoom * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-border-gray flex justify-between items-center bg-soft-light shrink-0">
              <button 
                type="button" 
                onClick={() => {
                  if (cropperSource) {
                    setCropperSource('');
                  } else {
                    setShowCropperModal(false);
                  }
                }}
                className="bg-white hover:bg-slate-50 border border-border-gray text-primary font-bold py-2.5 px-5 rounded-lg transition-all text-xs cursor-pointer"
              >
                {cropperSource ? 'Back' : 'Cancel'}
              </button>
              {cropperSource && (
                <button 
                  type="button" 
                  onClick={applyCrop}
                  className="bg-primary hover:bg-accent hover:text-primary text-white font-bold py-2.5 px-5 rounded-lg transition-all text-xs cursor-pointer border-none shadow-md"
                >
                  Apply Crop
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QUICK ACTION MODALS LAYOUT */}
      
      {/* 1. Add/Edit Student Modal */}
      {(activeModal === 'student-create' || activeModal === 'student-edit') && (
        <div className="fixed inset-0 bg-black/15 backdrop-blur-sm z-[250] flex items-center justify-center p-5 animate-fade-in" onClick={resetStudentForm}>
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl p-6 md:p-8 text-left relative animate-fade-in max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-5 right-5 text-text-light hover:text-primary cursor-pointer border-none bg-transparent" onClick={resetStudentForm}><X size={20} /></button>
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2 shrink-0 border-b border-border-gray pb-3">
              <UserPlus size={20} className="text-accent" /> {activeModal === 'student-edit' ? 'Edit Student Record' : 'Register New Student'}
            </h3>
            
            {/* Modal Tabs Header */}
            <div className="flex border-b border-border-gray shrink-0 bg-white mb-4 overflow-x-auto">
              {['personal', 'guardian', 'academy', 'education', 'achievements', 'documents'].map((tab) => (
                <button 
                  key={tab}
                  type="button"
                  onClick={() => setActiveStudentFormTab(tab)}
                  className={`py-2.5 px-4 text-xs font-bold border-none cursor-pointer transition-all capitalize whitespace-nowrap ${
                    activeStudentFormTab === tab 
                      ? 'text-primary border-b-2 border-b-primary bg-slate-50' 
                      : 'text-text-light hover:text-primary bg-transparent'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveStudent} className="flex-1 overflow-y-auto pr-1 space-y-4">
              
              {/* Tab 1: Personal Details */}
              {activeStudentFormTab === 'personal' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Full Name *</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="E.g. Puja Kumari" 
                        value={studentForm.fullName} 
                        onChange={(e) => setStudentForm({...studentForm, fullName: e.target.value})} 
                        className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Date of Birth *</label>
                      <input 
                        required 
                        type="date" 
                        value={studentForm.dateOfBirth} 
                        onChange={(e) => setStudentForm({...studentForm, dateOfBirth: e.target.value})} 
                        className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Gender *</label>
                      <select 
                        value={studentForm.gender} 
                        onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })} 
                        className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold"
                      >
                        <option value="girl">Girl</option>
                        <option value="boy">Boy</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Blood Group</label>
                      <input 
                        type="text" 
                        placeholder="E.g. O+ or A+" 
                        value={studentForm.bloodGroup} 
                        onChange={(e) => setStudentForm({...studentForm, bloodGroup: e.target.value})} 
                        className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Student Contact Phone</label>
                      <input 
                        type="tel" 
                        placeholder="E.g. +91 98765 43210" 
                        value={studentForm.phone} 
                        onChange={(e) => setStudentForm({...studentForm, phone: e.target.value})} 
                        className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Student Email</label>
                      <input 
                        type="email" 
                        placeholder="E.g. puja@gmail.com" 
                        value={studentForm.email} 
                        onChange={(e) => setStudentForm({...studentForm, email: e.target.value})} 
                        className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Residential Address</label>
                    <textarea 
                      rows={2} 
                      placeholder="Street, District, State, Pincode" 
                      value={studentForm.address} 
                      onChange={(e) => setStudentForm({...studentForm, address: e.target.value})} 
                      className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold resize-none" 
                    />
                  </div>

                  {/* Profile Pic Upload & Crop */}
                  <div className="flex flex-col gap-1.5 p-3.5 bg-soft-light border border-border-gray rounded-xl">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full border border-border-gray flex items-center justify-center bg-white text-3xl overflow-hidden shadow-xs shrink-0">
                        {studentPhotoPreview ? (
                          <img src={studentPhotoPreview} alt="Student preview" className="w-full h-full object-cover" />
                        ) : (
                          <span>{studentForm.gender === 'boy' ? '👦' : '👩‍🎓'}</span>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col gap-1.5">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setStudentPhotoFile(file);
                              setStudentPhotoPreview(URL.createObjectURL(file));
                            }
                          }} 
                          className="text-xs font-semibold text-text-light file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-black file:bg-primary file:text-white hover:file:bg-accent hover:file:text-primary file:cursor-pointer"
                        />
                        <span className="text-[9px] text-text-light">Recommended size: 300x300 pixels</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Guardian Details */}
              {activeStudentFormTab === 'guardian' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Parent/Guardian Name</label>
                      <input 
                        type="text" 
                        placeholder="E.g. Ramesh Singh" 
                        value={studentForm.guardianName} 
                        onChange={(e) => setStudentForm({...studentForm, guardianName: e.target.value})} 
                        className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Relationship</label>
                      <input 
                        type="text" 
                        placeholder="E.g. Father / Mother / Uncle" 
                        value={studentForm.guardianRelationship} 
                        onChange={(e) => setStudentForm({...studentForm, guardianRelationship: e.target.value})} 
                        className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Guardian Phone Number</label>
                      <input 
                        type="tel" 
                        placeholder="E.g. +91 98765 43211" 
                        value={studentForm.guardianPhone} 
                        onChange={(e) => setStudentForm({...studentForm, guardianPhone: e.target.value})} 
                        className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Emergency Contact Number</label>
                      <input 
                        type="tel" 
                        placeholder="E.g. +91 98765 43212" 
                        value={studentForm.guardianEmergency} 
                        onChange={(e) => setStudentForm({...studentForm, guardianEmergency: e.target.value})} 
                        className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Guardian Address</label>
                    <textarea 
                      rows={2} 
                      placeholder="Leave blank if same as student address" 
                      value={studentForm.guardianAddress} 
                      onChange={(e) => setStudentForm({...studentForm, guardianAddress: e.target.value})} 
                      className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold resize-none" 
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: Academy Details */}
              {activeStudentFormTab === 'academy' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Residency Status *</label>
                      <select 
                        value={studentForm.residency} 
                        onChange={(e) => setStudentForm({...studentForm, residency: e.target.value})} 
                        className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold"
                      >
                        <option value="resident">Boarding (Resident)</option>
                        <option value="non-resident">Day Scholar (Non-Resident)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Hostel Room Number (if Resident)</label>
                      <input 
                        type="text" 
                        placeholder="E.g. Room 4B" 
                        value={studentForm.hostelRoom} 
                        onChange={(e) => setStudentForm({...studentForm, hostelRoom: e.target.value})} 
                        disabled={studentForm.residency === 'non-resident'}
                        className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold disabled:opacity-50" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Admission Date *</label>
                      <input 
                        required 
                        type="date" 
                        value={studentForm.admissionDate} 
                        onChange={(e) => setStudentForm({...studentForm, admissionDate: e.target.value})} 
                        className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Training Batch</label>
                      <input 
                        type="text" 
                        placeholder="E.g. Morning Elite A" 
                        value={studentForm.batch} 
                        onChange={(e) => setStudentForm({...studentForm, batch: e.target.value})} 
                        className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Assigned Coach</label>
                      <input 
                        type="text" 
                        placeholder="E.g. Coach Rajesh" 
                        value={studentForm.coach} 
                        onChange={(e) => setStudentForm({...studentForm, coach: e.target.value})} 
                        className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Primary Sport Discipline *</label>
                      <select 
                        value={studentForm.primarySport} 
                        onChange={(e) => setStudentForm({...studentForm, primarySport: e.target.value})} 
                        className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold"
                      >
                        <option value="Football">Football</option>
                        <option value="Handball">Handball</option>
                        <option value="Athletics">Athletics</option>
                        <option value="Rugby">Rugby</option>
                        <option value="Kabaddi">Kabaddi</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Secondary Sports (Comma Separated)</label>
                      <input 
                        type="text" 
                        placeholder="E.g. Handball, Athletics" 
                        value={studentForm.secondarySports.join(', ')} 
                        onChange={(e) => {
                          const list = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          setStudentForm({...studentForm, secondarySports: list});
                        }} 
                        className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Education Details */}
              {activeStudentFormTab === 'education' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-wider">School / College Name</label>
                      <input 
                        type="text" 
                        placeholder="E.g. Rani Laxmibai High School" 
                        value={studentForm.schoolName} 
                        onChange={(e) => setStudentForm({...studentForm, schoolName: e.target.value})} 
                        className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Class / Grade</label>
                      <input 
                        type="text" 
                        placeholder="E.g. Class 9" 
                        value={studentForm.className} 
                        onChange={(e) => setStudentForm({...studentForm, className: e.target.value})} 
                        className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Academic Performance / Remarks</label>
                    <textarea 
                      rows={3} 
                      placeholder="Academic updates, exam details, board details, or tutoring notes..." 
                      value={studentForm.academicInfo} 
                      onChange={(e) => setStudentForm({...studentForm, academicInfo: e.target.value})} 
                      className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold resize-none" 
                    />
                  </div>
                </div>
              )}

              {/* Tab 5: Achievements Details */}
              {activeStudentFormTab === 'achievements' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center pb-2 border-b border-border-gray/50">
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Sports Achievements & Medals List</span>
                    <button 
                      type="button"
                      onClick={() => {
                        setStudentForm({
                          ...studentForm,
                          achievements: [...studentForm.achievements, { title: '', competition: '', position: '', year: new Date().getFullYear(), description: '' }]
                        });
                      }}
                      className="py-1 px-2.5 bg-primary text-white hover:bg-accent hover:text-primary transition-all rounded text-[10px] font-bold cursor-pointer"
                    >
                      + Add Row
                    </button>
                  </div>

                  {studentForm.achievements.length === 0 ? (
                    <div className="text-center py-6 text-text-light italic text-xs">
                      No achievements recorded for this student yet. Click "+ Add Row" to append achievements.
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                      {studentForm.achievements.map((ach, idx) => (
                        <div key={idx} className="p-3 border border-border-gray rounded-lg bg-soft-light space-y-2 relative">
                          <button 
                            type="button" 
                            onClick={() => {
                              const list = studentForm.achievements.filter((_, i) => i !== idx);
                              setStudentForm({ ...studentForm, achievements: list });
                            }}
                            className="absolute top-2.5 right-2.5 text-rose-500 hover:text-rose-700 bg-transparent border-none p-1 cursor-pointer"
                            title="Remove Row"
                          >
                            <Trash size={14} />
                          </button>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                            <input 
                              type="text" 
                              required 
                              placeholder="Medal/Title (e.g. Gold Medalist)" 
                              value={ach.title} 
                              onChange={(e) => {
                                const list = [...studentForm.achievements];
                                list[idx].title = e.target.value;
                                setStudentForm({ ...studentForm, achievements: list });
                              }}
                              className="py-1.5 px-2.5 border border-border-gray rounded text-xs bg-white outline-none" 
                            />
                            <input 
                              type="text" 
                              required 
                              placeholder="Tournament/Competition Name" 
                              value={ach.competition} 
                              onChange={(e) => {
                                const list = [...studentForm.achievements];
                                list[idx].competition = e.target.value;
                                setStudentForm({ ...studentForm, achievements: list });
                              }}
                              className="py-1.5 px-2.5 border border-border-gray rounded text-xs bg-white outline-none" 
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input 
                              type="text" 
                              placeholder="Position (e.g. Winner/Runner Up)" 
                              value={ach.position} 
                              onChange={(e) => {
                                const list = [...studentForm.achievements];
                                list[idx].position = e.target.value;
                                setStudentForm({ ...studentForm, achievements: list });
                              }}
                              className="py-1.5 px-2.5 border border-border-gray rounded text-xs bg-white outline-none" 
                            />
                            <input 
                              type="number" 
                              required 
                              placeholder="Year (e.g. 2026)" 
                              value={ach.year} 
                              onChange={(e) => {
                                const list = [...studentForm.achievements];
                                list[idx].year = parseInt(e.target.value) || new Date().getFullYear();
                                setStudentForm({ ...studentForm, achievements: list });
                              }}
                              className="py-1.5 px-2.5 border border-border-gray rounded text-xs bg-white outline-none" 
                            />
                            <input 
                              type="text" 
                              placeholder="Quick Notes" 
                              value={ach.description} 
                              onChange={(e) => {
                                const list = [...studentForm.achievements];
                                list[idx].description = e.target.value;
                                setStudentForm({ ...studentForm, achievements: list });
                              }}
                              className="py-1.5 px-2.5 border border-border-gray rounded text-xs bg-white outline-none" 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 6: Documents & Settings */}
              {activeStudentFormTab === 'documents' && (
                <div className="space-y-4 animate-fade-in text-xs font-semibold">
                  <div className="p-4 border border-border-gray rounded-xl bg-soft-light space-y-3">
                    <span className="block text-[10px] font-bold text-primary uppercase tracking-wider pb-1 border-b border-border-gray">Secure Document Upload Checklist</span>
                    
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] text-text-light">Select documents to upload (ID Proof, Birth Certificate, Consent Forms):</span>
                      <input 
                        type="file" 
                        multiple 
                        onChange={(e) => {
                          if (e.target.files) {
                            const newFiles = Array.from(e.target.files).map(file => ({
                              file,
                              name: file.name.split('.')[0]
                            }));
                            setStudentDocFiles([...studentDocFiles, ...newFiles]);
                          }
                        }} 
                        className="text-xs file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-slate-200 file:text-primary file:cursor-pointer"
                      />
                    </div>

                    {studentDocFiles.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-dashed border-border-gray">
                        <span className="block text-[10px] text-primary uppercase font-bold">Files to Upload:</span>
                        {studentDocFiles.map((doc, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded border border-border-gray justify-between">
                            <input 
                              type="text" 
                              value={doc.name} 
                              onChange={(e) => {
                                const list = [...studentDocFiles];
                                list[idx].name = e.target.value;
                                setStudentDocFiles(list);
                              }}
                              className="py-1 px-2 border border-border-gray rounded text-xs flex-1 max-w-[200px]" 
                            />
                            <span className="text-[10px] text-text-light truncate flex-1 pl-2">({doc.file.name})</span>
                            <button 
                              type="button" 
                              onClick={() => setStudentDocFiles(studentDocFiles.filter((_, i) => i !== idx))}
                              className="text-rose-500 hover:text-rose-700 bg-transparent border-none p-1 cursor-pointer font-bold"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {editingStudentProfile && editingStudentProfile.documents?.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-dashed border-border-gray">
                        <span className="block text-[10px] text-primary uppercase font-bold">Existing Secure Documents:</span>
                        {editingStudentProfile.documents.map((doc: any, idx: number) => {
                          const isRemoved = deletedDocuments.includes(doc.path);
                          return (
                            <div key={idx} className={`flex items-center justify-between p-2 rounded border border-border-gray ${isRemoved ? 'bg-rose-50 border-rose-100 opacity-60' : 'bg-white'}`}>
                              <span className="text-xs font-semibold text-primary truncate max-w-[220px]">{doc.name}</span>
                              {!isRemoved ? (
                                <button 
                                  type="button" 
                                  onClick={() => setDeletedDocuments([...deletedDocuments, doc.path])}
                                  className="text-rose-500 hover:text-rose-700 bg-transparent border-none p-1 cursor-pointer font-bold text-xs"
                                >
                                  Remove Securely
                                </button>
                              ) : (
                                <button 
                                  type="button" 
                                  onClick={() => setDeletedDocuments(deletedDocuments.filter(p => p !== doc.path))}
                                  className="text-emerald-600 hover:text-emerald-700 bg-transparent border-none p-1 cursor-pointer font-bold text-xs"
                                >
                                  Undo
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Public Visibility Toggle */}
                  <div className="p-4 border border-border-gray rounded-xl bg-soft-light flex justify-between items-center">
                    <div>
                      <span className="block text-xs font-bold text-primary">Show Profile on Public Website</span>
                      <span className="block text-[10px] text-text-light font-semibold mt-0.5">Approved information: Full Name, Sport, Medals count, Photo</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={studentForm.showOnPublicWebsite} 
                      onChange={(e) => setStudentForm({ ...studentForm, showOnPublicWebsite: e.target.checked })}
                      className="w-5 h-5 text-primary border-border-gray rounded focus:ring-primary cursor-pointer shrink-0" 
                    />
                  </div>

                  {activeModal === 'student-edit' && (
                    <div className="p-4 border border-border-gray rounded-xl bg-soft-light flex justify-between items-center">
                      <div>
                        <span className="block text-xs font-bold text-primary">Student Roster Status</span>
                        <span className="block text-[10px] text-text-light font-semibold mt-0.5">Toggle student's training or residency state</span>
                      </div>
                      <select 
                        value={studentForm.status} 
                        onChange={(e) => setStudentForm({...studentForm, status: e.target.value})}
                        className="px-3 py-1.5 border border-border-gray rounded bg-white text-xs font-semibold text-primary outline-none"
                      >
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Graduated">Graduated</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Form submit footer */}
              <div className="pt-4 border-t border-border-gray flex justify-between items-center shrink-0">
                <button 
                  type="button" 
                  onClick={resetStudentForm} 
                  className="bg-white hover:bg-slate-50 border border-border-gray text-primary font-bold py-2.5 px-6 rounded-lg transition-all text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <div className="flex gap-2">
                  {activeStudentFormTab !== 'personal' && (
                    <button 
                      type="button" 
                      onClick={() => {
                        const tabs = ['personal', 'guardian', 'academy', 'education', 'achievements', 'documents'];
                        const idx = tabs.indexOf(activeStudentFormTab);
                        if (idx > 0) setActiveStudentFormTab(tabs[idx - 1]);
                      }}
                      className="bg-slate-100 hover:bg-slate-200 border border-border-gray text-slate-700 font-bold py-2.5 px-5 rounded-lg transition-all text-xs cursor-pointer"
                    >
                      Back
                    </button>
                  )}
                  {activeStudentFormTab !== 'documents' ? (
                    <button 
                      type="button" 
                      onClick={() => {
                        const tabs = ['personal', 'guardian', 'academy', 'education', 'achievements', 'documents'];
                        const idx = tabs.indexOf(activeStudentFormTab);
                        if (idx < tabs.length - 1) setActiveStudentFormTab(tabs[idx + 1]);
                      }}
                      className="bg-primary hover:bg-accent hover:text-primary text-white font-bold py-2.5 px-6 rounded-lg transition-all text-xs cursor-pointer border-none shadow-md"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      disabled={isUploading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-lg transition-all text-xs cursor-pointer border-none shadow-md"
                    >
                      {isUploading ? 'Saving...' : 'Save Record'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detailed Student Profile Viewer Modal */}
      {viewingStudentProfile !== null && (
        <div className="fixed inset-0 bg-black/15 backdrop-blur-sm z-[250] flex items-center justify-center p-5 animate-fade-in" onClick={() => { setViewingStudentProfile(null); setActiveProfileViewTab('overview'); }}>
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl p-6 md:p-8 text-left relative animate-fade-in max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-5 right-5 text-text-light hover:text-primary cursor-pointer border-none bg-transparent animate-fade-in" onClick={() => { setViewingStudentProfile(null); setActiveProfileViewTab('overview'); }}><X size={20} /></button>
            
            {/* Profile Overview Header Card */}
            <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-border-gray pb-5 shrink-0">
              <div className="w-20 h-20 rounded-full border-4 border-slate-100 flex items-center justify-center bg-slate-50 text-4xl overflow-hidden shadow-md shrink-0">
                {viewingStudentProfile.avatar && (viewingStudentProfile.avatar.startsWith('data:') || viewingStudentProfile.avatar.includes('/') || viewingStudentProfile.avatar.includes('.')) ? (
                  <img 
                    src={viewingStudentProfile.avatar.startsWith('/') ? `http://localhost:5000${viewingStudentProfile.avatar}` : viewingStudentProfile.avatar} 
                    alt={viewingStudentProfile.fullName || viewingStudentProfile.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span>{viewingStudentProfile.avatar || '🎓'}</span>
                )}
              </div>
              <div className="text-center sm:text-left flex-1 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h3 className="text-xl font-extrabold text-primary">{viewingStudentProfile.fullName || viewingStudentProfile.name}</h3>
                  <span className={`inline-block w-fit px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                    viewingStudentProfile.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    viewingStudentProfile.status === 'On Leave' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-slate-50 text-slate-700 border-slate-200'
                  }`}>
                    {viewingStudentProfile.status || 'Active'}
                  </span>
                </div>
                <div className="text-xs text-text-light font-bold flex flex-wrap justify-center sm:justify-start items-center gap-3">
                  <span>Student ID: <strong className="text-primary">{viewingStudentProfile.studentId || viewingStudentProfile.id}</strong></span>
                  <span>&bull;</span>
                  <span>Sport: <strong className="text-primary">{viewingStudentProfile.primarySport || viewingStudentProfile.sport}</strong></span>
                  <span>&bull;</span>
                  <span>Age: <strong className="text-primary">{viewingStudentProfile.age || 'N/A'} Years</strong></span>
                </div>
              </div>
            </div>

            {/* Profile Tabs Navigation */}
            <div className="flex border-b border-border-gray shrink-0 bg-white mb-4 overflow-x-auto">
              {['overview', 'personal', 'guardian', 'sports & academy', 'education', 'documents'].map((tab) => (
                <button 
                  key={tab}
                  type="button"
                  onClick={() => setActiveProfileViewTab(tab)}
                  className={`py-2.5 px-4 text-xs font-bold border-none cursor-pointer transition-all capitalize whitespace-nowrap ${
                    activeProfileViewTab === tab 
                      ? 'text-primary border-b-2 border-b-primary bg-slate-50' 
                      : 'text-text-light hover:text-primary bg-transparent'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Profile Tab Contents */}
            <div className="flex-1 overflow-y-auto pr-1 text-xs font-semibold text-text-body space-y-4">
              {viewingStudentProfile.isDeleted && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg flex items-center gap-2 mb-2 font-bold animate-pulse">
                  <span>⚠️</span> This student record has been deactivated and soft-deleted. Click restore in the main roster to recover this record.
                </div>
              )}

              {/* Tab 1: Overview */}
              {activeProfileViewTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                  <div className="space-y-4">
                    <div className="bg-soft-light p-4 rounded-xl border border-border-gray space-y-3">
                      <span className="block text-[10px] font-black text-primary uppercase tracking-wider border-b border-border-gray pb-1.5">Overview Card</span>
                      <div className="flex justify-between"><span>Training Status:</span><span className="font-extrabold text-primary">{viewingStudentProfile.status || 'Active'}</span></div>
                      <div className="flex justify-between"><span>Primary Sport:</span><span className="font-extrabold text-primary">{viewingStudentProfile.primarySport || viewingStudentProfile.sport}</span></div>
                      <div className="flex justify-between"><span>Residency Program:</span><span className="font-extrabold text-primary capitalize">{viewingStudentProfile.residency || 'Resident'}</span></div>
                      {viewingStudentProfile.residency === 'resident' && <div className="flex justify-between"><span>Hostel Room:</span><span className="font-extrabold text-primary">{viewingStudentProfile.hostelRoom || 'Not Assigned'}</span></div>}
                      <div className="flex justify-between"><span>Admission Date:</span><span className="font-extrabold text-primary">{viewingStudentProfile.admissionDate ? viewingStudentProfile.admissionDate.split('T')[0] : (viewingStudentProfile.joined || 'N/A')}</span></div>
                    </div>

                    <div className="bg-soft-light p-4 rounded-xl border border-border-gray space-y-3">
                      <span className="block text-[10px] font-black text-primary uppercase tracking-wider border-b border-border-gray pb-1.5">Emergency Information</span>
                      <div className="flex justify-between"><span>Primary Parent/Guardian:</span><span className="font-extrabold text-primary">{viewingStudentProfile.guardian?.name || 'N/A'}</span></div>
                      <div className="flex justify-between"><span>Guardian Emergency Contact:</span><span className="font-extrabold text-rose-600">{viewingStudentProfile.guardian?.emergencyContact || viewingStudentProfile.guardian?.phone || 'N/A'}</span></div>
                      <div className="flex justify-between"><span>Blood Group:</span><span className="font-extrabold text-rose-600">{viewingStudentProfile.bloodGroup || 'N/A'}</span></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-soft-light p-4 rounded-xl border border-border-gray flex flex-col justify-center h-full space-y-3">
                      <span className="block text-[10px] font-black text-primary uppercase tracking-wider border-b border-border-gray pb-1.5">Academy Performance Summary</span>
                      <div className="flex justify-between items-center py-2 bg-white px-3.5 rounded-xl border border-border-gray">
                        <span className="font-bold flex items-center gap-1.5 text-xs"><span className="text-sm">🏅</span> Registered Medals:</span>
                        <span className="font-black text-sm text-primary">{viewingStudentProfile.medalNumber || 0}</span>
                      </div>
                      <div className="flex justify-between"><span>Coaching Batch:</span><span className="font-extrabold text-primary">{viewingStudentProfile.batch || 'Not Assigned'}</span></div>
                      <div className="flex justify-between"><span>Assigned Coach:</span><span className="font-extrabold text-primary">{viewingStudentProfile.coach || 'Not Assigned'}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Personal Profile */}
              {activeProfileViewTab === 'personal' && (
                <div className="bg-soft-light p-5 rounded-xl border border-border-gray space-y-4.5 animate-fade-in">
                  <span className="block text-[10px] font-black text-primary uppercase tracking-wider border-b border-border-gray pb-1.5">Personal Profile Details</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-0.5"><span className="text-[10px] text-text-light uppercase font-bold">Display Name</span><span className="text-xs font-bold text-primary">{viewingStudentProfile.fullName || viewingStudentProfile.name}</span></div>
                    <div className="flex flex-col gap-0.5"><span className="text-[10px] text-text-light uppercase font-bold">Date of Birth</span><span className="text-xs font-bold text-primary">{viewingStudentProfile.dateOfBirth ? new Date(viewingStudentProfile.dateOfBirth).toLocaleDateString() : 'N/A'}</span></div>
                    <div className="flex flex-col gap-0.5"><span className="text-[10px] text-text-light uppercase font-bold">Gender</span><span className="text-xs font-bold text-primary capitalize">{viewingStudentProfile.gender || 'girl'}</span></div>
                    <div className="flex flex-col gap-0.5"><span className="text-[10px] text-text-light uppercase font-bold">Blood Group</span><span className="text-xs font-bold text-rose-600">{viewingStudentProfile.bloodGroup || 'N/A'}</span></div>
                    <div className="flex flex-col gap-0.5"><span className="text-[10px] text-text-light uppercase font-bold">Student Phone</span><span className="text-xs font-bold text-primary">{viewingStudentProfile.contact?.phone || 'N/A'}</span></div>
                    <div className="flex flex-col gap-0.5"><span className="text-[10px] text-text-light uppercase font-bold">Student Email</span><span className="text-xs font-bold text-primary">{viewingStudentProfile.contact?.email || 'N/A'}</span></div>
                  </div>
                  <div className="flex flex-col gap-0.5 pt-2 border-t border-dashed border-border-gray">
                    <span className="text-[10px] text-text-light uppercase font-bold">Residential Address</span>
                    <span className="text-xs font-semibold text-primary">{viewingStudentProfile.contact?.address || 'N/A'}</span>
                  </div>
                </div>
              )}

              {/* Tab 3: Guardian Details */}
              {activeProfileViewTab === 'guardian' && (
                <div className="bg-soft-light p-5 rounded-xl border border-border-gray space-y-4.5 animate-fade-in">
                  <span className="block text-[10px] font-black text-primary uppercase tracking-wider border-b border-border-gray pb-1.5">Parent / Guardian Details</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-0.5"><span className="text-[10px] text-text-light uppercase font-bold">Guardian Name</span><span className="text-xs font-bold text-primary">{viewingStudentProfile.guardian?.name || 'N/A'}</span></div>
                    <div className="flex flex-col gap-0.5"><span className="text-[10px] text-text-light uppercase font-bold">Relationship</span><span className="text-xs font-bold text-primary">{viewingStudentProfile.guardian?.relationship || 'N/A'}</span></div>
                    <div className="flex flex-col gap-0.5"><span className="text-[10px] text-text-light uppercase font-bold">Primary Phone</span><span className="text-xs font-bold text-primary">{viewingStudentProfile.guardian?.phone || 'N/A'}</span></div>
                    <div className="flex flex-col gap-0.5"><span className="text-[10px] text-text-light uppercase font-bold">Emergency Phone</span><span className="text-xs font-bold text-rose-600">{viewingStudentProfile.guardian?.emergencyContact || 'N/A'}</span></div>
                  </div>
                  <div className="flex flex-col gap-0.5 pt-2 border-t border-dashed border-border-gray">
                    <span className="text-[10px] text-text-light uppercase font-bold">Guardian Address</span>
                    <span className="text-xs font-semibold text-primary">{viewingStudentProfile.guardian?.address || 'Same as Student Address'}</span>
                  </div>
                </div>
              )}

              {/* Tab 4: Sports & Academy */}
              {activeProfileViewTab === 'sports & academy' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-soft-light p-5 rounded-xl border border-border-gray space-y-4.5">
                    <span className="block text-[10px] font-black text-primary uppercase tracking-wider border-b border-border-gray pb-1.5">Academy & Coaching Details</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-0.5"><span className="text-[10px] text-text-light uppercase font-bold">Residency Status</span><span className="text-xs font-bold text-primary capitalize">{viewingStudentProfile.residency || 'Resident'}</span></div>
                      <div className="flex flex-col gap-0.5"><span className="text-[10px] text-text-light uppercase font-bold">Hostel Room</span><span className="text-xs font-bold text-primary">{viewingStudentProfile.hostelRoom || 'N/A'}</span></div>
                      <div className="flex flex-col gap-0.5"><span className="text-[10px] text-text-light uppercase font-bold">Training Batch</span><span className="text-xs font-bold text-primary">{viewingStudentProfile.batch || 'Not Assigned'}</span></div>
                      <div className="flex flex-col gap-0.5"><span className="text-[10px] text-text-light uppercase font-bold">Assigned Coach</span><span className="text-xs font-bold text-primary">{viewingStudentProfile.coach || 'Not Assigned'}</span></div>
                      <div className="flex flex-col gap-0.5"><span className="text-[10px] text-text-light uppercase font-bold">Primary Sport Discipline</span><span className="text-xs font-bold text-primary font-black uppercase">{viewingStudentProfile.primarySport || viewingStudentProfile.sport}</span></div>
                      <div className="flex flex-col gap-0.5"><span className="text-[10px] text-text-light uppercase font-bold">Secondary Sports</span><span className="text-xs font-bold text-primary">{viewingStudentProfile.secondarySports?.join(', ') || 'None'}</span></div>
                    </div>
                  </div>

                  {/* Achievements Grid */}
                  <div className="bg-soft-light p-5 rounded-xl border border-border-gray space-y-3">
                    <span className="block text-[10px] font-black text-primary uppercase tracking-wider border-b border-border-gray pb-1.5">Detailed Achievements History ({viewingStudentProfile.achievements?.length || 0})</span>
                    {(!viewingStudentProfile.achievements || viewingStudentProfile.achievements.length === 0) ? (
                      <span className="text-text-light italic text-xs block text-center py-2">No competition records added yet.</span>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
                        {viewingStudentProfile.achievements.map((ach: any, idx: number) => (
                          <div key={idx} className="p-3 border border-border-gray bg-white rounded-lg flex flex-col justify-between hover:shadow-xs transition-shadow">
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-extrabold text-[11px] text-primary">{ach.title}</span>
                                <span className="bg-primary/5 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded">{ach.year}</span>
                              </div>
                              <span className="text-[10px] text-accent block font-bold uppercase tracking-wide mb-1.5">{ach.competition}</span>
                              <p className="text-[11px] text-text-light italic leading-normal">
                                {ach.description ? `"${ach.description}"` : 'No description'}
                              </p>
                            </div>
                            {ach.position && (
                              <span className="mt-2 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 w-fit px-2 py-0.5 rounded uppercase tracking-wider">
                                {ach.position}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 5: Education */}
              {activeProfileViewTab === 'education' && (
                <div className="bg-soft-light p-5 rounded-xl border border-border-gray space-y-4.5 animate-fade-in">
                  <span className="block text-[10px] font-black text-primary uppercase tracking-wider border-b border-border-gray pb-1.5">School / Academic Details</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-0.5"><span className="text-[10px] text-text-light uppercase font-bold">School Name</span><span className="text-xs font-bold text-primary">{viewingStudentProfile.education?.schoolName || 'N/A'}</span></div>
                    <div className="flex flex-col gap-0.5"><span className="text-[10px] text-text-light uppercase font-bold">Class / Grade</span><span className="text-xs font-bold text-primary">{viewingStudentProfile.education?.className || 'N/A'}</span></div>
                  </div>
                  <div className="flex flex-col gap-0.5 pt-2 border-t border-dashed border-border-gray">
                    <span className="text-[10px] text-text-light uppercase font-bold">Academic Performance & Tutoring Remarks</span>
                    <span className="text-xs font-semibold text-primary block leading-relaxed">{viewingStudentProfile.education?.academicInfo || 'No remarks recorded.'}</span>
                  </div>
                </div>
              )}

              {/* Tab 6: Documents */}
              {activeProfileViewTab === 'documents' && (
                <div className="space-y-4 animate-fade-in text-xs font-semibold">
                  <div className="bg-soft-light p-5 rounded-xl border border-border-gray space-y-3.5">
                    <span className="block text-[10px] font-black text-primary uppercase tracking-wider border-b border-border-gray pb-1.5">Secure Document Drawer</span>
                    
                    {(!viewingStudentProfile.documents || viewingStudentProfile.documents.length === 0) ? (
                      <span className="text-text-light italic text-xs block text-center py-2">No documents uploaded.</span>
                    ) : (
                      <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                        {viewingStudentProfile.documents.map((doc: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-3 border border-border-gray bg-white rounded-lg hover:shadow-xs transition-shadow">
                            <div>
                              <span className="text-xs font-bold text-primary block">{doc.name}</span>
                              <span className="text-[9px] text-text-light block font-semibold mt-0.5">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                            </div>
                            <a 
                              href={`http://localhost:5000${doc.path}`} 
                              target="_blank" 
                              rel="noreferrer"
                              onClick={async (e) => {
                                e.preventDefault();
                                try {
                                  const response = await fetch(`http://localhost:5000${doc.path}`, {
                                    headers: { 'Authorization': `Bearer ${token}` }
                                  });
                                  if (response.ok) {
                                    const blob = await response.blob();
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = doc.name + '.' + doc.path.split('.').pop();
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                  } else {
                                    alert("Unauthorized or document expired.");
                                  }
                                } catch (err) {
                                  console.error("Document download failed:", err);
                                }
                              }}
                              className="bg-primary hover:bg-accent hover:text-primary text-white font-bold text-[10px] py-1.5 px-3 rounded shadow-xs cursor-pointer border-none uppercase tracking-wider transition-colors"
                            >
                              Download File
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-soft-light p-4 rounded-xl border border-border-gray flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-primary">Public Visibility Setting</span>
                      <span className="block text-[10px] text-text-light font-semibold mt-0.5">
                        {viewingStudentProfile.showOnPublicWebsite 
                          ? '✅ Visible in public athletes directory on academy homepage.' 
                          : '🔒 Private admin-only record. Completely hidden from public site.'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile footer actions */}
            <div className="pt-4 border-t border-border-gray shrink-0 flex justify-between items-center bg-white">
              <button 
                type="button" 
                onClick={() => { setViewingStudentProfile(null); setActiveProfileViewTab('overview'); }}
                className="bg-primary text-white hover:bg-accent hover:text-primary transition-all font-bold py-2.5 px-6 rounded-lg text-xs cursor-pointer shadow-md"
              >
                Close Profile
              </button>
              
              {!viewingStudentProfile.isDeleted && (
                <button 
                  type="button" 
                  onClick={() => {
                    const student = viewingStudentProfile;
                    setViewingStudentProfile(null);
                    handleEditStudentClick(student);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg transition-all text-xs cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Pencil size={15} /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Add Coach Modal */}
      {activeModal === 'coach' && (
        <div className="fixed inset-0 bg-black/15 backdrop-blur-sm z-[250] flex items-center justify-center p-5 animate-fade-in" onClick={closeCoachModal}>
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 md:p-8 text-left relative animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-5 right-5 text-text-light hover:text-primary cursor-pointer border-none bg-transparent" onClick={closeCoachModal}><X size={20} /></button>
            <h3 className="text-lg font-bold text-primary mb-5 flex items-center gap-2">
              {editingCoach ? <Pencil size={20} className="text-accent" /> : <Plus size={20} className="text-accent" />}
              {editingCoach ? 'Edit Coach Profile' : 'Add Coach'}
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
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Experience (Years)</label>
                <input required type="number" min="1" max="40" placeholder="E.g. 10" value={coachForm.experience} onChange={(e) => setCoachForm({...coachForm, experience: e.target.value})} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Bio Description</label>
                <textarea required rows={3} placeholder="Coach profile info..." value={coachForm.bio} onChange={(e) => setCoachForm({...coachForm, bio: e.target.value})} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Profile Photo</label>
                {coachForm.avatar && (coachForm.avatar.startsWith('http') || coachForm.avatar.startsWith('/') || coachForm.avatar.startsWith('data:')) ? (
                  <div className="flex items-center gap-4 p-3 bg-soft-light border border-border-gray rounded-xl">
                    <img 
                      src={coachForm.avatar} 
                      alt="Cropped Coach" 
                      className="w-20 h-15 object-cover rounded border border-border-gray shadow-xs" 
                    />
                    <div className="text-left">
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded uppercase">Image Ready</span>
                      <button 
                        type="button"
                        onClick={() => {
                          setCroppingTarget('coach');
                          setCropperSource('');
                          setCropZoom(1);
                          setCropPosition({ x: 0, y: 0 });
                          setShowCropperModal(true);
                        }}
                        className="block mt-1.5 text-xs text-primary-light hover:text-accent font-bold cursor-pointer underline bg-transparent border-none p-0"
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setCroppingTarget('coach');
                      setCropperSource('');
                      setCropZoom(1);
                      setCropPosition({ x: 0, y: 0 });
                      setShowCropperModal(true);
                    }}
                    className="w-full py-5 px-4 border-2 border-dashed border-border-gray hover:border-primary rounded-xl flex flex-col items-center justify-center gap-2 bg-soft-light hover:bg-white transition-all cursor-pointer group outline-none"
                  >
                    <Plus size={20} className="text-text-light group-hover:text-primary transition-colors" />
                    <span className="text-xs font-bold text-text-light group-hover:text-primary transition-colors">Choose & Crop Photo (4:3)</span>
                  </button>
                )}
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-accent hover:text-primary transition-all text-white font-bold py-3 mt-3 rounded-lg cursor-pointer text-sm">
                {editingCoach ? 'Update Profile' : 'Save Record'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Quick View Event Photos Modal */}
      {showQuickViewEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[250] flex items-center justify-center p-5 animate-fade-in" onClick={() => setShowQuickViewEvent(null)}>
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl p-6 md:p-8 text-left relative animate-fade-in flex flex-col max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-5 right-5 text-text-light hover:text-primary cursor-pointer border-none bg-transparent" onClick={() => setShowQuickViewEvent(null)}><X size={20} /></button>
            <div className="mb-4">
              <span className="bg-primary text-accent text-[9px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide">{showQuickViewEvent.category}</span>
              <h3 className="text-lg font-bold text-primary mt-1">{showQuickViewEvent.name}</h3>
              <p className="text-text-light text-xs mt-1">
                {showQuickViewEvent.location ? `${showQuickViewEvent.location} • ` : ''}
                {showQuickViewEvent.date ? new Date(showQuickViewEvent.date).toLocaleDateString() : ''}
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 py-2 border-t border-border-gray/50 mt-2">
              {showQuickViewEvent.photos?.map((photo: any, idx: number) => (
                <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-border-gray/40 relative group bg-soft-light">
                  <img src={`http://localhost:5000${photo.path}`} alt="" className="w-full h-full object-cover" />
                  {showQuickViewEvent.coverImage === photo.path && (
                    <span className="absolute top-2.5 right-2.5 bg-emerald-500 text-white text-[8px] px-2 py-0.5 rounded font-extrabold shadow-sm uppercase tracking-wider">Cover</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {activeModal === 'gallery-create' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[250] flex items-center justify-center p-5 animate-fade-in" onClick={() => { setActiveModal(null); resetEventGalleryForm(); }}>
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl p-6 md:p-8 text-left relative animate-fade-in max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-5 right-5 text-text-light hover:text-primary cursor-pointer border-none bg-transparent" onClick={() => { setActiveModal(null); resetEventGalleryForm(); }}><X size={20} /></button>
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <Plus size={20} className="text-accent" /> Create New Gallery Event
            </h3>
            
            <form onSubmit={handleSaveEventGallery} className="flex-1 overflow-y-auto pr-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Event Name *</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="E.g. Annual Sports Meet 2026" 
                    value={eventGalleryForm.name} 
                    onChange={(e) => setEventGalleryForm({...eventGalleryForm, name: e.target.value})} 
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Media Type *</label>
                  <select 
                    value={eventGalleryForm.mediaType} 
                    onChange={(e) => setEventGalleryForm({...eventGalleryForm, mediaType: e.target.value as 'image' | 'video'})} 
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-white outline-none focus:border-primary transition-all font-semibold"
                  >
                    <option value="image">📸 Image Album</option>
                    <option value="video">🎥 YouTube Video</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Category *</label>
                  <select 
                    value={eventGalleryForm.category} 
                    onChange={(e) => setEventGalleryForm({...eventGalleryForm, category: e.target.value})} 
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-white outline-none focus:border-primary transition-all font-semibold"
                  >
                    <option value="Events">Events</option>
                    <option value="Tournaments">Tournaments</option>
                    <option value="Training">Training</option>
                    <option value="Achievements">Achievements</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Celebrations">Celebrations</option>
                    <option value="Videos">Videos</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Event Date *</label>
                  <input 
                    required 
                    type="date" 
                    value={eventGalleryForm.date} 
                    onChange={(e) => setEventGalleryForm({...eventGalleryForm, date: e.target.value})} 
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-white outline-none focus:border-primary transition-all font-semibold" 
                  />
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Venue Location (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="E.g. Main Cricket Field, Siwan Campus" 
                    value={eventGalleryForm.location} 
                    onChange={(e) => setEventGalleryForm({...eventGalleryForm, location: e.target.value})} 
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                  />
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Event Description (Optional)</label>
                  <textarea 
                    rows={3}
                    placeholder="Write a brief overview of this event..." 
                    value={eventGalleryForm.description} 
                    onChange={(e) => setEventGalleryForm({...eventGalleryForm, description: e.target.value})} 
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                  />
                </div>
              </div>

              {/* YouTube video URL field if mediaType is video */}
              {eventGalleryForm.mediaType === 'video' && (
                <div className="flex flex-col gap-1 md:col-span-2 border-t border-border-gray/50 pt-4">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">YouTube Video URL *</label>
                  <input 
                    required={eventGalleryForm.mediaType === 'video'}
                    type="url" 
                    placeholder="E.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
                    value={eventGalleryForm.videoUrl} 
                    onChange={(e) => setEventGalleryForm({...eventGalleryForm, videoUrl: e.target.value})} 
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                  />
                  <p className="text-[10px] text-text-light mt-1">Supports standard watch links, youtu.be shortlinks, or embed links.</p>
                </div>
              )}

              {/* Photo Upload section if mediaType is image */}
              {eventGalleryForm.mediaType === 'image' && (
                <>
                  {/* Multiple Upload files */}
                  <div className="flex flex-col gap-1.5 border-t border-border-gray/50 pt-4">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Upload Event Photos * (Multiple select supported)</label>
                    <input 
                      type="file" 
                      multiple
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full py-1.5 px-2 border border-border-gray rounded text-xs bg-white focus:border-primary transition-all font-semibold cursor-pointer"
                    />
                  </div>

                  {/* Photo previews with Cover select */}
                  {selectedPhotoPreviews.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-text-light uppercase tracking-wider block">Click any photo below to set as Cover Image:</span>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 border border-border-gray/50 p-3 rounded-lg bg-soft-light">
                        {selectedPhotoPreviews.map((src, idx) => {
                          const isCover = coverIndex === idx;
                          return (
                            <div 
                              key={idx}
                              onClick={() => setCoverIndex(idx)}
                              className={`aspect-square rounded-lg overflow-hidden border-2 relative cursor-pointer group bg-white ${isCover ? 'border-emerald-500 ring-2 ring-emerald-500/25' : 'border-border-gray/50 hover:border-primary'}`}
                            >
                              <img src={src} alt="" className="w-full h-full object-cover" />
                              <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleRemoveSelectedPhoto(idx); }}
                                className="absolute top-1 right-1 bg-black/60 hover:bg-black/90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={10} weight="bold" />
                              </button>
                              {isCover && (
                                <span className="absolute bottom-1 left-1 bg-emerald-500 text-white text-[8px] px-1 rounded font-bold uppercase tracking-wide">Cover</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Custom Cover Photo option */}
              <div className="flex flex-col gap-1.5 border-t border-border-gray/50 pt-4">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  {eventGalleryForm.mediaType === 'video' ? 'Or Upload Custom Cover Image (Optional, default is YouTube Thumbnail)' : 'Or Upload Custom Cover Image (Optional)'}
                </label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleCustomCoverChange}
                  className="w-full py-1.5 px-2 border border-border-gray rounded text-xs bg-white focus:border-primary transition-all font-semibold cursor-pointer"
                />
                {customCoverPreview && (
                  <div className="w-32 h-20 rounded border border-border-gray overflow-hidden mt-1 relative">
                    <img src={customCoverPreview} alt="Custom cover preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => { setCustomCoverImage(null); setCustomCoverPreview(''); }}
                      className="absolute top-1 right-1 bg-black/65 hover:bg-black/90 text-white rounded-full p-1 cursor-pointer"
                    >
                      <X size={10} weight="bold" />
                    </button>
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border-gray/50">
                <button 
                  type="button" 
                  onClick={() => { setActiveModal(null); resetEventGalleryForm(); }}
                  className="py-2.5 px-5 rounded-lg border border-border-gray bg-white hover:bg-soft-light text-primary font-bold text-xs cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  disabled={isUploading}
                  onClick={(e) => handleSaveEventGallery(e, 'draft')}
                  className="py-2.5 px-5 rounded-lg bg-soft-light hover:bg-border-gray text-primary disabled:opacity-60 font-bold text-xs cursor-pointer transition-all"
                >
                  {isUploading ? 'Saving...' : 'Save as Draft'}
                </button>
                <button 
                  type="submit" 
                  disabled={isUploading}
                  onClick={(e) => { e.preventDefault(); handleSaveEventGallery(e, 'published'); }}
                  className="py-2.5 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-60 font-bold text-xs cursor-pointer transition-all"
                >
                  {isUploading ? 'Uploading...' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {activeModal === 'gallery-edit' && editingEventGallery && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[250] flex items-center justify-center p-5 animate-fade-in" onClick={() => { setActiveModal(null); resetEventGalleryForm(); }}>
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl p-6 md:p-8 text-left relative animate-fade-in max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-5 right-5 text-text-light hover:text-primary cursor-pointer border-none bg-transparent" onClick={() => { setActiveModal(null); resetEventGalleryForm(); }}><X size={20} /></button>
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <Pencil size={20} className="text-accent" /> Edit Gallery Event
            </h3>
            
            <form onSubmit={handleSaveEventGallery} className="flex-1 overflow-y-auto pr-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Event Name *</label>
                  <input 
                    required 
                    type="text" 
                    value={eventGalleryForm.name} 
                    onChange={(e) => setEventGalleryForm({...eventGalleryForm, name: e.target.value})} 
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Media Type *</label>
                  <select 
                    value={eventGalleryForm.mediaType} 
                    onChange={(e) => setEventGalleryForm({...eventGalleryForm, mediaType: e.target.value as 'image' | 'video'})} 
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-white outline-none focus:border-primary transition-all font-semibold"
                  >
                    <option value="image">📸 Image Album</option>
                    <option value="video">🎥 YouTube Video</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Category *</label>
                  <select 
                    value={eventGalleryForm.category} 
                    onChange={(e) => setEventGalleryForm({...eventGalleryForm, category: e.target.value})} 
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-white outline-none focus:border-primary transition-all font-semibold"
                  >
                    <option value="Events">Events</option>
                    <option value="Tournaments">Tournaments</option>
                    <option value="Training">Training</option>
                    <option value="Achievements">Achievements</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Celebrations">Celebrations</option>
                    <option value="Videos">Videos</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Event Date *</label>
                  <input 
                    required 
                    type="date" 
                    value={eventGalleryForm.date} 
                    onChange={(e) => setEventGalleryForm({...eventGalleryForm, date: e.target.value})} 
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-white outline-none focus:border-primary transition-all font-semibold" 
                  />
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Venue Location (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="E.g. Main Cricket Field, Siwan Campus" 
                    value={eventGalleryForm.location} 
                    onChange={(e) => setEventGalleryForm({...eventGalleryForm, location: e.target.value})} 
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                  />
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Event Description (Optional)</label>
                  <textarea 
                    rows={3}
                    value={eventGalleryForm.description} 
                    onChange={(e) => setEventGalleryForm({...eventGalleryForm, description: e.target.value})} 
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                  />
                </div>
              </div>

              {/* YouTube video URL field if mediaType is video */}
              {eventGalleryForm.mediaType === 'video' && (
                <div className="flex flex-col gap-1 md:col-span-2 border-t border-border-gray/50 pt-4">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">YouTube Video URL *</label>
                  <input 
                    required={eventGalleryForm.mediaType === 'video'}
                    type="url" 
                    placeholder="E.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
                    value={eventGalleryForm.videoUrl} 
                    onChange={(e) => setEventGalleryForm({...eventGalleryForm, videoUrl: e.target.value})} 
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                  />
                  <p className="text-[10px] text-text-light mt-1">Supports standard watch links, youtu.be shortlinks, or embed links.</p>
                </div>
              )}

              {/* Photos management panel if mediaType is image */}
              {eventGalleryForm.mediaType === 'image' && (
                <div className="space-y-3 border-t border-border-gray/50 pt-4">
                  <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider">Photos inside Album</h4>
                  
                  {/* Existing photos list with delete markings & cover select */}
                  {existingPhotos.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[9px] text-text-light font-bold uppercase tracking-wider block">Existing Album Photos (Click to set Cover):</span>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 border border-border-gray/50 p-3 rounded-lg bg-soft-light">
                        {existingPhotos.map((photo, idx) => {
                          const photoUrl = `http://localhost:5000${photo.path}`;
                          const isDeleted = deletedExistingPhotos.includes(photo.path);
                          const isCover = !isDeleted && (editingEventGallery.coverImage === photo.path || (coverIndex === idx && deletedExistingPhotos.indexOf(photo.path) === -1));
                          
                          return (
                            <div 
                              key={idx}
                              onClick={() => {
                                if (!isDeleted) {
                                  setEditingEventGallery({ ...editingEventGallery, coverImage: photo.path });
                                  setCoverIndex(idx);
                                }
                              }}
                              className={`aspect-square rounded-lg overflow-hidden border-2 relative cursor-pointer bg-white group ${isDeleted ? 'opacity-40 border-dashed border-rose-300' : isCover ? 'border-emerald-500 ring-2 ring-emerald-500/25' : 'border-border-gray/50 hover:border-primary'}`}
                            >
                              <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                              {isDeleted ? (
                                <button 
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setDeletedExistingPhotos(deletedExistingPhotos.filter(p => p !== photo.path)); }}
                                  className="absolute inset-0 bg-rose-50/85 hover:bg-rose-100/90 text-rose-700 text-[9px] font-extrabold uppercase flex items-center justify-center transition-all border-none"
                                >
                                  Undo Delete
                                </button>
                              ) : (
                                <>
                                  <button 
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setDeletedExistingPhotos([...deletedExistingPhotos, photo.path]); }}
                                    className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove from event"
                                  >
                                    <X size={10} weight="bold" />
                                  </button>
                                  {isCover && (
                                    <span className="absolute bottom-1 left-1 bg-emerald-500 text-white text-[8px] px-1 rounded font-bold uppercase tracking-wide">Cover</span>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Upload additional photos */}
                  <div className="flex flex-col gap-1.5 pt-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Add More Photos to Album</label>
                    <input 
                      type="file" 
                      multiple
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full py-1.5 px-2 border border-border-gray rounded text-xs bg-white focus:border-primary transition-all font-semibold cursor-pointer"
                    />
                  </div>

                  {/* Additional new photo previews */}
                  {selectedPhotoPreviews.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[9px] text-text-light font-bold uppercase tracking-wider block">Newly Selected Photos (Click to set Cover):</span>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 border border-border-gray/50 p-3 rounded-lg bg-soft-light">
                        {selectedPhotoPreviews.map((src, idx) => {
                          const realIndex = existingPhotos.length + idx;
                          const isCover = coverIndex === realIndex;
                          
                          return (
                            <div 
                              key={idx}
                              onClick={() => {
                                setCoverIndex(realIndex);
                                setEditingEventGallery({ ...editingEventGallery, coverImage: '' });
                              }}
                              className={`aspect-square rounded-lg overflow-hidden border-2 relative cursor-pointer bg-white group ${isCover ? 'border-emerald-500 ring-2 ring-emerald-500/25' : 'border-border-gray/50 hover:border-primary'}`}
                            >
                              <img src={src} alt="" className="w-full h-full object-cover" />
                              <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleRemoveSelectedPhoto(idx); }}
                                className="absolute top-1 right-1 bg-black/60 hover:bg-black/90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={10} weight="bold" />
                              </button>
                              {isCover && (
                                <span className="absolute bottom-1 left-1 bg-emerald-500 text-white text-[8px] px-1 rounded font-bold uppercase tracking-wide">Cover</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Custom Cover Photo option */}
              <div className="flex flex-col gap-1.5 border-t border-border-gray/50 pt-4">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  {eventGalleryForm.mediaType === 'video' ? 'Replace Cover Photo File (Optional, default is YouTube Thumbnail)' : 'Replace Cover Photo File (Optional)'}
                </label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleCustomCoverChange}
                  className="w-full py-1.5 px-2 border border-border-gray rounded text-xs bg-white focus:border-primary transition-all font-semibold cursor-pointer"
                />
                {customCoverPreview && (
                  <div className="w-32 h-20 rounded border border-border-gray overflow-hidden mt-1 relative">
                    <img src={customCoverPreview} alt="Custom cover preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => { setCustomCoverImage(null); setCustomCoverPreview(''); }}
                      className="absolute top-1 right-1 bg-black/65 hover:bg-black/90 text-white rounded-full p-1 cursor-pointer"
                    >
                      <X size={10} weight="bold" />
                    </button>
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border-gray/50">
                <button 
                  type="button" 
                  onClick={() => { setActiveModal(null); resetEventGalleryForm(); }}
                  className="py-2.5 px-5 rounded-lg border border-border-gray bg-white hover:bg-soft-light text-primary font-bold text-xs cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUploading}
                  onClick={(e) => handleSaveEventGallery(e)}
                  className="py-2.5 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-60 font-bold text-xs cursor-pointer transition-all"
                >
                  {isUploading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
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

      {confirmationModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[300] flex items-center justify-center p-5 animate-fade-in" onClick={() => setConfirmationModal(prev => ({ ...prev, show: false }))}>
          <div className="bg-white rounded-xl border border-border-gray shadow-xl max-w-md w-full overflow-hidden animate-scale-up text-left" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <span className="text-rose-500">⚠️</span> {confirmationModal.title}
              </h3>
              <p className="text-text-body text-sm mt-3 whitespace-pre-line leading-relaxed">
                {confirmationModal.message}
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setConfirmationModal(prev => ({ ...prev, show: false }))}
                  className="px-4 py-2 border border-border-gray bg-white rounded-lg text-xs font-bold text-text-light hover:bg-soft-light transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    confirmationModal.onConfirm();
                    setConfirmationModal(prev => ({ ...prev, show: false }));
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
