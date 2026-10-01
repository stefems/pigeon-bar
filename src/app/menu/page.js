import Header from "../../components/Header";
import Nav from "../../components/Nav";
import { menu } from "../../content/menu";
import styles from "./page.module.css";

export const metadata = { title: "Menu | Pigeon Bar" };

function Items({ items }) {
  return (
    <ul className={styles.items}>
      {items.map((item) => (
        <li key={item.name} className={styles.item}>
          <div className={styles.line}>
            <span className={styles.name}>{item.name}</span>
            <span className={styles.dots} aria-hidden="true" />
            {item.price && <span className={styles.price}>{item.price}</span>}
          </div>
          {item.desc && <p className={styles.desc}>{item.desc}</p>}
          {item.notes && (
            <p className={styles.meta}>
              <span className={styles.label}>Notes:</span> {item.notes}
            </p>
          )}
          {item.pairing && (
            <p className={styles.meta}>
              <span className={styles.label}>Pairing:</span> {item.pairing}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function MenuPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>Menu</h1>
        <div className={styles.grid}>
          {menu.map((section) => (
            <section key={section.title} className={styles.section}>
              <h2 className={styles.heading}>{section.title}</h2>
              {section.note && <p className={styles.note}>{section.note}</p>}
              {section.items && <Items items={section.items} />}
              {section.groups?.map((group) => (
                <div key={group.title} className={styles.group}>
                  <h3 className={styles.subheading}>{group.title}</h3>
                  <Items items={group.items} />
                </div>
              ))}
            </section>
          ))}
        </div>
      </main>
      <Nav />
    </>
  );
}
