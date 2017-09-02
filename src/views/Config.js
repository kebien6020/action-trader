import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { List, ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import NotificationIcon from 'material-ui/svg-icons/social/notifications'
import PoloniexIcon from '../icons/Poloniex'
import LogoutIcon from '../icons/Logout'

import Layout from '../components/Layout'
import theme from '../theme'

class Config extends Component {
  static isPrivate = true

  handleLogout = () => {
    this.props.auth.logout()
    this.props.history.push('/')
  }

  render() {
    return (
      <Layout title='Configuración'>
        <List>
          <Link to='/config/notifications'>
            <ListItem
              leftIcon={<NotificationIcon
                color={theme.palette.accent1Color}
              />}
              primaryText='Notificaciones'
            />
          </Link>
          <Divider />
          <Link to='/config/poloniex'>
            <ListItem
              leftIcon={<PoloniexIcon
                color={theme.palette.accent1Color}
              />}
              primaryText='Poloniex'
            />
          </Link>
          <Divider />
          <ListItem
            leftIcon={<LogoutIcon
              color={theme.palette.accent1Color}
            />}
            primaryText='Cerrar Sesión'
            onTouchTap={this.handleLogout}
          />
        </List>
      </Layout>
    )
  }
}

export default Config
