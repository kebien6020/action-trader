const { UserConfig } = require('../db/models')
const { async, await } = require('asyncawait')

exports.getPoloniex = async ((req, res, next) => {
  try {
    const userId = req.user.sub
    const userConfig =
      await (UserConfig.findOne({where: {userId}}))

    if (userConfig === null)
      return res.json({
        success: true,
        poloniexApiKey: null,
        poloniexSecret: null,
      })

    const { poloniexApiKey, poloniexSecret } = userConfig

    res.json({success: true, poloniexApiKey, poloniexSecret})
  } catch (err) {
    next(err)
  }
})

exports.updatePoloniex = async ((req, res, next) => {
  try {
    const userId = req.user.sub
    const { poloniexApiKey, poloniexSecret } = req.body
    const userConfig = await (UserConfig.findOne({where: {userId}}))
    if (userConfig === null) {
      const newConfig =
        await (UserConfig.create({
          userId,
          poloniexApiKey,
          poloniexSecret,
        }))

      return res.json({
        success: true,
        poloniexApiKey: newConfig.poloniexApiKey,
        poloniexSecret: newConfig.poloniexSecret,
      })
    } else {
      // Already existed, just update
      userConfig.poloniexApiKey = poloniexApiKey
      userConfig.poloniexSecret = poloniexSecret
      const newConfig = await (userConfig.save())
      return res.json({
        success: true,
        poloniexApiKey: newConfig.poloniexApiKey,
        poloniexSecret: newConfig.poloniexSecret,
      })
    }
  } catch (err) {
    next(err)
  }
})
