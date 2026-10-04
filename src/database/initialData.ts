import {
  Campaign,
  Contact,
  EmailEvent,
  ProviderSettings,
  Segment,
  SendingDomain,
  Sequence,
  SuppressionEntry,
  Template,
  UserProfile,
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr_01',
  name: 'Jordan Blake',
  email: 'jordan@outreachhub.io',
  role: 'Growth Lead & Admin',
  organization: 'Apex Media & University Ventures',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

export const INITIAL_STUDENTS: Contact[] = [
  {
    id: 'std_01',
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: 'aarav.sharma@stanfordtech.edu',
    phone: '+1 (555) 234-5678',
    organization: 'Stanford Tech Institute',
    college: 'Stanford Tech Institute',
    department: 'Computer Science',
    batch: '2023-2027',
    year: '2nd Year',
    course: 'B.Tech CSE',
    section: 'A',
    rollNumber: 'CS23B1042',
    role: 'Student Developer',
    city: 'Palo Alto',
    contactType: 'Student',
    tags: ['Hackathon Lead', 'Fullstack', 'Web3'],
    status: 'Active',
    source: 'Campus Partner List',
    createdAt: '2026-08-10T10:00:00Z',
    lastContacted: '2026-09-12T14:30:00Z',
    notes: [
      { id: 'n1', content: 'Won first place in HackTech 2025. Very responsive on hackathon updates.', author: 'Jordan Blake', createdAt: '2026-08-12T11:00:00Z' }
    ]
  },
  {
    id: 'std_02',
    firstName: 'Diya',
    lastName: 'Patel',
    email: 'diya.patel@stanfordtech.edu',
    organization: 'Stanford Tech Institute',
    college: 'Stanford Tech Institute',
    department: 'Computer Science',
    batch: '2023-2027',
    year: '2nd Year',
    course: 'B.Tech CSE',
    section: 'B',
    rollNumber: 'CS23B1089',
    role: 'Student / GDG Member',
    city: 'Palo Alto',
    contactType: 'Student',
    tags: ['AI/ML', 'Open Source', 'AfterClass'],
    status: 'Replied',
    source: 'Campus Partner List',
    createdAt: '2026-08-10T10:15:00Z',
    lastContacted: '2026-09-12T14:30:00Z',
    lastReplied: '2026-09-13T09:12:00Z',
    notes: []
  },
  {
    id: 'std_03',
    firstName: 'Rohan',
    lastName: 'Verma',
    email: 'rohan.v@mitengineering.edu',
    organization: 'MIT College of Engineering',
    college: 'MIT College of Engineering',
    department: 'Information Technology',
    batch: '2022-2026',
    year: '3rd Year',
    course: 'B.Tech IT',
    section: 'A',
    rollNumber: 'IT22A0014',
    role: 'Placement Rep',
    city: 'Cambridge',
    contactType: 'Student',
    tags: ['Placement Cell', 'StudEarn'],
    status: 'Interested',
    source: 'Campus Ambassador Drive',
    createdAt: '2026-08-14T09:00:00Z',
    lastContacted: '2026-09-10T16:00:00Z',
    lastReplied: '2026-09-11T12:45:00Z',
    notes: []
  },
  {
    id: 'std_04',
    firstName: 'Ananya',
    lastName: 'Iyer',
    email: 'ananya.iyer@mitengineering.edu',
    organization: 'MIT College of Engineering',
    college: 'MIT College of Engineering',
    department: 'Electronics & Comm',
    batch: '2023-2027',
    year: '2nd Year',
    course: 'B.Tech ECE',
    section: 'C',
    rollNumber: 'EC23C0441',
    role: 'Robotics Club Head',
    city: 'Cambridge',
    contactType: 'Student',
    tags: ['Robotics', 'Hardware', 'Hackathon'],
    status: 'Contacted',
    source: 'Campus Ambassador Drive',
    createdAt: '2026-08-14T09:20:00Z',
    lastContacted: '2026-09-12T14:30:00Z',
    notes: []
  },
  {
    id: 'std_05',
    firstName: 'Marcus',
    lastName: 'Chen',
    email: 'marcus.chen@berkeleyscience.edu',
    organization: 'UC Berkeley Science & Tech',
    college: 'UC Berkeley Science & Tech',
    department: 'Data Science',
    batch: '2024-2028',
    year: '1st Year',
    course: 'B.S. Data Science',
    section: 'A',
    rollNumber: 'DS24A0091',
    role: 'Freshman Lead',
    city: 'Berkeley',
    contactType: 'Student',
    tags: ['Freshman', 'Data Science', 'Resource Pack'],
    status: 'Active',
    source: 'Student Resource Pack Form',
    createdAt: '2026-08-20T14:00:00Z',
    notes: []
  },
  {
    id: 'std_06',
    firstName: 'Kavita',
    lastName: 'Reddy',
    email: 'kavita.reddy@berkeleyscience.edu',
    organization: 'UC Berkeley Science & Tech',
    college: 'UC Berkeley Science & Tech',
    department: 'Computer Science',
    batch: '2022-2026',
    year: '3rd Year',
    course: 'B.S. CS',
    section: 'B',
    rollNumber: 'CS22B0112',
    role: 'ACM Chair',
    city: 'Berkeley',
    contactType: 'Student',
    tags: ['ACM', 'Campus Lead', 'Hackathon'],
    status: 'Interested',
    source: 'Student Resource Pack Form',
    createdAt: '2026-08-20T14:10:00Z',
    lastContacted: '2026-09-12T14:30:00Z',
    lastReplied: '2026-09-13T10:15:00Z',
    notes: []
  },
  {
    id: 'std_07',
    firstName: 'Ethan',
    lastName: 'Walker',
    email: 'ethan.w@austintech.edu',
    organization: 'Austin Tech University',
    college: 'Austin Tech University',
    department: 'Software Engineering',
    batch: '2023-2027',
    year: '2nd Year',
    course: 'B.S. SE',
    section: 'A',
    rollNumber: 'SE23A0302',
    role: 'Frontend Enthusiast',
    city: 'Austin',
    contactType: 'Student',
    tags: ['React', 'AfterClass', 'UI/UX'],
    status: 'Active',
    source: 'Austin Tech Hackathon',
    createdAt: '2026-08-22T11:00:00Z',
    notes: []
  },
  {
    id: 'std_08',
    firstName: 'Meera',
    lastName: 'Nambiar',
    email: 'meera.n@austintech.edu',
    organization: 'Austin Tech University',
    college: 'Austin Tech University',
    department: 'Artificial Intelligence',
    batch: '2023-2027',
    year: '2nd Year',
    course: 'B.Tech AI',
    section: 'B',
    rollNumber: 'AI23B0078',
    role: 'AI Researcher',
    city: 'Austin',
    contactType: 'Student',
    tags: ['Generative AI', 'StudEarn', 'High GPA'],
    status: 'Replied',
    source: 'Austin Tech Hackathon',
    createdAt: '2026-08-22T11:15:00Z',
    lastContacted: '2026-09-12T14:30:00Z',
    lastReplied: '2026-09-14T08:30:00Z',
    notes: []
  },
  {
    id: 'std_09',
    firstName: 'Devon',
    lastName: 'Brooks',
    email: 'd.brooks@georgiatech.edu',
    organization: 'Georgia Institute of Tech',
    college: 'Georgia Institute of Tech',
    department: 'Computer Science',
    batch: '2022-2026',
    year: '3rd Year',
    course: 'B.S. CS',
    section: 'D',
    rollNumber: 'GT22CS084',
    role: 'Dev Club Secretary',
    city: 'Atlanta',
    contactType: 'Student',
    tags: ['Cloud', 'DevOps', 'Opportunity'],
    status: 'Contacted',
    source: 'Campus Outreach',
    createdAt: '2026-08-25T15:00:00Z',
    notes: []
  },
  {
    id: 'std_10',
    firstName: 'Priya',
    lastName: 'Kulkarni',
    email: 'priya.kulkarni@georgiatech.edu',
    organization: 'Georgia Institute of Tech',
    college: 'Georgia Institute of Tech',
    department: 'Cybersecurity',
    batch: '2023-2027',
    year: '2nd Year',
    course: 'B.S. Cyber',
    section: 'A',
    rollNumber: 'GT23CY019',
    role: 'CTF Captain',
    city: 'Atlanta',
    contactType: 'Student',
    tags: ['Security', 'Hackathon'],
    status: 'Active',
    source: 'Campus Outreach',
    createdAt: '2026-08-25T15:20:00Z',
    notes: []
  },
  {
    id: 'std_11',
    firstName: 'Liam',
    lastName: 'Murphy',
    email: 'l.murphy@stanfordtech.edu',
    organization: 'Stanford Tech Institute',
    college: 'Stanford Tech Institute',
    department: 'Mechanical Eng',
    batch: '2024-2028',
    year: '1st Year',
    course: 'B.Tech Mech',
    section: 'A',
    rollNumber: 'ME24A0033',
    role: 'Design Lead',
    city: 'Palo Alto',
    contactType: 'Student',
    tags: ['CAD', '3D Design'],
    status: 'New',
    source: 'Freshman Orientation Drive',
    createdAt: '2026-09-01T09:00:00Z',
    notes: []
  },
  {
    id: 'std_12',
    firstName: 'Siddharth',
    lastName: 'Rao',
    email: 'sid.rao@mitengineering.edu',
    organization: 'MIT College of Engineering',
    college: 'MIT College of Engineering',
    department: 'Computer Science',
    batch: '2023-2027',
    year: '2nd Year',
    course: 'B.Tech CSE',
    section: 'C',
    rollNumber: 'CS23C0712',
    role: 'Student Contributor',
    city: 'Cambridge',
    contactType: 'Student',
    tags: ['Python', 'Open Source', 'AfterClass'],
    status: 'Active',
    source: 'GitHub Campus Program',
    createdAt: '2026-09-02T10:00:00Z',
    notes: []
  },
  {
    id: 'std_13',
    firstName: 'Zara',
    lastName: 'Khan',
    email: 'zara.khan@berkeleyscience.edu',
    organization: 'UC Berkeley Science & Tech',
    college: 'UC Berkeley Science & Tech',
    department: 'Information Systems',
    batch: '2023-2027',
    year: '2nd Year',
    course: 'B.S. IS',
    section: 'A',
    rollNumber: 'IS23A0210',
    role: 'Peer Tutor',
    city: 'Berkeley',
    contactType: 'Student',
    tags: ['Tutoring', 'StudEarn'],
    status: 'Interested',
    source: 'Campus Ambassador Drive',
    createdAt: '2026-09-03T12:00:00Z',
    notes: []
  },
  {
    id: 'std_14',
    firstName: 'Noah',
    lastName: 'Goldman',
    email: 'noah.g@austintech.edu',
    organization: 'Austin Tech University',
    college: 'Austin Tech University',
    department: 'Computer Science',
    batch: '2022-2026',
    year: '3rd Year',
    course: 'B.S. CS',
    section: 'B',
    rollNumber: 'CS22B0541',
    role: 'Hackathon Organizer',
    city: 'Austin',
    contactType: 'Student',
    tags: ['Hackathon Lead', 'Events'],
    status: 'Converted',
    source: 'Direct Outreach',
    createdAt: '2026-09-04T14:30:00Z',
    notes: []
  },
  {
    id: 'std_15',
    firstName: 'Tanvi',
    lastName: 'Deshmukh',
    email: 'tanvi.d@georgiatech.edu',
    organization: 'Georgia Institute of Tech',
    college: 'Georgia Institute of Tech',
    department: 'Electrical Eng',
    batch: '2023-2027',
    year: '2nd Year',
    course: 'B.S. EE',
    section: 'B',
    rollNumber: 'GT23EE092',
    role: 'Student Mentor',
    city: 'Atlanta',
    contactType: 'Student',
    tags: ['Mentorship', 'Women in Tech'],
    status: 'Replied',
    source: 'Campus Outreach',
    createdAt: '2026-09-05T09:15:00Z',
    notes: []
  },
  {
    id: 'std_16',
    firstName: 'Lucas',
    lastName: 'Silva',
    email: 'lucas.silva@stanfordtech.edu',
    organization: 'Stanford Tech Institute',
    college: 'Stanford Tech Institute',
    department: 'Computer Science',
    batch: '2024-2028',
    year: '1st Year',
    course: 'B.Tech CSE',
    section: 'A',
    rollNumber: 'CS24A0012',
    role: 'Student Member',
    city: 'Palo Alto',
    contactType: 'Student',
    tags: ['Competitive Coding'],
    status: 'Active',
    source: 'Campus Partner List',
    createdAt: '2026-09-06T10:00:00Z',
    notes: []
  },
  {
    id: 'std_17',
    firstName: 'Sneha',
    lastName: 'Bose',
    email: 'sneha.b@mitengineering.edu',
    organization: 'MIT College of Engineering',
    college: 'MIT College of Engineering',
    department: 'Biotech & Bioeng',
    batch: '2023-2027',
    year: '2nd Year',
    course: 'B.Tech Bio',
    section: 'A',
    rollNumber: 'BIO23A018',
    role: 'BioTech Society Rep',
    city: 'Cambridge',
    contactType: 'Student',
    tags: ['Bioinformatics', 'Research'],
    status: 'New',
    source: 'Campus Ambassador Drive',
    createdAt: '2026-09-07T11:00:00Z',
    notes: []
  },
  {
    id: 'std_18',
    firstName: 'Oliver',
    lastName: 'Scott',
    email: 'o.scott@berkeleyscience.edu',
    organization: 'UC Berkeley Science & Tech',
    college: 'UC Berkeley Science & Tech',
    department: 'Computer Science',
    batch: '2023-2027',
    year: '2nd Year',
    course: 'B.S. CS',
    section: 'C',
    rollNumber: 'CS23C0499',
    role: 'Student Developer',
    city: 'Berkeley',
    contactType: 'Student',
    tags: ['Web Development', 'AfterClass'],
    status: 'Active',
    source: 'Student Resource Pack Form',
    createdAt: '2026-09-08T13:00:00Z',
    notes: []
  },
  {
    id: 'std_19',
    firstName: 'Aisha',
    lastName: 'Al-Mansoor',
    email: 'aisha.m@austintech.edu',
    organization: 'Austin Tech University',
    college: 'Austin Tech University',
    department: 'Software Engineering',
    batch: '2024-2028',
    year: '1st Year',
    course: 'B.S. SE',
    section: 'A',
    rollNumber: 'SE24A0105',
    role: 'Student Ambassador',
    city: 'Austin',
    contactType: 'Student',
    tags: ['Community', 'StudEarn'],
    status: 'Interested',
    source: 'Campus Ambassador Drive',
    createdAt: '2026-09-09T15:00:00Z',
    notes: []
  },
  {
    id: 'std_20',
    firstName: 'Arjun',
    lastName: 'Kapoor',
    email: 'arjun.k@georgiatech.edu',
    organization: 'Georgia Institute of Tech',
    college: 'Georgia Institute of Tech',
    department: 'Computer Science',
    batch: '2022-2026',
    year: '3rd Year',
    course: 'B.S. CS',
    section: 'A',
    rollNumber: 'GT22CS011',
    role: 'Cloud Architect Intern',
    city: 'Atlanta',
    contactType: 'Student',
    tags: ['AWS', 'Kubernetes', 'Placement'],
    status: 'Contacted',
    source: 'Campus Outreach',
    createdAt: '2026-09-10T16:00:00Z',
    notes: []
  },
  {
    id: 'std_21',
    firstName: 'Elena',
    lastName: 'Rostova',
    email: 'elena.rostova@stanfordtech.edu',
    organization: 'Stanford Tech Institute',
    college: 'Stanford Tech Institute',
    department: 'Information Technology',
    batch: '2023-2027',
    year: '2nd Year',
    course: 'B.Tech IT',
    section: 'B',
    rollNumber: 'IT23B0401',
    role: 'UI Designer',
    city: 'Palo Alto',
    contactType: 'Student',
    tags: ['Figma', 'UI/UX', 'Hackathon'],
    status: 'Active',
    source: 'Campus Partner List',
    createdAt: '2026-09-11T11:00:00Z',
    notes: []
  },
  {
    id: 'std_22',
    firstName: 'Ishaan',
    lastName: 'Gupta',
    email: 'ishaan.gupta@mitengineering.edu',
    organization: 'MIT College of Engineering',
    college: 'MIT College of Engineering',
    department: 'Computer Science',
    batch: '2023-2027',
    year: '2nd Year',
    course: 'B.Tech CSE',
    section: 'A',
    rollNumber: 'CS23A0088',
    role: 'Open Source Fellow',
    city: 'Cambridge',
    contactType: 'Student',
    tags: ['Golang', 'Open Source'],
    status: 'Replied',
    source: 'Campus Ambassador Drive',
    createdAt: '2026-09-11T13:30:00Z',
    notes: []
  }
];

export const INITIAL_CLIENT_LEADS: Contact[] = [
  {
    id: 'cld_01',
    firstName: 'David',
    lastName: 'Sterling',
    email: 'david@apexdentalcare.com',
    phone: '+1 (512) 839-4412',
    organization: 'Apex Dental Care Clinic',
    role: 'Managing Partner & Clinic Director',
    city: 'Austin',
    website: 'apexdentalcare.com',
    websiteUrl: 'https://apexdentalcare.com',
    contactType: 'Client Lead',
    industry: 'Dental & Healthcare',
    leadStatus: 'Interested',
    leadSource: 'Google Maps Local Audit',
    assignedOffer: 'Dental Patient Booking Redesign + Local SEO Boost',
    personalObservation: 'your current site lacks online appointment scheduling and has a 5.8s mobile load time',
    dealValue: 3800,
    nextFollowUpDate: '2026-09-18',
    tags: ['High Value', 'Local Business', 'Austin'],
    status: 'Interested',
    source: 'Web Scraping & Audit',
    createdAt: '2026-08-28T09:00:00Z',
    lastContacted: '2026-09-12T10:00:00Z',
    lastReplied: '2026-09-13T16:20:00Z',
    notes: [
      { id: 'nc1', content: 'David loved the speed breakdown we sent. Requested demo video for partners next Tuesday.', author: 'Jordan Blake', createdAt: '2026-09-13T16:30:00Z' }
    ]
  },
  {
    id: 'cld_02',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 'sarah@luminaarchitects.io',
    phone: '+1 (415) 602-9931',
    organization: 'Lumina Architecture Studio',
    role: 'Founding Principal',
    city: 'San Francisco',
    website: 'luminaarchitects.io',
    websiteUrl: 'https://luminaarchitects.io',
    contactType: 'Client Lead',
    industry: 'Architecture & Design',
    leadStatus: 'Meeting',
    leadSource: 'Architectural Digest Directory',
    assignedOffer: 'Interactive Architectural Portfolio & 3D Interactive Showcase',
    personalObservation: 'your project photo gallery is uncompressed and broken on iOS Safari touch screens',
    dealValue: 6500,
    nextFollowUpDate: '2026-09-16',
    tags: ['High Ticket', 'Portfolio Revamp', 'Design'],
    status: 'Contacted',
    source: 'Cold Sourcing',
    createdAt: '2026-08-29T10:00:00Z',
    lastContacted: '2026-09-11T14:00:00Z',
    notes: [
      { id: 'nc2', content: 'Scheduled 30-min strategy Zoom call for Thursday 2pm PST.', author: 'Jordan Blake', createdAt: '2026-09-12T09:00:00Z' }
    ]
  },
  {
    id: 'cld_03',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'mvance@finedgeadvisors.com',
    phone: '+1 (312) 745-1288',
    organization: 'FinEdge Wealth Advisors',
    role: 'VP Client Acquisition',
    city: 'Chicago',
    website: 'finedgeadvisors.com',
    websiteUrl: 'https://finedgeadvisors.com',
    contactType: 'Client Lead',
    industry: 'Financial Advisory',
    leadStatus: 'Proposal',
    leadSource: 'LinkedIn Outreach',
    assignedOffer: 'High-Net-Worth Lead Magnet Funnel & Retirement Calculator',
    personalObservation: 'your contact form asks for 14 manual fields causing an estimated 70% drop-off',
    dealValue: 8200,
    nextFollowUpDate: '2026-09-17',
    tags: ['Wealth Mgmt', 'Proposal Sent'],
    status: 'Contacted',
    source: 'LinkedIn Sourcing',
    createdAt: '2026-09-01T11:00:00Z',
    lastContacted: '2026-09-14T11:30:00Z',
    notes: []
  },
  {
    id: 'cld_04',
    firstName: 'Elena',
    lastName: 'Moretti',
    email: 'elena@solarcraftenergy.com',
    organization: 'SolarCraft Clean Energy',
    role: 'Marketing Director',
    city: 'Phoenix',
    website: 'solarcraftenergy.com',
    websiteUrl: 'https://solarcraftenergy.com',
    contactType: 'Client Lead',
    industry: 'Renewable Energy',
    leadStatus: 'Follow-up',
    leadSource: 'Clean Energy Expo',
    assignedOffer: 'Instant Solar Savings Estimator + Automated SMS Lead Capture',
    personalObservation: 'competitors in Phoenix have live rooftop quote calculators while yours requires email waiting',
    dealValue: 4500,
    nextFollowUpDate: '2026-09-19',
    tags: ['Solar', 'Lead Gen', 'Calculators'],
    status: 'Contacted',
    source: 'Trade Show',
    createdAt: '2026-09-02T13:00:00Z',
    lastContacted: '2026-09-10T09:00:00Z',
    notes: []
  },
  {
    id: 'cld_05',
    firstName: 'Gregory',
    lastName: 'Holt',
    email: 'gholt@summithvacpro.com',
    phone: '+1 (303) 489-7710',
    organization: 'Summit Commercial HVAC',
    role: 'Owner & General Manager',
    city: 'Denver',
    website: 'summithvacpro.com',
    websiteUrl: 'https://summithvacpro.com',
    contactType: 'Client Lead',
    industry: 'Commercial Trades & HVAC',
    leadStatus: 'Won',
    leadSource: 'Google Maps Audit',
    assignedOffer: 'Local Emergency Dispatch Portal & Google LSA Optimized Landing Page',
    personalObservation: 'your Google business reviews are excellent (4.9 stars) but your homepage has zero trust badges or call buttons',
    dealValue: 5200,
    tags: ['Closed Won', 'Service Contract'],
    status: 'Converted',
    source: 'Direct Audit',
    createdAt: '2026-08-15T08:00:00Z',
    lastContacted: '2026-09-05T10:00:00Z',
    lastReplied: '2026-09-05T14:10:00Z',
    notes: [
      { id: 'nc5', content: 'Contract signed! Onboarding kickoff on Oct 1st.', author: 'Jordan Blake', createdAt: '2026-09-08T10:00:00Z' }
    ]
  },
  {
    id: 'cld_06',
    firstName: 'Rebecca',
    lastName: 'Torres',
    email: 'rebecca@coastalfitnesstx.com',
    organization: 'Coastal Elite Fitness Gyms',
    role: 'Co-Founder & Ops Lead',
    city: 'Corpus Christi',
    website: 'coastalfitnesstx.com',
    websiteUrl: 'https://coastalfitnesstx.com',
    contactType: 'Client Lead',
    industry: 'Fitness & Health Clubs',
    leadStatus: 'Replied',
    leadSource: 'Instagram Ads Library Audit',
    assignedOffer: '7-Day Free Pass Landing Funnel with Stripe Gym Member Onboarding',
    personalObservation: 'you are spending on Meta ads but pointing clicks to an unoptimized PDF class schedule',
    dealValue: 3200,
    nextFollowUpDate: '2026-09-17',
    tags: ['Fitness', 'Paid Ads Fix'],
    status: 'Replied',
    source: 'Ad Library Audit',
    createdAt: '2026-09-03T14:00:00Z',
    lastContacted: '2026-09-11T15:00:00Z',
    lastReplied: '2026-09-12T18:40:00Z',
    notes: []
  },
  {
    id: 'cld_07',
    firstName: 'Arthur',
    lastName: 'Pemberton',
    email: 'arthur@pembertonlegal.com',
    phone: '+1 (617) 554-0019',
    organization: 'Pemberton Estate Law Group',
    role: 'Senior Managing Partner',
    city: 'Boston',
    website: 'pembertonlegal.com',
    websiteUrl: 'https://pembertonlegal.com',
    contactType: 'Client Lead',
    industry: 'Legal Services',
    leadStatus: 'Researched',
    leadSource: 'State Bar Directory',
    assignedOffer: 'Estate Planning Confidential Client Intake & Secure Portal',
    personalObservation: 'the site was built in 2016 on Joomla and does not have an SSL certificate installed correctly',
    dealValue: 7500,
    nextFollowUpDate: '2026-09-20',
    tags: ['Law Firm', 'High Budget'],
    status: 'New',
    source: 'Bar Association Directory',
    createdAt: '2026-09-06T10:00:00Z',
    notes: []
  },
  {
    id: 'cld_08',
    firstName: 'Chloe',
    lastName: 'Sinclair',
    email: 'chloe@sinclairboutiquehotels.com',
    organization: 'Sinclair Heritage Boutique Inns',
    role: 'Brand & Hospitality Officer',
    city: 'Savannah',
    website: 'sinclairboutiquehotels.com',
    websiteUrl: 'https://sinclairboutiquehotels.com',
    contactType: 'Client Lead',
    industry: 'Hospitality & Boutique Hotels',
    leadStatus: 'Contacted',
    leadSource: 'TripAdvisor High-Rated Independents',
    assignedOffer: 'Direct Commission-Free Booking Engine & Storytelling Web Experience',
    personalObservation: 'third party OTAs are charging you 18% commission because your direct booking button redirects to an error page',
    dealValue: 6800,
    nextFollowUpDate: '2026-09-18',
    tags: ['Hospitality', 'Direct Bookings'],
    status: 'Contacted',
    source: 'TripAdvisor Scan',
    createdAt: '2026-09-07T12:00:00Z',
    lastContacted: '2026-09-13T11:00:00Z',
    notes: []
  },
  {
    id: 'cld_09',
    firstName: 'Nathan',
    lastName: 'Drake',
    email: 'nathan@nexuslogistics.us',
    organization: 'Nexus Freight & Warehousing',
    role: 'Director of Logistics Technology',
    city: 'Dallas',
    website: 'nexuslogistics.us',
    websiteUrl: 'https://nexuslogistics.us',
    contactType: 'Client Lead',
    industry: 'Supply Chain & Logistics',
    leadStatus: 'New',
    leadSource: 'Freight Transport Expo',
    assignedOffer: 'Real-Time Truckload Rate Calculator & Automated Driver Portal',
    personalObservation: 'prospective shippers have to call during office hours for simple container quotes',
    dealValue: 9000,
    tags: ['Enterprise', 'B2B Logistics'],
    status: 'New',
    source: 'Expo Attendee List',
    createdAt: '2026-09-08T09:00:00Z',
    notes: []
  },
  {
    id: 'cld_10',
    firstName: 'Jessica',
    lastName: 'Huang',
    email: 'jessica@pureglowmedspa.com',
    phone: '+1 (206) 912-3344',
    organization: 'PureGlow Aesthetics & MedSpa',
    role: 'Founder & Head Aesthetician',
    city: 'Seattle',
    website: 'pureglowmedspa.com',
    websiteUrl: 'https://pureglowmedspa.com',
    contactType: 'Client Lead',
    industry: 'Beauty & Aesthetics',
    leadStatus: 'Interested',
    leadSource: 'Instagram Lead Ad Scan',
    assignedOffer: 'VIP Treatment Menu, Membership Recurring Billing & Booking Flow',
    personalObservation: 'you have 45k IG followers but your link in bio leads to a sluggish multi-step form that dropped our test booking',
    dealValue: 4200,
    nextFollowUpDate: '2026-09-19',
    tags: ['MedSpa', 'Instagram Traffic', 'Retainers'],
    status: 'Interested',
    source: 'Instagram Audit',
    createdAt: '2026-09-09T10:30:00Z',
    lastContacted: '2026-09-14T09:00:00Z',
    lastReplied: '2026-09-14T15:10:00Z',
    notes: []
  },
  {
    id: 'cld_11',
    firstName: 'Kenneth',
    lastName: 'Bauer',
    email: 'kbauer@bauercommercialroofing.com',
    organization: 'Bauer Commercial Roofing Systems',
    role: 'Chief Commercial Estimator',
    city: 'Cleveland',
    website: 'bauercommercialroofing.com',
    websiteUrl: 'https://bauercommercialroofing.com',
    contactType: 'Client Lead',
    industry: 'Commercial Construction',
    leadStatus: 'Lost',
    leadSource: 'Cold Outreach',
    assignedOffer: 'Instant Commercial Square Footage Roof Estimator',
    personalObservation: 'the site was not mobile responsive on standard tablets',
    dealValue: 3500,
    tags: ['Construction', 'Not Ready'],
    status: 'Not Interested',
    source: 'Direct Search',
    createdAt: '2026-08-20T10:00:00Z',
    lastContacted: '2026-08-25T11:00:00Z',
    notes: [
      { id: 'nc11', content: 'Kenneth mentioned they already renewed an internal IT contract last month.', author: 'Jordan Blake', createdAt: '2026-08-26T14:00:00Z' }
    ]
  },
  {
    id: 'cld_12',
    firstName: 'Amara',
    lastName: 'Okafor',
    email: 'amara@artisanroasters.coffee',
    phone: '+1 (503) 774-2190',
    organization: 'Artisan Batch Coffee Roasters',
    role: 'Founder & Master Roaster',
    city: 'Portland',
    website: 'artisanroasters.coffee',
    websiteUrl: 'https://artisanroasters.coffee',
    contactType: 'Client Lead',
    industry: 'Specialty Coffee & E-Commerce',
    leadStatus: 'Meeting',
    leadSource: 'Specialty Coffee Association',
    assignedOffer: 'Shopify Custom Subscriptions & Wholesale Ordering B2B Portal',
    personalObservation: 'your cafe wholesale partners currently have to submit paper reorder PDFs via email',
    dealValue: 5800,
    nextFollowUpDate: '2026-09-17',
    tags: ['E-commerce', 'Wholesale Portal'],
    status: 'Contacted',
    source: 'Trade Directory',
    createdAt: '2026-09-10T14:00:00Z',
    lastContacted: '2026-09-12T16:00:00Z',
    notes: []
  },
  {
    id: 'cld_13',
    firstName: 'Victor',
    lastName: 'Soto',
    email: 'vsoto@greenpeaklandscaping.com',
    organization: 'GreenPeak Luxury Landscaping',
    role: 'Managing Partner',
    city: 'Charlotte',
    website: 'greenpeaklandscaping.com',
    websiteUrl: 'https://greenpeaklandscaping.com',
    contactType: 'Client Lead',
    industry: 'Luxury Outdoor Living',
    leadStatus: 'Contacted',
    leadSource: 'Houzz Top Rated',
    assignedOffer: 'Visual 3D Outdoor Project Estimator & High-Ticket Lead Filter',
    personalObservation: 'your Houzz portfolio has incredible $150k pool projects, but your website looks like a simple lawn-mowing service',
    dealValue: 4800,
    tags: ['Landscaping', 'Houzz'],
    status: 'Contacted',
    source: 'Houzz Directory',
    createdAt: '2026-09-11T09:00:00Z',
    notes: []
  },
  {
    id: 'cld_14',
    firstName: 'Danielle',
    lastName: 'Kim',
    email: 'danielle@stridephysiotherapy.com',
    organization: 'Stride Sports Physiotherapy',
    role: 'Clinical Director & Partner',
    city: 'San Diego',
    website: 'stridephysiotherapy.com',
    websiteUrl: 'https://stridephysiotherapy.com',
    contactType: 'Client Lead',
    industry: 'Physical Therapy & Sports Med',
    leadStatus: 'Researched',
    leadSource: 'Local Sports Medicine Network',
    assignedOffer: 'Self-Service Rehab Intake & Athlete Rehab Tracking Portal',
    personalObservation: 'patients currently print out a 6-page paper history on clipboards in waiting room',
    dealValue: 3900,
    tags: ['Healthcare', 'Intake Automation'],
    status: 'New',
    source: 'Local Network',
    createdAt: '2026-09-12T11:00:00Z',
    notes: []
  },
  {
    id: 'cld_15',
    firstName: 'Warren',
    lastName: 'Hastings',
    email: 'warren@hastingschartered.co.uk',
    organization: 'Hastings Chartered Accountants',
    role: 'Senior Tax Partner',
    city: 'London',
    website: 'hastingschartered.co.uk',
    websiteUrl: 'https://hastingschartered.co.uk',
    contactType: 'Client Lead',
    industry: 'Accounting & Tax Advisory',
    leadStatus: 'Follow-up',
    leadSource: 'Direct Research',
    assignedOffer: 'Secure Document Upload Portal & Automated Self-Assessment Reminder Engine',
    personalObservation: 'clients send bank statements via unencrypted email attachments',
    dealValue: 5400,
    nextFollowUpDate: '2026-09-22',
    tags: ['Fintech', 'Security'],
    status: 'Contacted',
    source: 'Web Audit',
    createdAt: '2026-09-12T15:00:00Z',
    lastContacted: '2026-09-14T10:00:00Z',
    notes: []
  },
  {
    id: 'cld_16',
    firstName: 'Samantha',
    lastName: 'Beal',
    email: 'samantha@claritymentalhealth.org',
    organization: 'Clarity Community Psychology',
    role: 'Executive Director',
    city: 'Minneapolis',
    website: 'claritymentalhealth.org',
    websiteUrl: 'https://claritymentalhealth.org',
    contactType: 'Client Lead',
    industry: 'Mental Health & Wellness',
    leadStatus: 'Do Not Contact',
    leadSource: 'Referral',
    assignedOffer: 'HIPAA Compliant Booking Portal',
    personalObservation: 'Requested to be removed from external outreach',
    dealValue: 0,
    tags: ['Do Not Contact'],
    status: 'Unsubscribed',
    source: 'Referral',
    createdAt: '2026-08-10T11:00:00Z',
    notes: []
  }
];

export const INITIAL_TEMPLATES: Template[] = [
  {
    id: 'tpl_01',
    name: 'HackTech 2026 National Hackathon Announcement',
    category: 'Student',
    subject: 'HackTech 2026: $50,000 Prizes, Travel Grants & Mentors for {{college}}',
    previewText: 'Registrations open for CSE & tech students at {{college}}',
    variablesUsed: ['first_name', 'college', 'department', 'batch', 'sender_name'],
    content: `Hi {{first_name}},

Hope your semester at {{college}} is going great!

We are officially launching applications for HackTech 2026 — the premier inter-collegiate national hackathon taking place this October.

Because you are part of {{department}} (Batch {{batch}}), we wanted to extend priority registration and verified fast-track project reviews:

• $50,000+ Prize Pool across AI, FinTech, and Decentralized Tech tracks
• 100% Covered Travel Grants for shortlisted student teams
• Mentors from top tech firms & VC funding opportunities
• Official certificate and exclusive developer swag pack

Registration link: https://hacktech.org/register?ref={{college}}

Feel free to reply if you or your campus team have any questions.

Best regards,
{{sender_name}}
Campus Outreach Lead, Outreach Hub`,
    createdAt: '2026-08-15T10:00:00Z',
    lastModified: '2026-09-10T12:00:00Z'
  },
  {
    id: 'tpl_02',
    name: 'AfterClass Student Innovation Cohort Launch',
    category: 'Announcement',
    subject: 'Introducing AfterClass: Exclusive tech resources for {{college}} engineers',
    previewText: 'Curated internships, project teardowns, and peer mentorship',
    variablesUsed: ['first_name', 'college', 'department', 'sender_name'],
    content: `Hey {{first_name}},

Quick note for {{department}} students at {{college}}:

We just unveiled **AfterClass** — a community platform built to help passionate student builders turn side-projects into funded ventures and landed internships.

Here is what is inside for you:
1. **Real-World Project Blueprints**: Production-grade repos in React, Node, and AI.
2. **Weekly AMA Sessions**: Conversations with engineering leads and founders.
3. **Campus Fellowship**: Earn stipends while leading tech clubs and campus workshops.

Grab your verified student access key here:
https://afterclass.io/join/{{college}}

Looking forward to seeing what you build!

Warmly,
{{sender_name}}`,
    createdAt: '2026-08-20T11:00:00Z',
    lastModified: '2026-09-08T15:00:00Z'
  },
  {
    id: 'tpl_03',
    name: 'StudEarn Paid Student Opportunities Pack',
    category: 'Student',
    subject: 'StudEarn Opportunities: Remote student developer & design roles for {{college}}',
    previewText: 'Flexible micro-internships designed for active college schedules',
    variablesUsed: ['first_name', 'college', 'batch', 'sender_name'],
    content: `Hi {{first_name}},

Balancing coursework with relevant industry experience can be tough during college.

We just published the new **StudEarn Opportunity Directory** for the {{batch}} cohort at {{college}}. These are curated, flexible remote micro-gigs and student fellowships designed specifically around class schedules:

• Web & Mobile App Builders ($25 - $40/hr)
• Campus Community & DevRel Evangelists
• Open-Source Bounty Grants

Browse verified student openings here:
https://studearn.com/opportunities?campus={{college}}

Let me know if you would like an introduction to any specific employer partner!

Cheers,
{{sender_name}}`,
    createdAt: '2026-08-22T09:30:00Z',
    lastModified: '2026-09-05T14:20:00Z'
  },
  {
    id: 'tpl_04',
    name: 'Client Cold Outreach: Website Performance & Lead Audit',
    category: 'Client Outreach',
    subject: 'Quick idea for {{company}} website (mobile speed & booking drop-off)',
    previewText: 'Noticed {{observation}} — prepared a quick redesign concept',
    variablesUsed: ['first_name', 'company', 'website', 'observation', 'offer', 'sender_name'],
    content: `Hi {{first_name}},

I came across {{company}} while reviewing leading providers in {{city | your area}} and spent some time on {{website}}.

I noticed {{observation}}.

We recently helped a similar organization improve their mobile conversion by 42% in under 3 weeks. To show you what is possible, our team prepared a {{offer}} customized for {{company}}.

Would you be open to a 10-minute preview call this Thursday or Friday to take a look?

No hard sell at all — just genuine value you can implement immediately.

Best regards,
{{sender_name}}
Outreach Hub Digital Growth`,
    createdAt: '2026-08-25T14:00:00Z',
    lastModified: '2026-09-12T09:00:00Z'
  },
  {
    id: 'tpl_05',
    name: 'Client Follow-Up #1: Case Study & Wireframe Preview',
    category: 'Follow-up',
    subject: 'Thought on {{company}} mobile conversion (quick 3-point breakdown)',
    previewText: 'Following up on our observation regarding {{website}}',
    variablesUsed: ['first_name', 'company', 'website', 'offer', 'sender_name'],
    content: `Hi {{first_name}},

Following up on my note from earlier this week regarding {{company}}'s digital presence on {{website}}.

I put together a 90-second screen recording demonstrating how streamlining your booking flow could capture an extra 15-20 qualified inquiries each month.

I would love to send the link over along with your {{offer}}.

Does your calendar have 10 minutes open either Tuesday or Wednesday morning?

Regards,
{{sender_name}}`,
    createdAt: '2026-08-28T16:00:00Z',
    lastModified: '2026-09-11T10:00:00Z'
  },
  {
    id: 'tpl_06',
    name: 'Client Follow-Up #2: Polite Breakup / Permission to Close File',
    category: 'Follow-up',
    subject: 'Permission to close your file for {{company}}?',
    previewText: 'Closing loop on our website redesign review',
    variablesUsed: ['first_name', 'company', 'sender_name'],
    content: `Hi {{first_name}},

I haven't heard back, which usually means improving {{company}}'s website conversions is not currently a priority — which is totally understandable with everything on your plate!

Unless you tell me otherwise, I will close out your file for now and won't crowd your inbox.

If this becomes relevant next quarter, you can always reach me directly right here.

Wishing you and {{company}} continued success!

Best,
{{sender_name}}`,
    createdAt: '2026-08-30T10:00:00Z',
    lastModified: '2026-09-02T11:00:00Z'
  },
  {
    id: 'tpl_07',
    name: 'Student Engineering Resource Pack',
    category: 'Student',
    subject: 'Complete 2026 Engineering Resource Pack for {{college}} {{department}}',
    previewText: 'Free access to GitHub Student Pack bonuses, cloud credits, and interview prep',
    variablesUsed: ['first_name', 'college', 'department', 'sender_name'],
    content: `Hi {{first_name}},

As part of our academic support initiative, we curated an all-in-one resource pack for {{department}} students at {{college}}:

Included free of charge:
• $300 in AWS and GCP educational cloud credits
• 120+ Curated Data Structure & Algorithm problem breakdowns with video explanations
• Verified System Design templates used by Silicon Valley engineering teams
• 1-Click resume scanner with ATS score optimization

Download your package: https://outreachhub.io/student-pack?inst={{college}}

Feel free to share this with your batchmates and study groups!

Best,
{{sender_name}}`,
    createdAt: '2026-09-01T08:00:00Z',
    lastModified: '2026-09-04T13:00:00Z'
  },
  {
    id: 'tpl_08',
    name: 'University Placement & Hackathon Partnership',
    category: 'Partnership',
    subject: 'Official Campus Partnership Proposal: {{college}} x Outreach Hub',
    previewText: 'Direct industry hiring pipeline and hackathon sponsorships',
    variablesUsed: ['first_name', 'college', 'role', 'sender_name'],
    content: `Dear {{first_name}},

Hope you are having a productive academic semester at {{college}}.

As {{role | faculty lead}}, you are dedicated to ensuring {{college}} students receive world-class career exposure. We would love to formally partner with your department to provide:

1. Guaranteed campus interview shortlists for top tech startups
2. $5,000 title sponsorship for your annual technical symposium
3. Guest lecture series featuring staff software engineers and product managers

Could we schedule a 15-minute introductory call next week with your department committee?

Sincerely,
{{sender_name}}
Head of University Partnerships`,
    createdAt: '2026-09-03T14:00:00Z',
    lastModified: '2026-09-07T16:00:00Z'
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp_01',
    name: 'HackTech 2026 National Launch',
    type: 'student',
    subject: 'HackTech 2026: $50,000 Prizes, Travel Grants & Mentors for {{college}}',
    previewText: 'Priority applications open for tech students at {{college}}',
    fromName: 'Jordan Blake',
    fromEmail: 'jordan@outreachhub.io',
    replyTo: 'hackathons@outreachhub.io',
    templateId: 'tpl_01',
    bodyHtml: `<p>Hi {{first_name}},</p><p>We are officially launching applications for HackTech 2026 for students at <strong>{{college}}</strong>!</p>`,
    bodyText: 'HackTech 2026 Announcement for students',
    status: 'Completed',
    sentAt: '2026-09-12T14:30:00Z',
    createdAt: '2026-09-10T10:00:00Z',
    audienceDescription: 'Stanford & MIT Computer Science & IT Students (Batch 2022-2027)',
    totalRecipients: 420,
    deliveredCount: 412,
    openedCount: 298,
    clickedCount: 164,
    repliedCount: 38,
    bouncedCount: 8,
    unsubscribedCount: 2,
    targetFilter: {
      contactType: 'Student',
      department: 'Computer Science'
    }
  },
  {
    id: 'cmp_02',
    name: 'Texas & West Coast Dental Clinic Redesign Pitch',
    type: 'client',
    subject: 'Quick idea for {{company}} website (mobile speed & booking drop-off)',
    previewText: 'Noticed {{observation}} — prepared a quick redesign concept',
    fromName: 'Jordan Blake',
    fromEmail: 'growth@apexoutreach.com',
    replyTo: 'jordan@apexoutreach.com',
    templateId: 'tpl_04',
    bodyHtml: `<p>Hi {{first_name}},</p><p>I noticed {{observation}} on {{website}} and prepared {{offer}}.</p>`,
    status: 'Completed',
    sentAt: '2026-09-11T14:00:00Z',
    createdAt: '2026-09-08T09:00:00Z',
    audienceDescription: 'Dental & MedSpa Practices in Austin, Dallas, and Seattle',
    totalRecipients: 85,
    deliveredCount: 83,
    openedCount: 52,
    clickedCount: 27,
    repliedCount: 14,
    bouncedCount: 2,
    unsubscribedCount: 1,
    targetFilter: {
      contactType: 'Client Lead',
      industry: 'Dental & Healthcare'
    }
  },
  {
    id: 'cmp_03',
    name: 'AfterClass Ambassador Recruitment Q4',
    type: 'student',
    subject: 'Introducing AfterClass: Exclusive tech resources for {{college}} engineers',
    fromName: 'University Fellowship Team',
    fromEmail: 'fellows@afterclass.io',
    templateId: 'tpl_02',
    bodyHtml: `<p>Hey {{first_name}},</p><p>Curated tech resources for students at {{college}}.</p>`,
    status: 'Completed',
    sentAt: '2026-09-13T10:00:00Z',
    createdAt: '2026-09-11T11:00:00Z',
    audienceDescription: 'All verified Engineering & Tech clubs across 4 Partner Universities',
    totalRecipients: 350,
    deliveredCount: 346,
    openedCount: 242,
    clickedCount: 118,
    repliedCount: 29,
    bouncedCount: 4,
    unsubscribedCount: 1,
    targetFilter: {
      contactType: 'Student'
    }
  },
  {
    id: 'cmp_04',
    name: 'Commercial Contractors Local SEO & Portal Campaign',
    type: 'client',
    subject: '{{company}} — emergency service dispatch & customer portal concept',
    fromName: 'Jordan Blake',
    fromEmail: 'growth@apexoutreach.com',
    templateId: 'tpl_04',
    bodyHtml: `<p>Hi {{first_name}},</p><p>We analyzed {{company}} and noticed {{observation}}.</p>`,
    status: 'Scheduled',
    scheduledAt: '2026-09-18T14:00:00Z',
    createdAt: '2026-09-14T15:00:00Z',
    audienceDescription: 'Commercial HVAC, Roofing, and Landscaping Leads',
    totalRecipients: 48,
    deliveredCount: 0,
    openedCount: 0,
    clickedCount: 0,
    repliedCount: 0,
    bouncedCount: 0,
    unsubscribedCount: 0,
    targetFilter: {
      contactType: 'Client Lead'
    }
  },
  {
    id: 'cmp_05',
    name: 'StudEarn Fall Micro-Internship Catalog',
    type: 'student',
    subject: 'StudEarn Opportunities: Remote student developer & design roles for {{college}}',
    fromName: 'StudEarn Student Ops',
    fromEmail: 'careers@studearn.com',
    templateId: 'tpl_03',
    bodyHtml: `<p>Hi {{first_name}},</p><p>Explore paid student roles at {{college}}.</p>`,
    status: 'Draft',
    createdAt: '2026-09-14T18:00:00Z',
    audienceDescription: '3rd & 4th Year Computer Science Students',
    totalRecipients: 190,
    deliveredCount: 0,
    openedCount: 0,
    clickedCount: 0,
    repliedCount: 0,
    bouncedCount: 0,
    unsubscribedCount: 0,
    targetFilter: {
      contactType: 'Student',
      year: '3rd Year'
    }
  },
  {
    id: 'cmp_06',
    name: 'Q4 Architectural & Design Studios Outreach',
    type: 'client',
    subject: 'Interactive 3D showcase idea for {{company}}',
    fromName: 'Jordan Blake',
    fromEmail: 'jordan@outreachhub.io',
    templateId: 'tpl_04',
    bodyHtml: `<p>Hi {{first_name}},</p><p>Review of {{website}}.</p>`,
    status: 'Sending',
    sentAt: '2026-09-15T02:00:00Z',
    createdAt: '2026-09-14T20:00:00Z',
    audienceDescription: 'Boutique Design & Architecture Principals',
    totalRecipients: 36,
    deliveredCount: 22,
    openedCount: 9,
    clickedCount: 4,
    repliedCount: 2,
    bouncedCount: 0,
    unsubscribedCount: 0,
    targetFilter: {
      contactType: 'Client Lead',
      industry: 'Architecture & Design'
    }
  }
];

export const INITIAL_SEQUENCES: Sequence[] = [
  {
    id: 'seq_01',
    name: 'Client High-Ticket Web Redesign Sequence (4 Steps)',
    description: 'Personalized 4-step sequence for local businesses with audit wireframe, video teaser, and breakup.',
    targetAudience: 'Client Lead',
    status: 'Active',
    activeEnrollments: 24,
    completedCount: 68,
    createdAt: '2026-08-20T10:00:00Z',
    stopConditions: ['If Lead Replies', 'If Lead Unsubscribes', 'If Email Bounces', 'If Converted to Won'],
    steps: [
      {
        id: 'st_1',
        stepNumber: 1,
        delayDays: 0,
        subject: 'Quick idea for {{company}} website (mobile speed & booking drop-off)',
        content: 'Hi {{first_name}},\n\nI came across {{company}} and noticed {{observation}}.\n\nWe prepared a custom {{offer}} for your team.',
        actionType: 'email'
      },
      {
        id: 'st_2',
        stepNumber: 2,
        delayDays: 3,
        subject: 'Thought on {{company}} mobile conversion (quick 3-point breakdown)',
        content: 'Hi {{first_name}},\n\nFollowing up on my note regarding {{company}} on {{website}}.\n\nI put together a quick wireframe showing how to fix the booking drop-off.',
        actionType: 'email'
      },
      {
        id: 'st_3',
        stepNumber: 3,
        delayDays: 4,
        subject: 'Client case study: +42% appointment conversions in 20 days',
        content: 'Hi {{first_name}},\n\nSharing how we tackled this exact mobile bottleneck for another team in your industry.',
        actionType: 'email'
      },
      {
        id: 'st_4',
        stepNumber: 4,
        delayDays: 7,
        subject: 'Permission to close your file for {{company}}?',
        content: 'Hi {{first_name}},\n\nAssuming this is not on your priority radar right now! I will close your file for now unless you say otherwise.',
        actionType: 'email'
      }
    ]
  },
  {
    id: 'seq_02',
    name: 'Student Hackathon Team Mentorship & Follow-Up',
    description: 'Automated guidance for registered campus hackathon leads leading up to demo day.',
    targetAudience: 'Student',
    status: 'Active',
    activeEnrollments: 142,
    completedCount: 310,
    createdAt: '2026-08-25T11:00:00Z',
    stopConditions: ['If Student Replies', 'If Unsubscribed', 'If Bounced'],
    steps: [
      {
        id: 'st_21',
        stepNumber: 1,
        delayDays: 0,
        subject: 'Welcome to HackTech 2026 — Discord Invite & Starter Kits for {{college}}',
        content: 'Hey {{first_name}},\n\nWelcome to HackTech 2026! Join our private Discord server to find teammates and mentor office hours.',
        actionType: 'email'
      },
      {
        id: 'st_22',
        stepNumber: 2,
        delayDays: 4,
        subject: 'API keys, credits, and sponsor challenges announced!',
        content: 'Hi {{first_name}},\n\nAll sponsor challenge briefs (with $15k in direct bounty cash) are live.',
        actionType: 'email'
      },
      {
        id: 'st_23',
        stepNumber: 3,
        delayDays: 5,
        subject: 'Reminder: Project submission deadline and pitch guidelines',
        content: 'Hey {{first_name}},\n\nDemo day is coming up! Here is the checklist to ensure your pitch gets seen by VC judges.',
        actionType: 'email'
      }
    ]
  },
  {
    id: 'seq_03',
    name: 'B2B Inactive Lead Re-Engagement (Win-Back)',
    description: 'Quarterly touchpoint for cold leads who expressed interest in the past.',
    targetAudience: 'Client Lead',
    status: 'Active',
    activeEnrollments: 12,
    completedCount: 45,
    createdAt: '2026-09-01T12:00:00Z',
    stopConditions: ['If Lead Replies', 'If Unsubscribed', 'If Bounced'],
    steps: [
      {
        id: 'st_31',
        stepNumber: 1,
        delayDays: 0,
        subject: 'Checking in on {{company}} — new benchmarks for Q4',
        content: 'Hi {{first_name}},\n\nTouching base to see if website improvements for {{company}} are back on the table for Q4 planning.',
        actionType: 'email'
      },
      {
        id: 'st_32',
        stepNumber: 2,
        delayDays: 7,
        subject: 'Free 2026 Speed & SEO Health Check for {{website}}',
        content: 'Hi {{first_name}},\n\nWe just updated our site auditing tool. Here is a complimentary report for {{company}}.',
        actionType: 'email'
      }
    ]
  }
];

export const INITIAL_SEGMENTS: Segment[] = [
  {
    id: 'seg_01',
    name: 'Stanford CS & IT Students',
    description: 'Active computer science and information technology students at Stanford Tech Institute',
    contactType: 'Student',
    filterCriteria: {
      college: 'Stanford Tech Institute',
      department: 'Computer Science'
    },
    contactCount: 6,
    createdAt: '2026-08-15T10:00:00Z'
  },
  {
    id: 'seg_02',
    name: 'High-Ticket Health & Dental Leads',
    description: 'Local dental, aesthetic and medical practice directors in Texas and West Coast',
    contactType: 'Client Lead',
    filterCriteria: {
      industry: 'Dental & Healthcare'
    },
    contactCount: 5,
    createdAt: '2026-08-20T14:00:00Z'
  },
  {
    id: 'seg_03',
    name: 'Batch 2023-2027 Sophomore Cohort',
    description: 'Students across all campuses entering their 2nd year of undergraduate studies',
    contactType: 'Student',
    filterCriteria: {
      batch: '2023-2027'
    },
    contactCount: 14,
    createdAt: '2026-08-25T09:00:00Z'
  },
  {
    id: 'seg_04',
    name: 'Active Pipeline Deals (Meeting & Proposal)',
    description: 'Client leads currently in active negotiation or meeting stages',
    contactType: 'Client Lead',
    filterCriteria: {
      status: 'Contacted'
    },
    contactCount: 7,
    createdAt: '2026-09-02T16:00:00Z'
  }
];

export const INITIAL_SUPPRESSION: SuppressionEntry[] = [
  {
    id: 'sup_01',
    email: 'samantha@claritymentalhealth.org',
    reason: 'Unsubscribed',
    date: '2026-09-02T14:10:00Z',
    source: 'Unsubscribe Link Header'
  },
  {
    id: 'sup_02',
    email: 'bounce@oldcollegedomain.edu',
    reason: 'Hard bounce',
    date: '2026-09-12T14:31:00Z',
    source: 'SMTP 550 Mailbox Not Found'
  },
  {
    id: 'sup_03',
    email: 'spam-trap@competitorwatch.com',
    reason: 'Spam complaint',
    date: '2026-08-24T18:00:00Z',
    source: 'Feedback Loop (FBL)'
  },
  {
    id: 'sup_04',
    email: 'alex.former@retiredpracticemail.com',
    reason: 'Manually suppressed',
    date: '2026-09-05T10:00:00Z',
    source: 'User Manual Entry'
  },
  {
    id: 'sup_05',
    email: 'info@donotcontact-firm.org',
    reason: 'Manually suppressed',
    date: '2026-09-08T09:30:00Z',
    source: 'Legal / Compliance Request'
  }
];

export const INITIAL_DOMAINS: SendingDomain[] = [
  {
    id: 'dom_01',
    domain: 'mail.outreachhub.io',
    spf: true,
    dkim: true,
    dmarc: true,
    verified: true,
    defaultFrom: 'Jordan Blake <jordan@outreachhub.io>'
  },
  {
    id: 'dom_02',
    domain: 'updates.afterclass.io',
    spf: true,
    dkim: true,
    dmarc: true,
    verified: true,
    defaultFrom: 'AfterClass Community <fellows@afterclass.io>'
  },
  {
    id: 'dom_03',
    domain: 'careers.studearn.com',
    spf: true,
    dkim: true,
    dmarc: false,
    verified: false,
    defaultFrom: 'StudEarn Opportunities <careers@studearn.com>'
  }
];

export const INITIAL_PROVIDER_SETTINGS: ProviderSettings = {
  activeProvider: 'mock',
  mockDelayMs: 350,
  simulateEvents: true,
  resendApiKey: '',
  sesAccessKeyId: '',
  sesSecretKey: '',
  sesRegion: 'us-east-1',
  sendgridApiKey: '',
};

export const INITIAL_EVENTS: EmailEvent[] = [
  {
    id: 'evt_01',
    contactId: 'std_02',
    contactName: 'Diya Patel',
    contactEmail: 'diya.patel@stanfordtech.edu',
    campaignId: 'cmp_01',
    campaignName: 'HackTech 2026 National Launch',
    eventType: 'replied',
    timestamp: '2026-09-13T09:12:00Z',
    details: 'Diya replied: "Can students from non-CSE branches join our team? We have an ECE hardware designer."',
    subject: 'Re: HackTech 2026: $50,000 Prizes, Travel Grants & Mentors for Stanford Tech'
  },
  {
    id: 'evt_02',
    contactId: 'cld_01',
    contactName: 'David Sterling',
    contactEmail: 'david@apexdentalcare.com',
    campaignId: 'cmp_02',
    campaignName: 'Texas & West Coast Dental Clinic Redesign Pitch',
    eventType: 'replied',
    timestamp: '2026-09-13T16:20:00Z',
    details: 'David replied: "Hey Jordan, the mobile dropoff point hit home. Send through the preview mockup video."',
    subject: 'Re: Quick idea for Apex Dental Care Clinic website (mobile speed & booking drop-off)'
  },
  {
    id: 'evt_03',
    contactId: 'cld_06',
    contactName: 'Rebecca Torres',
    contactEmail: 'rebecca@coastalfitnesstx.com',
    campaignId: 'cmp_02',
    campaignName: 'Texas & West Coast Dental Clinic Redesign Pitch',
    eventType: 'opened',
    timestamp: '2026-09-12T18:35:00Z',
    details: 'Opened on Apple Mail (macOS)'
  },
  {
    id: 'evt_04',
    contactId: 'cld_06',
    contactName: 'Rebecca Torres',
    contactEmail: 'rebecca@coastalfitnesstx.com',
    campaignId: 'cmp_02',
    campaignName: 'Texas & West Coast Dental Clinic Redesign Pitch',
    eventType: 'replied',
    timestamp: '2026-09-12T18:40:00Z',
    details: 'Rebecca replied: "Yes! That PDF schedule has been driving us crazy. What would fixing this look like?"',
    subject: 'Re: Quick idea for Coastal Elite Fitness Gyms website'
  },
  {
    id: 'evt_05',
    contactId: 'std_03',
    contactName: 'Rohan Verma',
    contactEmail: 'rohan.v@mitengineering.edu',
    campaignId: 'cmp_01',
    campaignName: 'HackTech 2026 National Launch',
    eventType: 'clicked',
    timestamp: '2026-09-12T16:45:00Z',
    details: 'Clicked registration link: https://hacktech.org/register'
  },
  {
    id: 'evt_06',
    contactId: 'std_06',
    contactName: 'Kavita Reddy',
    contactEmail: 'kavita.reddy@berkeleyscience.edu',
    campaignId: 'cmp_01',
    campaignName: 'HackTech 2026 National Launch',
    eventType: 'replied',
    timestamp: '2026-09-13T10:15:00Z',
    details: 'Kavita replied: "Our ACM chapter would love to host a satellite hack watch party. Can we connect?"',
    subject: 'Re: HackTech 2026: Satellite Chapter hosting'
  },
  {
    id: 'evt_07',
    contactId: 'cld_10',
    contactName: 'Jessica Huang',
    contactEmail: 'jessica@pureglowmedspa.com',
    campaignId: 'cmp_02',
    campaignName: 'Texas & West Coast Dental Clinic Redesign Pitch',
    eventType: 'replied',
    timestamp: '2026-09-14T15:10:00Z',
    details: 'Jessica replied: "Thursday 2pm works for me to review the VIP booking flow."',
    subject: 'Re: Quick idea for PureGlow Aesthetics & MedSpa website'
  },
  {
    id: 'evt_08',
    contactId: 'std_08',
    contactName: 'Meera Nambiar',
    contactEmail: 'meera.n@austintech.edu',
    campaignId: 'cmp_03',
    campaignName: 'AfterClass Ambassador Recruitment Q4',
    eventType: 'replied',
    timestamp: '2026-09-14T08:30:00Z',
    details: 'Meera replied: "Applied for the AI fellowship. When will interviews be scheduled?"',
    subject: 'Re: Introducing AfterClass: Exclusive tech resources for Austin Tech'
  },
  {
    id: 'evt_09',
    contactId: 'std_01',
    contactName: 'Aarav Sharma',
    contactEmail: 'aarav.sharma@stanfordtech.edu',
    campaignId: 'cmp_01',
    campaignName: 'HackTech 2026 National Launch',
    eventType: 'delivered',
    timestamp: '2026-09-12T14:30:15Z',
    details: 'Delivered to mx.stanfordtech.edu'
  },
  {
    id: 'evt_10',
    contactId: 'std_01',
    contactName: 'Aarav Sharma',
    contactEmail: 'aarav.sharma@stanfordtech.edu',
    campaignId: 'cmp_01',
    campaignName: 'HackTech 2026 National Launch',
    eventType: 'opened',
    timestamp: '2026-09-12T14:42:00Z',
    details: 'Opened on Chrome (Desktop)'
  }
];
