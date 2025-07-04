import React, { useState, useEffect } from 'react';
import './App.css';
import SnakeGame from './Snake';
import AdditionGame from './AdditionGame';

// PUBLIC_INTERFACE
function AppNav({ currentGame, setGame }) {
  return (
    <div className="tictac-mode-select snake-navbar" style={{ marginBottom: 14 }}>
      <button
        className={`btn tictac-mode-btn${currentGame === "tictactoe" ? " active" : ""}`}
        type="button"
        onClick={() => setGame("tictactoe")}
        aria-pressed={currentGame === "tictactoe"}
      >Tic Tac Toe</button>
      <button
        className={`btn tictac-mode-btn${currentGame === "snake" ? " active" : ""}`}
        style={{ color: "#fff", background: currentGame === "snake" ? "var(--primary)" : undefined }}
        type="button"
        onClick={() => setGame("snake")}
        aria-pressed={currentGame === "snake"}
      >Snake</button>
      <button
        className={`btn tictac-mode-btn${currentGame === "addition" ? " active" : ""}`}
        style={{ color: "#fff", background: currentGame === "addition" ? "var(--primary)" : undefined }}
        type="button"
        onClick={() => setGame("addition")}
        aria-pressed={currentGame === "addition"}
      >Addition Game</button>
    </div>
  );
}

/*
  --- Color Palette and Theme ---
  Primary:   #2196F3 (Blue)
  Secondary: #4CAF50 (Green)
  Accent:    #FF5252 (Red)
  Light, modern, minimalistic theme/colors (see App.css for CSS custom properties).
*/

// Utility for determining winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (const [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

/**
 * PUBLIC_INTERFACE
 * Main App component. Allows toggling between Tic Tac Toe and Snake games.
 */
