import { Router } from 'express'
import * as actionHandlers from './routes/actions'
import * as configHandlers from './routes/config'
import * as subscriptionHandlers from './routes/subscriptions'
import testPushHandler from './routes/testPush'

export const actions = Router()
actions.get('/', actionHandlers.list)
actions.get('/:id', actionHandlers.detail)
actions.put('/:id', actionHandlers.update)
actions.post('/', actionHandlers.create)
actions.delete('/:id', actionHandlers.del)

export const subscriptions = Router()
subscriptions.post('/register', subscriptionHandlers.register)
subscriptions.post('/unregister', subscriptionHandlers.unregister)
subscriptions.get('/isSubscribed', subscriptionHandlers.isSubscribed)

export const testPush = Router()
testPush.get('/', testPushHandler)

export const config = Router()
config.get('/poloniex', configHandlers.getPoloniex)
config.put('/poloniex', configHandlers.updatePoloniex)
