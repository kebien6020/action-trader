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
import TextField from 'material-ui/TextField'
import LinearProgress from 'material-ui/LinearProgress'

import GeneratorCard from '../components/GeneratorCard'
import muiThemeable from 'material-ui/styles/muiThemeable'
import SwipeableViews from 'react-swipeable-views'
import Portal from 'react-portal-minimal'
import { fetchJson } from '../utils'
import Ticker from '../ticker'


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
      <MenuItem primaryText="Actualizar lista" onTouchTap={() => this.getActions()} />
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
    'upstairs.initialValue': null,
    'upstairs.step': '20',
    'upstairs.stopDistance': '60',
    'upstairs.stepQty': '20',
    'upstairs.limitDelta': '2',
    'upstairs.genPercentage': null,
  }

  styles = {
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
      backgroundColor: this.props.muiTheme.palette.primary2Color,
      color: this.props.muiTheme.palette.alternateTextColor,
      paddingLeft: '20px',
      paddingRight: '20px',
    },
    row: {
      paddingLeft: '16px',
      paddingRight: '16px',
      paddingTop: '16px',
    }
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

  handleUpStairsChange = event => {
    const {name, value} = event.target
    this.setState({[`upstairs.${name}`]: value})
  }

  handleGenerateUpstairs = async () => {
    const initialValue = Number(this.state['upstairs.initialValue'])
    const step = Number(this.state['upstairs.step'])
    const stopDistance = Number(this.state['upstairs.stopDistance'])
    const stepQty = Number(this.state['upstairs.stepQty'])
    const limitDelta = Number(this.state['upstairs.limitDelta'])

    // Settle on an unique prefix
    let prefixIndex = 1
    const makePrefix = i => `[V${i}]`
    const actionNames = this.state.actions.map(a => a.name)
    const startWithPrefix = name =>
      name.startsWith(makePrefix(prefixIndex))

    while(actionNames.some(startWithPrefix))
      ++prefixIndex

    const prefix = makePrefix(prefixIndex)

    const actions = []
    for (let i = 1; i <= stepQty; ++i) {
      const currentStepValue = initialValue + (i - 1) * step
      const currentStopLimit = currentStepValue - stopDistance
      const currentLimit = currentStopLimit - limitDelta
      // Disable previous stop limit
      if (i > 1) {
        actions.push({
          name: `${prefix} Paso ${i} mover stop`,
          type: 'disable',
          triggerName: `${prefix} Paso ${i - 1} stop`,
          check: 'gt',
          value: currentStepValue,
          enabled: true,
        })
      }
      // Enable current stop limit
      actions.push({
        name: `${prefix} Paso ${i} stop stop`,
        type: 'enable',
        triggerName: `${prefix} Paso ${i} stop`,
        check: 'gt',
        value: currentStepValue,
        enabled: true,
      })

      // Stop limit
      actions.push({
        name: `${prefix} Paso ${i} stop`,
        type: 'enable',
        triggerName: `${prefix} Paso ${i} limit`,
        check: 'lt',
        value: currentStopLimit,
        enabled: false,
      })

      // Limit
      actions.push({
        name: `${prefix} Paso ${i} limit`,
        type: 'sell',
        value: currentLimit,
        enabled: false,
      })
    }

    for (let i = 0; i < actions.length; ++i) {
      const action = actions[i]
      await fetchJson('/actions', this.props.auth, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action),
      })
      const percentage = Math.ceil(i / actions.length * 100)
      this.setState({'upstairs.genPercentage': percentage})
    }

    this.setState({tabIndex: 1})
    this.getActions()

  }

  render () {
    const fabStyle = Object.assign({}, this.styles.fab)
    const translateFab = -100 * (this.state.tabIndex - 1)
    fabStyle.transform = `translate(${translateFab}vh, 0px)`
    const upstairsSteps = Number(this.state['upstairs.stepQty'])
    let upstairsGenQty = upstairsSteps * 4 - 1
    if (upstairsGenQty < 0) upstairsGenQty = 0
    return (
      <div>
        <Tabs onChange={this.handleChangeTab} value={this.state.tabIndex}>
          <Tab label='Generadores' value={0} />
          <Tab label='Lista' value={1} />
        </Tabs>
        <SwipeableViews onChangeIndex={this.handleChangeTab} index={this.state.tabIndex}>
          <div className="generators">
            <div style={this.styles.row}>
              <GeneratorCard
                title='Escalera para venta'
                subtitle='Generar acciones por pasos para ir moviendo un stop limit mientras el precio sube hasta que la tendencia se revierta'
                onGenerate={this.handleGenerateUpstairs}
              >
                <TextField
                  floatingLabelText='Primer paso'
                  name='initialValue'
                  type='number'
                  fullWidth={true}
                  onChange={this.handleUpStairsChange}
                />
                <TextField
                  floatingLabelText='Crear paso cada __ dolares'
                  name='step'
                  type='number'
                  defaultValue={20}
                  fullWidth={true}
                  onChange={this.handleUpStairsChange}
                />
                <TextField
                  floatingLabelText='Poner stop limit __ dolares por debajo'
                  name='stopDistance'
                  type='number'
                  defaultValue={60}
                  fullWidth={true}
                  onChange={this.handleUpStairsChange}
                />
                <TextField
                  floatingLabelText='Poner limit __ dolares por debajo del stop'
                  name='limitDelta'
                  type='number'
                  defaultValue={2}
                  fullWidth={true}
                  onChange={this.handleUpStairsChange}
                />
                <TextField
                  floatingLabelText='Número de pasos a crear'
                  name='stepQty'
                  type='number'
                  defaultValue={20}
                  fullWidth={true}
                  onChange={this.handleUpStairsChange}
                />
                Se generarán {upstairsGenQty} acciones
                {this.state['upstairs.genPercentage'] !== null ?
                  <LinearProgress
                    mode='determinate'
                    value={this.state['upstairs.genPercentage']}
                  />
                  :
                  null
                }
              </GeneratorCard>
              <GeneratorCard
                title='Escalera para compra'
                subtitle='Generar acciones por pasos para ir moviendo un stop limit mientras el precio baja hasta que la tendencia se revierta'
              >

              </GeneratorCard>
              <GeneratorCard
                title='Stop limit'
                subtitle='Stop limit similar al de Poloniex'
              >

              </GeneratorCard>
            </div>
          </div>
          <div className='list'>
            <Paper
              style={this.styles.minibar}
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

export default muiThemeable()(Actions)
