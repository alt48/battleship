const shipProto = {
  hit() {
    if (!this.isSunk) {
      this.hits += 1;
      if (this.hits === this.length) this.isSunk = true;
    }
  }
};

export default function Ship(length) {
  return Object.assign(Object.create(shipProto), {
    length, hits: 0, isSunk: false
  });
}
