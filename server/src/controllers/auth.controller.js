const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos.' })
    }

    // Check email
    if (email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' })
    }

    // Check password against stored hash
    const isValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' })
    }

    // Generate JWT (expires in 8 hours)
    const token = jwt.sign(
      { email: process.env.ADMIN_EMAIL, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    return res.status(200).json({
      message: 'Acceso concedido.',
      token,
      user: {
        email: process.env.ADMIN_EMAIL,
        role: 'admin'
      }
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ error: 'Error interno del servidor.' })
  }
}

const verify = (req, res) => {
  // req.user is set by verifyToken middleware
  return res.status(200).json({
    valid: true,
    user: req.user
  })
}

module.exports = { login, verify }
