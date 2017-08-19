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
import RefreshIndicator from 'material-ui/RefreshIndicator'
import Paper from 'material-ui/Paper'
import { Tabs, Tab } from 'material-ui/Tabs'

import GeneratorCard from '../components/GeneratorCard'
import UpstairsGeneratorCard from '../components/UpstairsGeneratorCard'
import DownstairsGeneratorCard from '../components/DownstairsGeneratorCard'

import theme from '../theme'
import SwipeableViews from 'react-swipeable-views'
import Portal from 'react-portal-minimal'
import { fetchJson } from '../utils'
import Ticker from '../ticker'


const gray = 'rgba(0, 0, 0, 0.6)'
const red = 'red'
const blue = 'blue'
const green = 'green'
const orange = 'orange'

const styles = {
  fab: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 900,
    flexDirection: 'row',
    transition: 'transform 0.35s cubic-bezier(0.15, 0.3, 0.25, 1) 0s',
    direction: 'ltr',
    display: 'flex',
  },
  minibar: {
    backgroundColor: theme.palette.primary2Color,
    color: theme.palette.alternateTextColor,
    paddingLeft: '20px',
    paddingRight: '20px',
  },
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
    tickerConnected: false,
    tickerPrice: null,
    tabIndex: 1,
  }

  ticker = new Ticker('USDT_BTC')

  constructor(props) {
    super(props)
    this.ticker.on('open', () => this.setState({tickerConnected: true}))
    this.ticker.on('close', () => this.setState({tickerConnected: false}))
    this.ticker.on('ticker', ({last}) => this.setState({tickerPrice: last}))
  }

  getActions = async () => {
    this.setState({refreshStatus: 'loading'})
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
    this.props.onMount({menu: this.menu})

    navigator.serviceWorker.addEventListener('message', this.handleSWMessage)

    return this.getActions()
  }

  componentWillUnmount = () => {
    navigator.serviceWorker.removeEventListener('message', this.handleSWMessage)
    try {
      this.ticker.close()
    } catch (err) {
      // It was already closed, no big deal
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
    await this.getActions()
    const actions = this.state.actions

    const promises = []
    for (const action of actions)
      promises.push(fetchJson(`/actions/${action.id}`, this.props.auth, {
        method: 'delete'
      }))

    await Promise.all(promises)
    return this.getActions()
  }

  render () {
    const fabStyle = Object.assign({}, styles.fab)
    const translateFab = -100 * (this.state.tabIndex - 1)
    fabStyle.transform = `translate(${translateFab}vh, 0px)`

    return (
      <div>
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
              <GeneratorCard
                title='Stop limit'
                subtitle='Stop limit similar al de Poloniex.'
              >

              </GeneratorCard>
            </div>
          </div>
          <div className='list'>
            <Paper
              style={styles.minibar}
            >
              {this.state.tickerConnected && this.state.tickerPrice && `Precio BTC: ${this.state.tickerPrice} USD`}
              {this.state.tickerPrice === null ? 'Consultando precio en poloniex...' : null}
            </Paper>
            <Portal>
              <FloatingActionButton
                style={fabStyle}
                secondary={true}
                onTouchTap={this.openAddDialog}
              >
                <PlusIcon />
              </FloatingActionButton>
            </Portal>
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
            />
            <RefreshIndicator
              status={this.state.refreshStatus}
              top={80}
              size={40}
              left={-20}
              style={{marginLeft: '50%'}}
            />
          </div>
        </SwipeableViews>
      </div>
    )
  }
}

export default Actions
