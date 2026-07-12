import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";
import PromoCards from "@/components/home/PromoCards";

export default function HeroBanner({ settings, stats, collections }) {
  const title = settings.heroTitle || "Belanja Hemat, Pilih yang Terbaik";
  const subtitle =
    settings.heroSubtitle ||
    "Kami kurasi produk dari Shopee, Tokopedia, dan TikTok Shop jadi kamu nggak perlu buka tiga aplikasi buat cari harga terbaik.";

  return (
    <section className="bg-brand/30 dark:bg-transparent">
      <Container className="grid gap-4 py-6 lg:grid-cols-3 lg:py-10">
        <div className="relative flex flex-col items-start justify-center gap-4 overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground lg:col-span-2 lg:p-12 dark:bg-card dark:text-card-foreground">
          <span
            aria-hidden="true"
            className="absolute -right-12 -top-12 size-48 rounded-full bg-brand/25"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-16 right-24 size-32 rounded-full bg-brand/15"
          />

          <span className="rounded-full bg-brand px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-brand-foreground">
            ✦ Kurasi 3 marketplace
          </span>

          <h1 className="max-w-xl font-display text-3xl font-bold leading-tight sm:text-5xl">
            {title}
          </h1>
          <p className="max-w-lg text-sm opacity-90 sm:text-base">{subtitle}</p>

          <Link
            href="/#trending"
            className="flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-extrabold text-brand-foreground transition-opacity hover:opacity-90"
          >
            Lihat yang Lagi Trending
            <ArrowRight className="size-4" />
          </Link>

          <p className="text-xs opacity-75">
            {stats.productCount}+ produk dikurasi dari Shopee, Tokopedia &amp; TikTok Shop
          </p>
        </div>

        <PromoCards collections={collections} />
      </Container>
    </section>
  );
}
