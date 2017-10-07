import {
  generateStair,
  generateClosingStair,
  definePrefix,
  Direction,
} from './generatorUtils'
import fields from './generatorFields'

export const upstairs = {
  title: 'Escalera para venta',
  description: 'Generar acciones por pasos para ir moviendo un stop limit mientras el precio sube hasta que la tendencia se revierta',
  fields: [
    fields.minValueToActionSell,
    fields.step,
    fields.stopDistance,
    fields.limitDeltaSell,
    fields.stepQty,
  ],
  amountFieldTitle: 'Cantidad a Vender',
  generate(fields, amount, amountType, existingActions) {
    // When amountType === 'percentage', amount is expected
    // to be between 0 and 1
    const params = {
      direction: Direction.UPSTAIRS,
      ...fields,
      amount,
      amountType,
      existingActions,
    }

    return generateStair(params)
  },
  genQty(fields) {
    return fields.stepQty * 4 - 1
  },
}

export const downstairs = {
  title: 'Escalera para compra',
  description: 'Generar acciones por pasos para ir moviendo un stop limit mientras el precio baja hasta que la tendencia se revierta',
  fields: [
    fields.minValueToActionBuy,
    fields.step,
    fields.stopDistance,
    fields.limitDeltaBuy,
    fields.stepQty,
  ],
  amountFieldTitle: 'Cantidad a Comprar',
  generate(fields, amount, amountType, existingActions) {
    const params = {
      direction: Direction.DOWNSTAIRS,
      ...fields,
      amount,
      amountType,
      existingActions,
    }

    return generateStair(params)
  },
  genQty(fields) {
    return fields.stepQty * 4 - 1
  },
}

export const closingUpstairs = {
  title: 'Escalera para venta en corto',
  description: 'Generar acciones por pasos para ir moviendo un stop limit con una perdida cada vez menor',
  fields: [
    fields.minValueToActionSell,
    fields.step,
    fields.initialStopDistance,
    fields.finalStopDistance,
    fields.stepsToFinal,
    fields.limitDeltaSell,
    fields.stepQty,
    fields.method,
  ],
  amountFieldTitle: 'Cantidad a Vender',
  generate(fields, amount, amountType, existingActions) {
    const params = {
      direction: Direction.UPSTAIRS,
      ...fields,
      amount,
      amountType,
      existingActions,
    }

    return generateClosingStair(params)
  },
  genQty(fields) {
    return fields.stepQty * 4 - 1
  },
}

export const closingDownstairs = {
  title: 'Escalera para compra en corto',
  description: 'Generar acciones por pasos para ir moviendo un stop limit con una perdida cada vez menor',
  fields: [
    fields.minValueToActionBuy,
    fields.step,
    fields.initialStopDistance,
    fields.finalStopDistance,
    fields.stepsToFinal,
    fields.limitDeltaBuy,
    fields.stepQty,
    fields.method,
  ],
  amountFieldTitle: 'Cantidad a Comprar',
  generate(fields, amount, amountType, existingActions) {
    const params = {
      direction: Direction.DOWNSTAIRS,
      ...fields,
      amount,
      amountType,
      existingActions,
    }

    return generateClosingStair(params)
  },
  genQty(fields) {
    return fields.stepQty * 4 - 1
  },
}

export const stopLimit = {
  title: 'Stop limit',
  description: 'Stop limit similar al de Poloniex',
  fields: [
    fields.stop,
    fields.limit,
    fields.type,
  ],
  generate(fields, amount, amountType, existingActions) {
    const typeIsSell = fields.type === 'sell'
    const prefix = definePrefix(typeIsSell, existingActions)

    const actions = []
    // Stop
    actions.push({
      name: `${prefix} Stop`,
      type: 'enable',
      triggerName: `${prefix} Limit`,
      check: typeIsSell ? 'gt' : 'lt',
      value: fields.stop,
      enabled: true,
    })
    // Limit
    actions.push({
      name: `${prefix} Limit`,
      type: fields.type,
      value: fields.limit,
      enabled: false,
      amount,
      amountType,
    })

    return actions
  },
  genQty() {
    return 2
  },
}
