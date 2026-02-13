import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import styles from './page.module.css';

const articles = [
  {
    title: 'Client toxique freelance : comportements, mecanismes psychologiques et prevention',
    description:
      "Comment identifier un client toxique avant de signer ? 5 profils types, schemas psychologiques sous-jacents, consequences reelles et methode de prevention pour freelances.",
    href: '/blog/client-toxique-freelance',
  },
  {
    title: 'Refuser un client freelance : quand dire non et comment le faire',
    description:
      "Dire non a un prospect quand on est freelance, c'est difficile. Voici comment reperer les red flags, evaluer un client avant de signer, et refuser poliment.",
    href: '/blog/refuser-client-freelance',
  },
  {
    title: 'Scope creep freelance : comprendre, stopper et prevenir la derive de perimetre',
    description:
      "Le scope creep est la premiere cause de missions freelance qui derapent. Voici comment le detecter, l'arreter en cours de projet et l'empecher avant de signer.",
    href: '/blog/scope-creep-freelance',
  },
  {
    title: 'Client freelance ne paie pas : que faire et comment se proteger',
    description:
      "Votre client ne paie pas votre facture ? Voici les etapes concretes pour recuperer votre argent et eviter cette situation a l'avenir.",
    href: '/blog/client-freelance-ne-paie-pas',
  },
  {
    title: 'Signaux mauvais client freelance : 8 red flags a reperer avant de signer',
    description:
      "Comment reperer un mauvais client avant de signer ? 8 signaux d'alerte concrets, avec des exemples de messages reels et une methode de detection.",
    href: '/blog/signaux-mauvais-client-freelance',
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
      <Footer />
    </div>
  );
}
