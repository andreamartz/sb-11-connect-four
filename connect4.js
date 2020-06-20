/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])
let boardIsFull = false;
let allowTurn = true;

const turn = document.querySelector("#turn");
turn.innerText = `${currPlayer}'s`;
/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

const makeBoard = () => {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for (let i = 0; i < HEIGHT; i++) {
    // for every row of the board
    const row = [];
    for (let j = 0; j < WIDTH; j++) {
      // make a row with the correct width
      row.push(null);
    }
    board.push(row);
  }
  return board;
};

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector("#board");
  // TODO: add comment for this code

  // top is a tr referring to the top "row" of the board where the players click to drop a piece in
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // headCells are tds in the top "row" of the board
  // this for loop creates them, gives them ids indicating column #,
  // and appends them onto that top row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  // Append top "row to the game board/grid"
  htmlBoard.append(top);

  // TODO: add comment for this code
  // for each row y, create a tr
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    // for each column x, create a td grid cell with id to indicate position & append cell to the current row
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    // append the row to the board
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
const findSpotForCol = (x) => {
  // TODO: write the real version of this, rather than always returning 0
  for (let y = board.length - 1; y >= 0; y--) {
    if (board[y][x] === null) {
      return y;
    }
  }
  return null;
};

/** placeInTable: update DOM to place piece into HTML table of board */

const placeInTable = (y, x) => {
  // make a div and insert into correct table cell
  const piece = document.createElement("div");
  piece.classList.add("piece");
  piece.classList.add("player" + currPlayer);

  // insert piece div into correct td
  const targetTdId = `${y}-${x}`;
  const td = document.getElementById(`${targetTdId}`);
  // const td = document.querySelector(`#${y}-${x}`);  // why doesn't this work?
  td.append(piece);
};

/** endGame: announce game end according to message passed in */
const endGame = (msg) => {
  // pop up alert message after small delay
  setTimeout(() => alert(msg), 300);
  allowTurn = false;
};

/** handleClick: handle click of column top to play piece */
const handleClick = (evt) => {
  // get x from ID of clicked cell
  if (allowTurn) {
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    // TODO: add line to update in-memory board
    placeInTable(y, x);
    board[`${y}`][`${x}`] = currPlayer;

    // check for win
    if (checkForWin(y, x)) {
      return endGame(`Player ${currPlayer} won!`);
    }

    // check for tie
    // TODO: check if all cells in board are filled; if so, call endGame
    const rowFills = [];
    for (let y = 0; y < board.length; y++) {
      const currRowIsFull = board[y].every((el) => el !== null);
      rowFills.push(currRowIsFull);
    }
    boardIsFull = rowFills.every((bool) => bool === true);
    if (boardIsFull) {
      return endGame("Tied Game");
    }

    // switch players
    // TODO: switch currPlayer 1 <-> 2
    currPlayer = currPlayer === 1 ? 2 : 1;
    turn.innerText = `${currPlayer}'s`;
  } else return;
};

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin(y, x) {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // For every cell in the board:
  // 1. ...generate the four possible winning cell "coordinate" combinations
  // 2. ...include the coordinates of impossible cells outside the board
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      // 3. ...check for a win in any of the eight cell combinations
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
