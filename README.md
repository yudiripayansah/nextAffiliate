# Affiliate CMS

Next.js App Router CMS untuk mengelola katalog produk affiliate (Shopee, Tokopedia, TikTok Shop).

Dokumentasi lengkap ada di [`docs/`](./docs) — mulai dari [`docs/README.md`](./docs/README.md) dan [`docs/CLAUDE.md`](./docs/CLAUDE.md) sebelum mengerjakan fitur apapun.

## Getting Started

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Referensi

- [docs/PROJECT_OVERVIEW.md](./docs/PROJECT_OVERVIEW.md) — tujuan & scope
- [docs/TECH_STACK.md](./docs/TECH_STACK.md) — stack teknis
- [docs/FOLDER_STRUCTURE.md](./docs/FOLDER_STRUCTURE.md) — struktur folder wajib
- [docs/CLAUDE_TASKS.md](./docs/CLAUDE_TASKS.md) — daftar task pengembangan

## Deployment (Vercel)

1. Push repo ini ke GitHub.
2. Import project di [vercel.com/new](https://vercel.com/new), pilih repo ini.
3. Di Vercel Project Settings → Environment Variables, isi semua variable dari `.env.example` (Firebase client config, `FIREBASE_ADMIN_*`, Cloudinary, dll) untuk environment Production **dan** Preview.
4. Deploy Firestore rules & indexes sekali dari lokal (butuh login `firebase-tools`):
   ```bash
   npx firebase-tools deploy --only firestore --project <project-id>
   ```
5. Tunggu build Vercel selesai, lalu buat 1 admin pertama secara manual: buat user di Firebase Authentication, lalu tambahkan dokumen di collection `admins` dengan `uid` yang sama berisi `{ email, displayName, role: "admin", active: true }` (tidak ada halaman signup, sesuai desain).

Branch `main` dipakai sebagai production (auto-deploy oleh Vercel setiap push).

## Importer (opsional)

Tool CLI terpisah untuk import produk dari Shopee/Tokopedia/TikTok Shop ada di [`importer/`](./importer) — lihat [`importer/README.md`](./importer/README.md). Tool ini **tidak ikut ter-deploy**, hanya dijalankan lokal.
