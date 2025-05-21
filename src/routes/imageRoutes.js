import express from 'express'
import multer from 'multer'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { clerkAuth } from '../middleware/clerkAuth.js'
import { uploadImage, showUserImages, showAllImages, deleteImage, editImage, getImageData } from '../controllers/imageController.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Use multer memoryStorage for storing images in MongoDB
const storage = multer.memoryStorage()
const upload = multer({ storage })

const router = express.Router()

// POST upload image
router.post('/upload', clerkAuth, upload.single('houseImage'), uploadImage)
// GET images for the logged in user
router.get('/', clerkAuth, showUserImages)
// GET all images (public view)
router.get('/all', clerkAuth, showAllImages)
// DELETE image
router.delete('/:id', clerkAuth, deleteImage)
// POST update image description
router.post('/:id/edit', clerkAuth, editImage)
// GET image binary data
router.get('/image/:id', getImageData)

export default router
