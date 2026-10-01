import Header from "../../components/Header";
import Nav from "../../components/Nav";
import { hours } from "../../content/hours";
import styles from "./page.module.css";

export const metadata = { title: "Hours | Pigeon Bar" };

export default function HoursPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>Hours</h1>
        <dl className={styles.list}>
          {hours.map(({ day, time }) => (
            <div key={day} className={styles.row}>
              <dt className={styles.day}>{day}</dt>
              <dd className={`${styles.time} ${/closed/i.test(time) ? styles.closed : ""}`}>{time}</dd>
            </div>
          ))}
        </dl>
      </main>
      <Nav />
    </>
  );
}
