import domGame from '../src/domGame';

let createShipMock;
let startMock;
let changeCurrentPlayerMock;
let attemptToHitMock;
let game;

beforeEach(() => {
  createShipMock = jest.fn().mockReturnValue({ type: 'Battleship' });;
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
  const shipNumberEvaluationMock = jest.fn();
  game.domChangePlayer(eventMock, {
    startEvaluation: startEvaluationMock,
    shipNumberEvaluation: shipNumberEvaluationMock,
  });

  expect(startEvaluationMock.mock.calls.length).toBe(1);
  expect(shipNumberEvaluationMock.mock.calls.length).toBe(1);

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
  const shipNumberEvaluationMock = jest.fn();
  game.domStartBattleship(eventMock, {
    startEvaluation: startEvaluationMock,
    shipNumberEvaluation: shipNumberEvaluationMock,
  });

  expect(startEvaluationMock.mock.calls.length).toBe(1);
  expect(shipNumberEvaluationMock.mock.calls.length).toBe(1);

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
  game.beginPath([0, 0], {
    focusToggler: jest.fn(),
  });
  expect(game.getAttrs().currentPath).toEqual([0, 0]);

  game.beginPath([3, 0], {
    styleFunction: jest.fn(),
    focusToggler: jest.fn(),
  });
  expect(createShipMock.mock.calls[0]).toEqual([
    [ [0, 0], [1, 0], [2, 0], [3, 0] ],
  ]);
  expect(game.getAttrs().currentPath).toBe(false);
});

test('begin path (2)', () => {
  game.beginPath([0, 9], {
    focusToggler: jest.fn(),
  });
  expect(game.getAttrs().currentPath).toEqual([0, 9]);

  game.beginPath([0, 7], {
    styleFunction: jest.fn(),
    focusToggler: jest.fn(),
  });
  expect(createShipMock.mock.calls[0]).toEqual([
    [ [0, 9], [0, 8], [0, 7] ],
  ]);
  expect(game.getAttrs().currentPath).toBe(false);
});

test('begin path - reset path', () => {
  game.beginPath([0, 0], {
    focusToggler: jest.fn(),
  });
  expect(game.getAttrs().currentPath).toEqual([0, 0]);

  game.beginPath([0, 0], {
    focusToggler: jest.fn(),
  });
  expect(createShipMock.mock.calls.length).toBe(0);
  expect(game.getAttrs().currentPath).toBe(false);
});

test('get ship orientation (horizontal)', () => {
  expect(
    game.getShipOrientation([[0, 1], [0, 2], [0, 3]])
  ).toBe('horizontal');
  expect(
    game.getShipOrientation([[0, 3], [0, 2], [0, 1]])
  ).toBe('horizontal-reverse');
});

test('get ship orientation (vertical)', () => {
  expect(
    game.getShipOrientation([[1, 0], [2, 0], [3, 0]])
  ).toBe('vertical');
  expect(
    game.getShipOrientation([[3, 0], [2, 0], [1, 0]])
  ).toBe('vertical-reverse');
});

test('get ship orientation (error)', () => {
  expect(
    () => game.getShipOrientation([[1, 2], [3, 4], [5, 6]])
  ).toThrow('Invalid positions');
});
