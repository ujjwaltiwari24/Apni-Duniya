"use client";

import { User } from "firebase/auth";

interface Props {
  user: User;
  onClick: () => void;
}

export default function ProfileCard({ user, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.03)",
        cursor: "pointer",
        transition: "all 0.18s",
        marginBottom: 8,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)";
      }}
    >
      <img
        src={user.photoURL || "https://via.placeholder.com/40"}
        alt="profile"
        style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0 }}
      />
      <div style={{ textAlign: "left", minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "rgba(237,232,224,0.88)",
            fontFamily: "-apple-system,sans-serif",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user.displayName}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "rgba(237,232,224,0.35)",
            fontFamily: "-apple-system,sans-serif",
          }}
        >
          View Profile →
        </div>
      </div>
    </button>
  );
}