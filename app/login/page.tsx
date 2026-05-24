"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const SCENES = [
  {
    icon: "☕",
    name: "Chai Tapri · Rainy Evening",
    sub: "Rain · Street sounds · Warm light",
    live: true,
    active: true,
  },

  {
    icon: "🌄",
    name: "Countryside Sunset",
    sub: "Wind · Crickets · Open fields",
    live: true,
    active: false,
  },

  {
    icon: "🏡",
    name: "Midnight Cabin",
    sub: "Fireplace · Snow · Stillness",
    live: false,
    active: false,
  },

  {
    icon: "🌿",
    name: "Forest Morning",
    sub: "Birds · Mist · Soft light",
    live: false,
    active: false,
  },
];

const FEATURES = [
  {
    icon: "🌧️",
    title: "Cinematic Scenes",
    desc:
      "Chai tapri rain, countryside dusk, silent forests, snowy cabins — each with layered ambient audio you can mix.",
  },

  {
    icon: "💌",
    title: "Secret Message Wall",
    desc:
      "Leave a note for your partner when they're offline. They'll find it glowing on the wall when they arrive.",
  },

  {
    icon: "👥",
    title: "Co-Presence Rooms",
    desc:
      "Invite a friend or partner into your world. Sit together in comfortable silence, no matter the distance.",
  },

  {
    icon: "🎵",
    title: "Layered Sound Mixer",
    desc:
      "Blend rain, thunder, soft piano, and café murmur. Save your perfect focus mix and return to it anytime.",
  },

  {
    icon: "🕯️",
    title: "Focus Mode",
    desc:
      "Distraction-free deep work with a Pomodoro timer and a do-not-disturb presence for others.",
  },

  {
    icon: "📖",
    title: "Mood Journal",
    desc:
      "A private space to write what you feel, tied to the world you're in. Rain outside. Words inside.",
  },
];

const USE_CASES = [
  {
    tag: "Long-distance couples",
    desc:
      "Watch the same rain. Sit in the same world. Leave notes that feel like coming home.",
  },

  {
    tag: "Students & deep workers",
    desc:
      "Chai tapri ambience + Pomodoro timer. Study alone or invite a friend into silence.",
  },

  {
    tag: "Friends far away",
    desc:
      "Open a room together on a lazy Sunday and just exist in the same space.",
  },

  {
    tag: "Anyone who needs stillness",
    desc:
      "Overwhelmed by the internet's noise? ApniDuniya is your quiet tab. Always there.",
  },
];

