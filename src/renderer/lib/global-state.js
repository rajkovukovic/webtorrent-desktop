const { createStore } = require('react-hooks-global-state')

let autoId = 1

function transformLogMessage(item) {
  if (typeof item === 'object' && item !== null) {
    try {
      return {
        id: autoId++,
        message: JSON.stringify(item, null, 2),
        timestamp: new Date()
      }
    } catch (e) {
      return {
        id: autoId++,
        message: 'Object{...}',
        timestamp: new Date()
      }
    }
  }
  return {
    id: autoId++,
    message: String(item),
    timestamp: new Date()
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'log-message':
      return { ...state, logs: [...state.logs, ...action.payload.map(transformLogMessage)] }
    case 'set-users':
      return { ...state, users: action.payload }
    case 'toggle-logs':
      return { ...state, logsVisible: !state.logsVisible }
    default:
      return state
  }
}

const initialState = {
  logsVisible: false,
  users: [],
  logs: [{ id: 'test', message: 'Started', timestamp: new Date() }]
}
const { dispatch, useGlobalState } = createStore(reducer, initialState)

window.addEventListener('keypress', (e) => {
  if (e.key === 'L') {
    dispatch({ type: 'toggle-logs' })
  }
})

function logMessage(...items) {
  dispatch({
    type: 'log-message',
    payload: items
  })
}

function setUsers(users) {
  dispatch({
    type: 'set-users',
    payload: users
  })
}

exports.useGlobalState = useGlobalState
exports.logMessage = logMessage
exports.setUsers = setUsers
