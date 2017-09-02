import React, { Component } from 'react'

import { List, ListItem } from 'material-ui/List'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Checkbox from 'material-ui/Checkbox'
import KeyIcon from 'material-ui/svg-icons/communication/vpn-key'

import Layout from '../components/Layout'
import theme from '../theme'
import { fetchJson } from '../utils'

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
  static isPrivate = true

  state = {
    dialogOpen: false,
    showSecret: false,
    apiKey: '',
    secret: '',
    saveDisabled: false,
  }

  componentWillMount = async () => {
    // Get previous values from the server
    try {
      const data = await fetchJson('/config/poloniex', this.props.auth)
      if (data.success) {
        this.setState({
          apiKey: data.poloniexApiKey,
          secret: data.poloniexSecret,
        })
      }
    } catch (err) {
      // Just use the default values (ie. empty strings)
    }
  }

  toggleDialog = () =>
    this.setState({dialogOpen: !this.state.dialogOpen})

  handleCheckShowSecret = (_, checked) =>
    this.setState({showSecret: checked})

  handleChangeTextField = (event, newText) => {
    const name = event.target.name
    this.setState({[name]: newText})
  }

  handleSave = async () => {
    // Disable the button so that this doesn't fire multiple times
    this.setState({saveDisabled: true})
    // Get the values we are going to save
    const { apiKey, secret } = this.state

    // Actually save the data to the server
    await fetchJson('/config/poloniex', this.props.auth, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        poloniexApiKey: apiKey,
        poloniexSecret: secret,
      })
    })

    // TODO: Show error dialog on unsuccessful save

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
      <Layout title='Poloniex' goBackTo='/config'>
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
      </Layout>
    )
  }
}

export default PoloniexConfig
