const { async, await } = require('asyncawait')
const { UserConfig } = require('../db/models')
const Poloniex = require('poloniex.js')

const getApi = async ((userId) => {
  const {
    poloniexApiKey: key,
    poloniexSecret: secret,
  } = await (UserConfig.findOne({where: {userId}}))
  return new Poloniex(key, secret)
})

exports.balances = async ((userId) => {
  const poloniex = await (getApi(userId))
  return new Promise((resolve, reject) => {
    poloniex.returnBalances((err, data) => {
      if (err)
        return reject(err)
      resolve(data)

    })
  })
})

exports.buy = async ((userId, currencyA, currencyB, rate, amount) => {
  const poloniex = await (getApi(userId))
  return new Promise((resolve, reject) => {
    poloniex.buy(currencyA, currencyB, rate, amount, (err, data) => {
      if (err)
        return reject(err)
      resolve(data)
    })
  })
})

exports.sell = async ((userId, currencyA, currencyB, rate, amount) => {
  const poloniex = await (getApi(userId))
  return new Promise((resolve, reject) => {
    poloniex.sell(currencyA, currencyB, rate, amount, (err, data) => {
      if (err)
        return reject(err)
      resolve(data)
    })
  })
})
