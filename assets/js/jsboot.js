// Helper function
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Battleship game logic
function jsBoot() {
  // DOM elements
  const main = document.querySelector('main');
  const results = document.querySelector('h2');

  // Random enemy ship location
  const location1 = randomNumber(0, 4);
  const location2 = location1 + 1;
  const location3 = location2 + 1;

  // ! DEBUG ONLY
  console.log(location1);
  console.log(location2);
  console.log(location3);

  // Variables to be updated by user input
  var isSunk = false;
  var hits = 0;
  var guesses = 0;
  var guess;

  // Remove previous player statistics from the DOM, if any
  if (results) {
    main.removeChild(results);
  }

  // Prompt for player input until enemy ship is sunk
  while (isSunk === false) {
    guess = prompt('Pick a number between 0 and 6');
    console.log(guess);

    if (guess < 0 || guess > 6 || guess == '') {
      alert('Numbers between 0 and 6 only!');
    } else {
      guesses++;

      if (guess == location1 || guess == location2 || guess == location3) {
        alert('Ship has been hit!');
        hits++;

        if (hits == 3) {
          isSunk = true;
        }
      } else {
        alert('MISS!');
      }
    }
  }

  // Compute player statistics
  const playerStats = `Enemy ship is sunk ✌🎖️ You took ${guesses} guesses to sink the battleship. Your shooting accuracy is ${Math.floor((3 / guesses) * 100)}%`;

  // Add player statistics to the DOM
  const result = document.createElement('p');
  const resultContent = document.createTextNode(playerStats);
  result.appendChild(resultContent);
  main.appendChild(result);
}
