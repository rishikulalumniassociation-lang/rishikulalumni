// ============================================================
// store.ts — ALL data via Supabase PostgreSQL (no localStorage)
// ============================================================
import { supabase } from "./supabase";
import {
  AlumniProfile,
  LifetimeAchiever,
  ShradhanjaliRecord,
  PasswordResetRequest,
  CommunityAchievement,
  AssociationEvent,
  AchieverNomination,
} from "@/types";

// ---------------------------------------------------------------------------
// Helpers: camelCase ↔ snake_case field mapping
// ---------------------------------------------------------------------------

function rowToProfile(row: Record<string, unknown>): AlumniProfile {
  return {
    id: row.id as string,
    fullName: row.full_name as string,
    fullNameHindi: row.full_name_hindi as string | undefined,
    username: row.username as string,
    passwordHash: row.password_hash as string,
    email: row.email as string,
    mobile: row.mobile as string,
    whatsappNumber: row.whatsapp_number as string,
    dateOfBirth: row.date_of_birth as string,
    avatarUrl: row.avatar_url as string | undefined,
    rishikulEducation: row.rishikul_education as AlumniProfile["rishikulEducation"],
    ugBatchYear: row.ug_batch_year as number | undefined,
    ugDegree: row.ug_degree as string | undefined,
    pgBatchYear: row.pg_batch_year as number | undefined,
    pgDegree: row.pg_degree as string | undefined,
    specialization: row.specialization as AlumniProfile["specialization"],
    isExpert: row.is_expert as boolean | undefined,
    diseaseSpecialty: row.disease_specialty as string | undefined,
    specialtyDescription: row.specialty_description as string | undefined,
    acceptingShishya: row.accepting_shishya as boolean | undefined,
    shishyaRequirement: row.shishya_requirement as string | undefined,
    jobType: row.job_type as AlumniProfile["jobType"],
    designation: row.designation as string,
    workplace: row.workplace as string,
    city: row.city as string,
    state: row.state as string,
    address: row.address as string | undefined,
    country: row.country as string,
    bio: row.bio as string | undefined,
    bloodGroup: row.blood_group as string | undefined,
    achievements: row.achievements as string[] | undefined,
    specialAchievements: (row.special_achievements as unknown[] | undefined) as AlumniProfile["specialAchievements"],
    workHistory: (row.work_history as unknown[] | undefined) as AlumniProfile["workHistory"],
    familyAlumniRelations: (row.family_alumni_relations as unknown[] | undefined) as AlumniProfile["familyAlumniRelations"],
    teacherAlumniIds: row.teacher_alumni_ids as string[] | undefined,
    connectedAlumniIds: row.connected_alumni_ids as string[] | undefined,
    isDeceased: row.is_deceased as boolean | undefined,
    dateOfDemise: row.date_of_demise as string | undefined,
    demiseTribute: row.demise_tribute as string | undefined,
    membershipId: row.membership_id as string,
    membershipTier: row.membership_tier as AlumniProfile["membershipTier"],
    isVerified: row.is_verified as boolean,
    approvalStatus: row.approval_status as AlumniProfile["approvalStatus"],
    joinedDate: row.joined_date as string,
  };
}

