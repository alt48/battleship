import Player from './Player';

const Battleship = (function() {
  let currentPlayer;
  let firstPlayer;
  let secondPlayer;

  const start = (playerFunc=Player) => {
    firstPlayer = playerFunc();
    secondPlayer = playerFunc();
  };

  const setFirstPlayer = () => {
  };

  return {
    start
  };
})()

export default Battleship;
