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

  const [currentScene, setCurrentScene] =
    useState(scenes[0]);

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

  const enterFullscreen = async () => {

    setImmersiveMode(true);

    if (sceneRef.current) {

      await sceneRef.current.requestFullscreen();

    }

  };

  const exitImmersion = async () => {

    setImmersiveMode(false);

    if (document.fullscreenElement) {

      await document.exitFullscreen();

    }

  };

  return (
    <main className="h-screen bg-black text-white flex overflow-hidden">

      {/* Sidebar */}
      {
        !immersiveMode && (

          <Sidebar
  scenes={scenes}
  currentScene={currentScene}
  setCurrentScene={setCurrentScene}
  user={user}
/>

        )
      }

      {/* Scene */}
      <SceneView
        currentScene={currentScene}
        enterFullscreen={enterFullscreen}
        sceneRef={sceneRef}
        immersiveMode={immersiveMode}
        exitImmersion={exitImmersion}
      />

    </main>
  );

}