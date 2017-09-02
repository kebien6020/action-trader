import React, { Component } from 'react'

import { List, ListItem } from 'material-ui/List'
import Toggle from 'material-ui/Toggle'

import Layout from '../components/Layout'
import { urlBase64ToUint8Array, fetchJson } from '../utils'

const Status = {
  DISABLED: Symbol('DISABLED'),     // This browser does not support push
  BLOCKED: Symbol('BLOCKED'),       // The user disallowed showing notifications to him
  ENABLED: Symbol('ENABLED'),       // The browser has push but the user has not authorized yet
  SUBSCRIBED: Symbol('SUBSCRIBED'), // This browser is already subscribed for this user
}

const SUBSCRIBE_PUBLIC_KEY = process.env.REACT_APP_SUBSCRIBE_PUBLIC_KEY

class NotificationsConfig extends Component {
  static isPrivate = true

  state = {
    permissionStatus: Status.DISABLED
  }

  subscribed = null

  componentWillMount() {
    this.updatePermission()
  }

  updatePermission = async () => {
    if (!('PushManager' in window))
      // The browser does not support notifications
      return this.setState({permissionStatus: Status.DISABLED})

    if (window.Notification.permission === 'denied')
      // The user disallowed notifications
      return this.setState({permissionStatus: Status.BLOCKED})

    if (window.Notification.permission !== 'granted')
      // We haven't asked the user to allow notifications, therefore
      // trying to check if there is a subscription for this browser
      // will propmt the user. Notifications are at least supported
      // in the browser
      return this.setState({permissionStatus: Status.ENABLED})

    try {
      if (await this.isSubscribed())
        // Subscribed, yay
        return this.setState({permissionStatus: Status.SUBSCRIBED})
    } catch (err) {
      // TODO: Show an error dialog
    }
    // If we got here and haven't returned we know that at least
    // notifications are supported in the browser
    this.setState({permissionStatus: Status.ENABLED})
  }

  isSubscribed = async () => {
    // TODO: Check if the subscription is actually for this browser
    if (this.subscribed !== null)
      return this.subscribed

    const { isSubscribed } =
      await fetchJson('/subscriptions/isSubscribed', this.props.auth)

    this.subscribed = isSubscribed
    return this.subscribed
  }

  handleToggle = async (_, newToggledState) => {
    // Disable the toggle while work is done
    this.setState({permissionStatus: Status.DISABLED})

    const wantToSubscribe = newToggledState
    if (wantToSubscribe) {
      const registration = this.props.sw
      // Ask permission to show notifications
      const permission = await Notification.requestPermission()
      if (permission !== 'granted')
        return this.setState({permissionStatus: Status.BLOCKED})

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
        this.setState({permissionStatus: Status.SUBSCRIBED})
    } else {
      // We want to unsubscribe
      const { success } = await fetchJson('/subscriptions/unregister', this.props.auth, {
        method: 'post',
      })
      if (success)
        this.setState({permissionStatus: Status.ENABLED})
    }
  }

  testPush = () => {
    fetchJson('/testPush', this.props.auth)
  }

  render() {
    const toggled = this.state.permissionStatus === Status.SUBSCRIBED
    const disabled =
      this.state.permissionStatus === Status.DISABLED ||
      this.state.permissionStatus === Status.BLOCKED
    return (
      <Layout title='Notificaciones' goBackTo='/config'>
        <List>
          <ListItem
            primaryText='Activar notificaciones'
            rightToggle={
              <Toggle
                onToggle={this.handleToggle}
                toggled={toggled}
                disabled={disabled}
              />
            }
          />
          <ListItem
            primaryText='Probar notificaciones'
            secondaryText='Enviar una notificación de prueba'
            onClick={this.testPush}
          />
        </List>
      </Layout>
    )
  }
}

export default NotificationsConfig
