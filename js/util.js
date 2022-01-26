'use strict';

function renderBoard() {
  var strHTML = '';
  for (var i = 0; i < gBoard.length; i++) {
      strHTML += `<tr class="board-row" >\n`;
      for (var j = 0; j < gBoard.length; j++) {
        //  var cell = gBoard[i][j];
        //  var className = (cell.isMine) ? 'bomb' : 'floor';
          strHTML += `\t<td oncontextmenu="flag(this, ${i}, ${j})"
              onclick="cellClicked(this, ${i}, ${j})"></td>`;

      }
      strHTML += `</tr>\n`;
  }
  var elCells = document.querySelector('.game-board');
  elCells.innerHTML = strHTML;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  