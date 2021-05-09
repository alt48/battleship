import {
  setup
} from '../src/domGame';

document.body.innerHTML =
  '<div id="root">' +
  '<div id="fp-board">' +
  '<div data-coord="0#0"></div>' +
  '<div data-coord="0#1"></div>' +
  '<div data-coord="0#2"></div>' +
  '<div data-coord="0#3"></div>' +
  '<div data-coord="0#4"></div>' +
  '<div data-coord="0#5"></div>' +
  '<div data-coord="0#6"></div>' +
  '<div data-coord="0#7"></div>' +
  '<div data-coord="0#8"></div>' +
  '<div data-coord="0#9"></div>' +
  '</div>' +
  '<div id="sp-board">' +
  '<div data-coord="0#0"></div>' +
  '<div data-coord="0#1"></div>' +
  '<div data-coord="0#2"></div>' +
  '<div data-coord="0#3"></div>' +
  '<div data-coord="0#4"></div>' +
  '<div data-coord="0#5"></div>' +
  '<div data-coord="0#6"></div>' +
  '<div data-coord="0#7"></div>' +
  '<div data-coord="0#8"></div>' +
  '<div data-coord="0#9"></div>' +
  '</div>' +
  '</div>';

test('set a ship', () => {
  setup();
  document.getElementById('fp-board').click()
});
