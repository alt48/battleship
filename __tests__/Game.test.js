import {
  start,
  isReset,
  finish,
  createShip,
  attemptToHit,
} from '../src/Game';

test('player creation', () => {
  const playerMock = jest.fn();

  start(playerMock);
  expect(playerMock.mock.calls.length).toBe(2);
});

test('finish game reset', () => {
  const playerMock = jest.fn()
    .mockReturnValueOnce('first player')
    .mockReturnValueOnce('second player');

  start(playerMock);
  expect(isReset()).toBe(false);
  finish();
  expect(isReset()).toBe(true);
});

test('adds ships', () => {
  const addShipMock = jest.fn();
  const playerMock = jest.fn()
    .mockReturnValue({
      addShip: addShipMock,
    });

  start(playerMock);
  createShip([[0, 1], [0, 2]]);
  expect(addShipMock.mock.calls.length).toBe(1);
});

test('hit opponent ship', () => {
  const hitShipMock = jest.fn();
  const playerMock = jest.fn()
    .mockReturnValue({
      board: [
        [
          { hit: hitShipMock },
        ],
      ],
      ships: [
        { hit: hitShipMock },
      ],
    });

  start(playerMock);
  attemptToHit([0, 0]);
  expect(hitShipMock.mock.calls.length).toBe(1);
});

test('win the battleship', () => {
  const playerMock = jest.fn()
    .mockReturnValue({
      board: [
        [
          { hit: jest.fn(), isSunk: true },
        ],
      ],
      ships: [
        { hit: jest.fn(), isSunk: true },
      ],
    });

  start(playerMock);
  attemptToHit([0, 0]);
  expect(isReset()).toBe(true);
});
