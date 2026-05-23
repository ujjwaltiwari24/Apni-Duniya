"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "@/firebase/config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function LoginPage() {
  const router = useRouter();
  const rainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rainRef.current) return;
    const container = rainRef.current;
    for (let i = 0; i < 60; i++) {
      const drop = document.createElement("div");
      drop.style.cssText = `
        position: absolute;
        width: 1px;
        background: linear-gradient(to bottom, transparent, rgba(180,210,255,0.22));
        top: -100px;
        left: ${Math.random() * 100}%;
        height: ${Math.random() * 60 + 20}px;
        opacity: ${Math.random() * 0.4 + 0.1};
        animation: rainFall ${Math.random() * 1.5 + 0.8}s linear ${Math.random() * 3}s infinite;
      `;
      container.appendChild(drop);
    }
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          createdAt: serverTimestamp(),
        });
      }
      router.push("/home");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <>
      <style>{`
        @keyframes rainFall {
          to { transform: translateY(110vh); opacity: 0; }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(74,222,128,0.4); }
          50% { box-shadow: 0 0 0 5px rgba(74,222,128,0); }
        }
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .scene-item { transition: border-color 0.3s, background 0.3s; }
        .scene-item:hover { border-color: rgba(255,255,255,0.12) !important; }
        .feature-card { transition: border-color 0.3s, background 0.3s; }
        .feature-card:hover {
          border-color: rgba(200,160,100,0.2) !important;
          background: rgba(200,160,100,0.03) !important;
        }
        .cta-btn:hover {
          background: #ffffff !important;
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(232,226,217,0.15);
        }
        .cta-btn:active { transform: translateY(0); }
        .footer-link:hover { color: rgba(232,226,217,0.5) !important; }
      `}</style>

      <main
        style={{
          position: "relative",
          minHeight: "100vh",
          background: "#0a0d12",
          color: "#e8e2d9",
          fontFamily: "Georgia, 'Times New Roman', serif",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Rain */}
        <div
          ref={rainRef}
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: "hidden",
          }}
        />

        {/* Ambient glows */}
        <div
          style={{
            position: "fixed",
            width: 500,
            height: 500,
            top: -100,
            left: -100,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(180,130,80,0.08) 0%, transparent 70%)",
            animation: "breathe 6s ease-in-out infinite",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "fixed",
            width: 600,
            height: 600,
            bottom: -150,
            right: -150,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(80,120,200,0.07) 0%, transparent 70%)",
            animation: "breathe 8s ease-in-out infinite reverse",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Nav */}
        <nav
          style={{
            position: "relative",
            zIndex: 1,
            padding: "24px 48px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              fontSize: 20,
              letterSpacing: "0.02em",
              color: "#e8e2d9",
              fontWeight: 400,
            }}
          >
            Apni<span style={{ color: "rgba(200,160,100,0.9)" }}>Duniya</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 18px",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 100,
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              fontFamily: "-apple-system, sans-serif",
              letterSpacing: "0.02em",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#4ade80",
                animation: "livePulse 2s infinite",
                display: "inline-block",
              }}
            />
            Spaces are open
          </div>
        </nav>

        {/* Hero */}
        <section
          style={{
            position: "relative",
            zIndex: 1,
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 420px",
            gap: 64,
            alignItems: "center",
            padding: "64px 48px 48px",
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
          }}
        >
          {/* LEFT */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 20px",
                border: "1px solid rgba(200,160,100,0.2)",
                borderRadius: 100,
                fontSize: 13,
                color: "rgba(200,160,100,0.8)",
                fontFamily: "-apple-system, sans-serif",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 32,
                background: "rgba(200,160,100,0.04)",
              }}
            >
              ☕ &nbsp; your peaceful corner of the internet
            </div>

            <h1
              style={{
                fontSize: 68,
                lineHeight: 1.0,
                fontWeight: 400,
                letterSpacing: "-0.02em",
                marginBottom: 12,
              }}
            >
              Slow down.
              <br />
              <span
                style={{
                  color: "rgba(200,180,150,0.6)",
                  fontStyle: "italic",
                }}
              >
                Breathe again.
              </span>
            </h1>

            <p
              style={{
                fontSize: 18,
                color: "rgba(232,226,217,0.45)",
                fontFamily: "-apple-system, sans-serif",
                fontWeight: 300,
                marginBottom: 48,
                lineHeight: 1.7,
                maxWidth: 520,
              }}
            >
              Step into cinematic worlds — chai tapri in the rain, a misty
              countryside evening, a quiet café at midnight. Chill alone, focus
              deeply, or share the moment with someone you love.
            </p>

            {/* Features */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 48,
              }}
            >
              {[
                {
                  icon: "🌧️",
                  title: "Immersive Scenes",
                  desc: "Rainy tapri evenings, countryside sunsets, forest mornings — each world has layered ambient sound.",
                },
                {
                  icon: "💌",
                  title: "Secret Message Wall",
                  desc: "Leave a note for your partner while they're away. They'll find it waiting when they log in.",
                },
                {
                  icon: "🤝",
                  title: "Co-Presence Rooms",
                  desc: "Invite a friend or partner. Sit in the same world together, in comfortable virtual silence.",
                },
                {
                  icon: "🎵",
                  title: "Layered Ambience",
                  desc: "Mix rain, piano, café murmur, and distant thunder. Find your perfect focus sound.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="feature-card"
                  style={{
                    padding: 20,
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.02)",
                    cursor: "default",
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 10 }}>{f.icon}</div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "rgba(232,226,217,0.9)",
                      fontFamily: "-apple-system, sans-serif",
                      marginBottom: 6,
                    }}
                  >
                    {f.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(232,226,217,0.38)",
                      fontFamily: "-apple-system, sans-serif",
                      lineHeight: 1.6,
                    }}
                  >
                    {f.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 32 }}>
              {[
                { num: "6+", label: "Chill Worlds" },
                { num: "24/7", label: "Always Open" },
                { num: "∞", label: "Peaceful Hours" },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    style={{
                      fontSize: 28,
                      color: "rgba(232,226,217,0.85)",
                      letterSpacing: "-0.02em",
                      marginBottom: 4,
                    }}
                  >
                    {s.num}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(232,226,217,0.3)",
                      fontFamily: "-apple-system, sans-serif",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Login Card */}
          <div style={{ position: "relative" }}>
            {/* Floating secret message */}
            <div
              style={{
                position: "absolute",
                top: -20,
                right: -16,
                background: "rgba(15,20,30,0.95)",
                border: "1px solid rgba(200,160,100,0.2)",
                borderRadius: 14,
                padding: "12px 16px",
                fontFamily: "-apple-system, sans-serif",
                minWidth: 180,
                animation: "floatIn 0.6s ease-out",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(200,160,100,0.6)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 4,
                }}
              >
                Secret wall · for you
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(232,226,217,0.75)",
                  fontStyle: "italic",
                }}
              >
                "miss you, come sit with me here 🌧️"
              </div>
            </div>

            {/* Floating online count */}
            <div
              style={{
                position: "absolute",
                bottom: -18,
                left: -12,
                background: "rgba(15,20,30,0.95)",
                border: "1px solid rgba(100,140,200,0.2)",
                borderRadius: 14,
                padding: "10px 14px",
                fontFamily: "-apple-system, sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 10,
                animation: "floatIn 0.6s ease-out 0.3s both",
                zIndex: 2,
              }}
            >
              <div style={{ display: "flex" }}>
                {[
                  { bg: "#7c6fa0", letter: "A" },
                  { bg: "#4a7c6f", letter: "S" },
                  { bg: "#7c4a4a", letter: "R" },
                ].map((a, i) => (
                  <div
                    key={a.letter}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: a.bg,
                      border: "2px solid rgba(15,20,30,0.95)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      marginLeft: i === 0 ? 0 : -6,
                      fontFamily: "-apple-system, sans-serif",
                      fontWeight: 600,
                      color: "#fff",
                    }}
                  >
                    {a.letter}
                  </div>
                ))}
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: "rgba(232,226,217,0.45)",
                  fontFamily: "-apple-system, sans-serif",
                }}
              >
                <strong
                  style={{
                    color: "rgba(232,226,217,0.7)",
                    fontWeight: 500,
                  }}
                >
                  12 people
                </strong>{" "}
                chilling right now
              </span>
            </div>

            {/* Main card */}
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 28,
                padding: 36,
              }}
            >
              {/* Scene list */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}
              >
                {[
                  {
                    icon: "☕",
                    name: "Chai Tapri · Rainy Evening",
                    sub: "Rain · Street sounds · Warm light",
                    live: true,
                    active: true,
                  },
                  {
                    icon: "🌄",
                    name: "Countryside Sunset",
                    sub: "Wind · Crickets · Open sky",
                    live: true,
                    active: false,
                  },
                  {
                    icon: "🏡",
                    name: "Midnight Cabin",
                    sub: "Fireplace · Snowfall · Stillness",
                    live: false,
                    active: false,
                  },
                  {
                    icon: "🌿",
                    name: "Forest Morning",
                    sub: "Birds · Mist · Soft light",
                    live: false,
                    active: false,
                  },
                ].map((scene) => (
                  <div
                    key={scene.name}
                    className="scene-item"
                    style={{
                      padding: "14px 18px",
                      borderRadius: 14,
                      border: scene.active
                        ? "1px solid rgba(200,160,100,0.2)"
                        : "1px solid rgba(255,255,255,0.06)",
                      background: scene.active
                        ? "rgba(200,160,100,0.06)"
                        : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        style={{
                          fontSize: 20,
                          width: 36,
                          height: 36,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(255,255,255,0.04)",
                          borderRadius: 10,
                        }}
                      >
                        {scene.icon}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontFamily: "-apple-system, sans-serif",
                            color: "rgba(232,226,217,0.8)",
                            fontWeight: 500,
                            marginBottom: 2,
                          }}
                        >
                          {scene.name}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "rgba(232,226,217,0.3)",
                            fontFamily: "-apple-system, sans-serif",
                          }}
                        >
                          {scene.sub}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "-apple-system, sans-serif",
                        padding: "4px 10px",
                        borderRadius: 100,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        fontWeight: 500,
                        ...(scene.live
                          ? {
                              background: "rgba(74,222,128,0.12)",
                              color: "#4ade80",
                              border: "1px solid rgba(74,222,128,0.25)",
                            }
                          : {
                              background: "rgba(255,255,255,0.05)",
                              color: "rgba(232,226,217,0.3)",
                              border: "1px solid rgba(255,255,255,0.08)",
                            }),
                      }}
                    >
                      {scene.live ? "Live" : "Soon"}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  height: 1,
                  background: "rgba(255,255,255,0.06)",
                  margin: "24px 0",
                }}
              />

              <p
                style={{
                  fontSize: 15,
                  fontFamily: "-apple-system, sans-serif",
                  color: "rgba(232,226,217,0.6)",
                  textAlign: "center",
                  marginBottom: 16,
                  fontWeight: 400,
                }}
              >
                Your world is waiting inside
              </p>

              <button
                onClick={handleGoogleLogin}
                className="cta-btn"
                style={{
                  width: "100%",
                  padding: 16,
                  borderRadius: 14,
                  background: "#e8e2d9",
                  color: "#0a0d12",
                  fontSize: 16,
                  fontFamily: "-apple-system, sans-serif",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  marginBottom: 12,
                  transition: "all 0.25s",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8418H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.4673-.806 5.9564-2.1814l-2.9087-2.2581c-.8059.54-1.8368.859-3.0477.859-2.3441 0-4.3282-1.5836-5.036-3.7105H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.71c-.18-.54-.2822-1.1168-.2822-1.71s.1023-1.17.2823-1.71V4.9582H.9573C.3477 6.1732 0 7.5477 0 9s.3477 2.8268.9573 4.0418L3.964 10.71z" fill="#FBBC05"/>
                  <path d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4627.8918 11.4255 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.964 7.29C4.6718 5.1632 6.6559 3.5795 9 3.5795z" fill="#EA4335"/>
                </svg>
                Enter with Google
              </button>

              <p
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  fontFamily: "-apple-system, sans-serif",
                  color: "rgba(232,226,217,0.2)",
                  letterSpacing: "0.04em",
                  marginBottom: 12,
                }}
              >
                Your account is safe with us. We never share your data. By logging in, you agree to our Terms and Privacy Policy.
              </p>

              
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            position: "relative",
            zIndex: 1,
            padding: "24px 48px",
            borderTop: "1px solid rgba(255,255,255,0.04)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontFamily: "-apple-system, sans-serif",
              color: "rgba(232,226,217,0.2)",
            }}
          >
            ApniDuniya · Your peaceful corner
          </span>
          <div style={{ display: "flex", gap: 24 }}>
            {["About", "Privacy", "Contact"].map((l) => (
              <span
                key={l}
                className="footer-link"
                style={{
                  fontSize: 12,
                  fontFamily: "-apple-system, sans-serif",
                  color: "rgba(232,226,217,0.2)",
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
              >
                {l}
              </span>
            ))}
          </div>
        </footer>
      </main>
    </>
  );
}