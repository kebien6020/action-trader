import { fetchJson } from './utils'

export function createAction(action, auth) {
  return fetchJson('/actions', auth, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(action),
  })
}

export function createActions(actions, auth) {
  return fetchJson('/actions/bulkCreate', auth, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({actions}),
  })
}
