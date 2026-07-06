# Affiliate CMS Importer

CLI lokal untuk import produk affiliate (Shopee, Tokopedia, TikTok Shop) langsung ke Firestore.

Tool ini **terpisah dari website** — hanya jalan di komputer Anda sendiri, memakai Firebase Service Account, dan **tidak pernah di-deploy**.

## Setup

1. Buat Service Account key di Firebase Console (Project Settings → Service Accounts → Generate new private key).
2. Salin `.env.example` menjadi `.env.local`, isi `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY` dari file JSON tersebut (harus project Firebase yang sama dengan website).
3. Install dependency:
   ```
   npm install
   ```
4. Jalankan:
   ```
   npm start
   ```

## Menu

- **Import URL** — paste link produk Shopee/Tokopedia/TikTok Shop, preview, edit, lalu simpan sebagai draft.
- **Import CSV** — import banyak produk sekaligus dari file CSV (wajib ada kolom `affiliateUrl`; opsional `title`, `price`, `brand`). Hasil disimpan sebagai laporan CSV di folder `reports/`.
- **Sync Price** — cek ulang harga produk yang sudah ada di Firestore, update jika berubah.
- **Check Duplicate** — cek apakah sebuah URL sudah pernah diimport.

## Catatan penting

Parser (`src/parsers/`) membaca **meta tag Open Graph dan JSON-LD publik** dari halaman produk (bukan API resmi marketplace, bukan headless browser, bukan teknik bypass proteksi apa pun). Setiap marketplace bisa mengubah struktur halamannya kapan saja, jadi hasil ekstraksi bisa saja tidak lengkap (khususnya Shopee, yang banyak me-render konten via JavaScript sehingga sebagian data mungkin tidak muncul di HTML awal). Selalu cek hasil **Preview** sebelum menyimpan, dan lengkapi manual lewat admin dashboard bila ada field yang kosong.

Semua produk hasil import berstatus **draft** — publish manual dari admin dashboard setelah direview.
