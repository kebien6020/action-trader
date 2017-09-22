const Router = require('express').Router
const actionHandlers = require('./actions')
const subscriptionHandlers = require('./subscriptions')
const testPushHandler = require('./testPush')
const configHandlers = require('./config')

const actions = Router()

actions.get('/', actionHandlers.list)
actions.get('/:id', actionHandlers.detail)
actions.put('/:id', actionHandlers.update)
actions.post('/', actionHandlers.create)
actions.delete('/:id', actionHandlers.del)

exports.actions = actions

const subscriptions = Router()

subscriptions.post('/register', subscriptionHandlers.register)
subscriptions.post('/unregister', subscriptionHandlers.unregister)
subscriptions.get('/isSubscribed', subscriptionHandlers.isSubscribed)

exports.subscriptions = subscriptions

const testPush = Router()
testPush.get('/', testPushHandler)
exports.testPush = testPush

const config = Router()
config.get('/poloniex', configHandlers.getPoloniex)
config.put('/poloniex', configHandlers.updatePoloniex)
exports.config = config
