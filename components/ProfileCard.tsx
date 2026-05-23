"use client";

import { User } from "firebase/auth";

interface Props {
  user: User;
  onClick: () => void;
}

export default function ProfileCard({
  user,
  onClick,
}: Props) {

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 p-3 rounded-2xl mb-8"
    >

      <img
        src={
          user.photoURL ||
          "https://via.placeholder.com/100"
        }
        alt="profile"
        className="w-12 h-12 rounded-full"
      />

      <div className="text-left overflow-hidden">

        <h2 className="font-medium truncate">
          {user.displayName}
        </h2>

        <p className="text-zinc-400 text-sm">
          View Profile
        </p>

      </div>

    </button>
  );

}