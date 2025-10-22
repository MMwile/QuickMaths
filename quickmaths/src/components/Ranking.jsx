import { useEffect, useState } from "react";

export default function Ranking({ currentPlayer, onBack }) {
  const [ranking, setRanking] = useState([]);
  const [playerPosition, setPlayerPosition] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("quickmaths_ranking") || "[]");
    saved.sort((a, b) => b.score - a.score);
    setRanking(saved.slice(0, 10));

    if (currentPlayer) {
      const index = saved.findIndex(
        (p) => p.name === currentPlayer.name && p.score === currentPlayer.score
      );
      if (index !== -1) setPlayerPosition(index + 1);
    }
  }, [currentPlayer]);

  return (
    <div className="fade-in" style={{ textAlign: "center", padding: "2rem" }}>
      <h1>🏆 Ranking</h1>

      <table className="ranking-table">
        <thead>
          <tr>
            <th>Posición</th>
            <th>Jugador</th>
            <th>Puntaje</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((p, i) => (
            <tr
              key={i}
              className={
                currentPlayer &&
                p.name === currentPlayer.name &&
                p.score === currentPlayer.score
                  ? "current-player"
                  : i < 3
                  ? "highlight"
                  : ""
              }
            >
              <td>#{i + 1}</td>
              <td>{p.name}</td>
              <td>{p.score}</td>
              <td>{p.date}</td>
            </tr>
          ))}

          {/* Mostrar jugador actual si no está en top 10 */}
            {playerPosition && currentPlayer && playerPosition > 10 && (
            <>
              <tr>
                <td colSpan="4" style={{ opacity: 0.5 }}>
                  ...
                </td>
              </tr>
              <tr className="current-player">
                <td>#{playerPosition}</td>
                <td>{currentPlayer.name}</td>
                <td>{currentPlayer.score}</td>
                <td>{currentPlayer.date}</td>
              </tr>
            </>
          )}
        </tbody>
      </table>

      <button className="btn secondary" style={{ marginTop: "1.5rem" }} onClick={onBack}>
        Volver al menú
      </button>
    </div>
  );
}
