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
            {item.desc && !item.notes && item.desc.length <= 8 && (
              <span className={styles.inlineDesc}>{item.desc}</span>
            )}
            <span className={styles.dots} aria-hidden="true">...</span>
            {item.price && <span className={styles.price}>{item.price}</span>}
          </div>
          {item.desc && (item.notes || item.desc.length > 8) && (
            <p className={styles.desc}>{item.desc}</p>
          )}
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

// Checkerboard: blocks 1, 2, 5, 6, ... are light; 0, 3, 4, 7, ... are dark.
const isLight = (i) => i % 4 === 1 || i % 4 === 2;

export default function MenuPage() {
  return (
    <>
      <main className={styles.main}>
        <div className={styles.poster}>
          <h1 className={styles.title}>Menu</h1>
          <div className={styles.grid}>
            {menu.map((section, i) => (
              <section
                key={section.title}
                className={`${styles.block} ${isLight(i) ? styles.light : styles.dark}`}
              >
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
          <div className={styles.rule} aria-hidden="true" />
        </div>
      </main>
      <Nav homeOnly />
    </>
  );
}
