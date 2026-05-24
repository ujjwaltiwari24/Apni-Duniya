"use client";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";

interface Props {
  tab: "scene" | "worlds" | "mood" | "more";
  setTab: (t: "scene" | "worlds" | "mood" | "more") => void;
  scenes: any[];
  currentScene: any;
  setCurrentScene: (s: any) => void;
  enterFullscreen: () => void;
  user: any;
}

const MOODS = ["Rainy", "Calm", "Mountain", "Countryside"];
const TIMES = ["Morning", "Afternoon", "Evening", "Midnight"];

const UPCOMING = [
  { emoji: "🌲", name: "Forest Morning", sub: "Birds · Mist · Soft light" },
  { emoji: "🌃", name: "Neon Midnight", sub: "City rain · Lo-fi · Neon glow" },
  { emoji: "🏔️", name: "Mountain Dusk", sub: "Wind · Silence · Stars" },
];

export default function MobileNav({
  tab,
  setTab,
  scenes,
  currentScene,
  setCurrentScene,
  enterFullscreen,
  user,
}: Props) {
  const [selTime, setSelTime] = useState("Evening");
  const [selMood, setSelMood] = useState("Rainy");

  const handleEnterWorld = () => {
    const found = scenes.find((s) => s.time === selTime && s.mood === selMood);
    if (found) setCurrentScene(found);
    else alert("This world is coming soon 😭🔥");
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // ── TAB BAR ──
  const tabs = [
    { id: "scene", label: "Now", emoji: "🌧️" },
    { id: "worlds", label: "Worlds", emoji: "🌍" },
    { id: "mood", label: "Mood", emoji: "✨" },
    { id: "more", label: "More", emoji: "☰" },
  ] as const;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>

      {/* ── TAB BAR ── */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(20px)",
          flexShrink: 0,
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              padding: "12px 4px 10px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              borderBottom: tab === t.id ? "2px solid rgba(216,194,163,0.8)" : "2px solid transparent",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 18 }}>{t.emoji}</span>
            <span
              style={{
                fontSize: 10,
                fontFamily: "-apple-system,sans-serif",
                color: tab === t.id ? "rgba(216,194,163,0.9)" : "rgba(255,255,255,0.38)",
                fontWeight: tab === t.id ? 600 : 400,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {t.label}
            </span>
          </button>
        ))}
      </div>

      {/* ── SCENE TAB ── */}
      {tab === "scene" && (
        <div style={{ padding: "16px 16px 24px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Scene video preview — 16:9 */}
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingTop: "56.25%",
              borderRadius: 18,
              overflow: "hidden",
              background: "#111",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {currentScene.video ? (
              <video
                autoPlay
                muted
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
                <source src={currentScene.video} type="video/mp4" />
              </video>
            ) : (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 56,
                }}
              >
                {currentScene.emoji}
              </div>
            )}
            {/* Gradient overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)",
              }}
            />
            {/* Scene label */}
            <div
              style={{
                position: "absolute",
                bottom: 12,
                left: 14,
                right: 14,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "-0.03em",
                    textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                  }}
                >
                  {currentScene.emoji} {currentScene.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.55)",
                    fontFamily: "-apple-system,sans-serif",
                    marginTop: 2,
                  }}
                >
                  {currentScene.time} · {currentScene.mood}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 10px",
                  borderRadius: 100,
                  background: "rgba(74,222,128,0.15)",
                  border: "1px solid rgba(74,222,128,0.25)",
                  fontSize: 10,
                  color: "#4ade80",
                  fontFamily: "-apple-system,sans-serif",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#4ade80",
                    display: "inline-block",
                  }}
                />
                LIVE
              </div>
            </div>
          </div>

          {/* Description */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: 14,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.55)",
                fontFamily: "-apple-system,sans-serif",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {currentScene.description}
            </p>
          </div>

          {/* CTA — Enter World */}
          <button
            onClick={enterFullscreen}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: 14,
              background: "#ede8e0",
              color: "#0a0c10",
              fontFamily: "-apple-system,sans-serif",
              fontWeight: 700,
              fontSize: 15,
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.01em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            ⛶ Enter World (Full Experience)
          </button>

          {/* Now playing */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: 14,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "rgba(236,72,153,0.15)",
                border: "1px solid rgba(236,72,153,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              🎵
            </div>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontFamily: "-apple-system,sans-serif",
                  color: "rgba(255,255,255,0.82)",
                  fontWeight: 500,
                  marginBottom: 2,
                }}
              >
                Calm Piano & Rain
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontFamily: "-apple-system,sans-serif",
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                Emotional ambience mix
              </div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                }}
              >
                ▶
              </div>
            </div>
          </div>

          {/* Daily thought */}
          <div
            style={{
              padding: "16px",
              borderRadius: 14,
              background: "rgba(200,160,100,0.06)",
              border: "1px solid rgba(200,160,100,0.15)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontFamily: "-apple-system,sans-serif",
                color: "rgba(200,160,100,0.7)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              ☕ Daily Thought
            </div>
            <p
              style={{
                fontSize: 14,
                color: "rgba(237,232,224,0.7)",
                fontStyle: "italic",
                lineHeight: 1.6,
                margin: 0,
                fontFamily: "Georgia, serif",
              }}
            >
              "Some nights are meant to be felt, not fixed."
            </p>
          </div>
        </div>
      )}

      {/* ── WORLDS TAB ── */}
      {tab === "worlds" && (
        <div style={{ padding: "16px 16px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              fontSize: 11,
              fontFamily: "-apple-system,sans-serif",
              color: "rgba(200,160,100,0.6)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Live Worlds
          </div>

          {scenes.map((scene) => (
            <button
              key={scene.id || scene.name}
              onClick={() => setCurrentScene(scene)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 16,
                border:
                  currentScene.name === scene.name
                    ? "1px solid rgba(216,194,163,0.3)"
                    : "1px solid rgba(255,255,255,0.07)",
                background:
                  currentScene.name === scene.name
                    ? "rgba(216,194,163,0.07)"
                    : "rgba(255,255,255,0.025)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 12,
                textAlign: "left",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.05)",
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
                    fontSize: 14,
                    fontFamily: "-apple-system,sans-serif",
                    color: "rgba(237,232,224,0.88)",
                    fontWeight: 500,
                    marginBottom: 3,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {scene.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontFamily: "-apple-system,sans-serif",
                    color: "rgba(237,232,224,0.35)",
                  }}
                >
                  {scene.time} · {scene.mood}
                </div>
              </div>
              {currentScene.name === scene.name && (
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#4ade80",
                    flexShrink: 0,
                  }}
                />
              )}
            </button>
          ))}

          <div
            style={{
              fontSize: 11,
              fontFamily: "-apple-system,sans-serif",
              color: "rgba(200,160,100,0.6)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginTop: 8,
              marginBottom: 4,
            }}
          >
            Coming Soon
          </div>

          {UPCOMING.map((u) => (
            <div
              key={u.name}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.05)",
                background: "rgba(255,255,255,0.015)",
                display: "flex",
                alignItems: "center",
                gap: 12,
                opacity: 0.5,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                {u.emoji}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontFamily: "-apple-system,sans-serif",
                    color: "rgba(237,232,224,0.7)",
                    fontWeight: 500,
                    marginBottom: 3,
                  }}
                >
                  {u.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontFamily: "-apple-system,sans-serif",
                    color: "rgba(237,232,224,0.3)",
                  }}
                >
                  {u.sub}
                </div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: "-apple-system,sans-serif",
                    padding: "3px 8px",
                    borderRadius: 100,
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(237,232,224,0.3)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Soon
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MOOD TAB ── */}
      {tab === "mood" && (
        <div style={{ padding: "16px 16px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              padding: "16px",
              borderRadius: 16,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontFamily: "-apple-system,sans-serif",
                color: "rgba(200,160,100,0.6)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              ✨ Custom Mood Engine
            </div>

            {/* Time */}
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  fontSize: 12,
                  fontFamily: "-apple-system,sans-serif",
                  color: "rgba(237,232,224,0.45)",
                  marginBottom: 8,
                  letterSpacing: "0.03em",
                }}
              >
                Time of Day
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {TIMES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelTime(t)}
                    style={{
                      padding: "11px",
                      borderRadius: 12,
                      border:
                        selTime === t
                          ? "1px solid rgba(216,194,163,0.35)"
                          : "1px solid rgba(255,255,255,0.07)",
                      background: selTime === t ? "rgba(216,194,163,0.1)" : "rgba(255,255,255,0.03)",
                      color: selTime === t ? "rgba(216,194,163,0.95)" : "rgba(237,232,224,0.5)",
                      fontFamily: "-apple-system,sans-serif",
                      fontSize: 13,
                      fontWeight: selTime === t ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 12,
                  fontFamily: "-apple-system,sans-serif",
                  color: "rgba(237,232,224,0.45)",
                  marginBottom: 8,
                  letterSpacing: "0.03em",
                }}
              >
                Atmosphere
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {MOODS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelMood(m)}
                    style={{
                      padding: "11px",
                      borderRadius: 12,
                      border:
                        selMood === m
                          ? "1px solid rgba(216,194,163,0.35)"
                          : "1px solid rgba(255,255,255,0.07)",
                      background: selMood === m ? "rgba(216,194,163,0.1)" : "rgba(255,255,255,0.03)",
                      color: selMood === m ? "rgba(216,194,163,0.95)" : "rgba(237,232,224,0.5)",
                      fontFamily: "-apple-system,sans-serif",
                      fontSize: 13,
                      fontWeight: selMood === m ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleEnterWorld}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: 13,
                background: "#ede8e0",
                color: "#0a0c10",
                fontFamily: "-apple-system,sans-serif",
                fontWeight: 700,
                fontSize: 14,
                border: "none",
                cursor: "pointer",
              }}
            >
              Enter World ✨
            </button>
          </div>

          {/* Secret message wall teaser */}
          <div
            style={{
              padding: "16px",
              borderRadius: 16,
              background: "rgba(200,160,100,0.05)",
              border: "1px solid rgba(200,160,100,0.15)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontFamily: "-apple-system,sans-serif",
                color: "rgba(200,160,100,0.6)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              💌 Secret Message Wall
            </div>
            <p
              style={{
                fontSize: 13,
                color: "rgba(237,232,224,0.5)",
                fontFamily: "-apple-system,sans-serif",
                lineHeight: 1.7,
                margin: "0 0 12px",
              }}
            >
              Leave a note for your partner. They'll find it glowing here when they arrive.
            </p>
            <button
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                border: "1px solid rgba(200,160,100,0.2)",
                background: "transparent",
                color: "rgba(200,160,100,0.8)",
                fontFamily: "-apple-system,sans-serif",
                fontSize: 13,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Leave a Message →
            </button>
          </div>
        </div>
      )}

      {/* ── MORE TAB ── */}
      {tab === "more" && (
        <div style={{ padding: "16px 16px 32px", display: "flex", flexDirection: "column", gap: 12 }}>

          {/* User card */}
          {user && (
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <img
                src={user.photoURL || "https://via.placeholder.com/48"}
                alt="avatar"
                style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0 }}
              />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontFamily: "-apple-system,sans-serif",
                    color: "rgba(237,232,224,0.9)",
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.displayName}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontFamily: "-apple-system,sans-serif",
                    color: "rgba(237,232,224,0.35)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.email}
                </div>
              </div>
            </div>
          )}

          {/* Feature list */}
          {[
            { emoji: "👥", title: "Co-Presence Rooms", desc: "Sit in the same world with a friend", badge: "New" },
            { emoji: "💌", title: "Secret Message Wall", desc: "Leave notes for someone special", badge: null },
            { emoji: "🕯️", title: "Focus Mode", desc: "Deep work with Pomodoro timer", badge: "Soon" },
            { emoji: "📖", title: "Mood Journal", desc: "Write how you feel, tied to this world", badge: "Soon" },
          ].map((f) => (
            <div
              key={f.title}
              style={{
                padding: "14px 16px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {f.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontFamily: "-apple-system,sans-serif",
                    color: "rgba(237,232,224,0.8)",
                    fontWeight: 500,
                    marginBottom: 2,
                  }}
                >
                  {f.title}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontFamily: "-apple-system,sans-serif",
                    color: "rgba(237,232,224,0.35)",
                  }}
                >
                  {f.desc}
                </div>
              </div>
              {f.badge && (
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: "-apple-system,sans-serif",
                    padding: "3px 8px",
                    borderRadius: 100,
                    background:
                      f.badge === "New"
                        ? "rgba(74,222,128,0.12)"
                        : "rgba(255,255,255,0.05)",
                    color:
                      f.badge === "New"
                        ? "#4ade80"
                        : "rgba(237,232,224,0.3)",
                    border:
                      f.badge === "New"
                        ? "1px solid rgba(74,222,128,0.25)"
                        : "1px solid rgba(255,255,255,0.08)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {f.badge}
                </span>
              )}
            </div>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 13,
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.18)",
              color: "rgba(239,68,68,0.8)",
              fontFamily: "-apple-system,sans-serif",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              marginTop: 4,
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}