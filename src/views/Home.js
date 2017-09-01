import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import Layout from '../components/Layout'

class Home extends Component {
  static isPrivate = true

  handleLogout = () => {
    this.props.auth.logout()
    this.props.history.push('/')
  }

  render () {
    return (
      <Layout>
        <h1>Action Trader</h1>
        <main>
          <p>Eventos recientes o algo asi iria aqui</p>
          <RaisedButton
            label='Cerrar sesión'
            primary={true}
            onClick={this.handleLogout}
          />
        </main>
      </Layout>
    )
  }
}

export default Home
