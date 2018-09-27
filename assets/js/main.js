// //////////////////////////////
// MODEL
// //////////////////////////////
const model = {
  boardSize: 7,
  numShips: 3, // ? Redudant with ships.length ?
  ships: [
    { positions: ['00', '00', '00'], hits: [] },
    { positions: ['00', '00', '00'], hits: [] },
    { positions: ['00', '00', '00'], hits: [] },
  ],
  shipsSunk: 0,
  shipLength: 3,

  fire(loc) {
    // Keep track of each correct guess for stats display
    controller.guesses++;

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
            view.displayVictory('Enemy fleet destroyed, you won!');
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

  generateShipLocations() {
    let locations;
    for (let i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].positions = locations;
    }
    return locations;
  },

  generateShip() {
    const randomDirection = Math.floor(Math.random() * 2); // 0 for vertical 1 for horizontal
    let row;
    let column;

    if (randomDirection) {
      row = Math.floor(Math.random() * this.boardSize);
      column = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
      column = Math.floor(Math.random() * this.boardSize);
    }

    const newShipLocations = [];
    for (let i = 0; i < this.shipLength; i++) {
      // ship.push(parseInt(ship[i]) + 1 + '');
      if (randomDirection) {
        newShipLocations.push(row + '' + (column + i));
      } else {
        newShipLocations.push((row + i) + '' + column);
      }
    }
    return newShipLocations;
  },

  collision(locations) {
    for (let i = 0; i < this.numShips; i++) {
      let ship = this.ships[i];
      for (let j = 0; j < locations.length; j++) {
        if (ship.positions.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  },

  randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
};

// //////////////////////////////
// VIEW
// //////////////////////////////
const view = {
  displayVictory(msg) {
    const feedback = document.getElementById('displayFeedback');
    feedback.firstElementChild.innerText = msg;
    // Change background to clear blue
    document.querySelector('body').classList.add('victoryBody');
    // Set <td>s hover cursor to not-allowed
    document.querySelectorAll('td').forEach(x => x.classList.add('victoryTd'));
  },

  displayHit(loc) {
    document.getElementById(loc).setAttribute('class', 'hit');
  },

  displayMiss(loc) {
    document.getElementById(loc).setAttribute('class', 'miss');
  },

  // Populate existing <td> cells with unique number IDs
  makeIDs() {
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
  },
};

// //////////////////////////////
// CONTROLLER
// //////////////////////////////
const controller = {
  processGuess() {
    // Get all cells as a NodeList
    cells = document.querySelectorAll('td');
    // Iterate over cells adding a click event listener
    cells.forEach(x => x.addEventListener('click', y => model.fire(y.target.id)));
  },
  guesses: 0,
};

// //////////////////////////////
// Auto-starting the game onload
// //////////////////////////////
function init() {
  model.generateShipLocations()
  view.makeIDs();
  controller.processGuess();
  // Cheat codes ON, reveal ships positions:
  model.ships.forEach(x => console.log(x.positions));
}

window.onload = init;
