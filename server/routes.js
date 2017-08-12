const Router = require('express').Router
const actionHandlers = require('./actions')
const Sequelize = require('sequelize')

const actions = Router()

actions.get('/', actionHandlers.list)

actions.get('/:id', actionHandlers.detail)

actions.put('/:id', actionHandlers.update)

actions.post('/', actionHandlers.create)

actions.delete('/:id', actionHandlers.delete)

// Error handler
actions.use((error, req, res, next) => {
  try {
    if (error instanceof Sequelize.ValidationError)
    error = {
      message: JSON.stringify(error.errors),
      name: error.name
    }
    else if (error.message === 'not found')
    error = {
      message: 'Action not found',
      name: 'NotFoundError',
      code: 'not_found'
    }
    else
    error = {
      message: error.message
    }
    res.json({ success: false, error })

  } catch (err) {
    console.log(err)
  }
})

exports.actions = actions
