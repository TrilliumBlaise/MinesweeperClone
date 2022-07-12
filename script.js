import { createTiles, getAllMines, setNumberOfMines } from './minesweeper.js'

const playArea = document.querySelector('.play-area')
const difficultyMenu = document.querySelector('.pick-difficulty')

const game = {
  board: [],
  mode: sessionStorage.getItem('mode') || 'easy',
  time: {
    hundreds: 0,
    tens: 0,
    ones: 0,
  },
  timerInterval: undefined,
}
document.querySelector('.difficulty').addEventListener('click', () => {
  difficultyMenu.classList.toggle('closed')
})
document
  .querySelector('.pick-difficulty')
  .querySelectorAll('button')
  .forEach(button => {
    button.addEventListener('click', e => {
      difficultyMenu.classList.add('closed')
      const target = e.target.closest('button')
      changeDifficult(target)
    })
  })
playArea.addEventListener('click', () => {
  if (game.timerInterval == undefined) game.timerInterval = setInterval(startTimer, 1000)
  displayMinesLeft(game.board)
  checkWin()
})
document.querySelector('.reset').addEventListener('click', e => {
  if (game.timerInterval != undefined) {
    clearInterval(game.timerInterval)
    game.timerInterval = undefined
  }
  e.target.style.backgroundImage = `url('./images/smile.svg')`
  game.time = { hundreds: 0, tens: 0, ones: 0 }
  displayTime()
  setUpPlayArea()
})
function startTimer() {
  game.time.ones++
  if (game.time.ones > 9) {
    game.time.ones = 0
    game.time.tens++
  }
  if (game.time.tens > 9) {
    game.time.tens = 0
    game.time.hundreds++
  }
  displayTime()
}

function displayTime() {
  const timer = document.querySelector('.timer')
  timer.children[0].textContent = game.time.hundreds
  timer.children[1].textContent = game.time.tens
  timer.children[2].textContent = game.time.ones
}
function setUpPlayArea() {
  playArea.innerHTML = ''
  playArea.style.pointerEvents = 'all'
  playArea.classList.add(game.mode)
  game.board = createTiles(game.mode)
  game.board.forEach(row => {
    row.forEach(tile => {
      playArea.append(tile.element)
    })
  })
  displayMinesLeft(game.board)
}

function displayMinesLeft(board) {
  const minesLeftElement = document.querySelector('.mines-left')
  const numberOfMines = setNumberOfMines(game.mode) - board.flat().filter(tile => tile.element.classList.contains('is-mine')).length
  const [tens, ones] = numberOfMines.toString().split('')
  minesLeftElement.children[0].textContent = ones != undefined ? tens : 0
  minesLeftElement.children[1].textContent = ones != undefined ? ones : tens
}
function changeDifficult(target) {
  playArea.classList.remove(playArea.classList[1])
  game.mode = target.classList
  sessionStorage.setItem('mode', game.mode)
  setUpPlayArea()
}

function checkWin() {
  const board = [...playArea.querySelectorAll('.box')]
  const mines = getAllMines(game.board)
  if (board.filter(tile => tile.textContent === 'X').length === 1) {
    clearInterval(game.timerInterval)
    game.timerInterval = undefined
    document.querySelector('.reset').style.backgroundImage = `url('./images/dead.svg')`
    playArea.style.pointerEvents = 'none'
  }
  if (mines.filter(mine => mine.element.classList.contains('is-mine')).length === mines.length) {
    console.log('hello')
    playArea.style.pointerEvents = 'none'
    const congratsMessage = document.createElement('div')
    congratsMessage.classList.add('congrats')
    congratsMessage.innerHTML = `Congratulations!<br>You win!`
    playArea.append(congratsMessage)
    clearInterval(game.timerInterval)
    game.timerInterval = undefined
    startConfetti()
  }
}

setUpPlayArea()
