require('dotenv').config()
const express = require('express')
const path = require('path')
const { Action, Sequelize } = require('../db/models')
const { async, await } = require('asyncawait')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')

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

const fields = [
  'name',
  'type',
  'check',
  'value',
  'triggerId',
  'enabled'
]

app.get('/api/actions', authCheck, async ((req, res) => {
  let response = null
  try {
    const actions = await (Action.findAll())
    response = {success: true, actions}
  } catch (error) {
    response = {success: false, error}
  }
  res.json(response)
}))

app.get('/api/actions/:id', async ((req, res) => {
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
}))

app.put('/api/actions/:id', async ((req, res) => {
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
}))

app.post('/api/actions', async ((req, res) => {
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
}))

app.delete('/api/actions/:id', async ((req, res) => {
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
}))

// Error handler
app.use((error, req, res, next) => {
  res.json({ success: false, error })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(BUILD_FOLDER, 'index.html'))
})

app.listen(PORT, () => console.info(`Server listening on PORT ${PORT}...`))
