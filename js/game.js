'use strict';

var gLevel = {
    SIZE: 6,
    MINES: [3, 4, 6]
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3
};

var gBoard;
var gCurrLevelIdx = 0;
var gStartTime = 0;
var gTimerInterval;
var gFirstClick = false;


// CATCH MODAL
var gElModal = document.querySelector('.modal');
var gElWin = document.querySelector('.win');
var gElLose = document.querySelector('.lose');

// This function starts the game
function initGame() {
    gBoard = buildBoard();
    gGame.lives = 3;
    gLives = 2;
    gElTimer.innerText = 0;
    gElModal.style.display = 'none';
    gElWin.style.display = 'none';
    gElLose.style.display = 'none';
    placeRndMines();
    renderBoard();
    userBombs();
    clearInterval(gTimerInterval);
    gFirstClick = false;
    gGame.isOn = true;
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
                isMarked: false,
                execution: false
            };
            board[i][j] = cell;
        }
    }
    return board;
}

// This function counts how many bombs around the cell
function setMinesNegsCount(board, elCell, rowIdx, colIdx) {
    board.minesAroundCount = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board.length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            var cell = board[i][j];
            if (cell.isMine) board.minesAroundCount++;
        }
    }
    return board.minesAroundCount;
}

// All Scenarios when user clicks a cell
function cellClicked(elCell, i, j) {
    var cell = gBoard[i][j];
    if (!gFirstClick) {
        startTimer();
        gFirstClick = !gFirstClick;
    }
    cell.minesAroundCount = setMinesNegsCount(gBoard, elCell, i, j);
    cell.isShown = true;
    if (cell.execution || !gGame.isOn) return;
    oncontextmenu = `flag(this,${i}, ${j})`;
    if (cell.isMine) {
        explotionSound();
        gGame.lives--;
        showLives()
        if (gGame.lives === 0) { // LOSE
            gGame.isOn = false;
            gElModal.style.display = 'flex';
            gElLose.style.display = 'block';
        }
        setTimeout(() => {
            elCell.innerHTML = `<img class="bomb" src="images/bomb.png">`;
        }, 700);
        elCell.innerHTML = `<img class="bomb" src="images/explotion.gif">`;
    } else if (!cell.isMine) { // when cell clicked and its not mine or marked
        expandShown(gBoard, i, j);
        gGame.shownCount++;
        correctSound();
        checkGameOver();
        setTimeout(() => {
            elCell.innerHTML = `<span class="numbers">${setMinesNegsCount(gBoard, elCell, i, j)}</span>`;
            if (cell.minesAroundCount === 0) expandShown(gBoard, elCell, i, j);
        }, 700);
        elCell.innerHTML = `<img class="bomb" src="images/v.gif">`;
    }
    cell.execution = true;
}

// Mark cell with flag
function flag(elCell, i, j) {
    var cell = gBoard[i][j];
    cell.isMarked = true;
    window.event.preventDefault();
    if (cell.isShown || !gGame.isOn) return;
    elCell.classList.toggle('mark');
    if (elCell.classList.contains('mark')) { // if the cell contains mark class

        if (cell.isMine) { // if cell is mine
            gGame.markedCount++;
            checkGameOver();
        }
        elCell.innerHTML = `<img class="flag" src="images/flag.png">`;
    } else { // if cell not contains mark class
        elCell.innerHTML = '';
        cell.isMarked = !cell.isMarked;
        cell.isShown = false;
    }
}

function changeLevel(num) {
    gLevel.SIZE = num;
    if (num === 6) {
        gCurrLevelIdx = 0;
        initGame();
    } else if (num === 7) {
        gCurrLevelIdx = 1;
        initGame();
    } else if (num === 8) {
        gCurrLevelIdx = 2;
        initGame();
    }
}


function expandShown(board, elCell, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board.length - 1) continue;
            //  if (i === rowIdx && j === colIdx) continue;
            var cell = board[i][j];
            if (cell.isMine || cell.isMarked || cell.isShown) continue;
            cell.minesAroundCount = setMinesNegsCount(gBoard, elCell, i, j);
            console.log(board[i])
        }
        
    }
}

function checkGameOver() { // WIN
    if (((gGame.shownCount === (gLevel.SIZE ** 2) - gLevel.MINES[gCurrLevelIdx]) &&
        gGame.markedCount === gLevel.MINES[gCurrLevelIdx])) {
        gGame.isOn = false;
        gElModal.style.display = 'flex';
        gElWin.style.display = 'block';
    }
}

function placeRndMines() {
    for (var i = 0; i < gLevel.MINES[gCurrLevelIdx]; i++) {
        var randomMine = gBoard[getRandomInt(0, gLevel.SIZE - 1)][getRandomInt(0, gLevel.SIZE - 1)];
        if (randomMine.isMine) continue;
        randomMine.isMine = true;
    }
}







