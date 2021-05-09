import Player from './Player';

let currentPlayer = false;
let firstPlayer = false;
let secondPlayer = false;

function start(playerFunc=Player) {
  firstPlayer = playerFunc();
  secondPlayer = playerFunc();
  currentPlayer = firstPlayer;
}

function changeCurrentPlayer() {
  currentPlayer = currentPlayer === firstPlayer
    ? secondPlayer
    : firstPlayer;
}

function finish() {
  currentPlayer = false;
  firstPlayer = false;
  secondPlayer = false;
}

function isReset() {
  return [
    currentPlayer,
    firstPlayer,
    secondPlayer,
  ].every((i) => !i);
}

export {
  start,
  changeCurrentPlayer,
  finish,
  isReset,
};
