import { Jost, Josefin_Sans } from "next/font/google";
import { preload } from "react-dom";
import "./globals.css";

const jost = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const josefin = Josefin_Sans({
  variable: "--font-nav",
  subsets: ["latin"],
  weight: ["300"],
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
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  // The logo is drawn as a CSS mask, which browsers discover late; preload it.
  preload("/logo-mask.png", { as: "image", fetchPriority: "high" });
  return (
    <html lang="en" className={`${jost.variable} ${josefin.variable}`}>
      <body>{children}</body>
    </html>
  );
}
