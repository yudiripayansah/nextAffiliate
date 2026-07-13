/**
 * Set settings.siteName di Firestore (dokumen tunggal `settings/site`).
 * Jalankan: node --env-file=.env.local scripts/set-site-name.mjs "Nama Baru"
 */
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore();

const siteName = process.argv[2];
if (!siteName || !siteName.trim()) {
  console.error("Usage: node --env-file=.env.local scripts/set-site-name.mjs \"Nama Situs\"");
  process.exit(1);
}

await db.collection("settings").doc("site").set(
  { siteName: siteName.trim(), updatedAt: FieldValue.serverTimestamp() },
  { merge: true }
);

console.log(`settings.siteName set to "${siteName.trim()}"`);
