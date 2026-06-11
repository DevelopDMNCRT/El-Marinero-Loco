const fs = require('fs');
const file = '/Users/yaywiin/Desktop/DEVELOP/el-marinero-loco/server/src/controllers/banners.controller.js';

let content = `const fs = require('fs')
const path = require('path')
const multer = require('multer')
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const BANNERS_DATA = path.join(__dirname, '../data/banners.json')

// Configuración de almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'el-marinero-loco/banners', // Carpeta en Cloudinary
    allowed_formats: ['jpg', 'png', 'webp', 'jpeg', 'gif'],
    public_id: (req, file) => req.params.id, // El ID será banner1, banner2, etc.
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

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

      // Cloudinary devuelve la URL segura en req.file.path
      const url = req.file.path
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
const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params
    const banners = readBanners()
    if (!(id in banners)) return res.status(404).json({ error: 'Banner no encontrado.' })

    const url = banners[id]
    if (url && url.includes('cloudinary')) {
      // Extraer public_id de la URL de Cloudinary para eliminarlo
      // Normalmente el path completo es la carpeta + public_id
      const publicId = \`el-marinero-loco/banners/\${id}\`
      await cloudinary.uploader.destroy(publicId)
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
`;

fs.writeFileSync(file, content);
console.log("Cloudinary backend integratons added.");
