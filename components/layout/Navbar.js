import Link from "next/link";
import { getCategories } from "@/services/category/category.service";
import { getCollections } from "@/services/collection/collection.service";
import { getSettings } from "@/services/settings/settings.service";
import Container from "@/components/layout/Container";
import NavDropdown from "@/components/layout/NavDropdown";
import MobileNav from "@/components/layout/MobileNav";
import SearchBox from "@/components/search/SearchBox";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default async function Navbar() {
  const [categories, collections, settings] = await Promise.all([
    getCategories(true),
    getCollections(true),
    getSettings(),
  ]);

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <MobileNav categories={categories} collections={collections} siteName={settings.siteName} />
          <Link href="/" className="flex items-center gap-1.5 font-display text-lg font-bold text-foreground">
            <span className="text-primary">•</span>
            {settings.siteName || "Affiliate CMS"}
          </Link>
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          <NavDropdown label="Kategori" items={categories} basePath="/category" />
          <NavDropdown label="Koleksi" items={collections} basePath="/collection" />
          <Link href="/about" className="text-sm font-medium hover:text-primary">
            Tentang
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <SearchBox className="hidden w-64 sm:block" />
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
