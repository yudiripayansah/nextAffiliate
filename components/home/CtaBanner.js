import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CtaBanner() {
  return (
    <div className="relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl border-2 border-dashed border-primary-foreground/30 bg-primary px-6 py-14 text-center text-primary-foreground">
      <h2 className="font-display text-2xl font-bold sm:text-3xl">Masih bingung cari produk apa?</h2>
      <p className="max-w-md text-primary-foreground/85">
        Jelajahi ribuan produk pilihan dari Shopee, Tokopedia, dan TikTok Shop di satu tempat.
      </p>
      <Button
        size="lg"
        className="bg-trust font-semibold text-trust-foreground hover:bg-trust/90"
        render={<Link href="/search" />}
        nativeButton={false}
      >
        Jelajahi Produk
      </Button>
    </div>
  );
}
