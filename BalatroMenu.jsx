import { useState } from "react";
import { Play, Settings, LogOut, Layers, Lock, Languages } from "lucide-react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@500;700&display=swap');

.bm-root { position: relative; min-height: 100vh; overflow: hidden; font-family: 'Pixelify Sans', monospace; color: #fff; background: #b3262b; }
.bm-root *, .bm-root *::before, .bm-root *::after { box-sizing: border-box; }

/* Fundo líquido vermelho/azul */
.bm-bg { position: absolute; inset: -20%; filter: blur(28px) contrast(1.25) saturate(1.2); animation: bm-spin 40s linear infinite; background:
  radial-gradient(40% 35% at 50% 50%, #1d6fd0 0%, transparent 70%),
  radial-gradient(35% 45% at 22% 30%, #e0443f 0%, transparent 70%),
  radial-gradient(40% 40% at 80% 70%, #8f1d22 0%, transparent 70%),
  radial-gradient(30% 30% at 75% 20%, #d63a3a 0%, transparent 70%),
  radial-gradient(30% 35% at 25% 80%, #5a0f17 0%, transparent 70%),
  #a3232a; }
.bm-bg2 { position: absolute; inset: -20%; mix-blend-mode: overlay; filter: blur(40px); animation: bm-spin 60s linear infinite reverse; background:
  radial-gradient(30% 30% at 40% 60%, #3b8df0 0%, transparent 70%),
  radial-gradient(25% 35% at 65% 30%, #ff6b66 0%, transparent 70%); }
@keyframes bm-spin { to { transform: rotate(360deg) scale(1.1); } }

/* CRT */
.bm-crt { position: absolute; inset: 0; pointer-events: none; z-index: 20;
  background: repeating-linear-gradient(to bottom, rgba(0,0,0,.14) 0 1px, transparent 1px 3px),
              radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.45) 100%); }

.bm-version { position: absolute; top: 14px; right: 18px; z-index: 5; font-size: 13px; opacity: .85; }

.bm-stage { position: relative; z-index: 5; display: flex; flex-direction: column; align-items: center; min-height: 100vh; padding: 40px 16px 120px; }

/* Logo */
.bm-logo-wrap { position: relative; margin-top: 8vh; display: flex; align-items: center; justify-content: center; }
.bm-logo { font-size: clamp(64px, 16vw, 180px); font-weight: 700; letter-spacing: .04em; line-height: 1; color: #f4efe6;
  -webkit-text-stroke: 6px #2f4f52; paint-order: stroke fill;
  text-shadow: 0 6px 0 #2f4f52, 0 10px 0 rgba(0,0,0,.25); user-select: none; }

/* Carta bloqueada */
.bm-card-slot { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: clamp(60px, 11vw, 120px); aspect-ratio: 3/4; z-index: 2; }
.bm-card { width: 100%; height: 100%; display: grid; place-items: center; background: #c9ccd9; border: 3px solid #fff; border-radius: 8px; box-shadow: 0 6px 0 rgba(0,0,0,.35); cursor: help; animation: bm-bob 3s ease-in-out infinite; color: #59607a; }
.bm-card:hover, .bm-card:focus-visible { outline: none; transform: translateY(-4px) rotate(-2deg); }
.bm-tip { position: absolute; bottom: calc(100% + 10px); left: 50%; transform: translateX(-50%); width: 200px; padding: 6px; background: #3a4147; border: 2px solid #cfd6dc; border-radius: 10px; text-align: center; pointer-events: none; opacity: 0; transition: opacity .12s; }
.bm-card:hover + .bm-tip, .bm-card:focus-visible + .bm-tip { opacity: 1; }
.bm-tip h3 { margin: 0 0 6px; font-size: 20px; }
.bm-tip p { margin: 0; padding: 6px; font-size: 14px; line-height: 1.2; background: #f4f4f4; color: #1d1d1d; border-radius: 6px; }
.bm-tip b { color: #f5a623; font-weight: 700; }
@keyframes bm-bob { 50% { transform: translateY(-6px) rotate(1deg); } }

/* Painel de botões */
.bm-dock { position: fixed; z-index: 10; left: 50%; bottom: 20px; transform: translateX(-50%); display: flex; align-items: stretch; gap: 14px; padding: 10px; background: #3a4147; border: 3px solid #2a3035; border-radius: 14px; box-shadow: 0 6px 0 rgba(0,0,0,.35); max-width: calc(100vw - 24px); }
.bm-btn { display: flex; align-items: center; justify-content: center; gap: 8px; border: 0; border-radius: 10px; color: #fff; font: inherit; font-weight: 700; cursor: pointer; padding: 0 22px; height: 64px; box-shadow: inset 0 -6px 0 rgba(0,0,0,.28); text-shadow: 0 2px 0 rgba(0,0,0,.3); transition: transform .08s, filter .08s; }
.bm-btn:hover { filter: brightness(1.12); transform: translateY(-2px); }
.bm-btn:active { transform: translateY(2px); box-shadow: inset 0 -2px 0 rgba(0,0,0,.28); }
.bm-btn:focus-visible { outline: 3px solid #fff; outline-offset: 2px; }
.bm-play { background: #1f8bff; font-size: 30px; min-width: 190px; }
.bm-options { background: #f59a0c; font-size: 20px; min-width: 130px; }
.bm-quit { background: #ee3b34; font-size: 20px; min-width: 110px; }
.bm-collection { background: #2fa35a; font-size: 26px; min-width: 190px; }

/* Perfil / idioma / social */
.bm-corner { position: fixed; z-index: 10; bottom: 20px; display: flex; flex-direction: column; gap: 6px; padding: 8px; background: #3a4147; border: 3px solid #2a3035; border-radius: 12px; box-shadow: 0 6px 0 rgba(0,0,0,.35); }
.bm-profile { left: 20px; align-items: center; }
.bm-profile span { font-size: 16px; font-weight: 700; }
.bm-pill { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 6px 18px; background: #5a636b; border: 2px solid #7b858d; border-radius: 8px; color: #fff; font: inherit; font-size: 16px; cursor: pointer; }
.bm-pill:hover { background: #6a747c; }
.bm-right { right: 20px; align-items: flex-end; background: none; border: 0; box-shadow: none; padding: 0; }
.bm-lang { background: #3a4147; border: 3px solid #2a3035; border-radius: 12px; padding: 8px; box-shadow: 0 6px 0 rgba(0,0,0,.35); }

@media (max-width: 900px) {
  .bm-dock { flex-wrap: wrap; justify-content: center; bottom: 90px; }
  .bm-btn { height: 52px; min-width: 0 !important; padding: 0 16px; }
  .bm-play, .bm-collection { font-size: 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .bm-bg, .bm-bg2, .bm-card { animation: none; }
  .bm-btn, .bm-card { transition: none; }
}
`;

export default function BalatroMenu({
  title = "BALATRO",
  version = "1.0.1m-FULL",
  profile = "P1",
  languages = ["English", "Português", "Español"],
  lockedHint = ["Play a 5 card hand that contains only ", "Gold", " cards"],
  onPlay = () => {},
  onOptions = () => {},
  onQuit = () => {},
  onCollection = () => {},
  onProfile = () => {},
}) {
  const [langIndex, setLangIndex] = useState(0);
  const mid = Math.floor(title.length / 2);

  return (
    <div className="bm-root">
      <style>{css}</style>
      <div className="bm-bg" />
      <div className="bm-bg2" />

      <span className="bm-version">{version}</span>

      <main className="bm-stage">
        <div className="bm-logo-wrap">
          <h1 className="bm-logo" aria-label={title}>{title}</h1>
          <div className="bm-card-slot">
            <button className="bm-card" aria-describedby="bm-tip">
              <Lock size={40} strokeWidth={2.5} />
            </button>
            <div className="bm-tip" id="bm-tip" role="tooltip">
              <h3>Locked</h3>
              <p>{lockedHint[0]}<b>{lockedHint[1]}</b>{lockedHint[2]}</p>
            </div>
          </div>
        </div>
      </main>

      <button className="bm-corner bm-profile" onClick={onProfile} style={{ cursor: "pointer", color: "#fff", font: "inherit" }}>
        <span>Profile</span>
        <span className="bm-pill">{profile}</span>
      </button>

      <nav className="bm-dock" aria-label="Main menu">
        <button className="bm-btn bm-play" onClick={onPlay}><Play size={26} fill="currentColor" />PLAY</button>
        <button className="bm-btn bm-options" onClick={onOptions}><Settings size={20} />OPTIONS</button>
        <button className="bm-btn bm-quit" onClick={onQuit}><LogOut size={20} />QUIT</button>
        <button className="bm-btn bm-collection" onClick={onCollection}><Layers size={24} />COLLECTION</button>
      </nav>

      <div className="bm-corner bm-right">
        <button className="bm-pill bm-lang" onClick={() => setLangIndex((i) => (i + 1) % languages.length)}>
          <Languages size={20} />{languages[langIndex]}
        </button>
      </div>

      <div className="bm-crt" />
    </div>
  );
}
