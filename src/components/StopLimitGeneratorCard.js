import React, { Component } from 'react'
import GeneratorCard from  './GeneratorCard'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import { definePrefix, createAction } from './generatorUtils'

class StopLimitGeneratorCard extends Component {
  state = {
    progress: null,
    stop: '',
    limit: '',
    type: 'sell',
  }

  handleFieldChange = event => {
    const { name, value } = event.target
    this.setState({[name]: Number(value)})
  }

  handleChangeType = (_, __, type) => {
    this.setState({type})
  }

  handleGenerate = async () => {
    const typeIsSell = this.state.type === 'sell'
    const prefix = definePrefix(typeIsSell, this.props.actions)

    const actions = []
    // Stop
    actions.push({
      name: `${prefix} Stop`,
      type: 'enable',
      triggerName: `${prefix} Limit`,
      check: typeIsSell ? 'lt' : 'gt',
      value: this.state.stop,
      enabled: true,
    })
    // Limit
    actions.push({
      name: `${prefix} Limit`,
      type: this.state.type,
      value: this.state.limit,
      enabled: false,
    })

    // Actually create actions on the server
    for (let i = 0; i < actions.length; ++i) {
      const action = actions[i]
      // TODO: handle network errors
      await createAction(action, this.props.auth)
      const progress = Math.ceil(i / actions.length * 100)
      this.setState({progress})
    }

    // We are done. Reset progress indicator and call back to the parent
    this.setState({progress: null})
    const cb = this.props.onGenerate
    if (cb) cb(actions)
  }

  render () {
    return (
      <GeneratorCard
        title='Stop limit'
        subtitle='Stop limit similar al de Poloniex.'
        progress={this.state.progress}
        onGenerate={this.handleGenerate}
      >
        <TextField
          floatingLabelText='Stop'
          name='stop'
          type='number'
          fullWidth={true}
          onChange={this.handleFieldChange}
          value={this.state.stop}
        />
        <TextField
          floatingLabelText='Limit'
          name='limit'
          type='number'
          fullWidth={true}
          onChange={this.handleFieldChange}
          value={this.state.limit}
        />
        <SelectField
          floatingLabelText='Tipo'
          value={this.state.type}
          onChange={this.handleTypeChange}
          name='type'
          fullWidth={true}
        >
          <MenuItem value='sell' primaryText='Vender' />
          <MenuItem value='buy' primaryText='Comprar' />
        </SelectField>
      </GeneratorCard>
    )
  }
}

export default StopLimitGeneratorCard
