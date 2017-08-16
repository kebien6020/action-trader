const Router = require('express').Router
const actionHandlers = require('./actions')
const subscriptionHandlers = require('./subscriptions')
const jsonErrorHandler = require('./jsonErrors')
const testPushHandler = require('./testPush')

const actions = Router()

actions.get('/', actionHandlers.list)
actions.get('/:id', actionHandlers.detail)
actions.put('/:id', actionHandlers.update)
actions.post('/', actionHandlers.create)
actions.delete('/:id', actionHandlers.delete)
// Error handler
actions.use(jsonErrorHandler)

exports.actions = actions

const subscriptions = Router()

subscriptions.post('/register', subscriptionHandlers.register)
subscriptions.post('/unregister', subscriptionHandlers.unregister)
subscriptions.get('/isSubscribed', subscriptionHandlers.isSubscribed)
// Error handler
subscriptions.use(jsonErrorHandler)

exports.subscriptions = subscriptions

const testPush = Router()
testPush.get('/', testPushHandler)
testPush.use(jsonErrorHandler)
exports.testPush = testPush
