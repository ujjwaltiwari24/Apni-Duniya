"use client";

import {
  auth,
} from "@/firebase/config";

import {
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

export default function ProfilePage() {

  const router = useRouter();

  const [user, setUser] =
    useState<User | null>(null);

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

  const handleLogout = async () => {

    await signOut(auth);

    router.push("/login");

  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      {/* Glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-amber-500/10 blur-3xl rounded-full" />

      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-blue-500/10 blur-3xl rounded-full" />

      {
        user && (

          <div className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[40px] p-10 text-center">

            <img
              src={
                user.photoURL ||
                "https://via.placeholder.com/100"
              }
              alt="profile"
              className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white/10"
            />

            <h1 className="text-4xl font-semibold mb-3">
              {user.displayName}
            </h1>

            <p className="text-zinc-400 mb-2">
              {user.email}
            </p>

            <p className="text-zinc-500 text-sm mb-10 break-all">
              UID: {user.uid}
            </p>

            <div className="space-y-4">

              <button
                onClick={() =>
                  router.push("/home")
                }
                className="w-full bg-white text-black hover:scale-[1.02] transition-all duration-300 p-4 rounded-2xl font-semibold"
              >
                ⬅ Back to Home
              </button>

              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 transition-all duration-300 p-4 rounded-2xl font-semibold"
              >
                Logout
              </button>

            </div>

          </div>

        )
      }

    </main>
  );

}