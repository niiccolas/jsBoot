// Populate <td>'s IDs
function makeIDs() {
  const rows = document.getElementsByClassName('header_row');
  const columns = document.getElementsByClassName('header_column');
  const cells = document.querySelectorAll('td');
  // Generate IDs from rows and columns length
  const board = [];
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < columns.length; j++) {
      board.push((i + "") + (j))
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
  displayHit(coord) {
    document.getElementById(coord).setAttribute('class', 'hit');
  },
  displayMiss(coord) {
    document.getElementById(coord).setAttribute('class', 'miss');
  },
};
