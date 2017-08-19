import React,  { Component } from 'react'
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import LinearProgress from 'material-ui/LinearProgress'
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'

const styles = {
  card: {
    width: '100%',
    display: 'inline-block',
    marginBottom: '16px',
  },
  title: {
    marginBottom: '0',
  },
  content: {
    paddingTop: '0',
  },
  arrow: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    transform: 'scale(2, 2)'
  },
  arrowContainer: {
    width: '100%',
    paddingTop: '8px',
    paddingBottom: '8px',
    cursor: 'pointer',
  }
}

class GeneratorCard extends Component {
  state = {
    hovered: false,
    expanded: false
  }

  handleHover = hovered => this.setState({hovered})

  toggleExpanded = () => this.setState({expanded: !this.state.expanded})

  render() {
    return (
      <Card
        style={styles.card}
        onMouseEnter={() => this.handleHover(true)}
        onMouseLeave={() => this.handleHover(false)}
        zDepth={this.state.hovered ? 3 : 1}
      >
        <CardTitle
          title={this.props.title}
          subtitle={this.props.subtitle}
          style={styles.title}
        />
        {this.state.expanded ?
          <div>
            <CardText style={styles.content}>
              {this.props.children}
              {this.props.progress !== null ?
                <LinearProgress
                  mode='determinate'
                  value={this.props.progress}
                />
                :
                null
              }
            </CardText>
            <CardActions style={{textAlign: 'right'}}>
              <FlatButton label='Cancelar' onTouchTap={this.toggleExpanded} />
              <FlatButton label='Generar Acciones' onTouchTap={() => {
                if (this.props.onGenerate) {
                  const retVal = this.props.onGenerate()
                  if (retVal instanceof Promise)
                    retVal.then(this.toggleExpanded)
                  else
                    this.toggleExpanded()
                }
              }} />
            </CardActions>
          </div>
          :
          <div onTouchTap={this.toggleExpanded} style={styles.arrowContainer}>
            <ArrowDown style={styles.arrow} />
          </div>
        }
      </Card>
    )
  }
}

export default GeneratorCard
