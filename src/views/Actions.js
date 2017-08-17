import React, { Component } from 'react'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import PlusIcon from 'material-ui/svg-icons/content/add'
import { List, ListItem } from 'material-ui/List'
import ArrowUp from 'material-ui/svg-icons/navigation/arrow-upward'
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-downward'
import Cross from 'material-ui/svg-icons/navigation/close'
import Check from 'material-ui/svg-icons/navigation/subdirectory-arrow-right'
import NewActionDialog from '../components/NewActionDialog'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import { fetchJson } from '../utils'


const styles = {
  fab: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 900
  },
}

const gray = 'rgba(0, 0, 0, 0.6)'
const red = 'red'
const blue = 'blue'
const green = 'green'
const orange = 'orange'

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
      <MenuItem primaryText="Actualizar" />
    </IconMenu>
  )

  state = {
    showAddDialog: false,
    actions: [],
    actionNames: {},
    errorFetching: false,
    errorMsg: null,
  }

  getActions = async () => {
    try {
      const response = await fetchJson('/actions', this.props.auth)
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

      this.setState({
        actions,
        actionNames,
        errorFetching: false,
        errorMsg: ''
      })

    } catch (err) {
      this.setState({errorFetching: true, errorMsg: err.message})
    }
  }

  handleSWMessage = event => {
    if (event.data === 'update')
      this.getActions()
  }

  componentWillMount = async () => {
    this.props.onMount({menu: this.menu})

    navigator.serviceWorker.addEventListener('message', this.handleSWMessage)

    return this.getActions()
  }

  componentWillUnmount = () => {
    navigator.serviceWorker.removeEventListener('message', this.handleSWMessage)
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
    const triggers = action.triggerName

    switch (action.type) {
    case 'enable':
      return `Habilitar acción ${triggers}` + this.genCondText(action)
    case 'disable':
      return `Deshabilitar acción ${triggers}` + this.genCondText(action)
    case 'sell':
      return `Vender a ${action.value}` + this.genCondText(action)
    case 'buy':
      return `Comprar a ${action.value}` + this.genCondText(action)
    default:
      return `Acción inválida`
    }
  }

  genIcon = action => {
    const common = {
      style: {
        width: '36px',
        height: '36px',
      }
    }
    switch (action.type) {
    case 'sell':
    {
      const color = action.enabled ? red : gray
      return <ArrowDown {...common} color={color} />
    }
    case 'buy':
    {
      const color = action.enabled ? green : gray
      return <ArrowUp {...common} color={color} />
    }
    case 'enable':
    {
      const color = action.enabled ? blue : gray
      return <Check {...common} color={color} />
    }
    case 'disable':
    {
      const color = action.enabled ? orange : gray
      return <Cross {...common} color={color} />
    }
    default:
      return null
    }
  }

  renderAction = (action, i) => {
    const style = {}
    if (!action.enabled)
      style.color = gray
    return (
      <ListItem
        key={i}
        style={style}
        primaryText={action.name + (action.enabled ?' (Habilitada)' : '')}
        secondaryText={this.genActionText(action)}
        secondaryTextLines={2}
        leftIcon={this.genIcon(action)}
        rightIconButton={
          <IconMenu
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            >
          <MenuItem primaryText="Eliminar" onTouchTap={() => this.deleteAction(action.id)} />
        </IconMenu>
      }
      />
    )
  }

  deleteAction = async (id) => {
    await fetchJson(`/actions/${id}`, this.props.auth, {method: 'delete'})
    this.getActions()
  }

  handleNewAction = async (action) => {
    // Work over clone
    action = Object.assign({}, action)
    if (action.check === 'none') action.check = null
    if (action.triggerName === '') action.triggerName = null
    await fetchJson('/actions', this.props.auth, {
      method: 'post',
      body: JSON.stringify(action),
    })
    this.closeDialogs()
    return this.getActions()
  }

  render () {
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
        <NewActionDialog
          open={this.state.showAddDialog}
          onCancel={this.closeDialogs}
          onCreate={this.handleNewAction}
        >

        </NewActionDialog>
      </div>
    )
  }
}

export default Actions
