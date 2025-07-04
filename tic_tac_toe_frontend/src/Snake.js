import React, { useEffect, useRef, useState } from "react";
import "./Snake.css";

// PUBLIC_INTERFACE
/**
 * SnakeGame component renders a modern, minimalistic, and responsive Snake game.
 * Features: Central game board, score display, start/reset controls, keyboard controls, smooth movement, game over/restart.
 * Color Palette: Primary (#2196F3), Secondary (#4CAF50), Accent (#FF5252), on a clean, light background.
 */
function SnakeGame() {
  // Game board settings
  const BOARD_SIZE = 16; // 16x16 grid, configurable for responsiveness
  const INITIAL_SPEED = 120; // ms per move
  const MIN_SPEED = 60;
  const SPEED_STEP = 4;
  const [boardSize, setBoardSize] = useState(BOARD_SIZE);

  // Direction constants: [dx, dy]
  const DIRECTIONS = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
  };
  const OPPOSITES = {
    ArrowUp: "ArrowDown",
    ArrowDown: "ArrowUp",
    ArrowLeft: "ArrowRight",
    ArrowRight: "ArrowLeft",
  };

  // Game state
  const [snake, setSnake] = useState([
    { x: Math.floor(BOARD_SIZE / 2), y: Math.floor(BOARD_SIZE / 2) },
  ]);
  const [direction, setDirection] = useState("ArrowRight");
  const [nextDirection, setNextDirection] = useState("ArrowRight");
  const [food, setFood] = useState(getRandomPosition(BOARD_SIZE, []));
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState("init"); // 'init', 'running', 'over'
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  // Ref for timing and input lock
  const intervalRef = useRef();
  const inputLocked = useRef(false);

  // Board size adaptation for mobile/desktop
  useEffect(() => {
    function updateBoardSize() {
      if (window.innerWidth < 500) setBoardSize(12);
      else setBoardSize(BOARD_SIZE);
    }
    updateBoardSize();
    window.addEventListener("resize", updateBoardSize);
    return () => window.removeEventListener("resize", updateBoardSize);
    // eslint-disable-next-line
  }, []);

  // Start/stop the main game interval
  useEffect(() => {
    if (gameState !== "running") {
      clearInterval(intervalRef.current);
      return;
    }
    // Run moveSnake at the current speed
    intervalRef.current = setInterval(() => {
      moveSnake();
      inputLocked.current = false;
    }, speed);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [gameState, speed, snake, nextDirection, food]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!DIRECTIONS[e.key]) return;
      if (gameState !== "running") return;
      if (inputLocked.current) return;
      // Prevent reversing on itself
      if (OPPOSITES[e.key] === direction) return;
      setNextDirection(e.key);
      inputLocked.current = true;
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // PUBLIC_INTERFACE
  function startGame() {
    setSnake([
      { x: Math.floor(boardSize / 2), y: Math.floor(boardSize / 2) },
    ]);
    setDirection("ArrowRight");
    setNextDirection("ArrowRight");
    setFood(getRandomPosition(boardSize, []));
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameState("running");
  }

  // PUBLIC_INTERFACE
  function resetGame() {
    setSnake([
      { x: Math.floor(boardSize / 2), y: Math.floor(boardSize / 2) },
    ]);
    setDirection("ArrowRight");
    setNextDirection("ArrowRight");
    setFood(getRandomPosition(boardSize, []));
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameState("init");
  }

  // PUBLIC_INTERFACE
  function moveSnake() {
    const [dx, dy] = DIRECTIONS[nextDirection];
    const newHead = {
      x: snake[0].x + dx,
      y: snake[0].y + dy,
    };
    if (
      // Out of bounds
      newHead.x < 0 || newHead.x >= boardSize || newHead.y < 0 || newHead.y >= boardSize ||
      // Self collision
      snake.some((cell) => cell.x === newHead.x && cell.y === newHead.y)
    ) {
      setGameState("over");
      return;
    }

    let newSnake;
    if (newHead.x === food.x && newHead.y === food.y) {
      // Ate food
      newSnake = [newHead, ...snake];
      setScore((s) => s + 1);
      setFood(getRandomPosition(boardSize, [newHead, ...snake]));
      if (speed > MIN_SPEED) setSpeed((sp) => sp - SPEED_STEP);
    } else {
      newSnake = [newHead, ...snake.slice(0, -1)];
    }
    setSnake(newSnake);
    setDirection(nextDirection);
  }

  // Game area rendering
  function renderBoard() {
    // 1D array of cells, each with info: isSnake, isHead, isFood
    const cells = [];
    for (let y = 0; y < boardSize; ++y) {
      for (let x = 0; x < boardSize; ++x) {
        let className = "snake-cell";
        let style = {};
        const head = snake[0];
        if (head.x === x && head.y === y) {
          className += " head";
        } else if (snake.some((cell) => cell.x === x && cell.y === y)) {
          className += " body";
        }
        if (food.x === x && food.y === y) {
          className += " food";
        }
        cells.push(
          <div className={className} key={`${x}-${y}`} style={style} aria-label={
            head.x === x && head.y === y
              ? "Snake head"
              : food.x === x && food.y === y
              ? "Food"
              : snake.some((cell) => cell.x === x && cell.y === y)
              ? "Snake body"
              : "Empty cell"
          } />
        );
      }
    }
    return (
      <div
        className="snake-board"
        style={{
          gridTemplateRows: `repeat(${boardSize}, 1fr)`,
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
        }}
        tabIndex={-1}
      >
        {cells}
      </div>
    );
  }

  // Status and controls
  function getStatus() {
    if (gameState === "over") {
      return (
        <span className="snake-status over" data-testid="gameover">
          <strong>Game Over!</strong> Final Score: <span className="snake-score-num">{score}</span>
        </span>
      );
    }
    if (gameState === "running") {
      return (
        <span className="snake-status running">
          Score: <span className="snake-score-num">{score}</span>
        </span>
      );
    }
    return (
      <span className="snake-status init">
        Press <strong>Start</strong> to play!
      </span>
    );
  }

  return (
    <div className="snake-main">
      <div className="snake-container" role="region" aria-label="Snake game board">
        <h2 className="snake-title" style={{color: "var(--primary)"}}>Snake Game</h2>
        <div className="snake-score-box" aria-live="polite">
          {getStatus()}
        </div>
        {renderBoard()}
        <div className="snake-controls">
          {gameState === "init" || gameState === "over" ? (
            <button
              className="snake-btn snake-btn-primary"
              onClick={startGame}
              autoFocus
            >
              {gameState === "over" ? "Restart" : "Start"}
            </button>
          ) : (
            <button
              className="snake-btn snake-btn-secondary"
              onClick={resetGame}
            >
              Reset
            </button>
          )}
        </div>
        <div className="snake-help">
          <small>
            <span style={{color: "var(--secondary)"}}>Controls:</span> Use <b>Arrow keys</b> to move. Avoid walls & hitting yourself. <br />
            Grows +1 for each food. Game speeds up as your score increases.
          </small>
        </div>
      </div>
    </div>
  );
}

// Return a random empty position
function getRandomPosition(boardSize, filled) {
  const filledSet =
    Array.isArray(filled) && filled.length
      ? new Set(filled.map((c) => `${c.x},${c.y}`))
      : new Set();
  let x, y, pos;
  do {
    x = Math.floor(Math.random() * boardSize);
    y = Math.floor(Math.random() * boardSize);
    pos = `${x},${y}`;
  } while (filledSet.has(pos));
  return { x, y };
}

export default SnakeGame;
