import React,  { Component } from 'react'
import { Card, CardTitle, CardText } from 'material-ui/Card'

const styles = {
  card: {
    width: '100%',
    display: 'inline-block',
    marginBottom: '16px',
    cursor: 'pointer',
  }
}

class GeneratorCard extends Component {
  state = {
    hovered: false
  }

  handleHover = hovered => this.setState({hovered})

  render() {
    return (
      <Card
        style={styles.card}
        onTouchTap={this.props.onTouchTap}
        onMouseEnter={() => this.handleHover(true)}
        onMouseLeave={() => this.handleHover(false)}
        zDepth={this.state.hovered ? 3 : 1}
      >
        <CardTitle title={this.props.title} />
        <CardText>
          {this.props.children}
        </CardText>
      </Card>
    )
  }
}

export default GeneratorCard
