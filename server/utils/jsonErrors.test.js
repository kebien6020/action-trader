import jsonErrorHandler from './jsonErrors'
import { mockReq, mockRes, testUrl } from './testUtils'
import Sequelize from 'sequelize'
import jwt from 'express-jwt'

const invalidErrors = [
  null,
  undefined,
  true,
  Error('some message'),
]

const validErrors = [
  new Sequelize.ValidationError(null, [
    new Sequelize.ValidationErrorItem(
      'name must be unique',
      'unique violation',
      'name',
      '1'
    ),
    new Sequelize.ValidationErrorItem(
      'owner must be unique',
      'unique violation',
      'owner',
      'test-user'
    )
  ])
]

describe('jsonErrorHandler', () => {
  // If you need a custom mock just override inside
  // the test case using scoping
  let req = mockReq()
  let res = mockRes()
  const next = () => {
    throw Error('next should never be called')
  }

  beforeEach(() => {
    // Reset mocks
    req = mockReq()
    res = mockRes()
    // Re-enable console
    if (console.log.mockRestore)
      console.log.mockRestore()
  })

  // console.log is disabled explicitly inside every test
  // to avoid confusion and allow logging while tinkering
  const disableConsole = () =>
    jest.spyOn(console, 'log').mockImplementation(() => {})

  // express' error handlers are differentiated from normal
  // middleware in that error handlers accept 4 parameters
  it('expects 4 parameters', () => {
    expect(jsonErrorHandler).toBeInstanceOf(Function)
    expect(jsonErrorHandler).toHaveLength(4)
  })

  it('always calls res.json', () => {
    disableConsole()
    const next = jest.fn()

    const errors = [
      ...validErrors,
      ...invalidErrors
    ]

    errors.forEach(e => jsonErrorHandler(e, req, res, next))

    expect(next).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledTimes(errors.length)
  })

  it('always contains an error code', () => {
    disableConsole()

    let responses = []

    const res = mockRes((response) => {
      responses.push(response)
    })

    const errors = [
      ...validErrors,
      ...invalidErrors
    ]
    errors.forEach(e => jsonErrorHandler(e, req, res, next))

    for (const response of responses) {
      expect(typeof response.error.code).toBe('string')
    }

  })

  it('responds with code unknown_error for invalid errors', () => {
    disableConsole()

    const responses = []

    const res = mockRes((response) => {
      responses.push(response)
    })

    invalidErrors.forEach(e => jsonErrorHandler(e, req, res, next))

    for (const response of responses) {
      expect(response).toMatchObject(expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: 'unknown_error',
        })
      }))
    }
  })

  it('responds with code validation_error for sequelize validation errors', () => {
    disableConsole()

    let success, error

    const res = mockRes((response) => {
      success = response.success
      error = response.error
    })

    const errorToTest = validErrors[0]
    jsonErrorHandler(errorToTest, req, res, next)

    expect(success).toBe(false)
    expect(error.code).toBe('validation_error')
    expect(error.errors).toBeInstanceOf(Array)

    error.errors.forEach(error => {
      // ValidationErrorItem's serialize nicely into JSON
      expect(error).toBeInstanceOf(Sequelize.ValidationErrorItem)
    })
  })

  it('responds code unknown_error and keeps the message for generic errors', () => {
    disableConsole()

    const errors = [
      Error('not found'),
      Error('some error message'),
      Error('something else')
    ]

    for (const error of errors) {
      const res = mockRes()
      jsonErrorHandler(error, req, res, next)

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: {
          code: 'unknown_error',
          message: error.message
        }
      }))
    }
  })

  it('responds code error.name and keeps the message' +
     ' for other types of error', () => {
    disableConsole()

    const errors = [
      RangeError('range error'),
      EvalError('eval error'),
      ReferenceError('reference error')
    ]

    for (const error of errors) {
      const res = mockRes()
      jsonErrorHandler(error, req, res, next)

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: {
          code: error.name,
          message: error.message
        }
      }))
    }
  })

  it('responds code unauthorized_error for jwt auth errors', () => {
    disableConsole()

    const error = new jwt.UnauthorizedError(
      'revoked_token',
      {message: 'The token has been revoked.'}
    )

    jsonErrorHandler(error, req, res, next)

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      error: {
        code: 'unauthorized_error',
        message: 'The token has been revoked.',
        error: error
      }
    }))
  })

  it('logs handled errors to the console', () => {
    const errors = [
      ...validErrors,
      ...invalidErrors
    ]

    for (const error of errors) {
      console.log = jest.fn()

      jsonErrorHandler(error, req, res, next)

      expect(console.log).toHaveBeenCalledWith(
        testUrl,
        expect.objectContaining({
          message: expect.stringMatching(/.*/),
          code: expect.stringMatching(/.*/),
        })
      )
    }
  })
})
