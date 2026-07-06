import inquirer from "inquirer";
import { parseProduct } from "../importCore.js";
import { listProductsWithOriginalUrl, updateProductPrice } from "../services/productService.js";
import { logImport, IMPORT_STATUS } from "../services/importLogService.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runSyncPrice() {
  const products = await listProductsWithOriginalUrl(200);

  if (!products.length) {
    console.log("Tidak ada produk untuk disinkronkan.\n");
    return;
  }

  const { confirmRun } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmRun",
      message: `Sinkronkan harga untuk ${products.length} produk?`,
      default: true,
    },
  ]);

  if (!confirmRun) return;

  const summary = { updated: 0, skipped: 0, failed: 0 };

  for (const [index, product] of products.entries()) {
    process.stdout.write(`  [${index + 1}/${products.length}] ${product.title}... `);

    try {
      const fresh = await parseProduct(product.originalUrl);

      if (fresh.price && fresh.price !== product.price) {
        await updateProductPrice(product.id, fresh.price);
        await logImport({
          marketplace: product.marketplace,
          url: product.originalUrl,
          status: IMPORT_STATUS.UPDATED,
          message: `Price ${product.price} -> ${fresh.price}`,
          createdProductId: product.id,
          duration: 0,
        });
        console.log(`updated (${product.price} -> ${fresh.price})`);
        summary.updated += 1;
      } else {
        console.log("skipped (no change)");
        summary.skipped += 1;
      }
    } catch (error) {
      console.log(`failed (${error.message})`);
      summary.failed += 1;
    }

    await sleep(500);
  }

  console.log("\nRingkasan:");
  console.log(`  Updated: ${summary.updated}`);
  console.log(`  Skipped: ${summary.skipped}`);
  console.log(`  Failed : ${summary.failed}\n`);
}
