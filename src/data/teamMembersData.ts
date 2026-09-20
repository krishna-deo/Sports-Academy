export interface StaffMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  objectPosition?: string;
}

export const defaultStaffMembers: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Sunil Kumar Sharma',
    role: 'Operations & Logistics Manager',
    bio: 'Sunil manages daily campus operations, equipment procurement, and transport coordination for over 100 student athletes.\nHis dedication ensures seamless logistics during regional and national tournament trips.',
    image: '/images/hero1.jpeg',
    objectPosition: 'center 20%',
  },
  {
    id: 'staff-2',
    name: 'Pooja Verma',
    role: 'Academic & Welfare Coordinator',
    bio: 'Pooja oversees school tuition programs, evening tutorial schedules, and student welfare.\nShe ensures every athlete maintains high academic standing while pursuing sports excellence.',
    image: '/images/about_rlbsa.jpeg',
    objectPosition: 'center 15%',
  },
  {
    id: 'staff-3',
    name: 'Dr. Amit Singh',
    role: 'Sports Physiotherapist & Medical Lead',
    bio: 'Dr. Amit leads injury prevention, rehabilitation therapy, and biomechanical recovery programs for RLBSA athletes.\nHe conducts monthly physical assessment audits to optimize athletic performance.',
    image: '/images/hero2.jpg',
    objectPosition: 'center 25%',
  },
  {
    id: 'staff-4',
    name: 'Rameshwar Roy',
    role: 'Grounds & Infrastructure Specialist',
    bio: 'Rameshwar maintains turf conditions, athletics tracks, and indoor training equipment to international safety standards.\nHe has been with RLBSA for over 8 years as a pillar of ground operations.',
    image: '/images/sports_training_card.jpg',
    objectPosition: 'center 15%',
  },
];
