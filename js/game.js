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

var gBoard;
var gBombCounter = 0;

function initGame() {
    //console.table(board);
    gBoard = buildBoard();
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
    // var randomI = getRandomInt(0, gLevel.SIZE -1)
    // var randomJ = getRandomInt(0, gLevel.SIZE -1)
    // console.log(randomI)
    // console.log(randomJ)
    board[getRandomInt(0, gLevel.SIZE - 1)][getRandomInt(0, gLevel.SIZE - 1)].isMine = true;
    board[getRandomInt(0, gLevel.SIZE - 1)][getRandomInt(0, gLevel.SIZE - 1)].isMine = true;
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




function cellClicked(elCell, i, j) {
    var cell = gBoard[i][j];
    var minesAround = setMinesNegsCount(gBoard, i, j);
    oncontextmenu = `flag(this,${i}, ${j})`;
    console.log('right', i, j);
    cell.isShown = true;
    if (cell.isMine) {
        mineCounter++;
        if (gLevel.MINES === mineCounter) {
            lostGame();
        }
        setTimeout(() => {
            elCell.innerHTML = `<img class="bomb ${gLevel.SIZE}" src="images/bomb.png">`;
        }, 700);
        elCell.innerHTML = `<img class="bomb ${gLevel.SIZE}" src="images/explotion.gif">`;
    } else {
        elCell.innerHTML = `<span class="numbers ${gLevel.SIZE}">${minesAround}</span>`;
    }


}

function changeLevel(num) {
    gLevel.SIZE = num;
    initGame();
}

function checkGameOver() {

}

function flag(elCell,i, j) {
    var cell = gBoard[i][j]
    window.event.preventDefault()
    elCell.classList.toggle('mark')
    console.log(elCell)
}








