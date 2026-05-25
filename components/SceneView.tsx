"use client";

import React, {
  useEffect,
  useState,
} from "react";

interface Props {

  currentScene: any;

  sceneRef: React.RefObject<HTMLDivElement | null>;

  immersiveMode: boolean;

  isMobile: boolean;

}

interface Particle {

  width: number;

  height: number;

  top: number;

  left: number;

  duration: number;

}

export default function SceneView({

  currentScene,

  sceneRef,

  immersiveMode,

  isMobile,

}: Props) {

  const [particles, setParticles] =
    useState<Particle[]>([]);

  const [time, setTime] =
    useState("");

  // PARTICLES
  useEffect(() => {

    setParticles(

      Array.from(

        {
          length:
            isMobile
              ? 6
              : 18,
        },

        () => ({

          width:
            Math.random() *
              3 +
            1.5,

          height:
            Math.random() *
              3 +
            1.5,

          top:
            Math.random() *
            100,

          left:
            Math.random() *
            100,

          duration:
            Math.random() *
              5 +
            3,

        })
      )
    );

  }, [isMobile]);

  // CLOCK
  useEffect(() => {

    const tick =
      () =>

        setTime(

          new Date().toLocaleTimeString(
            [],
            {
              hour:
                "2-digit",
              minute:
                "2-digit",
            }
          )
        );

    tick();

    const id =
      setInterval(
        tick,
        1000
      );

    return () =>
      clearInterval(id);

  }, []);

  // TIME CATEGORY
  const getTimeCategory =
    () => {

      const h =
        new Date().getHours();

      if (
        h >= 5 &&
        h < 12
      )
        return "Morning";

      if (
        h >= 12 &&
        h < 17
      )
        return "Afternoon";

      if (
        h >= 17 &&
        h < 21
      )
        return "Evening";

      return "Midnight";

    };

  const showClock =
    currentScene.time ===
    getTimeCategory();

  return (
    <section
      ref={sceneRef}
      style={{

        position:
          "relative",

        width: "100%",

        height: "100%",

        background:
          "#000",

        overflow:
          "hidden",

      }}
    >

      {/* VIDEO */}
      {
        currentScene.video && (

          <video
            key={
              currentScene.video
            }
            autoPlay
            loop
            playsInline
            controls={false}
            style={{

              position:
                "absolute",

              inset: 0,

              width: "100%",

              height: "100%",

              objectFit:
                immersiveMode
                  ? "contain"
                  : "cover",

              objectPosition:
                "center",

              background:
                "#000",

              filter:
                immersiveMode
                  ? "brightness(1)"
                  : "brightness(0.92)",

              transition:
                "all 0.4s ease",

            }}
          >

            <source
              src={
                currentScene.video
              }
              type="video/mp4"
            />

          </video>

        )
      }

      {/* MAIN OVERLAY */}
      <div
        style={{

          position:
            "absolute",

          inset: 0,

          background:

            immersiveMode

              ? "linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.15), rgba(0,0,0,0.35))"

              : "linear-gradient(to top, rgba(0,0,0,0.68), rgba(0,0,0,0.08), rgba(0,0,0,0.42))",

          pointerEvents:
            "none",

        }}
      />

      {/* VIGNETTE */}
      <div
        style={{

          position:
            "absolute",

          inset: 0,

          background:
            "radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.35) 100%)",

          pointerEvents:
            "none",

        }}
      />

      {/* PARTICLES */}
      <div
        style={{

          position:
            "absolute",

          inset: 0,

          overflow:
            "hidden",

          pointerEvents:
            "none",

        }}
      >

        {
          particles.map(
            (p, i) => (

              <div
                key={i}
                style={{

                  position:
                    "absolute",

                  width:
                    p.width,

                  height:
                    p.height,

                  borderRadius:
                    "50%",

                  background:
                    "rgba(255,255,255,0.12)",

                  top:
                    `${p.top}%`,

                  left:
                    `${p.left}%`,

                  animation:
                    `pulse ${p.duration}s ease-in-out infinite`,

                }}
              />

            )
          )
        }

      </div>

      {/* CLOCK */}
      {
        showClock &&
        !immersiveMode && (

          <div
            style={{

              position:
                "absolute",

              top: 24,

              left: 24,

              zIndex: 10,

            }}
          >

            <div
              style={{

                display:
                  "inline-flex",

                alignItems:
                  "center",

                gap: 8,

                padding:
                  isMobile
                    ? "8px 14px"
                    : "10px 18px",

                borderRadius:
                  999,

                background:
                  "rgba(255,255,255,0.06)",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                backdropFilter:
                  "blur(18px)",

                WebkitBackdropFilter:
                  "blur(18px)",

                fontSize:
                  isMobile
                    ? 12
                    : 14,

                color:
                  "rgba(255,255,255,0.84)",

                fontFamily:
                  "'Inter', sans-serif",

              }}
            >

              <span
                style={{

                  width: 7,

                  height: 7,

                  borderRadius:
                    "50%",

                  background:
                    "#4ade80",

                  animation:
                    "livePulse 2s ease infinite",

                }}
              />

              {time}

            </div>

          </div>

        )
      }

      {/* CINEMATIC GLOW */}
      <div
        style={{

          position:
            "absolute",

          bottom: -180,

          left: "50%",

          transform:
            "translateX(-50%)",

          width: 700,

          height: 300,

          background:
            "radial-gradient(circle, rgba(255,200,120,0.12), transparent 70%)",

          filter:
            "blur(80px)",

          pointerEvents:
            "none",

        }}
      />

      <style>{`

        @keyframes pulse {

          0%,100% {
            opacity: 1;
          }

          50% {
            opacity: 0.35;
          }

        }

        @keyframes livePulse {

          0%,100% {
            box-shadow: 0 0 0 0 rgba(74,222,128,0.6);
          }

          60% {
            box-shadow: 0 0 0 5px rgba(74,222,128,0);
          }

        }

      `}</style>

    </section>
  );

}