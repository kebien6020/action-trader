export default {
  minValueToActionSell: {
    name: 'minValueToAction',
    text: 'Vender minimo en',
    type: 'number',
    default: '',
  },
  minValueToActionBuy: {
    name: 'minValueToAction',
    text: 'Comprar minimo en',
    type: 'number',
    default: '',
  },
  step: {
    name: 'step',
    text: 'Crear paso cada __ dolares',
    type: 'number',
    default: 20
  },
  stopDistance: {
    name: 'stopDistance',
    text: 'Pérdida',
    type: 'number',
    default: 60
  },
  initialStopDistance: {
    name: 'initialStopDistance',
    text: 'Pérdida inicial (dolares)',
    type: 'number',
    default: 50,
  },
  finalStopDistance: {
    name: 'finalStopDistance',
    text: 'Pérdida minima (dolares)',
    type: 'number',
    default: 10,
  },
  stepsToFinal: {
    name: 'stepsToFinal',
    text: 'Pasos para la pérdida minima',
    type: 'number',
    default: 9,
  },
  limitDeltaSell: {
    name: 'limitDelta',
    text: 'Poner limit __ dolares por debajo del stop',
    type: 'number',
    default: 2,
  },
  limitDeltaBuy: {
    name: 'limitDelta',
    text: 'Poner limit __ dolares por encima del stop',
    type: 'number',
    default: 2,
  },
  stepQty: {
    name: 'stepQty',
    text: 'Número de pasos a crear',
    type: 'number',
    default: 100,
  },
  method: {
    name: 'method',
    text: 'Método de reducción de perdida',
    type: 'multi',
    default: 'linear',
    options: {
      'linear': 'Lineal',
      'exponential': 'Exponencial',
    },
  },
  stop: {
    name: 'stop',
    text: 'Stop',
    type: 'number',
    default: '',
  },
  limit: {
    name: 'limit',
    text: 'Limit',
    type: 'number',
    default: '',
  },
  type: {
    name: 'type',
    text: 'Tipo',
    type: 'multi',
    default: 'sell',
    options: {
      'sell': 'Vender',
      'buy': 'Comprar',
    },
  }
}
