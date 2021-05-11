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

  const cleanStatus = (target, btnProps) => {
    const parentElm = target.parentElement;
    target.remove();
    parentElm.appendChild(createButton(...btnProps));
  };

  const domStartBattleship = (e) => {
    e.target.remove();
    hitMode = true;
    changeCurrentPlayer();
  };

  const domChangePlayer = (e) => {
    cleanStatus(e.target, [
      { textContent: 'Start Game', id: 'start-game' },
      domStartBattleship,
    ]);
    changeCurrentPlayer();
  };

  const domStart = (e) => {
    cleanStatus(e.target, [
      { textContent: 'Change Player', id: 'change-player' },
      domChangePlayer,
    ]);
    started = true;
    start();
  };

  const checkPlayer = (id) => {
    let val;
    if (currentPlayer === firstPlayer) {
      val = id === 'fp-board';
    } else if (currentPlayer === secondPlayer) {
      val = id === 'sp-board';
    }
    return val;
  };

  const evaluatePath = (id) => {
    if (!started) throw new Error('Please start the game');
    let rightBoard = checkPlayer(id);
    if (hitMode) rightBoard = !rightBoard;
    if (!rightBoard) throw new Error('You can\'t do that');
  };

  const beginPath = (coord) => {
    if (currentPath) {
      const path = traversePath(currentPath, coord);
      createShip(path);
      currentPath = false;
    } else {
      currentPath = coord;
    }
  };

  const pointShip = (e) => {
    const coord = e.target.dataset.coord.split('#').map((i) => +i);
    evaluatePath(e.target.parentElement.id);
    if (hitMode) {
      attemptToHit(coord);
    } else {
      beginPath(coord);
    }
  };

  const getCurrentPath = () => currentPath;

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

  PubSub.subscribe('game#first-player', setFirstPlayer);
  PubSub.subscribe('game#second-player', setSecondPlayer);
  PubSub.subscribe('game#change-player', changePlayer);
  PubSub.subscribe('game#change-player', hideBoard);
  PubSub.subscribe('game#finish-game', domFinish);

  return {
    domStart,
    domChangePlayer,
    domStartBattleship,
    beginPath,
    pointShip,
    getCurrentPath,
  };
}

export default domGame;
