const $messageArea = document.getElementById('messageArea')
const $form = document.getElementById('form')
const $guessInput = document.getElementById('guessInput')
const $fireButton = document.getElementById('fireButton')

// view object is used to update and render the display
const view = {
  displayMessage: function (msg) {
    $messageArea.innerHTML = msg
  },
  displayHit: function (location) {
    let $cell = document.getElementById(location)
    $cell.setAttribute('class', 'hit')
  },
  displayMiss: function (location) {
    let $cell = document.getElementById(location)
    $cell.setAttribute('class', 'miss')
  },
}

// Model object is used to hold the state of the app (number of ships, size of the board, how many ships have been sunk, and a few others...)
const model = {
  boardSize: 7,
  numShips: 3,
  // the number of locations in each ship:
  shipLength: 3,
  shipsSunk: 0,
  ships: [
    // { locations: ['06', '16', '26'], hits: ['', '', ''] },
    // { locations: ['24', '34', '44'], hits: ['', '', ''] },
    // { locations: ['10', '11', '12'], hits: ['', '', ''] },
  ],
  // fire method takes an argument as string, ie: '13', '25' etc..
  fire: function (guess) {
    for (let i = 0; i < this.numShips; i++) {
      let ship = this.ships[i]
      //* let locations = ship.locations;
      //* let index = locations.indexOf(guess);
      // check to see if the guess is in the actual ship's locations array:
      let index = ship.locations.indexOf(guess)
      if (index >= 0) {
        // We have a HIT!!!
        ship.hits[index] = 'hit'
        view.displayHit(guess)
        view.displayMessage('HIT!')
        // console.log(ship.hits);
        //  if there's a hit, then increase the number of ships sunk
        if (this.isSunk(ship)) {
          view.displayMessage('You sank my battleship!!')
          this.shipsSunk++
        }
        return true
      }
      console.log(ship) // this never happens if we got a hit on the first ship.
    }
    view.displayMiss(guess)
    view.displayMessage('You missed.')

    return false
  },
  isSunk: function (ship) {
    for (let i = 0; i < this.shipLength; i++) {
      // if there's a location that doesn't have a hit, then the ship is still floating, so return false
      if (ship.hits[i] !== 'hit') return false
    }
    return true
  },
}

// parseGuess receives the string in the form 'A0', 'B1', etc. and it gives back '00', '11' etc. or null or an error saying to introduce valid input
function parseGuess(guess) {
  const boardRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

  // check for validity accepting a non null string and a string that has exactly two characters in it
  if (guess === null || guess.length !== 2) {
    alert('Oops, please enter a letter and a number on the board.')
  } else {
    let row = boardRows.indexOf(guess.charAt(0))
    let column = guess.charAt(1)
    if (isNaN(row) || isNaN(column)) {
      alert("Oops, that isn't on the board.")
    } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
      alert("Oops, that's off the board.")
    } else return `${row}${column}`
  }
  return null
}

// controller object is in charge of getting the player's guess and passing it to the model object
const controller = {
  guesses: 0,
  processGuess: function (guess) {
    // takes a guess in the form of 'A0', 'F5' etc...

    // this line doesn't let the user enter more guesses when he/she already have sunk all the battleships
    if (model.shipsSunk === model.numShips) return

    let location = parseGuess(guess)

    if (location) {
      // either the user hits a battleship or not (true/false):
      let hit = model.fire(location)
      this.guesses++
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage(`You sank all the battle ships, in ${this.guesses} guesses`)
      }
    }
  },
}

function handleFireButton() {
  // get the player's guess from the form
  let userGuess = $guessInput.value

  // and get it to the controller
  controller.processGuess(userGuess)

  // reset the input:
  $guessInput.value = ''
}

// function handleKeyPress(e) {
//   if (e.key === 'Enter') {
//     e.preventDefault()
//     // console.log('enter pressed')
//     // $fireButton.click()

//     let userGuess = $guessInput.value
//     // and get it to the controller
//     controller.processGuess(userGuess)

