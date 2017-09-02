import React, { Component } from 'react'
import Layout from '../components/Layout'

class Home extends Component {
  static isPrivate = true

  render () {
    return (
      <Layout>
        <main>
          <p>Eventos recientes o algo asi iria aqui</p>
        </main>
      </Layout>
    )
  }
}

export default Home
