const Router = require('express').Router
const actionHandlers = require('./actions')

const actions = Router()

actions.get('/', actionHandlers.list)

actions.get('/:id', actionHandlers.detail)

actions.put('/:id', actionHandlers.update)

actions.post('/', actionHandlers.create)

actions.delete('/:id', actionHandlers.delete)

// Error handler
actions.use((error, req, res, next) => {

  if (error instanceof Sequelize.ValidationError && error.get('name'))
    error = {
      message: 'The name of the action must be unique',
      name: 'ValidationError',
      code: 'name_unique',
    }
  else if (error.message === 'not found')
    error = {
      message: 'Action not found',
      name: 'NotFoundError',
      code: 'not_found'
    }
  res.json({ success: false, error })
})

exports.actions = actions
