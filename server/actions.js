const { Action, Sequelize } = require('../db/models')
const { async, await } = require('asyncawait')

exports.list = async ((req, res) => {
  let response = null
  try {
    const actions = await (Action.findAll())
    response = {success: true, actions}
  } catch (error) {
    response = {success: false, error}
  }
  res.json(response)
})

exports.detail = async ((req, res) => {
  const actionId = req.params.id
  let response = null
  try {
    const action = await (Action.findById(actionId))
    if (action === null)
      throw Error('not found')
    response = {success: true, action}
  } catch (error) {
    response = {success: false, error}
  }
  res.json(response)
})

exports.update = async ((req, res) => {
  const actionId = req.params.id
  let response = null
  try {
    const action = await (Action.findById(actionId))
    await (action.update(req.body, {fields}))
    response = {success: true, action}
  } catch (error) {
    response = {success: false, error}
  }
  res.json(response)
})

exports.create = async ((req, res) => {
  let response = null
  try {
    const action = await (Action.create(req.body, {fields}))
    response = {success: true, action}
  } catch (error) {
    if (error instanceof Sequelize.ValidationError && error.get('name'))
      response = {success: false, error: {
        message: 'The name of the action must be unique',
        name: 'ValidatinError',
        code: 'name_unique',
      }}
    else
      response = {success: false, error}
  }
  res.json(response)
})

exports.delete = async ((req, res) => {
  const actionId = req.params.id
  let response = null
  try {
    const action = await (Action.findById(actionId))
    if (action === null)
      throw Error('not found')
    await (action.destroy())
    response = {success: true}
  } catch (error) {
    response = {success: false, error}
  }
  res.json(response)
})
