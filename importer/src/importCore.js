import { detectParser } from "./parsers/marketplaceDetector.js";
import { generateSeoTitle, generateSeoDescription, generateTags } from "./utils/normalize.js";
import { findProductByOriginalUrl, insertProduct, updateProductFromImport } from "./services/productService.js";
import { logImport, IMPORT_STATUS } from "./services/importLogService.js";

export async function parseProduct(url) {
  const parser = detectParser(url);
  const product = await parser.parse(url);

  return {
    ...product,
    seoTitle: generateSeoTitle(product.title),
    seoDescription: generateSeoDescription(product.title, product.description),
    tags: product.tags?.length ? product.tags : generateTags(product.title),
  };
}

export async function saveProduct(product, { categoryId } = {}) {
  const startedAt = Date.now();
  const payload = { ...product, categoryId };

  try {
    const existing = await findProductByOriginalUrl(product.originalUrl);

    if (existing) {
      await updateProductFromImport(existing.id, payload);
      await logImport({
        marketplace: product.marketplace,
        url: product.originalUrl,
        status: IMPORT_STATUS.UPDATED,
        message: "Product diperbarui.",
        createdProductId: existing.id,
        duration: Date.now() - startedAt,
      });
      return { status: IMPORT_STATUS.UPDATED, productId: existing.id };
    }

    const productId = await insertProduct(payload);
    await logImport({
      marketplace: product.marketplace,
      url: product.originalUrl,
      status: IMPORT_STATUS.SUCCESS,
      message: "Product berhasil diimport.",
      createdProductId: productId,
      duration: Date.now() - startedAt,
    });
    return { status: IMPORT_STATUS.SUCCESS, productId };
  } catch (error) {
    await logImport({
      marketplace: product.marketplace,
      url: product.originalUrl,
      status: IMPORT_STATUS.FAILED,
      message: error.message,
      duration: Date.now() - startedAt,
    });
    return { status: IMPORT_STATUS.FAILED, message: error.message };
  }
}
