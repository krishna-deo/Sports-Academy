import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Users, 
  Image as ImageIcon, 
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
  DotsThreeVertical,
  ArrowRight,
  GraduationCap,
  Calendar
} from '@phosphor-icons/react';

import { AdminCompliance } from '../components/AdminCompliance';
import { getBioParagraphs } from '../utils/textUtils';

interface AdminViewsProps {
  activeTab: string;
  setActiveTab?: (tab: string) => void;
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

export const AdminViews: React.FC<AdminViewsProps> = ({ activeTab, setActiveTab }) => {
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
  const [studentBatchFilter, _setStudentBatchFilter] = useState<string>('');
  const [studentCoachFilter, _setStudentCoachFilter] = useState<string>('');
  const [studentStatusFilter, _setStudentStatusFilter] = useState<string>('');
  const [studentYearFilter, _setStudentYearFilter] = useState<string>('');
  const [studentShowDeleted, setStudentShowDeleted] = useState<boolean>(false);
  const [_showStudentFilterDropdown, setShowStudentFilterDropdown] = useState<boolean>(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [viewingStudentProfile, setViewingStudentProfile] = useState<any | null>(null);
  const [editingStudentProfile, setEditingStudentProfile] = useState<any | null>(null);
  
  // Form Fields State
  const [studentForm, setStudentForm] = useState<Record<string, any>>({
    fullName: '',
    dateOfBirth: '',
    dob: '',
    gender: 'girl',
    bloodGroup: '',
    phone: '',
    studentPhone: '',
    email: '',
    studentEmail: '',
    address: '',
    guardianName: '',
    fatherName: '',
    motherName: '',
    guardianRelationship: '',
    guardianPhone: '',
    guardianEmergency: '',
    emergencyContact: '',
    guardianOccupation: '',
    guardianEmail: '',
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
    classStandard: '',
    rollNo: '',
    aadhaarNo: '',
    academicInfo: '',
    achievements: [] as any[], // array of { title, competition, position, year, description }
    status: 'Active',
    showOnPublicWebsite: true
  });
  const [studentPhotoFile, setStudentPhotoFile] = useState<File | null>(null);
  const [studentPhotoPreview, setStudentPhotoPreview] = useState<string>('');
  const [studentDocFiles, setStudentDocFiles] = useState<{ file: File; name: string }[]>([]);
  const [deletedDocuments, setDeletedDocuments] = useState<string[]>([]);
  const [coachForm, setCoachForm] = useState({ name: '', role: '', experienceYears: '', experienceMonths: '0', certificationStatus: 'SAI Certified / Elite License', avatar: '👨‍🏫' });
  const [editingCoach, setEditingCoach] = useState<any | null>(null);
  const [openCoachDropdown, setOpenCoachDropdown] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState({ name: '', email: '', username: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState<boolean>(false);
  const [showEmailVerifyModal, setShowEmailVerifyModal] = useState<boolean>(false);
  const [emailVerifyCode, setEmailVerifyCode] = useState<string>('');
  const [tempEmailToVerify, setTempEmailToVerify] = useState<string>('');
  const [isVerifyingEmail, setIsVerifyingEmail] = useState<boolean>(false);

  // Events & Updates CMS states
  const [eventsUpdatesTab, setEventsUpdatesTab] = useState<'dashboard' | 'events' | 'updates'>('dashboard');
  const [cmsStats, setCmsStats] = useState<any | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<any[]>([]);
  const [draftContent, setDraftContent] = useState<any[]>([]);

  // Events CMS States
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [eventPage, setEventPage] = useState(1);
  const [eventPages, setEventPages] = useState(1);
  const [eventSearch, setEventSearch] = useState('');
  const [eventCategoryFilter, setEventCategoryFilter] = useState('');
  const [eventStatusFilter, setEventStatusFilter] = useState('');
  const [eventVisibilityFilter, setEventVisibilityFilter] = useState('');
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [cmsEventForm, setCmsEventForm] = useState({
    title: '',
    slug: '',
    category: 'Tournament',
    shortDescription: '',
    content: '',
    coverMedia: '',
    galleryMedia: [] as string[],
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    registrationRequired: false,
    registrationUrl: '',
    status: 'Draft',
    visibility: 'Public',
    isFeatured: false
  });

  // Updates CMS States
  const [updatesList, setUpdatesList] = useState<any[]>([]);
  const [updatePage, setUpdatePage] = useState(1);
  const [updatePages, setUpdatePages] = useState(1);
  const [updateSearch, setUpdateSearch] = useState('');
  const [updateCategoryFilter, setUpdateCategoryFilter] = useState('');
  const [updateStatusFilter, setUpdateStatusFilter] = useState('');
  const [updateVisibilityFilter, setUpdateVisibilityFilter] = useState('');
  const [editingUpdate, setEditingUpdate] = useState<any | null>(null);
  const [cmsUpdateForm, setCmsUpdateForm] = useState({
    title: '',
    slug: '',
    category: 'Academy News',
    summary: '',
    content: '',
    coverMedia: '',
    attachments: [] as string[],
    status: 'Draft',
    visibility: 'Public',
    isFeatured: false
  });

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

  // Our Story Milestones states
  const [storyMilestones, setStoryMilestones] = useState<any[]>([]);
  const [editingMilestone, setEditingMilestone] = useState<any | null>(null);
  const [milestoneForm, setMilestoneForm] = useState({ year: '', title: '', subtitle: '', description: '', image: '', order: 0 });
  const storyTextareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleInsertBoldInStoryParagraph = () => {
    const textarea = storyTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = milestoneForm.description || '';

    const selectedText = currentVal.substring(start, end);
    const textToWrap = selectedText || 'bold word';
    const wrappedText = `<b>${textToWrap}</b>`;

    const updatedText = currentVal.substring(0, start) + wrappedText + currentVal.substring(end);
    setMilestoneForm(prev => ({ ...prev, description: updatedText }));

    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(start + 3, start + 3 + textToWrap.length);
      }
    }, 50);
  };

  const [visionMissionForm, setVisionMissionForm] = useState<any>({
    missionPurpose: 'Our Purpose',
    missionTitle: 'Our Mission',
    missionDescription: '',
    missionImage: '/images/hero2.jpg',
    missionBtnText: 'Explore Outreach Program',
    missionBtnLink: '#/about/outreach-program',

    visionFuture: 'Our Future',
    visionTitle: 'Our Vision',
    visionDescription: '',
    visionImage: '/images/about_rlbsa.jpeg',
    visionBtnText: 'Our Operations',
    visionBtnLink: '#/about/what-we-do',

    coreValues: [
      { icon: '🏆', title: 'Excellence', description: '' },
      { icon: '🤝', title: 'Integrity', description: '' },
      { icon: '⚡', title: 'Dedication', description: '' }
    ]
  });
  const [isSavingVisionMission, setIsSavingVisionMission] = useState<boolean>(false);
  const missionTextareaRef = React.useRef<HTMLTextAreaElement>(null);
  const visionTextareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleInsertBoldInMissionDescription = () => {
    const textarea = missionTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = visionMissionForm.missionDescription || '';

    const selectedText = currentVal.substring(start, end);
    const textToWrap = selectedText || 'bold word';
    const wrappedText = `<b>${textToWrap}</b>`;

    const updatedText = currentVal.substring(0, start) + wrappedText + currentVal.substring(end);
    setVisionMissionForm((prev: any) => ({ ...prev, missionDescription: updatedText }));

    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(start + 3, start + 3 + textToWrap.length);
      }
    }, 50);
  };

  const handleInsertBoldInVisionDescription = () => {
    const textarea = visionTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = visionMissionForm.visionDescription || '';

    const selectedText = currentVal.substring(start, end);
    const textToWrap = selectedText || 'bold word';
    const wrappedText = `<b>${textToWrap}</b>`;

    const updatedText = currentVal.substring(0, start) + wrappedText + currentVal.substring(end);
    setVisionMissionForm((prev: any) => ({ ...prev, visionDescription: updatedText }));

    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(start + 3, start + 3 + textToWrap.length);
      }
    }, 50);
  };

  // Trash Bin Toggle States
  const [showDeletedFacilities, setShowDeletedFacilities] = useState<boolean>(false);
  const [showDeletedTeam, setShowDeletedTeam] = useState<boolean>(false);
  const [showDeletedStories, setShowDeletedStories] = useState<boolean>(false);
  const [showDeletedMilestones, setShowDeletedMilestones] = useState<boolean>(false);

  // Image Select & Crop states
  const [showCropperModal, setShowCropperModal] = useState<boolean>(false);
  const [cropperSource, setCropperSource] = useState<string>('');
  const [cropZoom, setCropZoom] = useState<number>(1);
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [isDragMoving, setIsDragMoving] = useState<boolean>(false);
  const [dragStartPoint, setDragStartPoint] = useState({ x: 0, y: 0 });
  const [dragInitialOffset, setDragInitialOffset] = useState({ x: 0, y: 0 });
  const [cropperTab, setCropperTab] = useState<'upload' | 'gallery'>('upload');
  const [croppingTarget, setCroppingTarget] = useState<'student' | 'team' | 'story' | 'coach' | 'facility' | 'edge'>('story');
  const cropperBoxRef = React.useRef<HTMLDivElement>(null);

  // Facilities CMS States
  const defaultFacilitiesList = [
    {
      id: 'fac-1',
      title: 'Sports Infrastructure',
      tag: 'Olympic Standard',
      image: '/images/sports_training_card.jpg',
      description: 'Vast outdoor turf, international track fields, court complexes, and specialized indoor arenas built for high-performance athletic training.',
      order: 1,
      status: 'Active'
    },
    {
      id: 'fac-2',
      title: 'Gym & Fitness Center',
      tag: 'Advanced Gear',
      image: '/images/gym_card.png',
      description: 'State-of-the-art strength and conditioning facility equipped with elite weight training, cardio, and performance tracking systems.',
      order: 2,
      status: 'Active'
    },
    {
      id: 'fac-3',
      title: 'Hostel & Accommodation',
      tag: 'Residential',
      image: '/images/hostel_card.png',
      description: 'Secure, hygienic, and comfortable residential dormitories for student-athletes with dedicated study zones and lounge areas.',
      order: 3,
      status: 'Active'
    },
    {
      id: 'fac-4',
      title: 'Mess & Dining',
      tag: 'Nutritional Diet',
      image: '/images/nutrition_card.jpg',
      description: 'Expert calorie-mapped kitchen providing high-protein, balanced meal plans custom-tailored by sports nutritionists for athlete recovery.',
      order: 4,
      status: 'Active'
    },
    {
      id: 'fac-5',
      title: 'Education & Study Facilities',
      tag: 'Modern Learning',
      image: '/images/education_card.jpg',
      description: 'Fully-equipped classrooms, computer labs, and a quiet library supporting academic tutoring and personality development sessions.',
      order: 5,
      status: 'Active'
    },
    {
      id: 'fac-6',
      title: 'Medical & Physiotherapy',
      tag: '24/7 Care',
      image: '/images/medical_card.png',
      description: 'On-campus medical clinic and physiotherapy unit offering active recovery therapies, injury rehabilitation, and routine health checks.',
      order: 6,
      status: 'Active'
    },
    {
      id: 'fac-7',
      title: 'Safety & Security',
      tag: 'Secure Campus',
      image: '/images/security_card.png',
      description: '24/7 round-the-clock gated security, CCTV surveillance networks, and trained staff ensuring a safe environment for all trainees.',
      order: 7,
      status: 'Active'
    },
    {
      id: 'fac-8',
      title: 'Recreation & Common Areas',
      tag: 'Lounge Zone',
      image: '/images/recreation_card.png',
      description: 'Interactive spaces featuring indoor table games, audio-visual screens, and social hubs for students to unwind and connect.',
      order: 8,
      status: 'Active'
    },
    {
      id: 'fac-9',
      title: 'Wi-Fi & Technology',
      tag: 'High-Speed',
      image: '/images/wifi_card.png',
      description: 'High-speed campus-wide wireless internet access to support digital education, video analysis of sports, and communication.',
      order: 9,
      status: 'Active'
    }
  ];

  const [facilitiesList, setFacilitiesList] = useState<any[]>(defaultFacilitiesList);
  const [editingFacility, setEditingFacility] = useState<any | null>(null);
  const [facilityForm, setFacilityForm] = useState({
    title: '',
    tag: '',
    description: '',
    image: '',
    order: 0,
    status: 'Active'
  });

  const token = localStorage.getItem('rlbsa_admin_token') || '';

  const fetchFacilities = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/facilities', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.facilities) {
          setFacilitiesList(data.facilities);
        }
      }
    } catch (err) {
      console.error("Error fetching facilities:", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'facilities') {
      fetchFacilities();
    }
  }, [activeTab]);

  const handleSaveFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityForm.title || !facilityForm.tag || !facilityForm.description) {
      alert("Please fill in title, tag badge, and description.");
      return;
    }

    try {
      const url = editingFacility
        ? `http://localhost:5000/api/admin/facilities/${editingFacility.id || editingFacility._id}`
        : 'http://localhost:5000/api/admin/facilities';
      const method = editingFacility ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(facilityForm)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        triggerSuccess(editingFacility ? 'Facility card updated successfully.' : 'New facility card created successfully.');
        setEditingFacility(null);
        setActiveModal(null);
        fetchFacilities();
      } else {
        alert(data.error || "Failed to save facility.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
  };

  const handleDeleteFacility = async (id: string, title: string, isPermanent = false) => {
    const confirmMsg = isPermanent
      ? `Are you sure you want to PERMANENTLY delete facility "${title}"? This action cannot be undone.`
      : `Move facility "${title}" to Trash Bin?`;

    setConfirmationModal({
      show: true,
      title: isPermanent ? "Permanently Delete Facility?" : "Move to Trash Bin?",
      message: confirmMsg,
      onConfirm: async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/admin/facilities/${id}${isPermanent ? '?permanent=true' : ''}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok && data.success) {
            triggerSuccess(isPermanent ? 'Facility permanently deleted.' : 'Facility moved to Trash Bin.');
            fetchFacilities();
          } else {
            alert(data.error || "Failed to delete facility.");
          }
        } catch (err) {
          console.error(err);
          alert("Network error.");
        }
      }
    });
  };

  const handleRestoreFacility = async (id: string, title: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/facilities/${id}/restore`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerSuccess(`Facility "${title}" restored successfully.`);
        fetchFacilities();
      } else {
        alert(data.error || "Failed to restore facility.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    }
  };

  // RLBSA Edge CMS States & Handlers
  const defaultEdgeCardsList = [
    {
      id: 'edge-1',
      tag: 'ROLE MODELS',
      title: '“Our athletes inspire future generations of rural sports champions.”',
      description: 'RLBSA champions act as pathfinders for communities in Siwan, Bihar, showing young girls and boys that they too can compete at the highest national levels and break all barriers.',
      image: '/images/role_models_card.png',
      link: '#/academy/success-stories',
      linkText: 'MEET CHAMPIONS →',
      isFeatured: true,
      order: 1,
      status: 'Active'
    },
    {
      id: 'edge-2',
      tag: 'CURRICULUM',
      title: 'Structured Multi-Sport Development Pathways',
      description: 'Structured progression pathways for multi-sport learners, beginner development, and competitive youth performance modules.',
      image: '/images/sports_training_card.jpg',
      link: '#/about/what-we-do',
      linkText: 'LEARN MORE →',
      isFeatured: false,
      order: 2,
      status: 'Active'
    },
    {
      id: 'edge-3',
      tag: 'INFRASTRUCTURE',
      title: 'Vast Olympic-Level Sports Facilities & Arenas',
      description: 'Access temperature-controlled pools, synthetic athletics tracks, indoor wooden courts, and bowling simulations.',
      image: '/images/hero2.jpg',
      link: '#/about/facilities',
      linkText: 'EXPLORE FACILITIES →',
      isFeatured: false,
      order: 3,
      status: 'Active'
    },
    {
      id: 'edge-4',
      tag: 'SPORTS SCIENCE',
      title: 'Calorie-Mapped Nutrition & Rehab Metrics',
      description: 'Integrated biomechanical assessment, nutritional counsel, sports psychologists, and muscle rehab tracking.',
      image: '/images/nutrition_card.jpg',
      link: '#/about/what-we-do',
      linkText: 'LEARN MORE →',
      isFeatured: false,
      order: 4,
      status: 'Active'
    },
    {
      id: 'edge-5',
      tag: 'RESIDENTIAL SCHOLARSHIP',
      title: 'Grassroots Potential to National Champions',
      description: 'Free professional coaching, fully sponsored boarding, sports diet, and educational support for selected rural kids.',
      image: '/images/about_rlbsa.jpeg',
      link: '#/about/what-we-do',
      linkText: 'LEARN MORE →',
      isFeatured: false,
      order: 5,
      status: 'Active'
    }
  ];

  const [edgeCardsList, setEdgeCardsList] = useState<any[]>(defaultEdgeCardsList);
  const [editingEdgeCard, setEditingEdgeCard] = useState<any | null>(null);
  const [showDeletedEdge, setShowDeletedEdge] = useState<boolean>(false);
  const [edgeCardForm, setEdgeCardForm] = useState({
    tag: '',
    title: '',
    description: '',
    image: '',
    link: '',
    linkText: '',
    isFeatured: false,
    order: 0,
    status: 'Active'
  });

  const fetchEdgeCards = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/edge-cards', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const list = data.edgeCards || data.cards || (Array.isArray(data) ? data : null);
        if (list) {
          setEdgeCardsList(list);
        }
      }
    } catch (err) {
      console.error("Error fetching edge cards:", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'rlbsa-edge') {
      fetchEdgeCards();
    }
  }, [activeTab]);

  // Outreach Program Management State
  const [outreachData, setOutreachData] = useState<any>(null);
  const [isSavingOutreach, setIsSavingOutreach] = useState<boolean>(false);
  const [outreachSuccessMsg, setOutreachSuccessMsg] = useState<string>('');

  const fetchOutreachData = async () => {
    try {
      const token = localStorage.getItem('rlbsa_admin_token');
      const res = await fetch('http://localhost:5000/api/admin/outreach', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOutreachData(data);
      }
    } catch (err) {
      console.error("Error fetching outreach data:", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'outreach') {
      fetchOutreachData();
    }
  }, [activeTab]);

  const handleSaveOutreach = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!outreachData) return;
    setIsSavingOutreach(true);
    setOutreachSuccessMsg('');
    try {
      const token = localStorage.getItem('rlbsa_admin_token');
      const res = await fetch('http://localhost:5000/api/admin/outreach', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(outreachData)
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setOutreachSuccessMsg(result.message || 'Outreach Program updated successfully!');
        if (result.outreach) setOutreachData(result.outreach);
        setTimeout(() => setOutreachSuccessMsg(''), 4000);
      } else {
        alert(result.error || 'Failed to save outreach program.');
      }
    } catch (err) {
      console.error("Save outreach error:", err);
      alert("Server error when saving outreach program.");
    } finally {
      setIsSavingOutreach(false);
    }
  };

  const handleSaveEdgeCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!edgeCardForm.title || !edgeCardForm.tag || !edgeCardForm.description) {
      alert("Please fill in title, tag badge, and description.");
      return;
    }

    try {
      const cardId = editingEdgeCard ? (editingEdgeCard._id || editingEdgeCard.id) : null;
      const url = editingEdgeCard
        ? `http://localhost:5000/api/admin/edge-cards/${cardId}`
        : 'http://localhost:5000/api/admin/edge-cards';
      const method = editingEdgeCard ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(edgeCardForm)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        triggerSuccess(editingEdgeCard ? 'RLBSA Edge card updated successfully.' : 'New RLBSA Edge card created successfully.');
        setEditingEdgeCard(null);
        setActiveModal(null);
        fetchEdgeCards();
      } else {
        alert(data.error || "Failed to save RLBSA Edge card.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
  };

  const handleDeleteEdgeCard = async (id: string, title: string, isPermanent = false) => {
    const confirmMsg = isPermanent
      ? `Are you sure you want to PERMANENTLY delete card "${title}"? This action cannot be undone.`
      : `Move card "${title}" to Trash Bin?`;

    setConfirmationModal({
      show: true,
      title: isPermanent ? "Permanently Delete Edge Card?" : "Move to Trash Bin?",
      message: confirmMsg,
      onConfirm: async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/admin/edge-cards/${id}${isPermanent ? '?permanent=true' : ''}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok && data.success) {
            triggerSuccess(isPermanent ? 'Card permanently deleted.' : 'Card moved to Trash Bin.');
            fetchEdgeCards();
          } else {
            alert(data.error || "Failed to delete card.");
          }
        } catch (err) {
          console.error(err);
          alert("Network error.");
        }
      }
    });
  };

  const handleRestoreEdgeCard = async (id: string, title: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/edge-cards/${id}/restore`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerSuccess(`Card "${title}" restored successfully.`);
        fetchEdgeCards();
      } else {
        alert(data.error || "Failed to restore card.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    }
  };

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
      if (eRes.ok) {
        const eData = await eRes.json();
        setEvents(Array.isArray(eData) ? eData : (eData.events || []));
      }
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
    setActiveModal(null);
    setViewingStudentProfile(null);
    setEditingStudentProfile(null);
    setEditingCoach(null);
    setEditingEventGallery(null);
    setShowQuickViewEvent(null);
    setShowCropperModal(false);
    setShowStudentFilterDropdown(false);
    setStudentPhotoFile(null);
    setStudentPhotoPreview('');
    setStudentDocFiles([]);
    setDeletedDocuments([]);

    setStudentForm({
      fullName: '',
      dateOfBirth: '',
      dob: '',
      gender: 'girl',
      bloodGroup: '',
      phone: '',
      studentPhone: '',
      email: '',
      studentEmail: '',
      address: '',
      guardianName: '',
      fatherName: '',
      motherName: '',
      guardianRelationship: '',
      guardianPhone: '',
      guardianEmergency: '',
      emergencyContact: '',
      guardianOccupation: '',
      guardianEmail: '',
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
      classStandard: '',
      rollNo: '',
      aadhaarNo: '',
      academicInfo: '',
      achievements: [],
      status: 'Active',
      showOnPublicWebsite: true
    });
    setActiveStudentFormTab('personal');

    fetchData();
    if (activeTab === 'dashboard') {
      fetchCmsStats();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModal]);

  const triggerSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Events & Updates CMS handlers
  const fetchCmsStats = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/admin/events-updates/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCmsStats(data.stats);
          setUpcomingEvents(data.upcomingEventsList || []);
          setRecentUpdates(data.recentUpdatesList || []);
          setDraftContent(data.draftContentList || []);
        }
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchAdminEvents = async () => {
    if (!token) return;
    try {
      const params = new URLSearchParams({
        page: String(eventPage),
        limit: '10',
        search: eventSearch,
        category: eventCategoryFilter,
        status: eventStatusFilter,
        visibility: eventVisibilityFilter
      });
      const res = await fetch(`http://localhost:5000/api/admin/events?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setEventsList(data.events || []);
          setEventPages(data.pages || 1);
        }
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const fetchAdminUpdates = async () => {
    if (!token) return;
    try {
      const params = new URLSearchParams({
        page: String(updatePage),
        limit: '10',
        search: updateSearch,
        category: updateCategoryFilter,
        status: updateStatusFilter,
        visibility: updateVisibilityFilter
      });
      const res = await fetch(`http://localhost:5000/api/admin/updates?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUpdatesList(data.updates || []);
          setUpdatePages(data.pages || 1);
        }
      }
    } catch (err) {
      console.error("Error fetching updates:", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'events-updates') {
      if (eventsUpdatesTab === 'dashboard') {
        fetchCmsStats();
      } else if (eventsUpdatesTab === 'events') {
        fetchAdminEvents();
      } else if (eventsUpdatesTab === 'updates') {
        fetchAdminUpdates();
      }
    }
  }, [
    activeTab,
    eventsUpdatesTab,
    eventPage,
    eventSearch,
    eventCategoryFilter,
    eventStatusFilter,
    eventVisibilityFilter,
    updatePage,
    updateSearch,
    updateCategoryFilter,
    updateStatusFilter,
    updateVisibilityFilter
  ]);

  // Event CRUD actions
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmsEventForm.title || !cmsEventForm.slug || !cmsEventForm.shortDescription || !cmsEventForm.content || !cmsEventForm.startDate || !cmsEventForm.location) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsUploading(true);
    try {
      const url = editingEvent
        ? `http://localhost:5000/api/admin/events/${editingEvent._id}`
        : 'http://localhost:5000/api/admin/events';
      const method = editingEvent ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cmsEventForm)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        triggerSuccess(editingEvent ? 'Event updated successfully.' : 'Event scheduled successfully.');
        setEditingEvent(null);
        setActiveModal(null);
        fetchAdminEvents();
        fetchCmsStats();
      } else {
        alert(data.error || "Failed to save event details.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteEvent = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerSuccess('Event deleted successfully.');
        fetchAdminEvents();
        fetchCmsStats();
      } else {
        alert(data.error || "Failed to delete event.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    }
  };

  const handleEventImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setCmsEventForm(prev => ({ ...prev, coverMedia: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEventGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const pPhotos: string[] = [];
    let loaded = 0;
    
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          pPhotos.push(reader.result as string);
        }
        loaded++;
        if (loaded === files.length) {
          setCmsEventForm(prev => ({
            ...prev,
            galleryMedia: [...prev.galleryMedia, ...pPhotos]
          }));
        }
      };
      reader.readAsDataURL(files[i]);
    }
  };

  // Update CRUD actions
  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmsUpdateForm.title || !cmsUpdateForm.slug || !cmsUpdateForm.summary || !cmsUpdateForm.content) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsUploading(true);
    try {
      const url = editingUpdate
        ? `http://localhost:5000/api/admin/updates/${editingUpdate._id}`
        : 'http://localhost:5000/api/admin/updates';
      const method = editingUpdate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cmsUpdateForm)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        triggerSuccess(editingUpdate ? 'Update details updated.' : 'Announcement published successfully.');
        setEditingUpdate(null);
        setActiveModal(null);
        fetchAdminUpdates();
        fetchCmsStats();
      } else {
        alert(data.error || "Failed to save update.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteUpdate = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete announcement "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/admin/updates/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerSuccess('Announcement deleted successfully.');
        fetchAdminUpdates();
        fetchCmsStats();
      } else {
        alert(data.error || "Failed to delete update.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    }
  };

  const handleUpdateImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setCmsUpdateForm(prev => ({ ...prev, coverMedia: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const pAttachments: string[] = [];
    let loaded = 0;

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          pAttachments.push(reader.result as string);
        }
        loaded++;
        if (loaded === files.length) {
          setCmsUpdateForm(prev => ({
            ...prev,
            attachments: [...prev.attachments, ...pAttachments]
          }));
        }
      };
      reader.readAsDataURL(files[i]);
    }
  };

  // Our Story Milestones Handlers
  const handleImportDefaultMilestones = async () => {
    if (!token) return;
    setIsUploading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/story-milestones/import-defaults', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        await fetchStoryMilestones();
        triggerSuccess('Default milestones preloaded successfully.');
      } else {
        alert(data.error || "Failed to import default milestones.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to the server.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneForm.description || !milestoneForm.description.trim()) {
      alert("Please write the paragraph description content.");
      return;
    }
    
    setIsUploading(true);
    try {
      const url = editingMilestone 
        ? `http://localhost:5000/api/admin/story-milestones/${editingMilestone._id}`
        : 'http://localhost:5000/api/admin/story-milestones';
      const method = editingMilestone ? 'PUT' : 'POST';
      
      const payload = {
        ...milestoneForm,
        year: milestoneForm.year || '',
        title: milestoneForm.title || '',
        subtitle: milestoneForm.subtitle || ''
      };

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        await fetchStoryMilestones();
        setActiveModal(null);
        triggerSuccess(editingMilestone ? 'Story milestone updated.' : 'Story milestone created.');
      } else {
        alert(data.error || "Failed to save story milestone.");
      }
    } catch (err) {
      console.error("Save milestone error:", err);
      alert("Error contacting the backend server.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMilestone = (id: string, year: string, title: string, isPermanent = false) => {
    const confirmMsg = isPermanent
      ? `Are you sure you want to PERMANENTLY delete story milestone ${year}: "${title}"? This action cannot be undone.`
      : `Move story milestone ${year}: "${title}" to Trash Bin?`;

    setConfirmationModal({
      show: true,
      title: isPermanent ? "Permanently Delete Story Milestone?" : "Move to Trash Bin?",
      message: confirmMsg,
      onConfirm: async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/admin/story-milestones/${id}${isPermanent ? '?permanent=true' : ''}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          if (response.ok && data.success) {
            await fetchStoryMilestones();
            triggerSuccess(isPermanent ? 'Story milestone permanently deleted.' : 'Story milestone moved to Trash Bin.');
          } else {
            alert(data.error || "Error deleting story milestone.");
          }
        } catch (err) {
          alert("Error contacting the backend server.");
        }
      }
    });
  };

  const handleRestoreMilestone = async (id: string, title: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/story-milestones/${id}/restore`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        await fetchStoryMilestones();
        triggerSuccess(`Story milestone "${title}" restored successfully.`);
      } else {
        alert(data.error || "Failed to restore story milestone.");
      }
    } catch (err) {
      alert("Error contacting backend server.");
    }
  };

  const openAddMilestoneModal = () => {
    setEditingMilestone(null);
    setMilestoneForm({
      year: '',
      title: '',
      subtitle: '',
      description: '',
      image: '',
      order: (storyMilestones.length + 1)
    });
    setActiveModal('story-milestone');
  };

  const openEditMilestoneModal = (milestone: any) => {
    setEditingMilestone(milestone);
    setMilestoneForm({
      year: milestone.year,
      title: milestone.title,
      subtitle: milestone.subtitle,
      description: milestone.description,
      image: milestone.image || '',
      order: milestone.order || 0
    });
    setActiveModal('story-milestone');
  };

  const handleMilestoneImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setMilestoneForm({ ...milestoneForm, image: event.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  // Success Stories Action Handlers
  const fetchStories = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/admin/success-stories', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStories(Array.isArray(data) ? data : (data.stories || []));
      }
    } catch (err) {
      console.error("Error loading success stories:", err);
    }
  };

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
        await fetchStories();
        triggerSuccess(editingStory ? 'Success story updated.' : 'Success story added.');
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

  const deleteStory = async (id: string, name: string, isPermanent = false) => {
    const confirmMsg = isPermanent
      ? `Are you sure you want to PERMANENTLY delete success story for "${name}"? This action cannot be undone.`
      : `Move success story for "${name}" to Trash Bin?`;

    setConfirmationModal({
      show: true,
      title: isPermanent ? "Permanently Delete Success Story?" : "Move to Trash Bin?",
      message: confirmMsg,
      onConfirm: async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/admin/success-stories/${id}${isPermanent ? '?permanent=true' : ''}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          if (response.ok && data.success) {
            await fetchStories();
            triggerSuccess(isPermanent ? 'Success story permanently deleted.' : 'Success story moved to Trash Bin.');
          } else {
            alert(data.error || "Error deleting success story.");
          }
        } catch (err) {
          alert("Error contacting the backend server.");
        }
      }
    });
  };

  const handleRestoreStory = async (id: string, name: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/success-stories/${id}/restore`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        await fetchStories();
        triggerSuccess(`Success story for "${name}" restored successfully.`);
      } else {
        alert(data.error || "Failed to restore success story.");
      }
    } catch (err) {
      alert("Error contacting backend server.");
    }
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

  const applyCrop = () => {
    if (!cropperSource) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Target resolution per entity
      let cw = 600;
      let ch = 800; // default for team & coach (3:4 portrait)
      if (croppingTarget === 'story' || croppingTarget === 'facility' || croppingTarget === 'edge') {
        cw = 800;
        ch = 600; // (4:3 landscape)
      } else if (croppingTarget === 'student') {
        cw = 600;
        ch = 600; // (1:1 square)
      }

      // Measure actual viewport container box size in UI
      const boxEl = cropperBoxRef.current;
      const boxW = boxEl ? boxEl.clientWidth : ((croppingTarget === 'story' || croppingTarget === 'facility' || croppingTarget === 'edge') ? 440 : croppingTarget === 'student' ? 360 : 340);
      const boxH = boxEl ? boxEl.clientHeight : ((croppingTarget === 'story' || croppingTarget === 'facility' || croppingTarget === 'edge') ? 330 : croppingTarget === 'student' ? 360 : 453);

      const nw = img.naturalWidth;
      const nh = img.naturalHeight;

      // Base contain scale inside viewport box (fits entire original image without auto-cutting edges)
      const sBase = Math.min(boxW / nw, boxH / nh);
      const sTotal = sBase * cropZoom;

      // Rendered dimensions inside container
      const rw = nw * sTotal;
      const rh = nh * sTotal;

      // Top-left corner of rendered image inside container
      const imgLeftInBox = (boxW - rw) / 2 + cropPosition.x;
      const imgTopInBox = (boxH - rh) / 2 + cropPosition.y;

      const canvas = document.createElement('canvas');
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, cw, ch);

      // Destination mapping onto target canvas for smooth zoom-in & zoom-out support
      const dx = (imgLeftInBox / boxW) * cw;
      const dy = (imgTopInBox / boxH) * ch;
      const dw = (rw / boxW) * cw;
      const dh = (rh / boxH) * ch;

      ctx.drawImage(img, 0, 0, nw, nh, dx, dy, dw, dh);

      try {
        const croppedBase64 = canvas.toDataURL('image/jpeg', 0.90);
        if (croppingTarget === 'student') {
          fetch(croppedBase64)
            .then(res => res.blob())
            .then(blob => {
              const file = new File([blob], "student_cropped.jpg", { type: "image/jpeg" });
              setStudentPhotoFile(file);
              setStudentPhotoPreview(croppedBase64);
            });
        } else if (croppingTarget === 'team') {
          setTeamForm(prev => ({ ...prev, image: croppedBase64 }));
        } else if (croppingTarget === 'coach') {
          setCoachForm(prev => ({ ...prev, avatar: croppedBase64 }));
        } else if (croppingTarget === 'facility') {
          setFacilityForm(prev => ({ ...prev, image: croppedBase64 }));
        } else if (croppingTarget === 'edge') {
          setEdgeCardForm(prev => ({ ...prev, image: croppedBase64 }));
        } else {
          setStoryForm(prev => ({ ...prev, image: croppedBase64 }));
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
      dob: '',
      gender: 'girl',
      bloodGroup: '',
      phone: '',
      studentPhone: '',
      email: '',
      studentEmail: '',
      address: '',
      guardianName: '',
      fatherName: '',
      motherName: '',
      guardianRelationship: '',
      guardianPhone: '',
      guardianEmergency: '',
      emergencyContact: '',
      guardianOccupation: '',
      guardianEmail: '',
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
      classStandard: '',
      rollNo: '',
      aadhaarNo: '',
      academicInfo: '',
      achievements: [],
      status: 'Active',
      showOnPublicWebsite: true
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
      showOnPublicWebsite: student.showOnPublicWebsite !== undefined ? student.showOnPublicWebsite : true
    });
    setStudentPhotoPreview(student.avatar && student.avatar.startsWith('/') ? `http://localhost:5000${student.avatar}` : student.avatar || '');
    setStudentPhotoFile(null);
    setStudentDocFiles([]);
    setDeletedDocuments([]);
    setActiveModal('student-edit');
  };

  const handleSaveStudent = async (e: React.FormEvent, forceStatus?: string) => {
    e.preventDefault();
    const fullName = (studentForm.fullName || '').trim();
    const dob = studentForm.dateOfBirth || studentForm.dob;
    const primarySport = (studentForm.primarySport || '').trim();
    const admissionDate = studentForm.admissionDate;

    if (!fullName || !dob || !primarySport || !admissionDate) {
      alert("Please fill in all required fields (Full Name, Date of Birth, Primary Sport, Admission Date).");
      return;
    }

    const formatNA = (val: any) => (val && typeof val === 'string' && val.trim() ? val.trim() : 'NA');

    const isEdit = !!editingStudentProfile;
    const url = isEdit 
      ? `http://localhost:5000/api/admin/students/${editingStudentProfile.id}`
      : 'http://localhost:5000/api/admin/students';
    const method = isEdit ? 'PUT' : 'POST';

    setIsUploading(true);
    try {
      const formData = new FormData();
      
      formData.append('fullName', fullName);
      formData.append('dateOfBirth', dob);
      formData.append('gender', studentForm.gender || 'girl');
      formData.append('bloodGroup', formatNA(studentForm.bloodGroup));
      formData.append('phone', formatNA(studentForm.phone || studentForm.studentPhone));
      formData.append('email', formatNA(studentForm.email || studentForm.studentEmail));
      formData.append('address', formatNA(studentForm.address));
      
      formData.append('guardianName', formatNA(studentForm.guardianName || studentForm.fatherName));
      formData.append('guardianRelationship', formatNA(studentForm.guardianRelationship));
      formData.append('guardianPhone', formatNA(studentForm.guardianPhone));
      formData.append('guardianEmergency', formatNA(studentForm.guardianEmergency || studentForm.emergencyContact));
      formData.append('guardianAddress', formatNA(studentForm.guardianAddress));
      
      formData.append('admissionDate', admissionDate);
      formData.append('primarySport', primarySport);
      formData.append('batch', formatNA(studentForm.batch));
      formData.append('coach', formatNA(studentForm.coach));
      formData.append('residency', studentForm.residency || 'resident');
      formData.append('hostelRoom', formatNA(studentForm.hostelRoom));
      
      formData.append('schoolName', formatNA(studentForm.schoolName));
      formData.append('className', formatNA(studentForm.className || studentForm.classStandard));
      formData.append('academicInfo', formatNA(studentForm.academicInfo));
      
      formData.append('status', forceStatus || studentForm.status || 'Active');
      formData.append('showOnPublicWebsite', String(studentForm.showOnPublicWebsite !== false));
      formData.append('secondarySports', JSON.stringify(studentForm.secondarySports || []));
      formData.append('achievements', JSON.stringify(studentForm.achievements || []));

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
        if (data.student) {
          setViewingStudentProfile(data.student);
        }
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
    setCoachForm({ name: '', role: '', experienceYears: '', experienceMonths: '0', certificationStatus: 'SAI Certified / Elite License', avatar: '👨‍🏫' });
  };

  const handleEditCoachClick = (coach: any) => {
    setEditingCoach(coach);
    let expY = coach.experienceYears !== undefined ? String(coach.experienceYears) : '';
    let expM = coach.experienceMonths !== undefined ? String(coach.experienceMonths) : '0';
    if (!expY && coach.experience) {
      const matchY = coach.experience.match(/(\d+)\s*Years?/i);
      if (matchY) expY = matchY[1];
      const matchM = coach.experience.match(/(\d+)\s*Months?/i);
      if (matchM) expM = matchM[1];
    }
    setCoachForm({
      name: coach.name || '',
      role: coach.role || '',
      experienceYears: expY || '0',
      experienceMonths: expM || '0',
      certificationStatus: coach.certificationStatus || 'SAI Certified / Elite License',
      avatar: coach.avatar || '👨‍🏫'
    });
    setActiveModal('coach');
  };

  const handleAddCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachForm.name.trim() || !coachForm.role.trim() || coachForm.experienceYears === '' || coachForm.experienceMonths === '' || !coachForm.certificationStatus.trim()) {
      alert("All fields (Full Name, Role Title, Experience Years & Months, and Certification Status) are compulsory.");
      return;
    }
    if (!coachForm.avatar || coachForm.avatar === '👨‍🏫') {
      alert("Please choose and crop a profile photo for the coach (Aspect Ratio 3:4).");
      return;
    }

    const isEdit = !!editingCoach;
    const url = isEdit 
      ? `http://localhost:5000/api/admin/coaches/${encodeURIComponent(editingCoach.name)}`
      : 'http://localhost:5000/api/admin/coaches';
    const method = isEdit ? 'PUT' : 'POST';

    const y = parseInt(String(coachForm.experienceYears)) || 0;
    const m = parseInt(String(coachForm.experienceMonths)) || 0;
    let expStr = '';
    if (y > 0 && m > 0) expStr = `${y} Years ${m} Months Coaching`;
    else if (y > 0) expStr = `${y} Years Coaching`;
    else if (m > 0) expStr = `${m} Months Coaching`;
    else expStr = '0 Years Coaching';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: coachForm.name.trim(),
          role: coachForm.role.trim(),
          experienceYears: y,
          experienceMonths: m,
          experience: expStr,
          certificationStatus: coachForm.certificationStatus.trim(),
          avatar: coachForm.avatar
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

  const fetchTeam = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/admin/team', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTeam(Array.isArray(data) ? data : (data.team || []));
      }
    } catch (err) {
      console.error("Error fetching team members:", err);
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
        await fetchTeam();
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
        await fetchTeam();
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

  const handleDeleteTeamMember = async (id: string, name: string, isPermanent = false) => {
    const confirmMsg = isPermanent
      ? `Are you sure you want to PERMANENTLY delete team member "${name}"? This action cannot be undone.`
      : `Move team member "${name}" to Trash Bin?`;

    setConfirmationModal({
      show: true,
      title: isPermanent ? "Permanently Delete Team Member?" : "Move to Trash Bin?",
      message: confirmMsg,
      onConfirm: async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/admin/team/${id}${isPermanent ? '?permanent=true' : ''}`, {
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
            await fetchTeam();
            triggerSuccess(isPermanent ? 'Team member permanently deleted.' : 'Team member moved to Trash Bin.');
          } else {
            alert(data.error || "Failed to delete team member.");
          }
        } catch (err) {
          alert("Error contacting the backend server.");
        }
      }
    });
  };

  const handleRestoreTeamMember = async (id: string, name: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/team/${id}/restore`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        await fetchTeam();
        triggerSuccess(`Team member "${name}" restored successfully.`);
      } else {
        alert(data.error || "Failed to restore team member.");
      }
    } catch (err) {
      alert("Error contacting backend server.");
    }
  };

  const fetchStoryMilestones = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/admin/story-milestones', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStoryMilestones(data.milestones || []);
      }
    } catch (err) {
      console.error("Error loading admin story milestones:", err);
    }
  };

  const fetchVisionMission = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/admin/vision-mission', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data) {
        setVisionMissionForm(data);
      }
    } catch (err) {
      console.error("Error loading admin vision-mission:", err);
    }
  };

  const handleSaveVisionMission = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingVisionMission(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/vision-mission', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(visionMissionForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerSuccess("Vision & Mission settings updated successfully!");
        if (data.visionMission) {
          setVisionMissionForm(data.visionMission);
        }
      } else {
        alert(data.error || "Failed to update Vision & Mission settings.");
      }
    } catch (err) {
      console.error("Save Vision & Mission error:", err);
      alert("Error saving Vision & Mission settings.");
    } finally {
      setIsSavingVisionMission(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'story') {
      fetchStoryMilestones();
      fetchVisionMission();
    }
  }, [activeTab]);

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
        <div className="space-y-6 text-left animate-fade-in">

          {/* 1. Header Greeting Section */}
          <div className="bg-gradient-to-r from-[#082142] via-[#0b2b54] to-[#00a896] text-white p-6 md:p-8 rounded-2xl shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative z-10 space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Management Panel Active</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Dashboard</h1>
              <p className="text-slate-200 text-sm md:text-base font-medium flex items-center gap-2">
                Welcome back, <span className="font-bold text-accent">{profileForm.name || 'Admin'}</span> 👋
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3 self-start md:self-auto">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2.5 border border-white/15 shadow-inner">
                <Calendar size={18} className="text-accent" />
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
            <div className="absolute right-[-40px] bottom-[-40px] w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-2xl"></div>
          </div>

          {/* 2. Stat Cards Grid (4 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Total Students */}
            <div 
              onClick={() => setActiveTab && setActiveTab('students')}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Total Students</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <GraduationCap size={22} weight="fill" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-[#082142]">{studentStats.totalStudents || students.length}</p>
                <div className="mt-2 text-[11px] font-semibold text-slate-500 flex items-center justify-between">
                  <span>{studentStats.residentStudents || 0} Boarders</span>
                  <span>•</span>
                  <span>{studentStats.nonResidentStudents || 0} Day Scholars</span>
                </div>
              </div>
            </div>

            {/* Coaches */}
            <div 
              onClick={() => setActiveTab && setActiveTab('coaches')}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Coaches</span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users size={22} weight="fill" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-[#082142]">{coaches.length}</p>
                <p className="mt-2 text-[11px] font-semibold text-slate-500">Certified Trainers & Mentors</p>
              </div>
            </div>

            {/* Upcoming Events */}
            <div 
              onClick={() => setActiveTab && setActiveTab('events-updates')}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Upcoming Events</span>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar size={22} weight="fill" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-[#082142]">{upcomingEvents.length || events.length}</p>
                <p className="mt-2 text-[11px] font-semibold text-slate-500">Scheduled Tournaments & Camps</p>
              </div>
            </div>

            {/* Gallery Media */}
            <div 
              onClick={() => setActiveTab && setActiveTab('gallery')}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Gallery Media</span>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ImageIcon size={22} weight="fill" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-[#082142]">{dashboardGallery.length || galleryStats.totalImages || 0}</p>
                <p className="mt-2 text-[11px] font-semibold text-slate-500">Photos & Videos Uploaded</p>
              </div>
            </div>

          </div>

          {/* 3. ⚠️ NEEDS ATTENTION Section */}
          <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">⚠️</span>
                <h3 className="text-sm font-black text-amber-900 uppercase tracking-wider">NEEDS ATTENTION</h3>
              </div>
              <span className="text-[11px] font-bold bg-amber-500/20 text-amber-900 px-3 py-1 rounded-full">
                Action Items
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Pending Enquiries */}
              <div 
                onClick={() => setActiveTab && setActiveTab('enquiries')}
                className="bg-white p-4 rounded-xl border border-amber-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <span className="block text-xs font-bold text-slate-700">Pending Enquiries</span>
                  <span className="text-[11px] font-medium text-slate-400">Incoming messages</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    {enquiries.length}
                  </span>
                  <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Expiring Docs */}
              <div 
                onClick={() => setActiveTab && setActiveTab('compliance')}
                className="bg-white p-4 rounded-xl border border-amber-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <span className="block text-xs font-bold text-slate-700">Expiring Docs</span>
                  <span className="text-[11px] font-medium text-slate-400">Consents & Permits</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    {studentStats.totalStudents ? Math.max(1, Math.ceil(studentStats.totalStudents * 0.05)) : 2}
                  </span>
                  <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Draft Events */}
              <div 
                onClick={() => setActiveTab && setActiveTab('events-updates')}
                className="bg-white p-4 rounded-xl border border-amber-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <span className="block text-xs font-bold text-slate-700">Draft Events</span>
                  <span className="text-[11px] font-medium text-slate-400">Unpublished items</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    {eventsList.filter((e: any) => e.status === 'Draft' || e.status === 'draft').length || draftContent.length || (cmsStats?.draftCount) || 1}
                  </span>
                  <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Pending Verifications (...) */}
              <div 
                onClick={() => setActiveTab && setActiveTab('students')}
                className="bg-white p-4 rounded-xl border border-amber-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <span className="block text-xs font-bold text-slate-700">Pending Verification</span>
                  <span className="text-[11px] font-medium text-slate-400">New profile audits</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    {studentStats.newAdmissions || 3}
                  </span>
                  <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Bottom 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* UPCOMING EVENTS COLUMN */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#00a896] flex items-center justify-center">
                      <Calendar size={18} weight="bold" />
                    </div>
                    <h3 className="text-base font-extrabold text-[#082142] uppercase tracking-wide">UPCOMING EVENTS</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab && setActiveTab('events-updates')}
                    className="text-xs font-bold text-[#00a896] hover:underline flex items-center gap-1 cursor-pointer bg-none border-none"
                  >
                    View All <ArrowRight size={14} />
                  </button>
                </div>

                <div className="space-y-3">
                  {(Array.isArray(upcomingEvents) && upcomingEvents.length > 0 ? upcomingEvents : (Array.isArray(events) ? events : [])).slice(0, 4).map((evt: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-[#082142] text-white flex flex-col items-center justify-center shrink-0">
                          <span className="text-[9px] uppercase font-bold text-accent leading-none">
                            {evt.startDate ? new Date(evt.startDate).toLocaleString('default', { month: 'short' }) : 'EVENT'}
                          </span>
                          <span className="text-sm font-black leading-none mt-0.5">
                            {evt.startDate ? new Date(evt.startDate).getDate() : idx + 1}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xs md:text-sm font-extrabold text-[#082142] line-clamp-1">
                            {evt.title || evt.name || `Tournament Match #${idx + 1}`}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 mt-1">
                            <span className="bg-teal-50 text-[#00a896] font-bold px-2 py-0.5 rounded text-[10px]">
                              {evt.category || 'Sports'}
                            </span>
                            <span>•</span>
                            <span className="truncate max-w-[150px]">{evt.location || 'Siwan Campus Ground'}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full shrink-0">
                        {evt.status || 'Active'}
                      </span>
                    </div>
                  ))}

                  {((!Array.isArray(upcomingEvents) || upcomingEvents.length === 0) && (!Array.isArray(events) || events.length === 0)) && (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <p className="text-xs text-slate-400 font-semibold mb-3">No upcoming events scheduled</p>
                      <button
                        onClick={() => setActiveModal('event')}
                        className="text-xs font-bold bg-[#082142] text-white py-2 px-4 rounded-lg cursor-pointer border-none"
                      >
                        + Schedule Event
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RECENT ADMISSIONS COLUMN */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <GraduationCap size={18} weight="bold" />
                    </div>
                    <h3 className="text-base font-extrabold text-[#082142] uppercase tracking-wide">RECENT ADMISSIONS</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab && setActiveTab('students')}
                    className="text-xs font-bold text-[#00a896] hover:underline flex items-center gap-1 cursor-pointer bg-none border-none"
                  >
                    View Roster <ArrowRight size={14} />
                  </button>
                </div>

                <div className="space-y-3">
                  {(Array.isArray(students) ? students : []).slice(0, 4).map((std: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-[#082142] text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden shadow-sm">
                          {std.avatar ? (
                            <img src={std.avatar.startsWith('http') || std.avatar.startsWith('/images') || std.avatar.startsWith('/uploads') ? std.avatar : `http://localhost:5000${std.avatar}`} alt={std.name || std.fullName} className="w-full h-full object-cover" />
                          ) : (
                            (std.name || std.fullName || 'S')[0]
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs md:text-sm font-extrabold text-[#082142]">
                            {std.name || std.fullName || `Student #${idx + 1}`}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 mt-1">
                            <span className="bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded text-[10px]">
                              {std.primarySport || std.sport || 'Athlete'}
                            </span>
                            <span>•</span>
                            <span className="capitalize">{std.residency || 'Resident'}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2.5 py-1 rounded-full shrink-0">
                        {std.admissionDate ? new Date(std.admissionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : std.joined || 'Recent'}
                      </span>
                    </div>
                  ))}

                  {students.length === 0 && (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <p className="text-xs text-slate-400 font-semibold mb-3">No student admissions registered</p>
                      <button
                        onClick={() => setActiveModal('student')}
                        className="text-xs font-bold bg-[#082142] text-white py-2 px-4 rounded-lg cursor-pointer border-none"
                      >
                        + Add Student
                      </button>
                    </div>
                  )}
                </div>
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

          {/* Search, Filter & Export Toolbar */}
          <div className="bg-soft-light p-3.5 rounded-xl border border-border-gray flex flex-col lg:flex-row items-center justify-between gap-3 text-left">
            
            {/* Search Input Bar */}
            <div className="relative flex-1 w-full">
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

            {/* Inline Filter Controls & Export Group */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto shrink-0 justify-between lg:justify-end">
              
              {/* All Sports Filter */}
              <select 
                value={studentSportFilter}
                onChange={(e) => {
                  setStudentSportFilter(e.target.value);
                  setStudentPage(1);
                }}
                className="px-3 py-2 border border-border-gray rounded bg-white text-xs text-primary font-semibold outline-none focus:border-primary transition-all cursor-pointer"
              >
                <option value="">All Sports</option>
                <option value="Football">Football</option>
                <option value="Handball">Handball</option>
                <option value="Athletics">Athletics</option>
                <option value="Rugby">Rugby</option>
                <option value="Kabaddi">Kabaddi</option>
              </select>

              {/* All Genders Filter */}
              <select 
                value={studentGenderFilter}
                onChange={(e) => {
                  setStudentGenderFilter(e.target.value);
                  setStudentPage(1);
                }}
                className="px-3 py-2 border border-border-gray rounded bg-white text-xs text-primary font-semibold outline-none focus:border-primary transition-all cursor-pointer"
              >
                <option value="">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              {/* All Residencies Filter */}
              <select 
                value={studentResidencyFilter}
                onChange={(e) => {
                  setStudentResidencyFilter(e.target.value);
                  setStudentPage(1);
                }}
                className="px-3 py-2 border border-border-gray rounded bg-white text-xs text-primary font-semibold outline-none focus:border-primary transition-all cursor-pointer"
              >
                <option value="">All Residencies</option>
                <option value="resident">Boarding (Resident)</option>
                <option value="non-resident">Day Scholar (Non-Resident)</option>
              </select>

              {/* Trash Bin Toggle */}
              <label className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-200 bg-rose-50 rounded text-xs font-bold text-rose-600 cursor-pointer select-none shrink-0 hover:bg-rose-100 transition-colors">
                <input 
                  type="checkbox" 
                  checked={studentShowDeleted}
                  onChange={(e) => {
                    setStudentShowDeleted(e.target.checked);
                    setStudentPage(1);
                    setSelectedStudentIds([]);
                  }}
                  className="rounded border-rose-300 text-rose-600 focus:ring-rose-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span>Trash Bin {studentShowDeleted ? '(Active)' : ''}</span>
              </label>

              {/* Export List Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 pl-1 border-l border-border-gray">
                <span className="text-xs font-bold text-text-light hidden sm:inline">Export:</span>
                <button 
                  onClick={() => handleExportStudents('csv')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-2.5 rounded text-[11px] cursor-pointer transition-all border-none"
                  title="Export to CSV"
                >
                  CSV
                </button>
                <button 
                  onClick={() => handleExportStudents('excel')}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-1.5 px-2.5 rounded text-[11px] cursor-pointer transition-all border-none"
                  title="Export to Excel"
                >
                  Excel
                </button>
                <button 
                  onClick={() => handleExportStudents('pdf')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-2.5 rounded text-[11px] cursor-pointer transition-all border-none"
                  title="Export PDF Report"
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
                setCoachForm({ name: '', role: '', experienceYears: '', experienceMonths: '0', certificationStatus: 'SAI Certified / Elite License', avatar: '👨‍🏫' });
                setActiveModal('coach');
              }}
              className="bg-primary text-white hover:bg-accent hover:text-primary transition-all font-bold py-2.5 px-5 rounded-lg cursor-pointer text-xs flex items-center gap-1.5 self-start"
            >
              <Plus size={16} /> Add Coach
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coaches.map((coach, idx) => (
              <div key={idx} className="p-5 border border-border-gray rounded-xl flex gap-4 text-left hover:shadow-sm transition-all items-start relative group bg-white">
                <div className="w-20 aspect-[3/4] bg-border-gray rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-border-gray">
                  {coach.avatar && (coach.avatar.startsWith('http') || coach.avatar.startsWith('/') || coach.avatar.startsWith('data:')) ? (
                    <img 
                      src={coach.avatar} 
                      alt={coach.name} 
                      className="w-full h-full object-cover object-top" 
                    />
                  ) : (
                    <span className="text-2xl">{coach.avatar}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-extrabold text-primary text-base">{coach.name}</h4>
                  <span className="inline-block bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold py-0.5 px-2 rounded uppercase tracking-wider mt-1">{coach.role}</span>
                  <span className="block text-[11px] text-emerald-700 font-bold mt-1">🛡️ {coach.certificationStatus || 'SAI Certified / Elite License'}</span>
                  <span className="block text-[11px] text-indigo-700 font-bold mt-1">🎓 {coach.experience}</span>
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

      {/* OUR STORY TAB VIEW */}
      {activeTab === 'story' && (() => {
        const deletedMilestonesCount = storyMilestones.filter(m => m.isDeleted).length;
        const displayedMilestones = storyMilestones.filter(m => showDeletedMilestones ? m.isDeleted : !m.isDeleted);

        return (
          <div className="bg-white p-6 md:p-8 rounded-xl border border-border-gray shadow-sm text-left">
            
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-border-gray mb-6">
              <div>
                <h3 className="text-base font-bold text-primary flex items-center gap-2">
                  Our Story Paragraphs {showDeletedMilestones && <span className="text-amber-600 text-xs font-extrabold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">(Trash Bin)</span>}
                </h3>
                <p className="text-text-light text-xs mt-0.5">Manage the text paragraphs displayed on the public "Our Story" page</p>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowDeletedMilestones(!showDeletedMilestones)}
                  className={`px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer border transition-all ${
                    showDeletedMilestones 
                      ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100' 
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <Trash size={14} className={showDeletedMilestones ? 'text-amber-600' : 'text-slate-500'} />
                  {showDeletedMilestones ? 'Active Paragraphs' : 'Trash Bin'}
                  {deletedMilestonesCount > 0 && (
                    <span className="bg-rose-500 text-white px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ml-0.5">
                      {deletedMilestonesCount}
                    </span>
                  )}
                </button>
                {!showDeletedMilestones && (
                  <button 
                    onClick={openAddMilestoneModal}
                    className="bg-primary text-white hover:bg-accent hover:text-primary transition-all font-bold py-2.5 px-5 rounded-lg cursor-pointer text-xs flex items-center gap-1.5 self-start shadow-sm"
                  >
                    <Plus size={16} /> Add Paragraph
                  </button>
                )}
              </div>
            </div>

            {/* Milestones / Paragraphs grid layout */}
            {displayedMilestones.length === 0 ? (
              <div className="text-center py-16 px-6 border border-dashed border-border-gray rounded-xl bg-soft-light/20 flex flex-col items-center justify-center max-w-xl mx-auto my-6">
                <Notebook size={44} className="text-primary/45 mb-4 animate-pulse" />
                <h4 className="text-sm font-bold text-primary mb-1.5">
                  {showDeletedMilestones ? 'Trash Bin is Empty' : 'No Paragraphs Found in Database'}
                </h4>
                <p className="text-text-light text-xs max-w-sm leading-relaxed mb-6">
                  {showDeletedMilestones
                    ? 'No deleted paragraphs in the trash bin.'
                    : "Your database doesn't have any active paragraphs for the Our Story page."}
                </p>
                {!showDeletedMilestones && (
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                      onClick={openAddMilestoneModal}
                      className="bg-primary hover:bg-accent text-white hover:text-primary transition-all font-bold py-2.5 px-6 rounded-lg text-xs uppercase cursor-pointer border-none outline-none shadow-md"
                    >
                      Add Paragraph
                    </button>
                    <button
                      disabled={isUploading}
                      onClick={handleImportDefaultMilestones}
                      className="bg-white hover:bg-soft-light border border-border-gray text-primary font-bold py-2.5 px-6 rounded-lg text-xs uppercase cursor-pointer disabled:opacity-55"
                    >
                      {isUploading ? 'Importing...' : 'Pre-load Default Story'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedMilestones.map((milestone, idx) => {
                  return (
                    <div key={milestone._id || idx} className="border border-border-gray/70 bg-white rounded-xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-shadow relative">
                      
                      {/* Card Header (Sequence & Status) */}
                      <div className="p-3.5 bg-slate-50 border-b border-border-gray/50 flex items-center justify-between">
                        <span className="bg-primary text-white text-[10px] font-black py-1 px-3 rounded-full uppercase tracking-wider shadow-xs">
                          Paragraph #{milestone.order || (idx + 1)}
                        </span>
                        {showDeletedMilestones ? (
                          <span className="bg-rose-600 text-white text-[9px] font-black py-1 px-2.5 rounded uppercase tracking-wider">
                            In Trash Bin
                          </span>
                        ) : (
                          <span className="text-text-light text-[10px] font-bold">
                            Text Only
                          </span>
                        )}
                      </div>

                      {/* Card Content details */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <p 
                            className="text-slate-700 text-xs leading-relaxed line-clamp-6 text-justify font-normal"
                            dangerouslySetInnerHTML={{
                              __html: (milestone.description || '')
                                .replace(/<strong>(.*?)<\/strong>/gi, '<strong class="font-extrabold text-[#082142]">$1</strong>')
                                .replace(/<b>(.*?)<\/b>/gi, '<strong class="font-extrabold text-[#082142]">$1</strong>')
                                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-[#082142]">$1</strong>')
                            }}
                          />
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex gap-2 border-t border-border-gray/50 pt-4">
                          {showDeletedMilestones ? (
                            <>
                              <button
                                onClick={() => handleRestoreMilestone(milestone._id, milestone.title || `Paragraph ${milestone.order}`)}
                                className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                              >
                                <ArrowCounterClockwise size={14} /> Restore
                              </button>
                              <button
                                onClick={() => handleDeleteMilestone(milestone._id, milestone.year, milestone.title || `Paragraph ${milestone.order}`, true)}
                                className="flex-1 py-2 px-3 bg-rose-50 hover:bg-rose-600 border border-rose-200 text-rose-600 hover:text-white font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                                title="Permanently Delete"
                              >
                                <Trash size={14} /> Delete
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => openEditMilestoneModal(milestone)}
                                className="flex-1 py-2 px-3 border border-border-gray hover:border-primary bg-white hover:bg-soft-light text-primary font-bold text-xs rounded-lg transition-all cursor-pointer text-center"
                              >
                                Edit Paragraph
                              </button>
                              <button
                                onClick={() => handleDeleteMilestone(milestone._id, milestone.year, milestone.title || `Paragraph ${milestone.order}`, false)}
                                className="py-2 px-3 bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 text-rose-600 hover:text-white rounded-lg transition-all cursor-pointer flex items-center gap-1"
                                title="Move to Trash Bin"
                              >
                                <Trash size={14} />
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

            {/* Divider line */}
            <div className="my-10 border-t border-border-gray/80"></div>

            {/* VISION & MISSION SECTION EDITOR */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-border-gray">
                <div>
                  <h3 className="text-base font-bold text-primary flex items-center gap-2">
                    Vision &amp; Mission Settings
                  </h3>
                  <p className="text-text-light text-xs mt-0.5">Edit the Vision, Mission, and Core Values displayed below Our Story on the public site</p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveVisionMission}
                  disabled={isSavingVisionMission}
                  className="bg-[#082142] hover:bg-[#00a896] text-white font-bold py-2.5 px-6 rounded-lg text-xs cursor-pointer transition-all shadow-md self-start border-none disabled:opacity-60"
                >
                  {isSavingVisionMission ? 'Saving Settings...' : 'Save Vision & Mission Settings'}
                </button>
              </div>

              <form onSubmit={handleSaveVisionMission} className="space-y-8">
                {/* 1. OUR MISSION CARD */}
                <div className="p-6 bg-slate-50 rounded-xl border border-border-gray space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <span className="text-lg">🎯</span>
                    <h4 className="font-extrabold text-primary text-sm uppercase tracking-wider">1. Our Mission Section</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Purpose Tagline</label>
                      <input 
                        type="text" 
                        value={visionMissionForm.missionPurpose || ''} 
                        onChange={(e) => setVisionMissionForm({ ...visionMissionForm, missionPurpose: e.target.value })}
                        className="w-full py-2.5 px-3 border border-border-gray rounded text-xs bg-white outline-none focus:border-primary font-semibold"
                        placeholder="E.g. Our Purpose"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Section Title</label>
                      <input 
                        type="text" 
                        value={visionMissionForm.missionTitle || ''} 
                        onChange={(e) => setVisionMissionForm({ ...visionMissionForm, missionTitle: e.target.value })}
                        className="w-full py-2.5 px-3 border border-border-gray rounded text-xs bg-white outline-none focus:border-primary font-semibold"
                        placeholder="E.g. Our Mission"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-bold text-primary uppercase tracking-wider">Mission Description Text *</label>
                      <button
                        type="button"
                        onClick={handleInsertBoldInMissionDescription}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white hover:bg-primary hover:text-white text-[#082142] font-black text-[11px] rounded border border-slate-300 transition-all cursor-pointer shadow-2xs"
                      >
                        <span className="font-extrabold text-xs">B</span> Make Selected Text Bold
                      </button>
                    </div>
                    <textarea 
                      ref={missionTextareaRef}
                      rows={4}
                      value={visionMissionForm.missionDescription || ''} 
                      onChange={(e) => setVisionMissionForm({ ...visionMissionForm, missionDescription: e.target.value })}
                      className="w-full py-2.5 px-3 border border-border-gray rounded text-xs bg-white outline-none focus:border-primary font-semibold resize-none"
                      placeholder="Write Mission description..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Image URL</label>
                      <input 
                        type="text" 
                        value={visionMissionForm.missionImage || ''} 
                        onChange={(e) => setVisionMissionForm({ ...visionMissionForm, missionImage: e.target.value })}
                        className="w-full py-2.5 px-3 border border-border-gray rounded text-xs bg-white outline-none focus:border-primary font-semibold"
                        placeholder="/images/hero2.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Button Label</label>
                      <input 
                        type="text" 
                        value={visionMissionForm.missionBtnText || ''} 
                        onChange={(e) => setVisionMissionForm({ ...visionMissionForm, missionBtnText: e.target.value })}
                        className="w-full py-2.5 px-3 border border-border-gray rounded text-xs bg-white outline-none focus:border-primary font-semibold"
                        placeholder="Explore Outreach Program"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Button Link</label>
                      <input 
                        type="text" 
                        value={visionMissionForm.missionBtnLink || ''} 
                        onChange={(e) => setVisionMissionForm({ ...visionMissionForm, missionBtnLink: e.target.value })}
                        className="w-full py-2.5 px-3 border border-border-gray rounded text-xs bg-white outline-none focus:border-primary font-semibold"
                        placeholder="#/about/outreach-program"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. OUR VISION CARD */}
                <div className="p-6 bg-slate-50 rounded-xl border border-border-gray space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <span className="text-lg">🌟</span>
                    <h4 className="font-extrabold text-primary text-sm uppercase tracking-wider">2. Our Vision Section</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Future Tagline</label>
                      <input 
                        type="text" 
                        value={visionMissionForm.visionFuture || ''} 
                        onChange={(e) => setVisionMissionForm({ ...visionMissionForm, visionFuture: e.target.value })}
                        className="w-full py-2.5 px-3 border border-border-gray rounded text-xs bg-white outline-none focus:border-primary font-semibold"
                        placeholder="E.g. Our Future"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Section Title</label>
                      <input 
                        type="text" 
                        value={visionMissionForm.visionTitle || ''} 
                        onChange={(e) => setVisionMissionForm({ ...visionMissionForm, visionTitle: e.target.value })}
                        className="w-full py-2.5 px-3 border border-border-gray rounded text-xs bg-white outline-none focus:border-primary font-semibold"
                        placeholder="E.g. Our Vision"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-bold text-primary uppercase tracking-wider">Vision Description Text *</label>
                      <button
                        type="button"
                        onClick={handleInsertBoldInVisionDescription}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white hover:bg-primary hover:text-white text-[#082142] font-black text-[11px] rounded border border-slate-300 transition-all cursor-pointer shadow-2xs"
                      >
                        <span className="font-extrabold text-xs">B</span> Make Selected Text Bold
                      </button>
                    </div>
                    <textarea 
                      ref={visionTextareaRef}
                      rows={4}
                      value={visionMissionForm.visionDescription || ''} 
                      onChange={(e) => setVisionMissionForm({ ...visionMissionForm, visionDescription: e.target.value })}
                      className="w-full py-2.5 px-3 border border-border-gray rounded text-xs bg-white outline-none focus:border-primary font-semibold resize-none"
                      placeholder="Write Vision description..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Image URL</label>
                      <input 
                        type="text" 
                        value={visionMissionForm.visionImage || ''} 
                        onChange={(e) => setVisionMissionForm({ ...visionMissionForm, visionImage: e.target.value })}
                        className="w-full py-2.5 px-3 border border-border-gray rounded text-xs bg-white outline-none focus:border-primary font-semibold"
                        placeholder="/images/about_rlbsa.jpeg"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Button Label</label>
                      <input 
                        type="text" 
                        value={visionMissionForm.visionBtnText || ''} 
                        onChange={(e) => setVisionMissionForm({ ...visionMissionForm, visionBtnText: e.target.value })}
                        className="w-full py-2.5 px-3 border border-border-gray rounded text-xs bg-white outline-none focus:border-primary font-semibold"
                        placeholder="Our Operations"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Button Link</label>
                      <input 
                        type="text" 
                        value={visionMissionForm.visionBtnLink || ''} 
                        onChange={(e) => setVisionMissionForm({ ...visionMissionForm, visionBtnLink: e.target.value })}
                        className="w-full py-2.5 px-3 border border-border-gray rounded text-xs bg-white outline-none focus:border-primary font-semibold"
                        placeholder="#/about/what-we-do"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. CORE VALUES SECTION */}
                <div className="p-6 bg-slate-50 rounded-xl border border-border-gray space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💎</span>
                      <h4 className="font-extrabold text-primary text-sm uppercase tracking-wider">3. Our Core Values</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(visionMissionForm.coreValues || []).map((val: any, idx: number) => (
                      <div key={idx} className="p-4 bg-white rounded-lg border border-border-gray space-y-3 shadow-xs">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Value #{idx + 1}</span>
                        <div>
                          <label className="block text-[9px] font-bold text-primary uppercase tracking-wider mb-1">Emoji Icon</label>
                          <input 
                            type="text" 
                            value={val.icon || ''} 
                            onChange={(e) => {
                              const updated = [...visionMissionForm.coreValues];
                              updated[idx].icon = e.target.value;
                              setVisionMissionForm({ ...visionMissionForm, coreValues: updated });
                            }}
                            className="w-full py-1.5 px-2.5 border border-border-gray rounded text-xs outline-none focus:border-primary font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-primary uppercase tracking-wider mb-1">Title</label>
                          <input 
                            type="text" 
                            value={val.title || ''} 
                            onChange={(e) => {
                              const updated = [...visionMissionForm.coreValues];
                              updated[idx].title = e.target.value;
                              setVisionMissionForm({ ...visionMissionForm, coreValues: updated });
                            }}
                            className="w-full py-1.5 px-2.5 border border-border-gray rounded text-xs outline-none focus:border-primary font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-primary uppercase tracking-wider mb-1">Description</label>
                          <textarea 
                            rows={3}
                            value={val.description || ''} 
                            onChange={(e) => {
                              const updated = [...visionMissionForm.coreValues];
                              updated[idx].description = e.target.value;
                              setVisionMissionForm({ ...visionMissionForm, coreValues: updated });
                            }}
                            className="w-full py-1.5 px-2.5 border border-border-gray rounded text-xs outline-none focus:border-primary font-semibold resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingVisionMission}
                  className="w-full bg-[#082142] hover:bg-[#00a896] text-white font-bold py-3.5 rounded-lg text-xs uppercase tracking-wider cursor-pointer transition-all shadow-md border-none disabled:opacity-60"
                >
                  {isSavingVisionMission ? 'Saving Settings...' : 'Save Vision & Mission Settings'}
                </button>
              </form>
            </div>

          </div>
        );
      })()}

      {/* EVENTS & UPDATES MODULE CMS VIEWPORT */}
      {activeTab === 'events-updates' && (
        <div className="bg-white p-6 md:p-8 rounded-xl border border-border-gray shadow-sm text-left">
          
          {/* Sub Navigation menu */}
          <div className="flex border-b border-border-gray/60 mb-6">
            <button 
              onClick={() => setEventsUpdatesTab('dashboard')} 
              className={`pb-3.5 px-6 font-bold text-xs uppercase tracking-wider transition-all border-b-2 bg-transparent border-transparent cursor-pointer ${
                eventsUpdatesTab === 'dashboard' ? '!border-primary text-primary' : 'text-slate-400 hover:text-primary'
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setEventsUpdatesTab('events')} 
              className={`pb-3.5 px-6 font-bold text-xs uppercase tracking-wider transition-all border-b-2 bg-transparent border-transparent cursor-pointer ${
                eventsUpdatesTab === 'events' ? '!border-primary text-primary' : 'text-slate-400 hover:text-primary'
              }`}
            >
              Events ({cmsStats?.totalEvents || 0})
            </button>
            <button 
              onClick={() => setEventsUpdatesTab('updates')} 
              className={`pb-3.5 px-6 font-bold text-xs uppercase tracking-wider transition-all border-b-2 bg-transparent border-transparent cursor-pointer ${
                eventsUpdatesTab === 'updates' ? '!border-primary text-primary' : 'text-slate-400 hover:text-primary'
              }`}
            >
              Updates ({cmsStats?.totalUpdates || 0})
            </button>
          </div>

          {/* Render Active Sub Tab View */}
          
          {/* A. DASHBOARD ANALYTICS SUB TAB */}
          {eventsUpdatesTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              {/* Counters cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Events</span>
                    <strong className="text-2xl font-black text-primary">{cmsStats?.totalEvents || 0}</strong>
                    <div className="flex gap-2.5 text-[9px] text-slate-500 font-bold uppercase mt-2">
                      <span>{cmsStats?.upcomingEvents || 0} Upcoming</span>
                      <span>•</span>
                      <span>{cmsStats?.draftEvents || 0} Drafts</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center text-xl font-bold">
                    📅
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">News Announcements</span>
                    <strong className="text-2xl font-black text-primary">{cmsStats?.totalUpdates || 0}</strong>
                    <div className="flex gap-2.5 text-[9px] text-slate-500 font-bold uppercase mt-2">
                      <span>{cmsStats?.publishedUpdates || 0} Live</span>
                      <span>•</span>
                      <span>{cmsStats?.draftUpdates || 0} Drafts</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#00a896]/5 text-[#00a896] flex items-center justify-center text-xl font-bold">
                    📰
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Draft Queue</span>
                    <strong className="text-2xl font-black text-primary">{cmsStats?.totalDrafts || 0}</strong>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase mt-2">Requires review and publication</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/5 text-amber-500 flex items-center justify-center text-xl font-bold">
                    ⏳
                  </div>
                </div>

              </div>

              {/* Lists and Queues */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Upcoming Events Featured List */}
                <div className="border border-slate-100 p-5 rounded-xl space-y-4">
                  <h4 className="font-bold text-sm text-primary border-b border-slate-50 pb-2 flex items-center justify-between">
                    <span>Active Events List</span>
                    <button onClick={() => setEventsUpdatesTab('events')} className="text-xs font-bold text-accent bg-transparent border-none cursor-pointer">Manage &rarr;</button>
                  </h4>
                  {upcomingEvents.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No ongoing or upcoming events found in DB.</p>
                  ) : (
                    <div className="space-y-3.5">
                      {upcomingEvents.map((evt: any) => (
                        <div key={evt._id} className="flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 p-3 rounded-lg border border-slate-100/50">
                          <div>
                            <span className="text-[9px] font-extrabold bg-[#e6f7f5] text-[#00a896] px-2 py-0.5 rounded tracking-wide uppercase mr-2">{evt.category}</span>
                            <span className="font-bold text-xs text-primary">{evt.title}</span>
                            <div className="text-[10px] text-slate-500 mt-1">Start Date: {new Date(evt.startDate).toLocaleDateString()} • {evt.location}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Latest Updates news */}
                <div className="border border-slate-100 p-5 rounded-xl space-y-4">
                  <h4 className="font-bold text-sm text-primary border-b border-slate-50 pb-2 flex items-center justify-between">
                    <span>Latest Announcements</span>
                    <button onClick={() => setEventsUpdatesTab('updates')} className="text-xs font-bold text-accent bg-transparent border-none cursor-pointer">Manage &rarr;</button>
                  </h4>
                  {recentUpdates.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No announcements published recently.</p>
                  ) : (
                    <div className="space-y-3.5">
                      {recentUpdates.map((upd: any) => (
                        <div key={upd._id} className="flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 p-3 rounded-lg border border-slate-100/50">
                          <div>
                            <span className="text-[9px] font-extrabold bg-primary/5 text-primary px-2 py-0.5 rounded tracking-wide uppercase mr-2">{upd.category}</span>
                            <span className="font-bold text-xs text-primary">{upd.title}</span>
                            <div className="text-[10px] text-slate-500 mt-1">Summary: {upd.summary}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Draft contents approval queue */}
              <div className="border border-slate-100 p-5 rounded-xl space-y-4">
                <h4 className="font-bold text-sm text-primary border-b border-slate-50 pb-2">Draft Approval Queue ({draftContent.length})</h4>
                {draftContent.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">Draft queue is empty. Good job!</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 uppercase text-[9px] font-bold">
                          <th className="py-2.5 px-3">Title</th>
                          <th className="py-2.5 px-3">Module Type</th>
                          <th className="py-2.5 px-3">Category</th>
                          <th className="py-2.5 px-3">Date Created</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {draftContent.map((item: any) => (
                          <tr key={item._id} className="border-b border-slate-50 hover:bg-slate-50/50 font-medium">
                            <td className="py-3 px-3 font-bold text-primary">{item.title}</td>
                            <td className="py-3 px-3 uppercase text-[10px]">{item.moduleType}</td>
                            <td className="py-3 px-3">{item.category}</td>
                            <td className="py-3 px-3 text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</td>
                            <td className="py-3 px-3 text-right">
                              <button 
                                onClick={() => {
                                  if (item.moduleType === 'EVENT') {
                                    setEditingEvent(item);
                                    setCmsEventForm({
                                      title: item.title || '',
                                      slug: item.slug || '',
                                      category: item.category || 'Tournament',
                                      shortDescription: item.shortDescription || '',
                                      content: item.content || '',
                                      coverMedia: item.coverMedia || '',
                                      galleryMedia: item.galleryMedia || [],
                                      startDate: item.startDate ? item.startDate.split('T')[0] : '',
                                      endDate: item.endDate ? item.endDate.split('T')[0] : '',
                                      startTime: item.startTime || '',
                                      endTime: item.endTime || '',
                                      location: item.location || '',
                                      registrationRequired: !!item.registrationRequired,
                                      registrationUrl: item.registrationUrl || '',
                                      status: 'Published',
                                      visibility: item.visibility || 'Public',
                                      isFeatured: !!item.isFeatured
                                    });
                                    setActiveModal('cms-event');
                                  } else {
                                    setEditingUpdate(item);
                                    setCmsUpdateForm({
                                      title: item.title || '',
                                      slug: item.slug || '',
                                      category: item.category || 'Academy News',
                                      summary: item.summary || '',
                                      content: item.content || '',
                                      coverMedia: item.coverMedia || '',
                                      attachments: item.attachments || [],
                                      status: 'Published',
                                      visibility: item.visibility || 'Public',
                                      isFeatured: !!item.isFeatured
                                    });
                                    setActiveModal('cms-update');
                                  }
                                }}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold cursor-pointer border-none"
                              >
                                Review & Publish
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* B. EVENTS MANAGEMENT SUB TAB */}
          {eventsUpdatesTab === 'events' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={eventSearch}
                    onChange={(e) => { setEventSearch(e.target.value); setEventPage(1); }}
                    className="py-2 px-3 border border-border-gray rounded bg-soft-light text-xs font-semibold outline-none focus:bg-white focus:border-primary transition-all w-48"
                  />
                  <select 
                    value={eventCategoryFilter} 
                    onChange={(e) => { setEventCategoryFilter(e.target.value); setEventPage(1); }}
                    className="py-2 px-3 border border-border-gray rounded bg-white text-xs font-semibold outline-none focus:border-primary"
                  >
                    <option value="">All Categories</option>
                    <option value="Tournament">Tournament</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Camp">Camp</option>
                    <option value="Trials">Trials</option>
                    <option value="General">General</option>
                  </select>
                  <select 
                    value={eventStatusFilter} 
                    onChange={(e) => { setEventStatusFilter(e.target.value); setEventPage(1); }}
                    className="py-2 px-3 border border-border-gray rounded bg-white text-xs font-semibold outline-none focus:border-primary"
                  >
                    <option value="">All Statuses</option>
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Postponed">Postponed</option>
                  </select>
                  <select 
                    value={eventVisibilityFilter} 
                    onChange={(e) => { setEventVisibilityFilter(e.target.value); setEventPage(1); }}
                    className="py-2 px-3 border border-border-gray rounded bg-white text-xs font-semibold outline-none focus:border-primary"
                  >
                    <option value="">All Visibilities</option>
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>

                <button 
                  onClick={() => {
                    setEditingEvent(null);
                    setCmsEventForm({
                      title: '', slug: '', category: 'Tournament', shortDescription: '', content: '', coverMedia: '', galleryMedia: [],
                      startDate: '', endDate: '', startTime: '', endTime: '', location: '', registrationRequired: false, registrationUrl: '',
                      status: 'Draft', visibility: 'Public', isFeatured: false
                    });
                    setActiveModal('cms-event');
                  }}
                  className="bg-primary text-white hover:bg-accent hover:text-primary transition-all font-bold py-2 px-4 rounded cursor-pointer text-xs flex items-center gap-1.5 border-none shadow-sm"
                >
                  + Schedule Event
                </button>
              </div>

              {/* Events list datatable */}
              {eventsList.length === 0 ? (
                <p className="text-xs text-slate-400 py-12 text-center bg-slate-50 border border-slate-100 rounded-xl font-bold">No scheduled events match these filters.</p>
              ) : (
                <div className="overflow-x-auto border border-border-gray rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-border-gray text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                        <th className="py-3.5 px-4 w-12">Cover</th>
                        <th className="py-3.5 px-4">Title</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Date Bounds</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Visibility</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventsList.map((evt) => {
                        const coverUrl = evt.coverMedia 
                          ? (evt.coverMedia.startsWith('http') || evt.coverMedia.startsWith('/images') || evt.coverMedia.startsWith('/uploads') ? evt.coverMedia : `http://localhost:5000${evt.coverMedia}`)
                          : 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=120&auto=format&fit=crop';
                        
                        return (
                          <tr key={evt._id} className="border-b border-border-gray/50 hover:bg-slate-50/50 font-medium">
                            <td className="py-3 px-4">
                              <div className="w-10 h-10 rounded overflow-hidden border border-border-gray bg-white shrink-0">
                                <img src={coverUrl} alt="" className="w-full h-full object-cover" />
                              </div>
                            </td>
                            <td className="py-3 px-4 font-bold text-primary">{evt.title}</td>
                            <td className="py-3 px-4">{evt.category}</td>
                            <td className="py-3 px-4">
                              {new Date(evt.startDate).toLocaleDateString()}
                              {evt.endDate && ` - ${new Date(evt.endDate).toLocaleDateString()}`}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-block py-0.5 px-2 rounded text-[9px] font-extrabold uppercase ${
                                evt.status === 'Published' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                evt.status === 'Draft' ? 'bg-slate-100 text-slate-500 border border-slate-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
                              }`}>
                                {evt.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-block text-[9px] font-bold uppercase ${evt.visibility === 'Public' ? 'text-[#00a896]' : 'text-slate-400'}`}>
                                {evt.visibility}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button 
                                  onClick={() => {
                                    setEditingEvent(evt);
                                    setCmsEventForm({
                                      title: evt.title || '',
                                      slug: evt.slug || '',
                                      category: evt.category || 'Tournament',
                                      shortDescription: evt.shortDescription || '',
                                      content: evt.content || '',
                                      coverMedia: evt.coverMedia || '',
                                      galleryMedia: evt.galleryMedia || [],
                                      startDate: evt.startDate ? evt.startDate.split('T')[0] : '',
                                      endDate: evt.endDate ? evt.endDate.split('T')[0] : '',
                                      startTime: evt.startTime || '',
                                      endTime: evt.endTime || '',
                                      location: evt.location || '',
                                      registrationRequired: !!evt.registrationRequired,
                                      registrationUrl: evt.registrationUrl || '',
                                      status: evt.status || 'Draft',
                                      visibility: evt.visibility || 'Public',
                                      isFeatured: !!evt.isFeatured
                                    });
                                    setActiveModal('cms-event');
                                  }}
                                  className="p-1.5 bg-slate-50 text-slate-600 hover:bg-[#082142] hover:text-white rounded border border-slate-200 cursor-pointer"
                                  title="Edit Event Details"
                                >
                                  ✏️
                                </button>
                                <button 
                                  onClick={() => handleDeleteEvent(evt._id, evt.title)}
                                  className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded border border-rose-200 cursor-pointer"
                                  title="Delete Event"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Event Pagination */}
              {eventPages > 1 && (
                <div className="flex items-center justify-between pt-4 text-xs font-semibold">
                  <span className="text-slate-400">Page {eventPage} of {eventPages}</span>
                  <div className="flex gap-2">
                    <button disabled={eventPage <= 1} onClick={() => setEventPage(prev => prev - 1)} className="px-3.5 py-1.5 border border-border-gray bg-white rounded cursor-pointer disabled:opacity-50">Prev</button>
                    <button disabled={eventPage >= eventPages} onClick={() => setEventPage(prev => prev + 1)} className="px-3.5 py-1.5 border border-border-gray bg-white rounded cursor-pointer disabled:opacity-50">Next</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* C. UPDATES MANAGEMENT SUB TAB */}
          {eventsUpdatesTab === 'updates' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="text"
                    placeholder="Search news..."
                    value={updateSearch}
                    onChange={(e) => { setUpdateSearch(e.target.value); setUpdatePage(1); }}
                    className="py-2 px-3 border border-border-gray rounded bg-soft-light text-xs font-semibold outline-none focus:bg-white focus:border-primary transition-all w-48"
                  />
                  <select 
                    value={updateCategoryFilter} 
                    onChange={(e) => { setUpdateCategoryFilter(e.target.value); setUpdatePage(1); }}
                    className="py-2 px-3 border border-border-gray rounded bg-white text-xs font-semibold outline-none focus:border-primary"
                  >
                    <option value="">All Categories</option>
                    <option value="Academy News">Academy News</option>
                    <option value="Announcement">Announcement</option>
                    <option value="Achievement">Achievement</option>
                    <option value="Training Update">Training Update</option>
                    <option value="Admission Update">Admission Update</option>
                    <option value="General Update">General Update</option>
                  </select>
                  <select 
                    value={updateStatusFilter} 
                    onChange={(e) => { setUpdateStatusFilter(e.target.value); setUpdatePage(1); }}
                    className="py-2 px-3 border border-border-gray rounded bg-white text-xs font-semibold outline-none focus:border-primary"
                  >
                    <option value="">All Statuses</option>
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                  </select>
                  <select 
                    value={updateVisibilityFilter} 
                    onChange={(e) => { setUpdateVisibilityFilter(e.target.value); setUpdatePage(1); }}
                    className="py-2 px-3 border border-border-gray rounded bg-white text-xs font-semibold outline-none focus:border-primary"
                  >
                    <option value="">All Visibilities</option>
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>

                <button 
                  onClick={() => {
                    setEditingUpdate(null);
                    setCmsUpdateForm({
                      title: '', slug: '', category: 'Academy News', summary: '', content: '', coverMedia: '', attachments: [],
                      status: 'Draft', visibility: 'Public', isFeatured: false
                    });
                    setActiveModal('cms-update');
                  }}
                  className="bg-[#00a896] hover:bg-[#082142] text-white transition-all font-bold py-2 px-4 rounded cursor-pointer text-xs flex items-center gap-1.5 border-none shadow-sm"
                >
                  + Add News Update
                </button>
              </div>

              {/* Updates List Table */}
              {updatesList.length === 0 ? (
                <p className="text-xs text-slate-400 py-12 text-center bg-slate-50 border border-slate-100 rounded-xl font-bold">No news announcements match these filters.</p>
              ) : (
                <div className="overflow-x-auto border border-border-gray rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-border-gray text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                        <th className="py-3.5 px-4 w-12">Cover</th>
                        <th className="py-3.5 px-4">Title</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Published Date</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {updatesList.map((upd) => {
                        const coverUrl = upd.coverMedia 
                          ? (upd.coverMedia.startsWith('http') || upd.coverMedia.startsWith('/images') || upd.coverMedia.startsWith('/uploads') ? upd.coverMedia : `http://localhost:5000${upd.coverMedia}`)
                          : '';
                        
                        return (
                          <tr key={upd._id} className="border-b border-border-gray/50 hover:bg-slate-50/50 font-medium">
                            <td className="py-3 px-4">
                              {coverUrl ? (
                                <div className="w-10 h-10 rounded overflow-hidden border border-border-gray bg-white shrink-0">
                                  <img src={coverUrl} alt="" className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded border border-dashed border-border-gray bg-slate-100 flex items-center justify-center text-slate-400 font-bold shrink-0">📝</div>
                              )}
                            </td>
                            <td className="py-3 px-4 font-bold text-primary">{upd.title}</td>
                            <td className="py-3 px-4">{upd.category}</td>
                            <td className="py-3 px-4">
                              {upd.publishedAt ? new Date(upd.publishedAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-block py-0.5 px-2 rounded text-[9px] font-extrabold uppercase ${
                                upd.status === 'Published' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'
                              }`}>
                                {upd.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button 
                                  onClick={() => {
                                    setEditingUpdate(upd);
                                    setCmsUpdateForm({
                                      title: upd.title || '',
                                      slug: upd.slug || '',
                                      category: upd.category || 'Academy News',
                                      summary: upd.summary || '',
                                      content: upd.content || '',
                                      coverMedia: upd.coverMedia || '',
                                      attachments: upd.attachments || [],
                                      status: upd.status || 'Draft',
                                      visibility: upd.visibility || 'Public',
                                      isFeatured: !!upd.isFeatured
                                    });
                                    setActiveModal('cms-update');
                                  }}
                                  className="p-1.5 bg-slate-50 text-slate-600 hover:bg-[#082142] hover:text-white rounded border border-slate-200 cursor-pointer"
                                  title="Edit Update Details"
                                >
                                  ✏️
                                </button>
                                <button 
                                  onClick={() => handleDeleteUpdate(upd._id, upd.title)}
                                  className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded border border-rose-200 cursor-pointer"
                                  title="Delete Announcement"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Updates Pagination */}
              {updatePages > 1 && (
                <div className="flex items-center justify-between pt-4 text-xs font-semibold">
                  <span className="text-slate-400">Page {updatePage} of {updatePages}</span>
                  <div className="flex gap-2">
                    <button disabled={updatePage <= 1} onClick={() => setUpdatePage(prev => prev - 1)} className="px-3.5 py-1.5 border border-border-gray bg-white rounded cursor-pointer disabled:opacity-50">Prev</button>
                    <button disabled={updatePage >= updatePages} onClick={() => setUpdatePage(prev => prev + 1)} className="px-3.5 py-1.5 border border-border-gray bg-white rounded cursor-pointer disabled:opacity-50">Next</button>
                  </div>
                </div>
              )}
            </div>
          )}

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

      {/* COMPLIANCE CMS VIEW */}
      {activeTab === 'compliance' && (
        <AdminCompliance token={token} triggerSuccess={triggerSuccess} />
      )}

      {/* FACILITIES MANAGEMENT VIEW */}
      {activeTab === 'facilities' && (() => {
        const deletedFacilitiesCount = facilitiesList.filter(f => f.isDeleted).length;
        const displayedFacilities = facilitiesList.filter(f => showDeletedFacilities ? f.isDeleted : !f.isDeleted);

        return (
          <div className="bg-white p-6 md:p-8 rounded-xl border border-border-gray shadow-sm text-left space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-border-gray">
              <div>
                <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Buildings size={22} className="text-accent" /> Facilities Management {showDeletedFacilities && <span className="text-amber-600 text-xs font-extrabold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">(Trash Bin)</span>}
                </h2>
                <p className="text-text-light text-xs mt-1">
                  Add, update, or remove campus facility cards displayed on the website.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDeletedFacilities(!showDeletedFacilities)}
                  className={`px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer border transition-all ${
                    showDeletedFacilities
                      ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <Trash size={14} className={showDeletedFacilities ? 'text-amber-600' : 'text-slate-500'} />
                  {showDeletedFacilities ? 'Active Facilities' : 'Trash Bin'}
                  {deletedFacilitiesCount > 0 && (
                    <span className="bg-rose-500 text-white px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ml-0.5">
                      {deletedFacilitiesCount}
                    </span>
                  )}
                </button>
                {!showDeletedFacilities && (
                  <button
                    onClick={() => {
                      setFacilityForm({ title: '', tag: '', description: '', image: '', order: facilitiesList.length + 1, status: 'Active' });
                      setEditingFacility(null);
                      setActiveModal('facility');
                    }}
                    className="flex items-center gap-1.5 bg-primary hover:bg-accent hover:text-primary text-white font-bold py-2.5 px-4 rounded-lg transition-all text-xs border-none cursor-pointer self-start"
                  >
                    <Plus size={16} /> Add New Facility
                  </button>
                )}
              </div>
            </div>

            {displayedFacilities.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border-gray rounded-xl text-text-light text-xs">
                {showDeletedFacilities ? 'Trash bin is empty. No deleted facilities found.' : 'No facilities cards found in database. Click "+ Add New Facility" to create one.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedFacilities.map((fac) => {
                  const imgUrl = fac.image
                    ? (fac.image.startsWith('http') || fac.image.startsWith('/images') || fac.image.startsWith('/uploads') ? fac.image : `http://localhost:5000${fac.image}`)
                    : '/images/sports_training_card.jpg';

                  return (
                    <div key={fac.id || fac._id} className="border border-border-gray rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all bg-soft-light relative">
                      <div>
                        <div className="h-[180px] bg-primary relative overflow-hidden">
                          <img src={imgUrl} alt={fac.title} className="w-full h-full object-cover" />
                          {fac.tag && (
                            <span className="absolute bottom-3 right-3 bg-primary/90 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow">
                              {fac.tag}
                            </span>
                          )}
                          {showDeletedFacilities ? (
                            <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-rose-600 text-white shadow">
                              In Trash Bin
                            </span>
                          ) : (
                            <span className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                              fac.status === 'Hidden' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            }`}>
                              {fac.status || 'Active'}
                            </span>
                          )}
                        </div>
                        <div className="p-5 text-left space-y-2">
                          <h3 className="text-sm font-extrabold text-primary">{fac.title}</h3>
                          <p className="text-text-light text-xs leading-relaxed line-clamp-3">
                            {fac.description}
                          </p>
                        </div>
                      </div>
                      <div className="p-3.5 border-t border-border-gray/50 flex gap-2 justify-end bg-white">
                        {showDeletedFacilities ? (
                          <>
                            <button
                              onClick={() => handleRestoreFacility(fac.id || fac._id, fac.title)}
                              className="flex-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold py-1.5 px-3 rounded text-[11px] border border-emerald-200 transition-all cursor-pointer flex items-center justify-center gap-1"
                            >
                              <ArrowCounterClockwise size={14} /> Restore
                            </button>
                            <button
                              onClick={() => handleDeleteFacility(fac.id || fac._id, fac.title, true)}
                              className="flex-1 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-bold py-1.5 px-3 rounded text-[11px] border border-rose-200 transition-all cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Trash size={14} /> Delete Permanently
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingFacility(fac);
                                setFacilityForm({
                                  title: fac.title || '',
                                  tag: fac.tag || '',
                                  description: fac.description || '',
                                  image: fac.image || '',
                                  order: fac.order || 0,
                                  status: fac.status || 'Active'
                                });
                                setActiveModal('facility');
                              }}
                              className="bg-primary-light/10 hover:bg-primary-light/20 text-primary-light font-bold py-1.5 px-3 rounded text-[11px] border-none cursor-pointer"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteFacility(fac.id || fac._id, fac.title, false)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-1.5 px-3 rounded text-[11px] border-none cursor-pointer flex items-center gap-1"
                            >
                              <Trash size={12} /> Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* RLBSA EDGE MANAGEMENT VIEW */}
      {activeTab === 'rlbsa-edge' && (() => {
        const deletedEdgeCount = edgeCardsList.filter(e => e.isDeleted).length;
        const displayedEdgeCards = edgeCardsList.filter(e => showDeletedEdge ? e.isDeleted : !e.isDeleted);

        return (
          <div className="bg-white p-6 md:p-8 rounded-xl border border-border-gray shadow-sm text-left space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-border-gray">
              <div>
                <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Trophy size={22} className="text-accent" /> RLBSA Edge Cards Management {showDeletedEdge && <span className="text-amber-600 text-xs font-extrabold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">(Trash Bin)</span>}
                </h2>
                <p className="text-text-light text-xs mt-1">
                  Add, edit, or remove feature card details displayed in the RLBSA Edge section on the home page.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDeletedEdge(!showDeletedEdge)}
                  className={`px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer border transition-all ${
                    showDeletedEdge
                      ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <Trash size={14} className={showDeletedEdge ? 'text-amber-600' : 'text-slate-500'} />
                  {showDeletedEdge ? 'Active Cards' : 'Trash Bin'}
                  {deletedEdgeCount > 0 && (
                    <span className="bg-rose-500 text-white px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ml-0.5">
                      {deletedEdgeCount}
                    </span>
                  )}
                </button>
                {!showDeletedEdge && (
                  <button
                    onClick={() => {
                      setEdgeCardForm({
                        tag: '',
                        title: '',
                        description: '',
                        image: '',
                        link: '',
                        linkText: '',
                        isFeatured: false,
                        order: edgeCardsList.length + 1,
                        status: 'Active'
                      });
                      setEditingEdgeCard(null);
                      setActiveModal('edge-card');
                    }}
                    className="flex items-center gap-1.5 bg-primary hover:bg-accent hover:text-primary text-white font-bold py-2.5 px-4 rounded-lg transition-all text-xs border-none cursor-pointer self-start"
                  >
                    <Plus size={16} /> Add Edge Card
                  </button>
                )}
              </div>
            </div>

            {displayedEdgeCards.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border-gray rounded-xl text-text-light text-xs">
                {showDeletedEdge ? 'Trash bin is empty. No deleted RLBSA Edge cards found.' : 'No edge cards found in database. Click "+ Add Edge Card" to create one.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedEdgeCards.map((card) => {
                  const imgUrl = card.image
                    ? (card.image.startsWith('http') || card.image.startsWith('/images') || card.image.startsWith('/uploads') ? card.image : `http://localhost:5000${card.image}`)
                    : '/images/rlbsa_hero_bg.jpg';

                  return (
                    <div key={card.id || card._id} className="border border-border-gray rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all bg-soft-light relative">
                      <div>
                        <div className="h-[180px] bg-primary relative overflow-hidden">
                          <img src={imgUrl} alt={card.title} className="w-full h-full object-cover" />
                          {card.tag && (
                            <span className="absolute bottom-3 right-3 bg-accent text-primary text-[10px] font-extrabold uppercase px-2.5 py-1 rounded shadow">
                              {card.tag}
                            </span>
                          )}
                          {card.isFeatured && (
                            <span className="absolute top-3 right-3 bg-amber-500 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow">
                              ⭐ Featured Main Card
                            </span>
                          )}
                          {showDeletedEdge ? (
                            <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-rose-600 text-white shadow">
                              In Trash Bin
                            </span>
                          ) : (
                            <span className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                              card.status === 'Hidden' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            }`}>
                              {card.status || 'Active'}
                            </span>
                          )}
                        </div>
                        <div className="p-5 text-left space-y-2">
                          <h3 className="text-sm font-extrabold text-primary">{card.title}</h3>
                          <p className="text-text-light text-xs leading-relaxed line-clamp-3">
                            {card.description}
                          </p>
                          {(card.link || card.linkText) && (
                            <div className="pt-1 text-[11px] text-accent font-bold flex items-center gap-1">
                              <span>Link: {card.linkText || card.link || 'Action Button'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-3.5 border-t border-border-gray/50 flex gap-2 justify-end bg-white">
                        {showDeletedEdge ? (
                          <>
                            <button
                              onClick={() => handleRestoreEdgeCard(card._id || card.id, card.title)}
                              className="flex-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold py-1.5 px-3 rounded text-[11px] border border-emerald-200 transition-all cursor-pointer flex items-center justify-center gap-1"
                            >
                              <ArrowCounterClockwise size={14} /> Restore
                            </button>
                            <button
                              onClick={() => handleDeleteEdgeCard(card._id || card.id, card.title, true)}
                              className="flex-1 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-bold py-1.5 px-3 rounded text-[11px] border border-rose-200 transition-all cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Trash size={14} /> Delete Permanently
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingEdgeCard(card);
                                setEdgeCardForm({
                                  tag: card.tag || '',
                                  title: card.title || '',
                                  description: card.description || '',
                                  image: card.image || '',
                                  link: card.link || '',
                                  linkText: card.linkText || '',
                                  isFeatured: card.isFeatured || false,
                                  order: card.order || 0,
                                  status: card.status || 'Active'
                                });
                                setActiveModal('edge-card');
                              }}
                              className="bg-primary-light/10 hover:bg-primary-light/20 text-primary-light font-bold py-1.5 px-3 rounded text-[11px] border-none cursor-pointer"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteEdgeCard(card._id || card.id, card.title, false)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-1.5 px-3 rounded text-[11px] border-none cursor-pointer flex items-center gap-1"
                            >
                              <Trash size={12} /> Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* OTHER PLACEHOLDER VIEWS */}
      {!['dashboard', 'students', 'coaches', 'gallery', 'events', 'enquiries', 'achievements', 'settings', 'founders', 'success-stories', 'compliance', 'facilities', 'rlbsa-edge', 'outreach'].includes(activeTab) && (
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

      {/* OUTREACH PROGRAM MANAGEMENT */}
      {activeTab === 'outreach' && (() => {
        if (!outreachData) {
          return (
            <div className="bg-white p-12 rounded-xl border border-border-gray shadow-sm text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
              <p className="text-text-light text-xs font-semibold">Loading Outreach Program configuration...</p>
            </div>
          );
        }

        return (
          <div className="flex flex-col gap-6 text-left">
            {/* Header Title Bar */}
            <div className="bg-white p-6 rounded-xl border border-border-gray shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                  <Megaphone size={24} className="text-accent" /> Outreach Program Management
                </h2>
                <p className="text-text-light text-xs mt-1">
                  Manage all titles, images, impact statistics, initiatives, core pillars, and text content rendered on the public Outreach Program page.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSaveOutreach()}
                  disabled={isSavingOutreach}
                  className="bg-primary hover:bg-accent hover:text-primary text-white font-bold py-2.5 px-6 rounded-lg text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md border-none flex items-center gap-2 disabled:opacity-50"
                >
                  {isSavingOutreach ? 'Saving Changes...' : '💾 Save All Changes'}
                </button>
              </div>
            </div>

            {/* Success Alert */}
            {outreachSuccessMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs animate-fade-in">
                <span>{outreachSuccessMsg}</span>
                <button onClick={() => setOutreachSuccessMsg('')} className="text-emerald-800 bg-transparent border-none cursor-pointer">
                  <X size={16} />
                </button>
              </div>
            )}

            {/* 1. Header Banner & Subtitle */}
            <div className="bg-white p-6 rounded-xl border border-border-gray shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider border-b pb-2">
                1. Main Page Header &amp; Subtitle
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Page Main Title
                  </label>
                  <input
                    type="text"
                    value={outreachData.header?.title || ''}
                    onChange={(e) => setOutreachData({
                      ...outreachData,
                      header: { ...outreachData.header, title: e.target.value }
                    })}
                    className="w-full p-3 border border-border-gray rounded-lg text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:border-primary outline-none"
                    placeholder="Outreach Program"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Header Subtitle / Tagline
                  </label>
                  <textarea
                    rows={2}
                    value={outreachData.header?.subtitle || ''}
                    onChange={(e) => setOutreachData({
                      ...outreachData,
                      header: { ...outreachData.header, subtitle: e.target.value }
                    })}
                    className="w-full p-3 border border-border-gray rounded-lg text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:border-primary outline-none"
                    placeholder="Taking sports excellence, education..."
                  />
                </div>
              </div>
            </div>

            {/* 2. Impact Counter Cards (4 Stats) */}
            <div className="bg-white p-6 rounded-xl border border-border-gray shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider border-b pb-2">
                2. Impact Counter Cards (4 Metrics)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(outreachData.impactStats || []).map((stat: any, sIdx: number) => (
                  <div key={sIdx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-3">
                    <span className="text-[10px] font-black text-accent uppercase">Metric #{sIdx + 1}</span>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Number / Value</label>
                      <input
                        type="text"
                        value={stat.val || ''}
                        onChange={(e) => {
                          const updated = [...outreachData.impactStats];
                          updated[sIdx].val = e.target.value;
                          setOutreachData({ ...outreachData, impactStats: updated });
                        }}
                        className="w-full p-2 border border-slate-300 rounded text-xs font-extrabold text-primary bg-white focus:border-primary outline-none"
                        placeholder="50+"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Stat Label</label>
                      <input
                        type="text"
                        value={stat.label || ''}
                        onChange={(e) => {
                          const updated = [...outreachData.impactStats];
                          updated[sIdx].label = e.target.value;
                          setOutreachData({ ...outreachData, impactStats: updated });
                        }}
                        className="w-full p-2 border border-slate-300 rounded text-xs font-semibold text-slate-700 bg-white focus:border-primary outline-none"
                        placeholder="Villages Reached"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Showcase Key Initiatives (Gallery Grid) */}
            <div className="bg-white p-6 rounded-xl border border-border-gray shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider">
                  3. Key Initiatives Gallery Cards ({outreachData.initiatives?.length || 0})
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const newInit = {
                      id: `outreach-${Date.now()}`,
                      tag: `0${(outreachData.initiatives?.length || 0) + 1}. New Drive`,
                      caption: 'New Initiative Title',
                      desc: 'Short description of this initiative',
                      image: '/images/hero1.jpeg'
                    };
                    setOutreachData({
                      ...outreachData,
                      initiatives: [...(outreachData.initiatives || []), newInit]
                    });
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg border-none cursor-pointer flex items-center gap-1"
                >
                  <Plus size={14} /> Add Initiative Card
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(outreachData.initiatives || []).map((init: any, iIdx: number) => (
                  <div key={init.id || iIdx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between gap-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded">
                          Card #{iIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = outreachData.initiatives.filter((_: any, index: number) => index !== iIdx);
                            setOutreachData({ ...outreachData, initiatives: updated });
                          }}
                          className="text-rose-600 hover:bg-rose-50 p-1 rounded border-none cursor-pointer"
                        >
                          <Trash size={16} />
                        </button>
                      </div>

                      {/* Image Preview & Upload */}
                      <div className="relative h-[140px] w-full rounded-lg overflow-hidden bg-slate-200 border">
                        <img
                          src={init.image || '/images/hero1.jpeg'}
                          alt={init.caption}
                          className="w-full h-full object-cover"
                        />
                        <label className="absolute bottom-2 right-2 bg-primary/90 text-white text-[10px] font-bold px-2.5 py-1 rounded cursor-pointer shadow hover:bg-accent hover:text-primary transition-all">
                          <span>📷 Change Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const updated = [...outreachData.initiatives];
                                  updated[iIdx].image = reader.result as string;
                                  setOutreachData({ ...outreachData, initiatives: updated });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Image URL / Path</label>
                        <input
                          type="text"
                          value={init.image || ''}
                          onChange={(e) => {
                            const updated = [...outreachData.initiatives];
                            updated[iIdx].image = e.target.value;
                            setOutreachData({ ...outreachData, initiatives: updated });
                          }}
                          className="w-full p-2 border border-slate-300 rounded text-xs font-semibold text-slate-700 bg-white focus:border-primary outline-none"
                          placeholder="/images/hero1.jpeg"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Tag / Badge Label</label>
                        <input
                          type="text"
                          value={init.tag || ''}
                          onChange={(e) => {
                            const updated = [...outreachData.initiatives];
                            updated[iIdx].tag = e.target.value;
                            setOutreachData({ ...outreachData, initiatives: updated });
                          }}
                          className="w-full p-2 border border-slate-300 rounded text-xs font-extrabold text-accent bg-white focus:border-primary outline-none"
                          placeholder="01. Grassroots Scouting"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Initiative Caption / Title</label>
                        <input
                          type="text"
                          value={init.caption || ''}
                          onChange={(e) => {
                            const updated = [...outreachData.initiatives];
                            updated[iIdx].caption = e.target.value;
                            setOutreachData({ ...outreachData, initiatives: updated });
                          }}
                          className="w-full p-2 border border-slate-300 rounded text-xs font-extrabold text-primary bg-white focus:border-primary outline-none"
                          placeholder="Village Talent Identification"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-1">Short Description</label>
                        <textarea
                          rows={2}
                          value={init.desc || ''}
                          onChange={(e) => {
                            const updated = [...outreachData.initiatives];
                            updated[iIdx].desc = e.target.value;
                            setOutreachData({ ...outreachData, initiatives: updated });
                          }}
                          className="w-full p-2 border border-slate-300 rounded text-xs font-medium text-slate-700 bg-white focus:border-primary outline-none"
                          placeholder="Discovering hidden athletic potential..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Detailed Description & Paragraphs */}
            <div className="bg-white p-6 rounded-xl border border-border-gray shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider border-b pb-2">
                4. Detailed Program Description Section
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Section Tagline
                  </label>
                  <input
                    type="text"
                    value={outreachData.descriptionSection?.tagline || ''}
                    onChange={(e) => setOutreachData({
                      ...outreachData,
                      descriptionSection: { ...outreachData.descriptionSection, tagline: e.target.value }
                    })}
                    className="w-full p-3 border border-border-gray rounded-lg text-xs font-bold text-accent bg-slate-50 focus:bg-white focus:border-primary outline-none"
                    placeholder="Empowering Rural Communities"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Section Main Heading
                  </label>
                  <input
                    type="text"
                    value={outreachData.descriptionSection?.heading || ''}
                    onChange={(e) => setOutreachData({
                      ...outreachData,
                      descriptionSection: { ...outreachData.descriptionSection, heading: e.target.value }
                    })}
                    className="w-full p-3 border border-border-gray rounded-lg text-xs font-extrabold text-primary bg-slate-50 focus:bg-white focus:border-primary outline-none"
                    placeholder="Transforming Lives Beyond the Boundary Lines"
                  />
                </div>
              </div>

              {/* Paragraphs list */}
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Program Story Paragraphs ({(outreachData.descriptionSection?.paragraphs || []).length})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(outreachData.descriptionSection?.paragraphs || []), 'New paragraph content...'];
                      setOutreachData({
                        ...outreachData,
                        descriptionSection: { ...outreachData.descriptionSection, paragraphs: updated }
                      });
                    }}
                    className="bg-primary hover:bg-primary-light text-white text-[11px] font-bold py-1 px-3 rounded border-none cursor-pointer flex items-center gap-1"
                  >
                    <Plus size={12} /> Add Paragraph
                  </button>
                </div>

                {(outreachData.descriptionSection?.paragraphs || []).map((pText: string, pIdx: number) => (
                  <div key={pIdx} className="flex gap-2 items-start bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 mt-2">#{pIdx + 1}</span>
                    <textarea
                      rows={3}
                      value={pText}
                      onChange={(e) => {
                        const updated = [...outreachData.descriptionSection.paragraphs];
                        updated[pIdx] = e.target.value;
                        setOutreachData({
                          ...outreachData,
                          descriptionSection: { ...outreachData.descriptionSection, paragraphs: updated }
                        });
                      }}
                      className="flex-1 p-2.5 border border-slate-300 rounded text-xs font-medium text-slate-800 bg-white focus:border-primary outline-none leading-relaxed"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = outreachData.descriptionSection.paragraphs.filter((_: any, index: number) => index !== pIdx);
                        setOutreachData({
                          ...outreachData,
                          descriptionSection: { ...outreachData.descriptionSection, paragraphs: updated }
                        });
                      }}
                      className="text-rose-600 hover:bg-rose-100 p-1.5 rounded border-none cursor-pointer mt-1"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Core Pillars of Outreach */}
            <div className="bg-white p-6 rounded-xl border border-border-gray shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider">
                  5. Core Pillars of Outreach ({(outreachData.pillars || []).length})
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const newPillar = {
                      id: `pillar-${Date.now()}`,
                      icon: '🎯',
                      title: 'New Core Pillar',
                      desc: 'Description of key focus area'
                    };
                    setOutreachData({
                      ...outreachData,
                      pillars: [...(outreachData.pillars || []), newPillar]
                    });
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg border-none cursor-pointer flex items-center gap-1"
                >
                  <Plus size={14} /> Add Core Pillar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(outreachData.pillars || []).map((pillar: any, pIdx: number) => (
                  <div key={pillar.id || pIdx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded">
                        Pillar #{pIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = outreachData.pillars.filter((_: any, index: number) => index !== pIdx);
                          setOutreachData({ ...outreachData, pillars: updated });
                        }}
                        className="text-rose-600 hover:bg-rose-50 p-1 rounded border-none cursor-pointer"
                      >
                        <Trash size={16} />
                      </button>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Emoji / Icon</label>
                      <input
                        type="text"
                        value={pillar.icon || '🎯'}
                        onChange={(e) => {
                          const updated = [...outreachData.pillars];
                          updated[pIdx].icon = e.target.value;
                          setOutreachData({ ...outreachData, pillars: updated });
                        }}
                        className="w-full p-2 border border-slate-300 rounded text-center text-lg font-bold bg-white focus:border-primary outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Pillar Title</label>
                      <input
                        type="text"
                        value={pillar.title || ''}
                        onChange={(e) => {
                          const updated = [...outreachData.pillars];
                          updated[pIdx].title = e.target.value;
                          setOutreachData({ ...outreachData, pillars: updated });
                        }}
                        className="w-full p-2 border border-slate-300 rounded text-xs font-extrabold text-primary bg-white focus:border-primary outline-none"
                        placeholder="Talent Identification"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={pillar.desc || ''}
                        onChange={(e) => {
                          const updated = [...outreachData.pillars];
                          updated[pIdx].desc = e.target.value;
                          setOutreachData({ ...outreachData, pillars: updated });
                        }}
                        className="w-full p-2 border border-slate-300 rounded text-xs font-medium text-slate-700 bg-white focus:border-primary outline-none"
                        placeholder="Organizing physical fitness assessments..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Call To Action (CTA Banner) */}
            <div className="bg-white p-6 rounded-xl border border-border-gray shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider border-b pb-2">
                6. Call To Action Banner
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Banner Tagline
                  </label>
                  <input
                    type="text"
                    value={outreachData.cta?.tagline || ''}
                    onChange={(e) => setOutreachData({
                      ...outreachData,
                      cta: { ...outreachData.cta, tagline: e.target.value }
                    })}
                    className="w-full p-3 border border-border-gray rounded-lg text-xs font-bold text-accent bg-slate-50 focus:bg-white focus:border-primary outline-none"
                    placeholder="JOIN OUR MISSION"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Banner Heading
                  </label>
                  <input
                    type="text"
                    value={outreachData.cta?.heading || ''}
                    onChange={(e) => setOutreachData({
                      ...outreachData,
                      cta: { ...outreachData.cta, heading: e.target.value }
                    })}
                    className="w-full p-3 border border-border-gray rounded-lg text-xs font-extrabold text-primary bg-slate-50 focus:bg-white focus:border-primary outline-none"
                    placeholder="Help Us Reach More Rural Athletes in Bihar"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Banner Sub-text / Description
                  </label>
                  <textarea
                    rows={2}
                    value={outreachData.cta?.description || ''}
                    onChange={(e) => setOutreachData({
                      ...outreachData,
                      cta: { ...outreachData.cta, description: e.target.value }
                    })}
                    className="w-full p-3 border border-border-gray rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:border-primary outline-none"
                    placeholder="Partner with RLBSA to sponsor sports kits..."
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={outreachData.cta?.buttonText || ''}
                    onChange={(e) => setOutreachData({
                      ...outreachData,
                      cta: { ...outreachData.cta, buttonText: e.target.value }
                    })}
                    className="w-full p-3 border border-border-gray rounded-lg text-xs font-extrabold text-primary bg-slate-50 focus:bg-white focus:border-primary outline-none"
                    placeholder="Get In Touch"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Primary Button Link / Hash
                  </label>
                  <input
                    type="text"
                    value={outreachData.cta?.buttonLink || ''}
                    onChange={(e) => setOutreachData({
                      ...outreachData,
                      cta: { ...outreachData.cta, buttonLink: e.target.value }
                    })}
                    className="w-full p-3 border border-border-gray rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:border-primary outline-none"
                    placeholder="#/contact"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Floating Save Button */}
            <div className="bg-white p-4 rounded-xl border border-border-gray shadow-md flex justify-end">
              <button
                onClick={() => handleSaveOutreach()}
                disabled={isSavingOutreach}
                className="bg-primary hover:bg-accent hover:text-primary text-white font-bold py-3.5 px-8 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg border-none flex items-center gap-2 disabled:opacity-50"
              >
                {isSavingOutreach ? 'Saving Changes...' : '💾 Save All Outreach Changes'}
              </button>
            </div>
          </div>
        );
      })()}

      {/* FOUNDERS & DIRECTORS MANAGEMENT */}
      {activeTab === 'founders' && (() => {
        const deletedTeamCount = team.filter(m => m.isDeleted).length;
        const displayedTeam = team.filter(m => showDeletedTeam ? m.isDeleted : !m.isDeleted);

        return (
          <div className="bg-white p-8 rounded-xl border border-border-gray shadow-sm text-left flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-border-gray/50">
              <div>
                <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                  Founders &amp; Directors Management {showDeletedTeam && <span className="text-amber-600 text-xs font-extrabold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">(Trash Bin)</span>}
                </h2>
                <p className="text-text-light text-xs mt-1">Configure profile cards for Mr. Sanjay Pathak and other directors shown on the website.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDeletedTeam(!showDeletedTeam)}
                  className={`px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer border transition-all ${
                    showDeletedTeam
                      ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <Trash size={14} className={showDeletedTeam ? 'text-amber-600' : 'text-slate-500'} />
                  {showDeletedTeam ? 'Active Team' : 'Trash Bin'}
                  {deletedTeamCount > 0 && (
                    <span className="bg-rose-500 text-white px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ml-0.5">
                      {deletedTeamCount}
                    </span>
                  )}
                </button>
                {!showDeletedTeam && (
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
                )}
              </div>
            </div>

            {displayedTeam.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border-gray rounded-xl text-text-light text-xs">
                {showDeletedTeam ? 'Trash bin is empty. No deleted team members.' : 'No team members registered. Click "Add Member" to create one.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedTeam.map((member) => (
                  <div key={member.id} className="border border-border-gray rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow transition-all bg-soft-light relative">
                    <div>
                      <div className="h-[180px] bg-primary relative">
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" style={{ objectPosition: member.objectPosition || 'center' }} />
                        <span className="absolute bottom-3 left-3 bg-accent text-primary text-[10px] font-black px-2 py-0.5 rounded shadow uppercase">
                          {member.role.includes('Founder') ? 'Founder' : 'Director'}
                        </span>
                        {showDeletedTeam && (
                          <span className="absolute top-3 right-3 bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow">
                            In Trash Bin
                          </span>
                        )}
                      </div>
                      <div className="p-5 text-left">
                        <h3 className="text-sm font-extrabold text-primary mb-1">{member.name}</h3>
                        <span className="text-[11px] font-bold text-accent block mb-3 uppercase tracking-wider">{member.role}</span>
                        <div className="text-text-light text-[11px] leading-relaxed space-y-1 line-clamp-4 font-normal text-justify">
                          {getBioParagraphs(member.bio).map((paragraph, idx) => (
                            <p key={idx} className="text-justify">{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t border-border-gray/50 flex gap-2 justify-end bg-white">
                      {showDeletedTeam ? (
                        <>
                          <button
                            onClick={() => handleRestoreTeamMember(member.id, member.name)}
                            className="flex-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold py-1.5 px-3 rounded text-[11px] border border-emerald-200 transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <ArrowCounterClockwise size={14} /> Restore
                          </button>
                          <button
                            onClick={() => handleDeleteTeamMember(member.id, member.name, true)}
                            className="flex-1 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-bold py-1.5 px-3 rounded text-[11px] border border-rose-200 transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Trash size={14} /> Delete Permanently
                          </button>
                        </>
                      ) : (
                        <>
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
                            onClick={() => handleDeleteTeamMember(member.id, member.name, false)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-1.5 px-3 rounded text-[11px] border-none cursor-pointer flex items-center gap-1"
                          >
                            <Trash size={12} /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* SUCCESS STORIES TAB VIEW */}
      {activeTab === 'success-stories' && (() => {
        const deletedStoriesCount = stories.filter(s => s.isDeleted).length;
        const displayedStories = stories.filter(s => showDeletedStories ? s.isDeleted : !s.isDeleted);

        return (
          <div className="bg-white p-6 md:p-8 rounded-xl border border-border-gray shadow-sm text-left">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-border-gray">
              <div>
                <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                  Success Stories Management {showDeletedStories && <span className="text-amber-600 text-xs font-extrabold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">(Trash Bin)</span>}
                </h2>
                <p className="text-text-light text-xs mt-1">Configure profile cards for former athletes and alumni shown on the website.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDeletedStories(!showDeletedStories)}
                  className={`px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer border transition-all ${
                    showDeletedStories
                      ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <Trash size={14} className={showDeletedStories ? 'text-amber-600' : 'text-slate-500'} />
                  {showDeletedStories ? 'Active Stories' : 'Trash Bin'}
                  {deletedStoriesCount > 0 && (
                    <span className="bg-rose-500 text-white px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ml-0.5">
                      {deletedStoriesCount}
                    </span>
                  )}
                </button>
                {!showDeletedStories && (
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
                )}
              </div>
            </div>

            {displayedStories.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border-gray rounded-xl text-text-light text-xs">
                {showDeletedStories ? 'Trash bin is empty. No deleted success stories.' : 'No success stories registered. Click "Add Story" to create one.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedStories.map((story) => (
                  <div key={story.id} className="border border-border-gray rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow transition-all bg-soft-light relative">
                    <div>
                      <div className="h-[180px] bg-primary relative">
                        <img src={story.image} alt={story.name} className="w-full h-full object-cover" style={{ objectPosition: story.objectPosition || 'center' }} />
                        <span className="absolute bottom-3 left-3 bg-accent text-primary text-[10px] font-black px-2 py-0.5 rounded shadow uppercase">
                          {story.sport}
                        </span>
                        {showDeletedStories && (
                          <span className="absolute top-3 right-3 bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow">
                            In Trash Bin
                          </span>
                        )}
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
                      {showDeletedStories ? (
                        <>
                          <button
                            onClick={() => handleRestoreStory(story.id, story.name)}
                            className="flex-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold py-1.5 px-3 rounded text-[11px] border border-emerald-200 transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <ArrowCounterClockwise size={14} /> Restore
                          </button>
                          <button
                            onClick={() => deleteStory(story.id, story.name, true)}
                            className="flex-1 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-bold py-1.5 px-3 rounded text-[11px] border border-rose-200 transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Trash size={14} /> Delete Permanently
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => openEditStoryModal(story)}
                            className="bg-primary-light/10 hover:bg-primary-light/20 text-primary-light font-bold py-1.5 px-3 rounded text-[11px] border-none cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteStory(story.id, story.name, false)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-1.5 px-3 rounded text-[11px] border-none cursor-pointer flex items-center gap-1"
                          >
                            <Trash size={12} /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* 5. Add / Edit Team Member Modal */}
      {activeModal === 'team' && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-3 sm:p-5 animate-fade-in overflow-hidden" onClick={() => setActiveModal(null)}>
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-5 sm:p-6 text-left relative max-h-[90vh] flex flex-col my-auto animate-fade-in overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-text-light hover:text-primary cursor-pointer border-none bg-transparent z-10" onClick={() => setActiveModal(null)}><X size={20} /></button>
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2 shrink-0 border-b border-border-gray pb-2">
              <UserPlus size={20} className="text-accent" /> {editingTeamMember ? 'Edit Team Member' : 'Add Team Member'}
            </h3>
            <form onSubmit={editingTeamMember ? handleUpdateTeamMember : handleAddTeamMember} className="flex-1 overflow-y-auto space-y-4 pr-1 py-1">
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
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">Member Photo (3:4 Portrait Ratio)</label>
                <div className="p-3 border border-border-gray rounded-xl bg-soft-light flex items-center gap-3">
                  {teamForm.image ? (
                    <img src={teamForm.image} alt="Member" className="w-12 h-16 object-cover rounded border border-primary shrink-0 shadow-xs" />
                  ) : (
                    <div className="w-12 h-16 rounded bg-slate-200 flex items-center justify-center text-slate-500 text-lg font-bold shrink-0 border border-slate-300">👨‍💼</div>
                  )}
                  <div className="flex-1">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            if (evt.target?.result) {
                              setCropperSource(evt.target.result as string);
                              setCroppingTarget('team');
                              setCropZoom(1);
                              setCropPosition({ x: 0, y: 0 });
                              setShowCropperModal(true);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-xs text-text-light file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-accent cursor-pointer w-full" 
                    />
                  </div>
                </div>
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
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">Bio / Description</label>
                <textarea 
                  required
                  rows={5}
                  placeholder="Enter biography or description (each sentence will start on a new line)..."
                  value={teamForm.bio} 
                  onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                  className="w-full py-2.5 px-4 border border-border-gray rounded-lg bg-soft-light text-xs text-dark placeholder-slate-400 outline-none focus:border-primary focus:bg-white transition-all font-medium whitespace-pre-line leading-relaxed"
                />
                <p className="text-[10px] text-text-light/70 mt-1">Each sentence or new line will start cleanly on a new line on the website.</p>
              </div>
              <button 
                type="submit" 
                className="w-full bg-primary hover:bg-accent hover:text-primary text-white font-bold py-3.5 rounded-lg transition-all cursor-pointer text-xs uppercase tracking-wider border-none outline-none mt-2 shadow-md font-main"
              >
                {editingTeamMember ? 'Update Profile' : 'Add Profile'}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* 5. Add / Edit Success Story Modal */}
      {activeModal === 'success-story' && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-3 sm:p-5 animate-fade-in overflow-hidden" onClick={() => setActiveModal(null)}>
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-5 sm:p-6 text-left relative max-h-[90vh] flex flex-col my-auto animate-fade-in overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-text-light hover:text-primary cursor-pointer border-none bg-transparent z-10" onClick={() => setActiveModal(null)}><X size={20} /></button>
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2 shrink-0 border-b border-border-gray pb-2">
              <Trophy size={20} className="text-accent" /> {editingStory ? 'Edit Success Story' : 'Add Success Story'}
            </h3>
            <form onSubmit={handleAddOrUpdateStory} className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-1">
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
                <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1.5">Athlete Photo (4:3 Landscape Ratio)</label>
                <div className="p-3 border border-border-gray rounded-xl bg-soft-light flex items-center gap-3">
                  {storyForm.image ? (
                    <img src={storyForm.image} alt="Athlete" className="w-16 h-12 object-cover rounded border border-primary shrink-0 shadow-xs" />
                  ) : (
                    <div className="w-16 h-12 rounded bg-slate-200 flex items-center justify-center text-slate-500 text-base font-bold shrink-0 border border-slate-300">🏆</div>
                  )}
                  <div className="flex-1">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            if (evt.target?.result) {
                              setCropperSource(evt.target.result as string);
                              setCroppingTarget('story');
                              setCropZoom(1);
                              setCropPosition({ x: 0, y: 0 });
                              setShowCropperModal(true);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-xs text-text-light file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-accent cursor-pointer w-full" 
                    />
                  </div>
                </div>
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
        </div>,
        document.body
      )}

      {/* 6. Success Story Image Chooser & Canvas Cropper Modal */}
      {showCropperModal && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[10000] flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowCropperModal(false)}>
          <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl overflow-hidden text-left relative flex flex-col max-h-[90vh] my-auto animate-fade-in" onClick={(e) => e.stopPropagation()}>
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

            {/* Tab Body */}
            <div className="p-6 flex-1 overflow-y-auto min-h-[300px]">
              {cropperTab === 'upload' && !cropperSource && (
                <div className="border-2 border-dashed border-border-gray rounded-xl p-8 text-center bg-soft-light flex flex-col items-center justify-center gap-3">
                  <span className="text-3xl">📷</span>
                  <p className="text-xs font-bold text-primary">Upload Photo for Cropping</p>
                  <p className="text-[11px] text-text-light">Select a high-resolution image file from your computer.</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleLocalFileSelect} 
                    className="hidden" 
                    id="cropper-file-input" 
                  />
                  <label 
                    htmlFor="cropper-file-input" 
                    className="mt-2 bg-primary hover:bg-accent hover:text-primary text-white font-bold py-2.5 px-5 rounded-lg text-xs cursor-pointer transition-all shadow-md"
                  >
                    Select Local File
                  </label>
                </div>
              )}

              {cropperTab === 'gallery' && !cropperSource && (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-primary mb-2">Select an image from existing Gallery Events:</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[350px] overflow-y-auto pr-1">
                    {galleryItems.filter(item => item.coverMedia || (item.photos && item.photos.length > 0)).map((item, idx) => {
                      const imageSrc = item.coverMedia ? (item.coverMedia.startsWith('http') ? item.coverMedia : `http://localhost:5000${item.coverMedia}`) : `http://localhost:5000${item.photos[0]?.path}`;
                      return (
                        <div 
                          key={idx} 
                          onClick={() => setCropperSource(imageSrc)} 
                          className="aspect-[4/3] rounded-lg overflow-hidden border border-border-gray hover:border-primary cursor-pointer relative group bg-slate-100 shadow-xs"
                        >
                          <img src={imageSrc} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white bg-primary px-2 py-1 rounded">Select</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {cropperSource && (
                <div className="space-y-4">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <p className="text-xs font-bold text-primary">Drag image to position & scroll mouse wheel or slider to zoom:</p>
                    <div className="flex items-center gap-1.5 bg-soft-light px-3 py-1.5 rounded-lg border border-border-gray">
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded bg-primary text-white shadow-xs tracking-wide">
                        {(croppingTarget === 'story' || croppingTarget === 'facility' || croppingTarget === 'edge') && '4:3 Landscape'}
                        {croppingTarget === 'student' && '1:1 Square'}
                        {(croppingTarget === 'coach' || croppingTarget === 'team') && '3:4 Portrait'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Canvas Container with Mouse Wheel Zoom */}
                  <div 
                    ref={cropperBoxRef}
                    className={`w-full mx-auto bg-slate-950 rounded-xl overflow-hidden relative cursor-grab active:cursor-grabbing border-2 border-primary shadow-inner select-none ${
                      croppingTarget === 'student' ? 'max-w-[360px] aspect-[1/1]' :
                      (croppingTarget === 'story' || croppingTarget === 'facility' || croppingTarget === 'edge') ? 'max-w-[440px] aspect-[4/3]' :
                      'max-w-[340px] aspect-[3/4]'
                    }`}
                    onWheel={(e) => {
                      e.preventDefault();
                      const delta = e.deltaY < 0 ? 0.05 : -0.05;
                      setCropZoom(prev => Math.min(Math.max(parseFloat((prev + delta).toFixed(2)), 0.4), 3.5));
                    }}
                    onMouseDown={(e) => {
                      setIsDragMoving(true);
                      setDragStartPoint({ x: e.clientX, y: e.clientY });
                      setDragInitialOffset({ ...cropPosition });
                    }}
                    onMouseMove={(e) => {
                      if (!isDragMoving) return;
                      const dx = e.clientX - dragStartPoint.x;
                      const dy = e.clientY - dragStartPoint.y;
                      setCropPosition({
                        x: dragInitialOffset.x + dx,
                        y: dragInitialOffset.y + dy
                      });
                    }}
                    onMouseUp={() => setIsDragMoving(false)}
                    onMouseLeave={() => setIsDragMoving(false)}
                  >
                    <img 
                      src={cropperSource} 
                      alt="Cropper Target" 
                      style={{
                        transform: `translate(${cropPosition.x}px, ${cropPosition.y}px) scale(${cropZoom})`,
                        transformOrigin: 'center center',
                        maxWidth: 'none',
                        maxHeight: 'none',
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                      className="pointer-events-none transition-transform duration-75"
                    />
                    
                    {/* Grid Overlay Guide */}
                    <div className="absolute inset-0 border border-white/20 pointer-events-none grid grid-cols-3 grid-rows-3">
                      <div className="border-r border-b border-white/20"></div>
                      <div className="border-r border-b border-white/20"></div>
                      <div className="border-b border-white/20"></div>
                      <div className="border-r border-b border-white/20"></div>
                      <div className="border-r border-b border-white/20"></div>
                      <div className="border-b border-white/20"></div>
                      <div className="border-r border-white/20"></div>
                      <div className="border-r border-white/20"></div>
                      <div></div>
                    </div>
                  </div>

                  {/* Zoom Controls & Quick Fit / Reset Buttons */}
                  <div className={`flex flex-wrap items-center gap-3 mx-auto bg-soft-light p-3 rounded-lg border border-border-gray ${
                    croppingTarget === 'student' ? 'max-w-[360px]' :
                    (croppingTarget === 'story' || croppingTarget === 'facility' || croppingTarget === 'edge') ? 'max-w-[440px]' :
                    'max-w-[340px]'
                  }`}>
                    <span className="text-xs font-bold text-primary min-w-[45px]">Zoom:</span>
                    <input 
                      type="range" 
                      min="0.4" 
                      max="3.5" 
                      step="0.02" 
                      value={cropZoom} 
                      onChange={(e) => setCropZoom(parseFloat(e.target.value))} 
                      className="flex-1 accent-primary cursor-pointer"
                    />
                    <span className="text-xs font-bold text-text-light w-12 text-right">{Math.round(cropZoom * 100)}%</span>
                    <button
                      type="button"
                      onClick={() => { setCropZoom(0.7); setCropPosition({ x: 0, y: 0 }); }}
                      className="text-[10px] font-bold text-primary bg-white border border-border-gray hover:bg-slate-100 px-2 py-1 rounded cursor-pointer transition-colors"
                      title="Zoom out to show complete photo without cutting edges"
                    >
                      Fit Whole
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCropZoom(1); setCropPosition({ x: 0, y: 0 }); }}
                      className="text-[10px] font-bold text-primary bg-white border border-border-gray hover:bg-slate-100 px-2 py-1 rounded cursor-pointer transition-colors"
                      title="Reset position and zoom"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-border-gray bg-soft-light flex justify-end gap-3 shrink-0">
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
        </div>,
        document.body
      )}

      {/* ADD / EDIT FACILITY MODAL */}
      {activeModal === 'facility' && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-3 sm:p-5 animate-fade-in overflow-hidden" onClick={() => setActiveModal(null)}>
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-5 sm:p-6 text-left relative max-h-[90vh] flex flex-col my-auto animate-fade-in overflow-hidden border border-slate-100" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-text-light hover:text-primary cursor-pointer border-none bg-transparent z-10" onClick={() => setActiveModal(null)}><X size={20} /></button>
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2 shrink-0 border-b border-border-gray pb-2">
              <Buildings size={20} className="text-accent" /> {editingFacility ? 'Edit Facility Card' : 'Add New Facility Card'}
            </h3>
            <form onSubmit={handleSaveFacility} className="flex-1 overflow-y-auto space-y-4 pr-1 py-1 hide-scrollbar">
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Facility Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Gym & Fitness Center"
                  value={facilityForm.title} 
                  onChange={(e) => setFacilityForm({ ...facilityForm, title: e.target.value })}
                  className="w-full py-2.5 px-3 border border-border-gray rounded-lg bg-soft-light text-xs text-primary placeholder-slate-400 outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Tag Badge *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Advanced Gear"
                    value={facilityForm.tag} 
                    onChange={(e) => setFacilityForm({ ...facilityForm, tag: e.target.value })}
                    className="w-full py-2.5 px-3 border border-border-gray rounded-lg bg-soft-light text-xs text-primary placeholder-slate-400 outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Sort Order</label>
                  <input 
                    type="number" 
                    placeholder="1, 2, 3..."
                    value={facilityForm.order} 
                    onChange={(e) => setFacilityForm({ ...facilityForm, order: parseInt(e.target.value) || 0 })}
                    className="w-full py-2.5 px-3 border border-border-gray rounded-lg bg-soft-light text-xs text-primary outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Card Image URL / Upload</label>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="/images/gym_card.png or http://..."
                    value={facilityForm.image} 
                    onChange={(e) => setFacilityForm({ ...facilityForm, image: e.target.value })}
                    className="w-full py-2 px-3 border border-border-gray rounded-lg bg-soft-light text-xs text-primary outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                  />
                  <div className="flex items-center gap-3">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            if (evt.target?.result) {
                              setCropperSource(evt.target.result as string);
                              setCroppingTarget('facility');
                              setCropZoom(1);
                              setCropPosition({ x: 0, y: 0 });
                              setShowCropperModal(true);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-accent cursor-pointer"
                    />
                  </div>
                </div>
                {facilityForm.image && (
                  <div className="mt-2.5 h-28 rounded-lg overflow-hidden border border-border-gray relative bg-slate-100">
                    <img 
                      src={facilityForm.image.startsWith('http') || facilityForm.image.startsWith('data:') || facilityForm.image.startsWith('/images') || facilityForm.image.startsWith('/uploads') ? facilityForm.image : `http://localhost:5000${facilityForm.image}`} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Description *</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Facility features and details description..."
                  value={facilityForm.description} 
                  onChange={(e) => setFacilityForm({ ...facilityForm, description: e.target.value })}
                  className="w-full py-2.5 px-3 border border-border-gray rounded-lg bg-soft-light text-xs text-primary outline-none focus:border-primary focus:bg-white transition-all font-semibold resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Visibility Status</label>
                <select
                  value={facilityForm.status}
                  onChange={(e) => setFacilityForm({ ...facilityForm, status: e.target.value })}
                  className="w-full py-2.5 px-3 border border-border-gray rounded-lg bg-soft-light text-xs text-primary outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                >
                  <option value="Active">Active (Visible on Website)</option>
                  <option value="Hidden">Hidden (Draft / Archived)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="py-2.5 px-4 rounded-lg border border-border-gray text-xs font-bold text-text-light hover:bg-slate-100 cursor-pointer bg-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-primary hover:bg-accent hover:text-primary text-white font-bold py-2.5 px-5 rounded-lg transition-all cursor-pointer text-xs uppercase tracking-wider border-none shadow-md"
                >
                  {editingFacility ? 'Update Card' : 'Save Facility Card'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* 0. RLBSA Edge Card Modal */}
      {activeModal === 'edge-card' && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-3 sm:p-5 animate-fade-in overflow-hidden" onClick={() => setActiveModal(null)}>
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-5 sm:p-6 text-left relative max-h-[90vh] flex flex-col my-auto animate-fade-in overflow-hidden border border-slate-100" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-text-light hover:text-primary cursor-pointer border-none bg-transparent z-10" onClick={() => setActiveModal(null)}><X size={20} /></button>
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2 shrink-0 border-b border-border-gray pb-2">
              <Trophy size={20} className="text-accent" /> {editingEdgeCard ? 'Edit RLBSA Edge Card' : 'Add New RLBSA Edge Card'}
            </h3>
            <form onSubmit={handleSaveEdgeCard} className="flex-1 overflow-y-auto space-y-4 pr-1 py-1 hide-scrollbar">
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Card Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. World-Class Infrastructure"
                  value={edgeCardForm.title} 
                  onChange={(e) => setEdgeCardForm({ ...edgeCardForm, title: e.target.value })}
                  className="w-full py-2.5 px-3 border border-border-gray rounded-lg bg-soft-light text-xs text-primary placeholder-slate-400 outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Tag / Category Badge *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. EXCELLENCE"
                    value={edgeCardForm.tag} 
                    onChange={(e) => setEdgeCardForm({ ...edgeCardForm, tag: e.target.value })}
                    className="w-full py-2.5 px-3 border border-border-gray rounded-lg bg-soft-light text-xs text-primary placeholder-slate-400 outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Sort Order</label>
                  <input 
                    type="number" 
                    placeholder="1, 2, 3..."
                    value={edgeCardForm.order} 
                    onChange={(e) => setEdgeCardForm({ ...edgeCardForm, order: parseInt(e.target.value) || 0 })}
                    className="w-full py-2.5 px-3 border border-border-gray rounded-lg bg-soft-light text-xs text-primary outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Button Link Target</label>
                  <input 
                    type="text" 
                    placeholder="e.g. /facilities or /about"
                    value={edgeCardForm.link} 
                    onChange={(e) => setEdgeCardForm({ ...edgeCardForm, link: e.target.value })}
                    className="w-full py-2.5 px-3 border border-border-gray rounded-lg bg-soft-light text-xs text-primary outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Button Label Text</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Explore Facilities"
                    value={edgeCardForm.linkText} 
                    onChange={(e) => setEdgeCardForm({ ...edgeCardForm, linkText: e.target.value })}
                    className="w-full py-2.5 px-3 border border-border-gray rounded-lg bg-soft-light text-xs text-primary outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Card Image URL / Upload</label>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="/images/sports_training_card.jpg or http://..."
                    value={edgeCardForm.image} 
                    onChange={(e) => setEdgeCardForm({ ...edgeCardForm, image: e.target.value })}
                    className="w-full py-2 px-3 border border-border-gray rounded-lg bg-soft-light text-xs text-primary outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                  />
                  <div className="flex items-center gap-3">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            if (evt.target?.result) {
                              setCropperSource(evt.target.result as string);
                              setCroppingTarget('edge');
                              setCropZoom(1);
                              setCropPosition({ x: 0, y: 0 });
                              setShowCropperModal(true);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-accent cursor-pointer"
                    />
                  </div>
                </div>
                {edgeCardForm.image && (
                  <div className="mt-2.5 h-28 rounded-lg overflow-hidden border border-border-gray relative bg-slate-100">
                    <img 
                      src={edgeCardForm.image.startsWith('http') || edgeCardForm.image.startsWith('data:') || edgeCardForm.image.startsWith('/images') || edgeCardForm.image.startsWith('/uploads') ? edgeCardForm.image : `http://localhost:5000${edgeCardForm.image}`} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Description *</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Card features and details description..."
                  value={edgeCardForm.description} 
                  onChange={(e) => setEdgeCardForm({ ...edgeCardForm, description: e.target.value })}
                  className="w-full py-2.5 px-3 border border-border-gray rounded-lg bg-soft-light text-xs text-primary outline-none focus:border-primary focus:bg-white transition-all font-semibold resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Visibility Status</label>
                  <select
                    value={edgeCardForm.status}
                    onChange={(e) => setEdgeCardForm({ ...edgeCardForm, status: e.target.value })}
                    className="w-full py-2.5 px-3 border border-border-gray rounded-lg bg-soft-light text-xs text-primary outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                  >
                    <option value="Active">Active (Visible on Website)</option>
                    <option value="Hidden">Hidden (Draft / Archived)</option>
                  </select>
                </div>
                <div className="pt-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-primary cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={edgeCardForm.isFeatured}
                      onChange={(e) => setEdgeCardForm({ ...edgeCardForm, isFeatured: e.target.checked })}
                      className="w-4 h-4 text-accent rounded border-border-gray focus:ring-accent"
                    />
                    <span>Set as Featured (Main Hero Card)</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="py-2.5 px-4 rounded-lg border border-border-gray text-xs font-bold text-text-light hover:bg-slate-100 cursor-pointer bg-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-primary hover:bg-accent hover:text-primary text-white font-bold py-2.5 px-5 rounded-lg transition-all cursor-pointer text-xs uppercase tracking-wider border-none shadow-md"
                >
                  {editingEdgeCard ? 'Update Card' : 'Save Edge Card'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* QUICK ACTION MODALS LAYOUT */}
      
      {/* 1. Add/Edit Student Modal */}
      {(activeModal === 'student-create' || activeModal === 'student-edit') && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-3 sm:p-5 animate-fade-in overflow-hidden" onClick={resetStudentForm}>
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-4 sm:p-6 text-left relative animate-fade-in max-h-[90vh] flex flex-col my-auto border border-slate-100 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-text-light hover:text-primary cursor-pointer border-none bg-transparent z-10" onClick={resetStudentForm}><X size={20} /></button>
            <h3 className="text-base font-bold text-primary mb-2.5 flex items-center gap-2 shrink-0 border-b border-border-gray pb-2">
              <UserPlus size={20} className="text-accent" /> {activeModal === 'student-edit' ? 'Edit Student Record' : 'Register New Student'}
            </h3>
            
            {/* Modal Tabs Header */}
            <div className="flex border-b border-border-gray shrink-0 bg-white mb-3 overflow-x-auto hide-scrollbar gap-1">
              {['personal', 'guardian', 'academy', 'education', 'achievements', 'documents'].map((tab) => (
                <button 
                  key={tab}
                  type="button"
                  onClick={() => setActiveStudentFormTab(tab)}
                  className={`py-2 px-4 text-xs font-bold border-none cursor-pointer transition-all capitalize whitespace-nowrap rounded-t-lg ${
                    activeStudentFormTab === tab 
                      ? 'text-primary border-b-2 border-b-primary bg-slate-100' 
                      : 'text-text-light hover:text-primary bg-transparent'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveStudent} className="flex-1 flex flex-col min-h-0 overflow-x-hidden">
              <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar space-y-3 py-1">
                
                {/* Tab 1: Personal Details */}
                {activeStudentFormTab === 'personal' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="flex flex-col gap-1 sm:col-span-2">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Full Name *</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="E.g. Puja Kumari" 
                          value={studentForm.fullName} 
                          onChange={(e) => setStudentForm({...studentForm, fullName: e.target.value})} 
                          className="w-full py-2.5 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Date of Birth *</label>
                        <input 
                          required 
                          type="date" 
                          value={studentForm.dob} 
                          onChange={(e) => setStudentForm({...studentForm, dob: e.target.value})} 
                          className="w-full py-2.5 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Gender *</label>
                        <select 
                          value={studentForm.gender} 
                          onChange={(e) => setStudentForm({...studentForm, gender: e.target.value})} 
                          className="w-full py-2.5 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold"
                        >
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Blood Group</label>
                        <input 
                          type="text" 
                          placeholder="E.g. O+ or A+" 
                          value={studentForm.bloodGroup} 
                          onChange={(e) => setStudentForm({...studentForm, bloodGroup: e.target.value})} 
                          className="w-full py-2.5 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Student Contact Phone</label>
                        <input 
                          type="tel" 
                          placeholder="E.g. +91 98765 43210" 
                          value={studentForm.studentPhone} 
                          onChange={(e) => setStudentForm({...studentForm, studentPhone: e.target.value})} 
                          className="w-full py-2.5 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                        />
                      </div>
                      <div className="flex flex-col gap-1 sm:col-span-2">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Student Email</label>
                        <input 
                          type="email" 
                          placeholder="E.g. puja@gmail.com" 
                          value={studentForm.studentEmail} 
                          onChange={(e) => setStudentForm({...studentForm, studentEmail: e.target.value})} 
                          className="w-full py-2.5 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                        />
                      </div>
                      <div className="flex flex-col gap-1 sm:col-span-2">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Residential Address</label>
                        <input 
                          type="text"
                          placeholder="Street, District, State, Pincode" 
                          value={studentForm.address} 
                          onChange={(e) => setStudentForm({...studentForm, address: e.target.value})} 
                          className="w-full py-2.5 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                        />
                      </div>
                      <div className="flex flex-col gap-1 sm:col-span-2">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Student Profile Photo (1:1 Square Ratio)</label>
                        <div className="p-3 border border-border-gray rounded-xl bg-soft-light flex items-center gap-3">
                          {studentPhotoPreview ? (
                            <img src={studentPhotoPreview} alt="Preview" className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-primary shadow-xs" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-slate-500 text-lg font-bold border border-slate-300">🎓</div>
                          )}
                          <div className="flex-1">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (evt) => {
                                    if (evt.target?.result) {
                                      setCropperSource(evt.target.result as string);
                                      setCroppingTarget('student');
                                      setCropZoom(1);
                                      setCropPosition({ x: 0, y: 0 });
                                      setShowCropperModal(true);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="text-xs text-text-light file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-accent cursor-pointer w-full" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Guardian Details */}
                {activeStudentFormTab === 'guardian' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Father's Name *</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="Father's full name" 
                          value={studentForm.fatherName} 
                          onChange={(e) => setStudentForm({...studentForm, fatherName: e.target.value})} 
                          className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Mother's Name *</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="Mother's full name" 
                          value={studentForm.motherName} 
                          onChange={(e) => setStudentForm({...studentForm, motherName: e.target.value})} 
                          className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Primary Guardian Contact *</label>
                        <input 
                          required 
                          type="tel" 
                          placeholder="E.g. +91 98765 43210" 
                          value={studentForm.guardianPhone} 
                          onChange={(e) => setStudentForm({...studentForm, guardianPhone: e.target.value})} 
                          className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Emergency Contact Phone *</label>
                        <input 
                          required 
                          type="tel" 
                          placeholder="Secondary emergency number" 
                          value={studentForm.emergencyContact} 
                          onChange={(e) => setStudentForm({...studentForm, emergencyContact: e.target.value})} 
                          className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Guardian Occupation</label>
                        <input 
                          type="text" 
                          placeholder="E.g. Government Service / Business" 
                          value={studentForm.guardianOccupation} 
                          onChange={(e) => setStudentForm({...studentForm, guardianOccupation: e.target.value})} 
                          className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Guardian Email</label>
                        <input 
                          type="email" 
                          placeholder="Guardian's email" 
                          value={studentForm.guardianEmail} 
                          onChange={(e) => setStudentForm({...studentForm, guardianEmail: e.target.value})} 
                          className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                        />
                      </div>
                      <div className="flex flex-col gap-1 sm:col-span-2">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Guardian Residential Address</label>
                        <input 
                          type="text" 
                          placeholder="Leave blank if same as student address" 
                          value={studentForm.guardianAddress} 
                          onChange={(e) => setStudentForm({...studentForm, guardianAddress: e.target.value})} 
                          className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Academy Details */}
                {activeStudentFormTab === 'academy' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Secondary Sports</label>
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
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Hostel Room (if Resident)</label>
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                      <div className="flex flex-col gap-1 sm:col-span-2">
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
                  </div>
                )}

                {/* Tab 4: Education Details */}
                {activeStudentFormTab === 'education' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="flex flex-col gap-1 sm:col-span-2">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider">School / College Name</label>
                        <input 
                          type="text" 
                          placeholder="E.g. St. Xavier's School" 
                          value={studentForm.schoolName} 
                          onChange={(e) => setStudentForm({...studentForm, schoolName: e.target.value})} 
                          className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Current Class / Standard</label>
                        <input 
                          type="text" 
                          placeholder="E.g. Class 9th B" 
                          value={studentForm.classStandard} 
                          onChange={(e) => setStudentForm({...studentForm, classStandard: e.target.value})} 
                          className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Academic Roll / ID</label>
                        <input 
                          type="text" 
                          placeholder="School Roll Number" 
                          value={studentForm.rollNo} 
                          onChange={(e) => setStudentForm({...studentForm, rollNo: e.target.value})} 
                          className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="flex flex-col gap-1 sm:col-span-2">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Aadhaar Card / Govt Identity Number</label>
                        <input 
                          type="text" 
                          placeholder="12-Digit Aadhaar Card Number" 
                          value={studentForm.aadhaarNo} 
                          onChange={(e) => setStudentForm({...studentForm, aadhaarNo: e.target.value})} 
                          className="w-full py-2 px-3 border border-border-gray rounded text-xs bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 5: Achievements */}
                {activeStudentFormTab === 'achievements' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded border border-border-gray">
                      <div>
                        <h4 className="text-xs font-bold text-primary">Sports Achievements & Medals</h4>
                        <p className="text-[10px] text-text-light">Add medals, tournaments, and representation details</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          const list = [...studentForm.achievements, { title: '', competition: '', position: 'Gold', year: new Date().getFullYear(), description: '' }];
                          setStudentForm({ ...studentForm, achievements: list });
                        }}
                        className="bg-primary hover:bg-accent hover:text-primary text-white text-xs font-bold py-1.5 px-3 rounded cursor-pointer transition-all border-none"
                      >
                        + Add Row
                      </button>
                    </div>

                    {studentForm.achievements.length === 0 ? (
                      <div className="text-center py-5 text-text-light italic text-xs">
                        No achievements recorded for this student yet. Click "+ Add Row" to append achievements.
                      </div>
                    ) : (
                      <div className="space-y-3 pr-1">
                        {studentForm.achievements.map((ach: any, idx: number) => (
                          <div key={idx} className="p-2.5 border border-border-gray rounded-lg bg-soft-light space-y-2 relative">
                            <button 
                              type="button" 
                              onClick={() => {
                                const list = studentForm.achievements.filter((_: any, i: number) => i !== idx);
                                setStudentForm({ ...studentForm, achievements: list });
                              }}
                              className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 bg-transparent border-none p-1 cursor-pointer"
                              title="Remove Row"
                            >
                              <Trash size={14} />
                            </button>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pr-6">
                              <input 
                                type="text" 
                                placeholder="Achievement Title" 
                                value={ach.title} 
                                onChange={(e) => {
                                  const list = [...studentForm.achievements];
                                  list[idx].title = e.target.value;
                                  setStudentForm({ ...studentForm, achievements: list });
                                }}
                                className="py-1.5 px-2 border border-border-gray rounded text-xs bg-white outline-none" 
                              />
                              <input 
                                type="text" 
                                required 
                                placeholder="Tournament/Competition" 
                                value={ach.competition} 
                                onChange={(e) => {
                                  const list = [...studentForm.achievements];
                                  list[idx].competition = e.target.value;
                                  setStudentForm({ ...studentForm, achievements: list });
                                }}
                                className="py-1.5 px-2 border border-border-gray rounded text-xs bg-white outline-none" 
                              />
                              <input 
                                type="text" 
                                placeholder="Position (Winner)" 
                                value={ach.position} 
                                onChange={(e) => {
                                  const list = [...studentForm.achievements];
                                  list[idx].position = e.target.value;
                                  setStudentForm({ ...studentForm, achievements: list });
                                }}
                                className="py-1.5 px-2 border border-border-gray rounded text-xs bg-white outline-none" 
                              />
                              <input 
                                type="number" 
                                required 
                                placeholder="Year (2026)" 
                                value={ach.year} 
                                onChange={(e) => {
                                  const list = [...studentForm.achievements];
                                  list[idx].year = parseInt(e.target.value) || new Date().getFullYear();
                                  setStudentForm({ ...studentForm, achievements: list });
                                }}
                                className="py-1.5 px-2 border border-border-gray rounded text-xs bg-white outline-none" 
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
                                className="py-1.5 px-2 border border-border-gray rounded text-xs bg-white outline-none" 
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
                  <div className="space-y-3 animate-fade-in text-xs font-semibold">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Upload Verification Documents */}
                      <div className="p-3 border border-border-gray rounded-xl bg-soft-light space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="block text-xs font-bold text-primary">Upload Verification Documents</span>
                            <span className="block text-[10px] text-text-light font-semibold mt-0.5">Aadhaar scan, Birth Cert, Medical Form</span>
                          </div>
                          <label className="py-1 px-3 bg-primary text-white hover:bg-accent hover:text-primary transition-all rounded text-xs font-bold cursor-pointer shrink-0">
                            + Add File
                            <input 
                              type="file" 
                              multiple
                              accept=".pdf,image/*"
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                const newDocs = files.map(f => ({ name: f.name.replace(/\.[^/.]+$/, ""), file: f }));
                                setStudentDocFiles([...studentDocFiles, ...newDocs]);
                              }}
                              className="hidden" 
                            />
                          </label>
                        </div>

                        {studentDocFiles.length > 0 && (
                          <div className="space-y-1.5 pt-1.5 border-t border-border-gray">
                            {studentDocFiles.map((doc, idx) => (
                              <div key={idx} className="flex items-center justify-between gap-2 p-1.5 bg-white rounded border border-border-gray">
                                <input 
                                  type="text" 
                                  value={doc.name} 
                                  onChange={(e) => {
                                    const list = [...studentDocFiles];
                                    list[idx].name = e.target.value;
                                    setStudentDocFiles(list);
                                  }}
                                  className="py-1 px-2 border border-border-gray rounded text-xs flex-1" 
                                />
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
                          <div className="space-y-1 pt-1.5 border-t border-dashed border-border-gray">
                            <span className="block text-[10px] text-primary uppercase font-bold">Existing Secure Documents:</span>
                            {editingStudentProfile.documents.map((doc: any, idx: number) => {
                              const isRemoved = deletedDocuments.includes(doc.path);
                              return (
                                <div key={idx} className={`flex items-center justify-between p-1.5 rounded border border-border-gray ${isRemoved ? 'bg-rose-50 border-rose-100 opacity-60' : 'bg-white'}`}>
                                  <span className="text-xs font-semibold text-primary truncate max-w-[200px]">{doc.name}</span>
                                  {!isRemoved ? (
                                    <button 
                                      type="button" 
                                      onClick={() => setDeletedDocuments([...deletedDocuments, doc.path])}
                                      className="text-rose-500 hover:text-rose-700 bg-transparent border-none p-1 cursor-pointer font-bold text-xs"
                                    >
                                      Remove
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

                      {/* Settings Column */}
                      <div className="space-y-3">
                        {/* Public Visibility Toggle */}
                        <div className="p-3 border border-border-gray rounded-xl bg-soft-light flex justify-between items-center">
                          <div>
                            <span className="block text-xs font-bold text-primary">Show Profile on Public Website</span>
                            <span className="block text-[10px] text-text-light font-semibold mt-0.5">Full Name, Sport, Medals count, Photo</span>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={studentForm.showOnPublicWebsite} 
                            onChange={(e) => setStudentForm({ ...studentForm, showOnPublicWebsite: e.target.checked })}
                            className="w-5 h-5 text-primary border-border-gray rounded focus:ring-primary cursor-pointer shrink-0" 
                          />
                        </div>

                        {activeModal === 'student-edit' && (
                          <div className="p-3 border border-border-gray rounded-xl bg-soft-light flex justify-between items-center">
                            <div>
                              <span className="block text-xs font-bold text-primary">Student Roster Status</span>
                              <span className="block text-[10px] text-text-light font-semibold mt-0.5">Toggle student's state</span>
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
                    </div>
                  </div>
                )}
              </div>

              {/* Form submit footer - ALWAYS fixed at bottom of modal card */}
              <div className="pt-3 mt-2 border-t border-border-gray flex justify-between items-center shrink-0 bg-white overflow-x-hidden">
                <div className="flex gap-2 items-center">
                  <button 
                    type="button" 
                    onClick={resetStudentForm} 
                    className="bg-white hover:bg-slate-50 border border-border-gray text-primary font-bold py-2 px-4 rounded-lg transition-all text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setStudentForm((prev: any) => ({
                        ...prev,
                        bloodGroup: prev.bloodGroup?.trim() ? prev.bloodGroup : 'NA',
                        phone: prev.phone?.trim() ? prev.phone : (prev.studentPhone?.trim() ? prev.studentPhone : 'NA'),
                        studentPhone: prev.studentPhone?.trim() ? prev.studentPhone : 'NA',
                        email: prev.email?.trim() ? prev.email : (prev.studentEmail?.trim() ? prev.studentEmail : 'NA'),
                        studentEmail: prev.studentEmail?.trim() ? prev.studentEmail : 'NA',
                        address: prev.address?.trim() ? prev.address : 'NA',
                        guardianName: prev.guardianName?.trim() ? prev.guardianName : (prev.fatherName?.trim() ? prev.fatherName : 'NA'),
                        fatherName: prev.fatherName?.trim() ? prev.fatherName : 'NA',
                        motherName: prev.motherName?.trim() ? prev.motherName : 'NA',
                        guardianRelationship: prev.guardianRelationship?.trim() ? prev.guardianRelationship : 'NA',
                        guardianPhone: prev.guardianPhone?.trim() ? prev.guardianPhone : 'NA',
                        guardianEmergency: prev.guardianEmergency?.trim() ? prev.guardianEmergency : (prev.emergencyContact?.trim() ? prev.emergencyContact : 'NA'),
                        emergencyContact: prev.emergencyContact?.trim() ? prev.emergencyContact : 'NA',
                        guardianAddress: prev.guardianAddress?.trim() ? prev.guardianAddress : 'NA',
                        batch: prev.batch?.trim() ? prev.batch : 'NA',
                        coach: prev.coach?.trim() ? prev.coach : 'NA',
                        hostelRoom: prev.hostelRoom?.trim() ? prev.hostelRoom : 'NA',
                        schoolName: prev.schoolName?.trim() ? prev.schoolName : 'NA',
                        className: prev.className?.trim() ? prev.className : (prev.classStandard?.trim() ? prev.classStandard : 'NA'),
                        classStandard: prev.classStandard?.trim() ? prev.classStandard : 'NA',
                        academicInfo: prev.academicInfo?.trim() ? prev.academicInfo : 'NA',
                      }));
                    }}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold py-2 px-3 rounded-lg transition-all text-xs cursor-pointer"
                    title="Fill all empty/unfilled form fields with NA"
                  >
                    Auto-fill NA
                  </button>
                </div>
                <div className="flex gap-2">
                  {activeStudentFormTab !== 'personal' && (
                    <button 
                      type="button" 
                      onClick={() => {
                        const tabs = ['personal', 'guardian', 'academy', 'education', 'achievements', 'documents'];
                        const idx = tabs.indexOf(activeStudentFormTab);
                        if (idx > 0) setActiveStudentFormTab(tabs[idx - 1]);
                      }}
                      className="bg-slate-100 hover:bg-slate-200 border border-border-gray text-slate-700 font-bold py-2 px-4 rounded-lg transition-all text-xs cursor-pointer"
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
                      className="bg-primary hover:bg-accent hover:text-primary text-white font-bold py-2 px-5 rounded-lg transition-all text-xs cursor-pointer border-none shadow-md"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      disabled={isUploading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-5 rounded-lg transition-all text-xs cursor-pointer border-none shadow-md"
                    >
                      {isUploading ? 'Saving...' : 'Save Record'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Detailed Student Profile Viewer Modal */}
      {viewingStudentProfile !== null && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-3 sm:p-5 animate-fade-in overflow-hidden" onClick={() => { setViewingStudentProfile(null); setActiveProfileViewTab('overview'); }}>
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl p-5 sm:p-6 text-left relative animate-fade-in max-h-[90vh] flex flex-col my-auto overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-text-light hover:text-primary cursor-pointer border-none bg-transparent animate-fade-in z-10" onClick={() => { setViewingStudentProfile(null); setActiveProfileViewTab('overview'); }}><X size={20} /></button>
            
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
        </div>,
        document.body
      )}

      {/* 2. Add Coach Modal */}
      {activeModal === 'coach' && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-3 sm:p-5 animate-fade-in overflow-hidden" onClick={closeCoachModal}>
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-5 sm:p-6 text-left relative max-h-[90vh] flex flex-col my-auto animate-fade-in overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-text-light hover:text-primary cursor-pointer border-none bg-transparent z-10" onClick={closeCoachModal}><X size={20} /></button>
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2 shrink-0 border-b border-border-gray pb-2">
              {editingCoach ? <Pencil size={20} className="text-accent" /> : <Plus size={20} className="text-accent" />}
              {editingCoach ? 'Edit Coach Profile' : 'Add Coach'}
            </h3>
            <form onSubmit={handleAddCoach} className="flex-1 overflow-y-auto flex flex-col gap-3.5 pr-1 py-1 hide-scrollbar">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Full Name *</label>
                <input required type="text" placeholder="E.g. Coach Sarita" value={coachForm.name} onChange={(e) => setCoachForm({...coachForm, name: e.target.value})} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Role Title *</label>
                <input required type="text" placeholder="E.g. Head Athletics Coach" value={coachForm.role} onChange={(e) => setCoachForm({...coachForm, role: e.target.value})} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Experience (Years) *</label>
                  <input required type="number" min="0" max="50" placeholder="E.g. 4" value={coachForm.experienceYears} onChange={(e) => setCoachForm({...coachForm, experienceYears: e.target.value})} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Experience (Months) *</label>
                  <input required type="number" min="0" max="11" placeholder="E.g. 6" value={coachForm.experienceMonths} onChange={(e) => setCoachForm({...coachForm, experienceMonths: e.target.value})} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Certification Status *</label>
                <input required type="text" placeholder="E.g. SAI Certified / Elite License" value={coachForm.certificationStatus} onChange={(e) => setCoachForm({...coachForm, certificationStatus: e.target.value})} className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Profile Photo (Aspect Ratio 3:4) *</label>
                {coachForm.avatar && (coachForm.avatar.startsWith('http') || coachForm.avatar.startsWith('/') || coachForm.avatar.startsWith('data:')) ? (
                  <div className="flex items-center gap-4 p-3 bg-soft-light border border-border-gray rounded-xl">
                    <img 
                      src={coachForm.avatar} 
                      alt="Cropped Coach" 
                      className="w-16 aspect-[3/4] object-cover rounded-lg border border-border-gray shadow-xs" 
                    />
                    <div className="text-left">
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded uppercase">Image Ready (3:4)</span>
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
                        Change / Adjust Photo
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
                    <span className="text-xs font-bold text-text-light group-hover:text-primary transition-colors">Choose & Crop Photo (3:4)</span>
                  </button>
                )}
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-accent hover:text-primary transition-all text-white font-bold py-3 mt-2 rounded-lg cursor-pointer text-sm shadow-md">
                {editingCoach ? 'Update Profile' : 'Save Record'}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Quick View Event Photos Modal */}
      {showQuickViewEvent && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-5 animate-fade-in" onClick={() => setShowQuickViewEvent(null)}>
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
                  <img src={photo.path && (photo.path.startsWith('http') || photo.path.startsWith('data:')) ? photo.path : `http://localhost:5000${photo.path}`} alt="" className="w-full h-full object-cover" />
                  {showQuickViewEvent.coverImage === photo.path && (
                    <span className="absolute top-2.5 right-2.5 bg-emerald-500 text-white text-[8px] px-2 py-0.5 rounded font-extrabold shadow-sm uppercase tracking-wider">Cover</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Create Event Modal */}
      {activeModal === 'gallery-create' && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-5 animate-fade-in" onClick={() => { setActiveModal(null); resetEventGalleryForm(); }}>
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
        </div>,
        document.body
      )}

      {/* Edit Event Modal */}
      {activeModal === 'gallery-edit' && editingEventGallery && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-5 animate-fade-in" onClick={() => { setActiveModal(null); resetEventGalleryForm(); }}>
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
                          const photoUrl = photo.path && (photo.path.startsWith('http') || photo.path.startsWith('data:')) ? photo.path : `http://localhost:5000${photo.path}`;
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
        </div>,
        document.body
      )}

      {/* 4a. Add/Edit Event Modal */}
      {activeModal === 'cms-event' && createPortal(
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-[9999] flex items-center justify-center p-5 animate-fade-in" onClick={() => setActiveModal(null)}>
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl p-6 md:p-8 text-left relative animate-scale-up max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-5 right-5 text-text-light hover:text-primary cursor-pointer border-none bg-transparent" onClick={() => setActiveModal(null)}><X size={20} /></button>
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span>📅</span> {editingEvent ? 'Edit Scheduled Event' : 'Schedule New Event'}
            </h3>
            
            <form onSubmit={handleSaveEvent} className="space-y-4 overflow-y-auto pr-1 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Event Title *</label>
                  <input
                    required
                    type="text"
                    placeholder="E.g. Under-17 Girls Football Championship"
                    value={cmsEventForm.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      const slugified = val.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                      setCmsEventForm(prev => ({ ...prev, title: val, slug: slugified }));
                    }}
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">URL Slug (Auto Generated) *</label>
                  <input
                    required
                    type="text"
                    placeholder="u17-girls-championship"
                    value={cmsEventForm.slug}
                    onChange={(e) => setCmsEventForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-mono text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Category *</label>
                  <select
                    value={cmsEventForm.category}
                    onChange={(e) => setCmsEventForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-white outline-none focus:border-primary font-semibold"
                  >
                    <option value="Tournament">Tournament</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Camp">Camp</option>
                    <option value="Trials">Trials</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Short Description (Summary) *</label>
                  <input
                    required
                    maxLength={200}
                    type="text"
                    placeholder="Short summary displayed on cards..."
                    value={cmsEventForm.shortDescription}
                    onChange={(e) => setCmsEventForm(prev => ({ ...prev, shortDescription: e.target.value }))}
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Full Event Details (HTML/Plain Text) *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write detailed event highlights, eligibility rules, agenda..."
                    value={cmsEventForm.content}
                    onChange={(e) => setCmsEventForm(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Start Date *</label>
                  <input
                    required
                    type="date"
                    value={cmsEventForm.startDate}
                    onChange={(e) => setCmsEventForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-white outline-none focus:border-primary font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">End Date (Optional)</label>
                  <input
                    type="date"
                    value={cmsEventForm.endDate}
                    onChange={(e) => setCmsEventForm(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-white outline-none focus:border-primary font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Start Time</label>
                  <input
                    type="text"
                    placeholder="09:00 AM"
                    value={cmsEventForm.startTime}
                    onChange={(e) => setCmsEventForm(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">End Time</label>
                  <input
                    type="text"
                    placeholder="05:00 PM"
                    value={cmsEventForm.endTime}
                    onChange={(e) => setCmsEventForm(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Venue Location *</label>
                  <input
                    required
                    type="text"
                    placeholder="E.g. Main Football Ground, Siwan Campus"
                    value={cmsEventForm.location}
                    onChange={(e) => setCmsEventForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2 border-t border-slate-100 pt-3">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Cover Image Banner</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEventImageChange}
                    className="w-full py-1.5 px-2 border border-border-gray rounded text-xs bg-white cursor-pointer"
                  />
                  {cmsEventForm.coverMedia && (
                    <div className="w-32 h-20 rounded border overflow-hidden mt-1 bg-slate-100">
                      <img src={cmsEventForm.coverMedia.startsWith('data:') ? cmsEventForm.coverMedia : `http://localhost:5000${cmsEventForm.coverMedia}`} alt="cover preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2 border-t border-slate-100 pt-3">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Event Gallery Images (Select Multiple)</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleEventGalleryChange}
                    className="w-full py-1.5 px-2 border border-border-gray rounded text-xs bg-white cursor-pointer"
                  />
                  {cmsEventForm.galleryMedia && cmsEventForm.galleryMedia.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {cmsEventForm.galleryMedia.map((imgUrl, i) => (
                        <div key={i} className="aspect-video rounded border overflow-hidden bg-slate-100 relative group">
                          <img src={imgUrl.startsWith('data:') ? imgUrl : `http://localhost:5000${imgUrl}`} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setCmsEventForm(prev => ({ ...prev, galleryMedia: prev.galleryMedia.filter((_, idx) => idx !== i) }))}
                            className="absolute top-0.5 right-0.5 bg-rose-600 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center text-[9px] cursor-pointer border-none"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 sm:col-span-2 border-t border-slate-100 pt-3">
                  <input
                    type="checkbox"
                    id="evt-reg"
                    checked={cmsEventForm.registrationRequired}
                    onChange={(e) => setCmsEventForm(prev => ({ ...prev, registrationRequired: e.target.checked }))}
                    className="cursor-pointer"
                  />
                  <label htmlFor="evt-reg" className="text-xs font-bold text-primary cursor-pointer select-none">Require Online Registration</label>
                </div>

                {cmsEventForm.registrationRequired && (
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Custom Registration URL (Optional, defaults to internal portal)</label>
                    <input
                      type="text"
                      placeholder="E.g. https://forms.gle/xyz"
                      value={cmsEventForm.registrationUrl}
                      onChange={(e) => setCmsEventForm(prev => ({ ...prev, registrationUrl: e.target.value }))}
                      className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Status *</label>
                  <select
                    value={cmsEventForm.status}
                    onChange={(e) => setCmsEventForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-white outline-none focus:border-primary font-semibold"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Postponed">Postponed</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Visibility *</label>
                  <select
                    value={cmsEventForm.visibility}
                    onChange={(e) => setCmsEventForm(prev => ({ ...prev, visibility: e.target.value }))}
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-white outline-none focus:border-primary font-semibold"
                  >
                    <option value="Public">Public (Displayed on site)</option>
                    <option value="Private">Private (Draft/Access limited)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="evt-feat"
                    checked={cmsEventForm.isFeatured}
                    onChange={(e) => setCmsEventForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="cursor-pointer"
                  />
                  <label htmlFor="evt-feat" className="text-xs font-bold text-primary cursor-pointer select-none">Featured on Home Page</label>
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-gray/50">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="py-2.5 px-5 rounded-lg border border-border-gray bg-white text-primary font-bold text-xs cursor-pointer hover:bg-soft-light"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="py-2.5 px-6 rounded-lg bg-primary hover:bg-accent text-white hover:text-primary transition-all font-bold text-xs cursor-pointer disabled:opacity-60 border-none"
                >
                  {isUploading ? 'Scheduling...' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* 4b. Add/Edit Updates/Announcements Modal */}
      {activeModal === 'cms-update' && createPortal(
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-[9999] flex items-center justify-center p-5 animate-fade-in" onClick={() => setActiveModal(null)}>
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl p-6 md:p-8 text-left relative animate-scale-up max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-5 right-5 text-text-light hover:text-primary cursor-pointer border-none bg-transparent" onClick={() => setActiveModal(null)}><X size={20} /></button>
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span>📰</span> {editingUpdate ? 'Edit News Update' : 'Publish News Announcement'}
            </h3>

            <form onSubmit={handleSaveUpdate} className="space-y-4 overflow-y-auto pr-1 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Announcement Title *</label>
                  <input
                    required
                    type="text"
                    placeholder="E.g. Admission Trials Open for 2026 Batch"
                    value={cmsUpdateForm.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      const slugified = val.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                      setCmsUpdateForm(prev => ({ ...prev, title: val, slug: slugified }));
                    }}
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">URL Slug (Auto Generated) *</label>
                  <input
                    required
                    type="text"
                    placeholder="admission-trials-open-2026"
                    value={cmsUpdateForm.slug}
                    onChange={(e) => setCmsUpdateForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-mono text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Category *</label>
                  <select
                    value={cmsUpdateForm.category}
                    onChange={(e) => setCmsUpdateForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-white outline-none focus:border-primary font-semibold"
                  >
                    <option value="Academy News">Academy News</option>
                    <option value="Announcement">Announcement</option>
                    <option value="Achievement">Achievement</option>
                    <option value="Training Update">Training Update</option>
                    <option value="Admission Update">Admission Update</option>
                    <option value="General Update">General Update</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Brief Summary *</label>
                  <input
                    required
                    maxLength={200}
                    type="text"
                    placeholder="Short news hook displayed on feed lists..."
                    value={cmsUpdateForm.summary}
                    onChange={(e) => setCmsUpdateForm(prev => ({ ...prev, summary: e.target.value }))}
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Full Content (HTML/Plain Text) *</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Write detailed announcements content. HTML formatting is supported..."
                    value={cmsUpdateForm.content}
                    onChange={(e) => setCmsUpdateForm(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2 border-t border-slate-100 pt-3">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Cover Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpdateImageChange}
                    className="w-full py-1.5 px-2 border border-border-gray rounded text-xs bg-white cursor-pointer"
                  />
                  {cmsUpdateForm.coverMedia && (
                    <div className="w-32 h-20 rounded border overflow-hidden mt-1 bg-slate-100">
                      <img src={cmsUpdateForm.coverMedia.startsWith('data:') ? cmsUpdateForm.coverMedia : `http://localhost:5000${cmsUpdateForm.coverMedia}`} alt="cover preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2 border-t border-slate-100 pt-3">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Reference Files & Attachments (E.g. Admission PDFs)</label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={handleUpdateAttachmentChange}
                    className="w-full py-1.5 px-2 border border-border-gray rounded text-xs bg-white cursor-pointer"
                  />
                  {cmsUpdateForm.attachments && cmsUpdateForm.attachments.length > 0 && (
                    <div className="space-y-1.5 mt-2">
                      {cmsUpdateForm.attachments.map((attUrl, i) => {
                        const fileName = attUrl.startsWith('data:') ? `Upload_Document_${i + 1}` : attUrl.split('/').pop() || `Document_${i + 1}`;
                        return (
                          <div key={i} className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100 text-xs">
                            <span className="truncate max-w-[280px] font-semibold text-slate-600">📁 {fileName}</span>
                            <button
                              type="button"
                              onClick={() => setCmsUpdateForm(prev => ({ ...prev, attachments: prev.attachments.filter((_, idx) => idx !== i) }))}
                              className="text-rose-500 hover:text-rose-700 bg-transparent border-none cursor-pointer font-bold text-sm"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Status *</label>
                  <select
                    value={cmsUpdateForm.status}
                    onChange={(e) => setCmsUpdateForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-white outline-none focus:border-primary font-semibold"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Visibility *</label>
                  <select
                    value={cmsUpdateForm.visibility}
                    onChange={(e) => setCmsUpdateForm(prev => ({ ...prev, visibility: e.target.value }))}
                    className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-white outline-none focus:border-primary font-semibold"
                  >
                    <option value="Public">Public (Displayed on site)</option>
                    <option value="Private">Private (Draft/Access limited)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="upd-feat"
                    checked={cmsUpdateForm.isFeatured}
                    onChange={(e) => setCmsUpdateForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="cursor-pointer"
                  />
                  <label htmlFor="upd-feat" className="text-xs font-bold text-primary cursor-pointer select-none">Featured on Home Page</label>
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-gray/50">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="py-2.5 px-5 rounded-lg border border-border-gray bg-white text-primary font-bold text-xs cursor-pointer hover:bg-soft-light"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="py-2.5 px-6 rounded-lg bg-primary hover:bg-accent text-white hover:text-primary transition-all font-bold text-xs cursor-pointer disabled:opacity-60 border-none"
                >
                  {isUploading ? 'Publishing...' : 'Save Update'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* 4b. Add/Edit Story Paragraph Modal */}
      {activeModal === 'story-milestone' && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-3 sm:p-5 animate-fade-in overflow-hidden" onClick={() => setActiveModal(null)}>
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-5 sm:p-6 text-left relative max-h-[90vh] flex flex-col my-auto animate-fade-in overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-text-light hover:text-primary cursor-pointer border-none bg-transparent z-10" onClick={() => setActiveModal(null)}><X size={20} /></button>
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2 shrink-0 border-b border-border-gray pb-2">
              <Notebook size={20} className="text-accent" /> {editingMilestone ? 'Edit Story Paragraph' : 'Add Story Paragraph'}
            </h3>
            
            <form onSubmit={handleSaveMilestone} className="space-y-4 overflow-y-auto pr-1 py-1 flex-1">
              {/* 1. Paragraph Content with Bold Formatting Toolbar */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Paragraph Content *</label>
                  <button
                    type="button"
                    onClick={handleInsertBoldInStoryParagraph}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-primary hover:text-white text-[#082142] font-black text-xs rounded border border-slate-300 transition-all cursor-pointer shadow-xs"
                    title="Select text and click to make it bold"
                  >
                    <span className="font-extrabold text-sm">B</span> Make Selected Text Bold
                  </button>
                </div>

                <textarea 
                  ref={storyTextareaRef}
                  required 
                  rows={5} 
                  placeholder="Write the paragraph content here. Select any text and click 'Make Selected Text Bold' to highlight it..." 
                  value={milestoneForm.description} 
                  onChange={(e) => setMilestoneForm({...milestoneForm, description: e.target.value})} 
                  className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold resize-none" 
                />

                {/* Live Formatted Preview */}
                {milestoneForm.description && (
                  <div className="mt-1 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Live Formatted Preview:</span>
                    <p 
                      className="text-justify font-normal leading-relaxed text-slate-800"
                      dangerouslySetInnerHTML={{
                        __html: milestoneForm.description
                          .replace(/<strong>(.*?)<\/strong>/gi, '<strong class="font-extrabold text-[#082142]">$1</strong>')
                          .replace(/<b>(.*?)<\/b>/gi, '<strong class="font-extrabold text-[#082142]">$1</strong>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-[#082142]">$1</strong>')
                      }}
                    />
                  </div>
                )}
              </div>

              {/* 2. Display Order */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Display Order *</label>
                <input 
                  required 
                  type="number" 
                  placeholder="E.g. 1" 
                  value={milestoneForm.order} 
                  onChange={(e) => setMilestoneForm({...milestoneForm, order: parseInt(e.target.value) || 0})} 
                  className="w-full py-2.5 px-3 border border-border-gray rounded text-sm bg-soft-light outline-none focus:bg-white focus:border-primary transition-all font-semibold" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isUploading}
                className="w-full bg-primary hover:bg-accent hover:text-primary transition-all text-white font-bold py-3 mt-3 rounded-lg cursor-pointer text-sm disabled:opacity-60 border-none shadow-md"
              >
                {isUploading ? 'Saving changes...' : editingMilestone ? 'Save Paragraph' : 'Add Paragraph'}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* 5. Email Change Verification Modal */}
      {showEmailVerifyModal && createPortal(
        <div className="fixed inset-0 bg-black/15 backdrop-blur-sm z-[9999] flex items-center justify-center p-5 animate-fade-in" onClick={() => setShowEmailVerifyModal(false)}>
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
        </div>,
        document.body
      )}

      {confirmationModal.show && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-5 animate-fade-in" onClick={() => setConfirmationModal(prev => ({ ...prev, show: false }))}>
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
        </div>,
        document.body
      )}

    </div>
  );
};
