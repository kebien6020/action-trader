import React from 'react'
import { Route } from 'react-router-dom'
import CircularProgress from 'material-ui/CircularProgress'
import Layout from './components/Layout'
import Auth from './Auth'
const auth  = new Auth()

const isAuthenticated = () => auth.isAuthenticated()

const AuthStatus = {
  'DENIED': Symbol('DENIED'),   // User is not allowed to see this page
  'GRANTED': Symbol('GRANTED'), // User is allowed to see this page
  'PENDING': Symbol('PENDING'), // Still deciding
}

class AuthRoute extends React.Component {
  state = {
    authStatus: AuthStatus.PENDING
  }

  componentWillMount = async () => {
    const isPrivate = this.props.component.isPrivate
    if (isAuthenticated() || !isPrivate)
      return this.setState({authStatus: AuthStatus.GRANTED})

    const success = await auth.renew()
    if (success)
      return this.setState({authStatus: AuthStatus.GRANTED})

    return this.setState({authStatus: AuthStatus.DENIED})
  }

  render() {
    const { component, sw, ...outerProps } = this.props
    const { authStatus } = this.state

    if (authStatus === AuthStatus.GRANTED) {
      const Component = component
      const renderRoute = (props) =>
        <Component auth={auth} sw={sw} {...outerProps} {...props} />
      return <Route { ...outerProps } render={renderRoute} />
    }

    if (authStatus === AuthStatus.PENDING) {
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
            <div>Intentando autenticación automática...</div>
          </div>
        </Layout>
      )
    }

    auth.login()
    return null
  }
}

export default AuthRoute
