import { Action } from './db/models'
import push from './utils/push'
import poloniex from './utils/poloniex'

async function getTarget({triggerName, owner}) {
  const opts = {
    where: {name: triggerName, owner}
  }
  return Action.findOne(opts)
}

async function setEnabled(action, enabled) {
  const target = await getTarget(action)
  let targetName = 'NOT FOUND'
  if(target) {
    target.enabled = enabled
    targetName = target.name
    await target.save()
  }
  return targetName
}

export async function enable(action, currPrice) {
  const targetName = await setEnabled(action, true)
  console.log(`Action ${action.name} triggered at ${currPrice}, enabling action ${targetName}`)
  push(action.owner, `Accion tipo habilitar: ${action.name}`)
}

export async function disable(action, currPrice) {
  const targetName = await setEnabled(action, false)
  console.log(`Action ${action.name} triggered at ${currPrice}, disabling action ${targetName}`)
}

export async function sell(action, currPrice) {
  const balances = await poloniex.balances(action.owner)
  const currBTC = Number(balances.BTC)
  let amount = null
  const actionAmountBTC = action.amount / action.value
  if (action.amountType === 'percentage')
    amount = currBTC * action.amount
  else // action.amountType === 'absolute'
    amount = Math.min(currBTC, actionAmountBTC)

  try {
    await poloniex.sell(action.owner, 'USDT', 'BTC', action.value, amount)
    console.log(`Selling ${amount} BTC at ${action.value}`)
    push(action.owner, `Alerta: Vender ${amount}BTC a ${action.value}USD`)
  } catch (err) {
    console.log(err)
    push(action.owner, `Error al colocar orden de venta ${err}`)
  }
}

export async function buy(action, currPrice) {
  const balances = await poloniex.balances(action.owner)
  const currUSD = Number(balances.USDT)
  let amount = null
  if (action.amountType === 'percentage')
    amount = currUSD * action.amount
  else // action.amountType === 'absolute'
    amount = Math.min(currUSD, action.amount)

  const amountBTC = amount / action.value
  try {
    await poloniex.buy(action.owner, 'USDT', 'BTC', action.value, amountBTC)
    console.log(`Buying ${amount} USD at ${action.value}`)
    push(action.owner, `Comprando ${amount}USD a ${action.value}USD`)
  } catch (err) {
    console.log(err)
    push(action.owner, `Error al colocar orden de compra ${err}`)
  }
}
