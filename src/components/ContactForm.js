"use client";
import { useState } from "react";
import styles from "./ContactForm.module.css";

export default function ContactForm({ email }) {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || "Could not send.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  if (status === "sent") {
    return (
      <div className={styles.thanks} role="status">
        <p className={styles.thanksTitle}>Thanks, got it.</p>
        <p>We&apos;ll get back to you at the email you gave.</p>
        <button type="button" className={styles.link} onClick={() => setStatus("idle")}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <label className={styles.field}>
        <span className={styles.label}>Name</span>
        <input className={styles.input} name="name" type="text" required autoComplete="name" maxLength={200} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Email</span>
        <input className={styles.input} name="email" type="email" required autoComplete="email" maxLength={200} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Message</span>
        <textarea className={styles.input} name="message" rows={6} required maxLength={5000} />
      </label>
      {/* Honeypot: hidden from people, bots tend to fill it. */}
      <label className={styles.honey} aria-hidden="true">
        Website
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      {status === "error" && (
        <p className={styles.error} role="alert">
          {error} {email && <>Or email <a href={`mailto:${email}`}>{email}</a>.</>}
        </p>
      )}
      <button className={styles.button} type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
