import Link from "next/link";
import { getCategories } from "@/services/category/category.service";
import { getCollections } from "@/services/collection/collection.service";
import { getSettings } from "@/services/settings/settings.service";
import Container from "@/components/layout/Container";

const QUICK_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/about" },
  { label: "Cari Produk", href: "/search" },
];

const LEGAL_LINKS = [
  { label: "Kebijakan Privasi", href: "/privacy" },
  { label: "Disclaimer Affiliate", href: "/disclaimer" },
];

export default async function Footer() {
  const [categories, collections, settings] = await Promise.all([
    getCategories(true),
    getCollections(true),
    getSettings(),
  ]);

  const topCategories = categories.slice(0, 6);
  const topCollections = collections.slice(0, 6);
  const siteName = settings.siteName || "Affiliate CMS";
  const copyright = settings.footerCopyright || `© ${new Date().getFullYear()} ${siteName}. Seluruh hak dilindungi.`;

  return (
    <footer className="border-t bg-background">
      <Container className="flex flex-col gap-2 border-b border-dashed py-6 text-center">
        <p className="font-display text-base font-bold text-foreground">{siteName}</p>
        <p className="text-xs text-muted-foreground">
          Kami bisa mendapat komisi dari pembelian lewat tautan di situs ini — tanpa biaya tambahan untukmu. Harga
          &amp; transaksi tetap sepenuhnya ditangani oleh marketplace terkait.
        </p>
      </Container>

      <Container className="grid grid-cols-2 gap-8 py-10 sm:grid-cols-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Tautan</p>
          {QUICK_LINKS.map(({ label, href }) => (
            <Link key={href} href={href} className="text-sm text-muted-foreground hover:text-foreground">
              {label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Kategori</p>
          {topCategories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {category.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Koleksi</p>
          {topCollections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collection/${collection.slug}`}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {collection.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Legal</p>
          {LEGAL_LINKS.map(({ label, href }) => (
            <Link key={href} href={href} className="text-sm text-muted-foreground hover:text-foreground">
              {label}
            </Link>
          ))}
        </div>
      </Container>

      <div className="border-t py-4">
        <Container>
          <p className="text-center text-xs text-muted-foreground">{copyright}</p>
        </Container>
      </div>
    </footer>
  );
}
