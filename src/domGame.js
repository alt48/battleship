import traversePath from './traversePath';
import { hideBoard, hideScreen } from './domHideBoard';
import styleCoords from './domStyleCells';
import { renderShipNum, updateShipNum } from './domShipNumber';
import PubSub from './PubSub';

function domGame(dependencies) {
  const {
    createShip,
    start,
    changeCurrentPlayer,
    attemptToHit,
  } = dependencies;

  const maxShips = 1;
  let started = false;
  let currentPath = false;
  let hitMode = false;
  let currentPlayer = false;
  let firstPlayer = false;
  let secondPlayer = false;
  let gameException = false;
  let hideMessage = false;

  const domStart = (e) => {
    e.target.remove();
    started = true;

    PubSub.publish('domGame#make-board', document.getElementById('fp-board'));
    PubSub.publish('domGame#make-board', document.getElementById('sp-board'));

    start();
    PubSub.publish('domGame#dom-start');
  };

  const pointShip = (e, hitCond = hitMode) => {
    const coord = e.target.dataset.coord.split('#').map((i) => +i);
    PubSub.publish('domGame#evaluate-path', e.target);
    if (gameException) {
      gameException = false;
    } else if (hitCond) {
      e.target.classList.add('hit-button');
      e.target.classList.remove('gray-sea-button');
      attemptToHit(coord);
    } else {
      PubSub.publish('domGame#deal-with-point', coord);
    }
  };

  const domChangePlayer = () => {
    PubSub.publish('domGame#common-evaluation');
    changeCurrentPlayer();
    PubSub.publish('domGame#dom-change-player');
  };

  const domStartBattleship = () => {
    PubSub.publish('domGame#common-evaluation');
    hitMode = true;
    hideMessage = 'Battleship!';
    changeCurrentPlayer();
  };

  const makeStartButton = () => {
    const button = document.createElement('button');
    button.textContent = 'Start';
    button.addEventListener('click', domStart);
    document.getElementById('game-props').appendChild(button);
  };

  const domFinish = () => {
    hitMode = false;
    started = false;
    currentPlayer = false;
    firstPlayer = false;
    secondPlayer = false;
    hideScreen(hideMessage);
    makeStartButton();
  };

  function makeBoard(element) {
    element.innerHTML = '';
    for (let i = 0; i < 10; i += 1) {
      for (let y = 0; y < 10; y += 1) {
        const button = document.createElement('button');
        button.dataset.coord = `${i}#${y}`;
        button.classList.add('sea-button');
        button.addEventListener('click', pointShip);
        element.appendChild(button);
      }
    }
  }

  const getCurrentBoardId = () => (
    currentPlayer === firstPlayer
      ? 'fp-board'
      : 'sp-board'
  );

  const evaluatePath = (target) => {
    try {
      if (!started) throw new Error('Please start the game');
      let rightBoard = target.parentElement.id === getCurrentBoardId();
      if (hitMode) rightBoard = !rightBoard;
      if (!rightBoard || target.className.includes('hit-button')) {
        throw new Error('You can\'t do that');
      }
    } catch ({ message }) {
      gameException = true;
      PubSub.publish('game#exception', message);
    }
  };

  const beginPath = (coord) => {
    PubSub.publish('domGame#path-post-evaluation', [coord]);

    if (gameException) {
      gameException = false;
    } else if (currentPath) {
      let path;
      if (!currentPath.every((i, idx) => i === coord[idx])) {
        path = traversePath(currentPath, coord);
        PubSub.publish('domGame#path-post-evaluation', path);
      }
      if (gameException) {
        gameException = false;
      } else {
        const exitStatus = path ? createShip(path) : 2;
        if (!exitStatus) {
          PubSub.publish('domGame#styleCoords', path, getCurrentBoardId());
        }
        if (exitStatus !== 1) {
          PubSub.publish('domGame#toggle-current-path');
          currentPath = false;
        }
      }
    } else {
      currentPath = coord;
      PubSub.publish('domGame#toggle-current-path');
    }
  };

  const dealWithPoint = (coord) => {
    beginPath(coord);
    if (currentPlayer.ships.length === maxShips) {
      if (currentPlayer === firstPlayer) {
        domChangePlayer();
      } else {
        document.getElementById('game-props').innerHTML = '';
        domStartBattleship();
      }
    }
  };

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

  const pathPostEvaluation = (path, player = currentPlayer) => {
    try {
      path.forEach((coord) => {
        if (player.board[coord[0]][coord[1]] !== '') {
          throw new Error('Occupied!');
        }
      });
    } catch ({ message }) {
      gameException = true;
      PubSub.publish('game#exception', message);
    }
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
    // Game events
    PubSub.subscribe('game#first-player', (player) => {
      firstPlayer = player;
    });
    PubSub.subscribe('game#second-player', (player) => {
      secondPlayer = player;
    });
    PubSub.subscribe('game#change-player', (player) => {
      currentPlayer = player;
    });
    PubSub.subscribe('game#change-player', () => {
      hideBoard(hitMode, hideMessage, [currentPlayer === secondPlayer]);
      hideMessage = false;
    });
    PubSub.subscribe('game#finish-game', domFinish);
    PubSub.subscribe('game#create-ship', updateShipNum);

    // DOM game events
    PubSub.subscribe('domGame#dom-start', renderShipNum);
    PubSub.subscribe('domGame#evaluate-path', evaluatePath);
    PubSub.subscribe('domGame#deal-with-point', dealWithPoint);
    PubSub.subscribe('domGame#common-evaluation', commonEvaluation);
    PubSub.subscribe('domGame#dom-change-player', () => {
      if (!hitMode) renderShipNum();
    });

    PubSub.subscribe('domGame#make-board', makeBoard);
    PubSub.subscribe('domGame#path-post-evaluation', pathPostEvaluation);
    PubSub.subscribe('domGame#styleCoords', styleCoords);
    PubSub.subscribe('domGame#toggle-current-path', toggleCurrentPath);
    PubSub.subscribe('domGame#set-hide-message', (message) => {
      hideMessage = message;
    });
  };

  return {
    domStart,
    domChangePlayer,
    domStartBattleship,
    pointShip,
    beginPath,
    pathPostEvaluation,
    getAttrs,
    setup,
    makeStartButton,
  };
}

export default domGame;
