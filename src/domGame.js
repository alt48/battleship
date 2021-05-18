import traversePath from './traversePath';
import { hideBoard, hideScreen } from './domHideBoard';
import styleCoords from './domStyleCells';
import { renderShipNum, updateShipNum } from './propsTable';
import PubSub from './PubSub';

function domGame(dependencies) {
  const {
    createShip,
    start,
    changeCurrentPlayer,
    attemptToHit,
  } = dependencies;

  const maxShips = 2;
  let started = false;
  let currentPath = false;
  let hitMode = false;
  let currentPlayer = false;
  let firstPlayer = false;
  let secondPlayer = false;

  const getCurrentBoardId = () => (
    currentPlayer === firstPlayer
      ? 'fp-board'
      : 'sp-board'
  );

  const toggleCurrentPath = () => {
    const cell = document.querySelector(
      `#${getCurrentBoardId()} [data-coord="${currentPath.join('#')}"]`,
    );
    cell.classList.toggle('current-ship');
  };

  const commonEvaluation = () => {
    if (currentPath) {
      toggleCurrentPath();
      currentPath = false;
    }
  };

  const domStartBattleship = () => {
    PubSub.publish('domGame#common-evaluation');
    hitMode = true;
    changeCurrentPlayer();
    PubSub.publish('domGame#dom-start-battleship');
  };

  const domChangePlayer = () => {
    PubSub.publish('domGame#common-evaluation');
    changeCurrentPlayer();
    PubSub.publish('domGame#dom-change-player');
  };

  const domStart = (e) => {
    e.target.remove();
    started = true;
    start();
    PubSub.publish('domGame#dom-start');
  };

  const evaluatePath = (target) => {
    if (!started) throw new Error('Please start the game');
    let rightBoard = target.parentElement.id === getCurrentBoardId();
    if (hitMode) rightBoard = !rightBoard;
    if (!rightBoard || target.className.includes('hit-button')) {
      throw new Error('You can\'t do that');
    }
  };

  const pathEvaluation = (path, attrs = {
    currentPlayer,
  }) => {
    path.forEach((coord) => {
      if (attrs.currentPlayer.board[coord[0]][coord[1]] !== '') {
        throw new Error('Ocuppied!');
      }
    });
  };

  const beginPath = (coord, attrs = {
    styleFunction: styleCoords,
    focusToggler: toggleCurrentPath,
    pathEvaluation,
  }) => {
    attrs.pathEvaluation([coord]);

    if (currentPath) {
      if (!currentPath.every((i, idx) => i === coord[idx])) {
        const path = traversePath(currentPath, coord);
        attrs.pathEvaluation(path);

        const ship = createShip(path);
        PubSub.publish('game#create-ship', ship);
        attrs.styleFunction(path, getCurrentBoardId());
      }
      attrs.focusToggler();
      currentPath = false;
    } else {
      currentPath = coord;
      attrs.focusToggler();
    }
  };

  const dealWithPoint = (coord) => {
    beginPath(coord);
    if (currentPlayer.ships.length === maxShips) {
      if (currentPlayer === firstPlayer) {
        domChangePlayer();
      } else {
        document.getElementById('ship-num').remove();
        domStartBattleship();
      }
    }
  };

  const pointShip = (e, attrs = {
    pointEvaluation: evaluatePath,
    hitCondition: hitMode,
    defaultAction: dealWithPoint,
  }) => {
    const coord = e.target.dataset.coord.split('#').map((i) => +i);
    attrs.pointEvaluation(e.target);
    if (attrs.hitCondition) {
      e.target.classList.add('hit-button');
      attemptToHit(coord);
    } else {
      attrs.defaultAction(coord);
    }
  };

  const domFinish = (winner) => {
    hitMode = false;
    started = false;
    currentPlayer = false;
    firstPlayer = false;
    secondPlayer = false;
    console.log(winner);
  };

  const toggleBoards = () => {
    hideBoard(hitMode, [currentPlayer === secondPlayer]);
  };

  const changePlayer = (player) => {
    currentPlayer = player;
  };

  const setFirstPlayer = (player) => {
    firstPlayer = player;
  };

  const setSecondPlayer = (player) => {
    secondPlayer = player;
  };

  const getAttrs = () => (
    {
      started,
      currentPath,
      hitMode,
      currentPlayer,
      firstPlayer,
      secondPlayer,
    }
  );

  const setup = () => {
    PubSub.subscribe('game#first-player', setFirstPlayer);
    PubSub.subscribe('game#second-player', setSecondPlayer);
    PubSub.subscribe('game#change-player', changePlayer);
    PubSub.subscribe('game#change-player', toggleBoards);
    PubSub.subscribe('game#finish-game', domFinish);
    PubSub.subscribe('game#create-ship', updateShipNum);

    PubSub.subscribe('domGame#dom-start', renderShipNum);
    PubSub.subscribe('domGame#dom-change-player', () => {
      if (!hitMode) {
        renderShipNum();
      }
    });
    PubSub.subscribe('domGame#dom-start-battleship', hideScreen);
    PubSub.subscribe('domGame#common-evaluation', commonEvaluation);
  };

  return {
    domStart,
    domChangePlayer,
    domStartBattleship,
    pointShip,
    beginPath,
    pathEvaluation,
    getAttrs,
    setup,
  };
}

export default domGame;
