const shipProto = {
  hit() {
    if (!this.isSunk) {
      this.hits += 1;
      if (this.hits === this.length) this.isSunk = true;
    }
  },
};

export default function Ship(length) {
  let type;
  switch (length) {
    case 5:
      type = 'Carrier'; break;
    case 4:
      type = 'Battleship'; break;
    case 3:
      type = 'Submarine'; break;
    case 2:
      type = 'Destroyer'; break;
    default:
      throw new Error('Invalid length');
  }

  return Object.assign(Object.create(shipProto), {
    length, hits: 0, isSunk: false, type,
  });
}
