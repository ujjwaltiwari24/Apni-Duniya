interface Props {
  scene: any;
  active: boolean;
  onClick: () => void;
}

export default function SceneButton({ scene, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "11px 12px",
        borderRadius: 14,
        border: active
          ? "1px solid rgba(216,194,163,0.28)"
          : "1px solid rgba(255,255,255,0.06)",
        background: active
          ? "rgba(216,194,163,0.09)"
          : "rgba(255,255,255,0.025)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 10,
        textAlign: "left",
        transition: "all 0.18s",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.025)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.06)";
        }
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: active ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        {scene.emoji}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: active ? 600 : 400,
            color: active ? "rgba(216,194,163,0.95)" : "rgba(237,232,224,0.72)",
            fontFamily: "-apple-system,sans-serif",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginBottom: 2,
          }}
        >
          {scene.name}
        </div>
        <div
          style={{
            fontSize: 11,
            color: active ? "rgba(216,194,163,0.5)" : "rgba(237,232,224,0.3)",
            fontFamily: "-apple-system,sans-serif",
          }}
        >
          {scene.time} · {scene.mood}
        </div>
      </div>

      {/* Active indicator */}
      {active && (
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#4ade80",
            flexShrink: 0,
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(74,222,128,0.5); }
          70% { box-shadow: 0 0 0 5px rgba(74,222,128,0); }
        }
      `}</style>
    </button>
  );
}