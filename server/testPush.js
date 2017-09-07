const push = require('./push')
const { async: _async, await: _await } = require('asyncawait')

module.exports = _async ((req, res, next) => {
  try {
    const userId = req.user.sub
    _await (push(userId, 'Notificacion push de prueba'))

    res.json({success: true})
  } catch (err) {
    next(err)
  }
})
