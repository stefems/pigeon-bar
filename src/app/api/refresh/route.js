// Flushes the cached Google Sheet so the next visitor gets fresh content.
// GET or POST /api/refresh?token=...   (token checked against a committed hash,
// so no secret has to live on the host)
import { createHash } from "node:crypto";
import { revalidateTag } from "next/cache";
import sheetConfig from "../../../content/sheet.json" with { type: "json" };
import { SHEET_TAG } from "../../../lib/sheets";

export const dynamic = "force-dynamic";

function ok(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || req.headers.get("x-refresh-token") || "";
  if (!token || !sheetConfig.refreshTokenHash) return false;
  return createHash("sha256").update(token).digest("hex") === sheetConfig.refreshTokenHash;
}

async function handle(req) {
  if (!ok(req)) return Response.json({ ok: false, error: "bad token" }, { status: 401 });
  revalidateTag(SHEET_TAG, "max");
  return Response.json({ ok: true, refreshed: new Date().toISOString() });
}

export const GET = handle;
export const POST = handle;
