function makeShipProps(props) {
  const row = document.createElement('tr');

  const number = document.createElement('td');
  number.id = `${props.name}-num`;
  number.textContent = props.number;
  row.appendChild(number);

  const name = document.createElement('td');
  name.textContent = `of ${props.name}`;
  row.appendChild(name);

  const length = document.createElement('td');
  const head = document.createElement('div');
  head.style.display = 'inline-block';
  head.style.height = '32px';
  head.style.width = '35px';
  head.classList.add('SHIP-head-template');
  length.appendChild(head);

  let i = props.length - 2;
  while (i) {
    const body = document.createElement('div');
    body.style.display = 'inline-block';
    body.style.height = '32px';
    body.style.width = '35px';
    body.classList.add('SHIP-body-template');
    length.appendChild(body);
    i -= 1;
  }

  const tail = document.createElement('div');
  tail.style.display = 'inline-block';
  tail.style.height = '32px';
  tail.style.width = '35px';
  tail.classList.add('SHIP-tail-template');
  length.appendChild(tail);

  row.appendChild(length);

  return row;
}

function makeTable() {
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');
  const ships = [
    { name: 'Carrier', length: 5, number: 1 },
    { name: 'Battleship', length: 4, number: 2 },
    { name: 'Submarine', length: 3, number: 7 },
    { name: 'Destroyer', length: 2, number: 5 },
  ];
  ships.forEach((ship) => {
    const row = makeShipProps(ship);
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  return table;
}

function renderShipNum() {
  const container = document.getElementById('ship-num');
  container.innerHTML = '';
  container.appendChild(makeTable());
}

function updateShipNum(shipObj) {
  const cell = document.getElementById(`${shipObj.type}-num`);
  if (cell.textContent === '1') {
    cell.parentElement.remove();
  } else {
    cell.textContent = +cell.textContent - 1;
  }
}

export { renderShipNum, updateShipNum };
