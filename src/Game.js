import Player from './Player';
import PubSub from './PubSub';

let currentPlayer = false;
let opponentPlayer = false;
let firstPlayer = false;
let secondPlayer = false;
let gameException = false;

function start(playerFunc = Player) {
  gameException = false;
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

function evaluateShip(length) {
  let type;
  switch (length) {
    case 5:
      type = { name: 'Carrier', quantity: 1 }; break;
    case 4:
      type = { name: 'Battleship', quantity: 2 }; break;
    case 3:
      type = { name: 'Submarine', quantity: 7 }; break;
    case 2:
      type = { name: 'Destroyer', quantity: 5 }; break;
    default:
      PubSub.publish('game#exception', 'Invalid length');
      gameException = true;
      break;
  }
  if (!gameException) {
    const ships = currentPlayer.ships.filter((i) => i.type === type.name);
    if (ships.length === type.quantity) {
      PubSub.publish('game#exception', `Can't add ${type.name}`);
      gameException = true;
    }
  }
}

function dealWithEvaluation(callback) {
  let exit;
  if (gameException) {
    gameException = false;
    exit = 1;
  } else {
    callback();
    exit = 0;
  }
  return exit;
}

function createShip(pos) {
  PubSub.publish('game#evaluate-ship', pos.length);
  return dealWithEvaluation(() => {
    const ship = currentPlayer.boardObj.addShip(pos);
    PubSub.publish('game#create-ship', ship);
  });
}

function attemptToHit(coord) {
  const square = opponentPlayer.board[coord[0]][coord[1]];
  let squareStatus = 'Square hit!';
  let winner;
  if (square !== '') {
    square.hit();
    squareStatus = 'Ship hit!';
    if (opponentPlayer.ships.every((ship) => ship.isSunk)) {
      winner = currentPlayer === firstPlayer
        ? 'first player'
        : 'second player';
      squareStatus = `The ${winner} is the winner!`;
    } else if (square.isSunk) {
      squareStatus = `${square.type} sunk!`;
    }
  }
  PubSub.publish('domGame#set-hide-message', squareStatus);
  if (winner) {
    finish(winner);
  } else {
    changeCurrentPlayer();
  }
}

function gameSetup() {
  PubSub.subscribe('game#evaluate-ship', evaluateShip);
}

export {
  start,
  changeCurrentPlayer,
  finish,
  isReset,
  createShip,
  attemptToHit,
  evaluateShip,
  gameSetup,
};
