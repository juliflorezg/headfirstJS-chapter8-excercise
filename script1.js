const $messageArea = document.getElementById('messageArea');

// view object is used to update and render the display
const view = {
  displayMessage: function (msg) {
    $messageArea.innerHTML = msg;
  },
  displayHit: function (location) {
    let $cell = document.getElementById(location);
    $cell.setAttribute('class', 'hit');
  },
  displayMiss: function (location) {
    let $cell = document.getElementById(location);
    $cell.setAttribute('class', 'miss');
  },
};

// Model object is used to hold the state of the app (number of ships, size of the board, how many ships have been sunk, and a few others...)
const model = {
  boardSize: 7,
  numShips: 3,
  // the number of locations in each ship:
  shipLength: 3,
  shipsSunk: 0,
  ships: [
    { locations: ['06', '16', '26'], hits: ['', '', ''] },
    { locations: ['24', '34', '44'], hits: ['', '', ''] },
    { locations: ['10', '11', '12'], hits: ['', '', ''] },
  ],
  // fire method takes an argument as string, ie: '13', '25' etc..
  fire: function (guess) {
    for (let i = 0; i < this.numShips; i++) {
      let ship = this.ships[i];
      //* let locations = ship.locations;
      //* let index = locations.indexOf(guess);
      // check to see if the guess is in the actual ship's locations array:
      let index = ship.locations.indexOf(guess);
      if (index >= 0) {
        // We have a HIT!!!
        ship.hits[index] = 'hit';
        view.displayHit(guess);
        view.displayMessage('HIT!');
        // console.log(ship.hits);
        //  if there's a hit, then increase the number of ships sunk
        if (this.isSunk(ship)) {
          view.displayMessage('You sank my battleship!!');
          this.shipsSunk++;
        }
        return true;
      }
      console.log(ship); // this never happens if we got a hit on the first ship.
    }
    view.displayMiss(guess);
    view.displayMessage('You missed.');

    return false;
  },
  isSunk: function (ship) {
    for (var i = 0; i < this.shipLength; i++) {
      // if there's a location that doesn't have a hit, then the ship is still floating, so return false
      if (ship.hits[i] !== 'hit') return false;
    }
    return true;
  },
};

// view.displayMiss('00');
// view.displayHit('34');
// view.displayMiss('55');
// view.displayHit('12');
// view.displayMiss('25');
// view.displayHit('26');

// view.displayMessage('hello? jijiji');

model.fire('34');
model.fire('53');
model.fire('06');
model.fire('25');
model.fire('16');
model.fire('26');
model.fire('44');
model.fire('64');
model.fire('54');
model.fire('24');
