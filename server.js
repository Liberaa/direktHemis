// server.js
import 'dotenv/config'
import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import { clerkMiddleware } from '@clerk/express'
import cookieParser from 'cookie-parser'
import methodOverride from 'method-override'
import http from 'http'
import { Server } from 'socket.io'
import userRoutes from './src/routes/userRoutes.js'
import houseRoutes from './src/routes/houseRoutes.js'
//import messageRoutes from './src/routes/messageRoutes.js'
import { getHomePage } from './src/controllers/homeController.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const server = http.createServer(app)
const io = new Server(server)

// Middleware
app.use(methodOverride('_method'))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(clerkMiddleware({
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
  jwtKey: process.env.CLERK_JWT_KEY,
  frontendApi: 'https://stunning-ostrich-51.clerk.accounts.dev',
  cookieOptions: {
    maxAge: 90 * 24 * 60 * 60,
    sameSite: 'lax',
    secure: true,
    path: '/',
    httpOnly: true
  }
}))


// EJS setup
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src', 'views'))



// Routes
app.get('/', getHomePage)
app.get('/howyousell', (req, res) => res.render('howYouSell'))
app.get('/detaljer', (req, res) => res.render('detaljer'))

app.use('/users', userRoutes)
app.use('/house', houseRoutes)
//app.use('/messages', messageRoutes)


// Start function = test folder
async function startServer () {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log(' MongoDB connected')

const PORT = process.env.PORT || 3001
const HOST = '0.0.0.0' // Allow external access

server.listen(PORT, HOST, () => {
  console.log(` Server running at http://${HOST}:${PORT}`)
})

  } catch (err) {
    console.error(' MongoDB connection error:', err)
    process.exit(1)
  }
}

export { app, startServer }
//For jest test
if (process.env.NODE_ENV !== 'test') {
  startServer()
}
