import Container from "@/components/layout/Container";
import SearchBox from "@/components/search/SearchBox";
import HeroProductPeek from "@/components/home/HeroProductPeek";
import { MARKETPLACES } from "@/constants/marketplace";

export default function HeroSection({ settings, stats, featuredProducts }) {
  const title = settings.heroTitle || "Bandingkan Dulu, Baru Belanja";
  const subtitle =
    settings.heroSubtitle ||
    "Kami kurasi produk dari Shopee, Tokopedia, dan TikTok Shop jadi kamu nggak perlu buka tiga aplikasi buat cari harga terbaik.";

  return (
    <section className="relative overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,_var(--accent),_transparent_60%)] opacity-70"
      />

      <Container className="relative flex flex-col items-center gap-10 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-24">
        <div className="flex max-w-xl flex-col items-center gap-5 text-center lg:items-start lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-trust/30 bg-trust/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-trust">
            Kurasi harga terbaik &middot; 3 marketplace
          </span>

          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">{subtitle}</p>

          <SearchBox className="w-full max-w-md" />

          <dl className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start">
            <div className="flex items-baseline gap-1.5">
              <dt className="font-price text-xl font-bold text-foreground">{stats.productCount}+</dt>
              <dd className="text-xs text-muted-foreground">produk dikurasi</dd>
            </div>
            <div className="flex items-baseline gap-1.5">
              <dt className="font-price text-xl font-bold text-foreground">{MARKETPLACES.length}</dt>
              <dd className="text-xs text-muted-foreground">marketplace</dd>
            </div>
          </dl>
        </div>

        <HeroProductPeek products={featuredProducts} />
      </Container>
    </section>
  );
}
