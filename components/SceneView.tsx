"use client";

import {
  useEffect,
  useState,
  useRef,
} from "react";

interface Props {

  currentScene: any;

  enterFullscreen: () => void;

  sceneRef: any;

  immersiveMode: boolean;

  exitImmersion: () => void;

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

  enterFullscreen,

  sceneRef,

  immersiveMode,

  exitImmersion,

  isMobile,

}: Props) {

  const videoRef =
    useRef<HTMLVideoElement>(null);

  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const [visible, setVisible] =
    useState(true);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [time, setTime] =
    useState("");

  const [mousePosition, setMousePosition] =
    useState({
      x: 0,
      y: 0,
    });

  const [particles, setParticles] =
    useState<Particle[]>([]);

  // Scene transition
  useEffect(() => {

    setVisible(false);

    const timeout =
      setTimeout(() => {

        setVisible(true);

      }, 180);

    return () =>
      clearTimeout(timeout);

  }, [currentScene]);

  // Mouse effect desktop only
  useEffect(() => {

    if (isMobile) return;

    const handleMouseMove = (
      e: MouseEvent
    ) => {

      const x =
        (e.clientX / window.innerWidth - 0.5) * 20;

      const y =
        (e.clientY / window.innerHeight - 0.5) * 20;

      setMousePosition({ x, y });

    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () => {

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

    };

  }, [isMobile]);

  // Particles
  useEffect(() => {

    const generatedParticles =
      [...Array(isMobile ? 10 : 25)].map(() => ({

        width:
          Math.random() * 4 + 2,

        height:
          Math.random() * 4 + 2,

        top:
          Math.random() * 100,

        left:
          Math.random() * 100,

        duration:
          Math.random() * 5 + 3,

      }));

    setParticles(generatedParticles);

  }, [isMobile]);

  // Clock
  useEffect(() => {

    const updateClock = () => {

      const now =
        new Date();

      const formatted =
        now.toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );

      setTime(formatted);

    };

    updateClock();

    const interval =
      setInterval(updateClock, 1000);

    return () =>
      clearInterval(interval);

  }, []);

  // Audio
  useEffect(() => {

    if (audioRef.current) {

      audioRef.current.pause();

    }

    if (currentScene.music) {

      audioRef.current =
        new Audio(currentScene.music);

      audioRef.current.loop = true;

      audioRef.current.volume = 0.65;

    }

    setIsPlaying(false);

  }, [currentScene]);

  // Toggle music
  const toggleMusic = async () => {

    if (!audioRef.current) return;

    if (isPlaying) {

      audioRef.current.pause();

      setIsPlaying(false);

    } else {

      try {

        await audioRef.current.play();

        setIsPlaying(true);

      } catch (error) {

        console.error(error);

      }

    }

  };

  // Time label
  const getRealTimeCategory = () => {

    const hour =
      new Date().getHours();

    if (hour >= 5 && hour < 12) {

      return "Morning";

    }

    if (hour >= 12 && hour < 17) {

      return "Afternoon";

    }

    if (hour >= 17 && hour < 21) {

      return "Evening";

    }

    return "Midnight";

  };

  const shouldShowTime =
    currentScene.time ===
    getRealTimeCategory();

  return (
    <section
      ref={sceneRef}
      className="relative flex-1 overflow-hidden flex items-center justify-center"
    >

      {/* VIDEO */}
      {
        currentScene.video && (

          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform:
                immersiveMode
                  ? "scale(1.03)"
                  : "scale(1)",
            }}
          >

            <source
              src={currentScene.video}
              type="video/mp4"
            />

          </video>

        )
      }

      {/* OVERLAY */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.82), rgba(0,0,0,0.32), rgba(0,0,0,0.58))",
        }}
      />

      {/* GLOW */}
      {
        !isMobile && (

          <>
            <div
              className="absolute top-[10%] right-[10%] rounded-full blur-3xl"
              style={{
                width: 500,
                height: 500,

                background:
                  "rgba(245,158,11,0.08)",

                transform:
                  `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
              }}
            />

            <div
              className="absolute bottom-[0%] left-[10%] rounded-full blur-3xl"
              style={{
                width: 420,
                height: 420,

                background:
                  "rgba(59,130,246,0.08)",

                transform:
                  `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
              }}
            />

          </>

        )
      }

      {/* PARTICLES */}
      <div className="absolute inset-0 overflow-hidden">

        {
          particles.map((particle, i) => (

            <div
              key={i}
              className="absolute bg-white/10 rounded-full animate-pulse"
              style={{
                width: `${particle.width}px`,
                height: `${particle.height}px`,
                top: `${particle.top}%`,
                left: `${particle.left}%`,
                animationDuration: `${particle.duration}s`,
              }}
            />

          ))
        }

      </div>

      {/* CONTENT */}
      <div
        className={`relative z-10 text-center transition-all duration-700 ${
          visible
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95"
        }`}
        style={{
          padding:
            isMobile
              ? "0 18px"
              : "0 40px",

          maxWidth:
            isMobile
              ? 360
              : 1200,

          transform:
            !isMobile
              ? `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`
              : "none",
        }}
      >

        {/* TIME */}
        {
          shouldShowTime && (

            <div
              style={{
                marginBottom:
                  isMobile
                    ? 22
                    : 34,
              }}
            >

              <div
                style={{
                  display:
                    "inline-flex",

                  alignItems:
                    "center",

                  gap: 10,

                  padding:
                    isMobile
                      ? "10px 16px"
                      : "12px 22px",

                  borderRadius: 999,

                  background:
                    "rgba(255,255,255,0.05)",

                  border:
                    "1px solid rgba(255,255,255,0.08)",

                  backdropFilter:
                    "blur(18px)",

                  fontSize:
                    isMobile
                      ? 14
                      : 18,

                  color:
                    "rgba(255,255,255,0.86)",
                }}
              >

                <span
                  className="animate-pulse"
                  style={{
                    width: 8,
                    height: 8,

                    borderRadius:
                      "50%",

                    background:
                      "#4ade80",
                  }}
                />

                {time}

                <span
                  style={{
                    color:
                      "rgba(255,255,255,0.45)",
                  }}
                >

                  • {currentScene.mood} {currentScene.time}

                </span>

              </div>

            </div>

          )
        }

        {/* EMOJI */}
        <div
          style={{
            fontSize:
              isMobile
                ? 74
                : immersiveMode
                ? 150
                : 120,

            marginBottom:
              isMobile
                ? 8
                : 18,
          }}
        >

          {currentScene.emoji}

        </div>

        {/* TITLE */}
        <h2
          style={{
            fontSize:
              isMobile
                ? 54
                : immersiveMode
                ? 120
                : 92,

            lineHeight: 0.92,

            fontWeight: 700,

            letterSpacing:
              "-0.06em",

            marginBottom:
              isMobile
                ? 18
                : 26,
          }}
        >

          {currentScene.name}

        </h2>

        {/* DESCRIPTION */}
        <p
          style={{
            fontSize:
              isMobile
                ? 16
                : immersiveMode
                ? 30
                : 24,

            lineHeight: 1.8,

            color:
              "rgba(255,255,255,0.76)",

            maxWidth:
              isMobile
                ? 320
                : 760,

            margin:
              "0 auto",

            marginBottom:
              isMobile
                ? 34
                : 54,
          }}
        >

          {currentScene.description}

        </p>

        {/* BUTTONS */}
        <div
          style={{
            display: "flex",

            justifyContent:
              "center",

            gap:
              isMobile
                ? 12
                : 18,

            flexWrap: "wrap",
          }}
        >

          {
            !immersiveMode && (

              <button
                onClick={
                  enterFullscreen
                }

                style={{
                  width:
                    isMobile
                      ? "100%"
                      : 280,

                  maxWidth: 320,

                  padding:
                    isMobile
                      ? "16px 18px"
                      : "18px 24px",

                  borderRadius: 20,

                  background:
                    "white",

                  color: "black",

                  border: "none",

                  fontWeight: 600,

                  fontSize:
                    isMobile
                      ? 15
                      : 18,
                }}
              >

                ⛶ Enter World

              </button>

            )
          }

          <button
            onClick={toggleMusic}

            style={{
              width:
                isMobile
                  ? "100%"
                  : 280,

              maxWidth: 320,

              padding:
                isMobile
                  ? "16px 18px"
                  : "18px 24px",

              borderRadius: 20,

              background:
                "rgba(255,255,255,0.05)",

              border:
                "1px solid rgba(255,255,255,0.08)",

              backdropFilter:
                "blur(18px)",

              color: "white",

              fontWeight: 600,

              fontSize:
                isMobile
                  ? 15
                  : 18,
            }}
          >

            {
              isPlaying
                ? "⏸ Pause Ambience"
                : "🎵 Play Ambience"
            }

          </button>

          {
            immersiveMode && (

              <button
                onClick={
                  exitImmersion
                }

                style={{
                  width:
                    isMobile
                      ? "100%"
                      : 280,

                  maxWidth: 320,

                  padding:
                    isMobile
                      ? "16px 18px"
                      : "18px 24px",

                  borderRadius: 20,

                  background:
                    "rgba(239,68,68,0.15)",

                  border:
                    "1px solid rgba(239,68,68,0.28)",

                  color: "white",

                  fontWeight: 600,

                  fontSize:
                    isMobile
                      ? 15
                      : 18,
                }}
              >

                ✕ Exit World

              </button>

            )
          }

        </div>

      </div>

      {/* BOTTOM GRADIENT */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height:
            isMobile
              ? 140
              : 220,

          background:
            "linear-gradient(to top, rgba(0,0,0,0.95), transparent)",
        }}
      />

    </section>
  );

}