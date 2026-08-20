import { getBestMove } from "./ai.js";
import { createAudioController } from "./audio.js";
import { createGame } from "./game.js";
import { createUI } from "./ui.js";

const game = createGame();
const audio = createAudioController();

let cpuTimer = null;

const ui = createUI({
  onCellClick: makeMove,
});

function clearCpuTurn() {
  window.clearTimeout(cpuTimer);
  cpuTimer = null;
}

function render(winningLine = []) {
  ui.renderState(game.getState(), winningLine);
}

function makeMove(index) {
  const state = game.getState();

  // The player cannot click while the CPU is making its move.
  if (state.mode === "cpu" && state.currentPlayer === "O") {
    return;
  }

  const result = game.playMove(index);

  if (!result) {
    return;
  }

  audio.playClick();
  render(result.winningLine ?? []);

  if (result.winner || result.isDraw) {
    finishRound(result);
    return;
  }

  if (result.state.mode === "cpu" && result.state.currentPlayer === "O") {
    cpuTimer = window.setTimeout(playCpuTurn, 420);
  }
}

function playCpuTurn() {
  cpuTimer = null;

  const state = game.getState();

  if (
    state.isOver ||
    state.mode !== "cpu" ||
    state.currentPlayer !== "O"
  ) {
    return;
  }

  const move = getBestMove(state.board);

  if (move === null) {
    return;
  }

  const result = game.playMove(move);

  if (!result) {
    return;
  }

  audio.playClick();
  render(result.winningLine ?? []);

  if (result.winner || result.isDraw) {
    finishRound(result);
  }
}

function finishRound(result) {
  clearCpuTurn();

  if (result.winner) {
    audio.playWin();
  }

  ui.showResult({
    winner: result.winner,
    mode: result.state.mode,
  });
}

function restartRound() {
  clearCpuTurn();
  ui.hideResult();

  game.resetRound();
  render();
}

function startGame() {
  clearCpuTurn();

  // Starting from the menu begins a fresh score session.
  game.resetScores();

  ui.showGame();

  audio.startMusic();
  ui.setMusicLabel(true);

  restartRound();
}

function returnToMenu() {
  clearCpuTurn();
  ui.showStart();
}

/* Mode buttons */

document.querySelectorAll(".mode-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".mode-btn").forEach((modeButton) => {
      modeButton.classList.remove("active");
    });

    button.classList.add("active");
    game.setMode(button.dataset.mode);
  });
});

/* Main buttons */

document.getElementById("start-btn").addEventListener("click", startGame);

document.getElementById("back-btn").addEventListener("click", returnToMenu);

document
  .getElementById("restart-btn")
  .addEventListener("click", restartRound);

document.getElementById("reset-score-btn").addEventListener("click", () => {
  game.resetScores();
  restartRound();
});

document
  .getElementById("result-again")
  .addEventListener("click", restartRound);

document
  .getElementById("result-menu")
  .addEventListener("click", returnToMenu);

ui.elements.musicButton.addEventListener("click", () => {
  const isPlaying = audio.toggleMusic();
  ui.setMusicLabel(isPlaying);
});

/* Initial board */

render();