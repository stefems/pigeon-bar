import Link from "next/link";
import styles from "./Nav.module.css";

// Hand-drawn link artwork supplied by the client (white on black PNGs in
// public/nav/). Rendered as CSS masks so they take the page text colour.
// A link whose label has no artwork falls back to plain text.
const ART = {
  location: { w: 331, h: 88 },
  hours: { w: 277, h: 88 },
  menu: { w: 257, h: 88 },
  contact: { w: 351, h: 88 },
  home: { w: 331, h: 96 },
};

function Label({ text }) {
  const key = text.trim().toLowerCase();
  const art = ART[key];
  if (!art) return <span className={styles.text}>{text}</span>;
  return (
    <span
      className={`tinted ${styles.art}`}
      role="img"
      aria-label={text}
      style={{
        aspectRatio: `${art.w} / ${art.h}`,
        WebkitMaskImage: `url(/nav/${key}.png)`,
        maskImage: `url(/nav/${key}.png)`,
      }}
    />
  );
}

// Full nav on the home page (pass `links`); sub-pages get a single HOME link.
export default function Nav({ links = [], homeOnly = false }) {
  const items = homeOnly ? [{ label: "home", href: "/" }] : links;
  return (
    <nav className={styles.nav} aria-label="Main">
      {items.map((link) =>
        link.external || link.href.startsWith("mailto:") ? (
          <a
            key={link.label}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
          >
            <Label text={link.label} />
          </a>
        ) : (
          <Link key={link.label} href={link.href}>
            <Label text={link.label} />
          </Link>
        )
      )}
    </nav>
  );
}
