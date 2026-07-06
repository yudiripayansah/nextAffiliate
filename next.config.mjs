/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingExcludes: {
    "*": ["importer/**"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // Marketplace CDN domains — importer keeps original image URLs as-is
      // (per PRODUCT_IMPORT_WORKFLOW.md) instead of mirroring to Cloudinary.
      { protocol: "https", hostname: "**.tokopedia-static.net" },
      { protocol: "https", hostname: "**.tokopedia.net" },
      { protocol: "https", hostname: "**.susercontent.com" },
      { protocol: "https", hostname: "**.shopeemobile.com" },
      { protocol: "https", hostname: "**.tiktokcdn.com" },
      { protocol: "https", hostname: "**.ibyteimg.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
