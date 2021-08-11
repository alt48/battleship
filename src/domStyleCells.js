function isIncrementing(array, orientation) {
  let incrementing = true;
  const pair = [
    orientation.includes('horizontal') ? 1 : 0,
    orientation.includes('reverse') ? 1 : -1,
  ];
  for (let i = 0; i < array.length; i += 1) {
    if (
      array[i + 1]
      && array[i][pair[0]] !== array[i + 1][pair[0]] + pair[1]
    ) {
      incrementing = false;
      break;
    }
  }
  return incrementing;
}

function setCompOrientation(pos, main) {
  let val;
  const idxs = main === 'horizontal' ? [1, 0] : [0, 1];
  if (pos.every((i) => i[idxs[1]] === pos[0][idxs[1]])) {
    val = main;
    if (pos[0][idxs[0]] > pos[pos.length - 1][idxs[0]]) {
      val += '-reverse';
    }
  }
  return val;
}

function getShipOrientation(pos) {
  const orientation = (
    setCompOrientation(pos, 'horizontal')
    || setCompOrientation(pos, 'vertical')
  );
  if (orientation && isIncrementing(pos, orientation)) return orientation;
  throw new Error('Invalid positions');
}

function addShipParts(cells, orientation) {
  const head = cells.splice(0, 1)[0];
  head.classList.add(`SHIP-head-${orientation}`);

  const tail = cells.splice(-1, 1)[0];
  tail.classList.add(`SHIP-tail-${orientation}`);

  cells.forEach((cell) => {
    cell.classList.add(`SHIP-body-${orientation}`);
  });
}

function styleCoords(path, boardId) {
  const orientation = getShipOrientation(path);

  const cells = [];
  path.forEach((coord) => {
    const cell = document.querySelector(
      `#${boardId} [data-coord="${coord.join('#')}"]`,
    );
    cells.push(cell);
  });

  addShipParts(cells, orientation);
}

export { styleCoords as default, getShipOrientation };
