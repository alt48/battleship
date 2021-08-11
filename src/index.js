import './scss/index.scss';
import './domGameStatus';

import domGame from './domGame';
import {
  createShip,
  start,
  changeCurrentPlayer,
  attemptToHit,
  gameSetup,
} from './Game';

gameSetup();

const game = domGame({
  createShip,
  start,
  changeCurrentPlayer,
  attemptToHit,
});

game.setup();
game.makeStartButton();
game.makeAutoToggler();
