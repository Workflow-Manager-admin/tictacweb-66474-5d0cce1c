import React, { useState, useEffect, useRef } from "react";

/**
 * PUBLIC_INTERFACE
 * AdditionGame - A minimal, modern math quiz game for simple addition.
 * Generates random addition questions, provides instant feedback, and keeps score.
 * Design matches the existing modern, responsive, and minimalistic style.
 */
function AdditionGame() {
  const [num1, setNum1] = useState(null);
  const [num2, setNum2] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState(null); // "correct" | "incorrect" | null
  const [questionCount, setQuestionCount] = useState(0);
  const inputRef = useRef(null);

  // Generates a new question with two random numbers
  // Numbers between 1–50 for moderate difficulty
  // PUBLIC_INTERFACE
  function generateQuestion() {
    const n1 = Math.floor(Math.random() * 50) + 1;
    const n2 = Math.floor(Math.random() * 50) + 1;
    setNum1(n1);
    setNum2(n2);
    setUserAnswer("");
    setStatus(null);
    setQuestionCount(count => count + 1);
    // Focus on input for fast workflow
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 50);
  }

  // On mount, show first question
  useEffect(() => {
    generateQuestion();
    // eslint-disable-next-line
  }, []);

  // Checks the user's answer and gives instant feedback
  // PUBLIC_INTERFACE
  function checkAnswer(e) {
    e.preventDefault();
    if (userAnswer.trim() === "") return;
    const correct = Number(userAnswer) === num1 + num2;
    setStatus(correct ? "correct" : "incorrect");
    if (correct) {
      setScore(s => s + 1);
      // Show next question shortly after correct answer
      setTimeout(() => {
        generateQuestion();
      }, 600);
    }
  }

  // Handles user input (numeric only)
  function handleInputChange(e) {
    // Accept only digits, allow empty
    const val = e.target.value.replace(/[^\d]/g, "");
    setUserAnswer(val);
    setStatus(null);
  }

  // Reset the game state
  // PUBLIC_INTERFACE
  function resetGame() {
    setScore(0);
    setStatus(null);
    setUserAnswer("");
    setQuestionCount(0);
    generateQuestion();
  }

  return (
    <div className="addition-game-container" role="region" aria-label="Addition Game">
      <h2 className="addition-title" style={{color: "var(--primary)", marginTop: 0, marginBottom: 12}}>Addition Game</h2>
      <div className="addition-scoreboard" aria-live="polite">
        <span style={{color: "var(--secondary)", fontWeight: 600, fontSize: "1.09rem"}}>
          Score: <span className="addition-score-num" style={{color: "var(--primary)", fontWeight: 900, fontSize:"1.08em"}}>{score}</span>
        </span>
        <span style={{marginLeft: 17, fontSize: "0.98rem", color: "var(--text-secondary)"}}>
          Q: {questionCount}
        </span>
      </div>
      <form className="addition-form" onSubmit={checkAnswer} autoComplete="off">
        <div className="addition-question-block">
          <span className="addition-question" style={{
            fontWeight: 700,
            fontSize: "1.65rem",
            color: "var(--primary)",
            letterSpacing: "1px"
          }}>
            {num1} <span style={{color:"var(--secondary)"}}>+</span> {num2} = ?
          </span>
        </div>
        <div className="addition-input-row">
          <input
            ref={inputRef}
            className="addition-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            placeholder="Your answer"
            value={userAnswer}
            onChange={handleInputChange}
            style={{
              fontSize: "1.13rem",
              padding: "8px 13px",
              borderRadius: "8px",
              border: `2px solid var(${status === "correct" ? "--secondary" : status === "incorrect" ? "--accent" : "--border-color"})`,
              outline: "none",
              width: 92,
              textAlign: "center",
              marginRight: 9,
              color: "var(--text-primary)",
              background: "var(--bg-secondary)",
              transition: "border 0.13s"
            }}
            aria-label="Enter your answer"
            autoFocus
            disabled={status === "correct"}
          />
          <button
            className="btn addition-btn-submit"
            type="submit"
            style={{
              background: "var(--button-bg)",
              color: "var(--button-text)",
              border: "none",
              borderRadius: "8px",
              padding: "8px 20px",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
            }}
            disabled={userAnswer.trim() === "" || status === "correct"}
            aria-label="Submit answer"
          >
            Check
          </button>
          <button
            className="btn addition-btn-reset"
            type="button"
            style={{
              marginLeft: 10,
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "8px 16px",
              fontWeight: 600,
              fontSize: "0.97rem",
              cursor: "pointer",
            }}
            onClick={resetGame}
            aria-label="Reset game"
          >
            Reset
          </button>
        </div>
      </form>
      <div className="addition-feedback" style={{
        minHeight: 31,
        fontSize: "1.08rem",
        fontWeight: 600,
        marginTop: 10,
        color: status === "correct" ? "var(--secondary)" : status === "incorrect" ? "var(--accent)" : "var(--text-secondary)",
        transition: "color 0.16s"
      }} aria-live="polite">
        {status === "correct" && <>✅ Correct!</>}
        {status === "incorrect" && <>❌ Incorrect. Try again!</>}
      </div>
      <div className="addition-help" style={{
        marginTop: 20,
        color: "var(--primary)",
        fontSize: "0.97rem",
        opacity: 0.8,
        textAlign: "center"
      }}>
        Solve as many addition problems as you can. <br />
        <span style={{color: "var(--secondary)"}}>Instant feedback</span> for each answer.<br />
        Score increases with each correct response. <br />
        Hit <span style={{color:"var(--accent)"}}>Reset</span> to start again!
      </div>
    </div>
  );
}

export default AdditionGame;
