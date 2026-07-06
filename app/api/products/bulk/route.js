import { NextResponse } from "next/server";
import {
  bulkUpdateStatus,
  bulkChangeCategory,
  bulkAddToCollection,
} from "@/services/product/productBulk.service";
import { PRODUCT_STATUS } from "@/constants/product";
import { getCurrentAdmin } from "@/services/auth/authSession";

export async function POST(request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Belum login.", error: "UNAUTHENTICATED" },
      { status: 401 }
    );
  }

  try {
    const { ids, action, categoryId, collectionId } = await request.json();

    if (!Array.isArray(ids) || !ids.length) {
      return NextResponse.json(
        { success: false, message: "Tidak ada produk yang dipilih.", error: "EMPTY_SELECTION" },
        { status: 400 }
      );
    }

    let result;
    switch (action) {
      case "publish":
        result = await bulkUpdateStatus(ids, PRODUCT_STATUS.PUBLISHED, admin.uid);
        break;
      case "unpublish":
        result = await bulkUpdateStatus(ids, PRODUCT_STATUS.DRAFT, admin.uid);
        break;
      case "archive":
        result = await bulkUpdateStatus(ids, PRODUCT_STATUS.ARCHIVED, admin.uid);
        break;
      case "changeCategory":
        result = await bulkChangeCategory(ids, categoryId, admin.uid);
        break;
      case "addToCollection":
        result = await bulkAddToCollection(ids, collectionId, admin.uid);
        break;
      default:
        return NextResponse.json(
          { success: false, message: "Action tidak valid.", error: "INVALID_ACTION" },
          { status: 400 }
        );
    }

    return NextResponse.json(result, { status: result.success ? 200 : 422 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan.", error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
