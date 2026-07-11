/**
 * Seed kategori & collection paling banyak dicari (riset Shopee/Tokopedia/TikTok Shop).
 * Gambar di-upload ke Cloudinary dulu (folder affiliate-cms/*) agar sesuai
 * remotePatterns next.config.mjs, lalu dokumen dibuat di Firestore.
 *
 * Jalankan: node --env-file=.env.local scripts/seed-taxonomy.mjs
 * Idempotent: slug yang sudah ada di-skip.
 */
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { v2 as cloudinary } from "cloudinary";

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const db = getFirestore();

const unsplash = (id, w, h) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=80&auto=format`;

// Kategori teratas hasil riset pasar marketplace Indonesia 2025-2026.
const CATEGORIES = [
  {
    name: "Fashion Wanita",
    slug: "fashion-wanita",
    icon: "👗",
    sourceImage: unsplash("1483985988355-763728e1935b", 1200, 1200),
    description:
      "Dress, atasan, hijab, tas, dan sepatu wanita terkini. Tampil stylish setiap hari dengan koleksi fashion wanita pilihan harga terbaik.",
    seoTitle: "Fashion Wanita Terbaru & Termurah",
    seoDescription:
      "Belanja fashion wanita terlengkap: dress, atasan, hijab, tas & sepatu. Rekomendasi produk terlaris dengan harga terbaik dari marketplace favorit.",
  },
  {
    name: "Fashion Pria",
    slug: "fashion-pria",
    icon: "👔",
    sourceImage: unsplash("1617137968427-85924c800a22", 1200, 1200),
    description:
      "Kaos, kemeja, celana, jaket, hingga sepatu pria. Koleksi outfit pria kekinian yang nyaman dipakai dan ramah di kantong.",
    seoTitle: "Fashion Pria Kekinian Harga Terbaik",
    seoDescription:
      "Temukan kaos, kemeja, jaket, celana & sepatu pria terlaris. Rekomendasi outfit pria kekinian dengan harga terbaik dari marketplace favorit.",
  },
  {
    name: "Kecantikan & Skincare",
    slug: "kecantikan-skincare",
    icon: "💄",
    sourceImage: unsplash("1596462502278-27bfdc403348", 1200, 1200),
    description:
      "Skincare, makeup, parfum, dan perawatan tubuh terlaris. Glowing maksimal dengan produk kecantikan viral pilihan.",
    seoTitle: "Skincare & Kosmetik Viral Terlaris",
    seoDescription:
      "Belanja skincare, makeup, parfum & bodycare terlaris. Rekomendasi produk kecantikan viral dengan review terbaik dan harga termurah.",
  },
  {
    name: "Elektronik",
    slug: "elektronik",
    icon: "🎧",
    sourceImage: unsplash("1498049794561-7780e7231661", 1200, 1200),
    description:
      "TWS, headphone, smartwatch, speaker, hingga aksesoris gadget. Elektronik berkualitas dengan harga bersahabat.",
    seoTitle: "Elektronik & Aksesoris Gadget Terbaik",
    seoDescription:
      "Temukan TWS, smartwatch, speaker & aksesoris gadget terlaris. Rekomendasi elektronik berkualitas dengan harga terbaik di marketplace.",
  },
  {
    name: "Rumah Tangga",
    slug: "rumah-tangga",
    icon: "🏠",
    sourceImage: unsplash("1513694203232-719a280e022f", 1200, 1200),
    description:
      "Peralatan dapur, home storage, dekorasi, dan perlengkapan rumah. Bikin rumah makin rapi, nyaman, dan estetik.",
    seoTitle: "Perlengkapan Rumah Tangga Terlengkap",
    seoDescription:
      "Belanja peralatan dapur, storage, dekorasi & perlengkapan rumah terlaris. Rekomendasi produk rumah tangga estetik harga terbaik.",
  },
  {
    name: "Ibu & Bayi",
    slug: "ibu-bayi",
    icon: "🍼",
    sourceImage: unsplash("1519689680058-324335c77eba", 1200, 1200),
    description:
      "Perlengkapan bayi, mainan edukasi, dan kebutuhan ibu. Produk aman dan berkualitas untuk si kecil tersayang.",
    seoTitle: "Perlengkapan Ibu & Bayi Terpercaya",
    seoDescription:
      "Temukan perlengkapan bayi, mainan edukasi & kebutuhan ibu terlaris. Rekomendasi produk aman berkualitas dengan harga terbaik.",
  },
  {
    name: "Olahraga & Outdoor",
    slug: "olahraga-outdoor",
    icon: "⚽",
    sourceImage: unsplash("1571019613454-1cb2f99b2d8b", 1200, 1200),
    description:
      "Alat fitness, sepatu olahraga, hingga perlengkapan camping. Dukung gaya hidup aktif dengan gear terbaik.",
    seoTitle: "Alat Olahraga & Perlengkapan Outdoor",
    seoDescription:
      "Belanja alat fitness, sepatu olahraga & gear outdoor terlaris. Rekomendasi perlengkapan olahraga berkualitas harga terbaik.",
  },
  {
    name: "Makanan & Minuman",
    slug: "makanan-minuman",
    icon: "🍜",
    sourceImage: unsplash("1504674900247-0877df9cc836", 1200, 1200),
    description:
      "Camilan viral, kopi, bumbu praktis, hingga makanan sehat. Kategori paling laris di marketplace, selalu ada yang baru.",
    seoTitle: "Makanan & Minuman Viral Terlaris",
    seoDescription:
      "Temukan camilan viral, kopi, granola & bumbu praktis terlaris. Rekomendasi makanan minuman kekinian dengan harga terbaik.",
  },
];

// Collection bertema pencarian populer: viral TikTok, flash sale, skincare
// pemula, WFH setup, gaming budget, hampers/kado.
const COLLECTIONS = [
  {
    name: "Lagi Viral di TikTok",
    slug: "lagi-viral-di-tiktok",
    featured: true,
    sourceImage: unsplash("1596558450268-9c27524ba856", 1280, 720),
    description:
      "Produk-produk yang lagi ramai dibicarakan di TikTok. Racun belanja paling dicari — cek sebelum kehabisan!",
    seoTitle: "Produk Viral TikTok Paling Dicari",
    seoDescription:
      "Kumpulan produk viral TikTok terbaru yang lagi trending. Temukan racun belanja paling dicari dengan harga terbaik di sini.",
  },
  {
    name: "Flash Sale & Promo Hemat",
    slug: "flash-sale-promo-hemat",
    featured: true,
    sourceImage: unsplash("1607083206968-13611e3d76db", 1280, 720),
    description:
      "Diskon terbesar dan promo paling hemat hari ini. Produk berkualitas dengan potongan harga yang sayang dilewatkan.",
    seoTitle: "Flash Sale Hari Ini - Promo & Diskon Terbesar",
    seoDescription:
      "Jangan lewatkan flash sale dan promo hemat hari ini. Kumpulan produk diskon terbesar dari marketplace favorit, update setiap hari.",
  },
  {
    name: "Skincare Starter Kit",
    slug: "skincare-starter-kit",
    featured: true,
    sourceImage: unsplash("1620916566398-39f1143ab7be", 1280, 720),
    description:
      "Paket skincare dasar untuk pemula: cleanser, moisturizer, sunscreen, dan serum. Mulai rutinitas glowing dari sini.",
    seoTitle: "Skincare Starter Kit untuk Pemula",
    seoDescription:
      "Rekomendasi skincare starter kit untuk pemula: cleanser, moisturizer, sunscreen & serum terbaik dengan harga terjangkau.",
  },
  {
    name: "Setup Meja Kerja Estetik",
    slug: "setup-meja-kerja-estetik",
    featured: false,
    sourceImage: unsplash("1593062096033-9a26b09da705", 1280, 720),
    description:
      "Perlengkapan WFH dan setup meja kerja estetik: standing desk, monitor, lampu, hingga aksesoris pendukung produktivitas.",
    seoTitle: "Setup Meja Kerja Estetik & Produktif",
    seoDescription:
      "Inspirasi setup meja kerja estetik untuk WFH: meja, monitor, keyboard, lampu & aksesoris produktivitas dengan harga terbaik.",
  },
  {
    name: "Gaming Gear Budget",
    slug: "gaming-gear-budget",
    featured: false,
    sourceImage: unsplash("1542751371-adc38448a05e", 1280, 720),
    description:
      "Headset, keyboard, mouse, dan aksesoris gaming murah tapi berkualitas. Push rank tanpa bikin dompet menjerit.",
    seoTitle: "Gaming Gear Murah Berkualitas",
    seoDescription:
      "Rekomendasi gaming gear budget: headset, keyboard, mouse & aksesoris gaming murah berkualitas untuk pengalaman main maksimal.",
  },
  {
    name: "Ide Kado Spesial",
    slug: "ide-kado-spesial",
    featured: false,
    sourceImage: unsplash("1549465220-1a8b9238cd48", 1280, 720),
    description:
      "Inspirasi kado dan hampers untuk orang tersayang: ulang tahun, anniversary, wisuda, hingga hari raya.",
    seoTitle: "Ide Kado & Hampers Spesial",
    seoDescription:
      "Temukan ide kado dan hampers spesial untuk ulang tahun, anniversary & hari raya. Rekomendasi hadiah berkesan harga terjangkau.",
  },
];

async function uploadImage(sourceUrl, folder, slug) {
  const result = await cloudinary.uploader.upload(sourceUrl, {
    folder: `affiliate-cms/${folder}`,
    public_id: slug,
    overwrite: true,
    resource_type: "image",
    quality: "auto",
    fetch_format: "auto",
  });
  return result.secure_url;
}

async function getExistingSlugs(collectionName) {
  const snapshot = await db.collection(collectionName).select("slug").get();
  return new Set(snapshot.docs.map((doc) => doc.data().slug));
}

async function getMaxSortOrder() {
  const snapshot = await db
    .collection("categories")
    .orderBy("sortOrder", "desc")
    .limit(1)
    .get();
  return snapshot.empty ? 0 : snapshot.docs[0].data().sortOrder ?? 0;
}

async function seedCategories() {
  const existing = await getExistingSlugs("categories");
  let sortOrder = await getMaxSortOrder();

  for (const category of CATEGORIES) {
    if (existing.has(category.slug)) {
      console.log(`skip category: ${category.slug} (sudah ada)`);
      continue;
    }

    const image = await uploadImage(category.sourceImage, "categories", category.slug);
    sortOrder += 1;

    await db.collection("categories").add({
      name: category.name,
      slug: category.slug,
      description: category.description,
      image,
      icon: category.icon,
      seoTitle: category.seoTitle,
      seoDescription: category.seoDescription,
      sortOrder,
      published: true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    console.log(`created category: ${category.name} (sortOrder ${sortOrder})`);
  }
}

async function seedCollections() {
  const existing = await getExistingSlugs("collections");

  for (const collection of COLLECTIONS) {
    if (existing.has(collection.slug)) {
      console.log(`skip collection: ${collection.slug} (sudah ada)`);
      continue;
    }

    const image = await uploadImage(collection.sourceImage, "collections", collection.slug);

    await db.collection("collections").add({
      name: collection.name,
      slug: collection.slug,
      description: collection.description,
      image,
      seoTitle: collection.seoTitle,
      seoDescription: collection.seoDescription,
      featured: collection.featured,
      published: true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    console.log(`created collection: ${collection.name}${collection.featured ? " (featured)" : ""}`);
  }
}

await seedCategories();
await seedCollections();
console.log("Seed selesai.");
process.exit(0);
