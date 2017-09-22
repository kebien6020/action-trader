/* eslint-env jest */
import {
  list,
  detail,
  update,
  create,
  del,
} from './actions'
import { Action, Sequelize } from '../db/models'
import { testUserId, mockReq, mockRes } from '../utils/testUtils'

//
// Utils and fixtures
//

const testAction1 = {
  name: '1',
  type: 'enable',
  triggerName: '2',
  check: 'gt',
  value: 275,
  enabled: true
}

const testAction2 = {
  name: '2',
  type: 'sell',
  value: 274,
  enabled: false,
  amount: '0.50',
  amountType: 'percentage',
}

async function clearActions() {
  return Action.destroy({
    where:{
      // owner: testUser.sub
    }
  })
}

const entries = obj => Object.keys(obj).map(key => [key, obj[key]])

//
// Main test code
//

describe('Actions API', () => {
  beforeEach(clearActions)
  afterEach(clearActions)

  it('list all actions providing an user in the req', async () => {
    const req = mockReq()
    const res = mockRes()
    const next = jest.fn()

    await list(req, res, next)

    const expectedRes = {
      success: true,
      actions: []
    }

    expect(next).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith(expectedRes)
  })

  describe('all endpoints fail if no user is provided', () => {
    const endpoints = {
      list,
      detail,
      update,
      create,
      del,
    }

    for (const [name, endpoint] of entries(endpoints)) {
      it(name, async () => {
        const req = mockReq({user: {sub: undefined}})
        const res = mockRes()
        const next = jest.fn()

        await endpoint(req, res, next)

        expect(next).toHaveBeenCalled()
      })
    }
  })

  it('creates an action successfully', async () => {
    const req = mockReq({body: testAction1})
    const res = mockRes()
    const next = jest.fn()

    await create(req, res, next)

    expect(next).not.toHaveBeenCalled()

    const expectedRes = {
      success: true,
      action : expect.objectContaining(testAction1)
    }

    expect(res.json).toHaveBeenCalledWith(expectedRes)

    const dbAction =
      await Action.findOne({where: {owner: testUserId}})

    expect(dbAction).toBeDefined()
    expect(dbAction).toMatchObject(expectedRes.action)
  })

  it('fails to create a duplicated action', async () => {
    const req = mockReq({body: testAction1})
    const res = mockRes()
    const next = jest.fn(error => {
      expect(error).toBeInstanceOf(Sequelize.UniqueConstraintError)
    })

    await create(req, res, next)
    expect(next).not.toHaveBeenCalled()

    await create(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  it('deletes actions', async () => {
    const addOwner = action =>
      Object.assign({}, action, {owner: testUserId})

    // Add some actions to delete them
    const actions = await Action.bulkCreate([
      addOwner(testAction1),
      addOwner(testAction2),
    ])

    const [{id: id1}, {id: id2}] = actions

    expect(await Action.count()).toBe(2)

    // Delete first action
    const req1 = mockReq({params: {id: id1}})
    const res = mockRes()
    const next = jest.fn()

    await del(req1, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith({success: true})

    expect(await Action.count()).toBe(1)
    const actionLeft = await Action.findOne()
    // We deleted action with id1 so the one left in the db is
    // the one with id2
    expect(actionLeft.id).toBe(id2)

    // Delete second action
    const req2 = mockReq({params: {id: id2}})

    await del(req2, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith({success: true})

    expect(await Action.count()).toBe(0)
  })

  it('fails to create a sell action without amount', async () => {
    const sellAction = {
      name: '1',
      type: 'sell',
      value: 274,
      enabled: false,
    }

    const req = mockReq({body: sellAction})
    const res = mockRes()
    const next = jest.fn(error => {
      expect(error).toBeInstanceOf(Sequelize.ValidationError)
      expect(error.message).toBe('Validation error: sell and buy actions require an amount')
    })

    await create(req, res, next)

    expect(next).toHaveBeenCalled()
  })
})
