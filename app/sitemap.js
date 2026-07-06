import { getProductStats, getProductSlugsPage } from "@/services/product/product.service";
import { getCategories } from "@/services/category/category.service";
import { getCollections } from "@/services/collection/collection.service";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const PRODUCTS_PER_SHARD = 40000;
const STATIC_PAGES = ["", "/about", "/privacy", "/disclaimer"];

export const dynamic = "force-dynamic";

export async function generateSitemaps() {
  const stats = await getProductStats();
  const shardCount = Math.max(1, Math.ceil(stats.published / PRODUCTS_PER_SHARD));
  return Array.from({ length: shardCount }, (_, id) => ({ id }));
}

export default async function sitemap({ id } = {}) {
  const shardId = Number.isInteger(id) ? id : 0;
  const entries = [];

  if (shardId === 0) {
    STATIC_PAGES.forEach((path) => {
      entries.push({
        url: `${SITE_URL}${path}`,
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.5,
      });
    });

    const [categories, collections] = await Promise.all([
      getCategories(true),
      getCollections(true),
    ]);

    categories.forEach((category) => {
      entries.push({
        url: `${SITE_URL}/category/${category.slug}`,
        lastModified: category.updatedAt ?? undefined,
        changeFrequency: "daily",
        priority: 0.7,
      });
    });

    collections.forEach((collection) => {
      entries.push({
        url: `${SITE_URL}/collection/${collection.slug}`,
        lastModified: collection.updatedAt ?? undefined,
        changeFrequency: "daily",
        priority: 0.7,
      });
    });
  }

  const products = await getProductSlugsPage({
    offset: shardId * PRODUCTS_PER_SHARD,
    limitCount: PRODUCTS_PER_SHARD,
  });

  products.forEach((product) => {
    entries.push({
      url: `${SITE_URL}/product/${product.slug}`,
      lastModified: product.updatedAt ?? undefined,
      changeFrequency: "daily",
      priority: 0.6,
    });
  });

  return entries;
}
