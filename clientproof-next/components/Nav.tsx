import Link from 'next/link';
import styles from './Nav.module.css';

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>
        <Link href="/" className={styles.logo}>
          Client<span className={styles.logoSpan}>Proof</span>
        </Link>
        <ul className={styles.links}>
          <li><a href="/#method" className={styles.link}>Comment ca marche</a></li>
          <li><a href="/#pricing" className={styles.link}>Tarif</a></li>
          <li><a href="/#faq" className={styles.link}>FAQ</a></li>
          <li><Link href="/blog" className={styles.link}>Blog</Link></li>
        </ul>
        <Link href="/app" className={styles.cta}>
          Analyser gratuitement
        </Link>
      </div>
    </nav>
  );
}
