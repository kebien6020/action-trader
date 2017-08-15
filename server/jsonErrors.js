const Sequelize = require('sequelize')

module.exports = function jsonErrorHandler(error, req, res, next) {
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
}
