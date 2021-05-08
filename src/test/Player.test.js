import Player from '../Player';

const boardMock = jest.fn().mockReturnValue({
  dist: 'dist property',
  ships: 'ships property',
  addShip: jest.fn().mockReturnValue('add ship called'),
});

test('default properties', () => {
  const player = Player(boardMock);
  expect(player.board).toBe('dist property');
  expect(player.ships).toBe('ships property');
});

test('add ship function', () => {
  const player = Player(boardMock);
  expect(player.addShip()).toBe('add ship called');
});
