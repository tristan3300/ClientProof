'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ScoreCircle from '@/components/ScoreCircle';
import styles from './page.module.css';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface RedFlag {
  flag: string;
  severity: string;
  explanation: string;
}

interface GreenFlag {
  flag: string;
  explanation: string;
}

interface Pricing {
  advice: string;
  riskPremium: string;
}

interface Clause {
  title: string;
  content: string;
}

interface FullAnalysis {
  score: number;
  riskLevel: string;
  verdict: string;
  redFlags?: RedFlag[];
  greenFlags?: GreenFlag[];
  recommendations?: string[];
  clauses?: Clause[];
  pricing?: Pricing;
  message?: string;
}

interface FreeAnalysis {
  summary?: string;
}

interface ReportData {
  id: string;
  fullAnalysis: FullAnalysis;
  freeAnalysis?: FreeAnalysis;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/*  View state                                                         */
/* ------------------------------------------------------------------ */

type ViewState =
  | { kind: 'loading' }
  | { kind: 'error'; title: string; text: string }
  | { kind: 'processing' }
  | { kind: 'report'; data: ReportData };

/* ------------------------------------------------------------------ */
/*  Severity helper                                                    */
/* ------------------------------------------------------------------ */

function severityClass(severity: string): string {
  const s = severity.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (s === 'critique') return styles.severityCritique;
  if (s === 'modere' || s === 'moderate') return styles.severityModere;
  if (s === 'mineur') return styles.severityMineur;
  return styles.severityModere;
}

/* ------------------------------------------------------------------ */
/*  Score color helper                                                 */
/* ------------------------------------------------------------------ */

function scoreColor(riskLevel: string): string {
  if (riskLevel === 'Élevé') return '#dc2626';
  if (riskLevel === 'Moyen') return '#ea580c';
  return '#16a34a';
}

function riskTagClass(riskLevel: string): string {
  if (riskLevel === 'Élevé') return `${styles.riskTag} ${styles.riskTagHigh}`;
  if (riskLevel === 'Moyen') return `${styles.riskTag} ${styles.riskTagMedium}`;
  return `${styles.riskTag} ${styles.riskTagLow}`;
}

/* ------------------------------------------------------------------ */
/*  Loading component (Suspense fallback)                              */
/* ------------------------------------------------------------------ */

function Loading() {
  return (
    <>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          Client<span className={styles.logoAccent}>Proof</span>
        </Link>
      </nav>
      <div className={styles.stateScreen}>
        <div className={styles.stateCard}>
          <div className={styles.loader} />
          <h2>Chargement du rapport...</h2>
          <p>Votre analyse est en cours de chargement.</p>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main content (reads search params)                                 */
/* ------------------------------------------------------------------ */

function RapportContent() {
  const searchParams = useSearchParams();
  const analysisId = searchParams.get('id');
  const sessionId = searchParams.get('session_id');

  const [view, setView] = useState<ViewState>({ kind: 'loading' });
  const [copyLabel, setCopyLabel] = useState('Copier');
  const [isExporting, setIsExporting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  /* ---------- helpers ---------- */

  const showError = useCallback((title: string, text: string) => {
    setView({ kind: 'error', title, text });
  }, []);

  /* ---------- pollReport ---------- */

  const pollReport = useCallback(async () => {
    try {
      const res = await fetch(`/api/report/${analysisId}`);
      const data = await res.json();

      if (res.status === 202) {
        setView({ kind: 'processing' });
        timerRef.current = setTimeout(pollReport, 3000);
        return;
      }

      if (!res.ok) {
        showError(`Erreur (${res.status})`, data.error || 'Impossible de charger le rapport.');
        return;
      }

      setView({ kind: 'report', data });

      // Cleanup localStorage
      try { localStorage.removeItem('cp_analysis'); } catch { /* ignore */ }

      // Track conversion
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      if (typeof w.fbq === 'function') {
        w.fbq('track', 'Purchase', { value: 24.00, currency: 'EUR' });
      }
    } catch {
      // Network error - retry
      timerRef.current = setTimeout(pollReport, 3000);
    }
  }, [analysisId, showError]);

  /* ---------- verifyAndLoad ---------- */

  const verifyAndLoad = useCallback(async () => {
    try {
      // Recover conversation from localStorage
      let savedConversation = null;
      let savedFreeAnalysis = null;
      try {
        const saved = JSON.parse(localStorage.getItem('cp_analysis') || '{}');
        if (saved.id === analysisId) {
          savedConversation = saved.conversation;
          savedFreeAnalysis = saved.freeAnalysis;
        }
      } catch { /* ignore */ }

      // Verify payment
      const verifyRes = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          analysisId,
          conversation: savedConversation,
          freeAnalysis: savedFreeAnalysis,
        }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        showError(
          `Erreur (${verifyRes.status})`,
          verifyData.error || 'Impossible de vérifier le paiement.',
        );
        return;
      }

      // Poll for the generated report
      await pollReport();
    } catch (err) {
      showError('Erreur réseau', (err instanceof Error ? err.message : '') || 'Impossible de charger le rapport.');
    }
  }, [analysisId, sessionId, showError, pollReport]);

  /* ---------- loadReport ---------- */

  const loadReport = useCallback(async () => {
    try {
      const res = await fetch(`/api/report/${analysisId}`);
      const data = await res.json();

      if (res.status === 403 && data.error === 'not_paid') {
        // Redirect to payment
        try {
          const testSecret = new URLSearchParams(window.location.search).get('test') || undefined;
          const checkoutRes = await fetch('/api/create-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ analysisId, testSecret }),
          });
          const checkoutData = await checkoutRes.json();
          if (checkoutData.url) {
            window.location.href = checkoutData.url;
          } else {
            showError('Erreur', 'Impossible de créer la session de paiement.');
          }
        } catch {
          showError('Erreur', 'Impossible de créer la session de paiement.');
        }
        return;
      }

      if (res.status === 202) {
        setView({ kind: 'processing' });
        timerRef.current = setTimeout(loadReport, 5000);
        return;
      }

      if (!res.ok) {
        showError('Rapport introuvable', data.error || "Ce rapport n'existe pas.");
        return;
      }

      setView({ kind: 'report', data });

      // Track conversion
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w2 = window as any;
      if (typeof w2.fbq === 'function') {
        w2.fbq('track', 'Purchase', { value: 24.00, currency: 'EUR' });
      }
    } catch {
      showError('Erreur de chargement', 'Impossible de charger le rapport. Veuillez réessayer.');
    }
  }, [analysisId, showError]);

  /* ---------- effect: kick-off ---------- */

  useEffect(() => {
    if (!analysisId) {
      showError('Lien invalide', 'Aucun identifiant de rapport trouvé. Veuillez lancer une nouvelle analyse.');
      return;
    }

    if (sessionId) {
      verifyAndLoad();
    } else {
      loadReport();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [analysisId, sessionId, verifyAndLoad, loadReport, showError]);

  /* ---------- scroll reveal ---------- */

  useEffect(() => {
    if (view.kind !== 'report') return;

    const els = document.querySelectorAll(`.${styles.reveal}`);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.revealVisible);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [view.kind]);

  /* ---------- copy handler ---------- */

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyLabel('Copié !');
      setTimeout(() => setCopyLabel('Copier'), 2000);
    });
  };

