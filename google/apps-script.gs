/**
 * Pigeon Bar — Google Sheet helper.
 *
 * The site reads the hidden "Live …" tabs. Edit the normal tabs freely; nothing
 * changes on the website until you choose  Pigeon Bar → Publish to website,
 * which copies the editing tabs into the Live tabs and tells the site to reload.
 *
 * Install (one time):
 *   1. In the Google Sheet: Extensions → Apps Script. Replace the contents with this file.
 *   2. Set REFRESH_URL and REFRESH_TOKEN below. Save.
 *   3. Run `publishToWebsite` once from the editor and approve the permissions prompt.
 *      (This also creates the Live tabs and logs their gids for src/content/sheet.json.)
 *   4. Reload the sheet. A "Pigeon Bar" menu appears.
 */
const REFRESH_URL = "https://pigeonbar.com/api/refresh";
const REFRESH_TOKEN = "PASTE_TOKEN_HERE";

// Editing tab -> live tab the website reads.
const TABS = { Hours: "Live Hours", Menu: "Live Menu", Settings: "Live Settings", Links: "Live Links" };

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Pigeon Bar")
    .addItem("Publish to website", "publishToWebsite")
    .addItem("Show unpublished changes", "showDiff")
    .addToUi();
}

function publishToWebsite() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ids = [];
  for (const [draftName, liveName] of Object.entries(TABS)) {
    const draft = ss.getSheetByName(draftName);
    if (!draft) throw new Error(`Tab "${draftName}" not found`);
    let live = ss.getSheetByName(liveName);
    if (!live) { live = ss.insertSheet(liveName); live.hideSheet(); }
    live.clearContents();
    const values = draft.getDataRange().getValues();
    if (values.length) live.getRange(1, 1, values.length, values[0].length).setValues(values);
    ids.push(`${liveName}: gid=${live.getSheetId()}`);
  }
  SpreadsheetApp.flush();
  console.log("Live tabs: " + ids.join(", "));

  const res = UrlFetchApp.fetch(REFRESH_URL + "?token=" + encodeURIComponent(REFRESH_TOKEN), {
    method: "post",
    muteHttpExceptions: true,
  });
  const code = res.getResponseCode();
  console.log(code + " " + res.getContentText().slice(0, 200));
  toast(code === 200
    ? "Published. The website will show your changes within a minute."
    : `Copied to Live tabs, but the website refresh failed (HTTP ${code}). It will update within 24 hours.`);
}

// Lists cells that differ between the editing tabs and what is live.
function showDiff() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const lines = [];
  for (const [draftName, liveName] of Object.entries(TABS)) {
    const d = ss.getSheetByName(draftName)?.getDataRange().getValues() ?? [];
    const l = ss.getSheetByName(liveName)?.getDataRange().getValues() ?? [];
    const rows = Math.max(d.length, l.length);
    for (let r = 0; r < rows; r++) {
      const cols = Math.max(d[r]?.length ?? 0, l[r]?.length ?? 0);
      for (let c = 0; c < cols; c++) {
        const a = String(d[r]?.[c] ?? ""), b = String(l[r]?.[c] ?? "");
        if (a !== b) lines.push(`${draftName} row ${r + 1}: "${b}" → "${a}"`);
      }
    }
  }
  const ui = SpreadsheetApp.getUi();
  ui.alert(lines.length ? `Unpublished changes (${lines.length}):\n\n` + lines.slice(0, 40).join("\n") + (lines.length > 40 ? "\n…" : "")
                       : "No unpublished changes. The website matches this sheet.");
}

function toast(msg) {
  try { SpreadsheetApp.getActiveSpreadsheet().toast(msg, "Pigeon Bar", 8); } catch (e) {}
}
