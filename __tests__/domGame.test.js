import domGame from '../src/domGame';

let createShipMock;
let startMock;
let changeCurrentPlayerMock;
let attemptToHitMock;
let game;

beforeEach(() => {
  createShipMock = jest.fn();
  startMock = jest.fn();
  changeCurrentPlayerMock = jest.fn();
  attemptToHitMock = jest.fn();

  game = domGame({
    start: startMock,
    createShip: createShipMock,
    changeCurrentPlayer: changeCurrentPlayerMock,
    attemptToHit: attemptToHitMock,
  });
});

test('initial status', () => {
  expect(
    Object.values(game.getAttrs()).every((i) => !i),
  ).toBe(true)
});

test('DOM start', () => {
  const removeMock = jest.fn();
  const appendChildMock = jest.fn();
  const eventMock = {
    target: {
      remove: removeMock,
      parentElement: {
        appendChild: appendChildMock,
      },
    },
  };
  game.domStart(eventMock);

  expect(startMock.mock.calls.length).toBe(1);
  expect(removeMock.mock.calls.length).toBe(1);
  expect(appendChildMock.mock.calls.length).toBe(1);

  expect(game.getAttrs().started).toBe(true);
});

test('DOM change current player', () => {
  const removeMock = jest.fn();
  const appendChildMock = jest.fn();
  const eventMock = {
    target: {
      remove: removeMock,
      parentElement: {
        appendChild: appendChildMock,
      },
    },
  };
  const startEvaluationMock = jest.fn();
  game.domChangePlayer(eventMock, {
    startEvaluation: startEvaluationMock,
  });

  expect(startEvaluationMock.mock.calls.length).toBe(1);

  expect(removeMock.mock.calls.length).toBe(1);
  expect(appendChildMock.mock.calls.length).toBe(1);

  expect(changeCurrentPlayerMock.mock.calls.length).toBe(1);
});

test('DOM start battleship', () => {
  const removeMock = jest.fn();
  const eventMock = {
    target: {
      remove: removeMock,
    },
  };
  const startEvaluationMock = jest.fn();
  game.domStartBattleship(eventMock, {
    startEvaluation: startEvaluationMock,
  });

  expect(startEvaluationMock.mock.calls.length).toBe(1);
  expect(removeMock.mock.calls.length).toBe(1);

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
    },
  };
  const defaultActionMock = jest.fn();
  const pointEvaluationMock = jest.fn();
  const mockedAttrs = {
    pointEvaluation: pointEvaluationMock,
    hitCondition: false,
    defaultAction: defaultActionMock,
  }

  game.pointShip(eventMock, mockedAttrs);
  expect(defaultActionMock.mock.calls.length).toBe(1);
  expect(defaultActionMock.mock.calls[0]).toEqual([[9, 8]]);

  mockedAttrs.hitCondition = true;
  game.pointShip(eventMock, mockedAttrs);
  expect(attemptToHitMock.mock.calls.length).toBe(1);
});

test('begin path (1)', () => {
  game.beginPath([0, 0]);
  expect(game.getAttrs().currentPath).toEqual([0, 0]);

  game.beginPath([3, 0]);
  expect(createShipMock.mock.calls[0]).toEqual([
    [ [0, 0], [1, 0], [2, 0], [3, 0] ],
  ]);
  expect(game.getAttrs().currentPath).toBe(false);
});

test('begin path (2)', () => {
  game.beginPath([0, 9]);
  expect(game.getAttrs().currentPath).toEqual([0, 9]);

  game.beginPath([0, 7]);
  expect(createShipMock.mock.calls[0]).toEqual([
    [ [0, 9], [0, 8], [0, 7] ],
  ]);
  expect(game.getAttrs().currentPath).toBe(false);
});
