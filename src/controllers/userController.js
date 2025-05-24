// src/controllers/userController.js
import { User } from '../models/User.js'
import bcrypt from 'bcrypt'

export function showSignIn(req, res) {
  res.render('login', { error: null })
}

export function showSignUp(req, res) {
  res.render('register', { error: null })
}

export async function register(req, res) {
  const { email, name, password } = req.body
  try {
    const existing = await User.findOne({ email })
    if (existing) return res.render('register', { error: 'E-post används redan.' })

    const hash = await bcrypt.hash(password, 12)
    const newUser = await User.create({ email, name, password: hash })

    req.session.user = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      profileImageUrl: newUser.profileImageUrl
    }

    res.redirect('/')
  } catch (err) {
    console.error(err)
    res.render('register', { error: 'Fel vid registrering.' })
  }
}

export async function login(req, res) {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return res.render('login', { error: 'Fel e-post eller lösenord.' })

    const match = await user.comparePassword(password)
    if (!match) return res.render('login', { error: 'Fel e-post eller lösenord.' })

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl
    }

    res.redirect('/')
  } catch (err) {
    console.error(err)
    res.render('login', { error: 'Fel vid inloggning.' })
  }
}

export function logout(req, res) {
  req.session.destroy(() => res.redirect('/'))
}

export function manageAccount(req, res) {
  res.render('account', { user: req.session.user })
}

export function sayHello(req, res) {
  res.send(`Hej ${req.session.user?.name || 'gäst'}!`)
}
