const express = require('express')
const router = express.Router()
const { getBanners, uploadBanner, deleteBanner } = require('../controllers/banners.controller')
const { verifyToken } = require('../middleware/auth.middleware')

// GET /api/banners — public
router.get('/', getBanners)

// POST /api/banners/:id — protected
router.post('/:id', verifyToken, uploadBanner)

// DELETE /api/banners/:id — protected
router.delete('/:id', verifyToken, deleteBanner)

module.exports = router
