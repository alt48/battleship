import { getShipOrientation } from '../src/domStyleCells';

test('get ship orientation (horizontal)', () => {
  expect(
    getShipOrientation([[0, 1], [0, 2], [0, 3]]),
  ).toBe('horizontal');
  expect(
    getShipOrientation([[0, 3], [0, 2], [0, 1]]),
  ).toBe('horizontal-reverse');
});

test('get ship orientation (vertical)', () => {
  expect(
    getShipOrientation([[1, 0], [2, 0], [3, 0]]),
  ).toBe('vertical');
  expect(
    getShipOrientation([[3, 0], [2, 0], [1, 0]]),
  ).toBe('vertical-reverse');
});

test('get ship orientation (error)', () => {
  expect(
    () => getShipOrientation([[0, 1], [0, 2], [0, 4]]),
  ).toThrow('Invalid positions');
  expect(
    () => getShipOrientation([[1, 2], [3, 4], [5, 6]]),
  ).toThrow('Invalid positions');
});
