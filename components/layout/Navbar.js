import Link from "next/link";
import { getCategories } from "@/services/category/category.service";
import { getCollections } from "@/services/collection/collection.service";
import { getSettings } from "@/services/settings/settings.service";
import Container from "@/components/layout/Container";
import TopBar from "@/components/layout/TopBar";
import CategoryMenu from "@/components/layout/CategoryMenu";
import NavDropdown from "@/components/layout/NavDropdown";
import MobileNav from "@/components/layout/MobileNav";
import SearchBox from "@/components/search/SearchBox";
import ThemeToggle from "@/components/layout/ThemeToggle";
import PwaInstallButton from "@/components/layout/PwaInstallButton";

export default async function Navbar() {
  const [categories, collections, settings] = await Promise.all([
    getCategories(true),
    getCollections(true),
    getSettings(),
  ]);
  const siteName = settings.siteName || "Ayyasilla Shop";

  return (
    <header className="sticky top-0 z-40 shadow-sm">
      <TopBar />

      <div className="bg-brand text-brand-foreground">
        <Container className="flex h-14 items-center gap-3 lg:h-[72px] lg:gap-8">
          <div className="flex min-w-0 items-center gap-1">
            <MobileNav categories={categories} collections={collections} siteName={siteName} />
            <Link
              href="/"
              className="flex items-center gap-1 truncate font-display text-lg font-bold lg:text-2xl"
            >
              <span aria-hidden="true">✦</span>
              {siteName}
            </Link>
          </div>

          <SearchBox className="mx-auto hidden w-full max-w-2xl flex-1 lg:block" />

          <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
            <PwaInstallButton />
            <ThemeToggle />
          </div>
        </Container>

        <Container className="pb-3 lg:hidden">
          <SearchBox />
        </Container>
      </div>

      <div className="hidden border-b bg-background lg:block">
        <Container className="flex h-12 items-center gap-6">
          <CategoryMenu categories={categories} />
          <nav className="flex items-center gap-6 text-sm font-semibold">
            <NavDropdown label="Koleksi" items={collections} basePath="/collection" />
            <Link href="/#trending" className="transition-colors hover:text-primary">
              Lagi Trending
            </Link>
            <Link href="/#terbaru" className="transition-colors hover:text-primary">
              Terbaru
            </Link>
            <Link href="/about" className="transition-colors hover:text-primary">
              Tentang
            </Link>
          </nav>
        </Container>
      </div>
    </header>
  );
}
