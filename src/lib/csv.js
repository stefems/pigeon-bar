// Minimal RFC 4180 CSV parser: handles quoted fields, escaped quotes, CRLF.
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

// Turns rows into objects keyed by lower-cased header names.
// Throws if any required header is missing, so bad sheets fall back loudly.
export function rowsToObjects(rows, required = []) {
  if (!rows.length) throw new Error("sheet tab is empty");
  const headers = rows[0].map((h) => h.trim().toLowerCase());
  for (const r of required) {
    if (!headers.includes(r)) throw new Error(`missing column "${r}" (have: ${headers.join(", ")})`);
  }
  return rows.slice(1).map((r) =>
    Object.fromEntries(headers.map((h, i) => [h, (r[i] ?? "").trim()]))
  );
}
