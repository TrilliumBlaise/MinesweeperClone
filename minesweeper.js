const game = {
  gridSize: {
    easy: [9, 9],
    medium: [16, 16],
    hard: [16, 30],
  },
  minesAvailable: {
    easy: 10,
    medium: 40,
    hard: 99,
  },
}
export function createTiles(mode) {
  const [numberRows, numberColumns] = game.gridSize[mode]

  const tiles = []
  for (let x = 0; x < numberRows; x++) {
    const row = []
    for (let y = 0; y < numberColumns; y++) {
      const tile = {
        x,
        y,
        mine: false,
        status: 'closed',
        element: createBox(x, y, tiles),
      }
      row.push(tile)
    }
    tiles.push(row)
  }
  setMines(mode, tiles)
  //   testDistribution(tiles)
  return tiles
}
export function getAllMines(board) {
  return board.flat().filter(t => t.mine)
}
export function setNumberOfMines(mode) {
  return game.minesAvailable[mode]
}

function setMines(mode, tiles) {
  const mines = []

  while (mines.length < game.minesAvailable[mode]) {
    const x = Math.floor(Math.random() * tiles.length)
    const y = Math.floor(Math.random() * tiles[0].length)

    if (!mines.some(mine => mine[0] === x && mine[1] === y)) mines.push([x, y])
  }
  mines.forEach(mine => {
    tiles[mine[0]][mine[1]].mine = true
  })
}
function createBox(x, y, board) {
  const tileElement = document.createElement('div')
  tileElement.classList.add('box')
  tileElement.setAttribute('data-index', `${x},${y}`)
  tileElement.addEventListener('click', e => {
    if (e.shiftKey) {
      e.target.classList.toggle('is-mine')
      return
    }
    const tile = board[x][y]
    if (isBomb(tile, board)) {
      const mines = getAllMines(board)
      mines.forEach(mine => mine.element.classList.add('mine', 'open-box'))
      tile.element.setAttribute('data-value', 'X')
      tile.element.textContent = 'X'
    } else {
      revealTile(board, tile)
    }
  })

  return tileElement
}

function isBomb({ x, y }, board) {
  if (board[x][y].mine === true) return true
  return false
}

function revealTile(board, tile) {
  if (tile.status === 'open') return
  if (tile.mine === true) return
  tile.status = 'open'
  const adjacentTiles = nearbyTiles(board, tile)
  const mines = adjacentTiles.filter(t => t.mine)
  if (mines.length === 0) {
    adjacentTiles.forEach(revealTile.bind(null, board))
    adjacentTiles.forEach(tile => {
      tile.element.classList.add('open-box')
    })
  } else {
    tile.element.textContent = mines.length
    tile.element.dataset.value = mines.length
    tile.element.classList.add('open-box')
  }
}

function nearbyTiles(board, { x, y }) {
  const tiles = []

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = board[x + xOffset]?.[y + yOffset]
      if (tile) tiles.push(tile)
    }
  }
  return tiles
}

function testDistribution(tiles) {
  tiles.flat().forEach(tile => {
    if (tile.mine === true) tile.element.textContent = 'T'
  })
}
