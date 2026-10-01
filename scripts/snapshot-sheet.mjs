// Pulls the Google Sheet and rewrites the JSON fallbacks in src/content/.
// Run nightly by .github/workflows/snapshot-sheet.yml, or by hand: node scripts/snapshot-sheet.mjs
import { writeFileSync, readFileSync } from "node:fs";
import { fetchSheetContent } from "../src/lib/sheets.js";

const cfg = JSON.parse(readFileSync(new URL("../src/content/sheet.json", import.meta.url)));
if (!cfg.sheetId) { console.log("No sheetId configured; nothing to snapshot."); process.exit(0); }

const { hours, menu, site } = await fetchSheetContent();
const write = (name, data) =>
  writeFileSync(new URL(`../src/content/${name}`, import.meta.url), JSON.stringify(data, null, 2) + "\n");
write("hours.json", { hours });
write("menu.json", { sections: menu });
write("site.json", site);
console.log(`Snapshot written: ${hours.length} days, ${menu.length} menu sections, ${site.navLinks.length} links.`);
