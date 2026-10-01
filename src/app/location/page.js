import Nav from "../../components/Nav";
import { getContent } from "../../lib/sheets";
import styles from "../hours/page.module.css";
import local from "./page.module.css";

export const metadata = { title: "Location | Pigeon Bar" };

export default async function LocationPage() {
  const { site } = await getContent();
  const s = site.settings || {};
  const query = s.mapquery || s.address || "Pigeon Bar Denver";
  const embed = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;
  return (
    <>
      <main className={`${styles.main} ${local.main}`}>
        <h1 className={styles.title}>Location</h1>
        {s.address && <p className={local.address}>{s.address}</p>}
        <div className={local.mapWrap}>
          <iframe
            className={local.map}
            src={embed}
            title="Map to Pigeon Bar"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <a className={local.button} href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
          Open in Google Maps
        </a>
      </main>
      <Nav homeOnly />
    </>
  );
}
