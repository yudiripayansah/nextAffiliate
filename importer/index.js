import { runMenu } from "./src/cli/menu.js";

runMenu().catch((error) => {
  console.error("Terjadi kesalahan fatal:", error);
  process.exit(1);
});
