import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function Square({ value, onClick }) {
  return (
    <button onClick={onClick}>
      {value}
    </button>
  );
}

Square.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameOver, setGameOver] = useState(false);

  const nextGame = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
    setTimeLeft(10);
    setGameOver(false);
  };

  const resetGame = () => {
    nextGame();
    setXWins(0);
    setOWins(0);
  };

  const handleClick = (index) => {
    if (squares[index] || calculateWinner(squares) || gameOver) return;

    const nextSquares = squares.slice();
    nextSquares[index] = isXNext ? "X" : "O";
    setSquares(nextSquares);
    setIsXNext(!isXNext);
    setTimeLeft(10);
  };

  const winner = calculateWinner(squares);

  useEffect(() => {
    if (winner) {
      setGameOver(true);
      if (winner === "X") setXWins((prev) => prev + 1);
      else if (winner === "O") setOWins((prev) => prev + 1);
    }
  }, [winner]);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
      if (isXNext) setXWins(0);
      else setOWins(0);
    }
  }, [timeLeft, gameOver, isXNext]);

  const status = winner
    ? `Winner: ${winner}`
    : gameOver
    ? "Game Over! Time ran out!"
    : `Next player: ${isXNext ? "X" : "O"}`;

  return (
    <div className="board-container">
      <h1 className="status">{status}</h1>
      <div className="scoreboard">
        <p>
          Time left: <span className="time">{timeLeft}s</span>
        </p>
        <p>
          Score -- <span className="score-x">X: {xWins}</span> |{" "}
          <span className="score-o">O: {oWins}</span>
        </p>
      </div>
      <div className="board">
        {squares.map((square, index) => (
          <Square
            key={index}
            value={square}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>
      <button className="next-game-button" onClick={nextGame}>
        Next Game
      </button>
      <button className="restart-button" onClick={resetGame}>
        Restart Game
      </button>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function App() {
  return <Board />;
}
