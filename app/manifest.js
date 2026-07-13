import { getSettings } from "@/services/settings/settings.service";

export default async function manifest() {
  const settings = await getSettings();
  const siteName = settings.siteName || "Ayyasilla Shop";

  return {
    name: siteName,
    short_name: siteName,
    description:
      settings.siteDescription || "Katalog produk affiliate dari Shopee, Tokopedia, dan TikTok Shop.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f8ff",
    theme_color: "#1e3a6e",
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: "/icon-512", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  };
}
