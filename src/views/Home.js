import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'

class Home extends Component {
  static isPrivate = true

  state = {
    notificationMessage: ''
  }

  componentWillMount = async () => {
    if ('PushManager' in window) {
      this.setState({
        notificationMessage: 'Este navegador permite notificaciones.'
      })
    } else {
      this.setState({
        notificationMessage: 'Este navegador no permite notificaciones.'
      })
    }

    const notificationsEnabled =
      (await Notification.requestPermission()) === 'granted'
    const serviceWorkerEnabled = 'serviceWorker' in navigator

    if (notificationsEnabled && serviceWorkerEnabled) {
      this.setState({
        notificationMessage: 'Las notificaciones están activadas'
      })
    }
  }

  handleLogout = () => {
    this.props.auth.logout()
    this.props.history.push('/')
  }

  render () {
    return (
      <div>
        <h1>Action Trader</h1>
        <main>
          <p>Eventos recientes o algo asi iria aqui</p>
          <p>{this.state.notificationMessage}</p>
          <RaisedButton
            label='Cerrar sesión'
            primary={true}
            onClick={this.handleLogout}
          />
        </main>
      </div>
    )
  }
}

export default Home
