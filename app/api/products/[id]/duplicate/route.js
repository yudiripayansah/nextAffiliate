import { NextResponse } from "next/server";
import { duplicateProduct } from "@/services/product/product.service";
import { getCurrentAdmin } from "@/services/auth/authSession";

export async function POST(request, { params }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Belum login.", error: "UNAUTHENTICATED" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const result = await duplicateProduct(id, admin.uid);
  return NextResponse.json(result, { status: result.success ? 201 : 422 });
}
