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

/* ---------------------------------------------------------------------------
 * Contact form. The website POSTs to this script's web-app URL (deploy once:
 * Deploy → New deployment → Web app, execute as Me, access Anyone; paste the URL
 * into contactEndpoint in src/content/sheet.json). Messages are emailed to the
 * address in Settings → email and logged in a "Messages" tab.
 * ------------------------------------------------------------------------- */
const MAX_PER_HOUR = 5; // per sender email

function doPost(e) {
  const out = (obj) => ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
  let data = {};
  try { data = JSON.parse(e.postData.contents || "{}"); } catch (err) { return out({ ok: false, error: "bad json" }); }

  const name = String(data.name || "").trim().slice(0, 200);
  const email = String(data.email || "").trim().slice(0, 200);
  const message = String(data.message || "").trim().slice(0, 5000);
  if (data.website) return out({ ok: true }); // honeypot filled → pretend success
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return out({ ok: false, error: "missing fields" });

  const cache = CacheService.getScriptCache();
  const key = "contact:" + email.toLowerCase();
  const count = Number(cache.get(key) || 0);
  if (count >= MAX_PER_HOUR) return out({ ok: false, error: "too many messages, try later" });
  cache.put(key, String(count + 1), 3600);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const to = settingsValue_(ss, "email");
  const when = new Date();

  let log = ss.getSheetByName("Messages");
  if (!log) { log = ss.insertSheet("Messages"); log.appendRow(["Received", "Name", "Email", "Message"]); log.setFrozenRows(1); }
  log.appendRow([when, name, email, message]);

  if (to) {
    MailApp.sendEmail({
      to,
      name: "Pigeon Bar Website",
      replyTo: email,
      subject: `Pigeon Bar website: message from ${name}`,
      body: `${message}\n\n—\nFrom: ${name} <${email}>\nSent via pigeonbar.com contact form, ${when.toLocaleString()}`,
    });
  }
  return out({ ok: true });
}

function doGet() {
  return ContentService.createTextOutput("Pigeon Bar contact endpoint. POST JSON {name,email,message}.");
}

function settingsValue_(ss, key) {
  const sheet = ss.getSheetByName("Live Settings") || ss.getSheetByName("Settings");
  if (!sheet) return "";
  for (const [k, v] of sheet.getDataRange().getValues()) {
    if (String(k).trim().toLowerCase() === key.toLowerCase()) return String(v).trim();
  }
  return "";
}

// Run once from the editor to grant the "send email" permission (emails you, not the bar).
function sendTestEmail() {
  const me = Session.getEffectiveUser().getEmail();
  MailApp.sendEmail({ to: me, name: "Pigeon Bar Website", subject: "Pigeon Bar contact form: test", body: "Mail permission works. Remaining daily quota: " + MailApp.getRemainingDailyQuota() });
  console.log("Sent test email to " + me);
}
