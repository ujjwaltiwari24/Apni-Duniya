"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import SecretWall from "@/components/SecretWall";
import MobileApp from "@/components/MobileApp";
import SceneView from "@/components/SceneView";
import { scenes } from "@/data/scenes";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";

type SceneType = (typeof scenes)[0];

/* ══════════════════════════════════════
   FULLSCREEN HELPERS
══════════════════════════════════════ */
async function goFullscreenLandscape(el: Element) {
  try {
    if (el.requestFullscreen) await el.requestFullscreen();
    else if ((el as any).webkitRequestFullscreen) await (el as any).webkitRequestFullscreen();
    else if ((el as any).mozRequestFullScreen) await (el as any).mozRequestFullScreen();
  } catch (e) {
    console.warn("Fullscreen failed:", e);
  }
  try {
    const so = (screen as any).orientation;
    if (so?.lock) await so.lock("landscape");
    else if ((screen as any).lockOrientation) (screen as any).lockOrientation("landscape-primary");
  } catch (e) {
    console.warn("Orientation lock failed:", e);
  }
}

async function exitFullscreenSafe() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if ((document as any).webkitFullscreenElement) await (document as any).webkitExitFullscreen();
  } catch (_) {}
  try {
    (screen as any).orientation?.unlock?.();
  } catch (_) {}
}

