"use client";

import { useEffect, useRef, useState } from "react";

interface LoadingOverlayProps {
  active: boolean;
}

const steps = [
  "Analyse des échanges...",
  "Détection des signaux...",
  "Calcul du score de risque...",
];

export default function LoadingOverlay({ active }: LoadingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [doneSteps, setDoneSteps] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (active) {
      setCurrentStep(1);
      setDoneSteps([]);
      let step = 1;
      intervalRef.current = setInterval(() => {
        setDoneSteps((prev) => [...prev, step - 1]);
        step++;
        if (step <= steps.length) {
          setCurrentStep(step);
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, 2000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDoneSteps([0, 1, 2]);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [active]);

  if (!active && doneSteps.length === 0) return null;

  return (
    <div style={{
      marginTop: 24, padding: "28px 24px", background: "var(--bg)",
      border: "2px solid var(--border)", borderRadius: 16, textAlign: "center",
      display: active ? "block" : "none",
    }}>
      <div style={{
        width: 40, height: 40, border: "3px solid var(--border-light)",
        borderTopColor: "var(--red)", borderRadius: "50%",
        animation: "spin 0.8s linear infinite", margin: "0 auto 20px",
      }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
        {steps.map((text, i) => {
          const isDone = doneSteps.includes(i);
          const isActive = currentStep === i + 1 && !isDone;
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 500,
              color: isDone ? "var(--green)" : isActive ? "var(--text)" : "var(--text-muted)",
              animation: isActive ? "loading-step-in 0.4s ease-out" : "none",
            }}>
              <span style={{
                width: 20, height: 20, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, flexShrink: 0,
                ...(isDone
                  ? { background: "var(--green-light)", color: "var(--green)", fontWeight: 800 }
                  : isActive
                    ? { border: "2px solid var(--red)", background: "var(--red-light)", color: "var(--red)" }
                    : { border: "2px solid var(--border)" }),
              }}>
                {isDone ? "✓" : isActive ? "..." : ""}
              </span>
              {text}
            </div>
          );
        })}
      </div>
    </div>
  );
}
