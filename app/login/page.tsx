"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "@/firebase/config";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function LoginPage() {

  const router = useRouter();

  const rainRef =
    useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] =
    useState(false);

  useEffect(() => {

    const handleResize = () => {

      setIsMobile(
        window.innerWidth < 768
      );

    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );

  }, []);

  useEffect(() => {

    if (!rainRef.current) return;

    const container =
      rainRef.current;

    for (let i = 0; i < 60; i++) {

      const drop =
        document.createElement("div");

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

  const handleGoogleLogin =
    async () => {

      try {

        const result =
          await signInWithPopup(
            auth,
            googleProvider
          );

        const user =
          result.user;

        const userRef =
          doc(
            db,
            "users",
            user.uid
          );

        const userSnap =
          await getDoc(userRef);

        if (!userSnap.exists()) {

          await setDoc(userRef, {

            uid: user.uid,

            name:
              user.displayName,

            email:
              user.email,

            photo:
              user.photoURL,

            createdAt:
              serverTimestamp(),

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
          to {
            transform: translateY(110vh);
            opacity: 0;
          }
        }

        @keyframes breathe {
          0%,100% {
            transform: scale(1);
            opacity: 0.6;
          }

          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }

        @keyframes livePulse {

          0%,100% {
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(74,222,128,0.4);
          }

          50% {
            box-shadow: 0 0 0 5px rgba(74,222,128,0);
          }

        }

        .feature-card {
          transition: all 0.3s;
        }

        .feature-card:hover {
          border-color: rgba(200,160,100,0.2) !important;
          background: rgba(200,160,100,0.03) !important;
        }

        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(255,255,255,0.12);
        }

      `}</style>

      <main
        style={{
          position: "relative",
          minHeight: "100vh",
          background: "#0a0d12",
          color: "#e8e2d9",
          overflowX: "hidden",
          fontFamily:
            "Georgia, serif",
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

        {/* Glow */}
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
            animation:
              "breathe 6s ease-in-out infinite",
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
            animation:
              "breathe 8s ease-in-out infinite reverse",
          }}
        />

        {/* Navbar */}
        <nav
          style={{
            position: "relative",
            zIndex: 2,
            padding:
              isMobile
                ? "18px 20px"
                : "24px 48px",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            borderBottom:
              "1px solid rgba(255,255,255,0.05)",
          }}
        >

          <div
            style={{
              fontSize:
                isMobile
                  ? 18
                  : 20,
            }}
          >

            Apni
            <span
              style={{
                color:
                  "rgba(200,160,100,0.9)",
              }}
            >
              Duniya
            </span>

          </div>

          <div
            style={{
              display:
                isMobile
                  ? "none"
                  : "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 18px",
              border:
                "1px solid rgba(255,255,255,0.1)",
              borderRadius: 100,
              fontSize: 13,
              color:
                "rgba(255,255,255,0.5)",
            }}
          >

            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#4ade80",
                animation:
                  "livePulse 2s infinite",
              }}
            />

            Spaces are open

          </div>

        </nav>

        {/* Main */}
        <section
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns:
              isMobile
                ? "1fr"
                : "1fr 420px",
            gap:
              isMobile
                ? 40
                : 64,
            alignItems: "center",
            padding:
              isMobile
                ? "40px 20px"
                : "64px 48px",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >

          {/* LEFT */}
          <div>

            <div
              style={{
                display: "inline-flex",
                padding:
                  "10px 18px",
                border:
                  "1px solid rgba(200,160,100,0.2)",
                borderRadius: 999,
                fontSize: 12,
                marginBottom: 28,
                background:
                  "rgba(200,160,100,0.04)",
              }}
            >

              ☕ peaceful internet experience

            </div>

            <h1
              style={{
                fontSize:
                  isMobile
                    ? 42
                    : 68,
                lineHeight: 1,
                fontWeight: 400,
                marginBottom: 18,
              }}
            >

              Slow down.
              <br />

              <span
                style={{
                  color:
                    "rgba(200,180,150,0.6)",
                  fontStyle: "italic",
                }}
              >

                Breathe again.

              </span>

            </h1>

            <p
              style={{
                fontSize:
                  isMobile
                    ? 16
                    : 18,
                color:
                  "rgba(232,226,217,0.45)",
                lineHeight: 1.7,
                marginBottom: 40,
                maxWidth: 520,
                fontFamily:
                  "-apple-system, sans-serif",
              }}
            >

              Step into cinematic worlds —
              rainy chai tapris,
              countryside evenings,
              emotional ambience,
              peaceful late-night vibes,
              and immersive relaxing spaces.

            </p>

            {/* Features */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  isMobile
                    ? "1fr"
                    : "1fr 1fr",
                gap: 14,
              }}
            >

              {[
                {
                  icon: "🌧️",
                  title:
                    "Immersive Worlds",
                },

                {
                  icon: "🎵",
                  title:
                    "Layered Ambience",
                },

                {
                  icon: "🤝",
                  title:
                    "Shared Spaces",
                },

                {
                  icon: "💌",
                  title:
                    "Secret Messages",
                },

              ].map((item) => (

                <div
                  key={item.title}
                  className="feature-card"
                  style={{
                    padding: 20,
                    borderRadius: 18,
                    border:
                      "1px solid rgba(255,255,255,0.06)",
                    background:
                      "rgba(255,255,255,0.02)",
                  }}
                >

                  <div
                    style={{
                      fontSize: 24,
                      marginBottom: 10,
                    }}
                  >

                    {item.icon}

                  </div>

                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      marginBottom: 6,
                      fontFamily:
                        "-apple-system, sans-serif",
                    }}
                  >

                    {item.title}

                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color:
                        "rgba(232,226,217,0.38)",
                      lineHeight: 1.6,
                      fontFamily:
                        "-apple-system, sans-serif",
                    }}
                  >

                    Cozy emotional experiences
                    designed for relaxation.

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* RIGHT */}
          <div
            style={{
              position: "relative",
              width: "100%",
            }}
          >

            {/* Floating Card */}
            {
              !isMobile && (

                <div
                  style={{
                    position: "absolute",
                    top: -18,
                    right: -12,
                    zIndex: 2,
                    background:
                      "rgba(15,20,30,0.95)",
                    border:
                      "1px solid rgba(200,160,100,0.2)",
                    borderRadius: 16,
                    padding: "12px 16px",
                  }}
                >

                  <div
                    style={{
                      fontSize: 11,
                      color:
                        "rgba(200,160,100,0.7)",
                      marginBottom: 5,
                    }}
                  >

                    Secret Wall

                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color:
                        "rgba(232,226,217,0.7)",
                      fontStyle: "italic",
                    }}
                  >

                    "miss you 🌧️"

                  </div>

                </div>

              )
            }

            {/* Main Card */}
            <div
              style={{
                background:
                  "rgba(255,255,255,0.03)",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                borderRadius: 28,
                padding:
                  isMobile
                    ? 22
                    : 36,
                backdropFilter:
                  "blur(20px)",
              }}
            >

              {/* Worlds */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginBottom: 30,
                }}
              >

                {[
                  {
                    icon: "☕",
                    name:
                      "Rainy Evening",
                    live: true,
                  },

                  {
                    icon: "🌄",
                    name:
                      "Countryside Sunset",
                    live: false,
                  },

                  {
                    icon: "🏡",
                    name:
                      "Midnight Cabin",
                    live: false,
                  },

                ].map((scene) => (

                  <div
                    key={scene.name}
                    style={{
                      padding:
                        "16px 18px",
                      borderRadius: 16,
                      border:
                        scene.live
                          ? "1px solid rgba(200,160,100,0.18)"
                          : "1px solid rgba(255,255,255,0.06)",
                      background:
                        scene.live
                          ? "rgba(200,160,100,0.05)"
                          : "rgba(255,255,255,0.02)",
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "space-between",
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        alignItems:
                          "center",
                        gap: 12,
                      }}
                    >

                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          background:
                            "rgba(255,255,255,0.04)",
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          fontSize: 20,
                        }}
                      >

                        {scene.icon}

                      </div>

                      <div>

                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            marginBottom: 4,
                            fontFamily:
                              "-apple-system, sans-serif",
                          }}
                        >

                          {scene.name}

                        </div>

                        <div
                          style={{
                            fontSize: 12,
                            color:
                              "rgba(232,226,217,0.35)",
                            fontFamily:
                              "-apple-system, sans-serif",
                          }}
                        >

                          Cozy immersive ambience

                        </div>

                      </div>

                    </div>

                    <span
                      style={{
                        fontSize: 10,
                        padding:
                          "5px 10px",
                        borderRadius: 999,
                        background:
                          scene.live
                            ? "rgba(74,222,128,0.12)"
                            : "rgba(255,255,255,0.05)",
                        color:
                          scene.live
                            ? "#4ade80"
                            : "rgba(232,226,217,0.35)",
                        border:
                          scene.live
                            ? "1px solid rgba(74,222,128,0.2)"
                            : "1px solid rgba(255,255,255,0.06)",
                      }}
                    >

                      {scene.live
                        ? "LIVE"
                        : "SOON"}

                    </span>

                  </div>

                ))}

              </div>

              {/* CTA */}
              <button
                onClick={
                  handleGoogleLogin
                }
                className="cta-btn"
                style={{
                  width: "100%",
                  padding: 18,
                  borderRadius: 16,
                  border: "none",
                  background:
                    "#e8e2d9",
                  color: "#0a0d12",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition:
                    "all 0.25s",
                }}
              >

                Enter ApniDuniya ✨

              </button>

              <p
                style={{
                  marginTop: 14,
                  textAlign: "center",
                  fontSize: 12,
                  color:
                    "rgba(232,226,217,0.2)",
                  lineHeight: 1.6,
                  fontFamily:
                    "-apple-system, sans-serif",
                }}
              >

                Relax • Escape • Feel Better

              </p>

            </div>

          </div>

        </section>

      </main>
    </>
  );

}