import { AggregateField } from "firebase-admin/firestore";
import { getAdminDb } from "@/services/firebase/admin";
import { PRODUCTS_COLLECTION } from "@/constants/product";
import { MARKETPLACES } from "@/constants/marketplace";
import { getCategories } from "@/services/category/category.service";
import { getCollections } from "@/services/collection/collection.service";
import { getPopularProducts } from "@/services/product/product.service";

const CLICK_LOGS_COLLECTION = "clickLogs";
const SEARCH_LOGS_COLLECTION = "searchLogs";
const CLICK_LOGS_SCAN_LIMIT = 5000;

function resolveDateRange(range) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (range === "yesterday") {
    const start = new Date(startOfToday);
    start.setDate(start.getDate() - 1);
    return { start, end: startOfToday };
  }
  if (range === "7d") {
    const start = new Date(startOfToday);
    start.setDate(start.getDate() - 7);
    return { start, end: null };
  }
  if (range === "30d") {
    const start = new Date(startOfToday);
    start.setDate(start.getDate() - 30);
    return { start, end: null };
  }
  if (range === "all") {
    return { start: null, end: null };
  }
  return { start: startOfToday, end: null };
}

function applyDateRange(query, range) {
  const { start, end } = resolveDateRange(range);
  let next = query;
  if (start) next = next.where("clickedAt", ">=", start);
  if (end) next = next.where("clickedAt", "<", end);
  return next;
}

export async function getRangeSummary(range) {
  const clickLogsRef = getAdminDb().collection(CLICK_LOGS_COLLECTION);
  const searchLogsRef = getAdminDb().collection(SEARCH_LOGS_COLLECTION);
  const { start, end } = resolveDateRange(range);

  let clickQuery = clickLogsRef;
  let searchQuery = searchLogsRef;
  if (start) {
    clickQuery = clickQuery.where("clickedAt", ">=", start);
    searchQuery = searchQuery.where("createdAt", ">=", start);
  }
  if (end) {
    clickQuery = clickQuery.where("clickedAt", "<", end);
    searchQuery = searchQuery.where("createdAt", "<", end);
  }

  const [clickSnap, searchSnap] = await Promise.all([clickQuery.count().get(), searchQuery.count().get()]);

  return { totalClicks: clickSnap.data().count, totalSearches: searchSnap.data().count };
}

export async function getTopProductsByClicks({ range = "all", limitCount = 10 } = {}) {
  if (range === "all") {
    const products = await getPopularProducts(limitCount);
    return products.map((product) => ({ ...product, rangeClicks: product.clickCount ?? 0 }));
  }

  const query = applyDateRange(getAdminDb().collection(CLICK_LOGS_COLLECTION), range).limit(CLICK_LOGS_SCAN_LIMIT);
  const snapshot = await query.get();

  const countByProduct = new Map();
  snapshot.docs.forEach((doc) => {
    const { productId } = doc.data();
    countByProduct.set(productId, (countByProduct.get(productId) ?? 0) + 1);
  });

  const topEntries = Array.from(countByProduct.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limitCount);

  const products = await Promise.all(
    topEntries.map(async ([productId, rangeClicks]) => {
      const doc = await getAdminDb().collection(PRODUCTS_COLLECTION).doc(productId).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data(), rangeClicks };
    })
  );

  return products.filter(Boolean);
}

export async function getMarketplaceClickStats({ range = "all" } = {}) {
  return Promise.all(
    MARKETPLACES.map(async ({ value, label }) => {
      if (range === "all") {
        const snapshot = await getAdminDb()
          .collection(PRODUCTS_COLLECTION)
          .where("marketplace", "==", value)
          .aggregate({ totalClicks: AggregateField.sum("clickCount") })
          .get();
        return { marketplace: value, label, totalClicks: snapshot.data().totalClicks ?? 0 };
      }

      const query = applyDateRange(
        getAdminDb().collection(CLICK_LOGS_COLLECTION).where("marketplace", "==", value),
        range
      );
      const snapshot = await query.count().get();
      return { marketplace: value, label, totalClicks: snapshot.data().count };
    })
  );
}

export async function getCategoryAnalytics() {
  const categories = await getCategories(true);

  return Promise.all(
    categories.map(async (category) => {
      const snapshot = await getAdminDb()
        .collection(PRODUCTS_COLLECTION)
        .where("categoryId", "==", category.id)
        .aggregate({ productCount: AggregateField.count(), totalClicks: AggregateField.sum("clickCount") })
        .get();
      const data = snapshot.data();
      return {
        id: category.id,
        name: category.name,
        productCount: data.productCount,
        totalClicks: data.totalClicks ?? 0,
      };
    })
  );
}

export async function getCollectionAnalytics() {
  const collections = await getCollections(true);

  return Promise.all(
    collections.map(async (collection) => {
      const snapshot = await getAdminDb()
        .collection(PRODUCTS_COLLECTION)
        .where("collectionIds", "array-contains", collection.id)
        .aggregate({ productCount: AggregateField.count(), totalClicks: AggregateField.sum("clickCount") })
        .get();
      const data = snapshot.data();
      return {
        id: collection.id,
        name: collection.name,
        productCount: data.productCount,
        totalClicks: data.totalClicks ?? 0,
      };
    })
  );
}

export async function getSearchAnalytics({ range = "all", limitCount = 20 } = {}) {
  let query = getAdminDb().collection(SEARCH_LOGS_COLLECTION).orderBy("createdAt", "desc");
  const { start, end } = resolveDateRange(range);
  if (start) query = query.where("createdAt", ">=", start);
  if (end) query = query.where("createdAt", "<", end);

  const snapshot = await query.limit(limitCount).get();

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
