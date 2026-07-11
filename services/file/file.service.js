import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/services/firebase/admin";

const FILES_COLLECTION = "files";

function filesRef() {
  return getAdminDb().collection(FILES_COLLECTION);
}

function serializeFile(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate?.().toISOString() ?? null,
  };
}

export async function getFiles(pageLimit = 200) {
  const snapshot = await filesRef()
    .orderBy("createdAt", "desc")
    .limit(pageLimit)
    .get();

  return snapshot.docs.map(serializeFile);
}

export async function createFile(data) {
  if (!data.url || !data.publicId) {
    return { success: false, message: "Data file tidak lengkap.", error: "INVALID_FILE" };
  }

  const docRef = await filesRef().add({
    url: data.url,
    publicId: data.publicId,
    name: data.name ?? "",
    size: data.size ?? 0,
    format: data.format ?? "",
    width: data.width ?? 0,
    height: data.height ?? 0,
    createdAt: FieldValue.serverTimestamp(),
  });

  const doc = await docRef.get();
  return { success: true, message: "File berhasil diupload.", data: serializeFile(doc) };
}

export async function deleteFile(id) {
  const doc = await filesRef().doc(id).get();
  if (!doc.exists) {
    return { success: false, message: "File tidak ditemukan.", error: "NOT_FOUND" };
  }

  await filesRef().doc(id).delete();
  return { success: true, message: "File berhasil dihapus." };
}
