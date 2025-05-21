import express from 'express'
import multer from 'multer'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import {
  getNewHouseForm,
  postNewHouseForm,
  getHouseList,
  getEditHouseForm,
  postEditHouseForm,
  deleteHouse,
  getHouseImage,
  getHouseDetail,
  getHouseImageByIndex
} from '../controllers/houseController.js'
import { clerkAuth } from '../middleware/clerkAuth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Use multer's memoryStorage to store image data in MongoDB
const storage = multer.memoryStorage()
const upload = multer({ storage })

const router = express.Router()

// GET form to create new house listing
router.get('/ny', clerkAuth, getNewHouseForm)
// POST new house listing with up to 10 images
router.post('/ny', clerkAuth, upload.array('houseImages', 10), postNewHouseForm);
// List all houses for the logged in user
//router.get('/lista', clerkAuth, getHouseList)
// GET form to edit a house listing
router.get('/redigera/:id', clerkAuth, getEditHouseForm);
// POST updated house listing with up to 10 images
router.post('/redigera/:id', clerkAuth, upload.array('houseImages', 10), postEditHouseForm);
// DELETE a house listing
router.delete('/:id', clerkAuth, deleteHouse)
// GET legacy single-image (optional to keep for backward compatibility)
router.get('/image/:id', getHouseImage)
// GET image by index for multi-image support
router.get('/image/:id/:index', getHouseImageByIndex)
// GET house details
router.get('/:id', getHouseDetail)

export default router
