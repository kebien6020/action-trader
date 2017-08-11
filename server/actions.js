const { Action, Sequelize } = require('../db/models')
const { async, await } = require('asyncawait')

const fields = [
  'name',
  'type',
  'check',
  'value',
  'triggerId',
  'enabled'
]

exports.list = async ((req, res, next) => {
  try {
    const actions = await (Action.findAll())
    res.json({success: true, actions})
  } catch (err) { next(err) }
})

exports.detail = async ((req, res, next) => {
  try {
    const actionId = req.params.id
    const action = await (Action.findById(actionId))
    if (action === null)
      throw Error('not found')
    res.json({success: true, action})
  } catch (err) { next(err) }
})

exports.update = async ((req, res, next) => {
  try {
    const actionId = req.params.id
    const action = await (Action.findById(actionId))
    await (action.update(req.body, {fields}))
    res.json({success: true, action})
  } catch (err) { next(err) }
})

exports.create = async ((req, res, next) => {
  try {
    const action = await (Action.create(req.body, {fields}))
    res.json({success: true, action})
  } catch (err) { next(err) }
})

exports.delete = async ((req, res, next) => {
  try {
    const actionId = req.params.id
    const action = await (Action.findById(actionId))
    if (action === null)
      throw Error('not found')
    await (action.destroy())
    res.json({success: true})
  } catch (err) { next(err) }
})
