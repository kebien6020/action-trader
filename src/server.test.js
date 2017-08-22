/* eslint-env jest */
const fetch = require('node-fetch')
let token = null

async function getToken() {
  if (token !== null) return token
  const res = await fetch('https://kevinpena.auth0.com/oauth/token',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: 'Lt1GBIZN0Kd1R4p7k2rZ89Zl57KVSByQ',
      client_secret: 'LAemmxs-v_Haz1CuB4GgqXpCUszEzE5oeknAIV01dAvY3rxMoWQbG5HB_9Ymiqf4',
      audience: 'https://action-trader.com'
    }),
  }).then(res => res.json())
  token = res['access_token']
  return token
}

const BASE_URL = process.env.REACT_APP_API_URL

async function request(path, opts) {
  if (!opts) opts = {}
  if (!opts.headers) opts.headers = {}
  if (!opts.noAuth)
    opts.headers['Authorization'] = 'bearer ' + await getToken()
  return fetch(BASE_URL + path, opts).then(res => res.json())
}

async function clearActions() {
  // Clears this testing client's actions
  const { actions } = await request('/actions')
  for (const { id } of actions)
    await request(`/actions/${id}`, {method: 'delete'})
}


describe('Actions API', () => {
  beforeEach(clearActions)
  afterAll(clearActions)

  it('lists all actions successfully with auth', async () => {
    const res = await request('/actions')

    expect(res.success).toBe(true)
    expect(res.actions).toBeInstanceOf(Array)
    expect(res.actions.length).toBe(0)
  })

  it('fails all endpoints if there is no auth', async () => {
    const allRes = [
      await request('/actions', {noAuth: true}),
      await request('/actions', {noAuth: true, method: 'post'}),
      await request('/actions/1', {noAuth: true}),
      await request('/actions/1', {noAuth: true, method: 'put'}),
      await request('/actions/1', {noAuth: true, method: 'delete'}),
    ]

    for (const res of allRes) {
      expect(res.success).toBe(false)
      expect(res.error.code).toBe('credentials_required')
    }
  })

  it('creates an action successfully but fails to create one identical', async () => {
    const opts = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: '1',
        type: 'enable',
        triggerName: '2',
        check: 'gt',
        value: 275,
        enabled: true
      })
    }
    const res = await request('/actions', opts)

    expect(res.success).toBe(true)
    expect(res.action).toBeInstanceOf(Object)
    const createdId = res.action.id

    const res2 = await request('/actions', opts)

    expect(res2.success).toBe(false)
    expect(res2.error.name).toBe('SequelizeUniqueConstraintError')
  })

  it('create, create, list, delete', async () => {
    const opts1 = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: '1',
        type: 'enable',
        triggerName: '2',
        check: 'gt',
        value: 275,
        enabled: true
      })
    }
    const opts2 = Object.assign({}, opts1, {
      body: JSON.stringify({
        name: '2',
        type: 'sell',
        value: 274,
        enabled: false,
        amount: '0.50',
        amountType: 'percentage'
      })
    })

    const {action: {id: id1}} = await request('/actions', opts1)
    const {action: {id: id2}} = await request('/actions', opts2)

    const {actions} = await request('/actions')
    expect(actions[0]).toEqual(expect.objectContaining({
      id: id1,
      name: '1',
      type: 'enable',
      triggerName: '2',
      check: 'gt',
      value: 275,
      enabled: true,
    }))
    expect(actions[1]).toEqual(expect.objectContaining({
      id: id2,
      name: '2',
      type: 'sell',
      value: 274,
      enabled: false,
      check: null,
      triggerName: null,
      amount: 0.5,
      amountType: 'percentage',
    }))
    expect(actions[0]).not.toHaveProperty('owner')
    expect(actions[1]).not.toHaveProperty('owner')

    await request(`/actions/${id1}`, {method: 'delete'})
    const {actions: afterFisrtDelete} = await request('/actions')
    expect(afterFisrtDelete[0])
      .toEqual(expect.objectContaining({id: id2}))

    await request(`/actions/${id2}`, {method: 'delete'})
    const {actions: afterSecondDelete} = await request('/actions')
    expect(afterSecondDelete.length).toBe(0)

  })

  it('fails to create a sell action without amount', async () => {
    const opts = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '2',
        type: 'sell',
        value: 274,
        enabled: false,
      })
    }

    const { success } = await request('/actions', opts)
    expect(success).toBe(false)
  })

  it('requires an amountType along the amount', async () => {
    const optsWithoutAmountType = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '1',
        type: 'buy',
        value: 274,
        enabled: false,
        amount: '1',
      })
    }
    const optsWithAmountType = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '1',
        type: 'buy',
        value: 274,
        enabled: false,
        amount: '1',
        amountType: 'percentage',
      })
    }

    const { success } = await request('/actions', optsWithoutAmountType)
    expect(success).toBe(false)

    const { success2 } = await request('/actions', optsWithAmountType)
    expect(success2).toBe(true)
  })
})

function clearSubscribe() {
  return request('/subscriptions/unregister', {method: 'post'})
}

describe('Subscribe API', () => {
  beforeEach(clearSubscribe)
  afterAll(clearSubscribe)

  it('is not registered initially', async () => {
    const res = await request('/subscriptions/isSubscribed')

    expect(res.success).toBe(true)
    expect(res.isSubscribed).toBe(false)
  })

  it('registers a subscription successfully', async () => {
    const subscription = {
      endpoint: 'https://some.push.api/random-string',
      expirationTime: null,
      keys: {
        p256dh: 'long-random-string-long-random-string-long-random-string-long-random-string',
        auth: 'base-64-string==',
      },
    }

    const body = JSON.stringify({
      subscription: JSON.stringify(subscription)
    })

    const res = await request('/subscriptions/register', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })

    expect(res.success).toBe(true)

    const res2 = await request('/subscriptions/isSubscribed')

    expect(res2.success).toBe(true)
    expect(res2.isSubscribed).toBe(true)
  })

  it('unregisters a subscription successfully', async () => {
    const subscription = {
      endpoint: 'https://some.push.api/random-string',
      expirationTime: null,
      keys: {
        p256dh: 'long-random-string-long-random-string-long-random-string-long-random-string',
        auth: 'base-64-string==',
      },
    }

    const body = JSON.stringify({
      subscription: JSON.stringify(subscription)
    })

    const res = await request('/subscriptions/register', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })

    expect(res.success).toBe(true)

    const res2 = await request('/subscriptions/unregister',  {
      method: 'post'
    })

    expect(res2.success).toBe(true)

    const res3 = await request('/subscriptions/isSubscribed')

    expect(res3.success).toBe(true)
    expect(res3.isSubscribed).toBe(false)
  })
})
