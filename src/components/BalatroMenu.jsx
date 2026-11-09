import { useState } from "react";
import { Play, Settings, LogOut, Languages } from "lucide-react";
import FractalBackground from "./FractalBackground";
import "./BalatroMenu.css";

export default function BalatroMenu({
  title = "BALADICE",
  version = "1.0.1m-FULL",
  profile = "P1",
  languages = ["English", "Português", "Español"],
  onPlay = () => {},
  onOptions = () => {},
  onQuit = () => {},
  onProfile = () => {},
}) {
  const [langIndex, setLangIndex] = useState(0);

  return (
    <div className="bm-root">
      <FractalBackground />

      <span className="bm-version">{version}</span>

      <main className="bm-stage">
        <div className="bm-logo-wrap">
          <h1 className="bm-logo" aria-label={title}>{title}</h1>
       
            </div>
        </main>

      <button className="bm-corner bm-profile" onClick={onProfile}>
        <span>Profile</span>
        <span className="bm-pill">{profile}</span>
      </button>

      <nav className="bm-dock" aria-label="Main menu">
        <button className="bm-btn bm-play" onClick={onPlay}><Play size={26} fill="currentColor" />PLAY</button>
        <button className="bm-btn bm-options" onClick={onOptions}><Settings size={20} />OPTIONS</button>
        <button className="bm-btn bm-quit" onClick={onQuit}><LogOut size={20} />QUIT</button>

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