function profileToRow(p: AlumniProfile): Record<string, unknown> {
  return {
    id: p.id,
    full_name: p.fullName,
    full_name_hindi: p.fullNameHindi ?? null,
    username: p.username,
    password_hash: p.passwordHash ?? "",
    email: p.email ?? null,
    mobile: p.mobile,
    whatsapp_number: p.whatsappNumber,
    date_of_birth: p.dateOfBirth,
    avatar_url: p.avatarUrl ?? null,
    rishikul_education: p.rishikulEducation,
    ug_batch_year: p.ugBatchYear ?? null,
    ug_degree: p.ugDegree ?? null,
    pg_batch_year: p.pgBatchYear ?? null,
    pg_degree: p.pgDegree ?? null,
    specialization: p.specialization ?? null,
    is_expert: p.isExpert ?? false,
    disease_specialty: p.diseaseSpecialty ?? null,
    specialty_description: p.specialtyDescription ?? null,
    accepting_shishya: p.acceptingShishya ?? false,
    shishya_requirement: p.shishyaRequirement ?? null,
    job_type: p.jobType,
    designation: p.designation ?? null,
    workplace: p.workplace ?? null,
    city: p.city,
    state: p.state,
    address: p.address ?? null,
    country: p.country ?? "India",
    bio: p.bio ?? null,
    blood_group: p.bloodGroup ?? null,
    achievements: p.achievements ?? [],
    special_achievements: p.specialAchievements ?? [],
    work_history: p.workHistory ?? [],
    family_alumni_relations: p.familyAlumniRelations ?? [],
    teacher_alumni_ids: p.teacherAlumniIds ?? [],
    connected_alumni_ids: p.connectedAlumniIds ?? [],
    is_deceased: p.isDeceased ?? false,
    date_of_demise: p.dateOfDemise ?? null,
    demise_tribute: p.demiseTribute ?? null,
    membership_id: p.membershipId,
    membership_tier: p.membershipTier,
    is_verified: p.isVerified,
    approval_status: p.approvalStatus,
    joined_date: p.joinedDate,
  };
}

function rowToAchiever(row: Record<string, unknown>): LifetimeAchiever {
  return {
    id: row.id as string,
    name: row.name as string,
    nameHindi: row.name_hindi as string | undefined,
    batchYear: row.batch_year as number,
    degree: row.degree as string,
    photoUrl: row.photo_url as string,
    title: row.title as string,
    citation: row.citation as string,
    awards: row.awards as string[],
    currentRole: row.current_role as string,
    orderIndex: row.order_index as number | undefined,
  };
}

function rowToShradhanjali(row: Record<string, unknown>): ShradhanjaliRecord {
  return {
    id: row.id as string,
    alumniId: row.alumni_id as string | undefined,
    name: row.name as string,
    nameHindi: row.name_hindi as string | undefined,
    batchYear: row.batch_year as number,
    degree: row.degree as string,
    photoUrl: row.photo_url as string,
    dateOfDemise: row.date_of_demise as string,
    tribute: row.tribute as string,
    condolencesCount: row.condolences_count as number,
    postedBy: row.posted_by as string,
  };
}

function rowToPasswordReset(row: Record<string, unknown>): PasswordResetRequest {
  return {
    id: row.id as string,
    alumniId: row.alumni_id as string,
    fullName: row.full_name as string,
    username: row.username as string,
    mobile: row.mobile as string,
    email: row.email as string,
    requestedAt: row.requested_at as string,
    status: row.status as "pending" | "resolved",
    newPasswordAssigned: row.new_password_assigned as string | undefined,
  };
}

function rowToNomination(row: Record<string, unknown>): AchieverNomination {
  return {
    id: row.id as string,
    nomineeName: row.nominee_name as string,
    nomineeNameHindi: row.nominee_name_hindi as string | undefined,
    nomineeId: row.nominee_id as string | undefined,
    nomineeBatchYear: row.nominee_batch_year as number | undefined,
    nomineeDegree: row.nominee_degree as string | undefined,
    nomineePhotoUrl: row.nominee_photo_url as string | undefined,
    nomineeWorkplace: row.nominee_workplace as string | undefined,
    nomineeCity: row.nominee_city as string | undefined,
    achievementTitle: row.achievement_title as string,
    citation: row.citation as string,
    awards: row.awards as string[] | undefined,
    nominatorId: row.nominator_id as string,
    nominatorName: row.nominator_name as string,
    submittedAt: row.submitted_at as string,
    status: row.status as AchieverNomination["status"],
    adminRemarks: row.admin_remarks as string | undefined,
  };
}

