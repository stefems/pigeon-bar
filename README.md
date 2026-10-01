# Pigeon Bar

Website for Pigeon Bar, Denver. Built with [Next.js](https://nextjs.org) and deployed on Netlify. Pushes to `main` deploy to pigeonbar.com; pull requests get a Netlify deploy preview.

## Updating content

All editable content lives in `src/content/`. No code changes are needed to update it.

| What | File |
| --- | --- |
| Hours | `src/content/hours.js` |
| Menu (sections, items, prices, descriptions) | `src/content/menu.js` |
| Email, Google Maps link, footer nav links | `src/content/site.js` |

Edit the file, commit, and push (or open a pull request to see a preview first).

Images live in `public/`. The logo is `public/logo.jpg` and the home-page animation is `public/cubes.mp4` with `public/cubes-static.png` as its poster.

## Local development

Requires Node 20 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
