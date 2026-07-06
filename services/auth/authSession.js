import { cookies } from "next/headers";
import { getAdminAuth, getAdminDb } from "@/services/firebase/admin";
import { SESSION_COOKIE_NAME, SESSION_EXPIRES_IN_MS } from "@/constants/auth";

export async function getAdminByUid(uid) {
  const snapshot = await getAdminDb().collection("admins").doc(uid).get();
  if (!snapshot.exists) return null;
  return { uid, ...snapshot.data() };
}

export async function createSessionCookie(idToken) {
  return getAdminAuth().createSessionCookie(idToken, {
    expiresIn: SESSION_EXPIRES_IN_MS,
  });
}

export async function verifySessionCookie(sessionCookie) {
  try {
    return await getAdminAuth().verifySessionCookie(sessionCookie, true);
  } catch {
    return null;
  }
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  const decoded = await verifySessionCookie(sessionCookie);
  if (!decoded) return null;

  const admin = await getAdminByUid(decoded.uid);
  if (!admin || !admin.active) return null;

  return admin;
}
