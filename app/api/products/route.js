import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/services/product/product.service";
import { getCurrentAdmin } from "@/services/auth/authSession";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Belum login.", error: "UNAUTHENTICATED" },
      { status: 401 }
    );
  }

  const products = await getProducts();
  return NextResponse.json({ success: true, message: "", data: products });
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
    const result = await createProduct(body, admin.uid);
    return NextResponse.json(result, { status: result.success ? 201 : 422 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan.", error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
