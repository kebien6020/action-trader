import React from 'react'
import { Route } from 'react-router-dom'
import Auth from './Auth'
const auth  = new Auth()

const isAuthenticated = () => auth.isAuthenticated()

const AuthRoute = ({component, sw, ...outerProps}) => {
  const { isPrivate } = component
  const renderRoute = () => {
    const Component = component
    const render = (props) => <Component auth={auth} sw={sw} {...outerProps} {...props} />
    return <Route { ...outerProps } render={render} />
  }

  if (isAuthenticated() || !isPrivate) {
    // Authenticated users have access to every route
    return renderRoute()
  } else {
    // User is not Authenticated and route is not private

    // Try silent auth
    const success = auth.renew()
    if (success)
      return renderRoute()

    // If silent auth fails it redirects to the login page,
    // so this should never be shown
    return 'Error autenticando'
  }
}

export default AuthRoute