  /* ---------- PDF download handler ---------- */

  const handleDownloadPdf = async () => {
    if (!reportRef.current || isExporting) return;
    setIsExporting(true);

    try {
      const html2pdf = (await import('html2pdf.js')).default;

      // Force all reveal elements to be visible (user may not have scrolled)
      const reveals = reportRef.current.querySelectorAll(`.${styles.reveal}`);
      reveals.forEach((el) => el.classList.add(styles.revealVisible));

      // Hide .noPrint elements
      const noPrintEls = reportRef.current.querySelectorAll(`.${styles.noPrint}`);
      noPrintEls.forEach((el) => ((el as HTMLElement).style.display = 'none'));

      const date = new Date().toISOString().slice(0, 10);
      await html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename: `ClientProof-Rapport-${date}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#f8fafc' },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'], avoid: [`.${styles.reportSection}`, `.${styles.reportHeaderCard}`] },
        })
        .from(reportRef.current)
        .save();

      // Restore .noPrint elements
      noPrintEls.forEach((el) => ((el as HTMLElement).style.display = ''));
    } catch {
      // Silently fail - user can retry
    } finally {
      setIsExporting(false);
    }
  };

  /* ---------- share handler ---------- */

  const handleShare = async () => {
    const shareData = {
      title: 'ClientProof - Analyse de prospect',
      text: 'J\'ai analysé mon prospect avec ClientProof. Essaie, c\'est ultra utile pour les freelances !',
      url: 'https://clientproof.fr',
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or API error - ignore
      }
    } else {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert('Lien copié dans le presse-papier !');
    }
  };

  /* ---------- render: loading ---------- */

  if (view.kind === 'loading') {
    return (
      <>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            Client<span className={styles.logoAccent}>Proof</span>
          </Link>
        </nav>
        <div className={styles.stateScreen}>
          <div className={styles.stateCard}>
            <div className={styles.loader} />
            <h2>Chargement du rapport...</h2>
            <p>Votre analyse est en cours de chargement.</p>
          </div>
        </div>
      </>
    );
  }

  /* ---------- render: error ---------- */

  if (view.kind === 'error') {
    return (
      <>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            Client<span className={styles.logoAccent}>Proof</span>
          </Link>
        </nav>
        <div className={styles.stateScreen}>
          <div className={styles.stateCard}>
            <h2>{view.title}</h2>
            <p>{view.text}</p>
            <Link href="/app" className={styles.errorLink}>
              Lancer une nouvelle analyse
            </Link>
          </div>
        </div>
      </>
    );
  }

  /* ---------- render: processing ---------- */

  if (view.kind === 'processing') {
    return (
      <>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            Client<span className={styles.logoAccent}>Proof</span>
          </Link>
        </nav>
        <div className={styles.stateScreen}>
          <div className={styles.stateCard}>
            <div className={styles.loader} />
            <h2>Rapport en cours de g&eacute;n&eacute;ration...</h2>
            <p>
              Votre rapport complet est en train d&apos;&ecirc;tre g&eacute;n&eacute;r&eacute;. Cette page se
              rafra&icirc;chira automatiquement.
            </p>
          </div>
        </div>
      </>
    );
  }

  /* ---------- render: report ---------- */

  const { fullAnalysis: report, freeAnalysis, createdAt } = view.data;
  const color = scoreColor(report.riskLevel);
  const dateStr = new Date(createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          Client<span className={styles.logoAccent}>Proof</span>
        </Link>
      </nav>

      <div className={styles.report}>
        <div className={styles.container}>

          {/* ---- Download bar (hors PDF) ---- */}
          <div className={styles.downloadBar}>
            <button
              className={styles.downloadBtn}
              onClick={handleDownloadPdf}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <span className={styles.downloadSpinner} />
                  Export en cours...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  T&eacute;l&eacute;charger en PDF
                </>
              )}
            </button>
          </div>

          {/* ---- PDF ZONE ---- */}
          <div ref={reportRef}>

            {/* ---- Header card ---- */}
            <div className={styles.reportHeaderCard}>
              <div className={styles.reportTopRow}>
                <span className={styles.reportLogo}>
                  Client<span className={styles.reportLogoAccent}>Proof</span> - Rapport d&apos;analyse
                </span>
                <span className={styles.reportDate}>{dateStr}</span>
              </div>
              <div className={styles.reportScoreRow}>
                <ScoreCircle
                  score={report.score}
                  size={100}
                  radius={36}
                  strokeWidth={7}
                  color={color}
                  bgStroke="rgba(255,255,255,0.1)"
                  animate
                />
                <div>
                  <span className={riskTagClass(report.riskLevel)}>
                    Risque {report.riskLevel}
                  </span>
                  <div className={styles.reportVerdict}>{report.verdict}</div>
                  {freeAnalysis?.summary && (
                    <div className={styles.reportVerdictSub}>{freeAnalysis.summary}</div>
                  )}
                </div>
              </div>
            </div>

            {/* ---- Red flags ---- */}
            {report.redFlags && report.redFlags.length > 0 && (
              <div className={`${styles.reportSection} ${styles.reveal} ${styles.pdfBreak}`}>
                <div className={styles.sectionTitle}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  Red flags d&eacute;tect&eacute;s
                </div>
                {report.redFlags.map((f, i) => (
                  <div className={styles.flagItem} key={i}>
                    <div className={styles.flagItemHeader}>
                      <span className={styles.flagName}>{f.flag}</span>
                      <span className={`${styles.severityTag} ${severityClass(f.severity)}`}>
                        {f.severity}
                      </span>
                    </div>
                    <p className={styles.flagExplanation}>{f.explanation}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ---- Green flags ---- */}
            {report.greenFlags && report.greenFlags.length > 0 && (
              <div className={`${styles.reportSection} ${styles.reveal} ${styles.revealDelay1} ${styles.pdfBreak}`}>
                <div className={styles.sectionTitleGreen}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  Signaux positifs
                </div>
                {report.greenFlags.map((f, i) => (
                  <div className={styles.greenItem} key={i}>
                    <span className={styles.greenDot} />
                    <div>
                      <strong>{f.flag}</strong>
                      <p>{f.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ---- Recommendations ---- */}
            {report.recommendations && report.recommendations.length > 0 && (
              <div className={`${styles.reportSection} ${styles.reveal} ${styles.pdfBreak}`}>
                <div className={styles.sectionTitle}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                  Recommandations
                </div>
                <ul className={styles.recoList}>
                  {report.recommendations.map((r, i) => (
                    <li className={styles.recoItem} key={i}>
                      <span className={styles.recoNum}>{i + 1}</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ---- Clauses ---- */}
            {report.clauses && report.clauses.length > 0 && (
              <div className={`${styles.reportSection} ${styles.reveal} ${styles.pdfBreak}`}>
                <div className={styles.sectionTitle}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                  </svg>
                  Clauses contractuelles &agrave; ajouter
                </div>
                {report.clauses.map((c, i) => (
                  <div className={styles.clauseItem} key={i}>
                    <div className={styles.clauseTitle}>{c.title}</div>
                    <div className={styles.clauseContent}>{c.content}</div>
                  </div>
                ))}
              </div>
            )}

            {/* ---- Pricing ---- */}
            {report.pricing && (
              <div className={`${styles.reportSection} ${styles.reveal} ${styles.pdfBreak}`}>
                <div className={styles.sectionTitle}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                  </svg>
                  Positionnement tarifaire
                </div>
                <p className={styles.pricingAdvice}>{report.pricing.advice}</p>
                <span className={styles.riskPremium}>
                  Prime de risque recommand&eacute;e : {report.pricing.riskPremium || 'N/A'}
                </span>
              </div>
            )}

            {/* ---- Message ---- */}
            {report.message && (
              <div className={`${styles.reportSection} ${styles.reveal} ${styles.pdfBreak}`}>
                <div className={styles.sectionTitle}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                  Message pr&ecirc;t &agrave; envoyer
                </div>
                <div className={styles.messageBlock}>
                  <button className={`${styles.copyBtn} ${styles.noPrint}`} onClick={() => handleCopy(report.message || '')}>
                    {copyLabel}
                  </button>
                  <div>{report.message}</div>
                </div>
              </div>
            )}

          </div>{/* end PDF ZONE */}

          {/* ---- Share section (hors PDF) ---- */}
          <div className={`${styles.shareSection} ${styles.reveal}`}>
            <p className={styles.shareText}>
              Ce rapport vous a aid&eacute; ? Partagez ClientProof avec un coll&egrave;gue freelance.
            </p>
            <div className={styles.shareButtons}>
              <button className={styles.shareBtn} onClick={handleShare}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Partager
              </button>
              <a
                className={styles.shareBtn}
                href="https://twitter.com/intent/tweet?text=Je%20viens%20d%27analyser%20mon%20prospect%20avec%20ClientProof%20%F0%9F%94%8D%20Ultra%20utile%20pour%20les%20freelances%20!&url=https%3A%2F%2Fclientproof.fr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Twitter / X
              </a>
              <a
                className={styles.shareBtn}
                href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fclientproof.fr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>

          {/* ---- CTA "Analyser un autre prospect" (hors PDF) ---- */}
          <div className={`${styles.ctaSection} ${styles.reveal}`}>
            <h2 className={styles.ctaTitle}>Un autre prospect en vue ?</h2>
            <p className={styles.ctaSubtitle}>
              Analysez vos prochains prospects en quelques minutes.
              <br />
              Prot&eacute;gez chaque mission, n&eacute;gociez en position de force.
            </p>
            <Link href="/app" className={styles.ctaButton}>
              Analyser un nouveau prospect
              <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </Link>
            <span className={styles.ctaSub}>Analyse compl&egrave;te &middot; R&eacute;sultat en 30 secondes</span>
          </div>

        </div>
      </div>

      {/* ---- Footer ---- */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>&copy; {new Date().getFullYear()} ClientProof &middot; <a href="mailto:contact@clientproof.fr">contact@clientproof.fr</a></p>
        </div>
      </footer>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Page (with Suspense boundary for useSearchParams)                  */
/* ------------------------------------------------------------------ */

export default function RapportPage() {
  return (
    <Suspense fallback={<Loading />}>
      <RapportContent />
    </Suspense>
  );
}
