import { UserConfig } from '../db/models'
import Poloniex from 'poloniex.js'

async function _getApi(userId) {
  const {
    poloniexApiKey: key,
    poloniexSecret: secret,
  } = await UserConfig.findOne({where: {userId}})

  return new Poloniex(key, secret)
}

export async function balances(userId, getApi = _getApi) {
  const poloniex = await getApi(userId)
  return new Promise((resolve, reject) => {
    poloniex.returnBalances((err, data) => {
      if (err)
        return reject(err)
      resolve(data)

    })
  })
}

export async function buy(userId, currencyA, currencyB, rate, amount, getApi = _getApi) {
  const poloniex = await getApi(userId)
  return new Promise((resolve, reject) => {
    poloniex.buy(currencyA, currencyB, rate, amount, (err, data) => {
      if (err)
        return reject(err)
      resolve(data)
    })
  })
}

export async function sell(userId, currencyA, currencyB, rate, amount, getApi = _getApi) {
  const poloniex = await getApi(userId)
  return new Promise((resolve, reject) => {
    poloniex.sell(currencyA, currencyB, rate, amount, (err, data) => {
      if (err)
        return reject(err)
      resolve(data)
    })
  })
}
