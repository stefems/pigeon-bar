"use client"
import Image from "next/image";
import styles from "./page.module.css";

import Link from 'next/link'
import React, { useState, useEffect, useRef } from "react";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <Image
            loading="eager"
            fetchPriority="high"
            width="1242" height="198" 
            alt={"geometric styling of pigeon"}
            className={styles.logo}
            src="/logo.jpg"
          />
          <video
            alt={"geometric animation of grid of squares"}
            className={`${styles.cubes}`}
            src="/cubes.mp4"
            controls={false}
            autoPlay
            muted
            loop
          />
          <nav  className={styles.nav}>
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
