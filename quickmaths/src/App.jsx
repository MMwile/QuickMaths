import { useState } from "react";
import Menu from "./components/Menu";
import Game from "./components/Game";
import Ranking from "./components/Ranking";
import "./App.css";

export default function App() {
  const [screen, setScreen] = useState("menu");
  const [currentPlayer, setCurrentPlayer] = useState(null);

  return (
    <>
      {screen === "menu" && (
        <Menu
          onStart={() => setScreen("game")}
          onViewRanking={() => setScreen("ranking")}
        />
      )}
      {screen === "game" && (
        <Game
          onFinish={(player) => {
            setCurrentPlayer(player);
            setScreen("ranking");
          }}
        />
      )}
      {screen === "ranking" && (
        <Ranking
          currentPlayer={currentPlayer}
          onBack={() => {
            setScreen("menu");
            setCurrentPlayer(null); // <--- esto limpia el jugador actual
          }}
        />
      )}
    </>
  );
}
