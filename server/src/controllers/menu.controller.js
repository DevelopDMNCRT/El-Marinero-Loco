const fs = require('fs')
const path = require('path')

const MENU_PATH = path.join(__dirname, '../data/menu.json')

const readMenu = () => {
  const raw = fs.readFileSync(MENU_PATH, 'utf-8')
  return JSON.parse(raw)
}

const writeMenu = (data) => {
  fs.writeFileSync(MENU_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

// GET /api/menu — public
const getMenu = (req, res) => {
  try {
    const menu = readMenu()
    return res.status(200).json(menu)
  } catch (err) {
    console.error('getMenu error:', err)
    return res.status(500).json({ error: 'No se pudo leer el menú.' })
  }
}

// PUT /api/menu/:category — protected (JWT required)
const updateCategory = (req, res) => {
  try {
    const { category } = req.params
    const { title, items } = req.body

    const menu = readMenu()

    if (!menu[category]) {
      return res.status(404).json({ error: `Categoría "${category}" no encontrada.` })
    }

    // Validate title
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'El título es requerido.' })
    }

    // Validate items
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Los platillos deben ser un arreglo.' })
    }

    for (const item of items) {
      if (!item.nombre || item.nombre.trim() === '') {
        return res.status(400).json({ error: 'Cada platillo debe tener un nombre.' })
      }
    }

    // Update
    menu[category].title = title.trim()
    menu[category].items = items.map(item => ({
      nombre: item.nombre.trim(),
      porcion: item.porcion?.trim() || null,
      variacion: item.variacion?.trim() || null,
      precio: item.precio
    }))

    writeMenu(menu)

    return res.status(200).json({
      message: `Categoría "${category}" actualizada.`,
      category: menu[category]
    })
  } catch (err) {
    console.error('updateCategory error:', err)
    return res.status(500).json({ error: 'No se pudo actualizar el menú.' })
  }
}

module.exports = { getMenu, updateCategory }
