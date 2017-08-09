require('dotenv').config()
const express = require('express')
const path = require('path')
const { Action, Sequelize } = require('../db/models')
const { async, await } = require('asyncawait')
const bodyParser = require('body-parser')

const PORT = 9000
const BUILD_FOLDER = path.resolve('./build')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(BUILD_FOLDER))

const fields = [
  'name',
  'type',
  'check',
  'value',
  'triggerId',
  'enabled'
]

app.get('/api/actions', async ((req, res) => {
  let response = null
  try {
    const actions = await (Action.findAll())
    response = {success: true, actions}
  } catch (err) {
    response = {success: false, error: err.message}
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
  } catch (err) {
    response = {success: false, error: err.message}
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
  } catch (err) {
    response = {success: false, error: err.message}
  }
  res.json(response)
}))

app.post('/api/actions', async ((req, res) => {
  let response = null
  try {
    const action = await (Action.create(req.body, {fields}))
    response = {success: true, action}
  } catch (err) {
    if (err instanceof Sequelize.ValidationError && err.get('name'))
      response = {success: false, error: 'The name of the action must be unique'}
    else
      response = {success: false, error: err.message}
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
  } catch (err) {
    response = {success: false, error: err.message}
  }
  res.json(response)
}))

app.get('*', (req, res) => {
  res.sendFile(path.join(BUILD_FOLDER, 'index.html'))
})

app.listen(PORT, () => console.info(`Server listening on PORT ${PORT}...`))
