import { cache } from "react";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/services/firebase/admin";
import { PRODUCTS_COLLECTION, PRODUCT_STATUS } from "@/constants/product";
import { MARKETPLACES } from "@/constants/marketplace";
import { slugify } from "@/utils/slugify";
import { buildSearchKeywords } from "@/utils/searchKeywords";

function productsRef() {
  return getAdminDb().collection(PRODUCTS_COLLECTION);
}

function serializeProduct(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    updatedAt: data.updatedAt?.toDate?.().toISOString() ?? null,
    createdAt: data.createdAt?.toDate?.().toISOString() ?? null,
    publishedAt: data.publishedAt?.toDate?.().toISOString() ?? null,
  };
}

async function isSlugTaken(slug, excludeId) {
  const snapshot = await productsRef().where("slug", "==", slug).limit(1).get();
  if (snapshot.empty) return false;
  return snapshot.docs[0].id !== excludeId;
}

function validateProductInput(data) {
  if (!data.title || !data.title.trim()) return "Title wajib diisi.";
  if (!data.marketplace || !MARKETPLACES.some((m) => m.value === data.marketplace)) {
    return "Marketplace tidak valid.";
  }
  if (!data.affiliateUrl || !data.affiliateUrl.trim()) return "Affiliate URL wajib diisi.";
  if (!data.originalUrl || !data.originalUrl.trim()) return "Original URL wajib diisi.";
  if (!data.categoryId) return "Category wajib diisi.";
  if (data.price === undefined || data.price === null || Number(data.price) < 0) {
    return "Price wajib diisi dan tidak boleh negatif.";
  }
  if (!Array.isArray(data.images) || data.images.length < 1) {
    return "Minimal 1 gambar produk.";
  }
  return null;
}

function buildProductPayload(data) {
  const price = Number(data.price);
  const originalPrice = data.originalPrice ? Number(data.originalPrice) : null;
  const discountPercentage =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  return {
    title: data.title.trim(),
    shortDescription: data.shortDescription ?? "",
    description: data.description ?? "",
    affiliateUrl: data.affiliateUrl.trim(),
    originalUrl: data.originalUrl.trim(),
    marketplace: data.marketplace,
    categoryId: data.categoryId,
    collectionIds: Array.isArray(data.collectionIds) ? data.collectionIds : [],
    images: data.images,
    thumbnail: data.thumbnail || data.images[0],
    price,
    originalPrice,
    discountPercentage,
    rating: data.rating ? Number(data.rating) : 0,
    sold: data.sold ? Number(data.sold) : 0,
    brand: data.brand ?? "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    seoTitle: data.seoTitle ?? "",
    seoDescription: data.seoDescription ?? "",
    faq: Array.isArray(data.faq) ? data.faq : [],
    specifications: Array.isArray(data.specifications) ? data.specifications : [],
    featured: Boolean(data.featured),
  };
}

export async function getProductStats() {
  const ref = productsRef();

  const [totalSnap, publishedSnap, draftSnap, archivedSnap] = await Promise.all([
    ref.count().get(),
    ref.where("status", "==", PRODUCT_STATUS.PUBLISHED).count().get(),
    ref.where("status", "==", PRODUCT_STATUS.DRAFT).count().get(),
    ref.where("status", "==", PRODUCT_STATUS.ARCHIVED).count().get(),
  ]);

  return {
    total: totalSnap.data().count,
    published: publishedSnap.data().count,
    draft: draftSnap.data().count,
    archived: archivedSnap.data().count,
  };
}

export async function getMarketplaceStats() {
  const ref = productsRef();

  const counts = await Promise.all(
    MARKETPLACES.map(({ value }) => ref.where("marketplace", "==", value).count().get())
  );

  return MARKETPLACES.map(({ value, label }, index) => ({
    marketplace: value,
    label,
    total: counts[index].data().count,
  }));
}

export async function getRecentProducts(limitCount = 5) {
  const snapshot = await productsRef().orderBy("updatedAt", "desc").limit(limitCount).get();
  return snapshot.docs.map(serializeProduct);
}

export async function getPopularProducts(limitCount = 10) {
  const snapshot = await productsRef().orderBy("clickCount", "desc").limit(limitCount).get();
  return snapshot.docs.map(serializeProduct);
}

const SORT_OPTIONS = {
  newest: { field: "updatedAt", direction: "desc" },
  oldest: { field: "updatedAt", direction: "asc" },
  created: { field: "createdAt", direction: "desc" },
  price_asc: { field: "price", direction: "asc" },
  price_desc: { field: "price", direction: "desc" },
  rating: { field: "rating", direction: "desc" },
  click: { field: "clickCount", direction: "desc" },
  sold: { field: "sold", direction: "desc" },
};

async function searchProducts(trimmedSearch, limitCount, status) {
  const tokens = trimmedSearch.split(/\s+/).filter(Boolean);
  const snapshot = await productsRef()
    .where("searchKeywords", "array-contains", tokens[0])
    .orderBy("updatedAt", "desc")
    .limit(200)
    .get();

  const products = snapshot.docs
    .map(serializeProduct)
    .filter((product) => !status || product.status === status)
    .filter((product) =>
      tokens.every((token) => (product.searchKeywords ?? []).some((keyword) => keyword.includes(token)))
    )
    .slice(0, limitCount);

  return { products, hasMore: false, lastId: null };
}

