import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" aria-label="Pigeon Bar home" className={styles.logoLink}>
        <Image
          priority
          width="1242"
          height="198"
          sizes="(max-width: 600px) 80vw, 480px"
          alt="Pigeon"
          className={styles.logo}
          src="/logo.jpg"
        />
      </Link>
    </header>
  );
}
