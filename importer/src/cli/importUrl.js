import inquirer from "inquirer";
import { parseProduct, saveProduct } from "../importCore.js";
import { listCategories } from "../services/productService.js";
import { logImport, IMPORT_STATUS } from "../services/importLogService.js";

export async function runImportUrl() {
  const { url } = await inquirer.prompt([
    { type: "input", name: "url", message: "Paste product URL (Shopee/Tokopedia/TikTok Shop):" },
  ]);

  console.log("\nMemproses...\n");

  let product;
  try {
    product = await parseProduct(url);
  } catch (error) {
    console.log(`Import gagal: ${error.message}\n`);
    await logImport({ url, status: IMPORT_STATUS.FAILED, message: error.message, duration: 0 });
    return;
  }

  console.log("Preview:");
  console.log(`  Title       : ${product.title}`);
  console.log(`  Marketplace : ${product.marketplace}`);
  console.log(`  Price       : ${product.price ?? "-"}`);
  console.log(`  Images      : ${product.images.length}`);
  console.log("");

  const { wantsEdit } = await inquirer.prompt([
    { type: "confirm", name: "wantsEdit", message: "Edit sebelum simpan?", default: false },
  ]);

  if (wantsEdit) {
    const edited = await inquirer.prompt([
      { type: "input", name: "title", message: "Title:", default: product.title },
      { type: "input", name: "price", message: "Price:", default: String(product.price ?? "") },
      { type: "input", name: "affiliateUrl", message: "Affiliate URL:", default: product.affiliateUrl },
    ]);
    product.title = edited.title;
    product.price = Number(edited.price) || product.price;
    product.affiliateUrl = edited.affiliateUrl;
  }

  const categories = await listCategories();
  let categoryId = null;

  if (categories.length) {
    const { selectedCategoryId } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedCategoryId",
        message: "Pilih category:",
        choices: [{ name: "(Tanpa category)", value: null }, ...categories.map((c) => ({ name: c.name, value: c.id }))],
      },
    ]);
    categoryId = selectedCategoryId;
  }

  const { confirmSave } = await inquirer.prompt([
    { type: "confirm", name: "confirmSave", message: "Simpan produk ini? (status: draft)", default: true },
  ]);

  if (!confirmSave) {
    console.log("Dibatalkan.\n");
    return;
  }

  const result = await saveProduct(product, { categoryId });

  if (result.status === IMPORT_STATUS.FAILED) {
    console.log(`Gagal menyimpan: ${result.message}\n`);
  } else {
    console.log(`Berhasil (${result.status}). Product ID: ${result.productId}\n`);
  }
}