export async function getProducts({
  limitCount = 20,
  search,
  afterId,
  marketplace,
  categoryId,
  collectionId,
  status,
  featured,
  sort = "newest",
} = {}) {
  const trimmedSearch = search?.trim().toLowerCase();
  if (trimmedSearch) {
    return searchProducts(trimmedSearch, limitCount, status);
  }

  let query = productsRef();
  if (marketplace) query = query.where("marketplace", "==", marketplace);
  if (categoryId) query = query.where("categoryId", "==", categoryId);
  if (collectionId) query = query.where("collectionIds", "array-contains", collectionId);
  if (status) query = query.where("status", "==", status);
  if (featured !== undefined) query = query.where("featured", "==", featured);

  const { field, direction } = SORT_OPTIONS[sort] ?? SORT_OPTIONS.newest;
  query = query.orderBy(field, direction);

  if (afterId) {
    const cursorDoc = await productsRef().doc(afterId).get();
    if (cursorDoc.exists) query = query.startAfter(cursorDoc);
  }

  const snapshot = await query.limit(limitCount + 1).get();
  const hasMore = snapshot.docs.length > limitCount;
  const docs = snapshot.docs.slice(0, limitCount);

  return {
    products: docs.map(serializeProduct),
    hasMore,
    lastId: docs.length ? docs[docs.length - 1].id : null,
  };
}

export async function getProductSlugsPage({ offset = 0, limitCount = 40000 } = {}) {
  const snapshot = await productsRef()
    .where("status", "==", PRODUCT_STATUS.PUBLISHED)
    .orderBy("updatedAt", "desc")
    .select("slug", "updatedAt")
    .offset(offset)
    .limit(limitCount)
    .get();

  return snapshot.docs.map((doc) => ({
    slug: doc.data().slug,
    updatedAt: doc.data().updatedAt?.toDate?.().toISOString() ?? null,
  }));
}

export const getProduct = cache(async function getProduct(id) {
  const doc = await productsRef().doc(id).get();
  if (!doc.exists) return null;
  return serializeProduct(doc);
});

export const getProductBySlug = cache(async function getProductBySlug(slug) {
  const snapshot = await productsRef()
    .where("slug", "==", slug)
    .where("status", "==", PRODUCT_STATUS.PUBLISHED)
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  return serializeProduct(snapshot.docs[0]);
});

export async function createProduct(data, adminUid) {
  const validationError = validateProductInput(data);
  if (validationError) {
    return { success: false, message: validationError, error: "VALIDATION_ERROR" };
  }

  const slug = slugify(data.slug || data.title);
  if (await isSlugTaken(slug)) {
    return { success: false, message: "Slug sudah digunakan.", error: "SLUG_TAKEN" };
  }

  const docRef = await productsRef().add({
    ...buildProductPayload(data),
    slug,
    searchKeywords: buildSearchKeywords({ ...data, slug }),
    status: PRODUCT_STATUS.DRAFT,
    clickCount: 0,
    createdBy: adminUid,
    updatedBy: adminUid,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { success: true, message: "Product berhasil dibuat.", data: { id: docRef.id } };
}

export async function updateProduct(id, data, adminUid) {
  const validationError = validateProductInput(data);
  if (validationError) {
    return { success: false, message: validationError, error: "VALIDATION_ERROR" };
  }

  const slug = slugify(data.slug || data.title);
  if (await isSlugTaken(slug, id)) {
    return { success: false, message: "Slug sudah digunakan.", error: "SLUG_TAKEN" };
  }

  const status = data.published ? PRODUCT_STATUS.PUBLISHED : PRODUCT_STATUS.DRAFT;
  const current = await productsRef().doc(id).get();
  const wasPublished = current.exists && current.data().status === PRODUCT_STATUS.PUBLISHED;

  await productsRef()
    .doc(id)
    .update({
      ...buildProductPayload(data),
      slug,
      searchKeywords: buildSearchKeywords({ ...data, slug }),
      status,
      updatedBy: adminUid,
      updatedAt: FieldValue.serverTimestamp(),
      ...(status === PRODUCT_STATUS.PUBLISHED && !wasPublished
        ? { publishedAt: FieldValue.serverTimestamp() }
        : {}),
    });

  return { success: true, message: "Product berhasil diperbarui." };
}

export async function archiveProduct(id, adminUid) {
  await productsRef().doc(id).update({
    status: PRODUCT_STATUS.ARCHIVED,
    updatedBy: adminUid,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { success: true, message: "Product berhasil diarsipkan." };
}

export async function deleteProduct(id) {
  await productsRef().doc(id).delete();
  return { success: true, message: "Product berhasil dihapus." };
}

export async function duplicateProduct(id, adminUid) {
  const original = await getProduct(id);
  if (!original) {
    return { success: false, message: "Product tidak ditemukan.", error: "NOT_FOUND" };
  }

  let slug = `${original.slug}-copy`;
  while (await isSlugTaken(slug)) {
    slug = `${slug}-copy`;
  }

  const docRef = await productsRef().add({
    ...buildProductPayload(original),
    title: `${original.title} (Copy)`,
    slug,
    searchKeywords: buildSearchKeywords({ ...original, slug }),
    status: PRODUCT_STATUS.DRAFT,
    clickCount: 0,
    createdBy: adminUid,
    updatedBy: adminUid,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { success: true, message: "Product berhasil diduplikasi.", data: { id: docRef.id } };
}
