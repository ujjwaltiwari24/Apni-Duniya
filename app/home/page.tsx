"use client";

import {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  auth,
} from "@/firebase/config";

import {
  onAuthStateChanged,
  User,
} from "firebase/auth";

import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";

import SceneView from "@/components/SceneView";

import { scenes } from "@/data/scenes";

type SceneType =
  (typeof scenes)[0];

export default function HomePage() {

  const router = useRouter();

  const sceneRef =
    useRef<HTMLDivElement>(null);

  const [user, setUser] =
    useState<User | null>(null);

  const [immersiveMode, setImmersiveMode] =
    useState(false);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [isMobile, setIsMobile] =
    useState(false);

  const [currentScene, setCurrentScene] =
    useState<SceneType>(
      scenes[0]
    );

  // Detect Mobile
  useEffect(() => {

    const handleResize = () => {

      setIsMobile(
        window.innerWidth < 768
      );

    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

    };

  }, []);

  // Auth
  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {

          if (!currentUser) {

            router.push("/login");

          } else {

            setUser(currentUser);

          }

        }
      );

    return () => unsubscribe();

  }, []);

  // Fullscreen
  const enterFullscreen =
    async () => {

      setImmersiveMode(true);

      if (sceneRef.current) {

        try {

          await sceneRef.current.requestFullscreen();

        } catch (error) {

          console.log(error);

        }

      }

    };

  const exitImmersion =
    async () => {

      setImmersiveMode(false);

      if (document.fullscreenElement) {

        try {

          await document.exitFullscreen();

        } catch (error) {

          console.log(error);

        }

      }

    };

  // Close sidebar on scene change mobile
  const handleSceneChange = (
    scene: SceneType
  ) => {

    setCurrentScene(scene);

    if (isMobile) {

      setSidebarOpen(false);

    }

  };

  return (
    <main
      style={{
        height: "100dvh",
        width: "100%",
        background: "#000",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        touchAction: "manipulation",
      }}
    >

      {/* MOBILE TOPBAR */}
      {
        isMobile &&
        !immersiveMode && (

          <div
            style={{
              position: "fixed",

              top: 0,
              left: 0,
              right: 0,

              height: 64,

              zIndex: 100,

              display: "flex",

              alignItems: "center",

              justifyContent:
                "space-between",

              padding:
                "0 16px",

              background:
                "rgba(0,0,0,0.45)",

              backdropFilter:
                "blur(18px)",

              WebkitBackdropFilter:
                "blur(18px)",

              borderBottom:
                "1px solid rgba(255,255,255,0.06)",
            }}
          >

            {/* Logo */}
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,

                color: "white",

                letterSpacing:
                  "-0.06em",

                fontFamily:
                  "Inter, sans-serif",
              }}
            >

              Apni

              <span
                style={{
                  color:
                    "#d8c2a3",
                }}
              >

                Duniya

              </span>

            </div>

            {/* Menu Button */}
            <button
              onClick={() =>
                setSidebarOpen(
                  !sidebarOpen
                )
              }

              style={{
                width: 44,
                height: 44,

                borderRadius: 14,

                border:
                  "1px solid rgba(255,255,255,0.08)",

                background:
                  "rgba(255,255,255,0.05)",

                color: "white",

                fontSize: 20,

                cursor: "pointer",

                flexShrink: 0,
              }}
            >

              ☰

            </button>

          </div>

        )
      }

      {/* DESKTOP SIDEBAR */}
      {
        !isMobile &&
        !immersiveMode && (

          <Sidebar
            scenes={scenes}
            currentScene={
              currentScene
            }
            setCurrentScene={
              handleSceneChange
            }
            user={user}
          />

        )
      }

      {/* MOBILE SIDEBAR */}
      {
        isMobile &&
        sidebarOpen &&
        !immersiveMode && (

          <>
            {/* Overlay */}
            <div
              onClick={() =>
                setSidebarOpen(false)
              }

              style={{
                position: "fixed",
                inset: 0,

                background:
                  "rgba(0,0,0,0.55)",

                backdropFilter:
                  "blur(6px)",

                WebkitBackdropFilter:
                  "blur(6px)",

                zIndex: 120,
              }}
            />

            {/* Drawer */}
            <div
              style={{
                position: "fixed",

                top: 0,
                left: 0,
                bottom: 0,

                width: "82%",

                maxWidth: 300,

                zIndex: 130,

                background:
                  "rgba(10,10,10,0.97)",

                borderRight:
                  "1px solid rgba(255,255,255,0.06)",

                backdropFilter:
                  "blur(20px)",

                WebkitBackdropFilter:
                  "blur(20px)",

                overflowY: "auto",

                overflowX: "hidden",

                paddingTop: 12,
              }}
            >

              <Sidebar
                scenes={scenes}

                currentScene={
                  currentScene
                }

                setCurrentScene={
                  handleSceneChange
                }

                user={user}
              />

            </div>

          </>

        )
      }

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,

          width: "100%",

          height: "100dvh",

          overflow: "hidden",

          position: "relative",

          marginTop:
            isMobile &&
            !immersiveMode
              ? 64
              : 0,
        }}
      >

        <SceneView
          currentScene={
            currentScene
          }

          enterFullscreen={
            enterFullscreen
          }

          sceneRef={sceneRef}

          immersiveMode={
            immersiveMode
          }

          exitImmersion={
            exitImmersion
          }

          isMobile={isMobile}
        />

      </div>

    </main>
  );

}