//     // reset the input:
//     $guessInput.value = ''
//     // return false
//   }
// }
function handleKeyPress(e) {
  if (e.key === 'Enter') {
    e.preventDefault()
    console.log('enter pressed')
    $fireButton.click()

    // let userGuess = $guessInput.value
    // and get it to the controller
    // controller.processGuess(userGuess)

    // reset the input:
    // $guessInput.value = ''
    // return false
  }
}

// TODO: test to see if the new ship's location collide with any existing ship's location
function scrambleShips() {
  // * create an array of column an row locations based on model.boardSize
  const boardLocations = [] // ['0','1','2','3','4','5','6']
  for (let i = 0; i < model.boardSize; i++) {
    boardLocations.push(i)
  }
  // loop for the number of ships we want to create
  for (let s = 0; s < model.numShips; s++) {
    model.ships[s] = { locations: [], hits: [] }
    const direction = ['vertical', 'horizontal']
    const randomDirection = direction[Math.floor(Math.random() * direction.length)]

    let location = ''
    const rows = [] // for vertical direction
    const columns = [] // for horizontal direction

    // loop for the number of ship locations (model.shipLength)
    if (randomDirection === 'horizontal') {
      let row = boardLocations[Math.floor(Math.random() * boardLocations.length)]
      model.ships[s].direction = 'horizontal'
      for (let l = 0; l < model.shipLength; l++) {
        // set the column
        //* if there's a previous value for column, set the actual as the previous + 1
        if (columns[l - 1]) {
          columns[l] = columns[l - 1] + 1
        } else {
          columns[l] =
            boardLocations[Math.floor(Math.random() * (boardLocations.length - model.shipLength))]
        }
        location += String(row)
        location += String(columns[l])

        model.ships[s].locations.push(location)
        model.ships[s].hits.push('')
        location = ''
      }
    } else if (randomDirection === 'vertical') {
      // let location = ''
      let column = boardLocations[Math.floor(Math.random() * boardLocations.length)]
      model.ships[s].direction = 'vertical'

      for (let l = 0; l < model.shipLength; l++) {
        // set the column
        //* if there's a previous value for column, set the actual as the previous + 1
        if (rows[l - 1]) {
          rows[l] = rows[l - 1] + 1
        } else {
          rows[l] =
            boardLocations[Math.floor(Math.random() * (boardLocations.length - model.shipLength))]
        }
        location += String(rows[l])
        location += String(column)

        model.ships[s].locations.push(location)
        model.ships[s].hits.push('')
        location = ''
      }
    }
    console.log(randomDirection)
  }
}

// function handleFormSubmit(e) {
//   e.preventDefault()
//   $fireButton.click()
//   return false
// }

$fireButton.addEventListener('click', handleFireButton)
$guessInput.addEventListener('keypress', handleKeyPress)
document.addEventListener('DOMContentLoaded', scrambleShips)
// $form.addEventListener('keypress', handleKeyPress)
// $form.addEventListener('submit', handleFormSubmit)
// view.displayMiss('00');
// view.displayHit('34');
// view.displayMiss('55');
// view.displayHit('12');
// view.displayMiss('25');
// view.displayHit('26');

// view.displayMessage('hello? jijiji');

// model.fire('34')
// model.fire('53')
// model.fire('06')
// model.fire('25')
// model.fire('16')
// model.fire('26')
// model.fire('44')
// model.fire('64')
// model.fire('54')
// model.fire('24')

// let num = Number.isNaN('*')
// let num1 = Number('*')
// console.log(num, num1)

// console.log(parseGuess('A0'))
// console.log(parseGuess('B6'))
// console.log(parseGuess('G3'))
// console.log(parseGuess('H0'))
// console.log(parseGuess('A7'))
// console.log(parseGuess('A56'))
// console.log(parseGuess())
// console.log(parseGuess('a3'))

// controller.processGuess('A0')
// controller.processGuess('A6')
// controller.processGuess('B6')
// controller.processGuess('C6')

// controller.processGuess('C4')
// controller.processGuess('D4')
// controller.processGuess('E4')

// controller.processGuess('B0')
// controller.processGuess('B1')
// controller.processGuess('B2') // LINE 150
// controller.processGuess('A3')
// controller.processGuess('G3')

console.dir(model)
console.table(model)
