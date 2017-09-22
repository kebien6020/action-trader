import { Subscription } from '../db/models'
import { testUserId } from './testUtils'

const fakeSubscription = {
  endpoint: 'https://some.push.api/random-string',
  expirationTime: null,
  keys: {
    p256dh: 'long-random-string-long-random-string-long-random-string-long-random-string',
    auth: 'base-64-string==',
  },
}

const fakeSubscription2 = {
  endpoint: 'https://some.push.api/different-random-string',
  expirationTime: null,
  keys: {
    p256dh: 'long-random-string-long-random-string-long-random-string-long-random-string',
    auth: 'base-64-string==',
  },
}

const mockWebPush = {
  setVapidDetails: jest.fn(),
  sendNotification: jest.fn(),
}

jest.mock('web-push', () => mockWebPush)

// Can't use import because it needs to be at the top and we
// need to mock beforehand
const push = require('./push').default

describe('push helper', () => {
  beforeAll(() => {
    // Clear subscriptions
    return Subscription.destroy({truncate: true})
  })
  it('sets vapid details once on the first push', async () => {
    await push(testUserId)
    expect(mockWebPush.setVapidDetails.mock.calls[0]).toMatchSnapshot()
  })

  it('calls sendNotification with user details from the database', async () => {
    // Save a couple subscriptions on the database
    await Subscription.create({
      userId: testUserId,
      subscription: JSON.stringify(fakeSubscription)
    })

    await Subscription.create({
      userId: testUserId,
      subscription: JSON.stringify(fakeSubscription2)
    })

    // Call push and assert
    await push(testUserId)

    expect(mockWebPush.sendNotification.mock.calls).toMatchSnapshot()

  })
})
