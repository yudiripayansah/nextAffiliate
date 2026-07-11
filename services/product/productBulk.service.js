import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/services/firebase/admin";
import { PRODUCTS_COLLECTION, PRODUCT_STATUS } from "@/constants/product";

function productsRef() {
  return getAdminDb().collection(PRODUCTS_COLLECTION);
}

export async function bulkUpdateStatus(ids, status, adminUid) {
  await Promise.all(
    ids.map((id) =>
      productsRef()
        .doc(id)
        .update({
          status,
          updatedBy: adminUid,
          updatedAt: FieldValue.serverTimestamp(),
          ...(status === PRODUCT_STATUS.PUBLISHED ? { publishedAt: FieldValue.serverTimestamp() } : {}),
        })
    )
  );

  return { success: true, message: `${ids.length} produk berhasil diperbarui.` };
}

export async function bulkChangeCategory(ids, categoryId, adminUid) {
  await Promise.all(
    ids.map((id) =>
      productsRef().doc(id).update({
        categoryId,
        updatedBy: adminUid,
        updatedAt: FieldValue.serverTimestamp(),
      })
    )
  );

  return { success: true, message: `Category ${ids.length} produk berhasil diubah.` };
}

export async function bulkDeleteProducts(ids) {
  await Promise.all(ids.map((id) => productsRef().doc(id).delete()));
  return { success: true, message: `${ids.length} produk berhasil dihapus.` };
}

export async function bulkAddToCollection(ids, collectionId, adminUid) {
  await Promise.all(
    ids.map((id) =>
      productsRef()
        .doc(id)
        .update({
          collectionIds: FieldValue.arrayUnion(collectionId),
          updatedBy: adminUid,
          updatedAt: FieldValue.serverTimestamp(),
        })
    )
  );

  return { success: true, message: `${ids.length} produk berhasil ditambahkan ke collection.` };
}
