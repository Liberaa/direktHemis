// src/routes/userRoutes.js
import express from 'express'
import multer from 'multer'
import {
  showSignIn,
  showSignUp,
  register,
  login,
  logout,
  manageAccount,
  sayHello
} from '../controllers/userController.js'
import { requireAuth } from '../middleware/authMiddleware.js'
import { User } from '../models/User.js'

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.get('/login', showSignIn)
router.post('/login', login)

router.get('/register', showSignUp)
router.post('/register', register)

router.post('/logout', logout)

router.get('/account', requireAuth, manageAccount)

router.post('/account/update', requireAuth, upload.single('profileImage'), async (req, res) => {
  const userId = req.session.user?.id
  const { name } = req.body
  const update = { name }

  if (req.file) {
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
    update.profileImageUrl = base64Image
  }

  try {
    const user = await User.findByIdAndUpdate(userId, update, { new: true })
    req.session.user.name = user.name
    req.session.user.profileImageUrl = user.profileImageUrl
    res.redirect('/users/account')
  } catch (err) {
    console.error('Fel vid uppdatering av konto:', err)
    res.status(500).send('Fel vid uppdatering')
  }
})

router.post('/delete', requireAuth, async (req, res) => {
  const userId = req.session.user?.id
  try {
    await User.findByIdAndDelete(userId)
    req.session.destroy(() => res.redirect('/'))
  } catch (err) {
    console.error('Fel vid borttagning av konto:', err)
    res.status(500).send('Fel vid borttagning')
  }
})

router.get('/hello', requireAuth, sayHello)

export default router
