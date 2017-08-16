const { async, await } = require('asyncawait')
const { Subscription } = require('../db/models')

exports.register = async((req, res, next) => {
  try {
    const userId = req.user.sub
    const { subscription } = req.body
    // TODO: Verificate subscription as valid
    await (Subscription.create({userId, subscription}))
    res.json({success: true})
  } catch(err) { next(err) }
})

exports.unregister = async((req, res, next) => {
  try {
    const userId = req.user.sub
    const sub = await (Subscription.findOne({where: {userId}}))
    if (sub === null)
      throw Error('not found')
    await (sub.destroy())
    res.json({success: true})
  } catch(err) { next(err) }
})

exports.isSubscribed = async((req, res, next) => {
  try {
    const userId = req.user.sub
    const count = await (Subscription.count({where: {userId}}))
    const isSubscribed = count > 0
    res.json({success: true, isSubscribed})
  } catch(err) { next(err) }
})