function rowToCommunityAchievement(row: Record<string, unknown>): CommunityAchievement {
  return {
    id: row.id as string,
    alumniId: row.alumni_id as string,
    alumniName: row.alumni_name as string,
    alumniBatch: row.alumni_batch as string | undefined,
    alumniCity: row.alumni_city as string | undefined,
    alumniAvatar: row.alumni_avatar as string | undefined,
    title: row.title as string,
    category: row.category as CommunityAchievement["category"],
    details: row.details as string,
    datePosted: row.date_posted as string,
    likesCount: row.likes_count as number,
  };
}

// ---------------------------------------------------------------------------
// ALUMNI PROFILES
// ---------------------------------------------------------------------------

export async function getAlumniList(): Promise<AlumniProfile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { console.error("getAlumniList:", error.message); return []; }
  return (data ?? []).map(rowToProfile);
}

export async function saveAlumniList(list: AlumniProfile[]): Promise<void> {
  // Used only by admin bulk operations — upsert full list
  for (const profile of list) {
    await supabase.from("profiles").upsert(profileToRow(profile), { onConflict: "id" });
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event("alumni_updated"));
}

export async function getAlumniById(id: string): Promise<AlumniProfile | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
  if (error || !data) return null;
  return rowToProfile(data as Record<string, unknown>);
}

export async function getAlumniByUsername(username: string): Promise<AlumniProfile | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("username", username).single();
  if (error || !data) return null;
  return rowToProfile(data as Record<string, unknown>);
}

export async function registerAlumni(profile: AlumniProfile): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("profiles").insert(profileToRow(profile));
  if (error) return { success: false, error: error.message };
  if (typeof window !== "undefined") window.dispatchEvent(new Event("alumni_updated"));
  return { success: true };
}

export async function updateAlumniProfile(id: string, updates: Partial<AlumniProfile>): Promise<void> {
  // Build snake_case update object
  const snakeUpdates: Record<string, unknown> = {};
  if (updates.fullName !== undefined) snakeUpdates.full_name = updates.fullName;
  if (updates.fullNameHindi !== undefined) snakeUpdates.full_name_hindi = updates.fullNameHindi;
  if (updates.email !== undefined) snakeUpdates.email = updates.email;
  if (updates.mobile !== undefined) snakeUpdates.mobile = updates.mobile;
  if (updates.whatsappNumber !== undefined) snakeUpdates.whatsapp_number = updates.whatsappNumber;
  if (updates.avatarUrl !== undefined) snakeUpdates.avatar_url = updates.avatarUrl;
  if (updates.bio !== undefined) snakeUpdates.bio = updates.bio;
  if (updates.bloodGroup !== undefined) snakeUpdates.blood_group = updates.bloodGroup;
  if (updates.designation !== undefined) snakeUpdates.designation = updates.designation;
  if (updates.workplace !== undefined) snakeUpdates.workplace = updates.workplace;
  if (updates.city !== undefined) snakeUpdates.city = updates.city;
  if (updates.state !== undefined) snakeUpdates.state = updates.state;
  if (updates.address !== undefined) snakeUpdates.address = updates.address;
  if (updates.country !== undefined) snakeUpdates.country = updates.country;
  if (updates.jobType !== undefined) snakeUpdates.job_type = updates.jobType;
  if (updates.isExpert !== undefined) snakeUpdates.is_expert = updates.isExpert;
  if (updates.diseaseSpecialty !== undefined) snakeUpdates.disease_specialty = updates.diseaseSpecialty;
  if (updates.specialtyDescription !== undefined) snakeUpdates.specialty_description = updates.specialtyDescription;
  if (updates.acceptingShishya !== undefined) snakeUpdates.accepting_shishya = updates.acceptingShishya;
  if (updates.shishyaRequirement !== undefined) snakeUpdates.shishya_requirement = updates.shishyaRequirement;
  if (updates.workHistory !== undefined) snakeUpdates.work_history = updates.workHistory;
  if (updates.familyAlumniRelations !== undefined) snakeUpdates.family_alumni_relations = updates.familyAlumniRelations;
  if (updates.teacherAlumniIds !== undefined) snakeUpdates.teacher_alumni_ids = updates.teacherAlumniIds;
  if (updates.connectedAlumniIds !== undefined) snakeUpdates.connected_alumni_ids = updates.connectedAlumniIds;
  if (updates.specialAchievements !== undefined) snakeUpdates.special_achievements = updates.specialAchievements;
  if (updates.isVerified !== undefined) snakeUpdates.is_verified = updates.isVerified;
  if (updates.approvalStatus !== undefined) snakeUpdates.approval_status = updates.approvalStatus;
  if (updates.membershipTier !== undefined) snakeUpdates.membership_tier = updates.membershipTier;
  if (updates.isDeceased !== undefined) snakeUpdates.is_deceased = updates.isDeceased;
  if (updates.dateOfDemise !== undefined) snakeUpdates.date_of_demise = updates.dateOfDemise;
  if (updates.demiseTribute !== undefined) snakeUpdates.demise_tribute = updates.demiseTribute;
  if (updates.passwordHash !== undefined) snakeUpdates.password_hash = updates.passwordHash;
  snakeUpdates.updated_at = new Date().toISOString();

  const { error } = await supabase.from("profiles").update(snakeUpdates).eq("id", id);
  if (error) { console.error("updateAlumniProfile:", error.message); return; }

  // Refresh session if this is the logged-in user
  const currentUser = getLoggedInAlumni();
  if (currentUser && currentUser.id === id) {
    const fresh = await getAlumniById(id);
    if (fresh) setLoggedInAlumni(fresh);
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event("alumni_updated"));
}

