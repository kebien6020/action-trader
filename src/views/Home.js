import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import { urlBase64ToUint8Array, fetchJson } from '../utils'

const SUBSCRIBE_PUBLIC_KEY = process.env.REACT_APP_SUBSCRIBE_PUBLIC_KEY

class Home extends Component {
  static isPrivate = true

  state = {
    notificationMessage: '',
    subscribed: false,
    disableNotifications: false,
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

    this.updateSubscribeButton()
  }

  handleLogout = () => {
    this.props.auth.logout()
    this.props.history.push('/')
  }

  updateSubscribeButton = async () => {
    const {isSubscribed} =
      await fetchJson('/subscriptions/isSubscribed', this.props.auth)

    const permission = await Notification.requestPermission()
    if (permission !== 'granted')
      this.setState({disableNotifications: true})

    this.setState({subscribed: isSubscribed})
  }

  setupPush = async () => {
    // TODO: Allow to unregister from push
    const registration = this.props.sw
    // Ask permission to show notifications
    // UX will be handled on the Home view
    const permission = await Notification.requestPermission()
    if (permission !== 'granted')
      return this.setState({disableNotifications: true})

    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(SUBSCRIBE_PUBLIC_KEY)
    };

    const pushSubscription =
      await registration.pushManager.subscribe(subscribeOptions)

    await fetchJson('/subscriptions/register', this.props.auth, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription: JSON.stringify(pushSubscription)
      })
    })

    this.updateSubscribeButton()
  }

  render () {
    const buttonText = this.state.disableNotifications ?
      'Notificaciones no permitidas' :
      (this.state.subscribed ?
        'Dejar de recibir notificaciones' :
        'Registrarse para recibir notificaciones')
    return (
      <div>
        <h1>Action Trader</h1>
        <main>
          <p>Eventos recientes o algo asi iria aqui</p>
          <RaisedButton
            label='Cerrar sesión'
            primary={true}
            onClick={this.handleLogout}
          />
          <br />
          <RaisedButton
            label={buttonText}
            disabled={this.state.disableNotifications}
            primary={true}
            onClick={this.setupPush}
          />
        </main>
      </div>
    )
  }
}

export default Home
