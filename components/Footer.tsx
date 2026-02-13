import Link from 'next/link';
import styles from './Footer.module.css';

const blogArticles = [
  { title: 'Client toxique freelance', href: '/blog/client-toxique-freelance.html' },
  { title: 'Refuser un client freelance', href: '/blog/refuser-client-freelance.html' },
  { title: 'Scope creep freelance', href: '/blog/scope-creep-freelance.html' },
  { title: 'Client qui ne paie pas', href: '/blog/client-freelance-ne-paie-pas.html' },
  { title: 'Signaux mauvais client', href: '/blog/signaux-mauvais-client-freelance.html' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            Client<span>Proof</span>
          </Link>
          <p className={styles.tagline}>Analysez vos prospects avant de signer.</p>
          <Link href="/app" className={styles.cta}>
            Analyser gratuitement &rarr;
          </Link>
        </div>

        <div className={styles.col}>
          <h4>Navigation</h4>
          <a href="/#method">Comment ca marche</a>
          <a href="/#pricing">Tarif</a>
          <a href="/#faq">FAQ</a>
          <Link href="/blog">Blog</Link>
        </div>

        <div className={styles.col}>
          <h4>Blog</h4>
          {blogArticles.map((a) => (
            <a key={a.href} href={a.href}>{a.title}</a>
          ))}
          <h4 className={styles.contactTitle}>Contact</h4>
          <a href="mailto:contact@clientproof.fr">contact@clientproof.fr</a>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} ClientProof. Tous droits reserves. <Link href="/mentions-legales" className={styles.bottomLink}>Mentions legales</Link></p>
      </div>
    </footer>
  );
}
