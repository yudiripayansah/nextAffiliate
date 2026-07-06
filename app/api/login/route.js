import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/services/firebase/admin";
import { createSessionCookie, getAdminByUid } from "@/services/auth/authSession";
import { SESSION_COOKIE_NAME, SESSION_EXPIRES_IN_MS } from "@/constants/auth";

export async function POST(request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { success: false, message: "Token tidak ditemukan.", error: "MISSING_TOKEN" },
        { status: 400 }
      );
    }

    const decoded = await getAdminAuth().verifyIdToken(idToken);
    const admin = await getAdminByUid(decoded.uid);

    if (!admin || !admin.active) {
      return NextResponse.json(
        { success: false, message: "Akun tidak aktif.", error: "NOT_ADMIN" },
        { status: 403 }
      );
    }

    const sessionCookie = await createSessionCookie(idToken);

    await getAdminDb().collection("admins").doc(decoded.uid).update({
      lastLogin: new Date(),
    });

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil.",
      data: { uid: admin.uid, email: admin.email, displayName: admin.displayName },
    });

    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_EXPIRES_IN_MS / 1000,
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan.", error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
