import {
  start,
  isReset,
  finish,
} from '../Game';

test('player creation', () => {
  const playerMock = jest.fn();

  start(playerMock);
  expect(playerMock.mock.calls.length).toBe(2);
});

test('finish game reset', () => {
  const playerMock = jest.fn()
    .mockReturnValueOnce('first player')
    .mockReturnValueOnce('second player');

  start(playerMock);
  expect(isReset()).toBe(false);
  finish();
  expect(isReset()).toBe(true);
});
