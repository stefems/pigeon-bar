import Nav from "../components/Nav";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={`tinted ${styles.logo}`}>
        <span className={styles.srOnly}>Pigeon</span>
      </h1>
      <div className={styles.cubesWrap}>
        <video
          className={styles.cubes}
          src="/cubes.mp4"
          poster="/cubes-static.png"
          preload="metadata"
          autoPlay
          muted
          loop
          playsInline
          aria-label="Animated grid of cubes"
        />
      </div>
      <Nav />
    </main>
  );
}
