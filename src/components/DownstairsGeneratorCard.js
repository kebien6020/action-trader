import React, { Component } from 'react'
import GeneratorCard from  './GeneratorCard'
import TextField from 'material-ui/TextField'
import { generateStair, Direction, createAction } from './generatorUtils'

class UpstairsGeneratorCard extends Component {
  state = {
    progress: null,
    initialValue: '',
    step: 20,
    stopDistance: 60,
    limitDelta: 2,
    stepQty: 20,
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

    const params = {
      direction: Direction.DOWNSTAIRS,
      initialValue,
      step,
      stopDistance,
      limitDelta,
      stepQty,
      existingActions: this.props.actions
    }
    // Generate the stair of actions
    const stair = generateStair(params)

    // Actually create actions on the server
    for (let i = 0; i < stair.length; ++i) {
      const action = stair[i]
      // TODO: handle network errors
      await createAction(action, this.props.auth)
      const progress = Math.ceil(i / stair.length * 100)
      this.setState({progress})
    }

    // We are done. Reset progress indicator and call back to the parent
    this.setState({progress: null})
    const cb = this.props.onGenerate
    if (cb) cb(stair)
  }

  handleFieldChange = event => {
    const { name, value } = event.target
    this.setState({[name]: Number(value)})
  }

  render () {
    let genQty = this.state.stepQty * 4 - 1
    if (genQty < 0) genQty = 0

    return (
      <GeneratorCard
        title='Escalera para compra'
        subtitle='Generar acciones por pasos para ir moviendo un stop limit mientras el precio baja hasta que la tendencia se revierta'
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
          floatingLabelText='Poner stop limit __ dolares por encima'
          name='stopDistance'
          type='number'
          fullWidth={true}
          onChange={this.handleFieldChange}
          value={this.state.stopDistance}
        />
        <TextField
          floatingLabelText='Poner limit __ dolares por encima del stop'
          name='limitDelta'
          type='number'
          fullWidth={true}
          onChange={this.handleFieldChange}
          value={this.state.limitDelta}
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
