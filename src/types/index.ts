export type RishikulEducationType = 'UG' | 'PG' | 'BOTH';

export type JobType = 'Private Practice' | 'Govt Job' | 'Retired' | 'Teaching / Academia' | 'Corporate / Industry' | 'Other';

export type MembershipTier = 'Non-Paid Member' | 'Life Member' | 'Patron Member' | 'Annual Member' | 'Student Member' | 'Honorary Fellow';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export type Specialization = 
  | 'Kayachikitsa (Internal Medicine)'
  | 'Panchakarma'
  | 'Shalya Tantra (Surgery)'
  | 'Shalakya Tantra (ENT & Ophthalmology)'
  | 'Prasuti & Stri Roga (Obstetrics & Gynecology)'
  | 'Kaumarbhritya (Pediatrics)'
  | 'Dravyaguna (Pharmacology)'
  | 'Rasa Shastra & Bhaishajya Kalpana'
  | 'Sharir Kriya (Physiology)'
  | 'Sharir Rachana (Anatomy)'
  | 'Samhita & Siddhanta'
  | 'Swasthavritta & Yoga'
  | 'Agada Tantra (Toxicology)'
  | 'General Ayurvedic Practice';

export interface AlumniProfile {
  id: string;
  fullName: string;
  fullNameHindi?: string;
  username: string; // for login
  passwordHash?: string; // stored credentials
  email: string;
  mobile: string;
  whatsappNumber: string;
  dateOfBirth: string; // YYYY-MM-DD
  avatarUrl?: string; // photo max 50kb
  
  // Education at Rishikul (UG / PG / BOTH)
  rishikulEducation: RishikulEducationType;
  ugBatchYear?: number; // e.g. 1992
  pgBatchYear?: number; // e.g. 1998
  batchYear?: number; // fallback helper
  ugDegree?: string; // e.g. BAMS
  pgDegree?: string; // e.g. MD (Ayurveda), MS (Ayurveda)
  degree?: string; // fallback helper
  specialization: Specialization;
  
  // Job & Professional Details
  jobType: JobType;
  designation: string;
  workplace: string; // Institution / Hospital / Clinic name
  
  // Address & Location
  city: string;
  state: string;
  address?: string;
  country: string;

  // Bio & Achievements
  bio?: string;
  achievements?: string[];
  bloodGroup?: string;

  // Membership & Governance
  membershipId: string;
  membershipTier: MembershipTier;
  isVerified: boolean;
  approvalStatus: ApprovalStatus;
  joinedDate: string;
  connectedAlumniIds?: string[];
}

export interface PasswordResetRequest {
  id: string;
  alumniId: string;
  fullName: string;
  username: string;
  mobile: string;
  email: string;
  requestedAt: string;
  status: 'pending' | 'resolved';
  newPasswordAssigned?: string;
}

export interface LifetimeAchiever {
  id: string;
  name: string;
  nameHindi?: string;
  batchYear: number;
  degree: string;
  photoUrl: string;
  title: string;
  citation: string;
  awards: string[];
  currentRole: string;
  orderIndex: number;
}

export interface ShradhanjaliRecord {
  id: string;
  name: string;
  nameHindi?: string;
  batchYear: number;
  degree: string;
  photoUrl: string;
  dateOfDemise: string;
  tribute: string;
  condolencesCount: number;
  postedBy?: string;
}

export interface AssociationEvent {
  id: string;
  title: string;
  titleHindi?: string;
  slug: string;
  eventType: 'Annual Reunion' | 'CME Conference' | 'Silver Jubilee' | 'Webinar' | 'General Body Meeting';
  date: string;
  time: string;
  venue: string;
  city: string;
  isOnline: boolean;
  registrationOpen: boolean;
  registrationFee: string;
  description: string;
  chiefGuest?: string;
  bannerUrl: string;
  attendeesCount: number;
  schedule?: { time: string; activity: string }[];
}

export interface ExecutiveMember {
  id: string;
  name: string;
  role: string;
  batch: string;
  photo: string;
  location: string;
  message?: string;
}

export interface DirectoryFilterState {
  searchQuery: string;
  educationFilter: 'ALL' | 'UG' | 'PG' | 'BOTH';
  ugBatchYear: string;
  pgBatchYear: string;
  specialization: string;
  jobType: string;
  state: string;
  city: string;
  membershipTier: string;
}
