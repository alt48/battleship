import {
  start,
  isReset,
  finish,
  createShip,
  attemptToHit,
  evaluateShip,
} from '../src/Game';
import PubSub from '../src/PubSub';

beforeEach(() => {
  PubSub.events = {};
});

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

test('add ships', () => {
  const addShipMock = jest.fn();
  const playerMock = jest.fn()
    .mockReturnValue({
      ships: [],
      boardObj: {
        addShip: addShipMock,
      },
    });
  const shipEvaluationMock = jest.fn();
  PubSub.subscribe('game#evaluate-ship', shipEvaluationMock);

  start(playerMock);
  createShip([[0, 1], [0, 2]]);

  expect(shipEvaluationMock.mock.calls.length).toBe(1);
  expect(addShipMock.mock.calls.length).toBe(1);
});

test('evaluate ship (max ships)', () => {
  const playerMock = jest.fn().mockReturnValue({
    ships: [{ type: 'Carrier' }],
  });
  const exceptionMock = jest.fn();

  start(playerMock);
  PubSub.subscribe('game#exception', exceptionMock);
  evaluateShip(5);

  expect(exceptionMock.mock.calls).toEqual([['Can\'t add Carrier']]);
});

test('evaluate ship (wrong length)', () => {
  const playerMock = jest.fn().mockReturnValue({
    ships: [{ type: 'Carrier' }],
  });
  const exceptionMock = jest.fn();

  start(playerMock);
  PubSub.subscribe('game#exception', exceptionMock);
  evaluateShip(6);

  expect(exceptionMock.mock.calls).toEqual([['Invalid length']]);
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
