import Player from '../src/Player';

const boardMock = jest.fn().mockReturnValue({
  board: 'board property',
  ships: 'ships property',
  addShip: jest.fn().mockReturnValue('add ship called'),
});

test('default properties', () => {
  const player = Player(boardMock);
  expect(player.board).toBe('board property');
  expect(player.ships).toBe('ships property');
});

test('add ship function', () => {
  const player = Player(boardMock);
  expect(player.boardObj.addShip()).toBe('add ship called');
});
