const makeShipProps = (props) => {
  const row = document.createElement('tr');

  const number = document.createElement('td');
  number.id = `${props.name}-num`;
  number.textContent = props.number;
  row.appendChild(number);

  const name = document.createElement('td');
  name.textContent = props.name;
  row.appendChild(name);

  const length = document.createElement('td');
  length.textContent = props.length;
  row.appendChild(length);

  return row;
};

const renderShipNum = () => {
  const container = document.getElementById('ship-num');
  container.innerHTML = '';
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
  container.appendChild(table);
};

const updateShipNum = (shipObj) => {
  const cell = document.getElementById(`${shipObj.type}-num`);
  cell.textContent = +cell.textContent - 1;
};

export { renderShipNum, updateShipNum };
