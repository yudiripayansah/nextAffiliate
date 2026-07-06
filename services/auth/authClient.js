import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

const ERROR_MESSAGES = {
  "auth/invalid-email": "Email tidak valid.",
  "auth/user-not-found": "Email tidak ditemukan.",
  "auth/wrong-password": "Password salah.",
  "auth/invalid-credential": "Email atau password salah.",
  "auth/too-many-requests": "Terlalu banyak percobaan. Coba lagi nanti.",
};

export async function signIn(email, password) {
  try {
    const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
    const idToken = await credential.user.getIdToken();
    return { success: true, message: "Login berhasil.", data: { idToken } };
  } catch (error) {
    const message = ERROR_MESSAGES[error.code] || "Terjadi kesalahan.";
    return { success: false, message, error: error.code || "AUTH_ERROR" };
  }
}

export async function signOutClient() {
  await firebaseSignOut(getFirebaseAuth());
}
