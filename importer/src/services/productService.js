import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "./firebaseAdmin.js";
import { slugify } from "../utils/normalize.js";
import { buildSearchKeywords } from "../utils/searchKeywords.js";

const PRODUCTS_COLLECTION = "products";

function productsRef() {
  return getDb().collection(PRODUCTS_COLLECTION);
}

export async function findProductByOriginalUrl(originalUrl) {
  const snapshot = await productsRef().where("originalUrl", "==", originalUrl).limit(1).get();
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}

async function isSlugTaken(slug, excludeId) {
  const snapshot = await productsRef().where("slug", "==", slug).limit(1).get();
  if (snapshot.empty) return false;
  return snapshot.docs[0].id !== excludeId;
}

async function uniqueSlug(baseTitle, excludeId) {
  let slug = slugify(baseTitle);
  let attempt = 1;
  while (await isSlugTaken(slug, excludeId)) {
    attempt += 1;
    slug = `${slugify(baseTitle)}-${attempt}`;
  }
  return slug;
}

export async function insertProduct(product) {
  const slug = await uniqueSlug(product.title);

  const docRef = await productsRef().add({
    title: product.title,
    slug,
    shortDescription: product.shortDescription || "",
    description: product.description || "",
    affiliateUrl: product.affiliateUrl,
    originalUrl: product.originalUrl,
    marketplace: product.marketplace,
    categoryId: product.categoryId || null,
    collectionIds: [],
    images: product.images || [],
    thumbnail: product.images?.[0] || "",
    price: product.price ?? 0,
    originalPrice: product.originalPrice ?? null,
    discountPercentage: 0,
    rating: product.rating ?? 0,
    sold: product.sold ?? 0,
    brand: product.brand || "",
    tags: product.tags || [],
    seoTitle: product.seoTitle || "",
    seoDescription: product.seoDescription || "",
    faq: [],
    specifications: [],
    status: "draft",
    featured: false,
    clickCount: 0,
    searchKeywords: buildSearchKeywords({ title: product.title, slug, brand: product.brand, tags: product.tags }),
    createdBy: "importer-cli",
    updatedBy: "importer-cli",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return docRef.id;
}

export async function updateProductFromImport(id, product) {
  await productsRef()
    .doc(id)
    .update({
      title: product.title,
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      affiliateUrl: product.affiliateUrl,
      price: product.price ?? 0,
      originalPrice: product.originalPrice ?? null,
      ...(product.images?.length ? { images: product.images, thumbnail: product.images[0] } : {}),
      brand: product.brand || "",
      rating: product.rating ?? 0,
      sold: product.sold ?? 0,
      updatedBy: "importer-cli",
      updatedAt: FieldValue.serverTimestamp(),
    });
}

export async function updateProductPrice(id, price) {
  await productsRef().doc(id).update({
    price,
    updatedBy: "importer-cli",
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function listProductsWithOriginalUrl(limitCount = 200) {
  const snapshot = await productsRef().orderBy("updatedAt", "desc").limit(limitCount).get();
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((product) => Boolean(product.originalUrl));
}

export async function listCategories() {
  const snapshot = await getDb().collection("categories").orderBy("sortOrder", "asc").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
