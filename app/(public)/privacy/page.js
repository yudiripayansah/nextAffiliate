import { getSettings } from "@/services/settings/settings.service";
import Container from "@/components/layout/Container";

export const metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const settings = await getSettings();
  const siteName = settings.siteName || "Affiliate CMS";

  return (
    <Container className="flex flex-col gap-4 py-10">
      <h1 className="text-2xl font-semibold">Privacy Policy</h1>
      <p className="text-muted-foreground">
        {siteName} menghargai privasi pengunjung. Kami hanya mengumpulkan data teknis dasar
        (seperti device, browser, dan referrer) untuk keperluan analitik dan peningkatan layanan.
      </p>
      <p className="text-muted-foreground">
        Kami tidak menyimpan data pembayaran atau informasi pribadi sensitif karena seluruh
        transaksi dilakukan langsung di marketplace pihak ketiga (Shopee, Tokopedia, TikTok Shop),
        bukan di website ini.
      </p>
      <p className="text-muted-foreground">
        Kami dapat menggunakan layanan analitik pihak ketiga seperti Google Analytics untuk
        memahami perilaku pengunjung secara agregat dan anonim.
      </p>
    </Container>
  );
}
