import React, { Component } from 'react'
import GeneratorCard from  './GeneratorCard'
import AmountField from './AmountField'
import TextField from 'material-ui/TextField'
import { generateStair, Direction } from '../common/generatorUtils'
import { createActions } from '../api'

class UpstairsGeneratorCard extends Component {
  state = {
    progress: null,
    initialValue: '',
    step: 20,
    stopDistance: 60,
    limitDelta: 2,
    stepQty: 20,
    amount: '100',
    amountType: 'percentage',
  }

  handleGenerateStairs = async () => {
    // Gather all the information to generate the stair
    const {
      initialValue,
      step,
      stopDistance,
      limitDelta,
      stepQty,
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
      initialValue,
      step,
      stopDistance,
      limitDelta,
      stepQty,
      existingActions: this.props.actions,
      amount,
      amountType,
    }
    // Generate the stair of actions
    const stair = generateStair(params)

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

  render () {
    let genQty = this.state.stepQty * 4 - 1
    if (genQty < 0) genQty = 0

    return (
      <GeneratorCard
        title='Escalera para venta'
        subtitle='Generar acciones por pasos para ir moviendo un stop limit mientras el precio sube hasta que la tendencia se revierta'
        progress={this.state.progress}
        onGenerate={this.handleGenerateStairs}
      >
        <TextField
          floatingLabelText='Primer paso'
          name='initialValue'
          type='number'
          fullWidth={true}
          onChange={this.handleFieldChange}
          value={this.state.initialValue}
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
          floatingLabelText='Poner stop limit __ dolares por debajo'
          name='stopDistance'
          type='number'
          fullWidth={true}
          onChange={this.handleFieldChange}
          value={this.state.stopDistance}
        />
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

export default UpstairsGeneratorCard
