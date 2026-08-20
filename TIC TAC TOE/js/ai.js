import { WIN_LINES } from "./game.js";

function findLineMove(board, mark) {
  for (const line of WIN_LINES) {
    const values = line.map((index) => board[index]);

    if (
      values.filter((value) => value === mark).length === 2 &&
      values.includes(null)
    ) {
      return line[values.indexOf(null)];
    }
  }

  return null;
}

/*
  CPU strategy:
  1. Win if possible.
  2. Block X if needed.
  3. Take the center.
  4. Choose a random available cell.
*/
export function getBestMove(board) {
  const winningMove = findLineMove(board, "O");

  if (winningMove !== null) {
    return winningMove;
  }

  const blockingMove = findLineMove(board, "X");

  if (blockingMove !== null) {
    return blockingMove;
  }

  if (!board[4]) {
    return 4;
  }

  const emptyCells = board
    .map((value, index) => (value ? null : index))
    .filter((index) => index !== null);

  return emptyCells[Math.floor(Math.random() * emptyCells.length)] ?? null;
}