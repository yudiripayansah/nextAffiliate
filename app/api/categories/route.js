import { NextResponse } from "next/server";
import { getCategories, createCategory } from "@/services/category/category.service";
import { getCurrentAdmin } from "@/services/auth/authSession";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Belum login.", error: "UNAUTHENTICATED" },
      { status: 401 }
    );
  }

  const categories = await getCategories();
  return NextResponse.json({ success: true, message: "", data: categories });
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
    const result = await createCategory(body);
    return NextResponse.json(result, { status: result.success ? 201 : 422 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan.", error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
