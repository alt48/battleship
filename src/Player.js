import Gameboard from './Gameboard';

const playerProto = {
};

export default function Player(boardFunc = Gameboard) {
  const board = boardFunc();

  return Object.assign(Object.create(playerProto), {
    board: board.board,
    ships: board.ships,
    boardObj: board,
  });
}
