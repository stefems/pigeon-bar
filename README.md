# Pigeon Bar

Website for Pigeon Bar, Denver. Built with [Next.js](https://nextjs.org) and deployed on Netlify. Pushes to `main` deploy to pigeonbar.com; pull requests get a Netlify deploy preview.

## Updating content (Google Sheet)

Hours, menu and links come from a Google Sheet. Edit the sheet; the site
updates itself within about a minute. No code, no GitHub.

The sheet has four tabs. The header row must stay as is (column order doesn't
matter, extra columns are ignored):

| Tab | Columns |
| --- | --- |
| Hours | Day, Time |
| Menu | Section, Group, Name, Price, Description, Notes, Pairing, Image |
| Settings | Key, Value (keys: `name`, `email`, `mapsUrl`) |
| Links | Label, Link, New tab (yes/no) |

Menu tips: rows are grouped by Section in the order they first appear. Fill
Group for sub-headings like "Cans / Bottles". A row with a Section but no Name
sets that section's note (e.g. "Coming soon") from the Description column, or
its artwork from the Image column (a file in `public/`, e.g. `/menu-chess.png`).
Name the Section `(art)` for an image-only block; a title in parentheses is
not shown.

Footer links: if a link's Label matches one of the client's hand-drawn link
images in `public/nav/` (location, hours, menu, contact, home) that artwork is
shown; any other label renders as text.

### How it stays fast and safe

- The site caches the sheet for 24 hours (`cacheSeconds` in
  `src/content/sheet.json`).
- An Apps Script in the sheet pings `/api/refresh` about a minute after the
  last edit, which clears that cache. There is also a **Pigeon Bar → Publish
  changes now** menu in the sheet for a manual refresh.
- Every night a GitHub Action snapshots the sheet into `src/content/*.json`
  and commits it. If Google is ever unreachable, pages serve that snapshot.

### One-time setup

1. **Create the sheet.** New Google Sheet with tabs named `Hours`, `Menu`,
   `Settings`, `Links`. Import the matching CSV from `google/templates/` into
   each tab (File → Import → Upload → *Replace current sheet*).
2. **Share it:** Share → Anyone with the link → Viewer.
3. **Point the site at it.** Copy the ID from the sheet URL
   (`docs.google.com/spreadsheets/d/<ID>/edit`) into `sheetId` in
   `src/content/sheet.json`, and each tab's `gid` (the number after `gid=` in
   the URL when that tab is open) into `tabs`. Commit and push.
4. **Refresh token.** Run `npm run make-token`. Put the printed *hash* in
   `refreshTokenHash` in `src/content/sheet.json` (commit it). Keep the *token*
   private. (The hash currently committed has its token in `.refresh-token` on
   the machine that set this up.)
5. **Install the Apps Script.** In the sheet: Extensions → Apps Script. Paste
   `google/apps-script.gs`, set `REFRESH_TOKEN`, then follow the install notes
   at the top of that file to add the on-edit trigger.
6. **Nightly snapshot** needs nothing: the workflow in
   `.github/workflows/snapshot-sheet.yml` uses GitHub's built-in token. Run it
   by hand from the Actions tab the first time to confirm it works.

Manual refresh from anywhere: open
`https://pigeonbar.com/api/refresh?token=<token>`.

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
