import { Subscription } from './db/models'
import webpush from 'web-push'

const vapidKeys = {
  publicKey: process.env.REACT_APP_SUBSCRIBE_PUBLIC_KEY,
  privateKey: process.env.SUBSCRIBE_PRIVATE_KEY
}

let detailsWereSet = false

export function init() {
  detailsWereSet = true
  webpush.setVapidDetails(
    'mailto:kevin.pena.prog@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  )
}

export default async function push(userId, data) {
  if (!detailsWereSet) init()

  const subs = await Subscription.findAll({where: {userId}})

  for (const sub of subs) {
    const parsed = JSON.parse(sub.subscription)
    webpush.sendNotification(parsed, data)
  }
}
