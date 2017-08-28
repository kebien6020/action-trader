import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { List, ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import NotificationIcon from 'material-ui/svg-icons/social/notifications'
import PoloniexIcon from '../icons/PoloniexIcon'

import theme from '../theme'

class Config extends Component {
  componentWillMount() {
    this.props.onMount({menu: null})
  }

  render() {
    return (
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
      </List>
    )
  }
}

export default Config