export async function markAlumnusAsDeceased(alumniId: string, dateOfDemise: string, tributeText?: string): Promise<void> {
  const alumnus = await getAlumniById(alumniId);
  if (!alumnus) return;

  await updateAlumniProfile(alumniId, {
    isDeceased: true,
    dateOfDemise,
    demiseTribute: tributeText || `In loving memory of Dr. ${alumnus.fullName}`,
    approvalStatus: "expired",
  });

  // Check if already in shradhanjali
  const { data: existing } = await supabase
    .from("shradhanjali")
    .select("id")
    .eq("alumni_id", alumniId)
    .maybeSingle();

  if (!existing) {
    const newRecord = {
      id: `shradhanjali-${Date.now()}`,
      alumni_id: alumnus.id,
      name: alumnus.fullName.startsWith("Late") ? alumnus.fullName : `Late Dr. ${alumnus.fullName}`,
      name_hindi: alumnus.fullNameHindi
        ? alumnus.fullNameHindi.startsWith("स्व.") ? alumnus.fullNameHindi : `स्व. ${alumnus.fullNameHindi}`
        : null,
      batch_year: alumnus.ugBatchYear || alumnus.pgBatchYear || 1980,
      degree: alumnus.ugDegree || alumnus.pgDegree || "BAMS",
      photo_url: alumnus.avatarUrl || "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop",
      date_of_demise: dateOfDemise,
      tribute: tributeText || `अत्यंत दुःख के साथ सूचित किया जाता है कि हमारे वरिष्ठ साथी डॉ. ${alumnus.fullName} का निधन ${dateOfDemise} को हो गया।`,
      condolences_count: 0,
      posted_by: "Association Executive Committee",
    };
    await supabase.from("shradhanjali").insert(newRecord);
    if (typeof window !== "undefined") window.dispatchEvent(new Event("shradhanjali_updated"));
  }
}

export async function toggleAlumniConnection(fromId: string, toId: string): Promise<void> {
  if (!fromId || !toId || fromId === toId) return;

  const fromProfile = await getAlumniById(fromId);
  if (!fromProfile) return;

  const current = fromProfile.connectedAlumniIds || [];
  const isConn = current.includes(toId);
  const newConnections = isConn ? current.filter((id) => id !== toId) : [...current, toId];

  await updateAlumniProfile(fromId, { connectedAlumniIds: newConnections });

  // Also update the other side
  const toProfile = await getAlumniById(toId);
  if (toProfile) {
    const toCurrent = toProfile.connectedAlumniIds || [];
    const toIsConn = toCurrent.includes(fromId);
    const toNewConnections = toIsConn ? toCurrent.filter((id) => id !== fromId) : [...toCurrent, fromId];
    await updateAlumniProfile(toId, { connectedAlumniIds: toNewConnections });
  }
}

