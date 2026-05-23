"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "@/firebase/config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const SCENES = [
  { icon: "☕", name: "Chai Tapri · Rainy Evening", sub: "Rain · Street sounds · Warm light", live: true, active: true },
  { icon: "🌄", name: "Countryside Sunset", sub: "Wind · Crickets · Open fields", live: true, active: false },
  { icon: "🏡", name: "Midnight Cabin", sub: "Fireplace · Snow · Stillness", live: false, active: false },
  { icon: "🌿", name: "Forest Morning", sub: "Birds · Mist · Soft light", live: false, active: false },
];

const FEATURES = [
  { icon: "🌧️", title: "Cinematic Scenes", desc: "Chai tapri rain, countryside dusk, silent forests, snowy cabins — each with layered ambient audio you can mix." },
  { icon: "💌", title: "Secret Message Wall", desc: "Leave a note for your partner when they're offline. They'll find it glowing on the wall when they arrive." },
  { icon: "👥", title: "Co-Presence Rooms", desc: "Invite a friend or partner into your world. Sit together in comfortable silence, no matter the distance." },
  { icon: "🎵", title: "Layered Sound Mixer", desc: "Blend rain, thunder, soft piano, and café murmur. Save your perfect focus mix and return to it anytime." },
  { icon: "🕯️", title: "Focus Mode", desc: "Distraction-free deep work with a Pomodoro timer and a do-not-disturb presence for others." },
  { icon: "📖", title: "Mood Journal", desc: "A private space to write what you feel, tied to the world you're in. Rain outside. Words inside." },
];

const USE_CASES = [
  { tag: "Long-distance couples", desc: "Watch the same rain. Sit in the same world. Leave notes that feel like coming home." },
  { tag: "Students & deep workers", desc: "Chai tapri ambience + Pomodoro timer. Study alone or invite a friend into silence." },
  { tag: "Friends far away", desc: "Open a room together on a lazy Sunday and just exist in the same space." },
  { tag: "Anyone who needs stillness", desc: "Overwhelmed by the internet's noise? ApniDuniya is your quiet tab. Always there." },
];

const GoogleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8418H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.4673-.806 5.9564-2.1814l-2.9087-2.2581c-.8059.54-1.8368.859-3.0477.859-2.3441 0-4.3282-1.5836-5.036-3.7105H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71c-.18-.54-.2822-1.1168-.2822-1.71s.1023-1.17.2823-1.71V4.9582H.9573C.3477 6.1732 0 7.5477 0 9s.3477 2.8268.9573 4.0418L3.964 10.71z" fill="#FBBC05"/>
    <path d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4627.8918 11.4255 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.964 7.29C4.6718 5.1632 6.6559 3.5795 9 3.5795z" fill="#EA4335"/>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const rainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rainRef.current) return;
    const c = rainRef.current;
    for (let i = 0; i < 50; i++) {
      const d = document.createElement("div");
      d.style.cssText = `
        position:absolute;width:1px;
        background:linear-gradient(to bottom,transparent,rgba(180,210,255,0.18));
        top:-100px;
        left:${Math.random() * 100}%;
        height:${Math.random() * 55 + 18}px;
        opacity:${Math.random() * 0.22 + 0.06};
        animation:rainFall ${Math.random() * 1.4 + 0.9}s linear ${Math.random() * 3}s infinite;
      `;
      c.appendChild(d);
    }
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          createdAt: serverTimestamp(),
        });
      }
      router.push("/home");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes rainFall { to { transform: translateY(105vh); opacity: 0; } }
        @keyframes breatheSlow { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:.9;transform:scale(1.08)} }
        @keyframes livePulse { 0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,.5)} 70%{box-shadow:0 0 0 7px rgba(74,222,128,0)} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

        .ad-page { min-height:100vh; background:#08090d; color:#ede8e0; font-family:Georgia,serif; overflow-x:hidden; }

        .ad-nav { display:flex; justify-content:space-between; align-items:center; padding:18px 20px; border-bottom:1px solid rgba(255,255,255,.05); position:relative; z-index:2; }
        .ad-nav-logo { font-size:20px; letter-spacing:.01em; }
        .ad-nav-pill { display:flex; align-items:center; gap:7px; padding:6px 14px; border:1px solid rgba(255,255,255,.08); border-radius:100px; font-size:11px; color:rgba(255,255,255,.4); font-family:-apple-system,sans-serif; letter-spacing:.04em; }
        .ad-live-dot { width:6px; height:6px; border-radius:50%; background:#4ade80; animation:livePulse 2s infinite; display:inline-block; }

        .ad-wrap { max-width:1180px; margin:0 auto; padding:0 20px; position:relative; z-index:2; }

        /* HERO */
        .ad-hero { padding:52px 20px 44px; max-width:1180px; margin:0 auto; position:relative; z-index:2; }
        .ad-hero-grid { display:grid; grid-template-columns:1fr 390px; gap:52px; align-items:center; }
        @media(max-width:860px){ .ad-hero-grid { grid-template-columns:1fr; gap:40px; } }

        .ad-eyebrow { display:inline-flex; align-items:center; gap:8px; padding:7px 16px; border:1px solid rgba(210,170,110,.18); border-radius:100px; font-size:11px; color:rgba(210,170,110,.75); font-family:-apple-system,sans-serif; letter-spacing:.1em; text-transform:uppercase; margin-bottom:24px; background:rgba(210,170,110,.04); }
        .ad-h1 { font-size:clamp(44px,7vw,80px); line-height:.95; font-weight:400; letter-spacing:-.03em; margin-bottom:10px; }
        .ad-h1-soft { color:rgba(210,185,150,.55); font-style:italic; }
        .ad-tagline { font-size:16px; color:rgba(237,232,224,.42); font-family:-apple-system,sans-serif; font-weight:300; line-height:1.8; max-width:500px; margin-bottom:36px; }

        .ad-pills { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:36px; }
        .ad-pill { padding:6px 14px; border:1px solid rgba(255,255,255,.09); border-radius:100px; font-size:12px; color:rgba(237,232,224,.5); font-family:-apple-system,sans-serif; }

        .ad-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:0; }
        @media(max-width:480px){ .ad-stats { grid-template-columns:repeat(2,1fr); gap:16px 0; } }
        .ad-stat-num { font-size:28px; letter-spacing:-.03em; color:rgba(237,232,224,.85); margin-bottom:3px; }
        .ad-stat-lbl { font-size:10px; color:rgba(237,232,224,.28); font-family:-apple-system,sans-serif; letter-spacing:.07em; text-transform:uppercase; }

        /* LOGIN CARD */
        .ad-card { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.08); border-radius:24px; padding:28px; }
        .ad-scene-row { display:flex; align-items:center; justify-content:space-between; padding:11px 14px; border-radius:12px; border:1px solid rgba(255,255,255,.06); margin-bottom:8px; transition:background .25s,border-color .25s; cursor:default; }
        .ad-scene-row.active { background:rgba(210,170,110,.05); border-color:rgba(210,170,110,.18); }
        .ad-scene-row:hover { background:rgba(210,170,110,.06); border-color:rgba(210,170,110,.2); }
        .ad-scene-icon { width:32px; height:32px; border-radius:8px; background:rgba(255,255,255,.05); display:flex; align-items:center; justify-content:center; font-size:17px; flex-shrink:0; }
        .ad-scene-name { font-size:13px; font-family:-apple-system,sans-serif; color:rgba(237,232,224,.82); font-weight:500; margin-bottom:1px; }
        .ad-scene-sub { font-size:11px; color:rgba(237,232,224,.3); font-family:-apple-system,sans-serif; }
        .ad-badge-live { font-size:9px; padding:3px 8px; border-radius:100px; background:rgba(74,222,128,.1); color:#4ade80; border:1px solid rgba(74,222,128,.22); letter-spacing:.06em; text-transform:uppercase; font-weight:600; font-family:-apple-system,sans-serif; white-space:nowrap; }
        .ad-badge-soon { font-size:9px; padding:3px 8px; border-radius:100px; background:rgba(255,255,255,.05); color:rgba(237,232,224,.3); border:1px solid rgba(255,255,255,.08); letter-spacing:.06em; text-transform:uppercase; font-family:-apple-system,sans-serif; white-space:nowrap; }
        .ad-divider { height:1px; background:rgba(255,255,255,.06); margin:20px 0; }
        .ad-cta-hint { font-size:14px; font-family:-apple-system,sans-serif; color:rgba(237,232,224,.45); text-align:center; margin-bottom:14px; font-weight:300; }
        .ad-btn { width:100%; padding:15px; border-radius:13px; background:#ede8e0; color:#0a0c10; font-size:15px; font-family:-apple-system,sans-serif; font-weight:600; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; margin-bottom:10px; letter-spacing:.01em; transition:transform .2s,box-shadow .2s; }
        .ad-btn:hover { transform:translateY(-2px); box-shadow:0 10px 30px rgba(237,232,224,.15); }
        .ad-trust { display:flex; justify-content:center; gap:14px; margin-top:10px; flex-wrap:wrap; }
        .ad-trust span { font-size:10px; font-family:-apple-system,sans-serif; color:rgba(237,232,224,.2); }

        /* SECTION SHARED */
        .ad-section { padding:60px 20px; max-width:1180px; margin:0 auto; position:relative; z-index:2; }
        .ad-section-label { font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:rgba(210,170,110,.6); font-family:-apple-system,sans-serif; margin-bottom:12px; text-align:center; }
        .ad-section-h2 { font-size:clamp(28px,4vw,44px); font-weight:400; letter-spacing:-.03em; color:#ede8e0; margin-bottom:14px; text-align:center; line-height:1.05; }
        .ad-section-sub { font-size:15px; color:rgba(237,232,224,.4); font-family:-apple-system,sans-serif; font-weight:300; line-height:1.8; max-width:540px; margin:0 auto 44px; text-align:center; }
        .ad-hr { height:1px; background:rgba(255,255,255,.04); }

        /* FEATURES GRID */
        .ad-feat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
        @media(max-width:860px){ .ad-feat-grid { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:520px){ .ad-feat-grid { grid-template-columns:1fr; } }
        .ad-feat-card { padding:24px 20px; border-radius:18px; background:rgba(255,255,255,.025); border:1px solid rgba(255,255,255,.07); transition:border-color .3s,transform .25s; }
        .ad-feat-card:hover { border-color:rgba(210,170,110,.22); transform:translateY(-3px); }
        .ad-feat-icon { font-size:26px; margin-bottom:12px; }
        .ad-feat-title { font-size:14px; font-weight:500; color:rgba(237,232,224,.88); font-family:-apple-system,sans-serif; margin-bottom:7px; }
        .ad-feat-desc { font-size:13px; color:rgba(237,232,224,.36); font-family:-apple-system,sans-serif; line-height:1.75; }

        /* USE CASES */
        .ad-uc-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
        @media(max-width:520px){ .ad-uc-grid { grid-template-columns:1fr; } }
        .ad-uc-card { padding:24px 22px; border-radius:18px; background:rgba(255,255,255,.025); border:1px solid rgba(255,255,255,.07); }
        .ad-uc-tag { font-size:11px; color:rgba(210,170,110,.7); font-family:-apple-system,sans-serif; letter-spacing:.06em; text-transform:uppercase; margin-bottom:9px; }
        .ad-uc-desc { font-size:13px; color:rgba(237,232,224,.48); font-family:-apple-system,sans-serif; line-height:1.8; margin:0; }

        /* TICKER */
        .ad-ticker-wrap { border-top:1px solid rgba(255,255,255,.04); border-bottom:1px solid rgba(255,255,255,.04); padding:12px 0; overflow:hidden; background:rgba(255,255,255,.015); position:relative; z-index:2; }
        .ad-ticker { display:flex; animation:ticker 26s linear infinite; white-space:nowrap; width:max-content; }
        .ad-ticker span { font-size:12px; font-family:-apple-system,sans-serif; letter-spacing:.05em; padding:0 18px; }

        /* FINAL CTA */
        .ad-final { padding:72px 20px; text-align:center; position:relative; z-index:2; }
        .ad-final-h2 { font-size:clamp(34px,5vw,58px); font-weight:400; letter-spacing:-.03em; color:#ede8e0; margin-bottom:16px; line-height:1.0; }
        .ad-final-sub { font-size:15px; color:rgba(237,232,224,.38); font-family:-apple-system,sans-serif; font-weight:300; margin-bottom:32px; max-width:420px; margin-left:auto; margin-right:auto; line-height:1.8; }
        .ad-btn-inline { padding:15px 34px; border-radius:13px; background:#ede8e0; color:#0a0c10; font-size:15px; font-family:-apple-system,sans-serif; font-weight:600; border:none; cursor:pointer; display:inline-flex; align-items:center; gap:10px; letter-spacing:.01em; transition:transform .2s,box-shadow .2s; }
        .ad-btn-inline:hover { transform:translateY(-2px); box-shadow:0 10px 30px rgba(237,232,224,.15); }

        /* FOOTER */
        .ad-footer { padding:20px 20px; border-top:1px solid rgba(255,255,255,.04); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; position:relative; z-index:2; }
        .ad-footer-txt { font-size:12px; font-family:-apple-system,sans-serif; color:rgba(237,232,224,.2); }
        .ad-footer-links { display:flex; gap:20px; }
        .ad-footer-link { font-size:12px; font-family:-apple-system,sans-serif; color:rgba(237,232,224,.2); cursor:pointer; transition:color .2s; }
        .ad-footer-link:hover { color:rgba(237,232,224,.5); }

        /* GLOWS */
        .ad-glow1 { position:fixed; top:-180px; left:-180px; width:460px; height:460px; border-radius:50%; background:radial-gradient(circle,rgba(190,140,80,.07),transparent 68%); animation:breatheSlow 7s ease-in-out infinite; pointer-events:none; z-index:0; }
        .ad-glow2 { position:fixed; bottom:-200px; right:-200px; width:540px; height:540px; border-radius:50%; background:radial-gradient(circle,rgba(80,110,200,.06),transparent 68%); animation:breatheSlow 9s ease-in-out infinite reverse; pointer-events:none; z-index:0; }
      `}</style>

      <main className="ad-page">
        <div ref={rainRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }} />
        <div className="ad-glow1" />
        <div className="ad-glow2" />

        {/* NAV */}
        <nav className="ad-nav">
          <div className="ad-nav-logo">
            Apni<span style={{ color: "rgba(210,170,110,.9)" }}>Duniya</span>
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
              <div className="ad-eyebrow">☕ your peaceful corner of the internet</div>
              <h1 className="ad-h1">
                Find your<br />
                <span className="ad-h1-soft">calm again.</span>
              </h1>
              <p className="ad-tagline">
                Step into cinematic worlds — a chai tapri in the rain, a misty countryside evening, a silent cabin at midnight. Relax solo, focus deeply, or share a quiet moment with someone you love.
              </p>
              <div className="ad-pills">
                {["🌧️ Immersive Scenes", "💌 Secret Message Wall", "👥 Co-Presence Rooms", "🎵 Sound Mixer", "🕯️ Focus Mode", "📖 Mood Journal"].map((p) => (
                  <span key={p} className="ad-pill">{p}</span>
                ))}
              </div>
              <div className="ad-stats">
                {[{ n: "8+", l: "Chill Worlds" }, { n: "24/7", l: "Always Open" }, { n: "∞", l: "Cozy Hours" }, { n: "0", l: "Ads. Ever." }].map(({ n, l }) => (
                  <div key={l}>
                    <div className="ad-stat-num">{n}</div>
                    <div className="ad-stat-lbl">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Login Card */}
            <div className="ad-card">
              {SCENES.map((s) => (
                <div key={s.name} className={`ad-scene-row${s.active ? " active" : ""}`}>
                  <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    <div className="ad-scene-icon">{s.icon}</div>
                    <div>
                      <div className="ad-scene-name">{s.name}</div>
                      <div className="ad-scene-sub">{s.sub}</div>
                    </div>
                  </div>
                  <span className={s.live ? "ad-badge-live" : "ad-badge-soon"}>
                    {s.live ? "Live" : "Soon"}
                  </span>
                </div>
              ))}

              <div className="ad-divider" />
              <p className="ad-cta-hint">Your world is waiting inside</p>

              <button className="ad-btn" onClick={handleGoogleLogin}>
                <GoogleIcon />
                Enter with Google
              </button>

              <p style={{ textAlign: "center", fontSize: 11, fontFamily: "-apple-system,sans-serif", color: "rgba(237,232,224,.18)", letterSpacing: ".04em" }}>
                Free forever · No credit card · No ads
              </p>
              <div className="ad-trust">
                {["✦ Private", "✦ Secure", "✦ Instant access"].map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="ad-hr" />

        {/* FEATURES */}
        <section className="ad-section">
          <div className="ad-section-label">What's inside</div>
          <h2 className="ad-section-h2">More than just ambience.</h2>
          <p className="ad-section-sub">
            ApniDuniya is a complete peaceful internet space — built for people who need to slow down, connect meaningfully, and feel at home online.
          </p>
          <div className="ad-feat-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="ad-feat-card">
                <div className="ad-feat-icon">{f.icon}</div>
                <div className="ad-feat-title">{f.title}</div>
                <div className="ad-feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="ad-hr" />

        {/* USE CASES */}
        <section className="ad-section" style={{ paddingTop: 52 }}>
          <div className="ad-section-label">Who it's for</div>
          <h2 className="ad-section-h2">A space for every kind of tired.</h2>
          <p className="ad-section-sub" style={{ marginBottom: 36 }}>
            Whether you're studying, missing someone, or just need a break from the noise — there's a world here for you.
          </p>
          <div className="ad-uc-grid">
            {USE_CASES.map((u) => (
              <div key={u.tag} className="ad-uc-card">
                <div className="ad-uc-tag">{u.tag}</div>
                <p className="ad-uc-desc">{u.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TICKER */}
        <div className="ad-ticker-wrap" style={{ marginTop: 48 }}>
          <div className="ad-ticker">
            {["☕ Chai Tapri Rain", "·", "💌 Secret Wall", "·", "👥 Co-Presence Rooms", "·", "🎵 Sound Mixer", "·", "🕯️ Focus Mode", "·", "🌄 Countryside Sunset", "·", "📖 Mood Journal", "·",
              "☕ Chai Tapri Rain", "·", "💌 Secret Wall", "·", "👥 Co-Presence Rooms", "·", "🎵 Sound Mixer", "·", "🕯️ Focus Mode", "·", "🌄 Countryside Sunset", "·", "📖 Mood Journal", "·"].map((item, i) => (
              <span key={i} style={{ color: item === "·" ? "rgba(210,170,110,.35)" : "rgba(237,232,224,.22)" }}>{item}</span>
            ))}
          </div>
        </div>

        {/* FINAL CTA */}
        <section className="ad-final">
          <div className="ad-section-label">Ready to escape?</div>
          <h2 className="ad-final-h2">
            One click.<br />
            <span style={{ color: "rgba(210,185,150,.5)", fontStyle: "italic" }}>Infinite calm.</span>
          </h2>
          <p className="ad-final-sub">
            No setup. No algorithm. No noise. Just your world, your sound, and the people you want to share it with.
          </p>
          <button className="ad-btn-inline" onClick={handleGoogleLogin}>
            <GoogleIcon />
            Enter ApniDuniya — it's free
          </button>
          <div className="ad-trust" style={{ marginTop: 16 }}>
            {["✦ Always free", "✦ No ads", "✦ No algorithm"].map((t) => (
              <span key={t} style={{ fontSize: 11, fontFamily: "-apple-system,sans-serif", color: "rgba(237,232,224,.2)" }}>{t}</span>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="ad-footer">
          <span className="ad-footer-txt">ApniDuniya · Your peaceful corner</span>
          <div className="ad-footer-links">
            {["About", "Privacy", "Contact"].map((l) => (
              <span key={l} className="ad-footer-link">{l}</span>
            ))}
          </div>
        </footer>
      </main>
    </>
  );
}