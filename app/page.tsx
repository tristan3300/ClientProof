import Link from 'next/link';
import styles from './page.module.css';
import LandingInteractions from '../components/LandingInteractions';

export default function Home() {
  return (
    <>
      <LandingInteractions />

      {/* NAV */}
      <nav id="landing-nav" className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo}>
            Client<span className={styles.logoSpan}>Proof</span>
          </Link>
          <Link href="/app" className={styles.ctaNav}>
            Analyser gratuitement
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroBadge}>
            <span className={styles.dot} />
            Pour freelances, consultants &amp; agences
          </div>
          <h1 className={styles.heroTitle}>
            Envoyez vos échanges. Sachez si vous devez{' '}
            <em className={styles.heroTitleEm}>accepter ce client</em>.
          </h1>
          <p className={styles.heroSub}>
            Collez vos échanges, obtenez un aperçu gratuit en 30 secondes. Score de risque, red flags, recommandations, message prêt à envoyer.
          </p>
          <div className={styles.heroCtaWrap}>
            <Link href="/app" className={`${styles.ctaMain} ${styles.ctaPulse}`} data-track-cta="hero">
              Analyser mon prospect gratuitement
            </Link>
            <span className={styles.ctaSub}>
              Aperçu gratuit en 30 secondes - Rapport complet à 24 €
            </span>
            <div className={styles.trustRow}>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </span>
                Données confidentielles
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </span>
                Remboursé si non satisfait
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </span>
                Aucun abonnement
              </div>
            </div>
          </div>

          {/* Example report card */}
          <div className={styles.heroExampleCard}>
            <p><strong>Exemple réel de rapport</strong></p>
            <div className={styles.heroExampleSpacer} />
            <p><strong>Score : Risque élevé</strong></p>
            <p>→ Le client attend un accompagnement non défini</p>
            <p>→ Probabilité de demandes hors périmètre élevée</p>
            <div className={styles.heroExampleSpacer} />
            <p><strong>Ce que nous recommandons :</strong></p>
            <p>- Acompte 40%</p>
            <p>- Limite de retours</p>
            <p>- Périmètre écrit</p>
            <div className={styles.heroExampleSpacer} />
            <p><strong>Message prêt à envoyer :</strong></p>
            <p>
              <em>
                &quot;Pour sécuriser le projet, je vous propose de cadrer ensemble le périmètre avant validation.&quot;
              </em>
            </p>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <div className={styles.socialProof}>
        <div className={styles.socialProofInner}>
          <div className={styles.proofStat}>
            <div className={styles.proofNum}>73%</div>
            <div className={styles.proofLabel}>des freelances ont eu un client toxique</div>
          </div>
          <div className={styles.proofDivider} />
          <div className={styles.proofStat}>
            <div className={styles.proofNum}>3 200 €</div>
            <div className={styles.proofLabel}>Coût moyen d&apos;un mauvais contrat</div>
          </div>
          <div className={styles.proofDivider} />
          <div className={styles.proofStat}>
            <div className={styles.proofNum}>&lt; 24h</div>
            <div className={styles.proofLabel}>Pour recevoir votre rapport</div>
          </div>
        </div>
      </div>

      {/* PAIN */}
      <section className={styles.section} id="pain">
        <div className={styles.container}>
          <div className={styles.reveal}>
            <span className={styles.sectionLabel}>Le problème</span>
            <h2 className={styles.sectionTitle}>
              Vous avez déjà vécu ça.<br />Ou vous allez le vivre.
            </h2>
            <p className={styles.sectionIntro}>
              Ces situations arrivent à tous les freelances qui n&apos;ont pas encore appris à filtrer avant de signer.
            </p>
          </div>

          <div className={`${styles.painCard} ${styles.reveal} ${styles.revealDelay1}`}>
            <div className={styles.painQuote}>
              « Il m&apos;a dit que le budget était flexible, qu&apos;on verrait au fur et à mesure. Après 3 semaines de travail, il a contesté la facture. »
            </div>
            <div className={styles.painResult}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 8v4m0 4h.01" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              2 400 € jamais payés - 6 mois de relances
            </div>
          </div>

          <div className={`${styles.painCard} ${styles.reveal} ${styles.revealDelay2}`}>
            <div className={styles.painQuote}>
              « Le brief faisait 4 lignes. J&apos;ai livré exactement ce qui était demandé. Elle a exigé 11 allers-retours de modifications &quot;mineures&quot;. »
            </div>
            <div className={styles.painResult}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 8v4m0 4h.01" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              Un projet à 800 € qui a coûté 40 heures
            </div>
          </div>

          <div className={`${styles.painCard} ${styles.reveal} ${styles.revealDelay3}`}>
            <div className={styles.painQuote}>
              « Il était très sympa en appel découverte. Puis il a commencé à envoyer des messages à 23h, des vocaux de 8 minutes, et à menacer de &quot;parler à son avocat&quot;. »
            </div>
            <div className={styles.painResult}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 8v4m0 4h.01" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              3 mois de stress - Un avis négatif public
            </div>
          </div>

          <div className={`${styles.painSummary} ${styles.reveal}`}>
            <p>
              Chaque mauvais client coûte entre <strong>1 000 et 10 000 €</strong>.<br />
              En argent, en temps, en énergie. Parfois les trois.
            </p>
            <Link href="/app" className={styles.painSummaryCtaMain} data-track-cta="pain">
              Analyser gratuitement
            </Link>
          </div>
        </div>
      </section>

      {/* EXAMPLE - REPORT MOCKUP */}
      <section className={`${styles.section} ${styles.sectionAlt}`} id="example">
        <div className={styles.container}>
          <div className={styles.reveal}>
            <span className={styles.sectionLabel}>Exemple concret</span>
            <h2 className={styles.sectionTitle}>Voici à quoi ressemble un rapport ClientProof</h2>
            <p className={styles.sectionIntro}>Ce prospect semblait parfait. Le rapport a révélé autre chose.</p>
          </div>

          <div className={`${styles.reportMockup} ${styles.reveal}`}>
            <div className={styles.reportHeader}>
              <div className={styles.reportHeaderLeft}>
                <span className={styles.reportLogo}>
                  Client<span className={styles.reportLogoSpan}>Proof</span>
                </span>
                <span className={styles.reportHeaderSubtitle}>Rapport d&apos;analyse</span>
              </div>
              <span className={styles.reportTag}>HAUT RISQUE</span>
            </div>
            <div className={styles.reportBody}>
              <div className={styles.gaugeSection}>
                <div className={styles.gaugeWrap}>
                  <svg className={styles.gaugeSvg} viewBox="0 0 100 100">
                    <circle className={styles.gaugeBg} cx="50" cy="50" r="40" />
                    <circle className={styles.gaugeFill} cx="50" cy="50" r="40" id="gauge" />
                  </svg>
                  <div className={styles.gaugeNumber}>
                    78<small className={styles.gaugeNumberSmall}>/100</small>
                  </div>
                </div>
                <div className={styles.gaugeInfo}>
                  <h3>Prospect : &quot;Studio Digital Express&quot;</h3>
                  <p>Projet de refonte de site - Budget annoncé 5 000 € - Premier contact le 12/01</p>
                  <span className={styles.gaugeVerdict}>Signature déconseillée en l&apos;état</span>
                </div>
              </div>

              <div className={styles.reportCompare}>
                <div className={`${styles.compareCol} ${styles.compareColBad}`}>
                  <div className={`${styles.compareLabel} ${styles.compareLabelBad}`}>Ce que vous voyiez</div>
                  <ul className={styles.compareList}>
                    <li className={styles.compareListItem}>
                      <span className={`${styles.compareIcon} ${styles.compareIconBad}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M15 9l-6 6M9 9l6 6" />
                        </svg>
                      </span>
                      Prospect enthousiaste et réactif
                    </li>
                    <li className={styles.compareListItem}>
                      <span className={`${styles.compareIcon} ${styles.compareIconBad}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M15 9l-6 6M9 9l6 6" />
                        </svg>
                      </span>
                      &quot;On a un gros budget&quot;
                    </li>
                    <li className={styles.compareListItem}>
                      <span className={`${styles.compareIcon} ${styles.compareIconBad}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M15 9l-6 6M9 9l6 6" />
                        </svg>
                      </span>
                      Demande un devis vite
                    </li>
                  </ul>
                </div>
                <div className={`${styles.compareCol} ${styles.compareColGood}`}>
                  <div className={`${styles.compareLabel} ${styles.compareLabelGood}`}>Ce que ClientProof détecte</div>
                  <ul className={styles.compareList}>
                    <li className={styles.compareListItem}>
                      <span className={`${styles.compareIcon} ${styles.compareIconGood}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M9 12l2 2 4-4" />
                        </svg>
                      </span>
                      Scope vague, aucun livrable défini
                    </li>
                    <li className={styles.compareListItem}>
                      <span className={`${styles.compareIcon} ${styles.compareIconGood}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M9 12l2 2 4-4" />
                        </svg>
                      </span>
                      Pression temporelle artificielle
                    </li>
                    <li className={styles.compareListItem}>
                      <span className={`${styles.compareIcon} ${styles.compareIconGood}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M9 12l2 2 4-4" />
                        </svg>
                      </span>
                      3 prestataires en litige
                    </li>
                  </ul>
                </div>
              </div>

              <div className={styles.reportFlagsLabel}>Red flags détectés</div>
              <div className={styles.reportFlags}>
                <span className={`${styles.flagTag} ${styles.flagTagCritical}`}>Scope non défini</span>
                <span className={`${styles.flagTag} ${styles.flagTagCritical}`}>Historique de litiges</span>
                <span className={styles.flagTag}>Urgence injustifiée</span>
                <span className={styles.flagTag}>Refus de process</span>
                <span className={styles.flagTag}>Budget flou</span>
              </div>
            </div>
          </div>

          <div className={`${styles.ctaBlock} ${styles.reveal}`}>
            <Link href="/app" className={styles.ctaMain} data-track-cta="example">
              Obtenir ce type de rapport
            </Link>
            <span className={styles.ctaSub}>Pour votre propre prospect, pas un exemple fictif</span>
          </div>
        </div>
      </section>

      {/* DELIVERABLES */}
      <section className={styles.section} id="deliverables">
        <div className={styles.container}>
          <div className={styles.reveal}>
            <span className={styles.sectionLabel}>Ce que vous recevez</span>
            <h2 className={styles.sectionTitle}>Un rapport actionnable, pas un avis vague</h2>
            <p className={styles.sectionIntro}>Chaque recommandation est spécifique au prospect que vous analysez. Pas de généralités.</p>
          </div>

          <div className={styles.deliverableGrid}>
            <div className={`${styles.deliverableCard} ${styles.reveal}`}>
              <div className={styles.dIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3>Score de risque /100</h3>
              <p>Un chiffre clair pour décider : vert, orange ou rouge. Basé sur l&apos;analyse croisée de multiples signaux.</p>
            </div>
            <div className={`${styles.deliverableCard} ${styles.reveal} ${styles.revealDelay1}`}>
              <div className={styles.dIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <h3>Red flags identifiés</h3>
              <p>Chaque signal d&apos;alerte expliqué concrètement. Pourquoi c&apos;est un problème, ce que ça implique pour vous.</p>
            </div>
            <div className={`${styles.deliverableCard} ${styles.reveal}`}>
              <div className={styles.dIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
              <h3>Stratégie de réponse</h3>
              <p>Refuser ? Négocier ? Accepter sous conditions ? La marche à suivre adaptée à ce cas précis.</p>
            </div>
            <div className={`${styles.deliverableCard} ${styles.reveal} ${styles.revealDelay1}`}>
              <div className={styles.dIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                </svg>
              </div>
              <h3>Clauses à ajouter</h3>
              <p>Les clauses spécifiques à insérer dans votre devis ou contrat pour neutraliser les risques détectés.</p>
            </div>
            <div className={`${styles.deliverableCard} ${styles.reveal}`}>
              <div className={styles.dIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
              </div>
              <h3>Positionnement tarifaire</h3>
              <p>Faut-il ajuster votre prix pour compenser le risque ? On vous dit de combien et pourquoi.</p>
            </div>
            <div className={`${styles.deliverableCard} ${styles.reveal} ${styles.revealDelay1}`}>
              <div className={styles.dIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <h3>Message prêt à envoyer</h3>
              <p>Un modèle de réponse à copier-coller pour cadrer la relation dès le départ. Ferme et diplomate.</p>
            </div>
          </div>

          <div className={`${styles.ctaBlock} ${styles.reveal}`}>
            <Link href="/app" className={styles.ctaMain} data-track-cta="deliverables">
              Obtenir mon rapport
            </Link>
          </div>
        </div>
      </section>

      {/* CREDIBILITY / METHOD */}
      <section className={`${styles.section} ${styles.sectionAlt}`} id="method">
        <div className={styles.container}>
          <div className={styles.reveal}>
            <span className={styles.sectionLabel}>Notre méthode</span>
            <h2 className={styles.sectionTitle}>Comment fonctionne l&apos;analyse</h2>
            <p className={styles.sectionIntro}>
              Pas de boîte noire. L&apos;analyse repose sur des grilles éprouvées, issues de la négociation commerciale et de la gestion de conflits freelance.
            </p>
          </div>

          <div className={`${styles.methodTimeline} ${styles.reveal}`}>
            <div className={styles.methodStep}>
              <div className={styles.methodStepNum}>1</div>
              <h3>Vous décrivez votre prospect</h3>
              <p>Remplissez un formulaire avec ce que vous avez : échanges, brief, site web, comportement en appel, demandes reçues. 5 minutes suffisent.</p>
            </div>
            <div className={styles.methodStep}>
              <div className={styles.methodStepNum}>2</div>
              <h3>Analyse des schémas comportementaux</h3>
              <p>Nous croisons les signaux avec une base de profils à risque documentés : flou dans le brief, urgence injustifiée, refus de process, historique de litiges.</p>
            </div>
            <div className={styles.methodStep}>
              <div className={styles.methodStepNum}>3</div>
              <h3>Rapport sur mesure</h3>
              <p>Chaque recommandation est spécifique à votre situation, votre métier, et le profil du prospect analysé. Rien de générique.</p>
            </div>
            <div className={styles.methodStep}>
              <div className={styles.methodStepNum}>4</div>
              <h3>Livraison en moins de 24h</h3>
              <p>Vous recevez un document PDF clair et structuré. Des décisions à prendre, des actions à lancer. Pas de jargon.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className={styles.section} id="pricing">
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.pricingCenter}`}>
            <span className={styles.sectionLabel}>Tarif unique</span>
            <h2 className={styles.sectionTitle}>
              24 €, c&apos;est le prix d&apos;une décision éclairée.<br />Un mauvais client, c&apos;est un autre budget.
            </h2>
          </div>

          <div className={`${styles.reveal} ${styles.pricingCardWrap}`}>
            <div className={styles.pricingCard}>
              <div className={styles.pricingCardHeader}>
                <div className={styles.pricingOldPrice}>
                  Un mauvais client coûte généralement entre 500 € et 3 000 € de temps perdu.
                </div>
                <div className={styles.pricingAmount}>
                  24<small className={styles.pricingAmountSmall}>€</small>
                </div>
                <div className={styles.pricingPer}>par prospect analysé - paiement unique</div>
              </div>
              <div className={styles.pricingCardBody}>
                <ul className={styles.pricingFeatures}>
                  <li className={styles.pricingFeatureItem}>
                    <span className={styles.check}>✓</span> Score de risque détaillé sur 100
                  </li>
                  <li className={styles.pricingFeatureItem}>
                    <span className={styles.check}>✓</span> Red flags identifiés et expliqués
                  </li>
                  <li className={styles.pricingFeatureItem}>
                    <span className={styles.check}>✓</span> Stratégie de réponse personnalisée
                  </li>
                  <li className={styles.pricingFeatureItem}>
                    <span className={styles.check}>✓</span> Clauses contractuelles à ajouter
                  </li>
                  <li className={styles.pricingFeatureItem}>
                    <span className={styles.check}>✓</span> Ajustement tarifaire recommandé
                  </li>
                  <li className={styles.pricingFeatureItem}>
                    <span className={styles.check}>✓</span> Message prêt à copier-coller
                  </li>
                  <li className={styles.pricingFeatureItem}>
                    <span className={styles.check}>✓</span> Livré en PDF en moins de 24h
                  </li>
                </ul>
                <Link href="/app" className={`${styles.pricingBodyCtaMain} ${styles.ctaPulse}`} data-track-cta="pricing">
                  Analyser mon prospect
                  <span>→</span>
                </Link>
                <div className={styles.pricingGuarantee}>
                  Si l&apos;analyse ne vous aide pas à prendre une décision claire, nous vous remboursons.
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.pricingContext} ${styles.reveal}`}>
            <p>
              Vous ne payez pas un abonnement. Pas un outil de plus.<br />
              <strong>Vous payez une décision éclairée sur un prospect précis.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`${styles.section} ${styles.sectionAlt}`} id="faq">
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.pricingCenter}`}>
            <span className={styles.sectionLabel}>Questions fréquentes</span>
            <h2 className={styles.sectionTitle}>Vous hésitez ? C&apos;est normal.</h2>
          </div>

          <div className={styles.faqWrap}>
            <div className={`${styles.faqItem} ${styles.reveal}`}>
              <button className={styles.faqQ} type="button">
                Mes informations sont-elles confidentielles ?
                <svg className={styles.faqChevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div className={styles.faqA}>
                <div className={styles.faqAInner}>
                  Oui. Les données que vous transmettez sont utilisées uniquement pour générer votre rapport. Elles ne sont ni partagées, ni revendues, ni stockées après livraison. Jamais.
                </div>
              </div>
            </div>

            <div className={`${styles.faqItem} ${styles.reveal}`}>
              <button className={styles.faqQ} type="button">
                Et si l&apos;analyse dit que mon prospect est fiable ?
                <svg className={styles.faqChevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div className={styles.faqA}>
                <div className={styles.faqAInner}>
                  Tant mieux. Le rapport vous confirmera les bons signaux et vous donnera quand même des clauses de protection standard. Savoir qu&apos;un prospect est sûr, c&apos;est aussi de l&apos;information qui vaut 24 €.
                </div>
              </div>
            </div>

            <div className={`${styles.faqItem} ${styles.reveal}`}>
              <button className={styles.faqQ} type="button">
                Le rapport est-il fiable à 100% ?
                <svg className={styles.faqChevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div className={styles.faqA}>
                <div className={styles.faqAInner}>
                  Aucune analyse ne prédit l&apos;avenir avec certitude. ClientProof identifie des schémas de risque documentés et vous aide à prendre une décision informée. C&apos;est un outil d&apos;aide à la décision, pas une boule de cristal. Mais c&apos;est mieux que de signer les yeux fermés.
                </div>
              </div>
            </div>

            <div className={`${styles.faqItem} ${styles.reveal}`}>
              <button className={styles.faqQ} type="button">
                Quelles informations dois-je fournir ?
                <svg className={styles.faqChevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div className={styles.faqA}>
                <div className={styles.faqAInner}>
                  Tout ce que vous avez : captures d&apos;écrans de conversations, brief reçu, site web du prospect, notes d&apos;appel, mails échangés. Plus vous donnez de contexte, plus l&apos;analyse est précise. 5 minutes suffisent.
                </div>
              </div>
            </div>

            <div className={`${styles.faqItem} ${styles.reveal}`}>
              <button className={styles.faqQ} type="button">
                Et si le rapport ne m&apos;apporte rien ?
                <svg className={styles.faqChevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div className={styles.faqA}>
                <div className={styles.faqAInner}>
                  Vous êtes remboursé intégralement. Pas de conditions cachées, pas de formulaire à remplir. Un simple email suffit.
                </div>
              </div>
            </div>

            <div className={`${styles.faqItem} ${styles.reveal}`}>
              <button className={styles.faqQ} type="button">
                En combien de temps je reçois le rapport ?
                <svg className={styles.faqChevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div className={styles.faqA}>
                <div className={styles.faqAInner}>
                  L&apos;aperçu gratuit est instantané (30 secondes). Le rapport complet est disponible immédiatement après paiement.
                </div>
              </div>
            </div>

            <div className={`${styles.faqItem} ${styles.reveal}`}>
              <button className={styles.faqQ} type="button">
                Je suis en agence, pas freelance. C&apos;est utile ?
                <svg className={styles.faqChevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div className={styles.faqA}>
                <div className={styles.faqAInner}>
                  Oui. Les mêmes schémas s&apos;appliquent. Un client toxique coûte souvent encore plus cher en agence, parce qu&apos;il mobilise plusieurs personnes en même temps.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <div className={styles.reveal}>
            <h2 className={styles.finalCtaTitle}>
              Votre prochain prospect mérite<br />5 minutes de vérification.
            </h2>
            <p className={styles.finalCtaIntro}>
              Pas un abonnement. Pas un logiciel. Juste un rapport clair pour prendre la bonne décision avant de vous engager.
            </p>
            <Link href="/app" className={`${styles.finalCtaCtaMain} ${styles.ctaPulse}`} data-track-cta="final">
              Analyser mon prospect gratuitement
            </Link>
            <span className={styles.finalCtaSub}>Aperçu gratuit instantané - Rapport complet à 24 €</span>
            <div className={styles.finalCtaTrustRow}>
              <div className={styles.finalCtaTrustItem}>
                <span className={styles.finalCtaTrustIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </span>
                Confidentiel
              </div>
              <div className={styles.finalCtaTrustItem}>
                <span className={styles.finalCtaTrustIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </span>
                Garanti
              </div>
              <div className={styles.finalCtaTrustItem}>
                <span className={styles.finalCtaTrustIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </span>
                Livré en 24h
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE STICKY CTA */}
      <div className={styles.mobileCta} id="mobileCta">
        <Link href="/app" className={styles.mobileCtaLink}>
          Analyser mon prospect gratuitement
        </Link>
        <div className={styles.mobileSub}>Remboursé si non satisfait</div>
      </div>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p style={{ marginBottom: '8px' }}>
            <Link href="/" className={styles.footerLogo}>
              Client<span className={styles.footerLogoSpan}>Proof</span>
            </Link>
          </p>
          <p className={styles.footerLinks}>
            <a href="mailto:contact@clientproof.fr">Contact</a>
          </p>
          <p className={styles.footerCopy}>© {new Date().getFullYear()} ClientProof. Tous droits réservés.</p>
        </div>
      </footer>
    </>
  );
}