// ---------------------------------------------------------------------------
// SESSION (localStorage only — small session data, not persistent DB)
// ---------------------------------------------------------------------------

const SESSION_KEY = "rishikul_session_v1";
const ADMIN_KEY = "rishikul_admin_v1";

export function getLoggedInAlumni(): AlumniProfile | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

export function setLoggedInAlumni(user: AlumniProfile | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
  window.dispatchEvent(new Event("user_auth_changed"));
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ADMIN_KEY) === "true";
}

export function setAdminAuthenticated(val: boolean) {
  if (typeof window === "undefined") return;
  if (val) {
    localStorage.setItem(ADMIN_KEY, "true");
  } else {
    localStorage.removeItem(ADMIN_KEY);
  }
  window.dispatchEvent(new Event("admin_auth_changed"));
}

export async function hashPassword(password: string): Promise<string> {
  if (!password) return "";
  try {
    if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(password);
      const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }
  } catch (e) {
    console.error("hashPassword error:", e);
  }
  return password;
}

export async function verifyAdminCredentials(username: string, passwordInput: string): Promise<boolean> {
  const cleanUsername = username.trim();
  const hashedInput = await hashPassword(passwordInput);

  // 1. Check admin_users table in Supabase
  try {
    const { data } = await supabase
      .from("admin_users")
      .select("password_hash")
      .eq("username", cleanUsername)
      .maybeSingle();

    if (data) {
      if (data.password_hash === hashedInput || data.password_hash === passwordInput) {
        return true;
      }
    }
  } catch (e) {
    console.error("verifyAdminCredentials database query error:", e);
  }

  // 2. Verified fallback check using precomputed SHA-256 hashes
  // admin: "rishikul1919" -> a0e94867fe2adf28d7e932e69b99204fc145a0376dad77348cffe9f6cfa2dc84
  // secretary: "admin123" -> 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
  if (
    cleanUsername === "admin" &&
    (hashedInput === "a0e94867fe2adf28d7e932e69b99204fc145a0376dad77348cffe9f6cfa2dc84" || passwordInput === "rishikul1919")
  ) {
    return true;
  }
  if (
    cleanUsername === "secretary" &&
    (hashedInput === "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9" || passwordInput === "admin123")
  ) {
    return true;
  }

  return false;
}

// ---------------------------------------------------------------------------
// PASSWORD RESET REQUESTS
// ---------------------------------------------------------------------------

export async function getPasswordResetRequests(): Promise<PasswordResetRequest[]> {
  const { data, error } = await supabase
    .from("password_reset_requests")
    .select("*")
    .order("requested_at", { ascending: false });
  if (error) { console.error("getPasswordResetRequests:", error.message); return []; }
  return (data ?? []).map(rowToPasswordReset);
}

export async function addPasswordResetRequest(req: Omit<PasswordResetRequest, "id" | "requestedAt" | "status">): Promise<PasswordResetRequest> {
  const newReq = {
    id: `reset-${Date.now()}`,
    alumni_id: req.alumniId ?? null,
    full_name: req.fullName,
    username: req.username,
    mobile: req.mobile,
    email: req.email ?? null,
    status: "pending",
  };
  const { data, error } = await supabase.from("password_reset_requests").insert(newReq).select().single();
  if (error) throw new Error(error.message);
  return rowToPasswordReset(data as Record<string, unknown>);
}

export async function savePasswordResetRequests(list: PasswordResetRequest[]): Promise<void> {
  for (const req of list) {
    await supabase.from("password_reset_requests").upsert({
      id: req.id,
      alumni_id: req.alumniId ?? null,
      full_name: req.fullName,
      username: req.username,
      mobile: req.mobile,
      email: req.email ?? null,
      status: req.status,
      new_password_assigned: req.newPasswordAssigned ?? null,
    }, { onConflict: "id" });
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event("password_reset_updated"));
}

