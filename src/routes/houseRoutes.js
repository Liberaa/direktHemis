// src/routes/houseRoutes.js
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
  getHouseDetail,
  getHouseImageByIndex
} from '../controllers/houseController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const storage = multer.memoryStorage()
const upload = multer({ storage })

const router = express.Router()

// 🔒 Must go before any dynamic `/:id` routes
router.get('/lista', requireAuth, getHouseList)

router.get('/ny', requireAuth, getNewHouseForm)
router.post('/ny', requireAuth, upload.array('houseImages', 10), postNewHouseForm)

router.get('/redigera/:id', requireAuth, getEditHouseForm)
router.post('/redigera/:id', requireAuth, upload.array('houseImages', 10), postEditHouseForm)

router.delete('/:id', requireAuth, deleteHouse)
router.get('/image/:id/:index', getHouseImageByIndex)

// LAST: generic route must go last
router.get('/:id', getHouseDetail)

export default router
