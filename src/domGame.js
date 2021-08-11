import traversePath from './traversePath';
import { hideBoard, hideScreen } from './domHideBoard';
import styleCoords from './domStyleCells';
import { renderShipNum, updateShipNum } from './domShipNumber';
import PubSub from './PubSub';
import { fillBoard, makeMove } from './domAutoMode';

function domGame(dependencies) {
  const {
    createShip,
    start,
    changeCurrentPlayer,
    attemptToHit,
  } = dependencies;

  const maxShips = 15;
  let started = false;
  let currentPath = false;
  let hitMode = false;
  let currentPlayer = false;
  let firstPlayer = false;
  let secondPlayer = false;
  let gameException = false;
  let hideMessage = false;
  let autoMode = false;

  const postFocusedCells = [];
  let isSwitch = false;

  const domStart = (e) => {
    e.target.remove();
    started = true;
    PubSub.publish('domGame#prepare-boards');
    start();
    PubSub.publish('domGame#dom-start');
  };

  const autoFollowShip = (move, path) => {
    let clonedPath = JSON.parse(JSON.stringify(path));
    clonedPath = clonedPath.filter((elm) => {
      let isEqual = true;
      for (let i = 0; i < elm.length; i += 1) {
        if (elm[i] !== move[i]) {
          isEqual = false;
          break;
        }
      }

      return !isEqual;
    });

    const inx = {};
    for (let i = 0; i < clonedPath.length; i += 1) {
      const clonedSum = clonedPath[i][0] + clonedPath[i][1];
      const originSum = move[0] + move[1];
      inx[i] = Math.abs(originSum - clonedSum);
    }

    const sorting = Object.keys(inx).sort((a, b) => inx[a] - inx[b]);
    return sorting.map((key) => clonedPath[key]);
  };

  const computeFutureMoves = (move) => {
    const focus = (currentPlayer === firstPlayer
      ? secondPlayer : firstPlayer).board[move[0]][move[1]];

    if (focus) {
      autoFollowShip(move, focus.path).forEach((futureMove) => {
        postFocusedCells.push(futureMove);
      });
    }
  };

  const makeAutoMove = () => {
    const element = (coords) => (
      document.querySelector(`[data-coord='${coords.join('#')}']`)
    );

    let move;
    if (postFocusedCells.length) {
      [move] = postFocusedCells.splice(0, 1);
      isSwitch = true;
    } else {
      while (
        !(
          move
          && !element(move).className.includes('hit-button')
        )
      ) {
        move = makeMove(currentPlayer.board);
      }
      isSwitch = false;
    }

    const square = element(move);
    square.classList.add('hit-button');
    square.classList.remove('gray-sea-button');

    if (!isSwitch) computeFutureMoves(move);
    attemptToHit(move);
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
      if (started && autoMode) makeAutoMove();
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

  const setAutoMode = () => {
    autoMode = !autoMode;
    document.body.classList.toggle('auto-mode');
  };

  const makeAutoToggler = () => {
    const toggler = document.createElement('button');
    toggler.id = 'toggle-bot';
    const icon = document.createElement('i');
    icon.classList.add('gg-eye-alt');
    toggler.appendChild(icon);
    toggler.addEventListener('click', setAutoMode);
    const container = document.getElementById('root');
    container.insertBefore(toggler, container.firstElementChild);
  };

  const domFinish = () => {
    hitMode = false;
    started = false;
    currentPlayer = false;
    firstPlayer = false;
    secondPlayer = false;
    hideScreen(hideMessage);
    makeAutoToggler();
    makeStartButton();
  };

  const makeSingleBoard = () => {
    const container = document.createElement('div');
    for (let i = 0; i < 10; i += 1) {
      for (let y = 0; y < 10; y += 1) {
        const button = document.createElement('button');
        button.dataset.coord = `${i}#${y}`;
        button.classList.add('sea-button');
        button.addEventListener('click', pointShip);
        container.appendChild(button);
      }
    }
    return container;
  };

  const makeBoards = () => {
    const container = document.getElementById('boards');
    container.innerHTML = '';
    ['fp-board', 'sp-board'].forEach((id) => {
      const board = makeSingleBoard();
      board.id = id;
      container.appendChild(board);
    });
  };

  const prepareBoards = () => {
    const title = document.getElementById('game-title');
    if (title.className.includes('title-maximized')) {
      title.classList.remove('title-maximized');
      title.classList.add('title-minimized');
    }
    makeBoards();
  };

  const getCurrentBoardId = () => (
    currentPlayer === firstPlayer
      ? 'fp-board'
      : 'sp-board'
  );

  const evaluatePath = (target) => {
    if (target.className.includes('hit-button')) {
      gameException = true;
      PubSub.publish('game#exception', 'You can\'t do that');
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
        return;
      }
      const exitStatus = path ? createShip(path) : 2;
      if (!exitStatus) {
        PubSub.publish('domGame#styleCoords', path, getCurrentBoardId());
      }
      if (exitStatus !== 1) {
        PubSub.publish('domGame#toggle-current-path');
        currentPath = false;
      }
    } else {
      currentPath = coord;
      PubSub.publish('domGame#toggle-current-path');
    }
  };

  const makeAutoBoard = () => {
    document.getElementById('game-props').innerHTML = '';
    const [ships] = fillBoard(currentPlayer.board, maxShips);
    ships.forEach((ship) => {
      createShip(ship);
      PubSub.publish('domGame#styleCoords', ship, getCurrentBoardId());
    });
  };

  const dealWithPoint = (coord) => {
    beginPath(coord);
    if (currentPlayer.ships.length === maxShips) {
      if (currentPlayer === firstPlayer) {
        domChangePlayer();
        if (autoMode) {
          makeAutoBoard();
          domStartBattleship();
          hideScreen('Battleship!');
        }
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
    for (let i = 0; i < path.length; i += 1) {
      const coord = path[i];
      if (player.board[coord[0]][coord[1]] !== '') {
        gameException = true;
        PubSub.publish('game#exception', 'Occupied!');
        break;
      }
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
      hideBoard(hitMode, hideMessage, autoMode, [currentPlayer === secondPlayer]);
      hideMessage = false;
    });
    PubSub.subscribe('game#finish-game', () => {
      const boardId = getCurrentBoardId() === 'sp-board' ? 'fp-board' : 'sp-board';
      Array.from(document.getElementById(boardId).children).forEach((button) => {
        const modBtn = button;
        modBtn.disabled = true;
      });
      domFinish();
    });
    PubSub.subscribe('game#create-ship', (obj) => {
      if (!autoMode || (autoMode && currentPlayer === firstPlayer)) {
        updateShipNum(obj);
      }
    });

    // DOM game events
    PubSub.subscribe('domGame#dom-start', () => {
      document.getElementById('toggle-bot').remove();
      renderShipNum();
    });
    PubSub.subscribe('domGame#evaluate-path', evaluatePath);
    PubSub.subscribe('domGame#deal-with-point', dealWithPoint);
    PubSub.subscribe('domGame#common-evaluation', commonEvaluation);
    PubSub.subscribe('domGame#dom-change-player', () => {
      if (!hitMode) renderShipNum();
    });

    PubSub.subscribe('domGame#prepare-boards', prepareBoards);
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
    makeAutoToggler,
    autoFollowShip,
  };
}

export default domGame;
