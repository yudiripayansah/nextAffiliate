import inquirer from "inquirer";
import { runImportUrl } from "./importUrl.js";
import { runImportCsv } from "./importCsv.js";
import { runSyncPrice } from "./syncPrice.js";
import { runCheckDuplicate } from "./checkDuplicate.js";

const MENU_CHOICES = [
  { name: "Import URL", value: "importUrl" },
  { name: "Import CSV", value: "importCsv" },
  { name: "Sync Price", value: "syncPrice" },
  { name: "Check Duplicate", value: "checkDuplicate" },
  { name: "Sync Product (coming soon)", value: "syncProduct" },
  { name: "Repair Image (coming soon)", value: "repairImage" },
  { name: "Exit", value: "exit" },
];

export async function runMenu() {
  let running = true;

  while (running) {
    const { action } = await inquirer.prompt([
      { type: "list", name: "action", message: "Affiliate CMS Importer", choices: MENU_CHOICES },
    ]);

    console.log("");

    switch (action) {
      case "importUrl":
        await runImportUrl();
        break;
      case "importCsv":
        await runImportCsv();
        break;
      case "syncPrice":
        await runSyncPrice();
        break;
      case "checkDuplicate":
        await runCheckDuplicate();
        break;
      case "syncProduct":
      case "repairImage":
        console.log("Fitur ini belum tersedia.\n");
        break;
      case "exit":
        running = false;
        break;
      default:
        break;
    }
  }

  console.log("Sampai jumpa!");
}
