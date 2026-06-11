const express = require('express')
const router = express.Router()
const { getMenu, updateCategory } = require('../controllers/menu.controller')
const { verifyToken } = require('../middleware/auth.middleware')

// GET /api/menu — public
router.get('/', getMenu)

// PUT /api/menu/:category — protected
router.put('/:category', verifyToken, updateCategory)

module.exports = router
