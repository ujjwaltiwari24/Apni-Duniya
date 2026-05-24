"use client";

import { useEffect, useState, useRef } from "react";

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [visible, setVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);

  // Scene fade transition
  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, [currentScene]);

  // Mouse parallax (desktop only)
  useEffect(() => {
    if (isMobile) return;
    const handler = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [isMobile]);

  // Generate particles
  useEffect(() => {
    setParticles(
      Array.from({ length: isMobile ? 6 : 20 }, () => ({
        width: Math.random() * 3 + 1.5,
        height: Math.random() * 3 + 1.5,
        top: Math.random() * 100,
        left: Math.random() * 100,
        duration: Math.random() * 5 + 3,
      }))
    );
  }, [isMobile]);

  // Clock
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Audio swap on scene change
  useEffect(() => {
    audioRef.current?.pause();
    if (currentScene.music) {
      audioRef.current = new Audio(currentScene.music);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.65;
    }
    setIsPlaying(false);
  }, [currentScene]);

  const toggleMusic = async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleEnterWorld = async () => {
    try {
      await enterFullscreen();
      if (isMobile) {
        // @ts-ignore
        await screen.orientation?.lock?.("landscape");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleExitWorld = async () => {
    try {
      // @ts-ignore
      screen.orientation?.unlock?.();
    } catch (e) {}
    exitImmersion();
  };

  const getTimeCategory = () => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "Morning";
    if (h >= 12 && h < 17) return "Afternoon";
    if (h >= 17 && h < 21) return "Evening";
    return "Midnight";
  };
  const showClock = currentScene.time === getTimeCategory();

  // ── DESKTOP / IMMERSIVE VIEW ──
  // On desktop: full viewport scene with sidebar alongside
  // On mobile immersive: full fullscreen
  return (
    <section
      ref={sceneRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: isMobile ? "100vh" : undefined,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* VIDEO */}
      {currentScene.video && (
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
            objectFit: immersiveMode ? "contain" : "cover",
            objectPosition: "center",
            background: "#000",
          }}
        >
          <source src={currentScene.video} type="video/mp4" />
        </video>
      )}

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.3) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Particles */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {particles.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: p.width,
              height: p.height,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              top: `${p.top}%`,
              left: `${p.left}%`,
              animation: `pulse ${p.duration}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* CENTERED CONTENT */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: immersiveMode ? "20px" : isMobile ? "0 20px" : "0 40px",
          maxWidth: immersiveMode ? "80%" : isMobile ? 340 : 680,
          transition: "opacity 0.5s, transform 0.5s",
          opacity: visible ? 1 : 0,
          transform: visible
            ? `scale(1) translate(${!isMobile ? mousePosition.x * 0.15 : 0}px, ${!isMobile ? mousePosition.y * 0.15 : 0}px)`
            : "scale(0.97)",
        }}
      >
        {/* Live clock badge */}
        {showClock && !immersiveMode && (
          <div style={{ marginBottom: isMobile ? 14 : 22 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: isMobile ? "7px 14px" : "10px 18px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(16px)",
                fontSize: isMobile ? 12 : 15,
                color: "rgba(255,255,255,0.85)",
                fontFamily: "-apple-system,sans-serif",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#4ade80",
                  display: "inline-block",
                  animation: "pulse 2s infinite",
                }}
              />
              {time}
            </div>
          </div>
        )}

        {/* Emoji */}
        <div
          style={{
            fontSize: immersiveMode ? (isMobile ? 40 : 80) : isMobile ? 44 : 72,
            marginBottom: isMobile ? 6 : 12,
            lineHeight: 1,
          }}
        >
          {currentScene.emoji}
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: immersiveMode
              ? isMobile ? 22 : 70
              : isMobile ? 30 : 56,
            lineHeight: 1.0,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "#fff",
            marginBottom: isMobile ? 8 : 14,
            textShadow: "0 4px 30px rgba(0,0,0,0.5)",
            wordBreak: "break-word",
          }}
        >
          {currentScene.name}
        </h2>

        {/* Description */}
        {(!isMobile || immersiveMode) && (
          <p
            style={{
              fontSize: immersiveMode ? (isMobile ? 11 : 20) : isMobile ? 13 : 17,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.7)",
              maxWidth: isMobile ? 280 : 520,
              margin: "0 auto",
              marginBottom: immersiveMode ? 20 : isMobile ? 18 : 32,
              textShadow: "0 2px 10px rgba(0,0,0,0.4)",
            }}
          >
            {currentScene.description}
          </p>
        )}

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            flexWrap: "wrap",
            marginTop: isMobile && !immersiveMode ? 8 : 0,
          }}
        >
          {/* Enter / Exit */}
          <button
            onClick={immersiveMode ? handleExitWorld : handleEnterWorld}
            style={{
              padding: isMobile ? "13px 20px" : "15px 28px",
              borderRadius: 16,
              background: immersiveMode ? "rgba(239,68,68,0.18)" : "rgba(237,232,224,0.95)",
              color: immersiveMode ? "#fff" : "#0a0c10",
              border: immersiveMode ? "1px solid rgba(239,68,68,0.3)" : "none",
              fontWeight: 700,
              fontSize: isMobile ? 13 : 16,
              cursor: "pointer",
              fontFamily: "-apple-system,sans-serif",
              letterSpacing: "0.01em",
              backdropFilter: "blur(16px)",
              transition: "transform 0.2s",
              minWidth: isMobile ? 130 : 180,
            }}
          >
            {immersiveMode ? "✕ Exit World" : "⛶ Enter World"}
          </button>

          {/* Music */}
          <button
            onClick={toggleMusic}
            style={{
              padding: isMobile ? "13px 20px" : "15px 28px",
              borderRadius: 16,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(16px)",
              color: "#fff",
              fontWeight: 600,
              fontSize: isMobile ? 13 : 16,
              cursor: "pointer",
              fontFamily: "-apple-system,sans-serif",
              minWidth: isMobile ? 120 : 160,
            }}
          >
            {isPlaying ? "⏸ Pause" : "🎵 Play"}
          </button>
        </div>
      </div>

      {/* Desktop scene info badge (bottom left, non-immersive) */}
      {!isMobile && !immersiveMode && (
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 24,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            borderRadius: 100,
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            fontFamily: "-apple-system,sans-serif",
            fontSize: 12,
            color: "rgba(255,255,255,0.55)",
            zIndex: 10,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#4ade80",
              display: "inline-block",
              animation: "pulse 2s infinite",
            }}
          />
          {currentScene.time} · {currentScene.mood}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}