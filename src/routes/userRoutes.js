// src/routes/userRoutes.js
import express from 'express'
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

const router = express.Router()

router.get('/login', showSignIn)
router.post('/login', login)

router.get('/register', showSignUp)
router.post('/register', register)

router.post('/logout', logout)

router.get('/account', requireAuth, manageAccount)
router.get('/hello', requireAuth, sayHello)

export default router
