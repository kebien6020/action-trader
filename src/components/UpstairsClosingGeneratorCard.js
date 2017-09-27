import React, { Component } from 'react'
import GeneratorCard from  './GeneratorCard'
import AmountField from './AmountField'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import { generateClosingStair, Direction, createActions } from './generatorUtils'

class UpstairsClosingGeneratorCard extends Component {
  state = {
    progress: null,
    minValueToAction: '',
    step: 5,
    initialStopDistance: 50,
    finalStopDistance: 10,
    stepsToFinal: 9,
    limitDelta: 2,
    stepQty: 100,
    amount: '100',
    amountType: 'percentage',
    method: 'linear',
  }

  handleGenerateStairs = async () => {
    // Gather all the information to generate the stair
    const {
      minValueToAction,
      step,
      initialStopDistance,
      finalStopDistance,
      stepsToFinal,
      limitDelta,
      stepQty,
      method,
    } = this.state

    let {
      amount,
      amountType,
    } = this.state

    amount = Number(amount)
    if (amountType === 'percentage') {
      // The server expects the amount to be a fraction
      amount = amount / 100
    }

    const params = {
      direction: Direction.UPSTAIRS,
      minValueToAction,
      step,
      initialStopDistance,
      finalStopDistance,
      stepsToFinal,
      limitDelta,
      stepQty,
      existingActions: this.props.actions,
      amount,
      amountType,
      method,
    }
    // Generate the stair of actions
    const stair = generateClosingStair(params)

    // Show indeterminate progressBar
    this.setState({progress: true})

    // Actually create actions on the server
    await createActions(stair, this.props.auth)

    // We are done. Reset progress indicator and call back to the parent
    this.setState({progress: null})
    const cb = this.props.onGenerate
    if (cb) cb(stair)
  }

  handleFieldChange = event => {
    const { name, value } = event.target
    this.setState({[name]: Number(value)})
  }

  handleChange = (name, value) =>
    this.setState({[name]: value})

  handleMethodChange = (_, __, method) => {
    this.setState({method})
  }

  render () {
    let genQty = this.state.stepQty * 4 - 1
    if (genQty < 0) genQty = 0

    return (
      <GeneratorCard
        title='Escalera para venta en corto'
        subtitle='Generar acciones por pasos para ir moviendo un stop limit con una perdida cada vez menor'
        progress={this.state.progress}
        onGenerate={this.handleGenerateStairs}
      >
        <TextField
          floatingLabelText='Vender minimo en'
          name='minValueToAction'
          type='number'
          fullWidth={true}
          onChange={this.handleFieldChange}
          value={this.state.minValueToAction}
        />
        <TextField
          floatingLabelText='Crear paso cada __ dolares'
          name='step'
          type='number'
          fullWidth={true}
          onChange={this.handleFieldChange}
          value={this.state.step}
        />
        <TextField
          floatingLabelText='Perdida inicial (dolares)'
          name='initialStopDistance'
          type='number'
          fullWidth={true}
          onChange={this.handleFieldChange}
          value={this.state.initialStopDistance}
        />
        <TextField
          floatingLabelText='Perdida minima (dolares)'
          name='finalStopDistance'
          type='number'
          fullWidth={true}
          onChange={this.handleFieldChange}
          value={this.state.finalStopDistance}
        />
        <TextField
          floatingLabelText='Pasos para la perdida minima'
          name='stepsToFinal'
          type='number'
          fullWidth={true}
          onChange={this.handleFieldChange}
          value={this.state.stepsToFinal}
        />
        <SelectField
          floatingLabelText='Método de reducción de perdida'
          value={this.state.method}
          onChange={this.handleMethodChange}
          name='method'
          fullWidth={true}
        >
          <MenuItem value='exponential' primaryText='Exponencial' />
          <MenuItem value='linear' primaryText='Lineal' />
        </SelectField>
        <TextField
          floatingLabelText='Poner limit __ dolares por debajo del stop'
          name='limitDelta'
          type='number'
          fullWidth={true}
          onChange={this.handleFieldChange}
          value={this.state.limitDelta}
        />
        <AmountField
          customTitle='Cantidad a vender'
          amount={this.state.amount}
          type={this.state.amountType}
          onAmountChange={this.handleChange}
          onTypeChange={this.handleChange}
        />
        <TextField
          floatingLabelText='Número de pasos a crear'
          name='stepQty'
          type='number'
          fullWidth={true}
          onChange={this.handleFieldChange}
          value={this.state.stepQty}
        />
        Se generarán {genQty} acciones
      </GeneratorCard>
    )
  }
}

export default UpstairsClosingGeneratorCard
