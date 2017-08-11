require('dotenv').config()
const express = require('express')
const path = require('path')
const { Action, Sequelize } = require('../db/models')
const { async, await } = require('asyncawait')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')
const actions = require('./actions')

const PORT = 9000
const BUILD_FOLDER = path.resolve('./build')

const authCheck = jwt({
  secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://kevinpena.auth0.com/.well-known/jwks.json"
    }),
    // This is the identifier we set when we created the API
    audience: 'https://action-trader.com',
    issuer: 'https://kevinpena.auth0.com/',
    algorithms: ['RS256']
})

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.use(express.static(BUILD_FOLDER))

app.get('/api/actions', authCheck, actions.list)

app.get('/api/actions/:id', actions.detail)

app.put('/api/actions/:id', actions.update)

app.post('/api/actions', actions.create)

app.delete('/api/actions/:id', actions.delete)

// Error handler
app.use((error, req, res, next) => {

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

app.get('*', (req, res) => {
  res.sendFile(path.join(BUILD_FOLDER, 'index.html'))
})

app.listen(PORT, () => console.info(`Server listening on PORT ${PORT}...`))
