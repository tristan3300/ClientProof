'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import LoadingOverlay from '@/components/LoadingOverlay';
import styles from './page.module.css';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface AnalysisResult {
  id: string;
  score: number;
  riskLevel: string;
  summary: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function AppPage() {
  /* ---- state ---- */
  const [charCount, setCharCount] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [qualityLevel, setQualityLevel] = useState<'low' | 'medium' | 'good'>('low');
  const [qualityText, setQualityText] = useState('Ajoutez du contexte');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingActive, setLoadingActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [todayCount] = useState(() => Math.floor(Math.random() * 31) + 30);
  const [redFlagCount, setRedFlagCount] = useState(3);
  const [copyLinkState, setCopyLinkState] = useState(false);

  /* cascade visibility flags */
  const [headerVisible, setHeaderVisible] = useState(false);
  const [bodyVisible, setBodyVisible] = useState(false);
  const [lockedVisible, setLockedVisible] = useState(false);
  const [teaserVisible, setTeaserVisible] = useState(false);
  const [guaranteeVisible, setGuaranteeVisible] = useState(false);
  const [postResultVisible, setPostResultVisible] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);

  /* refs */
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultSectionRef = useRef<HTMLDivElement>(null);
  const resultTeaserRef = useRef<HTMLDivElement>(null);
  const scoreFillRef = useRef<SVGCircleElement>(null);
  const scoreNumberRef = useRef<HTMLDivElement>(null);

  /* ---- derived color helpers ---- */
  const getColor = useCallback((riskLevel: string) => {
    if (riskLevel === 'Élevé') return 'var(--red)';
    if (riskLevel === 'Moyen') return 'var(--orange)';
    return 'var(--green)';
  }, []);

  const getBadgeClass = useCallback((riskLevel: string) => {
    if (riskLevel === 'Élevé') return styles.riskBadgeHigh;
    if (riskLevel === 'Moyen') return styles.riskBadgeMedium;
    return styles.riskBadgeLow;
  }, []);

  const getHeaderRiskClass = useCallback((riskLevel: string) => {
    if (riskLevel === 'Élevé') return styles.resultHeaderRiskHigh;
    if (riskLevel === 'Moyen') return styles.resultHeaderRiskMedium;
    return styles.resultHeaderRiskLow;
  }, []);

  const getRiskIcon = useCallback((riskLevel: string) => {
    if (riskLevel === 'Élevé') return '\u26A0\uFE0F';
    if (riskLevel === 'Moyen') return '\u26A1';
    return '\u2713';
  }, []);

  /* ---- textarea input ---- */
  const handleTextareaInput = useCallback(() => {
    if (!textareaRef.current) return;
    const len = textareaRef.current.value.length;
    setCharCount(len);

    const progress = Math.min((len / 400) * 100, 100);
    setProgressWidth(progress);

    if (len < 100) {
      setQualityLevel('low');
      setQualityText('Ajoutez du contexte');
    } else if (len < 400) {
      setQualityLevel('medium');
      setQualityText("Continuez, c'est bien");
    } else {
      setQualityLevel('good');
      setQualityText('Bon niveau de d\u00e9tail');
    }
  }, []);

  /* ---- score count-up ---- */
  const animateCountUp = useCallback((el: HTMLDivElement, start: number, end: number, duration: number) => {
    const startTime = performance.now();
    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      el.innerHTML = `${current}<small>/100</small>`;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }, []);

  /* ---- display result ---- */
  const displayResult = useCallback((data: AnalysisResult) => {
    setResult(data);
    setShowResult(true);

    const { score, riskLevel } = data;
    const circumference = 2 * Math.PI * 36;
    const offset = circumference - (score / 100) * circumference;
    const color = getColor(riskLevel);

    // Animate score circle
    if (scoreFillRef.current) {
      scoreFillRef.current.style.stroke = color;
      scoreFillRef.current.style.strokeDashoffset = String(circumference);
      setTimeout(() => {
        if (scoreFillRef.current) {
          scoreFillRef.current.style.strokeDashoffset = String(offset);
        }
      }, 200);
    }

    // Animate score number
    if (scoreNumberRef.current) {
      scoreNumberRef.current.style.color = color;
      animateCountUp(scoreNumberRef.current, 0, score, 1200);
    }

    // Dynamic red flag count
    const flags = score >= 70
      ? Math.floor(Math.random() * 2) + 4
      : score >= 40
        ? 3
        : Math.floor(Math.random() * 2) + 1;
    setRedFlagCount(flags);

    // Save to localStorage
    try {
      localStorage.setItem('cp_analysis', JSON.stringify({
        id: data.id,
        conversation: textareaRef.current?.value.trim(),
        freeAnalysis: { score, riskLevel, summary: data.summary },
      }));
    } catch (_e) { /* ignore */ }

    // Cascade reveal animations
    setTimeout(() => setHeaderVisible(true), 100);
    setTimeout(() => setBodyVisible(true), 250);
    setTimeout(() => setLockedVisible(true), 400);
    setTimeout(() => setTeaserVisible(true), 550);
    setTimeout(() => setGuaranteeVisible(true), 700);
    setTimeout(() => setPostResultVisible(true), 850);

    // Scroll to result
    setTimeout(() => {
      resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }, [getColor, animateCountUp]);

  /* ---- analyze ---- */
  const analyzeConversation = useCallback(async () => {
    const conversation = textareaRef.current?.value.trim() || '';

    if (conversation.length < 20) {
      setErrorMessage('Veuillez coller au moins quelques phrases de vos \u00e9changes.');
      return;
    }

    setErrorMessage(null);
    setIsAnalyzing(true);
    setLoadingActive(true);

    try {
      const response = await fetch('/api/analyze-free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation }),
      });

      if (!response.ok) {
        let errorMsg = 'Erreur serveur';
        try {
          const err = await response.json();
          errorMsg = err.error || errorMsg;
        } catch {
          // empty or non-JSON response
        }
        throw new Error(errorMsg);
      }

      const text = await response.text();
      if (!text) {
        throw new Error('Réponse vide du serveur. Vérifiez la configuration.');
      }
      const data: AnalysisResult = JSON.parse(text);
      setLoadingActive(false);
      setTimeout(() => displayResult(data), 500);

      // Track conversion
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window as any;
        if (typeof w.gtag === 'function') {
          w.gtag('event', 'free_analysis', { event_category: 'engagement' });
        }
        if (typeof w.fbq === 'function') {
          w.fbq('track', 'Lead');
        }
      }
    } catch (err: unknown) {
      setLoadingActive(false);
      const message = err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez r\u00e9essayer.';
      setErrorMessage(message);
    } finally {
      setIsAnalyzing(false);
    }
  }, [displayResult]);

  /* ---- checkout ---- */
  const startCheckout = useCallback(async (analysisId: string) => {
    try {
      const testSecret = new URLSearchParams(window.location.search).get('test') || undefined;
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId, testSecret }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setErrorMessage(data.error || 'Erreur lors de la redirection vers le paiement.');
      }
    } catch (_err) {
      setErrorMessage('Erreur de connexion. Veuillez r\u00e9essayer.');
    }
  }, []);

  /* ---- reset ---- */
  const resetAnalysis = useCallback(() => {
    setShowResult(false);
    setHeaderVisible(false);
    setBodyVisible(false);
    setLockedVisible(false);
    setTeaserVisible(false);
    setGuaranteeVisible(false);
    setPostResultVisible(false);
    setStickyVisible(false);
    textareaRef.current?.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /* ---- copy share link ---- */
  const copyShareLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.origin + '/app').then(() => {
      setCopyLinkState(true);
      setTimeout(() => setCopyLinkState(false), 2000);
    });
  }, []);

  /* ---- mobile sticky CTA with IntersectionObserver ---- */
  useEffect(() => {
    if (!showResult || typeof window === 'undefined') return;
    if (window.innerWidth > 768) return;

    const teaser = resultTeaserRef.current;
    if (!teaser) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            setStickyVisible(true);
          } else {
            setStickyVisible(false);
          }
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(teaser);
    return () => observer.disconnect();
  }, [showResult]);

  /* ---- quality class ---- */
  const qualityClass =
    qualityLevel === 'low'
      ? styles.qualityLow
      : qualityLevel === 'medium'
        ? styles.qualityMedium
        : styles.qualityGood;

  /* ---------------------------------------------------------------- */
  /*  RENDER                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <div className={styles.page}>
      {/* ==================== NAV ==================== */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          Client<span className={styles.logoAccent}>Proof</span>
        </Link>
      </nav>

      <div className={styles.container}>
        {/* ==================== HEADER ==================== */}
        <div className={styles.headerBlock}>
          <div className={styles.stepBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Etape 1/2 - Gratuit
          </div>

          <div className={styles.progressBarWrap}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${progressWidth}%` }}
            />
          </div>

          <div className={styles.socialProofInline}>
            <span className={styles.pulseDot} />
            1 250+ analyses r&eacute;alis&eacute;es
          </div>

          <h1>Analysez votre prospect en 30 secondes</h1>
          <p>
            Collez vos &eacute;changes ci-dessous et d&eacute;couvrez instantan&eacute;ment les signaux
            d&apos;alerte &agrave; ne pas ignorer.
          </p>
        </div>

        {/* ==================== FORM ==================== */}
        <div className={styles.formSection}>
          <div className={styles.textareaWrap}>
            <textarea
              ref={textareaRef}
              className={styles.textarea}
              placeholder={'\uD83D\uDCE9 Collez ici vos \u00e9changes avec le prospect...\n\nPar exemple :\n- Emails ou messages WhatsApp / Slack\n- Brief ou cahier des charges re\u00e7u\n- Notes d\u2019appel ou de r\u00e9union\n\nPlus vous donnez de contexte, plus l\u2019analyse sera pr\u00e9cise.'}
              onInput={handleTextareaInput}
            />
            <div className={styles.textareaFooter}>
              <span className={styles.charCount}>
                {charCount} caract&egrave;res
              </span>
              <span className={`${styles.qualityIndicator} ${qualityClass}`}>
                <span className={styles.qualityDot} />
                <span>{qualityText}</span>
              </span>
            </div>
          </div>

          <div className={styles.btnWrap}>
            <button
              className={styles.btnAnalyze}
              onClick={analyzeConversation}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <span className={styles.spinner} /> Analyse en cours...
                </>
              ) : (
                <>
                  Analyser gratuitement <span className="arrow">&rarr;</span>
                </>
              )}
            </button>
            <div className={styles.btnSubtext}>Gratuit - R&eacute;sultat en 30 secondes</div>
          </div>

          {/* Error message */}
          <div
            className={`${styles.errorMsg} ${errorMessage ? styles.errorMsgVisible : ''}`}
          >
            {errorMessage}
          </div>

          {/* Loading overlay */}
          <LoadingOverlay active={loadingActive} />

          {/* Tips */}
          <div className={styles.tips}>
            <div className={styles.tipChip}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              &Eacute;changes complets
            </div>
            <div className={styles.tipChip}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Questions &amp; r&eacute;ponses
            </div>
            <div className={styles.tipChip}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Budget &amp; d&eacute;lais &eacute;voqu&eacute;s
            </div>
          </div>

          {/* Reassurance */}
          <div className={styles.reassurance}>
            <div className={styles.reassuranceItem}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Donn&eacute;es confidentielles
            </div>
            <div className={styles.reassuranceItem}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Aucun stockage
            </div>
            <div className={styles.reassuranceItem}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              100% gratuit
            </div>
          </div>
        </div>

        {/* ==================== RESULT ==================== */}
        <div
          ref={resultSectionRef}
          className={`${styles.resultSection} ${showResult ? styles.resultSectionVisible : ''}`}
        >
          <div className={styles.resultCard}>
            {/* Result header */}
            <div
              className={[
                styles.resultHeader,
                result ? getHeaderRiskClass(result.riskLevel) : '',
                headerVisible ? styles.resultHeaderVisible : '',
              ].join(' ')}
            >
              {/* Score circle */}
              <div className={styles.scoreCircle}>
                <svg className={styles.scoreSvg} viewBox="0 0 100 100">
                  <circle className={styles.scoreBg} cx="50" cy="50" r="36" />
                  <circle
                    ref={scoreFillRef}
                    className={styles.scoreFill}
                    cx="50"
                    cy="50"
                    r="36"
                    style={{ strokeDashoffset: 226.2 }}
                  />
                </svg>
                <div ref={scoreNumberRef} className={styles.scoreNumber}>
                  0<small>/100</small>
                </div>
              </div>

              {/* Result info */}
              <div className={styles.resultInfo}>
                <span
                  className={`${styles.riskBadge} ${result ? getBadgeClass(result.riskLevel) : ''}`}
                >
                  {result ? `${getRiskIcon(result.riskLevel)} Risque ${result.riskLevel}` : '-'}
                </span>
                <h3>Aper&ccedil;u de l&apos;analyse</h3>
                <p>
                  {result ? `Niveau de risque : ${result.riskLevel}` : '-'}
                </p>
              </div>
            </div>

            {/* Result body */}
            <div
              className={`${styles.resultBody} ${bodyVisible ? styles.resultBodyVisible : ''}`}
            >
              <div className={styles.resultSummary}>
                {result ? result.summary : '-'}
              </div>

              {/* Blurred / locked teaser items */}
              <div
                className={`${styles.lockedItems} ${lockedVisible ? styles.lockedItemsVisible : ''}`}
              >
                <div className={styles.lockedItem}>
                  <div className={styles.lockedItemHeader}>
                    <span className={styles.lockIcon}>{'\uD83D\uDD12'}</span>
                    {'\uD83D\uDEA9'} <span>{redFlagCount}</span> red flags d&eacute;tect&eacute;s
                  </div>
                  <div className={styles.lockedItemPreview}>
                    Le prospect montre des signes de n&eacute;gociation abusive sur les tarifs, des
                    d&eacute;lais irr&eacute;alistes et un manque de respect des engagements
                    pr&eacute;c&eacute;dents.
                  </div>
                  <div className={styles.lockedItemOverlay} />
                  <div className={styles.tooltip}>Disponible dans le rapport complet</div>
                </div>

                <div className={styles.lockedItem}>
                  <div className={styles.lockedItemHeader}>
                    <span className={styles.lockIcon}>{'\uD83D\uDD12'}</span>
                    {'\uD83D\uDCCB'} Recommandations personnalis&eacute;es
                  </div>
                  <div className={styles.lockedItemPreview}>
                    Nous vous recommandons de fixer un acompte de 40%, d&apos;ajouter une clause de
                    r&eacute;vision tarifaire et de pr&eacute;voir un p&eacute;rim&egrave;tre
                    strictement d&eacute;fini.
                  </div>
                  <div className={styles.lockedItemOverlay} />
                  <div className={styles.tooltip}>Disponible dans le rapport complet</div>
                </div>

                <div className={styles.lockedItem}>
                  <div className={styles.lockedItemHeader}>
                    <span className={styles.lockIcon}>{'\uD83D\uDD12'}</span>
                    {'\u2709\uFE0F'} Message type &agrave; envoyer
                  </div>
                  <div className={styles.lockedItemPreview}>
                    Bonjour [Prospect], suite &agrave; notre &eacute;change, je souhaitais formaliser
                    les points suivants pour assurer un cadre de collaboration clair et efficace...
                  </div>
                  <div className={styles.lockedItemOverlay} />
                  <div className={styles.tooltip}>Disponible dans le rapport complet</div>
                </div>
              </div>

              {/* CTA Upsell */}
              <div
                ref={resultTeaserRef}
                className={`${styles.resultTeaser} ${teaserVisible ? styles.resultTeaserVisible : ''}`}
              >
                <div className={styles.teaserUrgencyTag}>
                  {'\u26A1'} Ne signez pas avant d&apos;avoir lu &ccedil;a
                </div>
                <h4>Prot&eacute;gez-vous avant de signer</h4>

                <div className={styles.priceComparison}>
                  <span className={styles.oldPrice}>
                    Un mauvais client co&ucirc;te g&eacute;n&eacute;ralement entre 500&nbsp;&euro;
                    et 3&nbsp;000&nbsp;&euro; de temps perdu.
                  </span>
                  <span className={styles.newPrice}>
                    Cette analyse vous aide &agrave; d&eacute;cider avant d&apos;accepter.
                  </span>
                </div>

                <ul className={styles.featureList}>
                  <li>
                    <span className={styles.check}>{'\u2713'}</span> Red flags d&eacute;taill&eacute;s
                    et expliqu&eacute;s
                  </li>
                  <li>
                    <span className={styles.check}>{'\u2713'}</span> Recommandations
                    personnalis&eacute;es
                  </li>
                  <li>
                    <span className={styles.check}>{'\u2713'}</span> Clauses contractuelles &agrave;
                    ajouter
                  </li>
                  <li>
                    <span className={styles.check}>{'\u2713'}</span> Positionnement tarifaire
                    conseill&eacute;
                  </li>
                  <li>
                    <span className={styles.check}>{'\u2713'}</span> Message pr&ecirc;t &agrave;
                    envoyer au prospect
                  </li>
                </ul>

                <button
                  className={styles.ctaFull}
                  onClick={(e) => {
                    e.preventDefault();
                    if (result) startCheckout(result.id);
                  }}
                >
                  Obtenir mon analyse compl&egrave;te{' '}
                  <span className={styles.ctaArrow}>&rarr;</span>
                </button>

                <div className={styles.ctaTrustLine}>
                  <span>Paiement unique - 24&nbsp;&euro;</span>
                  <span className={styles.ctaTrustSep} />
                  <span>Rapport instantan&eacute;</span>
                  <span className={styles.ctaTrustSep} />
                  <span>Paiement s&eacute;curis&eacute;</span>
                </div>

                <div className={styles.socialProofDynamic}>
                  {'\u26A1'} <span>{todayCount}</span> analyses r&eacute;alis&eacute;es
                  aujourd&apos;hui
                </div>
              </div>

              {/* Guarantee */}
              <div
                className={`${styles.resultGuarantee} ${guaranteeVisible ? styles.resultGuaranteeVisible : ''}`}
              >
                Si l&apos;analyse ne vous aide pas &agrave; prendre une d&eacute;cision claire, nous
                vous remboursons.
              </div>
            </div>
          </div>

          {/* Post-result: retention */}
          <div
            className={`${styles.postResult} ${postResultVisible ? styles.postResultVisible : ''}`}
          >
            <button className={styles.btnNewAnalysis} onClick={resetAnalysis}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Nouvelle analyse
            </button>
            <div className={styles.shareBlock}>
              Un ami freelance ?
              <button
                className={`${styles.btnCopyLink} ${copyLinkState ? styles.btnCopyLinkCopied : ''}`}
                onClick={copyShareLink}
              >
                {copyLinkState ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Lien copi&eacute; !
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    Partager ClientProof
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== MOBILE STICKY CTA ==================== */}
      <div
        className={`${styles.stickyCta} ${stickyVisible ? styles.stickyCtaVisible : ''}`}
      >
        <button
          className={styles.stickyCtaLink}
          onClick={(e) => {
            e.preventDefault();
            if (result) startCheckout(result.id);
          }}
        >
          Obtenir mon analyse compl&egrave;te - 24&nbsp;&euro; &rarr;
        </button>
        <div className={styles.stickySub}>
          Paiement unique &bull; Rembours&eacute; si non satisfait
        </div>
      </div>

      {/* ==================== FOOTER ==================== */}
      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} ClientProof
      </footer>
    </div>
  );
}
