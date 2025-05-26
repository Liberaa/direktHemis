// server.js
import 'dotenv/config'
import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import methodOverride from 'method-override'

import userRoutes from './src/routes/userRoutes.js'
import houseRoutes from './src/routes/houseRoutes.js'
import imageRoutes from './src/routes/imageRoutes.js'
import { getHomePage } from './src/controllers/homeController.js'
import { injectUser } from './src/middleware/authMiddleware.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

// Middleware
app.use(methodOverride('_method'))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: process.env.SESSION_SECRET || 'changeme',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true }
}))

app.use(injectUser)

// EJS setup
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src', 'views'))

// Routes
app.get('/', getHomePage)
app.use('/users', userRoutes)
app.use('/house', houseRoutes)
app.use('/images', imageRoutes)

// Static content pages
app.get('/howyousell', (req, res) => {
  res.render('howYouSell')
})

app.get('/detaljer', (req, res) => {
  res.render('detaljer')
})


// Start server
async function startServer () {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('✅ MongoDB connected')

    const PORT = process.env.PORT || 3001
    const HOST = '0.0.0.0'

    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running at http://${HOST}:${PORT}`)
    })

  } catch (err) {
    console.error('❌ MongoDB connection error:', err)
    process.exit(1)
  }
}

export { app, startServer }

if (process.env.NODE_ENV !== 'test') {
  startServer()
}
