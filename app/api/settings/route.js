import { NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/services/settings/settings.service";
import { getCurrentAdmin } from "@/services/auth/authSession";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ success: true, message: "", data: settings });
}

export async function PUT(request) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Belum login.", error: "UNAUTHENTICATED" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const result = await updateSettings(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 422 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan.", error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
