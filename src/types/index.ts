export type RishikulEducationType = 'UG' | 'PG' | 'BOTH';

export type JobType = 'Private Practice' | 'Govt Job' | 'Retired' | 'Teaching / Academia' | 'Corporate / Industry' | 'Other';

export type MembershipTier = 'Non-Paid Member' | 'Life Member' | 'Patron Member' | 'Annual Member' | 'Student Member' | 'Honorary Fellow';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'expired';

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

export interface WorkExperience {
  id: string;
  institution: string; // Workplace / Hospital / Clinic
  designation: string;
  fromYear: string;
  toYear: string; // or "Present"
  location: string;
  description?: string;
}

export type FamilyRelationType = 'Spouse' | 'Father' | 'Mother' | 'Brother' | 'Sister' | 'Son' | 'Daughter' | 'Relative';

export interface AlumniFamilyRelation {
  relatedAlumniId: string;
  relationType: FamilyRelationType;
}

export interface AlumniProfile {
  id: string;
  fullName: string;
  fullNameHindi?: string;
  username: string; // for login
  passwordHash?: string;
  email: string;
  mobile: string;
  whatsappNumber: string;
  dateOfBirth: string; // YYYY-MM-DD
  avatarUrl?: string; // photo max 50kb
  
  // Education at Rishikul (UG / PG / BOTH)
  rishikulEducation: RishikulEducationType;
  ugBatchYear?: number;
  pgBatchYear?: number;
  batchYear?: number; // helper
  ugDegree?: string;
  pgDegree?: string;
  degree?: string; // helper
  specialization?: Specialization;
  
  // Ayurveda Clinical Specialization & Guru-Shishya Mentorship
  diseaseSpecialty?: string; // e.g. "Arsha, Bhagandara & Fistula-in-Ano", "Sandhivata / Rheumatoid Arthritis", "Psoriasis / Kushta Roga"
  specialtyDescription?: string; // Detailed clinical protocol / experience
  acceptingShishya?: boolean; // If they want to teach their clinical specialty to juniors
  shishyaRequirement?: string; // Guidance note for prospective shishyas
  
  // Job & Professional Details
  jobType: JobType;
  designation: string;
  workplace: string;
  
  // Address & Location
  city: string;
  state: string;
  address?: string;
  country: string;

  // Bio & Achievements
  bio?: string;
  achievements?: string[];
  bloodGroup?: string;

  // Facebook-like Extended Profile Fields
  workHistory?: WorkExperience[]; // work experiences from... to...
  familyAlumniRelations?: AlumniFamilyRelation[]; // e.g. Wife, Son, Brother who are also alumni
  teacherAlumniIds?: string[]; // teachers who taught them at Rishikul
  connectedAlumniIds?: string[]; // batchmate / colleague friends

  // Decease / Expired Tracking by Admin
  isDeceased?: boolean;
  dateOfDemise?: string; // YYYY-MM-DD
  demiseTribute?: string;

  // Membership & Governance
  membershipId: string;
  membershipTier: MembershipTier;
  isVerified: boolean;
  approvalStatus: ApprovalStatus;
  joinedDate: string;
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
  alumniId?: string; // linked if marked from registered list
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

export interface CommunityAchievement {
  id: string;
  authorId: string;
  authorName: string;
  authorBatchText: string;
  authorAvatar?: string;
  authorCity: string;
  title: string;
  details: string;
  category: 'Award & Honor' | 'Clinical Breakthrough' | 'Research Publication' | 'Social & Community Service' | 'Book / Literature' | 'Other';
  datePosted: string;
  likesCount?: number;
}
