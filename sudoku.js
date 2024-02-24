var numSelected = null;
var tileSelected = null;

var errors = 0;

var numSelected = null;
var tileSelected = null;

var errors = 0;

function generateRandomSudokuBoard()
{
var board = Array.from({ length: 9 }, () => Array(9).fill(0));

// Fill the board with a valid Sudoku configuration
solveSudoku(board);

shuffleBoard(board);

// Copies solved board onto variable solution
const solution = solveSudoku(board);
// Remove a random number of elements to create a puzzle
  removeRandomNumbers(board);

  return { board, solution };
}

function shuffleBoard(board) {
    // Shuffle rows within each 3x3 subgrid
    for (let i = 0; i < 9; i += 3) {
        for (let j = 0; j < 3; j++) {
            const row1 = i + j;
            const row2 = i + Math.floor(Math.random() * 3);
            [board[row1], board[row2]] = [board[row2], board[row1]];
        }
    }

    // Shuffle columns within each 3x3 subgrid
    for (let i = 0; i < 9; i += 3) {
        for (let j = 0; j < 3; j++) {
            const col1 = i + j;
            const col2 = i + Math.floor(Math.random() * 3);
            for (let k = 0; k < 9; k++) {
                [board[k][col1], board[k][col2]] = [board[k][col2], board[k][col1]];
            }
        }
    }
}
    function solveSudoku(board) {
    const emptyCell = findEmptyCell(board);
  
    // If there are no empty cells, the board is solved
    if (!emptyCell) {
      return board.map(row => [...row]); // Return a deep copy of the solved board
    }
  
    const [row, col] = emptyCell;
  
    // Try filling the empty cell with a valid number
    for (let num = 1; num <= 9; num++) {
      if (isValid(board, row, col, num)) {
        board[row][col] = num;
  
        // Recursively attempt to solve the Sudoku
        const solution = solveSudoku(board);
  
        // If the current attempt led to a solution, return it
        if (solution) {
          return solution;
        }
  
        // If the current attempt did not lead to a solution, backtrack
        board[row][col] = 0;
      }
    }
  
    // No valid number found, backtrack to the previous empty cell
    return null;
  }
  
  function isValid(board, row, col, num) {
    // Check if 'num' is not present in the current row, column, and 3x3 subgrid
    return (
      !usedInRow(board, row, num) &&
      !usedInCol(board, col, num) &&
      !usedInBox(board, row - (row % 3), col - (col % 3), num)
    );
  }
  
  function usedInRow(board, row, num) {
    return board[row].includes(num);
  }
  
  function usedInCol(board, col, num) {
    return board.some(row => row[col] === num);
  }
  
  function usedInBox(board, startRow, startCol, num) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) {
          return true;
        }
      }
    }
    return false;
  }
  
  function findEmptyCell(board) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === 0) {
          return [i, j];
        }
      }
    }
    return null;
  }
  
  function removeRandomNumbers(board) {
    // Adjust the difficulty by changing the number of cells to remove
    const cellsToRemove = Math.floor(Math.random() * 16) + 20;
  
    for (let i = 0; i < cellsToRemove; i++) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      board[row][col] = "-";
    }
  }
const result = generateRandomSudokuBoard();
const board = result.board;
var solution = result.solution;

window.onload = function() {
    setGame();
}

function setGame() {
    // Digits 1-9
    for (let i = 1; i <= 9; i++) {
        //<div id="1" class="number">1</div>
        let number = document.createElement("div");
        number.id = i
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    // Board 9x9
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if (board[r][c] != "-") {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
}

function selectNumber(){
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function selectTile() {
    if (numSelected) {
        if (this.innerText != "") {
            return;
        }

        // "0-0" "0-1" .. "3-1"
        let coords = this.id.split("-"); //["0", "0"]
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        if (solution[r][c] == numSelected.id) {
            this.innerText = numSelected.id;
        }
        else {
            errors += 1;
            document.getElementById("errors").innerText = errors;
        }
    }
}
