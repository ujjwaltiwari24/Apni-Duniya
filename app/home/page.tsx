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

    if (el.requestFullscreen) {

      await el.requestFullscreen();

    } else if ((el as any).webkitRequestFullscreen) {

      await (el as any).webkitRequestFullscreen();

    }

  } catch (e) {

    console.warn("Fullscreen failed:", e);

  }

  try {

    const so = (screen as any).orientation;

    if (so?.lock) {

      await so.lock("landscape");

    }

  } catch (e) {

    console.warn("Orientation lock failed:", e);

  }

}

async function exitFullscreenSafe() {

  try {

    if (document.fullscreenElement) {

      await document.exitFullscreen();

    }

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

    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap');

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    :root {

      --bg: #07060a;

      --sidebar: rgba(10,8,6,0.92);

      --panel: rgba(255,255,255,0.04);

      --border: rgba(255,220,140,0.08);

      --text: rgba(255,248,235,0.92);

      --muted: rgba(255,235,195,0.52);

      --soft: rgba(255,225,175,0.28);

      --accent: #d6a257;

      --accent-2: #f0c27b;

      --green: #59d87b;

      --sans: 'Inter', sans-serif;

      --serif: 'Playfair Display', serif;

    }

    html,
    body {

      width: 100%;
      height: 100%;

      overflow: hidden;

      background: var(--bg);

      font-family: var(--sans);

      color: var(--text);

    }

    ::-webkit-scrollbar {
      width: 4px;
    }

    ::-webkit-scrollbar-thumb {
      background: rgba(214,162,87,0.24);
      border-radius: 999px;
    }

    .grain::before {

      content: "";

      position: fixed;

      inset: 0;

      pointer-events: none;

      opacity: 0.018;

      z-index: 99999;

      background-image:
        url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");

    }

    .glass {

      background: rgba(255,255,255,0.04);

      backdrop-filter: blur(18px);

      -webkit-backdrop-filter: blur(18px);

      border: 1px solid rgba(255,220,140,0.08);

    }

    .scene-card {

      transition:
        transform 0.18s ease,
        background 0.18s ease,
        border 0.18s ease;

      cursor: pointer;

    }

    .scene-card:hover {

      transform: translateY(-1px);

      background:
        rgba(255,255,255,0.055);

    }

    .gold-btn {

      transition:
        transform 0.18s ease,
        box-shadow 0.22s ease,
        filter 0.22s ease;

    }

    .gold-btn:hover:not(:disabled) {

      transform: translateY(-2px);

      filter: brightness(1.05);

      box-shadow:
        0 10px 40px rgba(214,162,87,0.34);

    }

    .gold-btn:active:not(:disabled) {

      transform: scale(0.97);

    }

    @keyframes pulse {

      0%,100% {
        box-shadow: 0 0 0 0 rgba(89,216,123,0.45);
      }

      60% {
        box-shadow: 0 0 0 6px rgba(89,216,123,0);
      }

    }

    @keyframes fadeUp {

      from {
        opacity: 0;
        transform: translateY(16px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }

    }

    .fade-up {
      animation: fadeUp 0.5s ease both;
    }

  `}</style>

);

/* ══════════════════════════════════════
   SMALL COMPONENTS
══════════════════════════════════════ */

const Tag = ({
  children,
}: {
  children: string;
}) => (

  <span
    style={{

      padding: "6px 12px",

      borderRadius: 999,

      background:
        "rgba(255,255,255,0.05)",

      border:
        "1px solid rgba(255,220,140,0.08)",

      fontSize: 11,

      color:
        "rgba(255,235,195,0.62)",

      whiteSpace: "nowrap",

      letterSpacing:
        "0.06em",

    }}
  >

    {children}

  </span>

);

export default function HomePage() {

  const immersiveRef =
    useRef<HTMLDivElement>(null);

  const [immersiveMode, setImmersiveMode] =
    useState(false);

  const [isMobile, setIsMobile] =
    useState(false);

  const [currentScene, setCurrentScene] =
    useState<SceneType>(scenes[0]);

  const [user, setUser] =
    useState<any>(null);

  const [isEntering, setIsEntering] =
    useState(false);

  const [search, setSearch] =
    useState("");

  // AUTH
  useEffect(() => {

    const unsub =
      onAuthStateChanged(
        auth,
        (u) => setUser(u)
      );

    return () => unsub();

  }, []);

  // MOBILE DETECT
  useEffect(() => {

    const check = () => {

      setIsMobile(
        window.innerWidth < 768
      );

    };

    check();

    window.addEventListener(
      "resize",
      check
    );

    return () =>
      window.removeEventListener(
        "resize",
        check
      );

  }, []);

  // EXIT FULLSCREEN
  useEffect(() => {

    const handler =
      () => {

        if (
          !document.fullscreenElement
        ) {

          setImmersiveMode(false);

          try {

            (screen as any)
              .orientation
              ?.unlock?.();

          } catch (_) {}

        }

      };

    document.addEventListener(
      "fullscreenchange",
      handler
    );

    return () =>
      document.removeEventListener(
        "fullscreenchange",
        handler
      );

  }, []);

  // FILTERED SCENES
  const filteredScenes =
    useMemo(() => {

      if (!search)
        return scenes;

      return scenes.filter(
        (scene) =>

          scene.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          scene.description
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [search]);

  // ENTER WORLD
  const enterFullscreen =
    useCallback(async () => {

      try {

        setIsEntering(true);

        setImmersiveMode(true);

        await new Promise(
          (r) =>
            setTimeout(r, 120)
        );

        await goFullscreenLandscape(
          immersiveRef.current ??
            document.documentElement
        );

      } catch (err) {

        console.log(err);

      } finally {

        setIsEntering(false);

      }

    }, []);

  // EXIT WORLD
  const exitImmersion =
    useCallback(async () => {

      await exitFullscreenSafe();

      setImmersiveMode(false);

    }, []);

  /* ══════════════════════════════════════
     MOBILE
  ═══════════════════════════════════════ */

  if (isMobile) {

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

  }

  /* ══════════════════════════════════════
     IMMERSIVE MODE
  ═══════════════════════════════════════ */

  if (immersiveMode) {

    return (
      <>
        <GlobalStyles />

        <div
          ref={immersiveRef}
          className="grain"
          style={{

            position: "fixed",

            inset: 0,

            zIndex: 999999,

            background: "#000",

            overflow: "hidden",

          }}
        >

          {/* VIDEO */}
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

            }}
          >

            <source
              src={currentScene.video}
              type="video/mp4"
            />

          </video>

          {/* OVERLAY */}
          <div
            style={{

              position: "absolute",

              inset: 0,

              background:
                "linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0.15), rgba(0,0,0,0.5))",

            }}
          />

          {/* INFO */}
          <div
            className="fade-up"
            style={{

              position: "absolute",

              left: 34,

              bottom: 34,

              zIndex: 10,

              maxWidth: 520,

            }}
          >

            <div
              style={{
                fontSize: 34,
                marginBottom: 10,
              }}
            >

              {currentScene.emoji}

            </div>

            <h1
              style={{

                fontFamily:
                  "var(--serif)",

                fontSize:
                  "clamp(34px,5vw,68px)",

                fontWeight: 500,

                lineHeight: 1.02,

                letterSpacing:
                  "-0.03em",

                marginBottom: 14,

              }}
            >

              {currentScene.name}

            </h1>

            <div
              style={{

                display: "flex",

                gap: 10,

                marginBottom: 18,

              }}
            >

              <Tag>
                {currentScene.time}
              </Tag>

              <Tag>
                {currentScene.mood}
              </Tag>

            </div>

            <p
              style={{

                fontSize: 15,

                lineHeight: 1.8,

                color:
                  "rgba(255,235,195,0.72)",

              }}
            >

              {
                currentScene.description
              }

            </p>

          </div>

          {/* EXIT */}
          <button
            onClick={exitImmersion}
            className="glass"
            style={{

              position: "absolute",

              top: 24,

              right: 24,

              width: 50,

              height: 50,

              borderRadius: "50%",

              border: "none",

              color: "white",

              fontSize: 18,

              cursor: "pointer",

              zIndex: 100,

            }}
          >

            ✕

          </button>

        </div>
      </>
    );

  }

  /* ══════════════════════════════════════
     DESKTOP
  ═══════════════════════════════════════ */

  return (
    <>
      <GlobalStyles />

      <div
        className="grain"
        style={{

          width: "100vw",

          height: "100vh",

          display: "flex",

          overflow: "hidden",

          background:
            "#07060a",

        }}
      >

        {/* SIDEBAR */}
        <aside
          style={{

            width: 320,

            flexShrink: 0,

            background:
              "linear-gradient(180deg, rgba(255,235,180,0.03) 0%, rgba(12,10,8,0.92) 45%, rgba(7,6,10,1) 100%)",

            borderRight:
              "1px solid rgba(255,220,140,0.08)",

            display: "flex",

            flexDirection: "column",

            overflow: "hidden",

          }}
        >

          {/* HEADER */}
          <div
            style={{

              padding:
                "28px 22px 22px",

              borderBottom:
                "1px solid rgba(255,220,140,0.08)",

            }}
          >

            <div
              style={{

                display: "flex",

                alignItems:
                  "flex-start",

                justifyContent:
                  "space-between",

                marginBottom: 18,

              }}
            >

              <div>

                <h1
                  style={{

                    fontFamily:
                      "var(--serif)",

                    fontSize: 28,

                    fontWeight: 500,

                    letterSpacing:
                      "-0.03em",

                    marginBottom: 5,

                  }}
                >

                  Apni Duniya

                </h1>

                <p
                  style={{

                    fontSize: 10,

                    color:
                      "var(--soft)",

                    letterSpacing:
                      "0.18em",

                    textTransform:
                      "uppercase",

                  }}
                >

                  Emotional Escape Worlds

                </p>

              </div>

              {/* LIVE */}
              <div
                style={{

                  display: "flex",

                  alignItems:
                    "center",

                  gap: 6,

                }}
              >

                <div
                  style={{

                    width: 7,

                    height: 7,

                    borderRadius:
                      "50%",

                    background:
                      "var(--green)",

                    animation:
                      "pulse 2s ease infinite",

                  }}
                />

                <span
                  style={{

                    fontSize: 10,

                    color:
                      "var(--green)",

                    letterSpacing:
                      "0.18em",

                  }}
                >

                  LIVE

                </span>

              </div>

            </div>

            {/* SEARCH */}
            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search worlds..."
              style={{

                width: "100%",

                padding:
                  "12px 14px",

                borderRadius: 14,

                border:
                  "1px solid rgba(255,220,140,0.08)",

                background:
                  "rgba(255,255,255,0.04)",

                color:
                  "var(--text)",

                outline: "none",

                fontSize: 13,

              }}
            />

          </div>

          {/* SCENES */}
          <div
            style={{

              flex: 1,

              overflowY:
                "auto",

              padding:
                "14px 0",

            }}
          >

            {
              filteredScenes.map(
                (scene) => {

                  const active =
                    currentScene.id ===
                    scene.id;

                  return (
                    <div
                      key={scene.id}
                      className="scene-card"
                      onClick={() =>
                        setCurrentScene(
                          scene
                        )
                      }
                      style={{

                        display: "flex",

                        alignItems:
                          "center",

                        gap: 14,

                        padding:
                          "14px 22px",

                        background:
                          active

                            ? "rgba(214,162,87,0.08)"

                            : "transparent",

                        borderLeft:
                          active

                            ? "2px solid var(--accent)"

                            : "2px solid transparent",

                      }}
                    >

                      <div
                        className="glass"
                        style={{

                          width: 42,

                          height: 42,

                          borderRadius: 14,

                          display: "flex",

                          alignItems:
                            "center",

                          justifyContent:
                            "center",

                          fontSize: 20,

                          flexShrink: 0,

                        }}
                      >

                        {scene.emoji}

                      </div>

                      <div
                        style={{
                          minWidth: 0,
                          flex: 1,
                        }}
                      >

                        <div
                          style={{

                            fontFamily:
                              "var(--serif)",

                            fontSize: 15,

                            marginBottom: 4,

                            overflow:
                              "hidden",

                            textOverflow:
                              "ellipsis",

                            whiteSpace:
                              "nowrap",

                          }}
                        >

                          {scene.name}

                        </div>

                        <div
                          style={{

                            fontSize: 11,

                            color:
                              "var(--muted)",

                          }}
                        >

                          {
                            scene.time
                          }{" "}
                          ·{" "}
                          {
                            scene.mood
                          }

                        </div>

                      </div>

                    </div>
                  );

                }
              )
            }

          </div>

          {/* USER */}
          {
            user && (

              <div
                style={{

                  padding:
                    "16px 22px",

                  borderTop:
                    "1px solid rgba(255,220,140,0.08)",

                }}
              >

                <div
                  style={{
                    fontSize: 13,
                    marginBottom: 4,
                  }}
                >

                  {
                    user.displayName ||
                    user.email
                  }

                </div>

                <div
                  style={{

                    fontSize: 11,

                    color:
                      "var(--muted)",

                  }}
                >

                  Signed in

                </div>

              </div>

            )
          }

        </aside>

        {/* MAIN */}
        <main
          style={{

            flex: 1,

            position:
              "relative",

            overflow:
              "hidden",

          }}
        >

          {/* SCENE */}
          <SceneView
  currentScene={currentScene}
  sceneRef={immersiveRef}
  immersiveMode={false}
  isMobile={false as boolean}
/>

          {/* OVERLAY */}
          <div
            style={{

              position: "absolute",

              inset: 0,

              background:
                "linear-gradient(to top, rgba(0,0,0,0.72), transparent 45%)",

              pointerEvents:
                "none",

            }}
          />

          {/* LEFT INFO */}
          <div
            className="fade-up"
            style={{

              position:
                "absolute",

              left: 34,

              bottom: 34,

              right: 420,

              zIndex: 10,

            }}
          >

            <div
              style={{
                fontSize: 34,
                marginBottom: 10,
              }}
            >

              {currentScene.emoji}

            </div>

            <h2
              style={{

                fontFamily:
                  "var(--serif)",

                fontSize:
                  "clamp(28px,2.6vw,46px)",

                fontWeight: 500,

                lineHeight: 1.08,

                letterSpacing:
                  "-0.03em",

                marginBottom: 14,

              }}
            >

              {currentScene.name}

            </h2>

            <div
              style={{

                display: "flex",

                gap: 10,

                marginBottom: 16,

                flexWrap: "wrap",

              }}
            >

              <Tag>
                {currentScene.time}
              </Tag>

              <Tag>
                {currentScene.mood}
              </Tag>

            </div>

            <p
              style={{

                maxWidth: 560,

                fontSize: 15,

                lineHeight: 1.9,

                color:
                  "rgba(255,235,195,0.72)",

              }}
            >

              {
                currentScene.description
              }

            </p>

          </div>

          {/* FLOATING CONTROLS */}
<div
  className="fade-up"
  style={{

    position:
      "absolute",

    right: 28,

    top: "50%",

    transform:
      "translateY(-50%)",

    zIndex: 50,

    display: "flex",

    flexDirection:
      "column",

    gap: 14,

    alignItems:
      "flex-end",

  }}
>

  {/* ENTER WORLD */}
  <button
    className="gold-btn"
    onClick={
      enterFullscreen
    }
    disabled={
      isEntering
    }
    style={{

      padding:
        "16px 30px",

      borderRadius: 20,

      border:
        "1px solid rgba(220,170,90,0.35)",

      background:
        isEntering

          ? "rgba(220,170,90,0.12)"

          : "linear-gradient(135deg, #b8863b 0%, #e0b15f 50%, #b8863b 100%)",

      color:
        isEntering
          ? "rgba(255,235,190,0.65)"
          : "#120c03",

      fontSize: 14,

      fontWeight: 700,

      letterSpacing:
        "0.08em",

      minWidth: 210,

      cursor:
        isEntering
          ? "not-allowed"
          : "pointer",

      boxShadow:
        isEntering

          ? "none"

          : "0 10px 40px rgba(200,144,74,0.34)",

      display: "flex",

      alignItems:
        "center",

      justifyContent:
        "center",

      gap: 10,

      backdropFilter:
        "blur(18px)",

      WebkitBackdropFilter:
        "blur(18px)",

      transition:
        "all 0.22s ease",

    }}
  >

    {
      isEntering

        ? "Entering..."

        : "⛶ Enter World"
    }

  </button>

</div>

          {/* SECRET WALL */}
          <div
            className="fade-up"
            style={{

              position:
                "absolute",

              right: 24,

              bottom: 28,

              width: 360,

              zIndex: 30,

            }}
          >

            <div
              className="glass"
              style={{

                borderRadius: 24,

                overflow:
                  "hidden",

              }}
            >

              <SecretWall />

            </div>

          </div>

        </main>

      </div>
    </>
  );

}