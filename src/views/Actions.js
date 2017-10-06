import React, { Component } from 'react'

import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import { Tabs, Tab } from 'material-ui/Tabs'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

import Layout from '../components/Layout'
import NewActionDialog from '../components/NewActionDialog'
import StopLimitGeneratorCard from '../components/StopLimitGeneratorCard'
import UpstairsGeneratorCard from '../components/UpstairsGeneratorCard'
import DownstairsGeneratorCard from '../components/DownstairsGeneratorCard'
import UpstairsClosingGeneratorCard from '../components/UpstairsClosingGeneratorCard'
import DownstairsClosingGeneratorCard from '../components/DownstairsClosingGeneratorCard'
import ActionList from '../components/ActionList'

import SwipeableViews from 'react-swipeable-views'
import { fetchJson } from '../utils'

const styles = {
  row: {
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '16px',
  }
}

class Actions extends Component {
  static isPrivate = true

  menu = (
    <IconMenu
      iconButtonElement={
        <IconButton><MoreVertIcon /></IconButton>
      }
      targetOrigin={{horizontal: 'right', vertical: 'top'}}
      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
    >
      <MenuItem
        primaryText="Actualizar lista"
        onTouchTap={() => this.getActions()}
      />
      <MenuItem
        primaryText='Borrar todas las acciones'
        onTouchTap={() => this.deleteAllActions()}
      />
    </IconMenu>
  )

  state = {
    showAddDialog: false,
    actions: [],
    actionNames: {},
    errorFetching: false,
    errorMsg: null,
    refreshStatus: 'hide',
    tabIndex: 1,
  }

  getActions = async () => {
    this.setState({refreshStatus: 'loading'})
    try {
      const response = await fetchJson('/actions', this.props.auth)
      if (!response.success)
        throw Error(response.error)
      const rawActions = response.actions
      // Sort by id
      const actions = rawActions.sort((a, b) => a.id - b.id)

      const actionNames = {}
      for (const action of actions) {
        actionNames[action.id] = action.name
      }

      this.setState({
        actions,
        actionNames,
        errorFetching: false,
        errorMsg: ''
      })

    } catch (err) {
      this.setState({errorFetching: true, errorMsg: err.message})
    } finally {
      this.setState({refreshStatus: 'hide'})
    }
  }

  handleSWMessage = event => {
    if (event.data === 'update')
      this.getActions()
    const audio = new Audio('/notification.mp3')
    audio.play()
  }

  componentWillMount = async () => {
    if (navigator.serviceWorker)
      navigator.serviceWorker.addEventListener('message', this.handleSWMessage)

    return this.getActions()
  }

  componentWillUnmount = () => {
    if (navigator.serviceWorker)
      navigator.serviceWorker.removeEventListener('message', this.handleSWMessage)
  }

  closeDialogs = () => this.setState({showAddDialog: false})

  openAddDialog = () => this.setState({showAddDialog: true})

  deleteAction = async (id) => {
    await fetchJson(`/actions/${id}`, this.props.auth, {method: 'delete'})
    this.getActions()
  }

  handleNewAction = async (action) => {
    await fetchJson('/actions', this.props.auth, {
      method: 'post',
      body: JSON.stringify(action),
    })
    this.closeDialogs()
    return this.getActions()
  }

  handleChangeTab = index => {
    this.setState({tabIndex: index})
  }

  handleGenerate = () => {
    // Most is done in the Generator Component themselves,
    // we only need to switch to the list tab and
    // update the actions
    this.setState({tabIndex: 1})
    this.getActions()
  }

  deleteAllActions = async () => {
    await fetchJson('/actions/deleteAll', this.props.auth, {
      method: 'delete',
    })

    return this.getActions()
  }

  render () {
    const translateFab = -100 * (this.state.tabIndex - 1)

    return (
      <Layout title='Acciones' menu={this.menu}>
        <Tabs onChange={this.handleChangeTab} value={this.state.tabIndex}>
          <Tab label='Generadores' value={0} />
          <Tab label='Lista' value={1} />
        </Tabs>
        <SwipeableViews onChangeIndex={this.handleChangeTab} index={this.state.tabIndex}>
          <div className="generators">
            <div style={styles.row}>
              <UpstairsGeneratorCard
                onGenerate={this.handleGenerate}
                actions={this.state.actions} // To avoid name collisions
                auth={this.props.auth}
              />
              <DownstairsGeneratorCard
                onGenerate={this.handleGenerate}
                actions={this.state.actions}
                auth={this.props.auth}
              />
              <UpstairsClosingGeneratorCard
                onGenerate={this.handleGenerate}
                actions={this.state.actions}
                auth={this.props.auth}
              />
              <DownstairsClosingGeneratorCard
                onGenerate={this.handleGenerate}
                actions={this.state.actions}
                auth={this.props.auth}
              />
              <StopLimitGeneratorCard
                onGenerate={this.handleGenerate}
                actions={this.state.actions}
                auth={this.props.auth}
              />
            </div>
          </div>
          <ActionList
            translateFab={translateFab}
            onAddAction={this.openAddDialog}
            onDeleteAction={this.deleteAction}
            errorFetching={this.state.errorFetching}
            errorMsg={this.state.errorMsg}
            actions={this.state.actions}
            refreshStatus={this.state.refreshStatus}
          />
        </SwipeableViews>
        <NewActionDialog
          open={this.state.showAddDialog}
          onCancel={this.closeDialogs}
          onCreate={this.handleNewAction}
        />
      </Layout>
    )
  }
}

export default Actions
