import { cache } from "react";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/services/firebase/admin";
import { slugify } from "@/utils/slugify";
import { PRODUCTS_COLLECTION } from "@/constants/product";

const CATEGORIES_COLLECTION = "categories";

function categoriesRef() {
  return getAdminDb().collection(CATEGORIES_COLLECTION);
}

function serializeCategory(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate?.().toISOString() ?? null,
    updatedAt: data.updatedAt?.toDate?.().toISOString() ?? null,
  };
}

export async function getCategoryCount() {
  const snapshot = await categoriesRef().count().get();
  return snapshot.data().count;
}

export const getCategories = cache(async function getCategories(onlyPublished = false) {
  let query = categoriesRef().orderBy("sortOrder", "asc");
  if (onlyPublished) {
    query = query.where("published", "==", true);
  }

  const snapshot = await query.get();
  return snapshot.docs.map(serializeCategory);
});

export async function getCategoriesWithProductCount(limitCount = 8) {
  const categories = (await getCategories(true)).slice(0, limitCount);

  const counts = await Promise.all(
    categories.map((category) =>
      getAdminDb()
        .collection(PRODUCTS_COLLECTION)
        .where("categoryId", "==", category.id)
        .where("status", "==", "published")
        .count()
        .get()
    )
  );

  return categories.map((category, index) => ({
    ...category,
    productCount: counts[index].data().count,
  }));
}

export const getCategory = cache(async function getCategory(id) {
  const doc = await categoriesRef().doc(id).get();
  if (!doc.exists) return null;
  return serializeCategory(doc);
});

export const getCategoryBySlug = cache(async function getCategoryBySlug(slug) {
  const snapshot = await categoriesRef().where("slug", "==", slug).limit(1).get();
  if (snapshot.empty) return null;
  return serializeCategory(snapshot.docs[0]);
});

async function isSlugTaken(slug, excludeId) {
  const snapshot = await categoriesRef().where("slug", "==", slug).limit(1).get();
  if (snapshot.empty) return false;
  return snapshot.docs[0].id !== excludeId;
}

export async function createCategory(data) {
  if (!data.name || !data.name.trim()) {
    return { success: false, message: "Name wajib diisi.", error: "NAME_REQUIRED" };
  }

  const slug = slugify(data.slug || data.name);
  if (await isSlugTaken(slug)) {
    return { success: false, message: "Slug sudah digunakan.", error: "SLUG_TAKEN" };
  }

  const docRef = await categoriesRef().add({
    name: data.name.trim(),
    slug,
    description: data.description ?? "",
    image: data.image ?? "",
    icon: data.icon ?? "",
    seoTitle: data.seoTitle ?? "",
    seoDescription: data.seoDescription ?? "",
    sortOrder: Number.isFinite(data.sortOrder) ? data.sortOrder : 0,
    published: Boolean(data.published),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { success: true, message: "Category berhasil dibuat.", data: { id: docRef.id } };
}

export async function updateCategory(id, data) {
  if (!data.name || !data.name.trim()) {
    return { success: false, message: "Name wajib diisi.", error: "NAME_REQUIRED" };
  }

  const slug = slugify(data.slug || data.name);
  if (await isSlugTaken(slug, id)) {
    return { success: false, message: "Slug sudah digunakan.", error: "SLUG_TAKEN" };
  }

  await categoriesRef().doc(id).update({
    name: data.name.trim(),
    slug,
    description: data.description ?? "",
    image: data.image ?? "",
    icon: data.icon ?? "",
    seoTitle: data.seoTitle ?? "",
    seoDescription: data.seoDescription ?? "",
    sortOrder: Number.isFinite(data.sortOrder) ? data.sortOrder : 0,
    published: Boolean(data.published),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { success: true, message: "Category berhasil diperbarui." };
}

export async function deleteCategory(id) {
  const productsUsingCategory = await getAdminDb()
    .collection(PRODUCTS_COLLECTION)
    .where("categoryId", "==", id)
    .count()
    .get();

  if (productsUsingCategory.data().count > 0) {
    return {
      success: false,
      message: "Category masih memiliki produk. Pindahkan produk terlebih dahulu.",
      error: "CATEGORY_HAS_PRODUCTS",
    };
  }

  await categoriesRef().doc(id).delete();
  return { success: true, message: "Category berhasil dihapus." };
}
