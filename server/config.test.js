import {
  getPoloniex,
  updatePoloniex,
} from './config'
import { UserConfig } from './db/models'
import { mockReq, mockRes, testUserId } from './testUtils'

async function clearConfigs() {
  return UserConfig.destroy({truncate: true})
}

describe('Config API', () => {
  beforeEach(clearConfigs)

  it('responds successfully even if there is nothing stored', async () => {
    const req = mockReq()
    const res = mockRes()
    const next = jest.fn()

    await getPoloniex(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      poloniexApiKey: null,
      poloniexSecret: null,
    }))
  })

  it('updates configs successfully', async () => {
    const req = mockReq({body: {
      poloniexApiKey: 'fakeApiKey',
      poloniexSecret: 'fakeSecret',
    }})
    const res = mockRes()
    const next = jest.fn()

    await updatePoloniex(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
    }))

    // Check the database to see if the config is actually there
    const userId = testUserId
    const config = await UserConfig.findOne({where: {userId}})

    expect(config).not.toBe(null)
    expect(config).toMatchObject(expect.objectContaining({
      userId: testUserId,
      poloniexApiKey: 'fakeApiKey',
      poloniexSecret: 'fakeSecret',
    }))
  })
})
