const { Action } = require('./db/models')
const { async: _async, await: _await } = require('asyncawait')
const Ticker = require('./ticker')
const push = require('./push').default
const poloniex = require('./poloniex')

//
// Poloniex ticker logic
//

const CURRENCY_PAIR = 'USDT_BTC'

const ticker = new Ticker([CURRENCY_PAIR], 1000)

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

const getTarget = ({triggerName, owner}) => {
  return (Action.findOne({
    where: {name: triggerName, owner}
  }))
}

let lock = false

const handleTicker = _async ((_, {last: currPrice}) => {
  if (lock) return
  // console.log('Ticker: ' + currPrice)
  lock = true
  try {
    // Get the actions we ought to do and tag them with their index in the array
    const actionsToDo = _await (Action.findAll())
      .filter(isDue(currPrice))

    // Execute and remove each one of them
    for (const action of actionsToDo) {
      switch (action.type) {
      case 'enable': {
        const target = _await (getTarget(action))
        let targetName = 'NOT FOUND'
        if(target) {
          target.enabled = true
          targetName = target.name
          _await (target.save())
        }
        console.log(`Action ${action.name} triggered at ${currPrice}, enabling action ${targetName}`)
        push(action.owner, `Accion tipo habilitar: ${action.name}`)
        break
      }
      case 'disable': {
        const target = _await (getTarget(action))
        let targetName = 'NOT FOUND'
        if(target) {
          targetName = target.name
          target.enabled = false
          _await (target.save())
        }
        console.log(`Action ${action.name} triggered at ${currPrice}, disabling action ${targetName}`)
        break
      }
      case 'sell': {
        const balances = _await (poloniex.balances(action.owner))
        const currBTC = Number(balances.BTC)
        let amount = null
        const actionAmountBTC = action.amount / action.value
        if (action.amountType === 'percentage')
          amount = currBTC * action.amount
        else
          // action.amountType === 'absolute'
          amount = Math.min(currBTC, actionAmountBTC)

        try {
          _await (poloniex.sell(action.owner, 'USDT', 'BTC', action.value, amount))
          console.log(`Selling ${amount} BTC at ${action.value}`)
          push(action.owner, `Alerta: Vender ${amount}BTC a ${action.value}USD`)
        } catch (err) {
          console.log(err)
          push(action.owner, `Error al colocar orden de venta ${err}`)
        }
        break
      }
      case 'buy': {
        const balances = _await (poloniex.balances(action.owner))
        const currUSD = Number(balances.USDT)
        let amount = null
        if (action.amountType === 'percentage')
          amount = currUSD * action.amount
        else
          // action.amountType === 'absolute'
          amount = Math.min(currUSD, action.amount)

        const amountBTC = amount / action.value
        try {
          _await (poloniex.buy(action.owner, 'USDT', 'BTC', action.value, amountBTC))
          console.log(`Buying ${amount} USD at ${action.value}`)
          push(action.owner, `Comprando ${amount}USD a ${action.value}USD`)
        } catch (err) {
          console.log(err)
          push(action.owner, `Error al colocar orden de compra ${err}`)
        }
        break

      }
      default:
        console.log('Unsupported action type: ' + action.type)
      }

      _await (action.destroy())
    }
  } finally {
    lock = false
  }
})

ticker.on('ticker', handleTicker)
ticker.on('error', err => console.log(err))
ticker.start()
