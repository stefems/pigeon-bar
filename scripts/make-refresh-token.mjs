// Generates a refresh token and the hash to commit in src/content/sheet.json.
import { randomBytes, createHash } from "node:crypto";
const token = randomBytes(24).toString("base64url");
const hash = createHash("sha256").update(token).digest("hex");
console.log(`token (keep private, paste into the Apps Script): ${token}`);
console.log(`hash  (commit in src/content/sheet.json):        ${hash}`);
