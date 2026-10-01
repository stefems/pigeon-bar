// Reads site content from a public Google Sheet, falling back to the JSON
// snapshots in src/content/ when the sheet is unreachable or malformed.
//
// Sheet layout (one tab each, header row required, column order doesn't matter):
//   Hours:    Day | Time
//   Menu:     Section | Group | Name | Price | Description | Notes | Pairing
//   Settings: Key | Value            (keys: name, email, mapsUrl)
//   Links:    Label | Link | New tab (yes/no)
//
// A Menu row with a Section but no Name sets that section's note
// (e.g. "Coming soon") from its Description column.

import sheetConfig from "../content/sheet.json" with { type: "json" };
import siteJson from "../content/site.json" with { type: "json" };
import hoursJson from "../content/hours.json" with { type: "json" };
import menuJson from "../content/menu.json" with { type: "json" };
import { parseCsv, rowsToObjects } from "./csv.js";

export const SHEET_TAG = "sheet";

const isNode = typeof process !== "undefined" && !process.env.NEXT_RUNTIME && !globalThis.__NEXT_DATA__;

function tabUrl(tab) {
  // gviz export is near real-time for sheets shared "anyone with the link",
  // unlike "publish to web" which lags several minutes.
  return `https://docs.google.com/spreadsheets/d/${sheetConfig.sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
}

async function fetchTab(tab) {
  const res = await fetch(tabUrl(tab), {
    next: { revalidate: sheetConfig.cacheSeconds, tags: [SHEET_TAG] },
    headers: { accept: "text/csv" },
  });
  if (!res.ok) throw new Error(`${tab}: HTTP ${res.status}`);
  const text = await res.text();
  if (text.trimStart().startsWith("<")) throw new Error(`${tab}: got HTML, is the sheet shared with "anyone with the link"?`);
  return parseCsv(text);
}

export function parseHours(rows) {
  return rowsToObjects(rows, ["day", "time"])
    .filter((r) => r.day)
    .map((r) => ({ day: r.day, time: r.time }));
}

export function parseMenu(rows) {
  const objs = rowsToObjects(rows, ["section", "name", "price"]);
  const sections = [];
  const byTitle = new Map();
  for (const r of objs) {
    if (!r.section) continue;
    let sec = byTitle.get(r.section);
    if (!sec) {
      sec = { title: r.section, note: "", items: [], groups: [] };
      byTitle.set(r.section, sec);
      sections.push(sec);
    }
    if (!r.name) { if (r.description) sec.note = r.description; continue; }
    const item = { name: r.name };
    if (r.price) item.price = r.price;
    if (r.description) item.desc = r.description;
    if (r.notes) item.notes = r.notes;
    if (r.pairing) item.pairing = r.pairing;
    if (r.group) {
      let g = sec.groups.find((x) => x.title === r.group);
      if (!g) { g = { title: r.group, items: [] }; sec.groups.push(g); }
      g.items.push(item);
    } else sec.items.push(item);
  }
  if (!sections.length) throw new Error("menu: no sections");
  return sections;
}

export function parseSite(settingsRows, linksRows) {
  const kv = Object.fromEntries(
    rowsToObjects(settingsRows, ["key", "value"]).filter((r) => r.key).map((r) => [r.key, r.value])
  );
  const navLinks = rowsToObjects(linksRows, ["label", "link"])
    .filter((r) => r.label && r.link)
    .map((r) => {
      const l = { label: r.label, href: r.link };
      if (/^(y|yes|true|1)$/i.test(r["new tab"] ?? "")) l.external = true;
      return l;
    });
  if (!navLinks.length) throw new Error("links: no rows");
  return {
    name: kv.name || siteJson.name,
    email: kv.email || siteJson.email,
    mapsUrl: kv.mapsurl || kv["maps url"] || siteJson.mapsUrl,
    navLinks,
  };
}

// Fetch everything from the sheet. Throws on any problem; callers decide the fallback.
export async function fetchSheetContent() {
  if (!sheetConfig.sheetId) throw new Error("no sheetId configured");
  const t = sheetConfig.tabs;
  const [hours, menu, settings, links] = await Promise.all([
    fetchTab(t.hours), fetchTab(t.menu), fetchTab(t.settings), fetchTab(t.links),
  ]);
  return { hours: parseHours(hours), menu: parseMenu(menu), site: parseSite(settings, links) };
}

const fallback = { hours: hoursJson.hours, menu: menuJson.sections, site: siteJson };

let warned = false;
export async function getContent() {
  if (!sheetConfig.sheetId) return fallback;
  try {
    return await fetchSheetContent();
  } catch (err) {
    if (!warned || isNode) console.warn(`[sheets] using JSON fallback: ${err.message}`);
    warned = true;
    return fallback;
  }
}
