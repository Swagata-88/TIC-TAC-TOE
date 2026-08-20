export const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],
];

export function findWinningLine(board) {
  return (
    WIN_LINES.find(([a, b, c]) => {
      return board[a] && board[a] === board[b] && board[b] === board[c];
    }) ?? null
  );
}

export function createGame(initialMode = "2p") {
  let board = Array(9).fill(null);
  let currentPlayer = "X";
  let mode = initialMode;
  let scores = {
    X: 0,
    O: 0,
    D: 0,
  };

  let isOver = false;

  function getState() {
    return {
      board: [...board],
      currentPlayer,
      mode,
      scores: { ...scores },
      isOver,
    };
  }

  function resetRound() {
    board = Array(9).fill(null);
    currentPlayer = "X";
    isOver = false;

    return getState();
  }

  function resetScores() {
    scores = {
      X: 0,
      O: 0,
      D: 0,
    };

    return getState();
  }

  function setMode(nextMode) {
    if (nextMode === "2p" || nextMode === "cpu") {
      mode = nextMode;
    }

    return getState();
  }

  function playMove(index) {
    const isInvalidIndex =
      !Number.isInteger(index) || index < 0 || index > 8;

    if (isOver || isInvalidIndex || board[index]) {
      return null;
    }

    const mark = currentPlayer;
    board[index] = mark;

    const winningLine = findWinningLine(board);
    const isDraw = !winningLine && board.every(Boolean);

    if (winningLine || isDraw) {
      isOver = true;

      if (winningLine) {
        scores[mark] += 1;
      } else {
        scores.D += 1;
      }
    } else {
      currentPlayer = mark === "X" ? "O" : "X";
    }

    return {
      mark,
      winner: winningLine ? mark : null,
      winningLine,
      isDraw,
      state: getState(),
    };
  }

  return {
    getState,
    playMove,
    resetRound,
    resetScores,
    setMode,
  };
}