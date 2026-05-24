"use client";

import { useState } from "react";

import { signOut } from "firebase/auth";

import { auth } from "@/firebase/config";

import SceneButton from "@/components/SceneButton";

interface Props {

  scenes: any[];

  currentScene: any;

  setCurrentScene: (
    s: any
  ) => void;

  user: any;

}

const MOODS = [
  "Rainy",
  "Calm",
  "Mountain",
  "Countryside",
];

const TIMES = [
  "Morning",
  "Afternoon",
  "Evening",
  "Midnight",
];

const UPCOMING = [

  {
    emoji: "🌲",
    name: "Forest Morning",
  },

  {
    emoji: "🌃",
    name: "Neon Midnight",
  },

  {
    emoji: "🏔️",
    name: "Mountain Dusk",
  },

];

export default function Sidebar({

  scenes,

  currentScene,

  setCurrentScene,

  user,

}: Props) {

  const [selTime, setSelTime] =
    useState("Evening");

  const [selMood, setSelMood] =
    useState("Rainy");

  const handleLogout =
    async () => {

      await signOut(auth);

    };

  const handleEnterWorld =
    () => {

      const found =
        scenes.find(
          (s) =>
            s.time === selTime &&
            s.mood === selMood
        );

      if (found) {

        setCurrentScene(found);

      } else {

        alert(
          "This world is coming soon 😭🔥"
        );

      }

    };

  return (
    <aside
      style={{

        width: "100%",

        maxWidth: 340,

        minWidth: 290,

        flexShrink: 0,

        background:
          "linear-gradient(to bottom, rgba(9,11,18,0.96), rgba(5,7,12,0.98))",

        backdropFilter:
          "blur(30px)",

        borderRight:
          "1px solid rgba(255,255,255,0.05)",

        display: "flex",

        flexDirection:
          "column",

        height: "100vh",

        overflowY: "auto",

        overflowX: "hidden",

        position:
          "relative",

      }}
    >

      {/* Ambient glow */}
      <div
        style={{

          position:
            "absolute",

          top: -100,

          left: -100,

          width: 220,

          height: 220,

          borderRadius:
            "50%",

          background:
            "rgba(90,120,255,0.12)",

          filter:
            "blur(80px)",

          pointerEvents:
            "none",

        }}
      />

      {/* CONTENT */}
      <div
        style={{

          flex: 1,

          padding:
            "22px 16px",

          display: "flex",

          flexDirection:
            "column",

          gap: 18,

          position:
            "relative",

          zIndex: 2,

        }}
      >

        {/* LOGO */}
        <div>

          <div
            style={{

              fontSize: 30,

              fontWeight: 800,

              letterSpacing:
                "-0.06em",

              color: "#fff",

              lineHeight: 1,

              marginBottom: 8,

            }}
          >

            Apni
            <span
              style={{
                color:
                  "#d7bf9e",
              }}
            >

              Duniya

            </span>

            ☕
          </div>

          <p
            style={{

              margin: 0,

              fontSize: 12,

              color:
                "rgba(255,255,255,0.4)",

              lineHeight: 1.6,

            }}
          >

            Escape into cinematic,
            peaceful emotional worlds.

          </p>

        </div>

        {/* CURRENT WORLD */}
        <div
          style={{

            padding: 18,

            borderRadius: 24,

            background:
              "linear-gradient(to bottom right, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",

            border:
              "1px solid rgba(255,255,255,0.07)",

            boxShadow:
              "0 10px 40px rgba(0,0,0,0.25)",

          }}
        >

          <div
            style={{

              display: "flex",

              alignItems:
                "center",

              marginBottom: 14,

            }}
          >

            <span
              style={{

                fontSize: 10,

                letterSpacing:
                  "0.12em",

                textTransform:
                  "uppercase",

                color:
                  "rgba(180,210,255,0.7)",

              }}
            >

              🌧 Current World

            </span>

            <div
              style={{

                marginLeft:
                  "auto",

                padding:
                  "4px 8px",

                borderRadius:
                  999,

                background:
                  "rgba(74,222,128,0.1)",

                border:
                  "1px solid rgba(74,222,128,0.2)",

                color:
                  "#4ade80",

                fontSize: 10,

                fontWeight: 700,

              }}
            >

              LIVE

            </div>

          </div>

          <div
            style={{
              fontSize: 48,
              marginBottom: 10,
            }}
          >

            {
              currentScene.emoji
            }

          </div>

          <div
            style={{

              fontSize: 22,

              fontWeight: 700,

              color: "#fff",

              marginBottom: 8,

              letterSpacing:
                "-0.04em",

            }}
          >

            {
              currentScene.name
            }

          </div>

          <p
            style={{

              margin: 0,

              color:
                "rgba(255,255,255,0.45)",

              lineHeight: 1.75,

              fontSize: 13,

            }}
          >

            {
              currentScene.description
            }

          </p>

        </div>

        {/* ALL WORLDS */}
        <div>

          <div
            style={{

              fontSize: 10,

              textTransform:
                "uppercase",

              letterSpacing:
                "0.12em",

              color:
                "rgba(210,180,140,0.55)",

              marginBottom: 12,

            }}
          >

            All Worlds

          </div>

          <div
            style={{

              display: "flex",

              flexDirection:
                "column",

              gap: 8,

            }}
          >

            {
              scenes.map(
                (scene) => (

                  <SceneButton
                    key={
                      scene.id
                    }
                    scene={
                      scene
                    }
                    active={
                      currentScene.name ===
                      scene.name
                    }
                    onClick={() =>
                      setCurrentScene(
                        scene
                      )
                    }
                  />

                )
              )
            }

          </div>

        </div>

        {/* MOOD ENGINE */}
        <div
          style={{

            padding: 18,

            borderRadius: 24,

            background:
              "rgba(255,255,255,0.04)",

            border:
              "1px solid rgba(255,255,255,0.07)",

          }}
        >

          <div
            style={{

              fontSize: 10,

              letterSpacing:
                "0.12em",

              textTransform:
                "uppercase",

              color:
                "rgba(210,180,140,0.55)",

              marginBottom: 14,

            }}
          >

            ✨ Mood Engine

          </div>

          {/* TIME */}
          <div
            style={{
              marginBottom: 14,
            }}
          >

            <div
              style={{

                fontSize: 11,

                color:
                  "rgba(255,255,255,0.35)",

                marginBottom: 8,

              }}
            >

              Time of Day

            </div>

            <div
              style={{

                display: "grid",

                gridTemplateColumns:
                  "1fr 1fr",

                gap: 8,

              }}
            >

              {
                TIMES.map(
                  (t) => (

                    <button
                      key={t}
                      onClick={() =>
                        setSelTime(
                          t
                        )
                      }
                      style={{

                        padding:
                          "10px 12px",

                        borderRadius:
                          14,

                        border:
                          selTime === t
                            ? "1px solid rgba(215,191,158,0.35)"
                            : "1px solid rgba(255,255,255,0.07)",

                        background:
                          selTime === t
                            ? "rgba(215,191,158,0.12)"
                            : "rgba(255,255,255,0.03)",

                        color:
                          selTime === t
                            ? "#f3e5d0"
                            : "rgba(255,255,255,0.5)",

                        fontWeight:
                          selTime === t
                            ? 700
                            : 500,

                        fontSize: 12,

                        cursor:
                          "pointer",

                        transition:
                          "0.2s",

                      }}
                    >

                      {t}

                    </button>

                  )
                )
              }

            </div>

          </div>

          {/* MOOD */}
          <div
            style={{
              marginBottom: 16,
            }}
          >

            <div
              style={{

                fontSize: 11,

                color:
                  "rgba(255,255,255,0.35)",

                marginBottom: 8,

              }}
            >

              Atmosphere

            </div>

            <div
              style={{

                display: "grid",

                gridTemplateColumns:
                  "1fr 1fr",

                gap: 8,

              }}
            >

              {
                MOODS.map(
                  (m) => (

                    <button
                      key={m}
                      onClick={() =>
                        setSelMood(
                          m
                        )
                      }
                      style={{

                        padding:
                          "10px 12px",

                        borderRadius:
                          14,

                        border:
                          selMood === m
                            ? "1px solid rgba(215,191,158,0.35)"
                            : "1px solid rgba(255,255,255,0.07)",

                        background:
                          selMood === m
                            ? "rgba(215,191,158,0.12)"
                            : "rgba(255,255,255,0.03)",

                        color:
                          selMood === m
                            ? "#f3e5d0"
                            : "rgba(255,255,255,0.5)",

                        fontWeight:
                          selMood === m
                            ? 700
                            : 500,

                        fontSize: 12,

                        cursor:
                          "pointer",

                        transition:
                          "0.2s",

                      }}
                    >

                      {m}

                    </button>

                  )
                )
              }

            </div>

          </div>

          {/* BUTTON */}
          <button
            onClick={
              handleEnterWorld
            }
            style={{

              width: "100%",

              padding:
                "14px 16px",

              borderRadius:
                16,

              border: "none",

              background:
                "linear-gradient(to right, #f1e6d8, #d7bf9e)",

              color:
                "#111",

              fontWeight: 800,

              fontSize: 14,

              cursor:
                "pointer",

              boxShadow:
                "0 10px 30px rgba(215,191,158,0.18)",

            }}
          >

            Enter World ✨

          </button>

        </div>

      </div>

      {/* USER */}
      <div
        style={{

          padding:
            "16px",

          borderTop:
            "1px solid rgba(255,255,255,0.06)",

          background:
            "rgba(0,0,0,0.18)",

          backdropFilter:
            "blur(20px)",

        }}
      >

        {
          user && (

            <div
              style={{

                display: "flex",

                alignItems:
                  "center",

                gap: 12,

                marginBottom: 12,

              }}
            >

              <img
                src={
                  user.photoURL ||
                  "https://via.placeholder.com/40"
                }
                alt="avatar"
                style={{

                  width: 42,

                  height: 42,

                  borderRadius:
                    "50%",

                  objectFit:
                    "cover",

                }}
              />

              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                }}
              >

                <div
                  style={{

                    color:
                      "rgba(255,255,255,0.88)",

                    fontWeight: 600,

                    fontSize: 13,

                    whiteSpace:
                      "nowrap",

                    overflow:
                      "hidden",

                    textOverflow:
                      "ellipsis",

                  }}
                >

                  {
                    user.displayName ||
                    "User"
                  }

                </div>

                <div
                  style={{

                    color:
                      "rgba(255,255,255,0.35)",

                    fontSize: 11,

                    whiteSpace:
                      "nowrap",

                    overflow:
                      "hidden",

                    textOverflow:
                      "ellipsis",

                  }}
                >

                  {
                    user.email
                  }

                </div>

              </div>

            </div>

          )
        }

        <button
          onClick={
            handleLogout
          }
          style={{

            width: "100%",

            padding:
              "12px",

            borderRadius:
              14,

            border:
              "1px solid rgba(239,68,68,0.16)",

            background:
              "rgba(239,68,68,0.08)",

            color:
              "rgba(255,120,120,0.9)",

            fontWeight: 700,

            cursor:
              "pointer",

          }}
        >

          Sign Out

        </button>

      </div>

    </aside>
  );

}