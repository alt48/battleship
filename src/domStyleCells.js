const getShipOrientation = (pos) => {
  let orientation;
  if (pos.every((i) => i[0] === pos[0][0])) {
    orientation = 'horizontal';
    if (pos[0][1] > pos[pos.length - 1][1]) {
      orientation += '-reverse';
    }
  } else if (pos.every((i) => i[1] === pos[0][1])) {
    orientation = 'vertical';
    if (pos[0][0] > pos[pos.length - 1][0]) {
      orientation += '-reverse';
    }
  }
  if (orientation) return orientation;
  throw new Error('Invalid positions');
};

const styleCoords = (path, boardId) => {
  const orientation = getShipOrientation(path);

  const cells = [];
  path.forEach((coord) => {
    const cell = document.querySelector(
      `#${boardId} [data-coord="${coord.join('#')}"]`,
    );
    cells.push(cell);
  });

  const head = cells.splice(0, 1)[0];
  head.classList.add(`SHIP-head-${orientation}`);

  const tail = cells.splice(-1, 1)[0];
  tail.classList.add(`SHIP-tail-${orientation}`);

  cells.forEach((cell) => {
    cell.classList.add(`SHIP-body-${orientation}`);
  });
};

export default styleCoords;
