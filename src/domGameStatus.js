import PubSub from './PubSub';

const statusMemo = {};

function removeItem(item, msg) {
  item.remove();
  delete statusMemo[msg];
}

function buildError(msg) {
  if (!statusMemo[msg]) {
    const item = document.createElement('div');
    item.classList.add('game-error');
    item.textContent = msg;
    const gameStatus = document.getElementById('game-status');

    gameStatus.appendChild(item);
    statusMemo[msg] = true;
    setTimeout(removeItem.bind(this, item, msg), 3000);
  }
}

PubSub.subscribe('game#exception', buildError);
