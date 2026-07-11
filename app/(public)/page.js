import { getSettings } from "@/services/settings/settings.service";
import { getCategoriesWithProductCount } from "@/services/category/category.service";
import { getCollections } from "@/services/collection/collection.service";
import { getProducts, getProductStats } from "@/services/product/product.service";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import CtaBanner from "@/components/home/CtaBanner";
import ProductGrid from "@/components/product/ProductGrid";
import Section from "@/components/layout/Section";
import JsonLd from "@/components/common/JsonLd";
import { buildOrganizationSchema, buildWebsiteSchema } from "@/utils/jsonLd";

export async function generateMetadata() {
  const settings = await getSettings();
  const title = settings.seoTitle || settings.siteName || "Affiliate CMS";
  const description =
    settings.seoDescription ||
    settings.siteDescription ||
    "Katalog produk affiliate dari Shopee, Tokopedia, dan TikTok Shop.";

  return {
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      images: settings.ogImage ? [settings.ogImage] : [],
    },
  };
}

export default async function HomePage() {
  const [settings, stats, categories, collections, trending, newest, popular] = await Promise.all([
    getSettings(),
    getProductStats(),
    getCategoriesWithProductCount(8),
    getCollections(true),
    getProducts({ status: "published", sort: "click", limitCount: 8 }),
    getProducts({ status: "published", sort: "created", limitCount: 8 }),
    getProducts({ status: "published", sort: "sold", limitCount: 8 }),
  ]);

  const featuredCollections = collections.filter((collection) => collection.featured);

  return (
    <>
      <JsonLd data={buildOrganizationSchema(settings)} />
      <JsonLd data={buildWebsiteSchema(settings)} />

      <HeroSection
        settings={settings}
        stats={{ productCount: stats.published }}
        featuredProducts={newest.products}
      />

      {categories.length ? (
        <Section title="Kategori Pilihan" subtitle="Jelajahi produk berdasarkan kategori favoritmu">
          <FeaturedCategories categories={categories} />
        </Section>
      ) : null}

      {featuredCollections.length || collections.length ? (
        <Section
          title="Koleksi Spesial"
          subtitle="Kumpulan produk tematik yang lagi ramai dicari"
          className="bg-muted/40"
        >
          <FeaturedCollections collections={featuredCollections.length ? featuredCollections : collections} />
        </Section>
      ) : null}

      <Section title="Lagi Trending" subtitle="Produk paling banyak diklik minggu ini">
        <ProductGrid products={trending.products} />
      </Section>

      <Section title="Baru Ditambahkan" subtitle="Produk terbaru yang baru masuk katalog" className="bg-muted/40">
        <ProductGrid products={newest.products} />
      </Section>

      <Section title="Paling Laris" subtitle="Favorit banyak pembeli di marketplace">
        <ProductGrid products={popular.products} />
      </Section>

      <Section className="pb-16">
        <CtaBanner />
      </Section>
    </>
  );
}
