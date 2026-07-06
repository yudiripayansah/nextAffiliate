import { fetchHtml } from "../utils/fetchHtml.js";
import { loadHtml, extractOpenGraph, extractJsonLd } from "../utils/htmlExtractors.js";
import { parsePrice } from "../utils/normalize.js";
import { ParserError, PARSER_ERROR_CODES, assertValidProduct } from "./parserInterface.js";

export async function parse(url) {
  let html;
  try {
    html = await fetchHtml(url);
  } catch (error) {
    throw new ParserError(PARSER_ERROR_CODES.PARSER_FAILED, error.message);
  }

  const $ = loadHtml(html);
  const og = extractOpenGraph($);
  const jsonLd = extractJsonLd($);

  if (!og.title && !jsonLd?.name) {
    throw new ParserError(PARSER_ERROR_CODES.PRODUCT_NOT_FOUND, "Produk tidak ditemukan di halaman Tokopedia.");
  }

  const price = parsePrice(jsonLd?.offers?.price ?? jsonLd?.offers?.[0]?.price);

  const product = {
    title: jsonLd?.name || og.title,
    shortDescription: og.description?.slice(0, 160) || "",
    description: jsonLd?.description || og.description || "",
    price,
    originalPrice: null,
    images: [jsonLd?.image, og.image].flat().filter(Boolean),
    brand: jsonLd?.brand?.name || "",
    category: "",
    rating: jsonLd?.aggregateRating?.ratingValue ? Number(jsonLd.aggregateRating.ratingValue) : 0,
    sold: 0,
    affiliateUrl: url,
    originalUrl: url,
    marketplace: "tokopedia",
    tags: [],
  };

  assertValidProduct(product);
  return product;
}
