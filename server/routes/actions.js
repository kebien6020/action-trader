import { Action } from '../db/models'

const fields = [
  'name',
  'type',
  'check',
  'value',
  'triggerName',
  'enabled',
  'amount',
  'amountType'
]

export async function list(req, res, next) {
  try {
    if (!req.user || !req.user.sub)
      throw Error('Authentication error')

    const owner = req.user.sub
    const actions = await Action.findAll({
      where: {owner},
      attributes: {
        exclude: ['owner']
      }
    })
    res.json({success: true, actions})
    return actions
  } catch (err) {
    next(err)
  }
}

export async function detail(req, res, next) {
  try {
    const actionId = req.params.id
    const owner = req.user.sub
    const action = await Action.findById(actionId, {
      where: {owner}
    })
    if (action === null)
      throw Error('not found')
    res.json({success: true, action})
  } catch (err) {
    next(err)
  }
}

export async function update(req, res, next) {
  try {
    const actionId = req.params.id
    const action = await Action.findById(actionId)
    if (!action.owner === req.user.sub)
      throw Error('not authorized')
    await action.update(req.body, {fields})
    res.json({success: true, action})
  } catch (err) {
    next(err)
  }
}

export async function create(req, res, next) {
  try {
    req.body.owner = req.user.sub
    const action = await Action.create(req.body, {fields: fields.concat('owner')})
    res.json({success: true, action})
    return action
  } catch (err) {
    next(err)
  }
}

export async function del(req, res, next) {
  try {
    const actionId = req.params.id
    const owner = req.user.sub
    const action = await Action.findById(actionId, {
      where: {owner}
    })
    if (action === null)
      throw Error('not found')
    await action.destroy()
    res.json({success: true})
  } catch (err) {
    next(err)
  }
}

export async function bulkCreate(req, res, next) {
  try {
    const owner = req.user.sub
    const addOwner = action =>
      Object.assign({}, action, {owner})
    const actions = req.body.actions.map(addOwner)
    const dbActions = await Action.bulkCreate(actions, {
      fields: fields.concat('owner'),
      validate: true,
    })

    const ids = dbActions.map(action => action.id)
    res.json({success: true, ids})

    return ids
  } catch (err) {
    next(err)
  }
}

export async function deleteAll(req, res, next) {
  try {
    const owner = req.user.sub
    const deleted = await Action.destroy({where: {owner}})

    res.json({success: true, deleted})
    return deleted
  } catch (err) {
    next(err)
  }
}
