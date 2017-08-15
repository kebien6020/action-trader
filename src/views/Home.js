import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import { urlBase64ToUint8Array } from '../utils'

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

  setupPush = async () => {
    const registration = this.props.sw
    // Ask permission to show notifications
    // UX will be handled on the Home view
    await Notification.requestPermission()
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        'BMCb0WE419jMMMOfTM3br1BtAXlcXoNvzeCFe2HCi2GySApZ7GsK4yzxOKZb19mYvXSmFWXWvmC-Ymz4T_EfrPY'
      )
    };

    const pushSubscription =
      await registration.pushManager.subscribe(subscribeOptions)

    console.log(pushSubscription)
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
          <br />
          <RaisedButton
            label='Registrarse para recibir notificaciones'
            primary={true}
            onClick={this.setupPush}
          />
        </main>
      </div>
    )
  }
}

export default Home
