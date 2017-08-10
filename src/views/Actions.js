import React, { Component } from 'react'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import PlusIcon from 'material-ui/svg-icons/content/add'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import { List, ListItem } from 'material-ui/List'
import { fetchJson } from '../utils'

const styles = {
  fab: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
  },
  dialogContent: {
    width: '100%',
    maxWidth: 'none',
  },
}

class Actions extends Component {
  state = {
    showAddDialog: false,
    actions: [],
    actionNames: {},
    errorFetching: false,
    errorMsg: null,
  }


  componentWillMount = async () => {
    try {
      const response = await fetchJson('/actions')
      if (!response.success)
        throw Error(response.error)
      const rawActions = response.actions
      const getDate = action => (new Date(action.createdAt)).getTime()
      // Sort by creation date from older to newer
      const actions = rawActions.sort((a, b) =>getDate(a) - getDate(b))

      const actionNames = {}
      for (const action of actions) {
        actionNames[action.id] = action.name
      }

      this.setState({actions, actionNames})

    } catch (err) {
      this.setState({errorFetching: true, errorMsg: err.message})
    }
  }

  closeDialogs = () => this.setState({showAddDialog: false})

  openAddDialog = () => this.setState({showAddDialog: true})

  genCondText = action => {
    if (!action.check) return ''
    if (action.check === 'gt')
      return ' cuando el precio sea mayor que ' + action.value
    if (action.check === 'lt')
      return ' cuando el precio sea menor que ' + action.value
  }

  genActionText = action => {
    const triggers = this.state.actionNames[action.triggerId]
    
    switch (action.type) {
    case 'enable':
      return `Habilitar acción ${triggers}` + this.genCondText(action)
    case 'sell':
      return `Vender a ${action.value}`
    default:
      return `Acción inválida`
    }
  }

  renderAction = (action, i) => {
    const style = {}
    if (!action.enabled)
      style.color = 'rgba(0, 0, 0, 0.6)'
    return (
      <ListItem
        key={i}
        style={style}
        primaryText={action.name + (action.enabled ?' (Habilitada)' : '')}
        secondaryText={this.genActionText(action)}
        secondaryTextLines={2}
      />
    )
  }

  render () {
    const addDialogActions = [
      <FlatButton
        label='Cancelar'
        primary={true}
        onTouchTap={this.closeDialogs}
      />,
      <FlatButton
        label='Crear'
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.closeDialogs}
      />
    ]
    return (
      <div>
        <FloatingActionButton
          style={styles.fab}
          secondary={true}
          onTouchTap={this.openAddDialog}
        >
          <PlusIcon />
        </FloatingActionButton>
        {this.state.errorFetching
          ? `Error descargando la lista de acciones: ${this.state.errorMsg}`
          : <List>
              {this.state.actions.map(this.renderAction)}
            </List>
        }
        <Dialog
          title='Nueva acción'
          modal={true}
          actions={addDialogActions}
          open={this.state.showAddDialog}
          contentStyle={styles.dialogContent}
        >

        </Dialog>
      </div>
    )
  }
}

export default Actions
