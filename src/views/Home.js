import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'

class Home extends Component {
  static isPrivate = true

  componentWillMount() {
    this.props.onMount({menu: null})
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
