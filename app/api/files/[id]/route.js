import { NextResponse } from "next/server";
import { deleteFile } from "@/services/file/file.service";
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

export async function DELETE(request, { params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const result = await deleteFile(id);
  return NextResponse.json(result, { status: result.success ? 200 : 422 });
}
