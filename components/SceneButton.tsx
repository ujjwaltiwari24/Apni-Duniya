interface Props {
  scene: any;
  active: boolean;
  onClick: () => void;
}

export default function SceneButton({
  scene,
  active,
  onClick,
}: Props) {

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-2xl text-left transition-all duration-300 border ${
        active
          ? "bg-white text-black border-white scale-[1.01]"
          : "bg-white/5 hover:bg-white/10 border-white/10"
      }`}
    >

      <div className="flex items-center gap-3">

        <div className="text-2xl">
          {scene.emoji}
        </div>

        <div>

          <h2 className="font-medium">
            {scene.name}
          </h2>

          <p className={`text-xs mt-1 ${
            active
              ? "text-zinc-700"
              : "text-zinc-400"
          }`}>
            Cozy ambience
          </p>

        </div>

      </div>

    </button>
  );

}