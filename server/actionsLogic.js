import * as actionHandlers from './actions'
import { Action } from './db/models'
import Ticker from './utils/ticker'

const CURRENCY_PAIR = 'USDT_BTC'

const ticker = new Ticker([CURRENCY_PAIR], 1000)
ticker.on('ticker', handleTicker)
ticker.on('error', err => console.log(err))

// Judge wether an action is due
const isDue = currPrice => action => {
  if (!action.enabled) return false
  if (action.check)
    switch (action.check) {
    case 'gt':
      return Number(currPrice) >= action.value
    case 'lt':
      return Number(currPrice) <= action.value
    default:
      return false
    }
  return true
}

let lock = false

async function handleTicker(_, {last: currPrice}) {
  if (lock) return
  lock = true

  try {
    // Get the actions we ought to do and tag them with their index in the array
    const allActions = await Action.findAll()
    const actionsToDo = allActions.filter(isDue(currPrice))

    // Execute and remove each one of them
    for (const action of actionsToDo) {
      const handler = actionHandlers[action.type]
      if (!handler) {
        console.log('Unsupported action type: ' + action.type)
        continue
      }
      await handler(action, currPrice)

      await action.destroy()
    }
  } finally {
    lock = false
  }
}

ticker.start()
