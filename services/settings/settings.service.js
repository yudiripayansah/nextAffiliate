import { cache } from "react";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/services/firebase/admin";
import { SETTINGS_COLLECTION, SETTINGS_DOC_ID, DEFAULT_SETTINGS } from "@/constants/settings";

function settingsDoc() {
  return getAdminDb().collection(SETTINGS_COLLECTION).doc(SETTINGS_DOC_ID);
}

export const getSettings = cache(async function getSettings() {
  const snapshot = await settingsDoc().get();

  if (!snapshot.exists) {
    return { ...DEFAULT_SETTINGS };
  }

  const data = snapshot.data();
  return {
    ...DEFAULT_SETTINGS,
    ...data,
    updatedAt: data.updatedAt?.toDate?.().toISOString() ?? null,
  };
});

export async function updateSettings(data) {
  if (!data.siteName || !data.siteName.trim()) {
    return { success: false, message: "Site Name wajib diisi.", error: "SITE_NAME_REQUIRED" };
  }

  await settingsDoc().set(
    { ...data, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );

  return { success: true, message: "Settings berhasil disimpan." };
}
