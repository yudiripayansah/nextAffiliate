import { BadgePercent, ShieldCheck, RefreshCw } from "lucide-react";
import Container from "@/components/layout/Container";

const USPS = [
  {
    icon: BadgePercent,
    title: "Harga dari 3 marketplace",
    text: "Bandingkan Shopee, Tokopedia & TikTok Shop sekali lihat.",
  },
  {
    icon: ShieldCheck,
    title: "Link resmi & aman",
    text: "Semua tombol beli mengarah ke toko resmi di marketplace.",
  },
  {
    icon: RefreshCw,
    title: "Update tiap hari",
    text: "Produk & harga dikurasi dan diperbarui rutin.",
  },
];

export default function UspStrip() {
  return (
    <section className="border-b bg-background">
      <Container className="grid gap-3 py-6 sm:grid-cols-3 sm:gap-4">
        {USPS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3 rounded-2xl bg-secondary/60 p-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="text-sm font-bold">{title}</p>
              <p className="text-xs text-muted-foreground">{text}</p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
