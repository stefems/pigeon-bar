import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from 'next/head';
import Image from "next/image";
import styles from "./page.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pigeon Bar",
  description: "Pigeon Bar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>Pigeon Bar</title>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Pigeon Bar" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Image
          loading="eager"
          fetchPriority="high"
          width="500" height="500"
          // sizes="(max-width: 1080px) 100vw, 33vw"
          alt={"highlight applied to page"}
          className={styles.highlight}
          src="/Highlight.png"
        />
        <Image
          loading="eager"
          fetchPriority="high"
          width="500" height="500"
          // sizes="(max-width: 1080px) 100vw, 33vw"
          alt={"texture applied to page"}
          className={styles.texture}
          src="/Texture.png"
        />
      </body>
    </html>
  );
}
