import domGame from '../src/domGame';
import PubSub from '../src/PubSub';

let createShipMock;
let startMock;
let changeCurrentPlayerMock;
let attemptToHitMock;
let game;

beforeEach(() => {
  createShipMock = jest.fn().mockReturnValue(0);
  startMock = jest.fn();
  changeCurrentPlayerMock = jest.fn();
  attemptToHitMock = jest.fn();

  game = domGame({
    start: startMock,
    createShip: createShipMock,
    changeCurrentPlayer: changeCurrentPlayerMock,
    attemptToHit: attemptToHitMock,
  });

  PubSub.events = {};
});

test('initial status', () => {
  expect(
    Object.values(game.getAttrs()).every((i) => !i),
  ).toBe(true);
});

test('DOM start', () => {
  const eventMock = {
    target: {
      remove: jest.fn(),
    },
  };
  game.domStart(eventMock);

  expect(startMock.mock.calls.length).toBe(1);
  expect(eventMock.target.remove.mock.calls.length).toBe(1);

  expect(game.getAttrs().started).toBe(true);
});

test('DOM change current player', () => {
  game.domChangePlayer();

  expect(changeCurrentPlayerMock.mock.calls.length).toBe(1);
});

test('DOM start battleship', () => {
  game.domStartBattleship();

  expect(game.getAttrs().hitMode).toBe(true);
  expect(changeCurrentPlayerMock.mock.calls.length).toBe(1);
});

test('point ship', () => {
  const eventMock = {
    target: {
      dataset: {
        coord: '9#8',
      },
      parentElement: {
        id: 'parent-id',
      },
      classList: {
        add: jest.fn(),
      },
    },
  };

  const dealWithPointMock = jest.fn();
  PubSub.subscribe('domGame#deal-with-point', dealWithPointMock);

  game.pointShip(eventMock, false);
  expect(dealWithPointMock.mock.calls.length).toBe(1);
  expect(dealWithPointMock.mock.calls[0]).toEqual([[9, 8]]);

  game.pointShip(eventMock, true);
  expect(eventMock.target.classList.add.mock.calls.length).toBe(1);
  expect(attemptToHitMock.mock.calls.length).toBe(1);
});

test('begin path (1)', () => {
  game.beginPath([0, 0]);
  expect(game.getAttrs().currentPath).toEqual([0, 0]);

  game.beginPath([3, 0]);
  expect(createShipMock.mock.calls[0]).toEqual([
    [[0, 0], [1, 0], [2, 0], [3, 0]],
  ]);
  expect(game.getAttrs().currentPath).toBe(false);
});

test('begin path (2)', () => {
  game.beginPath([0, 9]);
  expect(game.getAttrs().currentPath).toEqual([0, 9]);

  game.beginPath([0, 7]);
  expect(createShipMock.mock.calls[0]).toEqual([
    [[0, 9], [0, 8], [0, 7]],
  ]);
  expect(game.getAttrs().currentPath).toBe(false);
});

test('begin path - reset path', () => {
  game.beginPath([0, 0]);
  expect(game.getAttrs().currentPath).toEqual([0, 0]);

  PubSub.subscribe('domGame#path-post-evaluation', () => 1);

  game.beginPath([0, 0]);
  expect(createShipMock.mock.calls.length).toBe(0);
  expect(game.getAttrs().currentPath).toBe(false);
});

test('path post evaluation', () => {
  const player = {
    board: [
      ['', {}],
    ],
  };

  const domGameExceptionMock = jest.fn();
  PubSub.subscribe('game#exception', domGameExceptionMock);

  game.pathPostEvaluation([[0, 1]], player);
  expect(domGameExceptionMock.mock.calls).toEqual([['Occupied!']]);
});
