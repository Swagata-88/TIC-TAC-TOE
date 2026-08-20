const MARKS = {
  X: `
    <svg class="mark mark-x" viewBox="0 0 100 100" aria-hidden="true">
      <line x1="8" y1="8" x2="92" y2="92"/>
      <line x1="92" y1="8" x2="8" y2="92"/>
    </svg>
  `,

  O: `
    <svg class="mark mark-o" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="45"/>
    </svg>
  `,
};

export function createUI({ onCellClick }) {
  let resultTimer = null;

  const elements = {
    startScreen: document.getElementById("start-screen"),
    gameScreen: document.getElementById("game-screen"),

    board: document.getElementById("board"),
    status: document.getElementById("status"),

    scoreX: document.getElementById("score-x"),
    scoreO: document.getElementById("score-o"),
    scoreDraw: document.getElementById("score-d"),

    cardX: document.getElementById("card-x"),
    cardO: document.getElementById("card-o"),

    playerOLabel: document.getElementById("player-o-label"),

    overlay: document.getElementById("result-overlay"),
    resultIcon: document.getElementById("result-icon"),
    resultTitle: document.getElementById("result-title"),
    resultSub: document.getElementById("result-sub"),

    musicButton: document.getElementById("music-btn"),
  };

  function renderBoard(board, winningLine = []) {
    elements.board.replaceChildren();

    board.forEach((mark, index) => {
      const cell = document.createElement("button");

      cell.className =
        `cell${mark ? " taken" : ""}` +
        `${winningLine.includes(index) ? " win-cell" : ""}`;

      cell.type = "button";
      cell.dataset.index = index;

      cell.setAttribute("role", "gridcell");

      cell.setAttribute(
        "aria-label",
        mark
          ? `Cell ${index + 1}: ${mark}`
          : `Cell ${index + 1}: empty`
      );

      cell.innerHTML = `${MARKS.X}${MARKS.O}`;

      if (mark) {
        const markElement = cell.querySelector(
          `.mark-${mark.toLowerCase()}`
        );

        markElement.classList.add("show");
      }

      cell.addEventListener("click", () => {
        onCellClick(index);
      });

      elements.board.appendChild(cell);
    });
  }

  function renderState(state, winningLine = []) {
    renderBoard(state.board, winningLine);

    elements.scoreX.textContent = state.scores.X;
    elements.scoreO.textContent = state.scores.O;
    elements.scoreDraw.textContent = state.scores.D;

    elements.playerOLabel.innerHTML =
      state.mode === "cpu"
        ? 'CPU <span class="score-mark o">O</span>'
        : 'Player <span class="score-mark o">O</span>';

    const isCpuTurn =
      state.mode === "cpu" && state.currentPlayer === "O";

    elements.status.textContent = isCpuTurn
      ? "CPU's turn"
      : `${state.currentPlayer}'s turn`;

    elements.cardX.className =
      `score-card${
        !state.isOver && state.currentPlayer === "X"
          ? " active-x"
          : ""
      }`;

    elements.cardO.className =
      `score-card${
        !state.isOver && state.currentPlayer === "O"
          ? " active-o"
          : ""
      }`;
  }

  function showGame() {
    elements.startScreen.style.display = "none";
    elements.gameScreen.style.display = "flex";
  }

  function showStart() {
    hideResult();

    elements.gameScreen.style.display = "none";
    elements.startScreen.style.display = "flex";
  }

  function hideResult() {
    window.clearTimeout(resultTimer);
    resultTimer = null;

    elements.overlay.classList.remove("show");
  }

  function showResult({ winner, mode }) {
    const isDraw = !winner;

    elements.resultIcon.textContent = isDraw ? "—" : winner;

    elements.resultIcon.className =
      `result-icon ${isDraw ? "draw" : winner.toLowerCase()}`;

    const winnerName =
      mode === "cpu" && winner === "O"
        ? "CPU"
        : `Player ${winner}`;

    elements.resultTitle.textContent = isDraw
      ? "It's a Draw"
      : `${winnerName} Wins`;

    elements.resultSub.textContent = isDraw
      ? "Nobody wins this round"
      : "Well played";

    window.clearTimeout(resultTimer);

    resultTimer = window.setTimeout(() => {
      elements.overlay.classList.add("show");
    }, 500);
  }

  function setMusicLabel(isPlaying) {
    elements.musicButton.textContent = isPlaying
      ? "🔊 Music ON"
      : "🔇 Music OFF";
  }

  return {
    elements,
    renderState,
    showGame,
    showStart,
    hideResult,
    showResult,
    setMusicLabel,
  };
}