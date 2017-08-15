require('dotenv').config()
const express = require('express')
const path = require('path')
const { Action, Sequelize } = require('../db/models')
const { async, await } = require('asyncawait')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')
const routes = require('./routes')

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

app.use('/api/actions', authCheck, routes.actions)
app.use('/api/subscriptions', authCheck, routes.subscriptions)

// Error handler for authCheck middleware
app.use((error, req, res, next) => {
  res.json({ success: false, error })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(BUILD_FOLDER, 'index.html'))
})

app.listen(PORT, () => console.info(`Server listening on PORT ${PORT}...`))
