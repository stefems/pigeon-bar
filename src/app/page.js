import Nav from "../components/Nav";
import { getContent } from "../lib/sheets";
import styles from "./page.module.css";

export default async function Home() {
  const { site } = await getContent();
  return (
    <main className={styles.main}>
      <h1 className={`tinted ${styles.logo}`}>
        <span className={styles.srOnly}>Pigeon</span>
      </h1>
      <div className={styles.cubesWrap}>
        <video
          className={styles.cubes}
          src="/cubes.mp4"
          poster="/cubes-poster.jpg"
          preload="metadata"
          autoPlay
          muted
          loop
          playsInline
          aria-label="Animated grid of cubes"
        />
      </div>
      <Nav links={site.navLinks} />
    </main>
  );
}
