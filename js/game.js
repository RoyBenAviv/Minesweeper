'use strict';

var gLevel = {
    SIZE: 4,
    MINES: 2
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

var gBoard = buildBoard();

var board = buildBoard();
function initGame() {
    console.table(board);
    buildBoard();
    addCherry()
    renderBoard();

}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: true
            };
            board[i][j] = cell;
        }
    }

    return board;
}

// This function counts how many bombs around the cell
function setMinesNegsCount(board, rowIdx, colIdx) {

    board.minesAroundCount = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            var cell = board[i][j];
            if (cell.isMine) board.minesAroundCount++;
        }
    }
    return board.minesAroundCount;
}

function renderBoard() {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr class="board-row" >\n`;
        for (var j = 0; j < board.length; j++) {
            var cell = board[i][j];
          //  var className = (cell.isMine) ? 'bomb' : 'floor';
            strHTML += `\t<td
                onclick="cellClicked(this, ${i}, ${j})"></td>`;

        }
        strHTML += `</tr>\n`;
    }
    var elCells = document.querySelector('.game-board');
    elCells.innerHTML = strHTML;
}


function cellClicked(elCell, i, j) {
    var cell = gBoard[i][j];
    var minesAround = setMinesNegsCount(board, i, j);
    cell.isShown = true;

    if(cell.isMine) {
        elCell.innerHTML = `<span class="numbers">DEAD</span>`
    } else {
        elCell.innerHTML = `<span class="numbers">${minesAround}</span>`;
    }


}


function checkGameOver() {

}
