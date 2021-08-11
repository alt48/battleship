import traversePath from './traversePath';

function randomShip(board, pieces) {
  const orientation = Math.floor(Math.random() * 2);
  let points;
  if (orientation === 0) {
    const row = Math.floor(Math.random() * board.length);

    const names = Object.keys(pieces);
    const name = names[Math.floor(Math.random() * names.length)];
    const type = pieces[name];
    const startPoint = Math.floor(Math.random() * board[0].length);

    const direction = Math.floor(Math.random() * 2);
    points = [[row, startPoint]];
    if (direction === 0) {
      points.push([row, startPoint + type.length - 1]);
    } else {
      points.push([row, startPoint - type.length + 1]);
    }
  } else {
    const col = Math.floor(Math.random() * board[0].length);

    const names = Object.keys(pieces);
    const name = names[Math.floor(Math.random() * names.length)];
    const type = pieces[name];
    const startPoint = Math.floor(Math.random() * board.length);

    const direction = Math.floor(Math.random() * 2);
    points = [[startPoint, col]];
    if (direction === 0) {
      points.push([startPoint + type.length - 1, col]);
    } else {
      points.push([startPoint - type.length + 1, col]);
    }
  }
  return points;
}

function fillBoard(board, maxShips) {
  const pieces = {
    Carrier: { number: 1, length: 5 },
    Battleship: { number: 2, length: 4 },
    Submarine: { number: 7, length: 3 },
    Destroyer: { number: 5, length: 2 },
  };

  const customBoard = [];
  for (let i = 0; i < 10; i += 1) {
    customBoard.push([]);
    for (let y = 0; y < 10; y += 1) {
      customBoard[i].push('');
    }
  }

  const ships = [];

  let i = 0;
  while (i < maxShips) {
    let path;
    while (
      !(
        path
        && path.every((y) => customBoard[y[0]] && customBoard[y[0]][y[1]] === '')
      )
    ) {
      path = traversePath(...randomShip(board, pieces));
    }

    const name = Object.keys(pieces).find((y) => (
      pieces[y].length === path.length
    ));

    path.forEach((pair) => {
      customBoard[pair[0]][pair[1]] = name;
    });

    ships.push(path);

    pieces[name].number -= 1;
    if (pieces[name].number === 0) {
      delete pieces[name];
    }
    i += 1;
  }

  return [ships, customBoard];
}

function makeMove(board) {
  return [
    Math.floor(Math.random() * board.length),
    Math.floor(Math.random() * board[0].length),
  ];
}

export { fillBoard, makeMove };
