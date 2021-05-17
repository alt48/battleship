import Gameboard from '../src/Gameboard';

test('10x10 empty board', () => {
  const board = Gameboard().board;

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

test('ship types', () => {
  const board = Gameboard();
  const pairs = [
    { name: 'Carrier', quantity: 1 },
    { name: 'Battleship', quantity: 2 },
    { name: 'Submarine', quantity: 7 },
    { name: 'Destroyer', quantity: 5 },
  ];
  pairs.forEach((type) => {
    const mock = jest.fn().mockReturnValue({ type: type.name });
    for (let i = 0; i < type.quantity; i += 1) {
      board.addShip([[0, 0]], mock);
    }
    expect(() => board.addShip([[0, 0]], mock)).toThrow(`Can't add ${type.name}`);
  });
});
