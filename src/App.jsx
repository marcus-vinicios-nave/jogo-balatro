import BalatroMenu from "./components/BalatroMenu";
import "./App.css";

export default function App() {
  return (
    <BalatroMenu
      onPlay={() => console.log("Play")}
      onOptions={() => console.log("Options")}
      onQuit={() => console.log("Quit")}
      onCollection={() => console.log("Collection")}
    />
  );
}