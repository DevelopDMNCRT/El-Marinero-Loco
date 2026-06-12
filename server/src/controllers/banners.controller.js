const multer = require('multer')
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const db = require('../db/index')

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuración de almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'El Marinero Loco', // Carpeta en Cloudinary
    allowed_formats: ['jpg', 'png', 'webp', 'jpeg', 'gif'],
    public_id: (req, file) => req.params.id, // El ID será banner1, banner2, etc.
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

// GET /api/banners
const getBanners = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM banners')
    const banners = {}
    result.rows.forEach(row => {
      banners[row.id] = row.url
    })
    res.json(banners)
  } catch (e) {
    console.error('getBanners error:', e)
    res.status(500).json({ error: 'No se pudieron leer los banners de la base de datos.' })
  }
}

// POST /api/banners/:id  (upload image)
const uploadBanner = [
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No se recibió ninguna imagen.' })
      const { id } = req.params
      const url = req.file.path

      // Guardar URL segura de Cloudinary en la base de datos (UPSERT por seguridad)
      await db.query(
        'INSERT INTO banners (id, url) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET url = $2',
        [id, url]
      )

      res.json({ message: 'Banner actualizado.', url })
    } catch (e) {
      console.error('uploadBanner error:', e)
      res.status(500).json({ error: 'Error al subir la imagen.' })
    }
  }
]

// DELETE /api/banners/:id
const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params
    const result = await db.query('SELECT url FROM banners WHERE id = $1', [id])
    
    if (result.rows.length > 0) {
      const url = result.rows[0].url
      if (url && url.includes('cloudinary')) {
        // Extraer public_id de la URL de Cloudinary para eliminarlo
        const publicId = `El Marinero Loco/${id}`
        await cloudinary.uploader.destroy(publicId)
      }
    }

    // Set URL to null in database
    await db.query(
      'INSERT INTO banners (id, url) VALUES ($1, null) ON CONFLICT (id) DO UPDATE SET url = null',
      [id]
    )

    res.json({ message: 'Banner eliminado.' })
  } catch (e) {
    console.error('deleteBanner error:', e)
    res.status(500).json({ error: 'Error al eliminar el banner.' })
  }
}

module.exports = { getBanners, uploadBanner, deleteBanner }
