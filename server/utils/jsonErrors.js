import Sequelize from 'sequelize'
import jwt from 'express-jwt'

export default function jsonErrorHandler(error, req, res, next) {
  try {
    let response = {
      message: 'Unknown error',
      code: 'unknown_error',
    }

    if (!error || !(error instanceof Error))
      response = {
        message: 'Unknown error',
        code: 'unknown_error',
      }
    else if (error instanceof Sequelize.ValidationError)
      response = {
        message: 'One or more database contraints did not pass',
        code: 'validation_error',
        errors: error.errors
      }
    else if (error instanceof jwt.UnauthorizedError)
      response = {
        message: error.message,
        code: 'unauthorized_error',
        error: error
      }
    else if (error.name === 'Error')
      response = {
        message: error.message,
        code: 'unknown_error',
      }
    else if (error.message && error.name)
      response = {
        message: error.message,
        code: error.name
      }

    console.log(req.url, response, error)

    res.json({ success: false, error: response })
  } catch (err) {
    console.error('Error while handling error', err)
    console.error('The original error was', error)
  }
}
