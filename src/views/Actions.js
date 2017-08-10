import React, { Component } from 'react'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import PlusIcon from 'material-ui/svg-icons/content/add'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

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
  }

  closeDialogs = () => this.setState({showAddDialog: false})

  openAddDialog = () => this.setState({showAddDialog: true})

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
