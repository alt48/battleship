function getHideIds(...revConditions) {
  let ids = ['sp-board', 'fp-board'];
  revConditions.forEach((cond) => {
    if (cond) ids = ids.reverse();
  });
  return ids;
}

function hideScreen(message) {
  const elm = document.createElement('div');
  elm.id = 'board-layer';

  const msgCont = document.createElement('div');
  msgCont.id = 'layer-message';
  msgCont.textContent = message;
  elm.appendChild(msgCont);

  const clickHere = document.createElement('div');
  clickHere.id = 'layer-click-here';
  clickHere.textContent = '(Click anywhere)';
  elm.appendChild(clickHere);

  elm.addEventListener('click', () => {
    document.body.style.overflow = '';
    document.getElementById('board-layer').remove();
  });
  document.body.style.overflow = 'hidden';
  document.body.insertBefore(elm, document.body.firstElementChild);
}

function parseButton(button, attrs) {
  const modBtn = button;
  modBtn.disabled = attrs.includes('disabled');
  let method;
  if (!attrs.includes('hidden')) {
    method = 'remove';
  } else {
    method = 'add';
  }
  if (!(method === 'add' && modBtn.className.includes('hit-button'))) {
    modBtn.classList[method]('gray-sea-button');
  }
}

function modifyButtons(ids) {
  Object.keys(ids).forEach((id) => {
    const buttons = Array.from(document.querySelectorAll(`#${id} button`));
    buttons.forEach((btn) => parseButton(btn, ids[id]));
  });
}

function hideBoard(hitMode, message, silent, conditions) {
  const ids = getHideIds(...conditions);
  document.getElementById(ids[0]).classList.add('hidden-board');
  document.getElementById(ids[1]).classList.remove('hidden-board');

  const btnValues = {};
  if (hitMode) {
    if (!silent) hideScreen(message);
    btnValues[ids[0]] = ['hidden'];
    btnValues[ids[1]] = ['disabled'];
  } else {
    btnValues[ids[0]] = ['hidden', 'disabled'];
    btnValues[ids[1]] = [];
  }

  modifyButtons(btnValues);
}

export { hideBoard, hideScreen };
