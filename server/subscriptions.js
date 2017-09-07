const { async: _async, await: _await } = require('asyncawait')
const { Subscription } = require('../db/models')

exports.register = _async((req, res, next) => {
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

    _await (Subscription.create({userId, subscription}))
    res.json({success: true})
  } catch(err) {
    next(err)
  }
})

exports.unregister = _async((req, res, next) => {
  try {
    const userId = req.user.sub
    const userEndpoint = req.body.endpoint
    const subscriptions = _await (Subscription.findAll({where: {userId}}))

    const rowToEndpoint = row =>
      JSON.parse(row.subscription).endpoint
    const toDestroy = subscriptions.filter(sub =>
      rowToEndpoint(sub) === userEndpoint
    )
    const destroyPromises = toDestroy.map(sub => sub.destroy())
    _await (Promise.all(destroyPromises))

    res.json({success: true, alteredRows: toDestroy.length})
  } catch(err) {
    next(err)
  }
})

exports.isSubscribed = _async((req, res, next) => {
  try {
    const userId = req.user.sub
    const userEndpoint = req.query.endpoint
    const rows = _await (Subscription.findAll({where: {userId}}))

    // Here we assume the subscriptions in the database are valid JSON
    const rowToEndpoint = row =>
      JSON.parse(row.subscription).endpoint

    const savedEndpoints = rows.map(rowToEndpoint)
    const isSubscribed = savedEndpoints.some(se => se === userEndpoint)
    res.json({success: true, isSubscribed})
  } catch(err) {
    next(err)
  }
})
