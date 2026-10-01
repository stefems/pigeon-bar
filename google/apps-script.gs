/**
 * Pigeon Bar — Google Sheet helper.
 * Pings the website so it reloads content after the sheet is edited.
 *
 * Install (one time):
 *   1. In the Google Sheet: Extensions → Apps Script. Replace the contents with this file.
 *   2. Set REFRESH_URL and REFRESH_TOKEN below.
 *   3. Click the clock icon (Triggers) → Add Trigger:
 *        function: onSheetEdit, event source: From spreadsheet, event type: On edit.
 *      Approve the permissions prompt.
 *   4. Reload the sheet. A "Pigeon Bar" menu appears with "Publish changes now".
 *
 * Edits are debounced: the site is pinged about a minute after the last change.
 */
const REFRESH_URL = "https://pigeonbar.com/api/refresh";
const REFRESH_TOKEN = "PASTE_TOKEN_HERE";
const DEBOUNCE_SECONDS = 60;

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Pigeon Bar")
    .addItem("Publish changes now", "publishNow")
    .addToUi();
}

function onSheetEdit() {
  // Reset any pending timer so a burst of edits sends a single ping.
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === "publishNow")
    .forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("publishNow").timeBased().after(DEBOUNCE_SECONDS * 1000).create();
}

function publishNow() {
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === "publishNow" && t.getEventType() === ScriptApp.EventType.CLOCK)
    .forEach((t) => ScriptApp.deleteTrigger(t));
  const res = UrlFetchApp.fetch(REFRESH_URL + "?token=" + encodeURIComponent(REFRESH_TOKEN), {
    method: "post",
    muteHttpExceptions: true,
  });
  const body = res.getContentText();
  console.log(res.getResponseCode() + " " + body);
  try {
    SpreadsheetApp.getActiveSpreadsheet().toast(
      res.getResponseCode() === 200 ? "Website refreshed." : "Refresh failed: " + body,
      "Pigeon Bar"
    );
  } catch (e) { /* no UI when run from a trigger */ }
}
