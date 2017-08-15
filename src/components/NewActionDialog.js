import React, { Component } from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import Toggle from 'material-ui/Toggle'
import muiThemeable from 'material-ui/styles/muiThemeable'

class NewActionDialog extends Component {
  state = {
    name: '',
    type: 'enable',
    check: 'none',
    value: '',
    triggerName: '',
    enabled: false
  }

  handleChange = (name, value) => {
    this.setState({[name]: value})
  }

  handleTextField = (event) => {
    this.handleChange(event.target.name, event.target.value)
  }

  render() {
    const actions = [
      <FlatButton
        label='Cancelar'
        primary={true}
        onTouchTap={this.props.onCancel}
      />,
      <FlatButton
        label='Crear'
        primary={true}
        onTouchTap={() => this.props.onCreate(this.state)}
      />
    ]
    return (
      <Dialog
        title='Nueva acción'
        modal={true}
        actions={actions}
        open={this.props.open}
        contentStyle={{
          width: '100%',
          maxWidth: 'none',
        }}
        autoScrollBodyContent={true}
      >
          <TextField
            floatingLabelText='Nombre de la acción'
            value={this.state.name}
            onChange={this.handleTextField}
            name='name'
            fullWidth={true}
          />
          <SelectField
            floatingLabelText='Tipo de acción'
            value={this.state.type}
            onChange={(_, __, value) => this.handleChange('type', value)}
            name='type'
            fullWidth={true}
          >
            <MenuItem value='enable' primaryText='Habilitar acción' />
            <MenuItem value='disable' primaryText='Deshabilitar acción' />
            <MenuItem value='sell' primaryText='Vender' />
            <MenuItem value='buy' primaryText='Comprar' />
          </SelectField>
          {this.state.type === 'enable' || this.state.type === 'disable' ?
            <TextField
              floatingLabelText={'Acción a ' + (this.state.type === 'enable' ? 'habilitar' : 'deshabilitar')}
              value={this.state.triggerName}
              onChange={this.handleTextField}
              name='triggerName'
              fullWidth={true}
            /> : null
          }
          <SelectField
            floatingLabelText='Condición de activación'
            value={this.state.check}
            onChange={(_, __, value) => this.handleChange('check', value)}
            name='check'
            fullWidth={true}
          >
            <MenuItem value='none' primaryText='Ninguna' />
            <MenuItem value='gt' primaryText='Precio mayor que...' />
            <MenuItem value='lt' primaryText='Precio menor que...' />
          </SelectField>
          <TextField
            floatingLabelText='Valor'
            value={this.state.value}
            onChange={this.handleTextField}
            name='value'
            type='number'
            fullWidth={true}
          />
          <Toggle
            label='Habilitada'
            toggled={this.state.enabled}
            labelStyle={{width: 'auto'}}
            trackStyle={{backgroundColor: this.props.muiTheme.palette.disabledColor}}
            thumbStyle={{backgroundColor: this.props.muiTheme.palette.primary2Color}}
            trackSwitchedStyle={{backgroundColor: this.props.muiTheme.palette.accent1Color}}
            thumbSwitchedStyle={{backgroundColor: this.props.muiTheme.palette.primary1Color}}
            onToggle={(_, checked) => this.setState({enabled: checked})}
          />
      </Dialog>
    )
  }
}

export default muiThemeable()(NewActionDialog)
