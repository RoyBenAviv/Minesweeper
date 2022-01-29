'use strict';

var gLevel = {
    SIZE: 6,
    MINES: [3, 12, 25]
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
var gBombs = gLevel.MINES[gCurrLevelIdx];

// CATCH MODAL
var gElModal = document.querySelector('.modal');
var gElWin = document.querySelector('.win');
var gElLose = document.querySelector('.lose');

// This function starts the game
function initGame() {
    restartInit()
    placeRndMines();
    renderBoard();
    userBombs();
    clearInterval(gTimerInterval);
    gFirstClick = false;
    gGame.isOn = true;
}

function restartInit() {
    gBoard = buildBoard();
    gGame.lives = 3;
    gBombs = gLevel.MINES[gCurrLevelIdx];
    gLives = 2;
    gElLives.innerText = 3;
    gElTimer.innerText = 0;
    gGame.markedCount = 0;
    gGame.shownCount = 0;
    gElModal.style.display = 'none';
    gElWin.style.display = 'none';
    gElLose.style.display = 'none';
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
function setMinesNegsCount(board, rowIdx, colIdx) {
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


function expandShown(board, elCell, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board.length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            var cell = board[i][j];
            if (cell.isMine || cell.isMarked || cell.isShown) continue;
            cell.isShown = true;
            gGame.shownCount++;
            elCell = document.querySelector(`.cell-${i}-${j}`);
            elCell.classList.add('clicked');
            if (!cell.minesAroundCount) {
                elCell.inneText = '';
            } else if (cell.minesAroundCount === 1) {
                elCell.innerText = cell.minesAroundCount;
                elCell.style.color = 'blue';
            } else if (cell.minesAroundCount === 2) {
                elCell.innerText = cell.minesAroundCount;
                elCell.style.color = 'green';
            } else if (cell.minesAroundCount === 3) {
                elCell.innerText = cell.minesAroundCount;
                elCell.style.color = 'red';
            }
        }
    }
}


// All Scenarios when user clicks a cell
function cellClicked(elCell, i, j) {
    var cell = gBoard[i][j];
    if (cell.execution || !gGame.isOn || cell.isShown || cell.isMarked) return;
    if (!gFirstClick) {
        startTimer();
        gFirstClick = !gFirstClick;
    }
    cell.isShown = true;
    oncontextmenu = `flag(this,${i}, ${j})`;
    if (cell.isMine) {
        explotionSound();
        userBombs();
        gGame.lives--;
        showLives();
        if (!gGame.lives) { // LOSE
            gGame.isOn = false;
            clearInterval(gTimerInterval);
            gElModal.style.display = 'flex';
            gElLose.style.display = 'block';
            getMines()
        }
        setTimeout(() => {
            elCell.innerHTML = `<img class="bomb" src="images/bomb.png">`;
        }, 700);
        elCell.innerHTML = `<img class="bomb" src="images/explotion.gif">`;
    } else { // when cell clicked and its not mine or marked
        gGame.shownCount++;
        correctSound();
        checkGameOver();
        setTimeout(() => {
            elCell.classList.add('clicked');
            elCell.innerText = cell.minesAroundCount;
            if (!cell.minesAroundCount) {
                expandShown(gBoard, elCell, i, j);
                elCell.innerText = '';
            } else if (cell.minesAroundCount === 1) elCell.style.color = 'blue';
            else if (cell.minesAroundCount === 2) elCell.style.color = 'green';
            else if (cell.minesAroundCount == 3) elCell.style.color = 'red';
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
        gGame.markedCount++;
        if (cell.isMine) checkGameOver();
        elCell.innerHTML = `<img class="flag" src="images/flag.png">`;
    } else { // if cell not contains mark class
        elCell.innerHTML = '';
        cell.isMarked = !cell.isMarked;
        gGame.markedCount--;
        cell.isShown = false;
    }
}

function changeLevel(num) {
    gLevel.SIZE = num;
    if (num === 6) {
        gCurrLevelIdx = 0;
        initGame();
    } else if (num === 8) {
        gCurrLevelIdx = 1;
        initGame();
    } else if (num === 10) {
        gCurrLevelIdx = 2;
        initGame();
    }
}

function checkGameOver() { // WIN
        if(gLevel.SIZE**2 === gGame.shownCount + gLevel.MINES[gCurrLevelIdx] || gLevel.SIZE**2 === gGame.shownCount) {
        gGame.isOn = false;
        clearInterval(gTimerInterval);
        gElModal.style.display = 'flex';
        gElWin.style.display = 'block';
        getMines()
    }
}

function placeRndMines() {
    for (var i = 0; i < gLevel.MINES[gCurrLevelIdx]; i++) {
        var randomMine = gBoard[getRandomInt(0, gLevel.SIZE - 1)][getRandomInt(0, gLevel.SIZE - 1)];
         if (randomMine.isMine) i--;
        randomMine.isMine = true;
    }
}

function clearedCells(elCell) {
    var clearedCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine || cell.isShown) continue;
            elCell = document.querySelector(`.cell-${i}-${j}`);
            clearedCells.push(elCell);
        }
    }
    return clearedCells;

}

function getHint() {
    var hints = clearedCells();
    var idx = getRandomInt(0, hints.length - 1);
    var drawnCell = hints[idx];
    hints.splice(idx, 1);
    drawnCell.classList.add('hint');
    setTimeout(() => {
        drawnCell.classList.remove('hint');
    }, 1500);
}


function allMines(elCell) {
    var cellMines = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            if (!cell.isMine) continue;
            elCell = document.querySelector(`.cell-${i}-${j}`);
            cellMines.push(elCell);
        }
    }
    return cellMines;
}

function getMines() {
    var mines = allMines()

    for(var i = 0; i < mines.length; i++) {
        mines[i].innerHTML = `<img class="bomb" src="images/bomb.png">`
    }


}
