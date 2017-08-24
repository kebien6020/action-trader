require('dotenv').config({path: '.env.local'})
require('dotenv').config()
const express = require('express')
const path = require('path')
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
const BUILD_FOLDER = path.resolve('./build')

const authCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://kevinpena.auth0.com/.well-known/jwks.json'
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

app.use('/api/actions', authCheck, routes.actions)
app.use('/api/subscriptions', authCheck, routes.subscriptions)
app.use('/api/testPush', authCheck, routes.testPush)

// Error handler for authCheck middleware
app.use((error, req, res, next) => {
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

let ticker = new Ticker(CURRENCY_PAIR)

ticker.on('open', () => console.log('Connected to poloniex ticker successfully'))

ticker.on('close', () => {
  console.log('Ticker websocket connection closed')
  ticker = new Ticker(CURRENCY_PAIR)
})

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

ticker.on('ticker', async (({last: currPrice}) => {
  if (lock) return
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
        console.log(target)
        if(target) {
          target.enabled = true
          await (target.save())
        }
        console.log(`Action ${action.name} triggered at ${currPrice}, enabling action ${target.name}`)
        push(action.owner, `Accion tipo habilitar: ${action.name}`)
        break
      }
      case 'disable': {
        const target = await (getTarget(action))
        if(target) {
          target.enabled = false
          await (target.save())
        }
        console.log(`Action ${action.name} triggered at ${currPrice}, disabling action ${target.name}`)
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
}))
