"use client";

import { auth } from "@/firebase/config";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push("/login");
      else setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "#080a10",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Inter', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500;600&display=swap');

        .prof-back-btn {
          width: 100%;
          background: rgba(237,232,224,0.95);
          color: #080a10;
          padding: 15px;
          border-radius: 14px;
          border: none;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.18s ease;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .prof-back-btn:hover {
          background: #fff;
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(0,0,0,0.4);
        }

        .prof-logout-btn {
          width: 100%;
          background: rgba(239,68,68,0.1);
          color: rgba(239,68,68,0.82);
          padding: 15px;
          border-radius: 14px;
          border: 1px solid rgba(239,68,68,0.2);
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .prof-logout-btn:hover {
          background: rgba(239,68,68,0.18);
          border-color: rgba(239,68,68,0.35);
          color: rgba(239,68,68,0.95);
        }
      `}</style>

      {/* Background glows */}
      <div style={{
        position: "absolute", top: -80, left: -80,
        width: 320, height: 320, borderRadius: "50%",
        background: "rgba(216,194,163,0.05)", filter: "blur(60px)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -80, right: -80,
        width: 280, height: 280, borderRadius: "50%",
        background: "rgba(100,150,255,0.04)", filter: "blur(60px)",
        pointerEvents: "none",
      }} />

      {user && (
        <div style={{
          position: "relative", zIndex: 10,
          width: "100%", maxWidth: 420,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: 28,
          padding: "40px 32px",
          textAlign: "center",
        }}>
          {/* Avatar */}
          <div style={{ position: "relative", display: "inline-block", marginBottom: 20 }}>
            <img
              src={user.photoURL || "https://via.placeholder.com/100"}
              alt="profile"
              style={{
                width: 96, height: 96, borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.1)",
                display: "block",
              }}
            />
            <div style={{
              position: "absolute", bottom: 2, right: 2,
              width: 14, height: 14, borderRadius: "50%",
              background: "#4ade80",
              border: "2px solid #080a10",
            }} />
          </div>

          {/* Name */}
          <h1 style={{
            fontSize: 28, fontWeight: 400,
            fontFamily: "'Lora', serif",
            color: "#fff", margin: "0 0 8px",
            letterSpacing: "-0.01em",
          }}>
            {user.displayName}
          </h1>

          {/* Email */}
          <p style={{
            fontSize: 14, color: "rgba(255,255,255,0.45)",
            fontFamily: "'Inter', sans-serif",
            margin: "0 0 8px", fontWeight: 300,
          }}>
            {user.email}
          </p>

          {/* UID */}
          <p style={{
            fontSize: 11, color: "rgba(255,255,255,0.22)",
            fontFamily: "'Inter', sans-serif",
            margin: "0 0 32px",
            wordBreak: "break-all",
          }}>
            UID: {user.uid}
          </p>

          {/* Stats row */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10, marginBottom: 28,
          }}>
            {[
              { label: "Worlds", value: "5" },
              { label: "Hours",  value: "∞" },
              { label: "Moods",  value: "4" },
            ].map((stat) => (
              <div key={stat.label} style={{
                padding: "12px 8px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}>
                <div style={{
                  fontSize: 18, fontWeight: 600,
                  color: "rgba(216,194,163,0.9)",
                  fontFamily: "'Inter', sans-serif",
                  marginBottom: 2,
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: 10, color: "rgba(255,255,255,0.3)",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="prof-back-btn" onClick={() => router.push("/home")}>
              ← Back to Home
            </button>
            <button className="prof-logout-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </main>
  );
}