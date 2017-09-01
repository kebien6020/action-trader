import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import { List } from 'material-ui/List'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui/svg-icons/navigation/menu'
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back'


import SideBarItem from './SideBarItem'
import theme from '../theme'

/*
  Add you nav links here..
    isExact: if true it will be an exact path
    linkTo: the path you want to go
    text: title of the nav item
*/

const links = [
  { isExact: true, linkTo: '/', text: 'Home' },
  { isExact: false, linkTo: '/actions', text: 'Acciones' },
  { isExact: true, linkTo: '/config', text: 'Configuración' },
]

const styles = {
  logoDiv: {
    height: '150px',
    backgroundColor: theme.palette.primary1Color,
  },
  logo: {
    margin: '20px',
    width: '50px',
    height: '50px',
  }
}

class SideNav extends Component {
  state = {
    open: false,
    redirect: false,
  }

  handleOpen = () => this.setState({ open: true })
  handleClose = () => this.setState({ open: false })

  render () {
    const leftIcon = this.props.goBackTo === null
      ? <IconButton><MenuIcon onTouchTap={this.handleOpen} /></IconButton>
      :
       <IconButton onTouchTap={() => this.setState({redirect: true})}>
         <BackIcon />
         {this.state.redirect &&
           <Redirect to={this.props.goBackTo} />
         }
        </IconButton>
    return (

      <div>
        <AppBar
          title={this.props.title}
          iconElementLeft={leftIcon}
          iconElementRight={this.props.menu}
          className='appbar'
        />
        <Drawer
          className='drawer'
          open={this.state.open}
          docked={false}
          onRequestChange={open => this.setState({ open })}
        >
          <div style={styles.logoDiv}>
            <img src='/android-chrome-192x192.png' alt='logo' style={styles.logo} />
          </div>
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
