/**
 * Import produk dari daftar URL Tokopedia, dengan rehost gambar:
 * setiap gambar di-download Cloudinary (folder affiliate-cms/media)
 * dan didaftarkan ke koleksi `files` supaya muncul di File Manager.
 *
 * Jalankan dari root repo (butuh CLOUDINARY_* dan FIREBASE_ADMIN_* di env):
 *   node --env-file=.env.local importer/scripts/importStore.mjs <urls.json> [--dry] [--limit N]
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { FieldValue } from "firebase-admin/firestore";
import { parseProduct } from "../src/importCore.js";
import { findProductByOriginalUrl, insertProduct } from "../src/services/productService.js";
import { getDb } from "../src/services/firebaseAdmin.js";
import { slugify } from "../src/utils/normalize.js";

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

async function run() {
  const args = process.argv.slice(2);
  const urlsFile = args.find((arg) => !arg.startsWith("--"));
  const isDry = args.includes("--dry");
  const limitArg = args.indexOf("--limit");
  const limit = limitArg !== -1 ? Number(args[limitArg + 1]) : Infinity;

  if (!urlsFile) {
    console.error("Usage: node importStore.mjs <urls.json> [--dry] [--limit N]");
    process.exit(1);
  }

  const urls = JSON.parse(readFileSync(urlsFile, "utf8")).slice(0, limit);
  console.log(`${urls.length} URL akan diproses${isDry ? " (dry run — tidak menyimpan)" : ""}.\n`);

  const category = isDry ? null : await ensureCategory();
  if (category) console.log(`Kategori: ${category.name} (${category.id})\n`);

  const summary = { success: 0, skipped: 0, failed: 0 };

  for (let index = 0; index < urls.length; index++) {
    const url = urls[index];
    const label = `[${index + 1}/${urls.length}]`;

    try {
      const existing = await findProductByOriginalUrl(url);
      if (existing) {
        console.log(`${label} SKIP (sudah ada): ${url}`);
        summary.skipped += 1;
        continue;
      }

      const product = await parseProduct(url);
      const uniqueImages = [...new Set(product.images)].slice(0, MAX_IMAGES_PER_PRODUCT);

      if (isDry) {
        console.log(`${label} DRY:`, JSON.stringify({
          title: product.title,
          price: product.price,
          brand: product.brand,
          rating: product.rating,
          images: uniqueImages,
        }, null, 2));
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
      console.error(`${label} GAGAL: ${url}\n      ${error.message}`);
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
