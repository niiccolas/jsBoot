// Populate <td>'s IDs
function makeIDs() {
  const rows = document.getElementsByClassName('header_row');
  const columns = document.getElementsByClassName('header_column');
  const cells = document.querySelectorAll('td');
  // Generate IDs from rows and columns length
  const board = [];
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < columns.length; j++) {
      board.push(`${i }${j}`);
    }
  }
  // Tag each cell with a board ID
  cells.forEach((e, index) => {
    e.setAttribute('id', board[index]);
  });
}

window.onload = makeIDs;

// VIEW
const view = {
  displayMessage(msg) {
    const feedback = document.getElementById('displayFeedback');
    feedback.firstElementChild.innerText = msg;
  },
  displayHit(loc) {
    document.getElementById(loc).setAttribute('class', 'hit');
  },
  displayMiss(loc) {
    document.getElementById(loc).setAttribute('class', 'miss');
  },
};

// MODEL
const model = {
  boardSize: 7,
  numShips: 3, // ? Redudant with ships.length ?
  ships: [
    { positions: ['00', '01', '02'], hits: [] },
    { positions: ['10', '11', '12'], hits: [] },
    { positions: ['20', '21', '22'], hits: [] },
  ],
  shipsSunk: 0, // if 3 then game is WON
  shipLength: 3,
  fire(loc) {
    // Increment controller guess count at each fire attempt
    controller.guesses++;
    console.log(controller.guesses);

    for (let i = 0, s = this.ships; i < s.length; i++) {
      const ship = s[i];
      const locIndex = ship.positions.indexOf(loc);
      if (locIndex >= 0) {
        ship.hits[locIndex] = 'hit';
        view.displayHit(loc);

        if (this.isSunk(ship)) {
          //
          this.shipsSunk++;
          if (this.shipsSunk === this.numShips) {
            view.displayMessage('Enemy fleet destroyed, you won!');
          }
        }
        return true;
      }
    }
    view.displayMiss(loc);
    return false;
  },
  isSunk(ship) {
    for (let i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== 'hit') {
        return false;
      }
    }
    return true;
  },
};

// CONTROLLER
const controller = {
  processGuess() {
    // Get all cells as a NodeList
    cells = document.querySelectorAll('td');
    // Iterate over cells adding a click event listener
    cells.forEach(x => x.addEventListener('click', y => model.fire(y.target.id)));
  },
  guesses: 0,
};

// This could be triggered by a "START GAME" button
controller.processGuess();
