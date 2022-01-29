'use strict';

var gElTimer = document.querySelector('h3:nth-child(1) span');
var gElLives = document.querySelector('h3:nth-child(3) span');
var gLives = 2;

function renderBoard() {
  var strHTML = '';
  for (var i = 0; i < gBoard.length; i++) {
    strHTML += `<tr>\n`;
    for (var j = 0; j < gBoard.length; j++) {
      var cell = gBoard[i][j]
      cell.minesAroundCount = setMinesNegsCount(gBoard, i, j)
      strHTML += `\t<td class="cell-${i}-${j}" oncontextmenu="flag(this, ${i}, ${j})"
              onclick="cellClicked(this, ${i}, ${j})"></td>`;

    }
    strHTML += `</tr>\n`;
  }
  var elCells = document.querySelector('.game-board');
  elCells.innerHTML = strHTML;
}

// user experience
function userBombs() {
  var elBombs = document.querySelector('h3:nth-child(2) span');
  elBombs.innerText = gBombs--;
}

function presentTimer(){
  var currTime = (Date.now() - gStartTime) / 1000
  gElTimer.innerText = `${currTime}`;
}

function startTimer(){
  gStartTime = Date.now();
  gTimerInterval = setInterval (presentTimer, 1);
}

function showLives() {
  gElLives.innerText = gLives--
}
//

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function explotionSound() {
  var audio = new Audio('sounds/explotion.wav');
  audio.play();
}

function correctSound() {
  var audio = new Audio('sounds/correct.mp3');
  audio.play();
}