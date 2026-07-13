import Link from "next/link";
import { getCategories } from "@/services/category/category.service";
import { getCollections } from "@/services/collection/collection.service";
import { getSettings } from "@/services/settings/settings.service";
import Container from "@/components/layout/Container";
import { MARKETPLACES } from "@/constants/marketplace";

const INFO_LINKS = [
  { label: "Tentang Kami", href: "/about" },
  { label: "Kebijakan Privasi", href: "/privacy" },
  { label: "Disclaimer Affiliate", href: "/disclaimer" },
];

function FooterColumn({ title, children }) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="font-display text-sm font-bold text-brand">{title}</p>
      {children}
    </div>
  );
}

function FooterLink({ href, children }) {
  return (
    <Link href={href} className="text-sm opacity-75 transition-opacity hover:opacity-100">
      {children}
    </Link>
  );
}

export default async function Footer() {
  const [categories, collections, settings] = await Promise.all([
    getCategories(true),
    getCollections(true),
    getSettings(),
  ]);

  const topCategories = categories.slice(0, 6);
  const topCollections = collections.slice(0, 6);
  const siteName = settings.siteName || "Ayyasilla Shop";
  const copyright =
    settings.footerCopyright || `© ${new Date().getFullYear()} ${siteName}. Seluruh hak dilindungi.`;

  return (
    <footer className="bg-primary text-primary-foreground dark:bg-card dark:text-card-foreground">
      <Container className="grid grid-cols-2 gap-8 py-12 md:grid-cols-5">
        <div className="col-span-2 flex flex-col gap-3">
          <p className="font-display text-xl font-bold">
            <span className="text-brand" aria-hidden="true">✦ </span>
            {siteName}
          </p>
          <p className="max-w-sm text-xs leading-relaxed opacity-75">
            Kami bisa mendapat komisi dari pembelian lewat tautan di situs ini — tanpa biaya tambahan
            untukmu. Harga &amp; transaksi tetap sepenuhnya ditangani oleh marketplace terkait.
          </p>
        </div>

        <FooterColumn title="Kategori">
          {topCategories.map((category) => (
            <FooterLink key={category.id} href={`/category/${category.slug}`}>
              {category.name}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Koleksi">
          {topCollections.map((collection) => (
            <FooterLink key={collection.id} href={`/collection/${collection.slug}`}>
              {collection.name}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Info">
          {INFO_LINKS.map(({ label, href }) => (
            <FooterLink key={href} href={href}>
              {label}
            </FooterLink>
          ))}
        </FooterColumn>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-4 sm:flex-row">
          <p className="text-xs opacity-70">{copyright}</p>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide">
            <span className="opacity-70">Sumber resmi:</span>
            {MARKETPLACES.map((marketplace) => (
              <span key={marketplace.value} className="rounded-full bg-white/10 px-2.5 py-1">
                {marketplace.label}
              </span>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
