import React from 'react'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

const AmountField = (props) => (
  <div style={{display: 'flex'}}>
    <TextField
      floatingLabelText={props.customTitle || 'Cantidad'}
      value={props.amount}
      onChange={(event) => props.onAmountChange('amount', Number(event.target.value))}
      name='amount'
      type='number'
      style={{flex: '4'}}
    />
    <SelectField
      floatingLabelText='Unidad'
      value={props.type}
      onChange={(_, __, value) => props.onTypeChange('amountType', value)}
      name='amountType'
      style={{flex: '1'}}
    >
      <MenuItem value='percentage' primaryText='%' />
      <MenuItem value='absolute' primaryText='USD' />
    </SelectField>
  </div>
)

export default AmountField
