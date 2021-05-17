import Ship from './Ship';

// const values = {
//   Carrier: { length: 5, quantity: 1 },
//   Battleship: { length: 4, quantity: 2 },
//   Cruiser: { length: 3, quantity: 3 },
//   Submarine: { length: 3, quantity: 4 },
//   Destroyer: { length: 2, quantity: 5 },
// };

const gameboardProto = {
  getShips(type) {
    return this.ships.filter((i) => i.type === type);
  },

  maximumShips(type) {
    throw new Error(`Can't add ${type}`);
  },

  evaluateShip(ship) {
    let type;
    switch (ship.type) {
      case 'Carrier':
        type = { name: 'Carrier', quantity: 1 }; break;
      case 'Battleship':
        type = { name: 'Battleship', quantity: 2 }; break;
      case 'Submarine':
        type = { name: 'Submarine', quantity: 7 }; break;
      case 'Destroyer':
        type = { name: 'Destroyer', quantity: 5 }; break;
      default:
        throw new Error(`Invalid ship type: ${ship.type}`);
    }
    const ships = this.getShips(type.name);
    if (ships.length === type.quantity) this.maximumShips(type.name);
  },

  addShip(pos, builderFunc = Ship) {
    const ship = builderFunc(pos.length);

    this.evaluateShip(ship);

    this.ships.push(ship);
    pos.forEach((coord) => {
      this.board[coord[0]][coord[1]] = ship;
    });

    return ship;
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
    board, ships,
  });
}
