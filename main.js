import './style.css'
import maze1 from './maze1'
import maze2 from './maze2'
import $ from 'jquery'

const $app = $('#app');

//initial setup

const baseState = {
  draw: false,
  move: false,
  selectStart: false,
  selectEnd: false,
  delete: false,
  totalEnds: 0,
  currentEnds: 0,
  direction: "",
  player_loc_x: 0,
  player_loc_y: 0,
  started: false,
  time: 0,
  currentMap: ""
}

let state = { ...baseState }

const createBoxes = () => {
  for (let i = 1; i <= 30; i++) {
    for (let j = 1; j <= 30; j++) {
      $app.append($("<div>").attr('x',`${j}`).attr('y',`${i}`).addClass('box'))
    }
  }
}

createBoxes()

const unmask = () => {
  $('.box').addClass('mask')
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
    $(event.target).addClass('end')
  }
}

const updatePosition = () => {
  const endCheck = () => {
    if ($('.player').attr('class').includes('end')) {
      state.currentEnds += 1
      $('.player').removeClass('end')
      $('#obj').text(`Objectives: ${state.currentEnds}/${state.totalEnds}`)
      if (state.currentEnds === state.totalEnds) {
        $('#obj').text(`Objectives: ${state.currentEnds}/${state.totalEnds}`)
        alert(`You WIN! You took ${state.time} seconds!`)
        clearInterval(timerInterval)
        edit()
      } 
    }
  }
  
  const movePlayer = () => {
    $('.player').removeClass('player')
    $(`[x=${state.player_loc_x}][y=${state.player_loc_y}]`).addClass('player')
    unmask()
    endCheck()
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
let timerInterval;
const updateTimer = () => {
  $('#timer').text(`Time(s): ${state.time}`)
  state.time += 1
}


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
    state.totalEnds = $('.end').length
    $('#obj').text(`Objectives: 0/${state.totalEnds}`)
    timerInterval = setInterval(updateTimer, 1000)
  }
  if (state.move) {
    intervalID = setInterval(updatePosition, 200)
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
    case 'd':
      toggleDraw()
      break;
    case 'f':
      toggleDelete()
      break;
    case 'h':
      edit()
      break;
    case 'a':
      toggleStartPoint();
      break;
    case 's':
      toggleEnd();
      break;
    case ' ':
      event.preventDefault()
      toggleMovement()
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
  state = { ...baseState }
  clearInterval(intervalID)
  clearInterval(timerInterval)
  $('#timer').text(`Time(s): ${state.time}`)
  $('#obj').text(`Objectives: 0/${state.totalEnds}`)
  console.log(state)
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

const loadMap = (maze) => {
  reset()
  state.currentMap = maze
  $('#app').html(maze)
  state.player_loc_x = parseInt($('.player').attr('x'))
  state.player_loc_y = parseInt($('.player').attr('y'))
  runEventListeners()
  toggleMovement()
}

const edit = () => {
  if (state.started) {
    toggleMovement()
  }
  $('.mask').removeClass('mask')
  clearInterval(timerInterval)
}

//if arguments are supplied from local store, it will create buttons that load maps
//if no arguments are supplied, it will save the current map and add it to the local store
const saveMap = (name) => {
  if (name) { 
    var mapName = name
  } else {
    if ($('.player').length === 0 || $('.end').length === 0) {
      alert('Please select a start point and at least 1 objective.')
      return
    }
    var mapName = prompt('Please enter a name for your map.')
    if (localStorage.getItem(mapName) !== null) {
      localStorage.removeItem(mapName)
      $(`#${mapName}`).remove()
    }
    localStorage.setItem(mapName, $('#app').html())
  }
  
  $("#maze-btns").append($('<button>').text(mapName).addClass('maze-btn').attr('id', mapName))
  $(`#${mapName}`).on('click', () => { loadMap(localStorage.getItem(mapName))})
}

const deleteMaze = () => {
  let name = prompt('Enter the name of the maze you want to delete:')
  localStorage.removeItem(name)
  $(`#${name}`).remove()
}

const showInstructions = () => {
  $('#instructions-ctn').show();
}

const hideInstructions = () => {
  $('#instructions-ctn').hide();
}
hideInstructions()

runEventListeners()
$('#draw').on('click', toggleDraw)
$('#delete').on('click', toggleDelete)
$('#start').on('click', toggleMovement)
$('#selectEnd').on('click', toggleEnd)
$('#selectStart').on('click', toggleStartPoint)
$('#reset').on('click', reset)
$('#maze1').on('click', () => { loadMap(maze1) })
$('#maze2').on('click', () => { loadMap(maze2) })
$('#instructions').on('click', showInstructions)
$('#closeInstructions').on('click', hideInstructions)
$('#save').on('click', (event) => { saveMap() })
$('#deleteMaze').on('click', deleteMaze)
$('#edit').on('click', edit)

//load any existing maps in the database
// https://stackoverflow.com/questions/3138564/looping-through-localstorage-in-html5-and-javascript
Object.keys(localStorage).forEach((key) => {
  saveMap(key)
});