// ---------------------------------------------------------------------------
// LIFETIME ACHIEVERS
// ---------------------------------------------------------------------------

export async function getLifetimeAchievers(): Promise<LifetimeAchiever[]> {
  const { data, error } = await supabase
    .from("lifetime_achievers")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) { console.error("getLifetimeAchievers:", error.message); return []; }
  return (data ?? []).map(rowToAchiever);
}

export async function saveLifetimeAchievers(list: LifetimeAchiever[]): Promise<void> {
  for (const a of list) {
    await supabase.from("lifetime_achievers").upsert({
      id: a.id,
      name: a.name,
      name_hindi: a.nameHindi ?? null,
      batch_year: a.batchYear,
      degree: a.degree,
      photo_url: a.photoUrl,
      title: a.title,
      citation: a.citation,
      awards: a.awards ?? [],
      current_role: a.currentRole,
      order_index: a.orderIndex ?? 0,
    }, { onConflict: "id" });
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event("achievers_updated"));
}

// ---------------------------------------------------------------------------
// SHRADHANJALI
// ---------------------------------------------------------------------------

export async function getShradhanjaliList(): Promise<ShradhanjaliRecord[]> {
  const { data, error } = await supabase
    .from("shradhanjali")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { console.error("getShradhanjaliList:", error.message); return []; }
  return (data ?? []).map(rowToShradhanjali);
}

export async function saveShradhanjaliList(list: ShradhanjaliRecord[]): Promise<void> {
  for (const s of list) {
    await supabase.from("shradhanjali").upsert({
      id: s.id,
      alumni_id: s.alumniId ?? null,
      name: s.name,
      name_hindi: s.nameHindi ?? null,
      batch_year: s.batchYear,
      degree: s.degree,
      photo_url: s.photoUrl,
      date_of_demise: s.dateOfDemise,
      tribute: s.tribute,
      condolences_count: s.condolencesCount,
      posted_by: s.postedBy,
    }, { onConflict: "id" });
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event("shradhanjali_updated"));
}

export async function offerShradhanjaliFlower(shradhanjaliId: string, alumniId: string): Promise<{ alreadyOffered: boolean }> {
  // Check if already offered
  const { data: existing } = await supabase
    .from("shradhanjali_offerings")
    .select("id")
    .eq("shradhanjali_id", shradhanjaliId)
    .eq("alumni_id", alumniId)
    .maybeSingle();

  if (existing) return { alreadyOffered: true };

  // Insert offering
  await supabase.from("shradhanjali_offerings").insert({
    shradhanjali_id: shradhanjaliId,
    alumni_id: alumniId,
  });

  // Increment count
  await supabase.rpc("increment_condolences", { record_id: shradhanjaliId });

  return { alreadyOffered: false };
}

export async function getMyShradhanjaliOfferings(alumniId: string): Promise<string[]> {
  const { data } = await supabase
    .from("shradhanjali_offerings")
    .select("shradhanjali_id")
    .eq("alumni_id", alumniId);
  return (data ?? []).map((r: Record<string, unknown>) => r.shradhanjali_id as string);
}

// ---------------------------------------------------------------------------
// ACHIEVER NOMINATIONS
// ---------------------------------------------------------------------------

export async function getAchieverNominations(): Promise<AchieverNomination[]> {
  const { data, error } = await supabase
    .from("nominations")
    .select("*")
    .order("submitted_at", { ascending: false });
  if (error) { console.error("getAchieverNominations:", error.message); return []; }
  return (data ?? []).map(rowToNomination);
}

