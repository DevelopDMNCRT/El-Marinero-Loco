require('dotenv').config()
const fs = require('fs')
const path = require('path')
const db = require('./index')

const menuPath = path.join(__dirname, '../data/menu.json')
const bannersPath = path.join(__dirname, '../data/banners.json')

async function seed() {
  console.log('Starting database seeding...')
  
  try {
    // 1. Create tables
    await db.query(`
      CREATE TABLE IF NOT EXISTS menu_categories (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        order_index INT NOT NULL
      );
    `)
    console.log('Table menu_categories created/verified.')

    await db.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        category_id VARCHAR(50) REFERENCES menu_categories(id) ON DELETE CASCADE,
        nombre VARCHAR(255) NOT NULL,
        porcion VARCHAR(255),
        variacion VARCHAR(255),
        precio VARCHAR(255)
      );
    `)
    console.log('Table menu_items created/verified.')

    await db.query(`
      CREATE TABLE IF NOT EXISTS banners (
        id VARCHAR(50) PRIMARY KEY,
        url TEXT
      );
    `)
    console.log('Table banners created/verified.')

    // 2. Clear tables (Cascade ensures items are deleted too)
    await db.query('TRUNCATE TABLE menu_categories CASCADE')
    await db.query('TRUNCATE TABLE banners')
    console.log('Tables truncated.')

    // 3. Populate menu
    let menuData = {}
    if (fs.existsSync(menuPath)) {
      menuData = JSON.parse(fs.readFileSync(menuPath, 'utf8'))
    } else {
      console.log('Warning: No menu.json file found to import!')
    }

    const categoriesOrder = [
      'entradas', 'cocteles', 'especialidades', 'torres', 'camarones', 
      'caldos', 'filetes', 'tostadas', 'cortes', 'marineritos', 
      'cerveza', 'refrescos', 'sinalcohol', 'mezcales', 'ron', 
      'brandy', 'bebidas', 'tequilas', 'whisky', 'vodka', 
      'vinos', 'cocteleria', 'postres'
    ]

    for (let index = 0; index < categoriesOrder.length; index++) {
      const catId = categoriesOrder[index]
      const catData = menuData[catId] || { title: catId.charAt(0).toUpperCase() + catId.slice(1), items: [] }
      
      // Insert category
      await db.query(
        'INSERT INTO menu_categories (id, title, order_index) VALUES ($1, $2, $3)',
        [catId, catData.title, index]
      )

      // Insert items
      if (catData.items && catData.items.length > 0) {
        for (const item of catData.items) {
          await db.query(
            'INSERT INTO menu_items (category_id, nombre, porcion, variacion, precio) VALUES ($1, $2, $3, $4, $5)',
            [catId, item.nombre, item.porcion || null, item.variacion || null, item.precio !== undefined ? String(item.precio) : null]
          )
        }
      }
    }
    console.log('Menu categories and items successfully migrated.')

    // 4. Populate banners
    let bannersData = {}
    if (fs.existsSync(bannersPath)) {
      bannersData = JSON.parse(fs.readFileSync(bannersPath, 'utf8'))
    }

    const bannersToSeed = ['banner1', 'banner2', 'banner3', 'banner4', 'banner5']
    for (const id of bannersToSeed) {
      const url = bannersData[id] || null
      await db.query('INSERT INTO banners (id, url) VALUES ($1, $2)', [id, url])
    }
    console.log('Banners successfully migrated.')
    
    console.log('Database seeding completed successfully!')
  } catch (error) {
    console.error('Error during database seeding:', error)
  } finally {
    await db.pool.end()
    console.log('Database pool closed.')
  }
}

seed()
