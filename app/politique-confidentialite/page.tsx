import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export const metadata = {
  title: 'Politique de confidentialite et cookies - ClientProof',
  description: 'Politique de confidentialite, protection des donnees personnelles et gestion des cookies du site ClientProof.fr.',
};

export default function PolitiqueConfidentialite() {
  return (
    <div className={styles.page}>
      <Nav />

      <div className={styles.container}>
        <h1 className={styles.title}>Politique de confidentialite et cookies</h1>
        <p className={styles.updated}>Derniere mise a jour : fevrier 2026</p>

        {/* ---- 1. Introduction ---- */}
        <section className={styles.section}>
          <h2>1. Introduction</h2>
          <p>
            La presente politique de confidentialite decrit comment ClientProof, edite par Tristan Cadiou (micro-entreprise, Bordeaux, France), collecte, utilise et protege vos donnees personnelles lorsque vous utilisez le site <strong>clientproof.fr</strong>.
          </p>
          <p>
            Nous nous engageons a respecter le Reglement General sur la Protection des Donnees (RGPD - Reglement UE 2016/679) et la loi Informatique et Libertes du 6 janvier 1978 modifiee.
          </p>
        </section>

        {/* ---- 2. Responsable du traitement ---- */}
        <section className={styles.section}>
          <h2>2. Responsable du traitement</h2>
          <ul>
            <li><strong>Responsable :</strong> Tristan Cadiou</li>
            <li><strong>Email :</strong> <a href="mailto:contact@clientproof.fr" className={styles.link}>contact@clientproof.fr</a></li>
            <li><strong>Adresse :</strong> Bordeaux, France</li>
          </ul>
        </section>

        {/* ---- 3. Donnees collectees ---- */}
        <section className={styles.section}>
          <h2>3. Donnees personnelles collectees</h2>
          <p>Nous collectons uniquement les donnees strictement necessaires au fonctionnement du service :</p>

          <h3>a) Adresse email</h3>
          <p>
            Votre adresse email est collectee lors du paiement (via Stripe) ou lorsque vous nous contactez directement. Elle permet de vous livrer le rapport commande et de repondre a vos demandes.
          </p>

          <h3>b) Messages et echanges soumis pour analyse</h3>
          <p>
            Lorsque vous utilisez le service d&apos;analyse, vous soumettez le contenu de vos echanges avec un prospect (emails, messages, notes). Ces donnees sont traitees exclusivement pour generer votre rapport d&apos;analyse.
          </p>

          <h3>c) Donnees de navigation</h3>
          <p>
            Des donnees techniques sont collectees automatiquement via des cookies : adresse IP anonymisee, type de navigateur, pages visitees, duree de session. Ces donnees servent uniquement a des fins statistiques et d&apos;amelioration du service.
          </p>
        </section>

        {/* ---- 4. Finalites ---- */}
        <section className={styles.section}>
          <h2>4. Finalites et bases legales du traitement</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Finalite</th>
                <th>Base legale</th>
                <th>Donnees</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fourniture du service d&apos;analyse</td>
                <td>Execution du contrat</td>
                <td>Email, messages soumis</td>
              </tr>
              <tr>
                <td>Traitement du paiement</td>
                <td>Execution du contrat</td>
                <td>Email (via Stripe)</td>
              </tr>
              <tr>
                <td>Reponse aux demandes de contact</td>
                <td>Interet legitime</td>
                <td>Email</td>
              </tr>
              <tr>
                <td>Mesure d&apos;audience et amelioration du site</td>
                <td>Consentement</td>
                <td>Cookies analytics</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ---- 5. Duree de conservation ---- */}
        <section className={styles.section}>
          <h2>5. Duree de conservation</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Donnee</th>
                <th>Duree de conservation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Messages soumis pour analyse</td>
                <td>Supprimes dans les 30 jours suivant la livraison du rapport</td>
              </tr>
              <tr>
                <td>Rapport d&apos;analyse genere</td>
                <td>6 mois, puis supprime automatiquement</td>
              </tr>
              <tr>
                <td>Adresse email</td>
                <td>12 mois apres la derniere interaction, sauf obligation legale</td>
              </tr>
              <tr>
                <td>Donnees de paiement</td>
                <td>Conservees par Stripe conformement a leurs obligations legales. ClientProof ne stocke aucune donnee bancaire.</td>
              </tr>
              <tr>
                <td>Cookies analytics</td>
                <td>13 mois maximum</td>
              </tr>
            </tbody>
          </table>
          <p>
            A l&apos;issue de ces delais, les donnees sont supprimees de maniere definitive ou anonymisees de facon irreversible.
          </p>
        </section>

        {/* ---- 6. Partage ---- */}
        <section className={styles.section}>
          <h2>6. Partage des donnees</h2>
          <p>
            Vos donnees personnelles ne sont <strong>jamais vendues, louees ou partagees</strong> a des fins commerciales.
          </p>
          <p>Elles peuvent etre transmises uniquement aux sous-traitants suivants, strictement necessaires au fonctionnement du service :</p>
          <ul>
            <li><strong>Vercel</strong> (hebergement du site) - Etats-Unis - Clauses contractuelles types UE</li>
            <li><strong>Stripe</strong> (traitement des paiements) - Etats-Unis - Certifie conforme au RGPD</li>
            <li><strong>OpenAI</strong> (generation de l&apos;analyse) - Etats-Unis - Les donnees transmises ne sont pas utilisees pour l&apos;entrainement des modeles (API usage policy)</li>
          </ul>
          <p>
            Chaque sous-traitant est tenu par des obligations contractuelles de confidentialite et de securite conformes au RGPD.
          </p>
        </section>

        {/* ---- 7. Securite ---- */}
        <section className={styles.section}>
          <h2>7. Securite des donnees</h2>
          <p>Nous mettons en oeuvre les mesures techniques et organisationnelles suivantes :</p>
          <ul>
            <li>Chiffrement des communications (HTTPS / TLS)</li>
            <li>Acces restreint aux donnees personnelles</li>
            <li>Hebergement sur une infrastructure securisee (Vercel)</li>
            <li>Paiements traites exclusivement par Stripe (certifie PCI DSS niveau 1)</li>
            <li>Aucune donnee bancaire stockee sur nos serveurs</li>
          </ul>
        </section>

        {/* ---- 8. Droits ---- */}
        <section className={styles.section}>
          <h2>8. Vos droits</h2>
          <p>
            Conformement au RGPD, vous disposez des droits suivants sur vos donnees personnelles :
          </p>
          <ul>
            <li><strong>Droit d&apos;acces :</strong> obtenir la confirmation que vos donnees sont traitees et en recevoir une copie</li>
            <li><strong>Droit de rectification :</strong> corriger des donnees inexactes ou incompletes</li>
            <li><strong>Droit de suppression :</strong> demander l&apos;effacement de vos donnees personnelles</li>
            <li><strong>Droit a la portabilite :</strong> recevoir vos donnees dans un format structure et lisible par machine</li>
            <li><strong>Droit d&apos;opposition :</strong> vous opposer au traitement de vos donnees pour des motifs legitimes</li>
            <li><strong>Droit a la limitation :</strong> demander la suspension du traitement dans certains cas</li>
            <li><strong>Droit de retrait du consentement :</strong> retirer votre consentement a tout moment (sans affecter la legalite du traitement effectue avant le retrait)</li>
          </ul>
          <p>
            Pour exercer l&apos;un de ces droits, envoyez un email a <a href="mailto:contact@clientproof.fr" className={styles.link}>contact@clientproof.fr</a>. Nous repondrons dans un delai maximum de 30 jours.
          </p>
          <p>
            Si vous estimez que vos droits ne sont pas respectes, vous pouvez introduire une reclamation aupres de la <strong>CNIL</strong> (Commission Nationale de l&apos;Informatique et des Libertes) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className={styles.link}>www.cnil.fr</a>.
          </p>
        </section>

        {/* ---- 9. Cookies ---- */}
        <section className={styles.section}>
          <h2>9. Politique de cookies</h2>

          <h3>Qu&apos;est-ce qu&apos;un cookie ?</h3>
          <p>
            Un cookie est un petit fichier texte depose sur votre terminal (ordinateur, smartphone, tablette) lors de la visite d&apos;un site web. Il permet au site de memoriser des informations sur votre visite.
          </p>

          <h3>Cookies utilises sur clientproof.fr</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Type</th>
                <th>Finalite</th>
                <th>Duree</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cookies essentiels</td>
                <td>Strictement necessaire</td>
                <td>Fonctionnement du site, session utilisateur, securite</td>
                <td>Session</td>
              </tr>
              <tr>
                <td>Google Analytics (_ga, _gid)</td>
                <td>Mesure d&apos;audience</td>
                <td>Analyse du trafic, pages visitees, sources de visite</td>
                <td>13 mois max</td>
              </tr>
              <tr>
                <td>Meta Pixel (_fbp)</td>
                <td>Mesure d&apos;audience</td>
                <td>Suivi des conversions publicitaires</td>
                <td>90 jours</td>
              </tr>
            </tbody>
          </table>

          <h3>Consentement</h3>
          <p>
            Les cookies strictement necessaires au fonctionnement du site sont deposes sans consentement prealable, conformement a l&apos;article 82 de la loi Informatique et Libertes.
          </p>
          <p>
            Les cookies de mesure d&apos;audience (analytics) et de suivi publicitaire ne sont deposes qu&apos;apres votre consentement explicite. Vous pouvez modifier vos preferences a tout moment.
          </p>

          <h3>Comment gerer les cookies ?</h3>
          <p>Vous pouvez a tout moment :</p>
          <ul>
            <li>Accepter ou refuser les cookies non essentiels via le bandeau de consentement affiche lors de votre premiere visite</li>
            <li>Modifier vos preferences dans les parametres de votre navigateur</li>
            <li>Supprimer les cookies deja deposes via les parametres de votre navigateur</li>
          </ul>
          <p>
            La desactivation des cookies de mesure d&apos;audience n&apos;affecte pas le fonctionnement du service. Vous pourrez toujours utiliser ClientProof normalement.
          </p>
        </section>

        {/* ---- 10. Transferts hors UE ---- */}
        <section className={styles.section}>
          <h2>10. Transferts de donnees hors Union europeenne</h2>
          <p>
            Certains de nos sous-traitants (Vercel, Stripe, OpenAI) sont situes aux Etats-Unis. Ces transferts sont encadres par :
          </p>
          <ul>
            <li>Les clauses contractuelles types adoptees par la Commission europeenne</li>
            <li>Le Data Privacy Framework UE-Etats-Unis (lorsque applicable)</li>
          </ul>
          <p>
            Ces mecanismes garantissent un niveau de protection des donnees equivalent a celui offert par le RGPD.
          </p>
        </section>

        {/* ---- 11. Modifications ---- */}
        <section className={styles.section}>
          <h2>11. Modifications de cette politique</h2>
          <p>
            Nous nous reservons le droit de modifier la presente politique de confidentialite a tout moment. En cas de modification substantielle, un avis sera publie sur le site. La date de derniere mise a jour figure en haut de cette page.
          </p>
          <p>
            Nous vous invitons a consulter regulierement cette page pour prendre connaissance des eventuelles modifications.
          </p>
        </section>

        {/* ---- 12. Contact ---- */}
        <section className={styles.section}>
          <h2>12. Contact</h2>
          <p>
            Pour toute question relative a cette politique ou a la protection de vos donnees personnelles :
          </p>
          <p>
            <a href="mailto:contact@clientproof.fr" className={styles.link}>contact@clientproof.fr</a>
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
