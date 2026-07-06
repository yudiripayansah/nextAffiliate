import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CtaBanner() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-br from-primary to-violet-700 px-6 py-14 text-center text-primary-foreground">
      <h2 className="text-2xl font-bold sm:text-3xl">Masih bingung cari produk apa?</h2>
      <p className="max-w-md text-white/85">
        Jelajahi ribuan produk pilihan dari Shopee, Tokopedia, dan TikTok Shop di satu tempat.
      </p>
      <Button asChild size="lg" variant="secondary" className="font-semibold">
        <Link href="/search">Jelajahi Produk</Link>
      </Button>
    </div>
  );
}
