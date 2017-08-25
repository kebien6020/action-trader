const path = require('path')

require('dotenv').config({path: path.resolve(__dirname, '../.env.local')})
require('dotenv').config({path: path.resolve(__dirname, '../.env')})

const express = require('express')
const { Action } = require('../db/models')
const { async, await } = require('asyncawait')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')
const routes = require('./routes')
const Ticker = require('./ticker')
const push = require('./push')

const PORT = 9000
const BUILD_FOLDER = path.resolve('../build')

const authCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_JWKS_URI
  }),
    // This is the identifier we set when we created the API
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ['RS256']
})

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.use(express.static(BUILD_FOLDER))

app.use('/api/actions', authCheck, routes.actions)
app.use('/api/subscriptions', authCheck, routes.subscriptions)
app.use('/api/testPush', authCheck, routes.testPush)

// Error handler for authCheck middleware
app.use((error, req, res, next) => {
  console.log(error)
  res.json({ success: false, error })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(BUILD_FOLDER, 'index.html'))
})

app.listen(PORT, () => console.info(`Server listening on PORT ${PORT}...`))

//
// Poloniex ticker logic
//

const CURRENCY_PAIR = 'USDT_BTC'

const ticker = new Ticker([CURRENCY_PAIR], 1000)

// Judge wether an action is due
const isDue = currPrice => action => {
  if (!action.enabled) return false
  if (action.check)
    switch (action.check) {
    case 'gt':
      return Number(currPrice) > action.value
    case 'lt':
      return Number(currPrice) < action.value
    }
  return true
}

const getTarget = ({triggerName, owner}) => {
  return (Action.findOne({
    where: {name: triggerName, owner}
  }))
}

let lock = false

const handleTicker = async ((_, {last: currPrice}) => {
  if (lock) return
  // console.log('Ticker: ' + currPrice)
  lock = true
  try {
    // Get the actions we ought to do and tag them with their index in the array
    const actionsToDo = await (Action.findAll())
      .filter(isDue(currPrice))

    // Execute and remove each one of them
    for (const action of actionsToDo) {
      switch (action.type) {
      case 'enable': {
        const target = await (getTarget(action))
        let targetName = 'NOT FOUND'
        if(target) {
          target.enabled = true
          targetName = target.name
          await (target.save())
        }
        console.log(`Action ${action.name} triggered at ${currPrice}, enabling action ${targetName}`)
        push(action.owner, `Accion tipo habilitar: ${action.name}`)
        break
      }
      case 'disable': {
        const target = await (getTarget(action))
        let targetName = 'NOT FOUND'
        if(target) {
          targetName = target.name
          target.enabled = false
          await (target.save())
        }
        console.log(`Action ${action.name} triggered at ${currPrice}, disabling action ${targetName}`)
        break
      }
      case 'sell': {
        console.log('Selling at ' + action.value)
        push(action.owner, `Alerta: Vender a ${action.value}`)
        break
      }
      case 'buy': {
        console.log('Buying at ' + action.value)
        push(action.owner, `Alerta: Comprar a ${action.value}`)
        break

      }
      }

      await (action.destroy())
    }
  } finally {
    lock = false
  }
})

ticker.on('ticker', handleTicker)
ticker.on('error', err => console.log(err))
ticker.start()
