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
    switch (ship.type) {
      case 'Carrier':
        const carriers = this.getShips('Carrier');
        if (carriers.length === 1) this.maximumShips('Carrier');
        break;
      case 'Battleship':
        const battleships = this.getShips('Battleship');
        if (battleships.length === 2) this.maximumShips('Battleship');
        break;
      case 'Submarine':
        const submarines = this.getShips('Submarine');
        if (submarines.length === 7) this.maximumShips('Submarine');
        break;
      case 'Destroyer':
        const destroyers = this.getShips('Destroyer');
        if (destroyers.length === 5) this.maximumShips('Destroyer');
        break;
      default:
        throw new Error(`Invalid ship type: ${ship.type}`);
    }
  },

  addShip(pos, builderFunc = Ship) {
    const ship = builderFunc(pos.length);

    this.evaluateShip(ship);

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
    board, ships,
  });
}
