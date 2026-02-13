'use client';

import { useEffect } from 'react';
import styles from '../app/page.module.css';

export default function LandingInteractions() {
  useEffect(() => {
    // =================== MOBILE CTA SCROLL ===================
    const mobileCta = document.getElementById('mobileCta');

    const handleScroll = () => {
      // Mobile CTA appears after scrolling past hero
      if (mobileCta && window.innerWidth <= 768) {
        const y = window.scrollY;
        if (y > 600) {
          mobileCta.classList.add(styles.mobileCtaVisible);
        } else {
          mobileCta.classList.remove(styles.mobileCtaVisible);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // =================== SCROLL REVEAL ===================
    const revealElements = document.querySelectorAll(`.${styles.reveal}`);
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.revealVisible);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    // =================== GAUGE ANIMATION ===================
    const gauge = document.getElementById('gauge');
    let gaugeObserver: IntersectionObserver | null = null;
    if (gauge) {
      gaugeObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add(styles.gaugeFillAnimated);
              gaugeObserver?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      gaugeObserver.observe(gauge);
    }

    // =================== FAQ ACCORDION ===================
    const faqButtons = document.querySelectorAll(`.${styles.faqQ}`);
    const handleFaqClick = (e: Event) => {
      const btn = e.currentTarget as HTMLElement;
      const item = btn.parentElement;
      if (!item) return;

      const wasOpen = item.classList.contains(styles.faqItemOpen);

      // Close all
      document.querySelectorAll(`.${styles.faqItemOpen}`).forEach((el) => {
        el.classList.remove(styles.faqItemOpen);
        const answer = el.querySelector(`.${styles.faqA}`);
        if (answer) answer.classList.remove(styles.faqAOpen);
        const chevron = el.querySelector(`.${styles.faqChevron}`);
        if (chevron) chevron.classList.remove(styles.faqChevronOpen);
      });

      // Toggle clicked
      if (!wasOpen) {
        item.classList.add(styles.faqItemOpen);
        const answer = item.querySelector(`.${styles.faqA}`);
        if (answer) answer.classList.add(styles.faqAOpen);
        const chevron = item.querySelector(`.${styles.faqChevron}`);
        if (chevron) chevron.classList.add(styles.faqChevronOpen);
      }
    };

    faqButtons.forEach((btn) => {
      btn.addEventListener('click', handleFaqClick);
    });

    // =================== CLEANUP ===================
    return () => {
      window.removeEventListener('scroll', handleScroll);
      revealObserver.disconnect();
      if (gaugeObserver) gaugeObserver.disconnect();
      faqButtons.forEach((btn) => {
        btn.removeEventListener('click', handleFaqClick);
      });
    };
  }, []);

  return null;
}
