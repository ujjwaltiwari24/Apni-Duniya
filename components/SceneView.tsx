"use client";

import {
  useEffect,
  useState,
  useCallback,
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
  const [visible, setVisible] = useState(true);
  const [time, setTime] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mouseRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sceneChangeRef = useRef<string>("");

  // Scene fade with optimization
  useEffect(() => {
    if (sceneChangeRef.current === currentScene?.id) return;
    sceneChangeRef.current = currentScene?.id;

    setIsTransitioning(true);
    setVisible(false);

    const t = setTimeout(() => {
      setVisible(true);
      setIsTransitioning(false);
    }, 150);

    return () => clearTimeout(t);
  }, [currentScene?.id]);

  // Mouse parallax with throttling
  useEffect(() => {
    if (isMobile || isTransitioning) return;

    let ticking = false;

    const handler = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setMousePosition({
            x: (e.clientX / window.innerWidth - 0.5) * 10,
            y: (e.clientY / window.innerHeight - 0.5) * 10,
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("mousemove", handler, { passive: true });

    return () => window.removeEventListener("mousemove", handler);
  }, [isMobile, isTransitioning]);

  // Particles optimization
  useEffect(() => {
    setParticles(
      Array.from(
        {
          length: isMobile ? 4 : 16,
        },
        () => ({
          width: Math.random() * 3 + 1.5,
          height: Math.random() * 3 + 1.5,
          top: Math.random() * 100,
          left: Math.random() * 100,
          duration: Math.random() * 5 + 3,
        })
      )
    );
  }, [isMobile]);

  // Clock update
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );

    tick();

    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  }, []);

  // Fullscreen handlers
  const handleEnterWorld = useCallback(async () => {
    try {
      await enterFullscreen();
    } catch (e) {
      console.error("Fullscreen error:", e);
    }
  }, [enterFullscreen]);

  const handleExitWorld = useCallback(async () => {
    try {
      (screen as any).orientation?.unlock?.();
    } catch (_) {}
    exitImmersion();
  }, [exitImmersion]);

  // Time category logic
  const getTimeCategory = () => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "Morning";
    if (h >= 12 && h < 17) return "Afternoon";
    if (h >= 17 && h < 21) return "Evening";
    return "Midnight";
  };

  const showClock = currentScene.time === getTimeCategory();

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
      {/* VIDEO BACKGROUND */}
      {currentScene.video && (
        <video
          key={currentScene.video}
          autoPlay
          loop
          playsInline
          controls={false}
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

      {/* OVERLAY GRADIENT */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.3) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* PARTICLES */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
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

      {/* CONTENT */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: immersiveMode
            ? "20px"
            : isMobile
            ? "0 20px"
            : "0 40px",
          maxWidth: immersiveMode ? "80%" : isMobile ? 340 : 680,
          transition: "opacity 0.4s ease, transform 0.4s ease",
          opacity: visible ? 1 : 0,
          transform: visible
            ? `scale(1) translate(${!isMobile && !isTransitioning ? mousePosition.x * 0.15 : 0}px, ${!isMobile && !isTransitioning ? mousePosition.y * 0.15 : 0}px)`
            : "scale(0.97)",
        }}
      >
        {/* CLOCK DISPLAY */}
        {showClock && !immersiveMode && (
          <div
            style={{
              marginBottom: isMobile ? 14 : 22,
              animation: "fadeIn 0.6s ease 0.2s both",
            }}
          >
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
                WebkitBackdropFilter: "blur(16px)",
                fontSize: isMobile ? 12 : 15,
                color: "rgba(255,255,255,0.85)",
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#4ade80",
                  animation: "livePulse 2s ease infinite",
                }}
              />
              {time}
            </div>
          </div>
        )}

        {/* EMOJI */}
        <div
          style={{
            fontSize: immersiveMode
              ? isMobile
                ? 40
                : 80
              : isMobile
              ? 44
              : 72,
            marginBottom: isMobile ? 6 : 12,
            lineHeight: 1,
            animation: "fadeIn 0.6s ease 0.1s both",
          }}
        >
          {currentScene.emoji}
        </div>

        {/* TITLE */}
        <h2
          style={{
            fontSize: immersiveMode
              ? isMobile
                ? 22
                : 70
              : isMobile
              ? 30
              : 56,
            lineHeight: 1,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "#fff",
            marginBottom: isMobile ? 8 : 14,
            textShadow: "0 4px 30px rgba(0,0,0,0.5)",
            fontFamily: "'Playfair Display', Georgia, serif",
            animation: "fadeIn 0.6s ease 0.15s both",
          }}
        >
          {currentScene.name}
        </h2>

        {/* DESCRIPTION */}
        {(!isMobile || immersiveMode) && (
          <p
            style={{
              fontSize: immersiveMode
                ? isMobile
                  ? 11
                  : 20
                : isMobile
                ? 13
                : 17,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.72)",
              maxWidth: isMobile ? 280 : 520,
              margin: "0 auto",
              marginBottom: immersiveMode ? 20 : isMobile ? 18 : 32,
              fontFamily: "'Inter', system-ui, sans-serif",
              animation: "fadeIn 0.6s ease 0.2s both",
            }}
          >
            {currentScene.description}
          </p>
        )}

        {/* BUTTON */}
        <button
          onClick={immersiveMode ? handleExitWorld : handleEnterWorld}
          style={{
            padding: isMobile ? "13px 20px" : "15px 28px",
            borderRadius: 16,
            background: immersiveMode
              ? "rgba(239,68,68,0.18)"
              : "rgba(237,232,224,0.95)",
            color: immersiveMode ? "#fff" : "#0a0c10",
            border: immersiveMode
              ? "1px solid rgba(239,68,68,0.3)"
              : "none",
            fontWeight: 700,
            fontSize: isMobile ? 13 : 16,
            cursor: "pointer",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            minWidth: isMobile ? 140 : 190,
            transition: "all 0.2s ease",
            fontFamily: "'Inter', system-ui, sans-serif",
            animation: "fadeIn 0.6s ease 0.25s both",
          }}
          onMouseEnter={(e) => {
            if (!immersiveMode) {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 8px 32px rgba(237,232,224,0.3)";
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          {immersiveMode ? "✕ Exit World" : "⛶ Enter World"}
        </button>
      </div>

      {/* BOTTOM BADGE */}
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
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            fontSize: 12,
            color: "rgba(255,255,255,0.55)",
            zIndex: 10,
            animation: "fadeIn 0.6s ease 0.35s both",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#4ade80",
              animation: "livePulse 2s ease infinite",
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

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes livePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.6); }
          60% { box-shadow: 0 0 0 5px rgba(74,222,128,0); }
        }
      `}</style>
    </section>
  );
}