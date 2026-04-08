import styles from "./page.module.css";
import Image from "next/image";
import Link from 'next/link'


export default function Page({ params, searchParams }) {
    return (
      <div>
        <nav className={styles.nav}>
          <Link href="/">home</Link>
        </nav>
        <Image
          loading="eager"
          fetchPriority="high"
          width="500" height="500"
          alt={"hours"}
          className={styles.hours}
          src="/hours.png"
        />
        <nav  className={styles.nav}>
          <Link href="https://maps.app.goo.gl/cRxxzn8TKhwysGsa8">location</Link>
          <Link href="/hours">hours</Link>
          <Link href="/menu">menu</Link>
          <Link href="mailto:pigeondenver@gmail.com">contact</Link>
        </nav>
      </div>
    )
  }