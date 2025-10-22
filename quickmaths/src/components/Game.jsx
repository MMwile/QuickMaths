import { useEffect, useState } from "react";
import LevelAura from './LevelAura';

export default function Game({ onFinish }) {
  // Banco de preguntas por nivel
  const questionBank = {
    1: [
      { q: "3 + 5", a: 8 },
      { q: "9 - 2", a: 7 },
      { q: "4 + 6", a: 10 },
      { q: "10 - 8", a: 2 },
      { q: "12 + 3", a: 15 },
      { q: "15 - 5", a: 10 },
      { q: "7 + 9", a: 16 },
      { q: "20 - 11", a: 9 },
      { q: "14 + 6", a: 20 },
      { q: "30 - 17", a: 13 },
    ],
    2: [
      { q: "3 * 4", a: 12 },
      { q: "12 / 4", a: 3 },
      { q: "8 * 5", a: 40 },
      { q: "36 / 6", a: 6 },
      { q: "9 * 3", a: 27 },
      { q: "100 / 25", a: 4 },
      { q: "7 * 8", a: 56 },
      { q: "49 / 7", a: 7 },
      { q: "15 * 2", a: 30 },
      { q: "81 / 9", a: 9 },
    ],
    3: [
      { q: "45 + 27", a: 72 },
      { q: "120 / 6", a: 20 },
      { q: "95 - 38", a: 57 },
      { q: "15 * 12", a: 180 },
      { q: "200 - 175", a: 25 },
      { q: "60 + 45 - 20", a: 85 },
      { q: "72 / 8 + 3", a: 12 },
      { q: "18 * 3 - 20", a: 34 },
      { q: "300 / 10 + 40", a: 70 },
      { q: "20 * 5 - 25", a: 75 },
    ],
    4: [
      { q: "√81", a: 9 },
      { q: "√49 + 3", a: 10 },
      { q: "√16 * 2", a: 8 },
      { q: "1/2 + 3/4", a: 1.25 },
      { q: "3/5 + 2/5", a: 1 },
      { q: "√100 / 2", a: 5 },
      { q: "√25 + √9", a: 8 },
      { q: "2 + 1/4", a: 2.25 },
      { q: "3/2 * 4", a: 6 },
      { q: "√36 + 2/3", a: 6.6667 },
    ],
    5: [
      { q: "x + 5 = 12 (x = ?)", a: 7 },
      { q: "3x = 15 (x = ?)", a: 5 },
      { q: "x/2 + 3 = 7 (x = ?)", a: 8 },
      { q: "2x + 4 = 10 (x = ?)", a: 3 },
      { q: "5x - 10 = 15 (x = ?)", a: 5 },
      { q: "4x = 20 (x = ?)", a: 5 },
      { q: "x - 8 = 6 (x = ?)", a: 14 },
      { q: "2x + 10 = 30 (x = ?)", a: 10 },
      { q: "9x = 81 (x = ?)", a: 9 },
      { q: "x/3 + 4 = 10 (x = ?)", a: 18 },
    ],
  };

  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const QUESTIONS_PER_LEVEL = 2;
  const [remainingQuestions, setRemainingQuestions] = useState(getRandomQuestions(1));
  const [currentQuestion, setCurrentQuestion] = useState(remainingQuestions[0]);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [gameCompleted, setGameCompleted] = useState(false);


function getRandomQuestions(level) {
  const bank = questionBank[level];
  const shuffled = [...bank].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, QUESTIONS_PER_LEVEL);
}



  // Temporizador
  useEffect(() => {
    if (timeLeft <= 0) {
      setShowModal(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Manejar envío de respuesta
  const handleSubmit = (e) => {
    e.preventDefault();
    let userAns = parseFloat(answer);
    if (isNaN(userAns)) return;

    // Verificar respuesta
    if (Math.abs(userAns - currentQuestion.a) < 0.001) {
      setScore(score + 10 * level);
      setFeedback("correct");

      // Eliminar pregunta respondida correctamente
      const newRemaining = remainingQuestions.filter((q) => q.q !== currentQuestion.q);

      // Nivel completado
      if (newRemaining.length === 0) {
        if (level < 5) {
          // Subir al siguiente nivel
          const nextQuestions = getRandomQuestions(level + 1);
          setLevel(level + 1);
          setRemainingQuestions(nextQuestions);
          setCurrentQuestion(nextQuestions[0]);
        } else {
          // Nivel 5 completado: solo re-elegir preguntas del nivel 5
          const nextQuestions = getRandomQuestions(5);
          setRemainingQuestions(nextQuestions);
          setCurrentQuestion(nextQuestions[0]);
        }
      } else {
        setRemainingQuestions(newRemaining);
        setCurrentQuestion(newRemaining[Math.floor(Math.random() * newRemaining.length)]);
      }
    } else {
      setFeedback("wrong");
      setScore(score > 0 ? score - 5 : 0);
    }

    setTimeout(() => setFeedback(null), 600);
    setAnswer("");
  };

  const saveScore = (name, score) => {
    const existing = JSON.parse(localStorage.getItem("quickmaths_ranking") || "[]");
    const playerData = { name, score, date: new Date().toLocaleDateString() };
    const updated = [...existing, playerData];
    updated.sort((a, b) => b.score - a.score);
    localStorage.setItem("quickmaths_ranking", JSON.stringify(updated));
    return playerData;
  };

  const handleSave = () => {
    if (playerName.trim() === "") return;
    const player = saveScore(playerName, score);
    setShowModal(false);
    onFinish(player);
  };

  return (
    <div className="game-page">
    <LevelAura level={level} />
    <div className="game-container fade-in">
      <div className="game-info">
        <span>⏱ Tiempo: {timeLeft}s</span>
        <span>⭐ Puntaje: {score}</span>
        <span>📈 Nivel: {level}</span>
      </div>

      <div
        className={`question-box ${
          feedback === "correct"
            ? "glow-correct"
            : feedback === "wrong"
            ? "glow-wrong"
            : ""
        }`}
      >
        <h2>{currentQuestion?.q}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            autoFocus
            className="answer-input"
            placeholder="Tu respuesta..."
          />
          <button type="submit" className="btn primary small">
            Responder
          </button>
        </form>
      </div>

      {showModal && (
        <div className="modal-overlay fade-in">
          <div className="modal-content">
            {gameCompleted ? (
              <>
                <h2>🎉 ¡Juego completado!</h2>
                <p>Tu puntaje final: <strong>{score}</strong></p>
              </>
            ) : (
              <>
                <h2>⏰ ¡Tiempo agotado!</h2>
                <p>Tu puntaje: <strong>{score}</strong></p>
              </>
            )}
            <input
              type="text"
              placeholder="Ingresa tu nombre..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="answer-input"
            />
            <button className="btn primary small" onClick={handleSave}>
              Guardar y ver ranking
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
