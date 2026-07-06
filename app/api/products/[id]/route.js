import { NextResponse } from "next/server";
import {
  getProduct,
  updateProduct,
  archiveProduct,
} from "@/services/product/product.service";
import { getCurrentAdmin } from "@/services/auth/authSession";

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return {
      unauthorized: NextResponse.json(
        { success: false, message: "Belum login.", error: "UNAUTHENTICATED" },
        { status: 401 }
      ),
    };
  }
  return { admin };
}

export async function GET(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return NextResponse.json(
      { success: false, message: "Product tidak ditemukan.", error: "NOT_FOUND" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, message: "", data: product });
}

export async function PUT(request, { params }) {
  const { admin, unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  try {
    const body = await request.json();
    const result = await updateProduct(id, body, admin.uid);
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
  const { admin, unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const result = await archiveProduct(id, admin.uid);
  return NextResponse.json(result, { status: result.success ? 200 : 422 });
}
