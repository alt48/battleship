import Gameboard from '../Gameboard';

test('10x10 empty board', () => {
  const board = Gameboard().dist;
  expect(board.length).toBe(10);
  board.forEach((row) => {
    expect(row.length).toBe(10);
    row.forEach((cell) => expect(cell).toBe(''));
  });
});

test('add ship to board (horizontal)', () => {
  const firstBoard = Gameboard();
  const shipMock = jest.fn().mockReturnValueOnce('X');

  firstBoard.addShip([[0, 1], [0, 2]], shipMock);
  expect(firstBoard.ships).toEqual(['X']);

  firstBoard.dist[0].splice(1, 2);
  firstBoard.dist.forEach((row) => {
    expect(row).toEqual(
      expect.not.arrayContaining(['X']),
    );
  });
});

test('add ship to board (vertical)', () => {
  const firstBoard = Gameboard();
  const shipMock = jest.fn().mockReturnValueOnce('O');

  firstBoard.addShip([[1, 1], [2, 1], [3, 1]], shipMock);
  expect(firstBoard.ships).toEqual(['O']);

  for (let i = 1; i <= 3; i += 1) firstBoard.dist[i].splice(1, 1);
  firstBoard.dist.forEach((row) => {
    expect(row).toEqual(
      expect.not.arrayContaining(['O']),
    );
  });
});
