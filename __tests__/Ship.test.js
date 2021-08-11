import Ship from '../src/Ship';

test('default values', () => {
  const ship = Ship([[0, 0], [0, 1], [0, 2]]);

  expect(ship.length).toBe(3);
  expect(ship.hits).toBe(0);
  expect(ship.isSunk).toBe(false);
  expect(ship.path).toEqual([[0, 0], [0, 1], [0, 2]]);
});

test('hit ship', () => {
  const ship = Ship([[0, 0], [0, 1], [0, 2]]);

  ship.hit();
  expect(ship.hits).toBe(1);
});

test('sunk ship', () => {
  const ship = Ship([[0, 0], [0, 1], [0, 2]]);
  for (let i = 0; i < 3; i += 1) ship.hit();

  expect(ship.hits).toBe(3);
  expect(ship.isSunk).toBe(true);

  ship.hit();
  expect(ship.hits).toBe(3);
});

test('ship types', () => {
  expect(Ship([[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]).type).toBe('Carrier');
  expect(Ship([[0, 0], [0, 1], [0, 2], [0, 3]]).type).toBe('Battleship');
  expect(Ship([[0, 0], [0, 1], [0, 2]]).type).toBe('Submarine');
  expect(Ship([[0, 0], [0, 1]]).type).toBe('Destroyer');
});

test('invalid ship length', () => {
  expect(() => Ship(1)).toThrow('Invalid length');
  expect(() => Ship(6)).toThrow('Invalid length');
});
