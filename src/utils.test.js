import { fetchJson } from './utils'

const mockAuth = {
  getAccessToken: () => 'fake-token',
  renew: jest.fn(() => true),
  login: jest.fn(),
}

function mockFetch(response = {success: true}) {
  const mockRes = {
    json: async () => response
  }

  return jest.fn(async () => mockRes)
}

describe('fetchJson', () => {
  it('calls fetch with JSON and auth headers and parses JSON', async () => {
    const fetch = mockFetch()

    const data = await fetchJson('/actions', mockAuth, {fetch})

    expect(data).toMatchObject({success: true})

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/actions$/),
      expect.objectContaining({
        headers : {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'bearer fake-token'
        }
      })
    )
  })

  it('retries once if the request fails because the token', async () => {
    let firstTime = true
    const auth = Object.assign({}, mockAuth, {
      getAccessToken() {
        if (firstTime) {
          firstTime = false
          return 'token-1'
        }
        return 'token-2'
      }
    })

    const errorResponse = {
      success: false,
      error: {
        name: 'UnauthorizedError',
      },
    }
    const successResponse = {success: true}

    const fetch = jest.fn(async (url, options) => {
      const token = options.headers.Authorization.substr('bearer '.length)
      if (token === 'token-1')
        return {
          json: async () => errorResponse
        }

      return {
        json: async () => successResponse
      }
    })

    const data = await fetchJson('/actions/2', auth, {fetch})

    expect(data).toMatchObject(successResponse)

    expect(fetch).toHaveBeenCalledTimes(2)
    expect(mockAuth.renew).toHaveBeenCalledTimes(1)
    expect(mockAuth.login).not.toHaveBeenCalled()
  })

})
