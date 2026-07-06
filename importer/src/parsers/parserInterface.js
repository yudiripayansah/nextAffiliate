export class ParserError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

export const PARSER_ERROR_CODES = {
  INVALID_URL: "INVALID_URL",
  UNSUPPORTED_MARKETPLACE: "UNSUPPORTED_MARKETPLACE",
  PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND",
  PARSER_FAILED: "PARSER_FAILED",
};

/**
 * Every marketplace parser must implement `parse(url)` and resolve to this shape:
 * {
 *   title, shortDescription, description, price, originalPrice, images,
 *   brand, category, rating, sold, affiliateUrl, originalUrl, marketplace, tags
 * }
 */
export function assertValidProduct(product) {
  if (!product.title || !product.title.trim()) {
    throw new ParserError(PARSER_ERROR_CODES.PARSER_FAILED, "Title tidak ditemukan.");
  }
  if (!product.affiliateUrl) {
    throw new ParserError(PARSER_ERROR_CODES.PARSER_FAILED, "Affiliate URL kosong.");
  }
}
