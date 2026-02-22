"use client"
import Image from "next/image";
import styles from "./page.module.css";

import Link from 'next/link'
import React, { useState } from "react";

export default function Home() {

  const [gifLoading, setGifLoading] = useState(true);
  console.log(gifLoading);
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        /> */}
        <div className={styles.intro}>
          {/* home logo width="1242" height="198" */}
          <Image
              loading="eager"
              fetchPriority="high"
              width="1242" height="198" 
              // sizes="(max-width: 1080px) 100vw, 33vw"
              alt={"geometric styling of pigeon"}
              className={styles.logo}
              src="/logo-inverted.JPG"
            />
          {/* cubes gif */}
          {/* {gifLoading &&
            <Image
              loading="eager"
              fetchPriority="high"
              width="500" height="500"
              // sizes="(max-width: 1080px) 100vw, 33vw"
              alt={"geometric animation of grid of squares"}
              className={styles.cubes}
              src="/cubes-static.png"
            />
          } */}
          <Image
            width="500" height="500"
            // sizes="(max-width: 1080px) 100vw, 33vw"
            alt={"geometric animation of grid of squares"}
            className={`${styles.cubes} ${gifLoading && styles.hidden}`}
            src="/home-cubes.gif"
            onLoad={() => setGifLoading(false)}
            onError={(e) => console.error(e.target.id)}
          />
          {/* nav menu */}
          <nav  className={styles.nav}>
            <Link href="/about">about</Link>
            <Link href="https://maps.app.goo.gl/cRxxzn8TKhwysGsa8">location</Link>
            <Link href="/hours">hours</Link>
            <Link href="/menu">menu</Link>
            <Link href="mailto:pigeondenver@gmail.com">contact</Link>
          </nav>
        </div>
      </main>
    </div>
  );
}
