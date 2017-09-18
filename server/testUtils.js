export const testUserId = 'test-user'

const testUser = {
  sub: testUserId,
}

const baseReq = {
  user: testUser
}

export function mockReq(custom = {}) {
  return Object.assign({}, baseReq, custom)
}

export function mockRes(jsonFn = jest.fn()) {
  return {
    json: jsonFn
  }
}
