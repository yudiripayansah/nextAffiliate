import * as cheerio from "cheerio";

export function loadHtml(html) {
  return cheerio.load(html);
}

export function extractOpenGraph($) {
  function meta(property) {
    return $(`meta[property="${property}"]`).attr("content") || $(`meta[name="${property}"]`).attr("content") || "";
  }

  return {
    title: meta("og:title"),
    description: meta("og:description"),
    image: meta("og:image"),
  };
}

export function extractJsonLd($) {
  const blocks = [];

  $('script[type="application/ld+json"]').each((_, element) => {
    try {
      const parsed = JSON.parse($(element).contents().text());
      blocks.push(...(Array.isArray(parsed) ? parsed : [parsed]));
    } catch {
      // Ignore malformed JSON-LD blocks.
    }
  });

  return blocks.find((block) => block["@type"] === "Product") || null;
}
