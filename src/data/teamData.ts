// Team Members Data
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: 'sanjay-pathak',
    name: 'Mr. Sanjay Pathak',
    role: 'Founder & Director',
    bio: 'A visionary leader and sports administrator, Mr. Pathak founded the academy with a commitment to providing state-of-the-art training infrastructure and supporting grassroots athletes from underprivileged rural communities.',
    image: '/images/Mr. Sanjay Pathak (Founder and Director).jpeg',
  },
  {
    id: 'shrad-chaudhary',
    name: 'Dr. Shrad Chaudhary',
    role: 'Director',
    bio: 'An accomplished academician and sports enthusiast, Dr. Chaudhary oversees sports integration programs, fostering a balanced approach between academic development and physical excellence for student-athletes.',
    image: '/images/Dr. Shrad Chaudhary (Director).jpeg',
  },
  {
    id: 'rita-sinha',
    name: 'Dr. Rita Sinha',
    role: 'Director',
    bio: 'A dedicated advocate for youth empowerment and sports education, Dr. Sinha specializes in building inclusive developmental programs, mentoring junior athletes, and promoting sports wellness initiatives.',
    image: '/images/Dr. Rita Sinha (Director).jpeg',
  },
  {
    id: 'rajeev-mishra',
    name: 'Rajeev Lochan Mishra',
    role: 'Director',
    bio: 'Bringing years of administrative expertise, Mr. Mishra leads strategic growth and partnership building, steering the academy\'s community outreach programs and talent scout networks.',
    image: '/images/Rajeev Lochan Mishra (Director).jpeg',
  },
  {
    id: 'alakh-pandey',
    name: 'Mr. Alakh Niranjan Pandey',
    role: 'Director',
    bio: 'Mr. Pandey guides the development of residential infrastructure, campus operations, and athlete welfare programs, ensuring a secure and supportive training environment.',
    image: '/images/Dr. Alakh Niranjan Pandey (Director).jpeg',
  },
];
