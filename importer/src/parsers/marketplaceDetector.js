import * as shopeeParser from "./shopeeParser.js";
import * as tokopediaParser from "./tokopediaParser.js";
import * as tiktokParser from "./tiktokParser.js";
import { ParserError, PARSER_ERROR_CODES } from "./parserInterface.js";

const DETECTORS = [
  { pattern: /shopee/i, parser: shopeeParser },
  { pattern: /tokopedia/i, parser: tokopediaParser },
  { pattern: /tiktok/i, parser: tiktokParser },
];

export function detectParser(url) {
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new ParserError(PARSER_ERROR_CODES.INVALID_URL, "URL tidak valid.");
  }

  const match = DETECTORS.find(({ pattern }) => pattern.test(parsedUrl.hostname));
  if (!match) {
    throw new ParserError(PARSER_ERROR_CODES.UNSUPPORTED_MARKETPLACE, "Marketplace tidak didukung.");
  }

  return match.parser;
}
