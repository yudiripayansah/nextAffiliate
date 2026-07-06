import inquirer from "inquirer";
import { findProductByOriginalUrl } from "../services/productService.js";

export async function runCheckDuplicate() {
  const { url } = await inquirer.prompt([
    { type: "input", name: "url", message: "Original URL yang ingin dicek:" },
  ]);

  const existing = await findProductByOriginalUrl(url.trim());

  if (existing) {
    console.log(`\nSudah ada: "${existing.title}" (ID: ${existing.id})\n`);
  } else {
    console.log("\nBelum ada produk dengan URL ini.\n");
  }
}
