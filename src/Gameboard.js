import Ship from './Ship';

const gameboardProto = {
  addShip(pos, builderFunc = Ship) {
    const ship = builderFunc(pos);
    this.ships.push(ship);
    pos.forEach((coord) => {
      this.board[coord[0]][coord[1]] = ship;
    });
    return ship;
  },
};

export default function Gameboard() {
  const board = [];
  for (let i = 0; i < 10; i += 1) {
    board[i] = [];
    for (let y = 0; y < 10; y += 1) board[i][y] = '';
  }

  return Object.assign(Object.create(gameboardProto), {
    board, ships: [],
  });
}
