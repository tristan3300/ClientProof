"use client";

import { useEffect } from "react";
import Link from "next/link";
import { trackEvent, trackPixel } from "@/lib/tracking";
import styles from "./page.module.css";

export default function FormulairePage() {
  useEffect(() => {
    trackEvent('form_view');
    trackPixel('ViewContent');

    // Redirect to merci when Tally form is submitted
    function handleMessage(e: MessageEvent) {
      let data = e.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }
      if (
        data &&
        (data.event === "Tally.FormSubmitted" ||
          data.event === "Tally.Submitted" ||
          data.type === "Tally.FormSubmitted" ||
          data.type === "Tally.Submitted")
      ) {
        trackEvent('form_submit');
        trackPixel('CompleteRegistration');
        window.location.href = "/merci";
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          Client<span>Proof</span>
        </Link>
      </nav>

      <div className={styles.headerBlock}>
        <div className={styles.stepBadge}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" />
          </svg>
          Paiement confirmé
        </div>
        <h1>Décrivez votre prospect en 5 minutes</h1>
        <p>
          Plus vous donnez de contexte, plus le rapport sera précis et
          actionnable. Votre analyse démarre dès l&apos;envoi du formulaire.
        </p>
      </div>

      <div className={styles.tallyWrap}>
        <iframe
          src="https://tally.so/embed/Pd561B?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
          width="100%"
          height="800"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          title="Formulaire ClientProof"
          style={{ border: "none" }}
        />
      </div>

      <div className={styles.reassurance}>
        <div className={styles.reassuranceRow}>
          <div className={styles.reassuranceItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Données confidentielles
          </div>
          <div className={styles.reassuranceItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
            Rapport sous 24h
          </div>
          <div className={styles.reassuranceItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <path d="M22 6l-10 7L2 6" />
            </svg>
            Envoyé par email
          </div>
        </div>
      </div>

      <footer className={styles.footer}>&copy; {new Date().getFullYear()} ClientProof</footer>
    </>
  );
}
