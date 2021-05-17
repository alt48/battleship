import Ship from '../src/Ship';

test('default values', () => {
  const ship = Ship(3);

  expect(ship.length).toBe(3);
  expect(ship.hits).toBe(0);
  expect(ship.isSunk).toBe(false);
});

test('hit ship', () => {
  const ship = Ship(3);

  ship.hit();
  expect(ship.hits).toBe(1);
});

test('sunk ship', () => {
  const ship = Ship(3);
  for (let i = 0; i < 3; i += 1) ship.hit();

  expect(ship.hits).toBe(3);
  expect(ship.isSunk).toBe(true);

  ship.hit();
  expect(ship.hits).toBe(3);
});

test('ship types', () => {
  expect(Ship(5).type).toBe('Carrier');
  expect(Ship(4).type).toBe('Battleship');
  expect(Ship(3).type).toBe('Submarine');
  expect(Ship(2).type).toBe('Destroyer');
});

test('invalid ship length', () => {
  expect(() => Ship(1)).toThrow('Invalid length');
  expect(() => Ship(6)).toThrow('Invalid length');
});
