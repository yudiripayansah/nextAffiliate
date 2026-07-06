import { cache } from "react";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/services/firebase/admin";
import { slugify } from "@/utils/slugify";

const COLLECTIONS_COLLECTION = "collections";

function collectionsRef() {
  return getAdminDb().collection(COLLECTIONS_COLLECTION);
}

function serializeCollection(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate?.().toISOString() ?? null,
    updatedAt: data.updatedAt?.toDate?.().toISOString() ?? null,
  };
}

export async function getCollectionCount() {
  const snapshot = await collectionsRef().count().get();
  return snapshot.data().count;
}

export const getCollections = cache(async function getCollections(onlyPublished = false) {
  let query = collectionsRef().orderBy("createdAt", "desc");
  if (onlyPublished) {
    query = query.where("published", "==", true);
  }

  const snapshot = await query.get();
  return snapshot.docs.map(serializeCollection);
});

export const getCollection = cache(async function getCollection(id) {
  const doc = await collectionsRef().doc(id).get();
  if (!doc.exists) return null;
  return serializeCollection(doc);
});

export const getCollectionBySlug = cache(async function getCollectionBySlug(slug) {
  const snapshot = await collectionsRef().where("slug", "==", slug).limit(1).get();
  if (snapshot.empty) return null;
  return serializeCollection(snapshot.docs[0]);
});

async function isSlugTaken(slug, excludeId) {
  const snapshot = await collectionsRef().where("slug", "==", slug).limit(1).get();
  if (snapshot.empty) return false;
  return snapshot.docs[0].id !== excludeId;
}

export async function createCollection(data) {
  if (!data.name || !data.name.trim()) {
    return { success: false, message: "Name wajib diisi.", error: "NAME_REQUIRED" };
  }

  const slug = slugify(data.slug || data.name);
  if (await isSlugTaken(slug)) {
    return { success: false, message: "Slug sudah digunakan.", error: "SLUG_TAKEN" };
  }

  const docRef = await collectionsRef().add({
    name: data.name.trim(),
    slug,
    description: data.description ?? "",
    image: data.image ?? "",
    seoTitle: data.seoTitle ?? "",
    seoDescription: data.seoDescription ?? "",
    featured: Boolean(data.featured),
    published: Boolean(data.published),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { success: true, message: "Collection berhasil dibuat.", data: { id: docRef.id } };
}

export async function updateCollection(id, data) {
  if (!data.name || !data.name.trim()) {
    return { success: false, message: "Name wajib diisi.", error: "NAME_REQUIRED" };
  }

  const slug = slugify(data.slug || data.name);
  if (await isSlugTaken(slug, id)) {
    return { success: false, message: "Slug sudah digunakan.", error: "SLUG_TAKEN" };
  }

  await collectionsRef().doc(id).update({
    name: data.name.trim(),
    slug,
    description: data.description ?? "",
    image: data.image ?? "",
    seoTitle: data.seoTitle ?? "",
    seoDescription: data.seoDescription ?? "",
    featured: Boolean(data.featured),
    published: Boolean(data.published),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { success: true, message: "Collection berhasil diperbarui." };
}

export async function deleteCollection(id) {
  await collectionsRef().doc(id).delete();
  return { success: true, message: "Collection berhasil dihapus." };
}
