const socket = require('socket.io-client')('http://46.240.139.209:80', {
  forceNew: true,
  multiplex: true,
  reconnection: true,
  timeout: 10000
})
const { logMessage, setUsers } = require('./lib/global-state.js')

let userMap = (window.userMap = new Map())

function renderUsers() {
  setUsers(
    Array.from(userMap.values())
      .map((user) => ({
        ...user,
        isMe: socket.id === user.id
      }))
      .sort((u1, u2) => u2.isMe - u1.isMe)
  )
}

socket.on('connect', function () {
  socket.emit('enterRoom', {
    roomName: 'sala 1'
  })
  // Logger.log('Connected')
  logMessage('Connected')
})

socket.on('disconnect', function () {
  userMap.clear()
  renderUsers()
  socket.connect()
  // Logger.log('Disconnected')
  logMessage('Disconnected')
})

socket.on('enterRoom', (user) => {
  userMap.set(user.id, user)
  renderUsers()
  console.log('enterRoom', user)
})

socket.on('leaveRoom', (user) => {
  console.log('leaveRoom', user)
  userMap.delete(user.id)
  renderUsers()
})

socket.on('users', (roomUsers) => {
  userMap = new Map(roomUsers.map((user) => [user.id, user]))
  renderUsers()
  console.log('\n\n\n', { users: roomUsers }, '\n\n\n')
})

socket.on('notifyRoom', ({ userId, message, data }) => {
  switch (message) {
    case 'newTorrent':
      userId !== socket.id && handlers.onTorrentAdded && handlers.onTorrentAdded(data)
      break
    case 'playing':
      userId !== socket.id && handlers.onPlaying && handlers.onPlaying(data)
      break
    case 'pausing':
      userId !== socket.id && handlers.onPausing && handlers.onPausing(data)
      break
    case 'seeking':
      userId !== socket.id && handlers.onPausing && handlers.onSeeking(data)
      break
    default:
      console.error(`Unknown "notifyRoom" message: "${message}"`)
  }
})

function newTorrentAdded(torrentData) {
  console.log('newTorrentAdded', torrentData)
  if (socket.connected) {
    socket.emit('notifyRoom', {
      userId: socket.id,
      message: 'newTorrent',
      data: torrentData
    })
  }
}

function handlePlaying(currentTime) {
  if (socket.connected) {
    console.log('handlePlaying', currentTime)
    socket.emit('notifyRoom', {
      userId: socket.id,
      message: 'playing',
      data: {
        currentTime
      }
    })
  }
}

function handlePausing(currentTime) {
  if (socket.connected) {
    console.log('handlePausing', currentTime)
    socket.emit('notifyRoom', {
      userId: socket.id,
      message: 'pausing',
      data: {
        currentTime
      }
    })
  }
}

function handleSeeking(data) {
  if (socket.connected) {
    console.log('handleSeeking', data)
    socket.emit('notifyRoom', {
      userId: socket.id,
      message: 'seeking',
      data
    })
  }
}

const handlers = {
  onTorrentAdded: null,
  onPlaying: null,
  onPausing: null,
  onSeeking: null
}

exports.socket = socket
exports.userMap = userMap
exports.handlers = handlers
exports.newTorrentAdded = newTorrentAdded
exports.handlePlaying = handlePlaying
exports.handlePausing = handlePausing
exports.handleSeeking = handleSeeking
