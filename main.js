import './style.css'
import maze1 from './maze1'
import maze2 from './maze2'
import $ from 'jquery'



//initial setup
const PLAYERCLASS = '.player';
const ENDCLASS = '.end';
const BOXCLASS = '.box';
const APPCLASS = '#app';
const PLAYER = 'player';
const MASK = 'mask';
const WALL = 'selected';
const OBJECTIVE = 'end';

const BASESTATE = {
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

let state = { ...BASESTATE }
let intervalID;
let timerInterval;

const createGrid = () => {
  for (let i = 1; i <= 30; i++) {
    for (let j = 1; j <= 30; j++) {
      $(APPCLASS).append($("<div>").attr('x',`${j}`).attr('y',`${i}`).addClass('box'))
    }
  }
}

const unmask = () => {
  $(BOXCLASS).addClass(MASK)
  $(`[x=${state.player_loc_x}][y=${state.player_loc_y}]`).removeClass(MASK)
  $(`[x=${state.player_loc_x + 1}][y=${state.player_loc_y}]`).removeClass(MASK)
  $(`[x=${state.player_loc_x - 1}][y=${state.player_loc_y}]`).removeClass(MASK)
  $(`[x=${state.player_loc_x}][y=${state.player_loc_y + 1}]`).removeClass(MASK)
  $(`[x=${state.player_loc_x}][y=${state.player_loc_y - 1}]`).removeClass(MASK)
  $(`[x=${state.player_loc_x + 1}][y=${state.player_loc_y + 1}]`).removeClass(MASK)
  $(`[x=${state.player_loc_x -1}][y=${state.player_loc_y + 1}]`).removeClass(MASK)
  $(`[x=${state.player_loc_x + 1}][y=${state.player_loc_y - 1}]`).removeClass(MASK)
  $(`[x=${state.player_loc_x - 1}][y=${state.player_loc_y - 1}]`).removeClass(MASK)
}

//eventhandlers for the board that modify it for the game
const drawMaze = (event) => {
  if (state.draw) {
    $(event.target).addClass(WALL)
  }
}

const deleteItems = (event) => {
  if (state.delete) {
    $(event.target).removeClass(`${PLAYER} ${OBJECTIVE} ${WALL}`)
  }
}

const createStart = (event) => {
  if (state.selectStart) {
    $(PLAYERCLASS).removeClass(PLAYER)
    $(event.target).addClass(PLAYER)
    state.player_loc_x = parseInt($(PLAYERCLASS).attr('x'))
    state.player_loc_y = parseInt($(PLAYERCLASS).attr('y'))
  }
}

const createEnd = (event) => {
  if (state.selectEnd && !$(event.target).attr('class').includes(WALL)) {
    $(event.target).addClass(OBJECTIVE)
  }
}

//depending on the current value of state.direction
//it wil move the player, update state.loc
//check if the game has ended
//should return the state at the end of each move
const updatePosition = () => {
  const endCheck = () => {
    if ($(PLAYERCLASS).attr('class').includes(OBJECTIVE)) {
      state.currentEnds += 1
      $(PLAYERCLASS).removeClass(OBJECTIVE)
      $('#obj').text(`Objectives: ${state.currentEnds}/${state.totalEnds}`)
      if (state.currentEnds === state.totalEnds) {
        clearInterval(timerInterval)
        alert(`You win! You took ${state.time} seconds!`)
      } 
    }
  }
  
  const movePlayer = () => {
    $(PLAYERCLASS).removeClass(PLAYER)
    $(`[x=${state.player_loc_x}][y=${state.player_loc_y}]`).addClass(PLAYER)
    unmask()
    endCheck()
  }

  const validPath = (x, y) => {
    try {
      return(!$(`[x=${x}][y=${y}]`).attr('class').includes(WALL))
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

const updateTimer = () => {
  $('#timer').text(`Time(s): ${state.time}`)
  state.time += 1
}

const toggleMovement = () => {
  if ($(PLAYERCLASS).length === 0 || $(ENDCLASS).length === 0) {
    alert('Please select a start point and end point.')
    return
  }
  state.draw = false
  state.selectStart = false
  state.selectEnd = false
  state.move = !state.move
  if (!state.started) {
    $(BOXCLASS).addClass(MASK)
    state.started = true
    state.totalEnds = $(ENDCLASS).length
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
    case 'g':
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

const toggleDelete = () => {
  state.draw = false
  state.selectStart = false
  state.selectEnd = false
  state.delete = !state.delete
}

const reset = () => {
  $(BOXCLASS).removeClass('selected player end mask')
  state = { ...BASESTATE }
  clearInterval(intervalID)
  clearInterval(timerInterval)
  $('#timer').text(`Time(s): ${state.time}`)
  $('#obj').text(`Objectives: 0/${state.totalEnds}`)
  console.log(state)
}

const runEventListeners = () => {
  $(BOXCLASS).on('mouseover', drawMaze).on('click', createEnd).on('click', createStart).on('click', deleteItems)
}

const loadMap = (maze) => {
  reset()
  state.currentMap = maze
  $(APPCLASS).html(maze)
  state.player_loc_x = parseInt($(PLAYERCLASS).attr('x'))
  state.player_loc_y = parseInt($(PLAYERCLASS).attr('y'))
  runEventListeners()
  toggleMovement()
}

const edit = () => {
  toggleMovement()
  clearInterval(timerInterval)
  $('.mask').removeClass(MASK)
}

//if arguments are supplied from local store, it will create buttons that load maps
//if no arguments are supplied, it will save the current map and add it to the local store
const saveMap = (name) => {
  if (name) { 
    var mapName = name
  } else {
    if ($(PLAYERCLASS).length === 0 || $(ENDCLASS).length === 0) {
      alert('Please select a start point and at least 1 objective.')
      return
    }
    var mapName = prompt('Please enter a name for your map.')
    if (localStorage.getItem(mapName) !== null) {
      localStorage.removeItem(mapName)
      $(`#${mapName}`).remove()
    }
    localStorage.setItem(mapName, $(APPCLASS).html())
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

//load any existing maps in the database
// https://stackoverflow.com/questions/3138564/looping-through-localstorage-in-html5-and-javascript
const loadExistingMazes = () => {
  Object.keys(localStorage).forEach((key) => {
    saveMap(key)
  });
}

const main = () => {
  createGrid()
  hideInstructions()
  loadExistingMazes()
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
  window.addEventListener('keydown', handlePress)
}

main()