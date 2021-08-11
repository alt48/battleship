import { fillBoard, makeMove } from '../src/domAutoMode';

function successfulShip(board, type, pos) {
  const pieces = {
    Destroyer: [[1], [-1]],
    Submarine: [[1, 2], [-1, 1], [-2, -1]],
    Battleship: [[1, 2, 3], [-1, 1, 2], [-2, -1, 1], [-3, -2, -1]],
    Carrier: [[1, 2, 3, 4], [-1, 1, 2, 3], [-2, -1, 1, 2], [-3, -2, -1, 1], [-4, -3, -2, -1]],
  };
  const combination = pieces[type];
  let isTruthy = false;
  for (let i = 0; i < combination.length; i += 1) {
    let horEval = true;
    let verEval = true;
    combination[i].forEach((num) => {
      horEval = horEval && board[pos[0]][pos[1] + num] === type;
      verEval = verEval && board[pos[0] + num] && board[pos[0] + num][pos[1]] === type;
    });
    if (horEval || verEval) {
      isTruthy = true;
      break;
    }
  }
  return isTruthy;
}

let board;
beforeEach(() => {
  board = [];
  for (let i = 0; i < 10; i += 1) {
    board.push([]);
    for (let y = 0; y < 10; y += 1) {
      board[i].push('');
    }
  }
});

test('fill board', () => {
  const maxShips = 15;

  const result = fillBoard(board, maxShips);
  for (let i = 0; i < 10; i += 1) {
    for (let y = 0; y < 10; y += 1) {
      const cell = result[1][i][y];
      if (cell !== '') {
        expect(successfulShip(result[1], cell, [i, y])).toBe(true);
      }
    }
  }
});

test('make move', () => {
  const move = makeMove(board);
  expect(board[move[0]]).toEqual(expect.arrayContaining(['']));
  expect(board[move[0]][move[1]]).toBe('');
});
