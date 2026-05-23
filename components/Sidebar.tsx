"use client";

import {
  useState,
} from "react";

import {
  LogOut,
  User,
  Sparkles,
  Music,
  Lock,
  CloudRain,
  Coffee,
} from "lucide-react";

import {
  signOut,
} from "firebase/auth";

import {
  auth,
} from "@/firebase/config";

interface Props {
  scenes: any[];
  currentScene: any;
  setCurrentScene: any;
  user: any;
}

export default function Sidebar({
  scenes,
  currentScene,
  setCurrentScene,
  user,
}: Props) {

  const [selectedTime, setSelectedTime] =
    useState("Evening");

  const [selectedMood, setSelectedMood] =
    useState("Rainy");

  const handleLogout =
    async () => {

      await signOut(auth);

    };

  const handleEnterWorld = () => {

    const foundScene =
      scenes.find(
        (scene) =>
          scene.time === selectedTime &&
          scene.mood === selectedMood
      );

    if (foundScene) {

      setCurrentScene(foundScene);

    } else {

      alert(
        "This world is coming soon 😭🔥"
      );

    }

  };

  const moods = [
    "Rainy",
    "Calm",
    "Mountain",
    "Countryside",
  ];

  const times = [
    "Morning",
    "Afternoon",
    "Evening",
    "Midnight",
  ];

  return (
    <aside className="w-[340px] bg-black/70 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between overflow-y-auto">

      <div className="p-5 space-y-6">

        {/* Logo */}
        <div>

          <h1 className="text-3xl font-semibold tracking-tight text-white">

            ApniDuniya ☕🌧️

          </h1>

          <p className="text-zinc-400 mt-2 text-sm leading-relaxed">

            Escape into emotional cinematic worlds.

          </p>

        </div>

        {/* Current World */}
        <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-5">

          <div className="flex items-center gap-3 mb-4">

            <CloudRain className="text-blue-300" />

            <h2 className="text-lg font-medium text-white">

              Current World

            </h2>

          </div>

          <div className="text-5xl mb-4">

            {currentScene.emoji}

          </div>

          <h3 className="text-2xl font-semibold text-white mb-2">

            {currentScene.name}

          </h3>

          <p className="text-zinc-400 leading-relaxed">

            {currentScene.description}

          </p>

        </div>

        {/* Mood Engine */}
        <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-5">

          <div className="flex items-center gap-3 mb-5">

            <Sparkles className="text-yellow-300" />

            <h2 className="text-lg font-medium text-white">

              Custom Mood

            </h2>

          </div>

          {/* Time */}
          <div className="mb-5">

            <p className="text-zinc-400 text-sm mb-3">

              Select Time

            </p>

            <div className="grid grid-cols-2 gap-2">

              {
                times.map((time) => (

                  <button
                    key={time}
                    onClick={() =>
                      setSelectedTime(time)
                    }
                    className={`p-3 rounded-2xl text-sm transition-all duration-300 ${
                      selectedTime === time
                        ? "bg-white text-black"
                        : "bg-white/[0.05] hover:bg-white/[0.08] text-white"
                    }`}
                  >

                    {time}

                  </button>

                ))
              }

            </div>

          </div>

          {/* Mood */}
          <div className="mb-6">

            <p className="text-zinc-400 text-sm mb-3">

              Select Mood

            </p>

            <div className="grid grid-cols-2 gap-2">

              {
                moods.map((mood) => (

                  <button
                    key={mood}
                    onClick={() =>
                      setSelectedMood(mood)
                    }
                    className={`p-3 rounded-2xl text-sm transition-all duration-300 ${
                      selectedMood === mood
                        ? "bg-white text-black"
                        : "bg-white/[0.05] hover:bg-white/[0.08] text-white"
                    }`}
                  >

                    {mood}

                  </button>

                ))
              }

            </div>

          </div>

          {/* Enter */}
          <button
            onClick={handleEnterWorld}
            className="w-full bg-white text-black hover:scale-[1.02] transition-all duration-300 rounded-2xl py-4 font-medium"
          >

            Enter World ✨

          </button>

        </div>

        {/* Now Playing */}
        <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-5">

          <div className="flex items-center gap-3 mb-4">

            <Music className="text-pink-300" />

            <h2 className="text-lg font-medium text-white">

              Now Playing

            </h2>

          </div>

          <div className="bg-black/30 rounded-2xl p-4 border border-white/5">

            <p className="text-white font-medium mb-1">

              Calm Piano & Rain

            </p>

            <p className="text-zinc-400 text-sm">

              Emotional ambience mix

            </p>

          </div>

        </div>

        {/* Daily Thought */}
        <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-5">

          <div className="flex items-center gap-3 mb-4">

            <Coffee className="text-amber-300" />

            <h2 className="text-lg font-medium text-white">

              Daily Thought

            </h2>

          </div>

          <p className="text-zinc-300 leading-relaxed">

            “Some nights are meant to be felt,
            not fixed.”

          </p>

        </div>

        {/* Upcoming Worlds */}
        <div className="bg-white/[0.05] border border-white/10 rounded-3xl p-5">

          <div className="flex items-center gap-3 mb-5">

            <Lock className="text-zinc-400" />

            <h2 className="text-lg font-medium text-white">

              Upcoming Worlds

            </h2>

          </div>

          <div className="space-y-3">

            <div className="bg-black/30 border border-white/5 rounded-2xl p-4">

              <p className="text-white font-medium">

                🌲 Forest Morning

              </p>

              <p className="text-zinc-500 text-sm mt-1">

                Coming soon...

              </p>

            </div>

            <div className="bg-black/30 border border-white/5 rounded-2xl p-4">

              <p className="text-white font-medium">

                🌃 Neon Midnight

              </p>

              <p className="text-zinc-500 text-sm mt-1">

                Coming soon...

              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom User */}
      <div className="p-5 border-t border-white/10">

        <div className="flex items-center gap-3 bg-white/[0.05] border border-white/10 rounded-2xl p-4 mb-4">

          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">

            <User size={20} />

          </div>

          <div className="overflow-hidden">

            <p className="text-white font-medium truncate">

              {user?.displayName || "User"}

            </p>

            <p className="text-zinc-400 text-sm truncate">

              {user?.email}

            </p>

          </div>

        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all duration-300 rounded-2xl py-4 text-white font-medium flex items-center justify-center gap-3"
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </aside>
  );
}