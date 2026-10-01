import Image from "next/image";
import Nav from "../components/Nav";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Image
        priority
        width="1242"
        height="198"
        sizes="(max-width: 600px) 85vw, 640px"
        alt="Pigeon"
        className={styles.logo}
        src="/logo.jpg"
      />
      <video
        className={styles.cubes}
        src="/cubes.mp4"
        poster="/cubes-static.png"
        autoPlay
        muted
        loop
        playsInline
        aria-label="Animated grid of cubes"
      />
      <Nav />
    </main>
  );
}
