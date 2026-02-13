interface BlurredTeaserProps {
  icon: string;
  title: string;
  preview: string;
}

export default function BlurredTeaser({ icon, title, preview }: BlurredTeaserProps) {
  return (
    <div style={{
      position: "relative", background: "var(--bg)", border: "1px solid var(--border-light)",
      borderRadius: 12, padding: "16px 20px", overflow: "hidden", cursor: "default",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginBottom: 8,
        fontSize: 14, fontWeight: 600, color: "var(--text)",
      }}>
        <span style={{
          width: 18, height: 18, background: "var(--red-light)", color: "var(--red)",
          borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, flexShrink: 0,
        }}>🔒</span>
        {icon} {title}
      </div>
      <div style={{
        fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5,
        filter: "blur(5px)", userSelect: "none", pointerEvents: "none",
      }}>
        {preview}
      </div>
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
        background: "linear-gradient(transparent, rgba(255, 255, 255, 0.95))",
        pointerEvents: "none",
      }} />
    </div>
  );
}
