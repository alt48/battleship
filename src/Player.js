import Gameboard from './Gameboard';

const playerProto = {
};

export default function Player(boardFunc = Gameboard) {
  const board = boardFunc();

  return Object.assign(Object.create(playerProto), {
    addShip: board.addShip, board: board.board, ships: board.ships,
  });
}
