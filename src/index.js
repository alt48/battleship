import './scss/index.scss';

import domGame from './domGame';
import {
  createShip,
  start,
  changeCurrentPlayer,
  attemptToHit,
} from './Game';

const game = domGame({
  createShip,
  start,
  changeCurrentPlayer,
  attemptToHit,
});

game.setup();

function makeBoard(element) {
  for (let i = 0; i < 10; i += 1) {
    for (let y = 0; y < 10; y += 1) {
      const button = document.createElement('button');
      button.dataset.coord = `${i}#${y}`;
      button.classList.add('sea-button');
      element.appendChild(button);
    }
  }
}

makeBoard(document.getElementById('fp-board'));
makeBoard(document.getElementById('sp-board'));

document.querySelector('#status button').addEventListener('click', game.domStart);
Array.from(document.querySelectorAll('#boards button')).forEach((button) => {
  button.addEventListener('click', game.pointShip);
});
