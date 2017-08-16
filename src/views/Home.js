import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import { urlBase64ToUint8Array, fetchJson } from '../utils'

const SUBSCRIBE_PUBLIC_KEY = process.env.REACT_APP_SUBSCRIBE_PUBLIC_KEY

class Home extends Component {
  static isPrivate = true

  state = {
    subscribedStatus: 'disabled' // subscribed, disabled, blocked or enabled
  }

  subscribed = null

  componentWillMount = async () => {
    if ('PushManager' in window) {
      this.setState({ subscribedStatus: 'enabled' })
    } else {
      this.setState({ subscribedStatus: 'disabled' })
    }

    if (await (this.isSubscribed()))
      this.setState({ subscribedStatus: 'subscribed' })
  }

  handleLogout = () => {
    this.props.auth.logout()
    this.props.history.push('/')
  }

  isSubscribed = async () => {
    if (this.subscribed !== null)
      return this.subscribed

    const {isSubscribed} =
      await fetchJson('/subscriptions/isSubscribed', this.props.auth)

    this.subscribed = isSubscribed
    return this.subscribed
  }

  toggleSubscribe = async () => {
    const wantToSubscribe = this.state.subscribedStatus !== 'subscribed'
    if (wantToSubscribe) {
      const registration = this.props.sw
      // Ask permission to show notifications
      const permission = await Notification.requestPermission()
      if (permission !== 'granted')
        return this.setState({subscribedStatus: 'blocked'})

      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(SUBSCRIBE_PUBLIC_KEY)
      }

      const pushSubscription =
        await registration.pushManager.subscribe(subscribeOptions)

      const { success } = await fetchJson('/subscriptions/register', this.props.auth, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: JSON.stringify(pushSubscription)
        })
      })

      if (success)
        this.setState({subscribedStatus: 'subscribed'})
    } else {
      // We want to unsubscribe
      const { success } = await fetchJson('/subscriptions/unregister', this.props.auth, {
        method: 'post',
      })
      if (success)
        this.setState({subscribedStatus: 'enabled'})
    }
  }

  testPush = () => {
    fetchJson('/testPush', this.props.auth).then(console.log)
  }

  render () {
    let buttonText = null
    let buttonDisabled = true

    switch (this.state.subscribedStatus) {
    case 'subscribed':
      buttonText = 'Dejar de recibir notificaciones'
      buttonDisabled = false
      break
    case 'disabled':
      buttonText = 'Navegador no soporta notificaciones'
      buttonDisabled = true
      break
    case 'blocked':
      buttonText = 'Notificaciones no permitidas'
      buttonDisabled = true
      break
    case 'enabled':
      buttonText = 'Activar notificaciones'
      buttonDisabled = false
      break
    default:
      console.log(this.state.subscribedStatus)
    }

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
          <br /><br />
          <RaisedButton
            label={buttonText}
            disabled={buttonDisabled}
            primary={true}
            onClick={this.toggleSubscribe}
          />
          <br /><br />
          <RaisedButton
            label='Probar push'
            primary={true}
            onClick={this.testPush}
          />
        </main>
      </div>
    )
  }
}

export default Home
