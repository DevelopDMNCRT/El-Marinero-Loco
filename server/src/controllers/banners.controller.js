const fs = require('fs')
const path = require('path')
const multer = require('multer')

const BANNERS_DATA = path.join(__dirname, '../data/banners.json')
const BANNERS_DIR = path.join(__dirname, '../../../client/public/images/banners')

// Multer storage: save directly to client/public/images/banners/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(BANNERS_DIR)) fs.mkdirSync(BANNERS_DIR, { recursive: true })
    cb(null, BANNERS_DIR)
  },
  filename: (req, file, cb) => {
    const { id } = req.params
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg'
    cb(null, `${id}${ext}`)
  }
})

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Solo se permiten imágenes.'))
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } })

const readBanners = () => JSON.parse(fs.readFileSync(BANNERS_DATA, 'utf-8'))
const writeBanners = (data) => fs.writeFileSync(BANNERS_DATA, JSON.stringify(data, null, 2))

// GET /api/banners
const getBanners = (req, res) => {
  try {
    res.json(readBanners())
  } catch (e) {
    res.status(500).json({ error: 'No se pudieron leer los banners.' })
  }
}

// POST /api/banners/:id  (upload image)
const uploadBanner = [
  upload.single('image'),
  (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No se recibió ninguna imagen.' })
      const { id } = req.params
      const banners = readBanners()
      if (!(id in banners)) return res.status(404).json({ error: 'Banner no encontrado.' })

      const url = `/images/banners/${req.file.filename}`
      banners[id] = url
      writeBanners(banners)

      res.json({ message: 'Banner actualizado.', url })
    } catch (e) {
      console.error('uploadBanner error:', e)
      res.status(500).json({ error: 'Error al subir la imagen.' })
    }
  }
]

// DELETE /api/banners/:id
const deleteBanner = (req, res) => {
  try {
    const { id } = req.params
    const banners = readBanners()
    if (!(id in banners)) return res.status(404).json({ error: 'Banner no encontrado.' })

    // Remove file if it exists
    if (banners[id]) {
      const filePath = path.join(BANNERS_DIR, path.basename(banners[id]))
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
    banners[id] = null
    writeBanners(banners)

    res.json({ message: 'Banner eliminado.' })
  } catch (e) {
    console.error('deleteBanner error:', e)
    res.status(500).json({ error: 'Error al eliminar el banner.' })
  }
}

module.exports = { getBanners, uploadBanner, deleteBanner }
