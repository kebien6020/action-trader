const { async, await } = require('asyncawait')

exports.register = async((req, res) => {
  res.json({success: false, error: {code: 'not_impemented'}})
})

exports.unregister = async((req, res) => {
  res.json({success: false, error: {code: 'not_impemented'}})
})

exports.isSubscribed = async((req, res) => {
  res.json({success: false, error: {code: 'not_impemented'}})
})
