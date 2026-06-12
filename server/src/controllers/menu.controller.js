const db = require('../db/index')

// GET /api/menu — public
const getMenu = async (req, res) => {
  try {
    const categoriesResult = await db.query('SELECT * FROM menu_categories ORDER BY order_index ASC')
    const itemsResult = await db.query('SELECT * FROM menu_items ORDER BY id ASC')

    const menu = {}
    categoriesResult.rows.forEach(cat => {
      menu[cat.id] = {
        title: cat.title,
        items: []
      }
    })

    itemsResult.rows.forEach(item => {
      if (menu[item.category_id]) {
        // Parse price to number if possible, otherwise keep it as string
        let price = item.precio
        if (price !== null && !isNaN(Number(price))) {
          price = Number(price)
        }

        menu[item.category_id].items.push({
          nombre: item.nombre,
          porcion: item.porcion,
          variacion: item.variacion,
          precio: price
        })
      }
    })

    return res.status(200).json(menu)
  } catch (err) {
    console.error('getMenu error:', err)
    return res.status(500).json({ error: 'No se pudo leer el menú de la base de datos.' })
  }
}

// PUT /api/menu/:category — protected (JWT required)
const updateCategory = async (req, res) => {
  const { category } = req.params
  const { title, items } = req.body

  // Validation
  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'El título es requerido.' })
  }

  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Los platillos deben ser un arreglo.' })
  }

  for (const item of items) {
    if (!item.nombre || item.nombre.trim() === '') {
      return res.status(400).json({ error: 'Cada platillo debe tener un nombre.' })
    }
  }

  const client = await db.pool.connect()
  try {
    await client.query('BEGIN')

    // Check if category exists
    const catCheck = await client.query('SELECT * FROM menu_categories WHERE id = $1', [category])
    if (catCheck.rows.length === 0) {
      await client.query('ROLLBACK')
      return res.status(404).json({ error: `Categoría "${category}" no encontrada.` })
    }

    // Update category title
    await client.query('UPDATE menu_categories SET title = $1 WHERE id = $2', [title.trim(), category])

    // Delete existing items for the category
    await client.query('DELETE FROM menu_items WHERE category_id = $1', [category])

    // Insert new items
    if (items.length > 0) {
      for (const item of items) {
        await client.query(
          'INSERT INTO menu_items (category_id, nombre, porcion, variacion, precio) VALUES ($1, $2, $3, $4, $5)',
          [
            category,
            item.nombre.trim(),
            item.porcion?.trim() || null,
            item.variacion?.trim() || null,
            item.precio !== undefined && item.precio !== null ? String(item.precio).trim() : null
          ]
        )
      }
    }

    await client.query('COMMIT')

    // Format output
    const updatedItems = items.map(item => {
      let price = item.precio
      if (price !== undefined && price !== null && !isNaN(Number(price))) {
        price = Number(price)
      }
      return {
        nombre: item.nombre.trim(),
        porcion: item.porcion?.trim() || null,
        variacion: item.variacion?.trim() || null,
        precio: price
      }
    })

    return res.status(200).json({
      message: `Categoría "${category}" actualizada.`,
      category: {
        title: title.trim(),
        items: updatedItems
      }
    })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('updateCategory error:', err)
    return res.status(500).json({ error: 'No se pudo actualizar el menú en la base de datos.' })
  } finally {
    client.release()
  }
}

module.exports = { getMenu, updateCategory }
