const cells = document.querySelectorAll("[data-cell]");
const gameStatus = document.getElementById("status");
const restartButton = document.getElementById("restart");
const computerCheckBox = document.getElementById("computer");

let computerPlaying = false;
let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameWon = false;
let gameTie = false;
let movesCount = 0;
let wonPatternIndices = [];

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

computerCheckBox.addEventListener("change", () => {
  computerPlaying = computerCheckBox.checked;
  if (computerPlaying) {
    currentPlayer = "X";
    gameStatus.textContent = `Current Player: ${currentPlayer}`;
  }
});

function bestMove() {
  let bestScore = -Infinity;
  let bestMoveIndex = -1;

  for (let i = 0; i < gameBoard.length; i++) {
    if (gameBoard[i] === "") {
      tempBoard = [...gameBoard];
      tempBoard[i] = "O";
      let score = minimax(tempBoard, 0, false);
      
      if (score > bestScore) {
        bestScore = score;
        bestMoveIndex = i;
      }
    }
  }

  return bestMoveIndex;
}

function minimax(board, depth, isMaximizing) {
  const scores = {
    X: -10,
    O: 10,
    tie: 0,
  };

  const winner = checkWin(board);
  if (winner) {
    return scores[winner];
  }

  if (!board.includes("")) {
    return scores.tie;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(bestScore, score);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(bestScore, score);
      }
    }
    return bestScore;
  }
}

function computerMove() {
  if (!gameWon && movesCount < 9) {
    const index = bestMove();
    gameBoard[index] = "O";
    cells[index].textContent = "O";
    movesCount++;

    const winner = checkWin(gameBoard);
    if (winner) {
      gameWon = true;
      gameStatus.textContent = `${winner} has won!`;
      highlightWinningCells(wonPatternIndices);
    } else if (movesCount === 9) {
      gameTie = true;
      gameStatus.textContent = "Game ended in a tie";
    } else {
      switchPlayer();
    }
  }
}

function handleClicks(event) {
  const cell = event.target;
  const index = Array.from(cells).indexOf(cell);
  if (gameBoard[index] === "" && !gameWon) {
    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;
    const winner = checkWin(gameBoard);
    if (winner) {
      if(winner === "tie"){
        gameStatus.textContent = `Game ended in a tie`;
      }else{
        gameWon = true;
        gameStatus.textContent = `${winner} has won!`;
        highlightWinningCells(wonPatternIndices);
      }
    } else {
      movesCount++;
      switchPlayer();
      if (computerPlaying) {
        computerMove();
      }
    }
  }
}

function checkWin(board) {
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      wonPatternIndices = [a,b,c];
      return board[a];
    }
  }
  if (!board.includes("")) {
    return "tie";
  }
  return null;
}

function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  gameStatus.textContent = `Current Player: ${currentPlayer}`;
  clearHighlightedCells();
}

function restartGame() {
  movesCount = 0;
  currentPlayer = "X";
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  gameWon = false;
  gameTie = false;

  cells.forEach((cell) => {
    cell.textContent = "";
    clearHighlightedCells();
  });

  gameStatus.textContent = `Current Player: ${currentPlayer}`;
}


function highlightWinningCells(indices) {
  for (const index of indices) {
    cells[index].classList.add("winner");
  }
}

function clearHighlightedCells() {
  cells.forEach((cell) => {
    cell.classList.remove("winner");
  });
}

cells.forEach((cell) => {
  cell.addEventListener("click", handleClicks);
});

restartButton.addEventListener("click", restartGame);

gameStatus.textContent = `Current Player: ${currentPlayer}`;