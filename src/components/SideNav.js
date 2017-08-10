import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import SideBarItem from './SideBarItem'
import { List } from 'material-ui/List'

/*
  Add you nav links here..
    isExact: if true it will be an exact path
    linkTo: the path you want to go
    text: title of the nav item
*/

const links = [
  { isExact: true, linkTo: '/', text: 'Home' },
  { isExact: false, linkTo: '/actions', text: 'Acciones' }
]

class SideNav extends Component {
  state = { open: false }

  handleClose = () => this.setState({ open: false })

  render () {
    return (
      <div>
        <AppBar
          title='Action Trader'
          iconClassNameRight='muidocs-icon-navigation-expand-more'
          onLeftIconButtonTouchTap={() =>
            this.setState({ open: !this.state.open })}
          className='appbar'
        />
        <Drawer
          className='drawer'
          open={this.state.open}
          docked={false}
          onRequestChange={open => this.setState({ open })}
        >
          <List>
            {links.map((link, i) => {
              return (
                <SideBarItem
                  isExact={link.isExact}
                  linkTo={link.linkTo}
                  primaryText={link.text}
                  onClick={this.handleClose}
                  key={i}
                />
              )
            })}
          </List>
        </Drawer>
      </div>
    )
  }
}

export default SideNav
