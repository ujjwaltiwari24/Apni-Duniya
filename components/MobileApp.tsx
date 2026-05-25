"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import SecretWall from "@/components/SecretWall";

/* ─── ICONS ─── */
const Icon = ({
  d,
  size = 18,
  strokeWidth = 1.8,
}: {
  d: string;
  size?: number;
  strokeWidth?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const ICONS = {
  play: "M5 3l14 9-14 9V3z",
  pause: "M6 4h4v16H6zm8 0h4v16h-4z",
  worlds: "M3 12a9 9 0 1018 0A9 9 0 003 12zm0 0h18M12 3c-1.5 3-2.5 6-2.5 9s1 6 2.5 9M12 3c1.5 3 2.5 6 2.5 9s-1 6-2.5 9",
  mood: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  more: "M4 6h16M4 12h16M4 18h16",
  now: "M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z",
  expand: "M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3",
  music: "M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  close: "M6 18L18 6M6 6l12 12",
  chevron: "M9 5l7 7-7 7",
};

const C = {
  bg: "#0a0804",
  surface: "rgba(255,240,200,0.04)",
  surfaceHover: "rgba(255,240,200,0.07)",
  border: "rgba(255,220,150,0.10)",
  borderActive: "rgba(214,177,125,0.45)",
  text: "rgba(255,245,225,0.95)",
  muted: "rgba(255,220,170,0.45)",
  accent: "#d6a85a",
  accentGlow: "rgba(214,168,90,0.18)",
  accentSoft: "rgba(214,168,90,0.08)",
};

interface Props {
  scenes: any[];
  currentScene: any;
  setCurrentScene: (scene: any) => void;
  enterFullscreen: () => void;
  user: any;
}

async function requestFullscreenLandscape(element?: Element | null) {
  const el = element ?? document.documentElement;

  try {
    if (el.requestFullscreen) {
      await el.requestFullscreen();
    } else if ((el as any).webkitRequestFullscreen) {
      await (el as any).webkitRequestFullscreen();
    } else if ((el as any).mozRequestFullScreen) {
      await (el as any).mozRequestFullScreen();
    } else if ((el as any).msRequestFullscreen) {
      await (el as any).msRequestFullscreen();
    }
  } catch (e) {
    console.warn("Fullscreen not available:", e);
  }

  try {
    const so = (screen as any).orientation ?? (screen as any).msOrientation;
    if (so?.lock) {
      await so.lock("landscape");
    } else if ((screen as any).lockOrientation) {
      (screen as any).lockOrientation("landscape-primary");
    } else if ((screen as any).mozLockOrientation) {
      (screen as any).mozLockOrientation("landscape-primary");
    }
  } catch (e) {
    console.warn("Orientation lock not available:", e);
  }
}

export default function MobileApp({
  scenes,
  currentScene,
  setCurrentScene,
  enterFullscreen,
  user,
}: Props) {
  const [tab, setTab] = useState<"now" | "worlds" | "mood" | "more">("now");
  const [selectedMood, setSelectedMood] = useState("All");
  const [selectedTime, setSelectedTime] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Audio management
  useEffect(() => {
    audioRef.current?.pause();
    if (currentScene?.music) {
      audioRef.current = new Audio(currentScene.music);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.6;
    }
    setIsPlaying(false);
  }, [currentScene]);

  const toggleMusic = useCallback(async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (_) {}
    }
  }, [isPlaying]);

  const handleEnterWorld = useCallback(async () => {
    setIsEntering(true);
    try {
      await new Promise((r) => setTimeout(r, 120));
      await requestFullscreenLandscape(containerRef.current);
      enterFullscreen();
    } catch (err) {
      console.warn("Enter world error:", err);
      enterFullscreen();
    } finally {
      setIsEntering(false);
    }
  }, [enterFullscreen]);

  const tabs = [
    { id: "now" as const, label: "Now", icon: ICONS.now },
    { id: "worlds" as const, label: "Worlds", icon: ICONS.worlds },
    { id: "mood" as const, label: "Mood", icon: ICONS.mood },
    { id: "more" as const, label: "More", icon: ICONS.more },
  ];

  const moods = ["All", "Calm", "Rainy", "Cozy", "Peaceful", "Energetic", "Melancholic"];
  const times = ["All", "Morning", "Afternoon", "Evening", "Night"];

  // Memoized filtering for performance
  const filteredScenes = useMemo(() => {
    return scenes.filter((scene) => {
      const moodMatch = selectedMood === "All" || scene.mood === selectedMood;
      const timeMatch = selectedTime === "All" || scene.time === selectedTime;
      const searchMatch =
        searchQuery === "" ||
        scene.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scene.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return moodMatch && timeMatch && searchMatch;
    });
  }, [scenes, selectedMood, selectedTime, searchQuery]);

  const getUniqueMoods = () => {
    const moodSet = new Set(scenes.map((s) => s.mood));
    return ["All", ...Array.from(moodSet).sort()];
  };

  const getUniqueTimes = () => {
    const timeSet = new Set(scenes.map((s) => s.time));
    return ["All", ...Array.from(timeSet).sort()];
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

        :root {
          --accent: #d6a85a;
          --bg: #0a0804;
        }

        html, body {
          margin: 0;
          padding: 0;
          background: var(--bg);
          overscroll-behavior: none;
        }

        .apni-scroll {
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-y: contain;
        }

        .apni-scroll::-webkit-scrollbar { display: none; }

        .chip-scroll {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding-bottom: 4px;
        }
        .chip-scroll::-webkit-scrollbar { display: none; }

        @keyframes shimmer {
          0% { opacity: 0.4; }
          50% { opacity: 0.9; }
          100% { opacity: 0.4; }
        }

        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.4); }
          50% { box-shadow: 0 0 0 5px rgba(74,222,128,0); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-up {
          animation: fadeUp 0.4s ease forwards;
        }

        .tab-btn {
          transition: color 0.2s ease;
        }

        .scene-card {
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
          -webkit-user-select: none;
          user-select: none;
        }

        .scene-card:active {
          transform: scale(0.98);
        }

        .enter-btn {
          transition: opacity 0.2s, transform 0.15s ease;
        }

        .enter-btn:active:not(:disabled) {
          transform: scale(0.97);
        }

        .music-btn {
          transition: background 0.2s ease, border-color 0.2s ease;
        }

        .music-btn:active {
          transform: scale(0.95);
        }

        .grain::after {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          opacity: 0.028;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 128px 128px;
        }

        :fullscreen .fullscreen-video-scene {
          display: flex !important;
        }
        :-webkit-full-screen .fullscreen-video-scene {
          display: flex !important;
        }

        input::placeholder {
          color: rgba(255,220,170,0.3);
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>

      {/* Fullscreen video overlay */}
      <div
        className="fullscreen-video-scene"
        style={{
          display: "none",
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "#000",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <video
          autoPlay
          muted={false}
          loop
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        >
          <source src={currentScene?.video} type="video/mp4" />
        </video>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)",
          }}
        />
        <div style={{ position: "absolute", bottom: 32, left: 28 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>{currentScene?.emoji}</div>
          <h2
            style={{
              margin: 0,
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 40,
              fontWeight: 600,
              color: "rgba(255,245,225,0.95)",
              letterSpacing: "-0.01em",
            }}
          >
            {currentScene?.name}
          </h2>
        </div>
      </div>

      {/* Main app container */}
      <div
        ref={containerRef}
        className="grain apni-scroll"
        style={{
          width: "100vw",
          height: "100dvh",
          background: C.bg,
          color: C.text,
          display: "flex",
          flexDirection: "column",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          position: "relative",
          overflowX: "hidden",
          overflowY: "auto",
          backgroundImage:
            "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(180,110,30,0.12) 0%, transparent 70%)",
        }}
      >
        {/* ── TOP BAR ── */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            background: "rgba(10,8,4,0.82)",
            borderBottom: `1px solid ${C.border}`,
            padding: "14px 18px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              Apni
              <span style={{ color: C.accent }}> Duniya</span>
            </div>
            <div
              style={{
                fontSize: 10,
                color: C.muted,
                marginTop: 4,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 300,
              }}
            >
              Emotional Escape Worlds
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#4ade80",
                animation: "pulse-dot 2s infinite",
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: "#4ade80",
                letterSpacing: "0.14em",
                fontWeight: 500,
              }}
            >
              LIVE
            </span>
          </div>
        </div>

        {/* ── TAB BAR ── */}
        <div
          style={{
            display: "flex",
            borderBottom: `1px solid ${C.border}`,
            background: "rgba(255,240,200,0.015)",
            position: "sticky",
            top: 63,
            zIndex: 90,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            flexShrink: 0,
          }}
        >
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                className="tab-btn"
                onClick={() => {
                  setTab(t.id);
                  setSearchQuery("");
                }}
                style={{
                  flex: 1,
                  padding: "11px 6px 9px",
                  background: "transparent",
                  border: "none",
                  color: active ? C.accent : C.muted,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  borderBottom: active
                    ? `2px solid ${C.accent}`
                    : "2px solid transparent",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                {active && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 32,
                      height: 8,
                      background: C.accent,
                      filter: "blur(8px)",
                      borderRadius: "50%",
                      opacity: 0.5,
                    }}
                  />
                )}
                <Icon d={t.icon} size={17} />
                <span style={{ fontSize: 9.5, fontWeight: 500, letterSpacing: "0.04em" }}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── CONTENT AREA ── */}
        <div
          style={{
            flex: 1,
            padding: "16px 14px 40px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {/* ════ NOW TAB ════ */}
          {tab === "now" && (
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Video card */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16/9",
                  overflow: "hidden",
                  borderRadius: 20,
                  background: "#111",
                  border: `1px solid ${C.border}`,
                  boxShadow: `0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px ${C.border}`,
                  flexShrink: 0,
                }}
              >
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                >
                  <source src={currentScene?.video} type="video/mp4" />
                </video>

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(5,3,1,0.75) 0%, rgba(0,0,0,0.05) 50%)",
                  }}
                />

                <div style={{ position: "absolute", left: 16, bottom: 16, right: 16 }}>
                  <div style={{ fontSize: 26, marginBottom: 4 }}>{currentScene?.emoji}</div>
                  <h2
                    style={{
                      margin: 0,
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 30,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.1,
                      textShadow: "0 2px 12px rgba(0,0,0,0.6)",
                    }}
                  >
                    {currentScene?.name}
                  </h2>
                </div>

                {isPlaying && (
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      background: "rgba(0,0,0,0.55)",
                      backdropFilter: "blur(8px)",
                      borderRadius: 999,
                      padding: "5px 10px",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <Icon d={ICONS.music} size={11} strokeWidth={1.5} />
                    <span style={{ fontSize: 10, color: C.accent, letterSpacing: "0.06em" }}>
                      PLAYING
                    </span>
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <div
                        key={i}
                        style={{
                          width: 2,
                          height: 10,
                          background: C.accent,
                          borderRadius: 2,
                          animation: `shimmer 0.8s ${delay}s ease-in-out infinite`,
                          opacity: 0.8,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Description card */}
              <div
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 20,
                  padding: "16px 18px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 20,
                    right: 20,
                    height: 1,
                    background: `linear-gradient(to right, transparent, ${C.accent}55, transparent)`,
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    gap: 7,
                    marginBottom: 12,
                    flexWrap: "wrap",
                  }}
                >
                  {[currentScene?.time, currentScene?.mood].filter(Boolean).map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: "5px 12px",
                        borderRadius: 999,
                        background: C.accentSoft,
                        border: `1px solid rgba(214,168,90,0.2)`,
                        fontSize: 11,
                        color: C.accent,
                        letterSpacing: "0.06em",
                        fontWeight: 500,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p
                  style={{
                    margin: 0,
                    lineHeight: 1.85,
                    color: "rgba(255,240,200,0.65)",
                    fontSize: 13.5,
                    fontWeight: 300,
                  }}
                >
                  {currentScene?.description}
                </p>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                <button
                  className="enter-btn"
                  onClick={handleEnterWorld}
                  disabled={isEntering}
                  style={{
                    flex: 1,
                    height: 52,
                    borderRadius: 16,
                    border: `1px solid ${C.borderActive}`,
                    background: isEntering
                      ? "rgba(214,168,90,0.15)"
                      : "linear-gradient(135deg, #c9993e 0%, #e8bb6a 50%, #c9993e 100%)",
                    color: isEntering ? C.accent : "#1a0f00",
                    fontWeight: 700,
                    fontSize: 13.5,
                    cursor: isEntering ? "not-allowed" : "pointer",
                    letterSpacing: "0.04em",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: isEntering ? "none" : `0 4px 20px rgba(214,168,90,0.3)`,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {isEntering ? (
                    <>
                      <span style={{ opacity: 0.7 }}>⌛</span> Entering…
                    </>
                  ) : (
                    <>
                      <Icon d={ICONS.expand} size={15} strokeWidth={2} />
                      Enter World
                    </>
                  )}
                </button>

                <button
                  className="music-btn"
                  onClick={toggleMusic}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    border: isPlaying
                      ? `1px solid ${C.borderActive}`
                      : `1px solid ${C.border}`,
                    background: isPlaying ? C.accentSoft : C.surface,
                    color: isPlaying ? C.accent : C.muted,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  <Icon d={isPlaying ? ICONS.pause : ICONS.play} size={16} />
                </button>
              </div>

              {/* Secret Wall */}
              <div
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 20,
                  padding: "2px 4px",
                  overflow: "hidden",
                }}
              >
                <SecretWall />
              </div>
            </div>
          )}

          {/* ════ WORLDS TAB WITH SEARCH ════ */}
          {tab === "worlds" && (
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Header */}
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 22,
                    fontWeight: 600,
                    color: C.text,
                    marginBottom: 2,
                  }}
                >
                  Explore Worlds
                </h3>
                <p style={{ margin: 0, fontSize: 12, color: C.muted }}>
                  {filteredScenes.length} world{filteredScenes.length !== 1 ? "s" : ""} available
                </p>
              </div>

              {/* Search bar */}
              <div style={{ position: "relative" }}>
                <Icon
                  d={ICONS.search}
                  size={16}
                  strokeWidth={1.5}
                />
                <style>{`
                  .search-input {
                    position: absolute;
                    left: 0;
                    top: 0;
                  }
                `}</style>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search worlds..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px 12px 40px",
                    borderRadius: 14,
                    border: `1px solid ${C.border}`,
                    background: C.surface,
                    color: C.text,
                    fontSize: 14,
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.2s ease",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = `1px solid ${C.borderActive}`;
                    e.currentTarget.style.background = "rgba(255,240,200,0.06)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = `1px solid ${C.border}`;
                    e.currentTarget.style.background = C.surface;
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: C.muted,
                      cursor: "pointer",
                      padding: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon d={ICONS.close} size={16} />
                  </button>
                )}
              </div>

              {/* Mood filter */}
              <div>
                <div
                  style={{
                    fontSize: 11,
                    marginBottom: 9,
                    color: C.muted,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Mood
                </div>
                <div className="chip-scroll" style={{ display: "flex", gap: 7 }}>
                  {getUniqueMoods().map((mood) => {
                    const active = selectedMood === mood;
                    return (
                      <button
                        key={mood}
                        onClick={() => setSelectedMood(mood)}
                        style={{
                          padding: "8px 15px",
                          borderRadius: 999,
                          border: active ? `1px solid ${C.borderActive}` : `1px solid ${C.border}`,
                          background: active ? C.accentSoft : C.surface,
                          color: active ? C.accent : "rgba(255,240,200,0.6)",
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                          fontSize: 12.5,
                          fontWeight: active ? 500 : 400,
                          transition: "all 0.2s ease",
                        }}
                      >
                        {mood}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time filter */}
              <div>
                <div
                  style={{
                    fontSize: 11,
                    marginBottom: 9,
                    color: C.muted,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Time of Day
                </div>
                <div className="chip-scroll" style={{ display: "flex", gap: 7 }}>
                  {getUniqueTimes().map((time) => {
                    const active = selectedTime === time;
                    return (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        style={{
                          padding: "8px 15px",
                          borderRadius: 999,
                          border: active ? `1px solid ${C.borderActive}` : `1px solid ${C.border}`,
                          background: active ? C.accentSoft : C.surface,
                          color: active ? C.accent : "rgba(255,240,200,0.6)",
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                          fontSize: 12.5,
                          fontWeight: active ? 500 : 400,
                          transition: "all 0.2s ease",
                        }}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scene cards grid */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filteredScenes.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "48px 20px",
                      color: C.muted,
                      fontSize: 14,
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 12 }}>🌿</div>
                    No worlds match these filters
                  </div>
                ) : (
                  filteredScenes.map((scene) => {
                    const active = currentScene?.id === scene.id;
                    return (
                      <button
                        key={scene.id}
                        className="scene-card"
                        onClick={() => {
                          setCurrentScene(scene);
                          setTab("now");
                        }}
                        style={{
                          width: "100%",
                          padding: "14px 16px",
                          borderRadius: 18,
                          border: active ? `1px solid ${C.borderActive}` : `1px solid ${C.border}`,
                          background: active ? C.accentSoft : C.surface,
                          color: "white",
                          textAlign: "left",
                          cursor: "pointer",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {active && (
                          <div
                            style={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: 3,
                              background: C.accent,
                              borderRadius: "18px 0 0 18px",
                            }}
                          />
                        )}

                        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                          <div
                            style={{
                              width: 46,
                              height: 46,
                              borderRadius: 14,
                              background: active ? "rgba(214,168,90,0.15)" : "rgba(255,240,200,0.05)",
                              border: `1px solid ${active ? C.borderActive : C.border}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 22,
                              flexShrink: 0,
                            }}
                          >
                            {scene.emoji}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: 14.5,
                                marginBottom: 3,
                                color: active ? C.text : "rgba(255,240,200,0.85)",
                              }}
                            >
                              {scene.name}
                            </div>
                            <div
                              style={{
                                fontSize: 11.5,
                                color: C.muted,
                                display: "flex",
                                gap: 6,
                                alignItems: "center",
                              }}
                            >
                              <span>{scene.time}</span>
                              <span style={{ opacity: 0.4 }}>·</span>
                              <span>{scene.mood}</span>
                            </div>
                          </div>

                          {active && (
                            <div
                              style={{
                                fontSize: 11,
                                color: C.accent,
                                letterSpacing: "0.06em",
                                fontWeight: 600,
                                flexShrink: 0,
                              }}
                            >
                              NOW
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              <div style={{ height: 20 }} />
            </div>
          )}

          {/* ════ MOOD TAB ════ */}
          {tab === "mood" && (
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 22,
                    fontWeight: 600,
                    marginBottom: 2,
                  }}
                >
                  How are you feeling?
                </h3>
                <p style={{ margin: 0, fontSize: 12, color: C.muted }}>
                  Choose your current mood
                </p>
              </div>

              {getUniqueMoods()
                .filter((m) => m !== "All")
                .map((mood) => {
                  const moodScenes = scenes.filter((s) => s.mood === mood);
                  const moodIcons: Record<string, string> = {
                    Calm: "🌊",
                    Rainy: "🌧️",
                    Cozy: "🕯️",
                    Peaceful: "🍃",
                    Energetic: "⚡",
                    Melancholic: "🌙",
                  };
                  const isSelected = selectedMood === mood;

                  return (
                    <button
                      key={mood}
                      className="scene-card"
                      onClick={() => {
                        setSelectedMood(mood);
                        setTab("worlds");
                      }}
                      style={{
                        width: "100%",
                        padding: "18px",
                        borderRadius: 20,
                        border: `1px solid ${isSelected ? C.borderActive : C.border}`,
                        background: isSelected ? C.accentSoft : C.surface,
                        color: "white",
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                      }}
                    >
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 16,
                          background: "rgba(255,240,200,0.05)",
                          border: `1px solid ${C.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 26,
                          flexShrink: 0,
                        }}
                      >
                        {moodIcons[mood] ?? "✨"}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 3 }}>
                          {mood}
                        </div>
                        <div style={{ fontSize: 12, color: C.muted }}>
                          {moodScenes.length} world{moodScenes.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          )}

          {/* ════ MORE TAB ════ */}
          {tab === "more" && (
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 22,
                    fontWeight: 600,
                    marginBottom: 2,
                  }}
                >
                  More
                </h3>
              </div>

              {[
                { label: "About Apni Duniya", icon: "🌙", sub: "Our story & vision" },
                { label: "Sound Settings", icon: "🎵", sub: "Volume & audio preferences" },
                { label: "Display Preferences", icon: "✨", sub: "Brightness & themes" },
                { label: "Feedback", icon: "💌", sub: "Help us improve" },
              ].map((item) => (
                <button
                  key={item.label}
                  className="scene-card"
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 18,
                    border: `1px solid ${C.border}`,
                    background: C.surface,
                    color: "white",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 13,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: "rgba(255,240,200,0.05)",
                      border: `1px solid ${C.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 2 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 11.5, color: C.muted }}>{item.sub}</div>
                  </div>
                </button>
              ))}

              <div
                style={{
                  textAlign: "center",
                  padding: "20px 0 10px",
                  color: C.muted,
                  fontSize: 11,
                  letterSpacing: "0.06em",
                }}
              >
                Apni Duniya v1.0 · Made with ♥
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}