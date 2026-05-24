"use client";

import {
  useState,
  useRef,
  useEffect,
} from "react";

import Sidebar from "@/components/Sidebar";
import MobileApp from "@/components/MobileApp";
import SceneView from "@/components/SceneView";

import { scenes } from "@/data/scenes";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  auth,
} from "@/firebase/config";

type SceneType =
  (typeof scenes)[0];

export default function HomePage() {

  const sceneRef =
    useRef<HTMLDivElement>(null);

  const immersiveRef =
    useRef<HTMLDivElement>(null);

  const [immersiveMode, setImmersiveMode] =
    useState(false);

  const [isMobile, setIsMobile] =
    useState(false);

  const [currentScene, setCurrentScene] =
    useState<SceneType>(
      scenes[0]
    );

  const [user, setUser] =
    useState<any>(null);

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

    return () => {

      window.removeEventListener(
        "resize",
        check
      );

    };

  }, []);

  // FULLSCREEN LISTENER
  useEffect(() => {

    const onFsChange =
      () => {

        if (
          !document.fullscreenElement
        ) {

          setImmersiveMode(false);

          try {

            // @ts-ignore
            screen.orientation?.unlock?.();

          } catch (_) {}

        }

      };

    document.addEventListener(
      "fullscreenchange",
      onFsChange
    );

    return () => {

      document.removeEventListener(
        "fullscreenchange",
        onFsChange
      );

    };

  }, []);

  // ENTER WORLD
  const enterFullscreen =
    async () => {

      try {

        setImmersiveMode(true);

        const el =
          isMobile
            ? immersiveRef.current
            : sceneRef.current;

        if (!el) return;

        if (
          !document.fullscreenElement
        ) {

          await el.requestFullscreen();

        }

        // MOBILE LANDSCAPE
        if (isMobile) {

          try {

            // @ts-ignore
            await screen.orientation?.lock?.(
              "landscape"
            );

          } catch (_) {}

        }

      } catch (err) {

        console.log(err);

      }

    };

  // EXIT WORLD
  const exitImmersion =
    async () => {

      try {

        setImmersiveMode(false);

        if (
          document.fullscreenElement
        ) {

          await document.exitFullscreen();

        }

        try {

          // @ts-ignore
          screen.orientation?.unlock?.();

        } catch (_) {}

      } catch (err) {

        console.log(err);

      }

    };

  // CHANGE SCENE
  const handleSceneChange = (
    scene: SceneType
  ) => {

    setCurrentScene(scene);

  };

  return (
    <>
      {/* GLOBAL STYLES */}
      <style>{`

        * {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }

        html,
        body {

          margin: 0;
          padding: 0;

          width: 100%;
          min-height: 100%;

          overflow-x: hidden;
          overflow-y: auto;

          background:
            radial-gradient(circle at top,
              #151823 0%,
              #0c0e14 45%,
              #07090e 100%
            );

          font-family:
            Inter,
            sans-serif;

          color: white;

          scroll-behavior: smooth;

        }

        body {

          overscroll-behavior-y: auto;

        }

        ::-webkit-scrollbar {
          width: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 999px;
        }

        .glass {
          background:
            rgba(255,255,255,0.05);

          backdrop-filter:
            blur(16px);

          border:
            1px solid rgba(255,255,255,0.08);
        }

      `}</style>

      {/* DESKTOP */}
      {
        !isMobile && (

          <div
            style={{

              display: "flex",

              width: "100vw",

              height: "100vh",

              overflow: "hidden",

            }}
          >

            {/* SIDEBAR */}
            {
              !immersiveMode && (

                <div
                  className="glass"
                  style={{

                    width: 340,

                    height: "100vh",

                    borderRight:
                      "1px solid rgba(255,255,255,0.06)",

                  }}
                >

                  <Sidebar
                    scenes={scenes}
                    currentScene={currentScene}
                    setCurrentScene={handleSceneChange}
                    user={user}
                  />

                </div>

              )
            }

            {/* SCENE */}
            <div
              ref={sceneRef}
              style={{

                flex: 1,

                position:
                  "relative",

                overflow:
                  "hidden",

                minWidth: 0,

              }}
            >

              <SceneView
                currentScene={currentScene}
                enterFullscreen={enterFullscreen}
                sceneRef={sceneRef}
                immersiveMode={immersiveMode}
                exitImmersion={exitImmersion}
                isMobile={false}
              />

            </div>

          </div>

        )
      }

      {/* MOBILE */}
      {
        isMobile &&
        !immersiveMode && (

          <div
            style={{

              width: "100vw",

              minHeight: "100vh",

              overflowX:
                "hidden",

              overflowY:
                "auto",

              WebkitOverflowScrolling:
                "touch",

            }}
          >

            <MobileApp
              scenes={scenes}
              currentScene={currentScene}
              setCurrentScene={handleSceneChange}
              enterFullscreen={enterFullscreen}
              user={user}
            />

          </div>

        )
      }

      {/* MOBILE IMMERSIVE */}
      {
        isMobile &&
        immersiveMode && (

          <div
            ref={immersiveRef}
            style={{

              position: "fixed",

              inset: 0,

              background: "#000",

              zIndex: 99999,

              overflow: "hidden",

            }}
          >

            {/* VIDEO */}
            <video
              autoPlay
              muted
              loop
              playsInline
              style={{

                width: "100%",

                height: "100%",

                objectFit:
                  "cover",

              }}
            >

              {
                currentScene.video && (

                  <source
                    src={
                      currentScene.video
                    }
                    type="video/mp4"
                  />

                )
              }

            </video>

            {/* OVERLAY */}
            <div
              style={{

                position:
                  "absolute",

                inset: 0,

                background:
                  "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.15))",

              }}
            />

            {/* INFO */}
            <div
              style={{

                position:
                  "absolute",

                left: 20,

                bottom: 20,

                right: 20,

                zIndex: 10,

              }}
            >

              <div
                style={{
                  fontSize: 34,
                  marginBottom: 8,
                }}
              >

                {
                  currentScene.emoji
                }

              </div>

              <h1
                style={{

                  margin: 0,

                  fontSize: 28,

                  fontWeight: 700,

                  lineHeight: 1.2,

                }}
              >

                {
                  currentScene.name
                }

              </h1>

              <p
                style={{

                  marginTop: 10,

                  opacity: 0.78,

                  lineHeight: 1.7,

                  fontSize: 13,

                  maxWidth: 420,

                }}
              >

                {
                  currentScene.description
                }

              </p>

            </div>

            {/* EXIT BUTTON */}
            <button
              onClick={
                exitImmersion
              }
              className="glass"
              style={{

                position:
                  "absolute",

                top: 16,

                right: 16,

                width: 46,

                height: 46,

                borderRadius:
                  "50%",

                color:
                  "white",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                cursor:
                  "pointer",

                zIndex: 20,

              }}
            >

              ✕

            </button>

          </div>

        )
      }
    </>
  );

}