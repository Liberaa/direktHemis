// clerkAuth.js - Wrapper för Clerk's requireAuth middleware
import { requireAuth } from '@clerk/express'

export function clerkAuth (req, res, next) {
  return requireAuth()(req, res, next)
}