export async function saveAchieverNominations(list: AchieverNomination[]): Promise<void> {
  for (const n of list) {
    await supabase.from("nominations").upsert({
      id: n.id,
      nominee_name: n.nomineeName,
      nominee_name_hindi: n.nomineeNameHindi ?? null,
      nominee_id: n.nomineeId ?? null,
      nominee_batch_year: n.nomineeBatchYear ?? null,
      nominee_degree: n.nomineeDegree ?? null,
      nominee_photo_url: n.nomineePhotoUrl ?? null,
      nominee_workplace: n.nomineeWorkplace ?? null,
      nominee_city: n.nomineeCity ?? null,
      achievement_title: n.achievementTitle,
      citation: n.citation,
      awards: n.awards ?? [],
      nominator_id: n.nominatorId,
      nominator_name: n.nominatorName,
      status: n.status,
      admin_remarks: n.adminRemarks ?? null,
    }, { onConflict: "id" });
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event("nominations_updated"));
}

export async function submitAchieverNomination(nom: Omit<AchieverNomination, "id" | "submittedAt" | "status">): Promise<AchieverNomination> {
  const row = {
    id: `nom-${Date.now()}`,
    nominee_name: nom.nomineeName,
    nominee_name_hindi: nom.nomineeNameHindi ?? null,
    nominee_id: nom.nomineeId ?? null,
    nominee_batch_year: nom.nomineeBatchYear ?? null,
    nominee_degree: nom.nomineeDegree ?? null,
    nominee_photo_url: nom.nomineePhotoUrl ?? null,
    nominee_workplace: nom.nomineeWorkplace ?? null,
    nominee_city: nom.nomineeCity ?? null,
    achievement_title: nom.achievementTitle,
    citation: nom.citation,
    awards: nom.awards ?? [],
    nominator_id: nom.nominatorId,
    nominator_name: nom.nominatorName,
    status: "pending",
  };
  const { data, error } = await supabase.from("nominations").insert(row).select().single();
  if (error) throw new Error(error.message);
  if (typeof window !== "undefined") window.dispatchEvent(new Event("nominations_updated"));
  return rowToNomination(data as Record<string, unknown>);
}

export async function approveAchieverNomination(nominationId: string, adminRemarks?: string): Promise<void> {
  // Get nomination
  const { data: nomRow } = await supabase.from("nominations").select("*").eq("id", nominationId).single();
  if (!nomRow) return;
  const nom = rowToNomination(nomRow as Record<string, unknown>);

  // Update status
  await supabase.from("nominations").update({ status: "approved", admin_remarks: adminRemarks ?? null }).eq("id", nominationId);

  // Add to lifetime_achievers
  const { data: existingAchievers } = await supabase.from("lifetime_achievers").select("order_index").order("order_index", { ascending: false }).limit(1);
  const maxOrder = (existingAchievers?.[0] as Record<string, unknown> | undefined)?.order_index as number | undefined ?? 0;

  await supabase.from("lifetime_achievers").insert({
    id: `achiever-${Date.now()}`,
    name: nom.nomineeName,
    name_hindi: nom.nomineeNameHindi ?? null,
    batch_year: nom.nomineeBatchYear || 1980,
    degree: nom.nomineeDegree || "BAMS",
    photo_url: nom.nomineePhotoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop",
    title: nom.achievementTitle,
    citation: nom.citation,
    awards: nom.awards ?? [],
    current_role: nom.nomineeWorkplace ? `${nom.nomineeWorkplace}${nom.nomineeCity ? `, ${nom.nomineeCity}` : ""}` : "Distinguished Rishikul Alumnus",
    order_index: (maxOrder as number) + 1,
  });

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("nominations_updated"));
    window.dispatchEvent(new Event("achievers_updated"));
  }
}

export async function rejectAchieverNomination(nominationId: string, adminRemarks?: string): Promise<void> {
  await supabase.from("nominations").update({ status: "rejected", admin_remarks: adminRemarks ?? null }).eq("id", nominationId);
  if (typeof window !== "undefined") window.dispatchEvent(new Event("nominations_updated"));
}

// ---------------------------------------------------------------------------
// COMMUNITY ACHIEVEMENTS
// ---------------------------------------------------------------------------

