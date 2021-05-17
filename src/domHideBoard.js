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
    Array.from(document.querySelectorAll(`#${id} button`)).forEach((btn) => {
      const modBtn = btn;
      const method = ids[id] ? 'add' : 'remove';
      modBtn.classList[method]('hidden-cell');
    });
  });
};

const hideBoard = (hitMode, conditions) => {
  const ids = getHideIds(...conditions);
  document.getElementById(ids[0]).classList.add('hidden-board');
  document.getElementById(ids[1]).classList.remove('hidden-board');

  if (hitMode) hideScreen();
  const btnValues = {};
  btnValues[ids[0]] = true;
  btnValues[ids[1]] = false;
  modifyButtons(btnValues);
};

export { hideBoard, hideScreen };
