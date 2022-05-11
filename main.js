import './style.css'
import $ from 'jquery'


const $app = $('#app');

//initial setup
let state = {
  draw: false,
  move: false,
  selectStart: false,
  selectEnd: false,
  delete: false,
  direction: "",
  player_loc_x: 0,
  player_loc_y: 0,
  started: false
}

const createBoxes = () => {
  for (let i = 1; i <= 18; i++) {
    for (let j = 1; j <= 18; j++) {
      $app.append($("<div>").attr('x',`${j}`).attr('y',`${i}`).addClass('box'))
    }
  }
}

createBoxes()

const unmask = () => {
  $(`[x=${state.player_loc_x}][y=${state.player_loc_y}]`).removeClass('mask')
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

const deleteItems = (event) => {
  if (state.delete) {
    $(event.target).removeClass('selected player end')
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
    unmask()
    if ($(`[x=${state.player_loc_x}][y=${state.player_loc_y}]`).attr('class').includes('end')) {
      alert('You win!')
    }
  }

  const validPath = (x, y) => {
    try {
      return(!$(`[x=${x}][y=${y}]`).attr('class').includes('selected'))
    } catch (err) {}
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
  } unmask()
}
let intervalID;
const toggleMovement = () => {
  if ($('.player').length === 0 || $('.end').length === 0) {
    alert('Please select a start point and end point.')
    return
  }
  state.draw = false
  state.selectStart = false
  state.selectEnd = false
  state.move = !state.move
  if (!state.started) {
    $('.box').addClass('mask')
    state.started = true
  }
  if (state.move) {
    intervalID = setInterval(updatePosition, 300)
  } else if (!state.move) {
    clearInterval(intervalID)
  }
}

const handlePress = (event) => {
  switch (event.key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowLeft':
    case 'ArrowRight':
      event.preventDefault()
      state.direction = event.key
      break;
    case 'f':
      toggleDraw()
      break;
    case 'd':
      toggleDelete()
      break;
  }
} 

window.addEventListener('keydown', handlePress)

//toggles that change state for the various actions
//eventhandlers for buttons
const toggleDraw = () => {
  state.selectStart = false
  state.selectEnd = false
  state.delete = false
  state.draw = !state.draw;
  console.log(state.draw)
}


const toggleStartPoint = () => {
  state.draw = false
  state.delete = false
  state.selectEnd = false
  state.selectStart = !state.selectStart
}

const toggleEnd = () => {
  state.draw = false;
  state.delete = false
  state.selectStart = false;
  state.selectEnd = !state.selectEnd;
}

const reset = () => {
  $('.box').removeClass('selected player end mask')
  state = {
    draw: false,
    move: false,
    selectStart: false,
    selectEnd: false,
    delete: false,
    direction: "",
    player_loc_x: 0,
    player_loc_y: 0,
    started: false
  }
  clearInterval(intervalID)
}

const toggleDelete = () => {
  state.draw = false
  state.selectStart = false
  state.selectEnd = false
  state.delete = !state.delete
}

const runEventListeners = () => {
  $('.box').on('mouseover', drawMaze).on('click', createEnd).on('click', createStart).on('click', deleteItems)
}

const loadMap = (str) => {
  $('#app').empty()
  reset()
  $('#app').load(`${str}.html`, function () {
    state.player_loc_x = parseInt($('.player').attr('x'))
    state.player_loc_y = parseInt($('.player').attr('y'))
    toggleMovement()
    runEventListeners()
  })
}


runEventListeners()
$('#draw').on('click', toggleDraw)
$('#delete').on('click', toggleDelete)
$('#start').on('click', toggleMovement)
$('#selectEnd').on('click', toggleEnd)
$('#selectStart').on('click', toggleStartPoint)
$('#reset').on('click', reset)
$('#map1').on('click', () => { loadMap('map1') })