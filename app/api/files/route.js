import { NextResponse } from "next/server";
import { uploadImage } from "@/services/cloudinary/upload.service";
import { createFile, getFiles } from "@/services/file/file.service";
import { getCurrentAdmin } from "@/services/auth/authSession";

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Belum login.", error: "UNAUTHENTICATED" },
      { status: 401 }
    );
  }
  return null;
}

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const files = await getFiles();
  return NextResponse.json({ success: true, message: "", data: files });
}

export async function POST(request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    const uploadResult = await uploadImage(file, "media");
    if (!uploadResult.success) {
      return NextResponse.json(uploadResult, { status: 422 });
    }

    const result = await createFile(uploadResult.data);
    return NextResponse.json(result, { status: result.success ? 201 : 422 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan.", error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
