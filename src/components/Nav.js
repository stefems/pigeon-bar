import Link from "next/link";
import { navLinks } from "../content/site";
import styles from "./Nav.module.css";

// Full nav on the home page; sub-pages get a single HOME link (homeOnly).
export default function Nav({ homeOnly = false }) {
  if (homeOnly) {
    return (
      <nav className={styles.nav} aria-label="Main">
        <Link href="/">home</Link>
      </nav>
    );
  }
  return (
    <nav className={styles.nav} aria-label="Main">
      {navLinks.map((link) =>
        link.external || link.href.startsWith("mailto:") ? (
          <a
            key={link.label}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
          >
            {link.label}
          </a>
        ) : (
          <Link key={link.label} href={link.href}>
            {link.label}
          </Link>
        )
      )}
    </nav>
  );
}
