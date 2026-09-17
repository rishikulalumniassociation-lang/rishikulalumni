"use client";

import { AlumniProfile, LifetimeAchiever, ShradhanjaliRecord } from "@/types";
import { MOCK_ALUMNI, INITIAL_ACHIEVERS, INITIAL_SHRADHANJALI } from "./mockData";

const STORAGE_KEYS = {
  ALUMNI: "rishikul_alumni_list_v2",
  ACHIEVERS: "rishikul_lifetime_achievers_v2",
  SHRADHANJALI: "rishikul_shradhanjali_v2",
  ADMIN_AUTH: "rishikul_admin_logged_in_v2",
  CURRENT_USER: "rishikul_current_user_v2",
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

// Connection management between alumni
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
}
