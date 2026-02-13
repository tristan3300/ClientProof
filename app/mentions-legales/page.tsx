import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export const metadata = {
  title: 'Mentions legales - ClientProof',
  description: 'Mentions legales du site ClientProof.fr',
};

export default function MentionsLegales() {
  return (
    <div className={styles.page}>
      <Nav />

      <div className={styles.container}>
        <h1 className={styles.title}>Mentions legales</h1>
        <p className={styles.updated}>Derniere mise a jour : fevrier 2026</p>

        <section className={styles.section}>
          <h2>1. Editeur du site</h2>
          <p>
            Le site <strong>clientproof.fr</strong> est edite par :
          </p>
          <ul>
            <li><strong>Nom :</strong> Tristan Cadiou</li>
            <li><strong>Forme juridique :</strong> Micro-entreprise</li>
            <li><strong>Siege social :</strong> Bordeaux, France</li>
            <li><strong>Numero TVA intracommunautaire :</strong> Non applicable (franchise en base de TVA)</li>
            <li><strong>Directeur de la publication :</strong> Tristan Cadiou</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>2. Hebergement</h2>
          <p>Le site est heberge par :</p>
          <ul>
            <li><strong>Vercel Inc.</strong></li>
            <li>440 N Barranca Ave #4133, Covina, CA 91723, Etats-Unis</li>
            <li>Site : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a></li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Contact</h2>
          <p>
            Pour toute question relative au site ou a son contenu, vous pouvez nous contacter a l&apos;adresse suivante :
          </p>
          <p>
            <a href="mailto:contact@clientproof.fr" className={styles.link}>contact@clientproof.fr</a>
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Propriete intellectuelle</h2>
          <p>
            L&apos;ensemble des contenus presents sur le site clientproof.fr (textes, images, graphismes, logo, icones, structure, base de donnees, logiciels) est protege par les dispositions du Code de la propriete intellectuelle et appartient a l&apos;editeur ou fait l&apos;objet d&apos;une autorisation d&apos;utilisation.
          </p>
          <p>
            Toute reproduction, representation, modification, publication, transmission ou denaturation, totale ou partielle, du site ou de son contenu, par quelque procede que ce soit et sur quelque support que ce soit, est interdite sans l&apos;autorisation ecrite prealable de l&apos;editeur.
          </p>
          <p>
            Toute exploitation non autorisee du site ou de son contenu sera consideree comme constitutive d&apos;une contrefacon et poursuivie conformement aux articles L.335-2 et suivants du Code de la propriete intellectuelle.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Limitation de responsabilite</h2>
          <p>
            Les informations et analyses fournies par ClientProof ont un caractere informatif et constituent une aide a la decision. Elles ne sauraient se substituer a un conseil juridique professionnel et ne garantissent pas l&apos;issue d&apos;une relation commerciale.
          </p>
          <p>
            L&apos;editeur s&apos;efforce de fournir des informations aussi precises que possible. Toutefois, il ne pourra etre tenu responsable des omissions, des inexactitudes et des carences dans la mise a jour, qu&apos;elles soient de son fait ou du fait de tiers partenaires qui lui fournissent ces informations.
          </p>
          <p>
            L&apos;editeur ne saurait etre tenu pour responsable des dommages directs ou indirects resultant de l&apos;acces au site ou de l&apos;utilisation des informations et analyses fournies, y compris l&apos;inaccessibilite, les pertes de donnees, les deteriorations ou les virus qui pourraient affecter l&apos;equipement informatique de l&apos;utilisateur.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Collecte de donnees personnelles</h2>
          <p>
            Dans le cadre de l&apos;utilisation du site clientproof.fr, des donnees personnelles peuvent etre collectees, notamment :
          </p>
          <ul>
            <li>Adresse email (lors du paiement ou de la prise de contact)</li>
            <li>Contenu des echanges soumis pour analyse (traites de maniere confidentielle)</li>
            <li>Donnees de navigation (cookies, adresse IP) a des fins statistiques</li>
          </ul>
          <p>
            Conformement au Reglement General sur la Protection des Donnees (RGPD) et a la loi Informatique et Libertes du 6 janvier 1978 modifiee, vous disposez des droits suivants sur vos donnees personnelles :
          </p>
          <ul>
            <li>Droit d&apos;acces, de rectification et de suppression</li>
            <li>Droit a la portabilite de vos donnees</li>
            <li>Droit d&apos;opposition et de limitation du traitement</li>
            <li>Droit de retirer votre consentement a tout moment</li>
          </ul>
          <p>
            Pour exercer ces droits, adressez votre demande a : <a href="mailto:contact@clientproof.fr" className={styles.link}>contact@clientproof.fr</a>.
          </p>
          <p>
            Les donnees soumises pour analyse ne sont ni partagees, ni revendues a des tiers. Elles sont utilisees uniquement pour la generation du rapport commande et ne sont pas conservees au-dela de la duree necessaire a la fourniture du service.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Cookies</h2>
          <p>
            Le site clientproof.fr utilise des cookies a des fins de mesure d&apos;audience et de fonctionnement du service. En poursuivant votre navigation sur ce site, vous acceptez l&apos;utilisation de cookies conformement a notre politique.
          </p>
          <p>
            Vous pouvez a tout moment desactiver les cookies dans les parametres de votre navigateur. La desactivation de certains cookies peut affecter votre experience de navigation.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Paiement et remboursement</h2>
          <p>
            Les paiements sont traites de maniere securisee par <strong>Stripe</strong> (Stripe Payments Europe, Ltd.). L&apos;editeur ne stocke aucune donnee bancaire.
          </p>
          <p>
            Conformement a notre politique de satisfaction, un remboursement integral peut etre demande si l&apos;analyse fournie ne vous aide pas a prendre une decision claire. La demande de remboursement s&apos;effectue par simple email a <a href="mailto:contact@clientproof.fr" className={styles.link}>contact@clientproof.fr</a>.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Droit applicable</h2>
          <p>
            Les presentes mentions legales sont soumises au droit francais. En cas de litige, et apres tentative de resolution amiable, competence est attribuee aux tribunaux francais competents.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
