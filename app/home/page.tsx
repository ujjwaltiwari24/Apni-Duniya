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
    useState(scenes[0]);

  // Detect mobile
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

  // Auth check
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

        await sceneRef.current.requestFullscreen();

      }

    };

  const exitImmersion =
    async () => {

      setImmersiveMode(false);

      if (document.fullscreenElement) {

        await document.exitFullscreen();

      }

    };

  return (
    <main
      style={{
        height: "100vh",
        width: "100%",
        background: "#000",
        color: "white",
        overflow: "hidden",
        position: "relative",
        display: "flex",
      }}
    >

      {/* Mobile Top Bar */}
      {
        isMobile &&
        !immersiveMode && (

          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,

              zIndex: 60,

              height: 64,

              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",

              padding:
                "0 16px",

              backdropFilter:
                "blur(18px)",

              background:
                "rgba(0,0,0,0.45)",

              borderBottom:
                "1px solid rgba(255,255,255,0.06)",
            }}
          >

            {/* Logo */}
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,

                letterSpacing:
                  "-0.05em",
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
                width: 42,
                height: 42,

                borderRadius: 14,

                border:
                  "1px solid rgba(255,255,255,0.08)",

                background:
                  "rgba(255,255,255,0.05)",

                color: "white",

                fontSize: 18,

                cursor: "pointer",
              }}
            >

              ☰

            </button>

          </div>

        )
      }

      {/* Desktop Sidebar */}
      {
        !isMobile &&
        !immersiveMode && (

          <Sidebar
            scenes={scenes}
            currentScene={currentScene}
            setCurrentScene={
              setCurrentScene
            }
            user={user}
          />

        )
      }

      {/* Mobile Sidebar */}
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
                  "rgba(0,0,0,0.45)",

                zIndex: 70,
              }}
            />

            {/* Drawer */}
            <div
              style={{
                position: "fixed",

                top: 0,
                left: 0,
                bottom: 0,

                width: 290,

                zIndex: 80,

                background:
                  "rgba(10,10,10,0.92)",

                backdropFilter:
                  "blur(20px)",

                borderRight:
                  "1px solid rgba(255,255,255,0.06)",

                overflowY: "auto",
              }}
            >

              <Sidebar
                scenes={scenes}
                currentScene={
                  currentScene
                }
                setCurrentScene={(scene: any) => {

  setCurrentScene(
    scene
  );

  setSidebarOpen(
    false
  );

}}
                user={user}
              />

            </div>

          </>

        )
      }

      {/* Scene Area */}
      <div
        style={{
          flex: 1,
          height: "100vh",
          width: "100%",

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
        />

      </div>

    </main>
  );

}