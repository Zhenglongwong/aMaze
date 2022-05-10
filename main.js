import './style.css'
import $ from 'jquery'


const $app = $('#app');

const state = {
  draw: false,
  move: false,
  selectStart: false,
  selectEnd: false,
  direction: "ArrowUp",
  player_loc_x: 20,
  player_loc_y: 20,
}

const createboxes = () => {
  for (let i = 1; i <= 20; i++) {
    for (let j = 1; j <= 20; j++) {
      $app.append($("<div>").attr('x',`${j}`).attr('y',`${i}`).addClass('box'))
    }
  }
}

createboxes()

const drawMaze = (event) => {
  if (state.draw) {
    $(event.target).addClass('selected')
  }
}

const toggleDraw = () => {
  state.draw = !state.draw;

}

const toggleMove = (e) => { 
  e.stopPropagation()
  state.move = !state.move
}

setInterval(() => {
  const movePlayer = () => {
    $('.player').removeClass('player')
    $(`[x=${state.player_loc_x}][y=${state.player_loc_y}]`).addClass('player')
    if ($(`[x=${state.player_loc_x}][y=${state.player_loc_y}]`).attr('class').includes('end')) {
      alert('You win!')
    }
  }

  const validPath = (x, y) => {
    return($(`[x=${x}][y=${y}]`).attr('class').includes('selected'))
  }

  if (state.move) {
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
    }
  } 
}, 300);

const changeDirection = (event) => {
  event.preventDefault()
  state.direction = event.key
} 

const createStart = (event) => {
  if (state.selectStart) {
    $('.player').removeclass('player')
    $(event.target).addClass('player')
  }  
}

const createEnd = (event) => {
  if (state.selectEnd && $(event.target).attr('class').includes('selected')) {
    $('.end').removeClass('end')
    $(event.target).addClass('end')
    
  }
}

const toggleStart = () => {
  state.draw = false
  state.selectEnd = false
  state.selectStart = false
}

const toggleEnd = () => {
  state.draw = false;
  state.selectEnd = !state.selectEnd;
}
window.addEventListener('keydown', changeDirection)

$('.box').on('mouseover', drawMaze).on('click', createEnd).on('click', createStart)
$('#draw').on('click', toggleDraw)
$("[x='20'][y='20']").addClass('player')
$('#start').on('click', toggleMove)
$('#selectEnd').on('click', toggleEnd)
$('#selectStart').on('click', toggleStart)