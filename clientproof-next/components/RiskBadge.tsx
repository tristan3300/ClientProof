interface RiskBadgeProps {
  riskLevel: string;
}

export default function RiskBadge({ riskLevel }: RiskBadgeProps) {
  let style: React.CSSProperties = {};
  let icon = "";

  if (riskLevel === "Élevé") {
    style = { background: "var(--red-light)", color: "var(--red)", border: "1px solid rgba(220, 38, 38, 0.15)" };
    icon = "⚠️";
  } else if (riskLevel === "Moyen") {
    style = { background: "var(--orange-light)", color: "var(--orange)", border: "1px solid rgba(234, 88, 12, 0.15)" };
    icon = "⚡";
  } else {
    style = { background: "var(--green-light)", color: "var(--green)", border: "1px solid rgba(22, 163, 74, 0.15)" };
    icon = "✓";
  }

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      fontSize: 13, fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "0.5px", padding: "6px 16px", borderRadius: 8,
      ...style,
    }}>
      {icon} Risque {riskLevel}
    </span>
  );
}