/* ══════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════ */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    :root {
      --bg: #07060400;
      --sidebar-bg: #0a0806;
      --panel: rgba(255,235,185,0.032);
      --border: rgba(255,210,130,0.07);
      --border-warm: rgba(220,170,90,0.18);
      --border-hi: rgba(210,160,75,0.42);
      --text: rgba(255,248,230,0.92);
      --text-secondary: rgba(255,235,195,0.5);
      --text-muted: rgba(255,225,175,0.32);
      --accent: #c8904a;
      --accent-soft: #dba86a;
      --accent-glow: rgba(200,144,74,0.16);
      --green: #5ecb80;
      --serif: 'Playfair Display', Georgia, serif;
      --sans: 'Inter', system-ui, sans-serif;
    }

    html, body {
      background: #07060a;
      font-family: var(--sans);
      color: var(--text);
      overscroll-behavior: none;
      height: 100%;
    }

    .grain::before {
      content: '';
      position: fixed;
      inset: 0;
      z-index: 9997;
      pointer-events: none;
      opacity: 0.016;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
      background-size: 180px 180px;
    }

    ::-webkit-scrollbar {
      width: 2px;
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(200,144,74,0.2);
      border-radius: 2px;
    }

    @keyframes fadeSlideUp {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes livePulse {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(94,203,128,0.6);
      }
      60% {
        box-shadow: 0 0 0 5px rgba(94,203,128,0);
      }
    }

    @keyframes bar {
      0%, 100% {
        transform: scaleY(0.22);
      }
      50% {
        transform: scaleY(1);
      }
    }

    @keyframes cinemaIn {
      from {
        opacity: 0;
        transform: scale(1.025);
        filter: brightness(0.6);
      }
      to {
        opacity: 1;
        transform: scale(1);
        filter: brightness(1);
      }
    }

    @keyframes overlayUp {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes shimmer {
      0% {
        background-position: -200% center;
      }
      100% {
        background-position: 200% center;
      }
    }

    .enter-animation {
      animation: fadeSlideUp 0.5s cubic-bezier(0.22, 0.68, 0, 1.1) both;
    }

    .stagger-1 {
      animation-delay: 0.05s;
    }
    .stagger-2 {
      animation-delay: 0.12s;
    }
    .stagger-3 {
      animation-delay: 0.2s;
    }

    .scene-row {
      transition: background 0.18s ease, transform 0.14s ease;
      cursor: pointer;
    }

    .scene-row:hover {
      background: rgba(255, 235, 185, 0.048) !important;
    }

    .scene-row:active {
      transform: scale(0.988);
    }

    .btn-gold {
      transition: box-shadow 0.22s ease, transform 0.14s ease, filter 0.22s ease;
    }

    .btn-gold:hover:not(:disabled) {
      filter: brightness(1.08);
      box-shadow: 0 6px 32px rgba(200, 144, 74, 0.45) !important;
    }

    .btn-gold:active:not(:disabled) {
      transform: scale(0.97);
    }

    .btn-ghost {
      transition: background 0.18s ease, transform 0.14s ease;
    }

    .btn-ghost:hover {
      background: rgba(255, 245, 215, 0.1) !important;
    }

    .btn-ghost:active {
      transform: scale(0.95);
    }

    .cinema-root {
      animation: cinemaIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .cinema-overlay {
      animation: overlayUp 0.45s 0.25s ease both;
    }

    .cinema-controls {
      transition: opacity 0.5s ease;
    }

    .brand-shimmer {
      background: linear-gradient(
        90deg,
        rgba(255, 248, 230, 0.92) 0%,
        rgba(220, 170, 90, 1) 40%,
        rgba(255, 248, 230, 0.92) 80%
      );
      background-size: 200% auto;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmer 4s linear infinite;
    }

    .section-label {
      font-size: 9px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--text-muted);
      font-weight: 500;
      font-family: var(--sans);
    }

    .sidebar-scroll {
      scrollbar-width: thin;
      scrollbar-color: rgba(200, 144, 74, 0.2) transparent;
    }

    .sidebar-scroll::-webkit-scrollbar {
      width: 4px;
    }

    .sidebar-scroll::-webkit-scrollbar-track {
      background: transparent;
    }

    .sidebar-scroll::-webkit-scrollbar-thumb {
      background: rgba(200, 144, 74, 0.2);
      border-radius: 2px;
    }

    .sidebar-scroll::-webkit-scrollbar-thumb:hover {
      background: rgba(200, 144, 74, 0.35);
    }
  `}</style>
);

/* ══════════════════════════════════════
   MICRO COMPONENTS
══════════════════════════════════════ */
const LiveBadge = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <div
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "var(--green)",
        animation: "livePulse 2.4s ease infinite",
        flexShrink: 0,
      }}
    />
    <span
      style={{
        fontFamily: "var(--sans)",
        fontSize: 9,
        color: "var(--green)",
        letterSpacing: "0.2em",
        fontWeight: 500,
      }}
    >
      LIVE
    </span>
  </div>
);

const BarViz = () => (
  <div style={{ display: "flex", gap: 2.5, alignItems: "flex-end", height: 12 }}>
    {[0, 0.18, 0.36, 0.12].map((d, i) => (
      <div
        key={i}
        style={{
          width: 2,
          height: "100%",
          borderRadius: 1.5,
          background: "var(--accent-soft)",
          transformOrigin: "bottom",
          animation: `bar 0.8s ${d}s ease-in-out infinite`,
          opacity: 0.75,
        }}
      />
    ))}
  </div>
);

const Tag = ({ children }: { children: string }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 11px",
      borderRadius: 999,
      background: "rgba(255,235,185,0.07)",
      border: "1px solid rgba(220,170,90,0.14)",
      fontSize: 10.5,
      color: "rgba(255,235,190,0.55)",
      letterSpacing: "0.09em",
      fontWeight: 400,
      whiteSpace: "nowrap",
      flexShrink: 0,
      fontFamily: "var(--sans)",
    }}
  >
    {children}
  </span>
);

/* ══════════════════════════════════════
   MAIN APP
══════════════════════════════════════ */
export default function HomePage() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const immersiveRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [immersiveMode, setImmersiveMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentScene, setCurrentScene] = useState<SceneType>(scenes[0]);
  const [user, setUser] = useState<any>(null);
  const [isEntering, setIsEntering] = useState(false);
  const [showCtrl, setShowCtrl] = useState(true);
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState("");

  // Memoized sidebar filtered scenes
  const filteredSidebarScenes = useMemo(() => {
    if (!sidebarSearchQuery) return scenes;
    return scenes.filter(
      (s) =>
        s.name.toLowerCase().includes(sidebarSearchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(sidebarSearchQuery.toLowerCase())
    );
  }, [sidebarSearchQuery]);

  // Controls auto-hide in cinema
  const bumpCtrl = useCallback(() => {
    setShowCtrl(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowCtrl(false), 3800);
  }, []);

  useEffect(() => {
    if (immersiveMode) bumpCtrl();
    else {
      setShowCtrl(true);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [immersiveMode, bumpCtrl]);

  // Auth
  useEffect(() => {
    const u = onAuthStateChanged(auth, (u) => setUser(u));
    return () => u();
  }, []);

  // Responsive detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    const handler = () => check();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // ESC exit for immersive mode
  useEffect(() => {
    const h = () => {
      if (
        !document.fullscreenElement &&
        !(document as any).webkitFullscreenElement &&
        immersiveMode
      ) {
        setImmersiveMode(false);
        try {
          (screen as any).orientation?.unlock?.();
        } catch (_) {}
      }
    };
    document.addEventListener("fullscreenchange", h);
    document.addEventListener("webkitfullscreenchange", h);
    return () => {
      document.removeEventListener("fullscreenchange", h);
      document.removeEventListener("webkitfullscreenchange", h);
    };
  }, [immersiveMode]);

  const enterFullscreen = useCallback(async () => {
    setIsEntering(true);
    try {
      await new Promise((r) => setTimeout(r, 90));
      await goFullscreenLandscape(immersiveRef.current ?? document.documentElement);
      setImmersiveMode(true);
    } catch (e) {
      console.warn(e);
      setImmersiveMode(true);
    } finally {
      setIsEntering(false);
    }
  }, []);

  const exitImmersion = useCallback(async () => {
    await exitFullscreenSafe();
    setImmersiveMode(false);
  }, []);

  /* ══════════════════════════════════════
     CINEMA/FULLSCREEN MODE
  ══════════════════════════════════════ */
  if (immersiveMode)
    return (
      <>
        <GlobalStyles />
        <div
          ref={immersiveRef}
          className="cinema-root grain"
          onClick={bumpCtrl}
          onMouseMove={bumpCtrl}
          onTouchStart={bumpCtrl}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "#000",
            overflow: "hidden",
            cursor: showCtrl ? "default" : "none",
          }}
        >
          <video
            autoPlay
            loop
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          >
            <source src={currentScene.video} type="video/mp4" />
          </video>

          {/* Perimeter vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse 80% 75% at 50% 50%, transparent 35%, rgba(3,2,1,0.62) 100%)",
            }}
          />

          {/* Bottom fade */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "linear-gradient(to top, rgba(3,2,1,0.78) 0%, transparent 45%)",
            }}
          />

          {/* Controls */}
          <div
            className="cinema-overlay cinema-controls"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "0 36px 32px",
              opacity: showCtrl ? 1 : 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 32,
                    marginBottom: 10,
                    lineHeight: 1,
                  }}
                >
                  {currentScene.emoji}
                </div>
                <h1
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: "clamp(32px, 4.8vw, 60px)",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.05,
                    color: "rgba(255,250,235,0.97)",
                    textShadow: "0 2px 24px rgba(0,0,0,0.45)",
                    margin: "0 0 14px",
                  }}
                >
                  {currentScene.name}
                </h1>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Tag>{currentScene.time}</Tag>
                  <Tag>{currentScene.mood}</Tag>
                  <BarViz />
                </div>
              </div>

              <button
                className="btn-ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  exitImmersion();
                }}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,245,215,0.14)",
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  color: "rgba(255,248,230,0.82)",
                  fontSize: 15,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginLeft: 20,
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {!showCtrl && (
            <p
              style={{
                position: "absolute",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: 9.5,
                color: "rgba(255,255,255,0.14)",
                letterSpacing: "0.14em",
                pointerEvents: "none",
                fontFamily: "var(--sans)",
              }}
            >
              touch to reveal
            </p>
          )}
        </div>
      </>
    );

  /* ══════════════════════════════════════
     MOBILE APP
  ══════════════════════════════════════ */
  if (isMobile)
    return (
      <>
        <GlobalStyles />
        <MobileApp
          scenes={scenes}
          currentScene={currentScene}
          setCurrentScene={setCurrentScene}
          enterFullscreen={enterFullscreen}
          user={user}
        />
      </>
    );

  /* ══════════════════════════════════════
     DESKTOP LAYOUT
  ══════════════════════════════════════ */
  return (
    <>
      <GlobalStyles />

      <div
        className="grain"
        style={{
          display: "flex",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          position: "relative",
          background: "#07060a",
          backgroundImage: [
            "radial-gradient(ellipse 70% 55% at 100% 0%, rgba(140,80,15,0.13) 0%, transparent 55%)",
            "radial-gradient(ellipse 50% 70% at 100% 100%, rgba(90,50,8,0.09) 0%, transparent 50%)",
            "radial-gradient(ellipse 30% 40% at 0% 100%, rgba(60,40,10,0.06) 0%, transparent 50%)",
          ].join(","),
        }}
      >
        {/* ─────────────────────────────────────
            SIDEBAR
        ───────────────────────────────────── */}
        <aside
          style={{
            width: 320,
            flexShrink: 0,
            background: "linear-gradient(180deg, rgba(255,235,180,0.022) 0%, transparent 30%)",
            borderRight: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Top amber line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              zIndex: 2,
              background:
                "linear-gradient(90deg, transparent, rgba(200,144,74,0.3) 50%, transparent)",
            }}
          />

          {/* ── Brand header ── */}
          <div
            style={{
              padding: "26px 22px 20px",
              borderBottom: "1px solid var(--border)",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h1
                  className="brand-shimmer enter-animation"
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: 26,
                    fontWeight: 500,
                    lineHeight: 1,
                    marginBottom: 5,
                  }}
                >
                  Apni Duniya
                </h1>
                <p
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: 10,
                    color: "var(--text-muted)",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    fontWeight: 400,
                  }}
                >
                  Emotional Escape Worlds
                </p>
              </div>
              <LiveBadge />
            </div>

            {/* Current scene preview */}
            <div
              className="enter-animation stagger-2"
              style={{
                marginTop: 18,
                padding: "11px 13px",
                borderRadius: 14,
                background: "rgba(255,235,185,0.04)",
                border: "1px solid var(--border-warm)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>{currentScene.emoji}</span>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "rgba(255,248,230,0.9)",
                    lineHeight: 1.2,
                    marginBottom: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {currentScene.name}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--text-secondary)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {currentScene.time} · {currentScene.mood}
                </div>
              </div>
              <BarViz />
            </div>

            {/* Search bar */}
            <div
              style={{
                marginTop: 14,
                position: "relative",
              }}
            >
              <input
                type="text"
                placeholder="Search worlds..."
                value={sidebarSearchQuery}
                onChange={(e) => setSidebarSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "rgba(255,235,185,0.04)",
                  color: "var(--text)",
                  fontSize: 12,
                  fontFamily: "var(--sans)",
                  outline: "none",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1px solid var(--border-hi)";
                  e.currentTarget.style.background = "rgba(255,235,185,0.08)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1px solid var(--border)";
                  e.currentTarget.style.background = "rgba(255,235,185,0.04)";
                }}
              />
            </div>
          </div>

          {/* ── Scene list ── */}
          <div
            className="sidebar-scroll"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px 0",
            }}
          >
            <div
              className="section-label enter-animation stagger-2"
              style={{ padding: "0 22px 10px" }}
            >
              Worlds ({filteredSidebarScenes.length})
            </div>
            {filteredSidebarScenes.map((scene, i) => {
              const active = currentScene.id === scene.id;
              return (
                <div
                  key={scene.id}
                  className="scene-row enter-animation"
                  style={{
                    animationDelay: `${0.06 + (i % 10) * 0.04}s`,
                    padding: "10px 22px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: active ? "rgba(200,144,74,0.07)" : "transparent",
                    borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
                    position: "relative",
                  }}
                  onClick={() => setCurrentScene(scene)}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 11,
                      flexShrink: 0,
                      background: active
                        ? "rgba(200,144,74,0.12)"
                        : "rgba(255,235,185,0.05)",
                      border: `1px solid ${
                        active ? "rgba(200,144,74,0.28)" : "var(--border)"
                      }`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      transition: "all 0.18s ease",
                    }}
                  >
                    {scene.emoji}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "var(--serif)",
                        fontSize: 13.5,
                        fontWeight: 500,
                        color: active
                          ? "rgba(255,248,230,0.96)"
                          : "rgba(255,240,210,0.72)",
                        marginBottom: 2,
                        lineHeight: 1.2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        transition: "color 0.18s ease",
                      }}
                    >
                      {scene.name}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--text-muted)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {scene.time} · {scene.mood}
                    </div>
                  </div>

                  {active && (
                    <div
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "var(--accent)",
                        flexShrink: 0,
                        boxShadow: "0 0 6px rgba(200,144,74,0.7)",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Sidebar footer ── */}
          {user && (
            <div
              style={{
                padding: "14px 22px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, rgba(200,144,74,0.3), rgba(200,144,74,0.08))",
                  border: "1px solid var(--border-warm)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  color: "var(--accent)",
                  fontFamily: "var(--serif)",
                }}
              >
                {user.displayName?.[0] ?? user.email?.[0] ?? "✦"}
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,240,210,0.75)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.displayName ?? user.email}
                </div>
                <div
                  style={{
                    fontSize: 9.5,
                    color: "var(--text-muted)",
                    letterSpacing: "0.06em",
                  }}
                >
                  Signed in
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* ─────────────────────────────────────
            SCENE CANVAS
        ───────────────────────────────────── */}
        <div
          ref={sceneRef}
          style={{ flex: 1, position: "relative", overflow: "hidden" }}
        >
          <SceneView
            currentScene={currentScene}
            enterFullscreen={enterFullscreen}
            sceneRef={sceneRef}
            immersiveMode={immersiveMode}
            exitImmersion={exitImmersion}
            isMobile={false}
          />

          {/* Bottom gradient */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 220,
              background:
                "linear-gradient(to top, rgba(4,3,2,0.72) 0%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 5,
            }}
          />

          {/* Scene identity — bottom left */}
          <div
            className="enter-animation"
            style={{
              position: "absolute",
              left: 28,
              right: 380,
              bottom: 28,
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                fontSize: 28,
                marginBottom: 8,
                lineHeight: 1,
                filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.55))",
              }}
            >
              {currentScene.emoji}
            </div>

            <h2
              style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(22px, 2.2vw, 38px)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: "rgba(255,250,235,0.97)",
                textShadow: "0 3px 28px rgba(0,0,0,0.6)",
                margin: "0 0 12px",
                wordBreak: "break-word",
              }}
            >
              {currentScene.name}
            </h2>

            <div
              style={{
                display: "inline-flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                flexWrap: "nowrap",
              }}
            >
              <Tag>{currentScene.time}</Tag>
              <Tag>{currentScene.mood}</Tag>
              <LiveBadge />
            </div>
          </div>

          {/* SecretWall — bottom right */}
          <div
            className="enter-animation stagger-3"
            style={{
              position: "absolute",
              right: 20,
              bottom: 20,
              width: 340,
              zIndex: 20,
            }}
          >
            <div
              style={{
                background: "rgba(8,6,3,0.76)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid var(--border)",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow:
                  "0 12px 48px rgba(0,0,0,0.58), inset 0 1px 0 rgba(255,220,140,0.06)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 16,
                  right: 16,
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, rgba(200,144,74,0.36), transparent)",
                }}
              />
              <SecretWall />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}