export default function LoginPage() {

  const router = useRouter();

  const rainRef =
    useRef<HTMLDivElement>(null);

  // Rain Effect
  useEffect(() => {

    if (!rainRef.current) return;

    const container =
      rainRef.current;

    for (let i = 0; i < 50; i++) {

      const drop =
        document.createElement("div");

      drop.style.cssText = `
        position:absolute;
        width:1px;
        background:linear-gradient(to bottom,transparent,rgba(180,210,255,0.18));
        top:-100px;
        left:${Math.random() * 100}%;
        height:${Math.random() * 55 + 18}px;
        opacity:${Math.random() * 0.22 + 0.06};
        animation:rainFall ${Math.random() * 1.4 + 0.9}s linear ${Math.random() * 3}s infinite;
      `;

      container.appendChild(drop);

    }

  }, []);

  // Simple Login
  const handleEnter = () => {

    router.push("/home");

  };

  return (
    <>
      <style>{`

        * {
          box-sizing: border-box;
        }

        @keyframes rainFall {

          to {
            transform: translateY(105vh);
            opacity: 0;
          }

        }

        @keyframes breatheSlow {

          0%,100% {
            opacity:.5;
            transform:scale(1);
          }

          50% {
            opacity:.9;
            transform:scale(1.08);
          }

        }

        @keyframes livePulse {

          0%,100% {
            box-shadow:0 0 0 0 rgba(74,222,128,.5);
          }

          70% {
            box-shadow:0 0 0 7px rgba(74,222,128,0);
          }

        }

        @keyframes ticker {

          0% {
            transform:translateX(0);
          }

          100% {
            transform:translateX(-50%);
          }

        }

        .ad-page {

  min-height:100vh;

  background:#08090d;

  color:#ede8e0;

  overflow-x:hidden;

  overflow-y:auto;

  position:relative;
}

        .ad-nav {

          display:flex;

          justify-content:space-between;

          align-items:center;

          padding:18px 20px;

          border-bottom:1px solid rgba(255,255,255,.05);

          position:relative;

          z-index:2;
        }

        .ad-nav-logo {

          font-size:22px;

          font-weight:700;

          letter-spacing:-.03em;
        }

        .ad-nav-pill {

          display:flex;

          align-items:center;

          gap:7px;

          padding:6px 14px;

          border:1px solid rgba(255,255,255,.08);

          border-radius:100px;

          font-size:11px;

          color:rgba(255,255,255,.4);

          letter-spacing:.04em;

          background:rgba(255,255,255,.03);
        }

        .ad-live-dot {

          width:6px;

          height:6px;

          border-radius:50%;

          background:#4ade80;

          animation:livePulse 2s infinite;
        }

        .ad-hero {

          max-width:1180px;

          margin:0 auto;

          padding:60px 20px;

          position:relative;

          z-index:2;
        }

        .ad-hero-grid {

          display:grid;

          grid-template-columns:1fr 390px;

          gap:50px;

          align-items:center;
        }

        @media(max-width:900px){

          .ad-hero-grid {

            grid-template-columns:1fr;

          }

        }

        .ad-eyebrow {

          display:inline-flex;

          align-items:center;

          gap:8px;

          padding:8px 16px;

          border-radius:999px;

          border:1px solid rgba(210,170,110,.18);

          color:rgba(210,170,110,.7);

          background:rgba(210,170,110,.04);

          font-size:11px;

          text-transform:uppercase;

          letter-spacing:.1em;

          margin-bottom:24px;
        }

        .ad-h1 {

          font-size:clamp(48px,8vw,86px);

          line-height:.92;

          font-weight:700;

          letter-spacing:-.05em;

          margin-bottom:18px;
        }

        .ad-h1-soft {

          color:rgba(210,185,150,.58);

          font-style:italic;
        }

        .ad-tagline {

          font-size:16px;

          color:rgba(237,232,224,.45);

          line-height:1.9;

          max-width:560px;

          margin-bottom:34px;
        }

        .ad-pills {

          display:flex;

          flex-wrap:wrap;

          gap:10px;

          margin-bottom:38px;
        }

        .ad-pill {

          padding:7px 14px;

          border-radius:999px;

          border:1px solid rgba(255,255,255,.08);

          background:rgba(255,255,255,.03);

          font-size:12px;

          color:rgba(237,232,224,.48);
        }

        .ad-stats {

          display:grid;

          grid-template-columns:repeat(4,1fr);

          gap:18px;
        }

        @media(max-width:560px){

          .ad-stats {

            grid-template-columns:repeat(2,1fr);

          }

        }

        .ad-stat-num {

          font-size:30px;

          color:rgba(237,232,224,.9);

          margin-bottom:4px;
        }

        .ad-stat-lbl {

          font-size:10px;

          color:rgba(237,232,224,.28);

          letter-spacing:.08em;

          text-transform:uppercase;
        }

        .ad-card {

          background:rgba(255,255,255,.03);

          border:1px solid rgba(255,255,255,.08);

          border-radius:24px;

          padding:26px;

          backdrop-filter:blur(16px);
        }

        .ad-scene-row {

          display:flex;

          align-items:center;

          justify-content:space-between;

          gap:10px;

          padding:12px 14px;

          border-radius:14px;

          border:1px solid rgba(255,255,255,.06);

          margin-bottom:10px;

          background:rgba(255,255,255,.02);
        }

        .ad-scene-row.active {

          background:rgba(210,170,110,.06);

          border-color:rgba(210,170,110,.16);
        }

        .ad-scene-left {

          display:flex;

          align-items:center;

          gap:12px;

          min-width:0;
        }

        .ad-scene-icon {

          width:36px;

          height:36px;

          border-radius:10px;

          background:rgba(255,255,255,.06);

          display:flex;

          align-items:center;

          justify-content:center;

          flex-shrink:0;
        }

        .ad-scene-name {

          font-size:13px;

          color:rgba(237,232,224,.85);

          margin-bottom:2px;
        }

        .ad-scene-sub {

          font-size:11px;

          color:rgba(237,232,224,.34);
        }

        .ad-badge-live,
        .ad-badge-soon {

          font-size:9px;

          padding:4px 8px;

          border-radius:999px;

          white-space:nowrap;
        }

        .ad-badge-live {

          background:rgba(74,222,128,.1);

          color:#4ade80;

          border:1px solid rgba(74,222,128,.22);
        }

        .ad-badge-soon {

          background:rgba(255,255,255,.04);

          color:rgba(237,232,224,.3);

          border:1px solid rgba(255,255,255,.08);
        }

        .ad-divider {

          height:1px;

          background:rgba(255,255,255,.06);

          margin:22px 0;
        }

        .ad-cta-hint {

          text-align:center;

          color:rgba(237,232,224,.45);

          font-size:14px;

          margin-bottom:16px;
        }

        .ad-btn {

          width:100%;

          padding:16px;

          border-radius:14px;

          background:#ede8e0;

          color:#0a0c10;

          border:none;

          font-size:15px;

          font-weight:600;

          cursor:pointer;

          transition:.25s;

          margin-bottom:12px;
        }

        .ad-btn:hover {

          transform:translateY(-2px);

          box-shadow:0 10px 28px rgba(237,232,224,.14);
        }

        .ad-trust {

          display:flex;

          justify-content:center;

          flex-wrap:wrap;

          gap:12px;

          margin-top:14px;
        }

        .ad-trust span {

          font-size:10px;

          color:rgba(237,232,224,.2);
        }

        .ad-section {

          max-width:1180px;

          margin:0 auto;

          padding:70px 20px;

          position:relative;

          z-index:2;
        }

        .ad-section-label {

          text-align:center;

          font-size:11px;

          letter-spacing:.12em;

          text-transform:uppercase;

          color:rgba(210,170,110,.6);

          margin-bottom:12px;
        }

        .ad-section-h2 {

          text-align:center;

          font-size:clamp(32px,5vw,52px);

          margin-bottom:16px;

          line-height:1.05;
        }

        .ad-section-sub {

          text-align:center;

          max-width:640px;

          margin:0 auto 42px;

          color:rgba(237,232,224,.42);

          line-height:1.8;

          font-size:15px;
        }

        .ad-feat-grid {

          display:grid;

          grid-template-columns:repeat(3,1fr);

          gap:14px;
        }

        @media(max-width:900px){

          .ad-feat-grid {

            grid-template-columns:repeat(2,1fr);

          }

        }

        @media(max-width:560px){

          .ad-feat-grid {

            grid-template-columns:1fr;

          }

        }

        .ad-feat-card {

          padding:24px 20px;

          border-radius:20px;

          background:rgba(255,255,255,.025);

          border:1px solid rgba(255,255,255,.07);
        }

        .ad-feat-icon {

          font-size:28px;

          margin-bottom:12px;
        }

        .ad-feat-title {

          font-size:15px;

          color:rgba(237,232,224,.88);

          margin-bottom:8px;
        }

        .ad-feat-desc {

          font-size:13px;

          color:rgba(237,232,224,.38);

          line-height:1.8;
        }

        .ad-uc-grid {

          display:grid;

          grid-template-columns:repeat(2,1fr);

          gap:14px;
        }

        @media(max-width:560px){

          .ad-uc-grid {

            grid-template-columns:1fr;

          }

        }

        .ad-uc-card {

          padding:24px 20px;

          border-radius:20px;

          background:rgba(255,255,255,.025);

          border:1px solid rgba(255,255,255,.07);
        }

        .ad-uc-tag {

          font-size:11px;

          color:rgba(210,170,110,.68);

          text-transform:uppercase;

          letter-spacing:.08em;

          margin-bottom:10px;
        }

        .ad-uc-desc {

          font-size:13px;

          color:rgba(237,232,224,.45);

          line-height:1.8;
        }

        .ad-final {

          padding:80px 20px;

          text-align:center;

          position:relative;

          z-index:2;
        }

        .ad-final-h2 {

          font-size:clamp(38px,6vw,64px);

          line-height:1.0;

          margin-bottom:18px;
        }

        .ad-final-sub {

          max-width:520px;

          margin:0 auto 34px;

          color:rgba(237,232,224,.4);

          line-height:1.8;

          font-size:15px;
        }

        .ad-btn-inline {

          padding:16px 34px;

          border-radius:14px;

          background:#ede8e0;

          color:#0a0c10;

          border:none;

          font-size:15px;

          font-weight:600;

          cursor:pointer;

          transition:.25s;
        }

        .ad-btn-inline:hover {

          transform:translateY(-2px);
        }

        .ad-footer {

          display:flex;

          justify-content:space-between;

          align-items:center;

          flex-wrap:wrap;

          gap:14px;

          padding:22px 20px;

          border-top:1px solid rgba(255,255,255,.05);

          position:relative;

          z-index:2;
        }

        .ad-footer-txt,
        .ad-footer-link {

          font-size:12px;

          color:rgba(237,232,224,.22);
        }

        .ad-footer-links {

          display:flex;

          gap:18px;
        }

        .ad-glow1 {

          position:fixed;

          top:-180px;

          left:-180px;

          width:460px;

          height:460px;

          border-radius:50%;

          background:
            radial-gradient(circle,
            rgba(190,140,80,.07),
            transparent 68%);

          animation:breatheSlow 7s ease-in-out infinite;

          pointer-events:none;

          z-index:0;
        }

        .ad-glow2 {

          position:fixed;

          bottom:-200px;

          right:-200px;

          width:540px;

          height:540px;

          border-radius:50%;

          background:
            radial-gradient(circle,
            rgba(80,110,200,.06),
            transparent 68%);

          animation:breatheSlow 9s ease-in-out infinite reverse;

          pointer-events:none;

          z-index:0;
        }

      `}</style>

      <main
  className="ad-page"
  style={{
    height: "100vh",
    overflowY: "auto",
    overflowX: "hidden",
  }}
>

        {/* Rain */}
        <div
          ref={rainRef}
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            overflow: "hidden",
            zIndex: 0,
          }}
        />

        {/* Glow */}
        <div className="ad-glow1" />
        <div className="ad-glow2" />

        {/* NAV */}
        <nav className="ad-nav">

          <div className="ad-nav-logo">

            Apni

            <span
              style={{
                color:
                  "rgba(210,170,110,.9)",
              }}
            >

              Duniya

            </span>

          </div>

          <div className="ad-nav-pill">

            <span className="ad-live-dot" />

            12 chilling now

          </div>

        </nav>

        {/* HERO */}
        <section className="ad-hero">

          <div className="ad-hero-grid">

            {/* LEFT */}
            <div>

              <div className="ad-eyebrow">

                ☕ your peaceful corner of the internet

              </div>

              <h1 className="ad-h1">

                Find your
                <br />

                <span className="ad-h1-soft">

                  calm again.

                </span>

              </h1>

              <p className="ad-tagline">

                Step into cinematic worlds —
                a chai tapri in the rain,
                a misty countryside evening,
                a silent cabin at midnight.

                Relax solo,
                focus deeply,
                or share a quiet moment with someone you love.

              </p>

              <div className="ad-pills">

                {
                  [
                    "🌧️ Immersive Scenes",
                    "💌 Secret Message Wall",
                    "👥 Co-Presence Rooms",
                    "🎵 Sound Mixer",
                    "🕯️ Focus Mode",
                    "📖 Mood Journal",
                  ].map((pill) => (

                    <span
                      key={pill}
                      className="ad-pill"
                    >

                      {pill}

                    </span>

                  ))
                }

              </div>

              <div className="ad-stats">

                {
                  [
                    {
                      n: "8+",
                      l: "Chill Worlds",
                    },

                    {
                      n: "24/7",
                      l: "Always Open",
                    },

                    {
                      n: "∞",
                      l: "Cozy Hours",
                    },

                    {
                      n: "0",
                      l: "Ads. Ever.",
                    },
                  ].map((s) => (

                    <div key={s.l}>

                      <div className="ad-stat-num">

                        {s.n}

                      </div>

                      <div className="ad-stat-lbl">

                        {s.l}

                      </div>

                    </div>

                  ))
                }

              </div>

            </div>

            {/* RIGHT CARD */}
            <div className="ad-card">

              {
                SCENES.map((scene) => (

                  <div
                    key={scene.name}
                    className={`ad-scene-row ${
                      scene.active
                        ? "active"
                        : ""
                    }`}
                  >

                    <div className="ad-scene-left">

                      <div className="ad-scene-icon">

                        {scene.icon}

                      </div>

                      <div>

                        <div className="ad-scene-name">

                          {scene.name}

                        </div>

                        <div className="ad-scene-sub">

                          {scene.sub}

                        </div>

                      </div>

                    </div>

                    <span
                      className={
                        scene.live
                          ? "ad-badge-live"
                          : "ad-badge-soon"
                      }
                    >

                      {
                        scene.live
                          ? "Live"
                          : "Soon"
                      }

                    </span>

                  </div>

                ))
              }

              <div className="ad-divider" />

              <p className="ad-cta-hint">

                Your world is waiting inside

              </p>

              <button
                className="ad-btn"
                onClick={handleEnter}
              >

                ☕ Enter ApniDuniya

              </button>

              <p
                style={{
                  textAlign: "center",

                  fontSize: 11,

                  color:
                    "rgba(237,232,224,.18)",

                  letterSpacing:
                    ".04em",
                }}
              >

                Free forever · No ads · No signup

              </p>

              <div className="ad-trust">

                {
                  [
                    "✦ Peaceful",
                    "✦ Instant Access",
                    "✦ Cozy Internet",
                  ].map((t) => (

                    <span key={t}>

                      {t}

                    </span>

                  ))
                }

              </div>

            </div>

          </div>

        </section>

        {/* FEATURES */}
        <section className="ad-section">

          <div className="ad-section-label">

            What's inside

          </div>

          <h2 className="ad-section-h2">

            More than just ambience.

          </h2>

          <p className="ad-section-sub">

            ApniDuniya is a complete peaceful internet space —
            built for people who need to slow down,
            connect meaningfully,
            and feel at home online.

          </p>

          <div className="ad-feat-grid">

            {
              FEATURES.map((f) => (

                <div
                  key={f.title}
                  className="ad-feat-card"
                >

                  <div className="ad-feat-icon">

                    {f.icon}

                  </div>

                  <div className="ad-feat-title">

                    {f.title}

                  </div>

                  <div className="ad-feat-desc">

                    {f.desc}

                  </div>

                </div>

              ))
            }

          </div>

        </section>

        {/* USE CASES */}
        <section className="ad-section">

          <div className="ad-section-label">

            Who it's for

          </div>

          <h2 className="ad-section-h2">

            A space for every kind of tired.

          </h2>

          <p className="ad-section-sub">

            Whether you're studying,
            missing someone,
            or just need a break from the noise —
            there's a world here for you.

          </p>

          <div className="ad-uc-grid">

            {
              USE_CASES.map((u) => (

                <div
                  key={u.tag}
                  className="ad-uc-card"
                >

                  <div className="ad-uc-tag">

                    {u.tag}

                  </div>

                  <div className="ad-uc-desc">

                    {u.desc}

                  </div>

                </div>

              ))
            }

          </div>

        </section>

        {/* FINAL CTA */}
        <section className="ad-final">

          <div className="ad-section-label">

            Ready to escape?

          </div>

          <h2 className="ad-final-h2">

            One click.
            <br />

            <span
              style={{
                color:
                  "rgba(210,185,150,.5)",

                fontStyle:
                  "italic",
              }}
            >

              Infinite calm.

            </span>

          </h2>

          <p className="ad-final-sub">

            No setup.
            No algorithm.
            No noise.

            Just your world,
            your sound,
            and the people you want to share it with.

          </p>

          <button
            className="ad-btn-inline"
            onClick={handleEnter}
          >

            ☕ Enter ApniDuniya

          </button>

        </section>

        {/* FOOTER */}
        <footer className="ad-footer">

          <span className="ad-footer-txt">

            ApniDuniya · Your peaceful corner

          </span>

          <div className="ad-footer-links">

            {
              [
                "About",
                "Privacy",
                "Contact",
              ].map((link) => (

                <span
                  key={link}
                  className="ad-footer-link"
                >

                  {link}

                </span>

              ))
            }

          </div>

        </footer>

      </main>
    </>
  );

}