import Player from './Player';

let currentPlayer = false;
let opponentPlayer = false;
let firstPlayer = false;
let secondPlayer = false;
let winner = false;
let started = false;

function start(playerFunc=Player) {
  firstPlayer = playerFunc();
  secondPlayer = playerFunc();
  currentPlayer = firstPlayer;
  opponentPlayer = secondPlayer;
  started = true;
  winner = false;
}

function changeCurrentPlayer() {
  currentPlayer = currentPlayer === firstPlayer
    ? secondPlayer
    : firstPlayer;
  opponentPlayer = currentPlayer === firstPlayer
    ? secondPlayer
    : firstPlayer;
}

function finish() {
  currentPlayer = false;
  opponentPlayer = false;
  firstPlayer = false;
  secondPlayer = false;
  started = false;
}

function isReset() {
  return [
    currentPlayer,
    opponentPlayer,
    firstPlayer,
    secondPlayer,
    started,
  ].every((i) => !i);
}

function createShip(pos) {
  currentPlayer.addShip(pos);
}

function attemptToHit(coord) {
  const square = opponentPlayer.board[coord[0]][coord[1]];
  if (square !== '') {
    square.hit();
    if (opponentPlayer.ships.every((ship) => ship.isSunk)) {
      winner = currentPlayer === firstPlayer
        ? 'first player'
        : 'second player';
      finish();
    }
  }
}

export {
  start,
  changeCurrentPlayer,
  finish,
  isReset,
  createShip,
  attemptToHit,
  winner,
};
