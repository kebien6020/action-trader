export const testUserId = 'test-user'
export const testUrl = '/test-url'

const testUser = {
  sub: testUserId,
}

const baseReq = {
  user: testUser,
  url: testUrl,
}

export function mockReq(custom = {}) {
  return Object.assign({}, baseReq, custom)
}

export function mockRes(jsonFn = jest.fn()) {
  return {
    json: jsonFn
  }
}
