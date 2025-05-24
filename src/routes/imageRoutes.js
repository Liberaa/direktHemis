// src/routes/imageRoutes.js
import express from 'express'
import multer from 'multer'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { requireAuth } from '../middleware/authMiddleware.js'
import { uploadImage, getImageData } from '../controllers/imageController.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const storage = multer.memoryStorage()
const upload = multer({ storage })

const router = express.Router()

// POST upload image – only for logged in users
router.post('/upload', requireAuth, upload.single('houseImage'), uploadImage)
// GET image binary data
router.get('/image/:id', getImageData)

export default router
