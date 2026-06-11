require('dotenv').config()
const express = require('express')
const cors = require('cors')
const authRoutes = require('./src/routes/auth.routes')
const menuRoutes = require('./src/routes/menu.routes')
const bannersRoutes = require('./src/routes/banners.routes')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors()) // Allow all origins for easier deployment
app.use(express.json())

// Routes
app.get('/', (req, res) => {
  res.send('El Marinero Loco API is running! 🦞');
});
app.use('/api/auth', authRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/banners', bannersRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'El Marinero Loco API', version: '1.0.0' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🦞 El Marinero Loco API corriendo en http://localhost:${PORT}`)
})
