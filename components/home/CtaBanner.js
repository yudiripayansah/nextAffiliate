import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CtaBanner() {
  return (
    <div className="relative flex flex-col items-center gap-4 overflow-hidden rounded-3xl bg-brand px-6 py-14 text-center text-brand-foreground">
      <span aria-hidden="true" className="absolute -left-10 -top-10 size-40 rounded-full bg-white/20" />
      <span aria-hidden="true" className="absolute -bottom-14 -right-8 size-48 rounded-full bg-primary/15" />

      <h2 className="relative font-display text-2xl font-bold sm:text-3xl">
        Masih bingung cari produk apa?
      </h2>
      <p className="relative max-w-md text-sm opacity-85 sm:text-base">
        Jelajahi ribuan produk pilihan dari Shopee, Tokopedia, dan TikTok Shop di satu tempat.
      </p>
      <Button
        size="lg"
        className="relative rounded-full bg-primary font-bold text-primary-foreground hover:bg-primary/90"
        render={<Link href="/#kategori" />}
        nativeButton={false}
      >
        Jelajahi Kategori
      </Button>
    </div>
  );
}
