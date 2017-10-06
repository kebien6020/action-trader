import React, { Component } from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import Route from './AuthRoute'
// Material-UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
// Views
// import Home from './views/Home'
import Actions from './views/Actions'
import Config from './views/Config'
import NotFound from './views/NotFound'
import AuthCallback from './views/AuthCallback'
import SilentAuth from './views/SilentAuth'
import NotificationsConfig from './views/NotificationsConfig'
import PoloniexConfig from './views/PoloniexConfig'
// Other
import injectTapEventPlugin from 'react-tap-event-plugin'
import theme from './theme'

import './App.css'

injectTapEventPlugin()

class App extends Component {
  componentWillMount() {
    if (navigator.serviceWorker)
      navigator.serviceWorker.addEventListener('message', this.handleSWMessage)
  }

  componentWillUnmount() {
    if (navigator.serviceWorker)
      navigator.serviceWorker.removeEventListener('message', this.handleSWMessage)
  }

  handleSWMessage = event => {
    const audio = new Audio('/notification.mp3')
    audio.play()
  }
  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <Switch>
            <Route exact path='/' component={Actions} />
            <Route exact path='/actions' component={Actions} />
            <Route exact path='/config' component={Config} />
            <Route exact path='/authCallback' component={AuthCallback} />
            <Route exact path='/silentAuth' component={SilentAuth} />
            <Route exact path='/config/notifications'
              sw={this.props.sw}
              component={NotificationsConfig}
            />
            <Route exact path='/config/poloniex'
              component={PoloniexConfig}
            />
            <Route component={NotFound} />
          </Switch>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App
