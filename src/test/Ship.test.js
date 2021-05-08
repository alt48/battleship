import Ship from '../Ship';

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
