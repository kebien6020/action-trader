/* eslint-env jest */
import {
  list,
  detail,
  update,
  create,
  del,
} from '../../actions'
import { Action, Sequelize } from '../../../db/models'


const testUser = {
  sub: 'test-user',
}

const testAction1 = {
  name: '1',
  type: 'enable',
  triggerName: '2',
  check: 'gt',
  value: 275,
  enabled: true
}

const baseReq = {
  user: testUser
}

function mockReq(custom = {}) {
  return Object.assign({}, baseReq, custom)
}

function mockRes(jsonFn = jest.fn()) {
  return {
    json: jsonFn
  }
}

async function clearActions() {
  return Action.destroy({
    where:{
      owner: testUser.sub
    }
  })
}

const entries = obj => Object.keys(obj).map(key => [key, obj[key]])

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
      await Action.findOne({where: {owner: testUser.sub}})

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
})
