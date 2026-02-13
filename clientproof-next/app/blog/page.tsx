import Nav from '../../components/Nav';
import styles from './page.module.css';

const articles = [
  {
    title: 'Scope creep freelance : comprendre, stopper et prevenir la derive de perimetre',
    description:
      "Le scope creep est la premiere cause de missions freelance qui derapent. Voici comment le detecter, l'arreter en cours de projet et l'empecher avant de signer.",
    href: '/blog/scope-creep-freelance.html',
  },
  {
    title: 'Client freelance ne paie pas : que faire et comment se proteger',
    description:
      "Votre client ne paie pas votre facture ? Voici les etapes concretes pour recuperer votre argent et eviter cette situation a l'avenir.",
    href: '/blog/client-freelance-ne-paie-pas.html',
  },
];

export default function BlogPage() {
  return (
    <div className={styles.page}>
      <Nav />
      <div className={styles.container}>
        <h1 className={styles.title}>Blog ClientProof</h1>
        <p className={styles.subtitle}>
          Conseils et ressources pour les freelances qui veulent se proteger avant de signer.
        </p>
        <div className={styles.grid}>
          {articles.map((article) => (
            <a key={article.href} href={article.href} className={styles.card}>
              <h2 className={styles.cardTitle}>{article.title}</h2>
              <p className={styles.cardDesc}>{article.description}</p>
              <span className={styles.cardLink}>Lire l&apos;article &rarr;</span>
            </a>
          ))}
        </div>
      </div>
      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} ClientProof
      </footer>
    </div>
  );
}
