"use client";

import { useEffect, useRef } from "react";

interface ScoreCircleProps {
  score: number;
  size?: number;
  radius?: number;
  strokeWidth?: number;
  color: string;
  bgStroke?: string;
  animate?: boolean;
}

export default function ScoreCircle({
  score,
  size = 100,
  radius = 36,
  strokeWidth = 6,
  color,
  bgStroke = "var(--border-light)",
  animate = true,
}: ScoreCircleProps) {
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const circleRef = useRef<SVGCircleElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate) return;

    const circle = circleRef.current;
    if (circle) {
      circle.style.strokeDashoffset = String(circumference);
      requestAnimationFrame(() => {
        circle.style.strokeDashoffset = String(offset);
      });
    }

    const el = numberRef.current;
    if (el) {
      const startTime = performance.now();
      const duration = 1200;
      function update(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(score * eased);
        if (el) el.innerHTML = `${current}<small style="font-size:13px;font-weight:500;color:var(--text-muted)">/100</small>`;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }
  }, [score, circumference, offset, animate]);

  const viewBox = `0 0 ${size} ${size}`;
  const center = size / 2;

  return (
    <div style={{ flexShrink: 0, width: size, height: size, position: "relative" }}>
      <svg width={size} height={size} viewBox={viewBox} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke={bgStroke} strokeWidth={strokeWidth} />
        <circle
          ref={circleRef}
          cx={center} cy={center} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animate ? circumference : offset}
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </svg>
      <div
        ref={numberRef}
        style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: size > 80 ? 28 : 22,
          fontWeight: 800, letterSpacing: "-1px", color,
        }}
      >
        {animate ? 0 : score}
        <small style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>/100</small>
      </div>
    </div>
  );
}
