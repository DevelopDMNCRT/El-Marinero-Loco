const express = require('express')
const router = express.Router()
const { login, verify } = require('../controllers/auth.controller')
const { verifyToken } = require('../middleware/auth.middleware')

// POST /api/auth/login
router.post('/login', login)

// GET /api/auth/verify  (protected — requires valid JWT)
router.get('/verify', verifyToken, verify)

module.exports = router
