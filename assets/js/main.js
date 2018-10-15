// * ####################################
// * Model
// * ####################################
const model = {
  rows: document.getElementById('num_rows').value,
  columns: document.getElementById('num_cols').value,
  numShips: 3, // total number of ships
  ships: [
    { positions: ['00', '00', '00'], hits: [] },
    { positions: ['00', '00', '00'], hits: [] },
    { positions: ['00', '00', '00'], hits: [] },
  ],
  shipsSunk: 0,
  shipLength: 4,
  guesses: 0, // tracks the number of guesses from the fire() method
  soundEffects: {
    location: '/assets/audio/',
    files: {
      cannon: ['cannon01.mp3', 'cannon02.mp3', 'cannon03.mp3', 'cannon04.mp3'],
      hit: ['hit.mp3'],
      sunk: ['sunk.mp3'],
    },
    genRandEffect(type) {
      let soundArray = this.files[type];
      return this.location + soundArray[Math.floor(Math.random() * soundArray.length)];
    },
  },

  createGrid() {
    this.createTable(this.rows, this.columns);
  },

  createTable(rows = 8, cols = 8) {
    const gameGrid = document.getElementById('gameGrid'); // capture the container <div>
    const table = document.createElement('table'); // create the <table> element
    gameGrid.innerHTML = ''; // clean the existing grid, if any

    // populate the <table> with ...
    for (let i = 0; i < rows; i++) { // ... as many <tr> as passed to "rows"
      const tr = table.insertRow();
      for (let j = 0; j < cols; j++) { // ... as many <td> as passed to "cols"
        tr.insertCell();
      }
    }
    gameGrid.appendChild(table); // inject newly created <table> into the container <div>
  },

  fire(loc) {
    // Once a cell has been fired on, remove the click event listener
    document.getElementById(loc).removeEventListener('click', controller.guessToFire);
    // Increment the guesses property
    model.guesses++;
    // Update the DOM turn counter
    view.updateStats();

    // Check the ships array in the model
    for (let i = 0, s = this.ships; i < s.length; i++) {
      const ship = s[i];
      // If current location (loc) matches a ship position
      const locIndex = ship.positions.indexOf(loc);
      if (locIndex >= 0) {
        // We mark the ship with a hit
        ship.hits[locIndex] = 'hit';
        // and update the DOM with the displayHit() view method
        view.displayHit(loc);
        new Audio(model.soundEffects.genRandEffect('hit')).play();

        if (this.isSunk(ship)) {
          this.shipsSunk++;
          new Audio(model.soundEffects.genRandEffect('sunk')).play();

          if (this.shipsSunk === this.numShips) {
            // * * * * * * * * *
            // * ...if so, then it's a VICTORY
            // * * * * * * * * *
            // Remove click event listener from remaining <td>
            controller.prohibitGuess();
            // Update the view with a victory message
            view.displayVictory(`<strong>You won!</strong><br>Enemy fleet destroyed<br>Shooting accuracy: <strong>${controller.playerAccuracy()}%</strong>`);
          }
        }
        return true;
      }
    }
    // If guess is a miss, play a cannon sound only
    new Audio(model.soundEffects.genRandEffect('cannon')).play();
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
    let col;

    if (randomDirection) {
      row = Math.floor(Math.random() * this.rows);
      col = Math.floor(Math.random() * (this.columns - (this.shipLength + 1)));
    } else {
      row = Math.floor(Math.random() * (this.rows - (this.shipLength + 1)));
      col = Math.floor(Math.random() * this.columns);
    }

    const newShipLocations = [];
    for (let i = 0; i < this.shipLength; i++) {
      if (randomDirection) {
        newShipLocations.push(`${row}${col + i}`);
      } else {
        newShipLocations.push(`${row + i }${col}`);
      }
    }
    return newShipLocations;
  },

  collision(locations) {
    for (let i = 0; i < this.numShips; i++) {
      const ship = this.ships[i];
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

  blankSlate() {
    this.shipsSunk = 0;
    this.guesses = 0;
    this.ships.forEach(x => x.hits = []);
  },
};

// * ####################################
// * View
// * ####################################
const view = {
  displayVictory(msg) {
    document.getElementById('victory-msg').innerHTML = msg; // ! Display method's argument as victory message (possible spaghetti code here)
    document.getElementById('victory-msg').classList.remove('hidden'); // remove "hidden" class from html recipient

    document.querySelector('body').classList.add('victoryBody'); // Change page background to clear blue

    // Set Start Game button value to "New Game" with pulsating animation
    const startBtn = document.getElementById('start-game-btn');
    startBtn.value = 'NEW GAME?';
    startBtn.classList.add('pulsate-fwd');

    // Bring back USER INPUT area to full opacity...
    const gridSizeInput = document.getElementById('set-grid-size');
    // ... and to display: block
    gridSizeInput.classList.remove('no-opacity', 'hidden');
  },

  displayHit(loc) {
    document.getElementById(loc).setAttribute('class', 'hit');
  },

  displayMiss(loc) {
    document.getElementById(loc).setAttribute('class', 'miss');
  },

  makeHeaderClasses() {
    // helper alphabet array for cols naming
    const alphabet = [...Array(26).keys()].map(i => String.fromCharCode(i + 97));
    const columns = document.querySelectorAll('td');
    const rows = document.querySelectorAll('tr');

    for (let i = 0; i < model.rows; i++) {
      const rowHeader = document.createElement('div'); // create <div> container for ROW headers
      const rowHeaderContent = document.createTextNode(i + 1); // fill header with row number +1
      rowHeader.appendChild(rowHeaderContent); //
      rowHeader.classList.add('header_row');
      rows[i].firstElementChild.appendChild(rowHeader);
    }

    for (let i = 0; i < model.columns; i++) {
      const colHeader = document.createElement('div'); // create <div> container for COL headers
      // insert alphabetic letter as column title
      const colTitle = document.createTextNode(alphabet[i].toLocaleUpperCase());
      colHeader.appendChild(colTitle);
      colHeader.classList.add('header_column'); // add headers CSS class
      columns[i].appendChild(colHeader);
    }
  },

  // Populate existing <td> cells with unique number IDs
  makeIDs() {
    document.querySelector('body').classList.remove('victoryBody'); // remove .victory blue layer, if any
    const rows = document.getElementsByClassName('header_row');
    const columns = document.getElementsByClassName('header_column');
    const cells = document.querySelectorAll('td');
    const board = [];
    for (let i = 0; i < rows.length; i++) { // Generate IDs from rows and columns length
      for (let j = 0; j < columns.length; j++) {
        board.push(`${i}${j}`);
      }
    }
    cells.forEach((e, index) => { // Tag each cell with a board ID
      e.setAttribute('id', board[index]);
    });
  },

  // Display live game stats
  liveStats() {
    // 0. Remove existing victory message, if any
    document.getElementById('victory-msg').innerHTML = '';

    // 1. Hide the grid size input area...
    const gridSizeInput = document.getElementById('set-grid-size');
    // ... with opacity ...
    gridSizeInput.classList.add('no-opacity');
    // ... and removing it from the DOM entirely with a setTimeout delay.
    setTimeout(() => {
      gridSizeInput.classList.add('hidden');
    }, 1000);

    // 2. Show the liveStats div containing game information
    const liveStats = document.getElementById('live-stats');
    liveStats.classList.remove('hidden'); // brings back in the DOM
    liveStats.classList.add('full-opacity'); // sets opacity to 1

    // Set the turn (guesses) counter to zero
    this.updateStats();
  },

  updateStats() {
    document.getElementById('turn').innerText = model.guesses;
  },
};

// * ####################################
// * Controller
// * ####################################
const controller = {
  processGuess() {
    // Add to each <td> a click event listener that runs the guessToFire() method
    document.querySelectorAll('td').forEach(x => x.addEventListener('click', this.guessToFire));
  },

  prohibitGuess() {
    // Remove from all <td> the click event listener that runs the guessToFire() method
    document.querySelectorAll('td').forEach(x => x.removeEventListener('click', this.guessToFire));
  },

  guessToFire(y) {
    // This proxy method allows us to remove the click event listener once a <td> has been clicked
    model.fire(y.target.id);
  },

  startGame() {
    // Hook the START button with a click event listener that runs init()
    document.getElementById('start-game-btn').addEventListener('click', init);
  },

  gridSize() {
    model.rows = document.getElementById('num_rows').value; // update model with number of rows from user input
    model.columns = document.getElementById('num_cols').value; // update model with number of columns from user input
  },

  playerAccuracy() {
    // number of ships multiplied by their length is the ideal num. of guesses
    const idealGuesses = model.numShips * model.shipLength;
    // return a shooting accuracy percentage without decimals
    return ((idealGuesses / model.guesses) * 100).toFixed();
  },
};

// * ####################################
// * Starting all game methods onload
// * ####################################
function init() {
  model.blankSlate(); // reset model tracking properties to zero
  view.liveStats(); // Hide user input area and Show live game stats

  controller.gridSize(); // set grid size to default or according to user input
  controller.startGame(); // hook START GAME btn with click listener
  model.createGrid();
  model.generateShipLocations();
  view.makeHeaderClasses();
  view.makeIDs();
  controller.processGuess();
  // ! Cheat code: Reveal ships positions in the console
  model.ships.forEach(x => console.log(x.positions));
}

window.onload = controller.startGame();
