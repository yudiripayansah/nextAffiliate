import { getSettings } from "@/services/settings/settings.service";
import Container from "@/components/layout/Container";

export const metadata = {
  title: "Affiliate Disclaimer",
  alternates: { canonical: "/disclaimer" },
};

export default async function DisclaimerPage() {
  const settings = await getSettings();
  const siteName = settings.siteName || "Affiliate CMS";

  return (
    <Container className="flex flex-col gap-4 py-10">
      <h1 className="text-2xl font-semibold">Affiliate Disclaimer</h1>
      <p className="text-muted-foreground">
        {siteName} adalah peserta program affiliate Shopee, Tokopedia, dan TikTok Shop. Kami dapat
        memperoleh komisi dari pembelian yang dilakukan melalui tautan produk di website ini, tanpa
        biaya tambahan apa pun bagi Anda.
      </p>
      <p className="text-muted-foreground">
        Harga, stok, dan ketersediaan produk sepenuhnya ditentukan oleh masing-masing marketplace
        dan dapat berubah sewaktu-waktu di luar kendali kami.
      </p>
      <p className="text-muted-foreground">
        Kami berusaha menampilkan informasi produk seakurat mungkin, namun tidak bertanggung jawab
        atas perbedaan harga atau deskripsi yang mungkin terjadi di marketplace tujuan.
      </p>
    </Container>
  );
}
