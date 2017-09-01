import React, { Component } from 'react'
import CircularProgress from 'material-ui/CircularProgress'
import Layout from '../components/Layout'

class AuthCallback extends Component {
  constructor(props) {
    super(props)
    const { auth } = props
    auth.handleAuthentication()
      .then(() => props.history.push('/') )
  }
  render() {
    const style = {
      display: 'flex',
      minHeight: 'calc(100vh - 64px)',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    }

    return (
      <Layout>
        <div style={style}>
          <div style={{marginBottom: '16px'}}><CircularProgress /></div>
          <div>Iniciando sesión...</div>
        </div>
      </Layout>
    );
  }
}

export default AuthCallback
