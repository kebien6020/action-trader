import React from 'react'
import { Route } from 'react-router-dom'
import Auth from './Auth'
const auth  = new Auth()

const isAuthenticated = () => auth.isAuthenticated()

const AuthRoute = ({component, sw, ...outerProps}) => {
  const { isPrivate } = component

  if (isAuthenticated() || !isPrivate) {
    // Authenticated users have access to every route
    const Component = component
    const render = (props) => <Component auth={auth} sw={sw} {...outerProps} {...props} />
    return <Route { ...outerProps } render={render} />
  } else {
    // User is not Authenticated and route is not private
    auth.login()
    return null
  }
}

export default AuthRoute
