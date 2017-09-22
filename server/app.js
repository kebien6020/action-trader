import path from 'path'
import jwt from 'express-jwt'
import jwks from 'jwks-rsa'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import * as routes from './routes'
import jsonErrorHandler from './utils/jsonErrors'


// Set up the jwt middleware
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

// Common middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// Serve static assets
const BUILD_FOLDER = path.resolve(__dirname, '../build')
app.use(express.static(BUILD_FOLDER))

// API routes
app.use('/api/actions', authCheck, routes.actions)
app.use('/api/subscriptions', authCheck, routes.subscriptions)
app.use('/api/testPush', authCheck, routes.testPush)
app.use('/api/config', authCheck, routes.config)

// Error handler for any error thrown
// in any route or middleware
app.use(jsonErrorHandler)

// Serve the SPA for any unhandled route (it handles 404)
app.get('*', (req, res) => {
  res.sendFile(path.join(BUILD_FOLDER, 'index.html'))
})

export default app
