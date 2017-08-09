import React, { Component } from 'react'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'

const styles = {
  fab: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
  }
}

class Actions extends Component {
  render () {
    return (
      <div>
        <FloatingActionButton style={styles.fab} secondary>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    )
  }
}

export default Actions
