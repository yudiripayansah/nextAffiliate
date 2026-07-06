import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/services/auth/authSession";

export async function GET() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Belum login.", error: "UNAUTHENTICATED" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "",
    data: { uid: admin.uid, email: admin.email, displayName: admin.displayName, role: admin.role },
  });
}
