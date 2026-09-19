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
  | 'Roganidan evum Vikriti Vigyan (Pathology & Diagnostics)'
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

export type SpecialAchievementType = 
  | 'Gold Medalist (UG)'
  | 'Gold Medalist (PG)'
  | 'Subject Topper / Merit'
  | 'University Rank Holder'
  | 'State / National Award'
  | 'Research / Clinical Breakthrough'
  | 'Other Special Honor';

export interface SpecialAchievement {
  id: string;
  title: string; // e.g., "Gold Medalist in Dravyaguna (UG 2014)"
  type: SpecialAchievementType;
  subjectOrField?: string; // e.g., "Dravyaguna", "Shalya Tantra", "Overall Batch Topper"
  year?: string; // e.g., "2014"
  awardedBy?: string; // e.g., "Uttarakhand Ayurved University / HNBGU"
  description?: string; // Optional description
}

export interface AlumniProfile {
  id: string;
  fullName: string;
  fullNameHindi?: string;
  gender?: 'Male' | 'Female' | 'Other' | string;
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
  ugPassoutYear?: number;
  pgBatchYear?: number;
  pgPassoutYear?: number;
  batchYear?: number; // helper
  ugDegree?: string;
  pgDegree?: string;
  degree?: string; // helper
  specialization?: Specialization;
  
  // Ayurveda Clinical Specialization & Guru-Shishya Mentorship
  isExpert?: boolean; // explicitly registered as an Ayurveda clinical expert/guru
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
  specialAchievements?: SpecialAchievement[]; // Gold medals, subject toppers, honors
  bloodGroup?: string;

  // Facebook-like Extended Profile Fields
  coverUrl?: string; // cover/banner photo
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
  orderIndex?: number;
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
  alumniId: string;
  alumniName: string;
  alumniBatch?: string;
  alumniCity?: string;
  alumniAvatar?: string;
  title: string;
  details: string;
  category: 'Award & Honor' | 'Clinical Breakthrough' | 'Research Publication' | 'Social & Community Service' | 'Book / Literature' | 'Other';
  datePosted: string;
  likesCount?: number;
}

export interface AchieverNomination {
  id: string;
  nomineeId?: string;         // linked alumni profile id
  nomineeName: string;
  nomineeNameHindi?: string;
  nomineeDegree?: string;
  nomineeBatchYear?: number;
  nomineeWorkplace?: string;
  nomineeCity?: string;
  nomineePhotoUrl?: string;

  achievementTitle: string;
  citation: string;
  awards?: string[];

  nominatorId: string;
  nominatorName: string;
  nominatorEmail?: string;
  nominatorMobile?: string;
  nominatorBatchText?: string;

  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  adminRemarks?: string;
}

// ---------------------------------------------------------------------------
// Community Showcase & Gallery Types (Additive)
// ---------------------------------------------------------------------------

export type PostContentType =
  | 'text'
  | 'photo'
  | 'video'
  | 'poem'
  | 'article'
  | 'research'
  | 'artwork'
  | 'document'
  | 'memory'
  | 'link'
  | 'other';

export interface PostComment {
  id: string;
  postId: string;
  userId: string;
  authorName: string;
  authorAvatar?: string;
  authorBatch?: string;
  content: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  actorId?: string;
  actorName: string;
  actorAvatar?: string;
  type: 'connection_request' | 'connection_accepted' | 'post_like' | 'post_comment' | 'birthday' | 'announcement' | 'event';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ConnectionRequestItem {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  senderProfile?: AlumniProfile;
}

export interface BirthdayWishItem {
  id: string;
  recipientId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderUgBatchYear?: string;
  senderPgBatchYear?: string;
  message?: string;
  createdAt: string;
}

export type PostCategory =
  | 'All'
  | 'Photos'
  | 'Videos'
  | 'Research'
  | 'Articles'
  | 'Poems'
  | 'Artwork'
  | 'Documents'
  | 'Memories'
  | 'Other';

export interface CommunityPost {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar?: string;
  authorBatch?: string;
  title: string;
  description?: string;
  contentType: PostContentType;
  category: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  externalUrl?: string;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
  relatedBatch?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  pinOrder?: number;
  pinnedAt?: string;
  pinnedBy?: string;
  isHidden: boolean;
  cloudinaryPublicId?: string;
  likesCount?: number;
  reportsCount?: number;
}

export interface CommunityPostReport {
  id: string;
  postId: string;
  postTitle?: string;
  reporterId: string;
  reporterName: string;
  reason:
    | 'Inappropriate content'
    | 'Copyright concern'
    | 'Privacy concern'
    | 'Spam'
    | 'Incorrect information'
    | 'Other';
  details?: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  createdAt: string;
}

