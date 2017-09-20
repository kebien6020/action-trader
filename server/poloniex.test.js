import * as poloniex from './poloniex'
import { testUserId } from './testUtils'

const fakeBalances = cb => cb(null, {BTC: '1.250'})
const fakeBuySell = (currA, currB, rate, amount, cb) =>
  cb(null, {orderNumber: 1234})

const mockApi = {
  buy: jest.fn(fakeBuySell),
  sell: jest.fn(fakeBuySell),
  returnBalances: jest.fn(fakeBalances),
}

async function getMockApi() {
  return mockApi
}

describe('Poloniex helpers', () => {
  beforeEach(() => {
    // Clear the mocks between tests
    // since they will be shared
    Object.values(mockApi)
      .forEach(fn => fn.mockClear())
  })

  it('returns the balances', async () => {
    const result = await poloniex.balances(testUserId, getMockApi)

    expect(result).toMatchObject({
      BTC: '1.250'
    })
  })

  ;['buy', 'sell'].forEach(method => {
    it(`calls ${method} on the api`, async () => {
      const result =
        await poloniex[method](
          testUserId, 'USDT', 'BTC', 3000, 1.15, getMockApi
        )

      expect(mockApi[method]).toHaveBeenCalledWith(
        'USDT', 'BTC', 3000, 1.15, expect.any(Function)
      )
      
      expect(result).toMatchObject({orderNumber: 1234})
    })
  })

})
