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
  const commonEvaluationMock = jest.fn();
  game.domChangePlayer(eventMock, {
    commonEvaluation: commonEvaluationMock,
  });

  expect(commonEvaluationMock.mock.calls.length).toBe(1);

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
  const commonEvaluationMock = jest.fn();
  const hideScreenMock = jest.fn();
  game.domStartBattleship(eventMock, {
    commonEvaluation: commonEvaluationMock,
    hideScreen: hideScreenMock,
  });

  expect(commonEvaluationMock.mock.calls.length).toBe(1);
  expect(hideScreenMock.mock.calls.length).toBe(1);

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
      classList: {
        add: jest.fn(),
      },
    },
  };

  const mockedAttrs = {
    pointEvaluation: jest.fn(),
    hitCondition: false,
    defaultAction: jest.fn(),
  }

  game.pointShip(eventMock, mockedAttrs);
  expect(mockedAttrs.defaultAction.mock.calls.length).toBe(1);
  expect(mockedAttrs.defaultAction.mock.calls[0]).toEqual([[9, 8]]);

  mockedAttrs.hitCondition = true;
  game.pointShip(eventMock, mockedAttrs);
  expect(eventMock.target.classList.add.mock.calls.length).toBe(1);
  expect(attemptToHitMock.mock.calls.length).toBe(1);
});

test('begin path (1)', () => {
  game.beginPath([0, 0], {
    focusToggler: jest.fn(),
    pathEvaluation: jest.fn(),
  });
  expect(game.getAttrs().currentPath).toEqual([0, 0]);

  game.beginPath([3, 0], {
    styleFunction: jest.fn(),
    focusToggler: jest.fn(),
    pathEvaluation: jest.fn(),
  });
  expect(createShipMock.mock.calls[0]).toEqual([
    [ [0, 0], [1, 0], [2, 0], [3, 0] ],
  ]);
  expect(game.getAttrs().currentPath).toBe(false);
});

test('begin path (2)', () => {
  game.beginPath([0, 9], {
    focusToggler: jest.fn(),
    pathEvaluation: jest.fn(),
  });
  expect(game.getAttrs().currentPath).toEqual([0, 9]);

  game.beginPath([0, 7], {
    styleFunction: jest.fn(),
    focusToggler: jest.fn(),
    pathEvaluation: jest.fn(),
  });
  expect(createShipMock.mock.calls[0]).toEqual([
    [ [0, 9], [0, 8], [0, 7] ],
  ]);
  expect(game.getAttrs().currentPath).toBe(false);
});

test('begin path - reset path', () => {
  game.beginPath([0, 0], {
    focusToggler: jest.fn(),
    pathEvaluation: jest.fn(),
  });
  expect(game.getAttrs().currentPath).toEqual([0, 0]);

  game.beginPath([0, 0], {
    focusToggler: jest.fn(),
    pathEvaluation: jest.fn(),
  });
  expect(createShipMock.mock.calls.length).toBe(0);
  expect(game.getAttrs().currentPath).toBe(false);
});

test('path evaluation', () => {
  const player = {
    board: [
      ['', {}],
    ],
  };

  expect(
    () => game.pathEvaluation([[0, 1]], {
      currentPlayer: player,
    }),
  ).toThrow('Ocuppied!');
});

// test('get ship orientation (horizontal)', () => {
//   expect(
//     game.getShipOrientation([[0, 1], [0, 2], [0, 3]])
//   ).toBe('horizontal');
//   expect(
//     game.getShipOrientation([[0, 3], [0, 2], [0, 1]])
//   ).toBe('horizontal-reverse');
// });
//
// test('get ship orientation (vertical)', () => {
//   expect(
//     game.getShipOrientation([[1, 0], [2, 0], [3, 0]])
//   ).toBe('vertical');
//   expect(
//     game.getShipOrientation([[3, 0], [2, 0], [1, 0]])
//   ).toBe('vertical-reverse');
// });
//
// test('get ship orientation (error)', () => {
//   expect(
//     () => game.getShipOrientation([[1, 2], [3, 4], [5, 6]])
//   ).toThrow('Invalid positions');
// });
