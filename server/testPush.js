import push from './push'

export default async function testPush(req, res, next) {
  try {
    const userId = req.user.sub
    await push(userId, 'Notificacion push de prueba')

    res.json({success: true})
  } catch (err) {
    next(err)
  }
}
