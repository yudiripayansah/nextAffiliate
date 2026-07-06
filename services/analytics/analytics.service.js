import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/services/firebase/admin";
import { PRODUCTS_COLLECTION } from "@/constants/product";
import { parseDevice, parseBrowser } from "@/utils/parseUserAgent";

const CLICK_LOGS_COLLECTION = "clickLogs";
const SEARCH_LOGS_COLLECTION = "searchLogs";
const DUPLICATE_CLICK_WINDOW_MS = 2000;

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export async function getClickStats() {
  const ref = getAdminDb().collection(CLICK_LOGS_COLLECTION);

  const [totalSnap, todaySnap] = await Promise.all([
    ref.count().get(),
    ref.where("clickedAt", ">=", startOfToday()).count().get(),
  ]);

  return {
    total: totalSnap.data().count,
    today: todaySnap.data().count,
  };
}

async function isDuplicateClick(productId) {
  const snapshot = await getAdminDb()
    .collection(CLICK_LOGS_COLLECTION)
    .where("productId", "==", productId)
    .orderBy("clickedAt", "desc")
    .limit(1)
    .get();

  if (snapshot.empty) return false;

  const lastClickedAt = snapshot.docs[0].data().clickedAt?.toMillis?.();
  if (!lastClickedAt) return false;

  return Date.now() - lastClickedAt < DUPLICATE_CLICK_WINDOW_MS;
}

export async function logClick(product, request) {
  const userAgent = request.headers.get("user-agent") ?? "";
  const referer = request.headers.get("referer") ?? "";

  const isDuplicate = await isDuplicateClick(product.id);
  if (isDuplicate) return;

  await Promise.all([
    getAdminDb()
      .collection(CLICK_LOGS_COLLECTION)
      .add({
        productId: product.id,
        slug: product.slug,
        marketplace: product.marketplace,
        device: parseDevice(userAgent),
        browser: parseBrowser(userAgent),
        referer,
        clickedAt: FieldValue.serverTimestamp(),
      }),
    getAdminDb()
      .collection(PRODUCTS_COLLECTION)
      .doc(product.id)
      .update({ clickCount: FieldValue.increment(1) }),
  ]);
}

export async function logSearchQuery(keyword, resultCount) {
  if (!keyword?.trim()) return;

  await getAdminDb()
    .collection(SEARCH_LOGS_COLLECTION)
    .add({ keyword: keyword.trim(), resultCount, createdAt: FieldValue.serverTimestamp() });
}

export async function getRecentSearches(limitCount = 5) {
  const snapshot = await getAdminDb()
    .collection(SEARCH_LOGS_COLLECTION)
    .orderBy("createdAt", "desc")
    .limit(limitCount)
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      keyword: data.keyword,
      resultCount: data.resultCount,
      createdAt: data.createdAt?.toDate?.().toISOString() ?? null,
    };
  });
}
