function getHideIds(...revConditions) {
  let ids = ['sp-board', 'fp-board'];
  revConditions.forEach((cond) => {
    if (cond) ids = ids.reverse();
  });
  return ids;
}

function hideScreen() {
  const elm = document.createElement('div');
  elm.id = 'board-layer';
  elm.textContent = 'Click here';
  elm.addEventListener('click', (e) => {
    e.target.remove();
  });
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

function hideBoard(hitMode, conditions) {
  const ids = getHideIds(...conditions);
  document.getElementById(ids[0]).classList.add('hidden-board');
  document.getElementById(ids[1]).classList.remove('hidden-board');

  const btnValues = {};
  if (hitMode) {
    hideScreen();
    btnValues[ids[0]] = ['hidden'];
    btnValues[ids[1]] = ['disabled'];
  } else {
    btnValues[ids[0]] = ['hidden', 'disabled'];
    btnValues[ids[1]] = [];
  }

  modifyButtons(btnValues);
}

export { hideBoard, hideScreen };
