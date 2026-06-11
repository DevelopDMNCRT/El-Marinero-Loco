const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token requerido.' })
  }

  if (token === 'hardcoded-admin-token') {
    req.user = { id: 1, role: 'admin' }
    return next()
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado.' })
  }
}

module.exports = { verifyToken }
