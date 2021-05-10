// import {
//   start,
//   changeCurrentPlayer,
//   finish,
//   isReset,
//   createShip,
//   attemptToHit,
// } from './Game';
import traversePath from './traversePath';
import PubSub from './PubSub';

function domGame(dependencies) {
  const {
    createShip,
    start,
    started,
    currentPlayer,
    firstPlayer,
    secondPlayer,
    changeCurrentPlayer,
  } = dependencies;
  let currentPath = false;
  let hitMode = false;

  const getHideClasses = () => {
    let classes = ['sp-board', 'fp-board'];
    if (hitMode) classes = classes.reverse();
    if (currentPlayer === secondPlayer) classes = classes.reverse();
    return classes;
  };

  const hideBoard = () => {
    const classes = getHideClasses();
    document.getElementById(classes[0]).classList.add('hidden-board');
    document.getElementById(classes[1]).classList.remove('hidden-board');
  };

  const createButton = (props, callback) => {
    const button = document.createElement('button');
    props.forEach((prop) => {
      button[prop] = props[prop];
    });
    button.addEventListener('click', callback);
  };

  const cleanStatus = (target, btnProps) => {
    const parentElm = target.parentElement;
    target.remove();
    parentElm.appendChild(createButton(...btnProps));
  };

  const domStart = (e) => {
    cleanStatus(e.target, [
      { textContent: 'Change Player', id: 'change-player' },
      domChangePlayer,
    ]);
    start();
    hideBoard();
  };

  const checkPlayer = (id) => {
    if (currentPlayer === firstPlayer) {
      return id === 'fp-board';
    } else if (currentPlayer === secondPlayer) {
      return id === 'sp-board';
    }
  };

  const evaluatePath = (id) => {
    if (!started) throw new Error('Please start the game');
    if (!checkPlayer(id)) throw new Error('You can\'t do that');
  };

  const beginPath = (e, evaluation=evaluatePath) => {
    evaluation(e.target.id);
    const coord = e.target.dataset.coord.split('#').map((i) => +i);
    if (currentPath) {
      const path = traversePath(currentPath, coord);
      createShip(path);
      currentPath = false;
    } else {
      currentPath = coord;
    }
  };

  const pointShip = (e) => {
    if (hitMode) {
      attemptToHit();
    } else {
      beginPath(e);
    }
  };

  const domChangePlayer = (e) => {
    cleanStatus(e.target, [
      { textContent: 'Start Game', id: 'start-game' },
      domStartBattleship,
    ]);
    changeCurrentPlayer();
  };

  const domStartBattleship = (e) => {
    e.target.remove();
    hitMode = true;
    changeCurrentPlayer();
  };

  const getCurrentPath = () => {
    return currentPath;
  };

  PubSub.subscribe('game#change-player', hideBoard);

  return {
    domStart,
    domChangePlayer,
    domStartBattleship,
    beginPath,
    getCurrentPath,
  };
}

export default domGame;
