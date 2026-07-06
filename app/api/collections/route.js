import { NextResponse } from "next/server";
import { getCollections, createCollection } from "@/services/collection/collection.service";
import { getCurrentAdmin } from "@/services/auth/authSession";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Belum login.", error: "UNAUTHENTICATED" },
      { status: 401 }
    );
  }

  const collections = await getCollections();
  return NextResponse.json({ success: true, message: "", data: collections });
}

export async function POST(request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Belum login.", error: "UNAUTHENTICATED" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const result = await createCollection(body);
    return NextResponse.json(result, { status: result.success ? 201 : 422 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan.", error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
