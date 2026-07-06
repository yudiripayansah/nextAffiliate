import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/constants/auth";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logout berhasil." });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
