import { NextResponse } from "next/server";
import {
  getCollection,
  updateCollection,
  deleteCollection,
} from "@/services/collection/collection.service";
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

export async function GET(request, { params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const collection = await getCollection(id);

  if (!collection) {
    return NextResponse.json(
      { success: false, message: "Collection tidak ditemukan.", error: "NOT_FOUND" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, message: "", data: collection });
}

export async function PUT(request, { params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  try {
    const body = await request.json();
    const result = await updateCollection(id, body);
    return NextResponse.json(result, { status: result.success ? 200 : 422 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan.", error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const result = await deleteCollection(id);
  return NextResponse.json(result, { status: result.success ? 200 : 422 });
}
