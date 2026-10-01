import Nav from "../../components/Nav";
import { getContent } from "../../lib/sheets";
import styles from "../hours/page.module.css";
import local from "./page.module.css";

export const metadata = { title: "Contact | Pigeon Bar" };

export default async function ContactPage() {
  const { site } = await getContent();
  const s = site.settings || {};
  const instagram = s.instagram ? s.instagram.replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "") : "";
  const phoneHref = s.phone ? `tel:${s.phone.replace(/[^\d+]/g, "")}` : "";
  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.title}>Contact</h1>
        <dl className={local.list}>
          <div className={local.row}>
            <dt className={local.label}>Email</dt>
            <dd><a className={local.value} href={`mailto:${site.email}`}>{site.email}</a></dd>
          </div>
          {s.phone && (
            <div className={local.row}>
              <dt className={local.label}>Phone</dt>
              <dd><a className={local.value} href={phoneHref}>{s.phone}</a></dd>
            </div>
          )}
          {instagram && (
            <div className={local.row}>
              <dt className={local.label}>Instagram</dt>
              <dd><a className={local.value} href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer">@{instagram}</a></dd>
            </div>
          )}
          {s.address && (
            <div className={local.row}>
              <dt className={local.label}>Find us</dt>
              <dd><a className={local.value} href="/location">{s.address}</a></dd>
            </div>
          )}
        </dl>
      </main>
      <Nav homeOnly />
    </>
  );
}
