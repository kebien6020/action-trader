import React, { Component } from 'react'
import Layout from '../components/Layout'

class NotFound extends Component {
  render () {
    return (
      <Layout title='Error 404'>
        <h1>Pagina no encontrada</h1>
      </Layout>
    )
  }
}

export default NotFound
