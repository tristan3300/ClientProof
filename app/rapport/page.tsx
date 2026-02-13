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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        w.fbq('track', 'Purchase', { value: 1.00, currency: 'EUR' });
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
          const checkoutRes = await fetch('/api/create-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ analysisId }),
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
        w2.fbq('track', 'Purchase', { value: 9.00, currency: 'EUR' });
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

  /* ---------- copy handler ---------- */

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyLabel('Copié !');
      setTimeout(() => setCopyLabel('Copier'), 2000);
    });
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

          {/* ---- Header card ---- */}
          <div className={styles.reportHeaderCard}>
            <div className={styles.reportTopRow}>
              <span className={styles.reportLogo}>
                Client<span className={styles.reportLogoAccent}>Proof</span> — Rapport d&apos;analyse
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
            <div className={styles.reportSection}>
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
            <div className={styles.reportSection}>
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
            <div className={styles.reportSection}>
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
            <div className={styles.reportSection}>
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
            <div className={styles.reportSection}>
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
            <div className={styles.reportSection}>
              <div className={styles.sectionTitle}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                Message pr&ecirc;t &agrave; envoyer
              </div>
              <div className={styles.messageBlock}>
                <button className={styles.copyBtn} onClick={() => handleCopy(report.message || '')}>
                  {copyLabel}
                </button>
                <div>{report.message}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---- Footer ---- */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>&copy; 2025 ClientProof &middot; <a href="mailto:contact@clientproof.fr">contact@clientproof.fr</a></p>
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
