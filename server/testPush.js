const push = require('./push')
const { async, await } = require('asyncawait')

module.exports = async ((req, res, next) => {
  try {
    const userId = req.user.sub
    await (push(userId, 'Hola desde el server x2'))

    res.json({success: true})
  } catch (err) { next(err) }
})
