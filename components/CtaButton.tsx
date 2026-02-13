"use client";

import { ReactNode } from "react";

interface CtaButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  pulse?: boolean;
  style?: React.CSSProperties;
}

export default function CtaButton({ children, href, onClick, pulse = false, style }: CtaButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    background: "var(--red)", color: "#fff", fontSize: 17, fontWeight: 700,
    padding: "18px 44px", borderRadius: 12, textDecoration: "none",
    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
    boxShadow: "0 4px 20px var(--red-glow)", border: "none", cursor: "pointer",
    position: "relative", letterSpacing: "-0.2px",
    animation: pulse ? "pulse-glow 2.5s ease-in-out infinite" : "none",
    ...style,
  };

  if (href) {
    return <a href={href} style={baseStyle}>{children}</a>;
  }
  return <button onClick={onClick} style={baseStyle}>{children}</button>;
}