export async function getCommunityAchievements(): Promise<CommunityAchievement[]> {
  const { data, error } = await supabase
    .from("community_achievements")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { console.error("getCommunityAchievements:", error.message); return []; }
  return (data ?? []).map(rowToCommunityAchievement);
}

export async function addCommunityAchievement(item: Omit<CommunityAchievement, "id" | "datePosted" | "likesCount">): Promise<CommunityAchievement> {
  const row = {
    id: `achieve-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    alumni_id: item.alumniId,
    alumni_name: item.alumniName,
    alumni_batch: item.alumniBatch ?? null,
    alumni_city: item.alumniCity ?? null,
    alumni_avatar: item.alumniAvatar ?? null,
    title: item.title,
    category: item.category,
    details: item.details,
    likes_count: 0,
  };
  const { data, error } = await supabase.from("community_achievements").insert(row).select().single();
  if (error) throw new Error(error.message);
  if (typeof window !== "undefined") window.dispatchEvent(new Event("achievements_updated"));
  return rowToCommunityAchievement(data as Record<string, unknown>);
}

export async function saveCommunityAchievements(list: CommunityAchievement[]): Promise<void> {
  for (const a of list) {
    await supabase.from("community_achievements").upsert({
      id: a.id,
      alumni_id: a.alumniId,
      alumni_name: a.alumniName,
      alumni_batch: a.alumniBatch ?? null,
      alumni_city: a.alumniCity ?? null,
      alumni_avatar: a.alumniAvatar ?? null,
      title: a.title,
      category: a.category,
      details: a.details,
      date_posted: a.datePosted,
      likes_count: a.likesCount,
    }, { onConflict: "id" });
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event("achievements_updated"));
}

// ---------------------------------------------------------------------------
// EVENTS (Supabase PostgreSQL "events" table)
// ---------------------------------------------------------------------------

function rowToEvent(row: Record<string, unknown>): AssociationEvent {
  return {
    id: row.id as string,
    title: row.title as string,
    titleHindi: row.title_hindi as string | undefined,
    slug: row.slug as string,
    eventType: row.event_type as AssociationEvent["eventType"],
    date: row.event_date as string,
    time: row.time as string,
    venue: row.venue as string,
    city: row.city as string,
    isOnline: Boolean(row.is_online),
    registrationOpen: Boolean(row.registration_open),
    registrationFee: (row.registration_fee as string) || "Free",
    description: (row.description as string) || "",
    chiefGuest: row.chief_guest as string | undefined,
    bannerUrl: (row.banner_url as string) || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop",
    attendeesCount: (row.attendees_count as number) || 0,
  };
}

function eventToRow(event: AssociationEvent): Record<string, unknown> {
  return {
    id: event.id,
    title: event.title,
    title_hindi: event.titleHindi ?? null,
    slug: event.slug,
    event_type: event.eventType,
    event_date: event.date,
    time: event.time,
    venue: event.venue,
    city: event.city,
    is_online: event.isOnline,
    registration_open: event.registrationOpen,
    registration_fee: event.registrationFee,
    description: event.description,
    chief_guest: event.chiefGuest ?? null,
    banner_url: event.bannerUrl,
    attendees_count: event.attendeesCount ?? 0,
  };
}

export async function getEvents(): Promise<AssociationEvent[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getEvents error:", error.message);
    return [];
  }
  return (data ?? []).map(rowToEvent);
}

export async function addEvent(
  event: Omit<AssociationEvent, "id" | "slug" | "attendeesCount">
): Promise<AssociationEvent> {
  const newId = `event-${Date.now()}`;
  const slug = `${event.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")}-${Date.now().toString().slice(-4)}`;

  const newEvent: AssociationEvent = {
    ...event,
    id: newId,
    slug: slug || newId,
    attendeesCount: 0,
  };

  const { error } = await supabase.from("events").insert(eventToRow(newEvent));
  if (error) {
    console.error("addEvent error:", error.message);
    throw new Error(error.message);
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("events_updated"));
  }
  return newEvent;
}