function App() {
  // Theme: support toggle, default = light
  const [theme, setTheme] = useState('light');
  const [currentGame, setCurrentGame] = useState("tictactoe");

  // 0: Player vs Player, 1: Player vs Computer
  const [gameMode, setGameMode] = useState(0);
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), xIsNext: true }
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [draws, setDraws] = useState(0);

  // Handle theme switching
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // For computer move
  useEffect(() => {
    if (gameMode === 1) {
      const current = history[stepNumber];
      if (!current.xIsNext && !calculateWinner(current.squares) && !current.squares.every(Boolean)) {
        // Simple AI: random or first available
        const emptyIndices = current.squares
          .map((val, idx) => (val == null ? idx : null))
          .filter(idx => idx != null);
        if (emptyIndices.length > 0) {
          // Add a small delay for more natural feel
          const aiPlay = setTimeout(() => {
            makeMove(emptyIndices[0]);
          }, 400);
          return () => clearTimeout(aiPlay);
        }
      }
    }
    // eslint-disable-next-line
  }, [gameMode, history, stepNumber]);

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);
  const isDraw = !winner && current.squares.every(Boolean);

  useEffect(() => {
    if (winner) {
      setScores(prev => ({
        ...prev,
        [winner]: prev[winner] + 1
      }));
    } else if (isDraw) {
      setDraws(prev => prev + 1);
    }
    // Only after move, not on mount
    // eslint-disable-next-line
  }, [winner, isDraw]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // PUBLIC_INTERFACE
  const handleModeChange = (mode) => {
    resetGame();
    setGameMode(mode);
  };

  // PUBLIC_INTERFACE
  function makeMove(i) {
    const hist = history.slice(0, stepNumber + 1);
    const currentStep = hist[hist.length - 1];
    const squares = currentStep.squares.slice();
    if (calculateWinner(squares) || squares[i]) return;
    squares[i] = currentStep.xIsNext ? 'X' : 'O';
    setHistory(hist.concat([
      { squares: squares, xIsNext: !currentStep.xIsNext }
    ]));
    setStepNumber(hist.length);
  }

  // PUBLIC_INTERFACE
  function jumpTo(step) {
    setStepNumber(step);
  }

  // PUBLIC_INTERFACE
  function resetGame() {
    setHistory([{ squares: Array(9).fill(null), xIsNext: true }]);
    setStepNumber(0);
  }

  // PUBLIC_INTERFACE
  function resetAll() {
    resetGame();
    setScores({ X: 0, O: 0 });
    setDraws(0);
  }

  const renderSquare = i => (
    <button
      key={i}
      className={`tictac-square${current.squares[i] ? " filled" : ""}`}
      onClick={() => {
        if (
          winner ||
          (gameMode === 1 && !current.xIsNext) ||
          current.squares[i]
        ) return;
        makeMove(i);
      }}
      aria-label={`Cell ${i} ${current.squares[i] ? current.squares[i] : ''}`}
      style={{
        color: current.squares[i] === 'X'
          ? "var(--primary)"
          : current.squares[i] === 'O'
          ? "var(--secondary)"
          : "inherit"
      }}
    >{current.squares[i]}</button>
  );

  // Status message display
  let status;
  if (winner) {
    status = (
      <span className="winner">
        {winner === 'X' ? 'Player 1' : gameMode === 0 ? 'Player 2' : 'Computer'} wins!
      </span>
    );
  } else if (isDraw) {
    status = <span className="draw">Draw game!</span>;
  } else {
    if (gameMode === 0) {
      status = <span>
        {current.xIsNext ? "Player 1's turn (X)" : "Player 2's turn (O)"}
      </span>;
    } else {
      status = <span>
        {current.xIsNext ? "Your turn (X)" : "Computer's turn (O)"}
      </span>;
    }
  }

  return (
    <div className="App tictac-main">
      <header className="App-header tictac-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <div className="tictac-container" style={currentGame === "snake" ? {padding: 0, boxShadow:'none',background:'none',width:"unset"}:{}}>
          <AppNav currentGame={currentGame} setGame={setCurrentGame} />
          {currentGame === "tictactoe" ? (
            <>
              <h1 className="tictac-title">Tic Tac Toe</h1>
              <div className="tictac-mode-select">
                <ModeButton
                  label="Player vs Player"
                  active={gameMode === 0}
                  onClick={() => handleModeChange(0)}
                />
                <ModeButton
                  label="Player vs Computer"
                  active={gameMode === 1}
                  onClick={() => handleModeChange(1)}
                />
              </div>
              <div className="tictac-status">{status}</div>
              <Scoreboard scores={scores} draws={draws} gameMode={gameMode} />
              <div className="tictac-board">
                {[0, 1, 2].map(row => (
                  <div className="tictac-row" key={row}>
                    {[
                      3 * row,
                      3 * row + 1,
                      3 * row + 2
                    ].map(renderSquare)}
                  </div>
                ))}
              </div>
              <div className="tictac-controls">
                <button className="btn tictac-control-btn" onClick={resetGame}>
                  Reset Round
                </button>
                <button className="btn tictac-control-btn accent" onClick={resetAll}>
                  Reset All
                </button>
              </div>
            </>
          ) : currentGame === "snake" ? (
            <SnakeGame />
          ) : (
            <AdditionGame />
          )}
        </div>
        <footer className="tictac-footer">
          <span>
            &copy; {new Date().getFullYear()} Minimalist React Games Demo
          </span>
        </footer>
      </header>
    </div>
  );
}

// PUBLIC_INTERFACE
function ModeButton({ label, active, onClick }) {
  return (
    <button
      className={`btn tictac-mode-btn${active ? " active" : ""}`}
      onClick={onClick}
      type="button"
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

// PUBLIC_INTERFACE
function Scoreboard({ scores, draws, gameMode }) {
  return (
    <div className="tictac-scoreboard">
      <span>
        <strong>{gameMode === 0 ? "Player 1 (X)" : "You (X)"}</strong>: {scores.X}
      </span>
      <span>
        <strong>{gameMode === 0 ? "Player 2 (O)" : "Computer (O)"}</strong>: {scores.O}
      </span>
      <span>
        <strong>Draws</strong>: {draws}
      </span>
    </div>
  );
}

export default App;
