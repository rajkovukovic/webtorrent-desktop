const React = require('react')
const { useGlobalState } = require('../lib/global-state.js')

const dateTimeFormat = new Intl.DateTimeFormat('rs-SR', {
  year: 'numeric',
  month: 'numeric',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
})

const LogMessages = (props) => {
  const [logsVisible] = useGlobalState('logsVisible')
  const [logs] = useGlobalState('logs')
  const [users] = useGlobalState('users')

  return logsVisible ? (
    <div id="logger-container" className="logger-container">
      <div className="log-messages">
        <h1>Ryco's Logs:</h1>
        {logs.map((log) => (
          <pre key={log.id}>
            <span className="log-timestamp">{dateTimeFormat.format(log.timestamp)}</span>
            {'\n'}
            {log.message}
          </pre>
        ))}
      </div>
      <div className="log-users">
        <h1>Users:</h1>
        {users.length > 0
          ? users.map((user) => (
              <p key={user.id} className={`log-user ${user.isMe ? 'me' : ''}`}>
                {user.id}: {JSON.stringify(user.ipAddress)}
              </p>
            ))
          : null}
      </div>
    </div>
  ) : null
}

module.exports = LogMessages
