import Player from './Player';
import PubSub from './PubSub';

let currentPlayer = false;
let opponentPlayer = false;
let firstPlayer = false;
let secondPlayer = false;

function start(playerFunc = Player) {
  firstPlayer = playerFunc();
  PubSub.publish('game#first-player', firstPlayer);
  secondPlayer = playerFunc();
  PubSub.publish('game#second-player', secondPlayer);
  currentPlayer = firstPlayer;
  PubSub.publish('game#change-player', firstPlayer);
  opponentPlayer = secondPlayer;
}

function changeCurrentPlayer() {
  currentPlayer = currentPlayer === firstPlayer
    ? secondPlayer
    : firstPlayer;
  opponentPlayer = currentPlayer === firstPlayer
    ? secondPlayer
    : firstPlayer;
  PubSub.publish('game#change-player', currentPlayer);
}

function finish(winner) {
  currentPlayer = false;
  opponentPlayer = false;
  firstPlayer = false;
  secondPlayer = false;
  PubSub.publish('game#finish-game', winner);
}

function isReset() {
  return [
    currentPlayer,
    opponentPlayer,
    firstPlayer,
    secondPlayer,
  ].every((i) => !i);
}

function createShip(pos) {
  const ship = currentPlayer.boardObj.addShip(pos);
  PubSub.publish('game#create-ship', ship);
}

function attemptToHit(coord) {
  const square = opponentPlayer.board[coord[0]][coord[1]];
  let winner;
  if (square !== '') {
    square.hit();
    if (opponentPlayer.ships.every((ship) => ship.isSunk)) {
      winner = currentPlayer === firstPlayer
        ? 'first player'
        : 'second player';
    }
  }
  if (winner) {
    finish(winner);
  } else {
    changeCurrentPlayer();
  }
}

export {
  start,
  changeCurrentPlayer,
  finish,
  isReset,
  createShip,
  attemptToHit,
};
