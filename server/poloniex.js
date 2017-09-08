const { async: _async, await: _await } = require('asyncawait')
const { UserConfig } = require('./db/models')
const Poloniex = require('poloniex.js')

const getApi = _async ((userId) => {
  const {
    poloniexApiKey: key,
    poloniexSecret: secret,
  } = _await (UserConfig.findOne({where: {userId}}))
  return new Poloniex(key, secret)
})

exports.balances = _async ((userId) => {
  const poloniex = _await (getApi(userId))
  return new Promise((resolve, reject) => {
    poloniex.returnBalances((err, data) => {
      if (err)
        return reject(err)
      resolve(data)

    })
  })
})

exports.buy = _async ((userId, currencyA, currencyB, rate, amount) => {
  const poloniex = _await (getApi(userId))
  return new Promise((resolve, reject) => {
    poloniex.buy(currencyA, currencyB, rate, amount, (err, data) => {
      if (err)
        return reject(err)
      resolve(data)
    })
  })
})

exports.sell = _async ((userId, currencyA, currencyB, rate, amount) => {
  const poloniex = _await (getApi(userId))
  return new Promise((resolve, reject) => {
    poloniex.sell(currencyA, currencyB, rate, amount, (err, data) => {
      if (err)
        return reject(err)
      resolve(data)
    })
  })
})
