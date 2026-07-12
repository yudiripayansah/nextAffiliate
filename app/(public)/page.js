import { getSettings } from "@/services/settings/settings.service";
import { getCategoriesWithProductCount } from "@/services/category/category.service";
import { getCollections } from "@/services/collection/collection.service";
import { getProducts, getProductStats } from "@/services/product/product.service";
import HeroBanner from "@/components/home/HeroBanner";
import UspStrip from "@/components/home/UspStrip";
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

      <HeroBanner settings={settings} stats={{ productCount: stats.published }} collections={featuredCollections.length ? featuredCollections : collections} />
      <UspStrip />

      {categories.length ? (
        <Section id="kategori" title="Kategori Pilihan" subtitle="Jelajahi produk berdasarkan kategori favoritmu">
          <FeaturedCategories categories={categories} />
        </Section>
      ) : null}

      <Section id="trending" title="Lagi Trending 🔥" subtitle="Produk paling banyak diklik minggu ini">
        <ProductGrid products={trending.products} />
      </Section>

      {collections.length ? (
        <Section id="koleksi" title="Koleksi Spesial" subtitle="Kumpulan produk tematik yang lagi ramai dicari" className="bg-secondary/40">
          <FeaturedCollections collections={featuredCollections.length ? featuredCollections : collections} />
        </Section>
      ) : null}

      <Section id="terbaru" title="Baru Ditambahkan" subtitle="Produk terbaru yang baru masuk katalog">
        <ProductGrid products={newest.products} />
      </Section>

      <Section id="laris" title="Paling Laris" subtitle="Favorit banyak pembeli di marketplace" className="bg-secondary/40">
        <ProductGrid products={popular.products} />
      </Section>

      <Section className="pb-16">
        <CtaBanner />
      </Section>
    </>
  );
}
