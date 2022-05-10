import './style.css'
import $ from 'jquery'


const $app = $('#app');

//initial setup

const state = {
  draw: false,
  move: false,
  selectStart: false,
  selectEnd: false,
  direction: "",
  player_loc_x: 0,
  player_loc_y: 0,
}

const createboxes = () => {
  for (let i = 1; i <= 20; i++) {
    for (let j = 1; j <= 20; j++) {
      $app.append($("<div>").attr('x',`${j}`).attr('y',`${i}`).addClass('box'))
    }
  }
}

createboxes()

const mask = () => {
  $('.box').addClass('mask')
  $(`[x=${state.player_loc_x + 1}][y=${state.player_loc_y}]`).removeClass('mask')
  $(`[x=${state.player_loc_x - 1}][y=${state.player_loc_y}]`).removeClass('mask')
  $(`[x=${state.player_loc_x}][y=${state.player_loc_y + 1}]`).removeClass('mask')
  $(`[x=${state.player_loc_x}][y=${state.player_loc_y - 1}]`).removeClass('mask')
  $(`[x=${state.player_loc_x + 1}][y=${state.player_loc_y + 1}]`).removeClass('mask')
  $(`[x=${state.player_loc_x -1}][y=${state.player_loc_y + 1}]`).removeClass('mask')
  $(`[x=${state.player_loc_x + 1}][y=${state.player_loc_y - 1}]`).removeClass('mask')
  $(`[x=${state.player_loc_x - 1}][y=${state.player_loc_y - 1}]`).removeClass('mask')
}

//eventhandlers for the board that modify it for the game
const drawMaze = (event) => {
  if (state.draw) {
    $(event.target).addClass('selected')
  }
}

const createStart = (event) => {
  if (state.selectStart) {
    $('.player').removeClass('player')
    $(event.target).addClass('player')
    state.player_loc_x = parseInt($('.player').attr('x'))
    state.player_loc_y = parseInt($('.player').attr('y'))
  }  
}

const createEnd = (event) => {
  if (state.selectEnd && !$(event.target).attr('class').includes('selected')) {
    $('.end').removeClass('end')
    $(event.target).addClass('end')
  }
}

const updatePosition = () => {
  const movePlayer = () => {
    $('.player').removeClass('player')
    $(`[x=${state.player_loc_x}][y=${state.player_loc_y}]`).addClass('player')
    mask()
    if ($(`[x=${state.player_loc_x}][y=${state.player_loc_y}]`).attr('class').includes('end')) {
      alert('You win!')
    }
  }

  const validPath = (x, y) => {
    return(!$(`[x=${x}][y=${y}]`).attr('class').includes('selected'))
  }

  switch (state.direction) {
    case 'ArrowUp':
      let nextStateY = state.player_loc_y - 1
      if (validPath(state.player_loc_x, nextStateY)) { //refactor again later
        state.player_loc_y = nextStateY
        movePlayer()
      }
      break;
    case 'ArrowDown':
      let nextStateY2 = state.player_loc_y + 1
      if (validPath(state.player_loc_x, nextStateY2)) {
        state.player_loc_y = nextStateY2
        movePlayer()
      }
      break;
    case 'ArrowLeft':
      let nextStateX = state.player_loc_x - 1
      if (validPath(nextStateX, state.player_loc_y)) {
        state.player_loc_x = nextStateX
        movePlayer()
      }
      break;
    case 'ArrowRight':
      let nextStateX2 = state.player_loc_x + 1
      if (validPath(nextStateX2, state.player_loc_y)) {
        state.player_loc_x = nextStateX2
        movePlayer()
      }
      break;
    default:
      break;
  }
}
let intervalID;
const toggleMovement = () => {
  state.draw = false
  state.selectStart = false
  state.selectEnd = false
  state.move = !state.move
  mask()
  if (state.move) {
    intervalID = setInterval(updatePosition, 500)
  } else if (!state.move) {
    clearInterval(intervalID)
  }
}

const changeDirection = (event) => {
  event.preventDefault()
  state.direction = event.key
} 

window.addEventListener('keydown', changeDirection)

//toggles that change state for the various actions
//eventhandlers for buttons
const toggleDraw = () => {
  state.selectStart = false
  state.selectEnd = false
  state.draw = !state.draw;
}


const toggleStartPoint = () => {
  state.draw = false

  state.selectEnd = false
  state.selectStart = !state.selectStart
}

const toggleEnd = () => {
  state.draw = false;

  state.selectStart = false;
  state.selectEnd = !state.selectEnd;
}


$('.box').on('mouseover', drawMaze).on('click', createEnd).on('click', createStart)
$('#draw').on('click', toggleDraw)
$('#start').on('click', toggleMovement)
$('#selectEnd').on('click', toggleEnd)
$('#selectStart').on('click', toggleStartPoint)