import traversePath from './traversePath';
import PubSub from './PubSub';

function domGame(dependencies) {
  const {
    createShip,
    start,
    changeCurrentPlayer,
    attemptToHit,
  } = dependencies;

  let started = false;
  let currentPath = false;
  let hitMode = false;
  let currentPlayer = false;
  let firstPlayer = false;
  let secondPlayer = false;

  const getHideIds = (...revConditions) => {
    let ids = ['sp-board', 'fp-board'];
    revConditions.forEach((cond) => {
      if (cond) ids = ids.reverse();
    });
    return ids;
  };

  const modifyButtons = (ids) => {
    Object.keys(ids).forEach((id) => {
      Array.from(document.querySelectorAll(`#${id} button`)).forEach((btn) => {
        const modBtn = btn;
        modBtn.disabled = ids[id];
      });
    });
  };

  const hideBoard = () => {
    const ids = getHideIds(hitMode, currentPlayer === secondPlayer);
    document.getElementById(ids[0]).classList.add('hidden-board');
    document.getElementById(ids[1]).classList.remove('hidden-board');

    const btnValues = {};
    btnValues[ids[0]] = true;
    btnValues[ids[1]] = false;
    modifyButtons(btnValues);
  };

  const createButton = (props, callback) => {
    const button = document.createElement('button');
    Object.keys(props).forEach((prop) => {
      button[prop] = props[prop];
    });
    button.addEventListener('click', callback);
    return button;
  };

  const cleanStatusTo = (target, btnProps) => {
    const parentElm = target.parentElement;
    target.remove();
    parentElm.appendChild(createButton(...btnProps));
  };

  const startEvaluation = () => {
    if (!started) throw new Error('Please start the game');
  };

  const shipNumberEvaluation = () => {
    if (currentPlayer.ships.length !== 15) throw new Error('Insufficient ships');
  };

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

  const domStartBattleship = (e, attrs = {
    startEvaluation,
    shipNumberEvaluation,
  }) => {
    attrs.startEvaluation();
    attrs.shipNumberEvaluation();
    if (currentPath) {
      toggleCurrentPath();
      currentPath = false;
    }
    e.target.remove();
    hitMode = true;
    changeCurrentPlayer();
  };

  const domChangePlayer = (e, attrs = {
    startEvaluation,
    shipNumberEvaluation,
  }) => {
    attrs.startEvaluation();
    attrs.shipNumberEvaluation();
    if (currentPath) {
      toggleCurrentPath();
      currentPath = false;
    }
    cleanStatusTo(e.target, [
      { textContent: 'Start Game', id: 'start-game' },
      domStartBattleship,
    ]);
    changeCurrentPlayer();
  };

  const domStart = (e) => {
    cleanStatusTo(e.target, [
      { textContent: 'Change Player', id: 'change-player' },
      domChangePlayer,
    ]);
    started = true;
    start();
  };

  const checkPlayer = (id) => id === getCurrentBoardId();

  const evaluatePath = (id) => {
    if (!started) throw new Error('Please start the game');
    let rightBoard = checkPlayer(id);
    if (hitMode) rightBoard = !rightBoard;
    if (!rightBoard) throw new Error('You can\'t do that');
  };

  const styleCoords = (path, type) => {
    path.forEach((coord) => {
      const cell = document.querySelector(
        `#${getCurrentBoardId()} [data-coord="${coord.join('#')}"]`,
      );
      cell.classList.add(`board-${type}`);
    });
  };

  const beginPath = (coord, attrs = {
    styleFunction: styleCoords,
    focusToggler: toggleCurrentPath,
  }) => {
    if (currentPath) {
      if (!currentPath.every((i, idx) => i === coord[idx])) {
        const path = traversePath(currentPath, coord);
        const { type } = createShip(path);
        attrs.styleFunction(path, type);
      }
      attrs.focusToggler();
      currentPath = false;
    } else {
      currentPath = coord;
      attrs.focusToggler();
    }
  };

  const pointShip = (e, attrs = {
    pointEvaluation: evaluatePath,
    hitCondition: hitMode,
    defaultAction: beginPath,
  }) => {
    const coord = e.target.dataset.coord.split('#').map((i) => +i);
    attrs.pointEvaluation(e.target.parentElement.id);
    if (attrs.hitCondition) {
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

  PubSub.subscribe('game#first-player', setFirstPlayer);
  PubSub.subscribe('game#second-player', setSecondPlayer);
  PubSub.subscribe('game#change-player', changePlayer);
  PubSub.subscribe('game#change-player', hideBoard);
  PubSub.subscribe('game#finish-game', domFinish);

  return {
    domStart,
    domChangePlayer,
    domStartBattleship,
    pointShip,
    beginPath,
    getAttrs,
  };
}

export default domGame;
