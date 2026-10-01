import { Jost } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const jost = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Pigeon Bar",
  description: "Pigeon Bar, Denver",
  manifest: "/site.webmanifest",
  appleWebApp: { title: "Pigeon Bar" },
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#0f0f0f",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jost.variable} style={{ "--font-heading": "var(--font-body)" }}>
      <body>
        {children}
        <Image
          priority
          width="500"
          height="500"
          alt=""
          aria-hidden="true"
          className="overlay"
          src="/Highlight.png"
        />
        <Image
          priority
          width="500"
          height="500"
          alt=""
          aria-hidden="true"
          className="overlay texture"
          src="/Texture.png"
        />
      </body>
    </html>
  );
}
