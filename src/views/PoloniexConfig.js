import React, { Component } from 'react'

import { List, ListItem } from 'material-ui/List'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Checkbox from 'material-ui/Checkbox'
import KeyIcon from 'material-ui/svg-icons/communication/vpn-key'

import theme from '../theme'

const styles = {
  checkbox: {
    marginTop: '16px',
    marginBottom: '16px',
  },
  saveButton: {
    display:'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}

class PoloniexConfig extends Component {

  state = {
    dialogOpen: false,
    showSecret: false,
    apiKey: '',
    secret: '',
    saveDisabled: false,
  }

  componentWillMount() {
    this.props.onMount({menu: null})
    // TODO: Download current apiKey and secret
    //       from the server on mount
  }

  toggleDialog = () =>
    this.setState({dialogOpen: !this.state.dialogOpen})

  handleCheckShowSecret = (_, checked) =>
    this.setState({showSecret: checked})

  handleChangeTextField = (event, newText) => {
    const name = event.target.name
    this.setState({[name]: newText})
  }

  handleSave = () => {
    // Disable the button so that this doesn't fire multiple times
    this.setState({saveDisabled: true})
    // Get the values we are going to save
    // const { apiKey, apiSecret } = this.state

    // TODO: Actually save the data to the server

    // Restore the save button and close the dialog
    this.setState({
      saveDisabled: false,
      dialogOpen: false,
    })
  }

  renderDialog = () => (
    <Dialog
      open={this.state.dialogOpen}
      title='Clave API de Poloniex'
      actions={[
        <FlatButton
          label='Cerrar'
          onClick={this.toggleDialog}
        />
      ]}
      autoScrollBodyContent
    >
      <TextField
        floatingLabelText='Clave de API'
        value={this.state.apiKey}
        onChange={this.handleChangeTextField}
        name='apiKey'
        fullWidth
      />
      <TextField
        floatingLabelText='Secreto'
        value={this.state.secret}
        onChange={this.handleChangeTextField}
        name='secret'
        fullWidth
        type={this.state.showSecret ? 'text' : 'password'}
      />
      <Checkbox
        label='Mostrar secreto'
        style={styles.checkbox}
        checked={this.state.showSecret}
        onCheck={this.handleCheckShowSecret}
      />
      <RaisedButton
        label='Guardar'
        primary
        onTouchTap={this.handleSave}
        style={styles.saveButton}
        disabled={this.state.saveDisabled}
      />
    </Dialog>
  )

  render() {
    return (
      <div>
        <List>
          <ListItem
            primaryText='Registrar clave de API'
            leftIcon={<KeyIcon
              color={theme.palette.accent1Color}
            />}
            onClick={this.toggleDialog}
          />
        </List>
        {this.renderDialog()}
      </div>
    )
  }
}

export default PoloniexConfig
