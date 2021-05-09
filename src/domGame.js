import {
  start,
  changeCurrentPlayer,
  finish,
  isReset,
  createShip,
  attemptToHit,
} from './Game';
import traversePath from './traversePath';

let currentPath = false;

function beginPath(e) {
  const coord = e.target.dataset.coord.split('#');
  if (currentPath) {
    const path = traversePath(currentPath, coord);
    createShip(path);
    currentPath = false;
  } else {
    currentPath = coord;
  }
}

function setup() {
  document.getElementById('fp-board').addEventListener('click', () => console.log('hekll'));
  // document.getElementById('start-game').addEventListener('click', start);
  // document.getElementById('change-player').addEventListener('click', changeCurrentPlayer);
}

export { setup };
