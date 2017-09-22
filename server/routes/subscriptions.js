import { Subscription } from '../db/models'

export async function register(req, res, next) {
  try {
    const userId = req.user.sub
    const { subscription } = req.body

    // Verify subscription as valid JSON with endpoint
    // property
    let isValid = true
    try {
      isValid = JSON.parse(subscription).hasOwnProperty('endpoint')
    } catch (err) {
      isValid = false
    }
    if (!isValid)
      throw Error(
        'The subscription is not a valid JSON object ' +
        'with an endpoint property.'
      )

    await Subscription.create({userId, subscription})
    res.json({success: true})
  } catch(err) {
    next(err)
  }
}

export async function unregister(req, res, next) {
  try {
    const userId = req.user.sub
    const userEndpoint = req.body.endpoint
    const subscriptions = await Subscription.findAll({where: {userId}})

    const rowToEndpoint = row =>
      JSON.parse(row.subscription).endpoint
    const toDestroy = subscriptions.filter(sub =>
      rowToEndpoint(sub) === userEndpoint
    )
    const destroyPromises = toDestroy.map(sub => sub.destroy())
    await Promise.all(destroyPromises)

    res.json({success: true, alteredRows: toDestroy.length})
  } catch(err) {
    next(err)
  }
}

export async function isSubscribed(req, res, next) {
  try {
    const userId = req.user.sub
    const userEndpoint = req.query.endpoint
    const rows = await Subscription.findAll({where: {userId}})

    // Here we assume the subscriptions in the database are valid JSON
    const rowToEndpoint = row =>
      JSON.parse(row.subscription).endpoint

    const savedEndpoints = rows.map(rowToEndpoint)
    const isSubscribed = savedEndpoints.some(se => se === userEndpoint)
    res.json({success: true, isSubscribed})
  } catch(err) {
    next(err)
  }
}
