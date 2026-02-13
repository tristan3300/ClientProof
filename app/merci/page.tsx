import Link from "next/link";
import styles from "./page.module.css";

export default function MerciPage() {
  return (
    <>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          Client<span>Proof</span>
        </Link>
      </nav>

      <div className={styles.main}>
        <div className={styles.card}>
          <div className={styles.checkCircle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="36" height="36">
              <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" />
            </svg>
          </div>

          <h1>C&apos;est reçu. Votre analyse est lancée.</h1>
          <p>
            Votre rapport sera envoyé par email sous 24h maximum. En général,
            c&apos;est beaucoup plus rapide.
          </p>

          <div className={styles.timeline}>
            <div className={`${styles.timelineStep} ${styles.done}`}>
              <div className={styles.timelineNum}>1</div>
              <div className={styles.timelineText}>
                <h3>Paiement confirmé</h3>
                <p>24 euros - carte bancaire</p>
              </div>
            </div>
            <div className={`${styles.timelineStep} ${styles.done}`}>
              <div className={styles.timelineNum}>2</div>
              <div className={styles.timelineText}>
                <h3>Formulaire envoyé</h3>
                <p>Vos informations ont bien été reçues</p>
              </div>
            </div>
            <div className={`${styles.timelineStep} ${styles.active}`}>
              <div className={styles.timelineNum}>3</div>
              <div className={styles.timelineText}>
                <h3>Analyse en cours</h3>
                <p>Votre prospect est en cours d&apos;analyse</p>
              </div>
            </div>
            <div className={styles.timelineStep}>
              <div className={styles.timelineNum}>4</div>
              <div className={styles.timelineText}>
                <h3>Rapport envoyé par email</h3>
                <p>PDF complet sous 24h max</p>
              </div>
            </div>
          </div>

          <div className={styles.contactNote}>
            Une question ? Écrivez-nous à{" "}
            <a href="mailto:contact@clientproof.fr">contact@clientproof.fr</a>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>&copy; {new Date().getFullYear()} ClientProof</footer>
    </>
  );
}
