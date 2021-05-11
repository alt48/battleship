import Ship from './Ship';

// const values = {
//   Carrier: { length: 5, quantity: 1 },
//   Battleship: { length: 4, quantity: 2 },
//   Cruiser: { length: 3, quantity: 3 },
//   Submarine: { length: 3, quantity: 4 },
//   Destroyer: { length: 2, quantity: 5 },
// };

const gameboardProto = {
  addShip(pos, builderFunc = Ship) {
    const ship = builderFunc(pos.length);
    this.ships.push(ship);
    pos.forEach((coord) => {
      this.board[coord[0]][coord[1]] = ship;
    });
  },
};

export default function Gameboard() {
  const board = [];
  const ships = [];
  for (let i = 0; i < 10; i += 1) {
    board[i] = [];
    for (let y = 0; y < 10; y += 1) board[i][y] = '';
  }

  return Object.assign(Object.create(gameboardProto), {
    dist: board, ships,
  });
}
