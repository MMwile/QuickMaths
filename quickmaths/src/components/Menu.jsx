export default function Menu({ onStart, onViewRanking }) {
  return (
    <div className="menu-container fade-in">
      <h1 className="game-title">Quick Maths</h1>
      <p className="subtitle">Pon a prueba tu rapidez mental</p>
      <div className="menu-buttons">
        <button className="btn secondary" onClick={onStart}>
          Comenzar Juego
        </button>
        <button className="btn secondary" onClick={onViewRanking}>
          Ver Ranking
        </button>
      </div>
    </div>
  );
}
