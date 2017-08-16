const { async, await } = require('asyncawait')
const { Subscription } = require('../db/models')
const webpush = require('web-push')

const vapidKeys = {
  publicKey: process.env.REACT_APP_SUBSCRIBE_PUBLIC_KEY,
  privateKey: process.env.SUBSCRIBE_PRIVATE_KEY
}

webpush.setVapidDetails(
  'mailto:kevin.pena.prog@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

module.exports = async ((req, res, next) => {
  try {
    const userId = req.user.sub
    const subs = await (Subscription.findAll({where: {userId}}))
    for (const sub of subs) {
      const parsed = JSON.parse(sub.subscription)
      webpush.sendNotification(parsed, 'Hola desde el server')
    }

    res.json({success: true})
  } catch (err) { next(err) }
})
