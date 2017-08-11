import React, { Component } from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import Route from './AuthRoute'
// Material-UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
// Views
import Home from './views/Home'
import Actions from './views/Actions'
import NotFound from './views/NotFound'
import AuthCallback from './views/AuthCallback'
// Other
import SideNav from './components/SideNav'
import injectTapEventPlugin from 'react-tap-event-plugin'
import theme from './theme'

import './App.css'

injectTapEventPlugin()

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          <div>
            <SideNav />

            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/actions' component={Actions} />
              <Route exact path='/authCallback' component={AuthCallback} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App
