import Link from "next/link";
import { getCategories } from "@/services/category/category.service";
import { getCollections } from "@/services/collection/collection.service";
import { getSettings } from "@/services/settings/settings.service";
import Container from "@/components/layout/Container";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Search", href: "/search" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Affiliate Disclaimer", href: "/disclaimer" },
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
  const copyright = settings.footerCopyright || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`;

  return (
    <footer className="border-t bg-background">
      <Container className="grid grid-cols-2 gap-8 py-10 sm:grid-cols-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Quick Links</p>
          {QUICK_LINKS.map(({ label, href }) => (
            <Link key={href} href={href} className="text-sm text-muted-foreground hover:text-foreground">
              {label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Category</p>
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
          <p className="text-sm font-semibold">Collection</p>
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
