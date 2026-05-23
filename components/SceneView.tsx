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

  // Scene transitions
  useEffect(() => {

    setVisible(false);

    const timeout =
      setTimeout(() => {

        setVisible(true);

      }, 180);

    return () =>
      clearTimeout(timeout);

  }, [currentScene]);

  // Mouse movement
  useEffect(() => {

    const handleMouseMove = (
      e: MouseEvent
    ) => {

      const x =
        (e.clientX / window.innerWidth - 0.5) * 30;

      const y =
        (e.clientY / window.innerHeight - 0.5) * 30;

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

  }, []);

  // Generate particles
  useEffect(() => {

    const generatedParticles =
      [...Array(25)].map(() => ({

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

  }, []);

  // Live Clock
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

  // Audio Setup
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

  // Play / Pause Audio
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

  // Real Time Category
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
      className={`flex-1 relative overflow-hidden flex items-center justify-center transition-all duration-700 ${
        immersiveMode
          ? "w-screen"
          : ""
      }`}
    >

      {/* Background Video */}
      {
        currentScene.video && (

          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className={`absolute inset-0 object-cover transition-all duration-700 ${
              immersiveMode
                ? "scale-105 w-full h-full"
                : "w-full h-full"
            }`}
          >

            <source
              src={currentScene.video}
              type="video/mp4"
            />

          </video>

        )
      }

      {/* Overlay */}
      <div className={`absolute inset-0 transition-all duration-700 ${
        immersiveMode
          ? "bg-black/35"
          : "bg-black/45"
      }`} />

      {/* Ambient Glow */}
      <div
        className="absolute top-[10%] right-[10%] w-[550px] h-[550px] bg-amber-500/10 blur-3xl rounded-full animate-pulse transition-transform duration-300"
        style={{
          transform:
            `translate(${mousePosition.x}px, ${mousePosition.y}px)`
        }}
      />

      <div
        className="absolute bottom-[0%] left-[10%] w-[450px] h-[450px] bg-blue-500/10 blur-3xl rounded-full animate-pulse transition-transform duration-300"
        style={{
          transform:
            `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`
        }}
      />

      {/* Floating Fog */}
      <div
        className="absolute top-[25%] left-[30%] w-[400px] h-[400px] bg-white/[0.03] blur-3xl rounded-full animate-[float_12s_ease-in-out_infinite]"
      />

      {/* Particles */}
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

      {/* Main Content */}
      <div
        className={`relative z-10 text-center px-10 max-w-5xl transition-all duration-700 ease-out ${
          visible
            ? "opacity-100 scale-100 blur-0"
            : "opacity-0 scale-95 blur-md"
        }`}
        style={{
          transform:
            `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`
        }}
      >

        {/* Smart Time Label */}
        {
          shouldShowTime && (

            <div className="mb-8">

              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-zinc-200 text-lg shadow-2xl">

                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

                {time}

                <span className="text-zinc-400">

                  • {currentScene.mood} {currentScene.time}

                </span>

              </div>

            </div>

          )
        }

        {/* Emoji */}
        <div className={`drop-shadow-2xl animate-pulse transition-all duration-700 ${
          immersiveMode
            ? "text-[160px]"
            : "text-[120px]"
        }`}>

          {currentScene.emoji}

        </div>

        {/* Title */}
        <h2 className={`font-semibold tracking-tight leading-[0.95] mb-7 transition-all duration-700 ${
          immersiveMode
            ? "text-8xl md:text-9xl"
            : "text-7xl md:text-8xl"
        }`}>

          {currentScene.name}

        </h2>

        {/* Description */}
        <p className={`text-zinc-200 leading-relaxed max-w-3xl mx-auto mb-14 transition-all duration-700 ${
          immersiveMode
            ? "text-3xl"
            : "text-2xl"
        }`}>

          {currentScene.description}

        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-5 flex-wrap">

          {
            !immersiveMode && (

              <button
                onClick={enterFullscreen}
                className="bg-white text-black hover:scale-105 transition-all duration-300 px-9 py-4 rounded-2xl font-medium text-lg"
              >

                ⛶ Enter World

              </button>

            )
          }

          <button
            onClick={toggleMusic}
            className="bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300 px-9 py-4 rounded-2xl font-medium text-lg backdrop-blur-xl"
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
                onClick={exitImmersion}
                className="bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-all duration-300 px-9 py-4 rounded-2xl font-medium text-lg backdrop-blur-xl"
              >

                ✕ Exit World

              </button>

            )
          }

        </div>

      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[220px] bg-gradient-to-t from-black via-black/50 to-transparent" />

    </section>
  );

}