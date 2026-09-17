"use client";

import { AlumniProfile, LifetimeAchiever, ShradhanjaliRecord, PasswordResetRequest } from "@/types";
import { MOCK_ALUMNI, INITIAL_ACHIEVERS, INITIAL_SHRADHANJALI } from "./mockData";

const STORAGE_KEYS = {
  ALUMNI: "rishikul_alumni_list_v4",
  ACHIEVERS: "rishikul_lifetime_achievers_v4",
  SHRADHANJALI: "rishikul_shradhanjali_v4",
  ADMIN_AUTH: "rishikul_admin_logged_in_v4",
  RESET_REQUESTS: "rishikul_password_reset_requests_v4",
  LOGGED_IN_USER: "rishikul_logged_in_user_v4",
};

export function getAlumniList(): AlumniProfile[] {
  if (typeof window === "undefined") return MOCK_ALUMNI;
  const stored = localStorage.getItem(STORAGE_KEYS.ALUMNI);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.ALUMNI, JSON.stringify(MOCK_ALUMNI));
    return MOCK_ALUMNI;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return MOCK_ALUMNI;
  }
}

export function saveAlumniList(list: AlumniProfile[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ALUMNI, JSON.stringify(list));
  window.dispatchEvent(new Event("alumni_updated"));
}

export function updateAlumniProfile(id: string, updates: Partial<AlumniProfile>) {
  const list = getAlumniList();
  const updatedList = list.map((a) => (a.id === id ? { ...a, ...updates } : a));
  saveAlumniList(updatedList);

  // If current logged-in user is this alumnus, update session too
  const currentUser = getLoggedInAlumni();
  if (currentUser && currentUser.id === id) {
    setLoggedInAlumni({ ...currentUser, ...updates });
  }
}

export function markAlumnusAsDeceased(alumniId: string, dateOfDemise: string, tributeText?: string) {
  const list = getAlumniList();
  const alumnus = list.find((a) => a.id === alumniId);
  if (!alumnus) return;

  // 1. Update alumnus record
  const updatedList = list.map((a) => {
    if (a.id === alumniId) {
      return {
        ...a,
        isDeceased: true,
        dateOfDemise,
        demiseTribute: tributeText || `In loving memory of Dr. ${a.fullName}`,
        approvalStatus: "expired" as const,
      };
    }
    return a;
  });
  saveAlumniList(updatedList);

  // 2. Automatically create entry in Shradhanjali memorials
  const currentShradhanjali = getShradhanjaliList();
  const alreadyExists = currentShradhanjali.some((s) => s.alumniId === alumniId);
  if (!alreadyExists) {
    const newRecord: ShradhanjaliRecord = {
      id: `shradhanjali-${Date.now()}`,
      alumniId: alumnus.id,
      name: alumnus.fullName.startsWith("Late") ? alumnus.fullName : `Late Dr. ${alumnus.fullName}`,
      nameHindi: alumnus.fullNameHindi ? (alumnus.fullNameHindi.startsWith("स्व.") ? alumnus.fullNameHindi : `स्व. ${alumnus.fullNameHindi}`) : undefined,
      batchYear: alumnus.ugBatchYear || alumnus.pgBatchYear || alumnus.batchYear || 1980,
      degree: alumnus.ugDegree || alumnus.pgDegree || "BAMS",
      photoUrl: alumnus.avatarUrl || "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop",
      dateOfDemise,
      tribute: tributeText || `अत्यंत दुःख के साथ सूचित किया जाता है कि हमारे वरिष्ठ साथी डॉ. ${alumnus.fullName} का निधन ${dateOfDemise} को हो गया। ऋषिकुल पुरातन छात्र परिवार दिवंगत आत्मा की शांति की प्रार्थना करता है।`,
      condolencesCount: 0,
      postedBy: "Association Executive Committee",
    };
    saveShradhanjaliList([newRecord, ...currentShradhanjali]);
  }
}

export function getPasswordResetRequests(): PasswordResetRequest[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEYS.RESET_REQUESTS);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

export function savePasswordResetRequests(list: PasswordResetRequest[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.RESET_REQUESTS, JSON.stringify(list));
  window.dispatchEvent(new Event("reset_requests_updated"));
}

export function addPasswordResetRequest(req: Omit<PasswordResetRequest, "id" | "requestedAt" | "status">) {
  const current = getPasswordResetRequests();
  const newReq: PasswordResetRequest = {
    ...req,
    id: `reset-${Date.now()}`,
    requestedAt: new Date().toLocaleString(),
    status: "pending",
  };
  savePasswordResetRequests([newReq, ...current]);
  return newReq;
}

export function getLifetimeAchievers(): LifetimeAchiever[] {
  if (typeof window === "undefined") return INITIAL_ACHIEVERS;
  const stored = localStorage.getItem(STORAGE_KEYS.ACHIEVERS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.ACHIEVERS, JSON.stringify(INITIAL_ACHIEVERS));
    return INITIAL_ACHIEVERS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_ACHIEVERS;
  }
}

export function saveLifetimeAchievers(list: LifetimeAchiever[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ACHIEVERS, JSON.stringify(list));
  window.dispatchEvent(new Event("achievers_updated"));
}

export function getShradhanjaliList(): ShradhanjaliRecord[] {
  if (typeof window === "undefined") return INITIAL_SHRADHANJALI;
  const stored = localStorage.getItem(STORAGE_KEYS.SHRADHANJALI);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.SHRADHANJALI, JSON.stringify(INITIAL_SHRADHANJALI));
    return INITIAL_SHRADHANJALI;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_SHRADHANJALI;
  }
}

export function saveShradhanjaliList(list: ShradhanjaliRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.SHRADHANJALI, JSON.stringify(list));
  window.dispatchEvent(new Event("shradhanjali_updated"));
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === "true";
}

export function setAdminAuthenticated(val: boolean) {
  if (typeof window === "undefined") return;
  if (val) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, "true");
  } else {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  }
  window.dispatchEvent(new Event("admin_auth_changed"));
}

export function getLoggedInAlumni(): AlumniProfile | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEYS.LOGGED_IN_USER);
  if (!stored) {
    // Demo auto-login as Dr. Ramesh Chandra Joshi if none set
    const list = getAlumniList();
    const demo = list[0] || null;
    if (demo) localStorage.setItem(STORAGE_KEYS.LOGGED_IN_USER, JSON.stringify(demo));
    return demo;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
}

export function setLoggedInAlumni(user: AlumniProfile | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEYS.LOGGED_IN_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.LOGGED_IN_USER);
  }
  window.dispatchEvent(new Event("user_auth_changed"));
}

export function toggleAlumniConnection(fromId: string, toId: string) {
  const list = getAlumniList();
  const updated = list.map((a) => {
    if (a.id === fromId) {
      const current = a.connectedAlumniIds || [];
      const isConn = current.includes(toId);
      return {
        ...a,
        connectedAlumniIds: isConn
          ? current.filter((id) => id !== toId)
          : [...current, toId],
      };
    }
    if (a.id === toId) {
      const current = a.connectedAlumniIds || [];
      const isConn = current.includes(fromId);
      return {
        ...a,
        connectedAlumniIds: isConn
          ? current.filter((id) => id !== fromId)
          : [...current, fromId],
      };
    }
    return a;
  });
  saveAlumniList(updated);

  // Update session if affected
  const currentUser = getLoggedInAlumni();
  if (currentUser && (currentUser.id === fromId || currentUser.id === toId)) {
    const freshMe = updated.find((a) => a.id === currentUser.id);
    if (freshMe) setLoggedInAlumni(freshMe);
  }
}
