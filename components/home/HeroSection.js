import Image from "next/image";
import Container from "@/components/layout/Container";
import SearchBox from "@/components/search/SearchBox";
import { MARKETPLACES } from "@/constants/marketplace";

export default function HeroSection({ settings }) {
  const title = settings.heroTitle || "Temukan Produk Terbaik, Harga Terbaik";
  const subtitle =
    settings.heroSubtitle ||
    "Kami rangkum produk pilihan dari Shopee, Tokopedia, dan TikTok Shop supaya kamu belanja lebih cepat dan lebih hemat.";

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-primary via-primary to-violet-700 text-primary-foreground">
      {settings.heroBanner ? (
        <Image
          src={settings.heroBanner}
          alt={title}
          fill
          preload
          sizes="100vw"
          className="object-cover opacity-25"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_55%)]"
        />
      )}

      <Container className="relative flex flex-col items-center gap-6 py-20 text-center sm:py-28">
        <span className="rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm">
          Katalog Affiliate Terpercaya
        </span>

        <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
        <p className="max-w-xl text-base text-white/85 sm:text-lg">{subtitle}</p>

        <SearchBox className="w-full max-w-md" />

        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/80">
          <span>Tersedia di:</span>
          {MARKETPLACES.map(({ value, label }) => (
            <span key={value} className="font-semibold text-white">
              {label}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
