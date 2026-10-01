// Forwards contact-form submissions to the Google Apps Script mailer
// (contactEndpoint in src/content/sheet.json). Keeps the browser away from
// cross-origin quirks and lets us validate server-side.
import sheetConfig from "../../../content/sheet.json" with { type: "json" };

export const dynamic = "force-dynamic";

export async function POST(req) {
  if (!sheetConfig.contactEndpoint) {
    return Response.json({ ok: false, error: "Contact form is not set up yet." }, { status: 503 });
  }
  let body;
  try { body = await req.json(); } catch { return Response.json({ ok: false, error: "Bad request." }, { status: 400 }); }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();
  const website = String(body.website || ""); // honeypot
  if (website) return Response.json({ ok: true });
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "Please fill in your name, a valid email and a message." }, { status: 400 });
  }
  if (message.length > 5000) {
    return Response.json({ ok: false, error: "Message is too long." }, { status: 400 });
  }

  try {
    const res = await fetch(sheetConfig.contactEndpoint, {
      method: "POST",
      headers: { "content-type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ name, email, message }),
      redirect: "follow",
    });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { ok: false, error: "Unexpected reply from mailer." }; }
    if (!data.ok) return Response.json({ ok: false, error: data.error || "Could not send." }, { status: 502 });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[contact] forward failed:", err.message);
    return Response.json({ ok: false, error: "Could not send right now. Please email us instead." }, { status: 502 });
  }
}
