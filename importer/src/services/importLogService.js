import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "./firebaseAdmin.js";

const IMPORT_LOGS_COLLECTION = "importLogs";
const PARSER_VERSION = "1.0.0";

export const IMPORT_STATUS = {
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  SKIPPED: "SKIPPED",
  UPDATED: "UPDATED",
};

export async function logImport({ marketplace, url, status, message, createdProductId, duration }) {
  await getDb()
    .collection(IMPORT_LOGS_COLLECTION)
    .add({
      marketplace: marketplace || "unknown",
      url,
      status,
      message: message || "",
      createdProductId: createdProductId || null,
      duration,
      parserVersion: PARSER_VERSION,
      createdAt: FieldValue.serverTimestamp(),
    });
}
