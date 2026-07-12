/**
 * Import produk dari data hasil ekstraksi browser (p*.json), dengan rehost gambar:
 * setiap gambar di-upload ke Cloudinary (folder affiliate-cms/media)
 * dan didaftarkan ke koleksi `files` supaya muncul di File Manager.
 *
 * Jalankan dari root repo (butuh CLOUDINARY_* dan FIREBASE_ADMIN_* di env):
 *   node --env-file=.env.local importer/scripts/importStore.mjs <dataDir> [--dry] [--limit N]
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";
import { FieldValue } from "firebase-admin/firestore";
import { findProductByOriginalUrl, insertProduct } from "../src/services/productService.js";
import { getDb } from "../src/services/firebaseAdmin.js";
import { slugify, parsePrice, generateSeoTitle, generateSeoDescription, generateTags } from "../src/utils/normalize.js";

const requireFromRoot = createRequire(new URL("../../package.json", import.meta.url));
const { v2: cloudinary } = requireFromRoot("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const MAX_IMAGES_PER_PRODUCT = 4;
const DELAY_MS = 500;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function ensureCategory() {
  const db = getDb();
  const snapshot = await db.collection("categories").get();
  const categories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const existing = categories.find((category) => /mainan|hobi|figur|gundam|koleksi/i.test(category.name ?? ""));
  if (existing) return existing;

  const docRef = await db.collection("categories").add({
    name: "Mainan & Hobi",
    slug: "mainan-hobi",
    description: "Model kit, action figure, dan barang koleksi hobi.",
    image: "",
    icon: "🤖",
    seoTitle: "",
    seoDescription: "",
    sortOrder: categories.length,
    published: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  console.log(`Kategori baru dibuat: Mainan & Hobi (${docRef.id})`);
  return { id: docRef.id, name: "Mainan & Hobi" };
}

async function uploadToCloudinary(imageUrl) {
  const options = { folder: "affiliate-cms/media", resource_type: "image" };

  try {
    return await cloudinary.uploader.upload(imageUrl, options);
  } catch {
    // Fallback: download sendiri (beberapa CDN menolak fetch dari server Cloudinary).
    const response = await fetch(imageUrl, { headers: { "User-Agent": USER_AGENT } });
    if (!response.ok) throw new Error(`Gagal download gambar (HTTP ${response.status})`);

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = Buffer.from(await response.arrayBuffer());
    const dataUri = `data:${contentType};base64,${buffer.toString("base64")}`;
    return await cloudinary.uploader.upload(dataUri, options);
  }
}

async function rehostImages(imageUrls, baseName) {
  const db = getDb();
  const rehosted = [];

  for (let index = 0; index < imageUrls.length; index++) {
    const result = await uploadToCloudinary(imageUrls[index]);

    await db.collection("files").add({
      url: result.secure_url,
      publicId: result.public_id,
      name: `${baseName}-${index + 1}`,
      size: result.bytes ?? 0,
      format: result.format ?? "",
      width: result.width ?? 0,
      height: result.height ?? 0,
      createdAt: FieldValue.serverTimestamp(),
    });

    rehosted.push(result.secure_url);
  }

  return rehosted;
}

function buildProduct(raw) {
  if (!raw.title) throw new Error("Data tidak punya title.");

  const price = parsePrice(raw.priceText);
  if (!price) throw new Error(`Harga tidak terbaca: "${raw.priceText}"`);

  const soldMatch = (raw.sold ?? "").match(/\d+/);

  return {
    title: raw.title,
    shortDescription: (raw.description ?? "").slice(0, 160),
    description: raw.description ?? "",
    price,
    originalPrice: parsePrice(raw.originalPriceText) || null,
    images: raw.images ?? [],
    brand: "",
    rating: Number(String(raw.rating ?? "").replace(",", ".")) || 0,
    sold: soldMatch ? Number(soldMatch[0]) : 0,
    affiliateUrl: raw.url,
    originalUrl: raw.url,
    marketplace: "tokopedia",
    seoTitle: generateSeoTitle(raw.title),
    seoDescription: generateSeoDescription(raw.title, raw.description),
    tags: generateTags(raw.title),
  };
}

async function run() {
  const args = process.argv.slice(2);
  const dataDir = args.find((arg) => !arg.startsWith("--"));
  const isDry = args.includes("--dry");
  const limitArg = args.indexOf("--limit");
  const limit = limitArg !== -1 ? Number(args[limitArg + 1]) : Infinity;

  if (!dataDir) {
    console.error("Usage: node importStore.mjs <dataDir> [--dry] [--limit N]");
    process.exit(1);
  }

  const items = readdirSync(dataDir)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .slice(0, limit)
    .map((name) => JSON.parse(readFileSync(join(dataDir, name), "utf8")));

  console.log(`${items.length} produk akan diproses${isDry ? " (dry run — tidak menyimpan)" : ""}.\n`);

  const category = isDry ? null : await ensureCategory();
  if (category) console.log(`Kategori: ${category.name} (${category.id})\n`);

  const summary = { success: 0, skipped: 0, failed: 0 };

  for (let index = 0; index < items.length; index++) {
    const raw = items[index];
    const label = `[${index + 1}/${items.length}]`;

    try {
      const product = buildProduct(raw);

      const existing = await findProductByOriginalUrl(product.originalUrl);
      if (existing) {
        console.log(`${label} SKIP (sudah ada): ${product.originalUrl}`);
        summary.skipped += 1;
        continue;
      }

      const uniqueImages = [...new Set(product.images)].slice(0, MAX_IMAGES_PER_PRODUCT);

      if (isDry) {
        console.log(`${label} DRY: ${product.title} | Rp ${product.price.toLocaleString("id-ID")} | ${uniqueImages.length} gambar`);
        continue;
      }

      if (!uniqueImages.length) throw new Error("Tidak ada gambar yang bisa diambil.");
      const rehostedImages = await rehostImages(uniqueImages, slugify(product.title).slice(0, 60));

      const productId = await insertProduct({
        ...product,
        images: rehostedImages,
        categoryId: category.id,
      });

      console.log(`${label} OK  Rp ${product.price.toLocaleString("id-ID")}  ${rehostedImages.length} gambar  ${product.title.slice(0, 60)}  (${productId})`);
      summary.success += 1;
    } catch (error) {
      console.error(`${label} GAGAL: ${raw.url ?? "?"}\n      ${error.message}`);
      summary.failed += 1;
    }

    await sleep(DELAY_MS);
  }

  console.log(`\nSelesai. Berhasil: ${summary.success}, dilewati: ${summary.skipped}, gagal: ${summary.failed}`);
  process.exit(summary.failed && !summary.success ? 1 : 0);
}

run().catch((error) => {
  console.error("Fatal:", error);
  process.exit(1);
});
