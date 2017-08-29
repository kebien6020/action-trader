const { async, await } = require('asyncawait')
const { UserConfig } = require('../db/models')
const Poloniex = require('poloniex.js')

exports.balances = async ((userId) => {
  const {
    poloniexApiKey: key,
    poloniexSecret: secret,
  } = await (UserConfig.findOne({where: {userId}}))
  const poloniex = new Poloniex(key, secret)
  return new Promise((resolve, reject) => {
    poloniex.returnBalances((err, data) => {
      if (err)
        return reject(err)
      resolve(data)

    })
  })
})
