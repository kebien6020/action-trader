import React, { Component } from 'react'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import { List, ListItem } from 'material-ui/List'
import RefreshIndicator from 'material-ui/RefreshIndicator'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import PlusIcon from 'material-ui/svg-icons/content/add'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import ArrowUp from 'material-ui/svg-icons/navigation/arrow-upward'
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-downward'
import Cross from 'material-ui/svg-icons/navigation/close'
import Check from 'material-ui/svg-icons/navigation/subdirectory-arrow-right'

import Portal from 'react-portal-minimal'

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
}
const gray = 'rgba(0, 0, 0, 0.6)'
const red = 'red'
const blue = 'blue'
const green = 'green'
const orange = 'orange'

export default class ActionList extends Component {
  genCondText = action => {
    if (!action.check) return ''
    if (action.check === 'gt')
      return ' si el precio supera ' + action.value
    if (action.check === 'lt')
      return ' si el precio baja de ' + action.value
  }

  genAmountText = action => {
    if (action.amountType === 'percentage')
      return (action.amount * 100) + '%'
    return action.amount + ' USD'
  }

  genActionText = action => {
    const triggers = action.triggerName

    switch (action.type) {
    case 'enable':
      return `Habilitar ${triggers}` + this.genCondText(action)
    case 'disable':
      return `Deshabilitar ${triggers}` + this.genCondText(action)
    case 'sell':
      return `Vender ${this.genAmountText(action)} a ${action.value}`
        + this.genCondText(action)
    case 'buy':
      return `Comprar ${this.genAmountText(action)} a ${action.value}`
        + this.genCondText(action)
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
    const { props } = this
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
          <MenuItem primaryText="Eliminar" onTouchTap={() => props.onDeleteAction(action.id)} />
        </IconMenu>
      }
      />
    )
  }

  render() {
    const { props } = this
    const fabStyle = Object.assign({}, styles.fab, {
      transform: `translate(${props.translateFab}vh, 0px)`
    })
    return (
      <div className='list'>
        <Portal>
          <FloatingActionButton
            style={fabStyle}
            secondary={true}
            onTouchTap={props.onAddAction}
          >
            <PlusIcon />
          </FloatingActionButton>
        </Portal>
        {props.errorFetching
          ? `Error descargando la lista de acciones: ${props.errorMsg}`
          : <List>
              {props.actions.map(this.renderAction)}
            </List>
        }
        <RefreshIndicator
          status={props.refreshStatus}
          top={80}
          size={40}
          left={-20}
          style={{marginLeft: '50%'}}
        />
      </div>
    )
  }
}
