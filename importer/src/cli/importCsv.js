import fs from "node:fs";
import path from "node:path";
import inquirer from "inquirer";
import Papa from "papaparse";
import { parseProduct, saveProduct } from "../importCore.js";
import { logImport, IMPORT_STATUS } from "../services/importLogService.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processRow(row) {
  const url = row.affiliateUrl?.trim();
  if (!url) {
    return { url: "", status: IMPORT_STATUS.SKIPPED, message: "Kolom affiliateUrl kosong." };
  }

  try {
    const product = await parseProduct(url);

    if (row.title) product.title = row.title;
    if (row.price) product.price = Number(row.price) || product.price;
    if (row.brand) product.brand = row.brand;

    const result = await saveProduct(product, { categoryId: null });
    return { url, status: result.status, message: result.message || "" };
  } catch (error) {
    await logImport({ url, status: IMPORT_STATUS.FAILED, message: error.message, duration: 0 });
    return { url, status: IMPORT_STATUS.FAILED, message: error.message };
  }
}

function writeReport(results) {
  const reportsDir = path.join(process.cwd(), "reports");
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);

  const filePath = path.join(reportsDir, `import-report-${Date.now()}.csv`);
  const csv = Papa.unparse(results);
  fs.writeFileSync(filePath, csv, "utf-8");
  return filePath;
}

export async function runImportCsv() {
  const { filePath } = await inquirer.prompt([
    { type: "input", name: "filePath", message: "Path ke file CSV:" },
  ]);

  if (!fs.existsSync(filePath)) {
    console.log("File tidak ditemukan.\n");
    return;
  }

  const csvContent = fs.readFileSync(filePath, "utf-8");
  const { data, meta } = Papa.parse(csvContent, { header: true, skipEmptyLines: true });

  if (!meta.fields?.includes("affiliateUrl")) {
    console.log('CSV harus memiliki kolom "affiliateUrl".\n');
    return;
  }

  console.log(`\nMemproses ${data.length} baris...\n`);

  const results = [];
  for (const [index, row] of data.entries()) {
    process.stdout.write(`  [${index + 1}/${data.length}] ${row.affiliateUrl ?? ""}... `);
    const result = await processRow(row);
    results.push(result);
    console.log(result.status);
    await sleep(500);
  }

  const summary = results.reduce((acc, result) => {
    acc[result.status] = (acc[result.status] ?? 0) + 1;
    return acc;
  }, {});

  console.log("\nRingkasan:");
  Object.entries(summary).forEach(([status, count]) => console.log(`  ${status}: ${count}`));

  const reportPath = writeReport(results);
  console.log(`\nReport disimpan di: ${reportPath}\n`);
}
