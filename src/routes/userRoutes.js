import express from 'express'
import { clerkAuth } from '../middleware/clerkAuth.js'
import { showSignIn, showSignUp, manageAccount, sayHello, logout } from '../controllers/userController.js'

const router = express.Router()

router.get('/login', showSignIn)
router.get('/register', showSignUp)
router.get('/account', clerkAuth, manageAccount)
router.get('/hello', clerkAuth, sayHello)
router.post('/logout', clerkAuth, logout)

export default router
