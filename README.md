# Pigeon Bar

Website for Pigeon Bar, Denver. Built with [Next.js](https://nextjs.org) and deployed on Netlify. Pushes to `main` deploy to pigeonbar.com; pull requests get a Netlify deploy preview.

## Updating content (Google Sheet)

Hours, menu, links and contact details come from a Google Sheet. Nothing
reaches the website until someone publishes.

- Sheet: https://docs.google.com/spreadsheets/d/1RezABS51ZQvAP5kZ2sY6-uU_5kPBuqCmNsJs3Bh7358/edit
- Its Apps Script project ("Pigeon Bar Website"):
  https://script.google.com/home/projects/1-Mg6zt4hR8njU_RFyeX5vFQbqFfO7MUtgaT5eoDtAEth-K7dgKs_3xhp

### Editing and publishing

1. Edit the `Hours`, `Menu`, `Settings` or `Links` tabs.
2. In the sheet menu choose **Pigeon Bar → Publish to website**.
   (**Show unpublished changes** lists what differs from the live site.)
3. The live site updates within about a minute.

Publishing copies the editing tabs into hidden `Live …` tabs, which are what
production reads, then pings `/api/refresh`. The site also caches for 24 hours
and re-fetches on its own after that.

Tab layout (header row required, column order doesn't matter):

| Tab | Columns |
| --- | --- |
| Hours | Day, Time |
| Menu | Section, Group, Name, Price, Description, Notes, Pairing, Image |
| Settings | Key, Value — `name`, `email`, `mapsUrl`, `address`, `phone`, `instagram`, `mapQuery` |
| Links | Label, Link, New tab (yes/no) |

Menu tips: rows are grouped by Section in the order they first appear. Fill
Group for sub-headings like "Cans / Bottles". A row with a Section but no Name
sets that section's note (e.g. "Coming soon") from the Description column, or
its artwork from the Image column (a file in `public/`, e.g. `/menu-chess.png`).
Name the Section `(art)` for an image-only block; a title in parentheses is
not shown. Prices can be typed as `16` or `$16`.

Settings: `address` shows on the Location and Contact pages (line breaks are
kept). `phone` and `instagram` appear on Contact when filled in. `mapQuery` is
what the embedded map searches for (defaults to the address).

Footer links: if a link's Label matches one of the client's hand-drawn link
images in `public/nav/` (location, hours, menu, contact, home) that artwork is
shown; any other label renders as text. `/location` and `/contact` are on-site
pages; external URLs and `mailto:` links also work.

### Contact form

Messages from `/contact` go to the Apps Script web app (`contactEndpoint` in
`src/content/sheet.json`), which emails them to the address in Settings →
`email` and logs them in a hidden-by-default `Messages` tab of the sheet. The
site's `/api/contact` route validates and forwards; a honeypot field and a
per-sender limit of 5 messages an hour keep spam down. To redeploy the script
after editing it: Deploy → Manage deployments → edit → New version.

### Previewing before publishing

Local dev (`npm run dev`) and Netlify deploy previews read the *editing* tabs
and re-check the sheet every minute, so unpublished edits can be checked
there. Production reads the `Live` tabs with a 24-hour cache that the Publish
button clears. Override with `SHEET_SOURCE=live` or `SHEET_SOURCE=draft`.

### Branches

- `main` → pigeonbar.com (production).
- `staging` → https://deploy-preview-2--pigeon-bar.netlify.app, built by
  Netlify from the open pull request stefems/pigeon-bar#2 ("Staging"). Merge work into `staging` to see it there, then
  merge `staging` into `main` to go live. Keep that PR open; never merge it
  from the GitHub button — merge `staging` into `main` with a separate PR.

### Fallback

Every night a GitHub Action snapshots the Live tabs into `src/content/*.json`
and commits it. If Google is ever unreachable, pages serve that snapshot.

### One-time setup (already done; kept for reference)

1. Create a Google Sheet with tabs `Hours`, `Menu`, `Settings`, `Links` and
   import the matching CSV from `google/templates/`.
2. Share → Anyone with the link → Viewer.
3. Put the sheet ID and the four editing tabs' `gid`s under `tabs.draft` in
   `src/content/sheet.json`.
4. `npm run make-token`; commit the hash as `refreshTokenHash`, keep the token.
5. Extensions → Apps Script: paste `google/apps-script.gs`, set
   `REFRESH_TOKEN`, save, run `publishToWebsite` once and approve the prompt.
   The log prints the Live tabs' gids; put them under `tabs.live`.
6. Reload the sheet; the **Pigeon Bar** menu appears.

Manual refresh from anywhere: `https://pigeonbar.com/api/refresh?token=<token>`.

Images live in `public/`. The logo is `public/logo.jpg` and the home-page animation is `public/cubes.mp4` (800×800, no audio, ~2 MB) with `public/cubes-static.png` as its poster. If the video is ever replaced, re-encode it the same way so it stays small:

```bash
ffmpeg -i source.mp4 -an -vf "scale=800:800,fps=24" -c:v libx264 -preset slow -crf 30 -pix_fmt yuv420p -movflags +faststart public/cubes.mp4
```

## Local development

Requires Node 20 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
