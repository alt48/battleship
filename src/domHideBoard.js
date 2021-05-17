const getHideIds = (...revConditions) => {
  let ids = ['sp-board', 'fp-board'];
  revConditions.forEach((cond) => {
    if (cond) ids = ids.reverse();
  });
  return ids;
};

const hideScreen = () => {
  const elm = document.createElement('div');
  elm.id = 'board-layer';
  elm.textContent = 'Click here';
  elm.addEventListener('click', (e) => {
    e.target.remove();
  });
  document.body.insertBefore(elm, document.body.firstElementChild);
};

const modifyButtons = (ids) => {
  Object.keys(ids).forEach((id) => {
    const buttons = Array.from(document.querySelectorAll(`#${id} button`));
    buttons.forEach((button) => {
      const modBtn = button;
      modBtn.disabled = ids[id].includes('disabled');
      const method = ids[id].includes('hidden') ? 'add' : 'remove';
      modBtn.classList[method]('hidden-cell');
    });
  });
};

const hideBoard = (hitMode, conditions) => {
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
};

export { hideBoard, hideScreen };
