import domGame from '../src/domGame';

let createShipMock;
let game;

function setupDOM() {
  createShipMock = jest.fn();
  game = domGame({
    createShip: createShipMock,
  });
};

document.body.innerHTML =
  '<div id="root">' +
  '<div id="fp-board">' +
  '<div class="coord" data-coord="0#0"></div>' +
  '<div class="coord" data-coord="0#1"></div>' +
  '<div class="coord" data-coord="0#2"></div>' +
  '<div class="coord" data-coord="0#3"></div>' +
  '<div class="coord" data-coord="0#4"></div>' +
  '<div class="coord" data-coord="0#5"></div>' +
  '<div class="coord" data-coord="0#6"></div>' +
  '<div class="coord" data-coord="0#7"></div>' +
  '<div class="coord" data-coord="0#8"></div>' +
  '<div class="coord" data-coord="0#9"></div>' +
  '</div>' +
  '<div id="sp-board">' +
  '<div class="coord" data-coord="0#0"></div>' +
  '<div class="coord" data-coord="0#1"></div>' +
  '<div class="coord" data-coord="0#2"></div>' +
  '<div class="coord" data-coord="0#3"></div>' +
  '<div class="coord" data-coord="0#4"></div>' +
  '<div class="coord" data-coord="0#5"></div>' +
  '<div class="coord" data-coord="0#6"></div>' +
  '<div class="coord" data-coord="0#7"></div>' +
  '<div class="coord" data-coord="0#8"></div>' +
  '<div class="coord" data-coord="0#9"></div>' +
  '</div>' +
  '<div id="status">' +
  '<button id="start-game">Start Game</button>' +
  '</div>' +
  '</div>';

test('initial status', () => {
  setupDOM();
  expect(game.getCurrentPath()).toBe(false);
});

test('set a ship', () => {
  setupDOM();

  game.beginPath([0, 0]);
  expect(game.getCurrentPath()).toEqual([0, 0]);

  game.beginPath([3, 0]);
  expect(createShipMock.mock.calls[0]).toEqual([
    [ [0, 0], [1, 0], [2, 0], [3, 0] ]
  ]);
  expect(game.getCurrentPath()).toBe(false);
});
