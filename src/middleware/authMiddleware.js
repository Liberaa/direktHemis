// src/middleware/authMiddleware.js

export function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user
    return next()
  }
  res.redirect('/users/login')
}

export function injectUser(req, res, next) {
  res.locals.user = req.session?.user || null
  next()
}
