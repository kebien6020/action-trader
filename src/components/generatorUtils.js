import { fetchJson } from '../utils'

export const Direction = {
  // Strings inside symbols are just for debugging
  UPSTAIRS: Symbol('UPSTAIRS'),
  DOWNSTAIRS: Symbol('DOWNSTAIRS'),
}

// Returns an array of actions
export function generateStair(args) {
  let {
    direction,
    initialValue,
    step,
    stopDistance,
    stepQty,
    limitDelta,
    existingActions,
    amount,
    amountType,
  } = args

  if (direction !== Direction.UPSTAIRS && direction !== Direction.DOWNSTAIRS)
    throw Error(
      'direction should come from the enum-like object ' +
      'Direction defined in generatorUtils.js'
    )
  const up = direction === Direction.UPSTAIRS

  // Differences between Upstairs and Downstairs
  if (!up) {
    step = -step
    stopDistance = -stopDistance
    limitDelta = -limitDelta
  }

  const passCheck = up ? 'gt' : 'lt'
  const returnCheck = up ? 'lt' : 'gt'
  const finalAction = up ? 'sell' : 'buy'

  // Settle on an unique prefix
  const prefix = definePrefix(up, existingActions)

  // Actual generation logic
  const actions = []
  for (let i = 1; i <= stepQty; ++i) {
    const currentStepValue = initialValue + (i - 1) * step
    const currentStopLimit = currentStepValue - stopDistance
    const currentLimit = currentStopLimit - limitDelta
    // Disable previous stop limit
    if (i > 1) {
      actions.push({
        name: `${prefix} Paso ${i} mover stop`,
        type: 'disable',
        triggerName: `${prefix} Paso ${i - 1} stop`,
        check: passCheck,
        value: currentStepValue,
        enabled: true,
      })
    }
    // Enable current stop limit
    actions.push({
      name: `${prefix} Paso ${i} stop stop`,
      type: 'enable',
      triggerName: `${prefix} Paso ${i} stop`,
      check: passCheck,
      value: currentStepValue,
      enabled: true,
    })

    // Stop limit
    actions.push({
      name: `${prefix} Paso ${i} stop`,
      type: 'enable',
      triggerName: `${prefix} Paso ${i} limit`,
      check: returnCheck,
      value: currentStopLimit,
      enabled: false,
    })

    // Limit
    actions.push({
      name: `${prefix} Paso ${i} limit`,
      type: finalAction,
      value: currentLimit,
      enabled: false,
      amount,
      amountType,
    })
  }

  return actions
}

export function definePrefix(sell, existingActions) {
  // Settle on an unique prefix
  let prefixIndex = 1
  const makePrefix = i => sell ? `[V${i}]` : `[C${i}]`
  const actionNames = existingActions.map(a => a.name)
  const startWithPrefix = name =>
    name.startsWith(makePrefix(prefixIndex))

  while(actionNames.some(startWithPrefix))
    ++prefixIndex

  return makePrefix(prefixIndex)
}

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
