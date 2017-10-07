import React,  { Component } from 'react'

import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import LinearProgress from 'material-ui/LinearProgress'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'

import AmountField from './AmountField'
import { createActions } from '../api'

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
  constructor(props) {
    super(props)
    const { generator } = props

    const initialFields = {}
    for (const field of generator.fields) {
      initialFields[field.name] = field.default
    }

    this.state = {
      hovered: false,
      expanded: false,
      progress: false,
      fields: initialFields,
      amount: 100,
      amountType: 'percentage',
    }
  }

  handleHover = hovered => this.setState({hovered})

  toggleExpanded = () => this.setState({expanded: !this.state.expanded})

  handleGenerate = async () => {
    const { props, state } = this

    // Show indeterminate progressBar
    this.setState({progress: true})

    // Gather the info to call generate
    const existingActions = props.actions
    const { fields, amountType } = state
    let { amount } = state
    if (amountType === 'percentage') {
      // The server expects the amount to be a fraction
      amount = amount / 100
    }
    // Generate the actions
    const actions = props.generator.generate(fields, amount, amountType, existingActions)

    // Upload the actions to the server
    await createActions(actions, this.props.auth)

    // If our parent is hooked on the generate event, now
    // is the time to call him
    if (props.onGenerate) {
      const retVal = this.props.onGenerate()
      if (retVal instanceof Promise)
        retVal.then(this.toggleExpanded)
      else
        this.toggleExpanded()
    }
  }

  handleTextFieldChange = event => {
    const { name, value } = event.target
    const newState = this.state
    newState.fields[name] = Number(value)
    this.setState(newState)
  }

  handleMultiChange = (name, value) => {
    const newState = this.state
    newState.fields[name] = value
    this.setState(newState)
  }

  handleChange = (name, value) =>
    this.setState({[name]: value})

  renderNumberField = (field, key) => {
    return (
      <TextField
        key={key}
        floatingLabelText={field.text}
        name={field.name}
        type='number'
        fullWidth={true}
        onChange={this.handleTextFieldChange}
        value={this.state.fields[field.name]}
      />
    )
  }

  renderMultiField = (field, key) => {
    return (
      <SelectField
        key={key}
        floatingLabelText={field.text}
        value={this.state.fields[field.name]}
        onChange={(_, __, value) => this.handleMultiChange(field.name, value)}
        name={field.name}
        fullWidth={true}
      >
        {Object.entries(field.options).map(([name, text], key) =>
          <MenuItem key={key} value={name} primaryText={text} />
        )}
      </SelectField>
    )
  }

  renderField = (field, key) => {
    switch (field.type) {
      case 'number':
        return this.renderNumberField(field, key)
      case 'multi':
        return this.renderMultiField(field, key)
      default:
        return 'ERROR: generador especificado incorrectamente'
    }
  }

  render() {
    const { props, state } = this
    const genQty = props.generator.genQty(state.fields)
    return (
      <Card
        style={styles.card}
        onMouseEnter={() => this.handleHover(true)}
        onMouseLeave={() => this.handleHover(false)}
        zDepth={state.hovered ? 3 : 1}
      >
        <CardTitle
          title={props.generator.title}
          subtitle={props.generator.description}
          style={styles.title}
        />
        {state.expanded ?
          <div>
            <CardText style={styles.content}>
              {props.generator.fields.map(this.renderField)}
              <AmountField
                customTitle={props.generator.amountFieldTitle}
                amount={this.state.amount}
                type={this.state.amountType}
                onAmountChange={this.handleChange}
                onTypeChange={this.handleChange}
              />
              Se generarán {genQty} acciones
              {state.progress &&
                <LinearProgress
                  mode='indeterminate'
                />
              }
            </CardText>
            <CardActions style={{textAlign: 'right'}}>
              <FlatButton label='Cancelar' onTouchTap={this.toggleExpanded} />
              <FlatButton label='Generar Acciones' onTouchTap={this.handleGenerate} />
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
