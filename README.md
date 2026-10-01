# Pigeon Bar

Website for Pigeon Bar, Denver. Built with [Next.js](https://nextjs.org) and deployed on Netlify. Pushes to `main` deploy to pigeonbar.com; pull requests get a Netlify deploy preview.

## Updating content (no code needed)

Go to **https://pigeonbar.com/admin** and sign in with GitHub. The editor
([Decap CMS](https://decapcms.org)) has three screens:

- **Hours** – one line per day.
- **Menu** – sections, items, prices, descriptions, notes and pairings.
- **Site settings** – contact email, Google Maps link, footer links.

Click **Publish** and the change is committed to `main`; Netlify rebuilds the
site in about a minute.

Under the hood the content is plain JSON in `src/content/` (`hours.json`,
`menu.json`, `site.json`), so it can also be edited directly on GitHub.

### One-time CMS setup (site owner)

The editor signs in through GitHub, which Netlify brokers. This has to be
enabled once in the Netlify dashboard:

1. On GitHub: Settings → Developer settings → OAuth Apps → **New OAuth App**.
   - Homepage URL: `https://pigeonbar.com`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
2. On Netlify: the `pigeon-bar` site → Site configuration → Access & security
   → **OAuth** → Install provider → GitHub. Paste the Client ID and Secret
   from step 1.
3. Anyone who should edit the site needs write access to the
   `stefems/pigeon-bar` GitHub repo.

### Editing the CMS locally

```bash
npx decap-server
```

Then uncomment `local_backend: true` in `public/admin/config.yml`, run the dev
server and open http://localhost:3000/admin. Re-comment it before committing.

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
