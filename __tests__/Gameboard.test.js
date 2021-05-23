import Gameboard from '../src/Gameboard';

test('10x10 empty board', () => {
  const { board } = Gameboard();

  expect(board.length).toBe(10);
  board.forEach((row) => {
    expect(row.length).toBe(10);
    row.forEach((cell) => expect(cell).toBe(''));
  });
});

test('add ship (horizontal)', () => {
  const board = Gameboard();
  const shipMock = jest.fn().mockReturnValueOnce({ type: 'Battleship' });

  board.addShip([[0, 1], [0, 2]], shipMock);
  expect(board.ships).toEqual([{ type: 'Battleship' }]);

  board.board[0].splice(1, 2);
  board.board.forEach((row) => {
    expect(row).toEqual(
      expect.not.arrayContaining([{ type: 'Battleship' }]),
    );
  });
});

test('add ship (vertical)', () => {
  const board = Gameboard();
  const shipMock = jest.fn().mockReturnValueOnce({ type: 'Battleship' });

  board.addShip([[1, 1], [2, 1], [3, 1]], shipMock);
  expect(board.ships).toEqual([{ type: 'Battleship' }]);

  for (let i = 1; i <= 3; i += 1) board.board[i].splice(1, 1);
  board.board.forEach((row) => {
    expect(row).toEqual(
      expect.not.arrayContaining([{ type: 'Battleship' }]),
    );
  });
});
