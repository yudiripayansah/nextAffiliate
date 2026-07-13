import { getSettings } from "@/services/settings/settings.service";
import Container from "@/components/layout/Container";

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: "About",
    description: `Tentang ${settings.siteName || "kami"}.`,
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const settings = await getSettings();
  const siteName = settings.siteName || "Ayyasilla Shop";

  return (
    <Container className="flex flex-col gap-4 py-10">
      <h1 className="text-2xl font-semibold">Tentang {siteName}</h1>
      <p className="text-muted-foreground">
        {siteName} adalah katalog produk affiliate yang menampilkan pilihan produk dari marketplace
        Shopee, Tokopedia, dan TikTok Shop. Kami bukan toko online — setiap produk yang Anda lihat di
        sini akan mengarahkan Anda langsung ke marketplace resmi untuk melakukan pembelian.
      </p>
      <p className="text-muted-foreground">
        Kami tidak menangani pembayaran, pengiriman, maupun retur. Seluruh transaksi sepenuhnya
        ditangani oleh marketplace terkait.
      </p>
      {settings.contactEmail ? (
        <p className="text-muted-foreground">
          Hubungi kami melalui email: <a href={`mailto:${settings.contactEmail}`} className="underline">{settings.contactEmail}</a>
        </p>
      ) : null}
    </Container>
  );
}
